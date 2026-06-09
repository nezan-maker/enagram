import { Types } from 'mongoose';

export interface IOpeningHours {
  day: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';
  open: string;
  close: string;
  isClosed: boolean;
}

export interface IRestaurant {
  _id: Types.ObjectId;
  ownerId: Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  cuisineType?: string[];
  logo?: string;
  coverImage?: string;
  address: {
    street: string;
    city: string;
    province: string;
    country: string;
    coordinates?: { lat: number; lng: number };
  };
  contact: {
    phone: string;
    email?: string;
    website?: string;
  };
  openingHours?: IOpeningHours[];
  isOpen: boolean;
  isProfileComplete: boolean;
  averageRating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}
