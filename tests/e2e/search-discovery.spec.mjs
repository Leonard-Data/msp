import { test, expect } from '@playwright/test';

test('search matches category and source labels', async ({ page }) => {
  await page.goto('/search/?q=Power%20Platform');
  await expect(page.getByRole('link', { name: /Power Apps UI/i }).first()).toBeVisible();

  await page.getByLabel('Search the library').fill('Agent Engineering');
  await expect(page.getByRole('link', { name: /Agent Engineering/i }).first()).toBeVisible();
});

test('category browsing stays exact for AI results', async ({ page }) => {
  await page.goto('/search/?category=AI');

  const results = page.locator('[data-search-results]');
  await expect(results.getByRole('link', { name: /Agent Engineering/i }).first()).toBeVisible();
  await expect(results.getByRole('link', { name: /How it works/i })).toHaveCount(0);
});

