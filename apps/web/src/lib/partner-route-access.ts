import type { StaffPermissionKey } from '@turta/shared-types';

/**
 * Maps partner dashboard routes to staff permission keys.
 * `null` = any authenticated partner/staff may access.
 * `owner` = only PARTNER / ADMIN (not PARTNER_STAFF).
 */
export type PartnerRouteAccess = StaffPermissionKey | 'owner' | null;

export type PartnerNavPermission = PartnerRouteAccess;

export function resolvePartnerRouteAccess(
  pathname: string,
): PartnerRouteAccess {
  const path = pathname.split('?')[0] || pathname;

  if (path.startsWith('/partner/tours')) return 'tours';
  if (path.startsWith('/partner/experiences')) return 'tours';
  if (path.startsWith('/partner/reservations')) return 'reservations';
  if (path.startsWith('/partner/customers')) return 'customers';
  if (path.startsWith('/partner/financials')) return 'reports';
  if (path.startsWith('/partner/reports')) return 'reports';
  if (path.startsWith('/partner/reviews')) return 'customers';
  if (path.startsWith('/partner/users')) return 'owner';
  if (path.startsWith('/partner/settings')) return 'owner';
  // dashboard, help, and unknown partner roots
  return null;
}
