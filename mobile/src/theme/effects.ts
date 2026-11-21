/**
 * Which glass to draw. Blurred box shadows and gradient sheens on every card and row are the costliest
 * thing the app paints, and on budget Android GPUs they make long lists stutter. The light path keeps the
 * palette, the translucent surface and the rim, and drops the blur and gradients (see glass() in @/components/ui).
 *
 * No native module is needed: the Android version and the screen's pixel width are enough to spot an
 * entry-level phone, and the reader can always override the guess in Settings → Visual effects.
 */
import { Dimensions, PixelRatio, Platform } from 'react-native';

import type { EffectsSetting } from '@/lib/backup';

/** Android 10 (API 29) and older: phones from 2019 or earlier, or entry-level phones that never got updates. */
const OLD_ANDROID_API = 29;
/** A 720p-class panel (720 × 1600 and the like) is the clearest sign of an entry-level phone. */
const BUDGET_SCREEN_WIDTH_PX = 900;

/** A best guess, made once per launch: is this a phone where full glass will stutter? */
export function isBudgetPhone(): boolean {
  if (Platform.OS !== 'android') return false;
  const api = typeof Platform.Version === 'number' ? Platform.Version : Number(Platform.Version);
  if (Number.isFinite(api) && api <= OLD_ANDROID_API) return true;
  const { width, height } = Dimensions.get('screen');
  const shortSidePx = Math.min(width, height) * PixelRatio.get();
  return shortSidePx > 0 && shortSidePx < BUDGET_SCREEN_WIDTH_PX;
}

/** Whether to draw light effects, from the reader's setting, the phone, and the system's reduce-motion switch. */
export function resolveLightEffects(setting: EffectsSetting, budgetPhone: boolean, reduceMotion: boolean): boolean {
  if (setting === 'full') return false;
  if (setting === 'light') return true;
  return budgetPhone || reduceMotion;
}
