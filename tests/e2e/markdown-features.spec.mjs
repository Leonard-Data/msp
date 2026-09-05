import { test, expect } from '@playwright/test';

test.use({ permissions: ['clipboard-read', 'clipboard-write'] });

test('external links, youtube, and file embeds', async ({ page }) => {
  await page.goto('/docs/markdown-features/');

  const astroLink = page.getByRole('link', { name: 'Astro documentation' });
  await expect(astroLink).toHaveAttribute('target', '_blank');
  await expect(astroLink).toHaveAttribute('rel', 'noopener noreferrer');

  await expect(page.locator('.youtube-embed iframe')).toBeVisible();
  await expect(page.locator('.youtube-embed iframe')).toHaveAttribute('src', /youtube-nocookie/);

  await expect(page.locator('.code-block[data-language="javascript"]')).toBeVisible();
  await expect(page.locator('.code-block[data-language="yaml"]')).toBeVisible();

  const openRaw = page.locator('a:has-text("Open raw")').first();
  await expect(openRaw).toHaveAttribute('target', '_blank');
  await expect(openRaw).toHaveAttribute('rel', 'noopener noreferrer');
});

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

  // SVGs are now rendered inline for CSS styling — no zoom button needed
  const inlineSvg = page.locator('.markdown-svg svg').first();
  await expect(inlineSvg).toBeVisible();
  await expect(inlineSvg).toHaveAttribute('role', 'img');

  await expect(page.getByRole('link', { name: 'Edit on GitHub' })).toHaveAttribute('href', /\/edit\/main\/content\/portal\/markdown-features\.md$/);
});
