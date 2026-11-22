/**
 * Crash safeguards. A render error anywhere used to close the whole app on Android with no message; now
 * it is caught and the reader gets a calm page with Try again.
 *
 *   export { ErrorBoundary } from '@/components/error-boundary';   // in any route or layout file
 *   <Quiet><Book3D … /></Quiet>                                     // around decoration that may fail
 *
 * The page does not read the app state or the settings, because those may be what failed: it follows the
 * phone's light or dark mode and says everything in English and Hindi together.
 */
import { router, type ErrorBoundaryProps } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { Component, useEffect, useState, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';

import { S } from '@/i18n/strings';
import { RADIUS, SPACE, THEMES, TOUCH, TYPE, UI_FONT_CAP } from '@/theme/themes';

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  const p = THEMES[useColorScheme() === 'dark' ? 'dark' : 'day'];
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (__DEV__) console.error('[ErrorBoundary]', error);
    // A failure before the first screen would otherwise leave the splash screen up for good.
    SplashScreen.hideAsync().catch(() => {});
  }, [error]);

  const again = (home: boolean) => {
    if (busy) return;
    setBusy(true);
    try {
      if (home) router.replace('/');
    } catch {
      // The navigator itself may be what failed; retry() below redraws it from scratch.
    }
    retry().finally(() => setBusy(false));
  };

  return (
    <ScrollView
      style={{ backgroundColor: p.bg }}
      contentContainerStyle={styles.page}
      accessibilityLiveRegion="assertive"
      accessibilityLabel={`${S.crashTitle.en}. ${S.crashTitle.hi}`}>
      <Text maxFontSizeMultiplier={UI_FONT_CAP} style={[styles.mark, { color: p.gold }]} accessibilityElementsHidden importantForAccessibility="no">
        ॥
      </Text>
      <Text accessibilityRole="header" maxFontSizeMultiplier={UI_FONT_CAP} style={[styles.title, { color: p.text }]}>
        {S.crashTitle.hi}
      </Text>
      <Text maxFontSizeMultiplier={UI_FONT_CAP} style={[styles.subtitle, { color: p.textSecondary }]}>
        {S.crashTitle.en}
      </Text>
      <Text maxFontSizeMultiplier={UI_FONT_CAP} style={[styles.body, { color: p.muted }]}>
        {S.crashBody.hi}
        {'\n'}
        {S.crashBody.en}
      </Text>
      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ busy }}
          accessibilityLabel={`${S.crashRetry.en}. ${S.crashRetry.hi}`}
          onPress={() => again(false)}
          style={({ pressed }) => [styles.btn, { backgroundColor: p.accent }, pressed && styles.pressed]}>
          <Text maxFontSizeMultiplier={UI_FONT_CAP} style={[styles.btnText, { color: p.onAccent }]}>
            {S.crashRetry.hi} · {S.crashRetry.en}
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${S.crashHome.en}. ${S.crashHome.hi}`}
          onPress={() => again(true)}
          style={({ pressed }) => [styles.btn, { borderColor: p.border, borderWidth: StyleSheet.hairlineWidth * 2 }, pressed && styles.pressed]}>
          <Text maxFontSizeMultiplier={UI_FONT_CAP} style={[styles.btnText, { color: p.accent }]}>
            {S.crashHome.hi} · {S.crashHome.en}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

/**
 * Draws its children, or `fallback` (nothing by default) if they throw. For optional decoration such as
 * 3D covers, artwork and animated flourishes, so a failure there leaves the page readable.
 */
export class Quiet extends Component<{ children: ReactNode; fallback?: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    if (__DEV__) console.warn('[Quiet] a decorative view failed and was hidden:', error);
  }

  render() {
    return this.state.failed ? (this.props.fallback ?? null) : this.props.children;
  }
}

const styles = StyleSheet.create({
  page: { flexGrow: 1, justifyContent: 'center', padding: SPACE.xl, rowGap: SPACE.sm },
  mark: { fontSize: TYPE.title1, textAlign: 'center' },
  title: { fontSize: TYPE.title2, fontWeight: '700', textAlign: 'center' },
  subtitle: { fontSize: TYPE.callout, fontWeight: '600', textAlign: 'center' },
  body: { fontSize: TYPE.subhead, lineHeight: 22, textAlign: 'center', marginTop: SPACE.sm },
  actions: { marginTop: SPACE.xl, rowGap: SPACE.md },
  btn: { minHeight: TOUCH, borderRadius: RADIUS.pill, alignItems: 'center', justifyContent: 'center', paddingHorizontal: SPACE.lg },
  btnText: { fontSize: TYPE.callout, fontWeight: '700' },
  pressed: { opacity: 0.8 },
});
