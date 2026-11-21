// Build the knowledge pages the Android app bundles: concepts, the Sanskrit dictionary, characters,
// sacred places, timelines and Wisdom for life.
//
//   node scripts/build-knowledge.mjs
//
// Source of truth is the website's own data in ../data/*.ts (the same modules app/concepts,
// app/dictionary, app/characters, app/locations, app/timelines and app/wisdom-for-life render).
// Node reads the TypeScript directly (type stripping, Node 22.18+); the hook below lets the data files
// keep their extensionless relative imports.
//
// Output (git-ignored, rebuilt by build-content.mjs on every EAS build):
//   src/content/generated/knowledge/<kind>.json   one file per page kind, trimmed to what the app shows
//   src/content/generated/knowledge/loaders.ts    lazy require() per kind, so opening Places never parses Wisdom
import { mkdirSync, writeFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const MOBILE = resolve(HERE, '..');
const DATA = resolve(MOBILE, '../data');
const OUT = join(MOBILE, 'src/content/generated/knowledge');

let hooked = false;
function hook() {
  if (hooked) return;
  hooked = true;
  registerHooks({
    resolve(specifier, context, next) {
      try {
        return next(specifier, context);
      } catch (err) {
        if (specifier.startsWith('.') && !specifier.endsWith('.ts')) return next(`${specifier}.ts`, context);
        throw err;
      }
    },
  });
}

const load = (name) => import(pathToFileURL(join(DATA, `${name}.ts`)).href);

/** "मूल (Core)" -> { hi: 'मूल', en: 'Core' }; a label without brackets is used for both. */
function splitLabel(label) {
  const m = /^(.*?)\s*\(([^)]+)\)\s*$/.exec(label);
  return m ? { hi: m[1].trim(), en: m[2].trim() } : { hi: label, en: label };
}

/** Tailwind "from-blue-500 to-indigo-600" -> the colour family names, for the app's hue map. */
function hueOf(gradient) {
  const m = /from-([a-z]+)-/.exec(gradient ?? '');
  return m ? m[1] : 'saffron';
}

const strip = (s) => (typeof s === 'string' ? s.trim() : s);

async function buildConcepts() {
  const { concepts, conceptCategories } = await load('concepts');
  const { CONCEPT_DETAILS } = await load('concept-details');
  const { conceptVerses } = await load('concept-verses');

  const byId = new Map(concepts.map((c) => [c.id, c]));
  const ids = [...concepts.map((c) => c.id), ...Object.keys(CONCEPT_DETAILS).filter((id) => !byId.has(id))];

  const items = ids.map((id) => {
    const c = byId.get(id);
    const d = CONCEPT_DETAILS[id];
    return {
      id,
      label: c?.label ?? d.label,
      sanskrit: c?.sanskrit ?? d.sanskrit,
      translit: c?.transliteration ?? d.transliteration,
      category: c?.category ?? d.category,
      // concepts.ts writes its short line and description in Hindi; the detail file has both languages.
      short: { en: d?.simpleDefinition.en ?? '', hi: c?.shortDesc ?? d?.simpleDefinition.hi ?? '' },
      descriptionHi: c?.description ?? '',
      connections: [...new Set([...(c?.connections ?? []), ...(d?.relatedConceptIds ?? [])])].filter(
        (x) => x !== id && (byId.has(x) || CONCEPT_DETAILS[x]),
      ),
      detail: d
        ? {
            derivation: d.derivation,
            contextual: d.contextualMeanings,
            traditions: d.traditions,
            misunderstandings: d.misunderstandings,
            sources: d.sources,
          }
        : null,
      verses: [
        ...(d?.verses ?? []).map((v) => ({
          sanskrit: v.sanskrit,
          translit: v.transliteration,
          en: v.translationEn,
          hi: v.translationHi,
          ref: { en: v.reference, hi: v.referenceHi || v.reference },
        })),
        ...(conceptVerses[id] ?? [])
          .filter((v) => !(d?.verses ?? []).some((x) => x.reference === v.reference))
          .map((v) => ({
            sanskrit: v.sanskrit,
            translit: v.transliteration ?? '',
            en: v.translation,
            hi: '',
            ref: { en: v.reference, hi: v.reference },
            scriptureId: v.scriptureId,
            chapter: v.chapterId,
            verse: v.verseId,
          })),
      ],
    };
  });

  return {
    categories: conceptCategories.map((c) => ({ key: c.key, ...splitLabel(c.label), sanskrit: c.sanskrit, hue: hueOf(c.gradient) })),
    items,
  };
}

async function buildDictionary() {
  const { dictionary, termCategories } = await load('dictionary');
  return {
    categories: termCategories.map((c) => ({ key: c.key, en: c.label, hi: c.sanskrit, sanskrit: c.sanskrit, hue: hueOf(c.gradient) })),
    items: dictionary.map((t) => ({
      id: t.id,
      term: t.term,
      sanskrit: t.sanskrit,
      translit: t.transliteration,
      category: t.category,
      short: t.shortDef,
      definition: t.definition,
      etymology: t.etymology,
      keyTexts: t.keyTexts,
      related: t.relatedTerms,
      crossTradition: t.crossTradition,
      verses: t.verses.map((v) => ({ sanskrit: v.sanskrit, translit: v.transliteration ?? '', en: v.translation, ref: v.reference })),
    })),
  };
}

async function buildCharacters() {
  const { characters, characterCategories } = await load('characters');
  return {
    categories: characterCategories.map((c) => ({ key: c.key, en: c.label, hi: c.sanskrit, sanskrit: c.sanskrit, hue: hueOf(c.gradient) })),
    items: characters.map((c) => ({
      id: c.id,
      name: c.name,
      sanskrit: c.sanskrit,
      category: c.category,
      icon: c.icon,
      hue: hueOf(c.gradient),
      short: c.shortDesc,
      biography: c.biography,
      relations: c.relations,
      events: c.events,
      dialogues: c.dialogues,
      dilemmas: c.dilemmas,
      verses: c.verses.map((v) => ({ sanskrit: v.sanskrit, translit: v.transliteration ?? '', en: v.translation, ref: v.reference })),
      interpretations: c.interpretations,
    })),
  };
}

async function buildPlaces() {
  const { sacredLocations, locationTypes } = await load('locations');
  return {
    categories: locationTypes.map((c) => ({ key: c.key, en: c.label, hi: '', icon: c.icon, hue: hueOf(c.gradient) })),
    items: sacredLocations.map((l) => ({
      id: l.id,
      name: l.name,
      sanskrit: l.sanskrit,
      category: l.type,
      icon: l.icon,
      hue: hueOf(l.gradient),
      short: l.shortDesc,
      description: l.description,
      significance: l.significance,
      associations: l.associations,
      identifications: l.identifications,
      coordinates: l.coordinates,
      presentDay: l.presentDayLocation,
    })),
  };
}

async function buildTimelines() {
  const { timelines, timelineTypeLabels } = await load('timelines');
  return {
    categories: Object.entries(timelineTypeLabels).map(([key, v]) => ({ key, ...splitLabel(v.label), note: v.description })),
    items: timelines.map((t) => ({
      id: t.id,
      title: t.title,
      sanskrit: t.sanskrit,
      description: t.description,
      category: t.type,
      events: t.events.map((e) => ({
        id: e.id,
        title: e.title,
        sanskrit: e.sanskrit ?? '',
        date: e.date,
        description: e.description,
        significance: e.significance,
        texts: e.relatedTexts ?? [],
        figures: e.relatedFigures ?? [],
      })),
    })),
  };
}

async function buildWisdom() {
  const { getAllWisdomTopics, wisdomCategories } = await load('wisdom-for-life');
  const conceptIds = new Set((await buildConcepts()).items.map((c) => c.id));
  return {
    categories: wisdomCategories.filter((c) => c.key !== 'all').map((c) => ({ key: c.key, en: c.labelEn, hi: c.labelHi })),
    items: getAllWisdomTopics().map((t) => ({
      id: t.slug,
      title: { en: t.titleEn, hi: t.titleHi },
      sanskrit: t.sanskritSubtitle,
      category: t.category,
      accent: t.accentColor,
      short: { en: t.shortDescEn, hi: t.shortDescHi },
      keywords: t.searchKeywords,
      minutes: t.readingTimeMinutes,
      intro: {
        lead: { en: t.compassionateIntro.leadEn, hi: t.compassionateIntro.leadHi },
        body: { en: t.compassionateIntro.bodyEn, hi: t.compassionateIntro.bodyHi },
        foundation: { en: t.compassionateIntro.spiritualFoundationEn, hi: t.compassionateIntro.spiritualFoundationHi },
      },
      verses: t.verses.map((v) => ({
        id: v.id,
        scriptureId: v.scriptureId,
        scripture: { en: v.scriptureName, hi: v.scriptureNameHi },
        // Where the verse sits in the library when its numbering differs from the citation shown.
        chapter: v.libraryRef?.chapter ?? v.chapterNumber,
        verse: v.libraryRef?.verse ?? v.verseNumber,
        ref: { en: v.referenceDisplay, hi: v.referenceDisplayHi },
        sanskrit: strip(v.sanskritDevanagari),
        translit: strip(v.sanskritTransliteration),
        meaning: { en: v.literalTranslationEn, hi: v.literalTranslationHi },
        speaker: v.traditionalContext.speaker,
        addressee: v.traditionalContext.addressee,
        setting: { en: v.traditionalContext.setting, hi: v.traditionalContext.settingHi },
        note: { en: v.traditionalContext.commentaryNote, hi: v.traditionalContext.commentaryNoteHi },
      })),
      context: {
        title: { en: t.traditionalContextOverview.titleEn, hi: t.traditionalContextOverview.titleHi },
        body: { en: t.traditionalContextOverview.bodyEn, hi: t.traditionalContextOverview.bodyHi },
      },
      reflections: t.reflections.map((r) => ({
        title: { en: r.title, hi: r.titleHi },
        insight: { en: r.insight, hi: r.insightHi },
        prompt: { en: r.contemplationPrompt, hi: r.contemplationPromptHi },
        practice: { en: r.dailyPractice, hi: r.dailyPracticeHi },
      })),
      concepts: t.relatedConcepts.map((c) => ({
        id: conceptIds.has(c.id) ? c.id : null,
        label: { en: c.labelEn, hi: c.labelHi },
        sanskrit: c.sanskrit,
        description: { en: c.description, hi: c.descriptionHi },
      })),
      scriptures: t.relatedScriptures.map((s) => ({
        id: s.href.startsWith('/scripture/') ? s.href.split('/')[2] : s.id,
        title: { en: s.title, hi: s.titleHi },
        sanskrit: s.titleSanskrit,
      })),
      sources: t.sources.map((s) => (s.section ? `${s.citation} (${s.section})` : s.citation)),
      care: {
        headline: { en: t.contextualNote.headlineEn, hi: t.contextualNote.headlineHi },
        body: { en: t.contextualNote.bodyEn, hi: t.contextualNote.bodyHi },
        disclaimer: { en: t.contextualNote.clinicalDisclaimerEn, hi: t.contextualNote.clinicalDisclaimerHi },
      },
    })),
  };
}

const KINDS = {
  concepts: buildConcepts,
  dictionary: buildDictionary,
  characters: buildCharacters,
  places: buildPlaces,
  timelines: buildTimelines,
  wisdom: buildWisdom,
};

export async function buildKnowledge() {
  hook();
  // The website's data files are ES modules in a package without "type": "module"; Node says so once per
  // file. That is expected here, so keep the build log readable.
  const emit = process.emitWarning;
  process.emitWarning = (warning, ...rest) => {
    const code = typeof rest[0] === 'object' ? rest[0]?.code : rest[1];
    if (code !== 'MODULE_TYPELESS_PACKAGE_JSON') emit.call(process, warning, ...rest);
  };
  mkdirSync(OUT, { recursive: true });
  const sizes = [];
  for (const [kind, build] of Object.entries(KINDS)) {
    const data = await build();
    const json = JSON.stringify(data);
    writeFileSync(join(OUT, `${kind}.json`), json);
    sizes.push(`${kind} ${data.items.length}`);
  }
  const loaders = [
    '// Generated by scripts/build-knowledge.mjs. Do not edit.',
    "import type { KnowledgeData } from '../../knowledge-types';",
    '',
    '/** Each require() runs the first time its page kind is opened. */',
    'export const KNOWLEDGE_LOADERS: { [K in keyof KnowledgeData]: () => KnowledgeData[K] } = {',
    ...Object.keys(KINDS).map((k) => `  ${k}: () => require('./${k}.json'),`),
    '};',
    '',
  ].join('\n');
  writeFileSync(join(OUT, 'loaders.ts'), loaders);
  process.emitWarning = emit;
  console.log(`[knowledge] ${sizes.join(', ')}`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await buildKnowledge();
}
