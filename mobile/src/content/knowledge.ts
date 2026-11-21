/**
 * The knowledge pages (concepts, dictionary, characters, places, timelines) and Wisdom for life, bundled
 * from the website's data by scripts/build-knowledge.mjs. Each kind is parsed the first time it is opened.
 */
import type { ComponentProps } from 'react';
import type Ionicons from '@expo/vector-icons/Ionicons';

import { KNOWLEDGE_LOADERS } from './generated/knowledge/loaders';
import type { KnowledgeData, KnowledgeKind } from './knowledge-types';
import { S, type Msg } from '@/i18n/strings';
import type { Hues } from '@/theme/themes';

export * from './knowledge-types';

const cache: Partial<KnowledgeData> = {};

export function knowledge<K extends keyof KnowledgeData>(kind: K): KnowledgeData[K] {
  if (!cache[kind]) cache[kind] = KNOWLEDGE_LOADERS[kind]() as KnowledgeData[K];
  return cache[kind] as KnowledgeData[K];
}

type IconName = ComponentProps<typeof Ionicons>['name'];

/** The five knowledge kinds, in the order of the hub, with their title, blurb, icon and hue. */
export const KINDS: { kind: KnowledgeKind; title: Msg; blurb: Msg; icon: IconName; hue: keyof Hues }[] = [
  { kind: 'concepts', title: S.kConcepts, blurb: S.kConceptsBlurb, icon: 'git-network-outline', hue: 'saffron' },
  { kind: 'dictionary', title: S.kDictionary, blurb: S.kDictionaryBlurb, icon: 'text-outline', hue: 'indigo' },
  { kind: 'characters', title: S.kCharacters, blurb: S.kCharactersBlurb, icon: 'people-outline', hue: 'lotus' },
  { kind: 'places', title: S.kPlaces, blurb: S.kPlacesBlurb, icon: 'location-outline', hue: 'peacock' },
  { kind: 'timelines', title: S.kTimelines, blurb: S.kTimelinesBlurb, icon: 'time-outline', hue: 'gold' },
];

export function isKind(value: string): value is KnowledgeKind {
  return KINDS.some((k) => k.kind === value);
}

/** The website's Tailwind colour families, mapped onto the app's seven hues so they pass the contrast test. */
const HUE_MAP: Record<string, keyof Hues> = {
  saffron: 'saffron',
  amber: 'gold',
  orange: 'saffron',
  yellow: 'gold',
  red: 'vermilion',
  rose: 'vermilion',
  pink: 'lotus',
  fuchsia: 'lotus',
  purple: 'indigo',
  violet: 'indigo',
  indigo: 'indigo',
  blue: 'indigo',
  sky: 'peacock',
  cyan: 'peacock',
  teal: 'peacock',
  emerald: 'tulsi',
  green: 'tulsi',
  lime: 'tulsi',
  stone: 'gold',
  gray: 'gold',
  slate: 'indigo',
};

export function hueKey(family: string | undefined): keyof Hues {
  return (family && HUE_MAP[family]) || 'saffron';
}

/** One title line of an entry, for lists and the search filter. */
export interface Entry {
  id: string;
  title: string;
  sanskrit: string;
  subtitle: string;
  category: string;
  icon?: string;
  hue?: string;
  /** Extra words the filter matches (transliteration, keywords). */
  terms: string;
}

/** Every entry of a kind in one list shape, so the list screen and the filter stay one component. */
export function entries(kind: KnowledgeKind, lang: 'en' | 'hi'): Entry[] {
  switch (kind) {
    case 'concepts':
      return knowledge('concepts').items.map((c) => ({
        id: c.id,
        title: c.label,
        sanskrit: c.sanskrit,
        subtitle: (lang === 'hi' ? c.short.hi : c.short.en) || c.short.hi || c.short.en,
        category: c.category,
        terms: `${c.translit} ${c.id}`,
      }));
    case 'dictionary':
      return knowledge('dictionary').items.map((t) => ({
        id: t.id,
        title: t.term,
        sanskrit: t.sanskrit,
        subtitle: t.short,
        category: t.category,
        terms: `${t.translit} ${t.id}`,
      }));
    case 'characters':
      return knowledge('characters').items.map((c) => ({
        id: c.id,
        title: c.name,
        sanskrit: c.sanskrit,
        subtitle: c.short,
        category: c.category,
        icon: c.icon,
        hue: c.hue,
        terms: c.id,
      }));
    case 'places':
      return knowledge('places').items.map((p) => ({
        id: p.id,
        title: p.name,
        sanskrit: p.sanskrit,
        subtitle: p.short,
        category: p.category,
        icon: p.icon,
        hue: p.hue,
        terms: `${p.id} ${p.presentDay}`,
      }));
    case 'timelines':
      return knowledge('timelines').items.map((t) => ({
        id: t.id,
        title: t.title,
        sanskrit: t.sanskrit,
        subtitle: t.description,
        category: t.category,
        terms: `${t.id} ${t.events.map((e) => e.title).join(' ')}`,
      }));
  }
}

const fold = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zऀ-ॿ]/g, '');

/**
 * Finds the page a name refers to ("Rama", "rita", "Sarayu River"), across characters, places, concepts and
 * dictionary terms, so names in one page link to another. Matches on id or title, ignoring diacritics.
 */
export function findByName(name: string, prefer?: KnowledgeKind): { kind: KnowledgeKind; id: string } | null {
  const needle = fold(name);
  if (!needle) return null;
  const order: KnowledgeKind[] = ['characters', 'places', 'concepts', 'dictionary'];
  if (prefer) order.sort((a, b) => Number(b === prefer) - Number(a === prefer));
  const aliases: Record<string, string> = { rita: 'rta', rtam: 'rta' };
  for (const kind of order) {
    for (const e of entries(kind, 'en')) {
      const id = fold(e.id);
      const title = fold(e.title);
      if (id === needle || title === needle || (aliases[needle] && id === aliases[needle])) return { kind, id: e.id };
    }
  }
  return null;
}

/** Wisdom topics whose title, keywords or summary match a query, for the Wisdom search field. */
export function matchWisdom(query: string) {
  const q = query.trim().toLowerCase();
  const topics = knowledge('wisdom').items;
  if (!q) return topics;
  return topics.filter(
    (t) =>
      t.title.en.toLowerCase().includes(q) ||
      t.title.hi.includes(query.trim()) ||
      t.keywords.some((k) => k.toLowerCase().includes(q)) ||
      t.short.en.toLowerCase().includes(q) ||
      t.short.hi.includes(query.trim()),
  );
}
