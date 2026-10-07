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

async function navigate(page, view) {
  await page.locator(`.primary-nav [data-view="${view}"]`).click();
  await expect(page).toHaveURL(new RegExp(`#${view}$`));
}

async function filterOrders(page, group) {
  await page.locator(`[data-action="order-filter"][data-id="${group}"]`).click();
}

function orderCard(page, id) {
  return page.locator(`.order-card[data-order-id="${id}"]`);
}

const views = [
  ['orders', 'Twoje zlecenia.', 'orders'],
  ['tracking/DEMO-261001', 'Twoje zlecenia.', 'orders'],
  ['invoices', 'Twoje faktury.', 'invoices'],
  ['rewards', 'Twoje nagrody.', 'rewards'],
  ['history', 'Historia punktów.', 'rewards'],
  ['claims', 'Moje nagrody.', 'rewards'],
  ['rules', 'Zasady programu.', 'rewards'],
];

for (const [view, heading, primaryView] of views) {
  test(`${view}: content, assets and contained layout`, async ({ page }) => {
    await page.goto(`./#${view}`);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading);
    await expect(page.locator('.preview-note')).toHaveText('Podgląd projektu · wszystkie dane są przykładowe');
    await expect(page.locator('.primary-nav button')).toHaveCount(3);
    await expect(page.locator(`.primary-nav [data-view="${primaryView}"]`)).toHaveAttribute('aria-current', 'page');
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

test('orders are the entry view; filters and search keep their combined scope', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Twoje zlecenia.');
  const cards = page.locator('.order-card');
  await expect(cards).toHaveCount(2);
  await filterOrders(page, 'completed');
  await expect(page.locator('[data-action="order-filter"][data-id="completed"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(cards).toHaveCount(3);
  const search = page.getByRole('searchbox', { name: 'Szukaj zlecenia po numerze, mieście lub rejestracji', exact: true });
  await search.fill('Lyon');
  await expect(cards).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Nie ma takich zleceń', exact: true })).toBeVisible();
  await filterOrders(page, 'all');
  await expect(search).toHaveValue('Lyon');
  await expect(cards).toHaveCount(1);
  await expect(cards).toHaveAttribute('data-order-id', 'DEMO-261001');
  await search.fill('AMG-DEMO-02');
  await expect(cards).toHaveCount(1);
  await expect(cards).toContainText('Rotterdam');
  await search.fill('');
  await expect(cards).toHaveCount(5);
});

test('active orders fill the entry list and sort by next operation rather than final delivery', async ({ page }) => {
  await page.goto('./#orders');
  await expect(page.locator('.order-detail-pane')).toHaveCount(0);
  await expect(page.locator('.compact-card')).toHaveCount(0);
  const cards = page.locator('.order-card');
  expect(await cards.evaluateAll(items => items.map(item => item.dataset.orderId))).toEqual(['DEMO-261002', 'DEMO-261001']);
  await expect(cards.first().locator('.next-arrival')).toHaveAttribute('data-arrival', 'load');
  await expect(cards.first().locator('.next-arrival')).toContainText('10:00');
  await expect(cards.nth(1).locator('.next-arrival')).toHaveAttribute('data-arrival', 'unload');
  await expect(cards.nth(1).locator('.next-arrival')).toContainText('18:30');
  await filterOrders(page, 'completed');
  expect(await cards.evaluateAll(items => items.map(item => item.dataset.orderId))).toEqual(['DEMO-260903', 'DEMO-260904', 'DEMO-260905']);
  await filterOrders(page, 'all');
  expect(await cards.evaluateAll(items => items.map(item => item.dataset.orderId))).toEqual(['DEMO-261002', 'DEMO-261001', 'DEMO-260903', 'DEMO-260904', 'DEMO-260905']);
});

test('order cards expose country postal codes, goods, weight and pallet count before expanding', async ({ page }) => {
  await page.goto('./#orders');
  const first = orderCard(page, 'DEMO-261001');
  await expect(first.locator('.order-reference')).toContainText('Numer zlecenia klienta');
  await expect(first.locator('.order-reference strong')).toHaveText('AMG-DEMO-01');
  await expect(first.locator('.route-address')).toHaveText(['PL 60-001', 'FR 69007']);
  await expect(first.locator('.order-cargo')).toContainText('Części maszyn');
  await expect(first.locator('.order-cargo')).toContainText(/3\s200 kg/);
  await expect(first.locator('.order-cargo')).toContainText('8 palet');
  await expect(first.locator('.vehicle-plate')).toHaveText('DEMO 001');
  await expect(first).not.toContainText('DEMO-261001');
  await expect(first.locator('.status')).toHaveText('W drodze na rozładunek');
  await expect(first.locator('[data-arrival="load"]')).toContainText('Dojazd na załadunek');
  await expect(first.locator('[data-arrival="unload"]')).toContainText('Przewidywany dojazd na rozładunek');
  await expect(first.locator('[data-arrival="unload"] strong')).toHaveText('18:3007.10.2026');
  const second = orderCard(page, 'DEMO-261002');
  await expect(second.locator('.route-address')).toHaveText(['NL 3011 AA', 'PL 50-001']);
  await expect(second.locator('.status')).toHaveText('W drodze na załadunek');
  await expect(second.locator('[data-arrival="load"]')).toContainText('Przewidywany dojazd na załadunek');
  await expect(second.locator('[data-arrival="load"] strong')).toHaveText('10:0007.10.2026');
  await expect(second.locator('[data-arrival="unload"] strong')).toHaveText('11:0008.10.2026');
});

test('choosing an order narrows the list beside its map; history restores focus and back closes it', async ({ page, isMobile, context }) => {
  await page.goto('./');
  await orderCard(page, 'DEMO-261001').getByRole('button', { name: 'Śledź transport', exact: true }).click();
  await expect(page).toHaveURL(/#tracking\/DEMO-261001$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Twoje zlecenia.');
  await expect(page.locator('.compact-card')).toHaveCount(2);
  expect(context.pages()).toHaveLength(1);
  const panel = page.getByRole('region', { name: 'Podgląd zlecenia klienta AMG-DEMO-01', exact: true });
  await expect(panel).toBeVisible();
  await expect(orderCard(page, 'DEMO-261001').locator('.order-option')).toHaveAttribute('aria-pressed', 'true');
  const list = await page.locator('.orders-list-pane').boundingBox();
  const detail = await panel.boundingBox();
  if (isMobile) {
    expect(list.y + list.height).toBeLessThanOrEqual(detail.y);
    const delivery = await panel.locator('.delivery-card').boundingBox();
    const map = await panel.locator('.map-card').boundingBox();
    expect(map.y, 'The map comes first in the phone detail pane').toBeLessThan(delivery.y);
  } else {
    expect(list.x + list.width).toBeLessThan(detail.x);
    expect(detail.width).toBeGreaterThan(list.width * 2);
  }
  await expect(panel.locator('.delivery-estimate>span').first()).toHaveText('Przewidywany dojazd na rozładunek');
  await expect(panel.locator('.delivery-estimate strong')).toHaveText('18:30');
  await expect(panel.locator('.detail-heading')).toContainText('Numer AMG: DEMO-261001');
  await expect(panel.locator('.map-footer')).toContainText('Przykładowa pozycja');
  await expect(panel.locator('.journey li')).toHaveCount(5);
  await expect(panel.locator('.journey [aria-current="step"] strong')).toHaveText('W drodze na rozładunek');
  const history = panel.getByRole('button', { name: 'Historia statusów', exact: true });
  await history.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.locator('.status-history li')).toHaveCount(4);
  await expect(dialog).toContainText('W drodze na rozładunek');
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(history).toBeFocused();
  await history.click();
  await page.goBack();
  await expect(dialog).not.toBeVisible();
  await expect(page.locator('.order-detail-pane')).toHaveCount(0);
  await expect(page.locator('.compact-card')).toHaveCount(0);
});

test('a shared tracking link retains the selected order on reload and can return to the full list', async ({ page }) => {
  await page.goto('./#tracking\/DEMO-261002');
  const panel = page.locator('#order-detail');
  const second = orderCard(page, 'DEMO-261002');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Twoje zlecenia.');
  await expect(panel).toBeVisible();
  await expect(second.locator('.order-option')).toHaveAttribute('aria-pressed', 'true');
  await expect(panel.locator('.delivery-estimate>span').first()).toHaveText('Przewidywany dojazd na załadunek');
  await expect(panel.locator('.delivery-estimate strong')).toHaveText('10:00');
  await expect(panel.locator('.delivery-card')).toContainText('Okno załadunku 09:30–10:30');
  await expect(panel.locator('.journey [aria-current="step"] strong')).toHaveText('W drodze na załadunek');
  await page.reload();
  await expect(panel).toBeVisible();
  await page.getByRole('button', { name: 'Wróć do pełnej listy zleceń', exact: true }).click();
  await expect(page).toHaveURL(/#orders$/);
  await expect(page.locator('.order-detail-pane')).toHaveCount(0);
  await expect(page.locator('.compact-card')).toHaveCount(0);
  await expect(page.locator('.order-card')).toHaveCount(2);
  await expect(second.getByRole('button', { name: 'Śledź transport', exact: true })).toBeFocused();
});

test('compact selection switches one detail pane and keeps route, cargo and search context', async ({ page }) => {
  await page.goto('./#tracking\/DEMO-261001');
  await expect(page.locator('.compact-route')).toHaveText(['Rotterdam → Wrocław', 'Poznań → Lyon']);
  await expect(page.locator('.compact-address')).toHaveText(['NL 3011 AA · PL 50-001', 'PL 60-001 · FR 69007']);
  await expect(page.locator('.compact-cargo')).toHaveText([/Opakowania kartonowe · 4\s800 kg · 12 palet/, /Części maszyn · 3\s200 kg · 8 palet/]);
  await expect(page.locator('.compact-reference')).toHaveText(['AMG-DEMO-02', 'AMG-DEMO-01']);
  await orderCard(page, 'DEMO-261002').locator('.order-option').click();
  await expect(page).toHaveURL(/#tracking\/DEMO-261002$/);
  await expect(page.locator('.order-detail-pane')).toHaveCount(1);
  await expect(page.locator('#order-detail .detail-heading')).toContainText('Rotterdam');
  await expect(page.locator('#order-detail .vehicle-plate')).toHaveText('DEMO 002');
  await orderCard(page, 'DEMO-261002').locator('.order-option').click();
  await expect(page.locator('.order-detail-pane')).toHaveCount(1);
  const search = page.getByRole('searchbox', { name: 'Szukaj zlecenia po numerze, mieście lub rejestracji', exact: true });
  await search.fill('50-001');
  await expect(search).toBeFocused();
  await expect(page.locator('.order-card')).toHaveCount(1);
  await expect(page.locator('.order-detail-pane')).toHaveCount(1);
  await search.fill('60-001');
  await expect(search).toBeFocused();
  await expect(page).toHaveURL(/#orders$/);
  await expect(page.locator('.order-card')).toHaveCount(1);
  await expect(page.locator('.order-detail-pane')).toHaveCount(0);
  await expect(orderCard(page, 'DEMO-261001')).toBeVisible();
});

test('completed transport exposes sample documents and five completed steps in the list', async ({ page }) => {
  await page.goto('./#orders');
  await filterOrders(page, 'completed');
  await orderCard(page, 'DEMO-260903').getByRole('button', { name: 'Zobacz zlecenie', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Dostawa zakończona', exact: true })).toBeVisible();
  await expect(page.locator('.route-map')).toHaveCount(0);
  await expect(page.locator('.journey .done')).toHaveCount(5);
  await expect(page.locator('.delivery-card')).toContainText('Dojazd na rozładunek');
  const cmr = page.getByRole('button', { name: 'CMR', exact: true });
  await cmr.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('heading', { name: 'CMR', exact: true })).toBeVisible();
  await expect(dialog).toContainText('CMR · demo');
  await expect(dialog).toContainText('DEMO-260903');
  await page.keyboard.press('Escape');
  await expect(cmr).toBeFocused();
});

test('documents are available during transport and estimated progress is explicit', async ({ page }) => {
  await page.goto('./#tracking\/DEMO-261001');
  await expect(page.locator('.delivery-card')).toContainText('Godzina szacunkowa');
  await expect(page.locator('.journey [aria-current="step"]')).toContainText('W drodze na rozładunek');
  const progress = page.getByRole('progressbar', { name: 'Szacunkowy postęp transportu', exact: true });
  await expect(progress).toHaveAttribute('aria-valuenow', '75');
  for (const name of ['CMR', 'Zdjęcie załadunku']) {
    const document = page.getByRole('button', { name, exact: true });
    await document.click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('heading', { name, exact: true })).toBeVisible();
    await expect(dialog).toContainText('DEMO-261001');
    await page.keyboard.press('Escape');
    await expect(document).toBeFocused();
  }
});

test('missing GPS and documents preserve separate planned load and unload arrival times', async ({ page }) => {
  await page.goto('./#tracking\/DEMO-261002');
  await expect(page.locator('.map-footer')).toContainText('Pozycja GPS niedostępna');
  await expect(page.locator('.route-map')).toHaveAttribute('aria-label', /Brak pozycji GPS/);
  await expect(page.locator('.delivery-estimate strong')).toHaveText('10:00');
  await expect(page.locator('.delivery-card')).toContainText('Brak bieżącej pozycji GPS');
  await expect(page.locator('.delivery-other')).toContainText('Przewidywany dojazd na rozładunek');
  await expect(page.locator('.delivery-other strong')).toHaveText('11:0008.10.2026');
  await expect(page.locator('.documents-card')).toContainText('Dokumenty w przygotowaniu');
  await expect(page.locator('.documents-card button')).toHaveCount(0);
  await expect(page.getByRole('progressbar')).toHaveCount(0);
});

test('schematic map zoom is bounded and reset and order switching restore the whole route', async ({ page }) => {
  await page.goto('./#tracking\/DEMO-261001');
  const map = page.locator('.route-map');
  const zoomIn = page.getByRole('button', { name: 'Przybliż mapę', exact: true });
  const zoomOut = page.getByRole('button', { name: 'Oddal mapę', exact: true });
  await expect(zoomOut).toBeDisabled();
  await expect(map).toHaveAttribute('viewBox', '0 0 900 550');
  await zoomIn.click();
  expect(Number((await map.getAttribute('viewBox')).split(' ')[2])).toBeLessThan(900);
  await expect(zoomOut).toBeEnabled();
  for (let step = 0; step < 3; step++) await zoomIn.click();
  await expect(zoomIn).toBeDisabled();
  await page.getByRole('button', { name: 'Pokaż całą trasę', exact: true }).click();
  await expect(map).toHaveAttribute('viewBox', '0 0 900 550');
  await expect(zoomOut).toBeDisabled();
  await expect(zoomIn).toBeEnabled();
  await zoomIn.click();
  await orderCard(page, 'DEMO-261002').locator('.order-option').click();
  await expect(page.locator('.order-detail-pane')).toHaveCount(1);
  await expect(map).toHaveAttribute('viewBox', '0 0 900 550');
});

test('transport details stay collapsed and can be opened with the keyboard', async ({ page }) => {
  await page.goto('./#tracking\/DEMO-261001');
  const details = page.locator('.transport-details');
  const summary = details.locator('summary');
  await expect(details).toHaveJSProperty('open', false);
  await expect(details.getByText('8 palet · 3 200 kg', { exact: true })).not.toBeVisible();
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(details).toHaveJSProperty('open', true);
  await expect(details.getByText('8 palet · 3 200 kg', { exact: true })).toBeVisible();
  await expect(details.getByText('Karlsruhe, DE', { exact: true })).toBeVisible();
  await expect(details.getByText('DEMO-261001', { exact: true })).toBeVisible();
  await expect(details.getByText('Części maszyn', { exact: true })).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(details).toHaveJSProperty('open', false);
  await expect(summary).toBeFocused();
});

test('order search also finds goods and internal numbers while the client number stays primary', async ({ page }) => {
  await page.goto('./#orders');
  const search = page.getByRole('searchbox', { name: 'Szukaj zlecenia po numerze, mieście lub rejestracji', exact: true });
  await search.fill('opakowania');
  await expect(page.locator('.order-card')).toHaveCount(1);
  await expect(page.locator('.order-reference strong')).toHaveText('AMG-DEMO-02');
  await search.fill('DEMO-261001');
  await expect(page.locator('.order-card')).toHaveCount(1);
  await expect(page.locator('.order-reference strong')).toHaveText('AMG-DEMO-01');
  await expect(page.locator('.order-card')).not.toContainText('DEMO-261001');
  await search.fill('demo 002');
  await expect(page.locator('.order-card')).toHaveCount(1);
  await expect(page.locator('.vehicle-plate')).toHaveText('DEMO 002');
});


test('goods, weight, pallets and registration are prominent above the map without opening details', async ({ page, isMobile }) => {
  await page.goto('./#tracking\/DEMO-261001');
  const facts = page.getByRole('region', { name: 'Ładunek i pojazd', exact: true });
  await expect(facts).toBeVisible();
  await expect(facts.locator('.detail-goods strong')).toHaveText('Części maszyn');
  await expect(facts).toContainText(/3\s200 kg/);
  await expect(facts).toContainText('8 palet');
  await expect(facts.locator('.vehicle-plate')).toHaveText('DEMO 001');
  await expect(page.locator('.transport-details')).toHaveJSProperty('open', false);
  const cargo = await facts.boundingBox();
  const map = await page.locator('.map-card').boundingBox();
  expect(cargo.y + cargo.height).toBeLessThan(map.y);
  if (!isMobile) {
    expect(cargo.y + cargo.height).toBeLessThan(page.viewportSize().height);
    expect(map.y + map.height).toBeLessThanOrEqual(page.viewportSize().height);
  }
});

test('list and detail scroll independently while the next order remains accessible', async ({ page, isMobile }) => {
  await page.goto('./#tracking\/DEMO-261001');
  await filterOrders(page, 'all');
  const list = page.locator('#order-results');
  const pane = page.locator('#order-detail');
  const before = await list.boundingBox();
  await pane.evaluate(el => { el.scrollTop = el.scrollHeight; });
  expect(await pane.evaluate(el => el.scrollTop)).toBeGreaterThan(0);
  const after = await list.boundingBox();
  expect(after.y).toBeCloseTo(before.y, 1);
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
  const sizes = await list.evaluate(el => ({
    height: el.clientHeight, scrollHeight: el.scrollHeight,
    width: el.clientWidth, scrollWidth: el.scrollWidth,
  }));
  if (isMobile) expect(sizes.scrollWidth).toBeGreaterThan(sizes.width);
  else expect(sizes.scrollHeight).toBeGreaterThan(sizes.height);
  await orderCard(page, 'DEMO-261002').locator('.order-option').click();
  await expect(page).toHaveURL(/#tracking\/DEMO-261002$/);
  expect(await pane.evaluate(el => el.scrollTop)).toBe(0);
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
  await expect(page.locator('.compact-card')).toHaveCount(5);
});

test('arrow and boundary keys switch the selected transport without leaving the list', async ({ page }) => {
  await page.goto('./#tracking\/DEMO-261002');
  await filterOrders(page, 'all');
  await orderCard(page, 'DEMO-261002').locator('.order-option').focus();
  await page.keyboard.press('ArrowDown');
  await expect(page).toHaveURL(/#tracking\/DEMO-261001$/);
  await expect(orderCard(page, 'DEMO-261001').locator('.order-option')).toBeFocused();
  await expect(page.locator('#order-detail .detail-goods')).toContainText('Części maszyn');
  await page.keyboard.press('End');
  await expect(page).toHaveURL(/#tracking\/DEMO-260905$/);
  await expect(page.locator('#order-detail .vehicle-plate')).toHaveText('DEMO 005');
  await page.keyboard.press('Home');
  await expect(page).toHaveURL(/#tracking\/DEMO-261002$/);
  await expect(page.locator('#order-detail .vehicle-plate')).toHaveText('DEMO 002');
  await expect(page.locator('.compact-card')).toHaveCount(5);
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
});

test('contact remains accessible from the header on desktop and phone', async ({ page }) => {
  await page.goto('./#orders');
  const contact = page.locator('.topbar').getByRole('button', { name: 'Kontakt z AMG', exact: true });
  await contact.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('heading', { name: 'Jesteśmy po drodze.', exact: true })).toBeVisible();
  await expect(dialog).toContainText('hello@amg-trans.eu');
  await page.keyboard.press('Escape');
  await expect(contact).toBeFocused();
});

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

test('reward categories, detail and temporary goal selection', async ({ page }) => {
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
  const speaker = cards.filter({ has: page.getByRole('heading', { name: 'Głośnik przenośny', exact: true }) });
  await expect(speaker.locator('.goal-label')).toHaveText('Twój cel');
  await expect(speaker.getByRole('button')).toBeFocused();
  await page.reload();
  await expect(speaker.locator('.goal-label')).toHaveCount(0);
  await expect(cards.filter({ hasText: 'Słuchawki bezprzewodowe' }).locator('.goal-label')).toHaveText('Twój cel');
});

test('the three primary tabs remain available and rewards have their own subnavigation', async ({ page }) => {
  await page.goto('./');
  for (const view of ['invoices', 'rewards', 'orders']) {
    const tab = page.locator(`.primary-nav [data-view="${view}"]`);
    await expect(tab).toBeVisible();
    await navigate(page, view);
    await expect(tab).toHaveAttribute('aria-current', 'page');
  }
  await navigate(page, 'rewards');
  await page.getByRole('button', { name: 'Twoje punkty AMG Miles', exact: true }).click();
  const balance = page.getByRole('dialog');
  await expect(balance.getByRole('heading', { name: 'Twoje punkty AMG Miles.', exact: true })).toBeVisible();
  await balance.getByRole('button', { name: 'Historia punktów', exact: true }).click();
  await expect(page).toHaveURL(/#history$/);
  await expect(page.locator('.history-row')).toHaveCount(3);
  await navigate(page, 'rewards');
  await page.getByRole('navigation', { name: 'Program AMG Miles', exact: true }).getByRole('button', { name: 'Moje nagrody', exact: true }).click();
  await expect(page).toHaveURL(/#claims$/);
  await expect(page.getByRole('heading', { name: 'Pierwsza nagroda jeszcze przed Tobą', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Przejdź do katalogu', exact: true }).click();
  await expect(page.locator('.reward-card')).toHaveCount(6);
  await expect(page.locator('.primary-nav [data-view="rewards"]')).toHaveAttribute('aria-current', 'page');
});

test('the keyboard skip link focuses content without changing the route', async ({ page }) => {
  await page.goto('./#invoices');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Przejdź do treści', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main-content')).toBeFocused();
  await expect(page).toHaveURL(/#invoices$/);
  await expect(page.locator('#invoice-results tbody tr')).toHaveCount(6);
});

test('old dashboard and unknown tracking links fall back to the order list', async ({ page }) => {
  for (const hash of ['overview', 'tracking/unknown-order']) {
    await page.goto(`./#${hash}`);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Twoje zlecenia.');
    await expect(page.locator('.order-card')).toHaveCount(2);
  }
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
