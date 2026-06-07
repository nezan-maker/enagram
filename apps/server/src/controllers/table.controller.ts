import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as svc from '../services/table.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const list = asyncHandler(async (req: Request, res: Response) => {
  const data = await svc.listTables(req.params.restaurantId as string);
  res.json(ApiResponse(200, 'Tables fetched', data));
});
export const create = asyncHandler(async (req: Request, res: Response) => {
  const data = await svc.addTable(req.params.restaurantId as string, req.body);
  res.status(201).json(ApiResponse(201, 'Table created', data));
});
export const update = asyncHandler(async (req: Request, res: Response) => {
  const data = await svc.updateTable(req.params.restaurantId as string, req.params.tableId as string, req.body);
  res.json(ApiResponse(200, 'Table updated', data));
});
export const remove = asyncHandler(async (req: Request, res: Response) => {
  await svc.removeTable(req.params.restaurantId as string, req.params.tableId as string);
  res.json(ApiResponse(200, 'Table removed', null));
});
export const getQR = asyncHandler(async (req: Request, res: Response) => {
  res.json(ApiResponse(200, 'QR code data', { tableId: req.params.tableId as string, url: `/qr/${req.params.tableId}` }));
});
