import { Image, StyleSheet, View } from 'react-native';
import Svg, { Circle, Ellipse, G, Line, Path } from 'react-native-svg';

/**
 * Line art and texture for the share cards: lotus, mandala, botanical sprig, temple arch, stars, a seal and
 * film grain. Drawn as vectors (react-native-svg) so they stay crisp at the 1080 px export, and tinted per look.
 */

const GRAIN = {
  dark: require('../../assets/textures/grain-dark.png'),
  light: require('../../assets/textures/grain-light.png'),
};

/** Film grain over the whole card: a 256 px noise tile, repeated. */
export function Grain({ tone = 'dark', opacity = 0.5 }: { tone?: 'dark' | 'light'; opacity?: number }) {
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity, overflow: 'hidden' }]}>
      <Image source={GRAIN[tone]} resizeMode="repeat" style={{ width: '100%', height: '100%' }} />
    </View>
  );
}

/** A lotus in outline, with its water line. Width-driven; height is 0.6 × width. */
export function Lotus({ width, color, strokeWidth = 1.4 }: { width: number; color: string; strokeWidth?: number }) {
  const petal = 'M50 8 C59 22 59 40 50 52 C41 40 41 22 50 8 Z';
  return (
    <Svg width={width} height={width * 0.62} viewBox="0 0 100 62">
      <G fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round">
        {[-62, -32, 32, 62].map((r) => (
          <Path key={r} d={petal} transform={`rotate(${r} 50 52)`} />
        ))}
        <Path d={petal} />
        <Path d="M22 56 C36 50 64 50 78 56" />
        <Path d="M14 60 C32 57 68 57 86 60" opacity={0.6} />
      </G>
    </Svg>
  );
}

/** A sixteen-petal mandala with a dotted ring. */
export function Mandala({ size, color, strokeWidth = 0.8 }: { size: number; color: string; strokeWidth?: number }) {
  const petal = 'M100 34 C110 48 110 62 100 76 C90 62 90 48 100 34 Z';
  const inner = 'M100 62 C106 70 106 78 100 86 C94 78 94 70 100 62 Z';
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      <G fill="none" stroke={color} strokeWidth={strokeWidth}>
        <Circle cx={100} cy={100} r={97} />
        <Circle cx={100} cy={100} r={91} opacity={0.6} />
        <Circle cx={100} cy={100} r={36} />
        <Circle cx={100} cy={100} r={12} />
        {Array.from({ length: 16 }, (_, i) => (
          <Path key={`p${i}`} d={petal} transform={`rotate(${i * 22.5} 100 100)`} />
        ))}
        {Array.from({ length: 8 }, (_, i) => (
          <Path key={`i${i}`} d={inner} transform={`rotate(${i * 45 + 22.5} 100 100)`} />
        ))}
      </G>
      <G fill={color}>
        {Array.from({ length: 48 }, (_, i) => {
          const a = (i / 48) * Math.PI * 2;
          return <Circle key={`d${i}`} cx={100 + Math.cos(a) * 84} cy={100 + Math.sin(a) * 84} r={1.1} />;
        })}
        <Circle cx={100} cy={100} r={3} />
      </G>
    </Svg>
  );
}

/** A botanical sprig: a curved stem with paired leaves, drawn from the bottom-left corner. */
export function Sprig({ size, color, flip = false, strokeWidth = 1.1 }: { size: number; color: string; flip?: boolean; strokeWidth?: number }) {
  const leaves: [number, number, number][] = [
    [30, 92, -20],
    [44, 74, 10],
    [52, 62, -40],
    [66, 48, 0],
    [74, 36, -55],
    [88, 26, -15],
    [96, 14, -60],
  ];
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120" style={flip ? { transform: [{ scaleX: -1 }, { scaleY: -1 }] } : undefined}>
      <G fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round">
        <Path d="M6 116 C34 92 62 62 108 8" />
        {leaves.map(([x, y, r], i) => (
          <G key={i} transform={`rotate(${r} ${x} ${y})`}>
            <Ellipse cx={x} cy={y - 7} rx={4.2} ry={9} />
            <Line x1={x} y1={y + 1} x2={x} y2={y - 14} opacity={0.6} />
          </G>
        ))}
        {[
          [22, 104],
          [60, 56],
          [82, 30],
        ].map(([x, y], i) => (
          <G key={`b${i}`} transform={`rotate(70 ${x} ${y})`}>
            <Ellipse cx={x} cy={y - 7} rx={4} ry={8.5} />
          </G>
        ))}
      </G>
    </Svg>
  );
}

/** Star positions from a fixed seed, as fractions of the card. */
function starField(count: number): { x: number; y: number; r: number; o: number }[] {
  let seed = 11;
  const rnd = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  return Array.from({ length: count }, () => ({ x: rnd(), y: rnd(), r: 0.5 + rnd() * 1.3, o: 0.3 + rnd() * 0.7 }));
}

/** Scattered stars, placed by a fixed seed so every export of a card is the same. */
export function Stars({ width, height, color, count = 46 }: { width: number; height: number; color: string; count?: number }) {
  const stars = starField(count).map((s) => ({ ...s, x: s.x * width, y: s.y * height }));
  return (
    <Svg pointerEvents="none" width={width} height={height} style={StyleSheet.absoluteFill}>
      {stars.map((s, i) => (
        <Circle key={i} cx={s.x} cy={s.y} r={s.r} fill={color} opacity={s.o} />
      ))}
      {/* A few four-pointed glints. */}
      {stars.slice(0, 5).map((s, i) => (
        <Path
          key={`g${i}`}
          d={`M${s.x} ${s.y - 5} L${s.x + 1} ${s.y - 1} L${s.x + 5} ${s.y} L${s.x + 1} ${s.y + 1} L${s.x} ${s.y + 5} L${s.x - 1} ${s.y + 1} L${s.x - 5} ${s.y} L${s.x - 1} ${s.y - 1} Z`}
          fill={color}
          opacity={0.8}
        />
      ))}
    </Svg>
  );
}

/** A round seal stamp, as the vermilion mark on a manuscript, with ॐ drawn as text over it by the caller. */
export function SealRing({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" style={StyleSheet.absoluteFill}>
      <Circle cx={50} cy={50} r={47} fill="none" stroke={color} strokeWidth={3} />
      <Circle cx={50} cy={50} r={40} fill="none" stroke={color} strokeWidth={1} strokeDasharray="2 3" />
    </Svg>
  );
}

/** A thin rule with a small lotus bud in the middle, for between the shloka and its meaning. */
export function BudRule({ width, color }: { width: number; color: string }) {
  return (
    <Svg width={width} height={14} viewBox={`0 0 ${width} 14`}>
      <Line x1={0} y1={7} x2={width / 2 - 12} y2={7} stroke={color} strokeWidth={0.8} />
      <Line x1={width / 2 + 12} y1={7} x2={width} y2={7} stroke={color} strokeWidth={0.8} />
      <Path d={`M${width / 2} 1 C${width / 2 + 5} 5 ${width / 2 + 5} 9 ${width / 2} 13 C${width / 2 - 5} 9 ${width / 2 - 5} 5 ${width / 2} 1 Z`} fill="none" stroke={color} strokeWidth={0.9} />
      <Circle cx={width / 2 - 9} cy={7} r={1.2} fill={color} />
      <Circle cx={width / 2 + 9} cy={7} r={1.2} fill={color} />
    </Svg>
  );
}
