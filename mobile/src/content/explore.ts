/**
 * The Explore tab's content: the website's own Panchang calculation, festival calendar and mantras, copied in
 * at build time by scripts/build-explore.mjs (from lib/panchang.ts, data/festivals.ts, data/festival-dates.ts,
 * data/mantras.ts and the vrat tables on /panchang/ekadashi/ and friends), so the app and dharmagranth.dev
 * always agree. Everything here works offline.
 */
import { FESTIVAL_DATES, type FestivalDate } from './generated/explore/festival-dates';
import { festivals, type Festival } from './generated/explore/festivals';
import { SACRED_MANTRAS, type SacredMantra } from './generated/explore/mantras';
import {
  calculateEducationalPanchang,
  PRESET_LOCATIONS,
  todayForLocation,
  type LocationConfig,
  type PanchangDayData,
} from './generated/explore/panchang';
import { AMAVASYA_DATES, EKADASHI_DATES, PRADOSH_DATES, PURNIMA_DATES, type VrataDateItem } from './generated/explore/vrata-dates';

export { calculateEducationalPanchang, formatPanchangClock, todayForLocation } from './generated/explore/panchang';
export { mantraLines } from '@/lib/mantra-lines';
export type { Festival, FestivalDate, LocationConfig, PanchangDayData, SacredMantra, VrataDateItem };

/** Cities with verified coordinates, the same list as the website's city picker (its demo entry is left out). */
export const CITIES: LocationConfig[] = PRESET_LOCATIONS.filter((c) => c.hasReliableCoordinates);
export const DEFAULT_CITY = CITIES[0];

export function cityById(id: string | null | undefined): LocationConfig {
  return CITIES.find((c) => c.id === id) ?? DEFAULT_CITY;
}

export function isoDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Noon on the civil day `days` after `d`, as the website's calendar steps days. */
export function addDays(d: Date, days: number): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + days, 12, 0, 0);
}

export function fromIso(iso: string): Date {
  const [y, m, day] = iso.split('-').map(Number);
  return new Date(y, m - 1, day, 12, 0, 0);
}

/** Today's panchang at a city, computed on the phone. */
export function todayPanchang(city: LocationConfig, now = new Date()): PanchangDayData {
  return calculateEducationalPanchang(todayForLocation(city, now), city);
}

export type VrataKind = 'ekadashi' | 'purnima' | 'amavasya' | 'pradosh';
export const VRATA_KINDS: VrataKind[] = ['ekadashi', 'purnima', 'amavasya', 'pradosh'];
const VRATA_TABLES: Record<VrataKind, VrataDateItem[]> = {
  ekadashi: EKADASHI_DATES,
  purnima: PURNIMA_DATES,
  amavasya: AMAVASYA_DATES,
  pradosh: PRADOSH_DATES,
};

/** The next vrat dates of one kind on or after `fromIsoDate` (YYYY-MM-DD), from the website's tables. */
export function upcomingVrats(kind: VrataKind, fromIsoDate: string, limit = 6): VrataDateItem[] {
  return VRATA_TABLES[kind]
    .filter((v) => v.dateEn >= fromIsoDate)
    .sort((a, b) => a.dateEn.localeCompare(b.dateEn))
    .slice(0, limit);
}

/** Festivals on or after `fromIsoDate`, in date order. */
export function upcomingFestivals(fromIsoDate: string, limit = Infinity): FestivalDate[] {
  return FESTIVAL_DATES.filter((f) => f.date >= fromIsoDate)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, limit);
}

export const FESTIVALS: Festival[] = festivals;
export function festivalById(id: string): Festival | undefined {
  return festivals.find((f) => f.id === id);
}
/** The next dated occurrence of a festival page, if the calendar has one. */
export function nextDateOf(festivalId: string, fromIsoDate: string): FestivalDate | undefined {
  return upcomingFestivals(fromIsoDate).find((d) => d.festivalId === festivalId);
}

export const MANTRAS: SacredMantra[] = SACRED_MANTRAS;
export function mantraBySlug(slug: string): SacredMantra | undefined {
  return SACRED_MANTRAS.find((m) => m.slug === slug);
}
export type MantraCategory = SacredMantra['category'];
export const MANTRA_CATEGORIES: MantraCategory[] = ['vedic', 'shanti', 'stotra'];

/** Whole days from one ISO date to another (both civil days). */
export function daysBetween(fromIsoDate: string, toIsoDate: string): number {
  return Math.round((fromIso(toIsoDate).getTime() - fromIso(fromIsoDate).getTime()) / 86_400_000);
}

/** "Sat, 5 Dec 2026" or "शनि, 5 दिस॰ 2026", with Western digits as the rest of the app. */
export function formatDay(iso: string, lang: 'en' | 'hi', withYear = true): string {
  try {
    return new Intl.DateTimeFormat(lang === 'hi' ? 'hi-IN' : 'en-IN', {
      numberingSystem: 'latn',
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      ...(withYear ? { year: 'numeric' } : null),
    }).format(fromIso(iso));
  } catch {
    return iso;
  }
}

/**
 * The day's muhurta windows in the city's clock minutes (format with formatPanchangClock), the same Rahu Kaal
 * and Abhijit as the website's muhurta page (lib/muhurta-daylight.ts). Null where sunrise is unknown.
 */
export function rahuAbhijit(p: PanchangDayData) {
  const daylight = p.solarTimes.daylight;
  if (!p.solarTimes.isReliable || !daylight) return null;
  const { sunriseMinute, sunsetMinute } = daylight;
  const duration = sunsetMinute - sunriseMinute;
  const weekday = p.date.getDay();
  const window = (start: number, end: number) => ({
    start: sunriseMinute + duration * start,
    end: sunriseMinute + duration * end,
    offset: start,
    width: end - start,
  });
  return {
    sunriseMinute,
    sunsetMinute,
    // Rahu Kaal is one eighth of the daylight; which eighth depends on the weekday (lib/muhurta-daylight.ts).
    rahu: window((RAHU_PART[weekday] - 1) / 8, RAHU_PART[weekday] / 8),
    // Abhijit is the 8th of 15 daytime muhurtas; it is not observed on Wednesday.
    abhijit: weekday === 3 ? null : window(7 / 15, 8 / 15),
    // Brahma muhurta: the two muhurtas (96 to 48 minutes) before sunrise.
    brahma: { start: sunriseMinute - 96, end: sunriseMinute - 48 },
  };
}

/** Which eighth of the day is Rahu Kaal, Sunday first (data/muhurta-data.ts getStandardRahuKalam). */
const RAHU_PART = [8, 2, 7, 5, 6, 4, 3];

