import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import type { BottomTabBarProps } from 'expo-router/tabs';
import { useEffect, useState, type ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View, type LayoutRectangle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring } from 'react-native-reanimated';

import { barSurface, FloatingBar, glass } from '@/components/ui';
import { S, useI18n, type Msg } from '@/i18n';
import { hapticSelect } from '@/motion/haptics';
import { SPRING } from '@/motion/tokens';
import { useMotion } from '@/motion/use-motion';
import { useAppState } from '@/state/app-state';
import { BAR_GAP, BAR_HEIGHT, SPACE } from '@/theme/themes';

type IconName = ComponentProps<typeof Ionicons>['name'];

const TABS: Record<string, { label: Msg; icon: IconName; iconActive: IconName }> = {
  index: { label: S.tabLibrary, icon: 'book-outline', iconActive: 'book' },
  bookmarks: { label: S.tabSaved, icon: 'bookmark-outline', iconActive: 'bookmark' },
  settings: { label: S.tabSettings, icon: 'settings-outline', iconActive: 'settings' },
};

/** A tab's icon gives a small spring bounce as it becomes the current tab. */
function TabIcon({ name, focused, color }: { name: IconName; focused: boolean; color: string }) {
  const { animate } = useMotion();
  const scale = useSharedValue(1);
  useEffect(() => {
    if (focused && animate) scale.value = withSequence(withSpring(1.18, SPRING.press), withSpring(1, SPRING.lively));
  }, [focused, animate, scale]);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View style={style}>
      <Ionicons name={name} size={22} color={color} />
    </Animated.View>
  );
}

/**
 * The tab bar: a floating glass capsule over the content, after Apple's Liquid Glass tab bar, with Search as
 * its own round button beside it, so verse search is one thumb tap from every tab (One UI's reachability).
 * The bar takes no layout space; screens leave barClearance() at the end of their lists.
 */
export function FloatingTabBar({ state, emitter, navigateToTab, insets }: BottomTabBarProps) {
  const { palette } = useAppState();
  const { t } = useI18n();
  const bottom = Math.max(insets.bottom, SPACE.sm) + BAR_GAP;
  const { animate } = useMotion();

  // The highlight is one pill that glides between tabs on a spring, like the selection in a segmented control.
  const [layouts, setLayouts] = useState<Record<number, LayoutRectangle>>({});
  const pillX = useSharedValue(0);
  const pillW = useSharedValue(0);
  const pillY = useSharedValue(0);
  const pillH = useSharedValue(0);
  const current = layouts[state.index];
  useEffect(() => {
    if (!current) return;
    const first = pillW.value === 0;
    pillY.value = current.y;
    pillH.value = current.height;
    pillX.value = animate && !first ? withSpring(current.x, SPRING.lively) : current.x;
    pillW.value = animate && !first ? withSpring(current.width, SPRING.lively) : current.width;
  }, [current, animate, pillX, pillW, pillY, pillH]);
  const pill = useAnimatedStyle(() => ({
    opacity: pillW.value > 0 ? 1 : 0,
    left: pillX.value,
    width: pillW.value,
    top: pillY.value,
    height: pillH.value,
  }));

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { bottom }]}>
      <FloatingBar style={styles.tabs}>
        <View accessibilityRole="tablist" style={styles.row}>
          <Animated.View
            pointerEvents="none"
            style={[styles.pill, { backgroundColor: palette.dark ? 'rgba(255,159,10,0.18)' : 'rgba(194,65,12,0.12)' }, pill]}
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
              <Pressable
                key={route.key}
                onPress={onPress}
                onLongPress={() => emitter.emit({ type: 'tabLongPress', target: route.key })}
                onLayout={(e) => {
                  const l = e.nativeEvent.layout;
                  setLayouts((all) => ({ ...all, [index]: l }));
                }}
                accessibilityRole="tab"
                accessibilityState={{ selected: focused }}
                accessibilityLabel={t(S.tabA11y(label, index + 1, state.routes.length))}
                style={({ pressed }) => [
                  styles.tab,
                  pressed && { opacity: 0.7 },
                ]}>
                <TabIcon name={focused ? tab.iconActive : tab.icon} focused={focused} color={focused ? palette.accent : palette.muted} />
                <Text
                  numberOfLines={1}
                  maxFontSizeMultiplier={1.3}
                  style={{ fontSize: 11, fontWeight: focused ? '700' : '500', color: focused ? palette.accent : palette.muted }}>
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </FloatingBar>
      <Pressable
        onPress={() => router.push('/search')}
        accessibilityRole="button"
        accessibilityLabel={t(S.searchInsideVerses)}
        style={({ pressed }) => [
          styles.search,
          glass(palette, true),
          { backgroundColor: barSurface(palette) },
          !palette.lite && { boxShadow: palette.dark ? '0 12px 30px rgba(0,0,0,0.5)' : '0 12px 32px rgba(60,30,10,0.16)' },
          pressed && { transform: [{ scale: 0.94 }] },
        ]}>
        <Ionicons name="search" size={24} color={palette.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: SPACE.lg, right: SPACE.lg, flexDirection: 'row', alignItems: 'center', columnGap: 10 },
  tabs: { flex: 1, paddingHorizontal: 6 },
  row: { flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  tab: {
    minWidth: 72,
    height: BAR_HEIGHT - 12,
    paddingHorizontal: SPACE.md,
    borderRadius: (BAR_HEIGHT - 12) / 2,
    alignItems: 'center',
    justifyContent: 'center',
    rowGap: 2,
  },
  pill: { position: 'absolute', borderRadius: (BAR_HEIGHT - 12) / 2 },
  search: { width: BAR_HEIGHT, height: BAR_HEIGHT, borderRadius: BAR_HEIGHT / 2, alignItems: 'center', justifyContent: 'center' },
});
