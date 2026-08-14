import { Test } from '@nestjs/testing';
import { Prisma } from '../../../generated/prisma';

import { PrismaService } from '../../../core/database/prisma.service';
import { createPrismaMock } from '../../__tests__/test-helpers';
import { OutboxService } from '../services/outbox.service';
import { TourMetricsService } from '../services/tour-metrics.service';

describe('TourMetricsService', () => {
  let service: TourMetricsService;
  let prisma: ReturnType<typeof createPrismaMock>;

  beforeEach(async () => {
    prisma = createPrismaMock();
    const module = await Test.createTestingModule({
      providers: [
        TourMetricsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
    service = module.get(TourMetricsService);
  });

  it('should upsert TourMetrics and mirror Tour', async () => {
    (prisma.review.aggregate as jest.Mock).mockResolvedValue({
      _avg: {
        rating: 4.5,
        guideRating: 5,
        transportRating: 4,
        accommodationRating: 3,
        operatorRating: null,
        routeRating: null,
        foodRating: null,
      },
      _count: { _all: 2 },
      _max: { createdAt: new Date('2026-08-01') },
    });
    (prisma.tourMetrics.upsert as jest.Mock).mockResolvedValue({});
    (prisma.tour.update as jest.Mock).mockResolvedValue({});

    const result = await service.rebuildForTour('t1');

    expect(result.reviewCount).toBe(2);
    expect(result.averageRating).toBe('4.5');
    expect(prisma.tourMetrics.upsert).toHaveBeenCalled();
    expect(prisma.tour.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 't1' },
        data: expect.objectContaining({
          reviewCount: 2,
          averageRating: expect.any(Prisma.Decimal),
        }),
      }),
    );
  });
});

describe('OutboxService.processPendingBatch', () => {
  let service: OutboxService;
  let prisma: ReturnType<typeof createPrismaMock>;
  let metrics: { rebuildForTour: jest.Mock };

  beforeEach(async () => {
    prisma = createPrismaMock();
    metrics = { rebuildForTour: jest.fn().mockResolvedValue({}) };
    const module = await Test.createTestingModule({
      providers: [
        OutboxService,
        { provide: PrismaService, useValue: prisma },
        { provide: TourMetricsService, useValue: metrics },
      ],
    }).compile();
    service = module.get(OutboxService);
  });

  it('should process review.created via TourMetrics', async () => {
    (prisma.outboxEvent.findMany as jest.Mock).mockResolvedValue([
      {
        id: 'ob1',
        eventType: 'review.created',
        payload: { tourId: 't1', agencyId: 'p1' },
        status: 'PENDING',
      },
    ]);
    (prisma.outboxEvent.updateMany as jest.Mock).mockResolvedValue({
      count: 1,
    });
    (prisma.outboxEvent.update as jest.Mock).mockResolvedValue({});
    (prisma.review.aggregate as jest.Mock).mockResolvedValue({
      _avg: { rating: 5 },
      _count: { _all: 1 },
    });
    (prisma.agency.update as jest.Mock).mockResolvedValue({});

    const count = await service.processPendingBatch();

    expect(count).toBe(1);
    expect(metrics.rebuildForTour).toHaveBeenCalledWith('t1');
    expect(prisma.outboxEvent.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: 'PROCESSED' }),
      }),
    );
  });
});
