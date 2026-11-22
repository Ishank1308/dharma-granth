/**
 * A line drawing for each book, in gilt, after the emblems a binder stamps on a cover: the chariot wheel of
 * Kurukshetra for the Gita, Rama's bow for the Ramayana and the Manas, the flute and peacock feather for the
 * Bhagavata, Shiva's trident, Vishnu's conch, the fish and the tortoise for their Puranas, and by family for
 * the rest (the lamp of the Upanishads, the fire altar of the Vedas, a temple for the Puranas, the lotus).
 * They sit in the arch on every cover (src/components/art/cover-face).
 *
 * `LineArt` draws strokes with a pen as they appear: each is traced from its start, one after another, over
 * about a second. With reduce motion it is simply there. The chariot wheel also turns, very slowly, in rich
 * motion.
 *
 * All strokes, no fills, on a 64 × 64 grid with round ends, so every emblem has the same weight at any size.
 */
import { useEffect } from 'react';
import Animated, { cancelAnimation, Easing, useAnimatedProps, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withTiming, type SharedValue } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { useMotion } from '@/motion/use-motion';

export type EmblemName =
  | 'wheel'
  | 'bow'
  | 'lamp'
  | 'altar'
  | 'temple'
  | 'lotus'
  | 'jewel'
  | 'bell'
  | 'leaf'
  | 'trishul'
  | 'conch'
  | 'veena'
  | 'feather'
  | 'fish'
  | 'tortoise'
  | 'kalasha'
  | 'vel'
  | 'sword'
  | 'garuda'
  | 'lingam'
  | 'yantra'
  | 'chhatra'
  | 'dhvaja'
  | 'egg'
  | 'herb'
  | 'sun';

/** A circle as a path, so it can be traced like any other stroke. */
const ring = (cx: number, cy: number, r: number) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0`;

const spokes = Array.from({ length: 8 }, (_, i) => {
  const a = (i * Math.PI) / 4;
  const [c, s] = [Math.cos(a), Math.sin(a)];
  return `M${(32 + c * 6).toFixed(2)} ${(32 + s * 6).toFixed(2)}L${(32 + c * 23).toFixed(2)} ${(32 + s * 23).toFixed(2)}`;
});

/** The sun's rays: twelve, long and short by turns. */
const rays = Array.from({ length: 12 }, (_, i) => {
  const a = (i * Math.PI) / 6;
  const [c, s] = [Math.cos(a), Math.sin(a)];
  const far = i % 2 ? 21 : 27;
  return `M${(32 + c * 15).toFixed(2)} ${(32 + s * 15).toFixed(2)}L${(32 + c * far).toFixed(2)} ${(32 + s * far).toFixed(2)}`;
}).join('');

export const EMBLEMS: Record<EmblemName, string[]> = {
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
  // Shiva's trident, with the damaru tied to its shaft.
  trishul: ['M32 24V60', 'M32 4C29 10 29 17 32 24C35 17 35 10 32 4Z', 'M16 7C13 20 21 29 32 29C43 29 51 20 48 7', 'M12 13L16 6L21 11M43 11L48 6L52 13', 'M25 39L39 47V39L25 47Z', 'M27 33H37'],
  // Vishnu's conch.
  conch: ['M42 9C52 14 55 27 48 37C41 46 27 51 9 57C15 49 15 41 17 32C19 17 31 5 42 9Z', 'M42 9C47 4 54 8 52 14', 'M29 13C38 16 46 23 51 31', 'M21 23C30 26 40 33 45 40', 'M17 35C24 37 31 41 35 46'],
  // Narada's veena, and the sung Veda's.
  veena: ['M22 44L52 14', ring(16, 49, 9), ring(42, 33, 5), 'M52 14C56 9 61 12 59 16C58 19 54 19 53 17', 'M44 16L48 20M40 20L44 24', 'M25 47L55 17'],
  // Krishna's peacock feather over his flute.
  feather: ['M32 60V30', 'M32 30C21 24 21 10 32 4C43 10 43 24 32 30Z', 'M32 25C26 21 26 14 32 10C38 14 38 21 32 25Z', ring(32, 17, 2.5), 'M32 37L24 31M32 37L40 31M32 43L23 36M32 43L41 36', 'M8 54L56 46M8 58L56 50M8 54V58M56 46V50'],
  // Matsya, the fish.
  fish: ['M8 32C18 18 38 18 46 32C38 46 18 46 8 32Z', 'M46 32L58 20C56 28 56 36 58 44Z', ring(18, 29, 1.6), 'M24 24C27 29 27 35 24 40', 'M28 21C32 15 37 16 38 22M30 43C33 48 37 47 38 42', 'M32 28C34 31 34 33 32 36M38 29C40 31 40 33 38 35'],
  // Kurma, the tortoise, on the water.
  tortoise: ['M10 40C12 22 52 22 54 40Z', 'M22 40C24 32 40 32 42 40M32 27V33M19 30L25 35M45 30L39 35', 'M54 38C58 32 63 35 61 40C60 43 56 43 54 40', 'M18 40L16 47H22V40M42 40V47H48L46 40', 'M10 40L5 44', 'M8 55C14 52 18 58 24 55C30 52 34 58 40 55C46 52 50 58 56 55'],
  // The kalasha of daily worship: a pot, mango leaves and a coconut.
  kalasha: ['M22 34C14 40 16 56 32 56C48 56 50 40 42 34', 'M24 29H40V34H24ZM21 34H43', 'M32 8C38 13 39 22 36 29H28C25 22 26 13 32 8Z', 'M26 29C18 28 13 22 14 16C20 18 25 22 27 27M38 29C46 28 51 22 50 16C44 18 39 22 37 27', 'M18 44C26 47 38 47 46 44', 'M25 56L23 60H41L39 56'],
  // Skanda's spear.
  vel: ['M32 4C41 14 41 26 32 36C23 26 23 14 32 4Z', 'M32 12V36', 'M32 36V60', 'M26 40H38M28 44H36'],
  // Kalki's sword.
  sword: ['M32 4L37 12V40H27V12Z', 'M32 12V40', 'M19 40H45M19 40C19 44 22 45 24 42M45 40C45 44 42 45 40 42', 'M32 42V54', ring(32, 57, 3)],
  // Garuda, wings spread.
  garuda: ['M29 30C21 28 12 20 8 8M29 33C19 33 9 28 3 19M29 36C21 39 11 39 5 34', 'M35 30C43 28 52 20 56 8M35 33C45 33 55 28 61 19M35 36C43 39 53 39 59 34', 'M32 26C27 30 27 40 32 46C37 40 37 30 32 26Z', ring(32, 20, 4.5), 'M36 19L41 21L36 23M29 16L32 11L35 16', 'M32 46L25 58M32 46V60M32 46L39 58'],
  // The linga on its base.
  lingam: ['M24 40V22C24 11 40 11 40 22V40', 'M10 40H54C54 50 44 54 32 54C20 54 10 50 10 40Z', 'M54 42H61', 'M28 22H36M28 26H36M28 30H36', 'M24 54V58H40V54'],
  // The yantra of the Goddess: two triangles in a circle about the bindu.
  yantra: [ring(32, 32, 26), 'M32 10L51 43H13Z', 'M32 54L13 21H51Z', ring(32, 32, 7), ring(32, 32, 1.2)],
  // Vamana's parasol.
  chhatra: ['M8 28C12 10 52 10 56 28Z', 'M8 28C10 33 16 33 18 28C20 33 26 33 28 28C30 33 34 33 36 28C38 33 44 33 46 28C48 33 54 33 56 28', 'M32 28V60', 'M32 14V9', ring(32, 6, 2.5), 'M32 14C26 18 22 23 20 28M32 14C38 18 42 23 44 28'],
  // A war banner, as flew over the chariots.
  dhvaja: ['M18 8V60', 'M18 10C28 6 36 16 50 10C44 18 44 22 50 30C36 34 28 24 18 30Z', ring(18, 5, 2.5), 'M10 60H26', ring(31, 20, 3)],
  // The cosmic egg, shell within shell.
  egg: ['M32 5C46 5 55 21 55 35C55 50 45 59 32 59C19 59 9 50 9 35C9 21 18 5 32 5Z', 'M32 15C41 15 47 25 47 35C47 45 41 51 32 51C23 51 17 45 17 35C17 25 23 15 32 15Z', 'M32 25C36 25 39 30 39 35C39 40 36 43 32 43C28 43 25 40 25 35C25 30 28 25 32 25Z', ring(32, 35, 1.4)],
  // A healing herb, for the Atharva Veda.
  herb: ['M32 60V18', 'M32 48C24 48 20 42 20 36C28 36 32 42 32 48M32 48C40 48 44 42 44 36C36 36 32 42 32 48', 'M32 34C25 34 22 29 22 24C29 24 32 29 32 34M32 34C39 34 42 29 42 24C35 24 32 29 32 34', 'M32 20C28 16 29 9 32 4C35 9 36 16 32 20Z'],
  // The sun.
  sun: [ring(32, 32, 10), ring(32, 32, 4), rays],
};

const BY_BOOK: Record<string, EmblemName> = {
  bhagavadgita: 'wheel',
  mahabharata: 'dhvaja',
  ramayana: 'bow',
  ramcharitmanas: 'bow',
  vinayapatrika: 'leaf',
  viduraniti: 'leaf',
  brahmasutra: 'leaf',
  vivekchudamani: 'jewel',
  ashtavakra: 'lamp',
  yogasutra: 'lotus',
  durgasaptashati: 'yantra',
  naradabhaktisutra: 'veena',
  shandilyabhaktisutra: 'lotus',
  // Vedas
  yajurveda: 'kalasha',
  samaveda: 'veena',
  atharvaveda: 'herb',
  // Upanishads
  ishavasya: 'sun',
  maitri: 'sun',
  katha: 'altar',
  kaivalya: 'trishul',
  shvetashvatara: 'trishul',
  mahanarayana: 'conch',
  // Puranas
  agnipuran: 'altar',
  bhagavatapurana: 'feather',
  brahmavaivartapuran: 'feather',
  harivanshpuran: 'feather',
  brahmandpuran: 'egg',
  brahmapuran: 'lotus',
  padmapuran: 'lotus',
  devibhagavat: 'yantra',
  markandeypuran: 'yantra',
  garudpurana: 'garuda',
  kalkipuran: 'sword',
  kurmapuran: 'tortoise',
  matsyapuran: 'fish',
  lingapuran: 'lingam',
  shivpurana: 'trishul',
  naradapuran: 'veena',
  skandapuran: 'vel',
  vamanpuran: 'chhatra',
  vayupuran: 'dhvaja',
  vishnupurana: 'conch',
  // Yoga and tantra
  shivasamhita: 'trishul',
  shivaswarodaya: 'trishul',
  nityakarmakriya: 'kalasha',
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
