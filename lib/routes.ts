import { prisma } from '@/lib/prisma';
import { parseJsonArray } from '@/lib/utils';
import type { Tour, TourOperator } from '@prisma/client';

export type RouteCategory =
  | 'historical'
  | 'nature'
  | 'beach'
  | 'gastronomy'
  | 'family';

export interface RouteDefinition {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  image: string;
  location: string;
  bestTimeToVisit: string;
  weather: string;
  transportation: string;
  duration: string;
  highlights: string[];
  category: RouteCategory;
  /** Lowercase keywords matched against tour name, description, region, destinations, tags */
  matchKeywords: string[];
}

export interface RouteFilters {
  search?: string;
  category?: string;
  duration?: string;
  season?: string;
}

export interface RouteWithStats extends RouteDefinition {
  tourCount: number;
  priceRange: string | null;
  avgRating: number | null;
  computedDuration: string | null;
}

export type TourWithOperator = Tour & { tourOperator: TourOperator | null };

export const ROUTE_CATEGORY_LABELS: Record<
  RouteCategory,
  { name: string; description: string; color: string }
> = {
  historical: {
    name: 'Tarihi & Kültürel',
    description: 'Antik kentler, müzeler ve tarihi mekanlarıyla kültürel keşifler',
    color: 'bg-amber-100 text-amber-600',
  },
  nature: {
    name: 'Doğa & Manzara',
    description: 'Doğal güzelliklerle dolu, fotoğraf tutkunları için ideal rotalar',
    color: 'bg-green-100 text-green-600',
  },
  beach: {
    name: 'Deniz & Plaj',
    description: 'Turkuaz sularla çevrili muhteşem koylar ve plajlar',
    color: 'bg-blue-100 text-blue-600',
  },
  gastronomy: {
    name: 'Gastronomi',
    description: 'Yöresel lezzetler ve mutfak kültürüyle öne çıkan rotalar',
    color: 'bg-red-100 text-red-600',
  },
  family: {
    name: 'Aile Dostu',
    description: 'Çocuklu aileler için ideal, herkesin keyif alabileceği destinasyonlar',
    color: 'bg-purple-100 text-purple-600',
  },
};

export const ROUTE_DEFINITIONS: RouteDefinition[] = [
  {
    id: 'kapadokya',
    name: 'Kapadokya',
    description:
      'Peri bacaları, yeraltı şehirleri ve balon turlarıyla unutulmaz bir deneyim.',
    longDescription: `Kapadokya, Türkiye'nin en etkileyici doğal ve tarihi bölgelerinden biridir. Peri bacaları, yeraltı şehirleri, antik kiliseler ve vadileriyle benzersiz bir deneyim sunar.

Balon turları, at turları, yürüyüş rotaları ve şarap tadımları gibi birçok aktivite seçeneği bulunmaktadır. Bölge, her mevsim farklı güzellikler sunar ve fotoğraf tutkunları için ideal bir destinasyondur.`,
    image:
      'https://images.unsplash.com/photo-1570654230464-9e63b3497a1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    location: 'Nevşehir, Türkiye',
    bestTimeToVisit: 'Nisan - Ekim',
    weather: 'Yazları sıcak (25-35°C), kışları soğuk (-5-5°C)',
    transportation:
      "Nevşehir Havalimanı'na uçuş veya Kayseri Havalimanı'na uçuş + 1 saat transfer",
    duration: '3-4 gün',
    highlights: ['Balon Turu', 'Yeraltı Şehirleri', 'Şarap Tadımı', 'At Turu'],
    category: 'nature',
    matchKeywords: [
      'kapadokya',
      'göreme',
      'urgup',
      'ürgüp',
      'uchisar',
      'uçhisar',
      'avanos',
      'derinkuyu',
      'nevşehir',
      'nevesehir',
      'peri bac',
    ],
  },
  {
    id: 'likya-yolu',
    name: 'Likya Yolu',
    description:
      'Antik Likya uygarlığının izlerini takip eden, deniz manzaralı yürüyüş rotası.',
    longDescription: `Likya Yolu, Akdeniz kıyısı boyunca uzanan dünyanın en güzel yürüyüş rotalarından biridir. Antik Likya kentlerinin kalıntıları, turkuaz koylar ve çam ormanları arasında unutulmaz bir trekking deneyimi sunar.`,
    image:
      'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2080&q=80',
    location: 'Antalya - Muğla, Türkiye',
    bestTimeToVisit: 'Mart - Mayıs, Eylül - Kasım',
    weather: 'Ilıman Akdeniz iklimi',
    transportation: 'Antalya veya Dalaman Havalimanı + kara transferi',
    duration: '7-8 gün',
    highlights: ['Antik Kentler', 'Deniz Manzarası', 'Doğa Yürüyüşü', 'Plajlar'],
    category: 'nature',
    matchKeywords: [
      'likya',
      'lycian',
      'kaş',
      'kas',
      'kalkan',
      'fethiye',
      'olimpos',
      'olympos',
      'demre',
      'kumluca',
      'patara',
      'xanthos',
    ],
  },
  {
    id: 'pamukkale',
    name: 'Pamukkale & Hierapolis',
    description: 'Travertenler ve antik havuzuyla dünyaca ünlü doğa harikası.',
    longDescription: `Pamukkale, beyaz traverten terasları ve üzerindeki Hierapolis antik kentiyle UNESCO Dünya Mirası Listesi'nde yer alan eşsiz bir destinasyondur.`,
    image:
      'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80',
    location: 'Denizli, Türkiye',
    bestTimeToVisit: 'Mart - Kasım',
    weather: 'Yazları sıcak, kışları ılıman',
    transportation: 'Denizli Çardak Havalimanı veya İzmir/Antalya + kara yolu',
    duration: '1-2 gün',
    highlights: ['Travertenler', 'Antik Havuz', 'Hierapolis', 'Kleopatra Havuzu'],
    category: 'historical',
    matchKeywords: ['pamukkale', 'hierapolis', 'denizli', 'traverten', 'kleopatra'],
  },
  {
    id: 'efes',
    name: 'Efes Antik Kenti',
    description: "Roma İmparatorluğu'nun en önemli antik kentlerinden biri.",
    longDescription: `Efes, dünyanın en iyi korunmuş antik kentlerinden biridir. Celsus Kütüphanesi, Büyük Tiyatro ve Artemis Tapınağı kalıntılarıyla tarih meraklılarının vazgeçilmez durağıdır.`,
    image:
      'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80',
    location: 'Selçuk, İzmir',
    bestTimeToVisit: 'Mart - Kasım',
    weather: 'Ilıman Ege iklimi',
    transportation: 'İzmir Adnan Menderes Havalimanı + 1 saat transfer',
    duration: '1 gün',
    highlights: ['Celsus Kütüphanesi', 'Büyük Tiyatro', 'Hadrian Tapınağı', 'Antik Agora'],
    category: 'historical',
    matchKeywords: ['efes', 'ephesus', 'selçuk', 'selcuk', 'meryem ana', 'artemis'],
  },
  {
    id: 'fethiye-oludeniz',
    name: 'Fethiye - Ölüdeniz',
    description: 'Muhteşem koylar ve plajlarla çevrili doğa cenneti.',
    longDescription: `Fethiye ve Ölüdeniz, turkuaz suları, Kelebekler Vadisi ve yamaç paraşütü imkânlarıyla Akdeniz'in en popüler tatil rotalarından biridir.`,
    image:
      'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2080&q=80',
    location: 'Muğla, Türkiye',
    bestTimeToVisit: 'Mayıs - Ekim',
    weather: 'Sıcak yazlar, ılıman kışlar',
    transportation: 'Dalaman Havalimanı + 1 saat transfer',
    duration: '2-3 gün',
    highlights: ['Ölüdeniz Plajı', 'Kelebekler Vadisi', 'Paragliding', 'Tekne Turu'],
    category: 'beach',
    matchKeywords: [
      'fethiye',
      'ölüdeniz',
      'oludeniz',
      'kelebekler vadisi',
      'babadag',
      'babadağ',
    ],
  },
  {
    id: 'istanbul',
    name: 'İstanbul - Tarihi Yarımada',
    description: 'Medeniyetlerin buluşma noktasında binlerce yıllık tarih ve kültür.',
    longDescription: `İstanbul, iki kıtayı birleştiren eşsiz şehir. Ayasofya, Topkapı Sarayı, Kapalıçarşı ve Boğaz manzarasıyla dünyanın en çok ziyaret edilen kültür rotalarından biridir.`,
    image:
      'https://images.unsplash.com/photo-1621867822738-0b8db9ea15e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    location: 'İstanbul, Türkiye',
    bestTimeToVisit: 'Nisan - Haziran, Eylül - Kasım',
    weather: 'Ilıman, nemli',
    transportation: 'İstanbul Havalimanı veya Sabiha Gökçen Havalimanı',
    duration: '3-4 gün',
    highlights: ['Ayasofya', 'Topkapı Sarayı', 'Kapalıçarşı', 'Boğaz Turu'],
    category: 'historical',
    matchKeywords: [
      'istanbul',
      'İstanbul',
      'ayasofya',
      'topkapı',
      'topkapi',
      'kapalıçarşı',
      'kapalicarsi',
      'boğaz',
      'bogaz',
      'tarihi yarımada',
      'sultanahmet',
    ],
  },
];

function normalizeTurkish(text: string): string {
  return text
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function formatPrice(price: number): string {
  return `₺${Math.round(price).toLocaleString('tr-TR')}`;
}

export function getTourDestinations(tour: Tour): string[] {
  const raw = parseJsonArray<string | { city?: string; description?: string }>(
    tour.destinations
  );
  return raw
    .map((item) => {
      if (typeof item === 'string') return item;
      if (item && typeof item === 'object' && item.city) return item.city;
      return '';
    })
    .filter(Boolean);
}

export function getTourSearchableText(tour: Tour): string {
  const destinations = getTourDestinations(tour);
  const tags = parseJsonArray<string>(tour.tags);
  const itinerary = parseJsonArray<{ title?: string; description?: string }>(
    tour.itinerary
  );
  const itineraryText = itinerary
    .flatMap((item) => [item.title, item.description])
    .filter(Boolean);

  return normalizeTurkish(
    [
      tour.name,
      tour.description,
      tour.region,
      tour.tourType,
      tour.period,
      ...destinations,
      ...tags,
      ...itineraryText,
    ]
      .filter(Boolean)
      .join(' ')
  );
}

export function tourMatchesRoute(tour: Tour, route: RouteDefinition): boolean {
  const destinations = getTourDestinations(tour).map(normalizeTurkish);

  const destinationMatch = route.matchKeywords.some((keyword) => {
    const normalized = normalizeTurkish(keyword);
    return destinations.some(
      (dest) => dest.includes(normalized) || normalized.includes(dest)
    );
  });
  if (destinationMatch) return true;

  const nameAndMeta = normalizeTurkish(
    [tour.name, tour.description, tour.region, tour.tourType]
      .filter(Boolean)
      .join(' ')
  );
  return route.matchKeywords.some((keyword) =>
    nameAndMeta.includes(normalizeTurkish(keyword))
  );
}

function matchesDurationFilter(duration: number, filter: string): boolean {
  switch (filter) {
    case '1-day':
      return duration === 1;
    case '2-3-days':
      return duration >= 2 && duration <= 3;
    case '4-7-days':
      return duration >= 4 && duration <= 7;
    case '7-plus-days':
      return duration >= 7;
    default:
      return true;
  }
}

function getTourSeasons(tour: Tour): string[] {
  const seasons = new Set<string>();

  if (tour.period) {
    const period = normalizeTurkish(tour.period);
    if (period.includes('ilkbahar') || period.includes('bahar')) seasons.add('spring');
    if (period.includes('yaz')) seasons.add('summer');
    if (period.includes('sonbahar')) seasons.add('autumn');
    if (period.includes('kis') || period.includes('kış')) seasons.add('winter');
  }

  const dateSources = [
    tour.startDate,
    ...(tour.availableDates ?? []),
  ].filter(Boolean) as Date[];

  for (const date of dateSources) {
    const month = new Date(date).getMonth() + 1;
    if (month >= 3 && month <= 5) seasons.add('spring');
    if (month >= 6 && month <= 8) seasons.add('summer');
    if (month >= 9 && month <= 11) seasons.add('autumn');
    if (month === 12 || month <= 2) seasons.add('winter');
  }

  return Array.from(seasons);
}

export function tourMatchesFilters(tour: Tour, filters: RouteFilters): boolean {
  if (filters.search) {
    const query = normalizeTurkish(filters.search);
    if (!getTourSearchableText(tour).includes(query)) return false;
  }

  if (filters.duration && !matchesDurationFilter(tour.duration, filters.duration)) {
    return false;
  }

  if (filters.season) {
    const seasons = getTourSeasons(tour);
    if (seasons.length > 0 && !seasons.includes(filters.season)) return false;
  }

  return true;
}

function computeDurationRange(tours: Tour[]): string | null {
  if (tours.length === 0) return null;
  const durations = tours.map((t) => t.duration);
  const min = Math.min(...durations);
  const max = Math.max(...durations);
  if (min === max) return `${min} gün`;
  return `${min}-${max} gün`;
}

function computePriceRange(tours: Tour[]): string | null {
  if (tours.length === 0) return null;
  const prices = tours.map((t) => t.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  if (min === max) return formatPrice(min);
  return `${formatPrice(min)} - ${formatPrice(max)}`;
}

function computeAvgRating(tours: Tour[]): number | null {
  const rated = tours.filter((t) => t.rating && t.rating > 0);
  if (rated.length === 0) return null;
  const sum = rated.reduce((acc, t) => acc + (t.rating ?? 0), 0);
  return Math.round((sum / rated.length) * 10) / 10;
}

export function buildRouteWithStats(
  route: RouteDefinition,
  tours: Tour[]
): RouteWithStats {
  return {
    ...route,
    tourCount: tours.length,
    priceRange: computePriceRange(tours),
    avgRating: computeAvgRating(tours),
    computedDuration: computeDurationRange(tours) ?? route.duration,
  };
}

export function groupToursByCategory(
  tours: TourWithOperator[]
): Record<string, TourWithOperator[]> {
  const groups: Record<string, TourWithOperator[]> = {};

  for (const tour of tours) {
    const category = tour.tourType?.trim() || 'Genel Turlar';
    if (!groups[category]) groups[category] = [];
    groups[category].push(tour);
  }

  return groups;
}

export function getRouteDefinition(id: string): RouteDefinition | undefined {
  return ROUTE_DEFINITIONS.find((route) => route.id === id);
}

export async function fetchAllTours(): Promise<TourWithOperator[]> {
  return prisma.tour.findMany({
    include: { tourOperator: true },
    orderBy: [{ featured: 'desc' }, { rating: 'desc' }, { createdAt: 'desc' }],
  });
}

export function getToursForRoute(
  route: RouteDefinition,
  allTours: Tour[],
  filters: RouteFilters = {}
): Tour[] {
  return allTours.filter(
    (tour) => tourMatchesRoute(tour, route) && tourMatchesFilters(tour, filters)
  );
}

export async function getRoutesWithStats(filters: RouteFilters = {}): Promise<{
  routes: RouteWithStats[];
  categories: Array<{
    key: RouteCategory;
    name: string;
    description: string;
    color: string;
    count: number;
  }>;
  stats: {
    routeCount: number;
    tourCount: number;
    operatorCount: number;
    avgRating: number | null;
  };
}> {
  const allTours = await fetchAllTours();

  const routes = ROUTE_DEFINITIONS.map((route) => {
    const matchingTours = getToursForRoute(route, allTours, filters);
    return buildRouteWithStats(route, matchingTours);
  }).filter((route) => {
    if (filters.category && route.category !== filters.category) return false;
    if (filters.search) {
      const query = normalizeTurkish(filters.search);
      const routeText = normalizeTurkish(`${route.name} ${route.description}`);
      const routeNameMatch = routeText.includes(query);
      const hasMatchingTours = route.tourCount > 0;
      if (!routeNameMatch && !hasMatchingTours) return false;
    }
    if (filters.duration || filters.season) {
      return route.tourCount > 0;
    }
    return true;
  });

  const categories = (Object.keys(ROUTE_CATEGORY_LABELS) as RouteCategory[]).map(
    (key) => ({
      key,
      ...ROUTE_CATEGORY_LABELS[key],
      count: routes.filter((r) => r.category === key && r.tourCount > 0).length,
    })
  );

  const uniqueOperators = new Set(
    allTours.map((t) => t.tourOperatorId).filter(Boolean)
  );
  const allMatchedTours = ROUTE_DEFINITIONS.flatMap((route) =>
    getToursForRoute(route, allTours, filters)
  );
  const uniqueTourIds = new Set(allMatchedTours.map((t) => t.id));

  return {
    routes,
    categories,
    stats: {
      routeCount: routes.filter((r) => r.tourCount > 0).length,
      tourCount: uniqueTourIds.size,
      operatorCount: uniqueOperators.size,
      avgRating: computeAvgRating(allMatchedTours),
    },
  };
}

export async function getRouteDetail(
  id: string,
  filters: RouteFilters = {}
): Promise<{
  route: RouteWithStats;
  tours: TourWithOperator[];
  toursByCategory: Record<string, TourWithOperator[]>;
} | null> {
  const routeDef = getRouteDefinition(id);
  if (!routeDef) return null;

  const allTours = await fetchAllTours();
  const matchingTours = getToursForRoute(routeDef, allTours, filters) as TourWithOperator[];

  return {
    route: buildRouteWithStats(routeDef, matchingTours),
    tours: matchingTours,
    toursByCategory: groupToursByCategory(matchingTours),
  };
}
