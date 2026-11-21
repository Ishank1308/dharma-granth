/**
 * Haptic ticks, used sparingly: switching tabs, picking a chip, saving a verse, letting go of the cover.
 *
 * On Android these go through View.performHapticFeedback (expo-haptics' performAndroidHapticsAsync), which
 * follows the phone's own "Touch feedback" switch and needs no VIBRATE permission; app.json blocks that
 * permission so the Play listing's permissions stay as they were. Failures are silent: a phone without a
 * vibration motor simply stays still.
 */
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

function run(android: Haptics.AndroidHaptics, ios: () => Promise<void>) {
  if (Platform.OS === 'android') {
    Haptics.performAndroidHapticsAsync(android).catch(() => {});
  } else if (Platform.OS === 'ios') {
    ios().catch(() => {});
  }
}

/** Moving between choices: tabs, chips, a slider's steps. */
export function hapticSelect() {
  run(Haptics.AndroidHaptics.Segment_Tick, () => Haptics.selectionAsync());
}

/** A light tap: a card pressed, a cover settling. */
export function hapticTap() {
  run(Haptics.AndroidHaptics.Virtual_Key, () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
}

/** Something turned on or saved (a bookmark). */
export function hapticOn() {
  run(Haptics.AndroidHaptics.Toggle_On, () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium));
}

/** Something turned off or removed. */
export function hapticOff() {
  run(Haptics.AndroidHaptics.Toggle_Off, () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft));
}
