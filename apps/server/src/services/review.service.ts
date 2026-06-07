import { Review } from '../models/Review.model.js';
import { Restaurant } from '../models/Restaurant.model.js';
import { ApiError } from '../utils/ApiError.js';
import { Types } from 'mongoose';

export const create = async (data: any) => {
  const review = await Review.create(data);
  // Denormalise rating (Section 6 — Rating Denormalisation)
  const agg = await Review.aggregate([
    { $match: { restaurantId: review.restaurantId } },
    { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  if (agg.length > 0) {
    await Restaurant.findByIdAndUpdate(review.restaurantId, {
      averageRating: Math.round(agg[0].avg * 10) / 10,
      reviewCount: agg[0].count,
    });
  }
  return review;
};
export const list = async (restaurantId: string) =>
  Review.find({ restaurantId: new Types.ObjectId(restaurantId) }).sort({ createdAt: -1 }).lean();
export const remove = async (id: string, userId: string) => {
  const review = await Review.findOneAndDelete({ _id: id, clientId: userId });
  if (!review) throw new ApiError(404, 'Review not found or not yours');
  return review;
};
