import multer from 'multer';
import path from 'path';
import { ApiError } from '../utils/ApiError.js';
import { env } from '../config/env.js';

const UPLOAD_DIR = env.UPLOAD_DIR;

const imageStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.join(UPLOAD_DIR, 'images')),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const imageFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new ApiError(400, 'Only JPEG, PNG, WebP, and GIF images allowed'));
};

const memoryStorage = multer.memoryStorage();

export const uploadImage = multer({ storage: imageStorage, fileFilter: imageFilter, limits: { fileSize: 5 * 1024 * 1024 } });
export const uploadMemory = multer({ storage: memoryStorage, limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowed = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new ApiError(400, 'Only CSV and Excel files allowed'));
  },
});
