/**
 * Guard for the "Wisdom for Life" section (data/wisdom-for-life.ts).
 *
 * That section quotes scripture and attaches editorial text to it, so it must
 * not drift from the library or acquire claims nobody verified. In 2026-10 an
 * audit found "cross-verified" notes and edition names (Chowkhamba, Gita
 * Press…) that no one had checked, notes putting words in Shankara's,
 * Ramanuja's and Madhva's mouths, citations that resolved to no verse, and a
 * wrong speaker for Taittiriya 2.9. This check fails the build if:
 *
 *   - a topic is missing any of its required parts, or its safety note;
 *   - a cited verse cannot be found in the library, or the quoted Sanskrit
 *     does not match the library's text for that verse;
 *   - a cited scripture, related scripture or concept link does not resolve;
 *   - data text carries a "verified / cross-checked" claim, an edition name,
 *     or an attribution to a named commentator.
 *
 * Run: tsx scripts/check-wisdom.ts
 */
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { wisdomTopics } from '../data/wisdom-for-life';
import { getScriptureMeta } from '../data/scriptures';
import { libraryLocation } from '../lib/wisdom-links';

const ROOT = resolve(__dirname, '..');
const problems: string[] = [];
const fail = (topic: string, msg: string) => problems.push(`${topic}: ${msg}`);

/** Letters and marks only, so punctuation, digits, spacing and line breaks cannot hide a match. */
const letters = (s: string) =>
  (s ?? '')
    .normalize('NFC')
    // The library marks Vedic nasals with candrabindu (ँ); printed texts often use anusvara (ं). Same sound, same verse.
    .replace(/ँ/g, 'ं')
    .replace(/[^\p{L}\p{M}]/gu, '');

const REQUIRED_TOPICS = [
  'stress-and-worry', 'fear-and-courage', 'anger', 'grief-and-loss', 'duty-and-decision-making', 'discipline',
  'concentration', 'leadership', 'family-responsibilities', 'devotion', 'self-knowledge', 'meaning-of-life',
  'failure-and-setbacks', 'success', 'attachment', 'detachment', 'death', 'contentment', 'self-control', 'skill-in-work',
  'meditation', 'karma', 'the-self', 'ego', 'desire-and-greed', 'peace-of-mind', 'forgiveness', 'faith',
];

/** Claims that need evidence this repository does not contain. */
const UNVERIFIED_CLAIMS: Array<[RegExp, string]> = [
  [/cross-?verified|cross-?checked|cross-?referenced|sanskrit (?:authentic|shlokas?) verified|verified with accent/i, 'a "verified / cross-checked" claim'],
  [/gita press|chowkhamba|nirnaya\s?sagar|advaita ashrama|anandashram|\bBORI\b/i, 'a named print edition'],
  [/\b(?:shankara(?:charya)?|ramanuja(?:charya)?|madhva(?:charya)?|sridhara)\b[^.]{0,40}\b(?:notes?|explains?|comments?|points out|interprets?|defines?|terms?|identifies)\b/i, 'an attribution to a named commentator'],
  [/gandhi/i, 'an unsourced quotation'],
];

const slugs = wisdomTopics.map((t) => t.slug);
for (const wanted of REQUIRED_TOPICS) if (!slugs.includes(wanted)) fail('(all)', `missing topic "${wanted}"`);

for (const t of wisdomTopics) {
  const at = t.slug;

  // Required parts of every topic page.
  if (!t.compassionateIntro?.leadEn || !t.compassionateIntro?.bodyEn) fail(at, 'missing introduction');
  if (t.verses.length === 0) fail(at, 'no scripture references');
  if (t.reflections.length === 0) fail(at, 'no practical reflection');
  if (t.relatedConcepts.length === 0) fail(at, 'no related concepts');
  if (t.relatedScriptures.length === 0) fail(at, 'no related scriptures');
  if (t.sources.length === 0) fail(at, 'no sources');
  if (!t.traditionalContextOverview?.bodyEn) fail(at, 'missing traditional context');
  // Scripture is never offered as a substitute for care: every topic must point to qualified help.
  if (!/professional|clinic|medical|psycholog|therapist|doctor|physician|counsel|crisis|helpline|authorit/i.test(t.contextualNote?.clinicalDisclaimerEn ?? '')) {
    fail(at, 'contextual note must point to qualified help');
  }
  if (!t.contextualNote?.bodyEn || !t.contextualNote?.headlineEn) fail(at, 'missing contextual note');

  // Every cited verse must exist in the library, with the same Sanskrit.
  for (const v of t.verses) {
    if (!getScriptureMeta(v.scriptureId)) {
      fail(at, `${v.referenceDisplay}: scripture "${v.scriptureId}" is not in the library`);
      continue;
    }
    const loc = libraryLocation(v);
    const file = join(ROOT, 'public/data/scriptures-full', v.scriptureId, `ch-${loc.chapter}.json`);
    if (!existsSync(file)) {
      fail(at, `${v.referenceDisplay}: library chapter ${loc.chapter} of ${v.scriptureId} does not exist`);
      continue;
    }
    const chapter = JSON.parse(readFileSync(file, 'utf8')).chapter as { verses: Array<{ number: number | string; sanskrit?: string }> };
    const index = chapter.verses.findIndex((x) => String(x.number) === loc.verse);
    if (index < 0) {
      fail(at, `${v.referenceDisplay}: library has no verse ${loc.verse} in chapter ${loc.chapter}`);
      continue;
    }
    // A quoted range ("2.62–63") spans consecutive verses, so compare against the run starting here.
    const quoted = letters(v.sanskritDevanagari);
    const run = letters(chapter.verses.slice(index, index + 4).map((x) => x.sanskrit ?? '').join(' '));
    const head = quoted.slice(0, 24);
    const tail = quoted.slice(Math.max(0, quoted.length - 24));
    // A quotation's initial अ can be absorbed by sandhi with the preceding word in the library's running text
    // (Brihadaranyaka 1.3.28 has जपेदसतो for "japed asato"), so the head may match without it.
    const headOk = run.includes(head) || (quoted.startsWith('अ') && run.includes(quoted.slice(1, 25)));
    if (!headOk || !run.includes(tail)) {
      fail(at, `${v.referenceDisplay}: quoted Sanskrit does not match library ch. ${loc.chapter} v. ${loc.verse}`);
    }
  }

  // Links must land somewhere real.
  for (const s of t.relatedScriptures) if (!getScriptureMeta(s.id)) fail(at, `related scripture "${s.id}" is not in the library`);

  // No claim without evidence, in any text on the page.
  const text = JSON.stringify({ ...t, verses: t.verses.map((v) => ({ ...v, sanskritDevanagari: '', sanskritTransliteration: '' })) });
  for (const [pattern, label] of UNVERIFIED_CLAIMS) {
    const hit = text.match(pattern);
    if (hit) fail(at, `contains ${label}: "${hit[0].slice(0, 80)}"`);
  }
}

if (problems.length > 0) {
  console.error(`check-wisdom: ${problems.length} problem(s)\n` + problems.map((p) => `  - ${p}`).join('\n'));
  process.exit(1);
}
console.log(`check-wisdom: ok (${wisdomTopics.length} topics, ${wisdomTopics.reduce((n, t) => n + t.verses.length, 0)} verses verified against the library)`);
