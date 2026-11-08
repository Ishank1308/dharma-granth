#!/usr/bin/env node
/**
 * Propose candidate photos and paintings for each scene in data/scene-photos/manifest.json.
 * Runs each entry's `queries` against Wikimedia Commons, keeps large images that are public
 * domain or CC licensed, and writes for each scene:
 *   data/scene-photos/candidates/<id>.jpg   a numbered contact sheet of up to 8 candidates
 *   data/scene-photos/candidates.json       the Commons file, licence and author of each
 * A person (or Claude) looks at the sheets and copies the chosen file into the manifest's
 * `file`; scripts/build-scene-photos.mjs then fetches and compresses it.
 *
 *   node scripts/find-scene-photos.mjs              every scene still without a file
 *   node scripts/find-scene-photos.mjs ganga lamp   only these scenes
 *
 * Network: commons.wikimedia.org and upload.wikimedia.org (GitHub Actions: .github/workflows/scene-photos.yml).
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const MANIFEST = path.join(root, 'data/scene-photos/manifest.json');
const OUT_DIR = path.join(root, 'data/scene-photos/candidates');
const OUT_JSON = path.join(root, 'data/scene-photos/candidates.json');
const API = 'https://commons.wikimedia.org/w/api.php';
const UA = 'DharmaGranthSceneBuilder/1.0 (https://dharmagranth.dev)';
const FREE = /(public domain|^pd\b|^pd-|cc0|^cc[ -]by(-sa)?[ -]?\d|^cc[ -]by(-sa)?$)/i;
const PER_SCENE = 8;
const MIN_WIDTH = 1200;
const THUMB = 360;

const stripHtml = (s = '') => s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(params) {
  const url = new URL(API);
  url.search = new URLSearchParams({ format: 'json', ...params }).toString();
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(url, { headers: { 'user-agent': UA } });
    if (res.ok) return res.json();
    await sleep(1500 * (attempt + 1));
  }
  throw new Error(`Commons API failed: ${url}`);
}

async function search(query) {
  const data = await api({
    action: 'query',
    generator: 'search',
    gsrsearch: `${query} filetype:bitmap`,
    gsrnamespace: '6',
    gsrlimit: '12',
    prop: 'imageinfo',
    iiprop: 'url|size|extmetadata|mime',
    iiurlwidth: String(THUMB * 2),
  });
  return Object.values(data.query?.pages ?? {})
    .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
    .map((page) => {
      const info = page.imageinfo?.[0];
      if (!info) return null;
      const meta = info.extmetadata ?? {};
      return {
        file: page.title,
        width: info.width,
        height: info.height,
        mime: info.mime,
        thumb: info.thumburl,
        license: stripHtml(meta.LicenseShortName?.value ?? ''),
        author: stripHtml(meta.Artist?.value ?? ''),
        description: stripHtml(meta.ImageDescription?.value ?? '').slice(0, 160),
        source: info.descriptionurl,
      };
    })
    .filter(Boolean)
    .filter((c) => /jpe?g|png|webp|tiff/.test(c.mime) && c.width >= MIN_WIDTH && c.width >= c.height * 0.9 && FREE.test(c.license));
}

function label(n, text) {
  const safe = text.replace(/[<&>]/g, '').slice(0, 46);
  return Buffer.from(
    `<svg width="${THUMB}" height="44" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="rgba(0,0,0,0.72)"/>` +
      `<text x="10" y="28" font-family="sans-serif" font-size="22" font-weight="700" fill="#ffd27a">${n}</text>` +
      `<text x="40" y="27" font-family="sans-serif" font-size="13" fill="#fff">${safe}</text></svg>`,
  );
}

async function sheet(id, candidates) {
  const cell = { w: THUMB, h: Math.round(THUMB * 0.62) };
  const cols = 4;
  const rows = Math.ceil(candidates.length / cols) || 1;
  const tiles = [];
  for (const [i, c] of candidates.entries()) {
    try {
      const res = await fetch(c.thumb, { headers: { 'user-agent': UA } });
      const img = await sharp(Buffer.from(await res.arrayBuffer())).resize(cell.w, cell.h, { fit: 'cover' }).jpeg().toBuffer();
      const left = (i % cols) * cell.w;
      const top = Math.floor(i / cols) * cell.h;
      tiles.push({ input: img, left, top }, { input: label(i + 1, `${c.license} · ${c.file.replace(/^File:/, '')}`), left, top: top + cell.h - 44 });
    } catch (err) {
      console.warn(`${id} #${i + 1}: ${err.message}`);
    }
  }
  await sharp({ create: { width: cols * cell.w, height: rows * cell.h, channels: 3, background: '#111' } })
    .composite(tiles)
    .jpeg({ quality: 78 })
    .toFile(path.join(OUT_DIR, `${id}.jpg`));
}

async function main() {
  const manifest = JSON.parse(await readFile(MANIFEST, 'utf8'));
  const only = process.argv.slice(2);
  await mkdir(OUT_DIR, { recursive: true });
  const out = {};
  for (const [id, entry] of Object.entries(manifest.photos)) {
    if (only.length ? !only.includes(id) : entry.file) continue;
    const seen = new Set();
    const picks = [];
    for (const q of entry.queries ?? []) {
      for (const c of await search(q)) {
        if (seen.has(c.file)) continue;
        seen.add(c.file);
        picks.push({ ...c, query: q });
      }
      await sleep(400);
    }
    // Round-robin across the queries so a sheet mixes paintings and photographs.
    const byQuery = new Map();
    for (const c of picks) byQuery.set(c.query, [...(byQuery.get(c.query) ?? []), c]);
    const mixed = [];
    while (mixed.length < PER_SCENE && [...byQuery.values()].some((l) => l.length)) {
      for (const list of byQuery.values()) if (list.length && mixed.length < PER_SCENE) mixed.push(list.shift());
    }
    out[id] = mixed.map((c, i) => ({ n: i + 1, ...c }));
    await sheet(id, mixed);
    console.log(`${id}: ${mixed.length} candidates`);
  }
  await writeFile(OUT_JSON, `${JSON.stringify(out, null, 2)}\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
