/**
 * Editorial quality report. Scans the library and the study data and writes
 * data/quality-report.json, which the /editorial page renders. It only
 * reports; it changes nothing. Run: npm run report:quality
 */
import fs from 'node:fs';
import path from 'node:path';
import { wisdomTopics } from '../data/wisdom-for-life';
import { CONCEPT_DETAILS } from '../data/concept-details';
import { READING_JOURNEYS } from '../data/reading-journeys';
import { characters } from '../data/characters';
import { learningPaths } from '../data/learning-paths';
import { CONNECTIONS, COMMENTARIES } from '../data/study-content';
import { chapterOrientations } from '../data/chapter-orientation';
import { FESTIVAL_DATES } from '../data/festival-dates';
import { getContentItems } from '../data/content-status';
import { getAllScriptures } from '../data/scriptures';
import { getScriptureSourceMeta } from '../data/sources-registry';

const ROOT = process.cwd();
const FULL = path.join(ROOT, 'public', 'data', 'scriptures-full');

interface Finding { label: string; count: number; detail: string[]; note?: string }
const findings: Record<string, Finding> = {};
const add = (key: string, label: string, detail: string[], note?: string) => {
  findings[key] = { label, count: detail.length, detail: detail.slice(0, 25), note };
};

/* ── Scan the library ─────────────────────────────────────────────── */
const noSource: string[] = [];
const noTranslation = new Map<string, number>();
const noHindi = new Map<string, number>();
const noTranslit = new Map<string, number>();
const badNumbering: string[] = [];
let verseTotal = 0;
const chapterVerses = new Map<string, Set<string>>();

for (const id of fs.readdirSync(FULL)) {
  const dir = path.join(FULL, id);
  if (!fs.statSync(dir).isDirectory()) continue;
  let sourceChecked = false;
  for (const f of fs.readdirSync(dir)) {
    const m = /^ch-(\d+)\.json$/.exec(f);
    if (!m) continue;
    let d: { source?: { repo?: string }; chapter?: { verses?: Array<Record<string, unknown>> } };
    try { d = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); } catch { badNumbering.push(`${id} ch ${m[1]}: unreadable JSON`); continue; }
    if (!sourceChecked) { sourceChecked = true; if (!d.source?.repo) noSource.push(id); }
    const verses = d.chapter?.verses ?? [];
    const seen = new Set<string>();
    chapterVerses.set(`${id}:${m[1]}`, seen);
    const nums = new Set<string>();
    for (const v of verses) {
      verseTotal++;
      seen.add(String(v.number));
      if (nums.has(String(v.number))) badNumbering.push(`${id} ch ${m[1]}: verse ${v.number} appears twice`);
      nums.add(String(v.number));
      if (!String(v.translation ?? '').trim()) noTranslation.set(id, (noTranslation.get(id) ?? 0) + 1);
      if (!String(v.hindi ?? '').trim()) noHindi.set(id, (noHindi.get(id) ?? 0) + 1);
      if (!String(v.transliteration ?? '').trim()) noTranslit.set(id, (noTranslit.get(id) ?? 0) + 1);
    }
  }
}
const top = (m: Map<string, number>) => [...m.entries()].sort((a, b) => b[1] - a[1]).map(([k, n]) => `${k}: ${n} verses`);

add('missingSources', 'Texts with no recorded source repository', noSource);
add('missingTranslations', 'Scriptures with verses missing an English translation', top(noTranslation), `Total verses scanned: ${verseTotal}.`);
add('missingHindi', 'Scriptures with verses missing a Hindi translation', top(noHindi));
add('missingTransliteration', 'Scriptures with verses missing transliteration', top(noTranslit));
add('numbering', 'Inconsistent verse numbering (duplicates, unreadable files)', badNumbering);

/* ── Verse explanations without a recorded review ─────────────────── */
// Entries in public/data/hi-commentary carry only explanation, science and lifeLesson:
// no reviewer, review date or AI flag is recorded for any of them.
const unreviewed: string[] = [];
let explanationTotal = 0;
const hiDir = path.join(ROOT, 'public', 'data', 'hi-commentary');
for (const f of fs.existsSync(hiDir) ? fs.readdirSync(hiDir) : []) {
  if (!f.endsWith('.json')) continue;
  try {
    const d = JSON.parse(fs.readFileSync(path.join(hiDir, f), 'utf8')) as Record<string, { explanation?: string; review?: unknown; reviewedOn?: unknown }>;
    const n = Object.values(d).filter((e) => e?.explanation && !e.review && !e.reviewedOn).length;
    explanationTotal += n;
    if (n) unreviewed.push(`${f.replace('.json', '')}: ${n} explanations`);
  } catch { /* skip unreadable */ }
}
unreviewed.sort((x, y) => Number(y.split(': ')[1].split(' ')[0]) - Number(x.split(': ')[1].split(' ')[0]));
add('unreviewedExplanations', 'Verse explanations with no recorded review', unreviewed, `${explanationTotal} explanations across ${unreviewed.length} texts have no reviewer, review date or AI flag in the data.`);

/* ── Duplicate slugs and ids ──────────────────────────────────────── */
const dupes = (label: string, ids: string[]) => {
  const seen = new Set<string>();
  return ids.filter((i) => (seen.has(i) ? true : (seen.add(i), false))).map((i) => `${label}: ${i}`);
};
add('duplicateSlugs', 'Duplicate slugs or ids', [
  ...dupes('wisdom topic', wisdomTopics.map((t) => t.slug)),
  ...dupes('journey', READING_JOURNEYS.map((j) => j.id)),
  ...dupes('character', characters.map((c) => c.id)),
  ...dupes('learning path', learningPaths.map((p) => p.id)),
  ...dupes('scripture', getAllScriptures().map((s) => s.id)),
]);

/* ── Links ────────────────────────────────────────────────────────── */
const routeExists = (href: string): boolean => {
  const clean = href.split('#')[0].split('?')[0].replace(/\/$/, '');
  let m = /^\/scripture\/([^/]+)\/chapter\/(\d+)\/verse\/([^/]+)$/.exec(clean);
  if (m) return chapterVerses.get(`${m[1]}:${m[2]}`)?.has(m[3]) ?? false;
  m = /^\/wisdom-for-life\/([^/]+)$/.exec(clean);
  if (m) return wisdomTopics.some((t) => t.slug === m![1]);
  m = /^\/concepts\/([^/]+)$/.exec(clean);
  if (m) return Boolean(CONCEPT_DETAILS[m[1]]);
  m = /^\/journeys\/([^/]+)$/.exec(clean);
  if (m) return READING_JOURNEYS.some((j) => j.id === m![1]);
  m = /^\/learn\/([^/]+)$/.exec(clean);
  if (m) return learningPaths.some((p) => p.id === m![1]) || fs.existsSync(path.join(ROOT, 'app', 'learn', m[1]));
  return fs.existsSync(path.join(ROOT, 'app', ...clean.split('/').filter(Boolean)));
};
const links: Array<[string, string]> = [];
Object.entries(CONNECTIONS).forEach(([k, list]) => list.forEach((c) => c.href && links.push([`connection from ${k}`, c.href])));
READING_JOURNEYS.forEach((j) => {
  j.related.forEach((r) => links.push([`journey ${j.id} related`, r.href]));
  j.lessons.forEach((l) => links.push([`journey ${j.id} ${l.id}`, `/scripture/${l.scriptureId}/chapter/${l.chapter}/verse/${l.verse}`]));
});
chapterOrientations.forEach((o) => o.importantVerses.forEach((v) => links.push([`orientation ${o.scriptureId} ${o.chapter}`, `/scripture/${o.scriptureId}/chapter/${o.chapter}/verse/${v.verse}`])));
add('brokenLinks', 'Links in study content that do not resolve', links.filter(([, h]) => !routeExists(h)).map(([w, h]) => `${w}: ${h}`), `Checked ${links.length} links.`);

/* ── Context, attribution, review dates ───────────────────────────── */
const gitaChapters = [...chapterVerses.keys()].filter((k) => k.startsWith('bhagavadgita:')).map((k) => Number(k.split(':')[1]));
add('missingContext', 'Gita chapters without an orientation', gitaChapters.filter((c) => !chapterOrientations.some((o) => o.scriptureId === 'bhagavadgita' && o.chapter === c)).sort((a, b) => a - b).map((c) => `Bhagavad Gita chapter ${c}`));
add('unattributed', 'Commentary entries missing edition or publication', Object.entries(COMMENTARIES).flatMap(([k, list]) => list.filter((c) => !c.sourceEdition || !c.publication).map((c) => `${k}: ${c.commentator}`)), `Reviewed commentary entries in the registry: ${Object.values(COMMENTARIES).flat().length}.`);
add('noTraditionalCommentaryAuthor', 'Scriptures with no recorded traditional commentator', getAllScriptures().filter((s) => /not recorded/i.test(getScriptureSourceMeta(s.id).traditionalCommentaryAuthor)).map((s) => s.id));
add('missingReviewDates', 'Scriptures with no recorded editorial review date', getAllScriptures().filter((s) => /not recorded/i.test(getScriptureSourceMeta(s.id).dateReviewed)).map((s) => s.id));
const items = getContentItems();
add('unreviewedItems', 'Study content not yet approved or published', items.filter((i) => i.status !== 'approved' && i.status !== 'published').map((i) => `${i.kind}: ${i.title} (${i.status})`));
add('journeysNoReviewDate', 'Journeys with no review date', READING_JOURNEYS.filter((j) => !j.reviewedOn).map((j) => j.title));

/* ── Stale dynamic information ────────────────────────────────────── */
const today = new Date().toISOString().slice(0, 10);
const last = FESTIVAL_DATES.map((f) => f.date).sort().pop() ?? '';
const horizon = new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10);
add('staleDynamic', 'Dynamic information that is stale or about to be', last < horizon ? [`Festival dates end on ${last || 'never'}, less than 90 days after ${today}. Add the next year’s dates.`] : []);

/* ── Not measurable here ──────────────────────────────────────────── */
const notMeasured = [
  'Explanations with low clarity feedback: feedback is stored only on each reader’s device, so there is nothing to aggregate until a collection endpoint exists.',
  'Pending correction reports: the site has no public correction channel yet.',
];

const out = { generatedAt: new Date().toISOString(), verseTotal, findings, notMeasured, items };
fs.writeFileSync(path.join(ROOT, 'data', 'quality-report.json'), JSON.stringify(out, null, 2));
console.log(`Wrote data/quality-report.json (${Object.keys(findings).length} checks, ${verseTotal} verses scanned).`);
for (const [k, f] of Object.entries(findings)) console.log(`${String(f.count).padStart(5)}  ${f.label}`);
