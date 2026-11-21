/**
 * Content that arrives instead of popping in: it rises a few points and fades up on a spring, and the rows of
 * a list follow one another with a short stagger. Only the first STAGGER_LIMIT rows stagger, so a long list
 * never makes the reader wait, and recycled rows further down appear at once.
 *
 * Built on Reanimated's layout animations, which run on the UI thread. With reduce motion nothing moves.
 */
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeInDown, ReduceMotion } from 'react-native-reanimated';

import { DURATION, STAGGER_LIMIT } from './tokens';
import { useMotion } from './use-motion';

export function Reveal({
  children,
  index = 0,
  style,
  rise = true,
}: {
  children: ReactNode;
  /** Position in the list, for the stagger. */
  index?: number;
  style?: StyleProp<ViewStyle>;
  /** Rise as well as fade (cards); false fades only (large artwork). */
  rise?: boolean;
}) {
  const { animate } = useMotion();
  if (!animate || index >= STAGGER_LIMIT) return <Animated.View style={style}>{children}</Animated.View>;
  const delay = index * DURATION.stagger;
  const entering = rise
    ? FadeInDown.duration(DURATION.enter).delay(delay).reduceMotion(ReduceMotion.System)
    : FadeIn.duration(DURATION.enter).delay(delay).reduceMotion(ReduceMotion.System);
  return (
    <Animated.View entering={entering} style={style}>
      {children}
    </Animated.View>
  );
}
