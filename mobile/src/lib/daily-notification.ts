/**
 * Opt-in daily verse notification. Local notifications only: everything is scheduled on the phone by
 * Android's alarm service. There is no server, no push token and no Firebase project, so nothing about the
 * reader leaves the device.
 */
import * as Notifications from 'expo-notifications';
import { AndroidImportance } from 'expo-notifications';
import { Platform } from 'react-native';

import { dailyVerse, getEntry, loadChapter } from '@/content/catalog';
import type { Lang } from '@/i18n/language';
import { S } from '@/i18n/strings';
import { afterStartup } from '@/lib/after-startup';
import { dayKey, streakForNotification } from '@/lib/progress';
import { formatVerseRef, sanskritLines } from '@/lib/verse-format';
import { reminderSchedule } from '@/lib/reminder';

export const DAILY_CHANNEL_ID = 'daily-verse';
/** The notification's button row: one "Turn off" action, so opting out never needs a trip to Settings. */
export const DAILY_CATEGORY_ID = 'daily-verse';
export const STOP_ACTION_ID = 'stop-daily-verse';

/** Notifications work on Android and iOS builds; the web preview has no scheduler. */
export const remindersSupported = Platform.OS === 'android' || Platform.OS === 'ios';

export type ReminderPermission = 'granted' | 'denied' | 'undetermined';

let handlerSet = false;

/** Shows the notification even when the app is open, without sound or badge. Call once at startup. */
export function initNotifications() {
  if (!remindersSupported || handlerSet) return;
  handlerSet = true;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

/**
 * Creates the channel, or renames it in the reader's language. Android lets an app change a channel's
 * name and description at any time (the reader's own sound and importance choices are kept).
 */
async function ensureChannel(lang: Lang) {
  await Notifications.setNotificationCategoryAsync(DAILY_CATEGORY_ID, [
    { identifier: STOP_ACTION_ID, buttonTitle: S.turnOffDailyVerse[lang], options: { opensAppToForeground: true } },
  ]).catch(() => {});
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(DAILY_CHANNEL_ID, {
    name: S.dailyChannelName[lang],
    description: S.dailyChannelDescription[lang],
    importance: AndroidImportance.DEFAULT,
    showBadge: false,
  });
}

export async function getReminderPermission(): Promise<ReminderPermission> {
  if (!remindersSupported) return 'denied';
  const p = await Notifications.getPermissionsAsync();
  if (p.granted) return 'granted';
  return p.canAskAgain ? 'undetermined' : 'denied';
}

/** Asks Android 13+ for POST_NOTIFICATIONS. The channel must exist first or the prompt does not show. */
export async function requestReminderPermission(lang: Lang): Promise<ReminderPermission> {
  if (!remindersSupported) return 'denied';
  await ensureChannel(lang);
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return 'granted';
  if (!current.canAskAgain) return 'denied';
  const asked = await Notifications.requestPermissionsAsync();
  return asked.granted ? 'granted' : 'denied';
}

/**
 * The notification text for one day: the whole shloka (never cut mid-verse) and its reference, then an
 * optional gentle line under it (the reading streak). The title and book name follow the interface
 * language; the verse itself is always Sanskrit.
 *
 * `bookId` is the book to pick from (the one the reader is in); any day it has no Sanskrit line to show,
 * or it is not bundled, the Gita's verse of the day is used.
 */
export function verseNotificationFor(
  date: Date,
  lang: Lang,
  note?: string,
  bookId?: string,
): Notifications.NotificationContentInput | undefined {
  const fromBook = bookId && bookId !== 'bhagavadgita' ? notificationVerse(date, lang, bookId) : undefined;
  const found = fromBook ?? notificationVerse(date, lang, 'bhagavadgita');
  if (!found) return undefined;
  return {
    title: found.title,
    body: `${found.body}${note ? `\n${note}` : ''}`,
    data: found.data,
    categoryIdentifier: DAILY_CATEGORY_ID,
  };
}

function notificationVerse(date: Date, lang: Lang, bookId: string) {
  const pick = dailyVerse(date, bookId);
  if (!pick) return undefined;
  const verse = loadChapter(pick.id, pick.chapter)?.verses[pick.index];
  if (!verse) return undefined;
  const lines = sanskritLines(verse.sanskrit);
  if (lines.length === 0) return undefined;
  const entry = getEntry(pick.id);
  const book = (lang === 'hi' ? entry?.titleSanskrit : undefined) ?? entry?.title ?? S.bhagavadGita[lang];
  return {
    // The Gita keeps the plain "Verse of the day"; another book names itself, so the reader knows why.
    title: pick.id === 'bhagavadgita' ? S.dailyNotificationTitle[lang] : S.verseFromBook(book)[lang],
    body: `${lines.join('\n')}\n${book} ${formatVerseRef(pick.id, pick.chapter, verse.number)}`,
    data: { id: pick.id, chapter: pick.chapter, verse: String(verse.number) },
  };
}

export interface ReminderOptions {
  enabled: boolean;
  hour: number;
  minute: number;
  /** Interface language: the notification text is written in it when scheduled. */
  lang: Lang;
  /** Days read on (dayKey strings). A day already read gets no reminder. */
  daysRead?: string[];
  /**
   * The reader shows the reading streak. Only the next notification can mention it (see
   * streakForNotification); later ones stay plain.
   */
  showStreak?: boolean;
  /** Weekdays allowed, as Date.getDay() counts. */
  days?: number[];
  /** A bundled book to take the verse from instead of the Gita (the book the reader last opened). */
  bookId?: string;
}

/**
 * Replaces the queue with the next two weeks of daily verses (see reminderSchedule: daily for a week, then
 * tapering off, and skipping today once the reader has read). Safe to call often: it runs on
 * every app start and whenever the reader changes the switch, the time or the interface language (the
 * text is fixed when a notification is scheduled, so a language change has to re-plan the queue). When the reminder is off, or
 * the permission was taken away in Android settings, the queue is simply emptied.
 */
let queue: Promise<void> = Promise.resolve();

export function syncDailyReminder(opts: ReminderOptions): Promise<void> {
  // Run one sync at a time, so flicking the switch quickly cannot interleave cancel and schedule calls.
  // On a cold start this waits until the first screen has settled (src/lib/after-startup.ts).
  queue = queue.then(() => afterStartup()).then(() => runSync(opts)).catch(() => {
    // Scheduling failed (for example the alarm limit); the reader still has the in-app verse of the day.
  });
  return queue;
}

async function runSync(opts: ReminderOptions): Promise<void> {
  if (!remindersSupported) return;
  await Notifications.cancelAllScheduledNotificationsAsync();
  if (!opts.enabled) return;
  if ((await getReminderPermission()) !== 'granted') return;
  await ensureChannel(opts.lang);
  const now = new Date();
  const today = dayKey(now);
  const daysRead = opts.daysRead ?? [];
  const times = reminderSchedule(now, opts.hour, opts.minute, { days: opts.days, readToday: daysRead.includes(today) });
  for (const when of times) {
    const run = opts.showStreak ? streakForNotification(daysRead, today, dayKey(when)) : 0;
    const content = verseNotificationFor(when, opts.lang, run > 0 ? S.streakNotification(run)[opts.lang] : undefined, opts.bookId);
    if (!content) continue;
    await Notifications.scheduleNotificationAsync({
      content,
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: when, channelId: DAILY_CHANNEL_ID },
    });
  }
}

/** Reads the verse a tapped notification points to. */
export function verseFromResponse(
  response: Notifications.NotificationResponse | null | undefined,
): { id: string; chapter: number; verse: string } | undefined {
  const data = response?.notification.request.content.data as Record<string, unknown> | undefined;
  if (!data || typeof data.id !== 'string') return undefined;
  const chapter = Number(data.chapter);
  if (!Number.isFinite(chapter)) return undefined;
  return { id: data.id, chapter, verse: String(data.verse ?? '') };
}
