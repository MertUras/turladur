'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import {
  createPollingUserBookingsSubscription,
  DEFAULT_POLLING_INTERVAL_MS,
  EMPTY_USER_BOOKINGS_DATA,
} from './polling-subscription';
import { UserBookingsData, UserBookingsSubscriptionProvider } from './types';

export interface UseUserBookingsOptions {
  enabled?: boolean;
  pollingIntervalMs?: number;
  subscriptionProvider?: UserBookingsSubscriptionProvider;
  showNewBookingToast?: boolean;
  showStatusUpdateToast?: boolean;
}

export interface UseUserBookingsResult {
  bookings: UserBookingsData['bookings'];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  lastUpdated: Date | null;
}

export function useUserBookings(
  options: UseUserBookingsOptions = {}
): UseUserBookingsResult {
  const {
    enabled = true,
    pollingIntervalMs = DEFAULT_POLLING_INTERVAL_MS,
    showNewBookingToast = true,
    showStatusUpdateToast = true,
  } = options;

  const [data, setData] = useState<UserBookingsData>(EMPTY_USER_BOOKINGS_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const hasLoadedRef = useRef(false);

  const handleData = useCallback((next: UserBookingsData) => {
    setData(next);
    setError(null);
    setLastUpdated(new Date());
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true;
      setIsLoading(false);
    }
    setIsRefreshing(false);
  }, []);

  const handleError = useCallback((err: Error) => {
    setError(err.message);
    if (!hasLoadedRef.current) {
      setIsLoading(false);
    }
    setIsRefreshing(false);
  }, []);

  const handleFetching = useCallback(() => {
    if (hasLoadedRef.current) {
      setIsRefreshing(true);
    }
  }, []);

  const refetch = useCallback(async () => {
    handleFetching();
    try {
      const response = await fetch('/api/user/bookings');
      if (!response.ok) {
        throw new Error('Rezervasyonlar yüklenemedi');
      }
      const next: UserBookingsData = await response.json();
      handleData(next);
    } catch (err) {
      handleError(err instanceof Error ? err : new Error('Rezervasyonlar yüklenemedi'));
    }
  }, [handleData, handleError, handleFetching]);

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      setIsRefreshing(false);
      setData(EMPTY_USER_BOOKINGS_DATA);
      return;
    }

    const provider =
      options.subscriptionProvider ??
      createPollingUserBookingsSubscription({
        pollingIntervalMs,
        onNewBookings: (newCount) => {
          if (showNewBookingToast && newCount > 0) {
            toast.success(
              newCount === 1
                ? 'Yeni rezervasyon eklendi'
                : `${newCount} yeni rezervasyon eklendi`,
              { duration: 3000 }
            );
          }
        },
        onBookingUpdates: (updatedCount) => {
          if (showStatusUpdateToast && updatedCount > 0) {
            toast.success(
              updatedCount === 1
                ? 'Rezervasyon durumu güncellendi'
                : `${updatedCount} rezervasyon durumu güncellendi`,
              { duration: 3000 }
            );
          }
        },
      });

    setIsLoading(true);
    hasLoadedRef.current = false;

    const unsubscribe = provider.subscribe({
      onData: handleData,
      onError: handleError,
      onFetching: handleFetching,
    });

    return unsubscribe;
  }, [
    enabled,
    handleData,
    handleError,
    handleFetching,
    options.subscriptionProvider,
    pollingIntervalMs,
    showNewBookingToast,
    showStatusUpdateToast,
  ]);

  return {
    bookings: data.bookings,
    isLoading,
    isRefreshing,
    error,
    refetch,
    lastUpdated,
  };
}
