// Lightweight post-deploy smoke test for Dharma Granth static export.
// Verifies HTTP 200, valid HTML content, and absence of React error boundaries.

import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';

const ROOT = resolve(process.cwd(), 'dist');
const PORT = 4174;

const URLS_TO_TEST = [
  '/',
  '/scriptures/',
  '/practice/',
  '/panchang/',
  '/wisdom-for-life/discipline/',
  '/sources/',
  '/methodology/',
  '/scripture/bhagavadgita/chapter/2/verse/47/',
  '/scripture/chandogya/chapter/3/verse/1.3.10/',
];

const ERROR_STRINGS = [
  'पृष्ठ लोड नहीं हो सका',
  'Something went wrong',
  'Application error: a client-side exception has occurred',
  'Minified React error',
];

function resolveFile(urlPath) {
  const clean = normalize(decodeURIComponent(urlPath.split('?')[0])).replace(/^(\.\.[/\\])+/, '');
  const file = join(ROOT, clean);
  if (!file.startsWith(ROOT)) return null;
  if (existsSync(file) && statSync(file).isFile()) return file;
  const index = join(file, 'index.html');
  if (existsSync(index)) return index;
  if (existsSync(`${file}.html`)) return `${file}.html`;
  return null;
}

const server = createServer((req, res) => {
  const url = req.url ?? '/';
  const file = resolveFile(url);
  if (!file) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not Found');
    return;
  }
  const content = readFileSync(file);
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(content);
});

server.listen(PORT, async () => {
  console.log(`[SmokeTest] Static test server running on port ${PORT}...`);
  let hasFailed = false;

  for (const path of URLS_TO_TEST) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}${path}`);
      if (!res.ok) {
        console.error(`❌ [FAIL] ${path} returned HTTP status ${res.status}`);
        hasFailed = true;
        continue;
      }

      const text = await res.text();
      let matchedError = null;
      for (const err of ERROR_STRINGS) {
        if (text.includes(err)) {
          matchedError = err;
          break;
        }
      }

      if (matchedError) {
        console.error(`❌ [FAIL] ${path} contains error boundary marker: "${matchedError}"`);
        hasFailed = true;
      } else {
        console.log(`✅ [PASS] ${path} (HTTP 200, verified clean)`);
      }
    } catch (err) {
      console.error(`❌ [FAIL] Network error requesting ${path}:`, err);
      hasFailed = true;
    }
  }

  server.close(() => {
    if (hasFailed) {
      console.error('\n🚨 Smoke test failed for one or more critical pages.');
      process.exit(1);
    } else {
      console.log('\n🎉 All smoke test URLs passed with HTTP 200 and zero error markers!');
      process.exit(0);
    }
  });
});
