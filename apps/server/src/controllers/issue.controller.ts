import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AuthRequest } from '../middleware/authenticate.js';
import * as svc from '../services/issue.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const create = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = await svc.create({ ...req.body, raisedBy: req.user!._id });
  res.status(201).json(ApiResponse(201, 'Issue created', data));
});
export const list = asyncHandler(async (req: Request, res: Response) => {
  const data = await svc.list(req.query.restaurantId as string);
  res.json(ApiResponse(200, 'Issues fetched', data));
});
export const listMine = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = await svc.listMine(req.user!._id);
  res.json(ApiResponse(200, 'My issues fetched', data));
});
export const getOne = asyncHandler(async (req: Request, res: Response) => {
  const data = await svc.getById(req.params.id as string);
  res.json(ApiResponse(200, 'Issue fetched', data));
});
export const update = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = await svc.update(req.params.id as string, req.body);
  res.json(ApiResponse(200, 'Issue updated', data));
});
export const assign = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = await svc.assign(req.params.id as string, req.body.assigneeId);
  res.json(ApiResponse(200, 'Issue assigned', data));
});
