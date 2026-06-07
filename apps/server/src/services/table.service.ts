import { Table } from '../models/Table.model.js';
import { Reservation } from '../models/Reservation.model.js';
import { Review } from '../models/Review.model.js';
import { Restaurant } from '../models/Restaurant.model.js';
import { ApiError } from '../utils/ApiError.js';
import { Types } from 'mongoose';

// ===== Tables =====
export const listTables = async (restaurantId: string) => Table.find({ restaurantId: new Types.ObjectId(restaurantId) }).lean();
export const addTable = async (restaurantId: string, data: any) => Table.create({ ...data, restaurantId: new Types.ObjectId(restaurantId) });
export const updateTable = async (restaurantId: string, tableId: string, data: any) => {
  const t = await Table.findOne({ _id: tableId, restaurantId: new Types.ObjectId(restaurantId) });
  if (!t) throw new ApiError(404, 'Table not found');
  Object.assign(t, data); await t.save(); return t;
};
export const removeTable = async (restaurantId: string, tableId: string) => {
  const r = await Table.deleteOne({ _id: tableId, restaurantId: new Types.ObjectId(restaurantId) });
  if (!r.deletedCount) throw new ApiError(404, 'Table not found');
  return { deleted: true };
};

// ===== Reservations =====
export const createReservation = async (data: any) => Reservation.create({ ...data, status: 'PENDING' });
export const listReservations = async (restaurantId: string) => Reservation.find({ restaurantId: new Types.ObjectId(restaurantId) }).lean();
export const updateReservation = async (id: string, data: any) => {
  const r = await Reservation.findByIdAndUpdate(id, data, { new: true });
  if (!r) throw new ApiError(404, 'Reservation not found');
  return r;
};
export const cancelReservation = async (id: string) => {
  const r = await Reservation.findByIdAndUpdate(id, { status: 'CANCELLED' }, { new: true });
  if (!r) throw new ApiError(404, 'Reservation not found');
  return r;
};

// ===== Reviews (with rating denormalization — Section 6) =====
export const createReview = async (restaurantId: string, clientId: string, rating: number, comment?: string) => {
  const review = await Review.create({ restaurantId: new Types.ObjectId(restaurantId), clientId: new Types.ObjectId(clientId), rating, comment });

  // Denormalize: recalculate averageRating and reviewCount on Restaurant
  const stats = await Review.aggregate([
    { $match: { restaurantId: new Types.ObjectId(restaurantId) } },
    { $group: { _id: '$restaurantId', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);

  if (stats.length) {
    await Restaurant.findByIdAndUpdate(restaurantId, {
      averageRating: Math.round(stats[0].avgRating * 10) / 10,
      reviewCount: stats[0].count,
    });
  }

  return review;
};
export const listReviews = async (restaurantId: string) => Review.find({ restaurantId: new Types.ObjectId(restaurantId) }).populate('clientId', 'firstName lastName').lean();
export const deleteReview = async (reviewId: string, clientId: string) => {
  const r = await Review.findOneAndDelete({ _id: reviewId, clientId: new Types.ObjectId(clientId) });
  if (!r) throw new ApiError(404, 'Review not found or not yours');
  return { deleted: true };
};
