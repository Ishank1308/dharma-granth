// Serve the static export in dist/ like a static host would (directory
// index.html, trailing slashes, 404.html), for testing production builds:
//   npm run build && node scripts/serve-dist.mjs   → http://localhost:4173
import { createServer } from 'node:http';
import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';

const ROOT = resolve(process.cwd(), 'dist');
const PORT = Number(process.env.PORT) || 4173;
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.mp3': 'audio/mpeg',
};

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

// Apply dist/_headers like Cloudflare Pages does (path patterns with `*`),
// so the Content-Security-Policy can be tested locally.
function loadHeaderRules() {
  const file = join(ROOT, '_headers');
  if (!existsSync(file)) return [];
  const rules = [];
  let current = null;
  for (const raw of readFileSync(file, 'utf8').split(/\r?\n/)) {
    if (!raw.trim() || raw.trim().startsWith('#')) continue;
    if (!/^\s/.test(raw)) {
      const pattern = new RegExp(`^${raw.trim().replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')}$`);
      current = { pattern, headers: {} };
      rules.push(current);
    } else if (current) {
      const i = raw.indexOf(':');
      if (i > 0) current.headers[raw.slice(0, i).trim()] = raw.slice(i + 1).trim();
    }
  }
  return rules;
}
const headerRules = loadHeaderRules();
const headersFor = (path) =>
  Object.assign({}, ...headerRules.filter((r) => r.pattern.test(path)).map((r) => r.headers));

createServer((req, res) => {
  const url = req.url ?? '/';
  // Directory URLs without a slash redirect, as GitHub Pages does.
  const pathOnly = url.split('?')[0];
  const hasKnownAssetExt = /\.(html|js|css|json|svg|png|webp|jpg|jpeg|ico|woff2|woff|txt|xml|webmanifest|mp3)$/i.test(pathOnly);
  if (!pathOnly.endsWith('/') && (!extname(pathOnly) || !hasKnownAssetExt) && existsSync(join(ROOT, pathOnly, 'index.html'))) {
    res.writeHead(301, { Location: `${pathOnly}/` });
    res.end();
    return;
  }
  const file = resolveFile(url);
  const status = file ? 200 : 404;
  const fallback404 = join(ROOT, '404.html');
  const target = file ?? (existsSync(fallback404) ? fallback404 : null);
  if (!target) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not Found');
    return;
  }
  res.writeHead(status, {
    ...headersFor(pathOnly),
    'Content-Type': TYPES[extname(target)] ?? 'application/octet-stream',
    'Cache-Control': 'no-cache',
  });
  createReadStream(target).pipe(res);
}).listen(PORT, () => console.log(`Serving ${ROOT} on http://localhost:${PORT}`));
