import { Server, Socket } from 'socket.io';

export const registerOrderHandlers = (io: Server, socket: Socket) => {
  socket.on('room:join', (payload: { restaurantId: string }) => {
    if (payload.restaurantId) socket.join(`restaurant:${payload.restaurantId}`);
  });
  socket.on('room:leave', (payload: { restaurantId: string }) => {
    if (payload.restaurantId) socket.leave(`restaurant:${payload.restaurantId}`);
  });
  socket.on('order:updateStatus', (payload: { orderId: string; status: string }) => {
    socket.to(`restaurant:${socket.data.restaurantId}`).emit('order:statusChanged', payload);
  });
};
