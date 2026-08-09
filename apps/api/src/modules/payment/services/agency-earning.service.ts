import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { Prisma } from '../../../generated/prisma';

import { AgencyLinkService } from '../../../core/agency/agency-link.service';
import { AuditService } from '../../../core/audit/audit.service';
import { PrismaService } from '../../../core/database/prisma.service';
import { BusinessException } from '../../../shared/exceptions/business.exception';

type BookingConfirmedPayload = {
  reservationId: string;
  userId: string;
  agencyId: string | null;
};

const DEFAULT_PLATFORM_COMMISSION_PERCENT = 10;

@Injectable()
export class AgencyEarningService {
  private readonly logger = new Logger(AgencyEarningService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly auditService: AuditService,
    private readonly agencyLink: AgencyLinkService,
  ) {}

  @OnEvent('booking.confirmed')
  async onBookingConfirmed(event: BookingConfirmedPayload): Promise<void> {
    try {
      await this.accrueFromReservation(event.reservationId);
    } catch (error) {
      this.logger.error(
        `AgencyEarning accrue failed for ${event.reservationId}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  async accrueFromReservation(reservationId: string) {
    const existing = await this.prisma.agencyEarning.findFirst({
      where: { reservationId, deletedAt: null },
    });
    if (existing) return existing;

    const reservation = await this.prisma.reservation.findFirst({
      where: { id: reservationId, deletedAt: null },
    });
    if (!reservation) {
      throw new BusinessException(
        'RESERVATION_NOT_FOUND',
        'Rezervasyon bulunamadı',
      );
    }

    const agencyId = await this.resolveAgencyId(reservation);
    if (!agencyId) {
      this.logger.warn(
        `Skip earning — no agency for reservation ${reservationId}`,
      );
      return null;
    }

    const gross = new Prisma.Decimal(reservation.totalAmount.toString());
    const ratePercent = await this.resolveRatePercent(agencyId, new Date());
    const commissionAmount = gross.mul(ratePercent).div(100).toDecimalPlaces(2);
    const net = gross.sub(commissionAmount).toDecimalPlaces(2);

    return this.prisma.agencyEarning.create({
      data: {
        agencyId,
        reservationId,
        amount: net,
        grossAmount: gross,
        commissionAmount,
        commissionRatePercent: ratePercent,
        currency: reservation.currency,
        status: 'ACCRUED',
      },
    });
  }

  async listEarnings(
    agencyId: string,
    status: string | undefined,
    actorAgencyId: string | undefined,
    role: string,
  ) {
    await this.agencyLink.assertAgencyAccessForPartner(
      agencyId,
      role,
      actorAgencyId,
    );
    const rows = await this.prisma.agencyEarning.findMany({
      where: {
        agencyId,
        deletedAt: null,
        ...(status ? { status } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
    return { success: true, data: rows, error: null };
  }

  /**
   * ACCRUED → payout PENDING + earnings PAYABLE (bağlı).
   * BankInfo yoksa yine payout oluşturulur (not düşülür); ödeme worker PAID yapar.
   */
  async createPayoutFromAccrued(agencyId: string, note?: string) {
    const accrued = await this.prisma.agencyEarning.findMany({
      where: { agencyId, status: 'ACCRUED', deletedAt: null },
    });
    if (accrued.length === 0) {
      throw new BusinessException(
        'NO_ACCRUED_EARNINGS',
        'Ödenecek ACCRUED kazanç yok',
      );
    }

    const currency = accrued[0].currency;
    if (accrued.some((row) => row.currency !== currency)) {
      throw new BusinessException(
        'MIXED_CURRENCY',
        'Aynı payout’ta tek para birimi olmalı',
      );
    }

    const total = accrued.reduce(
      (sum, row) => sum.add(row.amount),
      new Prisma.Decimal(0),
    );

    const bank = await this.prisma.agencyBankInfo.findFirst({
      where: { agencyId, deletedAt: null },
    });

    const payout = await this.prisma.$transaction(async (tx) => {
      const created = await tx.agencyPayout.create({
        data: {
          agencyId,
          amount: total,
          currency,
          status: 'PENDING',
          note:
            note ??
            (bank
              ? `IBAN ${bank.iban}`
              : 'BankInfo eksik — ödeme öncesi IBAN gerekli'),
        },
      });

      await tx.agencyEarning.updateMany({
        where: { id: { in: accrued.map((row) => row.id) } },
        data: { status: 'PAYABLE', payoutId: created.id },
      });

      return created;
    });

    return { success: true, data: payout, error: null };
  }

  async markPayoutPaid(payoutId: string) {
    const payout = await this.prisma.agencyPayout.findFirst({
      where: { id: payoutId, deletedAt: null },
    });
    if (!payout) {
      throw new BusinessException('PAYOUT_NOT_FOUND', 'Payout bulunamadı');
    }
    if (payout.status === 'PAID') {
      return { success: true, data: payout, error: null };
    }

    const bank = await this.prisma.agencyBankInfo.findFirst({
      where: { agencyId: payout.agencyId, deletedAt: null },
    });
    if (!bank) {
      throw new BusinessException(
        'BANK_INFO_REQUIRED',
        'Payout PAID için AgencyBankInfo zorunlu',
      );
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const row = await tx.agencyPayout.update({
        where: { id: payoutId },
        data: { status: 'PAID', paidAt: new Date() },
      });
      await tx.agencyEarning.updateMany({
        where: { payoutId, deletedAt: null },
        data: { status: 'PAID' },
      });
      return row;
    });

    await this.auditService.record({
      actorType: 'SYSTEM',
      actorId: null,
      action: 'PAYOUT_PAID',
      entityType: 'AgencyPayout',
      entityId: payoutId,
      meta: {
        agencyId: updated.agencyId,
        amount: updated.amount.toString(),
      },
    });

    return { success: true, data: updated, error: null };
  }

  async listPayouts(
    agencyId: string,
    actorAgencyId: string | undefined,
    role: string,
  ) {
    await this.agencyLink.assertAgencyAccessForPartner(
      agencyId,
      role,
      actorAgencyId,
    );
    const rows = await this.prisma.agencyPayout.findMany({
      where: { agencyId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return { success: true, data: rows, error: null };
  }

  async resolveRatePercent(
    agencyId: string,
    at: Date,
  ): Promise<Prisma.Decimal> {
    const rate = await this.prisma.agencyCommissionRate.findFirst({
      where: {
        agencyId,
        deletedAt: null,
        effectiveFrom: { lte: at },
        OR: [{ effectiveTo: null }, { effectiveTo: { gte: at } }],
      },
      orderBy: { effectiveFrom: 'desc' },
    });

    if (rate) return new Prisma.Decimal(rate.ratePercent.toString());

    const fallback = Number(
      this.config.get<string>('PLATFORM_COMMISSION_PERCENT') ??
        DEFAULT_PLATFORM_COMMISSION_PERCENT,
    );
    return new Prisma.Decimal(
      Number.isFinite(fallback)
        ? fallback
        : DEFAULT_PLATFORM_COMMISSION_PERCENT,
    );
  }

  private async resolveAgencyId(reservation: {
    agencyId: string | null;
    tourId: string | null;
  }): Promise<string | null> {
    if (reservation.agencyId) return reservation.agencyId;

    if (reservation.tourId) {
      const tour = await this.prisma.tour.findFirst({
        where: { id: reservation.tourId, deletedAt: null },
        select: { agencyId: true },
      });
      if (tour?.agencyId) return tour.agencyId;
    }

    return null;
  }
}
