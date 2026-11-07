import { DAILY_WISDOM_REGISTRY } from '@/data/daily-wisdom-engine';
import { scriptureCatalog } from '@/data/scripture-meta';
import { scriptureVibe, vibeAttrs } from '@/lib/scripture-vibes';
import { TodayVerseCard, type TodayVerseVibes } from './TodayVerseCard';

/**
 * Server half of the home verse card: the cover colours of the few scriptures the daily pool draws
 * from, passed down as plain props. The card itself picks the verse on the reader's device.
 */
export function HomeTodayVerse() {
  const vibes: TodayVerseVibes = {};
  for (const id of new Set(DAILY_WISDOM_REGISTRY.map((item) => item.scriptureId))) {
    const meta = scriptureCatalog.find((s) => s.id === id);
    vibes[id] = vibeAttrs(scriptureVibe(id, meta?.category ?? 'other'));
  }
  return <TodayVerseCard vibes={vibes} />;
}
