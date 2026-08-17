import { describe, expect, it } from 'vitest';

import {
  isProductAnalyticsEnabled,
  sanitizeAnalyticsProperties,
} from '../product-analytics';

describe('product analytics', () => {
  it('is disabled without a key or window', () => {
    expect(isProductAnalyticsEnabled('', true)).toBe(false);
    expect(isProductAnalyticsEnabled('phc_test', false)).toBe(false);
    expect(isProductAnalyticsEnabled('phc_test', true)).toBe(true);
  });

  it('keeps anonymous funnel fields', () => {
    expect(
      sanitizeAnalyticsProperties({
        path: '/tours',
        tour_id: 'abc',
        role: 'CUSTOMER',
        method: 'card',
      }),
    ).toEqual({
      path: '/tours',
      tour_id: 'abc',
      role: 'CUSTOMER',
      method: 'card',
    });
  });

  it('drops undefined and PII / payment keys', () => {
    expect(
      sanitizeAnalyticsProperties({
        path: '/checkout',
        email: 'a@b.com',
        phone: '555',
        password: 'x',
        otp: '123456',
        cardNumber: '4111',
        cvc: '123',
        firstName: 'Ada',
        lastName: 'Lovelace',
        address: 'street',
        tckn: '10000000146',
        skip: undefined,
        item_type: 'tour',
      }),
    ).toEqual({
      path: '/checkout',
      item_type: 'tour',
    });
  });
});
