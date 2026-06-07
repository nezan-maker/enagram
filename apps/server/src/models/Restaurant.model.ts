import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IRestaurant extends Document {
  ownerId: Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  cuisineType?: string[];
  logo?: string;
  coverImage?: string;
  address: { street: string; city: string; province: string; country: string; coordinates?: { lat: number; lng: number } };
  contact: { phone: string; email?: string; website?: string };
  openingHours?: IOpeningHours[];
  isOpen: boolean;
  isProfileComplete: boolean;
  averageRating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

interface IOpeningHours {
  day: string;
  open: string;
  close: string;
  isClosed: boolean;
}

const openingHoursSchema = new Schema<IOpeningHours>({
  day: { type: String, enum: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'], required: true },
  open: String,
  close: String,
  isClosed: { type: Boolean, default: false },
}, { _id: false });

const restaurantSchema = new Schema<IRestaurant>({
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

export const Restaurant = mongoose.model<IRestaurant>('Restaurant', restaurantSchema);
