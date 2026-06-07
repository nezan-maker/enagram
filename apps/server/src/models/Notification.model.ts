import mongoose, { Schema, Document, Types } from 'mongoose';

export interface INotification extends Document {
  recipientId: Types.ObjectId;
  type: string;
  title: string;
  body: string;
  isRead: boolean;
  link?: string;
  emailSent: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>({
  recipientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  link: String,
  emailSent: { type: Boolean, default: false },
}, { timestamps: true });

notificationSchema.index({ recipientId: 1, isRead: 1 });

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);
