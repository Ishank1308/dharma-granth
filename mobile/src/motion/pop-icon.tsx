/**
 * An icon that pops when it turns on (a bookmark filling in, a heart, a check): it swells past full size and
 * springs back. Turning off is quiet. With reduce motion it simply changes.
 */
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useRef, type ComponentProps } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring } from 'react-native-reanimated';

import { SPRING } from './tokens';
import { useMotion } from './use-motion';

export function PopIcon({ on, name, size, color }: { on: boolean; name: ComponentProps<typeof Ionicons>['name']; size: number; color: string }) {
  const { animate } = useMotion();
  const scale = useSharedValue(1);
  const was = useRef(on);
  useEffect(() => {
    if (on && !was.current && animate) scale.value = withSequence(withSpring(1.35, SPRING.press), withSpring(1, SPRING.lively));
    was.current = on;
  }, [on, animate, scale]);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View style={style}>
      <Ionicons name={name} size={size} color={color} />
    </Animated.View>
  );
}
