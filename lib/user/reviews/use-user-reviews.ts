'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import {
  createPollingUserReviewsSubscription,
  DEFAULT_POLLING_INTERVAL_MS,
  EMPTY_USER_REVIEWS_DATA,
} from './polling-subscription';
import { UserReviewsData, UserReviewsSubscriptionProvider } from './types';

export interface UseUserReviewsOptions {
  enabled?: boolean;
  pollingIntervalMs?: number;
  subscriptionProvider?: UserReviewsSubscriptionProvider;
  showOperatorResponseToast?: boolean;
}

export interface UseUserReviewsResult {
  reviews: UserReviewsData['reviews'];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  lastUpdated: Date | null;
}

export function useUserReviews(
  options: UseUserReviewsOptions = {}
): UseUserReviewsResult {
  const {
    enabled = true,
    pollingIntervalMs = DEFAULT_POLLING_INTERVAL_MS,
    showOperatorResponseToast = true,
  } = options;

  const [data, setData] = useState<UserReviewsData>(EMPTY_USER_REVIEWS_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const hasLoadedRef = useRef(false);

  const handleData = useCallback((next: UserReviewsData) => {
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
      const response = await fetch('/api/user/reviews');
      if (!response.ok) {
        throw new Error('Değerlendirmeler yüklenemedi');
      }
      const next: UserReviewsData = await response.json();
      handleData(next);
    } catch (err) {
      handleError(err instanceof Error ? err : new Error('Değerlendirmeler yüklenemedi'));
    }
  }, [handleData, handleError, handleFetching]);

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      setIsRefreshing(false);
      setData(EMPTY_USER_REVIEWS_DATA);
      return;
    }

    const provider =
      options.subscriptionProvider ??
      createPollingUserReviewsSubscription({
        pollingIntervalMs,
        onNewOperatorResponses: (newCount) => {
          if (showOperatorResponseToast && newCount > 0) {
            toast.success(
              newCount === 1
                ? 'Operatör değerlendirmenize yanıt verdi'
                : `${newCount} değerlendirmenize operatör yanıtı geldi`,
              { duration: 4000 }
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
    showOperatorResponseToast,
  ]);

  return {
    reviews: data.reviews,
    isLoading,
    isRefreshing,
    error,
    refetch,
    lastUpdated,
  };
}
