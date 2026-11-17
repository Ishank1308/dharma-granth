#!/usr/bin/env node
/**
 * Report what the reader can actually receive after publish:data, not what
 * the raw source JSON contains before the editorial hiding rules.
 *
 * Run: npm run publish:data && node scripts/report-published-scripture-coverage.mjs
 *      node scripts/report-published-scripture-coverage.mjs --json
 *
 * This measures fields, not correctness, licence clearance, edition
 * completeness, or human review. It must not be used to call a text "complete".
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const ROOT_DIR = path.join(ROOT, 'public', 'data', 'scriptures-full');
const OVERLAY_DIR = path.join(ROOT, 'public', 'data', 'hi-commentary');
const JSON_MODE = process.argv.includes('--json');

function hasText(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function tally(rows, key) {
  return rows.reduce((sum, row) => sum + row[key], 0);
}

if (!fs.existsSync(ROOT_DIR)) {
  console.error('Missing public/data/scriptures-full. Run from the repository root.');
  process.exit(1);
}
const ids = fs.readdirSync(ROOT_DIR)
  .filter((name) => name.endsWith('.json'))
  .map((name) => name.slice(0, -5))
  .sort();

const rows = [];
const notGenerated = [];
const inconsistent = [];
for (const id of ids) {
  const bookDir = path.join(ROOT_DIR, id);
  const manifestFile = path.join(bookDir, 'manifest.json');
  if (!fs.existsSync(manifestFile)) {
    notGenerated.push(id);
    continue;
  }

  const manifest = readJson(manifestFile);
  const overlayFile = path.join(OVERLAY_DIR, id + '.json');
  const overlay = fs.existsSync(overlayFile) ? readJson(overlayFile) : {};
  const row = {
    id,
    chapters: 0,
    published: 0,
    sanskrit: 0,
    hindi: 0,
    hindiLinked: 0,
    english: 0,
    englishLinked: 0,
    explanation: 0,
    research: 0,
    lifeLesson: 0,
  };

  for (const chapterMeta of manifest.chapters ?? []) {
    const chapterNumber = Number(chapterMeta.number);
    const shardFile = path.join(bookDir, 'ch-' + chapterNumber + '.json');
    if (!fs.existsSync(shardFile)) {
      inconsistent.push(id + ': missing chapter shard ' + chapterNumber);
      continue;
    }
    const shard = readJson(shardFile);
    const verses = shard.chapter?.verses ?? [];
    row.chapters += 1;
    if (typeof chapterMeta.verseCount === 'number' && verses.length !== chapterMeta.verseCount) {
      inconsistent.push(id + ':' + chapterNumber + ': manifest=' + chapterMeta.verseCount + ', shard=' + verses.length);
    }
    for (const verse of verses) {
      row.published += 1;
      const key = String(chapterNumber) + ':' + String(verse.number ?? verse.id ?? '');
      const commentary = overlay[key] ?? {};
      if (hasText(verse.sanskrit)) row.sanskrit += 1;
      if (hasText(verse.hindi)) row.hindi += 1;
      else if (hasText(verse.hindiSeeVerse)) row.hindiLinked += 1;
      if (hasText(verse.translation)) row.english += 1;
      else if (hasText(verse.translationSeeVerse)) row.englishLinked += 1;
      if (hasText(commentary.explanation) || hasText(verse.explanation) || hasText(verse.commentary)) row.explanation += 1;
      if (hasText(commentary.science) || hasText(verse.science)) row.research += 1;
      if (hasText(commentary.lifeLesson) || hasText(verse.lifeLesson)) row.lifeLesson += 1;
    }
  }
  if (manifest.languageCoverage?.totalVerses !== undefined &&
      row.published !== manifest.languageCoverage.totalVerses) {
    inconsistent.push(id + ': manifest total=' + manifest.languageCoverage.totalVerses + ', shards=' + row.published);
  }
  rows.push(row);
}

rows.sort((a, b) => (b.published - b.hindi - b.hindiLinked) - (a.published - a.hindi - a.hindiLinked) || a.id.localeCompare(b.id));
const keys = ['published', 'sanskrit', 'hindi', 'hindiLinked', 'english', 'englishLinked', 'explanation', 'research', 'lifeLesson'];
const totals = Object.fromEntries(keys.map((key) => [key, tally(rows, key)]));

if (JSON_MODE) {
  console.log(JSON.stringify({ reported: rows.length, totalCatalogued: ids.length, totals, rows, notGenerated, inconsistent }, null, 2));
} else {
  console.log('# Published Scripture Field Coverage');
  console.log('');
  console.log('Based on post-filter chapter shards and published Hindi commentary overlays.');
  console.log('A linked passage meaning is counted separately from a verse-owned meaning.');
  console.log('Field presence does NOT prove verse alignment, accuracy, source completeness, or editorial review.');
  console.log('');
  console.log('| Scripture | Verses | Sanskrit | Hindi | Hindi linked | English | English linked | व्याख्या | Research |');
  console.log('| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |');
  for (const row of rows) {
    console.log('| ' + [row.id, row.published, row.sanskrit, row.hindi, row.hindiLinked, row.english, row.englishLinked, row.explanation, row.research].join(' | ') + ' |');
  }
  console.log('| **Total** | ' + [totals.published, totals.sanskrit, totals.hindi, totals.hindiLinked, totals.english, totals.englishLinked, totals.explanation, totals.research].join(' | ') + ' |');
  console.log('');
  if (notGenerated.length) console.error('Missing generated manifests: ' + notGenerated.join(', '));
  for (const item of inconsistent) console.error('INCONSISTENT: ' + item);
  console.log('Measured ' + rows.length + '/' + ids.length + ' catalogued scripture files.');
}

if (notGenerated.length || inconsistent.length) {
  console.error('Coverage inventory incomplete or inconsistent. Run npm run publish:data first and resolve the reported gaps.');
  process.exitCode = 1;
}
