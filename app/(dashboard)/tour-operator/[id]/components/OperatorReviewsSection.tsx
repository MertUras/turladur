'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ChatBubbleLeftRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import StarRating from '@/app/components/StarRating';
import { computeReviewAggregates, sortReviewsByRatingDesc } from '@/lib/reviews/client';
import ReviewCard, { OperatorReview } from './ReviewCard';
import TourReviewsModal from './TourReviewsModal';

export type { OperatorReview };

interface OperatorReviewsSectionProps {
  reviews: OperatorReview[];
  rating: number;
  reviewCount: number;
  variant?: 'sidebar' | 'main';
  operatorName?: string;
  initialVisibleCount?: number;
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

function MainReviewsSection({
  reviews,
  reviewCount,
  operatorName,
  initialVisibleCount = 3,
}: OperatorReviewsSectionProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const sortedReviews = useMemo(() => sortReviewsByRatingDesc(reviews), [reviews]);
  const visibleReviews = sortedReviews.slice(0, initialVisibleCount);
  const aggregates = useMemo(() => computeReviewAggregates(sortedReviews), [sortedReviews]);

  return (
    <>
      <div
        id="reviews"
        className="bg-white rounded-xl overflow-hidden shadow-md border border-neutral-200/70 scroll-mt-24"
      >
        <div className="p-6 md:p-8">
          <div className="mb-6">
            <h3 className="text-2xl font-semibold text-gray-900 flex items-center mb-2">
              <ChatBubbleLeftRightIcon className="h-7 w-7 text-sky-600 mr-3" />
              <span>Müşteri Değerlendirmeleri</span>
            </h3>
            <div className="flex items-center gap-2">
              <StarRating rating={aggregates.averageRating} size="sm" />
              <p className="text-neutral-500 text-sm">
                {aggregates.averageRating.toFixed(1)}/5 ortalama · {reviewCount} değerlendirme
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {visibleReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                showTourMeta
                operatorName={operatorName}
              />
            ))}
          </div>

          {reviewCount > 0 && (
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="mt-6 w-full inline-flex items-center justify-center px-6 py-3.5 bg-sky-600 hover:bg-sky-700 text-white text-base font-semibold rounded-lg transition-colors shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 active:scale-[0.98] duration-150 ease-out"
            >
              Tüm Değerlendirmeler ({reviewCount})
            </button>
          )}
        </div>
      </div>

      <TourReviewsModal
        reviews={sortedReviews}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        operatorName={operatorName}
        showTourMeta
      />
    </>
  );
}

function SidebarReviewsSection({
  reviews,
  reviewCount,
}: OperatorReviewsSectionProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const perPage = useReviewsPerPage();

  const sortedReviews = useMemo(() => sortReviewsByRatingDesc(reviews), [reviews]);
  const aggregates = useMemo(() => computeReviewAggregates(sortedReviews), [sortedReviews]);

  const pages = useMemo(() => {
    const chunks: OperatorReview[][] = [];
    for (let i = 0; i < sortedReviews.length; i += perPage) {
      chunks.push(sortedReviews.slice(i, i + perPage));
    }
    return chunks;
  }, [sortedReviews, perPage]);

  const totalPages = pages.length;
  const canNavigate = totalPages > 1;

  useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, Math.max(0, totalPages - 1)));
  }, [totalPages]);

  const goToPage = useCallback(
    (page: number) => {
      if (totalPages === 0) return;
      setCurrentPage(((page % totalPages) + totalPages) % totalPages);
    },
    [totalPages]
  );

  return (
    <>
      <div
        id="reviews"
        className="bg-white rounded-2xl p-8 shadow-md border border-neutral-200/50 scroll-mt-24 overflow-hidden"
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-bold text-neutral-900 mb-2 flex items-center">
              <ChatBubbleLeftRightIcon className="w-7 h-7 mr-2.5 text-sky-600" />
              Müşteri Değerlendirmeleri
            </h2>
            <p className="text-neutral-500 text-sm">
              {aggregates.averageRating.toFixed(1)}/5 ortalama · {reviewCount} değerlendirme
            </p>
          </div>
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
                    className={`grid gap-4 items-stretch ${
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

        {reviewCount > 0 && (
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="mt-6 w-full inline-flex items-center justify-center px-6 py-3.5 bg-sky-600 hover:bg-sky-700 text-white text-base font-semibold rounded-lg transition-colors shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 active:scale-[0.98] duration-150 ease-out"
          >
            Tüm Değerlendirmeler ({reviewCount})
          </button>
        )}
      </div>

      <TourReviewsModal
        reviews={sortedReviews}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}

export default function OperatorReviewsSection(props: OperatorReviewsSectionProps) {
  if (props.reviews.length === 0) return null;

  if (props.variant === 'main') {
    return <MainReviewsSection {...props} />;
  }

  return <SidebarReviewsSection {...props} />;
}
