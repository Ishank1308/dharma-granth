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

function startServer(port = 4569) {
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

async function capture() {
  const port = 4569;
  const srv = await startServer(port);
  const browser = await chromium.launch({ headless: true });

  const viewports = [
    { name: '320px', width: 320, height: 640 },
    { name: '390px', width: 390, height: 844 },
  ];

  for (const vp of viewports) {
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2,
    });

    const url = `http://localhost:${port}/scripture/bhagavadgita/chapter/2/verse/47/`;
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    const artifactPath = `C:/Users/ishan/.gemini/antigravity/brain/009495ac-d85e-45fa-965a-271b5a03bc10/screenshots/reader-mobile-${vp.name}.png`;
    await page.screenshot({ path: artifactPath, fullPage: false });
    console.log(`Saved screenshot to ${artifactPath}`);

    // Scroll to bottom and take another screenshot
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    const bottomPath = `C:/Users/ishan/.gemini/antigravity/brain/009495ac-d85e-45fa-965a-271b5a03bc10/screenshots/reader-mobile-${vp.name}-bottom.png`;
    await page.screenshot({ path: bottomPath, fullPage: false });
    console.log(`Saved bottom screenshot to ${bottomPath}`);

    await page.close();
  }

  await browser.close();
  srv.close();
}

capture().catch(console.error);
