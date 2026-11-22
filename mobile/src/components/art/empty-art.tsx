/**
 * Small gilt drawings for the places that start out empty, traced by a pen as the screen opens, each with
 * one living detail once it is drawn:
 *
 * - `saved`: an open book, and a ribbon that drops into it, for Saved verses.
 * - `journal`: a lamp whose flame breathes, for the journal.
 * - `search`: a palm-leaf page under a lens, for searches that found nothing.
 *
 * The living detail moves only in rich motion; with reduce motion the drawing is simply there.
 */
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { cancelAnimation, Easing, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { SPRING } from '@/motion/tokens';
import { useMotion } from '@/motion/use-motion';
import { usePalette } from '@/state/app-state';

import { LineArt } from './emblems';

export type EmptyArtKind = 'saved' | 'journal' | 'search';

const GRID = 96;

const DRAWN: Record<EmptyArtKind, string[]> = {
  saved: [
    'M48 30C38 24 24 22 12 24V68C24 66 38 68 48 74',
    'M48 30C58 24 72 22 84 24V68C72 66 58 68 48 74',
    'M48 30V74',
    'M20 34C27 33 34 34 40 37M20 42C27 41 34 42 40 45M20 50C27 49 34 50 40 53M56 37C62 34 69 33 76 34',
    'M10 80C30 76 66 76 86 80',
  ],
  journal: ['M22 58C26 74 70 74 74 58Z', 'M36 74L33 82H63L60 74', 'M16 86H80', 'M28 58H68'],
  search: [
    'M10 34C10 30 12 28 16 28H62C66 28 68 30 68 34V58C68 62 66 64 62 64H16C12 64 10 62 10 58Z',
    'M18 38H58M18 46H58M18 54H46',
    'M70 66A16 16 0 1 0 70.01 66',
    'M82 78L90 86',
  ],
};

/** The ribbon that drops into the book, and the lamp's flame: drawn over the traced lines, in the same grid. */
const RIBBON = 'M62 26V54L66 49L70 54V25';
const FLAME = 'M48 26C55 35 56 44 48 52C40 44 41 35 48 26Z';
const WICK = 'M48 52V58';

export function EmptyArt({ kind, size = 132 }: { kind: EmptyArtKind; size?: number }) {
  const palette = usePalette();
  const { animate, rich } = useMotion();
  const gold = palette.gold;
  const accent = palette.accent;

  // The ribbon drops in once the book is drawn; the flame lights, then breathes.
  const drop = useSharedValue(animate ? 0 : 1);
  const breathe = useSharedValue(1);
  useEffect(() => {
    if (!animate) return;
    drop.set(withDelay(900, withSpring(1, SPRING.lively)));
  }, [animate, drop]);
  useEffect(() => {
    if (!rich || kind !== 'journal') return;
    breathe.set(
      withDelay(
        1200,
        withRepeat(withSequence(withTiming(1.08, { duration: 900, easing: Easing.inOut(Easing.sin) }), withTiming(0.96, { duration: 1100, easing: Easing.inOut(Easing.sin) })), -1, true),
      ),
    );
    return () => cancelAnimation(breathe);
  }, [rich, kind, breathe]);

  const ribbonStyle = useAnimatedStyle(() => ({ opacity: Math.min(1, drop.get() * 2), transform: [{ translateY: (1 - drop.get()) * -18 }] }));
  const flameStyle = useAnimatedStyle(() => ({
    opacity: Math.min(1, drop.get() * 2),
    transform: [{ translateY: (size * 52) / GRID }, { scaleY: drop.get() * breathe.get() }, { scaleX: 0.9 + 0.1 * breathe.get() }, { translateY: (-size * 52) / GRID }],
  }));

  const glow = palette.dark ? 'rgba(229,193,88,0.22)' : 'rgba(198,146,52,0.2)';
  return (
    <View
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden
      style={[
        { width: size, height: size },
        palette.lite ? null : { backgroundImage: `radial-gradient(circle at 50% 55%, ${glow} 0%, transparent 68%)` },
      ]}>
      <LineArt paths={DRAWN[kind]} grid={GRID} size={size} color={gold} strokeWidth={2} />
      {kind === 'saved' ? (
        <Animated.View style={[StyleSheet.absoluteFill, ribbonStyle]}>
          <Svg width={size} height={size} viewBox={`0 0 ${GRID} ${GRID}`}>
            <Path d={RIBBON} stroke={accent} strokeWidth={2.4} strokeLinejoin="round" fill={accent} fillOpacity={0.85} />
          </Svg>
        </Animated.View>
      ) : null}
      {kind === 'journal' ? (
        <>
          <Svg width={size} height={size} viewBox={`0 0 ${GRID} ${GRID}`} style={StyleSheet.absoluteFill}>
            <Path d={WICK} stroke={gold} strokeWidth={2} strokeLinecap="round" />
          </Svg>
          <Animated.View style={[StyleSheet.absoluteFill, flameStyle]}>
            <Svg width={size} height={size} viewBox={`0 0 ${GRID} ${GRID}`}>
              <Path d={FLAME} fill={accent} fillOpacity={0.9} />
              <Path d="M48 36C51 41 51 45 48 49C45 45 45 41 48 36Z" fill={palette.dark ? '#ffe7a3' : '#fde68a'} />
            </Svg>
          </Animated.View>
        </>
      ) : null}
    </View>
  );
}
