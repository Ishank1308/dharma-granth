import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync, createReadStream } from 'node:fs';
import { join, resolve, extname } from 'node:path';

const DIST = resolve(process.cwd(), 'dist');
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
};

function startServer(port = 4567) {
  return new Promise((res) => {
    const srv = createServer((req, resHttp) => {
      let urlPath = decodeURIComponent(req.url.split('?')[0]);
      if (urlPath.endsWith('/')) urlPath += 'index.html';
      let filePath = join(DIST, urlPath);
      if (!existsSync(filePath) && existsSync(filePath + '.html')) filePath += '.html';
      if (!existsSync(filePath) || !statSync(filePath).isFile()) {
        resHttp.writeHead(404);
        resHttp.end('Not found');
        return;
      }
      resHttp.writeHead(200, { 'Content-Type': TYPES[extname(filePath)] || 'application/octet-stream' });
      createReadStream(filePath).pipe(resHttp);
    });
    srv.listen(port, () => res(srv));
  });
}

async function measure() {
  const port = 4567;
  const srv = await startServer(port);
  console.log(`Server started on http://localhost:${port}`);

  const browser = await chromium.launch({ headless: true });
  const viewports = [
    { name: 'Mobile Narrow (320px)', width: 320, height: 640 },
    { name: 'Mobile Standard (390px)', width: 390, height: 844 },
    { name: 'Desktop (1280px)', width: 1280, height: 800 },
  ];

  const results = {};

  for (const vp of viewports) {
    console.log(`\n--- Measuring at ${vp.name} ---`);
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2,
    });

    // Check Verse Reader: BG 2.47
    const verseUrl = `http://localhost:${port}/scripture/bhagavadgita/chapter/2/verse/47/`;
    await page.goto(verseUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    const metrics = await page.evaluate(() => {
      const data = {};

      // 1. Horizontal overflow check
      data.scrollWidth = document.documentElement.scrollWidth;
      data.clientWidth = document.documentElement.clientWidth;
      data.hasHorizontalOverflow = data.scrollWidth > data.clientWidth;

      // 2. Measure bottom sticky bar
      const bottomNav = document.querySelector('nav.apple-bar') || document.querySelector('nav[aria-label="Verse navigation"]');
      if (bottomNav) {
        const rect = bottomNav.getBoundingClientRect();
        data.bottomNav = {
          visible: rect.height > 0 && window.getComputedStyle(bottomNav).display !== 'none',
          height: rect.height,
          bottom: rect.bottom,
          classes: bottomNav.className,
        };
      }

      // 3. Touch targets check (buttons and links)
      const interactives = Array.from(document.querySelectorAll('button, a[href], input, select'));
      const smallTargets = [];
      interactives.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        if (style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0) {
          if (rect.height < 44 || rect.width < 44) {
            smallTargets.push({
              tag: el.tagName,
              text: (el.textContent || '').trim().slice(0, 30),
              width: Math.round(rect.width),
              height: Math.round(rect.height),
              className: (el.className || '').slice(0, 50),
            });
          }
        }
      });
      data.totalInteractives = interactives.length;
      data.smallTouchTargetsCount = smallTargets.length;
      data.sampleSmallTargets = smallTargets.slice(0, 8);

      // 4. Shloka and Meaning obstruction check
      const shloka = document.querySelector('#layer-sanskrit');
      const hindi = document.querySelector('#layer-hindi');
      const bottomNavEl = document.querySelector('nav.apple-bar');
      if (shloka && bottomNavEl) {
        const sRect = shloka.getBoundingClientRect();
        const bRect = bottomNavEl.getBoundingClientRect();
        data.shlokaObscured = sRect.bottom > bRect.top && sRect.top < bRect.bottom;
      }
      if (hindi && bottomNavEl) {
        const hRect = hindi.getBoundingClientRect();
        const bRect = bottomNavEl.getBoundingClientRect();
        data.hindiObscured = hRect.bottom > bRect.top && hRect.top < bRect.bottom;
      }

      // 5. Main container bottom padding vs bottom nav height
      const main = document.querySelector('main');
      if (main) {
        const computed = window.getComputedStyle(main);
        data.mainPaddingBottom = computed.paddingBottom;
      }

      // 6. Mobile Reading Progress
      const prog = document.querySelector('[aria-label*="पठन प्रगति"]');
      if (prog) {
        const pRect = prog.getBoundingClientRect();
        data.readingProgress = {
          visible: pRect.height > 0 && window.getComputedStyle(prog).display !== 'none',
          height: pRect.height,
          valueText: prog.getAttribute('aria-valuetext'),
        };
      }

      return data;
    });

    results[vp.name] = metrics;
    console.log('Metrics:', JSON.stringify(metrics, null, 2));
    await page.close();
  }

  await browser.close();
  srv.close();
}

measure().catch(err => {
  console.error(err);
  process.exit(1);
});

