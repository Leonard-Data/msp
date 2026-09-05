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

test('category browsing surfaces the active filter and clear path', async ({ page }) => {
  await page.goto('/search/?category=AI');

  const activeFilter = page.locator('[data-search-active-filter]');
  await expect(activeFilter.getByText('Active category')).toBeVisible();
  await expect(activeFilter.getByText(/^AI$/)).toBeVisible();
  await expect(activeFilter.getByRole('link', { name: /Clear category/i })).toBeVisible();

  await page.getByLabel('Search the library').fill('Power Apps UI');
  await expect(page.getByText(/No results in AI\./i)).toBeVisible();

  await activeFilter.getByRole('link', { name: /Clear category/i }).click();
  await expect(page).toHaveURL(/\/search\/\?q=Power\+Apps\+UI$/);
  await expect(page.getByRole('link', { name: /Power Apps UI/i }).first()).toBeVisible();
});

