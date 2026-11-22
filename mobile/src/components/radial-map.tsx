/**
 * A radial map: one thing in the middle (a character, a verse) and what it is linked to around it, joined by
 * fine threads. Used by Story mode (relationships) and the verse network (connections), after the website's
 * relationship diagram and verse graph.
 *
 * The threads are SVG; the nodes are ordinary views, so their labels follow the font size, shape Devanagari
 * properly and are real touch targets for TalkBack. When the centre changes, the nodes bloom out from it on a
 * spring and the threads fade in after them; with reduce motion they are simply there. At most eight nodes fit
 * round a phone-width card without touching (MAX_NODES); callers list the rest as text.
 *
 * The map is decoration over a list: every screen that shows one also lists the same links as text.
 */
import { useEffect, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import Svg, { Circle, Line } from 'react-native-svg';

import { hapticSelect } from '@/motion/haptics';
import { SPRING } from '@/motion/tokens';
import { useMotion } from '@/motion/use-motion';
import { usePrefs } from '@/state/app-state';
import { TYPE } from '@/theme/themes';

export interface RadialNode {
  key: string;
  label: string;
  sub?: string;
  color: string;
  selected?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
}

const NODE_W = 92;
/** How many nodes fit round the centre on a phone without touching. */
export const MAX_NODES = 8;

export function RadialMap({
  width,
  center,
  centerColor,
  nodes,
  seed,
  accessibilityLabel,
}: {
  width: number;
  /** What sits in the middle. */
  center: ReactNode;
  centerColor: string;
  nodes: RadialNode[];
  /** Changes when the centre changes, to replay the bloom. */
  seed: string;
  accessibilityLabel: string;
}) {
  const { palette } = usePrefs();
  const { animate, rich } = useMotion();
  const height = Math.round(width * 1.05);
  const cx = width / 2;
  const cy = height / 2;
  const rx = width / 2 - NODE_W / 2 - 2;
  const ry = height / 2 - 30;
  const count = Math.max(nodes.length, 1);
  // From six nodes up, start half a step off the top so no two sit side by side across the top and bottom.
  const offset = count >= 6 ? Math.PI / count : 0;

  const spots = nodes.map((_, i) => {
    const a = (i / count) * Math.PI * 2 - Math.PI / 2 + offset;
    return { x: cx + Math.cos(a) * rx, y: cy + Math.sin(a) * ry };
  });

  const bloom = useSharedValue(animate ? 0 : 1);
  const threads = useSharedValue(animate ? 0 : 1);
  useEffect(() => {
    if (!animate) {
      bloom.set(1);
      threads.set(1);
      return;
    }
    bloom.set(0);
    threads.set(0);
    bloom.set(withSpring(1, SPRING.settle));
    threads.set(withDelay(160, withTiming(1, { duration: 360 })));
  }, [seed, animate, bloom, threads]);

  // A slow breath of light round the centre, only with rich motion (it runs every frame).
  const breath = useSharedValue(0);
  useEffect(() => {
    if (!rich) {
      cancelAnimation(breath);
      breath.set(0);
      return;
    }
    breath.set(
      withRepeat(
        withSequence(withTiming(1, { duration: 2600, easing: Easing.inOut(Easing.sin) }), withTiming(0, { duration: 2600, easing: Easing.inOut(Easing.sin) })),
        -1,
      ),
    );
    return () => cancelAnimation(breath);
  }, [rich, breath]);

  const threadStyle = useAnimatedStyle(() => ({ opacity: threads.value }));
  const haloStyle = useAnimatedStyle(() => ({ opacity: 0.35 + breath.value * 0.4, transform: [{ scale: 1 + breath.value * 0.12 }] }));

  return (
    <View accessible={false} accessibilityLabel={accessibilityLabel} style={{ width, height }}>
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, threadStyle]}>
        <Svg width={width} height={height}>
          <Circle cx={cx} cy={cy} r={Math.min(rx, ry) * 0.62} stroke={palette.border} strokeDasharray="2 6" fill="none" />
          {spots.map((p, i) => (
            <Line key={nodes[i].key} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke={nodes[i].color} strokeOpacity={nodes[i].selected ? 0.9 : 0.4} strokeWidth={nodes[i].selected ? 2 : 1} />
          ))}
        </Svg>
      </Animated.View>

      <Animated.View
        pointerEvents="none"
        style={[styles.halo, { left: cx - 56, top: cy - 56, backgroundImage: `radial-gradient(circle, ${centerColor}55 0%, transparent 70%)` }, haloStyle]}
      />
      <View style={[styles.center, { left: cx - 52, top: cy - 52, borderColor: centerColor, backgroundColor: palette.dark ? 'rgba(20,14,8,0.85)' : 'rgba(255,250,240,0.92)' }]}>
        {center}
      </View>

      {nodes.map((node, i) => (
        <Node key={node.key} node={node} x={spots[i].x} y={spots[i].y} cx={cx} cy={cy} bloom={bloom} />
      ))}
    </View>
  );
}

function Node({ node, x, y, cx, cy, bloom }: { node: RadialNode; x: number; y: number; cx: number; cy: number; bloom: SharedValue<number> }) {
  const { palette } = usePrefs();
  const style = useAnimatedStyle(() => ({
    opacity: bloom.value,
    transform: [{ translateX: (cx - x) * (1 - bloom.value) }, { translateY: (cy - y) * (1 - bloom.value) }, { scale: 0.6 + bloom.value * 0.4 }],
  }));
  const body = (
    <View
      style={[
        styles.node,
        {
          borderColor: node.selected ? node.color : `${node.color}66`,
          borderWidth: node.selected ? 2 : 1,
          // Opaque, so the thread never shows through the label; the chosen node gets its colour as a wash on top.
          backgroundColor: palette.dark ? '#211810' : '#fffcf6',
        },
      ]}>
      {node.selected ? <View pointerEvents="none" style={[StyleSheet.absoluteFill, { borderRadius: 12, backgroundColor: `${node.color}${palette.dark ? '40' : '1f'}` }]} /> : null}
      <Text maxFontSizeMultiplier={1.3} numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.8} style={{ color: palette.text, fontSize: TYPE.caption, fontWeight: '700', textAlign: 'center' }}>
        {node.label}
      </Text>
      {node.sub ? (
        <Text maxFontSizeMultiplier={1.2} numberOfLines={1} style={{ color: palette.muted, fontSize: 10, textAlign: 'center' }}>
          {node.sub}
        </Text>
      ) : null}
    </View>
  );
  return (
    <Animated.View style={[styles.nodeWrap, { left: x - NODE_W / 2, top: y - 26 }, style]}>
      {node.onPress ? (
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: !!node.selected }}
          accessibilityLabel={node.accessibilityLabel ?? node.label}
          hitSlop={4}
          onPress={() => {
            hapticSelect();
            node.onPress?.();
          }}
          style={({ pressed }) => ({ opacity: pressed ? 0.75 : 1 })}>
          {body}
        </Pressable>
      ) : (
        <View accessible accessibilityLabel={node.accessibilityLabel ?? node.label}>
          {body}
        </View>
      )}
    </Animated.View>
  );
}

/** A small round tag of a link's colour, for legends and list rows. */
export function Dot({ color, size = 10 }: { color: string; size?: number }) {
  return <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color }} />;
}

const styles = StyleSheet.create({
  halo: { position: 'absolute', width: 112, height: 112, borderRadius: 56 },
  center: {
    position: 'absolute',
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  nodeWrap: { position: 'absolute', width: NODE_W },
  node: { minHeight: 48, borderRadius: 14, paddingHorizontal: 6, paddingVertical: 5, justifyContent: 'center' },
});
