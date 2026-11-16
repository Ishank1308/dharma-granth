import { expect, test } from '@playwright/test';

const url = '/ashtavakra/1/3/';
const prefix = 'ash-1-3';
const order = ['arth', 'vyakhya', 'modern', 'reflection'] as const;

test('Ashtavakra verse follows the shared Sanskrit-first knowledge-tree reading order', async ({ page }) => {
  await page.goto(url);
  const source = page.locator(`#${prefix}-verse`);
  const tree = page.getByRole('group', { name: 'अष्टावक्र गीता · श्लोक अध्ययन वृक्ष' });
  await expect(source).toBeVisible();
  await expect(source.locator('p[lang="sa"]').first()).not.toBeEmpty();
  await expect(tree).toBeVisible();

  const sections = await page.evaluate((id) => {
    const selectors = ['verse', 'arth', 'vyakhya', 'modern', 'reflection', 'related'];
    return selectors.map((section) => {
      const element = document.getElementById(`${id}-${section}`);
      return element ? Array.from(document.querySelectorAll('*')).indexOf(element) : -1;
    });
  }, prefix);
  expect(sections.every((position) => position >= 0)).toBe(true);
  expect(sections).toEqual([...sections].sort((a, b) => a - b));

  for (const step of order) {
    const node = page.locator(`#${prefix}-${step}`);
    await expect(node.locator('details').first()).toHaveAttribute('open', '');
  }
  await expect(page.locator(`#${prefix}-related`)).toBeVisible();
  await expect(page.locator(`#${prefix}-sources`)).toContainText('स्रोत');
});

test('study guide reopens the appropriate branch after a reader folds it', async ({ page }) => {
  await page.goto(url);
  const node = page.locator(`#${prefix}-vyakhya`);
  const details = node.locator('details').first();
  await expect(details).toHaveAttribute('open', '');
  await details.locator('summary').click();
  await expect(details).not.toHaveAttribute('open', '');

  await page.getByRole('navigation', { name: /Verse study guide/ })
    .getByRole('link', { name: 'व्याख्या · Vyakhya' }).click();
  await expect(page).toHaveURL(/#ash-1-3-vyakhya$/);
  await expect(details).toHaveAttribute('open', '');
});

test('reader font controls resize Ashtavakra Sanskrit and preserve reading width', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto(url);
  const root = page.locator(`#${prefix}`);
  const text = root.locator('.ash-full-sanskrit');
  await expect(text).toBeVisible();
  await expect(root).toHaveAttribute('data-ash-verse-size', 'lg');
  const measure = () => text.evaluate((el) => ({
    size: parseFloat(getComputedStyle(el).fontSize),
    right: el.getBoundingClientRect().right,
    pageWidth: document.documentElement.scrollWidth,
  }));
  const before = await measure();
  expect(before.pageWidth).toBeLessThanOrEqual(321);
  const controls = page.getByRole('group', { name: 'Verse and translation text size' });
  await controls.getByRole('button', { name: 'Decrease verse and translation text size' }).click();
  await expect(root).toHaveAttribute('data-ash-verse-size', 'md');
  const after = await measure();
  expect(after.size).toBeLessThan(before.size);
  await controls.getByRole('button', { name: 'Increase verse and translation text size' }).click();
  await expect(root).toHaveAttribute('data-ash-verse-size', 'lg');
  await page.setViewportSize({ width: 1024, height: 800 });
  const desktop = await measure();
  expect(desktop.size).toBeGreaterThan(before.size);
  expect(desktop.right).toBeLessThanOrEqual(1025);
});

test('Ashtavakra source, meaning and explanations render without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto(url);
    await expect(page.locator(`#${prefix}-verse p[lang="sa"]`).first()).toBeVisible();
    await expect(page.locator(`#${prefix}-arth`)).toContainText('शाब्दिक हिन्दी अर्थ');
    await expect(page.locator(`#${prefix}-vyakhya`)).toBeAttached();
    await expect(page.locator(`#${prefix}-modern`)).toBeAttached();
    await expect(page.locator(`#${prefix}-reflection`)).toBeAttached();
    await expect(page.locator(`#${prefix}-sources`)).toContainText('सत्यापन');
  } finally {
    await context.close();
  }
});

test('Ashtavakra uses the same study structure in Sandhya Light and Ratri Dark', async ({ page }) => {
  for (const theme of ['sunset', 'night'] as const) {
    await page.addInitScript((value) => localStorage.setItem('dharma-theme', value), theme);
    await page.goto(url);
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
    await expect(page.locator(`#${prefix}-verse p[lang="sa"]`).first()).toBeVisible();
    await expect(page.locator(`#${prefix}-arth`)).toBeVisible();
    await expect(page.locator(`#${prefix}-vyakhya`)).toBeVisible();
    await expect(page.locator(`#${prefix}-sources`)).toContainText('स्रोत');
  }
});
