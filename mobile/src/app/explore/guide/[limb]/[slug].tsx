import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Moon3D } from '@/components/art/moon';
import { BentoRow, BentoTile } from '@/components/bento';
import { Bullets, FactGrid, FocusNote, HuePill } from '@/components/guide-ui';
import { KSection, LangNote, Para } from '@/components/knowledge-ui';
import { Backdrop, GroupTitle, IconTile, Muted } from '@/components/ui';
import { todayPanchang } from '@/content/explore';
import { daySlugs, isLimbId, LIMB_GUIDES, limbEntry, type LimbEntry, type LimbId } from '@/content/panchang-guides';
import { S, useI18n } from '@/i18n';
import { usePanchangCity } from '@/lib/panchang-city';
import { useMotion } from '@/motion/use-motion';
import { usePrefs } from '@/state/app-state';
import { SANSKRIT_FONT } from '@/theme/fonts';
import { huesFor, RADIUS, SPACE, TITLE_FONT_CAP, TYPE } from '@/theme/themes';

export { ErrorBoundary } from '@/components/error-boundary';

/**
 * One tithi, nakshatra, yoga, karana or vara, with the sections of its page on dharmagranth.dev: its name in
 * Devanagari, its coordinates (deity, class, arc…), its nature and the focus for study, the vrats and stotras
 * that belong to it, and steps to the entries either side.
 */
export default function LimbEntryScreen() {
  const params = useLocalSearchParams<{ limb: string; slug: string }>();
  const id: LimbId = isLimbId(params.limb) ? params.limb : 'tithis';
  const guide = LIMB_GUIDES[id];
  const insets = useSafeAreaInsets();
  const { palette } = usePrefs();
  const { t, lang } = useI18n();
  const { animate } = useMotion();
  const hues = huesFor(palette);
  const hue = hues[guide.hue];
  const [city] = usePanchangCity();
  const found = limbEntry(id, String(params.slug), lang);
  const todaySlug = useMemo(() => daySlugs(todayPanchang(city))[id], [city, id]);

  if (!found) {
    return (
      <Backdrop>
        <Stack.Screen options={{ title: t(S.notFoundTitle) }} />
        <View style={{ padding: SPACE.xl }}>
          <Muted>{t(S.notFoundTitle)}</Muted>
        </View>
      </Backdrop>
    );
  }
  const { entry: e, prev, next } = found;
  const isToday = e.slug === todaySlug;
  const go = (slug: string) => router.replace({ pathname: '/explore/guide/[limb]/[slug]', params: { limb: id, slug } });

  return (
    <Backdrop>
      <Stack.Screen options={{ title: '', headerTransparent: true, headerStyle: { backgroundColor: 'transparent' } }} />
      <Animated.ScrollView
        style={{ backgroundColor: 'transparent' }}
        contentContainerStyle={{ paddingTop: insets.top + 56, paddingHorizontal: SPACE.lg, paddingBottom: insets.bottom + SPACE.xxl * 2, rowGap: SPACE.md }}>
        {/* The title page: the name in the shloka face, large, over the limb's own hue. */}
        <BentoTile strong depth={null} glow={`${hue}55`} padding={SPACE.xl} radius={RADIUS.panel} style={{ alignItems: 'center', rowGap: SPACE.sm }}>
          <View style={styles.pills}>
            <HuePill label={`${t(guide.singular)} · ${t(S.gNumberOf(e.number, guide.count))}`} hue={guide.hue} />
            {e.group ? <HuePill label={e.group.label} hue={e.group.hue} /> : null}
            {isToday ? <HuePill label={t(S.gToday)} hue={guide.hue} solid /> : null}
          </View>
          <Animated.View entering={animate ? FadeIn.duration(420) : undefined} style={{ marginVertical: SPACE.sm }}>
            {id === 'tithis' ? <Moon3D phase={entryPhase(e)} size={96} /> : <IconTile icon={guide.icon} color={hue} />}
          </Animated.View>
          <Text
            accessibilityRole="header"
            maxFontSizeMultiplier={TITLE_FONT_CAP}
            style={{ color: palette.text, fontSize: 40, lineHeight: 64, fontFamily: SANSKRIT_FONT, textAlign: 'center' }}>
            {e.nameHi}
          </Text>
          <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.textSecondary, fontSize: TYPE.title3, fontWeight: '700', textAlign: 'center' }}>
            {e.name}
          </Text>
          <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.subhead, fontStyle: 'italic', textAlign: 'center' }}>
            {e.translit}
          </Text>
        </BentoTile>

        <FactGrid facts={e.facts} hue={guide.hue} />

        <KSection title={t(S.gMeaning)} hue={guide.hue}>
          <LangNote content="en" />
          <Para lang="en">{e.explanation}</Para>
          {e.focus ? <FocusNote label={t(S.gFocus)}>“{e.focus}”</FocusNote> : null}
        </KSection>

        {e.note ? (
          <KSection title={t(e.note.title)} hue="gold">
            <Para>{t(e.note.text)}</Para>
          </KSection>
        ) : null}

        {e.lists.map((l) => (
          <KSection key={l.title.en} title={t(l.title)} hue={guide.hue}>
            <Bullets items={l.items} />
          </KSection>
        ))}

        {e.vrata ? (
          <BentoTile
            depth={null}
            onPress={() => router.push({ pathname: '/explore/panchang', params: { vrata: e.vrata } })}
            accessibilityRole="link"
            accessibilityLabel={t(S.gUpcoming)}
            glow={`${hue}33`}
            style={{ flexDirection: 'row', alignItems: 'center', columnGap: SPACE.md }}>
            <IconTile icon="calendar" color={hue} />
            <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ flex: 1, color: palette.text, fontSize: TYPE.callout, fontWeight: '700' }}>
              {t(S.gUpcoming)}
            </Text>
            <Ionicons name="chevron-forward" size={18} color={palette.muted} />
          </BentoTile>
        ) : null}

        <GroupTitle title={t(guide.title)} />
        <BentoRow>
          <Step label={t(S.gPrev(lang === 'hi' ? prev.nameHi : prev.name))} icon="arrow-back" onPress={() => go(prev.slug)} />
          <Step label={t(S.gNext(lang === 'hi' ? next.nameHi : next.name))} icon="arrow-forward" end onPress={() => go(next.slug)} />
        </BentoRow>
      </Animated.ScrollView>
    </Backdrop>
  );
}

function entryPhase(e: LimbEntry): number {
  if (e.slug === 'amavasya') return 0;
  if (e.slug === 'purnima') return 0.5;
  return e.number / 30;
}

function Step({ label, icon, end, onPress }: { label: string; icon: 'arrow-back' | 'arrow-forward'; end?: boolean; onPress: () => void }) {
  const { palette } = usePrefs();
  return (
    <BentoTile depth={null} flex={1} onPress={onPress} accessibilityLabel={label} minHeight={64} style={{ flexDirection: end ? 'row-reverse' : 'row', alignItems: 'center', columnGap: SPACE.sm }}>
      <Ionicons name={icon} size={18} color={palette.accent} />
      <Text maxFontSizeMultiplier={TITLE_FONT_CAP} numberOfLines={2} style={{ flex: 1, color: palette.text, fontSize: TYPE.footnote, fontWeight: '700', textAlign: end ? 'right' : 'left' }}>
        {label}
      </Text>
    </BentoTile>
  );
}

const styles = StyleSheet.create({
  pills: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: SPACE.xs },
});
