// Build the chapter summaries and quizzes the Android app bundles, from the website's own data files.
//
//   node scripts/build-study.mjs
//
// Sources (the same TypeScript modules the website renders, read with Node's type stripping):
//   ../data/chapter-summaries.ts     chapter summaries (सार), Hindi and English, per scripture
//   ../data/chapter-orientation.ts   chapter names and key verses, where a summary has none of its own
//   ../data/learning-paths.ts        the "Knowledge check" quiz of each course on /learn/
//   ../data/quizzes.ts               the standalone quizzes
//
// Output (git-ignored with the rest of src/content/generated/; build-content.mjs calls this):
//   src/content/generated/study/summaries.json
//   src/content/generated/study/quizzes.json
//
// Both are small (about 60 KB together), so they ship whole and load with the screen that needs them.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { register } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const MOBILE = resolve(HERE, '..');
const DATA = resolve(MOBILE, '../data');
const OUT = join(MOBILE, 'src/content/generated/study');

export const STUDY_FILES = ['summaries.json', 'quizzes.json'].map((f) => join(OUT, f));

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

/**
 * Which books each quiz belongs to, by the quiz's category on the website. A quiz is offered on these
 * books' pages, and every quiz is listed on the quiz screen.
 */
const QUIZ_BOOKS = {
  'Bhagavad Gita': ['bhagavadgita'],
  Yoga: ['yogasutra', 'shivasamhita'],
  Upanishads: ['ishavasya', 'kena', 'katha', 'prashna', 'mundaka', 'mandukya', 'taittiriya', 'aitareya', 'chandogya', 'brihadaranyaka', 'shvetashvatara'],
  Vedas: ['rigveda', 'samaveda', 'yajurveda', 'atharvaveda'],
  Ramayana: ['ramayana', 'ramcharitmanas'],
  Mahabharata: ['mahabharata'],
  Vedanta: ['brahmasutra', 'vivekchudamani', 'ashtavakragita', 'yogavasishtha'],
  Bhakti: ['naradabhaktisutra', 'shandilyabhaktisutra', 'vinayapatrika', 'ramcharitmanas'],
  Ethics: ['viduraniti', 'manusmriti'],
};

const clean = (s) => (typeof s === 'string' ? s.trim() : s);

export async function buildStudy() {
  if (!existsSync(join(DATA, 'chapter-summaries.ts'))) {
    console.warn('[study] ../data/chapter-summaries.ts not found; skipping summaries and quizzes');
    return;
  }
  if (!hooked) {
    register(`data:text/javascript,${encodeURIComponent(HOOK)}`, pathToFileURL(HERE + '/'));
    hooked = true;
  }
  const url = (f) => pathToFileURL(join(DATA, f)).href;
  const { chapterSummaryCollections } = await import(url('chapter-summaries.ts'));
  const { getChapterOrientation } = await import(url('chapter-orientation.ts'));
  const { learningPaths } = await import(url('learning-paths.ts'));
  const { quizzes: standalone } = await import(url('quizzes.ts'));

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

  // Book ids in the app's catalog (built just before this by build-content.mjs), so a quiz never points
  // at a book the app does not list.
  const catalogFile = join(MOBILE, 'src/content/generated/catalog.json');
  const known = existsSync(catalogFile) ? new Set(JSON.parse(readFileSync(catalogFile, 'utf8')).map((b) => b.id)) : null;

  // Quizzes: each course's knowledge check first (these are the ones live on /learn/), then the
  // standalone set. Ids are unique across both.
  const quizzes = [];
  const seen = new Set();
  const add = (q, course) => {
    if (!q || seen.has(q.id) || !Array.isArray(q.questions) || q.questions.length === 0) return;
    seen.add(q.id);
    const questions = q.questions
      .filter((x) => Array.isArray(x.options) && x.correctIndex >= 0 && x.correctIndex < x.options.length)
      .map((x) => ({
        id: x.id,
        q: clean(x.question),
        options: x.options.map(clean),
        answer: x.correctIndex,
        why: clean(x.explanation),
      }));
    quizzes.push({
      id: q.id,
      title: clean(q.title),
      titleHi: clean(q.titleSanskrit),
      description: clean(q.description),
      category: q.category,
      difficulty: q.difficulty,
      books: (QUIZ_BOOKS[q.category] ?? []).filter((id) => !known || known.has(id)),
      ...(course ? { course: { title: clean(course.title), titleHi: clean(course.titleSanskrit), icon: course.icon } } : {}),
      questions,
    });
  };
  for (const p of learningPaths) add(p.quiz, p);
  for (const q of standalone) add(q);

  mkdirSync(OUT, { recursive: true });
  writeFileSync(join(OUT, 'summaries.json'), JSON.stringify(summaries));
  writeFileSync(join(OUT, 'quizzes.json'), JSON.stringify(quizzes));
  const chapters = Object.values(summaries).reduce((n, s) => n + s.chapters.length, 0);
  const questions = quizzes.reduce((n, q) => n + q.questions.length, 0);
  console.log(
    `[study] ${chapters} chapter summaries in ${Object.keys(summaries).length} texts, ${quizzes.length} quizzes (${questions} questions)`,
  );
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await buildStudy();
}
