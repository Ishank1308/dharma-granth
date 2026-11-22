/**
 * Opt-in notes the evening before a festival or an Ekadashi. Local notifications only, like the daily verse
 * (src/lib/daily-notification.ts): scheduled on the phone, no server, no push token, nothing leaves the device.
 *
 * The dates are the website's own (data/festival-dates.ts and data/ekadashi-dates.ts), copied in at build
 * time by scripts/build-explore.mjs. Lunar dates differ by region and between Smarta and Vaishnava reckoning,
 * so every note asks the reader to confirm with their local panchang.
 */
import * as Notifications from 'expo-notifications';
import { AndroidImportance } from 'expo-notifications';
import { Platform } from 'react-native';

// The two small date tables only, not @/content/explore, which also pulls in the panchang and festival pages.
import { FESTIVAL_DATES } from '@/content/generated/explore/festival-dates';
import { EKADASHI_DATES } from '@/content/generated/explore/vrata-dates';
import type { Lang } from '@/i18n/language';
import { S } from '@/i18n/strings';
import { afterStartup } from '@/lib/after-startup';
import { cancelScheduled, getReminderPermission, remindersSupported } from '@/lib/daily-notification';
import {
  ekadashiObservances,
  festivalObservances,
  OBSERVANCE_ID_PREFIX,
  observanceId,
  observanceSchedule,
  type Observance,
  type ObservanceKind,
} from '@/lib/observance-reminders';

export const OBSERVANCE_CHANNEL_ID = 'observances';

export interface ObservanceOptions {
  festivals: boolean;
  ekadashi: boolean;
  /** Interface language: the text is fixed when a notification is scheduled. */
  lang: Lang;
}

async function ensureChannel(lang: Lang) {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(OBSERVANCE_CHANNEL_ID, {
    name: S.observanceChannelName[lang],
    description: S.observanceChannelDescription[lang],
    importance: AndroidImportance.DEFAULT,
    showBadge: false,
  });
}

/** The note for one date, in the interface language. */
export function observanceContent(item: Observance, lang: Lang): Notifications.NotificationContentInput {
  const name = lang === 'hi' ? item.hi : item.en;
  return item.kind === 'ekadashi'
    ? { title: S.ekadashiTomorrow[lang], body: S.ekadashiTomorrowBody(name)[lang], data: { observance: 'ekadashi' } }
    : {
        title: S.festivalTomorrow(name)[lang],
        body: S.festivalTomorrowBody[lang],
        data: item.festivalId ? { observance: 'festival', festivalId: item.festivalId } : { observance: 'festival' },
      };
}

let queue: Promise<void> = Promise.resolve();

/**
 * Replaces this feature's queue with the evenings before the next dates (at most MAX_OBSERVANCE_NOTICES in
 * all). Safe to call often: it runs on every app start, when the date turns over, when the app comes back
 * after a long time away, and when a switch or the interface language changes. With both switches off, or
 * notifications blocked in Android settings, the queue is simply emptied. The daily verse queue is untouched.
 */
export function syncObservanceReminders(opts: ObservanceOptions): Promise<void> {
  queue = queue.then(() => afterStartup()).then(() => runSync(opts)).catch(() => {
    // Scheduling failed (for example the alarm limit); the dates are still on the Panchang screen.
  });
  return queue;
}

async function runSync(opts: ObservanceOptions): Promise<void> {
  if (!remindersSupported) return;
  await cancelScheduled((id) => id.startsWith(OBSERVANCE_ID_PREFIX));
  if (!opts.festivals && !opts.ekadashi) return;
  if ((await getReminderPermission()) !== 'granted') return;
  await ensureChannel(opts.lang);
  const items = [
    ...(opts.festivals ? festivalObservances(FESTIVAL_DATES) : []),
    ...(opts.ekadashi ? ekadashiObservances(EKADASHI_DATES) : []),
  ];
  for (const { when, item } of observanceSchedule(new Date(), items)) {
    await Notifications.scheduleNotificationAsync({
      identifier: observanceId(item),
      content: observanceContent(item, opts.lang),
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: when, channelId: OBSERVANCE_CHANNEL_ID },
    });
  }
}

/** Reads what a tapped festival or Ekadashi note is about. */
export function observanceFromResponse(
  response: Notifications.NotificationResponse | null | undefined,
): { kind: ObservanceKind; festivalId?: string } | undefined {
  const data = response?.notification.request.content.data as Record<string, unknown> | undefined;
  if (data?.observance !== 'festival' && data?.observance !== 'ekadashi') return undefined;
  return { kind: data.observance, festivalId: typeof data.festivalId === 'string' ? data.festivalId : undefined };
}
