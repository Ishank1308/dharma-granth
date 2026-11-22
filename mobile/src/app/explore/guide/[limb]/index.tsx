import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Moon3D } from '@/components/art/moon';
import { BentoDepth, BentoTile } from '@/components/bento';
import { FaqList, HuePill } from '@/components/guide-ui';
import { KSection, Para } from '@/components/knowledge-ui';
import { Backdrop, Chip, glass, GroupTitle, IconTile, LargeHeader, Muted } from '@/components/ui';
import { todayPanchang } from '@/content/explore';
import { daySlugs, isLimbId, isMostlyHindi, LIMB_GUIDES, LIMB_IDS, limbEntries, type LimbEntry, type LimbId } from '@/content/panchang-guides';
import { S, useI18n } from '@/i18n';
import { usePanchangCity } from '@/lib/panchang-city';
import { useScrollY } from '@/motion/parallax';
import { PressableScale } from '@/motion/pressable-scale';
import { useStagger } from '@/motion/stagger';
import { TitleBar } from '@/motion/title-bar';
import { usePrefs } from '@/state/app-state';
import { SANSKRIT_FONT } from '@/theme/fonts';
import { huesFor, RADIUS, SPACE, TITLE_FONT_CAP, TYPE, UI_FONT_CAP } from '@/theme/themes';

export { ErrorBoundary } from '@/components/error-boundary';

/**
 * One limb of the Panchang as a reference, after the website's /panchang/tithis/ (and nakshatras, yogas,
 * karanas, varas): what the limb is, today's entry lifted to the top, every entry as a glass tile in the
 * website's order, how the limb is reckoned, and the page's questions and answers.
 */
export default function LimbGuideScreen() {
  const { limb } = useLocalSearchParams<{ limb: string }>();
  const id: LimbId = isLimbId(limb) ? limb : 'tithis';
  const guide = LIMB_GUIDES[id];
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const { palette } = usePrefs();
  const { t, lang } = useI18n();
  const hues = huesFor(palette);
  const hue = hues[guide.hue];
  const [city] = usePanchangCity();
  const { scrollY, onScroll } = useScrollY();
  const depth = useMemo(() => ({ scrollY, windowHeight: height }), [scrollY, height]);
  const stagger = useStagger();

  const [now, setNow] = useState(() => new Date());
  useFocusEffect(useCallback(() => setNow(new Date()), []));
  const todaySlug = useMemo(() => daySlugs(todayPanchang(city, now))[id], [city, now, id]);
  const entries = limbEntries(id, lang);
  const today = entries.find((e) => e.slug === todaySlug);
  const open = (slug: string) => router.push({ pathname: '/explore/guide/[limb]/[slug]', params: { limb: id, slug } });

  return (
    <Backdrop>
      <Stack.Screen options={{ title: '', headerTransparent: true, headerStyle: { backgroundColor: 'transparent' } }} />
      <BentoDepth.Provider value={depth}>
        <Animated.ScrollView
          onScroll={onScroll}
          scrollEventThrottle={16}
          style={{ backgroundColor: 'transparent' }}
          contentContainerStyle={{ paddingTop: insets.top + 56, paddingHorizontal: SPACE.lg, paddingBottom: insets.bottom + SPACE.xxl * 2, rowGap: SPACE.md }}>
          <LargeHeader title={guide.title} eyebrow={guide.eyebrow} scrollY={scrollY} />
          {/* The five limbs side by side, as the website's limb switcher. */}
          <View accessibilityRole="radiogroup" style={styles.switcher}>
            {LIMB_IDS.map((l) => (
              <Chip
                key={l}
                label={t(LIMB_GUIDES[l].singular)}
                active={l === id}
                onPress={() => router.replace({ pathname: '/explore/guide/[limb]', params: { limb: l } })}
              />
            ))}
          </View>
          <Para muted>{t(guide.intro)}</Para>

          {today ? (
            <BentoTile
              strong
              onPress={() => open(today.slug)}
              accessibilityLabel={`${t(S.gTodayIs(lang === 'hi' ? today.nameHi : today.name))}. ${today.line}`}
              glow={`${hue}40`}
              style={{ flexDirection: 'row', alignItems: 'center', columnGap: SPACE.lg }}>
              {id === 'tithis' ? <Moon3D phase={todayMoonPhase(today)} size={64} /> : <IconTile icon={guide.icon} color={hue} />}
              <View style={{ flex: 1, rowGap: 2 }}>
                <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: hue, fontSize: TYPE.caption, fontWeight: '700' }}>
                  {t(S.gToday)} · {lang === 'hi' ? city.nameHi : city.name}
                </Text>
                <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.title2, fontFamily: SANSKRIT_FONT }}>
                  {today.nameHi}
                </Text>
                <Muted style={{ fontSize: TYPE.footnote }}>
                  {today.translit} · {today.line}
                </Muted>
              </View>
              <Ionicons name="chevron-forward" size={18} color={palette.muted} />
            </BentoTile>
          ) : null}

          {guide.groups ? (
            <>
              <GroupTitle title={t(S.gClasses)} />
              <View style={styles.groups}>
                {guide.groups.map((g) => (
                  <View key={g.members} accessible accessibilityLabel={`${t(g.name)}, ${t(S.gTithiNums(g.members))}. ${t(g.text)}`} style={[styles.group, glass(palette)]}>
                    <View style={[styles.groupBar, { backgroundColor: hues[g.hue] }]} />
                    <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: hues[g.hue], fontSize: TYPE.callout, fontWeight: '800' }}>
                      {t(g.name)}
                    </Text>
                    <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.caption, fontVariant: ['tabular-nums'] }}>
                      {t(S.gTithiNums(g.members))}
                    </Text>
                    <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.footnote }}>
                      {t(g.text)}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          ) : null}

          <GroupTitle title={t(guide.title)} detail={String(guide.count)} />
          <View style={styles.grid}>
            {entries.map((e, i) => (
              <Animated.View key={e.slug} entering={stagger(i)} style={styles.cell}>
                <EntryTile entry={e} today={e.slug === todaySlug} hueKey={guide.hue} onPress={() => open(e.slug)} />
              </Animated.View>
            ))}
          </View>

          {guide.foundations.length ? (
            <>
              <GroupTitle title={t(S.gFoundations)} />
              {guide.foundations.map((f) => (
                <KSection key={f.title.en} title={t(f.title)} hue={guide.hue}>
                  <Para>{t(f.text)}</Para>
                </KSection>
              ))}
            </>
          ) : null}

          {guide.faqs.length ? (
            <>
              <GroupTitle title={t(S.gQuestions)} />
              <FaqList items={guide.faqs} />
              {guide.faqs.some((f) => isMostlyHindi(f.a) !== (lang === 'hi')) ? (
                <Muted style={{ fontSize: TYPE.caption, paddingHorizontal: SPACE.xs }}>
                  {t(guide.faqs.some((f) => isMostlyHindi(f.a)) ? S.kHindiOnly : S.kEnglishOnly)}
                </Muted>
              ) : null}
            </>
          ) : null}
        </Animated.ScrollView>
      </BentoDepth.Provider>
      <TitleBar scrollY={scrollY} title={guide.title} />
    </Backdrop>
  );
}

/** The tithi archetype's moon: its Shukla day if it has one (Purnima is 15), otherwise its Krishna day. */
function todayMoonPhase(e: LimbEntry): number {
  if (e.slug === 'amavasya') return 0;
  if (e.slug === 'purnima') return 0.5;
  return e.number / 30;
}

function EntryTile({ entry, today, hueKey, onPress }: { entry: LimbEntry; today: boolean; hueKey: Parameters<typeof HuePill>[0]['hue']; onPress: () => void }) {
  const { palette } = usePrefs();
  const { t, lang } = useI18n();
  const hues = huesFor(palette);
  const hue = hues[hueKey];
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={t(S.gEntryA11y(entry.number, `${entry.name}, ${entry.nameHi}`, entry.line, today))}
      style={[styles.tile, glass(palette), today && { borderColor: hue, borderWidth: 1.5 }]}>
      <View style={styles.tileHead}>
        <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: hue, fontSize: TYPE.caption, fontWeight: '800', fontVariant: ['tabular-nums'] }}>
          #{entry.number}
        </Text>
        {today ? <HuePill label={t(S.gToday)} hue={hueKey} solid /> : entry.group ? <HuePill label={entry.group.label} hue={entry.group.hue} /> : null}
      </View>
      <Text maxFontSizeMultiplier={TITLE_FONT_CAP} numberOfLines={1} style={{ color: palette.text, fontSize: TYPE.title3, fontFamily: SANSKRIT_FONT, marginTop: SPACE.xs }}>
        {entry.nameHi}
      </Text>
      <Text maxFontSizeMultiplier={TITLE_FONT_CAP} numberOfLines={1} style={{ color: palette.textSecondary, fontSize: TYPE.footnote, fontWeight: '600' }}>
        {lang === 'hi' ? entry.translit : entry.name}
      </Text>
      <Text maxFontSizeMultiplier={UI_FONT_CAP} numberOfLines={2} style={{ color: palette.muted, fontSize: TYPE.caption, marginTop: 2 }}>
        {entry.line}
      </Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  switcher: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACE.sm },
  groups: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACE.sm },
  group: { flexGrow: 1, flexBasis: '30%', borderRadius: RADIUS.row, padding: SPACE.md, paddingTop: SPACE.md + 4, rowGap: 2, overflow: 'hidden' },
  groupBar: { position: 'absolute', top: 0, left: 0, right: 0, height: 3 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -SPACE.xs },
  cell: { width: '50%', padding: SPACE.xs },
  tile: { borderRadius: RADIUS.row, padding: SPACE.md, minHeight: 132, overflow: 'hidden' },
  tileHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', columnGap: SPACE.xs },
});
