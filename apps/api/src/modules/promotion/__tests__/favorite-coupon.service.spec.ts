import { Test } from '@nestjs/testing';

import { PrismaService } from '../../../core/database/prisma.service';
import { createPrismaMock } from '../../__tests__/test-helpers';
import { FavoriteService } from '../../catalog/services/favorite.service';
import { CouponService } from '../services/coupon.service';
import { BusinessException } from '../../../shared/exceptions/business.exception';

describe('FavoriteService', () => {
  let service: FavoriteService;
  let prisma: ReturnType<typeof createPrismaMock>;

  beforeEach(async () => {
    prisma = createPrismaMock();
    const module = await Test.createTestingModule({
      providers: [
        FavoriteService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
    service = module.get(FavoriteService);
  });

  it('should reject when both tour and experience set', async () => {
    await expect(
      service.add('u1', { tourId: 't1', experienceId: 'e1' }),
    ).rejects.toBeInstanceOf(BusinessException);
  });

  it('should add tour favorite', async () => {
    (prisma.tour.findFirst as jest.Mock).mockResolvedValue({ id: 't1' });
    (prisma.favorite.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.favorite.create as jest.Mock).mockResolvedValue({
      id: 'f1',
      tourId: 't1',
      userId: 'u1',
    });

    const result = await service.add('u1', { tourId: 't1' });
    expect(result.data.tourId).toBe('t1');
  });
});

describe('CouponService', () => {
  let service: CouponService;
  let prisma: ReturnType<typeof createPrismaMock>;

  beforeEach(async () => {
    prisma = createPrismaMock();
    const module = await Test.createTestingModule({
      providers: [CouponService, { provide: PrismaService, useValue: prisma }],
    }).compile();
    service = module.get(CouponService);
  });

  it('should validate active coupon', async () => {
    (prisma.coupon.findFirst as jest.Mock).mockResolvedValue({
      id: 'c1',
      code: 'YAZ10',
      isActive: true,
      startsAt: null,
      endsAt: null,
      maxUses: null,
      usedCount: 0,
      discountType: 'PERCENT',
      discountValue: { toString: () => '10' },
    });

    const result = await service.validate('yaz10', 'u1');
    expect(result.data.code).toBe('YAZ10');
  });

  it('should reject exhausted coupon', async () => {
    (prisma.coupon.findFirst as jest.Mock).mockResolvedValue({
      id: 'c1',
      code: 'YAZ10',
      isActive: true,
      startsAt: null,
      endsAt: null,
      maxUses: 1,
      usedCount: 1,
      discountType: 'PERCENT',
      discountValue: { toString: () => '10' },
    });

    await expect(service.validate('YAZ10', 'u1')).rejects.toMatchObject({
      code: 'COUPON_EXHAUSTED',
    });
  });
});
