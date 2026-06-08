import { ApprovalRequest } from '../models/ApprovalRequest.model.js';
import { User } from '../models/User.model.js';
import { Notification } from '../models/Notification.model.js';
import { ApiError } from '../utils/ApiError.js';
import { Types } from 'mongoose';

const APPROVER_MAP: Record<string, string> = {
  STAFF_TERMINATION: 'DEPUTY_MANAGER',
  BUDGET_EXPENDITURE: 'DEPUTY_MANAGER', // Over threshold → OWNER (checked at creation time)
  MENU_CHANGE: 'KITCHEN_MANAGER',
  POLICY_CHANGE: 'DEPUTY_MANAGER',
  BULK_ENROLLMENT: 'DEPUTY_MANAGER',
  RESTAURANT_CLOSURE: 'OWNER',
};

// Escalation chain: if the primary approver role has no user in the restaurant, escalate up
const ESCALATION_CHAIN: Record<string, string> = {
  KITCHEN_MANAGER: 'DEPUTY_MANAGER',
  DEPUTY_MANAGER: 'OWNER',
};

const BUDGET_THRESHOLD = 1000;

const resolveApprover = async (
  restaurantId: Types.ObjectId,
  approverRole: string
): Promise<{ approverRole: string; approverId?: Types.ObjectId }> => {
  // Find a user with the approver role in the same restaurant
  let currentRole = approverRole;
  const visited = new Set<string>();

  while (currentRole && !visited.has(currentRole)) {
    visited.add(currentRole);
    const approver = await User.findOne({ restaurantId, role: currentRole, isActive: true }).select('_id');
    if (approver) {
      return { approverRole: currentRole, approverId: approver._id };
    }
    // Escalate
    currentRole = ESCALATION_CHAIN[currentRole];
  }

  // Fallback: no approver found in chain
  return { approverRole: approverRole };
};

export const create = async (data: any) => {
  let approverRole = APPROVER_MAP[data.type] || 'DEPUTY_MANAGER';

  // Budget threshold escalation
  if (data.type === 'BUDGET_EXPENDITURE' && data.payload?.amount > BUDGET_THRESHOLD) {
    approverRole = 'OWNER';
  }

  const { approverId } = await resolveApprover(
    new Types.ObjectId(data.restaurantId),
    approverRole
  );

  const approval = await ApprovalRequest.create({
    ...data,
    approverRole,
    approverId,
    status: 'PENDING',
  });

  // Create in-app notification for the assigned approver
  if (approverId) {
    await Notification.create({
      recipientId: approverId,
      type: 'APPROVAL_REQUEST',
      title: `New approval request: ${data.type}`,
      body: `A ${data.type} request requires your review.`,
      link: `/staff/deputy/approvals`,
    });
  }

  return approval;
};

export const list = async (restaurantId?: string) => {
  const filter: any = { status: 'PENDING' };
  if (restaurantId) filter.restaurantId = new Types.ObjectId(restaurantId);
  return ApprovalRequest.find(filter).sort({ createdAt: -1 }).lean();
};

export const resolve = async (id: string, status: string, notes?: string) => {
  const approval = await ApprovalRequest.findByIdAndUpdate(
    id,
    { status, notes, resolvedAt: new Date() },
    { new: true }
  );
  if (!approval) throw new ApiError(404, 'Approval request not found');

  // If this is a STAFF_TERMINATION that was approved, execute the deactivation
  if (approval.type === 'STAFF_TERMINATION' && status === 'APPROVED') {
    const { executeDeactivation } = await import('../services/enrollment.service.js');
    const userId = (approval.payload as any)?.userId;
    if (userId) {
      await executeDeactivation(approval.restaurantId.toString(), userId);
    }
  }

  // Notify the requester
  await Notification.create({
    recipientId: approval.requestedBy,
    type: 'APPROVAL_RESOLVED',
    title: `Approval ${status}`,
    body: `Your ${approval.type} request has been ${status.toLowerCase()}.${notes ? ` Notes: ${notes}` : ''}`,
  });

  return approval;
};
