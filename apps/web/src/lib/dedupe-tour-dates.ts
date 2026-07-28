/** Prefer the window that already sold seats (lower remaining / availableSeats). */
export function dedupeTourDatesByRange<
  T extends {
    id: string;
    startDate: Date | string;
    endDate: Date | string;
    availableSeats?: number;
  },
>(dates: T[]): T[] {
  const byRange = new Map<string, T>();

  for (const date of dates) {
    const start = new Date(date.startDate).toISOString().slice(0, 10);
    const end = new Date(date.endDate).toISOString().slice(0, 10);
    const key = `${start}|${end}`;
    const previous = byRange.get(key);

    if (!previous) {
      byRange.set(key, date);
      continue;
    }

    const previousSeats = previous.availableSeats ?? Number.POSITIVE_INFINITY;
    const nextSeats = date.availableSeats ?? Number.POSITIVE_INFINITY;
    if (nextSeats < previousSeats) {
      byRange.set(key, date);
    }
  }

  return [...byRange.values()].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
  );
}
