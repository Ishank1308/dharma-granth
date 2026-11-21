/**
 * A book you can almost pick up: the scripture's cover in its website colours, with a gilt monogram, a spine,
 * page edges and a soft shadow, drawn in 3D perspective. It tilts toward your finger as you touch it, follows the
 * phone's tilt (the rotation sensor) like a card in a wallet app, and floats gently at rest. Let go and it settles
 * back on a spring with a light haptic tick.
 *
 * Costs: the sensor and the float run only in rich motion (full effects, animations on). With light effects the
 * book still tilts under the finger; with reduce motion it is a still cover.
 */
import { useEffect } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  SensorType,
  useAnimatedReaction,
  useAnimatedSensor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { coverFill } from '@/components/ui';
import { hapticTap } from '@/motion/haptics';
import { MAX_TILT, SPRING } from '@/motion/tokens';
import { useMotion } from '@/motion/use-motion';
import { usePrefs } from '@/state/app-state';
import type { Cover } from '@/theme/covers';

import { Mandala } from './mandala';

const clamp = (v: number, lo: number, hi: number) => {
  'worklet';
  return Math.min(hi, Math.max(lo, v));
};

/** Feeds the phone's tilt into the book, relative to how the phone was held when the screen opened. */
function GyroTilt({ x, y }: { x: SharedValue<number>; y: SharedValue<number> }) {
  const sensor = useAnimatedSensor(SensorType.ROTATION, { interval: 32 });
  const base = useSharedValue<{ pitch: number; roll: number } | null>(null);
  useAnimatedReaction(
    () => sensor.sensor.value,
    (s) => {
      if (!s || (s.pitch === 0 && s.roll === 0)) return;
      if (!base.value) base.value = { pitch: s.pitch, roll: s.roll };
      const deg = 180 / Math.PI;
      const tx = clamp((s.pitch - base.value.pitch) * deg * 0.6, -MAX_TILT, MAX_TILT);
      const ty = clamp((s.roll - base.value.roll) * deg * 0.6, -MAX_TILT, MAX_TILT);
      // Low-pass, so hand tremor doesn't shake the cover.
      x.set(x.get() * 0.85 + tx * 0.15);
      y.set(y.get() * 0.85 + ty * 0.15);
      // Let the resting angle follow slowly, so after you settle in a new position the book comes back to face you.
      base.value = { pitch: base.value.pitch * 0.995 + s.pitch * 0.005, roll: base.value.roll * 0.995 + s.roll * 0.005 };
    },
  );
  return null;
}

export function Book3D({
  cover,
  letter,
  width = 128,
  label,
}: {
  cover: Cover;
  /** The monogram on the front (भ, रा, ऋ). */
  letter: string;
  width?: number;
  /** A short line under the monogram, such as the category. */
  label?: string;
}) {
  const { palette } = usePrefs();
  const { animate, rich } = useMotion();
  const height = Math.round(width * 1.42);
  const spine = Math.round(width * 0.085);
  const depth = Math.max(5, Math.round(width * 0.06));

  // Touch tilt (springs), sensor tilt (smoothed raw values) and the idle float add up.
  const touchX = useSharedValue(0);
  const touchY = useSharedValue(0);
  const gyroX = useSharedValue(0);
  const gyroY = useSharedValue(0);
  const float = useSharedValue(0);

  useEffect(() => {
    if (!rich) {
      cancelAnimation(float);
      float.value = 0;
      return;
    }
    float.value = withRepeat(withTiming(1, { duration: 3200, easing: Easing.inOut(Easing.sin) }), -1, true);
    return () => cancelAnimation(float);
  }, [rich, float]);

  const book = useAnimatedStyle(() => {
    const f = float.value * 2 - 1; // -1 … 1
    const rx = touchX.value + gyroX.value + f * 1.2;
    const ry = touchY.value + gyroY.value - 12 + f * 3; // a resting three-quarter turn shows the spine
    return {
      transform: [{ perspective: 900 }, { translateY: f * -3 }, { rotateX: `${rx}deg` }, { rotateY: `${ry}deg` }],
    };
  });

  // The light glints across the cover as it turns.
  const sheen = useAnimatedStyle(() => ({
    transform: [{ translateX: (touchY.value + gyroY.value) * -4 }, { rotate: '20deg' }],
    opacity: 0.5 + Math.abs(touchY.value + gyroY.value) / (MAX_TILT * 3),
  }));

  // The shadow slides the other way and spreads as the book lifts.
  const shadow = useAnimatedStyle(() => {
    const f = float.value;
    return {
      transform: [{ translateX: (touchY.value + gyroY.value) * 1.2 + 6 }, { scaleX: 1 - f * 0.06 }],
      opacity: 0.55 - f * 0.12,
    };
  });

  const onMove = (lx: number, ly: number) => {
    if (!animate) return;
    const nx = clamp(lx / width, 0, 1) * 2 - 1;
    const ny = clamp(ly / height, 0, 1) * 2 - 1;
    touchY.value = withSpring(nx * MAX_TILT, SPRING.press);
    touchX.value = withSpring(-ny * MAX_TILT, SPRING.press);
  };
  const onRelease = () => {
    if (!animate) return;
    touchX.value = withSpring(0, SPRING.gentle);
    touchY.value = withSpring(0, SPRING.gentle);
    hapticTap();
  };

  const [deep, , light] = cover.colors;

  return (
    <View
      style={{ width: width + depth, height: height + 22, alignItems: 'center' }}
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden
      onStartShouldSetResponder={() => animate}
      onMoveShouldSetResponder={() => animate}
      onResponderTerminationRequest={() => true}
      onResponderGrant={(e) => onMove(e.nativeEvent.locationX, e.nativeEvent.locationY)}
      onResponderMove={(e) => onMove(e.nativeEvent.locationX, e.nativeEvent.locationY)}
      onResponderRelease={onRelease}
      onResponderTerminate={onRelease}>
      {rich && Platform.OS !== 'web' ? <GyroTilt x={gyroX} y={gyroY} /> : null}
      {/* Contact shadow on the "table". */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.shadow,
          { width: width * 0.9, top: height - 4, backgroundImage: palette.lite ? undefined : 'radial-gradient(closest-side, rgba(0,0,0,0.45), transparent)' },
          palette.lite && { backgroundColor: 'rgba(0,0,0,0.12)', borderRadius: 999, height: 8, top: height + 2 },
          shadow,
        ]}
      />
      <Animated.View style={[{ width, height }, book]}>
        {/* Page block, peeking out on the open side. */}
        <View
          style={[
            styles.pages,
            {
              right: -depth + 1,
              width: width,
              borderRadius: 6,
              backgroundColor: '#f3e7cf',
              backgroundImage: palette.lite ? undefined : 'repeating-linear-gradient(0deg, #f6ecd8 0px, #f6ecd8 2px, #e2d2b2 2px, #e2d2b2 3px)',
            },
          ]}
        />
        {/* The cover. */}
        <View style={[StyleSheet.absoluteFill, styles.cover, coverFill(cover, palette)]}>
          {!palette.lite ? (
            <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundImage: `radial-gradient(70% 50% at 85% 10%, ${light} 0%, transparent 70%)`, opacity: 0.6 }]} />
          ) : null}
          <Mandala size={width * 1.1} color={cover.foil} opacity={0.28} spin={rich} style={{ position: 'absolute', left: -width * 0.05 + spine / 2, top: height / 2 - width * 0.55 }} />
          {/* Gilt frame. */}
          <View pointerEvents="none" style={[styles.frame, { borderColor: cover.foil, left: spine + 7, right: 7, top: 8, bottom: 8 }]} />
          <View style={[styles.face, { paddingLeft: spine }]}>
            <Text allowFontScaling={false} style={{ color: cover.foil, fontSize: Math.round(width * 0.36), lineHeight: Math.round(width * 0.52), textShadowColor: 'rgba(0,0,0,0.35)', textShadowRadius: 6, textShadowOffset: { width: 0, height: 1 } }}>
              {letter}
            </Text>
            {label ? (
              <Text allowFontScaling={false} numberOfLines={1} style={{ color: cover.foil, fontSize: Math.max(8, Math.round(width * 0.075)), fontWeight: '700', letterSpacing: 1.2, opacity: 0.9, textTransform: 'uppercase' }}>
                {label}
              </Text>
            ) : null}
          </View>
          {/* Spine: a darker band with a rounded highlight, and its hinge groove. */}
          <View
            style={[
              styles.spine,
              {
                width: spine,
                backgroundColor: deep,
                backgroundImage: palette.lite ? undefined : 'linear-gradient(90deg, rgba(0,0,0,0.35) 0%, rgba(255,255,255,0.18) 45%, rgba(0,0,0,0.25) 100%)',
              },
            ]}
          />
          <View style={[styles.hinge, { left: spine + 2 }]} />
          {/* Moving gloss. */}
          {!palette.lite ? (
            <Animated.View
              pointerEvents="none"
              style={[styles.sheen, { width: width * 0.5, left: width * 0.3, height: height * 1.6, top: -height * 0.3 }, sheen]}
            />
          ) : null}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: { position: 'absolute', height: 24 },
  pages: { position: 'absolute', top: 3, bottom: 3 },
  cover: {
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  frame: { position: 'absolute', borderWidth: 1, borderRadius: 4, opacity: 0.55 },
  face: { flex: 1, alignItems: 'center', justifyContent: 'center', rowGap: 2 },
  spine: { position: 'absolute', left: 0, top: 0, bottom: 0 },
  hinge: { position: 'absolute', top: 0, bottom: 0, width: 1, backgroundColor: 'rgba(0,0,0,0.22)' },
  sheen: {
    position: 'absolute',
    backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0) 100%)',
  },
});
