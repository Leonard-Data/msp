import { test, expect } from '@playwright/test';

const docsPaths = [
  '/docs/sources/firstmate-docs/',
  '/docs/sources/firstmate-docs/workflows/routing-and-assignment/',
];

test('desktop docs pages let readers collapse and reopen the sidebar from the header', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium', 'desktop-only regression check');

  for (const path of docsPaths) {
    await page.goto(path);

    const toggle = page.getByRole('button', { name: /toggle documentation navigation/i });
    const navigation = page.locator('[aria-label="Documentation navigation"]');

    await expect(toggle).toBeVisible();
    await expect(navigation).toBeVisible();

    await toggle.click();
    await expect(navigation).toBeHidden();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await toggle.click();
    await expect(navigation).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  }
});

test('mobile docs pages keep a native navigation fallback without scripts', async ({ browser }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chromium', 'mobile-only regression check');

  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 412, height: 915 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();

  for (const path of docsPaths) {
    await page.goto(path);

    const fallback = page.locator('.docs-nav-fallback');
    const summary = fallback.locator(':scope > summary');
    const navigation = fallback.locator('[aria-label="Documentation navigation fallback"]');

    await expect(summary).toBeVisible();
    await expect(navigation).toBeHidden();

    await summary.click();
    await expect(navigation).toBeVisible();
  }

  await context.close();
});

test('mobile docs pages use the header toggle to open and close the sidebar drawer', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chromium', 'mobile-only regression check');

  for (const path of docsPaths) {
    await page.goto(path);

    const toggle = page.getByRole('button', { name: /toggle documentation navigation/i });
    const navigation = page.locator('[aria-label="Documentation navigation"]');
    const backdrop = page.getByRole('button', { name: /close documentation navigation/i });

    await expect(toggle).toBeVisible();
    await expect(navigation).toBeHidden();
    await expect(backdrop).toBeHidden();

    await toggle.click();
    await expect(navigation).toBeVisible();
    await expect(backdrop).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');

    const headerBox = await page.locator('.topbar').boundingBox();
    const navBox = await page.locator('[data-docs-nav-shell]').boundingBox();
    const backdropBox = await backdrop.boundingBox();
    expect(navBox?.y).toBeGreaterThanOrEqual((headerBox?.y || 0) + (headerBox?.height || 0) - 1);
    expect(backdropBox?.y).toBeGreaterThanOrEqual((headerBox?.y || 0) + (headerBox?.height || 0) - 1);

    const linkCount = await navigation.locator('a:visible').count();
    expect(linkCount).toBeGreaterThan(1);

    await toggle.click();
    await expect(navigation).toBeHidden();
    await expect(backdrop).toBeHidden();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  }
});
