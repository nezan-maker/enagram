import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  role: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  isPasswordSet: boolean;
  staffId?: string;
  restaurantId?: Types.ObjectId;
  refreshToken?: string;
  savedAddresses?: IAddress[];
  favouriteRestaurants?: Types.ObjectId[];
  loyaltyPoints?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAddress {
  label: string;
  street: string;
  city: string;
  coordinates?: { lat: number; lng: number };
}

const addressSchema = new Schema<IAddress>({
  label: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  coordinates: {
    lat: Number,
    lng: Number,
  },
}, { _id: false });

const userSchema = new Schema<IUser>({
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

export const User = mongoose.model<IUser>('User', userSchema);
