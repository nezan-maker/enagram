import mongoose, { Schema, Document } from 'mongoose';
import { IMenu } from '../types/menu.types';

export interface IMenuDocument extends IMenu, Document {}

const menuSchema = new Schema<IMenuDocument>({
  restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  name: { type: String, required: true },
  description: String,
  isActive: { type: Boolean, default: true },
  templateSource: { type: Schema.Types.ObjectId, ref: 'Menu' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export const Menu = mongoose.model<IMenu>('Menu', menuSchema);
