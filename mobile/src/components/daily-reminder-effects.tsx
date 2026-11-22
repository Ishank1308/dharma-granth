import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect, useMemo, useRef } from 'react';
import { AppState } from 'react-native';

import { getEntry } from '@/content/catalog';
import { S, useI18n } from '@/i18n';
import {
  initNotifications,
  remindersSupported,
  STOP_ACTION_ID,
  syncDailyReminder,
  verseFromResponse,
  type ReminderOptions,
} from '@/lib/daily-notification';
import { useToast } from '@/motion/toast';
import { useToday } from '@/lib/use-today';
import { useAppState } from '@/state/app-state';

const RESYNC_MS = 12 * 60 * 60 * 1000;

initNotifications();

/**
 * Keeps the daily verse queue in step with the settings and the reader's own reading, and opens the verse
 * when a notification is tapped (or turns the reminder off from its "Turn off" button). Renders nothing.
 */
export function DailyReminderEffects() {
  const { ready, settings, lang, progress, lastRead, updateSettings } = useAppState();
  const { dailyReminder, reminderHour, reminderMinute, reminderBook, reminderDays, showStreak } = settings;
  const { t } = useI18n();
  const toast = useToast();
  const lastSync = useRef(0);
  const handled = useRef(new Set<string>());
  const todayKey = useToday();

  // The days read on only change when a day is added (the first verse read each day), the days are cleared
  // or restored, or the date turns over. Re-plan then, not on every verse marked: reading today drops
  // today's reminder, and the streak line follows the run.
  const daysKey = `${todayKey}|${progress.days.length}|${progress.days[progress.days.length - 1] ?? ''}`;
  const daysRead = useMemo(
    () => progress.days.slice(-400),
    [daysKey], // eslint-disable-line react-hooks/exhaustive-deps
  );

  // "The book I'm reading" follows the last book opened, as long as its text is on the phone.
  const readingId = reminderBook === 'reading' && lastRead && getEntry(lastRead.id)?.bundled ? lastRead.id : undefined;
  const daysAllowed = reminderDays.join(',');

  const opts = useMemo<ReminderOptions>(
    () => ({
      enabled: dailyReminder,
      hour: reminderHour,
      minute: reminderMinute,
      lang,
      daysRead,
      showStreak,
      days: daysAllowed.split(',').map(Number),
      bookId: readingId,
    }),
    [dailyReminder, reminderHour, reminderMinute, lang, daysRead, showStreak, daysAllowed, readingId],
  );

  // Re-plan on start and whenever a choice or the days read change.
  useEffect(() => {
    if (!ready || !remindersSupported) return;
    lastSync.current = Date.now();
    void syncDailyReminder(opts);
  }, [ready, opts]);

  // Top the queue up when the app comes back after a long time in the background.
  useEffect(() => {
    if (!ready || !remindersSupported || !opts.enabled) return;
    const sub = AppState.addEventListener('change', (state) => {
      if (state !== 'active' || Date.now() - lastSync.current < RESYNC_MS) return;
      lastSync.current = Date.now();
      void syncDailyReminder(opts);
    });
    return () => sub.remove();
  }, [ready, opts]);

  // A tap on the notification opens that day's verse, both from a cold start and while running. Its
  // "Turn off" button stops the daily verse at once and says where to turn it back on.
  useEffect(() => {
    if (!ready || !remindersSupported) return;
    const open = (response: Notifications.NotificationResponse | null) => {
      if (!response) return;
      const key = `${response.notification.request.identifier}:${response.actionIdentifier}`;
      if (handled.current.has(key)) return;
      if (response.actionIdentifier === STOP_ACTION_ID) {
        handled.current.add(key);
        Notifications.clearLastNotificationResponse();
        void Notifications.dismissNotificationAsync(response.notification.request.identifier).catch(() => {});
        updateSettings({ dailyReminder: false });
        toast.show(t(S.dailyVerseTurnedOff), { icon: 'notifications-off-outline' });
        return;
      }
      if (response.actionIdentifier !== Notifications.DEFAULT_ACTION_IDENTIFIER) return;
      const target = verseFromResponse(response);
      if (!target) return;
      handled.current.add(key);
      Notifications.clearLastNotificationResponse();
      router.push({
        pathname: '/scripture/[id]/[chapter]',
        params: { id: target.id, chapter: String(target.chapter), verse: target.verse },
      });
    };
    open(Notifications.getLastNotificationResponse());
    const sub = Notifications.addNotificationResponseReceivedListener(open);
    return () => sub.remove();
  }, [ready, updateSettings, toast, t]);

  return null;
}
