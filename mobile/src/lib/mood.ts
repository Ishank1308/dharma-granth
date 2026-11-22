/**
 * Emotionally aware tone for Home: what to say, and in what light, given the hour, the lunar day, a festival,
 * and how the reader has been reading. It never scolds, never counts what was missed, and never asks for more
 * than one verse. Pure functions, so the rules can be read (and tested) in one place.
 *
 * Priority, highest first:
 *   1. A festival today, or Ekadashi / Purnima / Amavasya: the greeting names the day.
 *   2. The reader's own rhythm: read today → rest; a live streak → no hurry; back after days away → welcome.
 *   3. The hour: Brahma muhurta, morning, midday, sandhya, night.
 */
import type { ComponentProps } from 'react';
import type Ionicons from '@expo/vector-icons/Ionicons';

import { S, type Msg } from '@/i18n';

export type Moment = 'brahma' | 'morning' | 'midday' | 'sandhya' | 'night';
export type Occasion = 'festival' | 'ekadashi' | 'purnima' | 'amavasya';

export interface Mood {
  moment: Moment;
  occasion?: Occasion;
  greeting: Msg;
  note: Msg;
  icon: ComponentProps<typeof Ionicons>['name'];
  /** Two colours for the hero's light: a warm pool and a cool pool, low alpha so text contrast holds. */
  glow: { dark: [string, string]; light: [string, string] };
}

export function momentOf(date: Date): Moment {
  const h = date.getHours() + date.getMinutes() / 60;
  if (h >= 4 && h < 6) return 'brahma';
  if (h >= 6 && h < 12) return 'morning';
  if (h >= 12 && h < 17) return 'midday';
  if (h >= 17 && h < 20) return 'sandhya';
  return 'night';
}

const MOMENTS: Record<Moment, Pick<Mood, 'greeting' | 'note' | 'icon' | 'glow'>> = {
  brahma: {
    greeting: S.moodBrahma,
    note: S.moodNoteBrahma,
    icon: 'star-outline',
    glow: { light: ['rgba(99,102,241,0.20)', 'rgba(236,72,153,0.12)'], dark: ['rgba(129,140,248,0.26)', 'rgba(236,72,153,0.14)'] },
  },
  morning: {
    greeting: S.moodMorning,
    note: S.moodNoteMorning,
    icon: 'sunny-outline',
    glow: { light: ['rgba(251,146,60,0.24)', 'rgba(250,204,21,0.16)'], dark: ['rgba(251,146,60,0.22)', 'rgba(250,204,21,0.12)'] },
  },
  midday: {
    greeting: S.moodMidday,
    note: S.moodNoteMidday,
    icon: 'sunny',
    glow: { light: ['rgba(234,179,8,0.18)', 'rgba(20,184,166,0.14)'], dark: ['rgba(250,204,21,0.16)', 'rgba(45,212,191,0.14)'] },
  },
  sandhya: {
    greeting: S.moodSandhya,
    note: S.moodNoteSandhya,
    icon: 'partly-sunny-outline',
    glow: { light: ['rgba(234,88,12,0.24)', 'rgba(219,39,119,0.16)'], dark: ['rgba(249,115,22,0.24)', 'rgba(244,114,182,0.16)'] },
  },
  night: {
    greeting: S.moodNight,
    note: S.moodNoteNight,
    icon: 'moon-outline',
    glow: { light: ['rgba(79,70,229,0.16)', 'rgba(13,148,136,0.12)'], dark: ['rgba(99,102,241,0.24)', 'rgba(45,212,191,0.12)'] },
  },
};

export interface MoodInput {
  now: Date;
  /** Today's tithi name from the Panchang ('Ekadashi', 'Purnima', 'Amavasya', …). */
  tithi?: string;
  /** A festival on today's date, already in the reader's language. */
  festivalToday?: string;
  /** Reading rhythm, from streakInfo(). */
  readToday?: boolean;
  streak?: number;
  /** Whole days since the last day a verse was read; undefined when nothing has been read yet. */
  daysAway?: number;
}

export function moodFor({ now, tithi, festivalToday, readToday, streak = 0, daysAway }: MoodInput): Mood {
  const moment = momentOf(now);
  const base = { moment, ...MOMENTS[moment] };

  if (festivalToday) {
    return { ...base, occasion: 'festival', greeting: S.moodFestival(festivalToday), note: S.moodFestivalNote, icon: 'sparkles' };
  }
  const t = (tithi ?? '').toLowerCase();
  if (t.includes('ekadashi')) return { ...base, occasion: 'ekadashi', greeting: S.moodEkadashi, note: S.moodEkadashiNote, icon: 'leaf-outline' };
  if (t.includes('purnima')) return { ...base, occasion: 'purnima', greeting: S.moodPurnima, note: S.moodPurnimaNote, icon: 'ellipse' };
  if (t.includes('amavasya')) return { ...base, occasion: 'amavasya', greeting: S.moodAmavasya, note: S.moodAmavasyaNote, icon: 'ellipse-outline' };

  // The greeting stays the hour's; only the quiet line under it follows the reader.
  if (readToday) return { ...base, note: S.moodReadToday };
  if (streak > 0) return { ...base, note: S.moodKeepThread };
  if (daysAway === undefined) return { ...base, note: S.moodFirstVisit };
  if (daysAway >= 3) return { ...base, note: S.moodWelcomeBack };
  return base;
}

/** Whole days between two day keys (YYYY-MM-DD). */
export function daysSince(fromKey: string, toKey: string): number {
  const a = Date.UTC(+fromKey.slice(0, 4), +fromKey.slice(5, 7) - 1, +fromKey.slice(8, 10));
  const b = Date.UTC(+toKey.slice(0, 4), +toKey.slice(5, 7) - 1, +toKey.slice(8, 10));
  return Math.round((b - a) / 86_400_000);
}
