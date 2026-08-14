import { ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { Prisma } from '../../../generated/prisma';

import { AuditService } from '../../../core/audit/audit.service';
import { AgencyLinkService } from '../../../core/agency/agency-link.service';
import { PrismaService } from '../../../core/database/prisma.service';
import { createPrismaMock } from '../../__tests__/test-helpers';
import { AgencyEarningService } from '../services/agency-earning.service';

describe('AgencyEarningService', () => {
  let service: AgencyEarningService;
  let prisma: ReturnType<typeof createPrismaMock>;

  beforeEach(async () => {
    prisma = createPrismaMock();
    const module = await Test.createTestingModule({
      providers: [
        AgencyEarningService,
        AgencyLinkService,
        { provide: PrismaService, useValue: prisma },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('10'),
          },
        },
        {
          provide: AuditService,
          useValue: { record: jest.fn().mockResolvedValue(undefined) },
        },
      ],
    }).compile();
    service = module.get(AgencyEarningService);
  });

  it('should accrue net = gross - 10% commission', async () => {
    (prisma.agencyEarning.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.reservation.findFirst as jest.Mock).mockResolvedValue({
      id: 'r1',
      agencyId: 'a1',

      tourId: 't1',
      totalAmount: new Prisma.Decimal(1000),
      currency: 'TRY',
      deletedAt: null,
    });
    (prisma.agencyCommissionRate.findFirst as jest.Mock).mockResolvedValue(
      null,
    );
    (prisma.agencyEarning.create as jest.Mock).mockImplementation(({ data }) =>
      Promise.resolve({ id: 'e1', ...data }),
    );

    const row = await service.accrueFromReservation('r1');

    expect(row).toMatchObject({
      status: 'ACCRUED',
      currency: 'TRY',
    });
    expect(prisma.agencyEarning.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          agencyId: 'a1',
          amount: expect.any(Prisma.Decimal),
          commissionRatePercent: expect.any(Prisma.Decimal),
          status: 'ACCRUED',
        }),
      }),
    );

    const createArg = (prisma.agencyEarning.create as jest.Mock).mock
      .calls[0][0].data;
    expect(createArg.grossAmount.toString()).toBe('1000');
    expect(createArg.commissionAmount.toString()).toBe('100');
    expect(createArg.amount.toString()).toBe('900');
  });

  it('should create payout and mark earnings PAYABLE', async () => {
    (prisma.agencyEarning.findMany as jest.Mock).mockResolvedValue([
      {
        id: 'e1',
        amount: new Prisma.Decimal(900),
        currency: 'TRY',
        status: 'ACCRUED',
      },
    ]);
    (prisma.agencyBankInfo.findFirst as jest.Mock).mockResolvedValue({
      iban: 'TR00',
    });
    (prisma.agencyPayout.create as jest.Mock).mockResolvedValue({
      id: 'po1',
      status: 'PENDING',
      amount: new Prisma.Decimal(900),
    });
    (prisma.agencyEarning.updateMany as jest.Mock).mockResolvedValue({
      count: 1,
    });

    const result = await service.createPayoutFromAccrued('a1');

    expect(result.data.status).toBe('PENDING');
    expect(prisma.agencyEarning.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: 'PAYABLE', payoutId: 'po1' }),
      }),
    );
  });

  it('should forbid listing earnings for another agency', async () => {
    await expect(
      service.listEarnings('a1', undefined, 'other-agency', 'AGENCY_OWNER'),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('should list earnings for owning agency', async () => {
    (prisma.agencyEarning.findMany as jest.Mock).mockResolvedValue([
      { id: 'e1', agencyId: 'a1' },
    ]);
    const result = await service.listEarnings(
      'a1',
      undefined,
      'a1',
      'AGENCY_OWNER',
    );
    expect(result.data).toHaveLength(1);
    expect(prisma.agencyEarning.findMany).toHaveBeenCalled();
  });
});
