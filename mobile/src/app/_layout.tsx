import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, type FontSource } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';

import { DailyReminderEffects } from '@/components/daily-reminder-effects';
import { DailyWidgetEffects } from '@/components/daily-widget-effects';
import { RecitationProvider } from '@/audio/player';
import { AppStateProvider, useAppState } from '@/state/app-state';
import { SANSKRIT_FONT } from '@/theme/fonts';

SplashScreen.preventAutoHideAsync().catch(() => {});

// A deep link (the home-screen widget) can open the reader on a cold start; keep the tabs underneath so
// Back returns to the library instead of closing the app.
export const unstable_settings = { initialRouteName: '(tabs)' };

// The Android build embeds the shloka face (expo-font plugin in app.json); only the web preview loads it here.
// Text falls back to the system Devanagari font until it arrives, so nothing waits on it.
const WEB_FONTS: Record<string, FontSource> = Platform.OS === 'web' ? { [SANSKRIT_FONT]: require('../../assets/fonts/TiroDevanagariSanskrit.ttf') } : {};

function Navigator() {
  const { palette, ready } = useAppState();
  useFonts(WEB_FONTS);

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
        </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AppStateProvider>
      <RecitationProvider>
        <Navigator />
      </RecitationProvider>
    </AppStateProvider>
  );
}
