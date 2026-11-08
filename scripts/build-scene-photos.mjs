#!/usr/bin/env node
/**
 * Fetch the real photos and classical paintings named in data/scene-photos/manifest.json
 * from Wikimedia Commons, check that each is public domain or freely licensed, and
 * compress it into app/styles/photos/<id>.avif and .webp (bundled by Next with hashed,
 * immutable names). Writes:
 *   lib/scene-photos.generated.ts           which photos exist, and their credits
 *   app/styles/scene-photos.generated.css   one rule per photo: the image, its focus, its light
 *
 *   node scripts/build-scene-photos.mjs            fetch what is missing
 *   node scripts/build-scene-photos.mjs --force    fetch everything again
 *   node scripts/build-scene-photos.mjs --offline  only rewrite the generated files
 *
 * Network: commons.wikimedia.org and upload.wikimedia.org.
 */
import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const MANIFEST = path.join(root, 'data/scene-photos/manifest.json');
const CREDITS = path.join(root, 'data/scene-photos/credits.json');
const OUT_DIR = path.join(root, 'app/styles/photos');
const OUT_TS = path.join(root, 'lib/scene-photos.generated.ts');
const OUT_CSS = path.join(root, 'app/styles/scene-photos.generated.css');

const WIDTH = 1280;
const API = 'https://commons.wikimedia.org/w/api.php';
const UA = 'DharmaGranthSceneBuilder/1.0 (https://dharmagranth.dev)';
// Public domain, CC0, CC BY and CC BY-SA only; every image is credited on /sources/.
const FREE = /(public domain|^pd\b|^pd-|cc0|^cc[ -]by(-sa)?[ -]?\d|^cc[ -]by(-sa)?$)/i;
const FX = new Set(['embers', 'mist', 'glints', 'dust', 'stars', 'none']);

const args = new Set(process.argv.slice(2));
const force = args.has('--force');
const offline = args.has('--offline');

const exists = (p) => access(p).then(() => true, () => false);
const stripHtml = (s = '') => s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
// Commons sometimes repeats a name ("Unknown author Unknown author").
const once = (s) => s.replace(/^(.+?) \1$/, '$1');

async function commonsInfo(file) {
  const url = new URL(API);
  url.search = new URLSearchParams({
    action: 'query',
    format: 'json',
    titles: file.startsWith('File:') ? file : `File:${file}`,
    prop: 'imageinfo',
    iiprop: 'url|extmetadata|size',
    iiurlwidth: String(WIDTH * 1.5),
  }).toString();
  const res = await fetch(url, { headers: { 'user-agent': UA } });
  if (!res.ok) throw new Error(`Commons API ${res.status}`);
  const page = Object.values((await res.json()).query?.pages ?? {})[0];
  const info = page?.imageinfo?.[0];
  if (!info) throw new Error(`not found on Commons: ${file}`);
  const meta = info.extmetadata ?? {};
  return {
    download: info.thumburl ?? info.url,
    license: stripHtml(meta.LicenseShortName?.value ?? ''),
    author: once(stripHtml(meta.Artist?.value ?? 'Unknown')),
    title: stripHtml(meta.ObjectName?.value ?? page.title.replace(/^File:/, '')),
    source: info.descriptionurl,
  };
}

async function main() {
  const manifest = JSON.parse(await readFile(MANIFEST, 'utf8'));
  const credits = (await exists(CREDITS)) ? JSON.parse(await readFile(CREDITS, 'utf8')) : {};
  await mkdir(OUT_DIR, { recursive: true });

  for (const [id, entry] of Object.entries(manifest.photos)) {
    if (!FX.has(entry.fx)) throw new Error(`${id}: unknown fx "${entry.fx}"`);
    if (!entry.file) {
      delete credits[id];
      continue;
    }
    const avif = path.join(OUT_DIR, `${id}.avif`);
    const have = (await exists(avif)) && credits[id]?.file === entry.file;
    if (offline || (have && !force)) continue;

    const info = await commonsInfo(entry.file);
    if (!FREE.test(info.license)) {
      console.warn(`skip ${id}: licence "${info.license}" is not public domain or CC`);
      continue;
    }
    const res = await fetch(info.download, { headers: { 'user-agent': UA } });
    if (!res.ok) throw new Error(`${id}: download ${res.status}`);
    const input = Buffer.from(await res.arrayBuffer());
    const base = sharp(input).rotate().resize({ width: WIDTH, withoutEnlargement: true });
    await base.clone().avif({ quality: 50, effort: 6 }).toFile(avif);
    await base.clone().webp({ quality: 70 }).toFile(path.join(OUT_DIR, `${id}.webp`));
    credits[id] = { file: entry.file, title: info.title, author: info.author, license: info.license, source: info.source };
    console.log(`${id}: ${info.license}, ${info.author}`);
  }

  // Only photos whose files are on disk are wired in.
  const ready = [];
  for (const id of Object.keys(manifest.photos)) {
    if (credits[id] && (await exists(path.join(OUT_DIR, `${id}.avif`)))) ready.push(id);
  }
  await writeFile(CREDITS, `${JSON.stringify(credits, null, 2)}\n`);

  const creditMap = Object.fromEntries(ready.map((id) => [id, { title: credits[id].title, author: credits[id].author, license: credits[id].license, source: credits[id].source }]));
  await writeFile(
    OUT_TS,
    `// Generated by scripts/build-scene-photos.mjs from data/scene-photos/manifest.json. Do not edit.\n` +
      `// The photos that have been fetched, checked and compressed into app/styles/photos/.\n\n` +
      `export const AVAILABLE_PHOTOS: readonly string[] = ${JSON.stringify(ready)};\n\n` +
      `export const PHOTO_FX: Readonly<Record<string, string>> = ${JSON.stringify(Object.fromEntries(ready.map((id) => [id, manifest.photos[id].fx])))};\n\n` +
      `export const PHOTO_CREDITS: Readonly<Record<string, { title: string; author: string; license: string; source: string }>> = ${JSON.stringify(creditMap, null, 2)};\n`,
  );

  const rules = ready.map((id) => {
    const { focus, fx } = manifest.photos[id];
    return `[data-photo='${id}'] { --photo: image-set(url('./photos/${id}.avif') type('image/avif'), url('./photos/${id}.webp') type('image/webp')); --photo-focus: ${focus}; --photo-fx: var(--fx-${fx}); }`;
  });
  await writeFile(
    OUT_CSS,
    `/* Generated by scripts/build-scene-photos.mjs. Do not edit. One rule per fetched photo; scene-photos.css draws them. */\n${rules.join('\n')}\n`,
  );
  console.log(`${ready.length} of ${Object.keys(manifest.photos).length} photos ready`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
