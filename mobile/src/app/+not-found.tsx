import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { accentFill, Backdrop, Muted } from '@/components/ui';
import { useI18n, type Msg } from '@/i18n';
import { usePalette } from '@/state/app-state';
import { huesFor, RADIUS, SPACE, TITLE_FONT_CAP, TOUCH, TYPE } from '@/theme/themes';

// Kept here rather than in strings.ts: only this screen uses them.
const TITLE: Msg = { en: 'This page is not in the app', hi: 'यह पृष्ठ ऐप में नहीं है' };
const BODY: Msg = {
  en: 'The link may be from an older version, or point to a text that is not on this phone.',
  hi: 'हो सकता है कड़ी पुराने संस्करण की हो, या किसी ऐसे ग्रन्थ की जो इस फ़ोन पर नहीं है।',
};
const CTA: Msg = { en: 'Open the library', hi: 'ग्रन्थ संग्रह खोलें' };

/**
 * Shown for a link the app has no screen for (an old widget or notification link, or a typed
 * dharmagranth:// address), instead of Expo Router's developer page with its sitemap.
 */
export default function NotFound() {
  const palette = usePalette();
  const { t } = useI18n();
  return (
    <Backdrop quiet>
      <Stack.Screen options={{ title: '' }} />
      <View style={styles.wrap}>
        <Ionicons name="compass-outline" size={48} color={huesFor(palette).saffron} />
        <Text accessibilityRole="header" maxFontSizeMultiplier={TITLE_FONT_CAP} style={[styles.title, { color: palette.text }]}>
          {t(TITLE)}
        </Text>
        <Muted style={styles.body}>{t(BODY)}</Muted>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.replace('/')}
          style={({ pressed }) => [styles.cta, accentFill(palette), pressed && { transform: [{ scale: 0.97 }] }]}>
          <Text maxFontSizeMultiplier={1.4} style={{ color: palette.onAccent, fontSize: TYPE.body, fontWeight: '700' }}>
            {t(CTA)}
          </Text>
        </Pressable>
      </View>
    </Backdrop>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACE.xl, gap: SPACE.md },
  title: { fontSize: TYPE.title2, fontWeight: '700', textAlign: 'center' },
  body: { textAlign: 'center', fontSize: TYPE.callout, lineHeight: TYPE.callout * 1.5 },
  cta: { marginTop: SPACE.md, minHeight: TOUCH + 8, paddingHorizontal: SPACE.xl, borderRadius: RADIUS.pill, alignItems: 'center', justifyContent: 'center' },
});
