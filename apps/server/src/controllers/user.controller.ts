import { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AuthRequest } from '../middleware/authenticate.js';
import * as svc from '../services/user.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = await svc.getProfile(req.user!._id);
  res.json(ApiResponse(200, 'User profile', data));
});
export const updateMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = await svc.updateProfile(req.user!._id, req.body);
  res.json(ApiResponse(200, 'Profile updated', data));
});
export const addAddress = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = await svc.addAddress(req.user!._id, req.body);
  res.json(ApiResponse(200, 'Address added', data));
});
export const toggleFavourite = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = await svc.toggleFavourite(req.user!._id, req.params.restaurantId as string);
  res.json(ApiResponse(200, 'Favourite toggled', data));
});
export const getClientOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = await svc.getClientOrders(req.user!._id);
  res.json(ApiResponse(200, 'Orders fetched', data));
});
