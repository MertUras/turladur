/** Minimal Decimal-like value for Prisma mock rows. */
export function decimal(value: string | number) {
  return {
    toString: () => String(value),
    mul: (n: number) => decimal(Number(value) * n),
  };
}

export function createPrismaMock() {
  const prisma: Record<string, unknown> = {
    $transaction: jest.fn(async (arg: unknown) => {
      if (typeof arg === 'function') {
        return (arg as (tx: typeof prisma) => Promise<unknown>)(prisma);
      }
      return Promise.all(arg as Promise<unknown>[]);
    }),
  };

  const models = [
    'user',
    'hotel',
    'room',
    'experience',
    'activityDate',
    'tour',
    'tourDate',
    'tourDateAgeRange',
    'experienceDateAgeRange',
    'tourAccommodation',
    'tourPickupPoint',
    'reservation',
    'partner',
    'agency',
    'post',
    'category',
    'comment',
    'subUser',
  ];

  for (const model of models) {
    prisma[model] = {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      upsert: jest.fn(),
      delete: jest.fn(),
      aggregate: jest.fn(),
    };
  }

  return prisma;
}

export function createCacheMock() {
  return {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue(undefined),
    del: jest.fn().mockResolvedValue(undefined),
    invalidatePattern: jest.fn().mockResolvedValue(undefined),
  };
}
