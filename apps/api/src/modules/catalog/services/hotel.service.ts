import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DEFAULT_PAGE, DEFAULT_PAGE_LIMIT } from '@turta/shared-constants';
import type {
  Hotel as SharedHotel,
  Room as SharedRoom,
} from '@turta/shared-types';
import { Prisma } from '../../../generated/prisma';

import { CacheService } from '../../../core/cache/cache.service';
import { PrismaService } from '../../../core/database/prisma.service';
import {
  CreateHotelDto,
  CreateRoomDto,
  SearchHotelsDto,
  UpdateHotelDto,
  UpdateRoomDto,
} from '../dto/hotel.dto';
import { slugify } from '../utils/slugify';

@Injectable()
export class HotelService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
  ) {}

  async search(dto: SearchHotelsDto) {
    const page = dto.page ?? DEFAULT_PAGE;
    const limit = dto.limit ?? DEFAULT_PAGE_LIMIT;
    const q = dto.q?.trim() ?? '';

    const where: Prisma.HotelWhereInput = {
      deletedAt: null,
      ...(dto.city
        ? { city: { contains: dto.city, mode: 'insensitive' } }
        : {}),
      ...(dto.type ? { type: dto.type } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: 'insensitive' } },
              { city: { contains: q, mode: 'insensitive' } },
              { description: { contains: q, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [total, rows] = await this.prisma.$transaction([
      this.prisma.hotel.count({ where }),
      this.prisma.hotel.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return {
      success: true,
      data: rows.map((h) => this.toHotel(h)),
      error: null,
      meta: { page, limit, total },
    };
  }

  async getById(hotelId: string) {
    const hotel = await this.prisma.hotel.findFirst({
      where: { id: hotelId, deletedAt: null },
      include: { rooms: { where: { deletedAt: null, available: true } } },
    });
    if (!hotel) {
      throw new NotFoundException({
        code: 'HOTEL_NOT_FOUND',
        message: 'Otel bulunamadı',
      });
    }
    return {
      success: true,
      data: {
        ...this.toHotel(hotel),
        rooms: hotel.rooms.map((r) => this.toRoom(r)),
      },
      error: null,
    };
  }

  async create(dto: CreateHotelDto, partnerId: string | undefined) {
    await this.ensurePartnerCapability(partnerId, 'HOTELS');

    const slug = await this.uniqueHotelSlug(slugify(dto.name));
    const hotel = await this.prisma.hotel.create({
      data: {
        name: dto.name.trim(),
        slug,
        description: dto.description?.trim(),
        city: dto.city.trim(),
        country: dto.country?.trim() ?? 'Türkiye',
        address: dto.address?.trim(),
        type: dto.type,
        stars: dto.stars,
        phone: dto.phone,
        website: dto.website,
        partnerId: partnerId!,
      },
    });

    await this.cache.invalidatePattern('catalog:hotels:*');
    return { success: true, data: this.toHotel(hotel), error: null };
  }

  async update(
    hotelId: string,
    dto: UpdateHotelDto,
    partnerId: string | undefined,
    role: string,
  ) {
    const hotel = await this.findOwnedHotel(hotelId, partnerId, role);
    const data: Prisma.HotelUpdateInput = {};
    if (dto.name !== undefined) {
      data.name = dto.name.trim();
      data.slug = await this.uniqueHotelSlug(slugify(dto.name), hotelId);
    }
    if (dto.description !== undefined)
      data.description = dto.description.trim();
    if (dto.city !== undefined) data.city = dto.city.trim();
    if (dto.country !== undefined) data.country = dto.country.trim();
    if (dto.address !== undefined) data.address = dto.address.trim();
    if (dto.type !== undefined) data.type = dto.type;
    if (dto.stars !== undefined) data.stars = dto.stars;

    const updated = await this.prisma.hotel.update({
      where: { id: hotel.id },
      data,
    });
    await this.cache.invalidatePattern('catalog:hotels:*');
    return { success: true, data: this.toHotel(updated), error: null };
  }

  async softDelete(
    hotelId: string,
    partnerId: string | undefined,
    role: string,
  ) {
    const hotel = await this.findOwnedHotel(hotelId, partnerId, role);
    await this.prisma.hotel.update({
      where: { id: hotel.id },
      data: { deletedAt: new Date() },
    });
    await this.cache.invalidatePattern('catalog:hotels:*');
    return { success: true, data: { id: hotelId, deleted: true }, error: null };
  }

  async listRooms(hotelId: string) {
    await this.requireHotel(hotelId);
    const rooms = await this.prisma.room.findMany({
      where: { hotelId, deletedAt: null },
      orderBy: { price: 'asc' },
    });
    return {
      success: true,
      data: rooms.map((r) => this.toRoom(r)),
      error: null,
    };
  }

  async createRoom(
    hotelId: string,
    dto: CreateRoomDto,
    partnerId: string | undefined,
    role: string,
  ) {
    await this.findOwnedHotel(hotelId, partnerId, role);
    const room = await this.prisma.room.create({
      data: {
        hotelId,
        name: dto.name.trim(),
        description: dto.description?.trim(),
        type: dto.type,
        capacity: dto.capacity,
        price: new Prisma.Decimal(dto.price),
        discount:
          dto.discount !== undefined ? new Prisma.Decimal(dto.discount) : null,
        bedType: dto.bedType,
      },
    });
    return { success: true, data: this.toRoom(room), error: null };
  }

  async updateRoom(
    hotelId: string,
    roomId: string,
    dto: UpdateRoomDto,
    partnerId: string | undefined,
    role: string,
  ) {
    await this.findOwnedHotel(hotelId, partnerId, role);
    const room = await this.prisma.room.findFirst({
      where: { id: roomId, hotelId, deletedAt: null },
    });
    if (!room) {
      throw new NotFoundException({
        code: 'ROOM_NOT_FOUND',
        message: 'Oda bulunamadı',
      });
    }

    const data: Prisma.RoomUpdateInput = {};
    if (dto.name !== undefined) data.name = dto.name.trim();
    if (dto.description !== undefined)
      data.description = dto.description.trim();
    if (dto.type !== undefined) data.type = dto.type;
    if (dto.capacity !== undefined) data.capacity = dto.capacity;
    if (dto.price !== undefined) data.price = new Prisma.Decimal(dto.price);
    if (dto.discount !== undefined)
      data.discount = new Prisma.Decimal(dto.discount);
    if (dto.available !== undefined) data.available = dto.available;

    const updated = await this.prisma.room.update({
      where: { id: roomId },
      data,
    });
    return { success: true, data: this.toRoom(updated), error: null };
  }

  async softDeleteRoom(
    hotelId: string,
    roomId: string,
    partnerId: string | undefined,
    role: string,
  ) {
    await this.findOwnedHotel(hotelId, partnerId, role);
    const room = await this.prisma.room.findFirst({
      where: { id: roomId, hotelId, deletedAt: null },
    });
    if (!room) {
      throw new NotFoundException({
        code: 'ROOM_NOT_FOUND',
        message: 'Oda bulunamadı',
      });
    }
    await this.prisma.room.update({
      where: { id: roomId },
      data: { deletedAt: new Date(), available: false },
    });
    return { success: true, data: { id: roomId, deleted: true }, error: null };
  }

  private async ensurePartnerCapability(
    partnerId: string | undefined,
    capability: 'HOTELS' | 'EXPERIENCES' | 'TOURS',
  ) {
    if (!partnerId) {
      throw new ForbiddenException({
        code: 'PARTNER_REQUIRED',
        message: 'Partner hesabı gerekli',
      });
    }
    const partner = await this.prisma.partner.findFirst({
      where: { id: partnerId, deletedAt: null },
    });
    if (!partner || partner.status !== 'VERIFIED') {
      throw new ForbiddenException({
        code: 'PARTNER_NOT_VERIFIED',
        message: 'Doğrulanmış partner hesabı gerekli',
      });
    }
    if (
      partner.capabilities.length > 0 &&
      !partner.capabilities.includes(capability)
    ) {
      throw new ForbiddenException({
        code: 'CAPABILITY_REQUIRED',
        message: `Bu işlem için ${capability} yetkisi gerekli`,
      });
    }
  }

  private async findOwnedHotel(
    hotelId: string,
    partnerId: string | undefined,
    role: string,
  ) {
    const hotel = await this.requireHotel(hotelId);
    const isAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN';
    if (!isAdmin && hotel.partnerId !== partnerId) {
      throw new ForbiddenException({
        code: 'NOT_HOTEL_OWNER',
        message: 'Bu oteli yönetemezsiniz',
      });
    }
    return hotel;
  }

  private async requireHotel(hotelId: string) {
    const hotel = await this.prisma.hotel.findFirst({
      where: { id: hotelId, deletedAt: null },
    });
    if (!hotel) {
      throw new NotFoundException({
        code: 'HOTEL_NOT_FOUND',
        message: 'Otel bulunamadı',
      });
    }
    return hotel;
  }

  private async uniqueHotelSlug(base: string, excludeId?: string) {
    let slug = base;
    let i = 0;
    while (true) {
      const existing = await this.prisma.hotel.findFirst({
        where: {
          slug,
          deletedAt: null,
          ...(excludeId ? { id: { not: excludeId } } : {}),
        },
      });
      if (!existing) return slug;
      i += 1;
      slug = `${base}-${i}`;
    }
  }

  private toHotel(row: {
    id: string;
    name: string;
    slug: string;
    city: string;
    country: string;
    type: string;
    partnerId: string;
    stars: number | null;
  }): SharedHotel {
    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      city: row.city,
      country: row.country,
      type: row.type as SharedHotel['type'],
      partnerId: row.partnerId,
      stars: row.stars,
    };
  }

  private toRoom(row: {
    id: string;
    hotelId: string;
    name: string;
    capacity: number;
    price: Prisma.Decimal;
    available: boolean;
  }): SharedRoom {
    return {
      id: row.id,
      hotelId: row.hotelId,
      name: row.name,
      capacity: row.capacity,
      price: row.price.toString(),
      available: row.available,
    };
  }
}
