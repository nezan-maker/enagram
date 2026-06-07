import { Issue } from '../models/Issue.model.js';
import { ApiError } from '../utils/ApiError.js';
import { Types } from 'mongoose';

export const create = async (data: any) => Issue.create(data);
export const list = async (restaurantId?: string) => {
  const filter: any = {};
  if (restaurantId) filter.restaurantId = new Types.ObjectId(restaurantId);
  return Issue.find(filter).sort({ createdAt: -1 }).lean();
};
export const listMine = async (userId: string) => Issue.find({ raisedBy: new Types.ObjectId(userId) }).lean();
export const getById = async (id: string) => {
  const issue = await Issue.findById(id).lean();
  if (!issue) throw new ApiError(404, 'Issue not found');
  return issue;
};
export const update = async (id: string, data: any) => {
  const issue = await Issue.findByIdAndUpdate(id, data, { new: true });
  if (!issue) throw new ApiError(404, 'Issue not found');
  return issue;
};
export const assign = async (id: string, assigneeId: string) => {
  const issue = await Issue.findByIdAndUpdate(id, { assignedTo: new Types.ObjectId(assigneeId), status: 'IN_PROGRESS' }, { new: true });
  if (!issue) throw new ApiError(404, 'Issue not found');
  return issue;
};
