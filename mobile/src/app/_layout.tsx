import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { AppStateProvider, useAppState } from '@/state/app-state';

SplashScreen.preventAutoHideAsync().catch(() => {});

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
      <Navigator />
    </AppStateProvider>
  );
}
