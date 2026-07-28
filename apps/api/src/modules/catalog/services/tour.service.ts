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
  TOUR_CANCEL_REASON_LABELS,
  TourCancelReason,
} from '@turta/shared-constants';
import type {
  Tour as SharedTour,
  TourDate as SharedTourDate,
} from '@turta/shared-types';
import { Prisma } from '../../../generated/prisma';

import { CacheService } from '../../../core/cache/cache.service';
import { PrismaService } from '../../../core/database/prisma.service';
import { StorageService } from '../../../core/storage/storage.service';
import { BusinessException } from '../../../shared/exceptions/business.exception';
import { CreateTourDateDto } from '../dto/create-tour-date.dto';
import { CreateTourDto } from '../dto/create-tour.dto';
import { SearchToursDto } from '../dto/search-tours.dto';
import { UpdateTourDto } from '../dto/update-tour.dto';
import { TourCancelledEvent } from '../events/tour-cancelled.event';
import { TourDatesCancelledEvent } from '../events/tour-dates-cancelled.event';
import { TourCreatedEvent } from '../events/tour-created.event';
import { TourSearchPerformedEvent } from '../events/tour-search-performed.event';
import { slugify } from '../utils/slugify';

function formatTourDateLabel(start: Date, end: Date): string {
  const fmt = new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const startLabel = fmt.format(start);
  const endLabel = fmt.format(end);
  return startLabel === endLabel ? startLabel : `${startLabel} – ${endLabel}`;
}

const SEARCH_CACHE_TTL_SECONDS = 300;

@Injectable()
export class TourService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
    private readonly eventEmitter: EventEmitter2,
    private readonly storage: StorageService,
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
        galleryUrls: dto.galleryUrls ?? [],
        extras: (dto.extras ?? {}) as Prisma.InputJsonValue,
        partnerId,
        // Partner tours await admin review (Sprint 16); keeps public catalog clean
        status: 'PENDING_REVIEW',
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
    if (dto.galleryUrls !== undefined) data.galleryUrls = dto.galleryUrls;
    if (dto.extras !== undefined) {
      data.extras = dto.extras as Prisma.InputJsonValue;
    }

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
    // Prefer cancelWithReason for published tours with bookings.
    // Soft-delete without reason still archives; no mass-cancel email.
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

  /**
   * Partner cancels / delists a tour with a mandatory reason.
   * Emits tour.cancelled so booking cancels active reservations + emails guests.
   */
  async cancelWithReason(
    tourId: string,
    partnerId: string | undefined,
    role: string,
    reason: TourCancelReason,
    note?: string,
  ) {
    const tour = await this.findOwnedTour(tourId, partnerId, role);
    const reasonLabel = TOUR_CANCEL_REASON_LABELS[reason];

    const extras =
      tour.extras &&
      typeof tour.extras === 'object' &&
      !Array.isArray(tour.extras)
        ? { ...(tour.extras as Record<string, unknown>) }
        : {};

    await this.prisma.tour.update({
      where: { id: tour.id },
      data: {
        status: 'ARCHIVED',
        deletedAt: new Date(),
        extras: {
          ...extras,
          cancelReason: reason,
          cancelReasonLabel: reasonLabel,
          cancelNote: note?.trim() || null,
          cancelledAt: new Date().toISOString(),
        } as Prisma.InputJsonValue,
      },
    });

    await this.cache.del(`catalog:tour:${tourId}`);
    await this.cache.invalidatePattern('catalog:tours:search:*');

    this.eventEmitter.emit(
      'tour.cancelled',
      new TourCancelledEvent(
        tour.id,
        tour.partnerId,
        tour.title,
        reason,
        reasonLabel,
      ),
    );

    return {
      success: true,
      data: {
        id: tour.id,
        cancelled: true,
        reason,
        reasonLabel,
      },
      error: null,
    };
  }

  /**
   * Cancel selected departure dates. Bookings for those dates are cancelled via event.
   * Archives the tour only when no active dates remain.
   */
  async cancelDates(
    tourId: string,
    partnerId: string | undefined,
    role: string,
    dateIds: string[],
    reason: TourCancelReason,
    note?: string,
  ) {
    const tour = await this.findOwnedTour(tourId, partnerId, role);
    const uniqueIds = [...new Set(dateIds)];
    const reasonLabel = TOUR_CANCEL_REASON_LABELS[reason];

    const dates = await this.prisma.tourDate.findMany({
      where: {
        id: { in: uniqueIds },
        tourId: tour.id,
        deletedAt: null,
        isActive: true,
      },
    });

    if (dates.length === 0) {
      throw new BusinessException(
        'TOUR_DATES_NOT_FOUND',
        'Seçilen aktif tur tarihi bulunamadı',
      );
    }

    if (dates.length !== uniqueIds.length) {
      throw new BusinessException(
        'TOUR_DATES_INVALID',
        'Bazı tarihler bu tura ait değil veya zaten iptal edilmiş',
      );
    }

    const cancelledAt = new Date().toISOString();
    const cancelledInfos = dates.map((d) => ({
      id: d.id,
      startDate: d.startDate.toISOString(),
      endDate: d.endDate.toISOString(),
      label: formatTourDateLabel(d.startDate, d.endDate),
    }));

    await this.prisma.$transaction(async (tx) => {
      for (const date of dates) {
        await tx.tourDate.update({
          where: { id: date.id },
          data: {
            isActive: false,
            deletedAt: new Date(),
          },
        });
      }

      const remaining = await tx.tourDate.count({
        where: {
          tourId: tour.id,
          deletedAt: null,
          isActive: true,
        },
      });

      if (remaining === 0) {
        const extras =
          tour.extras &&
          typeof tour.extras === 'object' &&
          !Array.isArray(tour.extras)
            ? { ...(tour.extras as Record<string, unknown>) }
            : {};

        await tx.tour.update({
          where: { id: tour.id },
          data: {
            status: 'ARCHIVED',
            deletedAt: new Date(),
            extras: {
              ...extras,
              cancelReason: reason,
              cancelReasonLabel: reasonLabel,
              cancelNote: note?.trim() || null,
              cancelledAt,
              cancelledDateIds: cancelledInfos.map((d) => d.id),
            } as Prisma.InputJsonValue,
          },
        });
      }
    });

    const remainingAfter = await this.prisma.tourDate.count({
      where: {
        tourId: tour.id,
        deletedAt: null,
        isActive: true,
      },
    });
    const tourArchived = remainingAfter === 0;

    await this.cache.del(`catalog:tour:${tourId}`);
    await this.cache.invalidatePattern('catalog:tours:search:*');

    this.eventEmitter.emit(
      'tour.dates.cancelled',
      new TourDatesCancelledEvent(
        tour.id,
        tour.partnerId,
        tour.title,
        cancelledInfos,
        reason,
        reasonLabel,
        tourArchived,
      ),
    );

    return {
      success: true,
      data: {
        id: tour.id,
        cancelledDateIds: cancelledInfos.map((d) => d.id),
        cancelledDates: cancelledInfos,
        reason,
        reasonLabel,
        tourArchived,
      },
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
      include: {
        partner: {
          select: {
            id: true,
            companyName: true,
            logo: true,
            membershipTier: true,
            averageRating: true,
            reviewCount: true,
          },
        },
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
    const sortBy = dto.sortBy ?? 'createdAt';
    const sortOrder = dto.sortOrder ?? 'desc';
    const durationRange = this.resolveDurationFilter(dto);

    const cacheKey = [
      'catalog:tours:search:v2',
      q,
      dto.category ?? '',
      dto.featured === true ? '1' : '0',
      durationRange?.min ?? '',
      durationRange?.max ?? '',
      dto.minPrice ?? '',
      dto.maxPrice ?? '',
      dto.minRating ?? '',
      sortBy,
      sortOrder,
      page,
      limit,
    ].join('|');

    const cached = await this.cache.get<{
      items: SharedTour[];
      meta: { page: number; limit: number; total: number };
    }>(cacheKey);

    if (cached) {
      this.eventEmitter.emit(
        'catalog.tour.search',
        new TourSearchPerformedEvent(q, dto.category, cached.meta.total, true),
      );
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
      ...(dto.featured === true ? { featured: true } : {}),
      ...(durationRange
        ? {
            durationDays: {
              ...(durationRange.min !== undefined
                ? { gte: durationRange.min }
                : {}),
              ...(durationRange.max !== undefined
                ? { lte: durationRange.max }
                : {}),
            },
          }
        : {}),
      ...(dto.minPrice !== undefined || dto.maxPrice !== undefined
        ? {
            price: {
              ...(dto.minPrice !== undefined ? { gte: dto.minPrice } : {}),
              ...(dto.maxPrice !== undefined ? { lte: dto.maxPrice } : {}),
            },
          }
        : {}),
      ...(dto.minRating !== undefined
        ? { averageRating: { gte: dto.minRating } }
        : {}),
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

    const orderByField =
      sortBy === 'price'
        ? 'price'
        : sortBy === 'rating'
          ? 'averageRating'
          : sortBy === 'durationDays'
            ? 'durationDays'
            : 'createdAt';

    const [total, rows] = await this.prisma.$transaction([
      this.prisma.tour.count({ where }),
      this.prisma.tour.findMany({
        where,
        orderBy: { [orderByField]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          partner: {
            select: {
              id: true,
              companyName: true,
              logo: true,
              membershipTier: true,
              averageRating: true,
              reviewCount: true,
            },
          },
        },
      }),
    ]);

    const items = rows.map((row) => this.toSharedTour(row));
    const meta = { page, limit, total };

    await this.cache.set(cacheKey, { items, meta }, SEARCH_CACHE_TTL_SECONDS);

    this.eventEmitter.emit(
      'catalog.tour.search',
      new TourSearchPerformedEvent(q, dto.category, total, false),
    );

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

    // Heal accidental duplicates from older create-on-update bugs (booking-safe).
    await this.quietDedupeTourDates(tourId);

    const existing = await this.prisma.tourDate.findMany({
      where: {
        tourId,
        deletedAt: null,
        isActive: true,
        startDate,
        endDate,
      },
      orderBy: [{ remainingCapacity: 'asc' }, { createdAt: 'asc' }],
    });

    // Idempotent: same window already active → reuse (no second row, checkout IDs stay).
    if (existing.length > 0) {
      return {
        success: true,
        data: this.toSharedTourDate(existing[0]),
        error: null,
      };
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

    // Self-heal unused duplicate windows without cancelling bookings.
    await this.quietDedupeTourDates(tourId);

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

  /**
   * Soft-deactivate unused duplicate date windows.
   * Keeps the row with lowest remainingCapacity (likely has bookings).
   * Never emits tour.dates.cancelled — reservations / checkout stay intact.
   */
  async quietDedupeTourDates(tourId: string): Promise<number> {
    const dates = await this.prisma.tourDate.findMany({
      where: { tourId, deletedAt: null, isActive: true },
      orderBy: [{ startDate: 'asc' }, { createdAt: 'asc' }],
    });

    const groups = new Map<string, typeof dates>();
    for (const date of dates) {
      const key = `${this.toDayKey(date.startDate)}|${this.toDayKey(date.endDate)}`;
      const group = groups.get(key) ?? [];
      group.push(date);
      groups.set(key, group);
    }

    const toDeactivate: string[] = [];
    for (const group of groups.values()) {
      if (group.length < 2) continue;

      const sorted = [...group].sort((a, b) => {
        if (a.remainingCapacity !== b.remainingCapacity) {
          return a.remainingCapacity - b.remainingCapacity;
        }
        return a.createdAt.getTime() - b.createdAt.getTime();
      });

      for (const duplicate of sorted.slice(1)) {
        // Seats already sold → leave alone (reservation.tourDateId may point here).
        if (duplicate.remainingCapacity < duplicate.capacity) continue;
        toDeactivate.push(duplicate.id);
      }
    }

    if (toDeactivate.length === 0) return 0;

    await this.prisma.tourDate.updateMany({
      where: { id: { in: toDeactivate } },
      data: { isActive: false, deletedAt: new Date() },
    });

    await this.cache.del(`catalog:tour:${tourId}`);
    await this.cache.invalidatePattern('catalog:tours:search:*');

    return toDeactivate.length;
  }

  private toDayKey(date: Date): string {
    return date.toISOString().slice(0, 10);
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

  private resolveDurationFilter(dto: SearchToursDto): {
    min?: number;
    max?: number;
  } | null {
    if (dto.durationDays !== undefined) {
      return { min: dto.durationDays, max: dto.durationDays };
    }
    switch (dto.duration) {
      case '1':
        return { min: 1, max: 1 };
      case '2-3':
        return { min: 2, max: 3 };
      case '4-6':
        return { min: 4, max: 6 };
      case '7+':
        return { min: 7 };
      default:
        return null;
    }
  }

  private toSharedTour(tour: {
    id: string;
    title: string;
    slug: string;
    description: string;
    coverUrl: string | null;
    galleryUrls?: string[];
    extras?: Prisma.JsonValue;
    price: Prisma.Decimal;
    currency: string;
    category: SharedTour['category'];
    status: SharedTour['status'];
    durationDays: number;
    featured?: boolean;
    averageRating?: Prisma.Decimal;
    reviewCount?: number;
    partnerId: string;
    createdAt: Date;
    updatedAt: Date;
    partner?: {
      id: string;
      companyName: string;
      logo: string | null;
      membershipTier: 'BRONZE' | 'SILVER' | 'GOLD';
      averageRating: Prisma.Decimal;
      reviewCount: number;
    } | null;
  }): SharedTour {
    return {
      id: tour.id,
      title: tour.title,
      slug: tour.slug,
      description: tour.description,
      coverUrl: this.storage.resolvePublicUrl(tour.coverUrl),
      galleryUrls: this.storage.resolvePublicUrlList(tour.galleryUrls ?? []),
      extras:
        tour.extras &&
        typeof tour.extras === 'object' &&
        !Array.isArray(tour.extras)
          ? (tour.extras as Record<string, unknown>)
          : {},
      price: tour.price.toString(),
      currency: tour.currency,
      category: tour.category,
      status: tour.status,
      durationDays: tour.durationDays,
      featured: tour.featured ?? false,
      averageRating: (tour.averageRating ?? new Prisma.Decimal(0)).toString(),
      reviewCount: tour.reviewCount ?? 0,
      partnerId: tour.partnerId,
      partner: tour.partner
        ? {
            id: tour.partner.id,
            companyName: tour.partner.companyName,
            logo: this.storage.resolvePublicUrl(tour.partner.logo),
            membershipTier: tour.partner.membershipTier,
            averageRating: tour.partner.averageRating.toString(),
            reviewCount: tour.partner.reviewCount,
          }
        : undefined,
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
