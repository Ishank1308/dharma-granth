import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack } from 'expo-router';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Backdrop, coverFill, GroupRow, Muted } from '@/components/ui';
import { ASHTAVAKRA_CHAPTERS, ASHTAVAKRA_VERSES } from '@/content/ashtavakra';
import { S, useI18n } from '@/i18n';
import { toDevanagari } from '@/lib/verse-format';
import { useAppState } from '@/state/app-state';
import { coverFor } from '@/theme/covers';
import { RADIUS, SPACE, TITLE_FONT_CAP, TYPE } from '@/theme/themes';

/** The darkest of a palette's colours, so a white numeral on it stays readable (4.5:1 or better). */
function deepest(colors: string[]): string {
  const lum = (hex: string) => {
    const v = parseInt(hex.slice(1), 16);
    return 0.299 * ((v >> 16) & 255) + 0.587 * ((v >> 8) & 255) + 0.114 * (v & 255);
  };
  const dark = [...colors].sort((a, b) => lum(a) - lum(b))[0];
  // A palette with no deep colour (प्रकरण 2: gold, sky, ivory) falls back to the book's midnight indigo.
  return lum(dark) < 90 ? dark : '#17213f';
}

/** The Ashtavakra Gita's twenty prakaranas, as the website's /ashtavakra/ chapter path. */
export default function AshtavakraScreen() {
  const insets = useSafeAreaInsets();
  const { palette } = useAppState();
  const { t } = useI18n();
  const cover = coverFor('ashtavakra', 'vedanta');
  const chapters = ASHTAVAKRA_CHAPTERS.filter((c) => c.verseCount > 0);
  const last = chapters.length - 1;

  return (
    <Backdrop>
      <Stack.Screen options={{ title: '', headerTransparent: true, headerStyle: { backgroundColor: 'transparent' } }} />
      <FlatList
        style={{ backgroundColor: 'transparent' }}
        contentContainerStyle={{ paddingTop: insets.top + 56, paddingHorizontal: SPACE.lg, paddingBottom: SPACE.xxl * 2 }}
        data={chapters}
        keyExtractor={(c) => String(c.number)}
        initialNumToRender={20}
        ListEmptyComponent={<Muted>{t(S.scriptureNotFound)}</Muted>}
        ListHeaderComponent={
          <View style={[styles.cover, coverFill(cover, palette, true), !palette.lite && styles.coverLift]}>
            {!palette.lite ? (
              <View
                pointerEvents="none"
                style={[StyleSheet.absoluteFill, { backgroundImage: `radial-gradient(60% 55% at 100% 0%, ${cover.colors[2]} 0%, transparent 70%)`, opacity: 0.55 }]}
              />
            ) : null}
            <View pointerEvents="none" style={[styles.ring, { borderColor: cover.foil, width: 170, height: 170, right: -40, top: -40, opacity: 0.35 }]} />
            <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={[styles.eyebrow, { color: cover.foil }]}>
              {t(S.ashtavakraEyebrow)}
            </Text>
            <Text accessibilityRole="header" maxFontSizeMultiplier={TITLE_FONT_CAP} style={styles.title}>
              अष्टावक्र गीता
            </Text>
            <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={styles.sub}>
              {t(S.ashtavakraLibraryLine(chapters.length, ASHTAVAKRA_VERSES))}
            </Text>
            {cover.epigraph ? (
              <View style={{ marginTop: SPACE.md }}>
                <View style={[styles.rule, { backgroundColor: cover.foil }]} />
                <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: cover.foil, fontSize: TYPE.callout + 1, lineHeight: (TYPE.callout + 1) * 1.6, marginTop: SPACE.sm }}>
                  {cover.epigraph.sa}
                </Text>
                <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: 'rgba(255,255,255,0.72)', fontSize: TYPE.caption }}>
                  {cover.epigraph.source}
                </Text>
              </View>
            ) : null}
          </View>
        }
        renderItem={({ item, index }) => (
          <GroupRow
            first={index === 0}
            last={index === last}
            inset={72}
            accessibilityLabel={t(S.prakaranaA11y(item.number, item.title))}
            onPress={() => router.push({ pathname: '/ashtavakra/[chapter]', params: { chapter: String(item.number) } })}>
            {/* Each prakarana keeps the website's three-colour palette: its deepest colour behind the numeral, all three along the foot. */}
            <View style={[styles.tile, { backgroundColor: deepest(item.palette) }]}>
              <Text allowFontScaling={false} style={styles.tileNum}>
                {toDevanagari(item.number)}
              </Text>
              <View style={styles.strip}>
                {item.palette.map((c) => (
                  <View key={c} style={{ flex: 1, backgroundColor: c }} />
                ))}
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: palette.text, fontSize: TYPE.body, fontWeight: '600' }}>{item.title}</Text>
              <Text style={{ color: palette.muted, fontSize: TYPE.footnote, marginTop: 2 }}>
                {item.essence}
              </Text>
            </View>
            <Text style={{ color: palette.muted, fontSize: TYPE.footnote }}>{toDevanagari(item.verseCount)}</Text>
            <Ionicons name="chevron-forward" size={18} color={palette.muted} />
          </GroupRow>
        )}
      />
    </Backdrop>
  );
}

const styles = StyleSheet.create({
  cover: { borderRadius: RADIUS.panel, padding: SPACE.xl - 2, overflow: 'hidden', marginBottom: SPACE.lg },
  coverLift: { boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.28), 0 14px 34px rgba(10,20,50,0.30)' },
  ring: { position: 'absolute', borderWidth: 1, borderRadius: 999 },
  eyebrow: { fontSize: TYPE.caption, fontWeight: '700', letterSpacing: 0.4 },
  title: { color: '#ffffff', fontSize: 32, lineHeight: 48, fontWeight: '600', marginTop: SPACE.sm },
  sub: { color: 'rgba(255,255,255,0.84)', fontSize: TYPE.subhead },
  rule: { height: 1, width: '70%', opacity: 0.6 },
  tile: { width: 44, height: 44, borderRadius: 13, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  tileNum: { color: '#ffffff', fontSize: 18, fontWeight: '700', marginBottom: 4 },
  strip: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 6, flexDirection: 'row' },
});
