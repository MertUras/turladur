'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import {
  MapIcon,
  MapPinIcon,
  PhotoIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';
import { normalizeItinerary, NormalizedItineraryDay } from './normalizeItinerary';

interface TourItineraryMobileProps {
  itinerary: unknown;
  destinations: string[];
  images: string[];
  tourStartDate: Date | null;
}

const PREVIEW_DAY_COUNT = 2;

function formatDayDate(tourStartDate: Date | null, dayIndex: number, dayNumber: number): string {
  if (tourStartDate) {
    const currentDate = new Date(tourStartDate);
    currentDate.setDate(currentDate.getDate() + dayIndex);
    return currentDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' });
  }
  return `${dayNumber}. Gün`;
}

function getDayDestination(destinations: string[], dayIndex: number): string {
  return destinations[dayIndex] || destinations[0] || '';
}

function getDayImages(images: string[], dayIndex: number): string[] {
  return images.slice(dayIndex * 2, dayIndex * 2 + 2);
}

function collectImportantPoints(
  days: NormalizedItineraryDay[],
  destinations: string[]
): { label: string; dayNumber?: number }[] {
  const points: { label: string; dayNumber?: number }[] = [];

  days.forEach((day) => {
    day.highlights?.forEach((highlight) => {
      if (!points.some((point) => point.label === highlight)) {
        points.push({ label: highlight, dayNumber: day.dayNumber });
      }
    });
  });

  destinations.forEach((destination) => {
    if (!points.some((point) => point.label === destination)) {
      points.push({ label: destination });
    }
  });

  return points;
}

function MobileItineraryEmptyState() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md border border-neutral-200/70 p-5">
      <div className="text-center py-8">
        <div className="w-14 h-14 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapIcon className="w-7 h-7 text-sky-600" />
        </div>
        <h4 className="text-base font-medium text-gray-900 mb-2">Tur Programı Hazırlanıyor</h4>
        <p className="text-sm text-gray-600">
          Bu tur için detaylı günlük program yakında eklenecektir.
        </p>
      </div>
    </div>
  );
}

function CompactDayRow({
  day,
  destinationName,
  isLast,
}: {
  day: NormalizedItineraryDay;
  destinationName: string;
  isLast: boolean;
}) {
  const titleSuffix = day.title
    ? day.title.replace(/^\d+\.?\s*Gün\s*:?\s*/i, '')
    : destinationName;
  const rowTitle = `${day.dayNumber}. Gün ${titleSuffix}`.trim();

  return (
    <div className="relative flex gap-3 pb-5 last:pb-0">
      {!isLast && (
        <div
          className="absolute left-[9px] top-[11px] -bottom-[11px] w-0.5 bg-sky-200 z-0"
          aria-hidden
        />
      )}
      <div className="relative z-10 flex-shrink-0 w-5 pt-1.5">
        <div className="mx-auto w-2.5 h-2.5 rounded-full bg-sky-500 ring-4 ring-sky-100" />
      </div>

      <button
        type="button"
        className="flex-1 flex items-start justify-between gap-2 text-left min-w-0 -mt-0.5"
        aria-label={`${day.dayNumber}. gün programı`}
      >
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900 leading-snug">
            {rowTitle}
          </p>
          {day.description && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
              {day.description}
            </p>
          )}
        </div>
        <ChevronRightIcon className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
      </button>
    </div>
  );
}

function DetailedDayCard({
  day,
  destinationName,
  formattedDate,
  dayImages,
}: {
  day: NormalizedItineraryDay;
  destinationName: string;
  formattedDate: string;
  dayImages: string[];
}) {
  const routeTitle = day.title || destinationName || `${day.dayNumber}. Gün Programı`;

  return (
    <div className="relative flex gap-4">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-sky-100 text-sky-600 ring-4 ring-white">
          <span className="text-sm font-semibold">{day.dayNumber}</span>
        </div>
      </div>

      <div className="flex-1 min-w-0 pb-8">
        <div className="bg-white rounded-xl border border-neutral-200/70 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-neutral-100 bg-sky-50/40">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-sky-100 text-sky-700">
                {formattedDate}
              </span>
              <h4 className="text-sm font-semibold text-gray-900">{routeTitle}</h4>
            </div>
          </div>

          <div className="p-4">
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              {day.description || 'Bu gün için detaylı program bilgisi yakında eklenecektir.'}
            </p>

            {dayImages.length > 0 && (
              <div className="grid grid-cols-2 gap-2.5 mb-4">
                {dayImages.map((image, imgIndex) => (
                  <div key={imgIndex} className="relative aspect-[4/3] rounded-lg overflow-hidden">
                    <Image
                      src={image}
                      alt={`${routeTitle} - ${imgIndex + 1}`}
                      fill
                      sizes="50vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {destinationName && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-50 border border-gray-100">
                <MapPinIcon className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-xs text-gray-500">Konum</span>
                <span className="text-xs font-medium text-gray-700">{destinationName}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TourItineraryMobile({
  itinerary,
  destinations,
  images,
  tourStartDate,
}: TourItineraryMobileProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'program' | 'points'>('program');

  const days = useMemo(() => normalizeItinerary(itinerary), [itinerary]);
  const importantPoints = useMemo(
    () => collectImportantPoints(days, destinations),
    [days, destinations]
  );

  if (days.length === 0) {
    return <MobileItineraryEmptyState />;
  }

  const previewDays = days.slice(0, PREVIEW_DAY_COUNT);
  const hasMoreDays = days.length > PREVIEW_DAY_COUNT;

  if (!isExpanded) {
    return (
      <div className="bg-white rounded-xl overflow-hidden shadow-md border border-neutral-200/70">
        <div className="px-4 pt-5 pb-3">
          <h3 className="text-lg font-semibold text-gray-900">Tur Programı</h3>
        </div>

        <div className="px-4 pb-2">
          {previewDays.map((day, index) => (
            <CompactDayRow
              key={`${day.dayNumber}-${index}`}
              day={day}
              destinationName={getDayDestination(destinations, index)}
              isLast={index === previewDays.length - 1 && !hasMoreDays}
            />
          ))}
        </div>

        {hasMoreDays && (
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="w-full flex items-center justify-center gap-1.5 px-4 py-3.5 border-t border-neutral-100 text-sm font-medium text-sky-600 hover:bg-sky-50/50 transition-colors"
          >
            <span>Tüm programı gör</span>
            <ChevronDownIcon className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md border border-neutral-200/70">
      <div className="px-4 pt-5 pb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <MapIcon className="h-6 w-6 text-sky-600 mr-2.5 flex-shrink-0" />
          <span>Tur Programı ve Rotası</span>
        </h3>

        <div className="mt-4 flex p-1 bg-gray-100 rounded-lg">
          <button
            type="button"
            onClick={() => setActiveTab('program')}
            className={`flex-1 py-2 px-3 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'program'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600'
            }`}
          >
            Günlük Program
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('points')}
            className={`flex-1 py-2 px-3 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'points'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600'
            }`}
          >
            Önemli Noktalar
          </button>
        </div>
      </div>

      <div className="px-4 pb-4">
        {activeTab === 'program' ? (
          <div className="relative">
            <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gradient-to-b from-sky-200 via-sky-300 to-sky-200" />

            {days.map((day, index) => (
              <DetailedDayCard
                key={`${day.dayNumber}-${index}`}
                day={day}
                destinationName={getDayDestination(destinations, index)}
                formattedDate={formatDayDate(tourStartDate, index, day.dayNumber)}
                dayImages={getDayImages(images, index)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {importantPoints.length > 0 ? (
              importantPoints.map((point, index) => (
                <div
                  key={`${point.label}-${index}`}
                  className="flex items-start gap-3 p-3 rounded-xl border border-amber-100 bg-amber-50/40"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900">{point.label}</p>
                    {point.dayNumber && (
                      <p className="text-xs text-gray-500 mt-0.5">{point.dayNumber}. gün</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <PhotoIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Önemli nokta bilgisi bulunmuyor.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {hasMoreDays && (
        <button
          type="button"
          onClick={() => setIsExpanded(false)}
          className="w-full flex items-center justify-center gap-1.5 px-4 py-3.5 border-t border-neutral-100 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <span>Daha az göster</span>
          <ChevronUpIcon className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
