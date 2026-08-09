import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { SubUser as SharedSubUser } from '@turta/shared-types';
import * as bcrypt from 'bcrypt';
import { Prisma } from '../../../generated/prisma';

import { PrismaService } from '../../../core/database/prisma.service';
import { BusinessException } from '../../../shared/exceptions/business.exception';
import { CreateSubUserDto, UpdateSubUserDto } from '../dto/sub-user.dto';

const BCRYPT_ROUNDS = 12;

/** P0-A: SubUser table DROPPED — AgencyStaff CRUD (FE /partner/users BC). */
@Injectable()
export class SubUserService {
  constructor(private readonly prisma: PrismaService) {}

  async list(agencyId: string, actor: ActorContext) {
    this.assertCanManage(agencyId, actor);

    const rows = await this.prisma.agencyStaff.findMany({
      where: { agencyId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      data: rows.map((row) => this.toShared(row)),
      error: null,
    };
  }

  async create(agencyId: string, dto: CreateSubUserDto, actor: ActorContext) {
    this.assertCanManage(agencyId, actor);
    await this.requireAgency(agencyId);

    const email = dto.email.toLowerCase().trim();
    const existing = await this.prisma.agencyStaff.findFirst({
      where: { agencyId, email, deletedAt: null },
    });
    if (existing) {
      throw new BusinessException(
        'SUB_USER_EMAIL_EXISTS',
        'Bu email adresi zaten kullanımda',
      );
    }

    const password = dto.password?.trim() || 'ChangeMe123!';
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const permissions = (dto.permissions ??
      {}) as unknown as Prisma.InputJsonValue;

    const role =
      dto.role === 'AGENCY_ADMIN' || dto.role === 'AGENCY_OWNER'
        ? dto.role
        : 'AGENCY_STAFF';

    const row = await this.prisma.agencyStaff.create({
      data: {
        agencyId,
        name: dto.name.trim(),
        email,
        passwordHash,
        role,
        permissions,
        status: 'ACTIVE',
      },
    });

    return { success: true, data: this.toShared(row), error: null };
  }

  async update(
    agencyId: string,
    subUserId: string,
    dto: UpdateSubUserDto,
    actor: ActorContext,
  ) {
    this.assertCanManage(agencyId, actor);
    const existing = await this.prisma.agencyStaff.findFirst({
      where: { id: subUserId, agencyId, deletedAt: null },
    });
    if (!existing) {
      throw new NotFoundException({
        code: 'SUB_USER_NOT_FOUND',
        message: 'Alt kullanıcı bulunamadı',
      });
    }

    const data: Prisma.AgencyStaffUpdateInput = {};
    if (dto.name !== undefined) data.name = dto.name.trim();
    if (dto.status !== undefined) data.status = dto.status.trim();
    if (dto.permissions !== undefined) {
      data.permissions = dto.permissions as unknown as Prisma.InputJsonValue;
    }

    const updated = await this.prisma.agencyStaff.update({
      where: { id: existing.id },
      data,
    });

    return { success: true, data: this.toShared(updated), error: null };
  }

  async softDelete(agencyId: string, subUserId: string, actor: ActorContext) {
    this.assertCanManage(agencyId, actor);
    const existing = await this.prisma.agencyStaff.findFirst({
      where: { id: subUserId, agencyId, deletedAt: null },
    });
    if (!existing) {
      throw new NotFoundException({
        code: 'SUB_USER_NOT_FOUND',
        message: 'Alt kullanıcı bulunamadı',
      });
    }

    await this.prisma.agencyStaff.update({
      where: { id: existing.id },
      data: {
        deletedAt: new Date(),
        status: 'INACTIVE',
        deletedBy: actor.userId ?? actor.agencyId,
      },
    });

    return {
      success: true,
      data: { id: subUserId, deleted: true },
      error: null,
    };
  }

  private async requireAgency(agencyId: string) {
    const agency = await this.prisma.agency.findFirst({
      where: { id: agencyId, deletedAt: null },
    });
    if (!agency) {
      throw new NotFoundException({
        code: 'AGENCY_NOT_FOUND',
        message: 'Acente bulunamadı',
      });
    }
    return agency;
  }

  private assertCanManage(agencyId: string, actor: ActorContext) {
    if (
      actor.role === 'ADMIN' ||
      actor.role === 'SUPER_ADMIN' ||
      actor.role === 'PLATFORM_ADMIN' ||
      actor.role === 'PLATFORM_SUPER_ADMIN' ||
      actor.role === 'AGENCY_OWNER' ||
      actor.role === 'AGENCY_ADMIN'
    ) {
      if (
        actor.role?.startsWith('AGENCY_') &&
        actor.agencyId &&
        actor.agencyId !== agencyId
      ) {
        throw new ForbiddenException({
          code: 'FORBIDDEN',
          message: 'Bu acenteyi yönetemezsiniz',
        });
      }
      return;
    }
    throw new ForbiddenException({
      code: 'FORBIDDEN',
      message: 'Bu işlem için yetkiniz yok',
    });
  }

  private toShared(row: {
    id: string;
    agencyId: string;
    name: string;
    email: string;
    role: string;
    status: string;
    permissions: Prisma.JsonValue;
  }): SharedSubUser {
    return {
      id: row.id,
      partnerId: row.agencyId,
      name: row.name,
      email: row.email,
      role: row.role,
      status: row.status,
      permissions:
        row.permissions && typeof row.permissions === 'object'
          ? (row.permissions as Record<string, unknown>)
          : {},
    };
  }
}

type ActorContext = {
  userId?: string;
  agencyId?: string;
  role?: string;
};
