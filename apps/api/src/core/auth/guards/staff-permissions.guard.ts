import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@turta/shared-constants';

import { PrismaService } from '../../database/prisma.service';
import { STAFF_PERMISSIONS_KEY } from '../decorators/require-staff-permissions.decorator';
import { UserPayload } from '../types/auth.types';

function isPermissionGranted(permissions: unknown, key: string): boolean {
  if (
    !permissions ||
    typeof permissions !== 'object' ||
    Array.isArray(permissions)
  ) {
    return false;
  }
  const value = (permissions as Record<string, unknown>)[key];
  if (value === true) return true;
  if (Array.isArray(value) && value.length > 0) return true;
  return false;
}

@Injectable()
export class StaffPermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<string[]>(
      STAFF_PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!required || required.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user?: UserPayload }>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException({
        code: 'FORBIDDEN',
        message: 'Bu işlem için yetkiniz yok.',
      });
    }

    if (
      user.role === Role.PARTNER ||
      user.role === Role.ADMIN ||
      user.role === Role.SUPER_ADMIN
    ) {
      return true;
    }

    if (user.role !== Role.PARTNER_STAFF) {
      throw new ForbiddenException({
        code: 'FORBIDDEN',
        message: 'Bu işlem için yetkiniz yok.',
      });
    }

    const dbUser = await this.prisma.user.findFirst({
      where: { id: user.userId, deletedAt: null },
      select: { permissions: true, isActive: true },
    });

    if (!dbUser?.isActive) {
      throw new ForbiddenException({
        code: 'FORBIDDEN',
        message: 'Bu işlem için yetkiniz yok.',
      });
    }

    const allowed = required.some((key) =>
      isPermissionGranted(dbUser.permissions, key),
    );

    if (!allowed) {
      throw new ForbiddenException({
        code: 'FORBIDDEN',
        message: 'Bu işlem için yetkiniz yok.',
      });
    }

    return true;
  }
}
