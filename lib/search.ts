import { scriptureCatalog } from '@/data/scripture-meta';
import { EDITORIAL_DRAFT_LABEL } from '@/lib/editorial-terminology';
import { concepts } from '@/data/concepts';
import { topics } from '@/data/topics';
import { topicHref } from '@/lib/topic-links';
import { characters } from '@/data/characters';
import { sacredLocations } from '@/data/locations';
import { dictionary } from '@/data/dictionary';
import { festivals } from '@/data/festivals';
import { rituals } from '@/data/rituals';
import { pathways } from '@/data/pathways';
import { bookExplanations } from '@/data/book-explanations';
import {
  compactTransliteration,
  isDevanagari,
  levenshteinDistance,
  normalizeDevanagari,
  normalizeForSearch,
  normalizeTransliteration,
} from '@/lib/normalize-search';
import { phoneticIndex } from '@/lib/normalize-search';
import { parseDirectCitation } from '@/lib/search-citation';
import { searchCoreIndex } from '@/lib/search-core';
import { versePageHref } from '@/lib/verse-paths';
import {
  FLAG_ENGLISH_AI,
  FLAG_EXPLANATION_AI,
  FLAG_HINDI_AI,
  STOP_WORDS,
  contentTokens,
  isVerseIndexLoaded,
  lookupVerse,
  searchVerses,
  type VerseEntry,
  type VerseMatchKind,
} from '@/lib/search-verse-index';
import { getSearchThemes, matchThemes } from '@/lib/search-themes';
import {
  SEARCH_GROUPS,
  type GroupDefinition,
  type SearchCategory,
  type SearchOptions,
  type SearchResponse,
  type SearchResultGroup,
  type SearchResultItem,
} from '@/lib/search-types';


export * from '@/lib/search-types';
export { loadVerseIndex, isVerseIndexLoaded } from '@/lib/search-verse-index';
export { loadCoreIndex, loadSearchShard, isCoreIndexLoaded, coreScriptureHint } from '@/lib/search-core';
export { normalizeForSearch, normalizeTransliteration, normalizeDevanagari, isDevanagari };

/** [scriptureId, chapterNumber, title, titleSanskrit?] */
export type ChapterIndexEntry = [string, number, string] | [string, number, string, string];

export interface ChapterIndex {
  v: 1;
  counts: Record<string, number>;
  chapters: ChapterIndexEntry[];
}

export const SEARCH_CATEGORIES = SEARCH_GROUPS.map((g) => ({
  id: g.id as SearchCategory,
  label: g.fullLabel,
}));

export function isSearchCategory(value: string): value is SearchCategory {
  return SEARCH_GROUPS.some((c) => c.id === value);
}

/* ── Daily Practices Catalog ─────────────────────────────────────────── */
const DAILY_PRACTICES = [
  {
    id: 'practice-verse',
    title: 'दैनिक श्लोक · Daily Verse',
    subtitle: 'Daily Contemplation',
    description: 'Start each morning with one sacred verse, the Sanskrit text, Hindi meaning, and practical guidance.',
    href: '/practice#verse',
    keywords: ['verse', 'daily verse', 'shloka', 'recitation', 'श्लोक', 'दैनिक श्लोक', 'पाठ', 'अभ्यास'],
    actionLabel: 'Read the Daily Verse →',
  },
  {
    id: 'practice-meditation',
    title: 'ध्यान साधना · Meditation Timer',
    subtitle: 'Silent Meditation with Tanpura & Chimes',
    description: 'Timed meditation intervals with sacred intervals, tanpura drone in A/C#, and closing bell.',
    href: '/practice#meditation',
    keywords: ['meditation', 'dhyana', 'timer', 'tanpura', 'stillness', 'calm', 'peace', 'ध्यान', 'साधना', 'शांति', 'मौन'],
    actionLabel: 'Start Meditation →',
  },
  {
    id: 'practice-japa',
    title: 'जप माला · Japa Counter',
    subtitle: '108 Bead Digital Japa Mala with Haptics',
    description: 'Mindful mantra repetition with tactile feedback, mala rounds tracker, and sacred mantra selection.',
    href: '/practice#japa',
    keywords: ['japa', 'mala', 'mantra', 'chanting', 'counter', '108', 'जप', 'माला', 'मंत्र', 'जाप', 'स्मरण'],
    actionLabel: 'Open Japa Mala →',
  },
  {
    id: 'practice-reflection',
    title: 'दैनिक चिंतन · Daily Reflection',
    subtitle: 'Evening Introspection & Self-Study (Svadhyaya)',
    description: 'Guided evening inquiry based on Gita and Upanishadic wisdom to align daily choices with Dharma.',
    href: '/practice#reflection',
    keywords: ['reflection', 'contemplation', 'svadhyaya', 'evening', 'journal', 'चिंतन', 'आत्मनिरीक्षण', 'स्वाध्याय'],
    actionLabel: 'Begin Reflection →',
  },
  {
    id: 'practice-reading',
    title: 'पठन योजना · Structured Reading Plan',
    subtitle: 'Gita & Upanishad Chapter-by-Chapter Journey',
    description: 'Systematic daily reading schedules to read scriptures at your own pace without overwhelm.',
    href: '/practice#reading',
    keywords: ['reading', 'plan', 'study plan', 'schedule', 'gita plan', 'पठन योजना', 'अध्ययन', 'नियम'],
    actionLabel: 'View Reading Plan →',
  },
  {
    id: 'practice-gratitude',
    title: 'कृतज्ञता डायरी · Gratitude Journal',
    subtitle: 'Cultivating Contentment (Santosha)',
    description: 'Private, offline journal to record moments of grace and count your blessings each day.',
    href: '/practice#gratitude',
    keywords: ['gratitude', 'journal', 'santosha', 'contentment', 'blessings', 'कृतज्ञता', 'संतोष', 'आभार'],
    actionLabel: 'Write Gratitude Note →',
  },
  {
    id: 'practice-nityakarma',
    title: 'नित्यकर्म क्रिया · Daily Rituals & Sandhya',
    subtitle: 'Vedic Daily Routine & Cleansing',
    description: 'Traditional morning and evening observances, Surya Namaskar, Pranayama, and Sandhyavandanam guidance.',
    href: '/rituals',
    keywords: ['nityakarma', 'ritual', 'sandhyavandanam', 'surya namaskar', 'pranayama', 'नित्यकर्म', 'संध्यावंदन', 'अनुष्ठान'],
    actionLabel: 'Explore Daily Rituals →',
  },
];

/* ── Typo & Common Spelling Dictionary ──────────────────────────────── */
const COMMON_TYPOS: Record<string, string> = {
  'karmanye vadikaraste': 'karmanye vadhikaraste',
  'karmanya': 'karmanye',
  'vadikaraste': 'vadhikaraste',
  'geeta': 'Bhagavad Gita',
  'gita': 'Bhagavad Gita',
  'bhagvat': 'Bhagavad Gita',
  'bhagwat': 'Bhagavad Gita',
  'bhagwad': 'Bhagavad Gita',
  'bhagvat geeta': 'Bhagavad Gita',
  'bhagwat geeta': 'Bhagavad Gita',
  'bhagvat gita': 'Bhagavad Gita',
  'bhagwat gita': 'Bhagavad Gita',
  'tatvamasi': 'Tat Tvam Asi',
  'tatwamasi': 'Tat Tvam Asi',
  'upnishad': 'Upanishad',
  'upnishads': 'Upanishads',
  'krodh': 'क्रोध (Anger)',
  'bhay': 'भय (Fear)',
  'darshan': 'Darshana',
  'valmiki': 'Valmiki Ramayana',
  'krishna': 'Krishna',
  'arjun': 'Arjuna',
  'sankhya': 'Samkhya',
  'nachiketa': 'Nachiketa',
  'ahimsa': 'Ahimsa',
};

/* ── Unified Search Item Registry ────────────────────────────────────── */
interface IndexedItem {
  item: SearchResultItem;
  searchTokens: string[];
  devanagariTokens: string[];
  compactTranslit: string;
  /** Transliteration of the name only (title, subtitle, reference), so English prose is never taken for a transliteration. */
  compactName: string;
  rawSearchText: string;
}

let cachedStaticIndex: IndexedItem[] | null = null;
let chapterEntries: IndexedItem[] = [];
let chapterCounts: Record<string, number> | null = null;
const chapterTitleByHref = new Map<string, string>();

/** Builds all static search items across all 7 groups. */
function buildMasterIndex(): SearchResultItem[] {
  const items: SearchResultItem[] = [];

  // 2. SCRIPTURES (Group: 'scripture')
  for (const s of scriptureCatalog) {
    const subtitle = s.titleIast ? `${s.titleSanskrit} (${s.titleIast})` : s.titleSanskrit;
    const tagText = s.tags ? s.tags.join(' ') : '';
    // Catalogue chapter and verse totals are not the library holdings, and this
    // index is built in the browser, where the files cannot be counted. The
    // scripture page shows the counted figures.
    const extraParts = [s.titleIast, tagText].filter(Boolean);
    items.push({
      id: `scripture-${s.id}`,
      title: s.title,
      subtitle,
      group: 'scripture',
      groupLabel: 'ग्रंथ · Scripture',
      category: 'scripture',
      categoryLabel: 'ग्रंथ · Scripture',
      href: `/scripture/${s.id}`,
      reference: s.title,
      matchingText: `${s.title} (${s.titleSanskrit})`,
      translationExcerpt: s.description,
      matchReason: 'Scripture Title Match',
      languageLabel: 'Sanskrit & English',
      actionLabel: 'Explore Scripture →',
      description: s.description,
      extra: extraParts.join(' · '),
    });
  }

  items.push({
    id: 'scripture-ashtavakra',
    title: 'Ashtavakra Gita',
    subtitle: 'अष्टावक्र गीता',
    group: 'scripture',
    groupLabel: 'ग्रंथ · Scripture',
    category: 'scripture',
    categoryLabel: 'ग्रंथ · Scripture',
    href: '/ashtavakra/',
    reference: 'Ashtavakra Gita',
    matchingText: 'Ashtavakra Gita (अष्टावक्र गीता)',
    translationExcerpt: 'Separate reading with Sanskrit, Hindi meaning, and a simple explanation.',
    matchReason: 'Scripture Title Match',
    languageLabel: 'Sanskrit & Hindi',
    actionLabel: 'Open the reading →',
    description: 'अष्टावक्र गीता. Separate from the shared scripture catalogue.',
    extra: 'ashtavakra ashtavakra gita अष्टावक्र गीता',
  });

  // 3. TOPICS (Group: 'topic')
  for (const t of topics) {
    items.push({
      id: `topic-${t.id}`,
      title: `${t.icon} ${t.title}`,
      subtitle: t.sanskrit ? `${t.sanskrit} · Life Wisdom` : 'Life Wisdom',
      group: 'topic',
      groupLabel: 'विषय · Topic',
      category: 'topic',
      categoryLabel: 'विषय · Topic',
      href: topicHref(t.id),
      reference: `Topic · ${t.title}`,
      matchingText: `${t.title} (${t.sanskrit ?? ''})`,
      translationExcerpt: t.shortDesc,
      commentaryExcerpt: t.description.slice(0, 160) + '…',
      matchReason: 'Thematic Concept Match',
      languageLabel: 'English & Hindi',
      actionLabel: 'Explore Topic →',
      description: t.shortDesc,
      extra: `${t.sanskrit ?? ''} ${t.teachings.join(' ')}`,
    });
  }

  for (const theme of getSearchThemes()) {
    items.push({
      id: `wisdom-${theme.slug}`,
      title: theme.name,
      subtitle: `${theme.nameHi} · Wisdom for Life`,
      group: 'topic',
      groupLabel: 'विषय · Topic',
      category: 'topic',
      categoryLabel: 'जीवन के लिए · Wisdom for Life',
      href: theme.href,
      reference: `Wisdom for Life · ${theme.name}`,
      matchingText: theme.topic.shortDescEn,
      translationExcerpt: theme.topic.shortDescEn,
      matchReason: 'Matches the topic',
      languageLabel: 'English & Hindi',
      actionLabel: 'Explore topic →',
      description: theme.topic.shortDescEn,
      extra: theme.latin.join(' '),
    });
  }

  for (const c of concepts) {
    items.push({
      id: `concept-${c.id}`,
      title: c.label,
      subtitle: `${c.sanskrit} (${c.transliteration})`,
      group: 'concept',
      groupLabel: 'अवधारणा · Concept',
      category: 'concept',
      categoryLabel: 'अवधारणा · Concept',
      href: `/concepts/${c.id}`,
      reference: `Concept · ${c.label}`,
      matchingText: `${c.label} · ${c.sanskrit}`,
      translationExcerpt: c.shortDesc,
      matchReason: 'Philosophical Concept Match',
      languageLabel: 'Sanskrit · संस्कृत',
      actionLabel: 'View Concept →',
      description: c.shortDesc,
      extra: `${c.sanskrit} ${c.transliteration}`,
    });
  }

  // 4. COMMENTARIES (Group: 'commentary'): book overviews here; per-verse explanations come from the verse index.
  for (const [scriptureId, expl] of Object.entries(bookExplanations)) {
    const sMeta = scriptureCatalog.find((s) => s.id === scriptureId);
    if (sMeta) {
      items.push({
        id: `book-expl-${scriptureId}`,
        title: `${sMeta.title} · ग्रंथ परिचय एवं सार`,
        subtitle: `${sMeta.titleSanskrit} · Comprehensive Overview`,
        group: 'commentary',
        groupLabel: 'टीका व व्याख्या · Commentary',
        category: 'commentary',
        categoryLabel: 'ग्रंथ परिचय · Overview',
        href: `/scripture/${scriptureId}`,
        reference: `${sMeta.title} Overview`,
        matchingText: expl.overview.hi,
        translationExcerpt: expl.overview.en,
        commentaryExcerpt: expl.focus.hi,
        matchReason: 'Commentary & Study Focus Match',
        languageLabel: 'Hindi & English',
        actionLabel: 'Read Scripture Overview →',
        description: expl.focus.en,
        extra: `${expl.overview.en} ${expl.overview.hi} ${expl.focus.en} ${expl.focus.hi}`,
      });
    }
  }

  // 5. LEARNING RESOURCES (Group: 'learning')
  for (const p of pathways) {
    items.push({
      id: `pathway-${p.id}`,
      title: p.title,
      subtitle: `${p.titleSanskrit} · ${p.steps?.length ?? 0} Steps`,
      group: 'learning',
      groupLabel: 'अध्ययन सामग्री · Learning',
      category: 'pathway',
      categoryLabel: 'अध्ययन पथ · Pathway',
      href: `/learn/pathways`,
      reference: 'Study Pathway',
      matchingText: p.title,
      translationExcerpt: p.description,
      matchReason: 'Curated Study Pathway',
      languageLabel: 'Bilingual',
      actionLabel: 'Start Pathway →',
      description: p.description,
      extra: `${p.titleSanskrit} ${p.steps?.map((s) => s.title).join(' ')}`,
    });
  }

  for (const ch of characters) {
    items.push({
      id: `character-${ch.id}`,
      title: ch.name,
      subtitle: `${ch.sanskrit} · Sacred Figure`,
      group: 'learning',
      groupLabel: 'अध्ययन सामग्री · Learning',
      category: 'character',
      categoryLabel: 'पात्र · Character',
      href: `/characters/${ch.id}`,
      reference: `Character · ${ch.name}`,
      matchingText: `${ch.name} (${ch.sanskrit})`,
      translationExcerpt: ch.shortDesc,
      matchReason: 'Scriptural Character Match',
      languageLabel: 'Sanskrit & English',
      actionLabel: 'Read Character Story →',
      description: ch.shortDesc,
      extra: `${ch.sanskrit} ${ch.shortDesc}`,
    });
  }

  for (const d of dictionary) {
    items.push({
      id: `dict-${d.id}`,
      title: d.term,
      subtitle: `${d.sanskrit} (${d.transliteration}) · Sanskrit Dictionary`,
      group: 'learning',
      groupLabel: 'अध्ययन सामग्री · Learning',
      category: 'dictionary',
      categoryLabel: 'शब्दकोश · Dictionary',
      href: `/dictionary/${d.id}`,
      reference: `Dictionary · ${d.term}`,
      matchingText: `${d.term} (${d.sanskrit})`,
      translationExcerpt: d.shortDef,
      commentaryExcerpt: d.etymology,
      matchReason: 'Sanskrit Dictionary Entry',
      languageLabel: 'Sanskrit · संस्कृत',
      actionLabel: 'Explore Definition →',
      description: d.shortDef,
      extra: `${d.sanskrit} ${d.transliteration} ${d.etymology ?? ''}`,
    });
  }

  for (const loc of sacredLocations) {
    items.push({
      id: `location-${loc.id}`,
      title: loc.name,
      subtitle: `${loc.sanskrit} · Sacred Pilgrimage`,
      group: 'learning',
      groupLabel: 'अध्ययन सामग्री · Learning',
      category: 'location',
      categoryLabel: 'स्थान · Location',
      href: `/locations`,
      reference: `Sacred Place · ${loc.name}`,
      matchingText: loc.name,
      translationExcerpt: loc.shortDesc,
      matchReason: 'Sacred Geography Match',
      languageLabel: 'Bilingual',
      actionLabel: 'View Location →',
      description: loc.shortDesc,
      extra: `${loc.sanskrit} ${loc.shortDesc}`,
    });
  }

  for (const f of festivals) {
    items.push({
      id: `fest-${f.id}`,
      title: f.name,
      subtitle: `${f.sanskrit} · Sacred Observance`,
      group: 'learning',
      groupLabel: 'अध्ययन सामग्री · Learning',
      category: 'festival',
      categoryLabel: 'उत्सव · Festival',
      href: `/festivals`,
      reference: `Festival · ${f.name}`,
      matchingText: f.name,
      translationExcerpt: f.shortDesc,
      matchReason: 'Vedic Calendar & Festival',
      languageLabel: 'Bilingual',
      actionLabel: 'View Festival Meaning →',
      description: f.shortDesc,
      extra: `${f.sanskrit} ${f.timing}`,
    });
  }

  // 6. DAILY PRACTICES (Group: 'practice')
  for (const pr of DAILY_PRACTICES) {
    items.push({
      id: pr.id,
      title: pr.title,
      subtitle: pr.subtitle,
      group: 'practice',
      groupLabel: 'नित्य साधना · Daily Practice',
      category: 'practice',
      categoryLabel: 'साधना · Practice',
      href: pr.href,
      reference: 'Daily Sadhana Tool',
      matchingText: pr.title,
      translationExcerpt: pr.description,
      matchReason: 'Daily Sadhana Practice',
      languageLabel: 'Bilingual',
      actionLabel: pr.actionLabel,
      description: pr.description,
      extra: pr.keywords.join(' '),
    });
  }

  for (const r of rituals) {
    items.push({
      id: `ritual-${r.id}`,
      title: r.name,
      subtitle: `${r.sanskrit} · Ritual Practice`,
      group: 'practice',
      groupLabel: 'नित्य साधना · Daily Practice',
      category: 'ritual',
      categoryLabel: 'अनुष्ठान · Ritual',
      href: `/rituals`,
      reference: `Ritual · ${r.name}`,
      matchingText: r.name,
      translationExcerpt: r.shortDesc,
      matchReason: 'Sacred Ritual Practice',
      languageLabel: 'Sanskrit & Hindi',
      actionLabel: 'View Ritual Instructions →',
      description: r.shortDesc,
      extra: `${r.sanskrit} ${r.transliteration} ${r.symbolism}`,
    });
  }

  return items;
}

function getMasterIndex(): IndexedItem[] {
  if (!cachedStaticIndex) {
    cachedStaticIndex = buildMasterIndex().map((item) => {
      const rawText = [
        item.title,
        item.subtitle ?? '',
        item.reference ?? '',
        item.translationExcerpt ?? '',
        item.commentaryExcerpt ?? '',
        item.description ?? '',
        item.extra ?? '',
      ].join(' ');

      const searchNorm = normalizeForSearch(rawText);
      const devNorm = normalizeDevanagari(rawText);
      const translitComp = compactTransliteration(rawText);

      return {
        item,
        searchTokens: searchNorm.split(' ').filter(Boolean),
        devanagariTokens: devNorm.split(' ').filter(Boolean),
        compactTranslit: translitComp,
        compactName: compactTransliteration(`${item.title} ${item.subtitle ?? ''} ${item.reference ?? ''}`),
        rawSearchText: searchNorm,
      };
    });
  }
  return cachedStaticIndex;
}

export function getSearchIndex(): SearchResultItem[] {
  return getMasterIndex().map((entry) => entry.item);
}

/* ── Dynamic Chapter Index Loading ────────────────────────────────────── */

function chapterHref(scriptureId: string, n: number): string {
  return `/scripture/${scriptureId}/chapter/${n}`;
}

export function loadChapterIndex(data: ChapterIndex): void {
  const scriptures = new Map(scriptureCatalog.map((s) => [s.id, s]));
  chapterCounts = data.counts;
  chapterTitleByHref.clear();
  chapterEntries = [];

  for (const [scriptureId, n, title, titleSanskrit] of data.chapters) {
    const scripture = scriptures.get(scriptureId);
    if (!scripture) continue;
    const href = chapterHref(scriptureId, n);
    const item: SearchResultItem = {
      id: `chapter-${scriptureId}-${n}`,
      title: title || titleSanskrit || `अध्याय ${n}`,
      subtitle: title ? titleSanskrit : undefined,
      group: 'chapter',
      groupLabel: 'अध्याय · Chapter',
      category: 'chapter',
      categoryLabel: 'अध्याय · Chapter',
      href,
      reference: `${scripture.title} · Ch. ${n}`,
      matchingText: `${scripture.title} Chapter ${n} (${title || titleSanskrit || ''})`,
      translationExcerpt: `${scripture.title} · अध्याय ${n}`,
      matchReason: 'Chapter Match',
      languageLabel: 'Sanskrit & Hindi',
      actionLabel: 'Read Chapter →',
      description: `${scripture.title} · अध्याय ${n}`,
      extra: `${scripture.title} ${scripture.titleSanskrit}`,
    };
    chapterTitleByHref.set(href, item.title);

    const rawText = `${item.title} ${item.subtitle ?? ''} ${item.description ?? ''} ${item.extra ?? ''}`;
    chapterEntries.push({
      item,
      searchTokens: normalizeForSearch(rawText).split(' ').filter(Boolean),
      devanagariTokens: normalizeDevanagari(rawText).split(' ').filter(Boolean),
      compactTranslit: compactTransliteration(rawText),
      compactName: compactTransliteration(`${item.title} ${item.subtitle ?? ''} ${item.reference ?? ''}`),
      rawSearchText: normalizeForSearch(rawText),
    });
  }
}

export function isChapterIndexLoaded(): boolean {
  return chapterCounts !== null;
}

/* ── Reference Parser (e.g. "Gita 2.47", "Bhagavad Gita chapter 2 verse 47") ── */

const SCRIPTURE_ALIASES: Record<string, string> = {
  gita: 'bhagavadgita',
  geeta: 'bhagavadgita',
  bg: 'bhagavadgita',
  bhagavad: 'bhagavadgita',
  bhagavadgita: 'bhagavadgita',
  गीता: 'bhagavadgita',
  भगवद्गीता: 'bhagavadgita',
  श्रीमद्भगवद्गीता: 'bhagavadgita',
  isha: 'ishavasya',
  ishavasya: 'ishavasya',
  ईशावास्य: 'ishavasya',
  kena: 'kena',
  केन: 'kena',
  katha: 'katha',
  कठ: 'katha',
  prashna: 'prashna',
  प्रश्न: 'prashna',
  mundaka: 'mundaka',
  मुण्डक: 'mundaka',
  mandukya: 'mandukya',
  माण्डूक्य: 'mandukya',
  taittiriya: 'taittiriya',
  तैत्तिरीय: 'taittiriya',
  chandogya: 'chandogya',
  छांदोग्य: 'chandogya',
  brihadaranyaka: 'brihadaranyaka',
  बृहदारण्यक: 'brihadaranyaka',
  shvetashvatara: 'shvetashvatara',
  श्वेताश्वतर: 'shvetashvatara',
  ramayana: 'ramayana',
  रामायण: 'ramayana',
  ramcharitmanas: 'ramcharitmanas',
  रामचरितमानस: 'ramcharitmanas',
};

function parseScriptureReference(query: string): {
  scriptureId: string;
  chapter: number;
  verse?: number | string;
} | null {
  const q = normalizeForSearch(query);
  if (!q) return null;

  // Patterns like "gita 2.47", "gita 2:47", "gita 2 47", "gita chapter 2 verse 47"
  const refRegex =
    /^(bhagavad\s*gita|gita|geeta|bg|श्रीमद्भगवद्गीता|भगवद्गीता|गीता|isha|ishavasya|ईशावास्य|katha|कठ|kena|केन|prashna|प्रश्न|mundaka|मुण्डक|mandukya|माण्डूक्य|taittiriya|तैत्तिरीय|chandogya|छांदोग्य|brihadaranyaka|बृहदारण्यक|shvetashvatara|ramayana|रामायण|ramcharitmanas)\s*(?:chapter|ch|अध्याय)?\s*(\d+)(?:[.:\s]+(?:verse|v|श्लोक)?\s*(\d+(?:\.\d+)?))?$/i;

  const match = q.match(refRegex);
  if (!match) return null;

  const aliasKey = match[1].toLowerCase().replace(/\s+/g, '');
  const scriptureId = SCRIPTURE_ALIASES[aliasKey] ?? SCRIPTURE_ALIASES[match[1]];
  if (!scriptureId) return null;

  const chapter = parseInt(match[2], 10);
  const verse = match[3] ? (match[3].includes('.') ? match[3] : parseInt(match[3], 10)) : undefined;

  return { scriptureId, chapter, verse };
}

/* ── Verse results ───────────────────────────────────────────────────── */

const scriptureById = new Map(scriptureCatalog.map((s) => [s.id, s]));

const MATCH_COPY: Record<VerseMatchKind, { reason: string; language: string; field: SearchResultItem['matchedField'] }> = {
  sanskrit: { reason: 'Matches the Sanskrit text', language: 'Sanskrit · Devanagari', field: 'sanskrit' },
  roman: { reason: 'Matches the Roman transliteration', language: 'Roman transliteration', field: 'roman' },
  english: { reason: 'Matches the English translation', language: 'English', field: 'english' },
  hindi: { reason: 'Matches the Hindi translation', language: 'Hindi · हिन्दी', field: 'hindi' },
  explanation: { reason: 'Matches the explanation', language: 'Explanation', field: 'explanation' },
  fuzzy: { reason: 'Close to your spelling (possible typo)', language: 'Roman transliteration', field: 'roman' },
};

function verseReference(e: VerseEntry): string {
  const title = scriptureById.get(e.scriptureId)?.title ?? e.scriptureId;
  // Some Upanishad verses are numbered by their full section path ("6.8.7"); that is already the citation.
  return e.verse.includes('.') ? `${title} ${e.verse}` : `${title} ${e.chapter}.${e.verse}`;
}

/** A verse as a result: the text that matched, the verse's own reference and its translation. */
function verseItem(e: VerseEntry, kind: VerseMatchKind | 'reference' | 'theme', reasonOverride?: string): SearchResultItem {
  const copy = kind === 'reference' || kind === 'theme' ? null : MATCH_COPY[kind];
  const field = copy?.field ?? 'sanskrit';
  const matchingText =
    field === 'roman' ? e.transliteration : field === 'english' ? e.english : field === 'hindi' ? e.hindi : field === 'explanation' ? e.explanation : e.sanskrit;
  const reference = verseReference(e);
  return {
    id: e.id,
    title: e.sanskrit.split('\n').filter((l) => l.trim()).slice(0, 2).join(' '),
    subtitle: reference,
    group: 'verse',
    groupLabel: 'श्लोक · Exact Verse',
    category: 'verse',
    categoryLabel: 'श्लोक · Exact Verse',
    href: versePageHref(e.scriptureId, e.chapter, e.verse) ?? `/scripture/${e.scriptureId}/chapter/${e.chapter}`,
    reference,
    matchingText,
    matchedField: field,
    translationExcerpt: e.english || e.hindi,
    translationIsAi: e.english ? (e.flags & FLAG_ENGLISH_AI) !== 0 : (e.flags & FLAG_HINDI_AI) !== 0,
    commentaryExcerpt: e.explanation || undefined,
    aiDrafted: e.explanation ? (e.flags & FLAG_EXPLANATION_AI) !== 0 : undefined,
    matchReason: reasonOverride ?? copy?.reason ?? 'Matches the Sanskrit text',
    languageLabel: copy?.language ?? 'Sanskrit · Devanagari',
    actionLabel: 'Open verse →',
    extra: e.transliteration,
  };
}

/** The explanation of a verse, listed on its own under Commentaries. Labelled as the editorial text it is. */
function explanationItem(e: VerseEntry): SearchResultItem {
  const reference = verseReference(e);
  const ai = (e.flags & FLAG_EXPLANATION_AI) !== 0;
  return {
    id: `explanation-${e.id}`,
    title: `व्याख्या · ${reference}`,
    subtitle: ai ? `Editorial explanation · ${EDITORIAL_DRAFT_LABEL.en}` : 'Editorial explanation',
    group: 'commentary',
    groupLabel: 'टीका व व्याख्या · Commentary',
    category: 'commentary',
    categoryLabel: 'व्याख्या · Explanation',
    href: versePageHref(e.scriptureId, e.chapter, e.verse) ?? `/scripture/${e.scriptureId}/chapter/${e.chapter}`,
    reference,
    matchingText: e.explanation,
    matchedField: 'explanation',
    translationExcerpt: e.english || e.hindi,
    matchReason: 'Matches the explanation',
    languageLabel: /[ऀ-ॿ]/.test(e.explanation) ? 'Hindi · हिन्दी' : 'English',
    aiDrafted: ai,
    actionLabel: 'Read explanation →',
  };
}

/* ── Scoring & Search Core ────────────────────────────────────────────── */

const EMPTY_GROUPS = (): Record<SearchResultGroup, SearchResultItem[]> => ({
  verse: [],
  scripture: [],
  chapter: [],
  concept: [],
  topic: [],
  commentary: [],
  learning: [],
  practice: [],
});

export function searchIndex(rawQuery: string, options: SearchOptions = {}): SearchResponse {
  const { group = null, category = null, limit = 40 } = options;
  const activeFilter = group ?? category;
  const trimmed = rawQuery.trim();

  if (!trimmed) {
    return { results: [], groupedResults: EMPTY_GROUPS(), totalMatches: 0, groupCounts: {}, categoryCounts: {}, suggestion: null };
  }

  const isDev = isDevanagari(trimmed);
  const normQuery = normalizeForSearch(trimmed);
  const devNormQuery = normalizeDevanagari(trimmed);
  const compQuery = compactTransliteration(trimmed);
  const phoneQuery = phoneticIndex(trimmed);
  // "verses about anger" asks about "anger": drop the words that only describe the request.
  const queryTokens = contentTokens(trimmed);
  const coreQuery = queryTokens.join(' ');
  const devCore = devNormQuery.split(' ').filter((t) => t && !STOP_WORDS.has(t)).join(' ');

  // One entry per result, keeping the strongest reason it matched for.
  const scored = new Map<string, { item: SearchResultItem; score: number }>();
  const put = (item: SearchResultItem, score: number) => {
    const prev = scored.get(item.id);
    if (!prev || score > prev.score) scored.set(item.id, { item, score });
  };
  let didYouMean: string | null = null;
  let isTypoCorrected = false;
  let matchedThemeName: string | null = null;

  // 0. A typed citation (bg 2.47, gita 6.16, katha 1.3.3, rv 1.1.1) resolves
  //    before any index is fetched. The href exists only for a published verse.
  const direct = parseDirectCitation(trimmed);
  if (direct) {
    put(
      {
        id: `direct-${direct.scriptureId}-${direct.href}`,
        title: direct.title,
        subtitle: direct.subtitle,
        group: direct.href.includes('/verse/') ? 'verse' : 'chapter',
        groupLabel: direct.href.includes('/verse/') ? 'श्लोक · Exact Verse' : 'अध्याय · Chapter',
        category: direct.href.includes('/verse/') ? 'verse' : 'chapter',
        categoryLabel: direct.href.includes('/verse/') ? 'श्लोक · Exact Verse' : 'अध्याय · Chapter',
        href: direct.href,
        reference: direct.title,
        matchingText: direct.title,
        matchReason: direct.matchReason,
        languageLabel: 'Reference',
        actionLabel: direct.href.includes('/verse/') ? 'Open verse →' : 'Read chapter →',
      },
      10000,
    );
  }

  for (const hit of searchCoreIndex(trimmed)) {
    if (direct && hit.item.href === direct.href) continue;
    put(hit.item, hit.score);
  }

  // 1. An exact reference ("Gita 2.47", "Bhagavad Gita chapter 2 verse 47", "गीता २.४७").
  const parsedRef = direct ? null : parseScriptureReference(trimmed);
  if (parsedRef) {
    const { scriptureId, chapter, verse } = parsedRef;
    const scripture = scriptureById.get(scriptureId);
    if (scripture) {
      const entry = verse !== undefined ? lookupVerse(scriptureId, chapter, verse) : undefined;
      if (entry) {
        put(verseItem(entry, 'reference', 'Exact reference'), 5000);
      } else if (verse !== undefined) {
        // A verse we have no text for here: still send the reader to its chapter, honestly labelled.
        const href = versePageHref(scriptureId, chapter, verse) ?? `${chapterHref(scriptureId, chapter)}#verse-${verse}`;
        put(
          {
            id: `ref-${scriptureId}-${chapter}-${verse}`,
            title: `${scripture.title} ${chapter}.${verse}`,
            subtitle: `${scripture.titleSanskrit} · अध्याय ${chapter}, श्लोक ${verse}`,
            group: 'verse',
            groupLabel: 'श्लोक · Exact Verse',
            category: 'verse',
            categoryLabel: 'श्लोक · Exact Verse',
            href,
            reference: `${scripture.title} ${chapter}.${verse}`,
            matchingText: `${scripture.title} chapter ${chapter}, verse ${verse}`,
            matchReason: 'Exact reference',
            languageLabel: 'Reference',
            actionLabel: 'Open verse →',
          },
          4800,
        );
      } else {
        const href = chapterHref(scriptureId, chapter);
        put(
          {
            id: `ref-${scriptureId}-${chapter}`,
            title: `${scripture.title} · अध्याय ${chapter}`,
            subtitle: chapterTitleByHref.get(href) ?? scripture.titleSanskrit,
            group: 'chapter',
            groupLabel: 'अध्याय · Chapter',
            category: 'chapter',
            categoryLabel: 'अध्याय · Chapter',
            href,
            reference: `${scripture.title} Ch. ${chapter}`,
            matchingText: `${scripture.title} chapter ${chapter}`,
            translationExcerpt: chapterTitleByHref.get(href),
            matchReason: 'Exact reference',
            languageLabel: 'Reference',
            actionLabel: 'Read chapter →',
          },
          4000,
        );
      }
    }
  }

  // 2. The verse index: Sanskrit, transliteration, English and Hindi text, partial or whole.
  const verseHits = isVerseIndexLoaded() && !parsedRef ? searchVerses(trimmed, { limit: 60 }) : [];
  for (const hit of verseHits) {
    put(verseItem(hit.entry, hit.kind), hit.score);
    if (hit.kind === 'explanation') put(explanationItem(hit.entry), hit.score - 40);
  }

  // 3. Themes ("verses about anger", "fear", "भय"): the Wisdom for Life topics and their cited verses.
  //    Ranked below direct text matches, so a quoted verse is never reported as a "theme".
  const strongestText = verseHits.reduce((m, h) => Math.max(m, h.score), 0);
  // A short, purely thematic query ("fear") puts the topic first; a long phrase that already found its verse does not.
  const topicScore = queryTokens.length <= 3 && strongestText < 1200 ? 1100 : 650;
  for (const { theme, keyword } of matchThemes(coreQuery, normQuery, isDev ? devCore : '')) {
    matchedThemeName = matchedThemeName ?? `${theme.name} (${theme.nameHi})`;
    for (const [scriptureId, chapter, verse] of theme.verses) {
      const entry = lookupVerse(scriptureId, chapter, verse);
      if (entry) put(verseItem(entry, 'theme', `Cited in “${theme.name}”`), 620);
    }
    put(
      {
        id: `wisdom-${theme.slug}`,
        title: theme.name,
        subtitle: `${theme.nameHi} · Wisdom for Life`,
        group: 'topic',
        groupLabel: 'विषय · Topic',
        category: 'topic',
        categoryLabel: 'जीवन के लिए · Wisdom for Life',
        href: theme.href,
        reference: `Wisdom for Life · ${theme.name}`,
        matchingText: theme.topic.shortDescEn,
        translationExcerpt: theme.topic.shortDescEn,
        matchReason: `Matches “${keyword}”`,
        languageLabel: 'English & Hindi',
        actionLabel: 'Explore topic →',
      },
      topicScore,
    );
  }

  // 4. Everything else: scriptures, chapters, topics, concepts, commentary overviews, learning, practices.
  const allEntries = chapterEntries.length ? getMasterIndex().concat(chapterEntries) : getMasterIndex();
  for (const entry of allEntries) {
    const { item } = entry;
    let score = 0;
    let reason = item.matchReason;
    let language = item.languageLabel;

    // A. Devanagari
    if (isDev && devNormQuery) {
      const devTitle = normalizeDevanagari(item.title);
      const devSub = normalizeDevanagari(item.subtitle ?? '');
      const devRest = normalizeDevanagari(`${item.description ?? ''} ${item.extra ?? ''}`);
      if (devTitle.includes(devNormQuery)) {
        score += devTitle === devNormQuery ? 1500 : 900;
        reason = 'Matches the title (Devanagari)';
        language = 'Sanskrit · Devanagari';
      } else if (devSub.includes(devNormQuery)) {
        score += 700;
        reason = 'Matches the Devanagari name';
        language = 'Sanskrit · Devanagari';
      } else if (devRest.includes(devNormQuery)) {
        score += 400;
        reason = 'Matches the description';
      }
    }

    // B. Roman transliteration (spaces, diacritics and spelling variants folded away)
    if (!isDev && compQuery.length >= 4 && entry.compactName.includes(compQuery)) {
      score += entry.compactName === compQuery ? 1400 : 850;
      reason = 'Matches the name or transliteration';
      language = 'Roman transliteration';
    }

    // C. Words: every content word must hit (stop words ignored)
    if (!isDev && queryTokens.length > 0) {
      let hits = 0;
      let wordScore = 0;
      for (const token of queryTokens) {
        const raw = entry.rawSearchText;
        if (raw.startsWith(token) || raw.includes(` ${token}`)) {
          hits += 1;
          wordScore += 80;
        } else if (token.length >= 4 && raw.includes(token)) {
          hits += 1;
          wordScore += 40;
        }
      }
      if (hits === queryTokens.length) {
        score += wordScore;
        if (reason === item.matchReason) reason = item.matchReason;
      } else if (score === 0) {
        score = 0;
      }
    }

    // D0. Devanagari or Hinglish folded onto the same key as the roman name.
    if (score === 0 && phoneQuery.length >= 4 && entry.compactName.includes(phoneQuery)) {
      score += entry.compactName === phoneQuery ? 1200 : 700;
      reason = 'Matches the phonetic spelling';
      language = isDev ? 'Sanskrit · Devanagari' : 'Roman transliteration';
    }

    // D. A single word that is close to a title (typo tolerance)
    if (score === 0 && queryTokens.length === 1 && queryTokens[0].length >= 4 && !isDev) {
      const normTitle = normalizeForSearch(item.title);
      const dist = levenshteinDistance(queryTokens[0], normTitle);
      if (dist <= 2) {
        score += 250 - dist * 50;
        reason = 'Close to your spelling (possible typo)';
        isTypoCorrected = true;
        if (!didYouMean) didYouMean = item.title;
      }
    }

    if (score > 0) put({ ...item, matchReason: reason, languageLabel: language }, score);
  }

  // 5. Known misspellings, offered as a suggestion only when they differ from what was typed.
  for (const [typoKey, correction] of Object.entries(COMMON_TYPOS)) {
    if (normQuery === typoKey || compQuery === compactTransliteration(typoKey) || levenshteinDistance(normQuery, typoKey) <= 2) {
      if (normalizeForSearch(correction) !== normQuery) didYouMean = correction;
      break;
    }
  }

  // A query that already found something strong is not a typo ("gita" is an alias, not a mistake).
  const strongest = Array.from(scored.values()).reduce((m, r) => Math.max(m, r.score), 0);
  if (strongest >= 700) {
    didYouMean = null;
    isTypoCorrected = false;
  }

  // 6. Nothing yet: look for verses close to the spelling, then retry with the suggestion.
  if (scored.size === 0 && isVerseIndexLoaded() && !isDev) {
    for (const hit of searchVerses(trimmed, { fuzzy: true, limit: 12 })) {
      put(verseItem(hit.entry, 'fuzzy'), hit.score);
      isTypoCorrected = true;
    }
  }
  if (scored.size === 0 && didYouMean && normalizeForSearch(didYouMean) !== normQuery) {
    const fallback = searchIndex(didYouMean, { ...options, limit });
    if (fallback.totalMatches > 0) {
      return {
        ...fallback,
        suggestion: didYouMean,
        didYouMean,
        isTypoCorrected: true,
        results: fallback.results.map((r) => ({ ...r, matchReason: `Showing results for “${didYouMean}”` })),
      };
    }
  }

  // Order, group, count.
  const ordered = Array.from(scored.values()).sort((a, b) => b.score - a.score);
  const groupCounts: Partial<Record<SearchResultGroup, number>> = {};
  const groupedResults = EMPTY_GROUPS();
  for (const { item } of ordered) {
    groupCounts[item.group] = (groupCounts[item.group] ?? 0) + 1;
    groupedResults[item.group].push(item);
  }
  const filtered = activeFilter ? ordered.filter(({ item }) => item.group === activeFilter || item.category === activeFilter) : ordered;

  return {
    results: filtered.slice(0, limit).map((s) => s.item),
    groupedResults: {
      verse: groupedResults.verse.slice(0, 10),
      scripture: groupedResults.scripture.slice(0, 8),
      chapter: groupedResults.chapter.slice(0, 8),
      concept: groupedResults.concept.slice(0, 8),
      topic: groupedResults.topic.slice(0, 8),
      commentary: groupedResults.commentary.slice(0, 8),
      learning: groupedResults.learning.slice(0, 8),
      practice: groupedResults.practice.slice(0, 8),
    },
    totalMatches: filtered.length,
    groupCounts,
    categoryCounts: { ...groupCounts },
    suggestion: didYouMean,
    didYouMean,
    isTypoCorrected,
    matchedTheme: matchedThemeName,
  };
}
