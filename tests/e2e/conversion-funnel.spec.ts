import { test, expect } from '@playwright/test';

/**
 * Conversion funnel foundation: marketing CTAs point to /vault (not /auth),
 * the signup nudge appears after an anonymous save and respects dismissal,
 * the auth `next` param lands the user back where they came from, and
 * localStorage favorites migrate into the DB on login.
 */

const EMAIL = process.env.E2E_EMAIL ?? 'demo@struq.nl';
const PASSWORD = process.env.E2E_PASSWORD ?? 'Struq2026';

test.describe('Conversion funnel — CTA smoke', () => {
  test('homepage hero/navbar CTAs point to /vault; pricing free→/vault, pro→/auth?next=/pro', async ({
    page,
  }) => {
    await page.goto('/');

    await expect(page.getByRole('link', { name: 'Bekijk de bibliotheek' }).first()).toHaveAttribute(
      'href',
      '/vault'
    );

    await page.getByRole('link', { name: 'Prijzen' }).first().click();
    await expect(
      page.getByRole('link', { name: /Begin gratis, geen account nodig/i })
    ).toHaveAttribute('href', '/vault');
    await expect(page.getByRole('link', { name: /^Word Pro$/ })).toHaveAttribute(
      'href',
      '/auth?next=/pro'
    );
  });
});

test.describe('Conversion funnel — anonymous save + nudge', () => {
  test('saving an asset anonymously shows the nudge, and dismiss persists across reload', async ({
    page,
  }) => {
    await page.goto('/vault');
    const firstSaveButton = page.getByRole('button', { name: /bewaren in je vault/i }).first();
    await firstSaveButton.click();

    const nudge = page.getByText(/vault leeft nu alleen in deze browser/i);
    await expect(nudge).toBeVisible();

    await page.getByRole('button', { name: 'Melding sluiten' }).click();
    await expect(nudge).not.toBeVisible();

    await page.reload();
    await expect(page.getByText(/vault leeft nu alleen in deze browser/i)).not.toBeVisible();
  });
});

test.describe('Conversion funnel — next param', () => {
  test('/auth?next=/vault lands back on /vault after login', async ({ page }) => {
    await page.goto('/auth?next=/vault');
    await page.fill('#auth-email', EMAIL);
    await page.fill('#auth-password', PASSWORD);
    await page.getByRole('button', { name: /^Inloggen$/ }).click();

    await page.waitForURL((url) => url.pathname === '/vault', { timeout: 15000 });
    await expect(page).toHaveURL(/\/vault$/);
  });
});

test.describe('Conversion funnel — favorites migration', () => {
  test('local saves merge into the DB on signup and the local key is cleared', async ({ page }) => {
    await page.goto('/vault');
    await page.getByRole('button', { name: /bewaren in je vault/i }).first().click();

    const localIdsBefore = await page.evaluate(() =>
      JSON.parse(window.localStorage.getItem('struq_saved_assets_v1') ?? '[]')
    );
    expect(localIdsBefore.length).toBeGreaterThan(0);

    const unique = `e2e+migrate+${Date.now()}@struq.nl`;
    await page.goto('/auth?next=/vault');
    await page.getByRole('button', { name: /Maak er een aan/ }).click();
    await page.fill('#auth-name', 'E2E Migratie');
    await page.fill('#auth-email', unique);
    await page.fill('#auth-password', 'ruimschoots8');
    await page.getByRole('button', { name: /^Account aanmaken$/ }).click();

    await page.waitForURL((url) => url.pathname === '/vault', { timeout: 15000 });

    // The migration POST fires client-side after the session probe resolves;
    // its completion clears the local key, so wait for that before asserting.
    await page.waitForFunction(
      () => window.localStorage.getItem('struq_saved_assets_v1') === null,
      undefined,
      { timeout: 10000 }
    );

    const res = await page.request.get('/api/favorites');
    expect(res.status()).toBe(200);
    const { savedIds } = (await res.json()) as { savedIds: string[] };
    expect(savedIds.length).toBeGreaterThan(0);
    expect(savedIds).toEqual(expect.arrayContaining(localIdsBefore));
  });
});
