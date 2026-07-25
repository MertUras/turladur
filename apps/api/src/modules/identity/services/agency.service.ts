import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DEFAULT_PAGE, DEFAULT_PAGE_LIMIT } from '@turladur/shared-constants';
import type { Agency as SharedAgency } from '@turladur/shared-types';
import { Prisma } from '../../../generated/prisma';

import { PrismaService } from '../../../core/database/prisma.service';
import { BusinessException } from '../../../shared/exceptions/business.exception';
import {
  CreateAgencyDto,
  SearchAgenciesDto,
  UpdateAgencyDto,
} from '../dto/agency.dto';

@Injectable()
export class AgencyService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAgencyDto, userId: string) {
    const existing = await this.prisma.agency.findFirst({
      where: { userId, deletedAt: null },
    });
    if (existing) {
      throw new BusinessException(
        'AGENCY_ALREADY_EXISTS',
        'Bu kullanıcı için zaten bir acente kaydı var',
      );
    }

    const agency = await this.prisma.agency.create({
      data: {
        name: dto.name.trim(),
        description: dto.description?.trim(),
        address: dto.address?.trim(),
        city: dto.city?.trim(),
        country: dto.country?.trim() ?? 'Türkiye',
        phone: dto.phone?.trim(),
        email: dto.email?.toLowerCase().trim(),
        website: dto.website?.trim(),
        logo: dto.logo,
        license: dto.license?.trim(),
        userId,
        status: 'PENDING',
      },
    });

    return { success: true, data: this.toShared(agency), error: null };
  }

  async search(dto: SearchAgenciesDto, actor?: ActorContext) {
    const page = dto.page ?? DEFAULT_PAGE;
    const limit = dto.limit ?? DEFAULT_PAGE_LIMIT;
    const isAdmin =
      actor && (actor.role === 'ADMIN' || actor.role === 'SUPER_ADMIN');

    const where: Prisma.AgencyWhereInput = {
      deletedAt: null,
      ...(dto.q
        ? {
            OR: [
              { name: { contains: dto.q, mode: 'insensitive' } },
              { city: { contains: dto.q, mode: 'insensitive' } },
              { email: { contains: dto.q, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    if (isAdmin) {
      if (dto.status) where.status = dto.status;
    } else if (dto.status && dto.status !== 'APPROVED' && actor?.userId) {
      where.status = dto.status;
      where.userId = actor.userId;
    } else {
      where.status = 'APPROVED';
    }

    const [total, rows] = await this.prisma.$transaction([
      this.prisma.agency.count({ where }),
      this.prisma.agency.findMany({
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

  async getById(agencyId: string, actor?: ActorContext) {
    const agency = await this.prisma.agency.findFirst({
      where: { id: agencyId, deletedAt: null },
    });
    if (!agency) {
      throw new NotFoundException({
        code: 'AGENCY_NOT_FOUND',
        message: 'Acente bulunamadı',
      });
    }

    const isAdmin =
      actor && (actor.role === 'ADMIN' || actor.role === 'SUPER_ADMIN');
    const isOwner = actor?.userId === agency.userId;
    if (!isAdmin && !isOwner && agency.status !== 'APPROVED') {
      throw new NotFoundException({
        code: 'AGENCY_NOT_FOUND',
        message: 'Acente bulunamadı',
      });
    }

    return { success: true, data: this.toShared(agency), error: null };
  }

  async getMine(userId: string) {
    const agency = await this.prisma.agency.findFirst({
      where: { userId, deletedAt: null },
    });
    return {
      success: true,
      data: agency ? this.toShared(agency) : null,
      error: null,
    };
  }

  async update(agencyId: string, dto: UpdateAgencyDto, actor: ActorContext) {
    const agency = await this.requireOwnedOrAdmin(agencyId, actor);
    const updated = await this.prisma.agency.update({
      where: { id: agency.id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
        ...(dto.description !== undefined
          ? { description: dto.description.trim() }
          : {}),
        ...(dto.address !== undefined ? { address: dto.address.trim() } : {}),
        ...(dto.city !== undefined ? { city: dto.city.trim() } : {}),
        ...(dto.phone !== undefined ? { phone: dto.phone.trim() } : {}),
        ...(dto.email !== undefined
          ? { email: dto.email.toLowerCase().trim() }
          : {}),
        ...(dto.website !== undefined ? { website: dto.website.trim() } : {}),
        ...(dto.license !== undefined ? { license: dto.license.trim() } : {}),
      },
    });
    return { success: true, data: this.toShared(updated), error: null };
  }

  async softDelete(agencyId: string, actor: ActorContext) {
    const agency = await this.requireOwnedOrAdmin(agencyId, actor);
    await this.prisma.agency.update({
      where: { id: agency.id },
      data: { deletedAt: new Date(), status: 'SUSPENDED' },
    });
    return {
      success: true,
      data: { id: agencyId, deleted: true },
      error: null,
    };
  }

  async setStatus(
    agencyId: string,
    status: 'APPROVED' | 'REJECTED' | 'SUSPENDED',
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

    const updated = await this.prisma.agency.update({
      where: { id: agency.id },
      data: { status },
    });

    return { success: true, data: this.toShared(updated), error: null };
  }

  private async requireOwnedOrAdmin(agencyId: string, actor: ActorContext) {
    const agency = await this.prisma.agency.findFirst({
      where: { id: agencyId, deletedAt: null },
    });
    if (!agency) {
      throw new NotFoundException({
        code: 'AGENCY_NOT_FOUND',
        message: 'Acente bulunamadı',
      });
    }
    const isAdmin = actor.role === 'ADMIN' || actor.role === 'SUPER_ADMIN';
    if (!isAdmin && agency.userId !== actor.userId) {
      throw new ForbiddenException({
        code: 'FORBIDDEN',
        message: 'Bu acenteyi yönetemezsiniz',
      });
    }
    return agency;
  }

  private toShared(row: {
    id: string;
    name: string;
    status: string;
    userId: string;
    email: string | null;
    city: string | null;
  }): SharedAgency {
    return {
      id: row.id,
      name: row.name,
      status: row.status as SharedAgency['status'],
      userId: row.userId,
      email: row.email,
      city: row.city,
    };
  }
}

type ActorContext = {
  userId: string;
  role: string;
};
