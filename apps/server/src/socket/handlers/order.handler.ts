import { Server, Socket } from 'socket.io';

export const registerOrderHandlers = (io: Server, socket: Socket) => {
  socket.on('room:join', (payload: { restaurantId: string }) => {
    const user = socket.data.user;
    if (!user) {
      socket.emit('error', { message: 'Unauthorized — not authenticated' });
      return;
    }
    // OWNER can join any restaurant room; staff must match their assigned restaurant
    // CLIENT role should not join restaurant rooms — they use client:${userId}
    if (user.role === 'CLIENT') {
      socket.emit('error', { message: 'Unauthorized room join' });
      return;
    }
    if (user.role !== 'OWNER' && user.restaurantId !== payload.restaurantId) {
      socket.emit('error', { message: 'Unauthorized room join' });
      return;
    }
    if (payload.restaurantId) socket.join(`restaurant:${payload.restaurantId}`);
  });
  socket.on('room:leave', (payload: { restaurantId: string }) => {
    if (payload.restaurantId) socket.leave(`restaurant:${payload.restaurantId}`);
  });
  socket.on('order:updateStatus', (payload: { orderId: string; status: string }) => {
    socket.to(`restaurant:${socket.data.restaurantId}`).emit('order:statusChanged', payload);
  });
};
