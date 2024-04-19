import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(
    page.getByRole('heading', { name: 'Installation' })
  ).toBeVisible();
});

test('download last unlock-file', async ({ page }) => {
  await page.goto(
    'https://github.com/qlik-download/qlik-sense-desktop/releases/'
  );
  await page.evaluate(() => {
    const sections = window.document.querySelectorAll('section');
    sections.forEach(s => {
      const assets = s.querySelectorAll('summary');
      console.log(assets);
    });
  });
});
