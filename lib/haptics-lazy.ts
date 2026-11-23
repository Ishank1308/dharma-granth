export type HapticPatternLazy = 'light' | 'medium' | 'heavy' | 'success' | 'malaBead' | 'celestial' | 'selection';
export type SoundEffectLazy = 'click' | 'softTap' | 'success' | 'malaBead' | 'templeChime' | 'omBowl';

/** Loads the Web Audio + vibration haptics engine on first interaction instead of on initial page parse. */
export function triggerTactileFeedbackLazy(
  pattern: HapticPatternLazy = 'light',
  sound: SoundEffectLazy = 'softTap',
): void {
  if (typeof window === 'undefined') return;
  void import('./haptics')
    .then((m) => m.triggerTactileFeedback(pattern, sound))
    .catch(() => {});
}
