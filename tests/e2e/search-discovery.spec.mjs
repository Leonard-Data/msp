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

test('search shows a retryable load error before succeeding after an initial index fetch failure', async ({ page }) => {
  let requests = 0;
  await page.route(/search-index.*\.json(?:\?|$)/, async (route) => {
    requests += 1;
    if (requests === 1) {
      await route.fulfill({ status: 503, contentType: 'application/json', body: '[]' });
      return;
    }
    await route.continue();
  });

  await page.goto('/search/');

  const pageSearch = page.locator('main [data-search-root]').first();
  await expect(page.getByText(/Search is unavailable right now\. Try again\./i)).toBeVisible();
  await expect(page.getByText(/^No results\.$/)).toHaveCount(0);

  await pageSearch.getByLabel('Search the library').fill('Concepts');
  await expect(pageSearch.getByRole('link', { name: /Concepts/i }).first()).toBeVisible();
  expect(requests).toBeGreaterThanOrEqual(2);
});


test('search button falls back to the search page without dialog support', async ({ page }) => {
  await page.addInitScript(() => {
    delete HTMLDialogElement.prototype.showModal;
  });

  await page.goto('/');
  await expect(page.locator('[data-search-dialog]')).toBeHidden();
  await page.getByRole('button', { name: /open search dialog/i }).click();
  await expect(page).toHaveURL('/search/');
});


test('keyboard retry keeps the search dialog open', async ({ page }) => {
  let requests = 0;
  await page.route(/search-index.*\.json(?:\?|$)/, async (route) => {
    requests += 1;
    if (requests === 1) {
      await route.fulfill({ status: 503, contentType: 'application/json', body: '[]' });
      return;
    }
    await route.continue();
  });

  await page.goto('/');
  await page.getByRole('button', { name: /open search dialog/i }).click();

  const dialog = page.getByRole('dialog', { name: /search the library/i });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText(/Search is unavailable right now\. Try again\./i)).toBeVisible();

  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');

  await expect(dialog).toBeVisible();
  await expect(dialog.getByText(/Search is unavailable right now\. Try again\./i)).toHaveCount(0);
  expect(requests).toBeGreaterThanOrEqual(2);
});

test('header keeps only the dialog search affordance', async ({ page }) => {
  await page.goto('/');

  const topbar = page.locator('.topbar');
  await expect(topbar.getByRole('button', { name: /open search dialog/i })).toBeVisible();
  await expect(topbar.getByRole('link', { name: /^Search$/i })).toHaveCount(0);
});

test('dialog search stays focused without a full-page footer link', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: /open search dialog/i }).click();
  const dialog = page.getByRole('dialog', { name: /search the library/i });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('link', { name: /open the full search page/i })).toHaveCount(0);
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

