import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IMessage extends Document {
  restaurantId: Types.ObjectId;
  senderId: Types.ObjectId;
  recipientId: Types.ObjectId;
  content: string;
  isRead: boolean;
  createdAt: Date;
}

const messageSchema = new Schema<IMessage>({
  restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  recipientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  isRead: { type: Boolean, default: false },
}, { timestamps: true });

messageSchema.index({ restaurantId: 1, senderId: 1, recipientId: 1 });

export const Message = mongoose.model<IMessage>('Message', messageSchema);
