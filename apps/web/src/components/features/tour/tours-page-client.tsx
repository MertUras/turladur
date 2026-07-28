'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import type { LegacyTourCard as Tour } from '@/lib/tours/legacy-tour';
import { parseJsonString } from '@/lib/tours/parse';
import { DEFAULT_DEPARTURE_CITIES } from '@/lib/departure-cities';
import MembershipBadge from '@/components/features/tour/membership-badge';
import StarRating from '@/components/features/tour/star-rating';
import { getPublicApiBaseUrl } from '@/services/api-client';
import { resolveMediaUrl, shouldUnoptimizeMedia } from '@/lib/media';
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  Search,
  Filter,
  ChevronDown,
  Check,
  X,
  ChevronRight,
  SlidersHorizontal,
  ArrowDownWideNarrow,
  Loader2,
  Heart,
  Eye,
  Zap,
  Shield,
  Award,
  Plane,
  Hotel,
  ShieldCheck,
  ArrowRight,
  Trash2,
  Globe,
} from 'lucide-react';
import React from 'react';

interface FilterOptions {
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

const MOBILE_FILTER_SECTION =
  'bg-white rounded-2xl p-4 shadow-sm border border-neutral-100/80 lg:bg-transparent lg:rounded-none lg:p-0 lg:shadow-none lg:border-0';

const MOBILE_FILTER_INPUT =
  'w-full py-2.5 pl-10 pr-4 border border-neutral-200 rounded-xl text-neutral-800 text-sm bg-neutral-50/50 focus:border-neutral-500 focus:ring-2 focus:ring-neutral-200 focus:bg-white lg:py-2.5 lg:pl-4 lg:rounded-lg lg:bg-white lg:border-gray-300 lg:text-gray-700 lg:focus:border-neutral-950 lg:focus:ring-1 lg:focus:ring-neutral-950';

const MOBILE_DATE_INPUT_CLASS =
  'w-full py-2.5 pl-3 pr-11 border border-neutral-200 rounded-xl text-neutral-800 text-sm bg-neutral-50/50 focus:border-neutral-500 focus:ring-2 focus:ring-neutral-200 focus:bg-white cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer lg:py-2.5 lg:pl-4 lg:pr-10 lg:rounded-lg lg:bg-white lg:border-gray-300 lg:text-gray-700 lg:focus:border-neutral-950 lg:focus:ring-1 lg:focus:ring-neutral-950';

const MOBILE_PRICE_INPUT =
  'w-full py-2.5 px-3 border border-neutral-200 rounded-xl text-neutral-800 text-sm bg-neutral-50/50 focus:border-neutral-500 focus:ring-2 focus:ring-neutral-200 focus:bg-white lg:py-2.5 lg:px-4 lg:rounded-lg lg:bg-white lg:border-gray-300 lg:text-gray-700 lg:focus:border-neutral-950 lg:focus:ring-1 lg:focus:ring-neutral-950';

function countActiveFilters(options: FilterOptions): number {
  let count = 0;
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

interface DepartureCityOption {
  city: string;
  count: number;
}

interface RegionOption {
  region: string;
  count: number;
}

const formatDateParam = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Fiyat formatlama yardımcı fonksiyonu
const formatPrice = (price: number) => {
  return price
    .toLocaleString('tr-TR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
    .replace(/,/g, '.');
};

const mapTourFromApi = (tour: any): Tour => {
  const extras =
    tour.extras &&
    typeof tour.extras === 'object' &&
    !Array.isArray(tour.extras)
      ? tour.extras
      : {};
  const cover =
    resolveMediaUrl(tour.coverUrl) ||
    (Array.isArray(tour.galleryUrls) && tour.galleryUrls[0]
      ? resolveMediaUrl(tour.galleryUrls[0])
      : null) ||
    (Array.isArray(tour.images) ? resolveMediaUrl(tour.images[0]) : null);
  const galleryResolved = Array.isArray(tour.galleryUrls)
    ? tour.galleryUrls.map((u: string) => resolveMediaUrl(u)).filter(Boolean)
    : [];
  const imagesJson = cover
    ? JSON.stringify([cover, ...galleryResolved].filter(Boolean))
    : typeof tour.images === 'string'
      ? tour.images
      : '[]';

  const departureCity = extras.departureCity ?? tour.departureCity ?? null;
  const destinations = extras.destinations ?? tour.destinations ?? [];
  const partner = tour.partner ?? tour.tourOperator ?? null;
  const companyName =
    partner?.companyName ||
    partner?.name ||
    (tour.partnerId === 'seed-partner-demo'
      ? 'Demo Tur & Aktivite'
      : 'Partner');

  return {
    id: String(tour.id),
    name: tour.title || tour.name || '',
    description: tour.description || '',
    price: Number(tour.price ?? 0),
    rating: Number(tour.averageRating ?? tour.rating ?? 0),
    reviewCount: Number(tour.reviewCount ?? 0),
    images: imagesJson,
    departureCity: Array.isArray(departureCity)
      ? departureCity.join(', ')
      : departureCity,
    destinations:
      typeof destinations === 'string'
        ? destinations
        : JSON.stringify(destinations),
    region: extras.region ?? tour.region ?? null,
    duration:
      tour.durationDays != null
        ? String(tour.durationDays)
        : (tour.duration ?? null),
    maxParticipants: Number(
      extras.maxParticipants ?? tour.maxParticipants ?? 0,
    ),
    discount: Number(extras.discount ?? tour.discount ?? 0),
    inclusions: Array.isArray(extras.includes)
      ? JSON.stringify(extras.includes)
      : (tour.inclusions ?? '[]'),
    tourDates: tour.tourDates ?? tour.dates ?? [],
    tourOperator: {
      id: partner?.id || tour.partnerId || '',
      companyName,
      logo: partner?.logo || null,
      membershipTier:
        partner?.membershipTier ||
        (tour.partnerId === 'seed-partner-demo' ? 'SILVER' : null),
    },
  };
};

/** Nest search’e gitmeyen extras filtreleri — client-side. */
function getTourExtrasRecord(
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

function normalizeFilterText(value: string): string {
  return value.trim().toLocaleLowerCase('tr-TR');
}

function matchesClientExtrasFilters(
  tour: Record<string, unknown>,
  filterOptions: FilterOptions,
): boolean {
  const extras = getTourExtrasRecord(tour);

  if (filterOptions.departureCity) {
    const needle = normalizeFilterText(filterOptions.departureCity);
    const dep = extras.departureCity ?? tour.departureCity;
    const cities = (
      Array.isArray(dep) ? dep : dep != null && dep !== '' ? [dep] : []
    )
      .map((city) => normalizeFilterText(String(city)))
      .filter(Boolean);
    if (!cities.some((city) => city === needle || city.includes(needle))) {
      return false;
    }
  }
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

const DEFAULT_TOUR_REGIONS = [
  'Marmara',
  'Ege',
  'Akdeniz',
  'İç Anadolu',
  'Karadeniz',
  'Doğu Anadolu',
  'Güneydoğu Anadolu',
] as const;

const TOURS_FACET_FETCH_LIMIT = 100;

function buildDepartureFacets(
  rows: Record<string, unknown>[],
): DepartureCityOption[] {
  const counts = new Map<string, number>();
  for (const tour of rows) {
    const extras = getTourExtrasRecord(tour);
    const dep = extras.departureCity ?? tour.departureCity;
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

function buildRegionFacets(rows: Record<string, unknown>[]): RegionOption[] {
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

const TOURS_SEARCH_DEBOUNCE_MS = 400;

function ToursPageContent() {
  const searchParams = useSearchParams();
  const durationParam = searchParams.get('duration');
  const featuredParam = searchParams.get('featured');
  const urlSearch = searchParams.get('search') || searchParams.get('q');
  const urlDepartureCity = searchParams.get('departureCity');
  const urlStartDate = searchParams.get('startDate');
  const urlEndDate = searchParams.get('endDate');

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [apiTourRows, setApiTourRows] = useState<Record<string, unknown>[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    departureCity: null,
    region: null,
    transportation: null,
    duration: null,
    period: null,
    priceRange: [0, 10000],
    featured: false,
    month: null,
    remainingDays: null,
    minPrice: null,
    maxPrice: null,
    tourType: null,
    accommodationType: null,
    difficultyLevel: null,
    ageRestriction: null,
    rating: null,
    dateRange: [null, null],
    isPopular: false,
    isLastMinute: false,
    isEarlyBird: false,
    languages: [],
    tags: [],
  });

  const [departureCityOptions, setDepartureCityOptions] = useState<
    DepartureCityOption[]
  >([]);
  const [filteredDepartureCities, setFilteredDepartureCities] = useState<
    DepartureCityOption[]
  >([]);
  const [regionOptions, setRegionOptions] = useState<RegionOption[]>([]);
  const [filteredRegions, setFilteredRegions] = useState<RegionOption[]>([]);
  const [departureSearch, setDepartureSearch] = useState('');
  const [regionSearch, setRegionSearch] = useState('');

  // Sayfalama ve gösterim seçenekleri
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [isLoading, setIsLoading] = useState(false);

  const [loadingMore, setLoadingMore] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const activeFilterCount = useMemo(
    () => countActiveFilters(filterOptions),
    [filterOptions],
  );

  useEffect(() => {
    const cities = DEFAULT_DEPARTURE_CITIES.map((city) => ({ city, count: 0 }));
    const regions = DEFAULT_TOUR_REGIONS.map((region) => ({
      region,
      count: 0,
    }));
    setDepartureCityOptions(cities);
    setFilteredDepartureCities(cities);
    setRegionOptions(regions);
    setFilteredRegions(regions);
  }, []);

  // extras.departureCity / extras.region → facet sayaçları (API facet endpoint yok)
  useEffect(() => {
    const cities = buildDepartureFacets(apiTourRows);
    const regions = buildRegionFacets(apiTourRows);
    setDepartureCityOptions(cities);
    setRegionOptions(regions);

    const departureQuery = normalizeFilterText(departureSearch);
    setFilteredDepartureCities(
      departureQuery
        ? cities.filter((item) =>
            normalizeFilterText(item.city).includes(departureQuery),
          )
        : cities,
    );

    const regionQuery = normalizeFilterText(regionSearch);
    setFilteredRegions(
      regionQuery
        ? regions.filter((item) =>
            normalizeFilterText(item.region).includes(regionQuery),
          )
        : regions,
    );
  }, [apiTourRows, departureSearch, regionSearch]);

  // Hero ve header linklerinden gelen URL parametrelerini uygula
  useEffect(() => {
    if (urlSearch) {
      setSearchTerm((prev) => (prev === urlSearch ? prev : urlSearch));
    }

    setFilterOptions((prev) => {
      const nextDateRange: [Date | null, Date | null] =
        urlStartDate || urlEndDate
          ? [
              urlStartDate ? new Date(`${urlStartDate}T00:00:00`) : null,
              urlEndDate ? new Date(`${urlEndDate}T00:00:00`) : null,
            ]
          : prev.dateRange;

      const nextDepartureCity = urlDepartureCity ?? prev.departureCity;
      const nextDuration = durationParam ?? prev.duration;
      const nextFeatured = featuredParam === 'true' ? true : prev.featured;

      const dateUnchanged =
        (prev.dateRange[0]?.getTime() ?? null) ===
          (nextDateRange[0]?.getTime() ?? null) &&
        (prev.dateRange[1]?.getTime() ?? null) ===
          (nextDateRange[1]?.getTime() ?? null);

      if (
        prev.departureCity === nextDepartureCity &&
        prev.duration === nextDuration &&
        prev.featured === nextFeatured &&
        dateUnchanged
      ) {
        return prev;
      }

      return {
        ...prev,
        departureCity: nextDepartureCity,
        duration: nextDuration,
        featured: nextFeatured,
        dateRange: nextDateRange,
      };
    });
  }, [
    urlSearch,
    urlDepartureCity,
    urlStartDate,
    urlEndDate,
    durationParam,
    featuredParam,
  ]);

  // Sayfalama seçenekleri
  const pageSizeOptions = [15, 30, 45, 60]; // Seçenekleri 15'ten başlayacak şekilde güncelledim

  // Sıralama seçenekleri
  const sortOptions = [
    { value: 'popular', label: 'Popülerlik' },
    { value: 'price-low', label: 'Fiyat (Artan)' },
    { value: 'price-high', label: 'Fiyat (Azalan)' },
    { value: 'duration', label: 'Süre' },
    { value: 'rating', label: 'Değerlendirme' },
    { value: 'date', label: 'Tarih' },
    { value: 'discount', label: 'İndirim Oranı' },
  ];

  // Sıralama fonksiyonu
  const sortTours = (tours: Tour[]) => {
    const sorted = [...tours];
    switch (sortBy) {
      case 'price-low':
        sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'duration':
        sorted.sort((a, b) => (a.duration || 0) - (b.duration || 0));
        break;
      case 'rating':
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'date':
        sorted.sort((a, b) => {
          const dateA = new Date(a.startDate || '');
          const dateB = new Date(b.startDate || '');
          return dateA.getTime() - dateB.getTime();
        });
        break;
      case 'discount':
        sorted.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
      default: // popular
        sorted.sort((a, b) => {
          const scoreA = (b.rating || 0) * 0.7 + (b.reviewCount || 0) * 0.3;
          const scoreB = (a.rating || 0) * 0.7 + (a.reviewCount || 0) * 0.3;
          return scoreA - scoreB;
        });
        break;
    }
    return sorted;
  };

  useEffect(() => {
    // API isteği simülasyonu
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  // Nest’e giden parametreler — extras (bölge/kalkış) her değişimde istek atmaz.
  const serverMinPrice = filterOptions.minPrice;
  const serverMaxPrice = filterOptions.maxPrice;
  const serverFeatured = filterOptions.featured;
  const serverRating = filterOptions.rating;
  const serverDuration = filterOptions.duration;
  const serverTourType = filterOptions.tourType;

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      void (async () => {
        try {
          setIsLoading(true);
          setFetchError(null);

          const nestSort =
            sortBy === 'price-low' || sortBy === 'price-high'
              ? 'price'
              : sortBy === 'rating'
                ? 'rating'
                : sortBy === 'duration'
                  ? 'durationDays'
                  : 'createdAt';

          const params = new URLSearchParams({
            // extras (kalkış/bölge) client-side; facet + filtre için tek seferde yeterince tur çek
            page: '1',
            limit: String(TOURS_FACET_FETCH_LIMIT),
            sortBy: nestSort,
            sortOrder: sortBy === 'price-low' ? 'asc' : 'desc',
          });

          const q = searchTerm.trim();
          if (q) params.set('q', q);

          if (serverMinPrice != null) {
            params.set('minPrice', String(serverMinPrice));
          }
          if (serverMaxPrice != null) {
            params.set('maxPrice', String(serverMaxPrice));
          }
          if (serverFeatured) params.set('featured', 'true');
          if (serverRating != null) {
            params.set('minRating', String(serverRating));
          }
          if (serverDuration) {
            const allowedDurations = new Set(['1', '2-3', '4-6', '7+']);
            if (allowedDurations.has(serverDuration)) {
              params.set('duration', serverDuration);
            } else {
              const days = Number(serverDuration);
              if (Number.isFinite(days) && days >= 1) {
                params.set('durationDays', String(Math.floor(days)));
              }
            }
          }
          if (serverTourType) {
            const category = serverTourType.toUpperCase();
            if (
              [
                'CULTURAL',
                'ADVENTURE',
                'GASTRONOMY',
                'NATURE',
                'CITY',
                'BEACH',
              ].includes(category)
            ) {
              params.set('category', category);
            }
          }

          const response = await fetch(
            `${getPublicApiBaseUrl()}/catalog/tours/search?${params}`,
            {
              headers: { Accept: 'application/json' },
              signal: controller.signal,
            },
          );

          if (response.status === 429) {
            setFetchError(
              'Çok hızlı filtrelediniz. Birkaç saniye bekleyip tekrar deneyin.',
            );
            return;
          }

          const data = await response.json();

          if (response.ok && data.success !== false) {
            const rows = Array.isArray(data.data)
              ? data.data
              : data.tours || [];
            setApiTourRows(rows);
          } else {
            const errMsg =
              typeof data?.error === 'string'
                ? data.error
                : data?.error?.message || data?.message || 'Turlar yüklenemedi';
            setFetchError(errMsg);
            setApiTourRows([]);
          }
        } catch (error) {
          if (error instanceof DOMException && error.name === 'AbortError') {
            return;
          }
          setFetchError('Turlar yüklenirken bir sorun oluştu.');
          setApiTourRows([]);
        } finally {
          if (!controller.signal.aborted) {
            setIsLoading(false);
          }
        }
      })();
    }, TOURS_SEARCH_DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [
    searchTerm,
    sortBy,
    serverMinPrice,
    serverMaxPrice,
    serverFeatured,
    serverRating,
    serverDuration,
    serverTourType,
  ]);

  const filteredTours = useMemo(() => {
    const mapped = apiTourRows
      .filter((tour) => matchesClientExtrasFilters(tour, filterOptions))
      .map(mapTourFromApi);
    return sortTours(mapped);
  }, [apiTourRows, filterOptions, sortBy]);

  const totalTours = filteredTours.length;

  // Filtre veya arama değişince sayfayı başa al
  useEffect(() => {
    setCurrentPage(1);
  }, [filterOptions, searchTerm, sortBy, itemsPerPage]);

  // Filtreleri sıfırla
  const resetFilters = () => {
    setSearchTerm('');
    setFilterOptions({
      departureCity: null,
      region: null,
      transportation: null,
      duration: null,
      period: null,
      priceRange: [0, 10000],
      featured: false,
      month: null,
      remainingDays: null,
      minPrice: null,
      maxPrice: null,
      tourType: null,
      accommodationType: null,
      difficultyLevel: null,
      ageRestriction: null,
      rating: null,
      dateRange: [null, null],
      isPopular: false,
      isLastMinute: false,
      isEarlyBird: false,
      languages: [],
      tags: [],
    });
    setDepartureSearch('');
    setRegionSearch('');
    setFilteredDepartureCities(departureCityOptions);
    setFilteredRegions(regionOptions);
    setSortBy('popular');
  };

  // Sayfalama için hesaplamalar
  const totalItems = filteredTours.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentTours = filteredTours.slice(startIndex, endIndex);

  // Sayfa değiştirme fonksiyonu
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const heroSection = document.querySelector(
      '.bg-gradient-to-r.from-neutral-900.to-neutral-950',
    );
    if (heroSection) {
      const heroBottom =
        heroSection.getBoundingClientRect().bottom + window.scrollY - 20;
      window.scrollTo({ top: heroBottom, behavior: 'smooth' });
    }
  };

  // Sayfalama ve sıralama işlevleri
  const handlePageSizeChange = (size: number) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  // Modern Tur Kartı Bileşeni
  const ModernTourCard = ({ tour }: { tour: Tour }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const getDepartureSuffix = (city: string): string => {
      if (!city) return "'dan";

      // Turkish vowel harmony rules
      const cityLower = city.toLowerCase();
      const vowels = 'aıoueiöü';

      let lastVowel = 'a'; // default to back vowel
      for (let i = cityLower.length - 1; i >= 0; i--) {
        if (vowels.includes(cityLower[i])) {
          lastVowel = cityLower[i];
          break;
        }
      }

      const unvoicedConsonants = 'pçtkfhsş';
      const lastChar = city.slice(-1).toLowerCase();

      const useT = unvoicedConsonants.includes(lastChar);
      const useA = 'aıou'.includes(lastVowel);

      if (useT) {
        return useA ? "'tan" : "'ten";
      } else {
        return useA ? "'dan" : "'den";
      }
    };

    const formatDepartureCity = (
      cityData: string | string[] | null,
    ): string => {
      if (!cityData) return '';
      const cities = (Array.isArray(cityData) ? cityData : [cityData]).filter(
        (c) => c && c.trim() !== '',
      );
      if (cities.length === 0) return '';

      const lastCity = cities[cities.length - 1];
      const suffix = getDepartureSuffix(lastCity);

      if (cities.length === 1) {
        return `${lastCity}${suffix} kalkışlı`;
      }

      const otherCities = cities.slice(0, -1);
      return `${otherCities.join(', ')} ve ${lastCity}${suffix} kalkışlı`;
    };

    const departureText = formatDepartureCity(tour.departureCity);

    const tourImages = parseJsonString<string[]>(tour.images || '[]', []);

    const inclusions = parseJsonString<string[]>(tour.inclusions || '[]', []);
    const features = parseJsonString<string[]>(
      (tour as any).features || '[]',
      [],
    );

    const remainingSpots = (tour.maxParticipants || 0) - 0; // currentParticipants yok
    const reviewCount = tour.reviewCount ?? 0;
    const averageRating = tour.rating ?? 0;

    // Fiyat hesaplama
    const price = tour.price;
    let discountedPrice = price;
    let appliedDiscount = 0;

    // O günün tarihine göre en uygun indirimi bul
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if ((tour as any).tourDates && (tour as any).tourDates.length > 0) {
      for (const tourDate of (tour as any).tourDates) {
        // Erken rezervasyon kontrolü
        if (tourDate.earlyBirdDiscount && tourDate.earlyBirdDiscount > 0) {
          const earlyBirdStart = tourDate.earlyBirdDeadlineStart
            ? new Date(tourDate.earlyBirdDeadlineStart)
            : null;
          const earlyBirdEnd = tourDate.earlyBirdDeadline
            ? new Date(tourDate.earlyBirdDeadline)
            : null;

          if (
            earlyBirdStart &&
            earlyBirdEnd &&
            today >= earlyBirdStart &&
            today <= earlyBirdEnd
          ) {
            const discountAmount =
              tourDate.price * (tourDate.earlyBirdDiscount / 100);
            if (discountAmount > appliedDiscount) {
              appliedDiscount = discountAmount;
              discountedPrice = tourDate.price - discountAmount;
            }
          }
        }

        // Son dakika kontrolü
        if (tourDate.lastMinuteDiscount && tourDate.lastMinuteDiscount > 0) {
          const lastMinuteStart = tourDate.lastMinuteStart
            ? new Date(tourDate.lastMinuteStart)
            : null;
          const lastMinuteEnd = tourDate.lastMinuteStartEnd
            ? new Date(tourDate.lastMinuteStartEnd)
            : null;

          if (
            lastMinuteStart &&
            lastMinuteEnd &&
            today >= lastMinuteStart &&
            today <= lastMinuteEnd
          ) {
            const discountAmount =
              tourDate.price * (tourDate.lastMinuteDiscount / 100);
            if (discountAmount > appliedDiscount) {
              appliedDiscount = discountAmount;
              discountedPrice = tourDate.price - discountAmount;
            }
          }
        }
      }
    }

    // Eğer tarih bazlı indirim yoksa genel tur indirimini uygula
    if (appliedDiscount === 0 && tour.discount && tour.discount > 0) {
      discountedPrice = price * (1 - (tour.discount || 0) / 100);
    }

    const firstDate = (tour as any).tourDates?.[0];
    const tourDateText =
      firstDate?.startDate && firstDate?.endDate
        ? `${format(new Date(firstDate.startDate), 'd MMMM', { locale: tr })} - ${format(new Date(firstDate.endDate), 'd MMMM yyyy', { locale: tr })}`
        : `${tour.duration || 1} Gün`;

    const otherDatesCount = (tour as any).tourDates
      ? (tour as any).tourDates.length - 1
      : 0;

    // Tur için tek ve öncelikli etiket belirle
    const getTourBadge = () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Sadece tarih kısmını al

      // Tur tarihlerini kontrol et
      if ((tour as any).tourDates && (tour as any).tourDates.length > 0) {
        for (const tourDate of (tour as any).tourDates) {
          // Erken rezervasyon kontrolü
          if (tourDate.earlyBirdDiscount && tourDate.earlyBirdDiscount > 0) {
            const earlyBirdStart = tourDate.earlyBirdDeadlineStart
              ? new Date(tourDate.earlyBirdDeadlineStart)
              : null;
            const earlyBirdEnd = tourDate.earlyBirdDeadline
              ? new Date(tourDate.earlyBirdDeadline)
              : null;

            if (
              earlyBirdStart &&
              earlyBirdEnd &&
              today >= earlyBirdStart &&
              today <= earlyBirdEnd
            ) {
              return {
                text: `%${tourDate.earlyBirdDiscount} Erken Rezervasyon`,
                icon: Zap,
                color: 'bg-green-500',
              };
            }
          }

          // Son dakika kontrolü
          if (tourDate.lastMinuteDiscount && tourDate.lastMinuteDiscount > 0) {
            const lastMinuteStart = tourDate.lastMinuteStart
              ? new Date(tourDate.lastMinuteStart)
              : null;
            const lastMinuteEnd = tourDate.lastMinuteStartEnd
              ? new Date(tourDate.lastMinuteStartEnd)
              : null;

            if (
              lastMinuteStart &&
              lastMinuteEnd &&
              today >= lastMinuteStart &&
              today <= lastMinuteEnd
            ) {
              return {
                text: `%${tourDate.lastMinuteDiscount} Son Dakika`,
                icon: Clock,
                color: 'bg-orange-500',
              };
            }
          }
        }
      }

      // Genel tur indirimi kontrolü
      if (tour.discount && tour.discount > 0)
        return {
          text: `%${tour.discount} İndirim`,
          icon: Zap,
          color: 'bg-red-500',
        };
      if (tour.isLastMinute)
        return { text: 'Son Dakika', icon: Clock, color: 'bg-orange-500' };
      if (tour.isEarlyBird)
        return { text: 'Erken Rezervasyon', icon: Zap, color: 'bg-green-500' };

      return null;
    };

    const badge = getTourBadge();

    return (
      <Link
        href={`/tours/${tour.id}`}
        className="block h-full focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200 flex flex-col h-full">
          {/* Görsel Alanı */}
          <div className="relative h-48 overflow-hidden">
            <Image
              src={
                resolveMediaUrl(tourImages[0]) ||
                'https://placehold.co/800x600/e5e7eb/6b7280?text=Tur'
              }
              alt={tour.name || 'Tur görseli'}
              fill
              unoptimized={shouldUnoptimizeMedia(
                resolveMediaUrl(tourImages[0]) || undefined,
              )}
              className={`object-cover transition-transform duration-500 ${
                isHovered ? 'scale-105' : 'scale-100'
              }`}
              priority={true}
            />

            {/* Etiket */}
            {badge && (
              <div
                className={`absolute top-3 left-3 flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold text-white ${badge.color}`}
              >
                <badge.icon className="h-3 w-3" />
                <span>{badge.text}</span>
              </div>
            )}

            {/* Partner üyelik arması (müşteri değerlendirmelerinden otomatik hesaplanır) */}
            <div className={`absolute left-3 ${badge ? 'top-11' : 'top-3'}`}>
              <MembershipBadge
                tier={tour.tourOperator?.membershipTier}
                variant="onImage"
              />
            </div>

            {/* Favori Butonu */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsFavorite(!isFavorite);
              }}
              className={`absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${
                isFavorite ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
              }`}
            >
              <Heart
                className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`}
              />
            </button>

            {/* Kalkış Şehri */}
            {departureText && (
              <div className="absolute bottom-3 left-3 bg-neutral-950/60 backdrop-blur-sm rounded-lg px-2 py-1 max-w-[calc(100%-3rem)]">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
                  <span className="text-white text-xs font-medium truncate">
                    {departureText}
                  </span>
                </div>
              </div>
            )}

            {/* Tur Operatörü */}
            <div className="absolute bottom-3 right-3">
              <div className="relative group/operator">
                <div className="w-6 h-6 rounded-full overflow-hidden border border-white">
                  <Image
                    src={
                      tour.tourOperator?.logo ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        tour.tourOperator?.companyName || 'Partner',
                      )}&background=0EA5E9&color=fff`
                    }
                    alt={tour.tourOperator?.companyName || 'Tur Operatörü'}
                    width={24}
                    height={24}
                    className="object-cover w-full h-full"
                  />
                </div>
                {/* Hover Tooltip */}
                <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover/operator:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                  {tour.tourOperator?.companyName || 'Tur Operatörü'}
                </div>
              </div>
            </div>
          </div>

          {/* İçerik Alanı */}
          <div className="p-4 flex flex-col flex-1">
            {/* Başlık */}
            <h3 className="text-base font-semibold text-gray-900 mb-2 group-hover:text-neutral-950 transition-colors line-clamp-2 leading-tight min-h-[2.5rem]">
              {tour.name}
            </h3>

            {/* Tarih */}
            <div className="mb-3 min-h-[1.25rem]">
              <div className="flex items-center gap-1 text-gray-600 min-w-0">
                <Calendar
                  className="w-3 h-3 text-gray-400 flex-shrink-0"
                  aria-hidden="true"
                />
                <span className="text-xs truncate">{tourDateText}</span>
              </div>
            </div>

            {/* Puanlama */}
            <div className="flex items-center gap-2 mb-3 min-h-[1.5rem]">
              {reviewCount > 0 ? (
                <>
                  <StarRating rating={averageRating} size="sm" />
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {averageRating.toFixed(1)} ({reviewCount})
                  </span>
                </>
              ) : (
                <span className="text-xs text-gray-400">
                  Henüz değerlendirme yok
                </span>
              )}

              {/* Kalan Yer */}
              {remainingSpots <= 10 && remainingSpots > 0 && (
                <div className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-medium flex-shrink-0 ml-auto">
                  Son {remainingSpots}
                </div>
              )}
            </div>

            {/* Fiyat ve Buton */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto min-h-[3rem]">
              <div className="flex flex-col flex-1 min-w-0">
                {(appliedDiscount > 0 || Number(tour.discount) > 0) && (
                  <span className="text-gray-400 text-xs line-through">
                    ₺{formatPrice(price)}
                  </span>
                )}
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-semibold text-gray-900">
                    ₺{formatPrice(discountedPrice)}
                  </span>
                  <span className="text-gray-500 text-xs">kişi</span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <div className="flex items-center gap-1 text-neutral-950 group-hover:text-neutral-800 transition-colors font-medium text-sm">
                  <span>İncele</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
                {otherDatesCount > 0 && (
                  <div className="flex items-center gap-1 text-xs text-green-600 whitespace-nowrap">
                    <Calendar className="w-3 h-3" />
                    <span>+{otherDatesCount} tur tarihi</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  // Yükleme durumu için bileşen
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: itemsPerPage }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse"
          role="status"
          aria-label="Yükleniyor"
        >
          <div className="h-64 bg-gray-200"></div>
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // Sonuç bulunamadı durumu için bileşen
  const NoResults = () => (
    <div
      className="bg-white rounded-xl shadow-md p-8 text-center"
      role="alert"
      aria-live="polite"
    >
      <div className="mx-auto w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
        <Search className="w-10 h-10 text-neutral-600" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">Tur bulunamadı</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Arama kriterlerinize uygun tur bulunamadı. Farklı filtreler deneyebilir
        veya tüm filtreleri temizleyebilirsiniz.
      </p>
      <button
        onClick={resetFilters}
        className="bg-neutral-950 hover:bg-neutral-800 text-white font-medium px-6 py-3 rounded-lg inline-flex items-center transition-colors"
        aria-label="Tüm filtreleri temizle"
      >
        Tüm filtreleri temizle
        <ChevronRight className="w-4 h-4 ml-1" />
      </button>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Bölümü */}
      <div className="relative bg-gradient-to-r from-neutral-900 to-neutral-950 pt-28 pb-12 md:pb-20">
        <div className="absolute inset-0 opacity-10 overflow-hidden">
          <div
            className="absolute inset-0 bg-repeat"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='2'/%3E%3Ccircle cx='13' cy='13' r='2'/%3E%3C/g%3E%3C/svg%3E\")",
            }}
          ></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-20 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center bg-neutral-950/30 backdrop-blur-sm text-neutral-200 rounded-full py-1.5 px-4 text-xs font-medium mb-4">
              <span className="w-2 h-2 bg-neutral-300 rounded-full mr-2"></span>
              En İyi Tur Deneyimleri
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Türkiye'nin <span className="text-white/90">En İyi</span> Turları
            </h1>
            <p className="text-lg text-neutral-200 md:px-8 mb-8">
              Profesyonel rehberler eşliğinde, en iyi tur operatörlerinin özenle
              hazırladığı tur paketleri ile unutulmaz deneyimler yaşayın.
            </p>
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute inset-0 bg-neutral-600 blur-xl opacity-20 rounded-xl"></div>
              <div className="relative flex bg-white rounded-xl p-1.5 shadow-xl">
                <div className="flex-1 flex items-center pl-3">
                  <Search className="h-5 w-5 text-gray-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Tur adı, destinasyon veya aktivite ara..."
                    className="w-full py-3 px-2 outline-none text-gray-700 bg-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <button
                  className="bg-neutral-950 hover:bg-neutral-800 text-white font-medium rounded-lg px-5 py-3 transition-colors flex items-center"
                  onClick={() => {
                    // Zaten sayfadayız, sadece filtreleri uygula
                    setLoading(true);
                    setTimeout(() => setLoading(false), 500);
                  }}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Ara
                </button>
              </div>
            </div>
          </div>

          {/* İstatistikler */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-12 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-white mb-1">100+</div>
              <div className="text-sm text-neutral-200">Tur Rotası</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-white mb-1">50+</div>
              <div className="text-sm text-neutral-200">Tur Operatörü</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-white mb-1">4.8/5</div>
              <div className="text-sm text-neutral-200">Müşteri Puanı</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-white mb-1">24/7</div>
              <div className="text-sm text-neutral-200">Müşteri Desteği</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-20 py-10">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Mobil Filtre Butonu */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="w-full flex items-center gap-2.5 bg-white py-3.5 px-4 rounded-2xl shadow-sm border border-neutral-100/80 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-neutral-100">
                <SlidersHorizontal className="h-4 w-4 text-neutral-950" />
              </div>
              <span className="font-semibold text-neutral-900">Filtreler</span>
              {activeFilterCount > 0 && (
                <span className="bg-neutral-950 text-white text-[11px] font-bold min-w-[1.25rem] h-5 px-1.5 rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
              <ChevronRight className="h-4 w-4 text-neutral-400 ml-auto" />
            </button>
          </div>

          {/* Overlay */}
          {isFilterOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setIsFilterOpen(false)}
              aria-hidden="true"
            />
          )}

          {/* Yandan Açılır Filtre Menüsü */}
          <div
            className={`
            fixed inset-y-0 right-0 w-full max-w-sm lg:max-w-none bg-neutral-50 shadow-2xl transform transition-transform duration-300 ease-in-out z-50
            ${isFilterOpen ? 'translate-x-0' : 'translate-x-full'}
            lg:relative lg:translate-x-0 lg:shadow-none lg:w-72 xl:w-80 lg:z-auto
          `}
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="bg-white border-b border-neutral-100 px-4 pt-4 pb-3 lg:bg-gray-50 lg:border-gray-100 lg:px-6 lg:pt-0 lg:pb-3 flex justify-between items-center shrink-0">
                <h3 className="font-bold text-neutral-900 flex items-center text-base lg:text-inherit">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-100 mr-2.5 lg:bg-transparent lg:w-auto lg:h-auto lg:rounded-none lg:mr-2">
                    <Filter className="h-4 w-4 lg:h-5 lg:w-5 text-neutral-950" />
                  </div>
                  Filtreler
                  {activeFilterCount > 0 && (
                    <span className="ml-2 lg:hidden text-neutral-100 text-neutral-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                      {activeFilterCount} aktif
                    </span>
                  )}
                </h3>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="lg:hidden p-2 -mr-1 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-xl transition-colors"
                  aria-label="Filtreleri kapat"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Scrollable filter content */}
              <div className="flex-1 overflow-y-auto p-4 lg:p-6 pb-28 lg:pb-6">
                <div className="space-y-4 lg:space-y-6">
                  {/* Kalkış Noktası */}
                  <div className={MOBILE_FILTER_SECTION}>
                    <h4 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2 text-sm lg:font-medium">
                      <MapPin className="h-4 w-4 text-neutral-950 lg:hidden shrink-0" />
                      Kalkış Noktası
                    </h4>
                    <div className="relative mb-3">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none lg:hidden" />
                      <input
                        type="text"
                        placeholder="Kalkış noktası ara..."
                        value={departureSearch}
                        className={`${MOBILE_FILTER_INPUT} mb-0 lg:mb-2`}
                        onChange={(e) => {
                          setDepartureSearch(e.target.value);
                        }}
                      />
                    </div>
                    <div className="max-h-44 lg:max-h-60 overflow-y-auto -mx-1 px-1">
                      {filteredDepartureCities.length > 0 ? (
                        <div className="flex flex-wrap gap-2 lg:flex-col lg:space-y-2 lg:gap-0">
                          {filteredDepartureCities.map((item) => {
                            const isSelected =
                              filterOptions.departureCity === item.city;
                            return (
                              <button
                                key={item.city}
                                onClick={() =>
                                  setFilterOptions({
                                    ...filterOptions,
                                    departureCity: isSelected
                                      ? null
                                      : item.city,
                                  })
                                }
                                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-colors lg:w-full lg:justify-start lg:rounded-lg lg:px-3 lg:py-2 lg:font-normal ${
                                  isSelected
                                    ? 'bg-neutral-950 text-white shadow-sm lg:bg-neutral-950'
                                    : 'bg-neutral-100 text-neutral-700 border border-neutral-200/80 hover:bg-neutral-200 lg:border-0 lg:bg-gray-100 lg:hover:bg-gray-200'
                                }`}
                              >
                                <span>{item.city}</span>
                                <span
                                  className={`text-xs ${
                                    isSelected
                                      ? 'text-neutral-200 lg:text-white'
                                      : 'text-neutral-500 lg:text-inherit'
                                  }`}
                                >
                                  ({item.count})
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="px-1 py-2 text-sm text-neutral-500">
                          Kalkış noktası bulunamadı
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Tarih Aralığı */}
                  <div className={MOBILE_FILTER_SECTION}>
                    <h4 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2 text-sm lg:font-medium">
                      <Calendar className="h-4 w-4 text-neutral-950 lg:hidden shrink-0" />
                      Tarih Aralığı
                    </h4>
                    <div className="grid grid-cols-2 gap-2.5 lg:gap-2">
                      <div className="relative">
                        <input
                          type="date"
                          aria-label="Başlangıç tarihi"
                          className={MOBILE_DATE_INPUT_CLASS}
                          value={
                            filterOptions.dateRange[0]
                              ? formatDateParam(filterOptions.dateRange[0])
                              : ''
                          }
                          onChange={(e) =>
                            setFilterOptions({
                              ...filterOptions,
                              dateRange: [
                                e.target.value
                                  ? new Date(`${e.target.value}T00:00:00`)
                                  : null,
                                filterOptions.dateRange[1],
                              ],
                            })
                          }
                        />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 lg:h-5 lg:w-5 text-neutral-400 lg:text-gray-500 pointer-events-none" />
                      </div>
                      <div className="relative">
                        <input
                          type="date"
                          aria-label="Bitiş tarihi"
                          className={MOBILE_DATE_INPUT_CLASS}
                          value={
                            filterOptions.dateRange[1]
                              ? formatDateParam(filterOptions.dateRange[1])
                              : ''
                          }
                          onChange={(e) =>
                            setFilterOptions({
                              ...filterOptions,
                              dateRange: [
                                filterOptions.dateRange[0],
                                e.target.value
                                  ? new Date(`${e.target.value}T00:00:00`)
                                  : null,
                              ],
                            })
                          }
                        />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 lg:h-5 lg:w-5 text-neutral-400 lg:text-gray-500 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Fiyat Aralığı */}
                  <div className={MOBILE_FILTER_SECTION}>
                    <h4 className="font-semibold text-neutral-900 mb-3 text-sm lg:font-medium">
                      Fiyat Aralığı
                    </h4>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          inputMode="numeric"
                          placeholder="Min ₺"
                          className={MOBILE_PRICE_INPUT}
                          value={
                            filterOptions.minPrice
                              ? filterOptions.minPrice.toLocaleString('tr-TR')
                              : ''
                          }
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^\d]/g, '');
                            setFilterOptions({
                              ...filterOptions,
                              minPrice: value ? parseInt(value) : null,
                            });
                          }}
                        />
                      </div>
                      <span className="text-neutral-300 font-light lg:text-gray-400">
                        —
                      </span>
                      <div className="relative flex-1">
                        <input
                          type="text"
                          inputMode="numeric"
                          placeholder="Max ₺"
                          className={MOBILE_PRICE_INPUT}
                          value={
                            filterOptions.maxPrice
                              ? filterOptions.maxPrice.toLocaleString('tr-TR')
                              : ''
                          }
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^\d]/g, '');
                            setFilterOptions({
                              ...filterOptions,
                              maxPrice: value ? parseInt(value) : null,
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bölge */}
                  <div className={MOBILE_FILTER_SECTION}>
                    <h4 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2 text-sm lg:font-medium">
                      <Globe className="h-4 w-4 text-neutral-950 lg:hidden shrink-0" />
                      Bölge
                    </h4>
                    <div className="relative mb-3">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none lg:hidden" />
                      <input
                        type="text"
                        placeholder="Bölge ara..."
                        value={regionSearch}
                        className={`${MOBILE_FILTER_INPUT} mb-0 lg:mb-2`}
                        onChange={(e) => {
                          setRegionSearch(e.target.value);
                        }}
                      />
                    </div>
                    <div className="max-h-44 lg:max-h-60 overflow-y-auto -mx-1 px-1">
                      {filteredRegions.length > 0 ? (
                        <div className="flex flex-wrap gap-2 lg:flex-col lg:space-y-2 lg:gap-0">
                          {filteredRegions.map((item) => {
                            const isSelected =
                              filterOptions.region === item.region;
                            return (
                              <button
                                key={item.region}
                                onClick={() =>
                                  setFilterOptions({
                                    ...filterOptions,
                                    region: isSelected ? null : item.region,
                                  })
                                }
                                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-colors lg:w-full lg:justify-start lg:rounded-lg lg:px-3 lg:py-2 lg:font-normal ${
                                  isSelected
                                    ? 'bg-neutral-950 text-white shadow-sm lg:bg-neutral-950'
                                    : 'bg-neutral-100 text-neutral-700 border border-neutral-200/80 hover:bg-neutral-200 lg:border-0 lg:bg-gray-100 lg:hover:bg-gray-200'
                                }`}
                              >
                                <span>{item.region}</span>
                                <span
                                  className={`text-xs ${
                                    isSelected
                                      ? 'text-neutral-200 lg:text-white'
                                      : 'text-neutral-500 lg:text-inherit'
                                  }`}
                                >
                                  ({item.count})
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="px-1 py-2 text-sm text-neutral-500">
                          Bölge bulunamadı
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sticky mobile footer */}
              <div className="lg:hidden shrink-0 border-t border-neutral-100 bg-white px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
                <div className="flex gap-3">
                  <button
                    onClick={resetFilters}
                    disabled={activeFilterCount === 0}
                    className="flex-1 flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl border border-neutral-200 text-neutral-700 text-sm font-semibold hover:bg-neutral-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="h-4 w-4" />
                    Temizle
                  </button>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="flex-[1.4] py-3 px-4 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white text-sm font-semibold transition-colors shadow-sm"
                  >
                    Filtreleri Uygula
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tur Listesi */}
          <div className="flex-1 min-w-0">
            {/* Başlık ve Filtreler */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-gray-900">Tüm Turlar</h1>
                <div className="h-1 w-16 bg-neutral-950"></div>
              </div>
              {/* Görünüm Seçenekleri */}
              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={() => setView('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    view === 'grid'
                      ? 'bg-neutral-100 text-neutral-950'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    view === 'list'
                      ? 'bg-neutral-100 text-neutral-950'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Sıralama Seçenekleri */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white focus:ring-2 focus:ring-neutral-950 focus:border-neutral-950"
                >
                  <option value="popular">Popülerliğe Göre</option>
                  <option value="price-low">Fiyat (Düşükten Yükseğe)</option>
                  <option value="price-high">Fiyat (Yüksekten Düşüğe)</option>
                  <option value="date">Tarihe Göre</option>
                  <option value="rating">Puana Göre</option>
                </select>
              </div>

              <div className="text-sm text-gray-600">
                {totalTours > 0 ? (
                  <>
                    Toplam{' '}
                    <span className="font-semibold text-gray-800">
                      {totalTours}
                    </span>{' '}
                    tur bulundu
                  </>
                ) : (
                  <span className="text-gray-500">
                    Gösterilecek tur bulunamadı
                  </span>
                )}
              </div>
            </div>

            {/* Yükleme Durumu */}
            {fetchError ? (
              <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                {fetchError}
              </div>
            ) : null}
            {isLoading ? (
              <LoadingSkeleton />
            ) : filteredTours.length === 0 ? (
              <NoResults />
            ) : (
              <>
                {/* Tur Kartları */}
                {view === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                    {currentTours.map((tour) => (
                      <ModernTourCard key={tour.id} tour={tour} />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {currentTours.map((tour) => (
                      <ModernTourCard key={tour.id} tour={tour} />
                    ))}
                  </div>
                )}

                {/* Sayfalama */}
                {totalItems > itemsPerPage && (
                  <div className="mt-8 flex justify-center">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-2 border rounded-md hover:bg-gray-100 disabled:opacity-50 text-gray-700"
                      >
                        Önceki
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-2 rounded-md ${
                              currentPage === page
                                ? 'bg-neutral-950 text-white'
                                : 'border hover:bg-gray-100 text-gray-700'
                            }`}
                          >
                            {page}
                          </button>
                        ),
                      )}

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 border rounded-md hover:bg-gray-100 disabled:opacity-50 text-gray-700"
                      >
                        Sonraki
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ToursPageClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-neutral-950" />
        </div>
      }
    >
      <ToursPageContent />
    </Suspense>
  );
}
