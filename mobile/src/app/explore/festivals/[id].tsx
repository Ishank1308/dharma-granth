import { Stack, useLocalSearchParams } from 'expo-router';
import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Backdrop, Card, GroupTitle, Muted } from '@/components/ui';
import { festivalById, formatDay, isoDate, nextDateOf, todayForLocation } from '@/content/explore';
import { S, useI18n, type Msg } from '@/i18n';
import { usePanchangCity } from '@/lib/panchang-city';
import { usePrefs } from '@/state/app-state';
import { festivalColors } from '@/theme/festival-colors';
import { fontCap, huesFor, quietFill, RADIUS, SPACE, TITLE_FONT_CAP, TYPE } from '@/theme/themes';

export { ErrorBoundary } from '@/components/error-boundary';

/** One festival's guide, with the same sections as its card on dharmagranth.dev/festivals/. */
export default function FestivalScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { palette, settings } = usePrefs();
  const { t, lang } = useI18n();
  const hues = huesFor(palette);
  const [city] = usePanchangCity();
  const f = festivalById(String(id));
  const scale = settings.textScale;
  const cap = fontCap(scale);

  if (!f) {
    return (
      <Backdrop>
        <Stack.Screen options={{ title: t(S.notFoundTitle) }} />
        <View style={{ padding: SPACE.xl }}>
          <Muted>{t(S.notFoundTitle)}</Muted>
        </View>
      </Backdrop>
    );
  }

  const next = nextDateOf(f.id, isoDate(todayForLocation(city)));
  const [from, to] = festivalColors(f.gradient, true);
  const body = { color: palette.textSecondary, fontSize: TYPE.callout * scale, lineHeight: TYPE.callout * scale * 1.6 };

  return (
    <Backdrop>
      <Stack.Screen options={{ title: '', headerTransparent: true, headerStyle: { backgroundColor: 'transparent' } }} />
      <ScrollView
        style={{ backgroundColor: 'transparent' }}
        contentContainerStyle={{ paddingTop: insets.top + 56, paddingHorizontal: SPACE.lg, paddingBottom: insets.bottom + SPACE.xxl * 2 }}>
        {/* The festival's cover, in its own colours from the website. */}
        <View style={[styles.cover, { backgroundColor: to }, !palette.lite && { backgroundImage: `linear-gradient(140deg, ${from} 0%, ${to} 100%)` }]}>
          <Text allowFontScaling={false} style={styles.coverIcon}>
            {f.icon}
          </Text>
          <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={styles.coverEyebrow}>
            {f.category}
          </Text>
          <Text accessibilityRole="header" maxFontSizeMultiplier={TITLE_FONT_CAP} style={styles.coverTitle}>
            {f.sanskrit}
          </Text>
          <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={styles.coverSub}>
            {f.name} · {f.transliteration}
          </Text>
          <Text maxFontSizeMultiplier={cap} style={[styles.coverSub, { marginTop: SPACE.md, fontSize: TYPE.callout, lineHeight: TYPE.callout * 1.5 }]}>
            {f.shortDesc}
          </Text>
          {next ? (
            <View style={styles.badge}>
              <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: '#ffffff', fontSize: TYPE.footnote, fontWeight: '700' }}>
                {t(S.festivalNext(formatDay(next.date, lang)))}
              </Text>
            </View>
          ) : null}
        </View>

        <Section title={S.festivalMeaning}>
          <Text maxFontSizeMultiplier={cap} style={body}>
            {f.meaning}
          </Text>
        </Section>

        <Section title={S.festivalTiming}>
          <Text maxFontSizeMultiplier={cap} style={body}>
            {f.timing}
          </Text>
        </Section>

        <Section title={S.festivalStory}>
          <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: hues.saffron, fontSize: TYPE.footnote, fontWeight: '700' }}>
            {t(S.festivalDeity)}: {f.relatedDeity}
          </Text>
          <Text maxFontSizeMultiplier={cap} style={[body, { marginTop: SPACE.sm }]}>
            {f.relatedNarrative}
          </Text>
        </Section>

        <Section title={S.festivalPractices}>
          <Bullets items={f.traditionalPractices} />
        </Section>

        {f.commonChants.length ? (
          <Section title={S.festivalChants}>
            {f.commonChants.map((c, i) => (
              <View key={i} style={[styles.chant, i > 0 && { marginTop: SPACE.md }, { backgroundColor: quietFill(palette) }]}>
                <Text maxFontSizeMultiplier={cap} style={{ color: palette.text, fontSize: TYPE.title3 * scale, lineHeight: TYPE.title3 * scale * 1.55, fontWeight: '600' }}>
                  {c.sanskrit}
                </Text>
                {settings.showTransliteration ? (
                  <Text maxFontSizeMultiplier={cap} style={{ color: palette.muted, fontSize: TYPE.subhead * scale, fontStyle: 'italic', marginTop: 2 }}>
                    {c.transliteration}
                  </Text>
                ) : null}
                <Text maxFontSizeMultiplier={cap} style={{ color: hues.peacock, fontSize: TYPE.subhead * scale, lineHeight: TYPE.subhead * scale * 1.5, marginTop: SPACE.xs }}>
                  {c.translation}
                </Text>
              </View>
            ))}
          </Section>
        ) : null}

        <Section title={S.festivalRegions}>
          {f.regionalTraditions.map((r, i) => (
            <View key={i} style={i > 0 ? { marginTop: SPACE.md } : undefined}>
              <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.subhead, fontWeight: '700' }}>
                {r.region}
              </Text>
              <Text maxFontSizeMultiplier={cap} style={[body, { fontSize: TYPE.subhead * scale }]}>
                {r.tradition}
              </Text>
            </View>
          ))}
        </Section>

        <Section title={S.festivalFood}>
          <Bullets items={f.foodTraditions} />
        </Section>

        <Section title={S.festivalScriptureVsCustom}>
          {f.scripturalVsCustom.map((row, i) => (
            <View key={i} style={[{ rowGap: SPACE.xs }, i > 0 && { marginTop: SPACE.md }]}>
              <Labelled label={t(S.scriptural)} color={hues.peacock} text={row.scriptural} />
              <Labelled label={t(S.custom)} color={hues.gold} text={row.custom} />
            </View>
          ))}
        </Section>

        <Section title={S.festivalSources}>
          <Bullets items={f.scripturalRefs} />
        </Section>

        <Section title={S.festivalEnvironment}>
          <Text maxFontSizeMultiplier={cap} style={body}>
            {f.environmentalConsiderations}
          </Text>
        </Section>
      </ScrollView>
    </Backdrop>
  );
}

function Section({ title, children }: { title: Msg; children: ReactNode }) {
  const { t } = useI18n();
  return (
    <>
      <GroupTitle title={t(title)} />
      <Card strong>{children}</Card>
    </>
  );
}

function Bullets({ items }: { items: string[] }) {
  const { palette, settings } = usePrefs();
  const scale = settings.textScale;
  return (
    <View style={{ rowGap: SPACE.sm }}>
      {items.map((item, i) => (
        <View key={i} style={{ flexDirection: 'row', columnGap: SPACE.sm }}>
          <Text style={{ color: palette.accent, fontSize: TYPE.callout * scale, lineHeight: TYPE.callout * scale * 1.5 }}>•</Text>
          <Text maxFontSizeMultiplier={fontCap(scale)} style={{ flex: 1, color: palette.textSecondary, fontSize: TYPE.callout * scale, lineHeight: TYPE.callout * scale * 1.5 }}>
            {item}
          </Text>
        </View>
      ))}
    </View>
  );
}

function Labelled({ label, color, text }: { label: string; color: string; text: string }) {
  const { palette, settings } = usePrefs();
  const scale = settings.textScale;
  return (
    <Text maxFontSizeMultiplier={fontCap(scale)} style={{ color: palette.textSecondary, fontSize: TYPE.subhead * scale, lineHeight: TYPE.subhead * scale * 1.5 }}>
      <Text style={{ color, fontWeight: '700' }}>{label} · </Text>
      {text}
    </Text>
  );
}

const styles = StyleSheet.create({
  cover: { borderRadius: RADIUS.panel, padding: SPACE.xl, overflow: 'hidden' },
  coverIcon: { fontSize: 44, marginBottom: SPACE.sm },
  coverEyebrow: { color: 'rgba(255,255,255,0.85)', fontSize: TYPE.footnote, fontWeight: '700' },
  coverTitle: { color: '#ffffff', fontSize: 40, fontWeight: '800', marginTop: SPACE.xs },
  coverSub: { color: 'rgba(255,255,255,0.88)', fontSize: TYPE.subhead },
  badge: { alignSelf: 'flex-start', marginTop: SPACE.md, backgroundColor: 'rgba(0,0,0,0.22)', borderRadius: RADIUS.pill, paddingHorizontal: SPACE.md, paddingVertical: 5 },
  chant: { borderRadius: RADIUS.control, padding: SPACE.md },
});
