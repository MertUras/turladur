'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { parseJsonArray } from '@/lib/utils';
import { getOperatorDisplayName } from '@/lib/operator';
import { ApiError } from '@/services/api-client';
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
  Users as UserGroupIcon,
  DollarSign as CurrencyDollarIcon,
  Star as StarIcon,
  ArrowLeft as ArrowLeftIcon,
  Cloud as CloudIcon,
  Truck as TruckIcon,
  Image as PhotoIcon,
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
      const body = await getRouteById(routeId, {
        search: searchParams.get('search') ?? undefined,
        category: searchParams.get('category') ?? undefined,
        duration: searchParams.get('duration') ?? undefined,
        season: searchParams.get('season') ?? undefined,
      });
      if (!body?.route) {
        setNotFound(true);
        setData(null);
        return;
      }
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
        route: body.route,
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Rota yükleniyor...</p>
      </div>
    );
  }

  if (notFound || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Rota bulunamadı
          </h1>
          <p className="text-gray-600 mb-6">
            Aradığınız rota mevcut değil veya kaldırılmış olabilir.
          </p>
          <Link
            href="/routes"
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Rotalara Dön
          </Link>
        </div>
      </div>
    );
  }

  const { route, toursByCategory } = data;
  const categoryEntries = Object.entries(toursByCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <div
        className="relative h-[500px] sm:h-[600px] bg-fixed bg-cover bg-center"
        style={{ backgroundImage: `url(${route.image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-4xl mx-auto">
            <div className="mb-6">
              <Link
                href="/routes"
                className="inline-flex items-center text-white/80 hover:text-white text-sm font-medium py-1 px-3 rounded-full bg-white/10 backdrop-blur-sm transition-all"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-1" />
                Rotalara Dön
              </Link>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
              {route.name}
            </h1>
            <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto mb-8">
              {route.description}
            </p>
            <div className="inline-flex items-center space-x-2 text-sm text-white/80 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <MapPinIcon className="w-4 h-4" />
              <span>{route.location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md relative -mt-12 max-w-5xl mx-auto rounded-xl overflow-hidden">
        <div className="grid grid-cols-2 md:grid-cols-4">
          <div className="p-6 border-r border-b md:border-b-0 border-gray-100 flex flex-col items-center text-center">
            <ClockIcon className="w-8 h-8 text-blue-600 mb-3" />
            <div className="text-sm text-gray-500 mb-1">Süre</div>
            <div className="font-semibold text-gray-900">
              {route.computedDuration ?? route.duration}
            </div>
          </div>
          <div className="p-6 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col items-center text-center">
            <CalendarIcon className="w-8 h-8 text-blue-600 mb-3" />
            <div className="text-sm text-gray-500 mb-1">En İyi Zaman</div>
            <div className="font-semibold text-gray-900">
              {route.bestTimeToVisit}
            </div>
          </div>
          <div className="p-6 border-r border-gray-100 flex flex-col items-center text-center">
            <CurrencyDollarIcon className="w-8 h-8 text-blue-600 mb-3" />
            <div className="text-sm text-gray-500 mb-1">Fiyat Aralığı</div>
            <div className="font-semibold text-gray-900">
              {route.priceRange ?? '—'}
            </div>
          </div>
          <div className="p-6 flex flex-col items-center text-center">
            <UserGroupIcon className="w-8 h-8 text-blue-600 mb-3" />
            <div className="text-sm text-gray-500 mb-1">Tur Seçeneği</div>
            <div className="font-semibold text-gray-900">
              {route.tourCount} tur
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
            <span className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3">
              <MapPinIcon className="w-6 h-6" />
            </span>
            Hakkında
          </h2>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-8">
              <div className="prose max-w-none">
                {route.longDescription.split('\n\n').map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-gray-600 mb-4 text-lg leading-relaxed"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-blue-50 rounded-xl p-5">
                  <CloudIcon className="w-8 h-8 text-blue-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Hava Durumu
                  </h3>
                  <p className="text-gray-600 text-sm">{route.weather}</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-5">
                  <TruckIcon className="w-8 h-8 text-blue-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Ulaşım</h3>
                  <p className="text-gray-600 text-sm">
                    {route.transportation}
                  </p>
                </div>
                <div className="bg-blue-50 rounded-xl p-5">
                  <CalendarIcon className="w-8 h-8 text-blue-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Ziyaret İçin
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {route.bestTimeToVisit}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                {route.highlights.map((highlight) => (
                  <span
                    key={highlight}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Bu Rotadaki Turlar
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {route.name} destinasyonuna giden {route.tourCount} tur seçeneği
            </p>
          </div>

          {categoryEntries.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
              <p className="text-gray-600 mb-4">
                Bu rota için henüz tur bulunmuyor veya filtrelerinize uygun tur
                yok.
              </p>
              <Link
                href={`/routes/${routeId}`}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Filtreleri temizle
              </Link>
            </div>
          ) : (
            <div className="space-y-16">
              {categoryEntries.map(([category, tours]) => (
                <div key={category}>
                  <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                    <span className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3">
                      <PhotoIcon className="w-6 h-6" />
                    </span>
                    {category}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tours.map((tour) => {
                      const operatorName = getOperatorDisplayName(
                        tour.tourOperator?.companyName,
                        tour.tourOperator?.email ?? undefined,
                      );
                      const features = getTourFeatures(tour);
                      const displayName = tour.name ?? tour.title;
                      const ratingValue =
                        tour.rating ??
                        (tour.averageRating != null
                          ? Number(tour.averageRating)
                          : null);

                      return (
                        <div
                          key={tour.id}
                          className="bg-white rounded-2xl shadow-sm overflow-hidden group hover:shadow-md transition-all"
                        >
                          <div className="relative h-64">
                            <Image
                              src={getTourImage(tour)}
                              alt={displayName}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-700"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-6">
                              {tour.difficultyLevel && (
                                <span className="inline-block px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full mb-2">
                                  {tour.difficultyLevel}
                                </span>
                              )}
                              <h3 className="text-xl font-bold text-white mb-2">
                                {displayName}
                              </h3>
                              <div className="flex items-center text-white/80 text-sm">
                                <div className="flex items-center mr-4">
                                  <ClockIcon className="w-4 h-4 mr-1" />
                                  {tour.duration ?? tour.durationDays} gün
                                </div>
                                <div className="flex items-center">
                                  <CurrencyDollarIcon className="w-4 h-4 mr-1" />
                                  {formatPrice(Number(tour.price) || 0)}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="p-6">
                            <p className="text-sm text-gray-500 mb-2">
                              {operatorName}
                            </p>

                            {ratingValue != null && ratingValue > 0 && (
                              <div className="flex items-center mb-3">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <StarIcon
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < Math.floor(ratingValue)
                                          ? 'text-yellow-400 fill-yellow-400'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-600 ml-2">
                                  {ratingValue.toFixed(1)}
                                </span>
                              </div>
                            )}

                            <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                              {tour.description}
                            </p>

                            {features.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                {features.slice(0, 3).map((feature) => (
                                  <span
                                    key={feature}
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                  >
                                    {feature}
                                  </span>
                                ))}
                              </div>
                            )}

                            <div className="flex space-x-3">
                              <Link
                                href={`/tour/${tour.id}`}
                                className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50"
                              >
                                Detaylar
                              </Link>
                              <Link
                                href={`/tour/${tour.id}`}
                                className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                              >
                                Rezervasyon
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
