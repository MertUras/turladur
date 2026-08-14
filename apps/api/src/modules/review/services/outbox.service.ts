import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '../../../generated/prisma';

import { PrismaService } from '../../../core/database/prisma.service';
import { TourMetricsService } from './tour-metrics.service';

const BATCH_SIZE = 20;

@Injectable()
export class OutboxService {
  private readonly logger = new Logger(OutboxService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tourMetricsService: TourMetricsService,
  ) {}

  async enqueueInTransaction(
    tx: Prisma.TransactionClient,
    input: {
      aggregateType: string;
      aggregateId: string;
      eventType: string;
      payload: Prisma.InputJsonValue;
    },
  ) {
    return tx.outboxEvent.create({
      data: {
        aggregateType: input.aggregateType,
        aggregateId: input.aggregateId,
        eventType: input.eventType,
        payload: input.payload,
        status: 'PENDING',
        availableAt: new Date(),
      },
    });
  }

  /** Claim + process PENDING outbox rows. Returns processed count. */
  async processPendingBatch(limit = BATCH_SIZE): Promise<number> {
    const now = new Date();
    const pending = await this.prisma.outboxEvent.findMany({
      where: {
        status: 'PENDING',
        deletedAt: null,
        availableAt: { lte: now },
      },
      orderBy: { createdAt: 'asc' },
      take: limit,
    });

    let processed = 0;
    for (const event of pending) {
      const claimed = await this.prisma.outboxEvent.updateMany({
        where: { id: event.id, status: 'PENDING' },
        data: {
          status: 'PROCESSING',
          attempts: { increment: 1 },
        },
      });
      if (claimed.count === 0) continue;

      try {
        await this.dispatch(event.eventType, event.payload);
        await this.prisma.outboxEvent.update({
          where: { id: event.id },
          data: {
            status: 'PROCESSED',
            processedAt: new Date(),
            lastError: null,
          },
        });
        processed += 1;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Outbox processing failed';
        this.logger.error(`Outbox ${event.id} failed: ${message}`);
        await this.prisma.outboxEvent.update({
          where: { id: event.id },
          data: {
            status: 'FAILED',
            lastError: message,
            availableAt: new Date(Date.now() + 60_000),
          },
        });
        // Retry: FAILED → PENDING after delay (next tick can re-queue)
        await this.prisma.outboxEvent.updateMany({
          where: { id: event.id, status: 'FAILED', attempts: { lt: 5 } },
          data: { status: 'PENDING' },
        });
      }
    }

    return processed;
  }

  private async dispatch(eventType: string, payload: unknown) {
    const data = payload as {
      tourId?: string | null;
      experienceId?: string | null;
      agencyId?: string;
    };

    if (
      eventType === 'review.created' ||
      eventType === 'review.updated' ||
      eventType === 'review.deleted'
    ) {
      if (data.tourId) {
        await this.tourMetricsService.rebuildForTour(data.tourId);
      }
      if (data.experienceId) {
        await this.rebuildExperienceMirror(data.experienceId);
      }
      if (data.agencyId) {
        await this.rebuildPartnerMirror(data.agencyId);
      }
      return;
    }

    this.logger.warn(`Unhandled outbox eventType: ${eventType}`);
  }

  private async rebuildExperienceMirror(experienceId: string) {
    const agg = await this.prisma.review.aggregate({
      where: { experienceId, deletedAt: null },
      _avg: { rating: true },
      _count: { _all: true },
    });
    await this.prisma.experience.update({
      where: { id: experienceId },
      data: {
        averageRating: new Prisma.Decimal(
          Number(agg._avg.rating ?? 0).toFixed(2),
        ),
        reviewCount: agg._count._all,
      },
    });
  }

  private async rebuildPartnerMirror(agencyId: string) {
    const agg = await this.prisma.review.aggregate({
      where: { agencyId, deletedAt: null },
      _avg: { rating: true },
      _count: { _all: true },
    });
    await this.prisma.agency.update({
      where: { id: agencyId },
      data: {
        averageRating: new Prisma.Decimal(
          Number(agg._avg.rating ?? 0).toFixed(2),
        ),
        reviewCount: agg._count._all,
      },
    });
  }
}
