import { Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError.js';
import { AuthRequest } from './authenticate.js';

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ApiError(401, 'Not authenticated');
    }
    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, 'Insufficient permissions');
    }
    next();
  };
};

export const authorizeRestaurant = (req: AuthRequest, _res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new ApiError(401, 'Not authenticated');
  }
  const requestedRestaurantId = req.params.restaurantId;
  if (req.user.restaurantId && req.user.restaurantId !== requestedRestaurantId) {
    throw new ApiError(403, 'Cross-restaurant access denied');
  }
  next();
};
