import { Server as HTTPServer } from 'http';
import { Server } from 'socket.io';
import { env } from '../config/env.js';
import { socketAuth } from './middleware/socketAuth.js';
import { registerOrderHandlers } from './handlers/order.handler.js';
import { registerKitchenHandlers } from './handlers/kitchen.handler.js';
import { registerMessageHandlers } from './handlers/message.handler.js';

export const configureSocket = (httpServer: HTTPServer) => {
  const io = new Server(httpServer, {
    cors: { origin: env.CLIENT_URL, credentials: true },
  });

  io.use(socketAuth);

  io.on('connection', (socket) => {
    const { restaurantId, _id } = (socket as any).data.user || {};

    // Join restaurant room
    if (restaurantId) socket.join(`restaurant:${restaurantId}`);
    // Join personal room for DMs
    if (_id) socket.join(`user:${_id}`);

    registerOrderHandlers(io, socket);
    registerKitchenHandlers(io, socket);
    registerMessageHandlers(io, socket);

    socket.on('disconnect', () => {});
  });

  return io;
};
