'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Bell } from 'lucide-react';
import Link from 'next/link';

import {
  getUnreadNotificationCount,
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '@/services/notification';
import { useNotificationSocket } from '@/hooks/use-notification-socket';
import { useAuth } from '@/providers/auth-provider';
import { cn } from '@/lib/utils';
import type { AppNotification } from '@turta/shared-types';

type Props = {
  solid: boolean;
  /** Optional footer link (e.g. partner reservations) — layout additive only */
  footerHref?: string;
  footerLabel?: string;
};

export function NotificationBell({
  solid,
  footerHref,
  footerLabel = 'Tüm Bildirimleri Gör',
}: Props) {
  const { accessToken, isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [items, setItems] = useState<AppNotification[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);

  const refresh = useCallback(async () => {
    if (!accessToken) return;
    const [c, list] = await Promise.all([
      getUnreadNotificationCount(accessToken),
      listNotifications(accessToken),
    ]);
    setCount(c.count);
    setItems(list);
  }, [accessToken]);

  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      setCount(0);
      setItems([]);
      return;
    }
    void refresh().catch(() => undefined);
    // Poll fallback if WebSocket drops (risk mitigation)
    const id = window.setInterval(() => {
      void refresh().catch(() => undefined);
    }, 30000);
    return () => window.clearInterval(id);
  }, [isAuthenticated, accessToken, refresh]);

  useNotificationSocket(accessToken, () => {
    void refresh().catch(() => undefined);
  });

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  if (!isAuthenticated) return null;

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        aria-label="Bildirimler"
        className={cn(
          'relative rounded-full p-2 transition-colors',
          solid
            ? 'text-neutral-600 hover:bg-neutral-100'
            : 'text-white hover:bg-white/10',
        )}
        onClick={() => {
          setOpen((v) => !v);
          if (!open) void refresh().catch(() => undefined);
        }}
      >
        <Bell className="h-5 w-5" />
        {count > 0 ? (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {count > 9 ? '9+' : count}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-xl border border-neutral-200 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-neutral-100 px-3 py-2">
            <span className="text-sm font-semibold text-neutral-900">
              Bildirimler
            </span>
            <button
              type="button"
              className="text-xs text-neutral-950 hover:underline"
              onClick={() => {
                if (!accessToken) return;
                void markAllNotificationsRead(accessToken).then(() =>
                  refresh(),
                );
              }}
            >
              Tümünü okundu
            </button>
          </div>
          <ul className="max-h-80 overflow-y-auto">
            {items.length === 0 ? (
              <li className="px-3 py-6 text-center text-sm text-neutral-500">
                Bildirim yok
              </li>
            ) : null}
            {items.map((n) => (
              <li key={n.id}>
                <button
                  type="button"
                  className={cn(
                    'w-full px-3 py-2.5 text-left hover:bg-neutral-50',
                    !n.readAt && 'bg-neutral-50/60',
                  )}
                  onClick={() => {
                    if (!accessToken || n.readAt) return;
                    void markNotificationRead(n.id, accessToken).then(() =>
                      refresh(),
                    );
                  }}
                >
                  <p className="text-sm font-medium text-neutral-900">
                    {n.title}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-neutral-600">
                    {n.body}
                  </p>
                  {typeof n.data?.tourId === 'string' ? (
                    <Link
                      href={`/tours/${n.data.tourId}`}
                      className="mt-1 inline-block text-xs text-neutral-950 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Tura git
                    </Link>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
          {footerHref ? (
            <div className="border-t border-neutral-100 p-2">
              <Link
                href={footerHref}
                className="block w-full rounded-lg px-3 py-2 text-center text-sm text-blue-600 transition-colors hover:bg-blue-50"
                onClick={() => setOpen(false)}
              >
                {footerLabel}
              </Link>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
