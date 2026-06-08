import multer from 'multer';
import { Readable } from 'stream';
import { ApiError } from '../utils/ApiError.js';
import { cloudinary } from '../config/cloudinary.js';

// ── Image upload (memory storage → Cloudinary) ──────────────

const imageFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new ApiError(400, 'Only JPEG, PNG, WebP, and GIF images allowed'));
};

export const uploadImage = multer({
  storage: multer.memoryStorage(),
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// ── CSV/Excel upload (memory storage) ───────────────────────

const excelFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new ApiError(400, 'Only CSV and Excel files allowed'));
};

export const uploadMemory = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: excelFilter,
});

// ── Cloudinary upload helper ─────────────────────────────────

export interface CloudinaryResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
}

export const uploadToCloudinary = (buffer: Buffer, folder = 'enagram'): Promise<CloudinaryResult> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error || !result) return reject(error || new Error('Cloudinary upload failed'));
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
        });
      },
    );
    Readable.from(buffer).pipe(stream);
  });
};
