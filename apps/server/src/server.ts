import { createServer } from 'http';
import { app } from './app.js';
import { connectDB } from './config/db.js';
import { configureSocket } from './config/socket.js';
import { configureCloudinary } from './config/cloudinary.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';

const start = async () => {
  logger.info('🔧 Validating environment...');

  await connectDB();

  configureCloudinary();

  const server = createServer(app);

  configureSocket(server);

  server.listen(env.PORT, () => {
    logger.info(`🚀 Enagram server running on port ${env.PORT} [${env.NODE_ENV}]`);
  });
};

start();
