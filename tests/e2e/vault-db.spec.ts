import { test, expect } from '@playwright/test';

/**
 * M2: the dashboard, vault and canon must render from Postgres (seeded canon)
 * with no visual regression vs. the demo-data version. These routes are
 * open in M2 (auth is M5), so we just drive them and assert real DB content
 * appears and nothing crashes on the client.
 */

test.describe('DB-backed dashboard', () => {
  test('/dashboard renders the featured strip from the DB', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/dashboard');
    // Featured strip: a seeded canon asset name from the DB.
    await expect(page.getByText('Graphite Ivory').first()).toBeVisible();
    await expect(page.getByRole('link', { name: /bibliotheek/i }).first()).toBeVisible();

    await page.waitForTimeout(400);
    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('/vault renders the library from the DB and filters by type', async ({ page }) => {
    const errors: string[] = [];
    const favoriteRequests: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    page.on('request', (request) => {
      if (request.url().includes('/api/favorites')) favoriteRequests.push(request.url());
    });

    await page.goto('/vault');
    // 29 canon palettes are imported; the first free palette shows.
    await expect(page.getByText('Graphite Ivory').first()).toBeVisible();

    // Page 1 SSRs a paginated library slice instead of shipping the whole set.
    const cards = page.locator('article');
    await expect(cards.first()).toBeVisible();
    await expect(cards).toHaveCount(36);

    // Anonymous browsing stays entirely local; the favorites DB path is not probed.
    expect(favoriteRequests).toEqual([]);

    await page.getByRole('button', { name: /meer laden/i }).click();
    await expect.poll(async () => cards.count()).toBeGreaterThan(36);

    await page.waitForTimeout(300);
    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('/vault?filter=saved shows the empty-vault state', async ({ page }) => {
    await page.goto('/vault?filter=saved');
    await expect(page.getByText(/nog niets bewaard/i)).toBeVisible();
  });

  test('/canon renders without a client crash', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/canon');
    await expect(page.locator('h1, h2').first()).toBeVisible();

    await page.waitForTimeout(400);
    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('global search hits the DB-backed route and returns results', async ({ page }) => {
    await page.goto('/dashboard');
    const search = page.getByRole('textbox', { name: /zoek/i });
    await search.click();
    await search.fill('graphite');
    // Result comes from /api/assets/search → repository → Postgres.
    await expect(page.getByText('Graphite Ivory').first()).toBeVisible();
  });
});
