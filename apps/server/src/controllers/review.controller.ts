import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AuthRequest } from '../middleware/authenticate.js';
import * as svc from '../services/review.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const create = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = await svc.create({ ...req.body, restaurantId: req.params.restaurantId as string, clientId: req.user!._id });
  res.status(201).json(ApiResponse(201, 'Review created', data));
});
export const list = asyncHandler(async (req: Request, res: Response) => {
  const data = await svc.list(req.params.restaurantId as string);
  res.json(ApiResponse(200, 'Reviews fetched', data));
});
export const remove = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = await svc.remove(req.params.id as string, req.user!._id);
  res.json(ApiResponse(200, 'Review deleted', data));
});
