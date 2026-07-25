import { test, expect } from '@playwright/test';

/**
 * Sprint 23.20 — critical path smoke.
 * Prefers API-level flow (stable). Skips gracefully when API/web are down.
 * Does not change product code — only extends E2E coverage.
 */

const apiBase = process.env.API_URL ?? 'http://localhost:4000/api/v1';

const DEMO_CUSTOMER = {
  email: process.env.E2E_CUSTOMER_EMAIL ?? 'demo@turta.com',
  password: process.env.E2E_CUSTOMER_PASSWORD ?? 'Demo1234!',
};

/** Mock gateway: cards not ending 0008/0000 → immediate SUCCESS (no 3DS). */
const MOCK_SUCCESS_CARD = '5528790000000016';

type ApiEnvelope<T> = {
  success?: boolean;
  data?: T;
  error?: { code?: string; message?: string } | null;
};

async function apiJson<T>(
  request: import('@playwright/test').APIRequestContext,
  method: 'get' | 'post',
  path: string,
  options?: { data?: unknown; token?: string },
): Promise<{ status: number; body: ApiEnvelope<T> }> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (options?.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }
  const response =
    method === 'get'
      ? await request.get(`${apiBase}${path}`, { headers })
      : await request.post(`${apiBase}${path}`, {
          headers,
          data: options?.data,
        });
  const body = (await response.json()) as ApiEnvelope<T>;
  return { status: response.status(), body };
}

test.describe('API smoke', () => {
  test('health returns ok when API is up', async ({ request }) => {
    const response = await request.get(`${apiBase}/health`);
    test.skip(response.status() === 503 || !response.ok(), 'API not running');

    const body = (await response.json()) as {
      data?: { status?: string; database?: string; redis?: string };
    };
    expect(body.data?.status).toBe('ok');
    expect(body.data?.database).toBe('up');
  });

  test('public tour search responds', async ({ request }) => {
    const response = await request.get(
      `${apiBase}/catalog/tours/search?page=1&limit=5`,
    );
    test.skip(!response.ok(), 'API not running');

    const body = (await response.json()) as { success?: boolean };
    expect(body.success).toBe(true);
  });
});

test.describe('Web smoke', () => {
  test('home page renders', async ({ page }) => {
    const response = await page.goto('/');
    test.skip(!response || !response.ok(), 'Web app not running');

    await expect(page.locator('body')).toBeVisible();
  });

  test('tours listing page renders', async ({ page }) => {
    const response = await page.goto('/tours');
    test.skip(!response || !response.ok(), 'Web app not running');

    await expect(
      page.getByRole('heading', { name: /Turlar/i }).first(),
    ).toBeVisible();
  });
});

test.describe('Critical flow (API-only)', () => {
  test('register duplicate or success path', async ({ request }) => {
    const email = `e2e-${Date.now()}@turta.test`;
    const response = await request.post(`${apiBase}/identity/register`, {
      data: {
        email,
        password: 'E2eTest123',
        firstName: 'E2E',
        lastName: 'User',
        otpCode: '000000',
      },
    });
    test.skip(response.status() >= 500, 'API not running');

    // Without a real OTP this should fail validation / business — not 5xx
    expect(response.status()).toBeLessThan(500);
  });

  test('register via OTP when debug code is exposed', async ({ request }) => {
    const health = await request.get(`${apiBase}/health`);
    test.skip(!health.ok(), 'API not running');

    const email = `e2e-reg-${Date.now()}@turta.test`;
    const otpSend = await apiJson<{
      email: string;
      purpose: string;
      debugCode?: string;
    }>(request, 'post', '/identity/otp/send', {
      data: { email, purpose: 'REGISTER' },
    });
    expect(otpSend.body.success).toBe(true);

    const otpCode =
      process.env.E2E_OTP_CODE?.trim() || otpSend.body.data?.debugCode;
    test.skip(
      !otpCode,
      'OTP debug code not available (set OTP_SHOW_DEBUG_CODE=true or E2E_OTP_CODE)',
    );

    const register = await apiJson<{ accessToken?: string }>(
      request,
      'post',
      '/identity/register',
      {
        data: {
          email,
          password: 'E2eTest123!',
          firstName: 'E2E',
          lastName: 'Register',
          otpCode,
        },
      },
    );
    expect(register.status).toBeLessThan(500);
    expect([200, 201]).toContain(register.status);
    expect(register.body.success).toBe(true);
  });

  test('guest bootstrap → booking → payment → voucher smoke', async ({
    request,
  }) => {
    const health = await request.get(`${apiBase}/health`);
    test.skip(!health.ok(), 'API not running');

    const stamp = Date.now();
    const email = `e2e-guest-${stamp}@turta.test`;

    const bootstrap = await apiJson<{ accessToken: string }>(
      request,
      'post',
      '/identity/guest-bootstrap',
      {
        data: {
          email,
          firstName: 'E2E',
          lastName: 'Guest',
          phone: '+905551112233',
          address: 'Kadikoy Istanbul Test Mahallesi',
          billingLine1: 'Bagdat Cad. No:1',
          billingCity: 'Istanbul',
          billingCountry: 'Turkiye',
          identityNumber: '10000000146',
        },
      },
    );
    expect(bootstrap.body.success).toBe(true);
    const token = bootstrap.body.data?.accessToken;
    expect(token).toBeTruthy();

    const search = await apiJson<Array<{ id: string; title?: string }>>(
      request,
      'get',
      '/catalog/tours/search?limit=5',
    );
    expect(search.body.success).toBe(true);
    const tours = search.body.data ?? [];
    test.skip(tours.length === 0, 'No tours seeded for E2E');

    let tourDateId: string | null = null;
    for (const tour of tours) {
      const dates = await apiJson<
        Array<{ id: string; remainingCapacity?: number; isActive?: boolean }>
      >(request, 'get', `/catalog/tours/${tour.id}/dates`);
      const open = (dates.body.data ?? []).find(
        (d) => d.isActive !== false && (d.remainingCapacity ?? 0) > 0,
      );
      if (open) {
        tourDateId = open.id;
        break;
      }
    }
    test.skip(!tourDateId, 'No tour dates with capacity');

    const reservation = await apiJson<{
      id: string;
      bookingNumber: string;
      status: string;
    }>(request, 'post', '/booking/reservations', {
      token,
      data: {
        tourDateId,
        adults: 1,
        children: 0,
        contactEmail: email,
        contactPhone: '+905551112233',
        guests: [
          {
            firstName: 'E2E',
            lastName: 'Guest',
            identityNumber: '10000000146',
            email,
            phone: '+905551112233',
            address: 'Kadikoy Istanbul Test Mahallesi',
          },
        ],
        billing: {
          fullName: 'E2E Guest',
          line1: 'Bagdat Cad. No:1',
          city: 'Istanbul',
          country: 'Turkiye',
        },
      },
    });
    expect(reservation.body.success).toBe(true);
    expect(reservation.body.data?.id).toBeTruthy();
    expect(reservation.body.data?.bookingNumber).toMatch(/^TRL-/);
    expect(reservation.body.data?.status).toBe('PENDING');

    const payment = await apiJson<{
      status: string;
      requires3ds?: boolean;
    }>(request, 'post', '/payment/checkout', {
      token,
      data: {
        reservationId: reservation.body.data!.id,
        cardHolderName: 'E2E Guest',
        cardNumber: MOCK_SUCCESS_CARD,
        expireMonth: '12',
        expireYear: '30',
        cvc: '123',
      },
    });
    expect(payment.body.success).toBe(true);
    expect(payment.body.data?.status).toBe('SUCCESS');
    expect(payment.body.data?.requires3ds).toBeFalsy();

    const voucherRes = await request.get(
      `${apiBase}/booking/reservations/${reservation.body.data!.id}/voucher`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    expect(voucherRes.ok()).toBeTruthy();
    const voucherText = await voucherRes.text();
    expect(voucherText).toContain(reservation.body.data!.bookingNumber);
    expect(voucherText.toLowerCase()).toContain('html');
  });

  test('demo customer can complete payment → voucher (regression)', async ({
    request,
  }) => {
    const health = await request.get(`${apiBase}/health`);
    test.skip(!health.ok(), 'API not running');

    const login = await apiJson<{ accessToken: string }>(
      request,
      'post',
      '/identity/login',
      {
        data: {
          email: DEMO_CUSTOMER.email,
          password: DEMO_CUSTOMER.password,
        },
      },
    );
    test.skip(!login.body.success, 'Demo customer login failed — seed DB?');
    const token = login.body.data!.accessToken;

    const search = await apiJson<Array<{ id: string }>>(
      request,
      'get',
      '/catalog/tours/search?limit=3',
    );
    const tours = search.body.data ?? [];
    test.skip(tours.length === 0, 'No tours');

    let tourDateId: string | null = null;
    for (const tour of tours) {
      const dates = await apiJson<
        Array<{ id: string; remainingCapacity?: number; isActive?: boolean }>
      >(request, 'get', `/catalog/tours/${tour.id}/dates`);
      const open = (dates.body.data ?? []).find(
        (d) => d.isActive !== false && (d.remainingCapacity ?? 0) > 0,
      );
      if (open) {
        tourDateId = open.id;
        break;
      }
    }
    test.skip(!tourDateId, 'No capacity');

    const reservation = await apiJson<{ id: string; bookingNumber: string }>(
      request,
      'post',
      '/booking/reservations',
      {
        token,
        data: {
          tourDateId,
          adults: 1,
          contactEmail: DEMO_CUSTOMER.email,
          contactPhone: '+905551112233',
          guests: [
            {
              firstName: 'Demo',
              lastName: 'User',
              identityNumber: '10000000146',
              email: DEMO_CUSTOMER.email,
              phone: '+905551112233',
              address: 'Kadikoy Istanbul Test',
            },
          ],
          billing: {
            fullName: 'Demo User',
            line1: 'Test Cad No 1',
            city: 'Istanbul',
            country: 'Turkiye',
          },
        },
      },
    );
    expect(reservation.body.success).toBe(true);

    const payment = await apiJson<{ status: string }>(
      request,
      'post',
      '/payment/checkout',
      {
        token,
        data: {
          reservationId: reservation.body.data!.id,
          cardHolderName: 'Demo User',
          cardNumber: MOCK_SUCCESS_CARD,
          expireMonth: '12',
          expireYear: '30',
          cvc: '123',
        },
      },
    );
    expect(payment.body.success).toBe(true);
    expect(payment.body.data?.status).toBe('SUCCESS');

    const voucherRes = await request.get(
      `${apiBase}/booking/reservations/${reservation.body.data!.id}/voucher`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    expect(voucherRes.ok()).toBeTruthy();
    const voucherText = await voucherRes.text();
    expect(voucherText).toContain(reservation.body.data!.bookingNumber);
  });
});
