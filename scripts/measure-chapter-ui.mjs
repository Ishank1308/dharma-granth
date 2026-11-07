import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { existsSync, statSync, createReadStream } from 'node:fs';
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

function startServer(port = 4568) {
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

async function measureChapter() {
  const port = 4568;
  const srv = await startServer(port);
  const browser = await chromium.launch({ headless: true });
  const viewports = [
    { name: 'Mobile Narrow (320px)', width: 320, height: 640 },
    { name: 'Mobile Standard (390px)', width: 390, height: 844 },
    { name: 'Desktop (1280px)', width: 1280, height: 800 },
  ];

  for (const vp of viewports) {
    console.log(`\n=== Measuring Chapter View at ${vp.name} ===`);
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2,
    });

    const chapterUrl = `http://localhost:${port}/scripture/bhagavadgita/chapter/2/`;
    await page.goto(chapterUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    const metrics = await page.evaluate(() => {
      const data = {};
      data.scrollWidth = document.documentElement.scrollWidth;
      data.clientWidth = document.documentElement.clientWidth;
      data.hasHorizontalOverflow = data.scrollWidth > data.clientWidth;

      // Reader control bar & settings
      const controlBar = document.querySelector('section[aria-label*="Reading controls"]') || document.querySelector('section[aria-label*="पठन नियंत्रण"]');
      if (controlBar) {
        const rect = controlBar.getBoundingClientRect();
        data.controlBar = {
          visible: rect.height > 0,
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        };
      }

      // Verse cards
      const verseCards = Array.from(document.querySelectorAll('article.verse-card'));
      data.verseCardCount = verseCards.length;
      if (verseCards[0]) {
        const rect = verseCards[0].getBoundingClientRect();
        data.firstVerseCard = {
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        };
      }

      // Check small touch targets on chapter page
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
      data.smallTouchTargetsCount = smallTargets.length;
      data.sampleSmallTargets = smallTargets.slice(0, 8);

      // Check fixed floating elements on chapter page
      const allElements = Array.from(document.querySelectorAll('*'));
      const fixedFloating = [];
      allElements.forEach((el) => {
        const style = window.getComputedStyle(el);
        if ((style.position === 'fixed' || style.position === 'sticky') && style.display !== 'none') {
          const rect = el.getBoundingClientRect();
          if (rect.height > 0 && rect.width > 0) {
            fixedFloating.push({
              tag: el.tagName,
              position: style.position,
              top: rect.top,
              bottom: rect.bottom,
              height: Math.round(rect.height),
              className: (el.className || '').slice(0, 50),
              ariaLabel: el.getAttribute('aria-label'),
            });
          }
        }
      });
      data.fixedOrStickyElements = fixedFloating;

      return data;
    });

    console.log(JSON.stringify(metrics, null, 2));
    await page.close();
  }

  await browser.close();
  srv.close();
}

measureChapter().catch(console.error);

