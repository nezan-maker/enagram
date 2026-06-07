import { Notification } from '../models/Notification.model.js';
import { Types } from 'mongoose';

export const create = async (recipientId: string, type: string, title: string, body: string, link?: string) => {
  return Notification.create({ recipientId: new Types.ObjectId(recipientId), type, title, body, link });
};
export const list = async (recipientId: string) => {
  return Notification.find({ recipientId: new Types.ObjectId(recipientId) }).sort({ createdAt: -1 }).lean();
};
export const markRead = async (id: string) => {
  return Notification.findByIdAndUpdate(id, { isRead: true });
};
export const markAllRead = async (recipientId: string) => {
  return Notification.updateMany({ recipientId: new Types.ObjectId(recipientId) }, { isRead: true });
};
