'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import {
  createPollingPartnerReviewsSubscription,
  DEFAULT_POLLING_INTERVAL_MS,
  EMPTY_PARTNER_REVIEWS_DATA,
} from './polling-subscription';
import {
  PartnerReviewsData,
  PartnerReviewsStats,
  PartnerReviewsSubscriptionProvider,
} from './types';

export interface UsePartnerReviewsOptions {
  pollingIntervalMs?: number;
  subscriptionProvider?: PartnerReviewsSubscriptionProvider;
  showNewReviewToast?: boolean;
}

export interface UsePartnerReviewsResult {
  reviews: PartnerReviewsData['reviews'];
  stats: PartnerReviewsStats;
  categoryAverages: PartnerReviewsStats['categoryAverages'];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  lastUpdated: Date | null;
}

export function usePartnerReviews(
  options: UsePartnerReviewsOptions = {}
): UsePartnerReviewsResult {
  const {
    pollingIntervalMs = DEFAULT_POLLING_INTERVAL_MS,
    showNewReviewToast = true,
  } = options;

  const [data, setData] = useState<PartnerReviewsData>(EMPTY_PARTNER_REVIEWS_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const hasLoadedRef = useRef(false);

  const handleData = useCallback((next: PartnerReviewsData) => {
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
      const response = await fetch('/api/partner/reviews');
      if (!response.ok) {
        throw new Error('Değerlendirmeler yüklenemedi');
      }
      const next: PartnerReviewsData = await response.json();
      handleData(next);
    } catch (err) {
      handleError(err instanceof Error ? err : new Error('Değerlendirmeler yüklenemedi'));
    }
  }, [handleData, handleError, handleFetching]);

  useEffect(() => {
    const provider =
      options.subscriptionProvider ??
      createPollingPartnerReviewsSubscription({
        pollingIntervalMs,
        onNewReviews: (newCount) => {
          if (showNewReviewToast && newCount > 0) {
            toast.success(
              newCount === 1
                ? 'Yeni değerlendirme alındı'
                : `${newCount} yeni değerlendirme alındı`,
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
    handleData,
    handleError,
    handleFetching,
    options.subscriptionProvider,
    pollingIntervalMs,
    showNewReviewToast,
  ]);

  return {
    reviews: data.reviews,
    stats: data.stats,
    categoryAverages: data.stats.categoryAverages,
    isLoading,
    isRefreshing,
    error,
    refetch,
    lastUpdated,
  };
}
