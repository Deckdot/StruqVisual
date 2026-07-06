import { test, expect } from '@playwright/test';

/**
 * M3 — Free/Pro gating, server-enforced. Proves the paid payload never reaches
 * an unentitled viewer by any path: the prompt is stripped from props (locked
 * card → upgrade link, not a copy button) AND the copy route 403s. A Pro viewer
 * (the seeded demo account) gets the prompt from the same route.
 */

const EMAIL = process.env.E2E_EMAIL ?? 'demo@struq.nl';
const PASSWORD = process.env.E2E_PASSWORD ?? 'Struq2026';

/** Discover a locked (Pro) asset id as a free viewer via the search route. */
async function findLockedProAssetId(request: {
  get: (url: string) => Promise<{ json: () => Promise<unknown> }>;
}): Promise<string> {
  // 'editorial' matches seeded Pro typography/section names; fall back to a broad term.
  for (const q of ['editorial', 'a', 'sans']) {
    const res = await request.get(`/api/assets/search?q=${q}`);
    const data = (await res.json()) as { results: { id: string; locked: boolean }[] };
    const locked = data.results.find((r) => r.locked);
    if (locked) return locked.id;
  }
  throw new Error('no locked Pro asset found via search — seed may lack Pro assets');
}

test.describe('Free/Pro gating (server-enforced)', () => {
  test('signed-out: the prompt route 403s for a Pro asset (no payload leak)', async ({ request }) => {
    const proId = await findLockedProAssetId(request);
    const res = await request.get(`/api/assets/${proId}/prompt`);
    expect(res.status()).toBe(403);
    // Body carries no prompt.
    expect((await res.json()).prompt).toBeUndefined();
  });

  test('signed-out: a Pro card shows the upgrade link, not a copy button', async ({ page }) => {
    await page.goto('/vault');
    // The Pro badge marks a locked card; its action must be the upgrade link.
    const proCard = page.locator('article', { has: page.getByText('Pro', { exact: true }) }).first();
    await expect(proCard).toBeVisible();
    await expect(proCard.getByRole('link', { name: /ontgrendel met pro/i })).toBeVisible();
    await expect(proCard.getByRole('button', { name: /kopieer voor je ai/i })).toHaveCount(0);
  });

  test('the upgrade link lands on /pro', async ({ page }) => {
    await page.goto('/vault');
    const proCard = page.locator('article', { has: page.getByText('Pro', { exact: true }) }).first();
    await proCard.getByRole('link', { name: /ontgrendel met pro/i }).click();
    await expect(page).toHaveURL(/\/pro/);
    await expect(page.getByRole('heading', { name: /bibliotheek, klaar voor je ai/i })).toBeVisible();
  });

  test('signed-in Pro viewer: the prompt route returns the payload', async ({ page }) => {
    // Discover the id as a free viewer first (shared request context is signed-out).
    const proId = await findLockedProAssetId(page.request);

    await page.goto('/auth');
    await page.fill('#auth-email', EMAIL);
    await page.fill('#auth-password', PASSWORD);
    await page.getByRole('button', { name: /^Inloggen$/ }).click();
    await page.waitForURL('**/dashboard', { timeout: 15000 });

    // Same cookie jar → Pro session resolves server-side and the payload flows.
    const res = await page.request.get(`/api/assets/${proId}/prompt`);
    expect(res.status()).toBe(200);
    const { prompt } = (await res.json()) as { prompt: string };
    expect(prompt.length).toBeGreaterThan(0);
  });

  test('the prompt route rejects a malformed id', async ({ request }) => {
    const res = await request.get('/api/assets/not-a-uuid/prompt');
    expect(res.status()).toBe(400);
  });
});
