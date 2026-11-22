// Write the downloadable texts the Android app (mobile/) reads, into the static export.
// Run after `next build` (postbuild), before prune-export so its files count toward the Pages limits.
//
// The app bundles the smaller books. The larger ones (epics, Puranas, Rig and Atharva Veda) are
// downloaded on demand from this site:
//   /app-data/v1/index.json              which books can be downloaded, their parts and sizes
//                                        (bytes: JSON size on the phone; gz: about what is transferred)
//   /app-data/v1/parts/<id>.<n>.<hash>.json   a slice of a book's chapters, whole verses only
//   /app-data/v1/parts/<id>.vyakhya.<hash>.json   the book's Hindi व्याख्या, research notes and जीवन सूत्र
//                                        (public/data/hi-commentary), for bundled and downloaded books
//                                        alike; listed under `commentary` in index.json
// Parts are named by a hash of their content, so they are cached as immutable (public/_headers) and
// a changed text gets new names. index.json keeps the HTML rule and is revalidated on every fetch.
//
// A part holds at most PART_BYTES of JSON. A chapter larger than that (Mahabharata's Shanti Parva)
// is split across parts by whole verses, and the app joins the pieces again; no verse is ever cut.
//
// Verse fields and the bundling rule come from mobile/scripts/content-lib.mjs, the same module the
// app's content build uses, so a downloaded book reads exactly like a bundled one.
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { gzipSync } from 'node:zlib';
import { Buffer } from 'node:buffer';

import { isBundled, listBookIds, openBook, readCommentary } from '../mobile/scripts/content-lib.mjs';

const ROOT = process.cwd();
const DIST = resolve(ROOT, process.env.NEXT_DIST_DIR || 'dist');
const DATA = join(ROOT, 'public/data/scriptures-full');
const OUT = join(DIST, 'app-data/v1');
const PARTS = join(OUT, 'parts');
const PART_BYTES = 6 * 1024 * 1024;
// Bumped when the part layout changes in a way an older app cannot read.
const FORMAT = 1;

if (!existsSync(DIST)) {
  console.error(`✗ build-app-data: ${DIST} not found. Run after next build.`);
  process.exit(1);
}
if (!existsSync(DATA)) {
  console.error(`✗ build-app-data: ${DATA} not found.`);
  process.exit(1);
}

rmSync(join(DIST, 'app-data'), { recursive: true, force: true });
mkdirSync(PARTS, { recursive: true });

const hash = (text) => createHash('sha256').update(text).digest('hex');
const books = {};
const commentary = {};
let files = 0;
let totalBytes = 0;
let totalGz = 0;

for (const id of listBookIds(DATA)) {
  const book = openBook(DATA, id);
  if (!book) continue;

  // The व्याख्या is too large to ship inside the app, so every book that has one gets a download.
  const notes = readCommentary(DATA, book);
  if (notes) {
    const json = JSON.stringify({ id, chapters: notes.chapters });
    const name = `${id}.vyakhya.${hash(json).slice(0, 12)}.json`;
    writeFileSync(join(PARTS, name), json);
    files++;
    const bytes = Buffer.byteLength(json);
    const gz = gzipSync(json).length;
    totalBytes += bytes;
    totalGz += gz;
    commentary[id] = { file: `parts/${name}`, version: hash(json).slice(0, 16), bytes, gz, verses: notes.verses };
  }

  if (isBundled(book)) continue;

  // Pack verses into parts of at most PART_BYTES. A part is { id, chapters: [{ number, verses }] };
  // the same chapter number appears in two parts only when it is split, always in reading order.
  const parts = [];
  let pieces = [];
  let pieceBytes = 0;
  const flush = () => {
    if (pieces.length === 0) return;
    const json = JSON.stringify({ id, chapters: pieces });
    parts.push(json);
    pieces = [];
    pieceBytes = 0;
  };
  for (const ch of book.chapters) {
    const verses = book.readVerses(ch.number);
    let current = null;
    for (const verse of verses) {
      const bytes = Buffer.byteLength(JSON.stringify(verse)) + 1;
      if (pieceBytes + bytes > PART_BYTES && pieceBytes > 0) {
        flush();
        current = null;
      }
      if (!current) {
        current = { number: ch.number, verses: [] };
        pieces.push(current);
        pieceBytes += 40;
      }
      current.verses.push(verse);
      pieceBytes += bytes;
    }
    // A chapter with no verses yet still gets an entry, so the app knows the download is complete.
    if (!current) {
      pieces.push({ number: ch.number, verses: [] });
      pieceBytes += 40;
    }
  }
  flush();

  const entries = parts.map((json, n) => {
    const name = `${id}.${n + 1}.${hash(json).slice(0, 12)}.json`;
    writeFileSync(join(PARTS, name), json);
    files++;
    const bytes = Buffer.byteLength(json);
    totalBytes += bytes;
    // What the phone actually transfers: Cloudflare compresses JSON, and the app's HTTP client accepts gzip.
    const gz = gzipSync(json).length;
    totalGz += gz;
    return { file: `parts/${name}`, bytes, gz };
  });
  books[id] = {
    // Changes whenever any part changes, so the app can offer an update.
    version: hash(entries.map((e) => e.file).join('\n')).slice(0, 16),
    bytes: entries.reduce((sum, e) => sum + e.bytes, 0),
    gz: entries.reduce((sum, e) => sum + e.gz, 0),
    chapters: book.chapters.length,
    parts: entries,
  };
}

if (!commentary.bhagavadgita || commentary.bhagavadgita.verses < 700) {
  console.error(
    `✗ build-app-data: expected Bhagavad Gita व्याख्या in app-data index.json (≥700 verses), got ${commentary.bhagavadgita?.verses ?? 0}.`,
  );
  process.exit(1);
}

writeFileSync(join(OUT, 'index.json'), JSON.stringify({ format: FORMAT, books, commentary }));
files++;
console.log(
  `✓ App data: ${Object.keys(books).length} downloadable books and ${Object.keys(commentary).length} व्याख्या files, ${files} files in all, ` +
    `${(totalBytes / 1024 / 1024).toFixed(0)} MB on device, about ${(totalGz / 1024 / 1024).toFixed(0)} MB to download (dist/app-data/v1/).`,
);
