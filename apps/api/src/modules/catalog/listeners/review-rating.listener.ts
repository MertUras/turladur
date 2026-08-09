import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { CacheService } from '../../../core/cache/cache.service';
import { ReviewCreatedEvent } from '../../review/events/review-created.event';
import { ReviewDeletedEvent } from '../../review/events/review-deleted.event';
import { ReviewUpdatedEvent } from '../../review/events/review-updated.event';

/**
 * Cache invalidation only — rating mirror artık OutboxWorker → TourMetrics.
 */
@Injectable()
export class ReviewRatingListener {
  constructor(private readonly cache: CacheService) {}

  @OnEvent('review.created')
  @OnEvent('review.updated')
  @OnEvent('review.deleted')
  async handle(
    event: ReviewCreatedEvent | ReviewUpdatedEvent | ReviewDeletedEvent,
  ) {
    if (event.tourId) {
      await this.cache.del(`catalog:tour:${event.tourId}`);
    }
    await this.cache.invalidatePattern('catalog:tours:search:*');
  }
}
