/**
 * A line drawing for each book, in gilt, after the emblems a printer would set on a title page: the chariot
 * wheel of Kurukshetra for the Gita and the Mahabharata, Rama's bow for the Ramayana and the Manas, the lamp
 * of the Upanishads, the fire altar of the Vedas, a temple for the Puranas, the lotus for yoga, the crest
 * jewel for the Vivekachudamani, and so on by family.
 *
 * Drawn with a pen when it first appears: each stroke is traced from its start, one after another, over about
 * a second. With reduce motion it is simply there. The chariot wheel also turns, very slowly, in rich motion.
 *
 * All strokes, no fills, on a 64 × 64 grid with round ends, so every emblem has the same weight at any size.
 */
import { useEffect } from 'react';
import Animated, { cancelAnimation, Easing, useAnimatedProps, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withTiming, type SharedValue } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { useMotion } from '@/motion/use-motion';

export type EmblemName = 'wheel' | 'bow' | 'lamp' | 'altar' | 'temple' | 'lotus' | 'jewel' | 'bell' | 'leaf';

/** A circle as a path, so it can be traced like any other stroke. */
const ring = (cx: number, cy: number, r: number) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0`;

const spokes = Array.from({ length: 8 }, (_, i) => {
  const a = (i * Math.PI) / 4;
  const [c, s] = [Math.cos(a), Math.sin(a)];
  return `M${(32 + c * 6).toFixed(2)} ${(32 + s * 6).toFixed(2)}L${(32 + c * 23).toFixed(2)} ${(32 + s * 23).toFixed(2)}`;
});

const EMBLEMS: Record<EmblemName, string[]> = {
  // The chariot wheel: rim, hub and eight spokes.
  wheel: [ring(32, 32, 26), ring(32, 32, 23), ring(32, 32, 6), ...spokes],
  // The bow, strung, with an arrow nocked.
  bow: ['M20 6C44 18 44 46 20 58', 'M20 6L20 58', 'M8 32L56 32', 'M50 26L56 32L50 38', 'M8 32L13 27M8 32L13 37M12 32L17 27M12 32L17 37'],
  // The clay lamp (diya) with its flame.
  lamp: ['M12 40C16 52 48 52 52 40Z', 'M24 52L22 57H42L40 52', 'M32 12C38 20 38 28 32 33C26 28 26 20 32 12Z', 'M32 22C34 25 34 28 32 30'],
  // The fire altar: three stepped courses and the flames over them.
  altar: ['M10 56H54', 'M14 56V48H50V56', 'M19 48V41H45V48', 'M32 10C38 18 40 24 36 32C35 27 33 26 32 24C31 28 28 30 28 34C24 26 27 18 32 10Z', 'M22 41C20 36 22 32 25 30', 'M42 41C44 36 42 32 39 30'],
  // A temple: plinth, shrine, the rising shikhara and its finial.
  temple: ['M8 58H56', 'M14 58V40H50V58', 'M27 58V48C27 44 37 44 37 48V58', 'M18 40C20 26 26 16 32 12C38 16 44 26 46 40', 'M32 12V6', 'M29 6H35', 'M24 30H40'],
  // The lotus: five petals on the water line.
  lotus: ['M32 14C38 22 38 36 32 46C26 36 26 22 32 14Z', 'M32 46C28 36 20 28 12 26C12 36 20 44 32 46Z', 'M32 46C36 36 44 28 52 26C52 36 44 44 32 46Z', 'M32 46C24 44 14 42 6 44C12 50 24 50 32 46Z', 'M32 46C40 44 50 42 58 44C52 50 40 50 32 46Z', 'M14 54H50'],
  // The crest jewel, faceted.
  jewel: ['M18 24L26 12H38L46 24L32 54Z', 'M18 24H46', 'M26 12L28 24L32 54L36 24L38 12', 'M32 6V2M44 9L47 6M20 9L17 6'],
  // The temple bell, for hymns.
  bell: ['M20 46C20 28 24 18 32 18C40 18 44 28 44 46Z', 'M16 46H48', 'M32 46V52', ring(32, 54, 3), 'M32 18V12', ring(32, 9, 3)],
  // A palm-leaf manuscript, tied, for the law books and teachings.
  leaf: ['M8 24C8 20 10 18 14 18H50C54 18 56 20 56 24V40C56 44 54 46 50 46H14C10 46 8 44 8 40Z', 'M16 26H48M16 32H48M16 38H40', ring(24, 32, 2), 'M24 34C22 44 20 50 16 56', 'M24 34C26 44 30 50 34 56'],
};

const BY_BOOK: Record<string, EmblemName> = {
  bhagavadgita: 'wheel',
  mahabharata: 'wheel',
  ramayana: 'bow',
  ramcharitmanas: 'bow',
  vinayapatrika: 'bow',
  vivekchudamani: 'jewel',
  yogasutra: 'lotus',
  naradabhaktisutra: 'lotus',
  shandilyabhaktisutra: 'lotus',
};
const BY_CATEGORY: Record<string, EmblemName> = {
  veda: 'altar',
  upanishad: 'lamp',
  itihasa: 'bow',
  purana: 'temple',
  smriti: 'leaf',
  stotra: 'bell',
  tantra: 'lotus',
  other: 'lotus',
};

export function emblemFor(id: string, category: string): EmblemName {
  return BY_BOOK[id] ?? BY_CATEGORY[category] ?? 'lotus';
}

const AnimatedPath = Animated.createAnimatedComponent(Path);
/** Longer than any stroke on the grid, so one dash covers a whole stroke and the gap hides it. */
const DASH = 180;

function Stroke({ d, color, width, dash, draw }: { d: string; color: string; width: number; dash: number; draw: SharedValue<number> }) {
  const props = useAnimatedProps(() => ({ strokeDashoffset: dash * (1 - draw.get()) }));
  return (
    <AnimatedPath
      d={d}
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      strokeDasharray={[dash, dash]}
      animatedProps={props}
    />
  );
}

/**
 * Strokes traced by a pen as they appear, on a square grid `grid` units wide. The building block of the
 * emblems and of the empty-state drawings (src/components/art/empty-art).
 */
export function LineArt({
  paths,
  grid = 64,
  size = 64,
  color,
  strokeWidth = 1.6,
  delay = 0,
}: {
  paths: string[];
  grid?: number;
  size?: number;
  color: string;
  strokeWidth?: number;
  /** When the pen starts, in ms after the drawing appears. */
  delay?: number;
}) {
  const { animate } = useMotion();
  // One clock per stroke (the fourth and later strokes share the last), so they are traced one after another.
  const d0 = useSharedValue(animate ? 0 : 1);
  const d1 = useSharedValue(animate ? 0 : 1);
  const d2 = useSharedValue(animate ? 0 : 1);
  const d3 = useSharedValue(animate ? 0 : 1);
  const clocks = [d0, d1, d2, d3];

  useEffect(() => {
    if (!animate) return;
    [d0, d1, d2, d3].forEach((c, i) =>
      c.set(withDelay(delay + i * 180, withTiming(1, { duration: 760, easing: Easing.inOut(Easing.cubic) }))),
    );
  }, [animate, delay, d0, d1, d2, d3]);

  const dash = DASH * (grid / 64);
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${grid} ${grid}`}>
      {paths.map((d, i) => (
        <Stroke key={i} d={d} color={color} width={strokeWidth} dash={dash} draw={clocks[Math.min(i, clocks.length - 1)]} />
      ))}
    </Svg>
  );
}

export function Emblem({
  name,
  size = 64,
  color,
  strokeWidth = 1.6,
  delay = 0,
  turn,
}: {
  name: EmblemName;
  size?: number;
  color: string;
  strokeWidth?: number;
  delay?: number;
  /** Let the wheel turn slowly (rich motion only). */
  turn?: boolean;
}) {
  const { rich } = useMotion();
  const spin = useSharedValue(0);
  const spins = !!turn && rich && name === 'wheel';
  useEffect(() => {
    if (!spins) return;
    spin.set(withRepeat(withTiming(360, { duration: 90000, easing: Easing.linear }), -1, false));
    return () => cancelAnimation(spin);
  }, [spins, spin]);
  const spinStyle = useAnimatedStyle(() => (spins ? { transform: [{ rotate: `${spin.get()}deg` }] } : {}));

  return (
    <Animated.View style={[{ width: size, height: size }, spinStyle]} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <LineArt paths={EMBLEMS[name]} size={size} color={color} strokeWidth={strokeWidth} delay={delay} />
    </Animated.View>
  );
}
