export interface NormalizedItineraryDay {
  dayNumber: number;
  title: string;
  description: string;
  highlights?: string[];
  schedule?: { time?: string; activity?: string }[];
  distance?: string;
  duration?: string;
}

export function normalizeItinerary(itinerary: unknown): NormalizedItineraryDay[] {
  if (!itinerary) return [];

  let data = itinerary;
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch {
      return [];
    }
  }

  if (Array.isArray(data)) {
    return data.map((item, index) => {
      if (typeof item === 'string') {
        return {
          dayNumber: index + 1,
          title: item,
          description: '',
        };
      }

      const dayNumber = typeof item.day === 'number' ? item.day : index + 1;
      const highlights = item.highlights ?? item.activities;

      return {
        dayNumber,
        title: item.title || `${dayNumber}. Gün`,
        description: item.description || '',
        highlights: Array.isArray(highlights) ? highlights : undefined,
        schedule: item.schedule,
        distance: item.distance,
        duration: item.duration,
      };
    });
  }

  if (typeof data === 'object' && data !== null) {
    return Object.entries(data as Record<string, unknown>).map(([key, content], index) => {
      const item = (content || {}) as Record<string, unknown>;
      const dayNumber = key.startsWith('day')
        ? parseInt(key.replace('day', ''), 10) + 1
        : index + 1;
      const highlights = item.highlights ?? item.activities;

      return {
        dayNumber,
        title: (item.title as string) || `${dayNumber}. Gün`,
        description: (item.description as string) || '',
        highlights: Array.isArray(highlights) ? (highlights as string[]) : undefined,
        schedule: item.schedule as NormalizedItineraryDay['schedule'],
        distance: item.distance as string | undefined,
        duration: item.duration as string | undefined,
      };
    });
  }

  return [];
}
