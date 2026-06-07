import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AuthRequest } from '../middleware/authenticate.js';
import * as svc from '../services/approval.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const create = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = await svc.create({ ...req.body, requestedBy: req.user!._id, restaurantId: req.body.restaurantId });
  res.status(201).json(ApiResponse(201, 'Approval requested', data));
});
export const list = asyncHandler(async (_req: Request, res: Response) => {
  const data = await svc.list();
  res.json(ApiResponse(200, 'Pending approvals fetched', data));
});
export const resolve = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = await svc.resolve(req.params.id as string, req.body.status, req.body.notes);
  res.json(ApiResponse(200, 'Approval resolved', data));
});
