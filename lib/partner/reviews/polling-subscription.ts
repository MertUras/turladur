import {
  EMPTY_PARTNER_REVIEWS_DATA,
  PartnerReviewsData,
  PartnerReviewsSubscriptionCallbacks,
  PartnerReviewsSubscriptionProvider,
} from './types';

const DEFAULT_POLLING_INTERVAL_MS = 12_000;

async function fetchPartnerReviews(): Promise<PartnerReviewsData> {
  const response = await fetch('/api/partner/reviews');
  if (!response.ok) {
    throw new Error('Değerlendirmeler yüklenemedi');
  }
  return response.json();
}

export interface PollingSubscriptionOptions {
  pollingIntervalMs?: number;
  onNewReviews?: (newCount: number) => void;
}

export function createPollingPartnerReviewsSubscription(
  options: PollingSubscriptionOptions = {}
): PartnerReviewsSubscriptionProvider {
  const { pollingIntervalMs = DEFAULT_POLLING_INTERVAL_MS, onNewReviews } = options;
  let knownIds = new Set<string>();
  let isFirstFetch = true;

  return {
    subscribe(callbacks: PartnerReviewsSubscriptionCallbacks) {
      let intervalId: ReturnType<typeof setInterval> | null = null;
      let isDisposed = false;

      const load = async (isInitial: boolean) => {
        if (isDisposed) return;

        if (!isInitial) {
          callbacks.onFetching?.();
        }

        try {
          const data = await fetchPartnerReviews();
          if (isDisposed) return;

          const incomingIds = data.reviews.map((review) => review.id);
          if (!isInitial && !isFirstFetch) {
            const newCount = incomingIds.filter((id) => !knownIds.has(id)).length;
            if (newCount > 0) {
              onNewReviews?.(newCount);
            }
          }

          knownIds = new Set(incomingIds);
          isFirstFetch = false;
          callbacks.onData(data);
        } catch (error) {
          if (!isDisposed) {
            callbacks.onError(
              error instanceof Error ? error : new Error('Değerlendirmeler yüklenemedi')
            );
          }
        }
      };

      const startPolling = () => {
        if (intervalId) clearInterval(intervalId);
        intervalId = setInterval(() => {
          if (document.visibilityState === 'visible') {
            void load(false);
          }
        }, pollingIntervalMs);
      };

      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          void load(false);
          startPolling();
        } else if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      };

      const handleFocus = () => {
        if (document.visibilityState === 'visible') {
          void load(false);
        }
      };

      void load(true);
      startPolling();
      document.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('focus', handleFocus);

      return () => {
        isDisposed = true;
        if (intervalId) clearInterval(intervalId);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('focus', handleFocus);
      };
    },
  };
}

export { DEFAULT_POLLING_INTERVAL_MS, EMPTY_PARTNER_REVIEWS_DATA };
