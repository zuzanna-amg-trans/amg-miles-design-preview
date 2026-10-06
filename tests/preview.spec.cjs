const { test: base, expect } = require('@playwright/test');

const test = base.extend({
  runtimeErrors: [async ({ page, baseURL }, use, testInfo) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('response', response => {
      if (response.url().startsWith(new URL(baseURL).origin) && response.status() >= 400) {
        errors.push(`${response.status()} ${response.url()}`);
      }
    });
    await use(errors);
    if (errors.length) {
      await testInfo.attach('browser-errors', { body: JSON.stringify(errors), contentType: 'application/json' });
    }
    expect(errors, 'No JavaScript, console or HTTP errors').toEqual([]);
  }, { auto: true }],
});

async function navigate(page, view, isMobile) {
  if (isMobile) {
    await page.getByRole('button', { name: 'Otwórz nawigację', exact: true }).click();
  }
  await page.locator(`.nav-item[data-view="${view}"]`).click();
  await expect(page).toHaveURL(new RegExp(`#${view}$`));
}

const views = [
  ['overview', /Współpraca, która\s*się opłaca\./],
  ['invoices', /Moje faktury\./],
  ['history', /Każdy punkt\s*ma swoją historię\./],
  ['rewards', /Dobra współpraca\.\s*Dobre nagrody\./],
  ['orders', /Coś dobrego\s*jest przed Tobą\./],
  ['rules', /Proste zasady\.\s*Konkretny zysk\./],
];

for (const [view, heading] of views) {
  test(`${view}: content, assets and contained layout`, async ({ page }) => {
    await page.goto(`./#${view}`);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading);
    await expect(page.locator('.demo-pill')).toHaveText('Podgląd projektu · dane demo');
    await expect(page.locator(`.nav-item[data-view="${view}"]`)).toHaveAttribute('aria-current', 'page');
    await page.evaluate(() => document.fonts.ready);
    await expect.poll(() => page.locator('.brand img').evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true);
    const layout = await page.evaluate(() => ({
      document: document.documentElement.scrollWidth,
      viewport: window.innerWidth,
      fontLoaded: document.fonts.check('16px Onest'),
    }));
    expect(layout.document, 'The page does not overflow the viewport').toBeLessThanOrEqual(layout.viewport);
    expect(layout.fontLoaded, 'The bundled font loads').toBe(true);
  });
}

test('invoice filters, search, empty state and detail dialog', async ({ page }) => {
  await page.goto('./#invoices');
  const rows = page.locator('#invoice-results tbody tr');
  await expect(rows).toHaveCount(6);
  await page.getByRole('button', { name: 'Do opłacenia · 3', exact: true }).click();
  await expect(rows).toHaveCount(3);
  await expect(page.locator('[data-action="invoice-filter"][data-id="unpaid"]')).toHaveAttribute('aria-pressed', 'true');
  const search = page.getByRole('searchbox', { name: 'Szukaj numeru faktury' });
  await search.fill('1042');
  await expect(rows).toHaveCount(1);
  const details = page.getByRole('button', { name: 'Szczegóły faktury DEMO/2026/1042', exact: true });
  await details.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('heading', { name: 'DEMO/2026/1042', exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(details).toBeFocused();
  await search.fill('no-such-invoice');
  await expect(rows).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Brak pasujących faktur', exact: true })).toBeVisible();
  await search.fill('');
  await page.getByRole('button', { name: 'Opłacone · 3', exact: true }).click();
  await expect(rows).toHaveCount(3);
  await expect(rows.locator('.status')).toHaveText(['Opłacona', 'Opłacona', 'Opłacona']);
});

test('reward categories, detail and temporary goal selection', async ({ page, isMobile }) => {
  await page.goto('./#rewards');
  const cards = page.locator('.reward-card');
  await expect(cards).toHaveCount(6);
  for (const [category, count] of [['Elektronika', 3], ['Lifestyle', 2], ['Vouchery', 1], ['Wszystkie', 6]]) {
    const filter = page.getByRole('button', { name: category, exact: true });
    await filter.click();
    await expect(cards).toHaveCount(count);
    await expect(filter).toHaveAttribute('aria-pressed', 'true');
  }
  await page.getByRole('button', { name: 'Zobacz nagrodę: Głośnik przenośny', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('heading', { name: 'Głośnik przenośny', exact: true })).toBeVisible();
  await dialog.getByRole('button', { name: 'Ustaw jako cel', exact: true }).click();
  await expect(dialog).not.toBeVisible();
  await navigate(page, 'overview', isMobile);
  await expect(page.locator('.goal-card h3')).toHaveText('Głośnik przenośny');
  await page.reload();
  await expect(page.locator('.goal-card h3')).toHaveText('Słuchawki bezprzewodowe');
});

test('navigation works and the mobile menu releases focus', async ({ page, isMobile }) => {
  await page.goto('./');
  if (isMobile) {
    const menu = page.getByRole('button', { name: 'Otwórz nawigację', exact: true });
    await menu.click();
    await expect(menu).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#main-content')).toHaveJSProperty('inert', true);
    await page.keyboard.press('Escape');
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
    await expect(menu).toBeFocused();
    await expect(page.locator('#main-content')).toHaveJSProperty('inert', false);
  }
  await navigate(page, 'orders', isMobile);
  await expect(page.getByRole('heading', { name: 'Pierwsza nagroda jeszcze przed Tobą', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Przejdź do katalogu', exact: true }).click();
  await expect(page.locator('.reward-card')).toHaveCount(6);
  await expect(page.locator('#main-content')).toHaveJSProperty('inert', false);
});

test('program FAQ expands and closes', async ({ page }) => {
  await page.goto('./#rules');
  const faq = page.locator('details').filter({ has: page.locator('summary', { hasText: 'Jak wymienić punkty na nagrody?' }) });
  await expect(faq).toHaveJSProperty('open', false);
  await faq.locator('summary').click();
  await expect(faq).toHaveJSProperty('open', true);
  await expect(faq.locator('p')).toBeVisible();
  await faq.locator('summary').click();
  await expect(faq).toHaveJSProperty('open', false);
});

test('site entry preserves the requested view and identifies the tested commit', async ({ page, request, baseURL }) => {
  const siteRoot = new URL('../', baseURL);
  await page.goto(new URL('#rewards', siteRoot).href);
  await expect(page).toHaveURL(new URL('design-preview/#rewards', siteRoot).href);
  await expect(page.locator('.reward-card')).toHaveCount(6);
  const manifestURL = new URL('deployment.json', siteRoot);
  manifestURL.searchParams.set('commit', process.env.GITHUB_SHA);
  manifestURL.searchParams.set('run', process.env.GITHUB_RUN_ID);
  const response = await request.get(manifestURL.href);
  expect(response.ok()).toBe(true);
  const manifest = await response.json();
  expect(manifest.commit).toBe(process.env.GITHUB_SHA);
  expect(manifest.run_id).toBe(process.env.GITHUB_RUN_ID);
  expect(manifest.data).toBe('fictional-demo-only');
});
