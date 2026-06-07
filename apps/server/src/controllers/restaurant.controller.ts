import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AuthRequest } from '../middleware/authenticate.js';
import * as svc from '../services/restaurant.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

export const list = asyncHandler(async (_req: Request, res: Response) => {
  const data = await svc.listPublic();
  res.json(ApiResponse(200, 'Restaurants fetched', data));
});

export const getOne = asyncHandler(async (req: Request, res: Response) => {
  const data = await svc.getById(req.params.id as string);
  res.json(ApiResponse(200, 'Restaurant fetched', data));
});

export const create = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = await svc.create(req.user!._id, req.body);
  res.status(201).json(ApiResponse(201, 'Restaurant created', data));
});

export const update = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = await svc.update(req.params.id as string, req.user!._id, req.user!.role, req.body);
  res.json(ApiResponse(200, 'Restaurant updated', data));
});

export const updateHours = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = await svc.updateHours(req.params.id as string, req.user!._id, req.user!.role, req.body.openingHours);
  res.json(ApiResponse(200, 'Opening hours updated', data));
});

export const toggle = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = await svc.toggleOpen(req.params.id as string, req.user!._id, req.user!.role);
  res.json(ApiResponse(200, 'Restaurant toggled', data));
});

export const remove = asyncHandler(async (req: AuthRequest, res: Response) => {
  await svc.remove(req.params.id as string, req.user!._id);
  res.json(ApiResponse(200, 'Restaurant deleted', null));
});

export const getStaff = asyncHandler(async (req: Request, res: Response) => {
  const data = await svc.getStaff(req.params.id as string);
  res.json(ApiResponse(200, 'Staff fetched', data));
});

export const uploadMedia = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.file) {
    throw new ApiError(400, 'No image file provided');
  }
  const imageUrl = `/uploads/images/${req.file.filename}`;
  const field = req.body.field === 'logo' ? 'logo' : 'coverImage';
  const data = await svc.update(req.params.id as string, req.user!._id, req.user!.role, { [field]: imageUrl });
  data.isProfileComplete = true;
  await data.save();
  res.json(ApiResponse(200, 'Media uploaded', { url: imageUrl, restaurant: data }));
});
