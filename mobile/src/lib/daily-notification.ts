/**
 * Opt-in daily verse notification. Local notifications only: everything is scheduled on the phone by
 * Android's alarm service. There is no server, no push token and no Firebase project, so nothing about the
 * reader leaves the device.
 */
import * as Notifications from 'expo-notifications';
import { AndroidImportance } from 'expo-notifications';
import { Platform } from 'react-native';

import { dailyVerse, getEntry, loadChapter } from '@/content/catalog';
import { formatVerseRef, sanskritLines } from '@/lib/verse-format';
import { upcomingReminderTimes } from '@/lib/reminder';

export const DAILY_CHANNEL_ID = 'daily-verse';

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

async function ensureChannel() {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(DAILY_CHANNEL_ID, {
    name: 'Verse of the day · आज का श्लोक',
    description: 'One Bhagavad Gita verse a day, at the time you choose.',
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
export async function requestReminderPermission(): Promise<ReminderPermission> {
  if (!remindersSupported) return 'denied';
  await ensureChannel();
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return 'granted';
  if (!current.canAskAgain) return 'denied';
  const asked = await Notifications.requestPermissionsAsync();
  return asked.granted ? 'granted' : 'denied';
}

/** The notification text for one day: the whole shloka (never cut mid-verse) and its reference. */
export function verseNotificationFor(date: Date): Notifications.NotificationContentInput | undefined {
  const pick = dailyVerse(date);
  if (!pick) return undefined;
  const verse = loadChapter(pick.id, pick.chapter)?.verses[pick.index];
  if (!verse) return undefined;
  const lines = sanskritLines(verse.sanskrit);
  if (lines.length === 0) return undefined;
  const title = getEntry(pick.id)?.title ?? 'Bhagavad Gita';
  return {
    title: 'आज का श्लोक · Verse of the day',
    body: `${lines.join('\n')}\n${title} ${formatVerseRef(pick.id, pick.chapter, verse.number)}`,
    data: { id: pick.id, chapter: pick.chapter, verse: String(verse.number) },
  };
}

/**
 * Replaces the queue with one notification per day for the next 30 days. Safe to call often: it runs on
 * every app start and whenever the reader changes the switch or the time. When the reminder is off, or
 * the permission was taken away in Android settings, the queue is simply emptied.
 */
let queue: Promise<void> = Promise.resolve();

export function syncDailyReminder(opts: { enabled: boolean; hour: number; minute: number }): Promise<void> {
  // Run one sync at a time, so flicking the switch quickly cannot interleave cancel and schedule calls.
  queue = queue.then(() => runSync(opts)).catch(() => {
    // Scheduling failed (for example the alarm limit); the reader still has the in-app verse of the day.
  });
  return queue;
}

async function runSync(opts: { enabled: boolean; hour: number; minute: number }): Promise<void> {
  if (!remindersSupported) return;
  await Notifications.cancelAllScheduledNotificationsAsync();
  if (!opts.enabled) return;
  if ((await getReminderPermission()) !== 'granted') return;
  await ensureChannel();
  for (const when of upcomingReminderTimes(new Date(), opts.hour, opts.minute)) {
    const content = verseNotificationFor(when);
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
