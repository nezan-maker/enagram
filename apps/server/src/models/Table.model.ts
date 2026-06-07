import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ITable extends Document {
  restaurantId: Types.ObjectId;
  tableNumber: string;
  capacity: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED';
  currentOrderId?: Types.ObjectId;
  qrCode?: string;
  createdAt: Date;
}

const tableSchema = new Schema<ITable>({
  restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  tableNumber: { type: String, required: true },
  capacity: { type: Number, required: true },
  status: { type: String, enum: ['AVAILABLE', 'OCCUPIED', 'RESERVED'], default: 'AVAILABLE' },
  currentOrderId: { type: Schema.Types.ObjectId, ref: 'Order' },
  qrCode: String,
}, { timestamps: true });

export const Table = mongoose.model<ITable>('Table', tableSchema);
