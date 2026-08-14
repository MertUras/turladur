import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { CacheService } from '../../../core/cache/cache.service';
import { AgencyLinkService } from '../../../core/agency/agency-link.service';
import { PrismaService } from '../../../core/database/prisma.service';
import { HotelService } from '../services/hotel.service';
import {
  createCacheMock,
  createPrismaMock,
} from '../../__tests__/test-helpers';

describe('HotelService', () => {
  let service: HotelService;
  let prisma: ReturnType<typeof createPrismaMock>;
  let cache: ReturnType<typeof createCacheMock>;

  beforeEach(async () => {
    prisma = createPrismaMock();
    cache = createCacheMock();

    const module = await Test.createTestingModule({
      providers: [
        HotelService,
        AgencyLinkService,
        { provide: PrismaService, useValue: prisma },
        { provide: CacheService, useValue: cache },
      ],
    }).compile();

    service = module.get(HotelService);
  });

  describe('search', () => {
    it('should return paginated hotels matching filters', async () => {
      const hotel = {
        id: 'h1',
        name: 'Göreme Otel',
        slug: 'goreme-otel',
        city: 'Nevşehir',
        country: 'Türkiye',
        type: 'HOTEL',
        agencyId: 'p1',
        stars: 4,
      };
      (prisma.hotel.count as jest.Mock).mockResolvedValue(1);
      (prisma.hotel.findMany as jest.Mock).mockResolvedValue([hotel]);

      const result = await service.search({
        city: 'Nevşehir',
        page: 1,
        limit: 20,
      });

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.data[0].name).toBe('Göreme Otel');
      expect(result.meta?.total).toBe(1);
    });
  });

  describe('getById', () => {
    it('should throw when hotel is missing', async () => {
      (prisma.hotel.findFirst as jest.Mock).mockResolvedValue(null);
      await expect(service.getById('missing')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('should return hotel with empty rooms array', async () => {
      (prisma.hotel.findFirst as jest.Mock).mockResolvedValue({
        id: 'h1',
        name: 'Cave Hotel',
        slug: 'cave-hotel',
        city: 'Göreme',
        country: 'Türkiye',
        type: 'BOUTIQUE_HOTEL',
        agencyId: 'p1',
        stars: 5,
      });

      const result = await service.getById('h1');
      expect(result.data.rooms).toEqual([]);
      expect(result.data.name).toBe('Cave Hotel');
    });
  });

  describe('create', () => {
    it('should reject when agencyId is missing', async () => {
      await expect(
        service.create(
          {
            name: 'Test',
            city: 'Antalya',
          } as never,
          undefined,
        ),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('should create hotel for verified partner with TOURS capability', async () => {
      (prisma.agency.findFirst as jest.Mock).mockResolvedValue({
        id: 'p1',
        status: 'VERIFIED',
        capabilities: ['TOURS'],
      });
      (prisma.hotel.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.hotel.create as jest.Mock).mockResolvedValue({
        id: 'h1',
        name: 'Test Hotel',
        slug: 'test-hotel',
        city: 'Antalya',
        country: 'Türkiye',
        type: 'HOTEL',
        agencyId: 'p1',
        stars: null,
      });

      const result = await service.create(
        {
          name: 'Test Hotel',
          city: 'Antalya',
          type: 'HOTEL' as never,
        },
        'p1',
      );

      expect(result.success).toBe(true);
      expect(result.data.slug).toBe('test-hotel');
      expect(cache.invalidatePattern).toHaveBeenCalled();
    });
  });

  describe('update / softDelete', () => {
    it('should update owned hotel', async () => {
      (prisma.hotel.findFirst as jest.Mock)
        .mockResolvedValueOnce({
          id: 'h1',
          agencyId: 'p1',
          deletedAt: null,
        })
        .mockResolvedValueOnce(null);
      (prisma.hotel.update as jest.Mock).mockResolvedValue({
        id: 'h1',
        name: 'Yeni Ad',
        slug: 'yeni-ad',
        city: 'Antalya',
        country: 'Türkiye',
        type: 'HOTEL',
        agencyId: 'p1',
        stars: 4,
      });

      const result = await service.update(
        'h1',
        { name: 'Yeni Ad', stars: 4 },
        'p1',
        'PARTNER',
      );
      expect(result.data.name).toBe('Yeni Ad');
    });

    it('should soft-delete hotel', async () => {
      (prisma.hotel.findFirst as jest.Mock).mockResolvedValue({
        id: 'h1',
        agencyId: 'p1',
        deletedAt: null,
      });
      (prisma.hotel.update as jest.Mock).mockResolvedValue({});

      const result = await service.softDelete('h1', 'p1', 'PARTNER');
      expect(result.data.deleted).toBe(true);
    });

    it('should forbid non-owner hotel update', async () => {
      (prisma.hotel.findFirst as jest.Mock).mockResolvedValue({
        id: 'h1',
        agencyId: 'p1',
        deletedAt: null,
      });
      await expect(
        service.update('h1', { city: 'X' }, 'other', 'PARTNER'),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });
  });

  describe('listRooms', () => {
    it('should return empty rooms list for existing hotel', async () => {
      (prisma.hotel.findFirst as jest.Mock).mockResolvedValue({
        id: 'h1',
        deletedAt: null,
      });

      const result = await service.listRooms('h1');
      expect(result.success).toBe(true);
      expect(result.data).toEqual([]);
      expect(result.error).toBeNull();
    });

    it('should throw when hotel is missing', async () => {
      (prisma.hotel.findFirst as jest.Mock).mockResolvedValue(null);
      await expect(service.listRooms('missing')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });
});
