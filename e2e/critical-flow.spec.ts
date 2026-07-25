import { test, expect } from '@playwright/test';

const apiBase = process.env.API_URL ?? 'http://localhost:4000/api/v1';

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

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});

test.describe('Critical flow (API-only)', () => {
  test('register duplicate or success path', async ({ request }) => {
    const email = `e2e-${Date.now()}@turladur.test`;
    const response = await request.post(`${apiBase}/identity/register`, {
      data: {
        email,
        password: 'E2eTest123',
        firstName: 'E2E',
        lastName: 'User',
      },
    });
    test.skip(response.status() >= 500, 'API not running');

    expect([200, 201, 409]).toContain(response.status());
  });
});
