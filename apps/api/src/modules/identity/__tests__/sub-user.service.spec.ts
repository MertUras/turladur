import { Test } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';

import { PrismaService } from '../../../core/database/prisma.service';
import { SubUserService } from '../services/sub-user.service';
import { BusinessException } from '../../../shared/exceptions/business.exception';
import { createPrismaMock } from '../../__tests__/test-helpers';

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

  it('should list sub-users for partner owner', async () => {
    (prisma.subUser.findMany as jest.Mock).mockResolvedValue([
      {
        id: 's1',
        partnerId: 'p1',
        name: 'Ayşe',
        email: 'ayse@acme.com',
        role: 'MANAGER',
        status: 'ACTIVE',
        permissions: { tours: ['read'] },
      },
    ]);

    const result = await service.list('p1', {
      userId: 'u1',
      role: 'PARTNER',
      partnerId: 'p1',
    });

    expect(result.data).toHaveLength(1);
    expect(result.data[0].email).toBe('ayse@acme.com');
  });

  it('should forbid listing another partner users', async () => {
    await expect(
      service.list('p1', {
        userId: 'u2',
        role: 'PARTNER',
        partnerId: 'p2',
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('should reject duplicate email', async () => {
    (prisma.partner.findFirst as jest.Mock).mockResolvedValue({ id: 'p1' });
    (prisma.subUser.findFirst as jest.Mock).mockResolvedValue({ id: 's1' });

    await expect(
      service.create(
        'p1',
        { name: 'X', email: 'ayse@acme.com', password: 'StaffPass1' },
        { userId: 'u1', role: 'PARTNER', partnerId: 'p1' },
      ),
    ).rejects.toBeInstanceOf(BusinessException);
  });

  it('should reject existing CUSTOMER email (one email one role)', async () => {
    (prisma.partner.findFirst as jest.Mock).mockResolvedValue({ id: 'p1' });
    (prisma.subUser.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.user.findFirst as jest.Mock).mockResolvedValue({
      id: 'u9',
      email: 'musteri@acme.com',
      role: 'CUSTOMER',
      partnerId: null,
    });

    await expect(
      service.create(
        'p1',
        {
          name: 'Mehmet',
          email: 'musteri@acme.com',
          password: 'StaffPass1',
        },
        { userId: 'u1', role: 'PARTNER', partnerId: 'p1' },
      ),
    ).rejects.toBeInstanceOf(BusinessException);
  });

  it('should create new PARTNER_STAFF user with password', async () => {
    (prisma.partner.findFirst as jest.Mock).mockResolvedValue({ id: 'p1' });
    (prisma.subUser.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.user.create as jest.Mock).mockResolvedValue({
      id: 'u-staff',
      email: 'staff@acme.com',
      role: 'PARTNER_STAFF',
      partnerId: 'p1',
    });
    (prisma.subUser.create as jest.Mock).mockResolvedValue({
      id: 's2',
      partnerId: 'p1',
      userId: 'u-staff',
      name: 'Staff',
      email: 'staff@acme.com',
      role: 'USER',
      status: 'ACTIVE',
      permissions: {},
    });

    const result = await service.create(
      'p1',
      {
        name: 'Staff',
        email: 'staff@acme.com',
        password: 'StaffPass1',
      },
      { userId: 'u1', role: 'PARTNER', partnerId: 'p1' },
    );

    expect(result.data.id).toBe('s2');
    expect(prisma.user.create).toHaveBeenCalled();
  });

  it('should update and soft-delete sub-user', async () => {
    (prisma.subUser.findFirst as jest.Mock).mockResolvedValue({
      id: 's1',
      partnerId: 'p1',
      userId: 'u9',
      email: 'ayse@acme.com',
      deletedAt: null,
    });
    (prisma.subUser.update as jest.Mock).mockResolvedValue({
      id: 's1',
      partnerId: 'p1',
      userId: 'u9',
      name: 'Ayşe Y.',
      email: 'ayse@acme.com',
      role: 'MANAGER',
      status: 'ACTIVE',
      permissions: {},
    });
    (prisma.user.findFirst as jest.Mock).mockResolvedValue({
      id: 'u9',
      role: 'PARTNER_STAFF',
    });
    (prisma.user.update as jest.Mock).mockResolvedValue({});

    const updated = await service.update(
      'p1',
      's1',
      { name: 'Ayşe Y.', role: 'MANAGER' },
      { userId: 'u1', role: 'PARTNER', partnerId: 'p1' },
    );
    expect(updated.data.name).toBe('Ayşe Y.');

    (prisma.subUser.findFirst as jest.Mock).mockResolvedValue({
      id: 's1',
      partnerId: 'p1',
      userId: 'u9',
      deletedAt: null,
    });
    (prisma.subUser.update as jest.Mock).mockResolvedValue({});
    const deleted = await service.softDelete('p1', 's1', {
      userId: 'u1',
      role: 'ADMIN',
      partnerId: undefined,
    });
    expect(deleted.data.deleted).toBe(true);
  });
});
