/** Split from tours-page-client.tsx (Faz 7) — types only. */

import type { LegacyTourCard as Tour } from '@/lib/tours/legacy-tour';

export interface FilterOptions {
  departureCity: string | null;
  region: string | null;
  transportation: string | null;
  duration: string | null;
  period: string | null;
  priceRange: [number, number];
  featured: boolean;
  month: string | null;
  remainingDays: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  tourType: string | null;
  accommodationType: string | null;
  difficultyLevel: string | null;
  ageRestriction: number | null;
  rating: number | null;
  dateRange: [Date | null, Date | null];
  isPopular: boolean;
  isLastMinute: boolean;
  isEarlyBird: boolean;
  languages: string[];
  tags: string[];
}

export interface DepartureCityOption {
  city: string;
  count: number;
}

export interface RegionOption {
  region: string;
  count: number;
}

export type TourDateWithPromotions = Tour['tourDates'][number] & {
  earlyBirdDiscount?: number;
  earlyBirdDeadlineStart?: string | null;
  earlyBirdDeadline?: string | null;
  lastMinuteDiscount?: number;
  lastMinuteStart?: string | null;
  lastMinuteStartEnd?: string | null;
};
