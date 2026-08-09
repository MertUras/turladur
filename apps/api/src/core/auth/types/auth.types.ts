import { Role } from '@turta/shared-constants';

export type AuthActorType = 'USER' | 'AGENCY_STAFF' | 'GUIDE' | 'BUS_COMPANY';

export interface JwtPayload {
  sub: string;
  role: Role;
  actorType: AuthActorType;
  agencyId?: string;
  agencyStaffId?: string;
  guideId?: string;
  busCompanyId?: string;
}

/** Class (not interface) so Nest emitDecoratorMetadata works with @CurrentUser() */
export class UserPayload {
  userId!: string;
  role!: Role;
  actorType!: AuthActorType;
  agencyId?: string;
  agencyStaffId?: string;
  guideId?: string;
  busCompanyId?: string;
}

export type SessionActorRef =
  | { actorType: 'USER'; userId: string }
  | { actorType: 'AGENCY_STAFF'; agencyStaffId: string; agencyId: string }
  | { actorType: 'GUIDE'; guideId: string }
  | { actorType: 'BUS_COMPANY'; busCompanyId: string };
