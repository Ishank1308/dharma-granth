/**
 * A small flat moon for a tithi, drawn in the theme's colours: the website calendar's MoonPhase
 * (app/panchang/calendar/CalendarClient.tsx). Tithi 1–15 wax (lit on the right), 16–30 wane (lit on the left);
 * 15 is full and 30 new. Cheap enough for 31 cells of a month grid, where Moon3D would be too heavy.
 */
import { memo } from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

import { usePrefs } from '@/state/app-state';

export const MoonGlyph = memo(function MoonGlyph({ tithi, size = 16 }: { tithi: number; size?: number }) {
  const { palette } = usePrefs();
  const r = 7;
  const c = 8;
  const theta = (2 * Math.PI * tithi) / 30;
  const lit = (1 - Math.cos(theta)) / 2;
  const waxing = tithi < 15;
  const rx = Math.abs(1 - 2 * lit) * r;
  const outer = waxing ? 1 : 0;
  const inner = lit < 0.5 ? (waxing ? 0 : 1) : waxing ? 1 : 0;
  const path = `M${c},${c - r} A${r},${r} 0 0 ${outer} ${c},${c + r} A${rx.toFixed(3)},${r} 0 0 ${inner} ${c},${c - r} Z`;
  const dark = palette.dark ? 'rgba(255,255,255,0.10)' : 'rgba(60,40,20,0.12)';
  const light = palette.dark ? '#f4ecd8' : '#d9a441';
  const rim = palette.dark ? 'rgba(244,236,216,0.45)' : 'rgba(146,98,20,0.45)';
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" accessible={false}>
      <Circle cx={c} cy={c} r={r} fill={dark} />
      {tithi === 15 ? <Circle cx={c} cy={c} r={r} fill={light} /> : tithi !== 30 && lit > 0.02 ? <Path d={path} fill={light} /> : null}
      <Circle cx={c} cy={c} r={r} fill="none" stroke={rim} strokeWidth={0.8} />
    </Svg>
  );
});
