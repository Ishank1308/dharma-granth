import { useEffect } from 'react';
import { AppState } from 'react-native';

import { useAppState } from '@/state/app-state';
import { refreshDailyVerseWidget } from '@/widget/task-handler';

/**
 * Keeps the home-screen widget in step with the app: redraws it when the language or theme changes and
 * whenever the app comes to the front (which also catches a new day). Renders nothing.
 */
export function DailyWidgetEffects() {
  const { ready, settings } = useAppState();
  const { theme, language } = settings;

  useEffect(() => {
    if (!ready) return;
    void refreshDailyVerseWidget({ theme, language });
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') void refreshDailyVerseWidget({ theme, language });
    });
    return () => sub.remove();
  }, [ready, theme, language]);

  return null;
}
