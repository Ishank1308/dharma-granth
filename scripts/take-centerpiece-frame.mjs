import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1080 },
    deviceScaleFactor: 1.5,
  });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:3000/...');
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);

  // Scroll slightly down to frame the 3D book centerpiece perfectly in view
  await page.evaluate(() => window.scrollBy(0, 320));
  await page.waitForTimeout(1000);

  console.log('Capturing framed 3D centerpiece...');
  await page.screenshot({ path: 'C:/Users/ishan/.gemini/antigravity/brain/736be2c8-fe74-433a-9134-2aa663f2178e/audit_centerpiece_framed.png' });

  // Hover over the 3D book to demonstrate tilt effect
  const book = page.locator('text=श्रीमद्भगवद्गीता').first();
  const box = await book.boundingBox();
  if (box) {
    await page.mouse.move(box.x + box.width * 0.8, box.y + box.height * 0.2);
    await page.waitForTimeout(800);
    console.log('Capturing tilted 3D book...');
    await page.screenshot({ path: 'C:/Users/ishan/.gemini/antigravity/brain/736be2c8-fe74-433a-9134-2aa663f2178e/audit_centerpiece_tilted.png' });
  }

  await browser.close();
  console.log('Captured framed centerpiece!');
}

run().catch((err) => {
  console.error('Audit failed:', err);
  process.exit(1);
});
