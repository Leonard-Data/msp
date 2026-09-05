import { test, expect } from '@playwright/test';

const globalSearchPaths = ['/', '/docs/sources/firstmate-docs/'];

test('search matches category and source labels', async ({ page }) => {
  await page.goto('/search/?q=Power%20Platform');

  const pageSearch = page.locator('main [data-search-root]').first();
  await expect(pageSearch.getByRole('link', { name: /Power Apps UI/i }).first()).toBeVisible();

  await pageSearch.getByLabel('Search the library').fill('Agent Engineering');
  await expect(pageSearch.getByRole('link', { name: /Agent Engineering/i }).first()).toBeVisible();
});

test('global search dialog lazy-loads the index and routes to the source page', async ({ page }) => {
  for (const [index, path] of globalSearchPaths.entries()) {
    await page.goto(path);

    const openSearch = page.getByRole('button', { name: /open search dialog/i });
    await expect(openSearch).toBeVisible();

    const indexResponse = index === 0
      ? page.waitForResponse((response) => /search-index.*\.json(?:\?|$)/.test(response.url()) && response.ok())
      : null;
    await openSearch.click();

    const dialog = page.getByRole('dialog', { name: /search the library/i });
    const dialogSearch = dialog.locator('[data-search-root]').first();
    await expect(dialog).toBeVisible();
    if (indexResponse) await indexResponse;

    await dialogSearch.getByLabel('Search the library').fill('Concepts');
    await expect(dialogSearch.getByRole('link', { name: /Concepts/i }).first()).toBeVisible();
    await dialogSearch.getByRole('link', { name: /Concepts/i }).first().click();
    await expect(page).toHaveURL('/docs/sources/firstmate-docs/concepts/');
  }
});

test('legacy README source URLs still resolve to the source doc', async ({ page }) => {
  await page.goto('/docs/sources/firstmate-docs/workflows/README/');

  await expect(page.locator('.doc-header').getByRole('heading', { level: 1, name: 'Workflows' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Open source repository/i })).toBeVisible();
});

test('category browsing stays exact for AI results', async ({ page }) => {
  await page.goto('/search/?category=AI');

  const results = page.locator('main [data-search-results]').first();
  await expect(results.getByRole('link', { name: /Agent Engineering/i }).first()).toBeVisible();
  await expect(results.getByRole('link', { name: /How it works/i })).toHaveCount(0);
});

test('category browsing surfaces the active filter and clear path', async ({ page }) => {
  await page.goto('/search/?category=AI');

  const pageSearch = page.locator('main [data-search-root]').first();
  const activeFilter = page.locator('main [data-search-active-filter]').first();
  await expect(activeFilter.getByText('Active category')).toBeVisible();
  await expect(activeFilter.getByText(/^AI$/)).toBeVisible();
  await expect(activeFilter.getByRole('link', { name: /Clear category/i })).toBeVisible();

  await pageSearch.getByLabel('Search the library').fill('Power Apps UI');
  await expect(page.getByText(/No results in AI\./i)).toBeVisible();

  await activeFilter.getByRole('link', { name: /Clear category/i }).click();
  await expect(page).toHaveURL(/\/search\/\?q=Power\+Apps\+UI$/);
  await expect(page.getByRole('link', { name: /Power Apps UI/i }).first()).toBeVisible();
});

