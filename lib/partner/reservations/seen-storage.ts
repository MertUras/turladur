const SEEN_KEY_PREFIX = 'turladur-partner-reservations-seen';
const BASELINE_KEY_PREFIX = 'turladur-partner-reservations-seen-baseline-v2';

function keysForUser(userKey: string) {
  return {
    seen: `${SEEN_KEY_PREFIX}:${userKey}`,
    baseline: `${BASELINE_KEY_PREFIX}:${userKey}`,
  };
}

export function readSeenReservationIds(userKey: string): Set<string> {
  if (typeof window === 'undefined' || !userKey) return new Set();
  try {
    const raw = localStorage.getItem(keysForUser(userKey).seen);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((id): id is string => typeof id === 'string'));
  } catch {
    return new Set();
  }
}

export function writeSeenReservationIds(
  userKey: string,
  ids: Set<string>,
): void {
  if (typeof window === 'undefined' || !userKey) return;
  localStorage.setItem(keysForUser(userKey).seen, JSON.stringify([...ids]));
}

/**
 * First time on this browser: mark every reservation currently in the list as "seen"
 * so only bookings that arrive later show the red dot. Empty list → nothing pre-seen.
 */
export function ensureSeenBaseline(
  userKey: string,
  currentReservationIds: string[],
  /** Newest booking id — left out of “seen” on first baseline so it shows the red dot */
  keepUnseenId?: string | null,
): Set<string> {
  if (typeof window === 'undefined' || !userKey) return new Set();

  const { baseline } = keysForUser(userKey);
  const baselineDone = localStorage.getItem(baseline);
  if (baselineDone) {
    return readSeenReservationIds(userKey);
  }

  localStorage.setItem(baseline, '1');
  const initial = new Set(currentReservationIds);
  if (keepUnseenId) {
    initial.delete(keepUnseenId);
  }
  writeSeenReservationIds(userKey, initial);
  return readSeenReservationIds(userKey);
}

export function markReservationSeen(userKey: string, id: string): Set<string> {
  const next = readSeenReservationIds(userKey);
  next.add(id);
  writeSeenReservationIds(userKey, next);
  return next;
}

export function isReservationUnseen(id: string, seenIds: Set<string>): boolean {
  return !seenIds.has(id);
}
