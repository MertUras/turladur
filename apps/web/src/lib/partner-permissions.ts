import type { StaffPermissionKey, StaffPermissions } from '@turta/shared-types';

export function normalizeStaffPermissions(
  raw: unknown,
): StaffPermissions | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return null;
  }
  return raw as StaffPermissions;
}

export function isStaffPermissionGranted(
  permissions: StaffPermissions | null | undefined,
  key: StaffPermissionKey,
): boolean {
  if (!permissions) return false;
  const value = permissions[key];
  if (value === true) return true;
  if (Array.isArray(value) && value.length > 0) return true;
  return false;
}

/** Partner owner / platform admins bypass staff permission checks. */
export function hasFullPartnerAccess(role: string | undefined | null): boolean {
  return role === 'PARTNER' || role === 'ADMIN' || role === 'SUPER_ADMIN';
}

export function canAccessStaffPermission(
  role: string | undefined | null,
  permissions: StaffPermissions | null | undefined,
  key: StaffPermissionKey,
): boolean {
  if (hasFullPartnerAccess(role)) return true;
  if (role !== 'PARTNER_STAFF') return false;
  return isStaffPermissionGranted(permissions, key);
}
