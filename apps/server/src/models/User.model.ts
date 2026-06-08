import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from '../types/user.types';

export interface IUserDocument extends IUser, Document {}

const addressSchema = new Schema({
  label: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  coordinates: {
    lat: Number,
    lng: Number,
  },
}, { _id: false });

const userSchema = new Schema<IUserDocument>({
  email: { type: String, sparse: true, unique: true },
  password: { type: String, required: false },
  role: { type: String, required: true, enum: ['OWNER', 'DEPUTY_MANAGER', 'HR_MANAGER', 'FINANCE_MANAGER', 'KITCHEN_MANAGER', 'CHEF', 'WAITER', 'CLIENT'] },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: String,
  avatar: String,
  isActive: { type: Boolean, default: true },
  isPasswordSet: { type: Boolean, default: true },
  staffId: { type: String, sparse: true, unique: true },
  restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant' },
  refreshToken: String,
  savedAddresses: [addressSchema],
  favouriteRestaurants: [{ type: Schema.Types.ObjectId, ref: 'Restaurant' }],
  loyaltyPoints: { type: Number, default: 0 },
}, { timestamps: true });

userSchema.index({ restaurantId: 1, role: 1 });

export const User = mongoose.model<IUser>('User', userSchema);
