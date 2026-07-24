import { Test } from '@nestjs/testing';

import { PrismaService } from '../../../core/database/prisma.service';
import { BusinessException } from '../../../shared/exceptions/business.exception';
import { AgeRangeService } from '../services/age-range.service';
import { createPrismaMock, decimal } from '../../__tests__/test-helpers';

describe('AgeRangeService', () => {
  let service: AgeRangeService;
  let prisma: ReturnType<typeof createPrismaMock>;

  beforeEach(async () => {
    prisma = createPrismaMock();
    const module = await Test.createTestingModule({
      providers: [
        AgeRangeService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
    service = module.get(AgeRangeService);
  });

  describe('createTourDateAgeRange', () => {
    it('should reject overlapping age ranges', async () => {
      (prisma.tourDate.findFirst as jest.Mock).mockResolvedValue({
        id: 'td1',
        tourId: 't1',
        deletedAt: null,
        tour: { partnerId: 'p1', deletedAt: null },
      });
      (prisma.tourDateAgeRange.findMany as jest.Mock).mockResolvedValue([
        { minAge: 0, maxAge: 2 },
      ]);

      await expect(
        service.createTourDateAgeRange(
          't1',
          'td1',
          { minAge: 1, maxAge: 5, pricingType: 'HALF' as never, value: 50 },
          'p1',
          'PARTNER',
        ),
      ).rejects.toBeInstanceOf(BusinessException);
    });

    it('should create non-overlapping age range', async () => {
      (prisma.tourDate.findFirst as jest.Mock).mockResolvedValue({
        id: 'td1',
        tourId: 't1',
        deletedAt: null,
        tour: { partnerId: 'p1', deletedAt: null },
      });
      (prisma.tourDateAgeRange.findMany as jest.Mock).mockResolvedValue([
        { minAge: 0, maxAge: 2 },
      ]);
      (prisma.tourDateAgeRange.create as jest.Mock).mockResolvedValue({
        id: 'ar1',
        minAge: 3,
        maxAge: 12,
        pricingType: 'HALF',
        value: decimal(50),
      });

      const result = await service.createTourDateAgeRange(
        't1',
        'td1',
        { minAge: 3, maxAge: 12, pricingType: 'HALF' as never, value: 50 },
        'p1',
        'PARTNER',
      );

      expect(result.data.minAge).toBe(3);
      expect(result.data.value).toBe('50');
    });
  });

  describe('listTourDateAgeRanges', () => {
    it('should list ranges ordered by minAge', async () => {
      (prisma.tourDate.findFirst as jest.Mock).mockResolvedValue({
        id: 'td1',
        tourId: 't1',
        deletedAt: null,
        tour: { deletedAt: null },
      });
      (prisma.tourDateAgeRange.findMany as jest.Mock).mockResolvedValue([
        {
          id: 'ar1',
          minAge: 0,
          maxAge: 2,
          pricingType: 'FREE',
          value: decimal(0),
        },
      ]);

      const result = await service.listTourDateAgeRanges('t1', 'td1');
      expect(result.data).toHaveLength(1);
      expect(result.data[0].pricingType).toBe('FREE');
    });
  });

  describe('update / delete / experience ranges', () => {
    it('should update and delete tour date age range', async () => {
      (prisma.tourDate.findFirst as jest.Mock).mockResolvedValue({
        id: 'td1',
        tourId: 't1',
        deletedAt: null,
        tour: { partnerId: 'p1', deletedAt: null },
      });
      (prisma.tourDateAgeRange.findFirst as jest.Mock).mockResolvedValue({
        id: 'ar1',
        tourDateId: 'td1',
        minAge: 3,
        maxAge: 12,
        pricingType: 'HALF',
        value: decimal(50),
        deletedAt: null,
      });
      (prisma.tourDateAgeRange.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.tourDateAgeRange.update as jest.Mock).mockResolvedValue({
        id: 'ar1',
        minAge: 3,
        maxAge: 10,
        pricingType: 'HALF',
        value: decimal(40),
      });

      const updated = await service.updateTourDateAgeRange(
        't1',
        'td1',
        'ar1',
        { maxAge: 10, value: 40 },
        'p1',
        'PARTNER',
      );
      expect(updated.data.maxAge).toBe(10);

      const deleted = await service.deleteTourDateAgeRange(
        't1',
        'td1',
        'ar1',
        'p1',
        'PARTNER',
      );
      expect(deleted.data.deleted).toBe(true);
    });

    it('should create experience date age range', async () => {
      (prisma.activityDate.findFirst as jest.Mock).mockResolvedValue({
        id: 'ad1',
        experienceId: 'e1',
        deletedAt: null,
        experience: { partnerId: 'p1', deletedAt: null },
      });
      (prisma.experienceDateAgeRange.findMany as jest.Mock).mockResolvedValue(
        [],
      );
      (prisma.experienceDateAgeRange.create as jest.Mock).mockResolvedValue({
        id: 'ar2',
        minAge: 0,
        maxAge: 2,
        pricingType: 'FREE',
        value: decimal(0),
      });

      const result = await service.createExperienceDateAgeRange(
        'e1',
        'ad1',
        { minAge: 0, maxAge: 2, pricingType: 'FREE' as never, value: 0 },
        'p1',
        'PARTNER',
      );
      expect(result.data.pricingType).toBe('FREE');
    });

    it('should list experience age ranges', async () => {
      (prisma.activityDate.findFirst as jest.Mock).mockResolvedValue({
        id: 'ad1',
        experienceId: 'e1',
        deletedAt: null,
        experience: { deletedAt: null },
      });
      (prisma.experienceDateAgeRange.findMany as jest.Mock).mockResolvedValue(
        [],
      );
      const result = await service.listExperienceDateAgeRanges('e1', 'ad1');
      expect(result.data).toEqual([]);
    });
  });
});
