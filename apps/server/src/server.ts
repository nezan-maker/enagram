import { createServer } from 'http';
import { app } from './app.js';
import { connectDB } from './config/db.js';
import { configureSocket } from './config/socket.js';
import { env } from './config/env.js';

const start = async () => {
  // 1. Validate env
  console.log('🔧 Validating environment...');
  // env already validated at import time

  // 2. Connect to MongoDB (retry 3x with backoff)
  await connectDB();

  // 3. Create HTTP server
  const server = createServer(app);

  // 4. Attach Socket.io (Step 4 in architecture Section 10)
  configureSocket(server);

  // 5. Listen
  server.listen(env.PORT, () => {
    console.log(`🚀 Enagram server running on port ${env.PORT} [${env.NODE_ENV}]`);
  });
};

start();
