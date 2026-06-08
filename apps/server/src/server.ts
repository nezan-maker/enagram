import { createServer } from 'http';
import { app } from './app.js';
import { connectDB } from './config/db.js';
import { configureSocket } from './config/socket.js';
import { configureCloudinary } from './config/cloudinary.js';
import { env } from './config/env.js';

const start = async () => {
  // 1. Validate env
  console.log('🔧 Validating environment...');
  // env already validated at import time

  // 2. Connect to MongoDB (retry 3x with backoff)
  await connectDB();

  // 3. Configure Cloudinary
  configureCloudinary();

  // 4. Create HTTP server
  const server = createServer(app);

  // 5. Attach Socket.io
  configureSocket(server);

  // 6. Listen
  server.listen(env.PORT, () => {
    console.log(`🚀 Enagram server running on port ${env.PORT} [${env.NODE_ENV}]`);
  });
};

start();
