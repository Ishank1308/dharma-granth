/**
 * Scroll-linked motion: one shared scroll position, read on the UI thread by everything that moves with it
 * (a hero's artwork drifting slower than the page, a header frosting over as the title scrolls under it).
 *
 *   const { scrollY, onScroll } = useScrollY();
 *   <Animated.FlatList onScroll={onScroll} scrollEventThrottle={16} … />
 *   const style = useParallax(scrollY, 0.4);
 */
import { Extrapolation, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, type SharedValue } from 'react-native-reanimated';

export function useScrollY() {
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });
  return { scrollY, onScroll };
}

/**
 * A layer that moves at `speed` of the page (0.4 = 40% slower, so it appears further away), and fades out over
 * `fadeOver` points of scroll. Off (a plain static style) when `enabled` is false.
 */
export function useParallax(scrollY: SharedValue<number>, speed: number, { enabled = true, fadeOver = 0, scaleBy = 0 } = {}) {
  return useAnimatedStyle(() => {
    if (!enabled) return {};
    const y = Math.max(0, scrollY.value);
    return {
      opacity: fadeOver > 0 ? interpolate(y, [0, fadeOver], [1, 0], Extrapolation.CLAMP) : 1,
      transform: [{ translateY: y * speed }, { scale: scaleBy ? interpolate(y, [0, 300], [1, 1 - scaleBy], Extrapolation.CLAMP) : 1 }],
    };
  });
}

/** 0 → 1 as the page scrolls from `start` to `end`: for headers that frost over and titles that slide in. */
export function useScrollProgressStyle(scrollY: SharedValue<number>, start: number, end: number, rise = 0) {
  return useAnimatedStyle(() => {
    const p = interpolate(scrollY.value, [start, end], [0, 1], Extrapolation.CLAMP);
    return { opacity: p, transform: [{ translateY: (1 - p) * rise }] };
  });
}
