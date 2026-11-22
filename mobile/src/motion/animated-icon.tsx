/**
 * Icons that act out what they mean, once, when they turn on or are pressed:
 *
 *   hop     the house gives a small hop and lands with a squash (Home)
 *   flip    the book turns over like a page (Library)
 *   drop    the ribbon drops into place (Saved)
 *   spin    the compass needle swings round and settles (Explore)
 *   turn    the gear turns a quarter (Settings)
 *   wiggle  the lens looks left and right (Search)
 *   nudge   an arrow leans the way it points (card actions)
 *   breathe the flame swells twice (a live streak)
 *
 * Outline and filled glyphs cross-fade, so a tab's icon fills in as the motion plays rather than swapping.
 * Each motion is a short spring sequence on the UI thread, played only on the change, never looping, and
 * with reduce motion the glyph simply changes.
 */
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useRef, type ComponentProps } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { SPRING } from './tokens';
import { useMotion } from './use-motion';

type IconName = ComponentProps<typeof Ionicons>['name'];
export type IconMotion = 'hop' | 'flip' | 'drop' | 'spin' | 'turn' | 'wiggle' | 'nudge' | 'breathe' | 'pop';

/** Starts `motion` on the shared values; split out so a pressable can play it from a press handler. */
export function playIconMotion(motion: IconMotion, v: { y: SharedValue<number>; r: SharedValue<number>; s: SharedValue<number>; sy: SharedValue<number>; ry: SharedValue<number>; x: SharedValue<number> }) {
  switch (motion) {
    case 'hop':
      v.y.value = withSequence(withTiming(-6, { duration: 140, easing: Easing.out(Easing.quad) }), withSpring(0, SPRING.lively));
      v.sy.value = withSequence(withTiming(1.06, { duration: 140 }), withTiming(0.88, { duration: 90 }), withSpring(1, SPRING.lively));
      break;
    case 'flip':
      v.ry.value = 0;
      v.ry.value = withSequence(withTiming(360, { duration: 520, easing: Easing.out(Easing.cubic) }), withTiming(0, { duration: 0 }));
      break;
    case 'drop':
      v.y.value = -10;
      v.y.value = withSpring(0, SPRING.lively);
      v.sy.value = withSequence(withTiming(1.15, { duration: 120 }), withSpring(1, SPRING.lively));
      break;
    case 'spin':
      v.r.value = 0;
      v.r.value = withSequence(withTiming(400, { duration: 560, easing: Easing.out(Easing.cubic) }), withSpring(360, SPRING.lively), withTiming(0, { duration: 0 }));
      break;
    case 'turn':
      v.r.value = withSpring((Math.round(v.r.value / 90) + 1) * 90, SPRING.settle);
      break;
    case 'wiggle':
      v.r.value = withSequence(
        withTiming(-14, { duration: 80 }),
        withTiming(12, { duration: 100 }),
        withTiming(-6, { duration: 90 }),
        withSpring(0, SPRING.lively),
      );
      break;
    case 'nudge':
      v.x.value = withSequence(withTiming(5, { duration: 120, easing: Easing.out(Easing.quad) }), withSpring(0, SPRING.lively));
      break;
    case 'breathe':
      v.s.value = withSequence(withTiming(1.16, { duration: 260 }), withTiming(1, { duration: 260 }), withTiming(1.12, { duration: 240 }), withSpring(1, SPRING.settle));
      break;
    case 'pop':
      v.s.value = withSequence(withSpring(1.3, SPRING.press), withSpring(1, SPRING.lively));
      break;
  }
}

export function useIconMotion() {
  const y = useSharedValue(0);
  const r = useSharedValue(0);
  const s = useSharedValue(1);
  const sy = useSharedValue(1);
  const ry = useSharedValue(0);
  const x = useSharedValue(0);
  const values = { y, r, s, sy, ry, x };
  const style = useAnimatedStyle(() => ({
    transform: [
      { perspective: 300 },
      { translateX: x.value },
      { translateY: y.value },
      { rotate: `${r.value}deg` },
      { rotateY: `${ry.value}deg` },
      { scale: s.value },
      { scaleY: sy.value },
    ],
  }));
  return { values, style };
}

export interface AnimatedIconProps {
  name: IconName;
  /** The glyph when on (filled); cross-fades in over `name`. */
  activeName?: IconName;
  active?: boolean;
  size: number;
  color: string;
  activeColor?: string;
  motion: IconMotion;
  /** Play when this changes to a truthy value (a tab becoming current, a press count). Defaults to `active`. */
  trigger?: unknown;
}

export function AnimatedIcon({ name, activeName, active = false, size, color, activeColor, motion, trigger }: AnimatedIconProps) {
  const { animate } = useMotion();
  const { values, style } = useIconMotion();
  const fill = useSharedValue(active ? 1 : 0);
  const key = trigger === undefined ? active : trigger;
  const was = useRef(key);

  useEffect(() => {
    if (key && key !== was.current && animate) playIconMotion(motion, values);
    was.current = key;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, animate, motion]);

  useEffect(() => {
    fill.value = animate ? withTiming(active ? 1 : 0, { duration: 220 }) : active ? 1 : 0;
  }, [active, animate, fill]);

  const onStyle = useAnimatedStyle(() => ({ opacity: fill.value }));
  const offStyle = useAnimatedStyle(() => ({ opacity: 1 - fill.value }));

  if (!activeName) {
    return (
      <Animated.View style={style}>
        <Ionicons name={name} size={size} color={active && activeColor ? activeColor : color} />
      </Animated.View>
    );
  }
  return (
    <Animated.View style={[{ width: size, height: size }, style]}>
      <Animated.View style={[StyleSheet.absoluteFill, offStyle]}>
        <Ionicons name={name} size={size} color={color} />
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, onStyle]}>
        <Ionicons name={activeName} size={size} color={activeColor ?? color} />
      </Animated.View>
      <View style={{ width: size, height: size }} />
    </Animated.View>
  );
}
