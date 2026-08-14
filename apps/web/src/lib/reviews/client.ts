/**
 * Client-safe review exports (types + pure helpers).
 * Do not import server-only modules (Prisma, recalculate, scoring providers) here.
 */
export * from './types';
export {
  computeCategoryAggregates,
  computeReviewAggregates,
  computeStarDistribution,
  sortReviewsByRatingDesc,
  type CategoryAggregate,
  type ReviewAggregates,
  type StarDistribution,
  type StarRatingValue,
} from './scoring';
