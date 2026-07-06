import { test, expect } from '@playwright/test';

/**
 * M5 slice 1 — Auth.js login. Drives the real credentials flow against the
 * seeded demo account and proves the M2 favorites DB path activates once a
 * session exists (and still 401s + falls back to localStorage when signed out).
 */

const EMAIL = process.env.E2E_EMAIL ?? 'demo@struq.nl';
const PASSWORD = process.env.E2E_PASSWORD ?? 'Struq2026';

test.describe('Auth', () => {
  test('signed-out: /api/favorites 401s (localStorage fallback intact)', async ({ request }) => {
    const res = await request.get('/api/favorites');
    expect(res.status()).toBe(401);
    expect((await res.json()).savedIds).toBeNull();
  });

  test('login with the demo credentials lands on the dashboard', async ({ page }) => {
    await page.goto('/auth');
    await page.fill('#auth-email', EMAIL);
    await page.fill('#auth-password', PASSWORD);
    await page.getByRole('button', { name: /^Inloggen$/ }).click();

    // The cinematic success handoff (~2.1s) ends by navigating to /dashboard.
    await page.waitForURL('**/dashboard', { timeout: 15000 });
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('after login the favorites DB path is live (200, not 401)', async ({ page }) => {
    await page.goto('/auth');
    await page.fill('#auth-email', EMAIL);
    await page.fill('#auth-password', PASSWORD);
    await page.getByRole('button', { name: /^Inloggen$/ }).click();
    await page.waitForURL('**/dashboard', { timeout: 15000 });

    // Same cookie jar → the session now resolves server-side.
    const res = await page.request.get('/api/favorites');
    expect(res.status()).toBe(200);
    expect(Array.isArray((await res.json()).savedIds)).toBe(true);
  });

  test('wrong password shows an error and stays on /auth', async ({ page }) => {
    await page.goto('/auth');
    await page.fill('#auth-email', EMAIL);
    await page.fill('#auth-password', 'definitely-wrong');
    await page.getByRole('button', { name: /^Inloggen$/ }).click();

    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page).toHaveURL(/\/auth/);
  });

  test('signup with a duplicate email surfaces a 409 error', async ({ page }) => {
    await page.goto('/auth');
    await page.getByRole('button', { name: /Maak er een aan/ }).click();
    await page.fill('#auth-name', 'Dubbel');
    await page.fill('#auth-email', EMAIL); // demo email already exists
    await page.fill('#auth-password', 'ruimschoots8');
    await page.getByRole('button', { name: /^Account aanmaken$/ }).click();

    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page).toHaveURL(/\/auth/);
  });

  test('signup with a fresh email creates an account and lands on the dashboard', async ({ page }) => {
    const unique = `e2e+${Date.now()}@struq.nl`;
    await page.goto('/auth');
    await page.getByRole('button', { name: /Maak er een aan/ }).click();
    await page.fill('#auth-name', 'E2E Nieuw');
    await page.fill('#auth-email', unique);
    await page.fill('#auth-password', 'ruimschoots8');
    await page.getByRole('button', { name: /^Account aanmaken$/ }).click();

    await page.waitForURL('**/dashboard', { timeout: 15000 });
    await expect(page).toHaveURL(/\/dashboard/);
  });
});
