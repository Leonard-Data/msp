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

test('mobile docs pages use the header toggle to open and close the sidebar drawer', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chromium', 'mobile-only regression check');

  for (const path of docsPaths) {
    await page.goto(path);

    const toggle = page.getByRole('button', { name: /toggle documentation navigation/i });
    const navigation = page.locator('[aria-label="Documentation navigation"]');

    await expect(toggle).toBeVisible();
    await expect(navigation).toBeHidden();

    await toggle.click();
    await expect(navigation).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');

    const linkCount = await navigation.locator('a:visible').count();
    expect(linkCount).toBeGreaterThan(1);

    await toggle.click();
    await expect(navigation).toBeHidden();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  }
});
