/**
 * How much the interface may move right now.
 *
 * - `animate` is false when Android's "Remove animations" (or the platform's reduce-motion switch) is on. Then
 *   nothing slides, floats or springs: content simply appears, as the accessibility pass (#418) promises.
 * - `rich` is the ambient layer on top: drifting artwork, the gyroscope-tilted cover, parallax and shimmer.
 *   It is off with light effects (Settings → Visual effects, or Automatic on a budget phone), because those
 *   run every frame and a budget GPU feels it. Press feedback and short entrances stay, as they cost little.
 */
import { useReducedMotion } from 'react-native-reanimated';

import { useAppState } from '@/state/app-state';

export interface Motion {
  animate: boolean;
  rich: boolean;
}

export function useMotion(): Motion {
  const reduced = useReducedMotion();
  const { lightEffects } = useAppState();
  const animate = !reduced;
  return { animate, rich: animate && !lightEffects };
}
