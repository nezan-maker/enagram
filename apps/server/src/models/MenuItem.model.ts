import mongoose, { Schema, Document } from 'mongoose';
import { IMenuItem } from '../types/menu.types';

export interface IMenuItemDocument extends IMenuItem, Document {}

const menuItemSchema = new Schema<IMenuItemDocument>({
  menuId: { type: Schema.Types.ObjectId, ref: 'Menu', required: true },
  restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: { type: String, required: true },
  images: [String],
  isAvailable: { type: Boolean, default: true },
  allergens: [String],
  preparationTimeMinutes: Number,
  suggestedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  approvalStatus: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'APPROVED' },
}, { timestamps: true });

menuItemSchema.index({ menuId: 1, approvalStatus: 1 });
menuItemSchema.index({ restaurantId: 1 });

export const MenuItem = mongoose.model<IMenuItem>('MenuItem', menuItemSchema);
