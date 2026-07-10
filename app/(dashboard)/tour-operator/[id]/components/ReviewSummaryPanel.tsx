'use client';

import {
  BuildingOfficeIcon,
  BuildingStorefrontIcon,
  HomeModernIcon,
  MapIcon,
  TruckIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import StarRating from '@/app/components/StarRating';
import {
  CATEGORY_RATING_KEYS,
  CATEGORY_RATING_LABELS,
  CategoryRatingKey,
  ReviewAggregates,
  StarRatingValue,
} from '@/lib/reviews/client';

const CATEGORY_ICONS: Record<CategoryRatingKey, typeof UserGroupIcon> = {
  guideRating: UserGroupIcon,
  operatorRating: BuildingOfficeIcon,
  routeRating: MapIcon,
  foodRating: BuildingStorefrontIcon,
  hotelRating: HomeModernIcon,
  transportRating: TruckIcon,
};

const STAR_LEVELS: StarRatingValue[] = [5, 4, 3, 2, 1];

interface ReviewSummaryPanelProps {
  aggregates: ReviewAggregates;
}

export default function ReviewSummaryPanel({ aggregates }: ReviewSummaryPanelProps) {
  const { averageRating, reviewCount, starDistribution, categoryAggregates } = aggregates;
  const maxDistributionCount = Math.max(...STAR_LEVELS.map((star) => starDistribution[star]), 1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 p-4 sm:p-5 bg-neutral-50/70 rounded-xl border border-neutral-200/70">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left flex-shrink-0">
          <p className="text-4xl sm:text-5xl font-bold text-neutral-900 leading-none">
            {averageRating.toFixed(1)}
          </p>
          <StarRating rating={averageRating} size="md" className="mt-2 justify-center sm:justify-start" />
          <p className="text-sm text-neutral-500 mt-1.5">{reviewCount} değerlendirme</p>
        </div>

        <div className="flex-1 min-w-0 space-y-1.5">
          {STAR_LEVELS.map((star) => {
            const count = starDistribution[star];
            const widthPercent = (count / maxDistributionCount) * 100;

            return (
              <div key={star} className="flex items-center gap-2 text-xs">
                <span className="w-7 text-neutral-600 font-medium shrink-0">★{star}</span>
                <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sky-500 rounded-full transition-all"
                    style={{ width: `${widthPercent}%` }}
                  />
                </div>
                <span className="w-8 text-right text-neutral-500 tabular-nums shrink-0">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200/70 p-4 shadow-sm">
        <h4 className="text-sm font-semibold text-neutral-900 mb-3">Öne Çıkan Özellikler</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CATEGORY_RATING_KEYS.map((key) => {
            const Icon = CATEGORY_ICONS[key];
            const { average, count } = categoryAggregates[key];

            return (
              <div key={key} className="flex items-start gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-sky-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-neutral-500 truncate">{CATEGORY_RATING_LABELS[key]}</p>
                  <p className="text-sm font-semibold text-neutral-900">
                    {average.toFixed(1)}
                    <span className="text-xs font-normal text-neutral-400 ml-1">({count})</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
