import { Reservation } from '../models/Reservation.model.js';
import { ApiError } from '../utils/ApiError.js';
import { Types } from 'mongoose';

export const create = async (data: any) => Reservation.create(data);
export const list = async (restaurantId: string) =>
  Reservation.find({ restaurantId: new Types.ObjectId(restaurantId) }).sort({ reservedAt: 1 }).lean();
export const updateStatus = async (id: string, status: string) => {
  const r = await Reservation.findByIdAndUpdate(id, { status }, { new: true });
  if (!r) throw new ApiError(404, 'Reservation not found');
  return r;
};
export const cancel = async (id: string, userId: string) => {
  const r = await Reservation.findOne({ _id: id, clientId: userId });
  if (!r) throw new ApiError(404, 'Reservation not found or not yours');
  r.status = 'CANCELLED';
  return r.save();
};
