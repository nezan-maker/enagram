import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AuthRequest } from '../middleware/authenticate.js';
import * as svc from '../services/report.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const create = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = await svc.create({ ...req.body, restaurantId: req.params.restaurantId as string, submittedBy: req.user!._id });
  res.status(201).json(ApiResponse(201, 'Report submitted', data));
});
export const list = asyncHandler(async (req: Request, res: Response) => {
  const data = await svc.list(req.params.restaurantId as string);
  res.json(ApiResponse(200, 'Reports fetched', data));
});
export const dashboard = asyncHandler(async (req: Request, res: Response) => {
  const data = await svc.dashboard(req.params.restaurantId as string);
  res.json(ApiResponse(200, 'Dashboard data fetched', data));
});
export const financial = asyncHandler(async (req: Request, res: Response) => {
  const data = await svc.financial(req.params.restaurantId as string);
  res.json(ApiResponse(200, 'Financial reports fetched', data));
});
