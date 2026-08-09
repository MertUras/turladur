import { UnauthorizedException } from '@nestjs/common';

import { RefreshTokenService } from '../refresh-token.service';

describe('RefreshTokenService', () => {
  const prisma = {
    refreshToken: {
      create: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      findMany: jest.fn(),
    },
    $transaction: jest.fn(async (fn: (tx: typeof prisma) => Promise<unknown>) =>
      fn(prisma),
    ),
  };

  const config = {
    get: jest.fn((key: string, fallback?: string) => {
      if (key === 'AUTH_REFRESH_COOKIE') return 'true';
      if (key === 'REFRESH_TOKEN_TTL_DAYS') return '7';
      return fallback;
    }),
  };

  let service: RefreshTokenService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new RefreshTokenService(prisma as never, config as never);
  });

  it('should hash tokens with sha256', () => {
    const hash = service.hashToken('raw-token');
    expect(hash).toHaveLength(64);
    expect(hash).toBe(service.hashToken('raw-token'));
  });

  it('should issue a refresh row for user actor', async () => {
    prisma.refreshToken.create.mockResolvedValue({
      id: 'rt1',
      familyId: 'fam1',
    });
    const issued = await service.issue({
      actorType: 'USER',
      userId: 'u1',
    });
    expect(issued.rawToken.length).toBeGreaterThan(20);
    expect(prisma.refreshToken.create).toHaveBeenCalled();
    const data = prisma.refreshToken.create.mock.calls[0][0].data;
    expect(data.userId).toBe('u1');
    expect(data.tokenHash).toBe(service.hashToken(issued.rawToken));
  });

  it('should peek without rotating', async () => {
    const raw = 'peek-token';
    const hash = service.hashToken(raw);
    prisma.refreshToken.findFirst.mockResolvedValue({
      id: 'rt-peek',
      tokenHash: hash,
      familyId: 'fam',
      revokedAt: null,
      replacedById: null,
      expiresAt: new Date(Date.now() + 60_000),
      lastUsedAt: new Date(),
      userId: 'u1',
      agencyStaffId: null,
      guideId: null,
      busCompanyId: null,
    });

    const peeked = await service.peek(raw);
    expect(peeked.tokenId).toBe('rt-peek');
    expect(peeked.actor).toEqual({ actorType: 'USER', userId: 'u1' });
    expect(prisma.refreshToken.create).not.toHaveBeenCalled();
  });

  it('should revoke family on refresh reuse', async () => {
    prisma.refreshToken.findFirst.mockResolvedValue({
      id: 'old',
      tokenHash: 'x',
      familyId: 'fam',
      revokedAt: new Date(),
      replacedById: 'newer',
      expiresAt: new Date(Date.now() + 60_000),
      userId: 'u1',
      agencyStaffId: null,
      guideId: null,
      busCompanyId: null,
    });
    prisma.refreshToken.updateMany.mockResolvedValue({ count: 2 });

    await expect(service.rotate('stolen')).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
    expect(prisma.refreshToken.updateMany).toHaveBeenCalled();
  });
});
