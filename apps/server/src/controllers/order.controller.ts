import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AuthRequest } from '../middleware/authenticate.js';
import * as svc from '../services/order.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const create = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = await svc.create({ ...req.body, clientId: req.user!.role === 'CLIENT' ? req.user!._id : undefined, waiterId: req.user!.role === 'WAITER' ? req.user!._id : undefined }, req.user!._id);
  res.status(201).json(ApiResponse(201, 'Order placed', data));
});

export const getOne = asyncHandler(async (req: Request, res: Response) => {
  const data = await svc.getById(req.params.id as string);
  res.json(ApiResponse(200, 'Order fetched', data));
});

export const listByRestaurant = asyncHandler(async (req: Request, res: Response) => {
  const data = await svc.listByRestaurant(req.params.id as string, req.query.status as string);
  res.json(ApiResponse(200, 'Orders fetched', data));
});

export const listByClient = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = await svc.listByClient(req.user!._id);
  res.json(ApiResponse(200, 'Order history fetched', data));
});

export const updateStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = await svc.updateStatus(req.params.id as string, req.body.status, req.user!._id);
  res.json(ApiResponse(200, 'Order status updated', data));
});

export const markPaid = asyncHandler(async (req: AuthRequest, res: Response) => {
  const body = req.body || {};
  const data = await svc.markPaid(req.params.id as string, body.paymentMethod);
  res.json(ApiResponse(200, 'Order marked as paid', data));
});

export const cancel = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = await svc.cancel(req.params.id as string);
  res.json(ApiResponse(200, 'Order cancelled', data));
});
