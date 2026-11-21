import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import type { BottomTabBarProps } from 'expo-router/tabs';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { barSurface, FloatingBar, glass } from '@/components/ui';
import { S, useI18n, type Msg } from '@/i18n';
import { useAppState } from '@/state/app-state';
import { BAR_GAP, BAR_HEIGHT, SPACE, TYPE } from '@/theme/themes';

type IconName = ComponentProps<typeof Ionicons>['name'];

const TABS: Record<string, { label: Msg; icon: IconName; iconActive: IconName }> = {
  index: { label: S.tabLibrary, icon: 'book-outline', iconActive: 'book' },
  bookmarks: { label: S.tabSaved, icon: 'bookmark-outline', iconActive: 'bookmark' },
  explore: { label: S.tabExplore, icon: 'compass-outline', iconActive: 'compass' },
  settings: { label: S.tabSettings, icon: 'settings-outline', iconActive: 'settings' },
};

/**
 * The tab bar: a floating glass capsule over the content, after Apple's Liquid Glass tab bar, with Search as
 * its own round button beside it, so verse search is one thumb tap from every tab (One UI's reachability).
 * The bar takes no layout space; screens leave barClearance() at the end of their lists.
 */
export function FloatingTabBar({ state, emitter, navigateToTab, insets }: BottomTabBarProps) {
  const { palette } = useAppState();
  const { t, lang } = useI18n();
  const bottom = Math.max(insets.bottom, SPACE.sm) + BAR_GAP;

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { bottom }]}>
      <FloatingBar style={styles.tabs}>
        <View accessibilityRole="tablist" style={styles.row}>
          {state.routes.map((route, index) => {
            const tab = TABS[route.name];
            if (!tab) return null;
            const focused = index === state.index;
            const label = t(tab.label);
            const onPress = () => {
              const event = emitter.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
              if (!focused && !event.defaultPrevented) navigateToTab(route.key);
            };
            return (
              <Pressable
                key={route.key}
                onPress={onPress}
                onLongPress={() => emitter.emit({ type: 'tabLongPress', target: route.key })}
                accessibilityRole="tab"
                accessibilityState={{ selected: focused }}
                accessibilityLabel={t(S.tabA11y(label, index + 1, state.routes.length))}
                style={({ pressed }) => [
                  styles.tab,
                  focused && { backgroundColor: palette.dark ? 'rgba(255,159,10,0.18)' : 'rgba(194,65,12,0.12)' },
                  pressed && { opacity: 0.7 },
                ]}>
                <Ionicons name={focused ? tab.iconActive : tab.icon} size={22} color={focused ? palette.accent : palette.muted} />
                <Text
                  numberOfLines={1}
                  // The label grows with the system font size only this far, so it stays inside the capsule;
                  // TalkBack reads the full name either way. Devanagari is set a size larger to stay legible.
                  maxFontSizeMultiplier={1.3}
                  style={{ fontSize: lang === 'hi' ? TYPE.caption + 1 : TYPE.caption, fontWeight: focused ? '700' : '500', color: focused ? palette.accent : palette.muted }}>
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
  // Four tabs share the capsule evenly, so they still fit beside the Search button on a 360 dp phone.
  tab: {
    flex: 1,
    maxWidth: 96,
    height: BAR_HEIGHT - 12,
    paddingHorizontal: SPACE.xs,
    borderRadius: (BAR_HEIGHT - 12) / 2,
    alignItems: 'center',
    justifyContent: 'center',
    rowGap: 2,
  },
  search: { width: BAR_HEIGHT, height: BAR_HEIGHT, borderRadius: BAR_HEIGHT / 2, alignItems: 'center', justifyContent: 'center' },
});
