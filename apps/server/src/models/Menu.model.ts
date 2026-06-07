import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IMenu extends Document {
  restaurantId: Types.ObjectId;
  name: string;
  description?: string;
  isActive: boolean;
  templateSource?: Types.ObjectId;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const menuSchema = new Schema<IMenu>({
  restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  name: { type: String, required: true },
  description: String,
  isActive: { type: Boolean, default: true },
  templateSource: { type: Schema.Types.ObjectId, ref: 'Menu' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export const Menu = mongoose.model<IMenu>('Menu', menuSchema);
