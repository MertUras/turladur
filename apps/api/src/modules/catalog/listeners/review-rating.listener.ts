import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Prisma } from '../../../generated/prisma';

import { CacheService } from '../../../core/cache/cache.service';
import { PrismaService } from '../../../core/database/prisma.service';
import { ReviewCreatedEvent } from '../../review/events/review-created.event';
import { ReviewDeletedEvent } from '../../review/events/review-deleted.event';
import { ReviewUpdatedEvent } from '../../review/events/review-updated.event';

/**
 * Recalculates Tour + Partner average ratings when reviews change.
 * Why listener not ReviewService write: keeps Catalog as owner of Tour fields.
 */
@Injectable()
export class ReviewRatingListener {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
  ) {}

  @OnEvent('review.created')
  @OnEvent('review.updated')
  @OnEvent('review.deleted')
  async handle(
    event: ReviewCreatedEvent | ReviewUpdatedEvent | ReviewDeletedEvent,
  ) {
    await this.recalcTour(event.tourId);
    await this.recalcPartner(event.partnerId);
    await this.cache.del(`catalog:tour:${event.tourId}`);
    await this.cache.invalidatePattern('catalog:tours:search:*');
  }

  private async recalcTour(tourId: string) {
    const agg = await this.prisma.review.aggregate({
      where: { tourId, deletedAt: null },
      _avg: { rating: true },
      _count: { _all: true },
    });

    await this.prisma.tour.update({
      where: { id: tourId },
      data: {
        averageRating: new Prisma.Decimal(
          Number(agg._avg.rating ?? 0).toFixed(2),
        ),
        reviewCount: agg._count._all,
      },
    });
  }

  private async recalcPartner(partnerId: string) {
    const agg = await this.prisma.review.aggregate({
      where: { partnerId, deletedAt: null },
      _avg: { rating: true },
      _count: { _all: true },
    });

    await this.prisma.partner.update({
      where: { id: partnerId },
      data: {
        averageRating: new Prisma.Decimal(
          Number(agg._avg.rating ?? 0).toFixed(2),
        ),
        reviewCount: agg._count._all,
      },
    });
  }
}
