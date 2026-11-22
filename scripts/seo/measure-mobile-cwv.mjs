/**
 * Measure mobile Core Web Vitals (FCP, LCP, CLS, interaction response latency) and JS transfer weight
 * against the static export in `dist/` across key landing templates (Issue #259).
 *
 * Run: node scripts/seo/measure-mobile-cwv.mjs
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { chromium } from '@playwright/test';

const ROOT = process.cwd();
const DIST = path.join(ROOT, 'dist');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
};

const ROUTES = [
  { label: 'Home', path: '/' },
  { label: 'Scripture Library', path: '/scriptures/' },
  { label: 'Scripture Overview (Gita)', path: '/scripture/bhagavadgita/' },
  { label: 'Chapter Reader (Gita 2)', path: '/scripture/bhagavadgita/chapter/2/' },
  { label: 'Verse Page (Gita 2.47)', path: '/scripture/bhagavadgita/chapter/2/verse/47/' },
  { label: 'Sutra Verse Page (Yoga Sutra 1.2)', path: '/scripture/yogasutra/chapter/1/verse/2/' },
  { label: 'Ask Hub (Search & Q&A)', path: '/ask/' },
];

function startStaticServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const reqUrl = new URL(req.url || '/', 'http://127.0.0.1');
      let pathname = decodeURIComponent(reqUrl.pathname);
      let filePath = path.join(DIST, pathname);
      if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
      } else if (!fs.existsSync(filePath) && fs.existsSync(`${filePath}.html`)) {
        filePath = `${filePath}.html`;
      }
      if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
        res.statusCode = 404;
        res.end('Not found');
        return;
      }
      const ext = path.extname(filePath).toLowerCase();
      res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream');
      res.end(fs.readFileSync(filePath));
    });
    server.listen(0, '127.0.0.1', () => {
      const addr = server.address();
      resolve({ server, origin: `http://127.0.0.1:${addr.port}` });
    });
  });
}

const { server, origin } = await startStaticServer();
const browser = await chromium.launch({ headless: true });
const results = [];

try {
  // Warm up Chromium's font/GPU pipeline once so the first route in ROUTES does not absorb cold browser startup.
  {
    const warmCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
    const warmPage = await warmCtx.newPage();
    await warmPage.goto(`${origin}/`, { waitUntil: 'load' });
    await warmCtx.close();
  }

  for (const route of ROUTES) {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
    });
    const page = await context.newPage();

    let jsRawBytes = 0;
    let jsGzBytes = 0;
    let jsFiles = 0;

    page.on('response', async (resp) => {
      try {
        const url = new URL(resp.url());
        if (url.origin === origin && url.pathname.endsWith('.js') && resp.status() === 200) {
          const body = await resp.body();
          jsFiles += 1;
          jsRawBytes += body.length;
          jsGzBytes += zlib.gzipSync(body).length;
        }
      } catch {
        // Ignore aborted responses
      }
    });

    await page.addInitScript(() => {
      // Skip home splash in session storage so real landing content LCP is measured cleanly
      try {
        sessionStorage.setItem('dharma-splash', '1');
      } catch {}
      window.__cwv = { lcp: 0, cls: 0, fcp: 0 };
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') window.__cwv.fcp = entry.startTime;
        }
      }).observe({ type: 'paint', buffered: true });
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1];
        if (last) window.__cwv.lcp = last.startTime;
      }).observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) window.__cwv.cls += entry.value;
        }
      }).observe({ type: 'layout-shift', buffered: true });
    });

    await page.goto(`${origin}${route.path}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(250);

    // Measure interaction responsiveness (Ctrl+K global search modal open/close latency)
    const inpMs = await page.evaluate(async () => {
      const start = performance.now();
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }));
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      return performance.now() - start;
    });

    // Compute initial upfront <script src> gzipped weight from HTML (excluding viewport <Link> prefetches & SW precache)
    const htmlPath = path.join(DIST, route.path, 'index.html');
    const htmlText = fs.readFileSync(htmlPath, 'utf8');
    const initialSrcs = [
      ...new Set(
        [...htmlText.matchAll(/<script\b([^>]*)>/g)]
          .map((m) => m[1])
          .filter((a) => !/\bnomodule\b/i.test(a))
          .map((a) => a.match(/\bsrc="([^"]+)"/)?.[1])
          .filter(Boolean),
      ),
    ];
    let initialJsGzBytes = 0;
    for (const src of initialSrcs) {
      const rel = src.replace(/^\//, '').split('?')[0];
      const f = path.join(DIST, decodeURIComponent(rel));
      if (fs.existsSync(f)) initialJsGzBytes += zlib.gzipSync(fs.readFileSync(f)).length;
    }

    const metrics = await page.evaluate(() => window.__cwv);
    results.push({
      ...route,
      fcpMs: Math.round(metrics.fcp),
      lcpMs: Math.round(metrics.lcp),
      cls: Number(metrics.cls.toFixed(4)),
      inpProxyMs: Math.round(inpMs),
      initialScripts: initialSrcs.length,
      initialJsGzKb: Math.round(initialJsGzBytes / 1024),
      totalJsGzKb: Math.round(jsGzBytes / 1024),
    });

    await context.close();
  }
} finally {
  await browser.close();
  server.close();
}

const dateStr = new Date().toISOString().slice(0, 10);
const md = [
  '# Mobile Core Web Vitals & JS Payload Baseline',
  '',
  `Measured ${dateStr} by \`scripts/seo/measure-mobile-cwv.mjs\` against static export (\`dist/\`) in headless Chromium (\`390×844\`, DPR 3).`,
  'Note: Local unthrottled loopback measurement isolates layout stability (CLS), render blocking (FCP/LCP), main-thread interaction latency, and gzipped JS payload size. Field 75th-percentile CrUX / Search Console metrics on slow 4G devices will have higher network latency.',
  '',
  '| Template | Route | FCP (ms) | LCP (ms) | CLS | Interaction (ms) | Upfront JS (KB gz) | Total w/ Prefetch (KB gz) |',
  '|---|---|---:|---:|---:|---:|---:|---:|',
  ...results.map(
    (r) =>
      `| ${r.label} | \`${r.path}\` | ${r.fcpMs} | ${r.lcpMs} | ${r.cls} | ${r.inpProxyMs} | ${r.initialJsGzKb} KB (${r.initialScripts}) | ${r.totalJsGzKb} KB |`,
  ),
  '',
];

fs.mkdirSync(path.join(ROOT, 'docs', 'seo'), { recursive: true });
const outPath = path.join(ROOT, 'docs', 'seo', 'mobile-cwv-report.md');
fs.writeFileSync(outPath, md.join('\n'), 'utf8');
for (const line of md) console.log(line);
console.log(`Wrote ${outPath}`);
