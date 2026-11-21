import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { DailyReminderEffects } from '@/components/daily-reminder-effects';
import { DailyWidgetEffects } from '@/components/daily-widget-effects';
import { RecitationProvider } from '@/audio/player';
import { AppStateProvider, useAppState } from '@/state/app-state';
import { JournalProvider } from '@/state/journal';

SplashScreen.preventAutoHideAsync().catch(() => {});

// A deep link (the home-screen widget) can open the reader on a cold start; keep the tabs underneath so
// Back returns to the library instead of closing the app.
export const unstable_settings = { initialRouteName: '(tabs)' };

function Navigator() {
  const { palette, ready } = useAppState();

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  const base = palette.dark ? DarkTheme : DefaultTheme;
  const navTheme = {
    ...base,
    colors: {
      ...base.colors,
      primary: palette.accent,
      background: palette.bg,
      card: palette.chrome,
      text: palette.text,
      border: palette.border,
    },
  };

  return (
    <ThemeProvider value={navTheme}>
        <StatusBar style={palette.dark ? 'light' : 'dark'} />
        <DailyReminderEffects />
        <DailyWidgetEffects />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: palette.chrome },
            headerTintColor: palette.accent,
            headerTitleStyle: { color: palette.text },
            headerShadowVisible: false,
            contentStyle: { backgroundColor: palette.bg },
          }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="scripture/[id]/index" options={{ title: '' }} />
          <Stack.Screen name="scripture/[id]/[chapter]" options={{ title: '' }} />
          <Stack.Screen name="journal/index" options={{ title: '' }} />
          <Stack.Screen name="journal/edit" options={{ title: '' }} />
          <Stack.Screen name="journal/collections" options={{ title: '' }} />
          <Stack.Screen name="share" options={{ title: '', presentation: 'modal' }} />
        </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AppStateProvider>
      <JournalProvider>
        <RecitationProvider>
          <Navigator />
        </RecitationProvider>
      </JournalProvider>
    </AppStateProvider>
  );
}
