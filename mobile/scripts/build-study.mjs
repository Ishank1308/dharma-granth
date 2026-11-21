// Build the chapter summaries the Android app bundles, from the website's own data files.
//
//   node scripts/build-study.mjs
//
// Sources (the same TypeScript modules the website renders, read with Node's type stripping):
//   ../data/chapter-summaries.ts     chapter summaries (सार), Hindi and English, per scripture
//   ../data/chapter-orientation.ts   chapter names and key verses, where a summary has none of its own
//
// Output (git-ignored with the rest of src/content/generated/; build-content.mjs calls this):
//   src/content/generated/study/summaries.json
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

export const STUDY_FILES = ['summaries.json'].map((f) => join(OUT, f));

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
  const chapters = Object.values(summaries).reduce((n, s) => n + s.chapters.length, 0);
  console.log(`[study] ${chapters} chapter summaries in ${Object.keys(summaries).length} texts`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await buildStudy();
}
