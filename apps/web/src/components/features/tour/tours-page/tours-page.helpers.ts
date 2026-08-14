/** Split from tours-page-client.tsx (Faz 7) — helpers/constants only. */

import type { LegacyTourCard as Tour } from '@/lib/tours/legacy-tour';
import { DEFAULT_DEPARTURE_CITIES } from '@/lib/departure-cities';
import { resolveMediaUrl } from '@/lib/media';
import type {
  DepartureCityOption,
  FilterOptions,
  RegionOption,
} from './tours-page.types';

export const MOBILE_FILTER_SECTION =
  'bg-white rounded-2xl p-4 shadow-sm border border-neutral-100/80 lg:bg-transparent lg:rounded-none lg:p-0 lg:shadow-none lg:border-0';

export const MOBILE_FILTER_INPUT =
  'w-full py-2.5 pl-10 pr-4 border border-neutral-200 rounded-xl text-neutral-800 text-sm bg-neutral-50/50 focus:border-neutral-500 focus:ring-2 focus:ring-neutral-200 focus:bg-white lg:py-2.5 lg:pl-4 lg:rounded-lg lg:bg-white lg:border-gray-300 lg:text-gray-700 lg:focus:border-neutral-950 lg:focus:ring-1 lg:focus:ring-neutral-950';

export const MOBILE_DATE_INPUT_CLASS =
  'w-full py-2.5 pl-3 pr-11 border border-neutral-200 rounded-xl text-neutral-800 text-sm bg-neutral-50/50 focus:border-neutral-500 focus:ring-2 focus:ring-neutral-200 focus:bg-white cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer lg:py-2.5 lg:pl-4 lg:pr-10 lg:rounded-lg lg:bg-white lg:border-gray-300 lg:text-gray-700 lg:focus:border-neutral-950 lg:focus:ring-1 lg:focus:ring-neutral-950';

export const MOBILE_PRICE_INPUT =
  'w-full py-2.5 px-3 border border-neutral-200 rounded-xl text-neutral-800 text-sm bg-neutral-50/50 focus:border-neutral-500 focus:ring-2 focus:ring-neutral-200 focus:bg-white lg:py-2.5 lg:px-4 lg:rounded-lg lg:bg-white lg:border-gray-300 lg:text-gray-700 lg:focus:border-neutral-950 lg:focus:ring-1 lg:focus:ring-neutral-950';

export function countActiveFilters(options: FilterOptions): number {
  let count = 0;
  if (options.stayKind) count++;
  if (options.destinationScope) count++;
  if (options.departureCity) count++;
  if (options.region) count++;
  if (options.minPrice != null) count++;
  if (options.maxPrice != null) count++;
  if (options.dateRange[0] || options.dateRange[1]) count++;
  if (options.transportation) count++;
  if (options.duration) count++;
  if (options.period) count++;
  if (options.featured) count++;
  if (options.rating) count++;
  if (options.isPopular || options.isLastMinute || options.isEarlyBird) count++;
  return count;
}

export const formatDateParam = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Fiyat formatlama yardımcı fonksiyonu
export const formatPrice = (price: number) => {
  return price
    .toLocaleString('tr-TR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
    .replace(/,/g, '.');
};

export function readPartnerRecord(
  value: unknown,
): Record<string, unknown> | null {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

export const mapTourFromApi = (tour: Record<string, unknown>): Tour => {
  const extras = getTourExtrasRecord(tour);
  const cover =
    resolveMediaUrl(
      typeof tour.coverUrl === 'string' ? tour.coverUrl : undefined,
    ) ||
    (Array.isArray(tour.galleryUrls) && typeof tour.galleryUrls[0] === 'string'
      ? resolveMediaUrl(tour.galleryUrls[0])
      : null) ||
    (Array.isArray(tour.images) && typeof tour.images[0] === 'string'
      ? resolveMediaUrl(tour.images[0])
      : null);
  const galleryResolved = Array.isArray(tour.galleryUrls)
    ? tour.galleryUrls
        .map((url) => (typeof url === 'string' ? resolveMediaUrl(url) : null))
        .filter(Boolean)
    : [];
  const imagesJson = cover
    ? JSON.stringify([cover, ...galleryResolved].filter(Boolean))
    : typeof tour.images === 'string'
      ? tour.images
      : '[]';

  const departureCity =
    extras.departureCity ?? tour.departureCities ?? tour.departureCity ?? null;
  const destinations = extras.destinations ?? tour.destinations ?? [];
  const partner =
    readPartnerRecord(tour.partner) ?? readPartnerRecord(tour.tourOperator);
  const partnerId =
    typeof tour.partnerId === 'string' ? tour.partnerId : undefined;
  const companyName =
    (typeof partner?.companyName === 'string' ? partner.companyName : null) ||
    (typeof partner?.name === 'string' ? partner.name : null) ||
    (partnerId === 'seed-partner-demo' ? 'Demo Tur & Aktivite' : 'Partner');

  const rawTourDates = Array.isArray(tour.tourDates)
    ? tour.tourDates
    : Array.isArray(tour.dates)
      ? tour.dates
      : [];

  return {
    id: String(tour.id),
    name:
      (typeof tour.title === 'string' ? tour.title : '') ||
      (typeof tour.name === 'string' ? tour.name : '') ||
      '',
    description: typeof tour.description === 'string' ? tour.description : '',
    price: Number(tour.price ?? 0),
    rating: Number(tour.averageRating ?? tour.rating ?? 0),
    reviewCount: Number(tour.reviewCount ?? 0),
    images: imagesJson,
    departureCity: Array.isArray(departureCity)
      ? departureCity.join(', ')
      : (departureCity as string | null),
    destinations:
      typeof destinations === 'string'
        ? destinations
        : JSON.stringify(destinations),
    region:
      typeof extras.region === 'string'
        ? extras.region
        : typeof tour.region === 'string'
          ? tour.region
          : null,
    duration:
      tour.durationDays != null
        ? String(tour.durationDays)
        : typeof tour.duration === 'string' || typeof tour.duration === 'number'
          ? tour.duration
          : null,
    maxParticipants: Number(
      extras.maxParticipants ?? tour.maxParticipants ?? 0,
    ),
    discount: Number(extras.discount ?? tour.discount ?? 0),
    inclusions: Array.isArray(extras.includes)
      ? JSON.stringify(extras.includes)
      : typeof tour.inclusions === 'string'
        ? tour.inclusions
        : '[]',
    tourDates: rawTourDates as Tour['tourDates'],
    tourOperator: {
      id:
        (typeof partner?.id === 'string' ? partner.id : '') || partnerId || '',
      companyName,
      logo: typeof partner?.logo === 'string' ? partner.logo : null,
      membershipTier: ((typeof partner?.membershipTier === 'string'
        ? partner.membershipTier
        : null) || (partnerId === 'seed-partner-demo' ? 'SILVER' : null)) as
        'BRONZE' | 'SILVER' | 'GOLD' | null,
    },
  };
};

/** Nest search’e gitmeyen extras filtreleri — client-side. */
export function getTourExtrasRecord(
  tour: Record<string, unknown>,
): Record<string, unknown> {
  if (
    tour.extras &&
    typeof tour.extras === 'object' &&
    !Array.isArray(tour.extras)
  ) {
    return tour.extras as Record<string, unknown>;
  }
  return {};
}

export function normalizeFilterText(value: string): string {
  return value.trim().toLocaleLowerCase('tr-TR');
}

export function matchesClientExtrasFilters(
  tour: Record<string, unknown>,
  filterOptions: FilterOptions,
): boolean {
  const extras = getTourExtrasRecord(tour);

  if (filterOptions.region) {
    const needle = normalizeFilterText(filterOptions.region);
    const region = normalizeFilterText(
      String(extras.region ?? tour.region ?? ''),
    );
    if (!region || !(region === needle || region.includes(needle))) {
      return false;
    }
  }
  if (filterOptions.transportation) {
    const needle = normalizeFilterText(filterOptions.transportation);
    const transportation = normalizeFilterText(
      String(extras.transportation ?? ''),
    );
    if (
      !transportation ||
      !(transportation === needle || transportation.includes(needle))
    ) {
      return false;
    }
  }
  if (filterOptions.period) {
    const needle = normalizeFilterText(filterOptions.period);
    const period = normalizeFilterText(String(extras.period ?? ''));
    if (!period || !(period === needle || period.includes(needle))) {
      return false;
    }
  }
  return true;
}

export const DEFAULT_TOUR_REGIONS = [
  'Marmara',
  'Ege',
  'Akdeniz',
  'İç Anadolu',
  'Karadeniz',
  'Doğu Anadolu',
  'Güneydoğu Anadolu',
] as const;

export const TOURS_FACET_FETCH_LIMIT = 100;

export function buildDepartureFacets(
  rows: Record<string, unknown>[],
): DepartureCityOption[] {
  const counts = new Map<string, number>();
  for (const tour of rows) {
    const extras = getTourExtrasRecord(tour);
    const dep =
      extras.departureCity ?? tour.departureCities ?? tour.departureCity;
    const cities = Array.isArray(dep)
      ? dep
      : dep != null && dep !== ''
        ? [dep]
        : [];
    for (const cityRaw of cities) {
      const city = String(cityRaw).trim();
      if (!city) continue;
      counts.set(city, (counts.get(city) ?? 0) + 1);
    }
  }

  const seen = new Set<string>();
  const options: DepartureCityOption[] = [];
  for (const city of DEFAULT_DEPARTURE_CITIES) {
    seen.add(city);
    options.push({ city, count: counts.get(city) ?? 0 });
  }
  for (const [city, count] of counts) {
    if (seen.has(city)) continue;
    seen.add(city);
    options.push({ city, count });
  }
  return options.sort(
    (a, b) => b.count - a.count || a.city.localeCompare(b.city, 'tr'),
  );
}

export function buildRegionFacets(
  rows: Record<string, unknown>[],
): RegionOption[] {
  const counts = new Map<string, number>();
  for (const tour of rows) {
    const extras = getTourExtrasRecord(tour);
    const region = String(extras.region ?? tour.region ?? '').trim();
    if (!region) continue;
    counts.set(region, (counts.get(region) ?? 0) + 1);
  }

  const seen = new Set<string>();
  const options: RegionOption[] = [];
  for (const region of DEFAULT_TOUR_REGIONS) {
    seen.add(region);
    options.push({ region, count: counts.get(region) ?? 0 });
  }
  for (const [region, count] of counts) {
    if (seen.has(region)) continue;
    seen.add(region);
    options.push({ region, count });
  }
  return options.sort(
    (a, b) => b.count - a.count || a.region.localeCompare(b.region, 'tr'),
  );
}

export const TOURS_SEARCH_DEBOUNCE_MS = 400;
