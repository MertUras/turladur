import { createHash } from 'crypto';
import { Injectable } from '@nestjs/common';
import { Prisma } from '../../generated/prisma';

import { PrismaService } from '../database/prisma.service';

const IDEMPOTENCY_TTL_MS = 24 * 60 * 60 * 1000;

export const IDEMPOTENCY_PROTECTED_PATHS = [
  '/api/v1/payment/checkout',
  '/api/v1/payment/refund',
  '/api/v1/booking/reservations',
] as const;

@Injectable()
export class IdempotencyService {
  constructor(private readonly prisma: PrismaService) {}

  isProtectedPath(path: string): boolean {
    const normalized = path.split('?')[0].replace(/\/$/, '') || '/';
    return IDEMPOTENCY_PROTECTED_PATHS.some(
      (protectedPath) =>
        normalized === protectedPath || normalized.endsWith(protectedPath),
    );
  }

  hashRequest(body: unknown): string {
    const payload = JSON.stringify(body ?? {});
    return createHash('sha256').update(payload).digest('hex');
  }

  async findActive(key: string) {
    return this.prisma.idempotencyKey.findFirst({
      where: {
        key,
        deletedAt: null,
        expiresAt: { gt: new Date() },
      },
    });
  }

  async begin(input: {
    key: string;
    userId?: string;
    method: string;
    path: string;
    requestHash: string;
  }) {
    return this.prisma.idempotencyKey.create({
      data: {
        key: input.key,
        userId: input.userId ?? null,
        method: input.method.slice(0, 16),
        path: input.path.slice(0, 256),
        requestHash: input.requestHash,
        expiresAt: new Date(Date.now() + IDEMPOTENCY_TTL_MS),
      },
    });
  }

  async complete(
    id: string,
    responseStatus: number,
    responseBody: Prisma.InputJsonValue,
  ) {
    return this.prisma.idempotencyKey.update({
      where: { id },
      data: {
        responseStatus,
        responseBody,
      },
    });
  }

  async fail(id: string) {
    return this.prisma.idempotencyKey.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
