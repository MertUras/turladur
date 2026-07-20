import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { PrismaService } from '../../../core/database/prisma.service';
import { TourSearchPerformedEvent } from '../../catalog/events/tour-search-performed.event';

@Injectable()
export class SearchQueryListener {
  private readonly logger = new Logger(SearchQueryListener.name);

  constructor(private readonly prisma: PrismaService) {}

  @OnEvent('catalog.tour.search', { async: true })
  async handleTourSearch(event: TourSearchPerformedEvent): Promise<void> {
    const normalized = event.query.trim().toLowerCase();
    if (!normalized && !event.category) {
      return;
    }

    try {
      await this.prisma.searchQueryLog.create({
        data: {
          query: normalized || '(category-only)',
          category: event.category ?? null,
          resultCount: event.resultCount,
          cacheHit: event.cacheHit,
        },
      });
    } catch (error) {
      this.logger.warn(
        `SearchQueryLog write failed: ${error instanceof Error ? error.message : 'unknown'}`,
      );
    }
  }
}
