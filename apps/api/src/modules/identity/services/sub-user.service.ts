import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { SubUser as SharedSubUser } from '@turta/shared-types';
import * as bcrypt from 'bcrypt';
import { Prisma, UserRole } from '../../../generated/prisma';

import { PrismaService } from '../../../core/database/prisma.service';
import { BusinessException } from '../../../shared/exceptions/business.exception';
import { CreateSubUserDto, UpdateSubUserDto } from '../dto/sub-user.dto';

const BCRYPT_ROUNDS = 12;

/**
 * Partner alt kullanıcı = ayrı auth hesabı (PARTNER_STAFF).
 * Tek e-posta = tek rol: mevcut CUSTOMER hesabı staff'a çevrilmez.
 */
@Injectable()
export class SubUserService {
  constructor(private readonly prisma: PrismaService) {}

  async list(partnerId: string, actor: ActorContext) {
    this.assertCanManage(partnerId, actor);

    const rows = await this.prisma.subUser.findMany({
      where: { partnerId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      data: rows.map((r) => this.toShared(r)),
      error: null,
    };
  }

  async create(partnerId: string, dto: CreateSubUserDto, actor: ActorContext) {
    this.assertCanManage(partnerId, actor);
    await this.requirePartner(partnerId);

    const email = dto.email.toLowerCase().trim();
    const existing = await this.prisma.subUser.findFirst({
      where: { partnerId, email, deletedAt: null },
    });
    if (existing) {
      throw new BusinessException(
        'SUB_USER_EMAIL_EXISTS',
        'Bu email adresi zaten kullanımda',
      );
    }

    const permissions = (dto.permissions ??
      {}) as unknown as Prisma.InputJsonValue;
    const staffRole = dto.role?.trim() || 'USER';

    const authUser = await this.createStaffAuthUser({
      partnerId,
      email,
      name: dto.name.trim(),
      permissions,
      password: dto.password,
    });

    const row = await this.prisma.subUser.create({
      data: {
        partnerId,
        userId: authUser.id,
        name: dto.name.trim(),
        email,
        role: staffRole,
        permissions,
        status: 'ACTIVE',
      },
    });

    return { success: true, data: this.toShared(row), error: null };
  }

  async update(
    partnerId: string,
    subUserId: string,
    dto: UpdateSubUserDto,
    actor: ActorContext,
  ) {
    this.assertCanManage(partnerId, actor);
    const existing = await this.prisma.subUser.findFirst({
      where: { id: subUserId, partnerId, deletedAt: null },
    });
    if (!existing) {
      throw new NotFoundException({
        code: 'SUB_USER_NOT_FOUND',
        message: 'Alt kullanıcı bulunamadı',
      });
    }

    const data: Prisma.SubUserUpdateInput = {};
    if (dto.name !== undefined) data.name = dto.name.trim();
    if (dto.role !== undefined) data.role = dto.role.trim();
    if (dto.status !== undefined) data.status = dto.status.trim();
    if (dto.permissions !== undefined) {
      data.permissions = dto.permissions as unknown as Prisma.InputJsonValue;
    }

    const updated = await this.prisma.subUser.update({
      where: { id: existing.id },
      data,
    });

    await this.syncStaffAuthUser(updated);

    return { success: true, data: this.toShared(updated), error: null };
  }

  async softDelete(partnerId: string, subUserId: string, actor: ActorContext) {
    this.assertCanManage(partnerId, actor);
    const existing = await this.prisma.subUser.findFirst({
      where: { id: subUserId, partnerId, deletedAt: null },
    });
    if (!existing) {
      throw new NotFoundException({
        code: 'SUB_USER_NOT_FOUND',
        message: 'Alt kullanıcı bulunamadı',
      });
    }

    await this.prisma.subUser.update({
      where: { id: existing.id },
      data: { deletedAt: new Date(), status: 'INACTIVE' },
    });

    if (existing.userId) {
      const user = await this.prisma.user.findFirst({
        where: { id: existing.userId, deletedAt: null },
      });
      // Staff erişimini kaldır; hesap müşteri olarak kalabilir.
      if (user && user.role === UserRole.PARTNER_STAFF) {
        await this.prisma.user.update({
          where: { id: user.id },
          data: {
            role: UserRole.CUSTOMER,
            partnerId: null,
            permissions: Prisma.JsonNull,
          },
        });
      }
    }

    return {
      success: true,
      data: { id: subUserId, deleted: true },
      error: null,
    };
  }

  private async createStaffAuthUser(input: {
    partnerId: string;
    email: string;
    name: string;
    permissions: Prisma.InputJsonValue;
    password?: string;
  }) {
    const existing = await this.prisma.user.findFirst({
      where: { email: input.email, deletedAt: null },
    });

    if (existing) {
      if (existing.role === UserRole.CUSTOMER) {
        throw new BusinessException(
          'SUB_USER_CUSTOMER_EMAIL',
          'Bu e-posta müşteri hesabı. Staff için farklı bir e-posta kullanın (tek e-posta = tek rol).',
        );
      }
      if (
        existing.role === UserRole.ADMIN ||
        existing.role === UserRole.SUPER_ADMIN
      ) {
        throw new BusinessException(
          'SUB_USER_ROLE_FORBIDDEN',
          'Admin hesabı partner alt kullanıcısı yapılamaz',
        );
      }
      if (
        existing.role === UserRole.PARTNER ||
        (existing.role === UserRole.PARTNER_STAFF &&
          existing.partnerId &&
          existing.partnerId !== input.partnerId)
      ) {
        throw new BusinessException(
          'SUB_USER_OTHER_PARTNER',
          'Bu e-posta başka bir partner hesabına ait',
        );
      }
      if (
        existing.role === UserRole.PARTNER_STAFF &&
        existing.partnerId === input.partnerId
      ) {
        return existing;
      }
      throw new BusinessException(
        'SUB_USER_EMAIL_IN_USE',
        'Bu e-posta zaten kullanımda',
      );
    }

    if (!input.password || input.password.length < 8) {
      throw new BusinessException(
        'SUB_USER_PASSWORD_REQUIRED',
        'Yeni staff hesabı için en az 8 karakterlik şifre girin',
      );
    }

    const nameParts = input.name.split(/\s+/);
    const firstName = nameParts[0] ?? input.name;
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : null;

    return this.prisma.user.create({
      data: {
        email: input.email,
        passwordHash: await bcrypt.hash(input.password, BCRYPT_ROUNDS),
        firstName,
        lastName,
        role: UserRole.PARTNER_STAFF,
        partnerId: input.partnerId,
        permissions: input.permissions,
      },
    });
  }

  private async syncStaffAuthUser(sub: {
    userId: string | null;
    partnerId: string;
    status: string;
    permissions: Prisma.JsonValue;
  }) {
    if (!sub.userId) return;
    const user = await this.prisma.user.findFirst({
      where: { id: sub.userId, deletedAt: null },
    });
    if (!user || user.role !== UserRole.PARTNER_STAFF) return;

    if (sub.status !== 'ACTIVE') {
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          isActive: false,
          permissions: Prisma.JsonNull,
        },
      });
      return;
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isActive: true,
        partnerId: sub.partnerId,
        permissions: (sub.permissions ??
          {}) as unknown as Prisma.InputJsonValue,
      },
    });
  }

  private assertCanManage(partnerId: string, actor: ActorContext) {
    const isAdmin = actor.role === 'ADMIN' || actor.role === 'SUPER_ADMIN';
    if (isAdmin) return;
    if (actor.role === 'PARTNER' && actor.partnerId === partnerId) {
      return;
    }
    throw new ForbiddenException({
      code: 'FORBIDDEN',
      message: 'Bu partner kullanıcılarını yönetemezsiniz',
    });
  }

  private async requirePartner(partnerId: string) {
    const partner = await this.prisma.partner.findFirst({
      where: { id: partnerId, deletedAt: null },
    });
    if (!partner) {
      throw new NotFoundException({
        code: 'PARTNER_NOT_FOUND',
        message: 'Partner bulunamadı',
      });
    }
    return partner;
  }

  private toShared(row: {
    id: string;
    partnerId: string;
    name: string;
    email: string;
    role: string;
    status: string;
    permissions: Prisma.JsonValue;
  }): SharedSubUser {
    return {
      id: row.id,
      partnerId: row.partnerId,
      name: row.name,
      email: row.email,
      role: row.role,
      status: row.status,
      permissions: (row.permissions ?? {}) as Record<string, unknown>,
    };
  }
}

type ActorContext = {
  userId: string;
  role: string;
  partnerId?: string;
};
