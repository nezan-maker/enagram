import { Report } from '../models/Report.model.js';
import { Types } from 'mongoose';

export const create = async (data: any) => Report.create(data);
export const list = async (restaurantId: string) => Report.find({ restaurantId: new Types.ObjectId(restaurantId) }).sort({ createdAt: -1 }).lean();
export const dashboard = async (restaurantId: string) => {
  const reports = await Report.find({ restaurantId: new Types.ObjectId(restaurantId) }).sort({ createdAt: -1 }).limit(10).lean();
  return { recentReports: reports };
};
export const financial = async (restaurantId: string) => {
  return Report.find({ restaurantId: new Types.ObjectId(restaurantId), type: 'FINANCIAL' }).sort({ createdAt: -1 }).lean();
};
