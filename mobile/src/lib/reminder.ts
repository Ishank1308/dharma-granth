/**
 * Pure helpers for the opt-in daily verse notification. No native code here, so `npm test` can run it.
 *
 * Android repeats a notification with the same text every day, but the verse changes daily. So the app
 * schedules one notification per day for the next REMINDER_DAYS days, each with that day's verse, and
 * tops the queue up every time it opens.
 */

export const REMINDER_DAYS = 30;

/** The next `count` local times at hour:minute, starting today if that time is still ahead. */
export function upcomingReminderTimes(now: Date, hour: number, minute: number, count = REMINDER_DAYS): Date[] {
  const out: Date[] = [];
  const first = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0, 0);
  // Skip today when the time has passed (or is under a minute away, so it does not fire mid-scheduling).
  let offset = first.getTime() - now.getTime() > 60_000 ? 0 : 1;
  while (out.length < count) {
    // Build each day from calendar parts, so daylight-saving changes keep the same wall-clock time.
    out.push(new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset, hour, minute, 0, 0));
    offset += 1;
  }
  return out;
}

/** "7:05 AM" or "19:05", for the settings row. */
export function formatReminderTime(hour: number, minute: number, use24Hour = false): string {
  const mm = String(minute).padStart(2, '0');
  if (use24Hour) return `${String(hour).padStart(2, '0')}:${mm}`;
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${h12}:${mm} ${hour < 12 ? 'AM' : 'PM'}`;
}

/**
 * How the daily verse avoids nagging. Each time the app opens, the queue is planned again from that day:
 * every chosen day for the first DAILY_DAYS days, then every other day until QUIET_AFTER_DAYS, then nothing.
 * Someone who reads keeps getting the verse daily; someone who stopped opening the app hears from it less
 * and less, and after two weeks not at all, until they come back.
 */
export const DAILY_DAYS = 7;
export const QUIET_AFTER_DAYS = 14;

export interface ScheduleOptions {
  /** Weekdays allowed, as Date.getDay() counts. Empty or missing means every day. */
  days?: number[];
  /** The reader already read today, so today's reminder would only repeat what they did. */
  readToday?: boolean;
}

/** The local times the daily verse should arrive at, for a queue planned at `now`. */
export function reminderSchedule(now: Date, hour: number, minute: number, opts: ScheduleOptions = {}): Date[] {
  const allowed = opts.days && opts.days.length > 0 ? new Set(opts.days) : null;
  const first = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0, 0);
  const todayStillAhead = first.getTime() - now.getTime() > 60_000;
  const out: Date[] = [];
  for (let offset = 0; offset < QUIET_AFTER_DAYS; offset += 1) {
    if (offset === 0 && (!todayStillAhead || opts.readToday)) continue;
    // Past the first week, only every other day.
    if (offset >= DAILY_DAYS && (offset - DAILY_DAYS) % 2 === 1) continue;
    const when = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset, hour, minute, 0, 0);
    if (allowed && !allowed.has(when.getDay())) continue;
    out.push(when);
  }
  return out;
}
