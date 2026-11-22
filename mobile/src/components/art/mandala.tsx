/**
 * A gold-foil mandala drawn with plain views: concentric rings and a ring of lotus petals. It turns very slowly
 * (one revolution a minute) behind heroes and covers, which is enough to make a still page feel alive.
 *
 * No SVG or Skia: a few bordered views cost almost nothing, and with `spin` off (light effects or reduce
 * motion) it is a still drawing.
 */
import { useEffect } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { cancelAnimation, Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

export function Mandala({
  size,
  color,
  petals = 12,
  opacity = 0.35,
  spin = false,
  style,
}: {
  size: number;
  color: string;
  petals?: number;
  opacity?: number;
  spin?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const turn = useSharedValue(0);
  useEffect(() => {
    if (!spin) {
      cancelAnimation(turn);
      return;
    }
    turn.value = withRepeat(withTiming(360, { duration: 60000, easing: Easing.linear }), -1, false);
    return () => cancelAnimation(turn);
  }, [spin, turn]);
  const rotating = useAnimatedStyle(() => ({ transform: [{ rotate: `${turn.value}deg` }] }));

  const ring = (scale: number, width = 1, extra?: ViewStyle) => (
    <View
      style={[
        styles.center,
        { width: size * scale, height: size * scale, borderRadius: size, borderWidth: width, borderColor: color, marginLeft: (-size * scale) / 2, marginTop: (-size * scale) / 2 },
        extra,
      ]}
    />
  );

  const petalW = size * 0.16;
  const petalH = size * 0.34;
  return (
    <Animated.View
      pointerEvents="none"
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden
      style={[{ width: size, height: size, opacity }, style, rotating]}>
      {ring(1)}
      {ring(0.92, 1, { borderStyle: 'dashed' })}
      {ring(0.58)}
      {ring(0.24, 1.5)}
      {Array.from({ length: petals }, (_, i) => (
        <View key={i} style={[StyleSheet.absoluteFill, { transform: [{ rotate: `${(360 / petals) * i}deg` }] }]}>
          <View
            style={{
              position: 'absolute',
              left: size / 2 - petalW / 2,
              top: size * 0.12,
              width: petalW,
              height: petalH,
              borderRadius: petalW,
              borderWidth: 1,
              borderColor: color,
            }}
          />
          <View style={{ position: 'absolute', left: size / 2 - 2, top: size * 0.035, width: 4, height: 4, borderRadius: 2, backgroundColor: color }} />
        </View>
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  center: { position: 'absolute', left: '50%', top: '50%' },
});
