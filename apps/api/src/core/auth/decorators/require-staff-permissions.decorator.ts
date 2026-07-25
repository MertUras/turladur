import { SetMetadata } from '@nestjs/common';

export const STAFF_PERMISSIONS_KEY = 'staff_permissions';

/**
 * Require at least one of the given staff permission keys for PARTNER_STAFF.
 * PARTNER / ADMIN / SUPER_ADMIN always pass.
 */
export const RequireStaffPermissions = (...permissions: string[]) =>
  SetMetadata(STAFF_PERMISSIONS_KEY, permissions);
