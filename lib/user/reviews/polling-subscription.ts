import {
  EMPTY_USER_REVIEWS_DATA,
  UserReviewsData,
  UserReviewsSubscriptionCallbacks,
  UserReviewsSubscriptionProvider,
} from './types';

const DEFAULT_POLLING_INTERVAL_MS = 12_000;

async function fetchUserReviews(): Promise<UserReviewsData> {
  const response = await fetch('/api/user/reviews');
  if (!response.ok) {
    throw new Error('Değerlendirmeler yüklenemedi');
  }
  return response.json();
}

export interface PollingSubscriptionOptions {
  pollingIntervalMs?: number;
  onNewOperatorResponses?: (newCount: number) => void;
}

export function createPollingUserReviewsSubscription(
  options: PollingSubscriptionOptions = {}
): UserReviewsSubscriptionProvider {
  const { pollingIntervalMs = DEFAULT_POLLING_INTERVAL_MS, onNewOperatorResponses } = options;
  let knownResponses = new Map<string, boolean>();
  let isFirstFetch = true;

  return {
    subscribe(callbacks: UserReviewsSubscriptionCallbacks) {
      let intervalId: ReturnType<typeof setInterval> | null = null;
      let isDisposed = false;

      const load = async (isInitial: boolean) => {
        if (isDisposed) return;

        if (!isInitial) {
          callbacks.onFetching?.();
        }

        try {
          const data = await fetchUserReviews();
          if (isDisposed) return;

          if (!isInitial && !isFirstFetch) {
            const newResponseCount = data.reviews.filter((review) => {
              const hadResponse = knownResponses.get(review.id);
              const hasResponse = Boolean(review.responseText?.trim());
              return hadResponse === false && hasResponse;
            }).length;

            if (newResponseCount > 0) {
              onNewOperatorResponses?.(newResponseCount);
            }
          }

          knownResponses = new Map(
            data.reviews.map((review) => [review.id, Boolean(review.responseText?.trim())])
          );
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

export { DEFAULT_POLLING_INTERVAL_MS, EMPTY_USER_REVIEWS_DATA };
