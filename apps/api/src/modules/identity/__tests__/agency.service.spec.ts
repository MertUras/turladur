import { BusinessException } from '../../../shared/exceptions/business.exception';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { PrismaService } from '../../../core/database/prisma.service';
import { AgencyService } from '../services/agency.service';
import { createPrismaMock } from '../../__tests__/test-helpers';

describe('AgencyService', () => {
  let service: AgencyService;
  let prisma: ReturnType<typeof createPrismaMock>;

  beforeEach(async () => {
    prisma = createPrismaMock();
    const module = await Test.createTestingModule({
      providers: [AgencyService, { provide: PrismaService, useValue: prisma }],
    }).compile();
    service = module.get(AgencyService);
  });

  describe('create', () => {
    it('should reject second agency for same user', async () => {
      (prisma.agency.findFirst as jest.Mock).mockResolvedValue({ id: 'a1' });
      await expect(
        service.create({ name: 'Yeni Acente' }, 'u1'),
      ).rejects.toBeInstanceOf(BusinessException);
    });

    it('should create agency as PENDING', async () => {
      (prisma.agency.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.agency.create as jest.Mock).mockResolvedValue({
        id: 'a1',
        name: 'Anadolu Travel',
        status: 'PENDING',
        userId: 'u1',
        email: null,
        city: 'İstanbul',
      });

      const result = await service.create(
        { name: 'Anadolu Travel', city: 'İstanbul' },
        'u1',
      );

      expect(result.data.status).toBe('PENDING');
      expect(prisma.agency.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ status: 'PENDING', userId: 'u1' }),
        }),
      );
    });
  });

  describe('search', () => {
    it('should list only APPROVED agencies for public', async () => {
      (prisma.agency.count as jest.Mock).mockResolvedValue(1);
      (prisma.agency.findMany as jest.Mock).mockResolvedValue([
        {
          id: 'a1',
          name: 'Onaylı',
          status: 'APPROVED',
          userId: 'u1',
          email: null,
          city: null,
        },
      ]);

      await service.search({ page: 1, limit: 20 });
      expect(prisma.agency.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ status: 'APPROVED' }),
        }),
      );
    });
  });

  describe('setStatus', () => {
    it('should approve agency', async () => {
      (prisma.agency.findFirst as jest.Mock).mockResolvedValue({
        id: 'a1',
        name: 'A',
        status: 'PENDING',
        userId: 'u1',
        email: null,
        city: null,
      });
      (prisma.agency.update as jest.Mock).mockResolvedValue({
        id: 'a1',
        name: 'A',
        status: 'APPROVED',
        userId: 'u1',
        email: null,
        city: null,
      });

      const result = await service.setStatus('a1', 'APPROVED');
      expect(result.data.status).toBe('APPROVED');
    });

    it('should throw when agency missing', async () => {
      (prisma.agency.findFirst as jest.Mock).mockResolvedValue(null);
      await expect(service.setStatus('x', 'APPROVED')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should forbid non-owner non-admin', async () => {
      (prisma.agency.findFirst as jest.Mock).mockResolvedValue({
        id: 'a1',
        userId: 'owner',
        deletedAt: null,
      });
      await expect(
        service.update(
          'a1',
          { name: 'Hack' },
          { userId: 'other', role: 'CUSTOMER' },
        ),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('should update owned agency', async () => {
      (prisma.agency.findFirst as jest.Mock).mockResolvedValue({
        id: 'a1',
        userId: 'u1',
        deletedAt: null,
      });
      (prisma.agency.update as jest.Mock).mockResolvedValue({
        id: 'a1',
        name: 'Yeni',
        status: 'PENDING',
        userId: 'u1',
        email: null,
        city: 'Ankara',
      });
      const result = await service.update(
        'a1',
        { name: 'Yeni', city: 'Ankara' },
        { userId: 'u1', role: 'CUSTOMER' },
      );
      expect(result.data.name).toBe('Yeni');
    });
  });

  describe('getMine / getById / softDelete', () => {
    it('should return null when user has no agency', async () => {
      (prisma.agency.findFirst as jest.Mock).mockResolvedValue(null);
      const result = await service.getMine('u1');
      expect(result.data).toBeNull();
    });

    it('should hide non-approved agency from public', async () => {
      (prisma.agency.findFirst as jest.Mock).mockResolvedValue({
        id: 'a1',
        name: 'X',
        status: 'PENDING',
        userId: 'owner',
        email: null,
        city: null,
      });
      await expect(service.getById('a1')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('should soft-delete as admin', async () => {
      (prisma.agency.findFirst as jest.Mock).mockResolvedValue({
        id: 'a1',
        userId: 'u1',
        deletedAt: null,
      });
      (prisma.agency.update as jest.Mock).mockResolvedValue({});
      const result = await service.softDelete('a1', {
        userId: 'admin',
        role: 'ADMIN',
      });
      expect(result.data.deleted).toBe(true);
    });
  });
});
