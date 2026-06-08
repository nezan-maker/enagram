import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IOrderItem extends Document {
  menuItemId: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
  status: 'PENDING' | 'PREPARING' | 'READY';
}

export const orderItemSchema = new Schema<IOrderItem>({
  menuItemId: { type: Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  notes: String,
  status: { type: String, enum: ['PENDING', 'PREPARING', 'READY'], default: 'PENDING' },
}, { _id: false });

export const OrderItem = mongoose.model<IOrderItem>('OrderItem', orderItemSchema);
