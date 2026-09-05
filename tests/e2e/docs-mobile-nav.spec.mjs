import { test, expect } from '@playwright/test';

const docsPaths = [
  '/docs/sources/firstmate-docs/',
  '/docs/sources/firstmate-docs/workflows/routing-and-assignment/',
];

test('desktop docs pages keep the sidebar rail', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium', 'desktop-only regression check');

  for (const path of docsPaths) {
    await page.goto(path);
    await expect(page.locator('.sidebar')).toBeVisible();
  }
});

test('mobile docs pages expose a browse-docs affordance', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chromium', 'mobile-only regression check');

  for (const path of docsPaths) {
    await page.goto(path);

    const browseDocs = page.getByText('Browse docs');
    await expect(browseDocs).toBeVisible();
    await browseDocs.click();

    const navigation = page.locator('[aria-label="Documentation navigation"]:visible');
    await expect(navigation).toBeVisible();

    const linkCount = await navigation.locator('a:visible').count();
    expect(linkCount).toBeGreaterThan(1);
  }
});
