/**
 * The day as the sun's path: an arc from the eastern horizon to the western, with the sun on it where it is
 * now for the chosen city. On today's page the sun rises along the arc to its place as the page opens, and
 * the path it has already travelled is traced in gilt; the rest of the day is a dotted line. Before sunrise
 * and after sunset the sun waits under the horizon and a few stars come out. On another day the whole arc is
 * drawn and the sun sits at noon.
 *
 * With reduce motion the sun is simply in place; with light effects there is no glow.
 */
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import Animated, { Easing, useAnimatedProps, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import Svg, { Circle, ClipPath, Defs, G, Line, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

import { useMotion } from '@/motion/use-motion';
import { usePrefs } from '@/state/app-state';
import { huesFor } from '@/theme/themes';

const W = 320;
const H = 124;
const CX = 160;
const HORIZON = 116;
const RX = 132;
const RY = 96;
/** Half an ellipse's perimeter (Ramanujan's first approximation), for tracing the travelled path. */
const ARC_LEN = Math.PI * (3 * (RX + RY) - Math.sqrt((3 * RX + RY) * (RX + 3 * RY))) / 2;
const ARC = `M${CX - RX} ${HORIZON}A${RX} ${RY} 0 0 1 ${CX + RX} ${HORIZON}`;
const STARS = [
  [46, 40],
  [92, 22],
  [140, 46],
  [208, 18],
  [252, 44],
  [286, 26],
];

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath = Animated.createAnimatedComponent(Path);

/** Minutes past midnight now, in a city `offsetHours` from UTC, kept current minute by minute. */
export function useCityMinute(offsetHours: number): number {
  const calc = () => {
    const utc = (Date.now() / 60000) % 1440;
    return (((utc + offsetHours * 60) % 1440) + 1440) % 1440;
  };
  const [minute, setMinute] = useState(calc);
  useEffect(() => {
    const timer = setInterval(() => setMinute(calc()), 60000);
    return () => clearInterval(timer);
  }, [offsetHours]); // eslint-disable-line react-hooks/exhaustive-deps
  return minute;
}

export function SkyArc({
  sunriseMinute,
  sunsetMinute,
  nowMinute,
  accessibilityLabel,
}: {
  sunriseMinute: number;
  sunsetMinute: number;
  /** Minutes past midnight in the city, or null for a day other than today. */
  nowMinute: number | null;
  accessibilityLabel: string;
}) {
  const { palette } = usePrefs();
  const { animate } = useMotion();
  const hues = huesFor(palette);
  const day = Math.max(1, sunsetMinute - sunriseMinute);
  const raw = nowMinute == null ? 0.5 : (nowMinute - sunriseMinute) / day;
  const night = nowMinute != null && (raw < 0 || raw > 1);
  const target = night ? (raw < 0 ? 0 : 1) : Math.min(1, Math.max(0, raw));

  const f = useSharedValue(animate ? 0 : target);
  useEffect(() => {
    f.set(animate ? withDelay(250, withTiming(target, { duration: 1400, easing: Easing.out(Easing.cubic) })) : target);
  }, [animate, target, f]);

  const sunProps = useAnimatedProps(() => {
    const a = Math.PI * (1 - f.get());
    // Under the horizon at night: the sun sinks a little below its end of the arc.
    return { cx: CX + RX * Math.cos(a), cy: HORIZON - RY * Math.sin(a) + (night ? 5 : 0) };
  });
  const glowProps = useAnimatedProps(() => {
    const a = Math.PI * (1 - f.get());
    return { cx: CX + RX * Math.cos(a), cy: HORIZON - RY * Math.sin(a) + (night ? 5 : 0) };
  });
  const travelled = useAnimatedProps(() => ({ strokeDashoffset: ARC_LEN * (1 - (nowMinute == null ? 1 : f.get())) }));

  const sun = hues.gold;
  const line = palette.dark ? 'rgba(255,255,255,0.22)' : 'rgba(60,40,20,0.22)';
  return (
    <View accessible accessibilityRole="image" accessibilityLabel={accessibilityLabel}>
      <View style={{ width: '100%', aspectRatio: W / H }}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`}>
        <Defs>
          <RadialGradient id="sunGlow">
            <Stop offset="0" stopColor={sun} stopOpacity={0.55} />
            <Stop offset="1" stopColor={sun} stopOpacity={0} />
          </RadialGradient>
          <ClipPath id="sky">
            <Rect x={0} y={0} width={W} height={HORIZON} />
          </ClipPath>
        </Defs>
        {night ? STARS.map(([x, y], i) => <Circle key={i} cx={x} cy={y} r={1.4} fill={palette.gold} opacity={0.7} />) : null}
        <Path d={ARC} stroke={line} strokeWidth={1.5} strokeDasharray={[2, 5]} strokeLinecap="round" fill="none" />
        <AnimatedPath d={ARC} stroke={sun} strokeWidth={2.5} strokeLinecap="round" fill="none" strokeDasharray={[ARC_LEN, ARC_LEN]} animatedProps={travelled} />
        <Line x1={8} y1={HORIZON} x2={W - 8} y2={HORIZON} stroke={line} strokeWidth={1.5} />
        {/* Clipped at the horizon, so a sun that has set reads as below it. */}
        <G clipPath="url(#sky)">
          {!palette.lite ? <AnimatedCircle r={22} fill="url(#sunGlow)" animatedProps={glowProps} /> : null}
          <AnimatedCircle r={9} fill={sun} opacity={night ? 0.6 : 1} animatedProps={sunProps} />
        </G>
      </Svg>
      </View>
    </View>
  );
}

