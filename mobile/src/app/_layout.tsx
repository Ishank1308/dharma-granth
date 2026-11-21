import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { DailyReminderEffects } from '@/components/daily-reminder-effects';
import { DailyWidgetEffects } from '@/components/daily-widget-effects';
import { RecitationProvider } from '@/audio/player';
import { ToastProvider } from '@/motion/toast';
import { useMotion } from '@/motion/use-motion';
import { AppStateProvider, useAppState } from '@/state/app-state';

SplashScreen.preventAutoHideAsync().catch(() => {});

// A deep link (the home-screen widget) can open the reader on a cold start; keep the tabs underneath so
// Back returns to the library instead of closing the app.
export const unstable_settings = { initialRouteName: '(tabs)' };

function Navigator() {
  const { palette, ready } = useAppState();

  // Books and chapters slide in over the page they came from, which drifts back a little behind them (a
  // native animation, so it costs nothing on the JS thread). With reduce motion they simply appear.
  const { animate } = useMotion();
  const push = animate ? 'ios_from_right' : 'none';

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
          <Stack.Screen name="scripture/[id]/index" options={{ title: '', animation: push }} />
          <Stack.Screen name="scripture/[id]/[chapter]" options={{ title: '', animation: push }} />
        </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AppStateProvider>
      <RecitationProvider>
        <ToastProvider>
          <Navigator />
        </ToastProvider>
      </RecitationProvider>
    </AppStateProvider>
  );
}
