import { Types } from 'mongoose';

export interface IMenu {
  _id: Types.ObjectId;
  restaurantId: Types.ObjectId;
  name: string;
  description?: string;
  isActive: boolean;
  templateSource?: Types.ObjectId;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMenuItem {
  _id: Types.ObjectId;
  menuId: Types.ObjectId;
  restaurantId: Types.ObjectId;
  name: string;
  description?: string;
  price: number;
  category: string;
  images?: string[];
  isAvailable: boolean;
  allergens?: string[];
  preparationTimeMinutes?: number;
  suggestedBy?: Types.ObjectId;
  approvedBy?: Types.ObjectId;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: Date;
  updatedAt: Date;
}
