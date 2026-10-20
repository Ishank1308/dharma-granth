/**
 * Tells IndexNow (Bing, Yandex and others) which pages changed in this deploy. Run after a successful deploy.
 *
 *   node scripts/seo/indexnow.mjs            # dry run: prints what would be sent
 *   node scripts/seo/indexnow.mjs --send     # submits
 *
 * "Changed" means a sitemap <lastmod> within the last DAYS days. Sitemap dates come from git history
 * (lib/content-dates.ts), so only pages whose source really changed are submitted. The key file is
 * public/<KEY>.txt and is served at https://dharmagranth.in/<KEY>.txt.
 */
import fs from 'node:fs';
import path from 'node:path';

const KEY = 'fa298db023656200e497147438ebcbf0';
const HOST = 'dharmagranth.in';
const DAYS = 3;
const LIMIT = 10000; // IndexNow accepts up to 10,000 URLs per request
const send = process.argv.includes('--send');

const dist = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..', '..', 'dist');
const since = Date.now() - DAYS * 24 * 3600 * 1000;
const urls = [];
for (const f of fs.readdirSync(dist).filter((x) => /^sitemap-.*\.xml$/.test(x))) {
  const xml = fs.readFileSync(path.join(dist, f), 'utf8');
  for (const m of xml.matchAll(/<url>\s*<loc>([^<]+)<\/loc>(?:\s*<lastmod>([^<]+)<\/lastmod>)?/g)) {
    if (m[2] && Date.parse(m[2]) >= since) urls.push(m[1].trim());
  }
}
console.log(`IndexNow: ${urls.length} URL(s) changed in the last ${DAYS} days`);
if (!urls.length) process.exit(0);
const body = { host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls.slice(0, LIMIT) };
if (!send) {
  console.log('Dry run; first URLs:', body.urlList.slice(0, 5));
  process.exit(0);
}
const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(body),
});
// 200 and 202 are success; a failure must not fail the deploy, so report and exit 0.
console.log(`IndexNow responded ${res.status} for ${body.urlList.length} URL(s)`);
