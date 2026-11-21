/**
 * The Moon as a small 3D globe in tonight's phase, for Panchang and festival pages.
 *
 * The phase is drawn the classic way, with a lit half-disc and an ellipse for the terminator; over that sit
 * maria (the dark seas), limb darkening and a lit rim, so it reads as a sphere rather than a flat icon. In rich
 * motion the surface drifts very slightly (libration) and the halo breathes; otherwise it is a still image.
 *
 * `phase` runs 0 → 1 through one lunation: 0 new moon, 0.25 first quarter, 0.5 full, 0.75 last quarter.
 * In Panchang terms, tithi n of 30 (Shukla Pratipada = 1 … Purnima = 15 … Amavasya = 30) is phase ≈ n / 30.
 */
import { useEffect } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { cancelAnimation, Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { useMotion } from '@/motion/use-motion';
import { useAppState } from '@/state/app-state';

const LIT = '#f4ecd8';
const SHADOW = '#1d2233';

/** Fraction of the disc that is lit, 0 … 1, for a phase. */
export function illumination(phase: number): number {
  return (1 - Math.cos(2 * Math.PI * phase)) / 2;
}

export function Moon3D({ phase, size = 120, style }: { phase: number; size?: number; style?: StyleProp<ViewStyle> }) {
  const { palette } = useAppState();
  const { rich } = useMotion();
  const p = ((phase % 1) + 1) % 1;
  const waxing = p < 0.5;
  // Ellipse half-width as a fraction of the radius: 1 at new and full moon, 0 at the quarters.
  const ellipse = Math.abs(Math.cos(2 * Math.PI * p));
  const gibbous = p > 0.25 && p < 0.75;
  const r = size / 2;

  const drift = useSharedValue(0);
  useEffect(() => {
    if (!rich) {
      cancelAnimation(drift);
      drift.value = 0;
      return;
    }
    drift.value = withRepeat(withTiming(1, { duration: 7000, easing: Easing.inOut(Easing.sin) }), -1, true);
    return () => cancelAnimation(drift);
  }, [rich, drift]);
  const surface = useAnimatedStyle(() => ({ transform: [{ translateX: (drift.value - 0.5) * size * 0.04 }, { rotate: `${(drift.value - 0.5) * 4}deg` }] }));
  const halo = useAnimatedStyle(() => ({ opacity: 0.55 + drift.value * 0.25, transform: [{ scale: 1 + drift.value * 0.03 }] }));

  return (
    <View
      style={[{ width: size, height: size }, style]}
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden>
      {/* Halo. */}
      {!palette.lite ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.abs,
            {
              left: -r * 0.45,
              top: -r * 0.45,
              width: size * 1.45,
              height: size * 1.45,
              borderRadius: size,
              backgroundImage: `radial-gradient(closest-side, rgba(255,236,190,${0.18 + illumination(p) * 0.32}), transparent)`,
            },
            halo,
          ]}
        />
      ) : null}
      <View style={{ width: size, height: size, borderRadius: r, overflow: 'hidden', backgroundColor: SHADOW }}>
        {/* Earthshine: the dark side is never quite black. */}
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(120,140,190,0.12)' }]} />
        {/* Lit half. */}
        <View style={[styles.abs, { top: 0, width: r, height: size, overflow: 'hidden', left: waxing ? r : 0 }]}>
          <View style={{ width: size, height: size, borderRadius: r, backgroundColor: LIT, marginLeft: waxing ? -r : 0 }} />
        </View>
        {/* Terminator ellipse: dark on a crescent, lit on a gibbous moon. */}
        <View
          style={[
            styles.abs,
            {
              top: 0,
              height: size,
              width: Math.max(1, size * ellipse),
              left: r - (size * ellipse) / 2,
              borderRadius: size,
              backgroundColor: gibbous ? LIT : SHADOW,
            },
          ]}
        />
        {/* Surface: maria, drawn soft, shared by the lit and dark parts. */}
        <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, surface]}>
          {MARIA.map((m, i) => (
            <View
              key={i}
              style={[
                styles.abs,
                {
                  left: m.x * size,
                  top: m.y * size,
                  width: m.r * size,
                  height: m.r * size * 0.85,
                  borderRadius: size,
                  // Soft-edged seas; light effects get a flat, fainter tint.
                  backgroundColor: palette.lite ? 'rgba(110,104,100,0.16)' : undefined,
                  backgroundImage: palette.lite ? undefined : 'radial-gradient(closest-side, rgba(110,100,96,0.30) 0%, rgba(110,100,96,0.14) 65%, transparent 100%)',
                },
              ]}
            />
          ))}
        </Animated.View>
        {/* Sphere shading: a highlight toward the sun, and limb darkening at the rim. */}
        {!palette.lite ? (
          <View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundImage: `radial-gradient(circle at ${waxing ? '68%' : '32%'} 38%, rgba(255,255,255,0.22) 0%, transparent 45%), radial-gradient(circle at 50% 50%, transparent 58%, rgba(0,0,0,0.42) 100%)`,
              },
            ]}
          />
        ) : null}
      </View>
      {/* Thin lit rim. */}
      <View pointerEvents="none" style={[styles.abs, { left: 0, top: 0, width: size, height: size, borderRadius: r, borderWidth: 1, borderColor: 'rgba(255,248,225,0.18)' }]} />
    </View>
  );
}

/** Rough positions of the larger maria, as seen from India, in fractions of the disc. */
const MARIA = [
  { x: 0.2, y: 0.22, r: 0.24 }, // Imbrium
  { x: 0.46, y: 0.2, r: 0.16 }, // Serenitatis
  { x: 0.56, y: 0.36, r: 0.2 }, // Tranquillitatis
  { x: 0.72, y: 0.3, r: 0.12 }, // Crisium
  { x: 0.1, y: 0.42, r: 0.3 }, // Procellarum
  { x: 0.52, y: 0.56, r: 0.14 }, // Fecunditatis
  { x: 0.3, y: 0.62, r: 0.16 }, // Nubium
];

const styles = StyleSheet.create({
  abs: { position: 'absolute' },
});
