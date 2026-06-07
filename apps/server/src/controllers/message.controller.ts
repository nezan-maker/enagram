import { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AuthRequest } from '../middleware/authenticate.js';
import * as svc from '../services/message.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const getConversation = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = await svc.getConversation(req.user!._id, req.params.userId as string);
  res.json(ApiResponse(200, 'Conversation fetched', data));
});
export const listConversations = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = await svc.listConversations(req.user!._id);
  res.json(ApiResponse(200, 'Conversations fetched', data));
});
export const markRead = asyncHandler(async (req: AuthRequest, res: Response) => {
  await svc.markRead(req.user!._id, req.params.userId as string);
  res.json(ApiResponse(200, 'Messages marked read', null));
});
