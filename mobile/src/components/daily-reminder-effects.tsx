import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';

import { initNotifications, remindersSupported, syncDailyReminder, verseFromResponse } from '@/lib/daily-notification';
import { useAppState } from '@/state/app-state';

const RESYNC_MS = 12 * 60 * 60 * 1000;

initNotifications();

/**
 * Keeps the daily verse queue in step with the settings, and opens the verse when a notification is tapped.
 * Renders nothing.
 */
export function DailyReminderEffects() {
  const { ready, settings, lang } = useAppState();
  const { dailyReminder, reminderHour, reminderMinute } = settings;
  const lastSync = useRef(0);
  const handled = useRef(new Set<string>());

  // Re-plan the next 30 days on start and whenever the switch, the time or the interface language changes.
  useEffect(() => {
    if (!ready || !remindersSupported) return;
    lastSync.current = Date.now();
    void syncDailyReminder({ enabled: dailyReminder, hour: reminderHour, minute: reminderMinute, lang });
  }, [ready, dailyReminder, reminderHour, reminderMinute, lang]);

  // Top the queue up when the app comes back after a long time in the background.
  useEffect(() => {
    if (!ready || !remindersSupported || !dailyReminder) return;
    const sub = AppState.addEventListener('change', (state) => {
      if (state !== 'active' || Date.now() - lastSync.current < RESYNC_MS) return;
      lastSync.current = Date.now();
      void syncDailyReminder({ enabled: dailyReminder, hour: reminderHour, minute: reminderMinute, lang });
    });
    return () => sub.remove();
  }, [ready, dailyReminder, reminderHour, reminderMinute, lang]);

  // A tap on the notification opens that day's verse, both from a cold start and while running.
  useEffect(() => {
    if (!ready || !remindersSupported) return;
    const open = (response: Notifications.NotificationResponse | null) => {
      if (!response || response.actionIdentifier !== Notifications.DEFAULT_ACTION_IDENTIFIER) return;
      const key = response.notification.request.identifier;
      const target = verseFromResponse(response);
      if (!target || handled.current.has(key)) return;
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
  }, [ready]);

  return null;
}
