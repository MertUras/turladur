import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '../../generated/prisma';

import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly prisma: PrismaService) {}

  async record(input: {
    actorType: string;
    actorId?: string | null;
    action: string;
    entityType: string;
    entityId?: string | null;
    meta?: Record<string, unknown> | null;
  }): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          actorType: input.actorType.slice(0, 40),
          actorId: input.actorId ?? null,
          action: input.action.slice(0, 80),
          entityType: input.entityType.slice(0, 80),
          entityId: input.entityId ?? null,
          meta: (input.meta ?? Prisma.JsonNull) as Prisma.InputJsonValue,
        },
      });
    } catch (error) {
      // Audit asla ana akışı bozmaz
      this.logger.warn(
        `AuditLog write failed: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }
}
