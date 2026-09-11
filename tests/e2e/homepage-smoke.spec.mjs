import { test, expect } from '@playwright/test';

test('homepage stays usable on the current device class', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1, name: /One library for every repository/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Browse library/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Add documentation/i }).first()).toBeVisible();

  await page.getByRole('link', { name: /Browse library/i }).click();
  await expect(page).toHaveURL(/\/docs\/$/);

  await page.goto('/');
  await page.getByLabel('Search across every synced repository').fill('Firstmate');
  await page.getByRole('button', { name: /^Open search$/i }).click();
  await expect(page).toHaveURL(/\/search\/\?q=Firstmate$/);
  await expect(page.getByRole('link', { name: /Firstmate/i }).first()).toBeVisible();
});

test('desktop navbar uses a compact text-only treatment', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium', 'Desktop navbar regression');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');

  const metrics = await page.evaluate(() => {
    const topbar = document.querySelector('.topbar');
    const brand = document.querySelector('.brand');
    const search = document.querySelector('.topbar__actions .search-trigger');
    const github = [...document.querySelectorAll('.topbar__actions a')].find((link) => link.textContent?.trim() === 'GitHub');
    const primary = document.querySelector('.topbar__actions .button--primary');
    if (!topbar || !brand || !search || !github || !primary) throw new Error('Missing navbar element');

    const styles = [search, github].map((element) => {
      const style = getComputedStyle(element);
      return { backgroundColor: style.backgroundColor, borderColor: style.borderColor };
    });

    return {
      logoCount: brand.querySelectorAll('img').length,
      topbarHeight: topbar.getBoundingClientRect().height,
      brandFontSize: Number.parseFloat(getComputedStyle(brand).fontSize),
      actionHeights: [...document.querySelectorAll('.topbar__actions .button')].map((element) => element.getBoundingClientRect().height),
      secondaryStyles: styles,
    };
  });

  expect.soft(metrics.logoCount).toBe(0);
  expect.soft(metrics.topbarHeight).toBeLessThanOrEqual(60);
  expect.soft(metrics.brandFontSize).toBeLessThanOrEqual(18);
  expect.soft(Math.max(...metrics.actionHeights)).toBeLessThanOrEqual(36);
  for (const style of metrics.secondaryStyles) {
    expect.soft(style.backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect.soft(style.borderColor).toBe('rgba(0, 0, 0, 0)');
  }
});

test('docs blockquotes keep the existing prose styling', async ({ page }) => {
  await page.goto('/docs/orches-harness/');

  const blockquote = page.locator('.prose blockquote').first();
  await expect(blockquote).toBeVisible();
  await expect(blockquote).toHaveCSS('border-left-width', '3px');
  await expect(blockquote).toHaveCSS('border-left-color', 'rgb(242, 182, 50)');
  await expect(blockquote).toHaveCSS('background-color', 'rgb(245, 246, 247)');
});

test('desktop docs typography, content width, and motion stay cohesive', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium', 'Desktop layout regression');
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('/docs/orches-harness/');

  const metrics = await page.evaluate(() => {
    const content = document.querySelector('.docs-content');
    const prose = document.querySelector('.docs-content .prose');
    const sidebar = document.querySelector('.docs-nav .sidebar');
    const sidebarLabel = document.querySelector('.docs-nav .sidebar__label');
    const toc = document.querySelector('.toc');
    const tocLabel = document.querySelector('.toc__label');
    if (!content || !prose || !sidebar || !sidebarLabel || !toc || !tocLabel) throw new Error('Missing docs layout element');

    const contentStyle = getComputedStyle(content);
    const proseStyle = getComputedStyle(prose);
    const sidebarStyle = getComputedStyle(sidebar);
    const sidebarLabelStyle = getComputedStyle(sidebarLabel);
    const tocStyle = getComputedStyle(toc);
    const tocLabelStyle = getComputedStyle(tocLabel);
    const contentInnerWidth = content.clientWidth
      - Number.parseFloat(contentStyle.paddingLeft)
      - Number.parseFloat(contentStyle.paddingRight);

    return {
      contentFont: contentStyle.fontFamily,
      proseFont: proseStyle.fontFamily,
      sidebarFont: sidebarStyle.fontFamily,
      sidebarLabelFont: sidebarLabelStyle.fontFamily,
      tocFont: tocStyle.fontFamily,
      tocLabelFont: tocLabelStyle.fontFamily,
      contentInnerWidth,
      proseWidth: prose.getBoundingClientRect().width,
      sidebarTransitionDuration: sidebarStyle.transitionDuration,
      sidebarTransitionProperty: sidebarStyle.transitionProperty,
      contentTransitionDuration: contentStyle.transitionDuration,
      contentTransitionProperty: contentStyle.transitionProperty,
    };
  });

  expect.soft(metrics.proseFont).toBe(metrics.contentFont);
  expect.soft(metrics.sidebarFont).toBe(metrics.contentFont);
  expect.soft(metrics.sidebarLabelFont).toBe(metrics.contentFont);
  expect.soft(metrics.tocFont).toBe(metrics.contentFont);
  expect.soft(metrics.tocLabelFont).toBe(metrics.contentFont);
  expect.soft(metrics.proseWidth).toBeGreaterThanOrEqual(metrics.contentInnerWidth - 2);
  expect.soft(metrics.sidebarTransitionDuration).not.toBe('0s');
  expect.soft(metrics.sidebarTransitionProperty).toMatch(/transform|opacity|width/);
  expect.soft(metrics.contentTransitionDuration).not.toBe('0s');
  expect.soft(metrics.contentTransitionProperty).toContain('margin-left');

  await page.getByRole('link', { name: /open search dialog/i }).click();
  const dialog = page.getByRole('dialog', { name: /search the library/i });
  await expect(dialog).toBeVisible();
  const dialogMotion = await dialog.evaluate((element) => {
    const style = getComputedStyle(element);
    return { animationDuration: style.animationDuration, transitionDuration: style.transitionDuration };
  });
  expect.soft(dialogMotion.animationDuration === '0s' && dialogMotion.transitionDuration === '0s').toBe(false);
});
