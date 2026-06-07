import { Server, Socket } from 'socket.io';
import { Message } from '../../models/Message.model.js';

export const registerMessageHandlers = (io: Server, socket: Socket) => {
  socket.on('message:send', async (payload: { toUserId: string; content: string; restaurantId: string }) => {
    const msg = await Message.create({
      restaurantId: payload.restaurantId,
      senderId: socket.data.user?._id,
      recipientId: payload.toUserId,
      content: payload.content,
    });
    io.to(`user:${payload.toUserId}`).emit('message:received', msg);
  });
};
