import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from './logger.js';

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

export const connectDB = async (): Promise<void> => {
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI || env.MONGO_URI);
      logger.info(`✅ MongoDB connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      retries++;
      logger.error(error as Error, `❌ MongoDB connection failed (attempt ${retries}/${MAX_RETRIES})`);
      if (retries < MAX_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      }
    }
  }

  logger.error('❌ All MongoDB connection retries exhausted. Exiting.');
  process.exit(1);
};
