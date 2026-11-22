import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Bullets } from '@/components/guide-ui';
import { KSection, LangNote, Para } from '@/components/knowledge-ui';
import { Backdrop, Muted } from '@/components/ui';
import { ritualById } from '@/content/rituals';
import { S, useI18n } from '@/i18n';
import { usePrefs } from '@/state/app-state';
import { festivalColors } from '@/theme/festival-colors';
import { SANSKRIT_FONT } from '@/theme/fonts';
import { fontCap, huesFor, quietFill, RADIUS, SPACE, TITLE_FONT_CAP, TYPE, UI_FONT_CAP } from '@/theme/themes';

export { ErrorBoundary } from '@/components/error-boundary';

/**
 * One ritual, with every section of its card on dharmagranth.dev/rituals/: the initiation caution where it
 * applies, meaning, scriptural basis, symbolism, regional variations, philosophical meaning, etiquette and steps.
 */
export default function RitualScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { palette, settings } = usePrefs();
  const { t } = useI18n();
  const hues = huesFor(palette);
  const r = ritualById(String(id));
  const cap = fontCap(settings.textScale);

  if (!r) {
    return (
      <Backdrop>
        <Stack.Screen options={{ title: t(S.notFoundTitle) }} />
        <View style={{ padding: SPACE.xl }}>
          <Muted>{t(S.notFoundTitle)}</Muted>
        </View>
      </Backdrop>
    );
  }
  const [from, to] = festivalColors(r.gradient, true);

  return (
    <Backdrop>
      <Stack.Screen options={{ title: '', headerTransparent: true, headerStyle: { backgroundColor: 'transparent' } }} />
      <Animated.ScrollView
        style={{ backgroundColor: 'transparent' }}
        contentContainerStyle={{ paddingTop: insets.top + 56, paddingHorizontal: SPACE.lg, paddingBottom: insets.bottom + SPACE.xxl * 2, rowGap: SPACE.md }}>
        {/* The ritual's cover in its own colours, as the website's dialog header. */}
        <View style={[styles.cover, { backgroundColor: to }, !palette.lite && { backgroundImage: `linear-gradient(140deg, ${from} 0%, ${to} 100%)` }]}>
          <Text allowFontScaling={false} style={styles.coverIcon}>
            {r.icon}
          </Text>
          <Text accessibilityRole="header" maxFontSizeMultiplier={TITLE_FONT_CAP} style={[styles.coverTitle, { fontFamily: SANSKRIT_FONT }]}>
            {r.sanskrit}
          </Text>
          <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={styles.coverSub}>
            {r.name} · {r.transliteration}
          </Text>
          <Text maxFontSizeMultiplier={cap} style={[styles.coverSub, { marginTop: SPACE.md, fontSize: TYPE.callout, lineHeight: TYPE.callout * 1.6 }]}>
            {r.shortDesc}
          </Text>
        </View>

        <LangNote content="hi" />

        {r.requiresInitiation && r.initiationWarning ? (
          <View style={[styles.warn, { backgroundColor: `${hues.gold}18`, borderColor: `${hues.gold}66` }]} accessible>
            <Ionicons name="alert-circle" size={22} color={hues.gold} />
            <View style={{ flex: 1, rowGap: 4 }}>
              <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: hues.gold, fontSize: TYPE.footnote, fontWeight: '800' }}>
                {t(S.ritualInitiationTitle)}
              </Text>
              <Para lang="hi">{r.initiationWarning}</Para>
            </View>
          </View>
        ) : null}

        <KSection title={t(S.ritualMeaning)} hue="saffron">
          <Para lang="hi">{r.meaning}</Para>
        </KSection>
        <KSection title={t(S.ritualBasis)} hue="peacock">
          <Para lang="hi">{r.scripturalBasis}</Para>
        </KSection>
        <KSection title={t(S.ritualSymbolism)} hue="gold">
          <Para lang="hi">{r.symbolism}</Para>
        </KSection>
        <KSection title={t(S.ritualRegions)} hue="lotus">
          {r.regionalVariations.map((rv, i) => (
            <View key={i} style={[styles.region, { backgroundColor: quietFill(palette) }]}>
              <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: hues.lotus, fontSize: TYPE.footnote, fontWeight: '800' }}>
                {rv.region}
              </Text>
              <Para lang="hi">{rv.variation}</Para>
            </View>
          ))}
        </KSection>
        <KSection title={t(S.ritualPhilosophy)} hue="indigo">
          <Para lang="hi">{r.philosophicalInterpretation}</Para>
        </KSection>
        <KSection title={t(S.ritualEtiquette)} hue="tulsi">
          <Bullets items={r.practicalEtiquette.map((text) => ({ text }))} />
        </KSection>
        {r.steps?.length ? (
          <KSection title={t(S.ritualSteps)} hue="saffron">
            <Bullets numbered items={r.steps.map((text) => ({ text }))} />
          </KSection>
        ) : null}
      </Animated.ScrollView>
    </Backdrop>
  );
}

const styles = StyleSheet.create({
  cover: { borderRadius: RADIUS.panel, padding: SPACE.xl, overflow: 'hidden' },
  coverIcon: { fontSize: 48, marginBottom: SPACE.sm },
  coverTitle: { color: '#ffffff', fontSize: 40, lineHeight: 62 },
  coverSub: { color: 'rgba(255,255,255,0.9)', fontSize: TYPE.subhead },
  warn: { flexDirection: 'row', columnGap: SPACE.md, borderRadius: RADIUS.card, borderWidth: 1, padding: SPACE.lg },
  region: { borderRadius: RADIUS.control, padding: SPACE.md, rowGap: 2 },
});
