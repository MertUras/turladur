'use client';

import { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import {
  CATEGORY_RATING_KEYS,
  CATEGORY_RATING_LABELS,
  CategoryRatingKey,
  CategoryRatings,
  LOW_RATING_FEEDBACK_PLACEHOLDER,
  SubmitPartnerReviewRequest,
} from '@/lib/reviews/client';

export interface ReviewableBooking {
  id: string;
  bookingNumber: string;
  title: string;
  partnerName: string;
  type?: 'tour' | 'experience';
  displayDateLabel?: string;
  guestCount?: number;
  reviewGroupBookingCount?: number;
  reviewGroupKey?: string;
}

interface RatePartnerModalProps {
  booking: ReviewableBooking;
  onClose: () => void;
  onSubmitted: (bookingId: string) => void;
}

const EMPTY_RATINGS: Record<CategoryRatingKey, number> = {
  guideRating: 0,
  operatorRating: 0,
  routeRating: 0,
  foodRating: 0,
  hotelRating: 0,
  transportRating: 0,
};

function StarRatingRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (rating: number) => void;
}) {
  const [hoverRating, setHoverRating] = useState(0);
  const displayRating = hoverRating || value;

  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <span className="text-sm font-medium text-neutral-700 shrink-0">{label}</span>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="p-0.5"
            aria-label={`${label}: ${star} yıldız`}
          >
            <StarIcon
              className={`h-7 w-7 transition-colors ${
                displayRating >= star ? 'text-amber-400' : 'text-neutral-200'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function CategoryRatingSection({
  categoryKey,
  label,
  rating,
  feedback,
  onRatingChange,
  onFeedbackChange,
}: {
  categoryKey: CategoryRatingKey;
  label: string;
  rating: number;
  feedback: string;
  onRatingChange: (key: CategoryRatingKey, rating: number) => void;
  onFeedbackChange: (key: CategoryRatingKey, text: string) => void;
}) {
  const showFeedback = rating > 0 && rating < 3;

  return (
    <div className="py-0.5">
      <StarRatingRow
        label={label}
        value={rating}
        onChange={(value) => onRatingChange(categoryKey, value)}
      />
      <div
        className={`grid transition-all duration-200 ease-in-out ${
          showFeedback ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <textarea
            value={feedback}
            onChange={(e) => onFeedbackChange(categoryKey, e.target.value)}
            placeholder={LOW_RATING_FEEDBACK_PLACEHOLDER}
            rows={2}
            aria-hidden={!showFeedback}
            tabIndex={showFeedback ? 0 : -1}
            className="mt-1 mb-2 w-full rounded-lg border border-neutral-200 bg-white text-sm text-neutral-700 p-2.5 placeholder:text-neutral-400 focus:border-sky-500 focus:ring-sky-500 resize-none"
          />
        </div>
      </div>
    </div>
  );
}

export default function RatePartnerModal({ booking, onClose, onSubmitted }: RatePartnerModalProps) {
  const [categoryRatings, setCategoryRatings] = useState<Record<CategoryRatingKey, number>>(EMPTY_RATINGS);
  const [categoryFeedback, setCategoryFeedback] = useState<Partial<Record<CategoryRatingKey, string>>>({});
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleRatingChange = (key: CategoryRatingKey, rating: number) => {
    setCategoryRatings((prev) => ({ ...prev, [key]: rating }));
    if (rating >= 3) {
      setCategoryFeedback((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleFeedbackChange = (key: CategoryRatingKey, text: string) => {
    setCategoryFeedback((prev) => ({ ...prev, [key]: text }));
  };

  const handleSubmit = async () => {
    const missing = CATEGORY_RATING_KEYS.filter((key) => categoryRatings[key] < 1);
    if (missing.length > 0) {
      toast.error('Lütfen tüm kategoriler için 1-5 arası bir puan seçin');
      return;
    }

    setSubmitting(true);
    try {
      const lowRatingFeedback = Object.fromEntries(
        CATEGORY_RATING_KEYS.filter((key) => categoryRatings[key] < 3)
          .map((key) => [key, categoryFeedback[key]?.trim() || ''])
          .filter(([, text]) => text.length > 0)
      ) as Partial<Record<CategoryRatingKey, string>>;

      const payload: SubmitPartnerReviewRequest = {
        bookingId: booking.id,
        reviewGroupKey: booking.reviewGroupKey,
        comment: comment.trim() || undefined,
        categoryRatings: categoryRatings as CategoryRatings,
        categoryFeedback:
          Object.keys(lowRatingFeedback).length > 0 ? lowRatingFeedback : undefined,
      };

      const res = await fetch('/api/reviews/partner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const message =
          data?.error ||
          data?.detail ||
          'Değerlendirme kaydedilemedi';
        throw new Error(message);
      }

      toast.success('Değerlendirmeniz için teşekkürler!');
      onSubmitted(booking.id);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setSubmitting(false);
    }
  };

  const title = booking.type === 'experience' ? 'Aktiviteyi Değerlendir' : 'Turu Değerlendir';
  const subtitleParts = [
    booking.title,
    booking.displayDateLabel,
    booking.partnerName,
  ].filter(Boolean);
  const guestLabel =
    booking.reviewGroupBookingCount && booking.reviewGroupBookingCount > 1
      ? `${booking.reviewGroupBookingCount} rezervasyon · ${booking.guestCount} kişi`
      : booking.guestCount
        ? `${booking.guestCount} kişi`
        : null;
  const groupedScopeLabel =
    booking.reviewGroupBookingCount && booking.reviewGroupBookingCount > 1
      ? `${booking.reviewGroupBookingCount} rezervasyon için`
      : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-5">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
            <p className="text-sm text-neutral-500 mt-0.5">
              {booking.displayDateLabel
                ? `${booking.title} · ${booking.displayDateLabel}${guestLabel ? ` · ${guestLabel}` : ''} · ${booking.partnerName}`
                : subtitleParts.join(' · ')}
            </p>
            {groupedScopeLabel && (
              <p className="text-xs text-neutral-400 mt-1">{groupedScopeLabel}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600"
            aria-label="Kapat"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="divide-y divide-neutral-100 border border-neutral-100 rounded-lg px-4 mb-5">
          {CATEGORY_RATING_KEYS.map((key) => (
            <CategoryRatingSection
              key={key}
              categoryKey={key}
              label={CATEGORY_RATING_LABELS[key]}
              rating={categoryRatings[key]}
              feedback={categoryFeedback[key] || ''}
              onRatingChange={handleRatingChange}
              onFeedbackChange={handleFeedbackChange}
            />
          ))}
        </div>

        <div>
          <label htmlFor="general-review" className="block text-sm font-medium text-neutral-700 mb-2">
            Genel Değerlendirme
          </label>
          <textarea
            id="general-review"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Deneyiminizi paylaşın (opsiyonel)"
            rows={3}
            className="w-full rounded-lg border border-neutral-300 text-sm p-3 focus:border-sky-500 focus:ring-sky-500 resize-none"
          />
        </div>

        <div className="flex justify-end gap-3 mt-5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50"
          >
            Vazgeç
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="px-4 py-2 text-sm font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 disabled:opacity-60"
          >
            {submitting ? 'Gönderiliyor...' : 'Gönder'}
          </button>
        </div>
      </div>
    </div>
  );
}
