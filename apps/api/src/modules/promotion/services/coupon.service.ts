import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../generated/prisma';

import { PrismaService } from '../../../core/database/prisma.service';
import { BusinessException } from '../../../shared/exceptions/business.exception';
import { CreateCouponDto } from '../dto/promotion.dto';

@Injectable()
export class CouponService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCouponDto) {
    const code = dto.code.trim().toUpperCase();
    const existing = await this.prisma.coupon.findFirst({
      where: { code, deletedAt: null },
    });
    if (existing) {
      throw new BusinessException('COUPON_EXISTS', 'Bu kod zaten var');
    }

    const row = await this.prisma.coupon.create({
      data: {
        code,
        discountType: dto.discountType,
        discountValue: new Prisma.Decimal(dto.discountValue),
        startsAt: dto.startsAt ? new Date(dto.startsAt) : null,
        endsAt: dto.endsAt ? new Date(dto.endsAt) : null,
        maxUses: dto.maxUses ?? null,
        isActive: true,
      },
    });
    return { success: true, data: row, error: null };
  }

  async validate(code: string, userId: string) {
    const coupon = await this.prisma.coupon.findFirst({
      where: { code: code.trim().toUpperCase(), deletedAt: null },
    });
    if (!coupon || !coupon.isActive) {
      throw new BusinessException('COUPON_INVALID', 'Kupon geçersiz');
    }

    const now = new Date();
    if (coupon.startsAt && coupon.startsAt > now) {
      throw new BusinessException(
        'COUPON_NOT_STARTED',
        'Kupon henüz başlamadı',
      );
    }
    if (coupon.endsAt && coupon.endsAt < now) {
      throw new BusinessException('COUPON_EXPIRED', 'Kupon süresi dolmuş');
    }
    if (coupon.maxUses != null && coupon.usedCount >= coupon.maxUses) {
      throw new BusinessException(
        'COUPON_EXHAUSTED',
        'Kupon kullanım limiti dolmuş',
      );
    }

    return {
      success: true,
      data: {
        id: coupon.id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue.toString(),
        userId,
      },
      error: null,
    };
  }

  async redeem(code: string, userId: string, reservationId?: string) {
    const validated = await this.validate(code, userId);
    const couponId = validated.data.id;

    const usage = await this.prisma.$transaction(async (tx) => {
      const row = await tx.couponUsage.create({
        data: {
          couponId,
          userId,
          reservationId: reservationId ?? null,
        },
      });
      await tx.coupon.update({
        where: { id: couponId },
        data: { usedCount: { increment: 1 } },
      });
      return row;
    });

    return { success: true, data: usage, error: null };
  }

  async listActive() {
    const now = new Date();
    const rows = await this.prisma.coupon.findMany({
      where: {
        deletedAt: null,
        isActive: true,
        AND: [
          { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
          { OR: [{ endsAt: null }, { endsAt: { gte: now } }] },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return { success: true, data: rows, error: null };
  }
}
