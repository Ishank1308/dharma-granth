/**
 * Scroll-linked motion: one shared scroll position, read on the UI thread by everything that moves with it
 * (a hero's artwork drifting slower than the page, a header frosting over as the title scrolls under it).
 *
 *   const { scrollY, onScroll } = useScrollY();
 *   <Animated.FlatList onScroll={onScroll} scrollEventThrottle={16} … />
 *   const style = useParallax(scrollY, 0.4);
 */
import { SectionList } from 'react-native';
import Animated, { Extrapolation, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, type SharedValue } from 'react-native-reanimated';

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
    // Turned off while the layer is on screen (light effects switched on in Settings), it goes back to rest
    // rather than staying where the last frame left it. Opacity is only ours to set when the layer fades.
    if (!enabled) {
      const rest = [{ translateY: 0 }, { scale: 1 }];
      return fadeOver > 0 ? { opacity: 1, transform: rest } : { transform: rest };
    }
    const y = Math.max(0, scrollY.value);
    const transform = [{ translateY: y * speed }, { scale: scaleBy ? interpolate(y, [0, 300], [1, 1 - scaleBy], Extrapolation.CLAMP) : 1 }];
    return fadeOver > 0 ? { opacity: interpolate(y, [0, fadeOver], [1, 0], Extrapolation.CLAMP), transform } : { transform };
  });
}

/** 0 → 1 as the page scrolls from `start` to `end`: for headers that frost over and titles that slide in. */
export function useScrollProgressStyle(scrollY: SharedValue<number>, start: number, end: number, rise = 0) {
  return useAnimatedStyle(() => {
    const p = interpolate(scrollY.value, [start, end], [0, 1], Extrapolation.CLAMP);
    return { opacity: p, transform: [{ translateY: (1 - p) * rise }] };
  });
}

/**
 * Where a LargeHeader's title passes under the compact title bar, for a window `height` tall: the header holds
 * 28% of the screen with the title near its foot. Returns the scroll range over which the two titles swap.
 */
export function titleSwap(height: number): [number, number] {
  const start = Math.max(40, Math.round(height * 0.28) - 130);
  return [start, start + 50];
}

/** The large title's side of the swap: it fades and settles back slightly as the compact title arrives. */
export function useLargeTitleStyle(scrollY: SharedValue<number> | undefined, height: number) {
  const [start, end] = titleSwap(height);
  return useAnimatedStyle(() => {
    if (!scrollY) return {};
    const p = interpolate(scrollY.value, [start, end], [0, 1], Extrapolation.CLAMP);
    return { opacity: 1 - p, transform: [{ scale: 1 - p * 0.04 }] };
  });
}

/** Animated versions of the list components that screens use, so they can take a UI-thread scroll handler. */
export const AnimatedSectionList = Animated.createAnimatedComponent(SectionList) as unknown as typeof SectionList;
