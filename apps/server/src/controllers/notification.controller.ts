import { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AuthRequest } from '../middleware/authenticate.js';
import * as svc from '../services/notification.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const list = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = await svc.list(req.user!._id);
  res.json(ApiResponse(200, 'Notifications fetched', data));
});
export const markRead = asyncHandler(async (req: AuthRequest, res: Response) => {
  await svc.markRead(req.params.id as string);
  res.json(ApiResponse(200, 'Notification marked read', null));
});
export const markAllRead = asyncHandler(async (req: AuthRequest, res: Response) => {
  await svc.markAllRead(req.user!._id);
  res.json(ApiResponse(200, 'All notifications marked read', null));
});
