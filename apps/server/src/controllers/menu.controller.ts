import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AuthRequest } from '../middleware/authenticate.js';
import * as svc from '../services/menu.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const listMenus = asyncHandler(async (req: Request, res: Response) => {
  const data = await svc.listMenus(req.params.restaurantId as string);
  res.json(ApiResponse(200, 'Menus fetched', data));
});

export const getMenu = asyncHandler(async (req: Request, res: Response) => {
  const data = await svc.getMenuWithItems(req.params.restaurantId as string, req.params.menuId as string);
  res.json(ApiResponse(200, 'Menu fetched', data));
});

export const createMenu = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = await svc.createMenu(req.params.restaurantId as string, req.user!._id, req.body);
  res.status(201).json(ApiResponse(201, 'Menu created', data));
});

export const updateMenu = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = await svc.updateMenu(req.params.restaurantId as string, req.params.menuId as string, req.body);
  res.json(ApiResponse(200, 'Menu updated', data));
});

export const deleteMenu = asyncHandler(async (req: AuthRequest, res: Response) => {
  await svc.deleteMenu(req.params.restaurantId as string, req.params.menuId as string);
  res.json(ApiResponse(200, 'Menu deleted', null));
});

export const addItem = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = await svc.addMenuItem(req.params.restaurantId as string, req.params.menuId as string, req.user!._id, req.user!.role, req.body);
  res.status(201).json(ApiResponse(201, 'Menu item added', data));
});

export const updateItem = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = await svc.updateMenuItem(req.params.restaurantId as string, req.params.itemId as string, req.body);
  res.json(ApiResponse(200, 'Menu item updated', data));
});

export const deleteItem = asyncHandler(async (req: AuthRequest, res: Response) => {
  await svc.deleteMenuItem(req.params.restaurantId as string, req.params.itemId as string);
  res.json(ApiResponse(200, 'Menu item deleted', null));
});

export const approveItem = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = await svc.approveMenuItem(req.params.itemId as string, req.user!._id);
  res.json(ApiResponse(200, 'Menu item approved', data));
});
