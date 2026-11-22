import { Tabs } from 'expo-router/tabs';

import { FloatingTabBar } from '@/components/floating-tab-bar';
import { S, useI18n } from '@/i18n';
import { useMotion } from '@/motion/use-motion';
import { usePalette } from '@/state/app-state';

/**
 * The tabs under a floating glass tab bar (src/components/floating-tab-bar.tsx). Each screen draws its
 * own large header, so the navigator's header is off. Home opens first; the Library keeps the "/" route,
 * so links to "/" still land on the book list.
 */
export const unstable_settings = { initialRouteName: 'home' };

export default function TabsLayout() {
  const palette = usePalette();
  const { t } = useI18n();
  // Tabs shift a little sideways as they change, toward the side of the tab you picked, so moving between
  // them reads as moving along the bar. With reduce motion they simply change.
  const { animate } = useMotion();
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: palette.bg }, animation: animate ? 'shift' : 'none' }}>
      <Tabs.Screen name="home" options={{ title: t(S.tabHome) }} />
      <Tabs.Screen name="index" options={{ title: t(S.tabLibrary) }} />
      <Tabs.Screen name="bookmarks" options={{ title: t(S.tabSaved) }} />
      <Tabs.Screen name="explore" options={{ title: t(S.tabExplore) }} />
      <Tabs.Screen name="settings" options={{ title: t(S.tabSettings) }} />
    </Tabs>
  );
}
