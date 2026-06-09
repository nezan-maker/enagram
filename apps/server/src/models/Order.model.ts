import mongoose, { Schema, Document, Types } from 'mongoose';
import { IOrderItem, orderItemSchema } from './OrderItem.model.js';

export interface IOrder extends Document {
  restaurantId: Types.ObjectId;
  clientId?: Types.ObjectId;
  waiterId?: Types.ObjectId;
  tableId?: Types.ObjectId;
  type: 'DINE_IN' | 'DELIVERY';
  status: string;
  items: IOrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod?: 'IN_APP' | 'CASH' | 'CARD';
  paymentStatus: 'PENDING' | 'PAID';
  deliveryAddress?: any;
  estimatedReadyAt?: Date;
  notes?: string;
  statusHistory: IStatusEvent[];
  createdAt: Date;
  updatedAt: Date;
}

interface IStatusEvent {
  status: string;
  changedBy: Types.ObjectId;
  changedAt: Date;
  note?: string;
}

const statusEventSchema = new Schema<IStatusEvent>({
  status: { type: String, required: true },
  changedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  changedAt: { type: Date, default: Date.now },
  note: String,
}, { _id: false });

const orderSchema = new Schema<IOrder>({
  restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  clientId: { type: Schema.Types.ObjectId, ref: 'User' },
  waiterId: { type: Schema.Types.ObjectId, ref: 'User' },
  tableId: { type: Schema.Types.ObjectId, ref: 'Table' },
  type: { type: String, enum: ['DINE_IN', 'DELIVERY'], required: true },
  status: { type: String, enum: ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'COMPLETED', 'CANCELLED'], default: 'PENDING' },
  items: [orderItemSchema],
  subtotal: { type: Number, required: true },
  tax: { type: Number, required: true },
  total: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['IN_APP', 'CASH', 'CARD'] },
  paymentStatus: { type: String, enum: ['PENDING', 'PAID'], default: 'PENDING' },
  deliveryAddress: Schema.Types.Mixed,
  estimatedReadyAt: Date,
  notes: String,
  statusHistory: [statusEventSchema],
}, { timestamps: true });

orderSchema.index({ restaurantId: 1, status: 1 });
orderSchema.index({ clientId: 1 });
orderSchema.index({ waiterId: 1 });

export const Order = mongoose.model<IOrder>('Order', orderSchema);
