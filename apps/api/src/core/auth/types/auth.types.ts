import { Role } from '@turta/shared-constants';

export interface JwtPayload {
  sub: string;
  role: Role;
  partnerId?: string;
}

/** Class (not interface) so Nest emitDecoratorMetadata works with @CurrentUser() */
export class UserPayload {
  userId!: string;
  role!: Role;
  partnerId?: string;
}
