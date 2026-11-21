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
