import { Types } from 'mongoose';

export interface IAddress {
  label: string;
  street: string;
  city: string;
  coordinates?: { lat: number; lng: number };
}

export interface IUser {
  _id: Types.ObjectId;
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
