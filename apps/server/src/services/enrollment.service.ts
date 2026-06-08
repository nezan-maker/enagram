import { User } from '../models/User.model.js';
import { ApprovalRequest } from '../models/ApprovalRequest.model.js';
import { generateStaffId } from '../utils/generateStaffId.js';
import { ApiError } from '../utils/ApiError.js';
import { Types } from 'mongoose';

const ASSIGNABLE_ROLES: Record<string, string[]> = {
  OWNER: ['DEPUTY_MANAGER'],
  DEPUTY_MANAGER: ['HR_MANAGER', 'FINANCE_MANAGER', 'KITCHEN_MANAGER'],
  HR_MANAGER: ['CHEF', 'WAITER'],
};

interface CreateStaffInput {
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
  email?: string;
}

interface EnrollmentResult {
  created: any[];
  failed: { row: number; reason: string }[];
}

export const createStaffMember = async (data: CreateStaffInput, restaurantId: string): Promise<{ user: any; staffId: string }> => {
  const staffId = generateStaffId(data.role);

  const user = await User.create({
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone,
    email: data.email,
    role: data.role,
    staffId,
    password: '', // Empty until first login
    isPasswordSet: false,
    isActive: true,
    restaurantId: new Types.ObjectId(restaurantId),
  });

  return { user, staffId };
};

export const processBulkEnrollment = async (
  rows: CreateStaffInput[],
  restaurantId: string,
  uploadedBy: string,
  creatorRole: string
): Promise<EnrollmentResult> => {
  const BULK_APPROVAL_THRESHOLD = 10;
  const created: any[] = [];
  const failed: { row: number; reason: string }[] = [];

  // If over threshold, create approval request instead of creating directly
  if (rows.length > BULK_APPROVAL_THRESHOLD) {
    await ApprovalRequest.create({
      restaurantId: new Types.ObjectId(restaurantId),
      requestedBy: new Types.ObjectId(uploadedBy),
      approverRole: 'DEPUTY_MANAGER',
      type: 'BULK_ENROLLMENT',
      payload: { rows, count: rows.length },
      status: 'PENDING',
    });

    return {
      created: [],
      failed: [{ row: 0, reason: `Bulk enrollment of ${rows.length} users exceeds threshold (${BULK_APPROVAL_THRESHOLD}). Approval request created for Deputy Manager.` }],
    };
  }

  // Under threshold — create directly
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    // Check if role is assignable by creator
    const allowed = ASSIGNABLE_ROLES[creatorRole] || [];
    if (!allowed.includes(row.role)) {
      failed.push({ row: i + 1, reason: `Role '${row.role}' not assignable by ${creatorRole}` });
      continue;
    }

    try {
      const result = await createStaffMember(row, restaurantId);
      created.push(result);
    } catch (err: any) {
      failed.push({ row: i + 1, reason: err.message || 'Unknown error' });
    }
  }

  return { created, failed };
};

export const listStaff = async (restaurantId: string) => {
  return User.find({ restaurantId: new Types.ObjectId(restaurantId) })
    .select('-password -refreshToken')
    .lean();
};

export const getStaffDetail = async (restaurantId: string, userId: string) => {
  const user = await User.findOne({ _id: userId, restaurantId: new Types.ObjectId(restaurantId) })
    .select('-password -refreshToken');
  if (!user) throw new ApiError(404, 'Staff member not found');
  return user;
};

export const updateStaff = async (restaurantId: string, userId: string, data: Partial<CreateStaffInput>) => {
  const user = await User.findOne({ _id: userId, restaurantId: new Types.ObjectId(restaurantId) });
  if (!user) throw new ApiError(404, 'Staff member not found');

  Object.assign(user, data);
  await user.save();
  return user;
};

export const requestDeactivation = async (restaurantId: string, userId: string, requestedBy: string) => {
  const user = await User.findOne({ _id: userId, restaurantId: new Types.ObjectId(restaurantId) });
  if (!user) throw new ApiError(404, 'Staff member not found');
  const approval = await ApprovalRequest.create({
    restaurantId: new Types.ObjectId(restaurantId),
    requestedBy: new Types.ObjectId(requestedBy),
    approverRole: 'DEPUTY_MANAGER',
    type: 'STAFF_TERMINATION',
    payload: { userId, firstName: user.firstName, lastName: user.lastName, role: user.role },
    status: 'PENDING',
  });
  return { message: 'Deactivation requires approval. Request submitted to Deputy Manager.', approval };
};

// Called only from approval.service.resolve() when STAFF_TERMINATION is APPROVED
export const executeDeactivation = async (restaurantId: string, userId: string) => {
  const user = await User.findOne({ _id: userId, restaurantId: new Types.ObjectId(restaurantId) });
  if (!user) throw new ApiError(404, 'Staff member not found');
  user.isActive = false;
  await user.save();
  return user;
};

export const getStaffId = async (restaurantId: string, userId: string) => {
  const user = await User.findOne({ _id: userId, restaurantId: new Types.ObjectId(restaurantId) })
    .select('staffId');
  if (!user) throw new ApiError(404, 'Staff member not found');
  return { staffId: user.staffId };
};
