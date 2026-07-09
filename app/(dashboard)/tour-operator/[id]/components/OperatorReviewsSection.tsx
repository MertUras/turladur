'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import {
  ChatBubbleLeftRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import StarRating from '@/app/components/StarRating';
import { formatDate } from '@/app/utils/format';

export interface OperatorReview {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: {
    name: string | null;
    image: string | null;
  };
  booking: {
    tour: {
      name: string;
    } | null;
  };
}

interface OperatorReviewsSectionProps {
  reviews: OperatorReview[];
  rating: number;
  reviewCount: number;
}

function ReviewCard({ review, compact = false }: { review: OperatorReview; compact?: boolean }) {
  const customerName = review.user.name || 'Müşteri';
  const tourName = review.booking.tour?.name;

  return (
    <div
      className={`flex flex-col h-full p-5 rounded-xl border border-neutral-200/70 bg-neutral-50/40 ${
        compact ? 'min-h-[180px]' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3 min-w-0">
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
          <div className="min-w-0">
            <p className="font-semibold text-neutral-900 truncate">{customerName}</p>
            {tourName && <p className="text-xs text-neutral-500 truncate">{tourName}</p>}
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <StarRating rating={review.rating} size="sm" />
          <p className="text-xs text-neutral-500 mt-1">{formatDate(review.createdAt)}</p>
        </div>
      </div>
      {review.comment ? (
        <p className={`text-neutral-700 text-sm leading-relaxed ${compact ? 'line-clamp-4' : ''}`}>
          {review.comment}
        </p>
      ) : (
        <p className="text-neutral-400 text-sm italic">Yorum bırakılmamış.</p>
      )}
    </div>
  );
}

function useReviewsPerPage() {
  const [perPage, setPerPage] = useState(1);

  useEffect(() => {
    const update = () => {
      if (window.matchMedia('(min-width: 1024px)').matches) {
        setPerPage(3);
      } else if (window.matchMedia('(min-width: 640px)').matches) {
        setPerPage(2);
      } else {
        setPerPage(1);
      }
    };

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return perPage;
}

export default function OperatorReviewsSection({
  reviews,
  rating,
  reviewCount,
}: OperatorReviewsSectionProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const perPage = useReviewsPerPage();

  const pages = useMemo(() => {
    const chunks: OperatorReview[][] = [];
    for (let i = 0; i < reviews.length; i += perPage) {
      chunks.push(reviews.slice(i, i + perPage));
    }
    return chunks;
  }, [reviews, perPage]);

  const totalPages = pages.length;
  const canNavigate = totalPages > 1;

  useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, Math.max(0, totalPages - 1)));
  }, [totalPages]);

  useEffect(() => {
    if (!modalOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setModalOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [modalOpen]);

  const goToPage = useCallback(
    (page: number) => {
      if (totalPages === 0) return;
      setCurrentPage(((page % totalPages) + totalPages) % totalPages);
    },
    [totalPages]
  );

  if (reviews.length === 0) return null;

  return (
    <>
      <div id="reviews" className="bg-white rounded-2xl p-8 shadow-md border border-neutral-200/50 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-bold text-neutral-900 mb-2 flex items-center">
              <ChatBubbleLeftRightIcon className="w-7 h-7 mr-2.5 text-sky-600" />
              Müşteri Değerlendirmeleri
            </h2>
            <p className="text-neutral-500 text-sm">
              {rating.toFixed(1)}/5 ortalama · {reviewCount} değerlendirme
            </p>
          </div>
          {reviewCount > perPage && (
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="self-start px-4 py-2.5 bg-sky-50 hover:bg-sky-100 text-sky-700 font-medium rounded-lg transition-colors border border-sky-200 text-sm whitespace-nowrap"
            >
              Tüm değerlendirmeleri gör ({reviewCount})
            </button>
          )}
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${currentPage * 100}%)` }}
            >
              {pages.map((pageReviews, pageIndex) => (
                <div key={pageIndex} className="w-full flex-shrink-0">
                  <div
                    className={`grid gap-4 ${
                      perPage === 3
                        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                        : perPage === 2
                          ? 'grid-cols-1 sm:grid-cols-2'
                          : 'grid-cols-1'
                    }`}
                  >
                    {pageReviews.map((review) => (
                      <ReviewCard key={review.id} review={review} compact />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {canNavigate && (
            <>
              <button
                type="button"
                onClick={() => goToPage(currentPage - 1)}
                aria-label="Önceki değerlendirmeler"
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 sm:-translate-x-4 w-9 h-9 rounded-full bg-white border border-neutral-200 shadow-md flex items-center justify-center text-neutral-600 hover:text-sky-600 hover:border-sky-200 transition-colors"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => goToPage(currentPage + 1)}
                aria-label="Sonraki değerlendirmeler"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 sm:translate-x-4 w-9 h-9 rounded-full bg-white border border-neutral-200 shadow-md flex items-center justify-center text-neutral-600 hover:text-sky-600 hover:border-sky-200 transition-colors"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {canNavigate && (
          <div className="flex items-center justify-center gap-2 mt-6">
            {pages.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentPage(index)}
                aria-label={`Sayfa ${index + 1}`}
                className={`h-2 rounded-full transition-all ${
                  index === currentPage ? 'w-6 bg-sky-600' : 'w-2 bg-neutral-300 hover:bg-neutral-400'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white w-full sm:max-w-3xl lg:max-w-4xl sm:mx-4 rounded-t-2xl sm:rounded-2xl shadow-xl border border-neutral-200/50 flex flex-col max-h-[92vh] sm:max-h-[85vh]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 p-6 pb-4 border-b border-neutral-100 flex-shrink-0">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 flex items-center">
                  <ChatBubbleLeftRightIcon className="w-6 h-6 mr-2 text-sky-600" />
                  Tüm Değerlendirmeler
                </h3>
                <p className="text-neutral-500 text-sm mt-1">
                  {rating.toFixed(1)}/5 ortalama · {reviewCount} değerlendirme
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="Kapat"
                className="p-2 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-6 pt-4 space-y-4">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
