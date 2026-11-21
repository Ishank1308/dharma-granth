import { View } from 'react-native';

import { usePalette } from '@/state/app-state';

/**
 * Tonight's moon, after the website's MoonPhaseGraphic: the lit half on the right while waxing (left while
 * waning), and an ellipse across the middle that either darkens it to a crescent or fills it out to a gibbous
 * moon. Drawn with plain views, so it needs no SVG library and costs nothing on the light effects path.
 */
export function MoonPhase({ illumination, waxing, size = 64 }: { illumination: number; waxing: boolean; size?: number }) {
  const palette = usePalette();
  const p = Math.min(1, Math.max(0, illumination / 100));
  const lit = palette.dark ? '#f6e7c1' : '#f3c969';
  // Opaque, so the ellipse that darkens a crescent matches the unlit half exactly.
  const shade = palette.dark ? '#2a2a2e' : '#e4d8c6';
  const gibbous = p > 0.5;
  const squash = Math.abs(1 - 2 * p);

  return (
    <View
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        overflow: 'hidden',
        backgroundColor: shade,
        ...(palette.lite ? null : { boxShadow: `0 0 ${Math.round(size / 3)}px ${palette.dark ? 'rgba(246,231,193,0.35)' : 'rgba(217,119,6,0.30)'}` }),
      }}>
      <View style={{ position: 'absolute', top: 0, bottom: 0, width: size / 2, [waxing ? 'right' : 'left']: 0, backgroundColor: lit }} />
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: gibbous ? lit : shade,
          transform: [{ scaleX: Math.max(squash, 0.001) }],
        }}
      />
    </View>
  );
}
