import { Test } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';

import { PrismaService } from '../../../core/database/prisma.service';
import { SubUserService } from '../services/sub-user.service';
import { BusinessException } from '../../../shared/exceptions/business.exception';
import { createPrismaMock } from '../../__tests__/test-helpers';

const ownerActor = {
  userId: 'staff-owner',
  role: 'AGENCY_OWNER',
  agencyId: 'a1',
};

describe('SubUserService', () => {
  let service: SubUserService;
  let prisma: ReturnType<typeof createPrismaMock>;

  beforeEach(async () => {
    prisma = createPrismaMock();
    const module = await Test.createTestingModule({
      providers: [SubUserService, { provide: PrismaService, useValue: prisma }],
    }).compile();
    service = module.get(SubUserService);
  });

  it('should list AgencyStaff for agency owner', async () => {
    (prisma.agencyStaff.findMany as jest.Mock).mockResolvedValue([
      {
        id: 's1',
        agencyId: 'a1',
        name: 'Ayşe',
        email: 'ayse@acme.com',
        role: 'AGENCY_STAFF',
        status: 'ACTIVE',
        permissions: { tours: ['read'] },
      },
    ]);

    const result = await service.list('a1', ownerActor);

    expect(result.data).toHaveLength(1);
    expect(result.data[0].email).toBe('ayse@acme.com');
    expect(result.data[0].partnerId).toBe('a1');
  });

  it('should forbid listing another agency users', async () => {
    await expect(
      service.list('a1', {
        userId: 'staff-other',
        role: 'AGENCY_OWNER',
        agencyId: 'a2',
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('should reject duplicate email', async () => {
    (prisma.agency.findFirst as jest.Mock).mockResolvedValue({ id: 'a1' });
    (prisma.agencyStaff.findFirst as jest.Mock).mockResolvedValue({ id: 's1' });

    await expect(
      service.create(
        'a1',
        { name: 'X', email: 'ayse@acme.com', password: 'StaffPass1' },
        ownerActor,
      ),
    ).rejects.toBeInstanceOf(BusinessException);
  });

  it('should create AgencyStaff with password (no User row)', async () => {
    (prisma.agency.findFirst as jest.Mock).mockResolvedValue({ id: 'a1' });
    (prisma.agencyStaff.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.agencyStaff.create as jest.Mock).mockResolvedValue({
      id: 's2',
      agencyId: 'a1',
      name: 'Staff',
      email: 'staff@acme.com',
      role: 'AGENCY_STAFF',
      status: 'ACTIVE',
      permissions: {},
    });

    const result = await service.create(
      'a1',
      {
        name: 'Staff',
        email: 'staff@acme.com',
        password: 'StaffPass1',
      },
      ownerActor,
    );

    expect(result.data.id).toBe('s2');
    expect(prisma.agencyStaff.create).toHaveBeenCalled();
    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  it('should update and soft-delete AgencyStaff', async () => {
    (prisma.agencyStaff.findFirst as jest.Mock).mockResolvedValue({
      id: 's1',
      agencyId: 'a1',
      email: 'ayse@acme.com',
      deletedAt: null,
    });
    (prisma.agencyStaff.update as jest.Mock).mockResolvedValue({
      id: 's1',
      agencyId: 'a1',
      name: 'Ayşe Y.',
      email: 'ayse@acme.com',
      role: 'AGENCY_STAFF',
      status: 'ACTIVE',
      permissions: {},
    });

    const updated = await service.update(
      'a1',
      's1',
      { name: 'Ayşe Y.' },
      ownerActor,
    );
    expect(updated.data.name).toBe('Ayşe Y.');

    (prisma.agencyStaff.findFirst as jest.Mock).mockResolvedValue({
      id: 's1',
      agencyId: 'a1',
      deletedAt: null,
    });
    (prisma.agencyStaff.update as jest.Mock).mockResolvedValue({});
    const deleted = await service.softDelete('a1', 's1', {
      userId: 'admin',
      role: 'ADMIN',
      agencyId: undefined,
    });
    expect(deleted.data.deleted).toBe(true);
  });
});
