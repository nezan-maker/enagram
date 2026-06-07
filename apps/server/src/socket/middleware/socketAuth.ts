import { jwtVerify } from 'jose';
import { Socket } from 'socket.io';
import { env } from '../../config/env.js';

const encoder = new TextEncoder();

export const socketAuth = async (socket: Socket, next: (err?: Error) => void) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error('Authentication required'));
  try {
    const secret = encoder.encode(env.JWT_ACCESS_SECRET);
    const { payload } = await jwtVerify(token, secret);
    (socket as any).data.user = { _id: payload._id, role: payload.role, restaurantId: payload.restaurantId };
    next();
  } catch {
    next(new Error('Invalid token'));
  }
};
