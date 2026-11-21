import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useFocusEffect, type Href } from 'expo-router';
import { useCallback, useMemo, useState, type ComponentProps } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Moon3D, phaseFromIllumination } from '@/components/art/moon';
import { Backdrop, glass, GroupCard, GroupRow, GroupTitle, IconTile, LargeHeader } from '@/components/ui';
import { daysBetween, festivalById, formatDay, todayPanchang, upcomingFestivals } from '@/content/explore';
import { S, useI18n, type Msg } from '@/i18n';
import { usePanchangCity } from '@/lib/panchang-city';
import { useAppState } from '@/state/app-state';
import { barClearance, huesFor, RADIUS, SPACE, TITLE_FONT_CAP, TYPE } from '@/theme/themes';

type IconName = ComponentProps<typeof Ionicons>['name'];

/**
 * The Explore tab: today's Panchang at a glance, the next festival, and the doors to the website's calendar,
 * festival and mantra pages, as dharmagranth.dev's Panchang and Festivals sections. Other features (knowledge,
 * wisdom, plans) add their rows to the Study group.
 */
export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const { palette } = useAppState();
  const { t, lang } = useI18n();
  const hues = huesFor(palette);
  const [city] = usePanchangCity();

  // Recompute when the tab comes back into view, so a phone left open overnight shows the new day.
  const [now, setNow] = useState(() => new Date());
  useFocusEffect(useCallback(() => setNow(new Date()), []));
  const today = useMemo(() => todayPanchang(city, now), [city, now]);
  const next = upcomingFestivals(today.isoDate, 1)[0];

  const calendar: Row[] = [
    { title: S.panchangTitle, detail: S.panchangRow, icon: 'sunny', color: hues.saffron, href: '/explore/panchang' },
    { title: S.festivalsTitle, detail: S.festivalsRow, icon: 'sparkles', color: hues.lotus, href: '/explore/festivals' },
  ];
  const study: Row[] = [
    { title: S.mantrasTitle, detail: S.mantrasRow, icon: 'musical-notes', color: hues.indigo, href: '/explore/mantras' },
    { title: S.knowledgeTitle, detail: S.knowledgeEntryDetail, icon: 'library', color: hues.peacock, href: '/knowledge' },
    { title: S.wisdomTitle, detail: S.wisdomEntryDetail, icon: 'leaf', color: hues.tulsi, href: '/wisdom' },
    // Plans, journal and quizzes add their rows here as those screens land.
  ];

  const cityName = lang === 'hi' ? today.location.nameHi : today.location.name;
  const tithiName = lang === 'hi' ? today.tithi.nameHi : today.tithi.transliteration;

  return (
    <Backdrop>
      <ScrollView
        style={{ backgroundColor: 'transparent' }}
        contentContainerStyle={{ paddingTop: insets.top, paddingHorizontal: SPACE.lg, paddingBottom: barClearance(insets.bottom) }}>
        <LargeHeader title={S.exploreTitle} eyebrow={S.exploreEyebrow} />

        {/* Today, as the website's Panchang hero: the moon, the tithi and the day's limbs. */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${t(S.openPanchangA11y)}. ${tithiName}, ${lang === 'hi' ? today.paksha.nameHi : today.paksha.transliteration}`}
          onPress={() => router.push('/explore/panchang')}
          style={({ pressed }) => [styles.hero, glass(palette, true), pressed && { transform: [{ scale: 0.985 }] }]}>
          <View style={styles.heroTop}>
            <Moon3D phase={phaseFromIllumination(today.paksha.illuminationPercent, today.paksha.isWaxing)} size={60} />
            <View style={{ flex: 1 }}>
              <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.accent, fontSize: TYPE.caption, fontWeight: '700', letterSpacing: lang === 'hi' ? 0 : 0.5 }}>
                {lang === 'hi' ? t(S.todayAt(cityName)) : t(S.todayAt(cityName)).toUpperCase()}
              </Text>
              <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.title2, fontWeight: '800', marginTop: 2 }}>
                {tithiName}
              </Text>
              <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.footnote, marginTop: 2 }}>
                {lang === 'hi' ? today.paksha.nameHi : today.paksha.transliteration} · {lang === 'hi' ? today.fullDateHindi : today.fullDateEnglish}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={palette.muted} />
          </View>
          <View style={styles.facts}>
            <Fact label={t(S.limbNakshatra)} value={lang === 'hi' ? today.nakshatra.nameHi : today.nakshatra.transliteration} color={hues.indigo} />
            <Fact label={t(S.limbYoga)} value={lang === 'hi' ? today.yoga.nameHi : today.yoga.transliteration} color={hues.peacock} />
            <Fact label={t(S.sunrise)} value={today.solarTimes.sunrise} color={hues.gold} />
            <Fact label={t(S.sunset)} value={today.solarTimes.sunset} color={hues.vermilion} />
          </View>
        </Pressable>

        {next ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${t(S.nextFestival)}: ${t(S.festivalA11y(lang === 'hi' ? (next.nameHindi ?? next.name) : next.name, formatDay(next.date, lang)))}`}
            onPress={() =>
              next.festivalId && festivalById(next.festivalId)
                ? router.push({ pathname: '/explore/festivals/[id]', params: { id: next.festivalId } })
                : router.push('/explore/festivals')
            }
            style={({ pressed }) => [styles.next, glass(palette), pressed && { opacity: 0.85 }]}>
            <View style={[styles.nextIcon, { backgroundColor: palette.dark ? 'rgba(244,114,182,0.16)' : 'rgba(190,24,93,0.10)' }]}>
              <Text allowFontScaling={false} style={{ fontSize: 22 }}>
                {(next.festivalId && festivalById(next.festivalId)?.icon) || '🪔'}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.caption, fontWeight: '600' }}>
                {t(S.nextFestival)} · {t(S.inDays(daysBetween(today.isoDate, next.date)))}
              </Text>
              <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.callout, fontWeight: '700' }}>
                {lang === 'hi' ? (next.nameHindi ?? next.name) : next.name}
              </Text>
            </View>
            <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.accent, fontSize: TYPE.footnote, fontWeight: '700' }}>
              {formatDay(next.date, lang, false)}
            </Text>
          </Pressable>
        ) : null}

        <GroupTitle title={t(S.exploreCalendar)} />
        <Rows rows={calendar} />
        <GroupTitle title={t(S.exploreStudy)} />
        <Rows rows={study} />
      </ScrollView>
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

function Rows({ rows }: { rows: Row[] }) {
  const { palette } = useAppState();
  const { t } = useI18n();
  return (
    <GroupCard>
      {rows.map((row, i) => (
        <GroupRow key={t(row.title)} standalone={i === 0} accessibilityLabel={`${t(row.title)}. ${t(row.detail)}`} onPress={() => router.push(row.href)}>
          <IconTile icon={row.icon} color={row.color} />
          <View style={{ flex: 1 }}>
            <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.body, fontWeight: '600' }}>
              {t(row.title)}
            </Text>
            <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.footnote, marginTop: 1 }}>
              {t(row.detail)}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={palette.muted} />
        </GroupRow>
      ))}
    </GroupCard>
  );
}

function Fact({ label, value, color }: { label: string; value: string; color: string }) {
  const { palette } = useAppState();
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
  hero: { borderRadius: RADIUS.panel, padding: SPACE.lg, rowGap: SPACE.lg },
  heroTop: { flexDirection: 'row', alignItems: 'center', columnGap: SPACE.lg },
  facts: { flexDirection: 'row', flexWrap: 'wrap', rowGap: SPACE.md },
  fact: { width: '50%', flexDirection: 'row', alignItems: 'flex-start', columnGap: SPACE.sm, paddingRight: SPACE.sm },
  factDot: { width: 8, height: 8, borderRadius: 4, marginTop: 5 },
  next: {
    marginTop: SPACE.md,
    borderRadius: RADIUS.card,
    paddingVertical: SPACE.md,
    paddingHorizontal: SPACE.lg,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: SPACE.md,
    minHeight: 64,
  },
  nextIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
});
