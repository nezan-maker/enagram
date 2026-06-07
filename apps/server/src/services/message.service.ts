import { Message } from '../models/Message.model.js';
import { Types } from 'mongoose';

export const getConversation = async (userId1: string, userId2: string) => {
  return Message.find({
    $or: [
      { senderId: userId1, recipientId: userId2 },
      { senderId: userId2, recipientId: userId1 },
    ],
  }).sort({ createdAt: 1 }).lean();
};
export const listConversations = async (userId: string) => {
  return Message.aggregate([
    { $match: { $or: [{ senderId: new Types.ObjectId(userId) }, { recipientId: new Types.ObjectId(userId) }] } },
    { $sort: { createdAt: -1 } },
    { $group: { _id: { $cond: [{ $eq: ['$senderId', new Types.ObjectId(userId)] }, '$recipientId', '$senderId'] }, lastMessage: { $first: '$$ROOT' } } },
    { $sort: { 'lastMessage.createdAt': -1 } },
  ]);
};
export const markRead = async (userId: string, otherUserId: string) => {
  return Message.updateMany({ senderId: new Types.ObjectId(otherUserId), recipientId: new Types.ObjectId(userId), isRead: false }, { isRead: true });
};
