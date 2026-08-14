import {
  AGENCY_SELLER_ROLES,
  isAgencySellerRole,
  isAgencyTenantRole,
  isPlatformAdminRole,
  PLATFORM_ADMIN_ROLES,
  resolveActorId,
} from '../role-access';

describe('role-access', () => {
  it('recognizes platform admin roles', () => {
    expect(isPlatformAdminRole('ADMIN')).toBe(true);
    expect(isPlatformAdminRole('PLATFORM_SUPER_ADMIN')).toBe(true);
    expect(isPlatformAdminRole('CUSTOMER')).toBe(false);
    expect(PLATFORM_ADMIN_ROLES.length).toBeGreaterThanOrEqual(4);
  });

  it('recognizes agency tenant and seller roles', () => {
    expect(isAgencyTenantRole('AGENCY_OWNER')).toBe(true);
    expect(isAgencyTenantRole('AGENCY_STAFF')).toBe(true);
    expect(isAgencyTenantRole('CUSTOMER')).toBe(false);
    expect(isAgencySellerRole('AGENCY_ADMIN')).toBe(true);
    expect(isAgencySellerRole('ADMIN')).toBe(true);
    expect(isAgencySellerRole('GUIDE')).toBe(false);
    expect(AGENCY_SELLER_ROLES).toEqual(
      expect.arrayContaining(['AGENCY_OWNER', 'PARTNER', 'PLATFORM_ADMIN']),
    );
  });

  it('resolves soft-delete actor id with staff preference', () => {
    expect(
      resolveActorId({
        userId: 'user-1',
        agencyStaffId: 'staff-1',
      }),
    ).toBe('staff-1');
    expect(resolveActorId({ userId: 'user-1' })).toBe('user-1');
    expect(resolveActorId({ guideId: 'guide-1' })).toBe('guide-1');
  });
});
