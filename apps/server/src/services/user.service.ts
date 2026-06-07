import { User } from '../models/User.model.js';
import { ApiError } from '../utils/ApiError.js';

export const getProfile = async (userId: string) => {
  const user = await User.findById(userId).select('-password -refreshToken');
  if (!user) throw new ApiError(404, 'User not found');
  return user;
};

export const updateProfile = async (userId: string, data: Record<string, any>) => {
  const allowed = ['firstName', 'lastName', 'phone', 'avatar'];
  const updates: Record<string, any> = {};
  for (const k of allowed) if (data[k] !== undefined) updates[k] = data[k];
  const user = await User.findByIdAndUpdate(userId, { $set: updates }, { new: true }).select('-password -refreshToken');
  if (!user) throw new ApiError(404, 'User not found');
  return user;
};

export const addAddress = async (userId: string, address: any) => {
  return User.findByIdAndUpdate(userId, { $push: { savedAddresses: address } }, { new: true }).select('-password -refreshToken');
};

export const toggleFavourite = async (userId: string, restaurantId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');
  const idx = (user.favouriteRestaurants || []).findIndex(r => r.toString() === restaurantId);
  if (idx >= 0) user.favouriteRestaurants!.splice(idx, 1);
  else user.favouriteRestaurants!.push(restaurantId as any);
  await user.save();
  return user.favouriteRestaurants;
};

export const getClientOrders = async (userId: string) => {
  // Client order history — connects to order.service
  const { Order } = await import('../models/Order.model.js');
  return Order.find({ clientId: userId }).sort({ createdAt: -1 }).lean();
};
