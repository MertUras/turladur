'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getExperienceById, searchExperiences } from '@/services/activity';
import { resolveMediaUrl, shouldUnoptimizeMedia } from '@/lib/media';
import {
  Star,
  Clock,
  MapPin,
  Users,
  Calendar,
  ChevronLeft,
  ChevronRight,
  X,
  Heart,
  Share2,
  Building2,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import Marquee from 'react-fast-marquee';
import BottomBookingBar, {
  ActivityDate,
} from '@/components/booking/bottom-booking-bar';
import MembershipBadge from '@/components/features/tour/membership-badge';
import type { MembershipTier } from '@/lib/tours/legacy-tour';
import { useFavorites } from '@/hooks/use-favorites';
import { cn } from '@/lib/utils';

interface ActivityOperator {
  id: string;
  companyName?: string;
  logo?: string | null;
  description?: string;
  membershipTier?: MembershipTier | null;
}

interface Activity {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  imageUrl: string;
  gallery: string[];
  location: string;
  duration: string;
  rating: number;
  reviewCount: number;
  popularityRate: number;
  price: number;
  category: string;
  included: string[];
  notIncluded: string[];
  highlights: string[];
  schedule: Array<{ time: string; activity: string }>;
  reviews: Array<{
    id: number;
    user: string;
    rating: number;
    comment: string;
    date: string;
  }>;
  discount?: number;
  activityDates: ActivityDate[];
  meetingPoint?: string;
  meetingPointAddress?: string;
  operator: ActivityOperator | null;
  ageRestriction: string;
}

interface RelatedActivity {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  location: string;
  duration: string;
  rating: number;
  reviewCount: number;
  price: number;
  category: string;
  experienceOperator?: {
    membershipTier?: string | null;
  } | null;
}

export default function ActivityDetailClient() {
  const params = useParams();
  const { isExperienceFavorite, toggleExperienceFavorite, isMutating } =
    useFavorites();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- reserved for related activity modal wiring
  const [selectedActivity, setSelectedActivity] =
    useState<RelatedActivity | null>(null);
  const [relatedActivities, setRelatedActivities] = useState<RelatedActivity[]>(
    [],
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- reserved for review carousel wiring
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- reserved for local date state wiring
  const [activityDates, setActivityDates] = useState<ActivityDate[]>([]);
  const [showBookingBar, setShowBookingBar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<ActivityDate | null>(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const data = await getExperienceById(String(params.id));
        setActivity(data as never);
        setError(null);

        try {
          const { data: relatedData } = await searchExperiences({ limit: 10 });
          setRelatedActivities(relatedData as never);
        } catch {
          // related optional
        }
      } catch {
        setError('Failed to load activity');
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [params.id]);

  const PLACEHOLDER_IMAGE =
    'https://placehold.co/1200x800/e5e7eb/6b7280?text=G%C3%B6rsel+Yok';

  const getImageUrl = (img: unknown) => {
    if (!img) return PLACEHOLDER_IMAGE;
    if (Array.isArray(img)) return img[0] || PLACEHOLDER_IMAGE;
    if (typeof img === 'string') {
      if (img.trim() === '') return PLACEHOLDER_IMAGE;
      // Eğer yanlışlıkla stringified array gelirse (örn: '["/img1.jpg","/img2.jpg"]')
      try {
        const parsed = JSON.parse(img);
        if (Array.isArray(parsed)) return parsed[0] || PLACEHOLDER_IMAGE;
      } catch {}
      return img;
    }
    return PLACEHOLDER_IMAGE;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !activity) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
        <p className="text-gray-600">{error || 'Activity not found'}</p>
      </div>
    );
  }

  const isFavorite = isExperienceFavorite(activity.id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Tur Detayına Benzetilmiş */}
      <div className="relative h-[80vh] md:h-[90vh]">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={getImageUrl(activity.imageUrl)}
            alt={activity.title}
            fill
            priority
            style={{ objectFit: 'cover' }}
            className="brightness-70 transform scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        </div>
        {/* Partner üyelik arması (müşteri değerlendirmelerinden otomatik hesaplanır) */}
        {activity.operator?.membershipTier && (
          <div className="absolute top-6 right-6 z-10">
            <MembershipBadge
              tier={activity.operator.membershipTier}
              variant="onImage"
              className="text-sm px-2.5 py-1"
            />
          </div>
        )}
        {/* Badge ve Başlık */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <div className="mb-4 flex flex-col items-center gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200/70">
              {activity.popularityRate > 80 ? 'Popüler Seçim' : 'Aktivite'}
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            {activity.title}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-6 max-w-2xl mx-auto drop-shadow">
            {activity.description}
          </p>
          {/* Özet Bilgi Kutuları */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-white/90 bg-white/10 px-4 py-2 rounded-lg">
              <Clock className="w-5 h-5 text-white" />
              <span className="text-base font-medium">{activity.duration}</span>
            </div>
            <div className="flex items-center gap-2 text-white/90 bg-white/10 px-4 py-2 rounded-lg">
              <Users className="w-5 h-5 text-white" />
              <span className="text-base font-medium">
                Maks.{' '}
                {activity.activityDates &&
                activity.activityDates.length > 0 &&
                activity.activityDates[0].availableSeats
                  ? activity.activityDates[0].availableSeats
                  : 10}{' '}
                kişi
              </span>
            </div>
            <div className="flex items-center gap-2 text-white/90 bg-white/10 px-4 py-2 rounded-lg">
              <MapPin className="w-5 h-5 text-white" />
              <span className="text-base font-medium">{activity.location}</span>
            </div>
            {activity.meetingPoint && activity.meetingPoint.trim() !== '' && (
              <div className="flex items-center gap-2 text-white/90 bg-white/10 px-4 py-2 rounded-lg">
                <a
                  href={activity.meetingPoint}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sky-200 hover:text-sky-400 underline"
                >
                  <MapPin className="w-5 h-5 text-sky-200" />
                  <span>Buluşma Noktası (Google Maps)</span>
                </a>
              </div>
            )}
            <div className="flex items-center gap-2 text-white/90 bg-white/10 px-4 py-2 rounded-lg">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="text-base font-medium">
                {activity.rating} ({activity.reviewCount} yorum)
              </span>
            </div>
          </div>
          {/* Butonlar */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            <Link
              href="#"
              className="inline-flex items-center justify-center px-7 py-3 bg-sky-600 hover:bg-sky-700 text-white text-base font-semibold rounded-lg transition-colors shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-60 disabled:cursor-not-allowed transform active:scale-[0.98] duration-150 ease-out"
            >
              <MapPin className="h-5 w-5 mr-2" />
              <span>Aktivite Programı</span>
            </Link>
            <Link
              href="#booking"
              className="inline-flex items-center justify-center px-7 py-3 bg-white/10 backdrop-blur-lg text-sky-300 hover:bg-sky-400/10 border border-sky-400/40 hover:border-sky-300/60 text-base font-semibold rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black/50 focus:ring-sky-400 disabled:opacity-60 disabled:cursor-not-allowed transform active:scale-[0.98] duration-150 ease-out"
            >
              <Calendar className="h-5 w-5 mr-2" />
              <span>Rezervasyon Yap</span>
            </Link>
          </div>
        </div>
        {/* Alt bilgi barı (Tur Detayları gibi) */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-md py-4 border-t border-white/10">
          <div className="container px-4 mx-auto">
            <div className="flex flex-wrap items-center justify-center lg:justify-between gap-x-6 gap-y-3">
              {/* Süre */}
              <div className="flex items-center text-white gap-2.5 group">
                <div className="p-2 bg-white/10 rounded-lg ring-1 ring-white/10 group-hover:bg-white/20 transition-colors duration-150 ease-out">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-white/70 font-medium uppercase tracking-wider">
                    Süre
                  </p>
                  <p className="text-sm font-semibold">{activity.duration}</p>
                </div>
              </div>
              {/* Kontenjan */}
              <div className="flex items-center text-white gap-2.5 group">
                <div className="p-2 bg-white/10 rounded-lg ring-1 ring-white/10 group-hover:bg-white/20 transition-colors duration-150 ease-out">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-white/70 font-medium uppercase tracking-wider">
                    Grup
                  </p>
                  <p className="text-sm font-semibold">
                    Maks.{' '}
                    {activity.activityDates &&
                    activity.activityDates.length > 0 &&
                    activity.activityDates[0].availableSeats
                      ? activity.activityDates[0].availableSeats
                      : 10}{' '}
                    kişi
                  </p>
                </div>
              </div>
              {/* Konum */}
              <div className="flex items-center text-white gap-2.5 group">
                <div className="p-2 bg-white/10 rounded-lg ring-1 ring-white/10 group-hover:bg-white/20 transition-colors duration-150 ease-out">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-white/70 font-medium uppercase tracking-wider">
                    Konum
                  </p>
                  <p className="text-sm font-semibold truncate max-w-[150px]">
                    {activity.location}
                  </p>
                </div>
              </div>
              {/* Puan */}
              <div className="flex items-center text-white gap-2.5 group">
                <div className="p-2 bg-white/10 rounded-lg ring-1 ring-white/10 group-hover:bg-white/20 transition-colors duration-150 ease-out">
                  <Star className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-white/70 font-medium uppercase tracking-wider">
                    Puan
                  </p>
                  <p className="text-sm font-semibold">{activity.rating}/5</p>
                </div>
              </div>
              {/* Action Icons */}
              <div className="flex items-center space-x-2 ml-auto">
                <button
                  type="button"
                  className="p-2.5 rounded-lg text-white bg-white/10 hover:bg-white/20 transition-colors duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black/50 focus:ring-white/50 disabled:opacity-50"
                  aria-label={
                    isFavorite ? 'Favorilerden kaldır' : 'Favorilere Ekle'
                  }
                  disabled={isMutating}
                  onClick={() =>
                    void toggleExperienceFavorite(
                      activity.id,
                      `/activities/${activity.id}`,
                    )
                  }
                >
                  <Heart
                    className={cn(
                      'h-5 w-5 text-white',
                      isFavorite && 'fill-current',
                    )}
                    strokeWidth={2.2}
                    fill={isFavorite ? 'currentColor' : 'none'}
                  />
                </button>
                <button
                  className="p-2.5 rounded-lg text-white bg-white/10 hover:bg-white/20 transition-colors duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black/50 focus:ring-white/50"
                  aria-label="Paylaş"
                >
                  <Share2 className="h-5 w-5 text-white" strokeWidth={2.2} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Description */}
            <div
              id="overview"
              className="bg-white p-6 rounded-lg shadow-sm mb-8 scroll-mt-24"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Öne Çıkanlar
              </h2>
              <div className="prose max-w-none text-gray-600">
                <p>{activity.longDescription}</p>
              </div>
            </div>

            {/* Program */}
            <div
              id="program"
              className="bg-white p-6 rounded-lg shadow-sm mb-8 scroll-mt-24"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Program Akışı
              </h2>
              <ul className="space-y-4">
                {activity.schedule.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-600">
                        <Clock className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-md font-semibold text-gray-700">
                        {item.time}
                      </p>
                      <p className="text-gray-600">{item.activity}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Modern Buluşma Noktası Kartı */}
            {(activity.meetingPointAddress ||
              activity.location ||
              activity.meetingPoint) && (
              <div className="bg-white rounded-2xl shadow-md border border-neutral-100/80 flex flex-col items-stretch mb-10 overflow-hidden w-full max-w-none">
                <div className="flex flex-col gap-2 p-6">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-2xl font-semibold text-gray-900">
                      Buluşma Noktası
                    </h2>
                  </div>
                  {activity.meetingPointAddress && (
                    <div className="text-base text-gray-700 font-medium whitespace-pre-line">
                      {activity.meetingPointAddress}
                    </div>
                  )}
                  {activity.location && (
                    <div className="text-base text-gray-500 font-normal">
                      <span className="font-semibold">Konum: </span>
                      {activity.location}
                    </div>
                  )}
                  {activity.meetingPoint &&
                    activity.meetingPoint.trim() !== '' && (
                      <a
                        href={activity.meetingPoint}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sky-700 hover:text-sky-900 underline text-base font-medium mt-2"
                      >
                        <MapPin className="w-5 h-5" />
                        Google Maps&apos;te Aç
                      </a>
                    )}
                </div>
              </div>
            )}

            {/* Gallery */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Fotoğraf Galerisi
              </h2>
              <div className="relative">
                <div className="overflow-x-auto hide-scrollbar gallery-container">
                  <div
                    className="flex gap-4 pb-4"
                    style={{ scrollBehavior: 'smooth' }}
                  >
                    {activity.gallery.map((image, index) => (
                      <div
                        key={index}
                        className="flex-none w-[220px] relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer"
                        style={{ top: '0px' }}
                        onClick={() => {
                          setSelectedImage(image);
                          setCurrentImageIndex(index);
                        }}
                      >
                        <Image
                          src={getImageUrl(image)}
                          alt={`${activity.title} - Fotoğraf ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 220px) 100vw, 220px"
                          priority={index === 0}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => {
                    const container =
                      document.querySelector('.gallery-container');
                    if (container) {
                      container.scrollLeft -= 240;
                    }
                  }}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-600" />
                </button>
                <button
                  onClick={() => {
                    const container =
                      document.querySelector('.gallery-container');
                    if (container) {
                      container.scrollLeft += 240;
                    }
                  }}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors"
                >
                  <ChevronRight className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Highlights */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                Öne Çıkanlar
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activity.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-gray-800">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8 overflow-y-hidden">
              <div className="text-center max-w-3xl mx-auto mb-8">
                <div className="inline-flex items-center justify-center px-3 py-1 bg-sky-100 rounded-full text-sky-700 font-medium text-xs mb-4">
                  <Star className="w-4 h-4 mr-1.5 text-yellow-400" />
                  Müşteri Deneyimleri
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2">
                  Yorumlar
                </h2>
                <p className="text-base text-neutral-600">
                  Aktivitemizi deneyimleyen misafirlerimizin gerçek yorumları.
                </p>
              </div>
              <div className="-mx-2 md:-mx-4 lg:-mx-6 overflow-y-hidden h-52">
                <Marquee
                  gradient={true}
                  gradientColor={'rgb(248, 250, 252)'}
                  gradientWidth={60}
                  speed={25}
                  pauseOnHover={true}
                  className="py-2 overflow-y-hidden h-48"
                >
                  {activity.reviews.map((review) => (
                    <div
                      key={review.id}
                      className="mx-2 w-64 sm:w-72 flex-shrink-0 h-48"
                    >
                      <div className="bg-white border border-neutral-200/80 rounded-xl p-4 flex flex-col h-full shadow-sm hover:shadow-md transition-shadow duration-300 justify-between">
                        <p className="text-sm text-neutral-700 font-normal leading-snug mb-2 flex-grow italic line-clamp-3">
                          “{review.comment}”
                        </p>
                        <div className="flex items-center justify-between pt-2 border-t border-neutral-100 mt-2">
                          <div className="flex items-center gap-2">
                            <div className="relative h-8 w-8 rounded-full overflow-hidden flex-shrink-0 bg-gray-100">
                              <Image
                                src={`https://randomuser.me/api/portraits/lego/${review.id % 10}.jpg`}
                                alt={review.user}
                                fill
                                sizes="32px"
                                className="object-cover"
                              />
                            </div>
                            <span className="text-xs text-gray-700 font-medium">
                              {review.user}
                            </span>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-xs text-gray-500">
                              {review.date}
                            </span>
                            <div className="flex items-center gap-1 mt-0.5">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-xs text-gray-600 font-semibold">
                                {review.rating}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </Marquee>
              </div>
            </div>

            {/* Similar Activities */}
            {relatedActivities.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-semibold mb-6 text-gray-900">
                  Benzer Aktiviteler
                </h2>
                <div className="relative">
                  <div className="overflow-x-auto hide-scrollbar similar-activities-container">
                    <div
                      className="flex gap-4 pb-4"
                      style={{ scrollBehavior: 'smooth' }}
                    >
                      {relatedActivities.map((relatedActivity) => (
                        <div
                          key={relatedActivity.id}
                          className="flex-none w-[300px] bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group cursor-pointer"
                          onClick={() =>
                            (window.location.href = `/activities/${relatedActivity.id}`)
                          }
                        >
                          <div className="relative h-48">
                            <Image
                              src={relatedActivity.imageUrl}
                              alt={relatedActivity.title}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                              <span className="text-sm font-medium text-gray-800">
                                {relatedActivity.category}
                              </span>
                            </div>
                            <div className="absolute bottom-3 left-3">
                              <MembershipBadge
                                tier={
                                  relatedActivity.experienceOperator
                                    ?.membershipTier as
                                    MembershipTier | null | undefined
                                }
                                variant="onImage"
                              />
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
                              {relatedActivity.title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {relatedActivity.description}
                            </p>
                            <div className="flex items-center gap-2 mb-3">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {relatedActivity.location}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="text-sm text-gray-600">
                                  {relatedActivity.rating}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-semibold text-blue-600">
                                  {relatedActivity.price.toLocaleString(
                                    'tr-TR',
                                  )}
                                  ₺
                                </span>
                                <span className="text-sm text-gray-500">
                                  {relatedActivity.duration}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const container = document.querySelector(
                        '.similar-activities-container',
                      );
                      if (container) {
                        container.scrollLeft -= 320;
                      }
                    }}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors z-10"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-600" />
                  </button>
                  <button
                    onClick={() => {
                      const container = document.querySelector(
                        '.similar-activities-container',
                      );
                      if (container) {
                        container.scrollLeft += 320;
                      }
                    }}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors z-10"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-600" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              {/* New Reservation Card */}
              <div
                id="booking"
                className="bg-white rounded-xl p-6 border border-neutral-200/70 shadow-md w-full"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                    <Calendar className="h-6 w-6 mr-2.5 text-sky-600 flex-shrink-0" />
                    <span>Rezervasyon</span>
                  </h2>
                  <div className="flex items-center gap-2 flex-wrap justify-start sm:justify-end">
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200/70">
                      Ücretsiz İptal
                    </div>
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-sky-100 text-sky-800 border border-sky-200/70">
                      Anında Onay
                    </div>
                  </div>
                </div>

                <div className="bg-neutral-50/60 p-6 rounded-lg border border-neutral-200/70 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-neutral-800">
                      Aktivite Tarihleri
                    </h3>
                    <div className="text-sm text-neutral-600">
                      {activity.activityDates?.length || 0} tarih mevcut
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    {!activity.activityDates ||
                    activity.activityDates.length === 0 ? (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 text-neutral-400 mx-auto mb-3" />
                        <p className="text-neutral-600">
                          Şu anda mevcut aktivite tarihi bulunmamaktadır.
                        </p>
                      </div>
                    ) : (
                      activity.activityDates.map((date) => {
                        const isLimited = date.availableSeats <= 5;
                        const startDate = new Date(date.startDate);
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars -- endDate reserved for multi-day display
                        const endDate = new Date(date.endDate);

                        return (
                          <button
                            key={date.id}
                            onClick={() => {
                              setSelectedDate(date);
                              setShowBookingBar(true);
                            }}
                            className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-lg border transition-colors text-left w-full ${selectedDate?.id === date.id ? 'border-sky-500 ring-2 ring-sky-200' : 'border-neutral-200/70 hover:border-sky-200'}`}
                          >
                            <div className="flex items-start gap-3">
                              <Calendar className="h-5 w-5 text-sky-600 flex-shrink-0 mt-1" />
                              <div>
                                <div className="text-sm font-medium text-neutral-900">
                                  {startDate.toLocaleDateString('tr-TR', {
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
                                      ? `Son ${date.availableSeats} kişilik yer!`
                                      : `${date.availableSeats} kişilik kontenjan`}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <div className="text-lg font-semibold text-sky-700">
                                {date.price.toLocaleString('tr-TR')} ₺
                              </div>
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* Operator Card */}
              {activity.operator && (
                <div className="bg-white rounded-xl p-6 border border-neutral-200/70 shadow-md w-full mt-8">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                      <Building2 className="h-6 w-6 mr-2.5 text-sky-600 flex-shrink-0" />
                      <span>Aktivite Sağlayıcısı</span>
                    </h2>
                    <div className="flex items-center text-xs text-neutral-500 flex-wrap">
                      <div className="flex items-center text-yellow-400 mr-1.5">
                        {/* You would need a similar renderStars function here if you have ratings */}
                      </div>
                      {/* <span className="font-medium">(4.8/5)</span>
                                            <span className="mx-1">•</span>
                                            <span>24 değerlendirme</span> */}
                    </div>
                  </div>

                  <div className="bg-neutral-50/60 p-5 rounded-lg border border-neutral-200/70 mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
                        <Image
                          src={
                            resolveMediaUrl(activity.operator.logo) ||
                            'https://ui-avatars.com/api/?name=Operator&background=0EA5E9&color=fff'
                          }
                          alt={
                            activity.operator.companyName ||
                            'Aktivite Sağlayıcısı'
                          }
                          width={48}
                          height={48}
                          unoptimized={shouldUnoptimizeMedia(
                            resolveMediaUrl(activity.operator.logo),
                          )}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-lg font-semibold text-gray-900">
                            {activity.operator.companyName}
                          </h4>
                          <MembershipBadge
                            tier={activity.operator.membershipTier}
                          />
                        </div>
                        <Link
                          href={`/experience-provider/${activity.operator.id}`}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Tüm aktiviteleri gör
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="bg-neutral-50/60 p-5 rounded-lg border border-neutral-200/70 mb-6">
                    <p className="text-neutral-700 text-sm leading-relaxed line-clamp-3">
                      {activity.operator.description ||
                        'Aktivite sağlayıcısı hakkında bilgi bulunmamaktadır.'}
                    </p>
                  </div>

                  <Link
                    href={`/experience-provider/${activity.operator.id}`}
                    className="group text-sm font-medium text-sky-600 hover:text-sky-700 transition-colors flex items-center justify-between p-4 rounded-lg border border-neutral-200/70 hover:bg-sky-50/50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-sky-500"
                  >
                    <span className="flex items-center">
                      <Building2 className="w-4 h-4 mr-2" />
                      <span>Sağlayıcı detayları</span>
                    </span>
                    <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              )}

              {/* Included/Excluded Section */}
              <div className="bg-white rounded-xl p-6 border border-neutral-200/70 shadow-md w-full mt-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                    <CheckCircle className="h-6 w-6 mr-2.5 text-sky-600 flex-shrink-0" />
                    <span>Dahil Olanlar / Olmayanlar</span>
                  </h2>
                </div>

                <div className="bg-emerald-50/60 p-5 rounded-lg border border-emerald-200/70 mb-6">
                  <h3 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-emerald-600 flex-shrink-0" />
                    <span>Dahil Olanlar</span>
                  </h3>
                  <ul className="space-y-2.5">
                    {activity.included.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start p-3 rounded-md bg-white/70 border border-emerald-100"
                      >
                        <CheckCircle className="w-4 h-4 text-emerald-500 mr-2.5 mt-0.5 flex-shrink-0" />
                        <span className="text-neutral-700 text-sm font-medium">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-red-50/60 p-5 rounded-lg border border-red-200/70">
                  <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
                    <XCircle className="w-5 h-5 mr-2 text-red-600 flex-shrink-0" />
                    <span>Dahil Olmayanlar</span>
                  </h3>
                  <ul className="space-y-2.5">
                    {activity.notIncluded.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start p-3 rounded-md bg-white/70 border border-red-100"
                      >
                        <XCircle className="w-4 h-4 text-red-500 mr-2.5 mt-0.5 flex-shrink-0" />
                        <span className="text-neutral-700 text-sm font-medium">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {selectedDate && showBookingBar && (
        <BottomBookingBar
          activity={{
            id: activity.id,
            name: activity.title,
            price: selectedDate.price,
            activityDates: [selectedDate],
          }}
          selectedDate={selectedDate}
          forceVisible={true}
          isExpanded={true}
          onExpandedChange={(expanded) => setShowBookingBar(expanded)}
        />
      )}

      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100]">
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <Image
              src={selectedImage}
              alt="Selected gallery image"
              width={1600}
              height={900}
              className="object-contain w-full h-full"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2"
            >
              <X className="w-6 h-6" />
            </button>
            <button
              onClick={() => {
                const newIndex =
                  (currentImageIndex - 1 + activity.gallery.length) %
                  activity.gallery.length;
                setCurrentImageIndex(newIndex);
                setSelectedImage(activity.gallery[newIndex]);
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/50 rounded-full p-2"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => {
                const newIndex =
                  (currentImageIndex + 1) % activity.gallery.length;
                setCurrentImageIndex(newIndex);
                setSelectedImage(activity.gallery[newIndex]);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/50 rounded-full p-2"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
