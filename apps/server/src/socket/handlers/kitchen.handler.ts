import { Server, Socket } from 'socket.io';

export const registerKitchenHandlers = (io: Server, socket: Socket) => {
  socket.on('kitchen:flagIssue', (payload: { orderId: string; note: string }) => {
    io.to(`restaurant:${socket.data.restaurantId}`).emit('kitchen:flagRaised', { ...payload, raisedBy: socket.data.user?._id });
  });
  socket.on('kitchen:markReady', (payload: { orderId: string; itemId: string }) => {
    io.to(`restaurant:${socket.data.restaurantId}`).emit('kitchen:itemReady', payload);
  });
};
