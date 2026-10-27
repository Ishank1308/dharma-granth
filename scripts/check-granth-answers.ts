/**
 * Guard for Granth se Poochhiye (data/granth-answers). Fails the build if:
 *
 *   - a slug repeats, a `next` slug does not exist, or a required field is empty;
 *   - a cited verse cannot be found, or lacks real Sanskrit, Hindi or English
 *     (the answer pages show only verses the library has in full);
 *   - an answer has fewer than two verses, or a story or science note has no source;
 *   - the Hindi notes use a word docs/vyakhya-guide.md replaces.
 *
 * Run: tsx scripts/check-granth-answers.ts
 */
import { GRANTH_ANSWERS, ANSWER_THEMES } from '../data/granth-answers';
import { resolveAnswerVerse } from '../lib/granth-answers-server';

const problems: string[] = [];
const fail = (slug: string, msg: string) => problems.push(`${slug}: ${msg}`);

// Words docs/vyakhya-guide.md replaces with tatsam Hindi (subset of scripts/check-hindi-register.mjs).
const AVOID = [
  'चीज़', 'चीज', 'ज़रूरत', 'जरूरत', 'ज़रूरी', 'जरूरी', 'कीमत', 'बिल्कुल', 'भरोसा', 'सही', 'गलत', 'ग़लत', 'पैदा',
  'आदत', 'याद', 'शुरू', 'शुरुआत', 'ज़िंदगी', 'जिंदगी', 'दुनिया', 'मदद', 'कोशिश', 'फायदा', 'नुकसान', 'नुक़सान', 'खुद', 'ख़ुद',
  'मुश्किल', 'ज़्यादा', 'ज्यादा', 'सिर्फ', 'सिर्फ़', 'लेकिन', 'हमेशा', 'आसान', 'तरीका', 'दिल', 'खुश', 'सवाल', 'जवाब',
  'पूरी तरह', 'कमज़ोर', 'कमजोर', 'बस', 'ईमानदार', 'बेचैन', 'तनाव', 'थकान', 'किस्मत', 'बेकार',
];
const DEV = 'ऀ-ॿ';
const AVOID_RE = AVOID.map((w) => [w, new RegExp(`(^|[^${DEV}])${w}(ें|ों|ी|े|ा)?(?=$|[^${DEV}])`, 'u')] as const);
// Informal address to the reader; Bhagavan's own words are quoted, so they are fine.
const INFORMAL = /(^|[^ऀ-ॿ])(तुम|तुम्हें|तुम्हारा|तुम्हारी|तुम्हारे)(?=$|[^ऀ-ॿ])/u;

const slugs = new Set<string>();
const themes = new Set(ANSWER_THEMES.map((t) => t.id));
for (const a of GRANTH_ANSWERS) {
  if (slugs.has(a.slug)) fail(a.slug, 'duplicate slug');
  slugs.add(a.slug);
}

for (const a of GRANTH_ANSWERS) {
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(a.slug)) fail(a.slug, 'slug must be lowercase words joined by hyphens');
  if (!themes.has(a.theme)) fail(a.slug, `unknown theme ${a.theme}`);
  for (const k of ['questionHi', 'questionEn', 'sarHi', 'sarEn', 'practiceHi', 'practiceEn'] as const) {
    if (!a[k]?.trim()) fail(a.slug, `${k} is empty`);
  }
  if (a.sarEn.length > 260 || a.sarHi.length > 260) fail(a.slug, 'सार is longer than 260 characters; keep it to one or two lines');
  if (a.terms.length < 5) fail(a.slug, 'needs at least 5 search terms');
  if (a.verses.length < 2) fail(a.slug, 'needs at least 2 verses');
  for (const n of a.next) if (!slugs.has(n)) fail(a.slug, `next question "${n}" does not exist`);
  if (a.next.includes(a.slug)) fail(a.slug, 'links to itself in next');
  if (a.story && (!a.story.sourceHi.trim() || !a.story.sourceEn.trim())) fail(a.slug, 'story has no source');
  if (a.crisis && !a.care) fail(a.slug, 'a crisis page needs the care note too');
  if (a.help?.length && !a.care) fail(a.slug, 'helplines show only in the care note, so an answer with help needs care');
  if (a.science && (!a.science.hi.trim() || !a.science.en.trim() || !a.science.source.trim())) fail(a.slug, 'science note needs Hindi, English and a named source');

  for (const v of a.verses) {
    if (!resolveAnswerVerse(v)) fail(a.slug, `${v.s} ${v.c}:${v.v} is missing or lacks Sanskrit, Hindi or English`);
    if (!v.whyHi.trim() || !v.whyEn.trim()) fail(a.slug, `${v.s} ${v.c}:${v.v} has no why-line`);
  }

  const hindi = [a.sarHi, a.practiceHi, a.questionHi, ...a.verses.map((v) => v.whyHi)];
  if (a.story) hindi.push(a.story.titleHi, a.story.hi);
  if (a.myth) hindi.push(a.myth.hi, a.myth.truthHi);
  if (a.science) hindi.push(a.science.hi);
  for (const text of hindi) {
    const hits = AVOID_RE.filter(([, r]) => r.test(text)).map(([w]) => w);
    if (hits.length) fail(a.slug, `Hindi uses ${hits.join(', ')} (see docs/vyakhya-guide.md): ${text.slice(0, 80)}`);
    if (INFORMAL.test(text) && !/[“"‘']|कहते हैं|कहा|प्रार्थना/.test(text) && !a.verses.some((v) => v.whyHi === text)) {
      fail(a.slug, `addresses the reader as तुम: ${text.slice(0, 80)}`);
    }
  }
}

if (problems.length) {
  console.error(`check-granth-answers: ${problems.length} problem(s)`);
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}
console.log(`check-granth-answers: ${GRANTH_ANSWERS.length} answers, all verses resolve with Sanskrit, Hindi and English`);
