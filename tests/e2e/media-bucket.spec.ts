import { test, expect } from '@playwright/test';

const hasBucketEnv = Boolean(
  process.env.RAILWAY_BUCKET_NAME &&
    process.env.RAILWAY_BUCKET_ENDPOINT &&
    process.env.RAILWAY_BUCKET_REGION &&
    process.env.RAILWAY_BUCKET_ACCESS_KEY_ID &&
    process.env.RAILWAY_BUCKET_SECRET_ACCESS_KEY
);

test.describe('Railway Bucket media delivery', () => {
  test.skip(!hasBucketEnv, 'Railway Bucket env ontbreekt in deze testomgeving.');

  test('the media route redirects to a presigned bucket URL', async ({ request }) => {
    const list = await request.get('/api/assets?filter=media&page=1&limit=1');
    expect(list.status()).toBe(200);
    const page = (await list.json()) as { items: { id: string }[] };
    expect(page.items.length).toBeGreaterThan(0);

    const res = await request.get(`/api/media/${page.items[0]!.id}`, { maxRedirects: 0 });
    expect(res.status()).toBe(302);
    expect(res.headers().location).toContain('X-Amz-Algorithm=');
  });

  test('the media grid renders a real image element', async ({ page }) => {
    await page.goto('/vault?filter=media');
    await expect(page.locator('article img').first()).toBeVisible();
  });
});
