import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AuthRequest } from '../middleware/authenticate.js';
import * as authService from '../services/auth.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { env } from '../config/env.js';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.enum(['CLIENT', 'OWNER']),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const staffLoginSchema = z.object({
  staffId: z.string().min(1),
  password: z.string().min(1),
});

export const register = [
  validate(registerSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password, firstName, lastName, role } = req.body;
    console.log('[REGISTER] Attempting:', { email, role });
    const result = await authService.register(email, password, firstName, lastName, role);
    console.log('[REGISTER] Success:', result.user._id);
    res.status(201).json(ApiResponse(201, 'Account created', result));
  }),
];

export const login = [
  validate(loginSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.status(200).json(ApiResponse(200, 'Login successful', result));
  }),
];

export const staffLoginCtrl = [
  validate(staffLoginSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { staffId, password } = req.body;
    const result = await authService.staffLogin(staffId, password);
    res.status(200).json(ApiResponse(200, 'Staff login successful', result));
  }),
];

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) throw new Error('Refresh token required');
  console.log('[REFRESH] token received:', refreshToken.substring(0, 30) + '...');
  console.log('[REFRESH] env JWT_REFRESH_SECRET:', env.JWT_REFRESH_SECRET ? env.JWT_REFRESH_SECRET.substring(0, 20) + '...' : 'MISSING');
  const tokens = await authService.refreshAuth(refreshToken);
  console.log('[REFRESH] SUCCESS');
  res.status(200).json(ApiResponse(200, 'Token refreshed', tokens));
});

export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
  await authService.logout(req.user!._id);
  res.status(200).json(ApiResponse(200, 'Logged out', null));
});

export const me = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await authService.getMe(req.user!._id);
  res.status(200).json(ApiResponse(200, 'User profile', user));
});
