import { Tabs } from 'expo-router/tabs';

import { FloatingTabBar } from '@/components/floating-tab-bar';
import { S, useI18n } from '@/i18n';
import { usePalette } from '@/state/app-state';

/**
 * The three tabs under a floating glass tab bar (src/components/floating-tab-bar.tsx). Each screen draws its
 * own large header, so the navigator's header is off.
 */
export default function TabsLayout() {
  const palette = usePalette();
  const { t } = useI18n();
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: palette.bg } }}>
      <Tabs.Screen name="index" options={{ title: t(S.tabLibrary) }} />
      <Tabs.Screen name="bookmarks" options={{ title: t(S.tabSaved) }} />
      <Tabs.Screen name="settings" options={{ title: t(S.tabSettings) }} />
    </Tabs>
  );
}
