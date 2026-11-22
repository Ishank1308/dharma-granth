/**
 * Pure helpers for the opt-in festival-eve and Ekadashi-eve notifications. No native code here, so
 * `npm test` can run it. The native side (scheduling, the channel, the text) is
 * src/lib/observance-notification.ts.
 *
 * Each date gets one quiet notification at OBSERVANCE_HOUR on the evening before. Android caps how many
 * alarms an app may hold, and the daily verse already keeps up to 14, so only the next
 * MAX_OBSERVANCE_NOTICES dates are queued; the queue is planned again whenever the app opens.
 */

export type ObservanceKind = 'festival' | 'ekadashi';

export interface Observance {
  kind: ObservanceKind;
  /** ISO date of the festival or Ekadashi itself (YYYY-MM-DD, local calendar day). */
  date: string;
  en: string;
  hi: string;
  /** The festival's guide page in the Explore tab, when it has one. */
  festivalId?: string;
}

export interface ObservanceNotice {
  /** When the notification arrives: the evening before `item.date`. */
  when: Date;
  item: Observance;
}

/** 6 PM: a calm evening hour, after work and before the evening prayer for most. */
export const OBSERVANCE_HOUR = 18;
export const OBSERVANCE_MINUTE = 0;
/** The most notifications this feature keeps queued at once (both kinds together). */
export const MAX_OBSERVANCE_NOTICES = 20;
/** Scheduled notification identifiers start with this, so the daily verse queue can leave them alone. */
export const OBSERVANCE_ID_PREFIX = 'observance-';

const DEVANAGARI = /[ऀ-ॿ]/;

/**
 * Splits a name from the Ekadashi table ("मोक्षदा एकादशी (Mokshada / गीता जयंती 2027)") into its Hindi
 * part and a plain English one ("Mokshada Ekadashi"): the Devanagari notes and the year are left out of
 * the English, and "Ekadashi" is added when the English part does not already say it.
 */
export function ekadashiName(raw: string): { en: string; hi: string } {
  const m = /^(.*?)\s*\((.*)\)\s*$/.exec(raw.trim());
  if (!m) return { en: DEVANAGARI.test(raw) ? 'Ekadashi' : raw.trim(), hi: raw.trim() };
  const latin = m[2]
    .split('/')
    .map((part) => part.replace(/\b\d{4}\b/g, '').trim())
    .filter((part) => part && !DEVANAGARI.test(part));
  let en = latin.join(' / ');
  if (!/ekadashi/i.test(en)) en = en ? `${en} Ekadashi` : 'Ekadashi';
  return { en, hi: m[1].trim() || raw.trim() };
}

export function festivalObservances(
  rows: readonly { name: string; nameHindi?: string; date: string; festivalId?: string }[],
): Observance[] {
  return rows.map((r) => ({ kind: 'festival', date: r.date, en: r.name, hi: r.nameHindi ?? r.name, festivalId: r.festivalId }));
}

export function ekadashiObservances(rows: readonly { name: string; dateEn: string }[]): Observance[] {
  return rows.map((r) => ({ kind: 'ekadashi', date: r.dateEn, ...ekadashiName(r.name) }));
}

/** The local time on the day before an ISO date, built from calendar parts so daylight saving keeps the hour. */
export function eveOf(isoDate: string, hour = OBSERVANCE_HOUR, minute = OBSERVANCE_MINUTE): Date | undefined {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!m) return undefined;
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]) - 1, hour, minute, 0, 0);
}

/**
 * The notifications to queue at `now`: the evening before each date still ahead (at least a minute away, so
 * nothing fires mid-scheduling), soonest first, one per kind and date, at most `limit` in all.
 */
export function observanceSchedule(
  now: Date,
  items: readonly Observance[],
  opts: { hour?: number; minute?: number; limit?: number } = {},
): ObservanceNotice[] {
  const limit = opts.limit ?? MAX_OBSERVANCE_NOTICES;
  const seen = new Set<string>();
  const out: ObservanceNotice[] = [];
  for (const item of items) {
    const key = `${item.kind}:${item.date}`;
    if (seen.has(key)) continue;
    const when = eveOf(item.date, opts.hour, opts.minute);
    if (!when || when.getTime() - now.getTime() <= 60_000) continue;
    seen.add(key);
    out.push({ when, item });
  }
  out.sort((a, b) => a.when.getTime() - b.when.getTime() || a.item.kind.localeCompare(b.item.kind));
  return out.slice(0, limit);
}

export function observanceId(item: Pick<Observance, 'kind' | 'date'>): string {
  return `${OBSERVANCE_ID_PREFIX}${item.kind}-${item.date}`;
}
