import mongoose, { Types } from 'mongoose';
import { Review } from '../models/Review.model.js';
import { Restaurant } from '../models/Restaurant.model.js';
import { ApiError } from '../utils/ApiError.js';

const recalculateRating = async (restaurantId: Types.ObjectId, session?: mongoose.ClientSession) => {
  const agg = await Review.aggregate([
    { $match: { restaurantId } },
    { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]).session(session ?? null);
  const update: any = {
    averageRating: agg.length ? Math.round(agg[0].avg * 10) / 10 : 0,
    reviewCount: agg.length ? agg[0].count : 0,
  };
  if (session) {
    await Restaurant.findByIdAndUpdate(restaurantId, update, { session });
  } else {
    await Restaurant.findByIdAndUpdate(restaurantId, update);
  }
};

export const create = async (data: any) => {
  let session: mongoose.ClientSession | null = null;
  try {
    session = await mongoose.startSession();
    session.startTransaction();
    const [review] = await Review.create([data], { session });
    await recalculateRating(review.restaurantId, session);
    await session.commitTransaction();
    return review;
  } catch {
    if (session) {
      try { await session.abortTransaction(); } catch { /* noop */ }
      try { session.endSession(); } catch { /* noop */ }
    }
    const review = await Review.create(data);
    await recalculateRating(review.restaurantId);
    return review;
  } finally {
    if (session) {
      try { session.endSession(); } catch { /* noop */ }
    }
  }
};

export const list = async (restaurantId: string) =>
  Review.find({ restaurantId: new Types.ObjectId(restaurantId) }).sort({ createdAt: -1 }).lean();

export const remove = async (id: string, userId: string) => {
  let session: mongoose.ClientSession | null = null;
  try {
    session = await mongoose.startSession();
    session.startTransaction();
    const review = await Review.findOneAndDelete({ _id: id, clientId: userId }, { session }).session(session);
    if (!review) throw new ApiError(404, 'Review not found or not yours');
    await recalculateRating(review.restaurantId, session);
    await session.commitTransaction();
    return review;
  } catch {
    if (session) {
      try { await session.abortTransaction(); } catch { /* noop */ }
      try { session.endSession(); } catch { /* noop */ }
    }
    const review = await Review.findOneAndDelete({ _id: id, clientId: userId });
    if (!review) throw new ApiError(404, 'Review not found or not yours');
    await recalculateRating(review.restaurantId);
    return review;
  } finally {
    if (session) {
      try { session.endSession(); } catch { /* noop */ }
    }
  }
};
