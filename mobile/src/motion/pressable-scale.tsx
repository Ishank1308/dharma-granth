/**
 * A Pressable that sinks under the finger on a spring and springs back on release, like a card on glass.
 * It replaces the fixed `scale: 0.985` press styles: those snapped in one frame, this follows the finger.
 *
 * With reduce motion the card does not move; it dims slightly instead, so the press is still visible.
 */
import type { ReactNode } from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

import { hapticTap } from './haptics';
import { PRESS_SCALE, SPRING } from './tokens';
import { useMotion } from './use-motion';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface PressableScaleProps extends Omit<PressableProps, 'style' | 'children'> {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** How far to sink: 0.97 for cards, 0.92 for small round buttons. */
  scaleTo?: number;
  /** A light haptic tick on press. Off by default: most taps should be silent. */
  haptic?: boolean;
}

export function PressableScale({ children, style, scaleTo = PRESS_SCALE, haptic, onPressIn, onPressOut, onPress, ...rest }: PressableScaleProps) {
  const { animate } = useMotion();
  const pressed = useSharedValue(0);

  const animated = useAnimatedStyle(() => {
    if (!animate) return { opacity: 1 - pressed.value * 0.2 };
    return { transform: [{ scale: 1 - (1 - scaleTo) * pressed.value }] };
  });

  return (
    <AnimatedPressable
      {...rest}
      onPressIn={(e) => {
        pressed.value = animate ? withSpring(1, SPRING.press) : withTiming(1, { duration: 0 });
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        pressed.value = animate ? withSpring(0, SPRING.settle) : withTiming(0, { duration: 0 });
        onPressOut?.(e);
      }}
      onPress={(e) => {
        if (haptic) hapticTap();
        onPress?.(e);
      }}
      style={[style, animated]}>
      {children}
    </AnimatedPressable>
  );
}
