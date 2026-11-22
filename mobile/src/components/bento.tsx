/**
 * Bento tiles: asymmetric grids of glass cards (a tall tile beside two short ones, a wide tile over a pair),
 * after Apple's bento layouts, drawn in two material languages at once:
 *
 * - Liquid Glass (Apple): a translucent body over the aurora, a bright specular edge at the top left that
 *   fades round the rim, and a soft inner glow at the foot, as if light bent through a lens.
 * - Acrylic and Reveal (Microsoft Fluent): a faint grain over the tint so the glass reads as a material, not
 *   a flat colour; light that pools under the finger where it touches and lights the rim (Reveal highlight);
 *   and depth from layered shadows.
 *
 * Budget fallback: with light effects (palette.lite) or no rich motion, a tile is the plain glass card with a
 * flat rim and the spring press; no grain image, no gradients, no shadow blur, no reveal light. With reduce
 * motion the tile dims on press instead of sinking.
 *
 *   <BentoRow>
 *     <BentoTile flex={1.4} tall …>…</BentoTile>
 *     <BentoCol><BentoTile …/><BentoTile …/></BentoCol>
 *   </BentoRow>
 */
import { createContext, useContext, useRef, type ComponentRef, type ReactNode } from 'react';
import { Image, Pressable, StyleSheet, View, type GestureResponderEvent, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { Extrapolation, interpolate, useAnimatedStyle, useSharedValue, withSpring, withTiming, type SharedValue } from 'react-native-reanimated';

import { glass } from '@/components/ui';
import { hapticTap } from '@/motion/haptics';
import { PRESS_SCALE, SPRING } from '@/motion/tokens';
import { useMotion } from '@/motion/use-motion';
import { usePrefs } from '@/state/app-state';
import { RADIUS, SPACE, type Palette } from '@/theme/themes';

const GRAIN = {
  dark: require('../../assets/textures/grain-dark.png'),
  light: require('../../assets/textures/grain-light.png'),
};

/**
 * The page's scroll position, for tiles that rise gently into view (scroll depth). A screen provides it once
 * around its scroll view: <BentoDepth.Provider value={{ scrollY, windowHeight }}>.
 */
export const BentoDepth = createContext<{ scrollY: SharedValue<number>; windowHeight: number } | null>(null);

/** The spotlight's diameter under the finger. */
const REVEAL = 240;

/**
 * The liquid glass material: the glass card plus a lens rim (bright top-left, faint bottom-right) and a
 * layered Fluent depth shadow. Light effects keep glass()'s budget surface.
 */
export function liquidGlass(palette: Palette, { strong = false, tint }: { strong?: boolean; tint?: string } = {}): ViewStyle {
  const base = glass(palette, strong);
  if (palette.lite) return tint ? { ...base, backgroundColor: tint } : base;
  const edge = palette.dark ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.85)';
  const under = palette.dark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.35)';
  return {
    ...base,
    ...(tint ? { backgroundColor: tint } : null),
    boxShadow: palette.dark
      ? `inset 1px 1px 0 ${edge}, inset -1px -1px 0 ${under}, 0 2px 4px rgba(0,0,0,0.25), 0 18px 40px -12px rgba(0,0,0,0.55)`
      : `inset 1px 1px 0 ${edge}, inset -1px -1px 0 ${under}, 0 1px 2px rgba(60,30,10,0.06), 0 16px 36px -14px rgba(60,30,10,0.22)`,
  };
}

/** The decorative layers inside a liquid glass surface: grain, specular sheen, the foot glow. */
export function GlassLayers({ radius, glow }: { radius: number; glow?: string }) {
  const { palette } = usePrefs();
  const { rich } = useMotion();
  if (palette.lite) return null;
  const spec = palette.dark
    ? 'linear-gradient(160deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.03) 32%, rgba(255,255,255,0) 55%)'
    : 'linear-gradient(160deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.18) 30%, rgba(255,255,255,0) 55%)';
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { borderRadius: radius, overflow: 'hidden' }]}>
      {/* Acrylic noise: a 256 px grain tile, barely there, so the tint reads as a material. */}
      {rich ? (
        <Image source={palette.dark ? GRAIN.dark : GRAIN.light} resizeMode="repeat" style={[StyleSheet.absoluteFill, { opacity: palette.dark ? 0.05 : 0.07 }]} />
      ) : null}
      <View style={[StyleSheet.absoluteFill, { backgroundImage: spec }]} />
      {glow ? <View style={[styles.footGlow, { backgroundImage: `radial-gradient(80% 100% at 50% 100%, ${glow} 0%, transparent 70%)` }]} /> : null}
    </View>
  );
}

export interface BentoTileProps {
  children: ReactNode;
  onPress?: () => void;
  accessibilityLabel?: string;
  accessibilityRole?: 'button' | 'link';
  accessibilityHint?: string;
  /** Share of the row's width (flex grow). */
  flex?: number;
  minHeight?: number;
  /** A colour wash over the glass (the tile's own hue). */
  tint?: string;
  /** A coloured glow pooling at the tile's foot. */
  glow?: string;
  strong?: boolean;
  /** A tile drawn on its own fill (a cover, the plum featured card): the glass layers still go on top. */
  surface?: ViewStyle;
  radius?: number;
  padding?: number;
  style?: StyleProp<ViewStyle>;
  /** The page's scroll position (defaults to BentoDepth): the tile rises gently into view as it scrolls up. Pass null to opt out. */
  depth?: { scrollY: SharedValue<number>; windowHeight: number } | null;
  haptic?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function BentoTile({
  children,
  onPress,
  accessibilityLabel,
  accessibilityRole = 'button',
  accessibilityHint,
  flex,
  minHeight,
  tint,
  glow,
  strong,
  surface,
  radius = RADIUS.card,
  padding = SPACE.lg,
  style,
  haptic,
  depth: depthProp,
}: BentoTileProps) {
  const { palette } = usePrefs();
  const pageDepth = useContext(BentoDepth);
  const depth = depthProp === undefined ? pageDepth : depthProp;
  const { animate, rich } = useMotion();
  const reveal = rich && !palette.lite;

  const pressed = useSharedValue(0);
  const lit = useSharedValue(0);
  const lx = useSharedValue(0);
  const ly = useSharedValue(0);
  const top = useSharedValue(-1);

  const press = useAnimatedStyle(() => {
    if (!animate) return { opacity: 1 - pressed.value * 0.2 };
    return { transform: [{ scale: 1 - (1 - PRESS_SCALE) * pressed.value }] };
  });

  // Scroll depth: a tile below the fold sits a little lower, smaller and dimmer, and settles as it comes up.
  const scrollDepth = useAnimatedStyle(() => {
    if (!depth || !rich || top.value < 0) return {};
    const enter = top.value - depth.windowHeight;
    const p = interpolate(depth.scrollY.value, [enter, enter + depth.windowHeight * 0.28], [0, 1], Extrapolation.CLAMP);
    return { opacity: 0.55 + p * 0.45, transform: [{ translateY: (1 - p) * 26 }, { scale: 0.96 + p * 0.04 }] };
  });

  const spot = useAnimatedStyle(() => ({
    opacity: lit.value,
    transform: [{ translateX: lx.value - REVEAL / 2 }, { translateY: ly.value - REVEAL / 2 }, { scale: 0.6 + lit.value * 0.4 }],
  }));
  const rim = useAnimatedStyle(() => ({ opacity: lit.value }));

  const onIn = (e: GestureResponderEvent) => {
    pressed.value = animate ? withSpring(1, SPRING.press) : withTiming(1, { duration: 0 });
    if (reveal) {
      lx.set(e.nativeEvent.locationX);
      ly.set(e.nativeEvent.locationY);
      lit.set(withTiming(1, { duration: 140 }));
    }
  };
  const onOut = () => {
    pressed.value = animate ? withSpring(0, SPRING.settle) : withTiming(0, { duration: 0 });
    if (reveal) lit.set(withTiming(0, { duration: 420 }));
  };
  const box = useRef<ComponentRef<typeof View>>(null);
  const onLayout = depth
    ? () => {
        // The tile's offset in the page: where it sits on screen now, plus how far the page has scrolled.
        box.current?.measure((_x, _y, _w, _h, _px, py) => {
          if (typeof py === 'number') top.value = py + depth.scrollY.value;
        });
      }
    : undefined;

  const body = surface ? { ...surface } : liquidGlass(palette, { strong, tint });
  // Lamplight rather than white light: the reveal glows the warm gold of a diya on a temple wall.
  const spotColor = palette.dark ? 'rgba(255,196,110,0.20)' : 'rgba(255,226,170,0.70)';
  const rimColor = palette.dark ? 'rgba(255,205,130,0.55)' : 'rgba(214,160,60,0.55)';

  const content = (
    <>
      <GlassLayers radius={radius} glow={glow ?? (palette.dark ? 'rgba(255,190,90,0.10)' : 'rgba(217,150,40,0.08)')} />
      {reveal ? (
        <View pointerEvents="none" style={[StyleSheet.absoluteFill, { borderRadius: radius, overflow: 'hidden' }]}>
          <Animated.View style={[styles.spot, { backgroundImage: `radial-gradient(circle, ${spotColor} 0%, transparent 65%)` }, spot]} />
          <Animated.View style={[StyleSheet.absoluteFill, { borderRadius: radius, borderWidth: 1, borderColor: rimColor }, rim]} />
        </View>
      ) : null}
      {children}
    </>
  );

  // flexGrow: the tile fills the height its row or column gives it, so neighbours line up.
  const shape: ViewStyle = { flexGrow: 1, borderRadius: radius, padding, minHeight, overflow: 'hidden' };
  const outer = [flex != null ? { flex } : null, scrollDepth];

  if (!onPress) {
    return (
      <Animated.View ref={box} onLayout={onLayout} style={outer}>
        <View accessible={!!accessibilityLabel} accessibilityLabel={accessibilityLabel} style={[shape, body, style]}>
          {content}
        </View>
      </Animated.View>
    );
  }
  return (
    <Animated.View ref={box} onLayout={onLayout} style={outer}>
      <AnimatedPressable
        onPress={() => {
          if (haptic) hapticTap();
          onPress();
        }}
        onPressIn={onIn}
        onPressOut={onOut}
        accessibilityRole={accessibilityRole}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        style={[shape, body, style, press]}>
        {content}
      </AnimatedPressable>
    </Animated.View>
  );
}

/** A row of tiles side by side; each tile's `flex` sets its share, so 1.4 : 1 gives an asymmetric pair. */
export function BentoRow({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.row, style]}>{children}</View>;
}

/** Tiles stacked in one column of a row, sharing its height: two short tiles beside one tall one. */
export function BentoCol({ children, flex = 1, style }: { children: ReactNode; flex?: number; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.col, { flex }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', columnGap: SPACE.md, alignItems: 'stretch' },
  col: { rowGap: SPACE.md, justifyContent: 'space-between' },
  spot: { position: 'absolute', left: 0, top: 0, width: REVEAL, height: REVEAL, borderRadius: REVEAL / 2 },
  footGlow: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '55%' },
});
