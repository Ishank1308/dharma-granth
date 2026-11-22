/**
 * Swipe a card to the left to remove it, as in Mail and One UI lists: the card follows your finger over a red
 * well with a bin that grows as you pull; past the line it ticks, and letting go there sends the card off the
 * edge and removes it (the caller shows Undo). Short of the line it springs back.
 *
 * The card keeps its own Remove button, so TalkBack and anyone who doesn't swipe can do the same.
 */
import Ionicons from '@expo/vector-icons/Ionicons';
import type { ReactNode } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { GestureDetector, usePanGesture } from 'react-native-gesture-handler';
import Animated, { Easing, Extrapolation, interpolate, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { hapticSelect } from './haptics';
import { DURATION, SPRING } from './tokens';
import { useMotion } from './use-motion';

const REMOVE_AT = 110;

export function SwipeToRemove({
  children,
  onRemove,
  label,
  radius,
  style,
}: {
  children: ReactNode;
  onRemove: () => void;
  /** The word in the red well ("Remove"). */
  label: string;
  radius: number;
  style?: StyleProp<ViewStyle>;
}) {
  const { animate } = useMotion();
  const x = useSharedValue(0);
  const width = useSharedValue(400);
  const armed = useSharedValue(0);

  const pan = usePanGesture({
    activeOffsetX: [-18, 18],
    failOffsetY: [-12, 12],
    onUpdate: (e) => {
      'worklet';
      // Left follows the finger; right only gives a little.
      const v = e.translationX < 0 ? e.translationX : e.translationX * 0.12;
      x.set(v);
      const past = -v > REMOVE_AT ? 1 : 0;
      if (past !== armed.get()) {
        armed.set(past);
        if (past) scheduleOnRN(hapticSelect);
      }
    },
    onDeactivate: (e) => {
      'worklet';
      armed.set(0);
      if (-x.get() > REMOVE_AT || (e.velocityX < -1000 && -x.get() > 40)) {
        x.set(
          withTiming(-width.get() - 40, { duration: DURATION.quick, easing: Easing.in(Easing.quad) }, (done) => {
            if (done) scheduleOnRN(onRemove);
          }),
        );
      } else {
        x.set(animate ? withSpring(0, SPRING.settle) : 0);
      }
    },
  });

  const card = useAnimatedStyle(() => ({ transform: [{ translateX: x.get() }] }));
  // The red well opens only as wide as the card has moved, so it never shows through a glass card.
  const well = useAnimatedStyle(() => ({ width: Math.max(0, -x.get()), opacity: interpolate(-x.get(), [0, 12], [0, 1], Extrapolation.CLAMP) }));
  const bin = useAnimatedStyle(() => {
    const p = interpolate(-x.get(), [24, REMOVE_AT], [0, 1], Extrapolation.CLAMP);
    return { opacity: p, transform: [{ scale: 0.6 + p * 0.4 + (-x.get() > REMOVE_AT ? 0.12 : 0) }] };
  });

  return (
    <View style={style} onLayout={(e) => width.set(e.nativeEvent.layout.width)}>
      <Animated.View pointerEvents="none" style={[styles.well, { borderTopRightRadius: radius, borderBottomRightRadius: radius }, well]}>
        <Animated.View style={[styles.binWrap, bin]}>
          <Ionicons name="trash" size={22} color="#ffffff" />
          <Text maxFontSizeMultiplier={1.3} style={styles.label}>
            {label}
          </Text>
        </Animated.View>
      </Animated.View>
      <GestureDetector gesture={pan}>
        <Animated.View style={card}>{children}</Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  well: { position: 'absolute', top: 0, bottom: 0, right: 0, overflow: 'hidden', backgroundColor: '#c62828', alignItems: 'flex-end', justifyContent: 'center', paddingRight: 28 },
  binWrap: { alignItems: 'center', rowGap: 2 },
  label: { color: '#ffffff', fontSize: 12, fontWeight: '700' },
});
