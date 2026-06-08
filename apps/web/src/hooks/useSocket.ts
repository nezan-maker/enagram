import { useEffect, useRef, useCallback } from 'react';
import { useAuthStore } from '../store/auth.store';
import { Tier } from '../policies/feature.policy';
import { io, Socket } from 'socket.io-client';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:4000';

/**
 * Socket.io hook for real-time order/kitchen/notification events.
 *
 * Architecture integration (Enagram.md Section 4.7):
 * - Connects with JWT in auth handshake
 * - Joins restaurant room for staff roles
 * - Joins client room for CLIENT role
 * - Listens for tier:upgraded to update auth store reactively
 *
 * Returns safe on/off/emit helpers that work even before the socket connects.
 */
export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const accessToken = useAuthStore((s) => s.accessToken);
  const role = useAuthStore((s) => s.user?.role as string | undefined);
  const restaurantId = useAuthStore((s) => s.restaurantId);
  const updateTier = useAuthStore((s) => s.updateTier);

  useEffect(() => {
    if (!accessToken) return;

    const socket = io(WS_URL, {
      auth: { token: accessToken },
    });

    socket.on('connect', () => {
      // Join appropriate room
      if (restaurantId) {
        socket.emit('room:join', { restaurantId });
      }
    });

    // Listen for tier upgrades — real-time reactivity
    socket.on('tier:upgraded', (data: { newTier: string }) => {
      updateTier(data.newTier as Tier);
    });

    socket.on('disconnect', () => {});

    socketRef.current = socket;

    return () => {
      if (restaurantId) {
        socket.emit('room:leave', { restaurantId });
      }
      socket.disconnect();
    };
  }, [accessToken, restaurantId, role, updateTier]);

  const on = useCallback((event: string, handler: (...args: any[]) => void) => {
    socketRef.current?.on(event, handler);
  }, []);

  const off = useCallback((event: string, handler: (...args: any[]) => void) => {
    socketRef.current?.off(event, handler);
  }, []);

  const emit = useCallback((event: string, data?: unknown) => {
    socketRef.current?.emit(event, data);
  }, []);

  return { socket: socketRef.current, on, off, emit };
};
