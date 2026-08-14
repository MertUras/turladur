'use client';

import { useEffect, useRef } from 'react';
import { io, type Socket } from 'socket.io-client';

import { API_BASE } from '@/services/api-client';

/** Socket.io hits Nest HTTP host (not /api/v1). */
export function getNotificationSocketUrl(): string {
  if (process.env.NEXT_PUBLIC_WS_URL?.trim()) {
    return process.env.NEXT_PUBLIC_WS_URL.trim().replace(/\/$/, '');
  }
  return API_BASE.replace(/\/api\/v1\/?$/, '') || 'http://localhost:4000';
}

/**
 * Connects to `/notifications` with JWT. On `notification.created`, calls onEvent.
 * Disconnects on unmount / token clear. Safe no-op if token missing.
 */
export function useNotificationSocket(
  accessToken: string | null | undefined,
  onEvent: () => void,
): void {
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  useEffect(() => {
    if (!accessToken) return;

    let socket: Socket | null = null;
    let disposed = false;

    try {
      socket = io(`${getNotificationSocketUrl()}/notifications`, {
        auth: { token: accessToken },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 8,
        reconnectionDelay: 2000,
        autoConnect: true,
      });

      socket.on('notification.created', () => {
        if (!disposed) onEventRef.current();
      });

      socket.on('connect_error', () => {
        // Polling fallback in NotificationBell covers this — stay quiet
      });
    } catch {
      // Ignore — REST poll remains source of truth
    }

    return () => {
      disposed = true;
      socket?.removeAllListeners();
      socket?.disconnect();
    };
  }, [accessToken]);
}
