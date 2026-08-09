import { createHash, randomBytes, randomUUID } from 'crypto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PrismaService } from '../../database/prisma.service';
import type { SessionActorRef } from '../types/auth.types';

const DEFAULT_REFRESH_TTL_DAYS = 7;

export type IssuedRefresh = {
  rawToken: string;
  tokenId: string;
  familyId: string;
  expiresAt: Date;
};

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  isEnabled(): boolean {
    const flag = (
      this.config.get<string>('AUTH_REFRESH_COOKIE') ?? 'true'
    ).toLowerCase();
    return flag !== 'false' && flag !== '0' && flag !== 'off';
  }

  hashToken(rawToken: string): string {
    return createHash('sha256').update(rawToken).digest('hex');
  }

  private ttlMs(): number {
    const days = Number(
      this.config.get<string>('REFRESH_TOKEN_TTL_DAYS') ??
        DEFAULT_REFRESH_TTL_DAYS,
    );
    const safeDays =
      Number.isFinite(days) && days > 0 ? days : DEFAULT_REFRESH_TTL_DAYS;
    return safeDays * 24 * 60 * 60 * 1000;
  }

  async issue(actor: SessionActorRef): Promise<IssuedRefresh> {
    const rawToken = randomBytes(48).toString('base64url');
    const tokenHash = this.hashToken(rawToken);
    const familyId = randomUUID();
    const expiresAt = new Date(Date.now() + this.ttlMs());

    const created = await this.prisma.refreshToken.create({
      data: {
        tokenHash,
        familyId,
        expiresAt,
        lastUsedAt: new Date(),
        ...this.actorData(actor),
      },
    });

    return {
      rawToken,
      tokenId: created.id,
      familyId,
      expiresAt,
    };
  }

  async peek(rawToken: string): Promise<{
    actor: SessionActorRef;
    tokenId: string;
    expiresAt: Date;
  }> {
    const tokenHash = this.hashToken(rawToken);
    const existing = await this.prisma.refreshToken.findFirst({
      where: { tokenHash, deletedAt: null },
      include: {
        agencyStaff: { select: { agencyId: true } },
      },
    });

    if (!existing || existing.revokedAt || existing.replacedById) {
      throw new UnauthorizedException({
        code: 'REFRESH_INVALID',
        message: 'Oturum geçersiz veya süresi dolmuş',
      });
    }

    if (existing.expiresAt.getTime() <= Date.now()) {
      throw new UnauthorizedException({
        code: 'REFRESH_EXPIRED',
        message: 'Oturum süresi dolmuş — tekrar giriş yapın',
      });
    }

    // Soft touch — middleware probe spam’inde DB yazmayı sınırla (60s)
    const lastUsed = existing.lastUsedAt?.getTime() ?? 0;
    if (Date.now() - lastUsed > 60_000) {
      await this.prisma.refreshToken.update({
        where: { id: existing.id },
        data: { lastUsedAt: new Date() },
      });
    }

    return {
      actor: this.toActor(existing),
      tokenId: existing.id,
      expiresAt: existing.expiresAt,
    };
  }

  /**
   * Rotate: revoke current, issue replacement in same family.
   * Reuse of an already-rotated token → revoke entire family (theft signal).
   */
  async rotate(rawToken: string): Promise<{
    issued: IssuedRefresh;
    actor: SessionActorRef;
  }> {
    const tokenHash = this.hashToken(rawToken);
    const existing = await this.prisma.refreshToken.findFirst({
      where: { tokenHash, deletedAt: null },
      include: {
        agencyStaff: { select: { agencyId: true } },
      },
    });

    if (!existing) {
      throw new UnauthorizedException({
        code: 'REFRESH_INVALID',
        message: 'Oturum geçersiz veya süresi dolmuş',
      });
    }

    if (existing.revokedAt || existing.replacedById) {
      if (existing.familyId) {
        await this.revokeFamily(existing.familyId);
      }
      throw new UnauthorizedException({
        code: 'REFRESH_REUSE',
        message: 'Oturum güvenlik nedeniyle sonlandırıldı — tekrar giriş yapın',
      });
    }

    if (existing.expiresAt.getTime() <= Date.now()) {
      await this.prisma.refreshToken.update({
        where: { id: existing.id },
        data: { revokedAt: new Date(), deletedAt: new Date() },
      });
      throw new UnauthorizedException({
        code: 'REFRESH_EXPIRED',
        message: 'Oturum süresi dolmuş — tekrar giriş yapın',
      });
    }

    const actor = this.toActor(existing);
    const rawReplacement = randomBytes(48).toString('base64url');
    const replacementHash = this.hashToken(rawReplacement);
    const expiresAt = new Date(Date.now() + this.ttlMs());

    const replacement = await this.prisma.$transaction(async (tx) => {
      const created = await tx.refreshToken.create({
        data: {
          tokenHash: replacementHash,
          familyId: existing.familyId ?? existing.id,
          expiresAt,
          lastUsedAt: new Date(),
          ...this.actorData(actor),
        },
      });
      await tx.refreshToken.update({
        where: { id: existing.id },
        data: {
          revokedAt: new Date(),
          replacedById: created.id,
          lastUsedAt: new Date(),
        },
      });
      return created;
    });

    return {
      actor,
      issued: {
        rawToken: rawReplacement,
        tokenId: replacement.id,
        familyId: replacement.familyId ?? existing.familyId ?? existing.id,
        expiresAt,
      },
    };
  }

  async revokeRaw(rawToken: string): Promise<void> {
    const tokenHash = this.hashToken(rawToken);
    const existing = await this.prisma.refreshToken.findFirst({
      where: { tokenHash, deletedAt: null },
    });
    if (!existing) return;
    await this.prisma.refreshToken.update({
      where: { id: existing.id },
      data: { revokedAt: new Date(), deletedAt: new Date() },
    });
  }

  async revokeFamily(familyId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { familyId, deletedAt: null, revokedAt: null },
      data: { revokedAt: new Date(), deletedAt: new Date() },
    });
  }

  async revokeAllForActor(actor: SessionActorRef): Promise<number> {
    const result = await this.prisma.refreshToken.updateMany({
      where: {
        deletedAt: null,
        revokedAt: null,
        ...this.actorWhere(actor),
      },
      data: { revokedAt: new Date(), deletedAt: new Date() },
    });
    return result.count;
  }

  async listSessions(actor: SessionActorRef) {
    const rows = await this.prisma.refreshToken.findMany({
      where: {
        deletedAt: null,
        revokedAt: null,
        expiresAt: { gt: new Date() },
        ...this.actorWhere(actor),
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        familyId: true,
        createdAt: true,
        lastUsedAt: true,
        expiresAt: true,
      },
    });
    return rows;
  }

  async revokeSession(
    sessionId: string,
    actor: SessionActorRef,
  ): Promise<void> {
    const row = await this.prisma.refreshToken.findFirst({
      where: {
        id: sessionId,
        deletedAt: null,
        ...this.actorWhere(actor),
      },
    });
    if (!row) {
      throw new UnauthorizedException({
        code: 'SESSION_NOT_FOUND',
        message: 'Oturum bulunamadı',
      });
    }
    if (row.familyId) {
      await this.revokeFamily(row.familyId);
    } else {
      await this.prisma.refreshToken.update({
        where: { id: row.id },
        data: { revokedAt: new Date(), deletedAt: new Date() },
      });
    }
  }

  private actorData(actor: SessionActorRef) {
    switch (actor.actorType) {
      case 'USER':
        return { userId: actor.userId };
      case 'AGENCY_STAFF':
        return { agencyStaffId: actor.agencyStaffId };
      case 'GUIDE':
        return { guideId: actor.guideId };
      case 'BUS_COMPANY':
        return { busCompanyId: actor.busCompanyId };
    }
  }

  private actorWhere(actor: SessionActorRef) {
    switch (actor.actorType) {
      case 'USER':
        return { userId: actor.userId };
      case 'AGENCY_STAFF':
        return { agencyStaffId: actor.agencyStaffId };
      case 'GUIDE':
        return { guideId: actor.guideId };
      case 'BUS_COMPANY':
        return { busCompanyId: actor.busCompanyId };
    }
  }

  private toActor(row: {
    userId: string | null;
    agencyStaffId: string | null;
    guideId: string | null;
    busCompanyId: string | null;
    agencyStaff?: { agencyId: string } | null;
  }): SessionActorRef {
    if (row.userId) {
      return { actorType: 'USER', userId: row.userId };
    }
    if (row.agencyStaffId) {
      const agencyId = row.agencyStaff?.agencyId;
      if (!agencyId) {
        throw new UnauthorizedException({
          code: 'REFRESH_INVALID',
          message: 'Acente oturumu geçersiz',
        });
      }
      return {
        actorType: 'AGENCY_STAFF',
        agencyStaffId: row.agencyStaffId,
        agencyId,
      };
    }
    if (row.guideId) {
      return { actorType: 'GUIDE', guideId: row.guideId };
    }
    if (row.busCompanyId) {
      return { actorType: 'BUS_COMPANY', busCompanyId: row.busCompanyId };
    }
    throw new UnauthorizedException({
      code: 'REFRESH_INVALID',
      message: 'Oturum aktörü geçersiz',
    });
  }
}
