import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ApiError } from '../utils/ApiError.js';

export const validate = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const fieldErrors = (result.error.flatten() as any).fieldErrors || {};
      const formatted = Object.entries(fieldErrors).flatMap(([field, messages]) =>
        ((messages as string[]) || []).map((message) => ({ field, message }))
      );
      throw new ApiError(400, 'Validation failed', formatted);
    }
    req.body = result.data;
    next();
  };
};
