import { jwtVerify } from 'jose';
import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

export interface AuthRequest extends Request {
  user?: {
    _id: string;
    role: string;
    restaurantId?: string;
  };
}

const encoder = new TextEncoder();

export const authenticate = async (req: AuthRequest, _res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      throw new ApiError(401, 'Not authenticated — no token provided');
    }

    const secret = encoder.encode(env.JWT_ACCESS_SECRET);
    const { payload } = await jwtVerify(token, secret);
    req.user = {
      _id: payload._id as string,
      role: payload.role as string,
    };

    next();
  } catch {
    next(new ApiError(401, 'Invalid or expired token'));
  }
};
