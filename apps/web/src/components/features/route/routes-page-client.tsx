'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ArrowRight as ArrowRightIcon,
  Globe as GlobeAltIcon,
  Heart as HeartIcon,
  Map as MapIcon,
  MapPin as MapPinIcon,
  Mountain as MountainIcon,
  Building2 as BuildingOfficeIcon,
  Star as StarIcon,
  Users as UserGroupIcon,
} from 'lucide-react';

import { Hero } from '@/components/features/home/hero';
import { RouteCard } from '@/components/features/route/route-card';
import {
  mergeRouteWithOverlay,
  routeOverlaysByKey,
} from '@/lib/route-page-overlay';
import { listRoutePageOverlays } from '@/services/content';
import {
  listRoutes,
  type RouteWithStats,
  type RoutesListResponse,
} from '@/services/route';

interface RoutesApiResponse {
  routes: RouteWithStats[];
  categories: Array<{
    key: string;
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
}

/** Tour.category keys — partner Tur Tipi feed. Legacy keys still resolve on API. */
const CATEGORY_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  CULTURAL: GlobeAltIcon,
  NATURE: MapIcon,
  BEACH: HeartIcon,
  GASTRONOMY: MapPinIcon,
  ADVENTURE: MountainIcon,
  CITY: BuildingOfficeIcon,
  // legacy bookmarks
  historical: GlobeAltIcon,
  nature: MapIcon,
  beach: HeartIcon,
  gastronomy: MapPinIcon,
  family: BuildingOfficeIcon,
};

function RouteCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
      <div className="aspect-[16/10] animate-pulse bg-neutral-200" />
      <div className="space-y-3 p-4">
        <div className="h-3 w-24 animate-pulse rounded bg-neutral-200" />
        <div className="h-5 w-3/4 animate-pulse rounded bg-neutral-200" />
        <div className="h-4 w-full animate-pulse rounded bg-neutral-100" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-neutral-100" />
        <div className="flex justify-between pt-2">
          <div className="h-4 w-20 animate-pulse rounded bg-neutral-200" />
          <div className="h-9 w-20 animate-pulse rounded-lg bg-neutral-200" />
        </div>
      </div>
    </div>
  );
}

export default function RoutesPageClient() {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category');
  const [data, setData] = useState<RoutesApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRoutes = useCallback(async () => {
    setLoading(true);
    try {
      const [body, overlays] = await Promise.all([
        listRoutes({
          search: searchParams.get('search') ?? undefined,
          category: searchParams.get('category') ?? undefined,
          duration: searchParams.get('duration') ?? undefined,
          season: searchParams.get('season') ?? undefined,
        }),
        listRoutePageOverlays().catch(() => []),
      ]);
      const overlayMap = routeOverlaysByKey(overlays);
      const mergedBody = {
        ...(body as RoutesListResponse),
        routes: (body as RoutesListResponse).routes.map((route) =>
          mergeRouteWithOverlay(route, overlayMap.get(route.id)),
        ),
      };
      setData(mergedBody as RoutesListResponse);
    } catch (error) {
      console.error('Routes fetch error:', error);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchRoutes();
  }, [fetchRoutes]);

  const routes = data?.routes ?? [];
  const categories = data?.categories ?? [];
  const stats = data?.stats;
  const hasActiveFilters = Boolean(
    searchParams.get('search') ||
    searchParams.get('category') ||
    searchParams.get('duration') ||
    searchParams.get('season'),
  );

  return (
    <div className="bg-white text-neutral-800">
      <Hero variant="routes" />

      {/* Rota Kategorileri */}
      <section className="border-t border-neutral-100 bg-neutral-50 py-14 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-3xl text-center md:mb-12">
            <h2 className="mb-3 text-3xl font-bold tracking-tight text-neutral-950 md:mb-4">
              Rota Kategorileri
            </h2>
            <p className="text-base text-neutral-600 md:text-lg">
              İlgi alanlarınıza göre özenle hazırladığımız rota kategorilerimizi
              keşfedin
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {categories.map((category) => {
              const Icon = CATEGORY_ICONS[category.key] ?? MapIcon;
              const isActive = activeCategory === category.key;
              return (
                <Link
                  key={category.key}
                  href={`/routes?category=${category.key}#popular-routes`}
                  className={`rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md ${
                    isActive
                      ? 'border-neutral-950 ring-1 ring-neutral-950'
                      : 'border-neutral-200'
                  }`}
                >
                  <div
                    className={`mb-5 flex h-12 w-12 items-center justify-center rounded-full ${category.color}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-neutral-950">
                    {category.name}
                  </h3>
                  <p className="mb-5 text-sm leading-relaxed text-neutral-600">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-neutral-700">
                      {category.count} tur
                    </span>
                    <span className="inline-flex items-center text-sm font-semibold text-neutral-950">
                      Keşfet
                      <ArrowRightIcon className="ml-1 h-4 w-4" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popüler Rotalar */}
      <section id="popular-routes" className="py-14 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-3xl text-center md:mb-12">
            <h2 className="mb-3 text-3xl font-bold tracking-tight text-neutral-950 md:mb-4">
              Popüler Rotalar
            </h2>
            <p className="text-base text-neutral-600 md:text-lg">
              Türkiye&apos;nin en çok tercih edilen destinasyonları ve gezi
              rotaları
            </p>
            {hasActiveFilters ? (
              <p className="mt-4">
                <Link
                  href="/routes#popular-routes"
                  className="text-sm font-medium text-neutral-950 underline-offset-2 hover:underline"
                >
                  Filtreleri temizle
                </Link>
              </p>
            ) : null}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, index) => (
                <RouteCardSkeleton key={index} />
              ))}
            </div>
          ) : routes.length === 0 ? (
            <div className="mx-auto max-w-md rounded-xl border border-neutral-200 bg-neutral-50 px-6 py-12 text-center">
              <p className="mb-4 text-neutral-600">
                Arama kriterlerinize uygun rota bulunamadı.
              </p>
              <Link
                href="/routes"
                className="inline-flex rounded-lg bg-neutral-950 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
              >
                Filtreleri temizle
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {routes.map((route) => (
                <RouteCard key={route.id} route={route} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* İstatistikler */}
      {stats ? (
        <section className="bg-neutral-950 py-14 text-white md:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-10 max-w-3xl text-center md:mb-12">
              <h2 className="mb-3 text-3xl font-bold tracking-tight md:mb-4">
                turta Rotalar
              </h2>
              <p className="text-base text-neutral-300 md:text-lg">
                Türkiye&apos;nin en kapsamlı ve detaylı rota arşivi
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
              {[
                {
                  number: String(stats.routeCount),
                  label: 'Aktif Rota',
                  icon: MapIcon,
                },
                {
                  number: String(stats.operatorCount),
                  label: 'Tur Operatörü',
                  icon: UserGroupIcon,
                },
                {
                  number: String(stats.tourCount),
                  label: 'Tur Seçeneği',
                  icon: HeartIcon,
                },
                {
                  number:
                    stats.avgRating !== null ? stats.avgRating.toFixed(1) : '—',
                  label: 'Ortalama Puan',
                  icon: StarIcon,
                },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="rounded-full bg-white/10 p-3">
                      <stat.icon className="h-7 w-7" />
                    </div>
                  </div>
                  <div className="mb-1 text-3xl font-bold md:text-4xl">
                    {stat.number}
                  </div>
                  <div className="text-sm text-neutral-400 md:text-base">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Rota Rehberi CTA */}
      <section className="bg-white py-14 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16">
                <h2 className="mb-4 text-3xl font-bold tracking-tight text-neutral-950">
                  Ücretsiz Rota Rehberi İndirin
                </h2>
                <p className="mb-8 text-base leading-relaxed text-neutral-600 md:text-lg">
                  Türkiye&apos;nin en popüler rotalarını, gizli kalmış
                  destinasyonlarını ve seyahat ipuçlarını içeren kapsamlı
                  rehberimizi hemen indirin.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    type="email"
                    placeholder="E-posta adresiniz"
                    className="h-11 flex-1 rounded-lg border border-neutral-300 bg-white px-3 outline-none ring-neutral-950 focus:ring-2"
                  />
                  <button
                    type="button"
                    className="h-11 rounded-lg bg-neutral-950 px-5 text-sm font-semibold text-white hover:bg-neutral-800"
                  >
                    Rehberi İndir
                  </button>
                </div>
              </div>
              <div className="relative h-64 lg:h-auto lg:min-h-[320px]">
                <Image
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
                  alt="Rota Rehberi"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
