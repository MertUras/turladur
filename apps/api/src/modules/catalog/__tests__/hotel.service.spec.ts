import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { CacheService } from '../../../core/cache/cache.service';
import { PrismaService } from '../../../core/database/prisma.service';
import { HotelService } from '../services/hotel.service';
import {
  createCacheMock,
  createPrismaMock,
  decimal,
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
        partnerId: 'p1',
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

    it('should return hotel with rooms', async () => {
      (prisma.hotel.findFirst as jest.Mock).mockResolvedValue({
        id: 'h1',
        name: 'Cave Hotel',
        slug: 'cave-hotel',
        city: 'Göreme',
        country: 'Türkiye',
        type: 'BOUTIQUE_HOTEL',
        partnerId: 'p1',
        stars: 5,
        rooms: [
          {
            id: 'r1',
            hotelId: 'h1',
            name: 'Standart',
            capacity: 2,
            price: decimal(2500),
            available: true,
          },
        ],
      });

      const result = await service.getById('h1');
      expect(result.data.rooms).toHaveLength(1);
      expect(result.data.rooms[0].price).toBe('2500');
    });
  });

  describe('create', () => {
    it('should reject when partnerId is missing', async () => {
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

    it('should create hotel for verified partner with HOTELS capability', async () => {
      (prisma.partner.findFirst as jest.Mock).mockResolvedValue({
        id: 'p1',
        status: 'VERIFIED',
        capabilities: ['HOTELS'],
      });
      (prisma.hotel.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.hotel.create as jest.Mock).mockResolvedValue({
        id: 'h1',
        name: 'Test Hotel',
        slug: 'test-hotel',
        city: 'Antalya',
        country: 'Türkiye',
        type: 'HOTEL',
        partnerId: 'p1',
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

  describe('createRoom', () => {
    it('should create a room on owned hotel', async () => {
      (prisma.hotel.findFirst as jest.Mock).mockResolvedValue({
        id: 'h1',
        partnerId: 'p1',
        deletedAt: null,
      });
      (prisma.room.create as jest.Mock).mockResolvedValue({
        id: 'r1',
        hotelId: 'h1',
        name: 'Deluxe',
        capacity: 3,
        price: decimal(3200),
        available: true,
      });

      const result = await service.createRoom(
        'h1',
        { name: 'Deluxe', capacity: 3, price: 3200 },
        'p1',
        'PARTNER',
      );

      expect(result.data.name).toBe('Deluxe');
      expect(result.data.price).toBe('3200');
    });
  });

  describe('update / softDelete / rooms', () => {
    it('should update owned hotel', async () => {
      (prisma.hotel.findFirst as jest.Mock)
        .mockResolvedValueOnce({
          id: 'h1',
          partnerId: 'p1',
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
        partnerId: 'p1',
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
        partnerId: 'p1',
        deletedAt: null,
      });
      (prisma.hotel.update as jest.Mock).mockResolvedValue({});

      const result = await service.softDelete('h1', 'p1', 'PARTNER');
      expect(result.data.deleted).toBe(true);
    });

    it('should list rooms', async () => {
      (prisma.hotel.findFirst as jest.Mock).mockResolvedValue({
        id: 'h1',
        deletedAt: null,
      });
      (prisma.room.findMany as jest.Mock).mockResolvedValue([
        {
          id: 'r1',
          hotelId: 'h1',
          name: 'Standart',
          capacity: 2,
          price: decimal(1000),
          available: true,
        },
      ]);

      const result = await service.listRooms('h1');
      expect(result.data).toHaveLength(1);
    });

    it('should update and soft-delete room', async () => {
      (prisma.hotel.findFirst as jest.Mock).mockResolvedValue({
        id: 'h1',
        partnerId: 'p1',
        deletedAt: null,
      });
      (prisma.room.findFirst as jest.Mock).mockResolvedValue({
        id: 'r1',
        hotelId: 'h1',
        deletedAt: null,
      });
      (prisma.room.update as jest.Mock).mockResolvedValue({
        id: 'r1',
        hotelId: 'h1',
        name: 'Updated',
        capacity: 2,
        price: decimal(1100),
        available: false,
      });

      const updated = await service.updateRoom(
        'h1',
        'r1',
        { name: 'Updated', available: false },
        'p1',
        'PARTNER',
      );
      expect(updated.data.name).toBe('Updated');

      const deleted = await service.softDeleteRoom('h1', 'r1', 'p1', 'PARTNER');
      expect(deleted.data.deleted).toBe(true);
    });

    it('should forbid non-owner hotel update', async () => {
      (prisma.hotel.findFirst as jest.Mock).mockResolvedValue({
        id: 'h1',
        partnerId: 'p1',
        deletedAt: null,
      });
      await expect(
        service.update('h1', { city: 'X' }, 'other', 'PARTNER'),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });
  });
});
