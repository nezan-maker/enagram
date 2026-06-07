import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IMenuItem extends Document {
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

const menuItemSchema = new Schema<IMenuItem>({
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

export const MenuItem = mongoose.model<IMenuItem>('MenuItem', menuItemSchema);
