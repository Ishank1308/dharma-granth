/**
 * Draws the widget when Android asks for it: when it is added, resized, on the hourly update tick (so the
 * verse changes soon after midnight) and when the app requests a refresh. Runs as a headless JS task, so
 * it reads the reader's settings straight from storage instead of from React state.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { requestWidgetUpdate, type WidgetTaskHandler } from 'react-native-android-widget';
import { Platform } from 'react-native';

import { resolveLanguage } from '@/i18n/language';
import { DEFAULT_SETTINGS, normalizeSettings, type Settings } from '@/lib/backup';
import { SETTINGS_KEY } from '@/state/app-state';
import { DAILY_VERSE_WIDGET, DailyVerseWidget, dailyVerseWidgetData } from './daily-verse-widget';

async function readSettings(): Promise<Settings> {
  try {
    const raw = await AsyncStorage.getItem(SETTINGS_KEY);
    return raw ? normalizeSettings(JSON.parse(raw)) : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function render(settings: Pick<Settings, 'theme' | 'language'>, width: number, height: number) {
  const data = dailyVerseWidgetData(resolveLanguage(settings.language));
  return DailyVerseWidget({ data, theme: settings.theme, width, height });
}

export const widgetTaskHandler: WidgetTaskHandler = async ({ widgetInfo, widgetAction, renderWidget }) => {
  if (widgetInfo.widgetName !== DAILY_VERSE_WIDGET) return;
  switch (widgetAction) {
    case 'WIDGET_ADDED':
    case 'WIDGET_UPDATE':
    case 'WIDGET_RESIZED':
      renderWidget(render(await readSettings(), widgetInfo.width, widgetInfo.height));
      break;
    default:
      // WIDGET_DELETED needs no clean-up, and taps open the reader through a deep link (OPEN_URI).
      break;
  }
};

/**
 * Redraws every placed widget from inside the app, for example after the reader changes the language
 * or theme. Does nothing when no widget is on the home screen.
 */
export function refreshDailyVerseWidget(settings: Pick<Settings, 'theme' | 'language'>): Promise<void> {
  if (Platform.OS !== 'android') return Promise.resolve();
  return requestWidgetUpdate({
    widgetName: DAILY_VERSE_WIDGET,
    renderWidget: (info) => render(settings, info.width, info.height),
  }).catch(() => {
    // The widget module is missing (for example in a dev client built before this change).
  });
}
