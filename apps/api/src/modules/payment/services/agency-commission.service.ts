import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../../generated/prisma';

import { PrismaService } from '../../../core/database/prisma.service';
import { AgencyLinkService } from '../../../core/agency/agency-link.service';
import { BusinessException } from '../../../shared/exceptions/business.exception';

@Injectable()
export class AgencyCommissionService {
  constructor(private readonly prisma: PrismaService) {}

  async upsertRate(
    agencyId: string,
    dto: { ratePercent: number; effectiveFrom: string; effectiveTo?: string },
  ) {
    const agency = await this.prisma.agency.findFirst({
      where: { id: agencyId, deletedAt: null },
    });
    if (!agency) {
      throw new NotFoundException({
        code: 'AGENCY_NOT_FOUND',
        message: 'Acente bulunamadı',
      });
    }

    if (dto.ratePercent < 0 || dto.ratePercent > 100) {
      throw new BusinessException(
        'INVALID_RATE',
        'ratePercent 0–100 arasında olmalı',
      );
    }

    const row = await this.prisma.agencyCommissionRate.create({
      data: {
        agencyId,
        ratePercent: new Prisma.Decimal(dto.ratePercent),
        effectiveFrom: new Date(dto.effectiveFrom),
        effectiveTo: dto.effectiveTo ? new Date(dto.effectiveTo) : null,
      },
    });

    return { success: true, data: row, error: null };
  }

  async listRates(agencyId: string) {
    const rows = await this.prisma.agencyCommissionRate.findMany({
      where: { agencyId, deletedAt: null },
      orderBy: { effectiveFrom: 'desc' },
    });
    return { success: true, data: rows, error: null };
  }
}

@Injectable()
export class AgencyBankInfoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly agencyLink: AgencyLinkService,
  ) {}

  async upsert(
    agencyId: string,
    dto: { iban: string; accountName: string; bankName?: string },
    actorPartnerId: string | undefined,
    role: string,
  ) {
    await this.agencyLink.assertAgencyAccessForPartner(
      agencyId,
      role,
      actorPartnerId,
    );

    const iban = dto.iban.replace(/\s+/g, '').toUpperCase();
    if (iban.length < 15 || iban.length > 34) {
      throw new BusinessException('INVALID_IBAN', 'IBAN geçersiz');
    }

    const row = await this.prisma.agencyBankInfo.upsert({
      where: { agencyId },
      create: {
        agencyId,
        iban,
        accountName: dto.accountName.trim(),
        bankName: dto.bankName?.trim(),
      },
      update: {
        iban,
        accountName: dto.accountName.trim(),
        bankName: dto.bankName?.trim() ?? null,
        deletedAt: null,
      },
    });

    return { success: true, data: row, error: null };
  }

  async get(
    agencyId: string,
    actorPartnerId: string | undefined,
    role: string,
  ) {
    await this.agencyLink.assertAgencyAccessForPartner(
      agencyId,
      role,
      actorPartnerId,
    );
    const row = await this.prisma.agencyBankInfo.findFirst({
      where: { agencyId, deletedAt: null },
    });
    return { success: true, data: row, error: null };
  }
}
