/**
 * The Learn section (courses, guided reading journeys, the Gita journey, the daily dharma journey, the
 * questions and "discover your path"), bundled from the website's data by scripts/build-learn.mjs.
 * Each part is parsed the first time a screen needs it.
 */
import type { Href } from 'expo-router';

import { getEntry } from './catalog';
import { LEARN_LOADERS } from './generated/learn/loaders';
import { knowledge } from './knowledge';
import type { DailyItem, LearnData, Recommendation } from './learn-types';
import type { Hues } from '@/theme/themes';

export * from './learn-types';

const cache: Partial<LearnData> = {};

export function learn<K extends keyof LearnData>(part: K): LearnData[K] {
  if (!cache[part]) cache[part] = LEARN_LOADERS[part]() as LearnData[K];
  return cache[part] as LearnData[K];
}

export const courseById = (id: string) => learn('courses').items.find((c) => c.id === id);
export const journeyById = (id: string) => learn('journeys').items.find((j) => j.id === id);

/** The website's Tailwind colour families, onto the app's seven hues (as the knowledge pages do). */
const HUES: Record<string, keyof Hues> = {
  emerald: 'tulsi',
  green: 'tulsi',
  teal: 'peacock',
  cyan: 'peacock',
  sky: 'peacock',
  blue: 'indigo',
  indigo: 'indigo',
  violet: 'indigo',
  purple: 'indigo',
  rose: 'vermilion',
  red: 'vermilion',
  pink: 'lotus',
  fuchsia: 'lotus',
  amber: 'gold',
  yellow: 'gold',
  stone: 'gold',
  orange: 'saffron',
  saffron: 'saffron',
};
export const hueFor = (family: string): keyof Hues => HUES[family] ?? 'saffron';

export const LEVEL_HUE: Record<string, keyof Hues> = { beginner: 'tulsi', intermediate: 'saffron', advanced: 'indigo' };
export const JOURNEY_HUE: Record<string, keyof Hues> = { foundations: 'saffron', yoga: 'indigo', life: 'peacock', healing: 'lotus' };
export const SHATKA_HUE: Record<string, keyof Hues> = { karma: 'saffron', bhakti: 'lotus', jnana: 'indigo' };

/** Day of the year on the Indian calendar (1-366), as the website's lib/ist.ts counts it. */
export function istDayOfYear(date = new Date()): number {
  const shifted = new Date(date.getTime() + 330 * 60_000);
  const y = shifted.getUTCFullYear();
  return Math.floor((Date.UTC(y, shifted.getUTCMonth(), shifted.getUTCDate()) - Date.UTC(y, 0, 0)) / 86_400_000);
}

/** Today's daily journey verse: the same one the website shows on /daily today. */
export function todayDailyIndex(date = new Date()): number {
  return istDayOfYear(date) % learn('daily').items.length;
}

export function dailyAt(index: number): DailyItem {
  const items = learn('daily').items;
  return items[((index % items.length) + items.length) % items.length];
}

/** The website's recommendations for a full set of answers, or null while a question is unanswered. */
export function recommendationsFor(answers: Record<string, string>): { recs: Recommendation[]; summary: string } | null {
  const d = learn('discover');
  if (!d.questions.every((q) => answers[q.key])) return null;
  const row = d.table[d.keys.map((k) => answers[k]).join('|')];
  if (!row) return null;
  return { recs: row.slice(0, 5).map((i) => d.recs[i]), summary: d.summaries[row[5]] };
}

/** Journey links the website names by an older id. */
const JOURNEY_ALIASES: Record<string, string> = { 'bhagavad-gita-for-beginners': 'gita-for-beginners' };

const KNOWLEDGE_PATHS = { concepts: 'concepts', dictionary: 'dictionary', characters: 'characters', locations: 'places' } as const;

/** True when the book and chapter are on the phone without a download (bundled), or when no chapter is asked. */
function readable(id: string, chapter?: number) {
  const entry = getEntry(id);
  if (!entry) return false;
  if (chapter == null) return true;
  return entry.chapters.some((c) => c.number === chapter);
}

/**
 * A website path ("/scripture/bhagavadgita/chapter/2/verse/47/", "/concepts/karma", "/learn/journeys/x")
 * as the app screen that shows the same thing, or null when the app has no such screen.
 */
export function appHref(webPath: string): Href | null {
  const [path, hash] = webPath.split('#');
  const parts = path.split('/').filter(Boolean);
  const [head, a, b, c, d, e] = parts;
  if (!head) return '/home';
  if (head === 'scripture' && a) {
    if (b === 'chapter' && c) {
      const chapter = Number(c);
      if (!readable(a, chapter)) return readable(a) ? { pathname: '/scripture/[id]', params: { id: a } } : null;
      const verse = d === 'verse' && e ? e : hash?.startsWith('verse-') ? hash.slice(6) : undefined;
      return { pathname: '/scripture/[id]/[chapter]', params: { id: a, chapter: String(chapter), ...(verse ? { verse } : null) } };
    }
    return readable(a) ? { pathname: '/scripture/[id]', params: { id: a } } : null;
  }
  if (head === 'scriptures') return '/';
  if (head === 'daily') return '/learn/daily';
  if (head === 'learn') {
    if (!a) return '/learn';
    if (a === 'start') return '/learn/start';
    if (a === 'faq') return '/learn/faq';
    if (a === 'academy') return '/learn';
    if (a === 'journeys') {
      if (!b) return '/learn';
      if (b === 'gita') return '/learn/gita';
      const id = JOURNEY_ALIASES[b] ?? b;
      return journeyById(id) ? { pathname: '/learn/journey/[id]', params: { id } } : null;
    }
    return courseById(a) ? { pathname: '/learn/course/[id]', params: { id: a } } : null;
  }
  if (head in KNOWLEDGE_PATHS) {
    const kind = KNOWLEDGE_PATHS[head as keyof typeof KNOWLEDGE_PATHS];
    if (!a) return { pathname: '/knowledge/[kind]', params: { kind } };
    return knowledge(kind).items.some((x) => x.id === a) ? { pathname: '/knowledge/[kind]/[id]', params: { kind, id: a } } : null;
  }
  if (head === 'timelines') return { pathname: '/knowledge/[kind]', params: { kind: 'timelines' } };
  if (head === 'wisdom-for-life') {
    if (!a) return '/wisdom';
    return knowledge('wisdom').items.some((x) => x.id === a) ? { pathname: '/wisdom/[slug]', params: { slug: a } } : null;
  }
  if (head === 'panchang') return '/explore/panchang';
  if (head === 'festivals') return '/explore/festivals';
  if (head === 'mantras') return '/explore/mantras';
  if (head === 'practice') return '/journal';
  return null;
}
