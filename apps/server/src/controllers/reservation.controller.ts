import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AuthRequest } from '../middleware/authenticate.js';
import * as svc from '../services/reservation.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const create = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = await svc.create({ ...req.body, restaurantId: req.params.restaurantId as string, clientId: req.user!._id });
  res.status(201).json(ApiResponse(201, 'Reservation created', data));
});
export const list = asyncHandler(async (req: Request, res: Response) => {
  const data = await svc.list(req.params.restaurantId as string);
  res.json(ApiResponse(200, 'Reservations fetched', data));
});
export const updateStatus = asyncHandler(async (req: Request, res: Response) => {
  const data = await svc.updateStatus(req.params.id as string, req.body.status);
  res.json(ApiResponse(200, 'Reservation updated', data));
});
export const cancel = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = await svc.cancel(req.params.id as string, req.user!._id);
  res.json(ApiResponse(200, 'Reservation cancelled', data));
});
