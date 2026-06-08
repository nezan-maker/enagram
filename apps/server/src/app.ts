import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { pinoHttp } from 'pino-http';
import mongoose from 'mongoose';
import path from 'path';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authenticate } from './middleware/authenticate.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { mountRoutes } from './routes/index.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '512kb' }));
app.use(express.urlencoded({ extended: true, limit: '512kb' }));
app.use(cookieParser());
app.use(pinoHttp({ logger }));
app.use(apiLimiter);

mountRoutes(app);

// Protected media endpoint — replaces unauthenticated express.static
app.get('/api/v1/media/:filename', authenticate, (req, res) => {
  const safeName = path.basename(String(req.params.filename));
  res.sendFile(path.resolve('uploads', safeName));
});

app.get('/health', async (_req, res) => {
  const dbState = mongoose.connection.readyState;
  const isHealthy = dbState === 1;
  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'ok' : 'degraded',
    db: dbState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

app.use(errorHandler);

export { app };
