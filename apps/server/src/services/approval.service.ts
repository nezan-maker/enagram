import { ApprovalRequest } from '../models/ApprovalRequest.model.js';
import { ApiError } from '../utils/ApiError.js';

const APPROVER_MAP: Record<string, string> = {
  STAFF_TERMINATION: 'DEPUTY_MANAGER',
  BUDGET_EXPENDITURE: 'DEPUTY_MANAGER', // Over threshold → OWNER (checked at creation time)
  MENU_CHANGE: 'KITCHEN_MANAGER',
  POLICY_CHANGE: 'DEPUTY_MANAGER',
  BULK_ENROLLMENT: 'DEPUTY_MANAGER',
  RESTAURANT_CLOSURE: 'OWNER',
};

export const create = async (data: any) => {
  const approverRole = APPROVER_MAP[data.type] || 'DEPUTY_MANAGER';
  return ApprovalRequest.create({ ...data, approverRole, status: 'PENDING' });
};
export const list = async () => ApprovalRequest.find({ status: 'PENDING' }).sort({ createdAt: -1 }).lean();
export const resolve = async (id: string, status: string, notes?: string) => {
  const approval = await ApprovalRequest.findByIdAndUpdate(id, { status, notes, resolvedAt: new Date() }, { new: true });
  if (!approval) throw new ApiError(404, 'Approval request not found');
  return approval;
};
