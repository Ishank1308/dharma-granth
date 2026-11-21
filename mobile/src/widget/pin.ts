import { requestPinWidget } from 'react-native-android-widget';
import { Platform } from 'react-native';

import { DAILY_VERSE_WIDGET } from './daily-verse-widget';

/**
 * Asks the launcher to place the widget (Android 8+ launchers that support pinning show their own
 * confirm sheet). Resolves false when pinning is not supported, so the caller can explain the manual way.
 */
export async function addWidgetToHomeScreen(): Promise<boolean> {
  if (Platform.OS !== 'android') return false;
  try {
    return await requestPinWidget({ widgetName: DAILY_VERSE_WIDGET });
  } catch {
    return false;
  }
}
