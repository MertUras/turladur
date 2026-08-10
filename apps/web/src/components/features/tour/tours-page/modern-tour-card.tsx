'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import type { LegacyTourCard as Tour } from '@/lib/tours/legacy-tour';
import MembershipBadge from '@/components/features/tour/membership-badge';
import StarRating from '@/components/features/tour/star-rating';
import { resolveMediaUrl, shouldUnoptimizeMedia } from '@/lib/media';
import { Calendar, Clock, Heart, Zap, ArrowRight } from 'lucide-react';
import { formatPrice } from './tours-page.helpers';
import { parseJsonString } from '@/lib/tours/parse';
import type { TourDateWithPromotions } from './tours-page.types';
import { useFavorites } from '@/hooks/use-favorites';

/** Split from tours-page-client.tsx (Faz 7) — tour card; UI unchanged. */
export function ModernTourCard({ tour }: { tour: Tour }) {
  const [isHovered, setIsHovered] = useState(false);
  const { isTourFavorite, toggleTourFavorite, isMutating } = useFavorites();
  const isFavorite = isTourFavorite(tour.id);

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

  const formatDepartureCity = (cityData: string | string[] | null): string => {
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

  const tourDatesWithPromotions = tour.tourDates as TourDateWithPromotions[];

  if (tourDatesWithPromotions.length > 0) {
    for (const tourDate of tourDatesWithPromotions) {
      // Erken rezervasyon kontrolü
      if (tourDate.earlyBirdDiscount && tourDate.earlyBirdDiscount > 0) {
        const earlyBirdStart = tourDate.earlyBirdDeadlineStart
          ? new Date(tourDate.earlyBirdDeadlineStart)
          : null;
        const earlyBirdEnd = tourDate.earlyBirdDeadline
          ? new Date(tourDate.earlyBirdDeadline)
          : null;

        const earlyBirdPrice = tourDate.price;
        if (
          earlyBirdPrice != null &&
          earlyBirdStart &&
          earlyBirdEnd &&
          today >= earlyBirdStart &&
          today <= earlyBirdEnd
        ) {
          const discountAmount =
            earlyBirdPrice * (tourDate.earlyBirdDiscount / 100);
          if (discountAmount > appliedDiscount) {
            appliedDiscount = discountAmount;
            discountedPrice = earlyBirdPrice - discountAmount;
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

        const lastMinutePrice = tourDate.price;
        if (
          lastMinutePrice != null &&
          lastMinuteStart &&
          lastMinuteEnd &&
          today >= lastMinuteStart &&
          today <= lastMinuteEnd
        ) {
          const discountAmount =
            lastMinutePrice * (tourDate.lastMinuteDiscount / 100);
          if (discountAmount > appliedDiscount) {
            appliedDiscount = discountAmount;
            discountedPrice = lastMinutePrice - discountAmount;
          }
        }
      }
    }
  }

  // Eğer tarih bazlı indirim yoksa genel tur indirimini uygula
  if (appliedDiscount === 0 && tour.discount && tour.discount > 0) {
    discountedPrice = price * (1 - (tour.discount || 0) / 100);
  }

  const firstDate = tourDatesWithPromotions[0];
  const tourDateText =
    firstDate?.startDate && firstDate?.endDate
      ? `${format(new Date(firstDate.startDate), 'd MMMM', { locale: tr })} - ${format(new Date(firstDate.endDate), 'd MMMM yyyy', { locale: tr })}`
      : `${tour.duration || 1} Gün`;

  const otherDatesCount = tourDatesWithPromotions.length - 1;

  // Tur için tek ve öncelikli etiket belirle
  const getTourBadge = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Sadece tarih kısmını al

    // Tur tarihlerini kontrol et
    if (tourDatesWithPromotions.length > 0) {
      for (const tourDate of tourDatesWithPromotions) {
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
            type="button"
            aria-label={isFavorite ? 'Favorilerden kaldır' : 'Favorilere ekle'}
            disabled={isMutating}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              void toggleTourFavorite(tour.id, `/tours/${tour.id}`);
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
}
