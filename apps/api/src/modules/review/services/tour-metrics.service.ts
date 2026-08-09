import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../generated/prisma';

import { PrismaService } from '../../../core/database/prisma.service';

@Injectable()
export class TourMetricsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Recalc TourMetrics + mirror Tour.averageRating / reviewCount. */
  async rebuildForTour(tourId: string) {
    const agg = await this.prisma.review.aggregate({
      where: { tourId, deletedAt: null },
      _avg: {
        rating: true,
        guideRating: true,
        transportRating: true,
        accommodationRating: true,
        operatorRating: true,
        routeRating: true,
        foodRating: true,
      },
      _count: { _all: true },
      _max: { createdAt: true },
    });

    const averageRating = decimalOrZero(agg._avg.rating);
    const reviewCount = agg._count._all;

    await this.prisma.tourMetrics.upsert({
      where: { tourId },
      create: {
        tourId,
        reviewCount,
        averageRating,
        averageGuideRating: decimalOrZero(agg._avg.guideRating),
        averageTransportRating: decimalOrZero(agg._avg.transportRating),
        averageAccommodationRating: decimalOrZero(agg._avg.accommodationRating),
        averageOperatorRating: nullableDecimal(agg._avg.operatorRating),
        averageRouteRating: nullableDecimal(agg._avg.routeRating),
        averageFoodRating: nullableDecimal(agg._avg.foodRating),
        lastReviewAt: agg._max.createdAt,
      },
      update: {
        reviewCount,
        averageRating,
        averageGuideRating: decimalOrZero(agg._avg.guideRating),
        averageTransportRating: decimalOrZero(agg._avg.transportRating),
        averageAccommodationRating: decimalOrZero(agg._avg.accommodationRating),
        averageOperatorRating: nullableDecimal(agg._avg.operatorRating),
        averageRouteRating: nullableDecimal(agg._avg.routeRating),
        averageFoodRating: nullableDecimal(agg._avg.foodRating),
        lastReviewAt: agg._max.createdAt,
        deletedAt: null,
      },
    });

    await this.prisma.tour.update({
      where: { id: tourId },
      data: {
        averageRating,
        reviewCount,
      },
    });

    return { tourId, reviewCount, averageRating: averageRating.toString() };
  }
}

function decimalOrZero(value: number | null | undefined): Prisma.Decimal {
  return new Prisma.Decimal(Number(value ?? 0).toFixed(2));
}

function nullableDecimal(
  value: number | null | undefined,
): Prisma.Decimal | null {
  if (value === null || value === undefined) return null;
  return new Prisma.Decimal(Number(value).toFixed(2));
}
