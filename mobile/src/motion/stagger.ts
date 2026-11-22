/**
 * Rows and cards rising into place one after another when a screen first opens, so a list arrives as a
 * sequence rather than a block. Only the first few rise, only in the first moment after the screen opens
 * (rows that scroll into view later are simply there), and nothing moves with reduce motion.
 *
 *   const stagger = useStagger();
 *   <Animated.View entering={stagger(index)}>…</Animated.View>
 *
 * The rise runs on the UI thread as a layout animation, so it costs the JS thread nothing.
 */
import { useEffect, useState } from 'react';
import { withDelay, withSpring, withTiming, type EntryAnimationsValues, type LayoutAnimation } from 'react-native-reanimated';

import { DURATION, SPRING, STAGGER } from './tokens';
import { useMotion } from './use-motion';

type Entering = (values: EntryAnimationsValues) => LayoutAnimation;

function rise(delay: number): Entering {
  return () => {
    'worklet';
    return {
      initialValues: { opacity: 0, transform: [{ translateY: STAGGER.rise }] },
      animations: {
        opacity: withDelay(delay, withTiming(1, { duration: DURATION.enter })),
        transform: [{ translateY: withDelay(delay, withSpring(0, SPRING.settle)) }],
      },
    };
  };
}

// Built once: a layout animation is a worklet, and the same few delays serve every list.
const RISES: Entering[] = Array.from({ length: STAGGER.max }, (_, i) => rise(i * STAGGER.step));

/** How long after a screen opens its rows still rise in. */
const WINDOW_MS = 900;

export function useStagger(max: number = STAGGER.max): (index: number) => Entering | undefined {
  const { animate } = useMotion();
  const [fresh, setFresh] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setFresh(false), WINDOW_MS);
    return () => clearTimeout(timer);
  }, []);
  return (index: number) => (animate && fresh && index >= 0 && index < Math.min(max, STAGGER.max) ? RISES[index] : undefined);
}
