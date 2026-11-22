import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import type { BottomTabBarProps } from 'expo-router/tabs';
import { useEffect, useState, type ComponentProps } from 'react';
import { StyleSheet, Text, View, type LayoutRectangle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { GlassLayers } from '@/components/bento';
import { barSurface, FloatingBar, glass } from '@/components/ui';
import { S, useI18n, type Msg } from '@/i18n';
import { AnimatedIcon, playIconMotion, useIconMotion, type IconMotion } from '@/motion/animated-icon';
import { hapticSelect } from '@/motion/haptics';
import { PressableScale } from '@/motion/pressable-scale';
import { SPRING } from '@/motion/tokens';
import { useMotion } from '@/motion/use-motion';
import { usePrefs } from '@/state/app-state';
import { BAR_GAP, BAR_HEIGHT, SPACE, TYPE } from '@/theme/themes';

type IconName = ComponentProps<typeof Ionicons>['name'];

// Each tab's icon acts out its meaning as it becomes current (src/motion/animated-icon.tsx).
const TABS: Record<string, { label: Msg; icon: IconName; iconActive: IconName; motion: IconMotion }> = {
  home: { label: S.tabHome, icon: 'home-outline', iconActive: 'home', motion: 'hop' },
  index: { label: S.tabLibrary, icon: 'book-outline', iconActive: 'book', motion: 'flip' },
  bookmarks: { label: S.tabSaved, icon: 'bookmark-outline', iconActive: 'bookmark', motion: 'drop' },
  explore: { label: S.tabExplore, icon: 'compass-outline', iconActive: 'compass', motion: 'spin' },
  settings: { label: S.tabSettings, icon: 'settings-outline', iconActive: 'settings', motion: 'turn' },
};

/**
 * The tab bar: a floating glass capsule over the content, after Apple's Liquid Glass tab bar, with Search as
 * its own round button beside it, so verse search is one thumb tap from every tab (One UI's reachability).
 * The bar takes no layout space; screens leave barClearance() at the end of their lists.
 */
export function FloatingTabBar({ state, emitter, navigateToTab, insets }: BottomTabBarProps) {
  const { palette } = usePrefs();
  const { t, lang } = useI18n();
  const bottom = Math.max(insets.bottom, SPACE.sm) + BAR_GAP;
  const { animate } = useMotion();
  const lens = useIconMotion();

  // The highlight is one drop of liquid glass that flows between tabs: its leading edge springs ahead and its
  // trailing edge follows a beat later, so it stretches as it travels and gathers itself on arrival.
  const [layouts, setLayouts] = useState<Record<number, LayoutRectangle>>({});
  const pillL = useSharedValue(0);
  const pillR = useSharedValue(0);
  const pillY = useSharedValue(0);
  const pillH = useSharedValue(0);
  const current = layouts[state.index];
  useEffect(() => {
    if (!current) return;
    const first = pillR.value === 0;
    pillY.value = current.y;
    pillH.value = current.height;
    const left = current.x;
    const right = current.x + current.width;
    if (!animate || first) {
      pillL.value = left;
      pillR.value = right;
      return;
    }
    const goingRight = left > pillL.value;
    pillL.value = withSpring(left, goingRight ? SPRING.gentle : SPRING.lively);
    pillR.value = withSpring(right, goingRight ? SPRING.lively : SPRING.gentle);
  }, [current, animate, pillL, pillR, pillY, pillH]);
  const pill = useAnimatedStyle(() => {
    const width = Math.max(0, pillR.value - pillL.value);
    // A little thinner while stretched, as a drop is.
    const stretch = current ? Math.min(1, Math.max(0, width / current.width - 1)) : 0;
    return {
      opacity: pillR.value > 0 ? 1 : 0,
      left: pillL.value,
      width,
      top: pillY.value + stretch * 4,
      height: pillH.value - stretch * 8,
    };
  });

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { bottom }]}>
      <FloatingBar style={styles.tabs}>
        <GlassLayers radius={BAR_HEIGHT / 2} />
        <View accessibilityRole="tablist" style={styles.row}>
          <Animated.View
            pointerEvents="none"
            style={[
              styles.pill,
              { backgroundColor: palette.dark ? 'rgba(255,159,10,0.18)' : 'rgba(194,65,12,0.12)' },
              !palette.lite && {
                boxShadow: palette.dark
                  ? 'inset 1px 1px 0 rgba(255,255,255,0.18), inset -1px -1px 0 rgba(255,159,10,0.18)'
                  : 'inset 1px 1px 0 rgba(255,255,255,0.9), inset -1px -1px 0 rgba(194,65,12,0.12)',
              },
              pill,
            ]}
          />
          {state.routes.map((route, index) => {
            const tab = TABS[route.name];
            if (!tab) return null;
            const focused = index === state.index;
            const label = t(tab.label);
            const onPress = () => {
              const event = emitter.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
              if (!focused && !event.defaultPrevented) {
                hapticSelect();
                navigateToTab(route.key);
              }
            };
            return (
              <PressableScale
                key={route.key}
                scaleTo={0.9}
                onPress={onPress}
                onLongPress={() => emitter.emit({ type: 'tabLongPress', target: route.key })}
                onLayout={(e) => {
                  const l = e.nativeEvent.layout;
                  setLayouts((all) => ({ ...all, [index]: l }));
                }}
                accessibilityRole="tab"
                accessibilityState={{ selected: focused }}
                accessibilityLabel={t(S.tabA11y(label, index + 1, state.routes.length))}
                style={styles.tab}>
                <AnimatedIcon
                  name={tab.icon}
                  activeName={tab.iconActive}
                  active={focused}
                  size={22}
                  color={palette.muted}
                  activeColor={palette.accent}
                  motion={tab.motion}
                />
                <Text
                  numberOfLines={1}
                  // Five tabs beside Search leave about 50 dp per label on a 390 dp phone; shrink a long one
                  // ("Settings", "सहेजे गए") a little rather than cut it to "Settin…".
                  adjustsFontSizeToFit
                  minimumFontScale={0.8}
                  // The label grows with the system font size only this far, so it stays inside the capsule;
                  // TalkBack reads the full name either way. Devanagari is set a size larger to stay legible.
                  maxFontSizeMultiplier={1.3}
                  style={{ fontSize: lang === 'hi' ? TYPE.caption + 1 : TYPE.caption, fontWeight: focused ? '700' : '500', color: focused ? palette.accent : palette.muted }}>
                  {label}
                </Text>
              </PressableScale>
            );
          })}
        </View>
      </FloatingBar>
      <PressableScale
        scaleTo={0.9}
        onPress={() => {
          if (animate) playIconMotion('wiggle', lens.values);
          router.push('/search');
        }}
        accessibilityRole="button"
        accessibilityLabel={t(S.searchInsideVerses)}
        style={[
          styles.search,
          glass(palette, true),
          { backgroundColor: barSurface(palette) },
          !palette.lite && { boxShadow: palette.dark ? '0 12px 30px rgba(0,0,0,0.5)' : '0 12px 32px rgba(60,30,10,0.16)' },
        ]}>
        <Animated.View style={lens.style}>
          <Ionicons name="search" size={24} color={palette.text} />
        </Animated.View>
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: SPACE.lg, right: SPACE.lg, flexDirection: 'row', alignItems: 'center', columnGap: SPACE.sm },
  tabs: { flex: 1, paddingHorizontal: SPACE.xs },
  row: { flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  // Tabs share the bar evenly (up to 96 wide), so four or five fit beside Search on a 360 dp phone.
  tab: {
    flex: 1,
    maxWidth: 96,
    height: BAR_HEIGHT - 12,
    paddingHorizontal: 2,
    borderRadius: (BAR_HEIGHT - 12) / 2,
    alignItems: 'center',
    justifyContent: 'center',
    rowGap: 2,
  },
  pill: { position: 'absolute', borderRadius: (BAR_HEIGHT - 12) / 2 },
  search: { width: BAR_HEIGHT, height: BAR_HEIGHT, borderRadius: BAR_HEIGHT / 2, alignItems: 'center', justifyContent: 'center' },
});
