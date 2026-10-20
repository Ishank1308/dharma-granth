/**
 * Curiosity Engine integrity check.
 *
 * Guards the exact defect classes found in the 2026-10 quality audit:
 *   • anchor Sanskrit must be contained in the canonical seeded verse it cites
 *     (catches verse misattribution, e.g. Gita 1.29 quoting 1.30);
 *   • anchor/related hrefs must resolve to real pages — verse pages only for
 *     scriptures in VERSE_PAGE_SCRIPTURE_IDS, and only for verse numbers that
 *     exist in the seeded data (catches 404 deep links);
 *   • no Latin letters or matra-order corruption (श्िच) inside Sanskrit fields.
 *
 * Run: npx tsx scripts/check-curiosity.ts
 */
import fs from 'node:fs';
import path from 'node:path';
import {
  CURIOSITY_INQUIRIES,
  INQUIRY_CATEGORIES,
  AUDIENCE_CONFIG,
  getInquiriesForVerse,
  type RelatedScripturePointer,
} from '../data/curiosity-inquiry';
import { hasVersePages } from '../lib/verse-paths';

const FULL_DIR = path.join('public', 'data', 'scriptures-full');
const strip = (s: string) => s.replace(/[\s|।॥0-9०-९.‌‍]+/g, '');
let bad = 0;
const fail = (msg: string) => {
  bad++;
  console.error(`✗ ${msg}`);
};

interface SeededVerse {
  number: number | string;
  sanskrit?: string;
}

const verseCache = new Map<string, SeededVerse[] | null>();

/** Verses of one chapter, from per-chapter files (manifest layout) or the monolithic JSON. */
function seededVerses(scriptureId: string, chapter: number): SeededVerse[] | null {
  const key = `${scriptureId}:${chapter}`;
  if (verseCache.has(key)) return verseCache.get(key) ?? null;

  let verses: SeededVerse[] | null = null;
  const chapterFile = path.join(FULL_DIR, scriptureId, `ch-${chapter}.json`);
  const monolithic = path.join(FULL_DIR, `${scriptureId}.json`);
  try {
    if (fs.existsSync(chapterFile)) {
      const d = JSON.parse(fs.readFileSync(chapterFile, 'utf8')) as {
        chapter?: { verses?: SeededVerse[] };
        verses?: SeededVerse[];
      };
      verses = d.chapter?.verses ?? d.verses ?? null;
    } else if (fs.existsSync(monolithic)) {
      const d = JSON.parse(fs.readFileSync(monolithic, 'utf8')) as {
        chapters?: Array<{ number?: number | string; verses?: SeededVerse[] }>;
      };
      const ch = d.chapters?.find((c) => String(c.number) === String(chapter));
      verses = ch?.verses ?? null;
    }
  } catch {
    verses = null;
  }
  verseCache.set(key, verses);
  return verses;
}

function scriptureExists(scriptureId: string): boolean {
  return (
    fs.existsSync(path.join(FULL_DIR, scriptureId)) ||
    fs.existsSync(path.join(FULL_DIR, `${scriptureId}.json`))
  );
}

const LATIN_IN_DEVANAGARI = /[\u0900-\u097F][A-Za-z]{2,}/;
const MATRA_CORRUPTION = /\u0936\u094d\u093f\u091a/; // श्िच (i-matra misordered after virama)

function checkSanskritField(where: string, text: string) {
  if (LATIN_IN_DEVANAGARI.test(text)) fail(`${where}: Latin letters inside Devanagari text`);
  if (MATRA_CORRUPTION.test(text)) fail(`${where}: matra-order corruption (श्िच)`);
}

function checkVerseLink(
  where: string,
  scriptureId: string,
  chapter: number,
  verse: string | number,
  href: string,
  opts: { allowScripturePage?: boolean; allowChapterPage?: boolean } = {},
) {
  const expected = `/scripture/${scriptureId}/chapter/${chapter}/verse/${verse}/`;
  const scripturePage = `/scripture/${scriptureId}/`;
  const chapterPage = `/scripture/${scriptureId}/chapter/${chapter}/`;
  if (href === scripturePage) {
    if (!opts.allowScripturePage) fail(`${where}: href is a scripture page but only verse pages are allowed (${href})`);
    else if (!scriptureExists(scriptureId)) fail(`${where}: scripture page target missing for ${scriptureId}`);
    return;
  }
  if (href === chapterPage) {
    if (!opts.allowChapterPage) fail(`${where}: href is a chapter page but only verse pages are allowed (${href})`);
    else if (!scriptureExists(scriptureId)) fail(`${where}: chapter page target missing for ${scriptureId}`);
    return;
  }
  if (href !== expected) {
    fail(`${where}: href ${href} does not match ${expected}`);
    return;
  }
  if (!hasVersePages(scriptureId)) {
    fail(`${where}: ${scriptureId} has no verse pages — link would 404 (${href})`);
    return;
  }
  const verses = seededVerses(scriptureId, chapter);
  const hit = verses?.find((v) => String(v.number) === String(verse));
  if (!hit) fail(`${where}: verse ${scriptureId} ${chapter}.${verse} not found in seeded data (${href})`);
  return hit;
}

// ── Structural checks ────────────────────────────────────────────────────────
const ids = new Set<string>();
const validAudiences = new Set(Object.keys(AUDIENCE_CONFIG));
const validCategories = new Set(INQUIRY_CATEGORIES.map((c) => c.id));

for (const item of CURIOSITY_INQUIRIES) {
  const where = item.id;
  if (ids.has(item.id)) fail(`${where}: duplicate id`);
  ids.add(item.id);

  if (!validAudiences.has(item.audience)) fail(`${where}: unknown audience ${item.audience}`);
  if (!validCategories.has(item.category)) fail(`${where}: unknown category ${item.category}`);

  const required: Array<[string, string]> = [
    ['wonderPromptEn', item.wonderPromptEn],
    ['wonderPromptHi', item.wonderPromptHi],
    ['questionEn', item.questionEn],
    ['questionHi', item.questionHi],
    ['simpleAnswerEn', item.simpleAnswerEn],
    ['simpleAnswerHi', item.simpleAnswerHi],
    ['parentGuideEn', item.parentGuideEn],
    ['parentGuideHi', item.parentGuideHi],
    ['thinkingPromptEn', item.thinkingPromptEn],
    ['thinkingPromptHi', item.thinkingPromptHi],
    ['reflectionExerciseEn', item.reflectionExerciseEn],
    ['reflectionExerciseHi', item.reflectionExerciseHi],
    ['nextDeeperQuestionEn', item.nextDeeperQuestionEn],
    ['nextDeeperQuestionHi', item.nextDeeperQuestionHi],
  ];
  for (const [field, value] of required) {
    if (!value || value.trim().length < 10) fail(`${where}: ${field} missing or too short`);
  }

  // ── Canonical anchor integrity ──────────────────────────────────────────
  const a = item.scriptureAnchor;
  checkSanskritField(`${where} anchor.sanskrit`, a.sanskrit);
  const anchorVerse = checkVerseLink(
    `${where} anchor`,
    a.scriptureId,
    a.chapter,
    a.verse,
    a.href,
    { allowScripturePage: true },
  );
  if (anchorVerse?.sanskrit) {
    const canon = strip(anchorVerse.sanskrit);
    const quoted = strip(a.sanskrit);
    if (!quoted || !canon.includes(quoted)) {
      fail(`${where}: anchor Sanskrit is not part of ${a.scriptureId} ${a.chapter}.${a.verse} (misattributed or corrupted)`);
    }
  } else if (!anchorVerse && a.href !== `/scripture/${a.scriptureId}/`) {
    fail(`${where}: anchor verse unavailable and href is not a fallback scripture page`);
  }

  // ── Related passages ────────────────────────────────────────────────────
  for (const rel of item.relatedPassages) {
    checkVerseLink(`${where} related`, rel.scriptureId, rel.chapter, rel.verse, rel.href, {
      allowChapterPage: true,
    });
  }
}

// ── Cross-item checks ────────────────────────────────────────────────────────
const perAudience = new Map<string, number>();
for (const item of CURIOSITY_INQUIRIES) {
  perAudience.set(item.audience, (perAudience.get(item.audience) ?? 0) + 1);
}
for (const aud of Object.keys(AUDIENCE_CONFIG)) {
  if (!perAudience.has(aud)) fail(`no inquiries for audience "${aud}"`);
}

// Every anchor verse should be discoverable through getInquiriesForVerse.
for (const item of CURIOSITY_INQUIRIES) {
  const a = item.scriptureAnchor;
  const matches = getInquiriesForVerse(a.scriptureId, a.chapter, a.verse);
  if (!matches.some((m) => m.id === item.id)) {
    fail(`${item.id}: getInquiriesForVerse does not return its own anchor verse`);
  }
}

console.log(
  bad === 0
    ? `Curiosity Engine integrity OK: ${CURIOSITY_INQUIRIES.length} inquiries, ${CURIOSITY_INQUIRIES.reduce((n, i) => n + i.relatedPassages.length, 0)} related passages verified.`
    : `${bad} curiosity check(s) failed.`,
);
process.exit(bad === 0 ? 0 : 1);
