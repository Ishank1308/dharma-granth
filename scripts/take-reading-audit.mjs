import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1.5,
  });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:3000/...');
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);

  // Scroll to featured scriptures section
  const featuredHeading = page.locator('#featured-scriptures-heading').first();
  await featuredHeading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  console.log('Capturing featured scriptures section...');
  await page.screenshot({ path: 'C:/Users/ishan/.gemini/antigravity/brain/736be2c8-fe74-433a-9134-2aa663f2178e/audit_featured_section.png' });

  // Now go to Gita Chapter 2
  console.log('Navigating to /scripture/bhagavadgita/chapter/2/...');
  await page.goto('http://localhost:3000/scripture/bhagavadgita/chapter/2/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  console.log('Capturing Gita Chapter 2 Hero...');
  await page.screenshot({ path: 'C:/Users/ishan/.gemini/antigravity/brain/736be2c8-fe74-433a-9134-2aa663f2178e/audit_gita_ch2_hero.png' });

  // Scroll to Verse 1
  const verse1 = page.locator('#verse-1').first();
  await verse1.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  console.log('Capturing Gita Chapter 2 Verse 1...');
  await page.screenshot({ path: 'C:/Users/ishan/.gemini/antigravity/brain/736be2c8-fe74-433a-9134-2aa663f2178e/audit_gita_ch2_verses.png' });

  await browser.close();
  console.log('Done!');
}

run().catch((err) => {
  console.error('Audit failed:', err);
  process.exit(1);
});
