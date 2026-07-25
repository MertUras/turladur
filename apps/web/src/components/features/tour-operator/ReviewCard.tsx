'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Building2 as BuildingOfficeIcon,
  CalendarDays as CalendarDaysIcon,
  ChevronDown as ChevronDownIcon,
} from 'lucide-react';
import StarRating from '@/components/features/tour/star-rating';
import { formatDate } from '@/lib/format';
import { resolveCategoryFeedback } from '@/lib/partner/reviews/client';
import {
  CATEGORY_RATING_KEYS,
  CATEGORY_RATING_LABELS,
  CategoryRatingKey,
} from '@/lib/reviews/client';

export interface OperatorReview {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  responseText?: string | null;
  respondedAt?: string | null;
  guideRating?: number | null;
  operatorRating?: number | null;
  routeRating?: number | null;
  foodRating?: number | null;
  hotelRating?: number | null;
  transportRating?: number | null;
  guideFeedback?: string | null;
  operatorFeedback?: string | null;
  routeFeedback?: string | null;
  foodFeedback?: string | null;
  hotelFeedback?: string | null;
  transportFeedback?: string | null;
  user: {
    name: string | null;
    image: string | null;
  };
  booking: {
    startDate?: string;
    endDate?: string;
    tour: {
      id?: string;
      name: string;
    } | null;
  };
  tourOperator?: {
    companyName: string;
  } | null;
}

function formatTourDateLabel(
  startDate?: string,
  endDate?: string,
): string | null {
  if (!startDate) return null;

  const start = formatDate(startDate);
  if (!endDate) return start;

  const startTime = new Date(startDate).getTime();
  const endTime = new Date(endDate).getTime();
  if (startTime === endTime) return start;

  return `${start} - ${formatDate(endDate)}`;
}

function CategoryRatingRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between gap-2 text-sm">
      <span className="text-neutral-600 shrink-0">{label}</span>
      <div className="flex items-center gap-1.5">
        <StarRating rating={value} size="sm" />
        <span className="text-xs font-medium text-neutral-700 w-4 text-right">
          {value}
        </span>
      </div>
    </div>
  );
}

interface ReviewCardProps {
  review: OperatorReview;
  compact?: boolean;
  showTourMeta?: boolean;
  operatorName?: string;
}

export default function ReviewCard({
  review,
  compact = false,
  showTourMeta = false,
  operatorName,
}: ReviewCardProps) {
  const [showCategories, setShowCategories] = useState(false);
  const customerName = review.user.name || 'Müşteri';
  const tourName = review.booking.tour?.name;
  const tourDateLabel = formatTourDateLabel(
    review.booking.startDate,
    review.booking.endDate,
  );
  const resolvedOperatorName = review.tourOperator?.companyName || operatorName;

  const categoryRatings = {
    guideRating: review.guideRating ?? null,
    operatorRating: review.operatorRating ?? null,
    routeRating: review.routeRating ?? null,
    foodRating: review.foodRating ?? null,
    hotelRating: review.hotelRating ?? null,
    transportRating: review.transportRating ?? null,
  };

  const categoryFeedback = resolveCategoryFeedback(categoryRatings, {
    guideFeedback: review.guideFeedback ?? null,
    operatorFeedback: review.operatorFeedback ?? null,
    routeFeedback: review.routeFeedback ?? null,
    foodFeedback: review.foodFeedback ?? null,
    hotelFeedback: review.hotelFeedback ?? null,
    transportFeedback: review.transportFeedback ?? null,
  });

  const hasCategoryRatings = CATEGORY_RATING_KEYS.some(
    (key) => categoryRatings[key] != null,
  );

  const avatar = (
    <div className="w-10 h-10 rounded-full overflow-hidden bg-sky-100 flex-shrink-0 flex items-center justify-center text-sky-700 font-semibold text-sm">
      {review.user.image ? (
        <Image
          src={review.user.image}
          alt={customerName}
          width={40}
          height={40}
          className="object-cover w-full h-full"
        />
      ) : (
        customerName.charAt(0).toUpperCase()
      )}
    </div>
  );

  return (
    <div
      className={`flex flex-col overflow-hidden p-4 md:p-5 rounded-2xl md:rounded-xl border border-neutral-200/70 bg-white shadow-sm ${
        compact ? 'h-[220px]' : ''
      }`}
    >
      {/* Mobile: stacked header — avatar/name, then stars/date, then tour meta */}
      <div className="md:hidden flex-shrink-0 mb-3">
        <div className="flex items-center gap-3">
          {avatar}
          <p className="font-semibold text-neutral-900 min-w-0 flex-1 leading-snug break-words">
            {customerName}
          </p>
        </div>
        <div className="flex items-center justify-between gap-3 mt-2 ml-[52px]">
          <StarRating rating={review.rating} size="sm" />
          <p className="text-xs text-neutral-500 flex-shrink-0">
            {formatDate(review.createdAt)}
          </p>
        </div>
        {tourName && !showTourMeta && (
          <p className="text-xs text-neutral-500 mt-1 ml-[52px] break-words">
            {tourName}
          </p>
        )}
        {showTourMeta && (tourDateLabel || resolvedOperatorName) && (
          <div className="mt-3 pt-3 border-t border-neutral-100 space-y-1.5">
            {tourDateLabel && (
              <p className="text-xs text-neutral-500 flex items-start gap-1.5 leading-relaxed">
                <CalendarDaysIcon className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                <span className="min-w-0 break-words">
                  Tur tarihi: {tourDateLabel}
                </span>
              </p>
            )}
            {resolvedOperatorName && (
              <p className="text-xs text-neutral-500 flex items-start gap-1.5 leading-relaxed">
                <BuildingOfficeIcon className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                <span className="min-w-0 break-words">
                  {resolvedOperatorName}
                </span>
              </p>
            )}
          </div>
        )}
      </div>

      {/* Desktop: original side-by-side header */}
      <div className="hidden md:flex items-start justify-between gap-4 mb-3 flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          {avatar}
          <div className="min-w-0">
            <p className="font-semibold text-neutral-900 truncate">
              {customerName}
            </p>
            {tourName && !showTourMeta && (
              <p className="text-xs text-neutral-500 truncate">{tourName}</p>
            )}
            {showTourMeta && (
              <div className="mt-1 space-y-0.5">
                {tourDateLabel && (
                  <p className="text-xs text-neutral-500 flex items-center gap-1">
                    <CalendarDaysIcon className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>Tur tarihi: {tourDateLabel}</span>
                  </p>
                )}
                {resolvedOperatorName && (
                  <p className="text-xs text-neutral-500 flex items-center gap-1">
                    <BuildingOfficeIcon className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{resolvedOperatorName}</span>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <StarRating rating={review.rating} size="sm" />
          <p className="text-xs text-neutral-500 mt-1">
            {formatDate(review.createdAt)}
          </p>
        </div>
      </div>

      <div
        className={`flex-1 min-h-0 ${compact ? 'overflow-y-auto overscroll-contain pr-1' : ''}`}
      >
        <div className="flex-shrink-0">
          {showTourMeta ? (
            <div className="mb-3">
              <p className="text-xs font-medium text-neutral-500 mb-1.5">
                Genel Değerlendirme
              </p>
              {review.comment ? (
                <p
                  className={`text-neutral-700 text-sm leading-relaxed ${compact ? 'line-clamp-4' : ''}`}
                >
                  {review.comment}
                </p>
              ) : (
                <p className="text-neutral-400 text-sm italic">
                  Yorum bırakılmamış.
                </p>
              )}
            </div>
          ) : review.comment ? (
            <p
              className={`text-neutral-700 text-sm leading-relaxed ${compact ? 'line-clamp-4' : ''}`}
            >
              {review.comment}
            </p>
          ) : (
            <p className="text-neutral-400 text-sm italic">
              Yorum bırakılmamış.
            </p>
          )}
        </div>

        {hasCategoryRatings && (
          <div className="mt-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => setShowCategories((prev) => !prev)}
              className="flex items-center gap-1.5 text-sm font-medium text-sky-700 hover:text-sky-800 transition-colors"
              aria-expanded={showCategories}
            >
              <ChevronDownIcon
                className={`h-4 w-4 transition-transform ${showCategories ? 'rotate-180' : ''}`}
              />
              Kategori puanları
            </button>
            {showCategories && (
              <div className="mt-3 max-h-28 overflow-y-auto overscroll-contain space-y-2.5 pl-1 pr-1">
                {CATEGORY_RATING_KEYS.map((key: CategoryRatingKey) => {
                  const value = categoryRatings[key];
                  if (value == null) return null;
                  const feedback = categoryFeedback[key];
                  return (
                    <div key={key}>
                      <CategoryRatingRow
                        label={CATEGORY_RATING_LABELS[key]}
                        value={value}
                      />
                      {value < 3 && feedback && (
                        <p className="mt-1 ml-1 pl-2.5 text-xs text-neutral-600 border-l-2 border-amber-200 leading-relaxed">
                          {feedback}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {review.responseText && (
          <div className="mt-3 ml-0 md:ml-4 pl-3 md:pl-4 border-l-2 border-sky-200 bg-sky-50/50 rounded-r-lg p-3 flex-shrink-0">
            <p className="text-xs font-semibold text-sky-700 mb-1">
              Operatör Yanıtı
            </p>
            <p className="text-neutral-700 text-sm leading-relaxed">
              {review.responseText}
            </p>
            {review.respondedAt && (
              <p className="text-xs text-neutral-400 mt-1.5">
                {formatDate(review.respondedAt)}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
