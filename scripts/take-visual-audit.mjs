import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1.5,
  });
  const page = await context.newPage();

  // 1. Home page hero and 3D centerpiece
  console.log('Navigating to http://localhost:3000/...');
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);

  console.log('Capturing home hero...');
  await page.screenshot({ path: 'C:/Users/ishan/.gemini/antigravity/brain/736be2c8-fe74-433a-9134-2aa663f2178e/audit_home_hero.png' });

  // Centerpiece closeup
  const centerpiece = page.locator('text=सनातन ज्ञान कोश').locator('..').locator('..');
  console.log('Capturing hero full section...');
  await page.screenshot({
    path: 'C:/Users/ishan/.gemini/antigravity/brain/736be2c8-fe74-433a-9134-2aa663f2178e/audit_hero_full.png',
  });

  // Scroll down to featured scriptures
  await page.evaluate(() => window.scrollBy(0, 1100));
  await page.waitForTimeout(1500);
  console.log('Capturing featured scriptures...');
  await page.screenshot({ path: 'C:/Users/ishan/.gemini/antigravity/brain/736be2c8-fe74-433a-9134-2aa663f2178e/audit_featured_3d.png' });

  // Scroll to verse of the day
  await page.evaluate(() => window.scrollBy(0, 800));
  await page.waitForTimeout(1500);
  console.log('Capturing verse of the day...');
  await page.screenshot({ path: 'C:/Users/ishan/.gemini/antigravity/brain/736be2c8-fe74-433a-9134-2aa663f2178e/audit_votd.png' });

  await browser.close();
  console.log('Screenshots captured successfully!');
}

run().catch((err) => {
  console.error('Audit failed:', err);
  process.exit(1);
});
