// Build the chapter summaries the Android app bundles, from the website's own data files.
//
//   node scripts/build-study.mjs
//
// Sources (the same TypeScript modules the website renders, read with Node's type stripping):
//   ../data/chapter-summaries.ts     chapter summaries (सार), Hindi and English, per scripture
//   ../data/chapter-orientation.ts   chapter names and key verses, where a summary has none of its own
//
//   ../data/scripture-comparisons.ts scripture pages side by side (/compare)
//   ../data/sources-registry.ts      each text's edition and provenance (/sources)
//
// Output (git-ignored with the rest of src/content/generated/; build-content.mjs calls this):
//   src/content/generated/study/summaries.json
//   src/content/generated/study/compare.json
//   src/content/generated/study/sources.json
//
// It is small (about 55 KB), so it ships whole and loads with the screens that need it.
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { register } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const MOBILE = resolve(HERE, '..');
const DATA = resolve(MOBILE, '../data');
const OUT = join(MOBILE, 'src/content/generated/study');

export const STUDY_FILES = ['summaries.json', 'compare.json', 'sources.json'].map((f) => join(OUT, f));

/**
 * The website's data files import each other without extensions (`./gita-chapter-summaries`), as
 * TypeScript allows. Node does not, so this hook retries such an import with `.ts`.
 */
const HOOK = `
export async function resolve(specifier, context, next) {
  try {
    return await next(specifier, context);
  } catch (err) {
    if ((specifier.startsWith('./') || specifier.startsWith('../')) && !/\\.[cm]?[jt]s$/.test(specifier)) {
      return next(specifier + '.ts', context);
    }
    throw err;
  }
}`;
let hooked = false;

const clean = (s) => (typeof s === 'string' ? s.trim() : s);

/**
 * Where a website link on the compare page goes in the app: a verse, chapter or book in the reader, a
 * knowledge or Wisdom page, or (for pages the app does not have) the website.
 */
export function compareTarget(href) {
  const path = href.split('#')[0].replace(/\/+$/, '');
  const hash = href.includes('#') ? href.split('#')[1] : '';
  let m;
  if ((m = /^\/scripture\/([a-z0-9-]+)\/chapter\/(\d+)\/verse\/([\w.-]+)$/.exec(path))) return { kind: 'verse', id: m[1], chapter: Number(m[2]), verse: m[3] };
  if ((m = /^\/scripture\/([a-z0-9-]+)\/chapter\/(\d+)$/.exec(path))) return { kind: 'chapter', id: m[1], chapter: Number(m[2]) };
  if ((m = /^\/scripture\/([a-z0-9-]+)$/.exec(path))) return { kind: 'book', id: m[1] };
  if ((m = /^\/concepts\/([a-z0-9-]+)$/.exec(path))) return { kind: 'knowledge', section: 'concepts', id: m[1] };
  if ((m = /^\/wisdom-for-life\/([a-z0-9-]+)$/.exec(path))) return { kind: 'wisdom', id: m[1] };
  if (path === '/timelines' && hash) return { kind: 'knowledge', section: 'timelines', id: hash };
  return { kind: 'web', url: `https://dharmagranth.dev${href.startsWith('/') ? href : `/${href}`}` };
}

export async function buildStudy() {
  if (!existsSync(join(DATA, 'chapter-summaries.ts'))) {
    console.warn('[study] ../data/chapter-summaries.ts not found; skipping chapter summaries');
    return;
  }
  if (!hooked) {
    register(`data:text/javascript,${encodeURIComponent(HOOK)}`, pathToFileURL(HERE + '/'));
    hooked = true;
  }
  const url = (f) => pathToFileURL(join(DATA, f)).href;
  const { chapterSummaryCollections } = await import(url('chapter-summaries.ts'));
  const { getChapterOrientation } = await import(url('chapter-orientation.ts'));

  // Summaries, keyed by scripture id. Chapter names and key verses fall back to the chapter's
  // orientation, exactly as the website's summary page does.
  const summaries = {};
  for (const c of chapterSummaryCollections) {
    summaries[c.scriptureId] = {
      unit: { en: c.unitEn, hi: c.unitHi },
      heading: { en: c.headingEn, hi: c.headingHi },
      // Key verses are called मुख्य सूत्र in a sutra text, मुख्य श्लोक elsewhere.
      sutras: String(c.keyVersesHi).includes('सूत्र'),
      chapters: c.chapters.map((s) => {
        const o = getChapterOrientation(c.scriptureId, s.chapter);
        const keyVerses = (s.keyVerses ?? o?.importantVerses ?? []).map((k) => ({ verse: k.verse, note: clean(k.note) }));
        return {
          chapter: s.chapter,
          nameHi: s.nameHi ?? o?.nameHi,
          nameEn: s.nameEn ?? o?.nameEn,
          hi: clean(s.summaryHi),
          en: clean(s.summaryEn),
          keyVerses,
          reviewed: s.review === 'approved',
        };
      }),
    };
  }

  mkdirSync(OUT, { recursive: true });
  writeFileSync(join(OUT, 'summaries.json'), JSON.stringify(summaries));

  const { SCRIPTURE_COMPARISONS } = await import(url('scripture-comparisons.ts'));
  const compare = SCRIPTURE_COMPARISONS.map((c) => ({
    id: c.id,
    title: { en: c.titleEn, hi: c.titleHi },
    blurb: { en: clean(c.blurbEn), hi: clean(c.blurbHi) },
    links: c.links.map((l) => ({ title: { en: l.titleEn, hi: l.titleHi }, note: { en: clean(l.noteEn), hi: clean(l.noteHi) }, target: compareTarget(l.href) })),
  }));
  writeFileSync(join(OUT, 'compare.json'), JSON.stringify(compare));

  const { SCRIPTURE_SOURCES } = await import(url('sources-registry.ts'));
  const KEEP = ['sourceScriptureTitle', 'sourceScriptureTitleSanskrit', 'sanskritEdition', 'publisherArchive', 'archiveUrl', 'primaryTranslator', 'traditionalCommentaryAuthor', 'numberingSystemNote'];
  const sources = {};
  for (const [id, meta] of Object.entries(SCRIPTURE_SOURCES)) {
    const row = {};
    for (const k of KEEP) if (typeof meta[k] === 'string' && meta[k].trim()) row[k] = meta[k].trim();
    if (row.sanskritEdition) sources[id] = row;
  }
  writeFileSync(join(OUT, 'sources.json'), JSON.stringify(sources));
  console.log(`[study] ${compare.length} comparison sets, ${Object.keys(sources).length} source editions`);
  const chapters = Object.values(summaries).reduce((n, s) => n + s.chapters.length, 0);
  console.log(`[study] ${chapters} chapter summaries in ${Object.keys(summaries).length} texts`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await buildStudy();
}
