import mongoose, { Schema, Document } from 'mongoose';
import { IMenu } from '../types/menu.js';
export type { IMenu };

export interface IMenuDocument extends IMenu, Document {}

const menuSchema = new Schema({
  restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  name: { type: String, required: true },
  description: String,
  isActive: { type: Boolean, default: true },
  templateSource: { type: Schema.Types.ObjectId, ref: 'Menu' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export const Menu = mongoose.model<IMenuDocument>('Menu', menuSchema);
