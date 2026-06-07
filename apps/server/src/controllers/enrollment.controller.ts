import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AuthRequest } from '../middleware/authenticate.js';
import * as svc from '../services/enrollment.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const createSingle = asyncHandler(async (req: AuthRequest, res: Response) => {
  const restaurantId = (req.params.restaurantId as string || req.user!.restaurantId)!;
  const result = await svc.createStaffMember(req.body, restaurantId);
  res.status(201).json(ApiResponse(201, 'Staff member created', result));
});

export const bulkEnroll = asyncHandler(async (req: AuthRequest, res: Response) => {
  const restaurantId = (req.params.restaurantId as string || req.user!.restaurantId)!;
  const result = await svc.processBulkEnrollment(
    req.body.rows,
    restaurantId,
    req.user!._id,
    req.user!.role
  );
  res.status(200).json(ApiResponse(200, 'Bulk enrollment processed', result));
});

export const list = asyncHandler(async (req: Request, res: Response) => {
  const data = await svc.listStaff(req.params.restaurantId as string);
  res.json(ApiResponse(200, 'Staff list fetched', data));
});

export const getOne = asyncHandler(async (req: Request, res: Response) => {
  const data = await svc.getStaffDetail(req.params.restaurantId as string, req.params.userId as string);
  res.json(ApiResponse(200, 'Staff detail fetched', data));
});

export const update = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = await svc.updateStaff(req.params.restaurantId as string, req.params.userId as string, req.body);
  res.json(ApiResponse(200, 'Staff updated', data));
});

export const deactivate = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = await svc.deactivateStaff(req.params.restaurantId as string, req.params.userId as string);
  res.json(ApiResponse(200, 'Staff deactivated', data));
});

export const getStaffId = asyncHandler(async (req: Request, res: Response) => {
  const data = await svc.getStaffId(req.params.restaurantId as string, req.params.userId as string);
  res.json(ApiResponse(200, 'Staff ID fetched', data));
});
