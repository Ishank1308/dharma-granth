import { expect, test, type Page } from '@playwright/test';

// Low-power mode, when the reader has not chosen it (lib/performance-mode.ts): where the Battery API
// exists the battery decides; without it, four cores or fewer. It used to switch on from the core count
// at page start and off again when the battery answered 55 to 70 ms later, which stopped and restarted
// the page-start motion. Each case records every change of <html data-low-power> from the first byte.

type Device = { cores: number; battery: 'none' | 'full' | 'low' | 'fails' };

async function lowPowerChanges(page: Page, device: Device) {
  await page.addInitScript(({ cores, battery }) => {
    Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => cores });
    const nav = navigator as unknown as { getBattery?: unknown };
    if (battery === 'none') {
      delete (Navigator.prototype as unknown as { getBattery?: unknown }).getBattery;
      delete nav.getBattery;
    } else {
      const level = battery === 'low' ? 0.1 : 0.9;
      nav.getBattery = () =>
        battery === 'fails'
          ? Promise.reject(new Error('blocked'))
          : Promise.resolve({ level, charging: false, addEventListener: () => {} });
    }
    const seen: Array<string | null> = [];
    (window as unknown as { lowPowerSeen: typeof seen }).lowPowerSeen = seen;
    // <html> may not exist yet when this runs, so watch the document and everything under it.
    new MutationObserver(() => {
      const now = document.documentElement.getAttribute('data-low-power');
      if (seen[seen.length - 1] !== now) seen.push(now);
    }).observe(document, { attributes: true, subtree: true, attributeFilter: ['data-low-power'] });
  }, device);
  await page.goto('/');
  await expect(page.locator('#main-content')).toBeVisible();
  // The footer's toggle hydrates late on a cold page; give detection time to run and settle.
  await page.waitForTimeout(1500);
  return page.evaluate(() => (window as unknown as { lowPowerSeen: Array<string | null> }).lowPowerSeen);
}

test('a four-core phone with a full battery never switches low-power mode on', async ({ page }) => {
  expect(await lowPowerChanges(page, { cores: 4, battery: 'full' })).toEqual([]);
});

test('a low battery switches low-power mode on once', async ({ page }) => {
  expect(await lowPowerChanges(page, { cores: 8, battery: 'low' })).toEqual(['true']);
});

test('without the Battery API, four cores or fewer still choose low-power mode', async ({ page }) => {
  expect(await lowPowerChanges(page, { cores: 4, battery: 'none' })).toEqual(['true']);
});

test('if the battery cannot be read, the core count decides', async ({ page }) => {
  expect(await lowPowerChanges(page, { cores: 2, battery: 'fails' })).toEqual(['true']);
});
