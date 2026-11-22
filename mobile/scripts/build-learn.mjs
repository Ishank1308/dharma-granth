// Build the Learn section the Android app bundles, from the website's own data files.
//
//   node scripts/build-learn.mjs
//
// Sources (the same modules app/learn/**, app/daily and app/learn/faq render, read with Node's type stripping):
//   ../data/learning-paths.ts      the courses of /learn and /learn/<course> (quizzes left out: the app has none)
//   ../data/reading-journeys.ts    the guided reading journeys of /learn/journeys/<id>
//   ../data/gita-journey-data.ts   the Gita journey of /learn/journeys/gita (18 chapters in three shatkas)
//   ../data/daily-wisdom-engine.ts the daily dharma journey of /daily
//   ../data/scripture-faqs.ts      the questions of /learn/faq
//   ../data/journeys.ts            the "discover your path" recommendations of /learn/start
//   ../app/learn/start/StartJourney.tsx  its five questions (a plain array literal, read as text)
//
// Journey lessons name a verse; its text comes from the bundled chapter files that build-content.mjs wrote,
// exactly as the website reads it from the library at build time, so a lesson always shows the whole verse.
//
// Output (git-ignored with the rest of src/content/generated/; build-content.mjs calls this):
//   src/content/generated/learn/<part>.json   one file per screen family
//   src/content/generated/learn/loaders.ts    a lazy require() per part
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const MOBILE = resolve(HERE, '..');
const ROOT = resolve(MOBILE, '..');
const DATA = join(ROOT, 'data');
const OUT = join(MOBILE, 'src/content/generated/learn');
const BOOKS = join(MOBILE, 'src/content/generated/assets/content/books');

export const LEARN_PARTS = ['courses', 'journeys', 'gita', 'daily', 'faq', 'discover'];

let hooked = false;
function hook() {
  if (hooked) return;
  hooked = true;
  registerHooks({
    resolve(specifier, context, next) {
      // The website's "@/" alias is the repository root.
      const spec = specifier.startsWith('@/') ? pathToFileURL(join(ROOT, specifier.slice(2))).href : specifier;
      try {
        return next(spec, context);
      } catch (err) {
        const relative = spec.startsWith('.') || spec.startsWith('file:');
        if (relative && !/\.[cm]?[jt]sx?$/.test(spec)) {
          try {
            return next(`${spec}.ts`, context);
          } catch {
            return next(`${spec}/index.ts`, context);
          }
        }
        throw err;
      }
    },
  });
}

const load = (name) => import(pathToFileURL(join(DATA, `${name}.ts`)).href);
const trim = (s) => (typeof s === 'string' ? s.trim() : s);
const pair = (en, hi) => ({ en: trim(en) ?? '', hi: trim(hi) || trim(en) || '' });

/** "from-emerald-700 via-teal-800" -> "emerald", for the app's hue map. */
function hueOf(gradient) {
  const m = /from-([a-z]+)-/.exec(gradient ?? '');
  return m ? m[1] : 'saffron';
}

function mindmap(node) {
  return {
    id: node.id,
    label: node.label,
    sanskrit: node.labelSanskrit ?? '',
    description: node.description ?? '',
    children: (node.children ?? []).map(mindmap),
  };
}

async function buildCourses() {
  const { learningPaths } = await load('learning-paths');
  return {
    items: learningPaths.map((c) => ({
      id: c.id,
      title: c.title,
      sanskrit: c.titleSanskrit,
      subtitle: c.subtitle,
      objective: c.learningObjective,
      level: c.difficulty,
      levelLabel: c.difficultySanskrit,
      minutes: c.estimatedMinutes,
      icon: c.icon,
      hue: hueOf(c.gradient),
      overview: {
        mangal: {
          sanskrit: c.overview.mangalCharan.sanskrit,
          translit: c.overview.mangalCharan.transliteration,
          meaning: c.overview.mangalCharan.meaning,
          source: c.overview.mangalCharan.source,
        },
        premise: c.overview.philosophicalPremise,
        context: c.overview.scholarlyContext,
        prerequisites: c.overview.prerequisites,
        method: c.overview.studyMethodology,
        outcomes: c.overview.learningOutcomes,
      },
      lessons: c.lessons
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((l) => ({
          id: l.id,
          title: l.title,
          sanskrit: l.titleSanskrit ?? '',
          description: l.description,
          minutes: l.estimatedMinutes,
          href: l.scriptureHref,
          verse: l.keyVerse
            ? { sanskrit: l.keyVerse.sanskrit, translit: l.keyVerse.transliteration, en: l.keyVerse.translation, ref: l.keyVerse.reference }
            : null,
          concepts: l.conceptsCovered,
        })),
      concepts: c.keyConcepts.map((k) => ({
        id: k.id,
        term: k.term,
        sanskrit: k.sanskrit,
        translit: k.transliteration,
        definition: k.definition,
        context: k.philosophicalContext,
        anchor: k.scriptureAnchor,
      })),
      scriptures: c.relatedScriptures.map((s) => ({
        id: s.id,
        title: s.title,
        sanskrit: s.titleSanskrit,
        description: s.description,
        href: s.href,
      })),
      flashcards: c.flashcards.map((f) => ({
        sanskrit: f.front.sanskrit ?? '',
        translit: f.front.transliteration ?? '',
        question: f.front.question,
        hi: f.back.hindi ?? '',
        en: f.back.english,
        note: f.back.explanation ?? '',
      })),
      slides: c.slides.map((s) => ({
        id: s.id,
        sanskrit: s.sanskrit ?? '',
        translit: s.transliteration ?? '',
        hi: s.hindi ?? '',
        en: s.english,
        explanation: s.explanation ?? '',
        keywords: s.keywords ?? [],
      })),
      mindmap: mindmap(c.mindmap),
      timeline: c.timeline.map((e) => ({ id: e.id, year: e.year, title: e.title, description: e.description, sanskrit: e.sanskrit ?? '' })),
      revision: {
        cadence: c.revisionRecommendations.cadence,
        today: c.revisionRecommendations.recommendedReviewToday,
        verses: c.revisionRecommendations.coreVersesToMemorize.map((v) => ({
          sanskrit: v.sanskrit,
          translit: v.transliteration,
          en: v.translation,
          ref: v.reference,
          key: v.philosophicalKey,
        })),
        reflection: c.revisionRecommendations.contemplativeReflection,
        checklist: c.revisionRecommendations.activeRecallChecklist,
      },
    })),
  };
}

const chapterCache = new Map();
function bundledChapter(id, chapter) {
  const key = `${id}/${chapter}`;
  if (!chapterCache.has(key)) {
    const file = join(BOOKS, id, `ch-${chapter}.json`);
    chapterCache.set(key, existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : null);
  }
  return chapterCache.get(key);
}

/** The verse as the reader shows it, with the translation of a passage carried to each of its verses. */
function libraryVerse(id, chapter, verse) {
  const ch = bundledChapter(id, chapter);
  const verses = ch?.verses ?? [];
  const v = verses.find((x) => String(x.number) === String(verse));
  if (!v) return null;
  const shared = v.translationSeeVerse != null ? verses.find((x) => String(x.number) === String(v.translationSeeVerse)) : null;
  return {
    sanskrit: trim(v.sanskrit) ?? '',
    translit: trim(v.transliteration) ?? '',
    hi: trim(v.hindi) || trim(shared?.hindi) || '',
    en: trim(v.translation) || trim(shared?.translation) || '',
  };
}

const TITLES = {
  bhagavadgita: { en: 'Bhagavad Gita', hi: 'भगवद्गीता' },
  katha: { en: 'Katha Upanishad', hi: 'कठोपनिषद्' },
  mundaka: { en: 'Mundaka Upanishad', hi: 'मुण्डकोपनिषद्' },
  ishavasya: { en: 'Isha Upanishad', hi: 'ईशावास्योपनिषद्' },
  brihadaranyaka: { en: 'Brihadaranyaka Upanishad', hi: 'बृहदारण्यकोपनिषद्' },
};

async function buildJourneys() {
  const { READING_JOURNEYS } = await load('reading-journeys');
  const missing = [];
  const items = READING_JOURNEYS.map((j) => ({
    id: j.id,
    title: pair(j.title, j.titleHi),
    objective: j.objective,
    audience: j.audience,
    minutes: j.minutesPerLesson,
    curator: j.curator,
    reviewedOn: j.reviewedOn,
    review: j.review,
    category: j.category ?? 'foundations',
    level: j.difficulty ?? 'beginner',
    icon: j.icon ?? '📿',
    sources: j.sources,
    lessons: j.lessons.map((l) => {
      const v = bundledChapter(l.scriptureId, l.chapter) ? libraryVerse(l.scriptureId, l.chapter, l.verse) : null;
      if (!v) missing.push(`${j.id}/${l.id} ${l.scriptureId} ${l.chapter}.${l.verse}`);
      const title = TITLES[l.scriptureId] ?? { en: l.scriptureId, hi: l.scriptureId };
      return {
        id: l.id,
        scriptureId: l.scriptureId,
        chapter: l.chapter,
        verse: String(l.verse),
        ref: { en: `${title.en} ${l.chapter}.${l.verse}`, hi: `${title.hi} ${l.chapter}.${l.verse}` },
        text: v,
        context: l.context,
        explanation: l.explanation,
        reflection: l.reflection,
        activity: l.activity ?? '',
      };
    }),
  }));
  if (missing.length) console.warn(`[learn] ${missing.length} journey verses not found in the bundled text:\n  ${missing.join('\n  ')}`);
  return { items };
}

async function buildGita() {
  const { GITA_SHATKAS, GITA_CHAPTER_JOURNEYS } = await load('gita-journey-data');
  return {
    shatkas: Object.values(GITA_SHATKAS).map((s) => ({
      id: s.id,
      name: pair(s.name, s.nameHi),
      mahavakya: s.mahavakyaPart,
      theme: pair(s.theme, s.themeHi),
      // "Chapters 1–6" -> "1–6"; the screen adds the word in the reader's language.
      range: s.chaptersRange.replace(/^\D+/, ''),
      description: pair(s.description, s.descriptionHi),
    })),
    items: GITA_CHAPTER_JOURNEYS.map((c) => ({
      chapter: c.chapter,
      title: pair(c.title, c.titleHi),
      sanskrit: c.sanskritName,
      translit: c.transliteration,
      shatka: c.shatka,
      verses: c.versesCount,
      dilemma: pair(c.dilemmaSummary, c.dilemmaSummaryHi),
      crisis: pair(c.arjunaCrisis, c.arjunaCrisisHi),
      counsel: pair(c.krishnaCounsel, c.krishnaCounselHi),
      keyVerse: {
        ref: c.keyVerse.ref,
        verse: c.keyVerse.verseNumber,
        sanskrit: c.keyVerse.sanskrit,
        translit: c.keyVerse.iast,
        meaning: pair(c.keyVerse.english, c.keyVerse.hindi),
      },
      life: pair(c.lifeApplication, c.lifeApplicationHi),
      tag: pair(c.dilemmaTag, c.dilemmaTagHi),
    })),
  };
}

async function buildDaily() {
  const { DAILY_WISDOM_REGISTRY } = await load('daily-wisdom-engine');
  return {
    items: DAILY_WISDOM_REGISTRY.map((d) => ({
      id: d.id,
      scriptureId: d.scriptureId,
      scripture: pair(d.scriptureTitle, d.scriptureTitleSanskrit),
      chapter: d.chapterId,
      chapterTitle: d.chapterTitle,
      verse: String(d.verseId),
      sanskrit: d.sanskrit,
      translit: d.transliteration,
      meter: d.meter ?? '',
      meaning: pair(d.translation, d.hindi),
      words: d.wordMeaning,
      teaching: pair(d.practicalTeaching, d.practicalTeachingHi),
      reflection: pair(d.reflectionPrompt, d.reflectionPromptHi),
      challenge: pair(d.dailyChallenge, d.dailyChallengeHi),
      theme: d.theme,
    })),
  };
}

const FAQ_CATEGORIES = [
  { key: 'canon', en: 'Scripture & Canon', hi: 'श्रुति व स्मृति' },
  { key: 'ethics', en: 'Ethics & Life', hi: 'नीति व कर्म' },
  { key: 'philosophy', en: 'Philosophical Schools', hi: 'दर्शन परम्परा' },
  { key: 'misconceptions', en: 'Misconceptions', hi: 'भ्रम व निवारण' },
];

async function buildFaq() {
  const { SCRIPTURE_FAQS } = await load('scripture-faqs');
  return {
    categories: FAQ_CATEGORIES,
    items: SCRIPTURE_FAQS.map((f) => ({
      id: f.id,
      category: f.category,
      question: pair(f.questionEn, f.questionHi),
      answer: pair(f.answerEn, f.answerHi),
      refs: f.canonicalReferences ?? [],
      reviewer: f.reviewer ?? '',
      reviewed: f.lastReviewed ?? '',
    })),
  };
}

/** The five questions of /learn/start, read from the component's array literal (it holds only data). */
function discoveryQuestions() {
  const src = readFileSync(join(ROOT, 'app/learn/start/StartJourney.tsx'), 'utf8');
  const m = /const DISCOVERY_QUESTIONS: QuestionDef\[\] = (\[[\s\S]*?\n\]);/.exec(src);
  if (!m) throw new Error('[learn] DISCOVERY_QUESTIONS not found in app/learn/start/StartJourney.tsx');
  if (/\b(require|import|process|globalThis|Function)\b/.test(m[1])) throw new Error('[learn] DISCOVERY_QUESTIONS is not plain data');
  // A literal of strings and objects only, checked above; evaluated with no scope.
  return new Function(`"use strict"; return (${m[1]});`)();
}

/**
 * Every answer combination runs through the website's own buildRecommendations, so the app recommends
 * exactly what the website does. Identical recommendations are stored once and referred to by index.
 */
async function buildDiscover() {
  const { buildRecommendations } = await load('journeys');
  const questions = discoveryQuestions().map((q) => ({
    key: q.key,
    question: pair(q.en.replace(/^\d+\.\s*/, ''), q.hi.replace(/^\d+\.\s*/, '')),
    options: q.options.map((o) => ({ value: o.value, label: pair(o.en, o.hi), icon: o.icon ?? '' })),
  }));
  const recs = [];
  const recIndex = new Map();
  const summaries = [];
  const summaryIndex = new Map();
  const intern = (list, index, value) => {
    const key = JSON.stringify(value);
    if (!index.has(key)) {
      index.set(key, list.length);
      list.push(value);
    }
    return index.get(key);
  };
  const table = {};
  const walk = (i, answers) => {
    if (i === questions.length) {
      const s = buildRecommendations(answers);
      const parts = [s.primaryJourney, s.scripture, s.concept, s.dailyPractice, s.alternativePath].map((r) =>
        intern(recs, recIndex, {
          kind: r.category,
          kindHi: r.categoryHi,
          id: r.id,
          title: pair(r.title, r.titleHi),
          summary: r.summary,
          href: r.href,
          reason: r.reason,
        }),
      );
      table[questions.map((q) => answers[q.key]).join('|')] = [...parts, intern(summaries, summaryIndex, s.explanationSummary)];
      return;
    }
    for (const o of questions[i].options) walk(i + 1, { ...answers, [questions[i].key]: o.value });
  };
  walk(0, {});
  // Keep only the questions that change a recommendation (today the format question changes none), so the
  // table stays small; the screen still asks all five, as the website does.
  const keyOf = (values, dims) => dims.map((d) => values[d]).join('|');
  const all = questions.map((_, i) => i);
  const dims = all.filter((i) =>
    Object.entries(table).some(([k, v]) => {
      const p = k.split('|');
      return questions[i].options.some((o) => {
        const q = [...p];
        q[i] = o.value;
        return JSON.stringify(table[q.join('|')]) !== JSON.stringify(v);
      });
    }),
  );
  const compact = {};
  for (const [k, v] of Object.entries(table)) compact[keyOf(k.split('|'), dims)] = v;
  return { questions, keys: dims.map((i) => questions[i].key), recs, summaries, table: compact };
}

const PARTS = {
  courses: buildCourses,
  journeys: buildJourneys,
  gita: buildGita,
  daily: buildDaily,
  faq: buildFaq,
  discover: buildDiscover,
};

export async function buildLearn() {
  hook();
  const emit = process.emitWarning;
  process.emitWarning = (warning, ...rest) => {
    const code = typeof rest[0] === 'object' ? rest[0]?.code : rest[1];
    if (code !== 'MODULE_TYPELESS_PACKAGE_JSON') emit.call(process, warning, ...rest);
  };
  mkdirSync(OUT, { recursive: true });
  const sizes = [];
  for (const [part, build] of Object.entries(PARTS)) {
    const data = await build();
    const json = JSON.stringify(data);
    writeFileSync(join(OUT, `${part}.json`), json);
    sizes.push(`${part} ${(json.length / 1024).toFixed(0)} KB`);
  }
  writeFileSync(
    join(OUT, 'loaders.ts'),
    [
      '// Generated by scripts/build-learn.mjs. Do not edit.',
      "import type { LearnData } from '../../learn-types';",
      '',
      '/** Each require() runs the first time its screen is opened. */',
      'export const LEARN_LOADERS: { [K in keyof LearnData]: () => LearnData[K] } = {',
      ...LEARN_PARTS.map((k) => `  ${k}: () => require('./${k}.json'),`),
      '};',
      '',
    ].join('\n'),
  );
  process.emitWarning = emit;
  console.log(`[learn] ${sizes.join(', ')}`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await buildLearn();
}
