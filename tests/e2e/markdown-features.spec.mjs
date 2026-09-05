import { test, expect } from '@playwright/test';

test.use({ permissions: ['clipboard-read', 'clipboard-write'] });

test('markdown enhancements work in the published docs page', async ({ page }) => {
  await page.goto('/docs/markdown-features/');

  await expect(page.locator('.code-block[data-language="html"]')).toBeVisible();
  await expect(page.locator('.code-block__language').first()).toHaveText('HTML');
  await expect(page.locator('[data-jsfiddle]')).toBeVisible();
  await expect(page.locator('.prose details')).toHaveCount(1);

  await page.locator('[data-preview-toggle]').click();
  await expect(page.locator('[data-preview-srcdoc]')).toHaveAttribute('hidden', '');
  await page.locator('[data-preview-toggle]').click();
  await expect(page.locator('[data-preview-srcdoc]')).not.toHaveAttribute('hidden');

  await page.locator('[data-copy-code]').first().click();
  await expect(page.locator('[data-copy-code]').first()).toHaveText('Copied');

  await page.locator('[data-copy-to-clipboard]').click();
  await expect(page.locator('[data-copy-to-clipboard]')).toHaveText('Copied');

  await page.locator('[data-image-zoom]').click();
  await expect(page.locator('[data-image-lightbox]')).toBeVisible();
  await expect(page.locator('[data-image-lightbox-image]')).toHaveAttribute('alt', 'Documentation sync flow');

  await expect(page.getByRole('link', { name: 'Edit on GitHub' })).toHaveAttribute('href', /\/edit\/main\/content\/portal\/markdown-features\.md$/);
});
