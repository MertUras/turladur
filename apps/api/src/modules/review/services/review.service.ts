import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import type { Review as SharedReview } from '@turladur/shared-types';
import { DEFAULT_PAGE, DEFAULT_PAGE_LIMIT } from '@turladur/shared-constants';

import { PrismaService } from '../../../core/database/prisma.service';
import { BusinessException } from '../../../shared/exceptions/business.exception';
import { CreateReviewDto } from '../dto/create-review.dto';
import { ListReviewsQueryDto } from '../dto/list-reviews-query.dto';
import { ReplyReviewDto } from '../dto/reply-review.dto';
import { UpdateReviewDto } from '../dto/update-review.dto';
import { ReviewCreatedEvent } from '../events/review-created.event';
import { ReviewDeletedEvent } from '../events/review-deleted.event';
import { ReviewUpdatedEvent } from '../events/review-updated.event';

@Injectable()
export class ReviewService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(dto: CreateReviewDto, userId: string) {
    const reservation = await this.prisma.reservation.findFirst({
      where: { id: dto.reservationId, deletedAt: null },
    });

    if (!reservation) {
      throw new NotFoundException({
        code: 'RESERVATION_NOT_FOUND',
        message: 'Rezervasyon bulunamadı',
      });
    }

    if (reservation.userId !== userId) {
      throw new ForbiddenException({
        code: 'NOT_BOOKING_OWNER',
        message: 'Sadece kendi rezervasyonunuz için yorum yazabilirsiniz',
      });
    }

    if (reservation.status !== 'COMPLETED') {
      throw new BusinessException(
        'BOOKING_NOT_COMPLETED',
        'Yorum yazmak için tur tamamlanmış olmalıdır',
      );
    }

    const existing = await this.prisma.review.findFirst({
      where: { reservationId: reservation.id, deletedAt: null },
    });
    if (existing) {
      throw new BusinessException(
        'REVIEW_ALREADY_EXISTS',
        'Bu rezervasyon için zaten yorum var',
      );
    }

    const review = await this.prisma.review.create({
      data: {
        tourId: reservation.tourId,
        reservationId: reservation.id,
        userId,
        partnerId: reservation.partnerId,
        rating: dto.rating,
        comment: dto.comment?.trim(),
        photoUrls: dto.photoUrls ?? [],
      },
    });

    this.eventEmitter.emit(
      'review.created',
      new ReviewCreatedEvent(
        review.id,
        review.tourId,
        review.partnerId,
        review.userId,
        review.rating,
      ),
    );

    return { success: true, data: this.toShared(review), error: null };
  }

  async update(reviewId: string, dto: UpdateReviewDto, userId: string) {
    const review = await this.findActive(reviewId);
    if (review.userId !== userId) {
      throw new ForbiddenException({
        code: 'NOT_REVIEW_OWNER',
        message: 'Bu yorumu düzenleyemezsiniz',
      });
    }

    const updated = await this.prisma.review.update({
      where: { id: reviewId },
      data: {
        ...(dto.rating !== undefined ? { rating: dto.rating } : {}),
        ...(dto.comment !== undefined
          ? { comment: dto.comment?.trim() ?? null }
          : {}),
        ...(dto.photoUrls !== undefined ? { photoUrls: dto.photoUrls } : {}),
      },
    });

    this.eventEmitter.emit(
      'review.updated',
      new ReviewUpdatedEvent(updated.id, updated.tourId, updated.partnerId),
    );

    return { success: true, data: this.toShared(updated), error: null };
  }

  async softDelete(reviewId: string, userId: string, role: string) {
    const review = await this.findActive(reviewId);
    const isAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN';
    if (review.userId !== userId && !isAdmin) {
      throw new ForbiddenException({
        code: 'NOT_REVIEW_OWNER',
        message: 'Bu yorumu silemezsiniz',
      });
    }

    await this.prisma.review.update({
      where: { id: reviewId },
      data: { deletedAt: new Date() },
    });

    this.eventEmitter.emit(
      'review.deleted',
      new ReviewDeletedEvent(review.id, review.tourId, review.partnerId),
    );

    return {
      success: true,
      data: { id: reviewId, deleted: true },
      error: null,
    };
  }

  async reply(
    reviewId: string,
    dto: ReplyReviewDto,
    partnerId: string | undefined,
    role: string,
  ) {
    const review = await this.findActive(reviewId);
    const isAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN';
    if (!isAdmin && (!partnerId || review.partnerId !== partnerId)) {
      throw new ForbiddenException({
        code: 'PARTNER_MISMATCH',
        message: 'Bu yoruma yanıt veremezsiniz',
      });
    }

    const updated = await this.prisma.review.update({
      where: { id: reviewId },
      data: {
        partnerReply: dto.reply.trim(),
        partnerRepliedAt: new Date(),
      },
    });

    return { success: true, data: this.toShared(updated), error: null };
  }

  async listByTour(tourId: string, query: ListReviewsQueryDto) {
    const page = query.page ?? DEFAULT_PAGE;
    const limit = query.limit ?? DEFAULT_PAGE_LIMIT;
    const where = {
      tourId,
      deletedAt: null,
      ...(query.minRating ? { rating: { gte: query.minRating } } : {}),
    };

    const [total, rows] = await Promise.all([
      this.prisma.review.count({ where }),
      this.prisma.review.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return {
      success: true,
      data: rows.map((r) => this.toShared(r)),
      error: null,
      meta: { page, limit, total },
    };
  }

  async listMine(userId: string) {
    const rows = await this.prisma.review.findMany({
      where: { userId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return {
      success: true,
      data: rows.map((r) => this.toShared(r)),
      error: null,
    };
  }

  async getEligibleReservation(tourId: string, userId: string) {
    const reservation = await this.prisma.reservation.findFirst({
      where: {
        tourId,
        userId,
        status: 'COMPLETED',
        deletedAt: null,
      },
      orderBy: { updatedAt: 'desc' },
    });

    if (!reservation) {
      return { success: true, data: null, error: null };
    }

    const existing = await this.prisma.review.findFirst({
      where: { reservationId: reservation.id, deletedAt: null },
    });

    if (existing) {
      return {
        success: true,
        data: { reservationId: reservation.id, alreadyReviewed: true },
        error: null,
      };
    }

    return {
      success: true,
      data: { reservationId: reservation.id, alreadyReviewed: false },
      error: null,
    };
  }

  private async findActive(id: string) {
    const review = await this.prisma.review.findFirst({
      where: { id, deletedAt: null },
    });
    if (!review) {
      throw new NotFoundException({
        code: 'REVIEW_NOT_FOUND',
        message: 'Yorum bulunamadı',
      });
    }
    return review;
  }

  private toShared(row: {
    id: string;
    tourId: string;
    reservationId: string;
    userId: string;
    partnerId: string;
    rating: number;
    comment: string | null;
    photoUrls: string[];
    partnerReply: string | null;
    partnerRepliedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }): SharedReview {
    return {
      id: row.id,
      tourId: row.tourId,
      reservationId: row.reservationId,
      userId: row.userId,
      partnerId: row.partnerId,
      rating: row.rating,
      comment: row.comment,
      photoUrls: row.photoUrls,
      partnerReply: row.partnerReply,
      partnerRepliedAt: row.partnerRepliedAt?.toISOString() ?? null,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }
}
