/**
 * P0-A hard contract: Agency ownership only (Partner table DROPPED).
 */
import { ForbiddenException, Injectable, Logger } from '@nestjs/common';

import {
  isAgencyTenantRole,
  isPlatformAdminRole,
} from '../auth/utils/role-access';
import { PrismaService } from '../database/prisma.service';

export type SellerActor = {
  agencyId?: string | null;
  role: string;
};

@Injectable()
export class AgencyLinkService {
  private readonly logger = new Logger(AgencyLinkService.name);

  constructor(private readonly prisma: PrismaService) {}

  isPlatformAdmin(role: string): boolean {
    return isPlatformAdminRole(role);
  }

  isSellerOwner(
    resource: { agencyId?: string | null },
    actor: SellerActor,
  ): boolean {
    if (this.isPlatformAdmin(actor.role)) return true;
    if (
      isAgencyTenantRole(actor.role) &&
      actor.agencyId &&
      resource.agencyId &&
      resource.agencyId === actor.agencyId
    ) {
      return true;
    }
    return false;
  }

  assertSellerOwner(
    resource: { agencyId?: string | null },
    actor: SellerActor,
    message = 'Bu kaynağa erişim yetkiniz yok',
  ): void {
    if (!this.isSellerOwner(resource, actor)) {
      throw new ForbiddenException({
        code: 'FORBIDDEN',
        message,
      });
    }
  }

  async resolveAgencyIdForActor(actor: {
    agencyId?: string | null;
    role: string;
  }): Promise<string | undefined> {
    if (actor.agencyId) return actor.agencyId;
    return undefined;
  }

  /** @deprecated alias — Partner DROPPED */
  async resolvePartnerIdForActor(actor: {
    agencyId?: string | null;
    role: string;
  }): Promise<string | undefined> {
    return this.resolveAgencyIdForActor(actor);
  }

  async assertAgencyAccessForPartner(
    agencyId: string,
    role: string,
    actorAgencyId?: string | null,
  ): Promise<void> {
    if (this.isPlatformAdmin(role)) return;
    if (actorAgencyId && actorAgencyId === agencyId) return;
    throw new ForbiddenException({
      code: 'FORBIDDEN',
      message: 'Bu acenteye erişim yetkiniz yok',
    });
  }

  async backfillAgencyIds(): Promise<{
    partnersLinked: number;
    tours: number;
    hotels: number;
    reservations: number;
    reviews: number;
  }> {
    this.logger.log('P0-A: backfillAgencyIds no-op (Partner dropped)');
    return {
      partnersLinked: 0,
      tours: 0,
      hotels: 0,
      reservations: 0,
      reviews: 0,
    };
  }
}
