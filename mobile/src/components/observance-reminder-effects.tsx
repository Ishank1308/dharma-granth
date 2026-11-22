import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect, useMemo, useRef } from 'react';
import { AppState } from 'react-native';

import { remindersSupported } from '@/lib/daily-notification';
import { observanceFromResponse, syncObservanceReminders, type ObservanceOptions } from '@/lib/observance-notification';
import { useToday } from '@/lib/use-today';
import { usePrefs } from '@/state/app-state';

const RESYNC_MS = 12 * 60 * 60 * 1000;

/**
 * Keeps the festival-eve and Ekadashi-eve queue in step with the two switches in Settings, rolls it forward as
 * the dates pass, and opens the matching screen when a note is tapped (Panchang for Ekadashi, the festival's
 * guide for a festival). Renders nothing.
 */
export function ObservanceReminderEffects() {
  const { ready, settings, lang } = usePrefs();
  const { festivalReminder, ekadashiReminder } = settings;
  const todayKey = useToday();
  const lastSync = useRef(0);
  const handled = useRef(new Set<string>());

  const opts = useMemo<ObservanceOptions>(
    () => ({ festivals: festivalReminder, ekadashi: ekadashiReminder, lang }),
    [festivalReminder, ekadashiReminder, lang],
  );

  // Re-plan on start, when a switch or the language changes, and when the date turns over.
  useEffect(() => {
    if (!ready || !remindersSupported) return;
    lastSync.current = Date.now();
    void syncObservanceReminders(opts);
  }, [ready, opts, todayKey]);

  // Top the queue up when the app comes back after a long time in the background.
  useEffect(() => {
    if (!ready || !remindersSupported || (!opts.festivals && !opts.ekadashi)) return;
    const sub = AppState.addEventListener('change', (state) => {
      if (state !== 'active' || Date.now() - lastSync.current < RESYNC_MS) return;
      lastSync.current = Date.now();
      void syncObservanceReminders(opts);
    });
    return () => sub.remove();
  }, [ready, opts]);

  // A tap opens the Panchang (Ekadashi) or the festival's guide, from a cold start and while running.
  useEffect(() => {
    if (!ready || !remindersSupported) return;
    const open = (response: Notifications.NotificationResponse | null) => {
      if (!response || response.actionIdentifier !== Notifications.DEFAULT_ACTION_IDENTIFIER) return;
      const target = observanceFromResponse(response);
      if (!target) return;
      const key = response.notification.request.identifier;
      if (handled.current.has(key)) return;
      handled.current.add(key);
      Notifications.clearLastNotificationResponse();
      if (target.kind === 'ekadashi') router.push('/explore/panchang');
      else if (target.festivalId) router.push({ pathname: '/explore/festivals/[id]', params: { id: target.festivalId } });
      else router.push('/explore/festivals');
    };
    open(Notifications.getLastNotificationResponse());
    const sub = Notifications.addNotificationResponseReceivedListener(open);
    return () => sub.remove();
  }, [ready]);

  return null;
}
