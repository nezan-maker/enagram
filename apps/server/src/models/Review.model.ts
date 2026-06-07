import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IReview extends Document {
  restaurantId: Types.ObjectId;
  clientId: Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
}

const reviewSchema = new Schema<IReview>({
  restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  clientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: String,
}, { timestamps: true });

reviewSchema.index({ restaurantId: 1, clientId: 1 });

export const Review = mongoose.model<IReview>('Review', reviewSchema);
