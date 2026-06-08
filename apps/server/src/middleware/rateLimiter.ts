import rateLimit from 'express-rate-limit';
import type { Request, Response, NextFunction } from 'express';

// In test environment, skip rate limiting entirely to avoid interference with supertest
const isTestEnv = () => process.env.NODE_ENV === 'test';

// Auth endpoints: 10 requests per 15 minutes per IP
export const authLimiter = (req: Request, res: Response, next: NextFunction) => {
  if (isTestEnv()) return next();
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, statusCode: 429, message: 'Too many authentication attempts, please try again later' },
  })(req, res, next);
};

// General API: 200 requests per 15 minutes per IP
export const apiLimiter = (req: Request, res: Response, next: NextFunction) => {
  if (isTestEnv()) return next();
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, statusCode: 429, message: 'Too many requests, please try again later' },
  })(req, res, next);
};

// File upload: 5 requests per 60 minutes per IP
export const uploadLimiter = (req: Request, res: Response, next: NextFunction) => {
  if (isTestEnv()) return next();
  return rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, statusCode: 429, message: 'Too many upload requests, please try again later' },
  })(req, res, next);
};
