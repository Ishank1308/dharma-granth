/**
 * Haptic feedback for the quiz. On Android it goes through the view's own haptic feedback (Confirm,
 * Reject, a key tick), so it follows the phone's "Touch feedback" setting and feels like the system;
 * elsewhere it uses the generic notification and selection effects. Every call is fire and forget:
 * a phone without a vibrator, or the web build, just stays still.
 */
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

const run = (p: () => Promise<void>) => {
  if (Platform.OS === 'web') return;
  try {
    p().catch(() => {});
  } catch {
    // No haptics on this device.
  }
};

export const haptics = {
  /** A light tick, for picking an option or moving on. */
  tap: () =>
    run(() => (Platform.OS === 'android' ? Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Virtual_Key) : Haptics.selectionAsync())),
  correct: () =>
    run(() =>
      Platform.OS === 'android'
        ? Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Confirm)
        : Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
    ),
  wrong: () =>
    run(() =>
      Platform.OS === 'android'
        ? Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Reject)
        : Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
    ),
  /** The finish of a quiz passed: a short, distinct pattern. */
  celebrate: () => run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)),
};
