import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useFocusEffect, type Href } from 'expo-router';
import { useCallback, useMemo, useState, type ComponentProps } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Moon3D, phaseFromIllumination } from '@/components/art/moon';
import { useTabTop } from '@/lib/use-tab-top';
import { BentoCol, BentoDepth, BentoRow, BentoTile } from '@/components/bento';
import { Backdrop, GroupTitle, IconTile, LargeHeader } from '@/components/ui';
import { daysBetween, festivalById, formatDay, todayPanchang, upcomingFestivals } from '@/content/explore';
import { useScrollY } from '@/motion/parallax';
import { TitleBar } from '@/motion/title-bar';
import { S, useI18n, type Msg } from '@/i18n';
import { usePanchangCity } from '@/lib/panchang-city';
import { usePrefs } from '@/state/app-state';
import { barClearance, huesFor, SPACE, TITLE_FONT_CAP, TYPE } from '@/theme/themes';

export { ErrorBoundary } from '@/components/error-boundary';

type IconName = ComponentProps<typeof Ionicons>['name'];

/**
 * The Explore tab: today's Panchang at a glance, the next festival, and the doors to the website's calendar,
 * festival and mantra pages, as dharmagranth.dev's Panchang and Festivals sections, laid out as an asymmetric
 * bento of glass tiles (src/components/bento.tsx). Other features add their tiles to the Study group.
 */
export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const topRef = useTabTop();
  const { height } = useWindowDimensions();
  const { palette } = usePrefs();
  const { t, lang } = useI18n();
  const hues = huesFor(palette);
  const [city] = usePanchangCity();
  const { scrollY, onScroll } = useScrollY();
  const depth = useMemo(() => ({ scrollY, windowHeight: height }), [scrollY, height]);

  // Recompute when the tab comes back into view, so a phone left open overnight shows the new day.
  const [now, setNow] = useState(() => new Date());
  useFocusEffect(useCallback(() => setNow(new Date()), []));
  const today = useMemo(() => todayPanchang(city, now), [city, now]);
  const next = upcomingFestivals(today.isoDate, 1)[0];

  const cityName = lang === 'hi' ? today.location.nameHi : today.location.name;
  const tithiName = lang === 'hi' ? today.tithi.nameHi : today.tithi.transliteration;
  const paksha = lang === 'hi' ? today.paksha.nameHi : today.paksha.transliteration;
  const nextName = next ? (lang === 'hi' ? (next.nameHindi ?? next.name) : next.name) : '';
  const nextIcon = (next?.festivalId && festivalById(next.festivalId)?.icon) || '🪔';

  return (
    <Backdrop>
      <BentoDepth.Provider value={depth}>
        <Animated.ScrollView
          ref={topRef as never}
          onScroll={onScroll}
          scrollEventThrottle={16}
          style={{ backgroundColor: 'transparent' }}
          contentContainerStyle={{ paddingTop: insets.top, paddingHorizontal: SPACE.lg, paddingBottom: barClearance(insets.bottom), rowGap: SPACE.md }}>
          <LargeHeader title={S.exploreTitle} eyebrow={S.exploreEyebrow} scrollY={scrollY} />

          {/* Today, as a bento: the Panchang tall on the left (the website's Panchang hero), the next festival
              and the festival calendar stacked beside it. */}
          <BentoRow>
            <BentoTile
              flex={1.3}
              strong
              minHeight={300}
              accessibilityLabel={`${t(S.openPanchangA11y)}. ${tithiName}, ${paksha}`}
              onPress={() => router.push('/explore/panchang')}
              glow={palette.dark ? 'rgba(129,140,248,0.22)' : 'rgba(79,70,229,0.10)'}
              style={{ rowGap: SPACE.md, justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <Moon3D phase={phaseFromIllumination(today.paksha.illuminationPercent, today.paksha.isWaxing)} size={64} />
                <Ionicons name="chevron-forward" size={18} color={palette.muted} />
              </View>
              <View>
                <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.accent, fontSize: TYPE.caption, fontWeight: '700', letterSpacing: lang === 'hi' ? 0 : 0.5 }}>
                  {lang === 'hi' ? t(S.todayAt(cityName)) : t(S.todayAt(cityName)).toUpperCase()}
                </Text>
                <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.title2, fontWeight: '800', marginTop: 2 }}>
                  {tithiName}
                </Text>
                <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.footnote, marginTop: 2 }}>
                  {paksha} · {lang === 'hi' ? today.fullDateHindi : today.fullDateEnglish}
                </Text>
              </View>
              <View style={styles.facts}>
                <Fact label={t(S.limbNakshatra)} value={lang === 'hi' ? today.nakshatra.nameHi : today.nakshatra.transliteration} color={hues.indigo} />
                <Fact label={t(S.limbYoga)} value={lang === 'hi' ? today.yoga.nameHi : today.yoga.transliteration} color={hues.peacock} />
                <Fact label={t(S.sunrise)} value={today.solarTimes.sunrise} color={hues.gold} />
                <Fact label={t(S.sunset)} value={today.solarTimes.sunset} color={hues.vermilion} />
              </View>
            </BentoTile>
            <BentoCol>
              {next ? (
                <BentoTile
                  flex={1}
                  accessibilityLabel={`${t(S.nextFestival)}: ${t(S.festivalA11y(nextName, formatDay(next.date, lang)))}`}
                  onPress={() =>
                    next.festivalId && festivalById(next.festivalId)
                      ? router.push({ pathname: '/explore/festivals/[id]', params: { id: next.festivalId } })
                      : router.push('/explore/festivals')
                  }
                  glow={palette.dark ? 'rgba(244,114,182,0.20)' : 'rgba(219,39,119,0.10)'}
                  style={{ rowGap: SPACE.xs, justifyContent: 'space-between' }}>
                  <Text allowFontScaling={false} style={{ fontSize: 26 }}>
                    {nextIcon}
                  </Text>
                  <View>
                    <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.caption, fontWeight: '600' }}>
                      {t(S.inDays(daysBetween(today.isoDate, next.date)))}
                    </Text>
                    <Text maxFontSizeMultiplier={TITLE_FONT_CAP} numberOfLines={3} style={{ color: palette.text, fontSize: TYPE.callout, fontWeight: '800' }}>
                      {nextName}
                    </Text>
                    <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.accent, fontSize: TYPE.caption, fontWeight: '700', marginTop: 2 }}>
                      {formatDay(next.date, lang, false)}
                    </Text>
                  </View>
                </BentoTile>
              ) : null}
              <Tile row={{ title: S.festivalsTitle, detail: S.festivalsRow, icon: 'sparkles', color: hues.lotus, href: '/explore/festivals' }} />
            </BentoCol>
          </BentoRow>

          <GroupTitle title={t(S.exploreStudy)} />
          <BentoRow>
            <Tile row={{ title: S.mantrasTitle, detail: S.mantrasRow, icon: 'musical-notes', color: hues.indigo, href: '/explore/mantras' }} />
            <Tile flex={1.4} row={{ title: S.knowledgeTitle, detail: S.knowledgeEntryDetail, icon: 'library', color: hues.peacock, href: '/knowledge' }} />
          </BentoRow>
          <Tile wide row={{ title: S.wisdomTitle, detail: S.wisdomEntryDetail, icon: 'leaf', color: hues.tulsi, href: '/wisdom' }} />
          {/* The website's story mode, wisdom pathways and verse network. */}
          <BentoRow>
            <Tile flex={1.3} row={{ title: S.storyTitle, detail: S.storyEntryDetail, icon: 'people', color: hues.saffron, href: '/story' }} />
            <Tile row={{ title: S.pathwaysTitle, detail: S.pathwaysEntryDetail, icon: 'trail-sign', color: hues.gold, href: '/pathways' }} />
          </BentoRow>
          <Tile wide row={{ title: S.networkTitle, detail: S.networkEntryDetail, icon: 'git-network', color: hues.indigo, href: '/network' }} />
          {/* Plans and journal add their tiles here as those screens land. */}
        </Animated.ScrollView>
      </BentoDepth.Provider>
      <TitleBar scrollY={scrollY} title={S.exploreTitle} />
    </Backdrop>
  );
}

interface Row {
  title: Msg;
  detail: Msg;
  icon: IconName;
  color: string;
  href: Href;
}

/** A doorway as a bento tile: the hue's icon, title and a line, with that hue pooling at its foot. */
function Tile({ row, flex = 1, wide }: { row: Row; flex?: number; wide?: boolean }) {
  const { palette } = usePrefs();
  const { t } = useI18n();
  return (
    <BentoTile
      flex={wide ? undefined : flex}
      minHeight={wide ? 88 : 132}
      accessibilityLabel={`${t(row.title)}. ${t(row.detail)}`}
      onPress={() => router.push(row.href)}
      glow={`${row.color}2e`}
      style={wide ? { flexDirection: 'row', alignItems: 'center', columnGap: SPACE.md } : { justifyContent: 'space-between', rowGap: SPACE.md }}>
      <IconTile icon={row.icon} color={row.color} />
      <View style={wide ? { flex: 1 } : null}>
        <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.body, fontWeight: '700' }}>
          {t(row.title)}
        </Text>
        <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.footnote, marginTop: 1 }}>
          {t(row.detail)}
        </Text>
      </View>
      {wide ? <Ionicons name="chevron-forward" size={18} color={palette.muted} /> : null}
    </BentoTile>
  );
}

function Fact({ label, value, color }: { label: string; value: string; color: string }) {
  const { palette } = usePrefs();
  return (
    <View style={styles.fact}>
      <View style={[styles.factDot, { backgroundColor: color }]} />
      <View style={{ flexShrink: 1 }}>
        <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.caption }}>
          {label}
        </Text>
        <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.subhead, fontWeight: '700' }}>
          {value}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  facts: { rowGap: SPACE.sm },
  fact: { flexDirection: 'row', alignItems: 'flex-start', columnGap: SPACE.sm },
  factDot: { width: 8, height: 8, borderRadius: 4, marginTop: 5 },
});
