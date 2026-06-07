import { Restaurant, IRestaurant } from '../models/Restaurant.model.js';
import { User } from '../models/User.model.js';
import { ApiError } from '../utils/ApiError.js';
import { Types } from 'mongoose';

export const listPublic = async () => {
  return Restaurant.find({}).select('-__v').lean();
};

export const getById = async (id: string) => {
  const restaurant = await Restaurant.findById(id).lean();
  if (!restaurant) throw new ApiError(404, 'Restaurant not found');
  return restaurant;
};

export const create = async (ownerId: string, data: Partial<IRestaurant>) => {
  // Generate slug from name
  const slug = data.name!.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  // Check slug uniqueness
  const existing = await Restaurant.findOne({ slug });
  if (existing) throw new ApiError(409, 'Restaurant name already taken (slug conflict)');

  const restaurant = await Restaurant.create({
    ...data,
    ownerId,
    slug,
    isOpen: false,
    isProfileComplete: false,
  });

  return restaurant;
};

export const update = async (id: string, userId: string, role: string, data: Partial<IRestaurant>) => {
  const restaurant = await Restaurant.findById(id);
  if (!restaurant) throw new ApiError(404, 'Restaurant not found');

  // Authorization: only OWNER or DEPUTY_MANAGER can update
  if (role === 'OWNER' && restaurant.ownerId.toString() !== userId) {
    throw new ApiError(403, 'Not your restaurant');
  }

  Object.assign(restaurant, data);
  await restaurant.save();
  return restaurant;
};

export const updateHours = async (id: string, userId: string, role: string, openingHours: any[]) => {
  const restaurant = await Restaurant.findById(id);
  if (!restaurant) throw new ApiError(404, 'Restaurant not found');

  if (role === 'OWNER' && restaurant.ownerId.toString() !== userId) {
    throw new ApiError(403, 'Not your restaurant');
  }

  restaurant.openingHours = openingHours;
  await restaurant.save();
  return restaurant;
};

export const toggleOpen = async (id: string, userId: string, role: string) => {
  const restaurant = await Restaurant.findById(id);
  if (!restaurant) throw new ApiError(404, 'Restaurant not found');

  if (role === 'OWNER' && restaurant.ownerId.toString() !== userId) {
    throw new ApiError(403, 'Not your restaurant');
  }

  restaurant.isOpen = !restaurant.isOpen;
  await restaurant.save();
  return restaurant;
};

export const remove = async (id: string, userId: string) => {
  const restaurant = await Restaurant.findById(id);
  if (!restaurant) throw new ApiError(404, 'Restaurant not found');

  if (restaurant.ownerId.toString() !== userId) {
    throw new ApiError(403, 'Only owner can delete a restaurant');
  }

  await restaurant.deleteOne();
  return { deleted: true };
};

export const getStaff = async (restaurantId: string) => {
  return User.find({ restaurantId: new Types.ObjectId(restaurantId) })
    .select('-password -refreshToken')
    .lean();
};
