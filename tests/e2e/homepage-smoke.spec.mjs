import { test, expect } from '@playwright/test';

test('homepage stays usable on the current device class', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1, name: /One library for every repository/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Browse library/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Add documentation/i }).first()).toBeVisible();

  await page.getByRole('link', { name: /Browse library/i }).click();
  await expect(page).toHaveURL(/\/docs\/$/);

  await page.goto('/');
  await page.getByLabel('Search across every synced repository').fill('Agent Engineering');
  await page.getByRole('button', { name: /Open search/i }).click();
  await expect(page).toHaveURL(/\/search\/\?q=Agent\+Engineering$/);
  await expect(page.getByRole('link', { name: /Agent Engineering/i }).first()).toBeVisible();
});
