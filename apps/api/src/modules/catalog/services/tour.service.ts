import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  DEFAULT_CURRENCY,
  DEFAULT_PAGE,
  DEFAULT_PAGE_LIMIT,
} from '@turladur/shared-constants';
import type {
  Tour as SharedTour,
  TourDate as SharedTourDate,
} from '@turladur/shared-types';
import { Prisma } from '../../../generated/prisma';

import { CacheService } from '../../../core/cache/cache.service';
import { PrismaService } from '../../../core/database/prisma.service';
import { BusinessException } from '../../../shared/exceptions/business.exception';
import { CreateTourDateDto } from '../dto/create-tour-date.dto';
import { CreateTourDto } from '../dto/create-tour.dto';
import { SearchToursDto } from '../dto/search-tours.dto';
import { UpdateTourDto } from '../dto/update-tour.dto';
import { TourCreatedEvent } from '../events/tour-created.event';
import { slugify } from '../utils/slugify';

const SEARCH_CACHE_TTL_SECONDS = 300;

@Injectable()
export class TourService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(dto: CreateTourDto, partnerId: string | undefined) {
    if (!partnerId) {
      throw new ForbiddenException({
        code: 'PARTNER_REQUIRED',
        message: 'Tur oluşturmak için partner hesabı gerekir',
      });
    }

    await this.ensurePartnerCanPublish(partnerId);

    const baseSlug = slugify(dto.title);
    const slug = await this.uniqueSlug(baseSlug);

    const tour = await this.prisma.tour.create({
      data: {
        title: dto.title.trim(),
        slug,
        description: dto.description.trim(),
        price: new Prisma.Decimal(dto.price),
        currency: dto.currency ?? DEFAULT_CURRENCY,
        category: dto.category,
        durationDays: dto.durationDays ?? 1,
        coverUrl: dto.coverUrl,
        partnerId,
        status: 'PUBLISHED',
      },
    });

    await this.cache.invalidatePattern('catalog:tours:search:*');

    this.eventEmitter.emit(
      'tour.created',
      new TourCreatedEvent(tour.id, partnerId),
    );

    return {
      success: true,
      data: this.toSharedTour(tour),
      error: null,
    };
  }

  async update(
    tourId: string,
    dto: UpdateTourDto,
    partnerId: string | undefined,
    role: string,
  ) {
    const tour = await this.findOwnedTour(tourId, partnerId, role);

    const data: Prisma.TourUpdateInput = {};
    if (dto.title !== undefined) {
      data.title = dto.title.trim();
      data.slug = await this.uniqueSlug(slugify(dto.title), tourId);
    }
    if (dto.description !== undefined)
      data.description = dto.description.trim();
    if (dto.price !== undefined) data.price = new Prisma.Decimal(dto.price);
    if (dto.currency !== undefined) data.currency = dto.currency;
    if (dto.category !== undefined) data.category = dto.category;
    if (dto.status !== undefined) data.status = dto.status;
    if (dto.durationDays !== undefined) data.durationDays = dto.durationDays;
    if (dto.coverUrl !== undefined) data.coverUrl = dto.coverUrl;

    const updated = await this.prisma.tour.update({
      where: { id: tour.id },
      data,
    });

    await this.cache.del(`catalog:tour:${tourId}`);
    await this.cache.invalidatePattern('catalog:tours:search:*');

    return {
      success: true,
      data: this.toSharedTour(updated),
      error: null,
    };
  }

  async softDelete(
    tourId: string,
    partnerId: string | undefined,
    role: string,
  ) {
    const tour = await this.findOwnedTour(tourId, partnerId, role);

    await this.prisma.tour.update({
      where: { id: tour.id },
      data: { deletedAt: new Date(), status: 'ARCHIVED' },
    });

    await this.cache.del(`catalog:tour:${tourId}`);
    await this.cache.invalidatePattern('catalog:tours:search:*');

    return {
      success: true,
      data: { id: tourId, deleted: true },
      error: null,
    };
  }

  async getById(tourId: string) {
    const cacheKey = `catalog:tour:${tourId}`;
    const cached = await this.cache.get<SharedTour>(cacheKey);
    if (cached) {
      return { success: true, data: cached, error: null };
    }

    const tour = await this.prisma.tour.findFirst({
      where: {
        id: tourId,
        deletedAt: null,
        status: 'PUBLISHED',
      },
    });

    if (!tour) {
      throw new NotFoundException({
        code: 'TOUR_NOT_FOUND',
        message: 'Tur bulunamadı',
      });
    }

    const mapped = this.toSharedTour(tour);
    await this.cache.set(cacheKey, mapped, 900);

    return { success: true, data: mapped, error: null };
  }

  async search(dto: SearchToursDto) {
    const page = dto.page ?? DEFAULT_PAGE;
    const limit = dto.limit ?? DEFAULT_PAGE_LIMIT;
    const q = dto.q?.trim().toLowerCase() ?? '';
    const cacheKey = `catalog:tours:search:${q}|${dto.category ?? ''}|${page}|${limit}`;

    const cached = await this.cache.get<{
      items: SharedTour[];
      meta: { page: number; limit: number; total: number };
    }>(cacheKey);

    if (cached) {
      return {
        success: true,
        data: cached.items,
        error: null,
        meta: cached.meta,
      };
    }

    const where: Prisma.TourWhereInput = {
      deletedAt: null,
      status: 'PUBLISHED',
      ...(dto.category ? { category: dto.category } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: 'insensitive' } },
              { description: { contains: q, mode: 'insensitive' } },
              { slug: { contains: q, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [total, rows] = await this.prisma.$transaction([
      this.prisma.tour.count({ where }),
      this.prisma.tour.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    const items = rows.map((row) => this.toSharedTour(row));
    const meta = { page, limit, total };

    await this.cache.set(cacheKey, { items, meta }, SEARCH_CACHE_TTL_SECONDS);

    return {
      success: true,
      data: items,
      error: null,
      meta,
    };
  }

  async createTourDate(
    tourId: string,
    dto: CreateTourDateDto,
    partnerId: string | undefined,
    role: string,
  ) {
    await this.findOwnedTour(tourId, partnerId, role);

    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);

    if (endDate < startDate) {
      throw new BusinessException(
        'INVALID_DATE_RANGE',
        'Bitiş tarihi başlangıçtan önce olamaz',
      );
    }

    const tourDate = await this.prisma.tourDate.create({
      data: {
        tourId,
        startDate,
        endDate,
        capacity: dto.capacity,
        remainingCapacity: dto.capacity,
        priceOverride:
          dto.priceOverride !== undefined
            ? new Prisma.Decimal(dto.priceOverride)
            : null,
      },
    });

    return {
      success: true,
      data: this.toSharedTourDate(tourDate),
      error: null,
    };
  }

  async listTourDates(tourId: string) {
    const tour = await this.prisma.tour.findFirst({
      where: { id: tourId, deletedAt: null },
    });

    if (!tour) {
      throw new NotFoundException({
        code: 'TOUR_NOT_FOUND',
        message: 'Tur bulunamadı',
      });
    }

    const dates = await this.prisma.tourDate.findMany({
      where: { tourId, deletedAt: null, isActive: true },
      orderBy: { startDate: 'asc' },
    });

    return {
      success: true,
      data: dates.map((d) => this.toSharedTourDate(d)),
      error: null,
    };
  }

  private async ensurePartnerCanPublish(partnerId: string): Promise<void> {
    const partner = await this.prisma.partner.findFirst({
      where: { id: partnerId, deletedAt: null },
    });

    if (!partner) {
      throw new ForbiddenException({
        code: 'PARTNER_NOT_FOUND',
        message: 'Partner bulunamadı',
      });
    }

    if (partner.status !== 'VERIFIED') {
      throw new ForbiddenException({
        code: 'PARTNER_NOT_VERIFIED',
        message: 'Tur oluşturmak için partner hesabı doğrulanmış olmalı',
      });
    }
  }

  private async findOwnedTour(
    tourId: string,
    partnerId: string | undefined,
    role: string,
  ) {
    const tour = await this.prisma.tour.findFirst({
      where: { id: tourId, deletedAt: null },
    });

    if (!tour) {
      throw new NotFoundException({
        code: 'TOUR_NOT_FOUND',
        message: 'Tur bulunamadı',
      });
    }

    const isAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN';
    if (!isAdmin && tour.partnerId !== partnerId) {
      throw new ForbiddenException({
        code: 'FORBIDDEN',
        message: 'Bu tura erişim yetkiniz yok',
      });
    }

    return tour;
  }

  private async uniqueSlug(base: string, excludeId?: string): Promise<string> {
    let candidate = base;
    let suffix = 0;

    while (true) {
      const existing = await this.prisma.tour.findFirst({
        where: {
          slug: candidate,
          deletedAt: null,
          ...(excludeId ? { NOT: { id: excludeId } } : {}),
        },
      });

      if (!existing) {
        return candidate;
      }

      suffix += 1;
      candidate = `${base}-${suffix}`.slice(0, 220);
    }
  }

  private toSharedTour(tour: {
    id: string;
    title: string;
    slug: string;
    description: string;
    coverUrl: string | null;
    price: Prisma.Decimal;
    currency: string;
    category: SharedTour['category'];
    status: SharedTour['status'];
    durationDays: number;
    partnerId: string;
    createdAt: Date;
    updatedAt: Date;
  }): SharedTour {
    return {
      id: tour.id,
      title: tour.title,
      slug: tour.slug,
      description: tour.description,
      coverUrl: tour.coverUrl,
      price: tour.price.toString(),
      currency: tour.currency,
      category: tour.category,
      status: tour.status,
      durationDays: tour.durationDays,
      partnerId: tour.partnerId,
      createdAt: tour.createdAt.toISOString(),
      updatedAt: tour.updatedAt.toISOString(),
    };
  }

  private toSharedTourDate(date: {
    id: string;
    tourId: string;
    startDate: Date;
    endDate: Date;
    capacity: number;
    remainingCapacity: number;
    priceOverride: Prisma.Decimal | null;
    isActive: boolean;
  }): SharedTourDate {
    return {
      id: date.id,
      tourId: date.tourId,
      startDate: date.startDate.toISOString().slice(0, 10),
      endDate: date.endDate.toISOString().slice(0, 10),
      capacity: date.capacity,
      remainingCapacity: date.remainingCapacity,
      priceOverride: date.priceOverride?.toString() ?? null,
      isActive: date.isActive,
    };
  }
}
