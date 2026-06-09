import mongoose, { Schema, Document } from 'mongoose';
import { IRestaurant, IOpeningHours } from '../types/restaurant.js';
export type { IRestaurant };

export interface IRestaurantDocument extends IRestaurant, Document {}

const openingHoursSchema = new Schema<IOpeningHours>({
  day: { type: String, enum: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'], required: true },
  open: String,
  close: String,
  isClosed: { type: Boolean, default: false },
}, { _id: false });

const restaurantSchema = new Schema<IRestaurantDocument>({
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  cuisineType: [String],
  logo: String,
  coverImage: String,
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true },
    country: { type: String, required: true },
    coordinates: { lat: Number, lng: Number },
  },
  contact: {
    phone: { type: String, required: true },
    email: String,
    website: String,
  },
  openingHours: [openingHoursSchema],
  isOpen: { type: Boolean, default: false },
  isProfileComplete: { type: Boolean, default: false },
  averageRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
}, { timestamps: true });

restaurantSchema.pre('save', function () {
  if (!this.slug && this.name) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
});

restaurantSchema.index({ ownerId: 1 });
restaurantSchema.index({ slug: 1 }, { unique: true });

export const Restaurant = mongoose.model<IRestaurant>('Restaurant', restaurantSchema);
