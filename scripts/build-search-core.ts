/**
 * Writes public/search/core-index.json (Tier-1, under 60KB gzip) and
 * public/search/shards/<id>.json. Titles and verse lines come from the
 * library files and the existing pathway / wisdom records. Nothing is composed here.
 */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { scriptureCatalog } from '../data/scripture-meta';
import { learningPaths } from '../data/learning-paths';
import { wisdomTopics } from '../data/wisdom-for-life';
import { CHAPTERS } from '../data/ashtavakra/chapters-meta';
import { wisdomVerseHref, libraryLocation } from '../lib/wisdom-links';
import { versePageHref } from '../lib/verse-paths';
import { NAKSHATRA_DATA, TITHI_DATA } from '../lib/panchang';
import type { CoreChapter, CoreIndexFile, CoreTerm, CoreVerse, SearchShardFile, ShardVerse } from '../lib/search-core';

const root = process.cwd();
const outDir = path.join(root, 'public', 'search');
const shardDir = path.join(outDir, 'shards');

function clip(value: string | undefined, max: number): string {
  const flat = (value ?? '').replace(/\s+/g, ' ').trim();
  return flat.length > max ? flat.slice(0, max).trimEnd() : flat;
}

function readLibraryVerse(id: string, chapter: number, verse: string): { sanskrit: string; translation: string } | null {
  const file = path.join(root, 'public', 'data', 'scriptures-full', id, `ch-${chapter}.json`);
  if (!fs.existsSync(file)) return null;
  const json = JSON.parse(fs.readFileSync(file, 'utf8')) as { chapter?: { verses?: Array<{ number?: number | string; sanskrit?: string; hindi?: string; translation?: string }> } };
  const found = json.chapter?.verses?.find((v) => String(v.number) === verse);
  if (!found?.sanskrit) return null;
  return { sanskrit: clip(found.sanskrit, 180), translation: clip(found.hindi || found.translation, 160) };
}

const shardVerses = new Map<string, ShardVerse[]>();
function addShardVerse(id: string, row: ShardVerse) {
  const list = shardVerses.get(id) ?? [];
  if (list.some((v) => v[0] === row[0] && v[1] === row[1])) return;
  list.push(row);
  shardVerses.set(id, list);
}

const scriptures: CoreIndexFile['scriptures'] = scriptureCatalog.map((s) => [
  s.id,
  s.title,
  s.titleSanskrit,
  `/scripture/${s.id}/`,
]);
scriptures.push(['ashtavakra', 'Ashtavakra Gita', 'अष्टावक्रगीता', '/ashtavakra/']);

const chapters: CoreChapter[] = [];
for (const meta of scriptureCatalog) {
  const manifestPath = path.join(root, 'public', 'data', 'scriptures-full', meta.id, 'manifest.json');
  if (!fs.existsSync(manifestPath)) continue;
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8')) as { chapters?: Array<{ number: number; title?: string; titleSanskrit?: string }> };
  for (const ch of manifest.chapters ?? []) {
    chapters.push([meta.id, ch.number, clip(ch.title, 80), clip(ch.titleSanskrit, 80)]);
  }
}
for (const ch of CHAPTERS) {
  if (ch.status !== 'published') continue;
  chapters.push(['ashtavakra', ch.number, ch.bookTitle, '']);
}

const pathways: CoreIndexFile['pathways'] = learningPaths.map((p) => [p.id, p.title, p.titleSanskrit]);
const topics: CoreIndexFile['topics'] = wisdomTopics.map((t) => [t.slug, t.titleEn, t.titleHi]);
const terms: CoreTerm[] = [];
const seenTerm = new Set<string>();
function addTerm(id: string, title: string, hindi: string) {
  const key = title.trim().toLowerCase();
  if (!key || seenTerm.has(key)) return;
  seenTerm.add(key);
  terms.push([id, title, hindi]);
}
for (const tithi of Object.values(TITHI_DATA)) addTerm(`tithi-${tithi.paksha}-${tithi.number}`, tithi.name, tithi.nameHi);
for (const star of NAKSHATRA_DATA) addTerm(`nakshatra-${star.index}`, star.name, star.nameHi);

const verses: CoreVerse[] = [];
const seenVerse = new Set<string>();
function addVerse(id: string, chapter: number, verse: string, label: string, href: string, sanskrit: string, translation: string) {
  const key = `${id}:${chapter}:${verse}`;
  if (seenVerse.has(key)) return;
  seenVerse.add(key);
  verses.push([id, chapter, verse, clip(label, 80), href]);
  if (sanskrit) addShardVerse(id, [chapter, verse, sanskrit, translation, href]);
}

for (const topic of wisdomTopics) {
  for (const verse of topic.verses) {
    const loc = libraryLocation(verse);
    const href = wisdomVerseHref(verse);
    addVerse(
      verse.scriptureId,
      loc.chapter,
      loc.verse,
      verse.referenceDisplay,
      href,
      clip(verse.sanskritDevanagari, 180),
      clip(verse.literalTranslationHi || verse.literalTranslationEn, 160),
    );
  }
}

const pinned: Array<[string, number, string, string]> = [
  ['bhagavadgita', 2, '47', 'Bhagavad Gita 2.47'],
  ['bhagavadgita', 6, '16', 'Bhagavad Gita 6.16'],
  ['katha', 3, '3', 'Katha Upanishad 1.3.3'],
];
for (const [id, chapter, verse, label] of pinned) {
  const text = readLibraryVerse(id, chapter, verse);
  if (!text) {
    console.error(`Missing published verse ${id} ${chapter}.${verse}`);
    process.exit(1);
  }
  const href = versePageHref(id, chapter, verse);
  if (!href) {
    console.error(`No verse page for ${id} ${chapter}.${verse}`);
    process.exit(1);
  }
  addVerse(id, chapter, verse, label, href, text.sanskrit, text.translation);
}

function pack(chapterRows: CoreChapter[]): CoreIndexFile {
  return { v: 1, scriptures, chapters: chapterRows, pathways, topics, verses, terms };
}

let file = pack(chapters);
let json = JSON.stringify(file);
let gzip = zlib.gzipSync(Buffer.from(json)).length;
if (gzip > 60 * 1024) {
  file = pack(chapters.map(([id, n, title]) => [id, n, title, '']));
  json = JSON.stringify(file);
  gzip = zlib.gzipSync(Buffer.from(json)).length;
}
if (gzip > 60 * 1024) {
  console.error(`core-index.json gzip is ${gzip} bytes, above 60KB`);
  process.exit(1);
}

fs.mkdirSync(shardDir, { recursive: true });
for (const name of fs.readdirSync(shardDir)) {
  if (name.endsWith('.json')) fs.unlinkSync(path.join(shardDir, name));
}

const shardIds = new Set<string>([...scriptures.map((s) => s[0]), ...shardVerses.keys()]);
let shardCount = 0;
for (const id of shardIds) {
  const rows = shardVerses.get(id) ?? [];
  if (rows.length === 0 && id !== 'ashtavakra' && !chapters.some((c) => c[0] === id)) continue;
  const shard: SearchShardFile = { v: 1, id, verses: rows };
  fs.writeFileSync(path.join(shardDir, `${id}.json`), JSON.stringify(shard));
  shardCount += 1;
}

fs.writeFileSync(path.join(outDir, 'core-index.json'), json);
const catalogCount = scriptureCatalog.length;
console.log(`search core: ${catalogCount} catalog scriptures, ${chapters.length} chapters, ${pathways.length} pathways, ${topics.length} topics, ${terms.length} panchang terms, ${verses.length} key verses`);
console.log(`core-index.json ${json.length} bytes, gzip ${gzip} bytes; ${shardCount} shards`);
if (catalogCount < 65) {
  console.error(`expected 65 catalog scriptures, found ${catalogCount}`);
  process.exit(1);
}
