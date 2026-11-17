#!/usr/bin/env node
/**
 * Read-only, reproducible Mahabharata Hindi coverage register for editorial
 * review. This does not decide whether a meaning is accurate.
 *
 * Run after npm ci (which unpacks compressed scripture JSON):
 *   node scripts/report-mahabharata-meaning-gaps.mjs --parva=8 --json
 *   node scripts/report-mahabharata-meaning-gaps.mjs --parva=12
 */
import { existsSync, readFileSync } from 'node:fs';

const source = 'public/data/scriptures-full/mahabharata.json';
if (!existsSync(source)) {
  console.error('Mahabharata source JSON missing; run npm ci / node scripts/unpack-data.mjs first.');
  process.exit(1);
}
const scripture = JSON.parse(readFileSync(source, 'utf8'));
const requested = process.argv.find((a) => a.startsWith('--parva='));
const onlyParva = requested ? Number(requested.slice('--parva='.length)) : null;
if (onlyParva !== null && (!Number.isInteger(onlyParva) || onlyParva < 1 || onlyParva > 18)) {
  console.error('Invalid --parva value: expected integer 1..18');
  process.exit(2);
}
const all = [];
for (const chapter of scripture.chapters ?? []) {
  const parva = Number(chapter.number);
  if (!Number.isInteger(parva) || (onlyParva !== null && onlyParva !== parva)) continue;
  for (const verse of chapter.verses ?? []) {
    const key = `${chapter.number}:${verse.number}`;
    const hindi = typeof verse.hindi === 'string' && verse.hindi.trim().length > 0;
    const linked = typeof verse.hindiSeeVerse === 'string' && verse.hindiSeeVerse.trim().length > 0;
    all.push({ parva, key, hindi, linked });
  }
}
if (!all.length) {
  console.error('No matching Mahabharata verses; check edition and --parva.');
  process.exit(1);
}
const perParva = [...new Set(all.map((v) => v.parva))].sort((a,b) => a-b).map((parva) => {
  const entries = all.filter((v) => v.parva === parva);
  const missing = entries.filter((v) => !v.hindi && !v.linked).map((v) => v.key);
  return {
    parva,
    total: entries.length,
    hindi: entries.filter((v) => v.hindi).length,
    linked: entries.filter((v) => !v.hindi && v.linked).length,
    missingCount: missing.length,
    missing,
  };
});
const result = {
  note: 'Field-presence only. This is NOT a translation-fidelity, edition or human-review certificate. Missing keys remain missing; never fabricate or hide source verses.',
  perParva,
  totals: {
    verses: all.length,
    hindi: all.filter((v) => v.hindi).length,
    linked: all.filter((v) => !v.hindi && v.linked).length,
    missing: all.filter((v) => !v.hindi && !v.linked).length,
  },
};
if (process.argv.includes('--json')) {
  process.stdout.write(JSON.stringify(result, null, 2) + '\n');
} else {
  for (const row of perParva) {
    console.log(`Parva ${row.parva}: ${row.hindi}/${row.total} Hindi; ${row.linked} linked; ${row.missingCount} missing`);
    if (row.missing.length) console.log('Missing keys: ' + row.missing.join(', '));
  }
  console.log('Field presence only; source-edition and translation review still required.');
}
