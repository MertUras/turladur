'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Hero } from '@/components/features/home/hero';
import { listRoutes, type RoutesListResponse } from '@/services/route';
import {
  Clock as ClockIcon,
  Calendar as CalendarIcon,
  DollarSign as CurrencyDollarIcon,
  ArrowRight as ArrowRightIcon,
  Globe as GlobeAltIcon,
  Star as StarIcon,
  Map as MapIcon,
  Heart as HeartIcon,
  Users as UserGroupIcon,
  MapPin as MapPinIcon,
} from 'lucide-react';
import type { RouteWithStats } from '@/services/route';

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

const CATEGORY_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  historical: GlobeAltIcon,
  nature: MapIcon,
  beach: HeartIcon,
  gastronomy: MapPinIcon,
  family: UserGroupIcon,
};

function formatRating(rating: number | null): string {
  if (rating === null) return '—';
  return rating.toFixed(1);
}

export default function RoutesPageClient() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<RoutesApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRoutes = useCallback(async () => {
    setLoading(true);
    try {
      const body = await listRoutes({
        search: searchParams.get('search') ?? undefined,
        category: searchParams.get('category') ?? undefined,
        duration: searchParams.get('duration') ?? undefined,
        season: searchParams.get('season') ?? undefined,
      });
      setData(body as RoutesListResponse);
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

  return (
    <div className="bg-white">
      <Hero variant="routes" />

      {/* Rota Kategorileri */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Rota Kategorileri
            </h2>
            <p className="text-lg text-gray-600">
              İlgi alanlarınıza göre özenle hazırladığımız rota kategorilerimizi
              keşfedin
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => {
              const Icon = CATEGORY_ICONS[category.key] ?? MapIcon;
              return (
                <div
                  key={category.key}
                  className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div
                    className={`w-14 h-14 rounded-full ${category.color} flex items-center justify-center mb-6`}
                  >
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-blue-600">
                      {category.count} rota
                    </span>
                    <Link
                      href={`/routes?category=${category.key}#popular-routes`}
                      className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                    >
                      Keşfet
                      <ArrowRightIcon className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popüler Rotalar */}
      <section id="popular-routes" className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Popüler Rotalar
            </h2>
            <p className="text-lg text-gray-600">
              Türkiye&apos;nin en çok tercih edilen destinasyonları ve gezi
              rotaları
            </p>
          </div>

          {loading ? (
            <div className="text-center py-16 text-gray-500">
              Rotalar yükleniyor...
            </div>
          ) : routes.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600 mb-4">
                Arama kriterlerinize uygun rota bulunamadı.
              </p>
              <Link
                href="/routes"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Filtreleri temizle
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {routes.map((route) => (
                <Link
                  key={route.id}
                  href={`/routes/${route.id}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={route.image}
                      alt={route.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
                      <div className="absolute bottom-4 left-4">
                        <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium">
                          {route.tourCount} tur
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {route.name}
                    </h3>
                    <p className="mt-2 text-gray-600 line-clamp-2">
                      {route.description}
                    </p>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <ClockIcon className="w-4 h-4 mr-2 text-blue-600" />
                        {route.computedDuration ?? route.duration}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <CalendarIcon className="w-4 h-4 mr-2 text-blue-600" />
                        {route.bestTimeToVisit}
                      </div>
                      {route.priceRange && (
                        <div className="flex items-center text-sm text-gray-500">
                          <CurrencyDollarIcon className="w-4 h-4 mr-2 text-blue-600" />
                          {route.priceRange}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {route.highlights.slice(0, 3).map((highlight, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {highlight}
                        </span>
                      ))}
                      {route.highlights.length > 3 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          +{route.highlights.length - 3}
                        </span>
                      )}
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex items-center">
                        {route.avgRating !== null ? (
                          <>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <StarIcon
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor(route.avgRating!)
                                      ? 'text-yellow-400 fill-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="ml-2 text-sm text-gray-600">
                              {formatRating(route.avgRating)}
                            </span>
                          </>
                        ) : (
                          <span className="text-sm text-gray-400">
                            Henüz değerlendirme yok
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-medium text-blue-600 flex items-center">
                        Detaylar
                        <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* İstatistikler */}
      {stats && (
        <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">turta Rotalar</h2>
              <p className="text-lg text-blue-100">
                Türkiye&apos;nin en kapsamlı ve detaylı rota arşivi
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="bg-white/20 rounded-full p-3">
                      <stat.icon className="w-8 h-8" />
                    </div>
                  </div>
                  <div className="text-4xl font-bold mb-2">{stat.number}</div>
                  <div className="text-blue-100">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Rota Rehberi CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-50 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Ücretsiz Rota Rehberi İndirin
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Türkiye&apos;nin en popüler rotalarını, gizli kalmış
                  destinasyonlarını ve seyahat ipuçlarını içeren kapsamlı
                  rehberimizi hemen indirin.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    placeholder="E-posta adresiniz"
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all">
                    Rehberi İndir
                  </button>
                </div>
              </div>
              <div className="relative h-64 lg:h-auto">
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
