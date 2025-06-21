'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { use } from 'react';
import { 
  ArrowLeftIcon, 
  CalendarIcon, 
  MapPinIcon, 
  ClockIcon, 
  UsersIcon,
  CurrencyDollarIcon,
  TagIcon,
  BuildingOfficeIcon,
  TruckIcon,
  GlobeAltIcon,
  StarIcon,
  UserGroupIcon,
  LanguageIcon,
  HashtagIcon
} from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';

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
  destinations: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: { title: string; description: string }[];
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
  tourOperator: {
    id: string;
    companyName: string;
    logo: string | null;
  };
}

export default function TourDetailPage({ params }: { params: Promise<{ tourId: string }> }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Next.js 15'te params'ı React.use() ile aç
  const { tourId } = use(params);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const response = await fetch(`/api/partner/tours/${tourId}`);
        if (!response.ok) {
          throw new Error('Tur bilgileri yüklenirken bir hata oluştu');
        }
        const data = await response.json();
        setTour(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchTour();
    }
  }, [session, tourId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Hata</h2>
          <p className="text-gray-600">{error || 'Tur bulunamadı'}</p>
          <button
            onClick={() => router.push('/partner-dashboard/tours')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700"
          >
            Geri Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{tour.name}</h1>
          <p className="text-gray-600">Tur detayları</p>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href={`/partner-dashboard/tours/${tour.id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Düzenle
          </Link>
          <Link
            href="/partner-dashboard/tours"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Geri
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* Tur Görselleri */}
          <div className="mb-8">
            <div className="relative h-96 rounded-lg overflow-hidden">
              {tour.images && tour.images.length > 0 ? (
                <Image
                  src={tour.images[0]}
                  alt={tour.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">Görsel yok</span>
                </div>
              )}
            </div>
          </div>

          {/* Tur Detayları */}
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Tur Detayları</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <CalendarIcon className="h-6 w-6 text-gray-400 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Tarih</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {tour.startDate ? new Date(tour.startDate).toLocaleDateString('tr-TR') : '-'} - {tour.endDate ? new Date(tour.endDate).toLocaleDateString('tr-TR') : '-'}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <MapPinIcon className="h-6 w-6 text-gray-400 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Kalkış Şehri</h3>
                  <p className="mt-1 text-sm text-gray-900">{tour.departureCity || '-'}</p>
                </div>
              </div>

              <div className="flex items-start">
                <ClockIcon className="h-6 w-6 text-gray-400 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Süre</h3>
                  <p className="mt-1 text-sm text-gray-900">{tour.duration} gün</p>
                </div>
              </div>

              <div className="flex items-start">
                <UsersIcon className="h-6 w-6 text-gray-400 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Maksimum Katılımcı</h3>
                  <p className="mt-1 text-sm text-gray-900">{tour.maxParticipants || '-'} kişi</p>
                </div>
              </div>

              <div className="flex items-start">
                <CurrencyDollarIcon className="h-6 w-6 text-gray-400 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Fiyat</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {tour.discount ? (
                      <>
                        <span className="line-through text-gray-500 mr-2">{tour.price} ₺</span>
                        <span className="text-red-600">
                          {Math.round(tour.price * (1 - tour.discount / 100))} ₺
                        </span>
                      </>
                    ) : (
                      `${tour.price} ₺`
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <TagIcon className="h-6 w-6 text-gray-400 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Tur Tipi</h3>
                  <p className="mt-1 text-sm text-gray-900">{tour.tourType || '-'}</p>
                </div>
              </div>

              <div className="flex items-start">
                <BuildingOfficeIcon className="h-6 w-6 text-gray-400 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Konaklama Tipi</h3>
                  <p className="mt-1 text-sm text-gray-900">{tour.accommodationType || '-'}</p>
                </div>
              </div>

              <div className="flex items-start">
                <TruckIcon className="h-6 w-6 text-gray-400 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Ulaşım</h3>
                  <p className="mt-1 text-sm text-gray-900">{tour.transportation || '-'}</p>
                </div>
              </div>

              <div className="flex items-start">
                <GlobeAltIcon className="h-6 w-6 text-gray-400 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Bölge</h3>
                  <p className="mt-1 text-sm text-gray-900">{tour.region || '-'}</p>
                </div>
              </div>

              <div className="flex items-start">
                <StarIcon className="h-6 w-6 text-gray-400 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Zorluk Seviyesi</h3>
                  <p className="mt-1 text-sm text-gray-900">{tour.difficultyLevel || '-'}</p>
                </div>
              </div>

              <div className="flex items-start">
                <UserGroupIcon className="h-6 w-6 text-gray-400 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Yaş Sınırı</h3>
                  <p className="mt-1 text-sm text-gray-900">{tour.ageRestriction ? `${tour.ageRestriction}+` : '-'}</p>
                </div>
              </div>

              <div className="flex items-start">
                <LanguageIcon className="h-6 w-6 text-gray-400 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Diller</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {tour.languages && tour.languages.length > 0 ? tour.languages.join(', ') : '-'}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <HashtagIcon className="h-6 w-6 text-gray-400 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Etiketler</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {tour.tags && tour.tags.length > 0 ? tour.tags.join(', ') : '-'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tur Açıklaması */}
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Tur Açıklaması</h2>
            <div className="prose max-w-none">
              <p className="text-gray-600">{tour.description}</p>
            </div>
          </div>

          {/* Tur Programı */}
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Tur Programı</h2>
            <div className="space-y-6">
              {tour.itinerary.map((day, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{day.title}</h3>
                  <p className="text-gray-600">{day.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Dahil Olanlar ve Olmayanlar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Dahil Olanlar</h2>
              <ul className="space-y-2">
                {tour.inclusions.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="h-6 w-6 text-green-500 mr-2">✓</span>
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Dahil Olmayanlar</h2>
              <ul className="space-y-2">
                {tour.exclusions.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="h-6 w-6 text-red-500 mr-2">×</span>
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-6">
            {/* Tur Operatörü Bilgileri */}
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Tur Operatörü</h2>
              <div className="flex items-center">
                {tour.tourOperator.logo ? (
                  <Image
                    src={tour.tourOperator.logo}
                    alt={tour.tourOperator.companyName}
                    width={48}
                    height={48}
                    className="rounded-lg"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-lg font-medium">
                      {tour.tourOperator.companyName.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-900">{tour.tourOperator.companyName}</h3>
                </div>
              </div>
            </div>

            {/* Tur Durumu */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Tur Durumu</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Durum</span>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    tour.featured ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {tour.featured ? 'Aktif' : 'Taslak'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Popüler</span>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    tour.isPopular ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {tour.isPopular ? 'Evet' : 'Hayır'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Son Dakika</span>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    tour.isLastMinute ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {tour.isLastMinute ? 'Evet' : 'Hayır'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Erken Rezervasyon</span>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    tour.isEarlyBird ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {tour.isEarlyBird ? 'Evet' : 'Hayır'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 