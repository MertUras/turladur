import { apiRequest } from './api-client';
import type { AppNotification } from '@turta/shared-types';

export async function listNotifications(token: string, unreadOnly = false) {
  const qs = unreadOnly ? '?unreadOnly=true' : '';
  return apiRequest<AppNotification[]>(`/notification${qs}`, { token });
}

export async function getUnreadNotificationCount(token: string) {
  return apiRequest<{ count: number }>('/notification/unread-count', {
    token,
  });
}

export async function markNotificationRead(id: string, token: string) {
  return apiRequest<AppNotification | null>(`/notification/${id}/read`, {
    method: 'PATCH',
    token,
  });
}

export async function markAllNotificationsRead(token: string) {
  return apiRequest<{ ok: boolean }>('/notification/read-all', {
    method: 'PATCH',
    token,
  });
}
