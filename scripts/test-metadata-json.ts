import * as assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { scriptureCatalog } from '../data/scripture-meta';

const DATA = path.resolve(process.cwd(), 'public', 'data');
const ROOT = path.join(DATA, 'scriptures-full');
const index = JSON.parse(fs.readFileSync(path.join(DATA, 'chapters.json'), 'utf8')) as Record<
  string,
  Array<{ id: number; title: string; titleSanskrit?: string; verseCount: number }>
>;
const stats = JSON.parse(fs.readFileSync(path.join(DATA, 'stats.json'), 'utf8')) as {
  realVerseCount: number;
  realChapterCount: number;
  realScriptureCount: number;
};

let expectedVerses = 0;
let expectedChapters = 0;
let expectedScriptures = 0;

for (const scripture of scriptureCatalog) {
  const manifestPath = path.join(ROOT, scripture.id, 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    assert.deepEqual(index[scripture.id], [], `${scripture.id}: missing manifest should have an empty index`);
    continue;
  }
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8')) as {
    chapters?: Array<{ number: number; title?: string; titleSanskrit?: string; verseCount?: number }>;
    languageCoverage?: { totalVerses?: number; sa?: number; hi?: number; en?: number };
  };
  const shardDir = path.dirname(manifestPath);
  const expectedShards = (manifest.chapters ?? []).map((chapter) => `ch-${chapter.number}.json`).sort();
  const actualShards = fs.readdirSync(shardDir).filter((file) => /^ch-\d+\.json$/.test(file)).sort();
  assert.deepEqual(actualShards, expectedShards, `${scripture.id}: stale or missing chapter shards`);
  const actual = (manifest.chapters ?? []).map((chapter) => ({
    id: chapter.number,
    title: chapter.title || `अध्याय ${chapter.number}`,
    ...(chapter.titleSanskrit ? { titleSanskrit: chapter.titleSanskrit } : {}),
    verseCount: chapter.verseCount ?? 0,
  }));
  assert.deepEqual(index[scripture.id], actual, `${scripture.id}: chapter index differs from published manifest`);
  const bookVerses = actual.reduce((sum, chapter) => sum + chapter.verseCount, 0);
  const coverage = manifest.languageCoverage;
  assert.ok(coverage, `${scripture.id}: manifest language coverage is missing`);
  assert.equal(coverage.totalVerses, bookVerses, `${scripture.id}: language coverage denominator differs from chapter counts`);
  for (const language of ['sa', 'hi', 'en'] as const) {
    assert.ok(Number.isInteger(coverage[language]) && coverage[language]! >= 0 && coverage[language]! <= bookVerses,
      `${scripture.id}: invalid ${language} coverage count`);
  }
  expectedVerses += bookVerses;
  expectedChapters += actual.filter((chapter) => chapter.verseCount > 0).length;
  if (actual.some((chapter) => chapter.verseCount > 0)) expectedScriptures += 1;
}

// Spot-check a small complete text against every verse in its shard.
const ishaManifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'ishavasya', 'manifest.json'), 'utf8')) as {
  languageCoverage: { totalVerses: number; sa: number; hi: number; en: number };
  chapters: Array<{ number: number }>;
};
const ishaCounts = { totalVerses: 0, sa: 0, hi: 0, en: 0 };
for (const chapter of ishaManifest.chapters) {
  const shard = JSON.parse(fs.readFileSync(path.join(ROOT, 'ishavasya', `ch-${chapter.number}.json`), 'utf8')) as {
    chapter: { verses: Array<{ sanskrit?: string; hindi?: string; translation?: string }> };
  };
  for (const verse of shard.chapter.verses) {
    ishaCounts.totalVerses++;
    if (verse.sanskrit?.trim()) ishaCounts.sa++;
    if (verse.hindi?.trim()) ishaCounts.hi++;
    if (verse.translation?.trim()) ishaCounts.en++;
  }
}
assert.deepEqual(ishaManifest.languageCoverage, ishaCounts, 'Isha Upanishad coverage must match its full published text');

assert.deepEqual(stats, {
  realVerseCount: expectedVerses,
  realChapterCount: expectedChapters,
  realScriptureCount: expectedScriptures,
});
console.log(`✓ generated metadata matches ${scriptureCatalog.length} catalogue entries and published manifests`);
