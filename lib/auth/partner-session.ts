import type { Session } from 'next-auth';

const PARTNER_ROLES = new Set(['TOUR_OPERATOR', 'EXPERIENCE_PROVIDER']);

export function isPartnerRole(role: string | undefined | null): boolean {
  return !!role && PARTNER_ROLES.has(role);
}

export function isPartnerSession(session: Session | null | undefined): boolean {
  if (!session?.user) return false;
  if (session.user.provider === 'partner-credentials') return true;
  return isPartnerRole(session.user.role);
}

export function isCustomerSession(session: Session | null | undefined): boolean {
  if (!session?.user) return false;
  return session.user.provider === 'credentials';
}
