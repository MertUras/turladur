import {
  EMPTY_USER_BOOKINGS_DATA,
  UserBookingsData,
  UserBookingsSubscriptionCallbacks,
  UserBookingsSubscriptionProvider,
} from './types';

const DEFAULT_POLLING_INTERVAL_MS = 12_000;

async function fetchUserBookings(): Promise<UserBookingsData> {
  const response = await fetch('/api/user/bookings');
  if (!response.ok) {
    throw new Error('Rezervasyonlar yüklenemedi');
  }
  return response.json();
}

export interface PollingSubscriptionOptions {
  pollingIntervalMs?: number;
  onNewBookings?: (newCount: number) => void;
  onBookingUpdates?: (updatedCount: number) => void;
}

export function createPollingUserBookingsSubscription(
  options: PollingSubscriptionOptions = {}
): UserBookingsSubscriptionProvider {
  const {
    pollingIntervalMs = DEFAULT_POLLING_INTERVAL_MS,
    onNewBookings,
    onBookingUpdates,
  } = options;

  let knownBookings = new Map<string, string>();
  let isFirstFetch = true;

  return {
    subscribe(callbacks: UserBookingsSubscriptionCallbacks) {
      let intervalId: ReturnType<typeof setInterval> | null = null;
      let isDisposed = false;

      const load = async (isInitial: boolean) => {
        if (isDisposed) return;

        if (!isInitial) {
          callbacks.onFetching?.();
        }

        try {
          const data = await fetchUserBookings();
          if (isDisposed) return;

          if (!isInitial && !isFirstFetch) {
            const incomingIds = data.bookings.map((booking) => booking.id);
            const newCount = incomingIds.filter((id) => !knownBookings.has(id)).length;
            if (newCount > 0) {
              onNewBookings?.(newCount);
            }

            const updatedCount = data.bookings.filter((booking) => {
              const prevStatus = knownBookings.get(booking.id);
              return prevStatus != null && prevStatus !== booking.status;
            }).length;
            if (updatedCount > 0) {
              onBookingUpdates?.(updatedCount);
            }
          }

          knownBookings = new Map(
            data.bookings.map((booking) => [booking.id, booking.status])
          );
          isFirstFetch = false;
          callbacks.onData(data);
        } catch (error) {
          if (!isDisposed) {
            callbacks.onError(
              error instanceof Error ? error : new Error('Rezervasyonlar yüklenemedi')
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

export { DEFAULT_POLLING_INTERVAL_MS, EMPTY_USER_BOOKINGS_DATA };
