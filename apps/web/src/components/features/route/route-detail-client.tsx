'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { parseJsonArray } from '@/lib/utils';
import { mergeRouteWithOverlay } from '@/lib/route-page-overlay';
import { getOperatorDisplayName } from '@/lib/operator';
import { ApiError } from '@/services/api-client';
import { getRoutePageOverlay } from '@/services/content';
import { getRouteById, type RouteWithStats } from '@/services/route';

type TourWithOperator = {
  id: string;
  title: string;
  /** Legacy list cards sometimes expose `name` instead of `title`. */
  name?: string;
  description?: string;
  price: string | number;
  images?: string | null;
  features?: string | null;
  durationDays?: number;
  duration?: string | number | null;
  difficultyLevel?: string | null;
  rating?: number | null;
  averageRating?: string | number;
  reviewCount?: number;
  category?: string;
  partnerId?: string;
  tourOperator?: {
    id?: string;
    companyName?: string | null;
    logo?: string | null;
    email?: string | null;
  } | null;
};
import {
  MapPin as MapPinIcon,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  Star as StarIcon,
  ArrowLeft as ArrowLeftIcon,
  Cloud as CloudIcon,
  Truck as TruckIcon,
  Image as PhotoIcon,
  ArrowRight as ArrowRightIcon,
} from 'lucide-react';

interface RouteDetailResponse {
  route: RouteWithStats;
  tours: TourWithOperator[];
  toursByCategory: Record<string, TourWithOperator[]>;
}

interface PageProps {
  routeId: string;
}

function formatPrice(price: number): string {
  return `₺${Math.round(price).toLocaleString('tr-TR')}`;
}

function getTourImage(tour: TourWithOperator): string {
  const images = parseJsonArray<string>(tour.images);
  return images[0] || 'https://placehold.co/800x600/e5e7eb/6b7280?text=Tur';
}

function getTourFeatures(tour: TourWithOperator): string[] {
  return parseJsonArray<string>(tour.features).slice(0, 4);
}

export default function RouteDetailClient({ routeId }: PageProps) {
  const searchParams = useSearchParams();
  const [data, setData] = useState<RouteDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const fetchRoute = useCallback(async () => {
    setLoading(true);
    setNotFound(false);
    try {
      const [body, overlay] = await Promise.all([
        getRouteById(routeId, {
          search: searchParams.get('search') ?? undefined,
          category: searchParams.get('category') ?? undefined,
          duration: searchParams.get('duration') ?? undefined,
          season: searchParams.get('season') ?? undefined,
        }),
        getRoutePageOverlay(routeId).catch(() => null),
      ]);
      if (!body?.route) {
        setNotFound(true);
        setData(null);
        return;
      }
      const mergedRoute = mergeRouteWithOverlay(body.route, overlay);
      const tours = (body.tours ?? []) as TourWithOperator[];
      const fromApi = (
        body as { toursByCategory?: Record<string, TourWithOperator[]> }
      ).toursByCategory;
      const toursByCategory =
        fromApi && Object.keys(fromApi).length > 0
          ? fromApi
          : tours.reduce<Record<string, TourWithOperator[]>>((acc, tour) => {
              const key = tour.category?.trim() || 'Turlar';
              (acc[key] ??= []).push(tour);
              return acc;
            }, {});
      setData({
        route: mergedRoute,
        tours,
        toursByCategory,
      });
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        setNotFound(true);
        setData(null);
        return;
      }
      console.error('Route detail fetch error:', error);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [routeId, searchParams]);

  useEffect(() => {
    fetchRoute();
  }, [fetchRoute]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-white">
        <p className="text-sm text-neutral-500">Rota yükleniyor…</p>
      </div>
    );
  }

  if (notFound || !data) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-white px-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-950">
            Rota bulunamadı
          </h1>
          <p className="mt-3 text-neutral-600">
            Aradığınız rota mevcut değil veya kaldırılmış olabilir.
          </p>
          <Link
            href="/routes"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Rotalara Dön
          </Link>
        </div>
      </div>
    );
  }

  const { route, toursByCategory } = data;
  const categoryEntries = Object.entries(toursByCategory);

  return (
    <div className="bg-white text-neutral-800">
      {/* Hero — full-bleed; dense gradient for text contrast (no floating card) */}
      <section className="relative min-h-[70svh] w-full overflow-hidden sm:min-h-[75svh]">
        <Image
          src={route.image}
          alt={route.name}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Base wash + bottom-left reading plane — not a card */}
        <div
          className="absolute inset-0 animate-fadeInBg"
          aria-hidden
          style={{
            background:
              'linear-gradient(180deg, rgba(10,10,10,0.35) 0%, rgba(10,10,10,0.25) 35%, rgba(10,10,10,0.72) 70%, rgba(10,10,10,0.92) 100%), linear-gradient(90deg, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.2) 55%, transparent 100%)',
          }}
        />
        <div className="relative z-10 flex min-h-[70svh] flex-col justify-end px-4 pb-14 pt-28 sm:min-h-[75svh] sm:px-6 sm:pb-16 lg:px-8">
          <div className="mx-auto w-full max-w-7xl animate-fadeInUp [text-shadow:0_1px_2px_rgba(0,0,0,0.45)]">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/80">
              turta
            </p>
            <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              {route.name}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">
              {route.description}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#tours"
                onClick={(event) => {
                  event.preventDefault();
                  document
                    .getElementById('tours')
                    ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="inline-flex min-h-[44px] w-fit items-center justify-center rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-neutral-950 shadow-sm hover:bg-neutral-100"
              >
                Turları gör
              </a>
              <p className="inline-flex items-center gap-1.5 text-sm text-white/85">
                <MapPinIcon className="h-4 w-4 shrink-0" />
                {route.location}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics — below hero, no icons / no card chrome */}
      <section className="border-b border-neutral-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-neutral-100 md:grid-cols-4">
          {[
            {
              label: 'Süre',
              value: route.computedDuration ?? route.duration,
            },
            {
              label: 'En İyi Zaman',
              value: route.bestTimeToVisit,
            },
            {
              label: 'Fiyat Aralığı',
              value: route.priceRange ?? '—',
            },
            {
              label: 'Tur Seçeneği',
              value: `${route.tourCount} tur`,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-start gap-1.5 bg-white px-5 py-6 sm:px-8 sm:py-8"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                {item.label}
              </p>
              <p className="text-sm font-semibold text-neutral-950 sm:text-base">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Hakkında */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-16 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-neutral-950">
          Hakkında
        </h2>
        <div className="mt-6 max-w-3xl space-y-4">
          {route.longDescription.split('\n\n').map((paragraph, index) => (
            <p
              key={index}
              className="text-base leading-relaxed text-neutral-600 sm:text-lg"
            >
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 border-t border-neutral-100 pt-10 md:grid-cols-3 md:gap-10">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <CloudIcon className="h-5 w-5 text-neutral-950" />
              <h3 className="text-sm font-semibold text-neutral-950">
                Hava Durumu
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-neutral-600">
              {route.weather}
            </p>
          </div>
          <div>
            <div className="mb-2 flex items-center gap-2">
              <TruckIcon className="h-5 w-5 text-neutral-950" />
              <h3 className="text-sm font-semibold text-neutral-950">Ulaşım</h3>
            </div>
            <p className="text-sm leading-relaxed text-neutral-600">
              {route.transportation}
            </p>
          </div>
          <div>
            <div className="mb-2 flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-neutral-950" />
              <h3 className="text-sm font-semibold text-neutral-950">
                Ziyaret İçin
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-neutral-600">
              {route.bestTimeToVisit}
            </p>
          </div>
        </div>

        {route.highlights.length > 0 ? (
          <div className="mt-8 flex flex-wrap gap-2">
            {route.highlights.map((highlight) => (
              <span
                key={highlight}
                className="inline-flex items-center rounded-md bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700"
              >
                {highlight}
              </span>
            ))}
          </div>
        ) : null}
      </section>

      {/* Turlar */}
      <section
        id="tours"
        className="border-t border-neutral-100 bg-neutral-50 py-14 md:py-16"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-3xl text-center md:mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-950">
              Bu Rotadaki Turlar
            </h2>
            <p className="mt-3 text-base text-neutral-600 md:text-lg">
              {route.name} destinasyonuna giden {route.tourCount} tur seçeneği
            </p>
          </div>

          {categoryEntries.length === 0 ? (
            <div className="mx-auto max-w-md border border-neutral-200 bg-white px-6 py-12 text-center">
              <p className="mb-4 text-neutral-600">
                Bu rota için henüz tur bulunmuyor veya filtrelerinize uygun tur
                yok.
              </p>
              <Link
                href={`/routes/${routeId}`}
                className="text-sm font-semibold text-neutral-950 underline-offset-2 hover:underline"
              >
                Filtreleri temizle
              </Link>
            </div>
          ) : (
            <div className="space-y-14">
              {categoryEntries.map(([category, tours]) => (
                <div key={category}>
                  <h3 className="mb-6 flex items-center gap-2 text-xl font-semibold tracking-tight text-neutral-950 md:mb-8 md:text-2xl">
                    <PhotoIcon className="h-5 w-5 text-neutral-950" />
                    {category}
                  </h3>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {tours.map((tour) => {
                      const operatorName = getOperatorDisplayName(
                        tour.tourOperator?.companyName,
                        tour.tourOperator?.email ?? undefined,
                      );
                      const features = getTourFeatures(tour).slice(0, 2);
                      const displayName = tour.name ?? tour.title;
                      const ratingValue =
                        tour.rating ??
                        (tour.averageRating != null
                          ? Number(tour.averageRating)
                          : null);
                      const durationLabel = `${tour.duration ?? tour.durationDays ?? '—'} gün`;
                      const priceLabel = formatPrice(Number(tour.price) || 0);

                      return (
                        <article
                          key={tour.id}
                          className="group flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-md"
                        >
                          <Link
                            href={`/tours/${tour.id}`}
                            className="relative aspect-[16/10] overflow-hidden bg-neutral-100"
                          >
                            <Image
                              src={getTourImage(tour)}
                              alt={displayName}
                              fill
                              className="object-cover transition duration-500 group-hover:scale-105"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                            <span className="absolute bottom-3 left-3 inline-flex items-center rounded-md bg-white/90 px-2 py-1 text-xs font-medium text-neutral-900 backdrop-blur-sm">
                              {priceLabel}
                            </span>
                          </Link>

                          <div className="flex flex-1 flex-col gap-2 p-4">
                            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                              {operatorName}
                              {tour.difficultyLevel
                                ? ` · ${tour.difficultyLevel}`
                                : ''}
                            </p>
                            <h4 className="text-lg font-semibold text-neutral-900">
                              <Link
                                href={`/tours/${tour.id}`}
                                className="hover:text-neutral-600"
                              >
                                {displayName}
                              </Link>
                            </h4>
                            <p className="line-clamp-2 text-sm text-neutral-600">
                              {tour.description}
                            </p>

                            <div className="mt-1 space-y-1.5 text-sm text-neutral-500">
                              <div className="flex items-center gap-2">
                                <ClockIcon className="h-4 w-4 shrink-0 text-neutral-950" />
                                <span>{durationLabel}</span>
                              </div>
                              <p className="pl-6 text-xs font-medium text-neutral-800">
                                {priceLabel}
                              </p>
                            </div>

                            {features.length > 0 ? (
                              <div className="mt-1 flex flex-wrap gap-1.5">
                                {features.map((feature) => (
                                  <span
                                    key={feature}
                                    className="inline-flex items-center rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-700"
                                  >
                                    {feature}
                                  </span>
                                ))}
                              </div>
                            ) : null}

                            <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                              <div className="flex min-w-0 items-center">
                                {ratingValue != null && ratingValue > 0 ? (
                                  <>
                                    <div
                                      className="flex items-center"
                                      aria-hidden
                                    >
                                      {[...Array(5)].map((_, i) => (
                                        <StarIcon
                                          key={i}
                                          className={`h-3.5 w-3.5 ${
                                            i < Math.floor(ratingValue)
                                              ? 'fill-amber-400 text-amber-400'
                                              : 'text-neutral-300'
                                          }`}
                                        />
                                      ))}
                                    </div>
                                    <span className="ml-1.5 text-sm text-neutral-600">
                                      {ratingValue.toFixed(1)}
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-xs text-neutral-400">
                                    Henüz değerlendirme yok
                                  </span>
                                )}
                              </div>
                              <Link
                                href={`/tours/${tour.id}`}
                                className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-neutral-950 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800"
                              >
                                Keşfet
                                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                              </Link>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
