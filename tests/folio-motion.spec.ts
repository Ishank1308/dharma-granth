import { expect, test } from '@playwright/test';

// A page at rest must leave the main thread idle. Two things broke that: endless animations
// that kept running on verse panels far off screen, and endless animations of properties the
// compositor cannot run (background-position, border-radius), which repaint every frame.

/** Endless animations on the page, as [name, animated properties, whether the target is a live verse panel]. */
function endlessAnimations() {
  const ignore = new Set(['offset', 'computedOffset', 'easing', 'composite']);
  return document.getAnimations().flatMap((animation) => {
    const effect = animation.effect as KeyframeEffect | null;
    if (!effect || animation.playState !== 'running' || effect.getComputedTiming().iterations !== Infinity) return [];
    const properties = [...new Set(effect.getKeyframes().flatMap((frame) => Object.keys(frame)))].filter((p) => !ignore.has(p));
    const folio = effect.target?.closest('.verse-folio') ?? null;
    return [{
      name: (animation as CSSAnimation).animationName ?? '',
      properties,
      onFolio: folio !== null,
      live: folio?.hasAttribute('data-live') ?? false,
    }];
  });
}

test('only the verse panels near the viewport animate their chapter photo', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/scripture/bhagavadgita/chapter/2/');
  await expect(page.locator('.verse-folio[data-live]').first()).toBeVisible();

  // Read the whole chapter, then stop in the middle of it.
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let top = 0; top < height; top += 800) {
    await page.evaluate((y) => window.scrollTo(0, y), top);
    await page.waitForTimeout(50);
  }
  await page.evaluate((y) => window.scrollTo(0, y), Math.round(height / 2));
  await expect(page.locator('.verse-folio[data-live]').first()).toBeVisible();
  await page.waitForTimeout(500);

  const panels = await page.locator('.verse-folio').count();
  const live = await page.locator('.verse-folio[data-live]').count();
  expect(panels).toBeGreaterThan(20);
  expect(live).toBeGreaterThan(0);
  expect(live).toBeLessThanOrEqual(8);

  const animations = (await page.evaluate(endlessAnimations)).filter((a) => a.onFolio);
  expect(animations.length).toBeGreaterThan(0);
  expect(animations.filter((a) => !a.live)).toEqual([]);
  // The photo's drift, its light and the sunbeam: transform and opacity only.
  expect(animations.filter((a) => a.properties.some((p) => p !== 'transform' && p !== 'opacity'))).toEqual([]);
});

// On a machine with four cores or fewer and no saved choice, the site switches itself to low-power
// mode when the footer's toggle hydrates, and the Battery API switches it back a moment later
// (lib/performance-mode.ts; about 60ms apart on a four-core machine). The quiet-mode rule stops
// the background for that moment, so one read of the page there finds no animation. The reader's
// own saved choice skips the detection, so each state below is exact on any machine.
const fluid = (animations: ReturnType<typeof endlessAnimations>) => animations.filter((a) => a.name.startsWith('fluid-'));

test('the home page background animates on the compositor only', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('dharma.perf.lowPower', 'false'));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('.prana-fluid-stage')).toBeAttached();
  const blobs = fluid(await page.evaluate(endlessAnimations));
  expect(blobs.length).toBeGreaterThan(0);
  expect(blobs.filter((a) => a.properties.some((p) => p !== 'transform' && p !== 'opacity'))).toEqual([]);
});

test('low-power mode stops the home page background', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('dharma.perf.lowPower', 'true'));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('.prana-fluid-stage')).toBeAttached();
  await expect(page.locator('html')).toHaveAttribute('data-low-power', 'true');
  expect(fluid(await page.evaluate(endlessAnimations))).toEqual([]);
});
