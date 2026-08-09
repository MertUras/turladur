import { IdempotencyService } from '../idempotency.service';

describe('IdempotencyService', () => {
  const prisma = {
    idempotencyKey: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  let service: IdempotencyService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new IdempotencyService(prisma as never);
  });

  it('should match protected checkout/refund/reservation paths', () => {
    expect(service.isProtectedPath('/api/v1/payment/checkout')).toBe(true);
    expect(service.isProtectedPath('/api/v1/payment/refund')).toBe(true);
    expect(service.isProtectedPath('/api/v1/booking/reservations')).toBe(true);
    expect(service.isProtectedPath('/api/v1/catalog/tours')).toBe(false);
  });

  it('should hash request body stably', () => {
    const a = service.hashRequest({ amount: 100, currency: 'TRY' });
    const b = service.hashRequest({ amount: 100, currency: 'TRY' });
    const c = service.hashRequest({ amount: 101, currency: 'TRY' });
    expect(a).toBe(b);
    expect(a).not.toBe(c);
    expect(a).toHaveLength(64);
  });

  it('should begin with 24h TTL', async () => {
    prisma.idempotencyKey.create.mockResolvedValue({ id: 'ik1' });
    const before = Date.now();
    await service.begin({
      key: 'test-key-01',
      method: 'POST',
      path: '/api/v1/payment/checkout',
      requestHash: 'abc',
      userId: 'u1',
    });
    const call = prisma.idempotencyKey.create.mock.calls[0][0];
    const expiresAt = call.data.expiresAt as Date;
    expect(expiresAt.getTime()).toBeGreaterThanOrEqual(
      before + 23 * 60 * 60 * 1000,
    );
    expect(expiresAt.getTime()).toBeLessThanOrEqual(
      Date.now() + 25 * 60 * 60 * 1000,
    );
  });
});
