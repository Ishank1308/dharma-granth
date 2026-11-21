import { NativeTabs } from 'expo-router/native-tabs';

import { usePalette } from '@/state/app-state';

export default function TabsLayout() {
  const palette = usePalette();
  return (
    <NativeTabs
      backgroundColor={palette.chrome}
      indicatorColor={palette.dark ? 'rgba(255,159,10,0.18)' : 'rgba(194,65,12,0.12)'}
      labelStyle={{
        default: { color: palette.muted },
        selected: { color: palette.accent },
      }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Library</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="books.vertical" md="menu_book" selectedColor={palette.accent} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="bookmarks">
        <NativeTabs.Trigger.Label>Saved</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="bookmark" md="bookmark" selectedColor={palette.accent} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="gearshape" md="settings" selectedColor={palette.accent} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
