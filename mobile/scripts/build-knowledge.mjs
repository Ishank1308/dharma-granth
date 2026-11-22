// Build the knowledge pages the Android app bundles: concepts, the Sanskrit dictionary, characters,
// sacred places, timelines, Wisdom for life, Wisdom pathways and the verse relationship network.
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
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const MOBILE = resolve(HERE, '..');
const ROOT = resolve(MOBILE, '..');
const DATA = resolve(ROOT, 'data');
const OUT = join(MOBILE, 'src/content/generated/knowledge');

let hooked = false;
function hook() {
  if (hooked) return;
  hooked = true;
  registerHooks({
    resolve(specifier, context, next) {
      // The website's own path alias (tsconfig "@/*" -> repo root), used by lib/ modules.
      if (specifier.startsWith('@/')) specifier = pathToFileURL(join(ROOT, specifier.slice(2))).href;
      try {
        return next(specifier, context);
      } catch (err) {
        if ((specifier.startsWith('.') || specifier.startsWith('file:')) && !specifier.endsWith('.ts')) {
          try {
            return next(`${specifier}.ts`, context);
          } catch {
            return next(`${specifier}/index.ts`, context);
          }
        }
        throw err;
      }
    },
  });
}

const load = (name) => import(pathToFileURL(join(DATA, `${name}.ts`)).href);
const loadLib = (name) => import(pathToFileURL(join(ROOT, 'lib', `${name}.ts`)).href);

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

/**
 * "/scripture/katha/chapter/2/verse/18/" -> where it is in the library. A link to a whole chapter, or to
 * anything else, gives null: it would open somewhere other than the verse named.
 */
function readerTarget(href) {
  const m = /^\/scripture\/([^/]+)\/chapter\/(\d+)\/verse\/([^/]+)/.exec(href ?? '');
  if (!m) return null;
  return { id: m[1], chapter: Number(m[2]), verse: /^\d+$/.test(m[3]) ? Number(m[3]) : m[3] };
}

/**
 * The reader numbers some Upanishad verses by their full citation ("4.4.22" in Brihadaranyaka chapter 25),
 * while a link may carry only the last part (22). When the label cites three parts ending in that verse, the
 * reader's number is the citation.
 */
function readerNumbering(target, label) {
  if (!target || typeof target.verse !== 'number') return target;
  const cited = /(\d+\.\d+\.(\d+))$/.exec(label ?? '');
  return cited && Number(cited[2]) === target.verse ? { ...target, verse: cited[1] } : target;
}

/** A verse from a Wisdom for life topic, trimmed to what the app shows (always the whole shloka). */
function pathwayVerse(v) {
  return {
    scriptureId: v.scriptureId,
    chapter: v.libraryRef?.chapter ?? v.chapterNumber,
    verse: v.libraryRef?.verse ?? v.verseNumber,
    ref: { en: v.referenceDisplay, hi: v.referenceDisplayHi || v.referenceDisplay },
    sanskrit: strip(v.sanskritDevanagari),
    translit: strip(v.sanskritTransliteration),
    meaning: { en: v.literalTranslationEn, hi: v.literalTranslationHi },
  };
}

/**
 * Wisdom pathways (dharmagranth.dev/wisdom-pathways/): life question -> verses with Arth, Vyakhya and modern
 * context -> the masters who carried the teaching -> reflection. Verses resolve through the website's own
 * lib/wisdom-pathways.ts, so the Sanskrit comes from the validated Wisdom for life topics, never pathway prose.
 */
async function buildPathways() {
  const { wisdomPathways } = await load('wisdom-pathways');
  const { STARTER_PATHWAYS } = await load('wisdom-pathway-starters');
  const { lineageMasters } = await load('wisdom-lineage');
  const { getWisdomTopic } = await load('wisdom-for-life');
  const lib = await loadLib('wisdom-pathways');
  const conceptIds = new Set((await buildConcepts()).items.map((c) => c.id));
  const slugs = new Set(wisdomPathways.map((p) => p.slug));
  const masters = new Map(lineageMasters.map((m) => [m.id, m]));
  const pair = (x) => ({ en: x.en, hi: x.hi });

  const items = wisdomPathways.map((p) => {
    const lenses = lib.resolvePathwayVerses(p);
    return {
      id: p.slug,
      title: { en: p.titleEn, hi: p.titleHi },
      sanskrit: p.sanskritSubtitle,
      question: { en: p.questionEn, hi: p.questionHi },
      masters: p.mastersFocusEn,
      minutes: p.readingTimeMinutes,
      intro: pair(p.introduction),
      why: pair(p.whyHumansFace),
      foundations: pair(p.scripturalFoundations),
      lenses: lenses.map((r) => ({
        topic: r.topicSlug,
        verse: pathwayVerse(r.verse),
        arth: { en: r.arthEn, hi: r.arthHi },
        vyakhya: { en: r.vyakhyaEn, hi: r.vyakhyaHi },
        modern: { en: r.modernContextEn, hi: r.modernContextHi },
        lineage: r.lineageIds,
      })),
      lineage: p.lineageIds.filter((id) => masters.has(id)),
      sageNote: pair(p.sageNote),
      reflections: p.reflectionQuestions.map(pair),
      contemplations: p.contemplationPrompts.map(pair),
      related: lib.relatedPathways(p.slug).map((r) => r.slug),
      concepts: [...new Set(p.discovery.concepts.map((c) => c.toLowerCase()))].filter((c) => conceptIds.has(c)),
    };
  });

  const usedMasters = new Set(items.flatMap((p) => [...p.lineage, ...p.lenses.flatMap((l) => l.lineage)]));
  const masterOut = {};
  for (const id of usedMasters) {
    const m = masters.get(id);
    if (!m) continue;
    masterOut[id] = {
      id,
      name: { en: m.nameEn, hi: m.nameHi },
      kind: { en: m.kindLabelEn, hi: m.kindLabelHi },
      era: m.eraEn,
      tradition: m.traditionEn,
      teaching: { en: m.teachingEn, hi: m.teachingHi },
    };
  }

  const starters = STARTER_PATHWAYS.map((s) => ({
    id: s.slug,
    title: { en: s.titleEn, hi: s.titleHi },
    question: { en: s.questionEn, hi: s.questionHi },
    intro: { en: s.introductionEn, hi: s.introductionHi },
    pathway: s.pathwaySlug && slugs.has(s.pathwaySlug) ? s.pathwaySlug : null,
    stages: [...s.stages]
      .sort((a, b) => a.order - b.order)
      .map((st) => ({
        title: { en: st.titleEn, hi: st.titleHi },
        focus: { en: st.focusEn, hi: st.focusHi },
        lenses: st.lensIndexes,
        reflections: st.reflectionIndexes,
        contemplations: st.contemplationIndexes,
      })),
    // Starters still waiting for a pathway begin from the Wisdom for life topics the app already carries.
    topics: [...new Set(s.topicSlugs)].filter((t) => getWisdomTopic(t)),
  }));

  // The six doors in (emotion, challenge, question, scripture, saint, concept), each label leading to a pathway.
  const discovery = lib.pathwayDiscovery().map((g) => ({
    key: g.key,
    label: { en: g.labelEn, hi: g.labelHi },
    entries: g.entries.map((e) => {
      const m = masters.get(e.label);
      return { label: m ? { en: m.nameEn, hi: m.nameHi } : { en: e.label, hi: e.label }, pathway: e.href.split('/').filter(Boolean)[1] };
    }),
  }));

  return { categories: [], items, masters: masterOut, starters, discovery };
}

/** "पार-ग्रंथ सम्बन्ध (गीता ↔ उपनिषद् ↔ रामायण)" -> "पार-ग्रंथ सम्बन्ध": the short label fits a chip. */
const shortHi = (s) => s.replace(/\s*\(.*\)\s*$/, '').trim();

/**
 * The verse relationship network (dharmagranth.dev/network/): the website's featured verses, each with the
 * graph lib/verse-relationship-engine.ts builds for it from reviewed links only (canonical echoes, study
 * connections, concept listings). The featured list lives in the page's client component, so it is read
 * from that file as a plain array literal.
 */
async function buildNetwork() {
  const engine = await loadLib('verse-relationship-engine');
  const conceptIds = new Set((await buildConcepts()).items.map((c) => c.id));
  const src = readFileSync(join(ROOT, 'app/network/VerseNetworkClient.tsx'), 'utf8');
  const m = /const FEATURED_SEEDS: SeedVerse\[\] = (\[[\s\S]*?\n\]);/.exec(src);
  if (!m) throw new Error('[knowledge] FEATURED_SEEDS not found in app/network/VerseNetworkClient.tsx');
  const seeds = new Function(`return ${m[1]};`)();

  const items = seeds.map((s) => {
    const graph = engine.buildVerseGraphData(s.scriptureId, s.chapterId, s.verseId, {
      number: s.verseId,
      sanskrit: s.sanskrit,
      translation: s.translation,
    });
    return {
      id: s.key,
      target: { id: s.scriptureId, chapter: s.chapterId, verse: s.verseId },
      scripture: { en: s.scriptureTitle, hi: s.scriptureTitleHi },
      ref: `${s.chapterId}.${s.verseId}`,
      theme: { en: s.theme, hi: s.themeHi },
      sanskrit: s.sanskrit,
      translation: s.translation,
      description: s.description,
      nodes: graph.nodes.map((n) => {
        const concept = n.conceptId && conceptIds.has(n.conceptId) ? n.conceptId : null;
        return {
          id: n.id,
          type: n.type,
          // The engine's labels sometimes repeat the book ("Isha Upanishad Isha Upanishad 2", "Bhagavad Gita
          // BG 2.48"); a verse is shown as its book and number, a concept by its name.
          label: n.type === 'concept_connection' ? n.label : `${n.scriptureTitle} ${/[\d.]+$/.exec(n.label)?.[0] ?? ''}`.trim(),
          labelHi: n.labelHi ?? '',
          scripture: n.scriptureTitle,
          scriptureSa: n.scriptureTitleSanskrit ?? '',
          // A shloka is never shown cut short: the website's engine carries a few verses ending in "…", and
          // those show their reason and a link into the reader instead, where the verse is whole.
          sanskrit: /(\.\.\.|…)\s*$/.test(n.sanskrit ?? '') ? '' : (strip(n.sanskrit) ?? ''),
          translation: strip(n.translation) ?? '',
          reason: n.relationshipReason,
          target: concept ? null : readerNumbering(readerTarget(n.href), n.label),
          concept,
        };
      }),
    };
  });

  return {
    categories: Object.entries(engine.RELATIONSHIP_META).map(([key, v]) => ({ key, en: v.label, hi: shortHi(v.labelHi) })),
    items,
  };
}

const KINDS = {
  concepts: buildConcepts,
  dictionary: buildDictionary,
  characters: buildCharacters,
  places: buildPlaces,
  timelines: buildTimelines,
  wisdom: buildWisdom,
  pathways: buildPathways,
  network: buildNetwork,
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
