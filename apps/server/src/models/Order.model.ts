import mongoose, { Schema, Document, Types } from 'mongoose';

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

export interface IOrderItem {
  menuItemId: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
  status: 'PENDING' | 'PREPARING' | 'READY';
}

interface IStatusEvent {
  status: string;
  changedBy: Types.ObjectId;
  changedAt: Date;
  note?: string;
}

const orderItemSchema = new Schema<IOrderItem>({
  menuItemId: { type: Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  notes: String,
  status: { type: String, enum: ['PENDING', 'PREPARING', 'READY'], default: 'PENDING' },
}, { _id: false });

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

export const Order = mongoose.model<IOrder>('Order', orderSchema);
