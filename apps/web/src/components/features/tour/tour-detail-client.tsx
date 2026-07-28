'use client';

import { getPublicApiBaseUrl } from '@/services/api-client';
import { dedupeTourDatesByRange } from '@/lib/dedupe-tour-dates';
import { resolveMediaUrl, shouldUnoptimizeMedia } from '@/lib/media';

import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { parseJsonString } from '@/lib/format';
import BottomBookingBar, {
  type ActivityDate as BookingActivityDate,
} from '@/components/booking/bottom-booking-bar';
import TourItineraryMobile from '@/components/features/tour/itinerary/tour-itinerary-mobile';
import { stripDayPrefixFromTitle } from '@/components/features/tour/itinerary/normalize-itinerary';
import MembershipBadge from '@/components/features/tour/membership-badge';
import OperatorReviewsSection, {
  OperatorReview,
} from '@/components/features/tour-operator/OperatorReviewsSection';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'next/navigation';

// Heroicons bileşenlerini içe aktarıyoruz
import {
  MapPin as MapPinIcon,
  Clock as ClockIcon,
  Users as UserGroupIcon,
  CalendarDays as CalendarDaysIcon,
  CheckCircle as CheckCircleIcon,
  XCircle as XCircleIcon,
  Image as PhotoIcon,
  Map as MapIcon,
  Heart as HeartIcon,
  Share2 as ShareIcon,
  DollarSign as CurrencyDollarIcon,
  Star as StarIcon,
  Check as CheckIcon,
  ChevronRight as ChevronRightIcon,
  Mail as EnvelopeIcon,
  ArrowRight as ArrowRightIcon,
  MessageCircle as ChatBubbleLeftRightIcon,
  ChevronDown as ChevronDownIcon,
  Building2 as BuildingOfficeIcon,
  Globe as GlobeAltIcon,
  ChevronLeft as ChevronLeftIcon,
  Sun as SunIcon,
  Moon as MoonIcon,
  ShieldCheck as ShieldCheckIcon,
  Phone as PhoneIcon,
  AlertCircle as ExclamationCircleIcon,
} from 'lucide-react';

// Solid ikonları
import { Star as StarIconSolid } from 'lucide-react';

interface TourOperator {
  id: string;
  companyName: string;
  logo: string | null;
  description: string | null;
  rating?: number | null;
  reviewCount?: number;
  membershipTier?: 'BRONZE' | 'SILVER' | 'GOLD' | null;
  reviews?: OperatorReview[];
}

interface Destination {
  city: string;
  description: string;
}

type TourDestination = string | Destination;

interface TourDate {
  id: string;
  startDate: Date;
  endDate: Date;
  price: number;
  availableSeats: number;
  ageRanges: {
    id: string;
    minAge: number;
    maxAge: number | null;
    pricingType: 'free' | 'half' | 'percentage' | 'fixed';
    value: number;
  }[];
  earlyBirdDiscount?: number;
  earlyBirdDeadline?: string;
  lastMinuteDiscount?: number;
  lastMinuteStart?: string;
  minParticipants?: number;
}

interface Tour {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  discount: number | null;
  startDate: Date | null;
  endDate: Date | null;
  maxParticipants: number | null;
  destinations: TourDestination[];
  inclusions: string[];
  exclusions: string[];
  healthPrivileges: string[];
  itinerary: any;
  images: string[];
  featured: boolean;
  departureCity: string | null;
  region: string | null;
  transportation: string | null;
  period: string | null;
  rating: number | null;
  tourType: string | null;
  accommodationType: string | null;
  difficultyLevel: string | null;
  ageRestriction: number | null;
  isPopular: boolean;
  isLastMinute: boolean;
  isEarlyBird: boolean;
  languages: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  tourOperatorId: string;
  tourOperator: TourOperator;
  tourDates: TourDate[];
  accommodation: {
    name: string;
    image: string;
    location: string;
    type: string;
    rating: number;
    features: string[];
  };
  meetingPoint?: string;
  meetingPointAddress?: string;
  meetingTime?: string;
  pickupPoints?: {
    id: string;
    city: string;
    location: string;
    description?: string;
    time: string;
    isActive: boolean;
    order: number;
  }[];
}

interface TourPageProps {
  params: {
    id: string;
  };
}

// Yaş aralığı gösterimi için yardımcı fonksiyon
function formatAgeRange(minAge: number, maxAge: number | null): string {
  if (maxAge === null) {
    return `${minAge}+`;
  }
  return `${minAge}-${maxAge}`;
}

function formatPricing(
  pricingType: string,
  value: number,
  basePrice: number,
): string {
  switch (pricingType) {
    case 'free':
      return 'Ücretsiz';
    case 'percentage':
      return `%${value} İndirimli`;
    case 'fixed':
      return `${value.toLocaleString('tr-TR')} ₺`;
    default:
      return `${value.toLocaleString('tr-TR')} ₺`;
  }
}

function getDestinationLabel(destination: TourDestination): string {
  if (typeof destination === 'string') return destination;
  return destination?.city ?? '';
}

function buildFallbackItinerary(
  durationDays: number,
  destinationNames: string[],
): Record<string, unknown> {
  const days = Math.max(1, durationDays || 1);
  const itinerary: Record<string, unknown> = {};
  for (let index = 0; index < days; index += 1) {
    const city = destinationNames[index] || destinationNames[0] || '';
    const isFirst = index === 0;
    const isLast = index === days - 1;
    itinerary[`day${index}`] = {
      title: city
        ? `${index + 1}. Gün - ${city}`
        : `${index + 1}. Gün programı`,
      description: isFirst
        ? 'Buluşma noktasında toplanma, rehber tanışması ve tur başlangıcı.'
        : isLast
          ? 'Programın tamamlanması, serbest zaman ve dönüş hazırlığı.'
          : 'Rehber eşliğinde destinasyon gezisi, önemli noktaların ziyareti ve günlük aktiviteler.',
      highlights: city ? [`${city} gezisi`] : ['Günlük program'],
      schedule: [],
    };
  }
  return itinerary;
}

export default function TourDetailClient() {
  const params = useParams();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTourDate, setSelectedTourDate] = useState<TourDate | null>(
    null,
  );
  const [showDateSelectionHint, setShowDateSelectionHint] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [participants, setParticipants] = useState<{ [key: string]: number }>(
    {},
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const pickupSliderRef = useRef<HTMLDivElement>(null);
  const tourRef = useRef<Tour | null>(null);
  tourRef.current = tour;
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [tourCount, setTourCount] = useState(0);
  const [tourOperator, setTourOperator] = useState<TourOperator | null>(null);
  const [otherTours, setOtherTours] = useState<Tour[]>([]);

  const scrollPickupSlider = (direction: 'prev' | 'next') => {
    const el = pickupSliderRef.current;
    if (!el) return;
    const firstCard = el.querySelector<HTMLElement>('[data-pickup-slide]');
    const amount = firstCard
      ? firstCard.offsetWidth + 16
      : Math.min(320, el.clientWidth * 0.9);
    el.scrollBy({
      left: direction === 'next' ? amount : -amount,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const rawId = params.id;
    const tourId = Array.isArray(rawId)
      ? String(rawId[0] ?? '')
      : String(rawId ?? '');
    if (!tourId) return;

    const abortController = new AbortController();
    let cancelled = false;

    const fetchJson = async <T,>(url: string): Promise<T | null> => {
      try {
        const response = await fetch(url, {
          headers: { Accept: 'application/json' },
          cache: 'no-store',
          signal: abortController.signal,
        });
        const raw = (await response.json()) as {
          success?: boolean;
          data?: T;
          error?: { message?: string };
        };
        if (!response.ok || raw.success === false) {
          console.error('Tour detail API error', {
            url,
            status: response.status,
            error: raw.error,
          });
          return null;
        }
        // `data: null` is valid (e.g. no accommodation) — do not fall back to raw envelope
        if (Object.prototype.hasOwnProperty.call(raw, 'data')) {
          return raw.data as T;
        }
        return raw as T;
      } catch (err) {
        if (
          abortController.signal.aborted ||
          (err instanceof Error &&
            (err.name === 'AbortError' || err.name === 'TimeoutError'))
        ) {
          return null;
        }
        console.error('Tour detail fetch failed', { url, err });
        return null;
      }
    };

    const mapPricingType = (
      type: string | undefined,
    ): 'free' | 'half' | 'percentage' | 'fixed' => {
      const normalized = (type ?? '').toLowerCase();
      if (normalized === 'free') return 'free';
      if (normalized === 'half') return 'half';
      if (normalized === 'percentage') return 'percentage';
      if (normalized === 'fixed') return 'fixed';
      return 'fixed';
    };

    const toItineraryRecord = (value: unknown): Record<string, unknown> => {
      if (!value) return {};
      if (Array.isArray(value)) {
        return Object.fromEntries(
          value.map((item, index) => {
            if (typeof item === 'string') {
              return [
                `day${index}`,
                { title: `${index + 1}. Gün`, description: item },
              ];
            }
            if (item && typeof item === 'object') {
              const row = item as Record<string, unknown>;
              return [
                `day${index}`,
                {
                  title: String(row.title ?? `${index + 1}. Gün`),
                  description: String(row.description ?? ''),
                  highlights: Array.isArray(row.highlights)
                    ? row.highlights
                    : [],
                  schedule: Array.isArray(row.schedule) ? row.schedule : [],
                },
              ];
            }
            return [
              `day${index}`,
              { title: `${index + 1}. Gün`, description: '' },
            ];
          }),
        );
      }
      if (typeof value === 'object') return value as Record<string, unknown>;
      return {};
    };

    const fetchTour = async () => {
      try {
        const hasCachedTour = tourRef.current?.id === tourId;
        if (!hasCachedTour) {
          setLoading(true);
        }
        setError(null);

        const loadCore = async () =>
          Promise.all([
            fetchJson<Record<string, unknown>>(
              `${getPublicApiBaseUrl()}/catalog/tours/${tourId}`,
            ),
            fetchJson<
              Array<{
                id: string;
                startDate: string;
                endDate: string;
                capacity: number;
                remainingCapacity: number;
                priceOverride: string | null;
              }>
            >(`${getPublicApiBaseUrl()}/catalog/tours/${tourId}/dates`),
            fetchJson<{
              name: string;
              image: string;
              location: string;
              type: string;
              rating?: number;
              features?: string[];
            } | null>(
              `${getPublicApiBaseUrl()}/catalog/tours/${tourId}/accommodation`,
            ),
            fetchJson<
              Array<{
                id: string;
                city: string;
                location: string;
                description?: string | null;
                time: string;
                isActive?: boolean;
                order?: number;
              }>
            >(`${getPublicApiBaseUrl()}/catalog/tours/${tourId}/pickup-points`),
          ]);

        let [data, dates, accommodation, pickupPoints] = await loadCore();

        // Geri tuşu / kısa süreli ağ kopması: bir kez yeniden dene
        if (!data && !cancelled && !abortController.signal.aborted) {
          await new Promise((resolve) => setTimeout(resolve, 250));
          if (!cancelled && !abortController.signal.aborted) {
            [data, dates, accommodation, pickupPoints] = await loadCore();
          }
        }

        if (cancelled || abortController.signal.aborted) return;

        if (!data) {
          // Önceki başarılı turu bozma (bfcache / race)
          if (tourRef.current?.id === tourId) {
            setError(null);
            return;
          }
          throw new Error(
            `Tur detayları alınamadı (id: ${tourId}). API çalışıyor mu? (${getPublicApiBaseUrl()})`,
          );
        }

        const extras =
          data.extras &&
          typeof data.extras === 'object' &&
          !Array.isArray(data.extras)
            ? (data.extras as Record<string, unknown>)
            : {};

        const coverUrl = resolveMediaUrl(
          typeof data.coverUrl === 'string' ? data.coverUrl : null,
        );
        const galleryUrls = Array.isArray(data.galleryUrls)
          ? (data.galleryUrls as string[])
              .map((url) => resolveMediaUrl(url))
              .filter((url): url is string => Boolean(url))
          : [];
        const images = [
          ...(coverUrl ? [coverUrl] : []),
          ...galleryUrls.filter((url) => url !== coverUrl),
        ];

        const basePrice = Number(data.price ?? 0);
        const dateRows = Array.isArray(dates) ? dates : [];

        const tourDates: TourDate[] = await Promise.all(
          dateRows.map(async (date) => {
            const ageRangesRaw = await fetchJson<
              Array<{
                id: string;
                minAge: number;
                maxAge: number | null;
                pricingType: string;
                value: number;
              }>
            >(
              `${getPublicApiBaseUrl()}/catalog/tours/${tourId}/dates/${date.id}/age-ranges`,
            );

            return {
              id: date.id,
              startDate: new Date(date.startDate),
              endDate: new Date(date.endDate),
              price:
                date.priceOverride != null
                  ? Number(date.priceOverride)
                  : basePrice,
              availableSeats: date.remainingCapacity ?? date.capacity ?? 0,
              ageRanges: (ageRangesRaw ?? []).map((range) => ({
                id: range.id,
                minAge: range.minAge,
                maxAge: range.maxAge,
                pricingType: mapPricingType(range.pricingType),
                value: Number(range.value ?? 0),
              })),
            };
          }),
        );

        if (cancelled || abortController.signal.aborted) return;

        const destinationsRaw = extras.destinations ?? data.destinations ?? [];
        const destinations: TourDestination[] = Array.isArray(destinationsRaw)
          ? destinationsRaw.map((item) => {
              if (typeof item === 'string') return item;
              if (item && typeof item === 'object' && 'city' in item) {
                return {
                  city: String((item as Destination).city ?? ''),
                  description: String((item as Destination).description ?? ''),
                };
              }
              return String(item);
            })
          : [];

        // Seed / boş extras: başlıktan destinasyon çıkar (Ankara — Kapadokya)
        if (destinations.length === 0) {
          const title = String(data.title ?? '');
          const parts = title
            .split(/—|–|-/)
            .map((part) => part.trim())
            .filter(Boolean);
          for (const part of parts.slice(0, 2)) {
            destinations.push({ city: part, description: '' });
          }
        }

        const departureCityRaw =
          extras.departureCity ?? data.departureCity ?? null;
        const departureCity = Array.isArray(departureCityRaw)
          ? departureCityRaw
              .filter((v): v is string => typeof v === 'string')
              .join(', ')
          : typeof departureCityRaw === 'string'
            ? departureCityRaw
            : destinations[0]
              ? getDestinationLabel(destinations[0])
              : null;

        const durationDays = Number(data.durationDays ?? data.duration ?? 1);
        let itinerary = toItineraryRecord(extras.itinerary ?? data.itinerary);
        if (Object.keys(itinerary).length === 0) {
          itinerary = buildFallbackItinerary(
            durationDays,
            destinations.map(getDestinationLabel),
          );
        }

        const partnerId = String(data.partnerId ?? '');
        const partnerPayload =
          data.partner && typeof data.partner === 'object'
            ? (data.partner as {
                id?: string;
                companyName?: string;
                logo?: string | null;
                membershipTier?: 'BRONZE' | 'SILVER' | 'GOLD';
                averageRating?: string | number;
                reviewCount?: number;
              })
            : null;
        const partnerName =
          partnerPayload?.companyName ||
          (partnerId === 'seed-partner-demo'
            ? 'Demo Tur & Aktivite'
            : 'Tur Operatörü');
        const partnerTier =
          partnerPayload?.membershipTier ||
          (partnerId === 'seed-partner-demo' ? 'SILVER' : null);

        const transformedTour: Tour = {
          id: String(data.id),
          name: String(data.title ?? data.name ?? ''),
          description: String(data.description ?? ''),
          duration: durationDays,
          price: basePrice,
          discount: Number(extras.discount ?? data.discount ?? 0) || null,
          startDate: extras.startDate
            ? new Date(String(extras.startDate))
            : null,
          endDate: extras.endDate ? new Date(String(extras.endDate)) : null,
          maxParticipants:
            extras.maxParticipants != null
              ? Number(extras.maxParticipants)
              : 20,
          destinations,
          inclusions: Array.isArray(extras.includes)
            ? (extras.includes as string[])
            : Array.isArray(extras.inclusions)
              ? (extras.inclusions as string[])
              : [
                  'Profesyonel tur rehberi',
                  'Ulaşım (belirtilen kalkış noktalarından)',
                  'Konaklama (program dahilse)',
                ],
          exclusions: Array.isArray(extras.excludes)
            ? (extras.excludes as string[])
            : Array.isArray(extras.exclusions)
              ? (extras.exclusions as string[])
              : [
                  'Kişisel harcamalar',
                  'Öğle / akşam yemekleri (belirtilmedikçe)',
                ],
          healthPrivileges: Array.isArray(extras.healthPrivileges)
            ? (extras.healthPrivileges as string[]).filter(
                (item) => typeof item === 'string' && item.trim().length > 0,
              )
            : [],
          itinerary,
          images,
          featured: Boolean(data.featured),
          departureCity,
          region:
            typeof extras.region === 'string'
              ? extras.region
              : typeof data.region === 'string'
                ? data.region
                : null,
          transportation:
            typeof extras.transportation === 'string'
              ? extras.transportation
              : 'Otobüs',
          period: typeof extras.period === 'string' ? extras.period : null,
          rating: Number(data.averageRating ?? data.rating ?? 0) || null,
          tourType:
            typeof extras.tourType === 'string'
              ? extras.tourType
              : typeof data.category === 'string'
                ? data.category
                : null,
          accommodationType:
            typeof extras.accommodationType === 'string'
              ? extras.accommodationType
              : null,
          difficultyLevel:
            typeof extras.difficultyLevel === 'string'
              ? extras.difficultyLevel
              : null,
          ageRestriction:
            extras.ageRestriction != null
              ? Number(extras.ageRestriction)
              : null,
          isPopular: Boolean(extras.isPopular ?? data.featured),
          isLastMinute: Boolean(extras.isLastMinute),
          isEarlyBird: Boolean(extras.isEarlyBird),
          languages: Array.isArray(extras.languages)
            ? (extras.languages as string[])
            : ['Türkçe'],
          tags: Array.isArray(extras.tags) ? (extras.tags as string[]) : [],
          createdAt: new Date(String(data.createdAt ?? Date.now())),
          updatedAt: new Date(String(data.updatedAt ?? Date.now())),
          tourOperatorId: partnerId,
          tourOperator: {
            id: partnerPayload?.id || partnerId,
            companyName: partnerName,
            logo: partnerPayload?.logo ?? null,
            description:
              partnerId === 'seed-partner-demo'
                ? 'Demo partner hesabı — tur ve aktivite yönetimi için örnek operatör.'
                : null,
            membershipTier: partnerTier,
            rating: Number(partnerPayload?.averageRating ?? 0) || 5,
            reviewCount:
              partnerPayload?.reviewCount != null
                ? Number(partnerPayload.reviewCount)
                : partnerId === 'seed-partner-demo'
                  ? 2
                  : 0,
          },
          tourDates,
          accommodation: accommodation
            ? {
                name: accommodation.name,
                image: accommodation.image,
                location: accommodation.location,
                type: accommodation.type,
                rating: Number(accommodation.rating ?? 0),
                features: Array.isArray(accommodation.features)
                  ? accommodation.features
                  : [],
              }
            : {
                name:
                  typeof extras.accommodationName === 'string'
                    ? extras.accommodationName
                    : '',
                image: images[0] || '',
                location: '',
                type:
                  typeof extras.accommodationType === 'string'
                    ? extras.accommodationType
                    : '',
                rating: 0,
                features: [],
              },
          meetingPoint:
            typeof extras.meetingPoint === 'string'
              ? extras.meetingPoint
              : undefined,
          meetingTime:
            typeof extras.meetingTime === 'string'
              ? extras.meetingTime
              : undefined,
          pickupPoints: (pickupPoints ?? []).map((point, index) => ({
            id: point.id,
            city: point.city,
            location: point.location,
            description: point.description ?? undefined,
            time: point.time,
            isActive: point.isActive ?? true,
            order: point.order ?? index,
          })),
        };

        if (cancelled || abortController.signal.aborted) return;

        setTour(transformedTour);
        setTourOperator(transformedTour.tourOperator);
        setError(null);
      } catch (err) {
        if (cancelled || abortController.signal.aborted) return;
        console.error('Tur detayları alınırken hata:', err);
        if (tourRef.current?.id === tourId) {
          // Aynı tur zaten ekranda — geri dönüş race'inde notFound gösterme
          setError(null);
          return;
        }
        setTour(null);
        setError('Tur detayları alınamadı');
      } finally {
        if (!cancelled && !abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void fetchTour();

    return () => {
      cancelled = true;
      abortController.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only refetch when route id changes
  }, [params.id]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollPosition + windowHeight > documentHeight - 600) {
        setShowScrollIndicator(false);
      } else {
        setShowScrollIndicator(true);
      }
    };

    const calculateTourCount = () => {
      if (containerRef.current) {
        const containerHeight = containerRef.current.clientHeight;
        const tourItemHeight = 210;
        const paddingAndMargin = 35;
        const availableHeight = containerHeight - paddingAndMargin;
        const calculatedCount = Math.floor(availableHeight / tourItemHeight);
        setTourCount(4); // Sabit 4 tur göster
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', calculateTourCount);
    calculateTourCount();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', calculateTourCount);
    };
  }, []);

  useEffect(() => {
    const operatorId = tour?.tourOperator?.id;
    if (!operatorId) {
      return;
    }

    const fetchOtherTours = async () => {
      try {
        const response = await fetch(
          `${getPublicApiBaseUrl()}/catalog/tours/search?limit=12&sortBy=createdAt&sortOrder=desc`,
          { headers: { Accept: 'application/json' } },
        );
        const raw = await response.json();
        if (!response.ok || raw.success === false) return;
        const rows = Array.isArray(raw.data) ? raw.data : [];
        const mapped = rows
          .filter(
            (row: { id?: string; partnerId?: string }) =>
              row.id !== tour?.id && row.partnerId === operatorId,
          )
          .slice(0, 4)
          .map((row: Record<string, unknown>) => {
            const cover =
              (typeof row.coverUrl === 'string' && row.coverUrl
                ? resolveMediaUrl(row.coverUrl)
                : null) ?? '/brand/mark-on-light.png';
            return {
              id: String(row.id),
              name: String(row.title ?? ''),
              description: String(row.description ?? ''),
              duration: Number(row.durationDays ?? 1),
              price: Number(row.price ?? 0),
              discount: null,
              startDate: null,
              endDate: null,
              maxParticipants: null,
              destinations: [] as TourDestination[],
              inclusions: [],
              exclusions: [],
              healthPrivileges: [],
              itinerary: {},
              images: [cover],
              featured: Boolean(row.featured),
              departureCity: null,
              region: null,
              transportation: null,
              period: null,
              rating: Number(row.averageRating ?? 0) || null,
              tourType: typeof row.category === 'string' ? row.category : null,
              accommodationType: null,
              difficultyLevel: null,
              ageRestriction: null,
              isPopular: false,
              isLastMinute: false,
              isEarlyBird: false,
              languages: [],
              tags: [],
              createdAt: new Date(),
              updatedAt: new Date(),
              tourOperatorId: operatorId,
              tourOperator: tour!.tourOperator,
              tourDates: [],
              accommodation: {
                name: '',
                image: '',
                location: '',
                type: '',
                rating: 0,
                features: [],
              },
            } satisfies Tour;
          });
        setOtherTours(mapped);
      } catch (err) {
        console.error('Turlar yüklenirken hata:', err);
      }
    };

    void fetchOtherTours();
  }, [tour?.tourOperator?.id, tour?.id, tour?.tourOperator]);

  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  const availableTourDates = useMemo(() => {
    if (!tour?.tourDates) return [];
    const upcoming = tour.tourDates.filter(
      (date) => new Date(date.startDate) >= today,
    );
    // Belt-and-suspenders while API quiet-dedupe rolls out / caches warm.
    return dedupeTourDatesByRange(upcoming);
  }, [tour?.tourDates, today]);

  const handleDateSelect = (date: TourDate | BookingActivityDate | null) => {
    // This page only mounts BottomBookingBar with `tour` (not activity).
    const tourDate = date as TourDate | null;
    setSelectedTourDate(tourDate);
    if (tourDate) {
      setShowDateSelectionHint(false);
      setExpanded(true);
    }
  };

  const promptDateSelection = () => {
    if (!selectedTourDate) {
      setShowDateSelectionHint(true);
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#booking') {
        promptDateSelection();
      }
    };

    if (window.location.hash === '#booking') {
      promptDateSelection();
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [selectedTourDate]);

  const handleParticipantsChange = (newParticipants: {
    [key: string]: number;
  }) => {
    setParticipants(newParticipants);
  };

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  if (error || !tour) {
    return notFound();
  }

  // Tur dahil olanlar ve olmayanlar
  const inclusions = parseJsonString<string[]>(tour.inclusions ?? [], []);
  const exclusions = parseJsonString<string[]>(tour.exclusions ?? [], []);
  const healthPrivileges = Array.isArray(tour.healthPrivileges)
    ? tour.healthPrivileges.filter(
        (item) => typeof item === 'string' && item.trim().length > 0,
      )
    : [];

  // Tur destinasyonları
  const getDestinationName = (d: TourDestination): string =>
    getDestinationLabel(d);

  const tourReviews: OperatorReview[] = (tourOperator?.reviews || []).filter(
    (review) => review.booking.tour?.id === tour.id,
  );
  const tourReviewCount = tourReviews.length;
  const tourAverageRating =
    tourReviewCount > 0
      ? tourReviews.reduce((sum, review) => sum + review.rating, 0) /
        tourReviewCount
      : 0;

  const destinations = Array.isArray(tour.destinations)
    ? tour.destinations.map(getDestinationName).filter(Boolean)
    : parseJsonString<Destination[]>(tour.destinations, []).map((d) => d.city);

  const galleryImages = Array.isArray(tour.images) ? tour.images : [];
  const activePickupPoints = (tour.pickupPoints ?? [])
    .filter((point) => point.isActive !== false)
    .sort((a, b) => a.order - b.order);
  const pickupSlideCount =
    (tour.meetingPoint ? 1 : 0) +
    (activePickupPoints.length > 0
      ? activePickupPoints.length
      : tour.meetingPoint
        ? 0
        : 1);
  const pickupSlideClass =
    pickupSlideCount > 1
      ? 'w-[min(100%,240px)] shrink-0 snap-start sm:w-[min(100%,260px)]'
      : 'w-full shrink-0 snap-start';

  // Tur programını parse et — boş {} fallback'i boş say
  type ItineraryItem = {
    title?: string;
    description?: string;
    activities?: string[];
    highlights?: string[];
    meals?: string[];
    accommodation?: string;
  };
  const itinerary = (() => {
    const parsed = parseJsonString<Record<string, ItineraryItem>>(
      tour.itinerary && typeof tour.itinerary === 'object'
        ? tour.itinerary
        : '{}',
      {},
    );
    return parsed && typeof parsed === 'object' ? parsed : {};
  })();

  const displayRating =
    tourReviewCount > 0
      ? tourAverageRating
      : (tour.rating ?? tourOperator?.rating ?? 0);
  const displayReviewCount =
    tourReviewCount > 0 ? tourReviewCount : (tourOperator?.reviewCount ?? 0);
  const nights = Math.max(tour.duration - 1, 0);

  // Yıldızları render et
  const renderStars = (rating: number, size: 'sm' | 'md' = 'md') => {
    const starSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-5 w-5';
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => {
          return star <= Math.floor(rating) ? (
            <StarIconSolid
              key={star}
              className={`${starSize} text-yellow-400`}
            />
          ) : star <= rating ? (
            <div key={star} className="relative">
              <StarIcon className={`${starSize} text-gray-300`} />
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${(rating % 1) * 100}%` }}
              >
                <StarIconSolid className={`${starSize} text-yellow-400`} />
              </div>
            </div>
          ) : (
            <StarIcon key={star} className={`${starSize} text-gray-300`} />
          );
        })}
      </div>
    );
  };

  // --- Button Styles (turta ink theme) ---
  const primaryButtonClasses =
    'inline-flex items-center justify-center px-7 py-3 bg-neutral-950 hover:bg-neutral-800 text-white text-base font-semibold rounded-lg transition-colors shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-950 disabled:opacity-60 disabled:cursor-not-allowed transform active:scale-[0.98] duration-150 ease-out';
  const secondaryButtonClasses =
    'inline-flex items-center justify-center px-7 py-3 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 text-base font-semibold rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-neutral-950 disabled:opacity-60 disabled:cursor-not-allowed transform active:scale-[0.98] duration-150 ease-out';
  // Icon button style for dark hero backgrounds
  const iconButtonDarkBgClasses =
    'p-2.5 rounded-lg text-white bg-white/10 hover:bg-white/20 transition-colors duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black/50 focus:ring-white/50';
  // Secondary button for dark hero backgrounds
  const secondaryButtonDarkBgClasses = `inline-flex items-center justify-center px-7 py-3 bg-white/10 backdrop-blur-lg text-neutral-200 hover:bg-white/10 border border-white/40 hover:border-white/50 text-base font-semibold rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black/50 focus:ring-neutral-400 disabled:opacity-60 disabled:cursor-not-allowed transform active:scale-[0.98] duration-150 ease-out`;

  return (
    <div className="bg-gray-50">
      {/* Hero Section - Mobile / Desktop */}
      <div className="relative">
        {/* ── MOBILE HERO (< md) ── */}
        <div className="md:hidden">
          <div className="relative h-[380px] overflow-hidden">
            {tour.images.length > 0 ? (
              <Image
                src={tour.images[0]}
                alt={tour.name}
                fill
                priority
                unoptimized={shouldUnoptimizeMedia(tour.images[0])}
                style={{ objectFit: 'cover' }}
                className="brightness-[0.85]"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <PhotoIcon className="w-16 h-16 text-gray-400" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/15" />

            {/* Top row: badge + actions */}
            <div className="absolute top-0 left-0 right-0 z-10 flex items-start justify-between px-4 pt-14">
              {(tour.isPopular || tour.featured) && (
                <div className="inline-flex items-center bg-neutral-950/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
                  <StarIconSolid className="h-3.5 w-3.5 text-yellow-300 mr-1.5" />
                  <span className="text-white font-semibold uppercase tracking-wider text-[10px]">
                    Popüler Seçim
                  </span>
                </div>
              )}
              <div
                className={`flex items-center gap-2 ${!(tour.isPopular || tour.featured) ? 'ml-auto' : ''}`}
              >
                <button
                  className={iconButtonDarkBgClasses}
                  aria-label="Favorilere Ekle"
                >
                  <HeartIcon className="h-5 w-5" />
                </button>
                <button className={iconButtonDarkBgClasses} aria-label="Paylaş">
                  <ShareIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Hero text overlay */}
            <div className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-14">
              <div className="flex items-end justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-bold text-white leading-tight drop-shadow-md mb-2">
                    {tour.name}
                  </h1>
                  <div className="flex items-start gap-1.5 text-white/90 mb-2.5">
                    <MapPinIcon className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 opacity-90" />
                    <span className="text-sm leading-snug">
                      {destinations.join(', ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-white/90 text-sm">
                    <div className="flex items-center gap-1.5">
                      <ClockIcon className="w-3.5 h-3.5 opacity-80" />
                      <span>{tour.duration} gün</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <UserGroupIcon className="w-3.5 h-3.5 opacity-80" />
                      <span>Maks. {tour.maxParticipants || 10} kişi</span>
                    </div>
                  </div>
                </div>

                {displayRating > 0 && (
                  <div className="flex-shrink-0 bg-black/55 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg border border-white/10">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-white font-bold text-base leading-none">
                        {displayRating.toFixed(1)}
                      </span>
                      {renderStars(displayRating, 'sm')}
                    </div>
                    {displayReviewCount > 0 && (
                      <p className="text-white/70 text-[11px] text-center">
                        ({displayReviewCount} yorum)
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Overlapping white info card + CTAs */}
          <div className="relative z-20 -mt-10 mx-4 mb-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100/80 overflow-hidden">
              <div className="grid grid-cols-4 divide-x divide-gray-100 px-1 py-4">
                <div className="flex flex-col items-center text-center px-1">
                  <div className="p-2 bg-neutral-100 rounded-xl mb-1.5">
                    <CalendarDaysIcon className="h-4 w-4 text-neutral-950" />
                  </div>
                  <p className="text-[9px] text-gray-500 font-medium leading-tight mb-0.5">
                    Tur Süresi
                  </p>
                  <p className="text-[10px] font-semibold text-gray-900 leading-tight">
                    {tour.duration} Gün
                  </p>
                  {nights > 0 && (
                    <p className="text-[9px] text-gray-500 leading-tight">
                      {nights} Gece
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-center text-center px-1">
                  <div className="p-2 bg-neutral-100 rounded-xl mb-1.5">
                    <UserGroupIcon className="h-4 w-4 text-neutral-950" />
                  </div>
                  <p className="text-[9px] text-gray-500 font-medium leading-tight mb-0.5">
                    Grup Büyüklüğü
                  </p>
                  <p className="text-[10px] font-semibold text-gray-900 leading-tight">
                    Maks. {tour.maxParticipants || 10}
                  </p>
                  <p className="text-[9px] text-gray-500 leading-tight">Kişi</p>
                </div>
                <div className="flex flex-col items-center text-center px-1">
                  <div className="p-2 bg-neutral-100 rounded-xl mb-1.5">
                    <ChatBubbleLeftRightIcon className="h-4 w-4 text-neutral-950" />
                  </div>
                  <p className="text-[9px] text-gray-500 font-medium leading-tight mb-0.5">
                    Rehber
                  </p>
                  <p className="text-[10px] font-semibold text-gray-900 leading-tight">
                    Profesyonel
                  </p>
                </div>
                <div className="flex flex-col items-center text-center px-1">
                  <div className="p-2 bg-emerald-50 rounded-xl mb-1.5">
                    <ShieldCheckIcon className="h-4 w-4 text-emerald-600" />
                  </div>
                  <p className="text-[9px] text-gray-500 font-medium leading-tight mb-0.5">
                    İptal Güvencesi
                  </p>
                  <p className="text-[10px] font-semibold text-gray-900 leading-tight">
                    Ücretsiz
                  </p>
                  <p className="text-[9px] text-gray-500 leading-tight">
                    İptal
                  </p>
                </div>
              </div>

              <div className="flex gap-3 px-4 pb-4 pt-1">
                <Link
                  href="#itinerary"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white border-2 border-neutral-950 text-neutral-950 text-sm font-semibold rounded-xl transition-colors hover:bg-neutral-100 active:scale-[0.98]"
                >
                  <MapIcon className="h-4 w-4 flex-shrink-0" />
                  <span>Tur Programı</span>
                </Link>
                <Link
                  href="#booking"
                  onClick={promptDateSelection}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm active:scale-[0.98]"
                >
                  <CalendarDaysIcon className="h-4 w-4 flex-shrink-0" />
                  <span>Rezervasyon Yap</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── DESKTOP HERO (md+) — unchanged ── */}
        <div className="hidden md:block relative h-[90vh]">
          <div className="absolute inset-0 overflow-hidden">
            {tour.images.length > 0 ? (
              <Image
                src={tour.images[0]}
                alt={tour.name}
                fill
                priority
                unoptimized={shouldUnoptimizeMedia(tour.images[0])}
                style={{ objectFit: 'cover' }}
                className="brightness-70 transform scale-100 animate-ken-burns-slow"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <PhotoIcon className="w-20 h-20 text-gray-400" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          </div>

          <div className="absolute inset-0 z-10 flex items-center justify-center pb-36 pt-20">
            <div className="container px-4 text-center max-w-4xl mx-auto w-full">
              <div className="inline-flex items-center mb-5 bg-neutral-950/30 backdrop-blur-sm px-4 py-1.5 rounded-full border border-neutral-400/30">
                <StarIconSolid className="h-4 w-4 text-yellow-300 mr-2" />
                <span className="text-neutral-200 font-medium uppercase tracking-wider text-[11px]">
                  Popüler Seçim
                </span>
              </div>
              <h1 className="text-[3.5rem] lg:text-[4rem] font-bold text-white mb-4 leading-tight animate-fade-in-up drop-shadow-md">
                {tour.name}
              </h1>
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-white/90 mb-8 max-w-3xl mx-auto">
                <div className="flex items-center text-base">
                  <MapPinIcon className="w-4 h-4 mr-1.5 opacity-80" />
                  <span className="font-normal">{destinations.join(', ')}</span>
                </div>
                <span className="text-white/50 hidden sm:inline">•</span>
                <div className="flex items-center text-base">
                  <ClockIcon className="w-4 h-4 mr-1.5 opacity-80" />
                  <span className="font-normal">{tour.duration} gün</span>
                </div>
                <span className="text-white/50 hidden sm:inline">•</span>
                <div className="flex items-center text-base">
                  <UserGroupIcon className="w-4 h-4 mr-1.5 opacity-80" />
                  <span className="font-normal">
                    Maks. {tour.maxParticipants || 10} kişi
                  </span>
                </div>
                {tour.accommodation?.name && (
                  <span className="inline-flex items-center gap-2 bg-neutral-100 text-neutral-800 px-3 py-1 rounded-full text-xs font-semibold ml-2">
                    <BuildingOfficeIcon className="w-4 h-4 text-neutral-950" />
                    Otel: {tour.accommodation.name}
                  </span>
                )}
              </div>
              <div className="flex flex-row flex-wrap justify-center items-center gap-4 w-full mx-auto">
                <Link href="#itinerary" className={primaryButtonClasses}>
                  <MapIcon className="h-5 w-5 mr-2" />
                  <span>Tur Programı</span>
                </Link>
                <Link
                  href="#booking"
                  onClick={promptDateSelection}
                  className={secondaryButtonDarkBgClasses}
                >
                  <CalendarDaysIcon className="h-5 w-5 mr-2" />
                  <span>Rezervasyon Yap</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 z-10 bg-black/60 backdrop-blur-md py-4 border-t border-white/10">
            <div className="container px-4 mx-auto">
              <div className="flex flex-wrap items-center justify-center lg:justify-between gap-x-6 gap-y-3">
                <div className="flex items-center text-white gap-2.5 group">
                  <div className="p-2 bg-white/10 rounded-lg ring-1 ring-white/10 group-hover:bg-white/20 transition-colors duration-150 ease-out">
                    <CalendarDaysIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-white/70 font-medium uppercase tracking-wider">
                      Süre
                    </p>
                    <p className="text-sm font-semibold">{tour.duration} Gün</p>
                  </div>
                </div>

                <div className="flex items-center text-white gap-2.5 group">
                  <div className="p-2 bg-white/10 rounded-lg ring-1 ring-white/10 group-hover:bg-white/20 transition-colors duration-150 ease-out">
                    <UserGroupIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-white/70 font-medium uppercase tracking-wider">
                      Grup
                    </p>
                    <p className="text-sm font-semibold">
                      Maks. {tour.maxParticipants || 10} kişi
                    </p>
                  </div>
                </div>

                <div className="flex items-center text-white gap-2.5 group">
                  <div className="p-2 bg-white/10 rounded-lg ring-1 ring-white/10 group-hover:bg-white/20 transition-colors duration-150 ease-out">
                    <MapPinIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-white/70 font-medium uppercase tracking-wider">
                      Destinasyon
                    </p>
                    <p className="text-sm font-semibold truncate max-w-[150px]">
                      {destinations[0]}
                      {destinations.length > 1
                        ? ` +${destinations.length - 1}`
                        : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center text-white gap-2.5 group">
                  <div className="p-2 bg-white/10 rounded-lg ring-1 ring-white/10 group-hover:bg-white/20 transition-colors duration-150 ease-out">
                    <StarIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-white/70 font-medium uppercase tracking-wider">
                      Puan
                    </p>
                    <p className="text-sm font-semibold">
                      {displayRating > 0
                        ? `${displayRating.toFixed(1)}/5`
                        : '—'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-auto">
                  <button
                    className={iconButtonDarkBgClasses}
                    aria-label="Favorilere Ekle"
                  >
                    <HeartIcon className="h-5 w-5" />
                  </button>
                  <button
                    className={iconButtonDarkBgClasses}
                    aria-label="Paylaş"
                  >
                    <ShareIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ana İçerik — legacy: container > max-w-7xl > full-width sections > 2-col grid */}
      <div className="container mx-auto px-4 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 grid grid-cols-1 items-start gap-10 md:mb-16 lg:grid-cols-3 lg:gap-12 xl:gap-16">
            {/* Sol Kolon - Tur Bilgileri */}
            <div className="min-w-0 space-y-8 sm:space-y-10 lg:col-span-2">
              {/* Tur Programı ve Rotası */}
              <div id="itinerary" className="scroll-mt-24 min-w-0">
                <div className="md:hidden">
                  <TourItineraryMobile
                    itinerary={itinerary}
                    destinations={destinations}
                    images={tour.images}
                    tourStartDate={tour.tourDates?.[0]?.startDate ?? null}
                  />
                </div>

                <div className="hidden md:block bg-white rounded-xl overflow-hidden shadow-md border border-neutral-200/70 min-w-0">
                  <div className="p-6 md:p-8">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-2xl font-semibold text-gray-900 flex items-center">
                        <MapIcon className="h-7 w-7 text-neutral-950 mr-3" />
                        <span>Tur Programı ve Rotası</span>
                      </h3>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-3 h-3 rounded-full bg-neutral-950"></div>
                          <span>Günlük Program</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                          <span>Önemli Noktalar</span>
                        </div>
                      </div>
                    </div>

                    {Object.keys(itinerary).length > 0 ? (
                      <div className="relative">
                        {/* Rota Çizgisi */}
                        <div className="absolute left-[26px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-neutral-200 via-neutral-300 to-neutral-200"></div>

                        {/* Günlük Program */}
                        <div className="space-y-12">
                          {Object.entries(itinerary).map(
                            ([day, content]: [string, any], index: number) => {
                              const dayNumberNum =
                                parseInt(day.replace('day', ''), 10) + 1;
                              const dayNumber = String(dayNumberNum);
                              const tourStartDate =
                                tour.tourDates?.[0]?.startDate;
                              const currentDate = tourStartDate
                                ? new Date(
                                    new Date(tourStartDate).setDate(
                                      new Date(tourStartDate).getDate() + index,
                                    ),
                                  )
                                : null;
                              const formattedDate = currentDate
                                ? currentDate.toLocaleDateString('tr-TR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                  })
                                : null;

                              const destination =
                                tour.destinations[index] ||
                                tour.destinations[0];
                              const destinationName = destination
                                ? getDestinationName(destination)
                                : '';

                              const rawTitle =
                                content.title ||
                                destinationName ||
                                `${dayNumber}. Gün programı`;
                              const displayTitle =
                                stripDayPrefixFromTitle(
                                  rawTitle,
                                  dayNumberNum,
                                ) ||
                                destinationName ||
                                'Gün programı';

                              const dayImages = tour.images
                                ? tour.images.slice(index * 2, index * 2 + 2)
                                : [];

                              return (
                                <div
                                  key={index}
                                  className="relative flex gap-6 min-w-0"
                                >
                                  <div className="flex-shrink-0 w-14 flex justify-center">
                                    <div
                                      className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center bg-neutral-100 text-neutral-950 ring-4 ring-white font-semibold text-lg"
                                      aria-label={`${dayNumber}. gün`}
                                    >
                                      {dayNumber}
                                    </div>
                                  </div>

                                  <div className="flex-grow min-w-0">
                                    <div className="bg-white rounded-xl border border-neutral-200/70 shadow-sm hover:shadow-md transition-shadow overflow-hidden min-w-0">
                                      <div className="px-5 py-4 border-b border-neutral-100 bg-neutral-100/50">
                                        <div className="flex flex-wrap items-start justify-between gap-3">
                                          <div className="flex flex-wrap items-center gap-3 min-w-0 flex-1">
                                            {formattedDate && (
                                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800 shrink-0">
                                                {formattedDate}
                                              </span>
                                            )}
                                            <h4 className="text-lg font-semibold text-gray-900 break-words min-w-0">
                                              {displayTitle}
                                            </h4>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <button
                                              className="p-2 hover:bg-white rounded-lg transition-colors"
                                              title="Haritada Göster"
                                            >
                                              <MapPinIcon className="w-5 h-5 text-gray-500" />
                                            </button>
                                            {dayImages.length > 0 && (
                                              <button
                                                className="p-2 hover:bg-white rounded-lg transition-colors"
                                                title="Fotoğrafları Görüntüle"
                                              >
                                                <PhotoIcon className="w-5 h-5 text-gray-500" />
                                              </button>
                                            )}
                                          </div>
                                        </div>
                                      </div>

                                      {/* Ana İçerik */}
                                      <div className="p-5 min-w-0">
                                        <p className="text-gray-600 text-sm mb-6 break-words [overflow-wrap:anywhere]">
                                          {content.description ||
                                            'Bu gün için detaylı program bilgisi yakında eklenecektir.'}
                                        </p>

                                        {/* Fotoğraflar */}
                                        {dayImages.length > 0 && (
                                          <div className="mb-6">
                                            <div className="grid grid-cols-2 gap-4">
                                              {dayImages.map(
                                                (
                                                  image: string,
                                                  imgIndex: number,
                                                ) => (
                                                  <div
                                                    key={imgIndex}
                                                    className="relative aspect-[4/3] rounded-lg overflow-hidden group"
                                                  >
                                                    <Image
                                                      src={image}
                                                      alt={`${content.title || destinationName} - ${imgIndex + 1}`}
                                                      fill
                                                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                                      <div className="absolute bottom-3 left-3 right-3">
                                                        <p className="text-white text-sm font-medium truncate">
                                                          {content.title ||
                                                            destinationName}
                                                        </p>
                                                      </div>
                                                    </div>
                                                  </div>
                                                ),
                                              )}
                                            </div>
                                          </div>
                                        )}

                                        {/* Öne Çıkan Özellikler */}
                                        {content.highlights &&
                                          content.highlights.length > 0 && (
                                            <div className="mb-6">
                                              <h5 className="text-sm font-medium text-gray-700 mb-3">
                                                Günün Öne Çıkanları
                                              </h5>
                                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                {content.highlights.map(
                                                  (
                                                    highlight: string,
                                                    i: number,
                                                  ) => (
                                                    <div
                                                      key={i}
                                                      className="flex items-center gap-2 p-2.5 rounded-lg border border-neutral-200 bg-neutral-100/30 min-w-0"
                                                    >
                                                      <span className="text-lg shrink-0">
                                                        ✨
                                                      </span>
                                                      <span className="text-sm text-gray-700 break-words [overflow-wrap:anywhere]">
                                                        {highlight}
                                                      </span>
                                                    </div>
                                                  ),
                                                )}
                                              </div>
                                            </div>
                                          )}

                                        {/* Zaman Çizelgesi */}
                                        {content.schedule &&
                                          content.schedule.length > 0 && (
                                            <div className="mb-6">
                                              <h5 className="text-sm font-medium text-gray-700 mb-3">
                                                Günün Programı
                                              </h5>
                                              <div className="space-y-3">
                                                {content.schedule.map(
                                                  (
                                                    scheduleItem: any,
                                                    i: number,
                                                  ) => (
                                                    <div
                                                      key={i}
                                                      className="flex items-start gap-3 p-2.5 bg-neutral-100 rounded-lg border border-neutral-200 min-w-0"
                                                    >
                                                      <div className="p-2 bg-neutral-100 rounded-lg shrink-0">
                                                        <ClockIcon className="w-4 h-4 text-neutral-950" />
                                                      </div>
                                                      <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-medium text-gray-900 break-words">
                                                          {scheduleItem.time ||
                                                            `${i + 1}. Aktivite`}
                                                        </p>
                                                        <p className="text-xs text-gray-600 break-words [overflow-wrap:anywhere]">
                                                          {scheduleItem.activity ||
                                                            'Aktivite'}
                                                        </p>
                                                      </div>
                                                    </div>
                                                  ),
                                                )}
                                              </div>
                                            </div>
                                          )}

                                        {/* Alt Bilgiler */}
                                        <div className="pt-4 border-t border-gray-100">
                                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                            {/* Konum */}
                                            {destinationName && (
                                              <div className="flex items-center gap-2">
                                                <div className="p-2 bg-gray-100 rounded-lg">
                                                  <MapPinIcon className="w-4 h-4 text-gray-600" />
                                                </div>
                                                <div>
                                                  <p className="text-xs text-gray-500">
                                                    Konum
                                                  </p>
                                                  <p className="text-sm font-medium text-gray-700 break-words">
                                                    {destinationName}
                                                  </p>
                                                </div>
                                              </div>
                                            )}

                                            {/* Mesafe */}
                                            {content.distance && (
                                              <div className="flex items-center gap-2">
                                                <div className="p-2 bg-gray-100 rounded-lg">
                                                  <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={1.5}
                                                    stroke="currentColor"
                                                    className="w-4 h-4 text-gray-600"
                                                  >
                                                    <path
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                                                    />
                                                  </svg>
                                                </div>
                                                <div>
                                                  <p className="text-xs text-gray-500">
                                                    Mesafe
                                                  </p>
                                                  <p className="text-sm font-medium text-gray-700">
                                                    {content.distance}
                                                  </p>
                                                </div>
                                              </div>
                                            )}

                                            {/* Aktivite Sayısı */}
                                            {content.highlights &&
                                              content.highlights.length > 0 && (
                                                <div className="flex items-center gap-2">
                                                  <div className="p-2 bg-gray-100 rounded-lg">
                                                    <CalendarDaysIcon className="w-4 h-4 text-gray-600" />
                                                  </div>
                                                  <div>
                                                    <p className="text-xs text-gray-500">
                                                      Aktiviteler
                                                    </p>
                                                    <p className="text-sm font-medium text-gray-700">
                                                      {
                                                        content.highlights
                                                          .length
                                                      }{' '}
                                                      Aktivite
                                                    </p>
                                                  </div>
                                                </div>
                                              )}

                                            {/* Tahmini Süre */}
                                            {content.duration && (
                                              <div className="flex items-center gap-2">
                                                <div className="p-2 bg-gray-100 rounded-lg">
                                                  <ClockIcon className="w-4 h-4 text-gray-600" />
                                                </div>
                                                <div>
                                                  <p className="text-xs text-gray-500">
                                                    Süre
                                                  </p>
                                                  <p className="text-sm font-medium text-gray-700">
                                                    {content.duration}
                                                  </p>
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            },
                          )}
                        </div>
                      </div>
                    ) : (
                      // Itinerary verisi yoksa varsayılan görünüm
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <MapIcon className="w-8 h-8 text-neutral-950" />
                        </div>
                        <h4 className="text-lg font-medium text-gray-900 mb-2">
                          Tur Programı Hazırlanıyor
                        </h4>
                        <p className="text-gray-600 mb-6">
                          Bu tur için detaylı günlük program yakında
                          eklenecektir.
                        </p>
                        <div className="bg-neutral-100 rounded-lg p-4 border border-neutral-200">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center">
                              <span className="text-sm font-semibold text-neutral-950">
                                1
                              </span>
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900">
                                Tur Başlangıcı
                              </h5>
                              <p className="text-sm text-gray-600">
                                Buluşma noktasında toplanma ve tur başlangıcı
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center">
                              <span className="text-sm font-semibold text-neutral-950">
                                2
                              </span>
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900">
                                Destinasyon Ziyaretleri
                              </h5>
                              <p className="text-sm text-gray-600">
                                Planlanan destinasyonlarda rehber eşliğinde
                                geziler
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center">
                              <span className="text-sm font-semibold text-neutral-950">
                                3
                              </span>
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900">
                                Tur Sonu
                              </h5>
                              <p className="text-sm text-gray-600">
                                Tur sonunda ayrılış ve dönüş
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Fotoğraf Galerisi — sol kolon (lg:col-span-2) genişliğine sığdır */}
              <div className="w-full min-w-0">
                <div className="mb-3 flex items-center justify-between gap-3 sm:mb-4">
                  <h2 className="flex min-w-0 items-center text-lg font-semibold text-gray-900 sm:text-xl">
                    <PhotoIcon className="mr-2 h-5 w-5 shrink-0 text-neutral-950 sm:mr-2.5 sm:h-6 sm:w-6" />
                    <span className="truncate">Fotoğraf Galerisi</span>
                  </h2>
                  <button
                    type="button"
                    className="flex shrink-0 items-center text-xs font-medium text-neutral-950 hover:text-neutral-800 sm:text-sm"
                  >
                    Tüm Fotoğraflar
                    <ChevronRightIcon className="ml-1 h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {(galleryImages.length > 0
                    ? galleryImages.slice(0, 4)
                    : Array.from({ length: 4 }, () => null)
                  ).map((image, index) => (
                    <div
                      key={image ?? `placeholder-${index}`}
                      className="group relative aspect-[4/3] overflow-hidden rounded-lg shadow-sm transition-shadow hover:shadow-md sm:rounded-xl"
                    >
                      {image ? (
                        <Image
                          src={image}
                          alt={`${tour.name} - Resim ${index + 1}`}
                          fill
                          sizes="(max-width: 1024px) 45vw, 28vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-neutral-200">
                          <PhotoIcon className="h-7 w-7 text-neutral-400 sm:h-9 sm:w-9" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                        <div className="absolute bottom-2 left-2 right-2">
                          <p className="truncate text-xs font-medium text-white">
                            {destinations[
                              index % Math.max(destinations.length, 1)
                            ] || 'Tur Lokasyonu'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Kalkış Noktası Bilgileri — noktalar slider, uyarılar sabit */}
              <div className="w-full min-w-0 overflow-hidden rounded-xl border border-emerald-200/70 bg-emerald-50/60 p-3 sm:p-5">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2 sm:mb-4">
                  <h3 className="flex min-w-0 items-center text-base font-semibold text-emerald-800 sm:text-lg">
                    <MapPinIcon className="mr-2 h-5 w-5 shrink-0 text-emerald-600 sm:h-6 sm:w-6" />
                    <span className="leading-snug">
                      Kalkış Noktaları ve Buluşma Bilgileri
                    </span>
                  </h3>
                  {pickupSlideCount > 1 ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => scrollPickupSlider('prev')}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-emerald-200 bg-white text-emerald-700 shadow-sm hover:bg-emerald-50"
                        aria-label="Önceki kalkış noktası"
                      >
                        <ChevronLeftIcon className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => scrollPickupSlider('next')}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-emerald-200 bg-white text-emerald-700 shadow-sm hover:bg-emerald-50"
                        aria-label="Sonraki kalkış noktası"
                      >
                        <ChevronRightIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ) : null}
                </div>

                <div
                  ref={pickupSliderRef}
                  className="mb-4 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                  {tour.meetingPoint ? (
                    <div
                      data-pickup-slide
                      className={`${pickupSlideClass} group relative overflow-hidden rounded-lg border border-emerald-100 bg-white p-3.5 sm:p-4`}
                    >
                      <div className="absolute right-0 top-0 -z-0 h-16 w-16 rounded-bl-[100px] bg-emerald-100 transition-colors group-hover:bg-emerald-200" />
                      <div className="relative z-10">
                        <div className="mb-2 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                          Ana Buluşma Noktası
                        </div>
                        <h5 className="mb-1 text-sm font-medium text-gray-900 sm:text-base">
                          {tour.meetingPoint}
                        </h5>
                        {tour.meetingPointAddress ? (
                          <p className="mb-2.5 text-xs text-gray-600 sm:text-sm">
                            {tour.meetingPointAddress}
                          </p>
                        ) : null}
                        <div className="flex flex-col gap-1.5">
                          {tour.meetingTime ? (
                            <div className="flex items-center gap-2 text-xs text-gray-700 sm:text-sm">
                              <ClockIcon className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                              <span>Toplanma Saati: {tour.meetingTime}</span>
                            </div>
                          ) : null}
                          <div className="flex items-center gap-2 text-xs text-gray-700 sm:text-sm">
                            <UserGroupIcon className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                            <span>
                              Rehber:{' '}
                              {tour.tourOperator?.companyName ||
                                'Tur Operatörü'}{' '}
                              Rehberi
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {activePickupPoints.length > 0 ? (
                    activePickupPoints.map((point, index) => (
                      <div
                        key={point.id}
                        data-pickup-slide
                        className={`${pickupSlideClass} group relative overflow-hidden rounded-lg border border-emerald-100 bg-white p-3.5 sm:p-4`}
                      >
                        <div className="absolute right-0 top-0 -z-0 h-16 w-16 rounded-bl-[100px] bg-emerald-100 transition-colors group-hover:bg-emerald-200" />
                        <div className="relative z-10">
                          <div className="mb-2 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                            {index + 1}. Kalkış Noktası
                          </div>
                          <h5 className="mb-1 text-sm font-medium text-gray-900 sm:text-base">
                            {point.city} - {point.location}
                          </h5>
                          {point.description ? (
                            <p className="mb-2.5 text-xs text-gray-600 sm:text-sm">
                              {point.description}
                            </p>
                          ) : null}
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2 text-xs text-gray-700 sm:text-sm">
                              <ClockIcon className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                              <span>Toplanma Saati: {point.time}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-700 sm:text-sm">
                              <UserGroupIcon className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                              <span>
                                Rehber:{' '}
                                {tour.tourOperator?.companyName ||
                                  'Tur Operatörü'}{' '}
                                Rehberi
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : !tour.meetingPoint ? (
                    <div
                      data-pickup-slide
                      className={`${pickupSlideClass} group relative overflow-hidden rounded-lg border border-emerald-100 bg-white p-3.5 sm:p-4`}
                    >
                      <div className="absolute right-0 top-0 -z-0 h-16 w-16 rounded-bl-[100px] bg-emerald-100 transition-colors group-hover:bg-emerald-200" />
                      <div className="relative z-10">
                        <div className="mb-2 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                          Kalkış Noktası
                        </div>
                        <h5 className="mb-1 text-sm font-medium text-gray-900 sm:text-base">
                          {tour.departureCity || 'İstanbul'} - Merkez
                        </h5>
                        <p className="mb-2.5 text-xs text-gray-600 sm:text-sm">
                          Tur operatörü tarafından belirlenecek
                        </p>
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2 text-xs text-gray-700 sm:text-sm">
                            <ClockIcon className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                            <span>Toplanma Saati: Belirtilecek</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-700 sm:text-sm">
                            <UserGroupIcon className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                            <span>
                              Rehber:{' '}
                              {tour.tourOperator?.companyName ||
                                'Tur Operatörü'}{' '}
                              Rehberi
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* Önemli Hatırlatmalar — sabit, slider dışında */}
                <div className="rounded-lg border border-emerald-100 bg-white p-3.5 sm:p-4">
                  <h4 className="mb-2.5 flex items-center text-sm font-medium text-gray-900 sm:mb-3 sm:text-base">
                    <ShieldCheckIcon className="mr-2 h-4 w-4 shrink-0 text-emerald-600 sm:h-5 sm:w-5" />
                    Önemli Hatırlatmalar
                  </h4>
                  <div className="grid grid-cols-1 gap-2.5 text-xs text-gray-600 sm:grid-cols-2 sm:gap-3 sm:text-sm">
                    <div className="space-y-1.5">
                      <p className="flex items-start gap-2">
                        <span className="mt-1 text-emerald-600">•</span>
                        Tüm kalkış noktalarında profesyonel rehber eşliğinde
                        karşılama yapılacaktır.
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="mt-1 text-emerald-600">•</span>
                        Lütfen belirtilen saatlerden en az 15 dakika önce kalkış
                        noktasında hazır bulununuz.
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="mt-1 text-emerald-600">•</span>
                        Kalkış saatinden 10 dakika sonra hareket edilecektir.
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <p className="flex items-start gap-2">
                        <span className="mt-1 text-emerald-600">•</span>
                        Rehberlerimiz renkli şapkaları ile kolayca tanınabilir
                        olacaktır.
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="mt-1 text-emerald-600">•</span>
                        Acil durumlar için rehber iletişim numarası tur
                        başlangıç tarihinden 1 gün önce SMS ile paylaşılacaktır.
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="mt-1 text-emerald-600">•</span>
                        Bagajlarınız için otobüste yeterli alan mevcuttur.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Konaklama Bilgisi - Kısa */}
              {tour.accommodation?.name && (
                <div className="mb-10">
                  <div className="bg-neutral-100 border border-neutral-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <BuildingOfficeIcon className="w-5 h-5 text-neutral-950 flex-shrink-0" />
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          Konaklama:
                        </span>
                        <span className="text-base font-semibold text-gray-900 ml-2">
                          {tour.accommodation.name}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {tourReviewCount > 0 && (
                <OperatorReviewsSection
                  reviews={tourReviews}
                  rating={tourAverageRating}
                  reviewCount={tourReviewCount}
                  variant="main"
                  operatorName={tourOperator?.companyName}
                />
              )}
            </div>

            {/* Sağ Kolon - Rezervasyon ve Bilgiler (legacy: sticky sidebar) */}
            <aside className="flex w-full flex-col space-y-8 self-start lg:sticky lg:top-24 lg:col-span-1">
              {/* Rezervasyon Kartı */}
              <div
                id="booking"
                className="w-full rounded-xl border border-neutral-200/70 bg-white p-6 shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                    <CalendarDaysIcon className="h-6 w-6 mr-2.5 text-neutral-950 flex-shrink-0" />
                    <span>Rezervasyon</span>
                  </h2>
                  {/* Badges */}
                  <div className="flex items-center gap-2 flex-wrap justify-start sm:justify-end">
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200/70">
                      Ücretsiz İptal
                    </div>
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800 border border-neutral-200/70">
                      Anında Onay
                    </div>
                  </div>
                </div>

                {/* Tur Tarihleri */}
                <div className="relative group">
                  {showDateSelectionHint && (
                    <div
                      className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full z-10 pointer-events-none"
                      role="tooltip"
                    >
                      <div className="relative bg-red-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-md whitespace-nowrap animate-bounce-subtle">
                        Tarih seçmek için kartlara tıklayın
                        <span className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-red-600 rotate-45" />
                      </div>
                    </div>
                  )}
                  <div
                    className={`bg-neutral-50/60 p-6 rounded-lg mb-6 transition-all duration-300 ${
                      showDateSelectionHint
                        ? 'border-2 border-red-500 ring-2 ring-red-100 animate-pulse'
                        : 'border border-neutral-200/70'
                    }`}
                    title={
                      showDateSelectionHint
                        ? 'Rezervasyon için bir tur tarihi seçin'
                        : undefined
                    }
                  >
                    {showDateSelectionHint && (
                      <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium">
                        <ExclamationCircleIcon className="w-5 h-5 flex-shrink-0" />
                        <span>Önce tarih seçiniz</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-neutral-800">
                        Tur Tarihleri
                      </h3>
                      <div className="text-sm text-neutral-600">
                        {availableTourDates.length} tarih mevcut
                      </div>
                    </div>
                    <div className="flex flex-col gap-4">
                      {availableTourDates.length === 0 ? (
                        <div className="text-center py-8">
                          <CalendarDaysIcon className="h-12 w-12 text-neutral-400 mx-auto mb-3" />
                          <p className="text-neutral-600">
                            Şu anda mevcut tur tarihi bulunmamaktadır.
                          </p>
                        </div>
                      ) : (
                        availableTourDates.map((date) => {
                          const isLimited = date.availableSeats <= 5;
                          const startDate = new Date(date.startDate);
                          const endDate = new Date(date.endDate);
                          const hasEarlyBirdDiscount =
                            date.earlyBirdDiscount &&
                            date.earlyBirdDeadline &&
                            new Date() <= new Date(date.earlyBirdDeadline);
                          const hasLastMinuteDiscount =
                            date.lastMinuteDiscount &&
                            date.lastMinuteStart &&
                            new Date() >= new Date(date.lastMinuteStart);

                          return (
                            <button
                              key={date.id}
                              onClick={() => {
                                handleDateSelect(date);
                              }}
                              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-lg border transition-colors text-left w-full ${
                                selectedTourDate?.id === date.id
                                  ? 'border-neutral-950 ring-2 ring-neutral-200'
                                  : showDateSelectionHint
                                    ? 'border-red-200 hover:border-red-400 hover:bg-red-50/30'
                                    : 'border-neutral-200/70 hover:border-neutral-200'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <CalendarDaysIcon className="h-5 w-5 text-neutral-950 flex-shrink-0 mt-1" />
                                <div>
                                  <div className="text-sm font-medium text-neutral-900">
                                    {startDate.toLocaleDateString('tr-TR', {
                                      day: 'numeric',
                                      month: 'long',
                                      year: 'numeric',
                                    })}{' '}
                                    -{' '}
                                    {endDate.toLocaleDateString('tr-TR', {
                                      day: 'numeric',
                                      month: 'long',
                                      year: 'numeric',
                                    })}
                                  </div>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    <span
                                      className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${isLimited ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}
                                    >
                                      {isLimited
                                        ? `Son ${date.availableSeats} kontenjan!`
                                        : `${date.availableSeats} kişilik kontenjan`}
                                    </span>
                                    {hasEarlyBirdDiscount && (
                                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-neutral-100 text-neutral-800">
                                        %{date.earlyBirdDiscount} Erken
                                        Rezervasyon
                                      </span>
                                    )}
                                    {hasLastMinuteDiscount && (
                                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-amber-100 text-amber-700">
                                        %{date.lastMinuteDiscount} Son Dakika
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-1">
                                <div className="text-lg font-semibold text-neutral-800">
                                  {date.price.toLocaleString('tr-TR')} ₺
                                </div>
                                {date.minParticipants && (
                                  <div className="text-xs text-neutral-500">
                                    Minimum {date.minParticipants} kişi
                                  </div>
                                )}
                              </div>
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tur Operatörü Bilgileri - ikas Style */}
              {tourOperator && (
                <div
                  className="bg-white rounded-xl p-6 border border-neutral-200/70 shadow-md w-full"
                  /* Simplified card style */
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                      <ChatBubbleLeftRightIcon className="h-6 w-6 mr-2.5 text-neutral-950 flex-shrink-0" />
                      <span>Tur Operatörü</span>
                    </h2>
                    {(tourOperator.reviewCount ?? 0) > 0 && (
                      <div className="flex items-center text-xs text-neutral-500 flex-wrap">
                        <div className="flex items-center text-yellow-400 mr-1.5">
                          {renderStars(tourOperator.rating ?? 0)}
                        </div>
                        <span className="font-medium">
                          ({(tourOperator.rating ?? 0).toFixed(1)}/5)
                        </span>
                        <span className="mx-1">•</span>
                        <span>{tourOperator.reviewCount} değerlendirme</span>
                      </div>
                    )}
                  </div>

                  {/* Simplified Operator Info Area */}
                  <div className="bg-neutral-50/60 p-5 rounded-lg border border-neutral-200/70 mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
                        <Image
                          src={
                            tourOperator.logo ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(tourOperator.companyName || 'Operator')}&background=0EA5E9&color=fff`
                          }
                          alt={tourOperator.companyName || 'Tur Operatörü'}
                          width={48}
                          height={48}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-lg font-semibold text-gray-900">
                            {tourOperator.companyName}
                          </h4>
                          {tourOperator.membershipTier && (
                            <MembershipBadge
                              tier={tourOperator.membershipTier}
                            />
                          )}
                        </div>
                        <Link
                          href={`/tour-operator/${tourOperator.id}#tours`}
                          className="text-sm text-neutral-950 hover:text-neutral-800"
                        >
                          Tüm turları gör
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Simplified Description Area */}
                  <div className="bg-neutral-50/60 p-5 rounded-lg border border-neutral-200/70 mb-6">
                    <p className="text-neutral-700 text-sm leading-relaxed line-clamp-3">
                      {tourOperator.description ||
                        'Tur operatörü hakkında bilgi bulunmamaktadır.'}
                    </p>
                  </div>

                  {/* Simplified Link Button */}
                  <Link
                    href={`/tour-operator/${tourOperator.id}`}
                    className="group text-sm font-medium text-neutral-950 hover:text-neutral-800 transition-colors flex items-center justify-between p-4 rounded-lg border border-neutral-200/70 hover:bg-neutral-100/50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-neutral-950"
                  >
                    <span className="flex items-center">
                      <BuildingOfficeIcon className="w-4 h-4 mr-2" />
                      <span>Operatör detayları</span>
                    </span>
                    <ArrowRightIcon className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              )}

              {/* Dahil Olanlar / Olmayanlar - ikas Style */}
              <div
                className="bg-white rounded-xl p-6 border border-neutral-200/70 shadow-md w-full"
                /* Simplified card style */
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                    <CheckCircleIcon className="h-6 w-6 mr-2.5 text-neutral-950 flex-shrink-0" />
                    <span>Dahil Olanlar / Olmayanlar</span>
                  </h2>
                </div>

                {/* Simplified Included Area */}
                <div className="bg-emerald-50/60 p-5 rounded-lg border border-emerald-200/70 mb-6">
                  <h3 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center">
                    <CheckCircleIcon className="w-5 h-5 mr-2 text-emerald-600 flex-shrink-0" />
                    <span>Dahil Olanlar</span>
                  </h3>
                  <ul className="space-y-2.5">
                    {inclusions.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start p-3 rounded-md bg-white/70 border border-emerald-100"
                      >
                        <CheckCircleIcon className="w-4 h-4 text-emerald-500 mr-2.5 mt-0.5 flex-shrink-0" />
                        <span className="text-neutral-700 text-sm font-medium">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Simplified Excluded Area */}
                <div className="bg-red-50/60 p-5 rounded-lg border border-red-200/70">
                  <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
                    <XCircleIcon className="w-5 h-5 mr-2 text-red-600 flex-shrink-0" />
                    <span>Dahil Olmayanlar</span>
                  </h3>
                  <ul className="space-y-2.5">
                    {exclusions.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start p-3 rounded-md bg-white/70 border border-red-100"
                      >
                        <XCircleIcon className="w-4 h-4 text-red-500 mr-2.5 mt-0.5 flex-shrink-0" />
                        <span className="text-neutral-700 text-sm font-medium">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {healthPrivileges.length > 0 && (
                <div className="bg-white rounded-xl p-6 border border-neutral-200/70 shadow-md w-full">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                      <HeartIcon className="h-6 w-6 mr-2.5 text-neutral-950 flex-shrink-0" />
                      <span>Sağlık Ayrıcalıkları</span>
                    </h2>
                  </div>
                  <p className="text-sm text-neutral-600 mb-4">
                    Bu turda aşağıdaki sağlık durumlarına saygı duyulur ve
                    destek sağlanır.
                  </p>
                  <div className="bg-sky-50/60 p-5 rounded-lg border border-sky-200/70">
                    <ul className="space-y-2.5">
                      {healthPrivileges.map((item, index) => (
                        <li
                          key={index}
                          className="flex items-start p-3 rounded-md bg-white/70 border border-sky-100"
                        >
                          <ShieldCheckIcon className="w-4 h-4 text-sky-600 mr-2.5 mt-0.5 flex-shrink-0" />
                          <span className="text-neutral-700 text-sm font-medium">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Acentenin Diğer Turları - Kompakt UI */}
              <div
                ref={containerRef}
                className="@container bg-white rounded-xl overflow-hidden border border-neutral-200/70 shadow-md"
              >
                {/* Header - Daha kompakt */}
                <div className="border-b border-neutral-100 px-5 py-4 flex items-center justify-between bg-gray-50/80">
                  <h2 className="text-base font-semibold text-gray-800 flex items-center">
                    <BuildingOfficeIcon className="h-5 w-5 mr-2 text-neutral-950 flex-shrink-0" />
                    <span>Acentenin Diğer Turları</span>
                  </h2>
                  <Link
                    href={`/tour-operator/${tour.tourOperator.id}`}
                    className="text-sm font-medium text-neutral-950 hover:text-neutral-800 transition-colors flex items-center group"
                  >
                    <span className="mr-1">Tümünü Gör</span>
                    <ArrowRightIcon className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
                  </Link>
                </div>

                {/* Tours List - Yatay düzen */}
                <div className="p-5 space-y-4">
                  {otherTours.map((otherTour) => (
                    <div
                      key={otherTour.id}
                      className="flex flex-col @sm:flex-row @sm:items-center gap-4 p-4 rounded-lg border border-neutral-100 hover:border-neutral-200 transition-all bg-white hover:shadow-sm group"
                    >
                      {/* Tur Resmi */}
                      <div className="relative w-full h-40 @sm:w-32 @sm:h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={otherTour.images[0]}
                          alt={otherTour.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {otherTour.discount && otherTour.discount > 0 && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
                            %{otherTour.discount} İndirim
                          </div>
                        )}
                        <div className="absolute bottom-2 left-2">
                          <MembershipBadge
                            tier={otherTour.tourOperator?.membershipTier}
                            variant="onImage"
                          />
                        </div>
                      </div>

                      {/* Tur Bilgileri */}
                      <div className="flex-grow min-w-0">
                        <h3 className="text-base font-medium text-gray-900 mb-2 truncate">
                          {otherTour.name}
                        </h3>
                        <div className="grid grid-cols-1 @sm:grid-cols-2 gap-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <MapPinIcon className="w-4 h-4 mr-1.5 text-gray-500 flex-shrink-0" />
                            <span className="truncate">
                              {typeof otherTour.destinations[0] === 'string'
                                ? otherTour.destinations[0]
                                : otherTour.destinations[0]?.city || 'Türkiye'}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <CalendarDaysIcon className="w-4 h-4 mr-1.5 text-gray-500 flex-shrink-0" />
                            <span>{otherTour.duration} Gün</span>
                          </div>
                          <div className="flex items-center">
                            <UserGroupIcon className="w-4 h-4 mr-1.5 text-gray-500 flex-shrink-0" />
                            <span>
                              Maks. {otherTour.maxParticipants || 20} kişi
                            </span>
                          </div>
                          <div className="flex items-center">
                            <GlobeAltIcon className="w-4 h-4 mr-1.5 text-gray-500 flex-shrink-0" />
                            <span>{otherTour.tourType || 'Kültür Turu'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Fiyat ve Detay Butonu */}
                      <div className="flex @sm:flex-col items-center @sm:items-end justify-between @sm:justify-start gap-2 flex-shrink-0 pt-3 @sm:pt-0 @sm:pl-4 border-t @sm:border-t-0 @sm:border-l border-gray-100">
                        <div className="text-left @sm:text-right">
                          <div className="text-lg font-semibold text-gray-900">
                            {otherTour.price.toLocaleString('tr-TR')} ₺
                          </div>
                          {otherTour.discount && otherTour.discount > 0 && (
                            <div className="text-sm text-gray-500 line-through">
                              {(
                                otherTour.price *
                                (1 + otherTour.discount / 100)
                              ).toLocaleString('tr-TR')}{' '}
                              ₺
                            </div>
                          )}
                        </div>
                        <Link
                          href={`/tour/${otherTour.id}`}
                          className="inline-flex items-center px-4 py-2 bg-neutral-100 text-neutral-950 hover:bg-neutral-100 rounded-lg text-sm font-medium transition-colors group/link flex-shrink-0"
                        >
                          <span>Detaylar</span>
                          <ArrowRightIcon className="w-4 h-4 ml-1.5 transform group-hover/link:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Animasyonlu Scroll İndikatörü - Simplified */}
      {showScrollIndicator && (
        <div className="fixed bottom-28 right-6 hidden md:flex flex-col items-center animate-bounce-subtle z-30 pointer-events-none">
          {/* Removed text */}
          <div className="w-9 h-9 flex items-center justify-center bg-white rounded-full shadow-md border border-neutral-200/80">
            <ChevronDownIcon className="w-5 h-5 text-neutral-500" />
          </div>
        </div>
      )}

      {/* Video Tour Düğmesi - Simplified */}
      <div className="fixed top-1/2 right-6 transform -translate-y-1/2 hidden lg:block z-30">
        <button className="group relative w-12 h-12 bg-white rounded-full shadow-md border border-neutral-200/80 flex items-center justify-center hover:bg-neutral-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-950">
          {/* Removed ping animation */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-neutral-950"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9A2.25 2.25 0 0013.5 5.25h-9A2.25 2.25 0 002.25 7.5v9A2.25 2.25 0 004.5 18.75z"
            />
          </svg>
          {/* Simplified Tooltip */}
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-neutral-800 text-white text-xs font-medium px-2.5 py-1 rounded shadow-sm pointer-events-none">
            Video Turu
          </span>
        </button>
      </div>

      {/* BottomBookingBar Component */}
      <BottomBookingBar
        tour={tour ? { ...tour, tourDates: availableTourDates } : undefined}
        onDateSelect={handleDateSelect}
        onParticipantsChange={handleParticipantsChange}
        isExpanded={expanded}
        onExpandedChange={setExpanded}
        selectedDate={selectedTourDate}
      />
    </div>
  );
}
