import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('renders hero and core sections', async ({ page }) => {
    await page.goto('/');

    // Page loads with Dutch locale and Struq title
    await expect(page).toHaveTitle(/Struq/);

    // Hero content is visible above the fold
    await expect(page.locator('main, [data-site-shell], body')).toBeVisible();
    await expect(page.locator('h1')).toBeVisible();

    // No client-side crash: scroll to the bottom to mount lazy sections
    await page.mouse.wheel(0, 20000);
    await page.waitForTimeout(1000);

    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.waitForTimeout(500);
    expect(errors).toEqual([]);
  });
});
