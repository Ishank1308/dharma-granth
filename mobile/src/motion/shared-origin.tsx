/**
 * A piece of one screen flying to its place on the next: a book's cover from the shelf onto its title page,
 * a chapter's numeral from the list into the reader. The screen behind it cross-fades (src/app/_layout), so
 * the eye follows the piece rather than a sliding page.
 *
 * The tapped piece records where it is on screen (useOriginPress); the next screen's FlyIn reads that once
 * and springs its child from there, at that size, to where it is laid out. With nothing recorded, or with
 * reduce motion, FlyIn draws its child in place and does nothing else.
 *
 *   const { ref, press } = useOriginPress(`book:${id}`);
 *   <PressableScale ref={ref} onPress={() => press(() => router.push(…, { via: 'cover' }))} />
 *   …
 *   <FlyIn from={`book:${id}`}><Book3D … /></FlyIn>
 */
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { type HostInstance, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { SPRING } from './tokens';
import { useMotion } from './use-motion';

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

const origins = new Map<string, { rect: Rect; at: number }>();
/** A record older than this belongs to some earlier tap (a deep link, Back and forth) and is ignored. */
const FRESH_MS = 1500;

function peekOrigin(key: string): Rect | undefined {
  const o = origins.get(key);
  if (!o) return undefined;
  if (Date.now() - o.at > FRESH_MS) {
    origins.delete(key);
    return undefined;
  }
  return o.rect;
}

/** Measure the tapped piece, then run `go` (the navigation). Measuring takes a frame at most. */
export function useOriginPress(key: string) {
  const ref = useRef<HostInstance>(null);
  const { animate } = useMotion();
  const press = (go: () => void) => {
    const node = ref.current;
    if (!animate || !node) {
      go();
      return;
    }
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      go();
    };
    node.measureInWindow((x, y, width, height) => {
      if (width > 0) origins.set(key, { rect: { x, y, width, height }, at: Date.now() });
      finish();
    });
    // Never hold the tap hostage to a measurement that doesn't come back.
    setTimeout(finish, 60);
  };
  return { ref, press };
}

export function FlyIn({ from, children, style }: { from?: string; children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const { animate } = useMotion();
  // Read once, on the first render, so a re-render mid-flight doesn't start it again.
  const [origin] = useState(() => (animate && from ? peekOrigin(from) : undefined));
  useEffect(() => {
    if (from) origins.delete(from);
  }, [from]);

  const ref = useRef<HostInstance>(null);
  const progress = useSharedValue(origin ? 0 : 1);
  const placed = useSharedValue(!origin);
  const dx = useSharedValue(0);
  const dy = useSharedValue(0);
  const scale = useSharedValue(1);
  const started = useRef(false);

  const style2 = useAnimatedStyle(() => {
    if (!placed.get()) return { opacity: 0 };
    const p = progress.get();
    return {
      opacity: 1,
      transform: [{ translateX: dx.get() * (1 - p) }, { translateY: dy.get() * (1 - p) }, { scale: scale.get() + (1 - scale.get()) * p }],
    };
  });

  return (
    <Animated.View
      ref={ref}
      collapsable={false}
      style={[style, style2]}
      onLayout={() => {
        if (!origin || started.current) return;
        started.current = true;
        ref.current?.measureInWindow((x, y, width, height) => {
          if (width > 0) {
            dx.set(origin.x + origin.width / 2 - (x + width / 2));
            dy.set(origin.y + origin.height / 2 - (y + height / 2));
            scale.set(Math.max(0.2, Math.min(2.5, origin.width / width)));
          }
          placed.set(true);
          progress.set(withSpring(1, SPRING.fly));
        });
      }}>
      {children}
    </Animated.View>
  );
}

/** Whether a FlyIn for `key` is about to fly, so the screen can hold back its own entrance for that piece. */
export function useWillFly(key?: string) {
  const { animate } = useMotion();
  const [will] = useState(() => !!(animate && key && peekOrigin(key)));
  return will;
}
