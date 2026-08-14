import { AgencyLinkService } from '../agency-link.service';

describe('AgencyLinkService', () => {
  const prisma = {
    agency: { findFirst: jest.fn() },
  };

  let service: AgencyLinkService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AgencyLinkService(prisma as never);
  });

  it('should allow agencyId ownership', () => {
    expect(
      service.isSellerOwner(
        { agencyId: 'a1' },
        { agencyId: 'a1', role: 'AGENCY_OWNER' },
      ),
    ).toBe(true);

    expect(
      service.isSellerOwner(
        { agencyId: 'a1' },
        { agencyId: 'other', role: 'AGENCY_OWNER' },
      ),
    ).toBe(false);

    expect(
      service.isSellerOwner({ agencyId: 'a1' }, { role: 'PLATFORM_ADMIN' }),
    ).toBe(true);
  });

  it('should deny customer claiming seller ownership via agencyId spoof', () => {
    expect(
      service.isSellerOwner(
        { agencyId: 'a1' },
        { agencyId: 'a1', role: 'CUSTOMER' },
      ),
    ).toBe(false);
  });

  it('should resolve agencyId from actor', async () => {
    await expect(
      service.resolveAgencyIdForActor({
        agencyId: 'a1',
        role: 'AGENCY_OWNER',
      }),
    ).resolves.toBe('a1');
  });
});
