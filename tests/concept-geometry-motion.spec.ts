import { expect, test } from '@playwright/test';

const route = '/concepts/visuals/';
const rotorSelector = '.concept-geometry-rotor';

test('concept mandala runs without React timer, pauses on request, and returns on tab switch', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(route);

  const rotor = page.locator(rotorSelector);
  await rotor.scrollIntoViewIfNeeded();
  await expect(rotor).toHaveAttribute('data-spinning', 'true');
  const readPlayback = async () => rotor.evaluate((el) => getComputedStyle(el).animationPlayState);
  expect(await readPlayback()).toBe('running');

  const toggle = page.getByRole('button', { name: 'मंडला घूर्णन टॉगल करें' });
  await toggle.click();
  await expect(rotor).toHaveAttribute('data-spinning', 'false');
  expect(await readPlayback()).toBe('paused');
  await toggle.click();
  await expect(rotor).toHaveAttribute('data-spinning', 'true');

  await page.getByRole('button', { name: /प्रवाह आरेख/ }).click();
  await expect(rotor).toHaveCount(0);
  await page.getByRole('button', { name: /पवित्र ज्यामिति/ }).click();
  await expect(page.locator(rotorSelector)).toHaveCount(1);
});

test('reduced motion renders a static mandala even after user interaction', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(route);
  const rotor = page.locator(rotorSelector);
  await rotor.scrollIntoViewIfNeeded();
  await expect(rotor).toHaveAttribute('data-spinning', 'false');
  const toggle = page.getByRole('button', { name: 'मंडला घूर्णन टॉगल करें' });
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  const css = await rotor.evaluate((el) => ({
    name: getComputedStyle(el).animationName,
    transform: getComputedStyle(el).transform,
  }));
  expect(css.name).toBe('none');
  expect(css.transform).toBe('none');
  await toggle.click();
  await expect(rotor).toHaveAttribute('data-spinning', 'false');
  await expect(page.getByText(/कम गति की सुविधा सक्रिय है/)).toBeVisible();
});

test('data saver stops decorative rotation without hiding concepts', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(route);
  const rotor = page.locator(rotorSelector);
  await rotor.scrollIntoViewIfNeeded();
  await expect(rotor).toHaveAttribute('data-spinning', 'true');
  await page.evaluate(() => document.documentElement.setAttribute('data-data-saver', 'true'));
  await expect.poll(async () => rotor.evaluate((el) => getComputedStyle(el).animationName)).toBe('none');
  await expect(page.getByRole('button', { name: 'मंडला घूर्णन टॉगल करें' })).toBeVisible();
});
