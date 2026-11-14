import { expect, test } from '@playwright/test';

test('a shared Panchang day restores the date, city and timings in a fresh browser', async ({ page, browser, baseURL }) => {
  const date = '2027-02-06';
  const city = 'mumbai';
  const calendarPath = '/panchang/calendar/';
  const muhurtaPath = '/panchang/muhurta/';
  const shareData: ShareData[] = [];

  await page.exposeFunction('capturePanchangShare', (data: ShareData) => { shareData.push(data); });
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: Reflect.get(window, 'capturePanchangShare'),
    });
  });

  await page.goto(`${calendarPath}?date=${date}`);
  const openMuhurta = page.getByRole('link', { name: 'मुहूर्त Muhurta', exact: true });
  await expect(openMuhurta).toHaveAttribute('href', new RegExp(`[?]date=${date}&city=`));
  await page.getByRole('combobox', { name: 'Location' }).selectOption(city);
  await page.getByRole('button', { name: /Share this day/ }).click();
  await expect.poll(() => shareData[0]?.url).toBe(new URL(`${calendarPath}?date=${date}&city=${city}`, baseURL).href);

  await openMuhurta.click();
  await expect(page.getByLabel(/Choose city/)).toHaveValue(city);
  await expect(page.getByLabel(/Choose date/)).toHaveValue(date);
  await expect(page.getByRole('heading', { name: new RegExp(date) })).toBeVisible();
  const daylight = page.getByRole('region', { name: /Daylight timeline/ });
  await expect(daylight.getByRole('heading', { name: /Rahu Kalam/ })).toBeVisible();
  const timings = await daylight.innerText();
  await page.getByRole('button', { name: /Share this day/ }).click();
  await expect.poll(() => shareData[1]?.url).toBe(new URL(`${muhurtaPath}?date=${date}&city=${city}`, baseURL).href);

  const recipient = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  try {
    const fresh = await recipient.newPage();
    await fresh.goto(shareData[1].url!);
    await expect(fresh.getByLabel(/Choose city/)).toHaveValue(city);
    await expect(fresh.getByLabel(/Choose date/)).toHaveValue(date);
    await expect(fresh.getByRole('region', { name: /Daylight timeline/ })).toHaveText(timings, { useInnerText: true });

    await fresh.getByRole('link', { name: /Monthly calendar/ }).click();
    await expect(fresh.getByRole('combobox', { name: 'Location' })).toHaveValue(city);
    const dayLink = fresh.getByRole('link', { name: 'मुहूर्त Muhurta', exact: true });
    await expect(dayLink).toHaveAttribute('href', `${muhurtaPath}?date=${date}&city=${city}`);

    await fresh.goto(shareData[0].url!);
    await expect(fresh.getByRole('combobox', { name: 'Location' })).toHaveValue(city);
    await expect(dayLink).toHaveAttribute('href', `${muhurtaPath}?date=${date}&city=${city}`);
  } finally {
    await recipient.close();
  }
});
