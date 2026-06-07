import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IReservation extends Document {
  restaurantId: Types.ObjectId;
  clientId: Types.ObjectId;
  tableId?: Types.ObjectId;
  partySize: number;
  reservedAt: Date;
  status: 'PENDING' | 'CONFIRMED' | 'SEATED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  createdAt: Date;
}

const reservationSchema = new Schema<IReservation>({
  restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  clientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  tableId: { type: Schema.Types.ObjectId, ref: 'Table' },
  partySize: { type: Number, required: true },
  reservedAt: { type: Date, required: true },
  status: { type: String, enum: ['PENDING', 'CONFIRMED', 'SEATED', 'COMPLETED', 'CANCELLED'], default: 'PENDING' },
  notes: String,
}, { timestamps: true });

export const Reservation = mongoose.model<IReservation>('Reservation', reservationSchema);
