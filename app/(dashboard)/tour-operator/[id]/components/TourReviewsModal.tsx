'use client';

import { useEffect } from 'react';
import { ChatBubbleLeftRightIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { computeReviewAggregates } from '@/lib/reviews/client';
import ReviewSummaryPanel from './ReviewSummaryPanel';
import ReviewCard, { OperatorReview } from './ReviewCard';

interface TourReviewsModalProps {
  reviews: OperatorReview[];
  isOpen: boolean;
  onClose: () => void;
  operatorName?: string;
  showTourMeta?: boolean;
}

export default function TourReviewsModal({
  reviews,
  isOpen,
  onClose,
  operatorName,
  showTourMeta = false,
}: TourReviewsModalProps) {
  const aggregates = computeReviewAggregates(reviews);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[110] md:z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="tour-reviews-modal-title"
    >
      <div
        className="bg-white w-full sm:max-w-3xl lg:max-w-5xl rounded-t-xl sm:rounded-xl shadow-xl border border-neutral-200/70 flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 px-5 sm:px-6 py-5 border-b border-neutral-100 flex-shrink-0">
          <div className="min-w-0">
            <h3
              id="tour-reviews-modal-title"
              className="text-xl sm:text-2xl font-bold text-neutral-900 flex items-center"
            >
              <ChatBubbleLeftRightIcon className="w-6 h-6 mr-2 text-sky-600 flex-shrink-0" />
              <span className="truncate">Tüm Değerlendirmeler</span>
            </h3>
            <p className="text-neutral-500 text-sm mt-1">
              {aggregates.averageRating.toFixed(1)}/5 ortalama · {aggregates.reviewCount} değerlendirme
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="p-2 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors flex-shrink-0"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 min-h-0">
          <div className="px-5 sm:px-6 pt-4 pb-2">
            <ReviewSummaryPanel aggregates={aggregates} />
          </div>

          <div className="px-5 sm:px-6 pb-6 pt-2 space-y-4">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                showTourMeta={showTourMeta}
                operatorName={operatorName}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
