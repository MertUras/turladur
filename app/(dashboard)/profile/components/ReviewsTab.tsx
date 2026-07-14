'use client';

import { useState } from 'react';
import {
  ArrowPathIcon,
  ChevronDownIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import StarRating from '@/app/components/StarRating';
import PendingPartnerReviewsSection from '@/app/components/booking/PendingPartnerReviewsSection';
import type { ReviewableBooking } from '@/app/(dashboard)/bookings/components/RatePartnerModal';
import { formatDate } from '@/app/utils/format';
import { resolveCategoryFeedback } from '@/lib/partner/reviews/client';
import {
  CATEGORY_RATING_KEYS,
  CATEGORY_RATING_LABELS,
  CategoryRatingKey,
} from '@/lib/reviews/client';
import { UserReview, useUserReviews } from '@/lib/user/reviews';

function formatLastUpdated(date: Date): string {
  return date.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function CategoryRatingRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between gap-2 text-sm">
      <span className="text-neutral-600 shrink-0">{label}</span>
      <div className="flex items-center gap-1.5">
        <StarRating rating={value} size="sm" />
        <span className="text-xs font-medium text-neutral-700 w-4 text-right">{value}</span>
      </div>
    </div>
  );
}

function UserReviewCard({ review }: { review: UserReview }) {
  const [showCategories, setShowCategories] = useState(false);
  const hasResponse = Boolean(review.responseText?.trim());
  const categoryFeedback = resolveCategoryFeedback(
    review.categoryRatings,
    review.categoryFeedback
  );

  const hasCategoryRatings = CATEGORY_RATING_KEYS.some(
    (key) => review.categoryRatings[key] != null
  );

  return (
    <div className="rounded-xl border border-neutral-200/70 bg-neutral-50/40 p-5">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
        <div className="min-w-0">
          <h3 className="font-semibold text-neutral-900 truncate">{review.displayTitle}</h3>
          <p className="text-sm text-neutral-500 mt-0.5">{review.operatorName}</p>
          <p className="text-xs text-neutral-400 mt-1">
            Rezervasyon #{review.bookingNumber}
          </p>
        </div>
        <div className="flex flex-col items-start sm:items-end gap-2 flex-shrink-0">
          <StarRating rating={review.rating} size="sm" />
          <p className="text-xs text-neutral-500">
            Değerlendirme: {formatDate(review.createdAt)}
          </p>
          {!hasResponse && (
            <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md bg-amber-50 text-amber-700 border border-amber-200">
              Yanıt bekleniyor
            </span>
          )}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs font-medium text-neutral-500 mb-1.5">Genel Değerlendirme</p>
        {review.comment ? (
          <p className="text-neutral-700 text-sm leading-relaxed">{review.comment}</p>
        ) : (
          <p className="text-neutral-400 text-sm italic">Yorum bırakılmamış.</p>
        )}
      </div>

      {hasCategoryRatings && (
        <div className="mb-4">
          <button
            type="button"
            onClick={() => setShowCategories((prev) => !prev)}
            className="flex items-center gap-1.5 text-sm font-medium text-sky-700 hover:text-sky-800 transition-colors"
          >
            <ChevronDownIcon
              className={`h-4 w-4 transition-transform ${showCategories ? 'rotate-180' : ''}`}
            />
            Kategori puanları
          </button>
          {showCategories && (
            <div className="mt-3 space-y-2.5 pl-1">
              {CATEGORY_RATING_KEYS.map((key: CategoryRatingKey) => {
                const value = review.categoryRatings[key];
                if (value == null) return null;
                const feedback = categoryFeedback[key];
                return (
                  <div key={key}>
                    <CategoryRatingRow label={CATEGORY_RATING_LABELS[key]} value={value} />
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

      {hasResponse && (
        <div className="mt-3 ml-4 pl-4 border-l-2 border-sky-200 bg-sky-50/50 rounded-r-lg p-3">
          <p className="text-xs font-semibold text-sky-700 mb-1">Operatör Yanıtı</p>
          <p className="text-neutral-700 text-sm leading-relaxed">{review.responseText}</p>
          {review.respondedAt && (
            <p className="text-xs text-neutral-400 mt-1.5">{formatDate(review.respondedAt)}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function ReviewsTab({
  pendingReviewBookings = [],
  onRatePartner,
}: {
  pendingReviewBookings?: ReviewableBooking[];
  onRatePartner?: (booking: ReviewableBooking) => void;
}) {
  const { reviews, isLoading, isRefreshing, error, refetch, lastUpdated } = useUserReviews();
  const hasPendingReviews = pendingReviewBookings.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900">
            Değerlendirmelerim
          </h2>
          <p className="text-sm text-neutral-500 mt-1">
            Tur değerlendirmelerinizi ve operatör yanıtlarını takip edin.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-xs text-neutral-400">
              {isRefreshing && (
                <ArrowPathIcon className="inline h-3.5 w-3.5 mr-1 animate-spin" />
              )}
              Son güncelleme: {formatLastUpdated(lastUpdated)}
            </span>
          )}
          <button
            type="button"
            onClick={() => void refetch()}
            disabled={isRefreshing}
            className="p-2 rounded-lg text-neutral-500 hover:text-sky-600 hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1 transition-colors disabled:opacity-50"
            title="Yenile"
          >
            <ArrowPathIcon className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {hasPendingReviews && onRatePartner && (
        <PendingPartnerReviewsSection
          bookings={pendingReviewBookings}
          onRatePartner={onRatePartner}
        />
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 text-neutral-500">
          <ArrowPathIcon className="h-8 w-8 animate-spin text-sky-500 mb-3" />
          <p className="text-sm">Değerlendirmeler yükleniyor...</p>
        </div>
      ) : reviews.length === 0 && !hasPendingReviews ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
            <StarIcon className="h-7 w-7 text-neutral-400" />
          </div>
          <p className="text-neutral-600 font-medium">Henüz değerlendirme yapmadınız</p>
          <p className="text-sm text-neutral-400 mt-1 max-w-sm">
            Tamamlanan tur rezervasyonlarınızı değerlendirdikten sonra burada görüntüleyebilirsiniz.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <UserReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
}
