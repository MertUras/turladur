import { Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import {
  CreateSubUserInput,
  PartnerSubUser,
  PartnerUsersContext,
  PartnerUsersProvider,
  SubUserPermissions,
  UpdateSubUserInput,
} from './types';

function parsePermissions(value: Prisma.JsonValue): SubUserPermissions {
  const defaults: SubUserPermissions = {
    tours: false,
    reservations: false,
    customers: false,
    reports: false,
  };

  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return defaults;
  }

  const raw = value as Record<string, unknown>;
  return {
    tours: Boolean(raw.tours),
    reservations: Boolean(raw.reservations),
    customers: Boolean(raw.customers),
    reports: Boolean(raw.reports),
  };
}

function mapSubUser(row: {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  permissions: Prisma.JsonValue;
  lastLoginAt: Date | null;
  createdAt: Date;
}): PartnerSubUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    status: row.status,
    permissions: parsePermissions(row.permissions),
    lastLoginAt: row.lastLoginAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
  };
}

export class PrismaPartnerUsersProvider implements PartnerUsersProvider {
  async list(context: PartnerUsersContext): Promise<PartnerSubUser[]> {
    const rows = await prisma.subUser.findMany({
      where: { tourOperatorId: context.tourOperatorId },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map(mapSubUser);
  }

  async create(
    context: PartnerUsersContext,
    input: CreateSubUserInput
  ): Promise<PartnerSubUser> {
    const existing = await prisma.subUser.findFirst({
      where: {
        tourOperatorId: context.tourOperatorId,
        email: input.email,
      },
    });

    if (existing) {
      throw new Error('Bu email adresi zaten kullanımda');
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);
    const row = await prisma.subUser.create({
      data: {
        tourOperatorId: context.tourOperatorId,
        name: input.name,
        email: input.email,
        password: hashedPassword,
        role: input.role,
        permissions: input.permissions,
      },
    });

    return mapSubUser(row);
  }

  async update(
    context: PartnerUsersContext,
    input: UpdateSubUserInput
  ): Promise<PartnerSubUser> {
    const data: Prisma.SubUserUpdateInput = {
      name: input.name,
      email: input.email,
      role: input.role,
      permissions: input.permissions,
    };

    if (input.status) {
      data.status = input.status;
    }

    if (input.password) {
      data.password = await bcrypt.hash(input.password, 10);
    }

    const row = await prisma.subUser.update({
      where: {
        id: input.id,
        tourOperatorId: context.tourOperatorId,
      },
      data,
    });

    return mapSubUser(row);
  }

  async delete(context: PartnerUsersContext, id: string): Promise<void> {
    await prisma.subUser.delete({
      where: {
        id,
        tourOperatorId: context.tourOperatorId,
      },
    });
  }
}

export const prismaPartnerUsersProvider = new PrismaPartnerUsersProvider();
