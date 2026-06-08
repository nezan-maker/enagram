import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AuthRequest } from '../middleware/authenticate.js';
import * as authService from '../services/auth.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';

const strongPassword = z.string()
  .min(8)
  .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character');

const registerSchema = z.object({
  email: z.string().email(),
  password: strongPassword,
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

const setRefreshTokenCookie = (res: Response, refreshToken: string) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7d in ms
    path: '/api/v1/auth/refresh',
  });
};

const clearRefreshTokenCookie = (res: Response) => {
  res.clearCookie('refreshToken', { path: '/api/v1/auth/refresh' });
};

export const register = [
  validate(registerSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password, firstName, lastName, role } = req.body;
    const result = await authService.register(email, password, firstName, lastName, role);
    setRefreshTokenCookie(res, result.refreshToken);
    res.status(201).json(ApiResponse(201, 'Account created', {
      user: result.user,
      accessToken: result.accessToken,
    }));
  }),
];

export const login = [
  validate(loginSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    setRefreshTokenCookie(res, result.refreshToken);
    res.status(200).json(ApiResponse(200, 'Login successful', {
      user: result.user,
      accessToken: result.accessToken,
    }));
  }),
];

export const staffLoginCtrl = [
  validate(staffLoginSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { staffId, password } = req.body;
    const result = await authService.staffLogin(staffId, password);
    setRefreshTokenCookie(res, result.refreshToken);
    res.status(200).json(ApiResponse(200, 'Staff login successful', {
      user: result.user,
      accessToken: result.accessToken,
      firstLogin: result.firstLogin,
    }));
  }),
];

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    res.status(401).json({ success: false, statusCode: 401, message: 'Refresh token required' });
    return;
  }
  const tokens = await authService.refreshAuth(refreshToken);
  setRefreshTokenCookie(res, tokens.refreshToken);
  res.status(200).json(ApiResponse(200, 'Token refreshed', {
    accessToken: tokens.accessToken,
  }));
});

export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
  await authService.logout(req.user!._id);
  clearRefreshTokenCookie(res);
  res.status(200).json(ApiResponse(200, 'Logged out', null));
});

export const me = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await authService.getMe(req.user!._id);
  res.status(200).json(ApiResponse(200, 'User profile', user));
});
