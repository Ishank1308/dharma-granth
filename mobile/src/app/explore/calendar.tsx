import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack, type Href } from 'expo-router';
import { memo, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, SlideInLeft, SlideInRight } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Moon3D, phaseFromIllumination } from '@/components/art/moon';
import { MoonGlyph } from '@/components/art/moon-glyph';
import { BentoRow, BentoTile } from '@/components/bento';
import { CitySheet } from '@/components/city-sheet';
import { FaqList } from '@/components/guide-ui';
import { KSection, Para } from '@/components/knowledge-ui';
import { accentFill, Backdrop, Card, Chip, glass, GroupCard, GroupRow, GroupTitle, IconButton, IconTile, LargeHeader, Muted } from '@/components/ui';
import {
  calculateEducationalPanchang,
  festivalById,
  isoDate,
  todayForLocation,
  type FestivalDate,
  type LocationConfig,
  type PanchangDayData,
} from '@/content/explore';
import { FESTIVAL_DATES } from '@/content/generated/explore/festival-dates';
import {
  CALENDAR_FAQS,
  CALENDAR_FIRST_YEAR,
  CALENDAR_LAST_YEAR,
  CALENDAR_PRINCIPLES,
  daySlugs,
  LIMB_GUIDES,
  LIMB_IDS,
  MASA_SPANS,
  tithiMarkers,
  type DayMarker,
  type LimbId,
} from '@/content/panchang-guides';
import { S, useI18n, type Msg } from '@/i18n';
import { usePanchangCity } from '@/lib/panchang-city';
import { hapticSelect } from '@/motion/haptics';
import { useMotion } from '@/motion/use-motion';
import { usePrefs } from '@/state/app-state';
import { SANSKRIT_FONT } from '@/theme/fonts';
import { huesFor, quietFill, RADIUS, SPACE, TITLE_FONT_CAP, TOUCH, TYPE, UI_FONT_CAP, type Hues } from '@/theme/themes';

export { ErrorBoundary } from '@/components/error-boundary';

type Filter = 'all' | 'festival' | 'ekadashi' | 'pradosh' | 'moons';
const FILTERS: { id: Filter; label: Msg }[] = [
  { id: 'all', label: S.calAll },
  { id: 'festival', label: S.calFestivals },
  { id: 'ekadashi', label: S.vratEkadashi },
  { id: 'pradosh', label: S.vratPradosh },
  { id: 'moons', label: S.calMoons },
];

const MARKER_HUE: Record<DayMarker, keyof Hues> = {
  festival: 'lotus',
  ekadashi: 'tulsi',
  pradosh: 'peacock',
  purnima: 'gold',
  amavasya: 'indigo',
};
const MARKER_LABEL: Record<DayMarker, Msg> = {
  festival: S.calFestival,
  ekadashi: S.vratEkadashi,
  pradosh: S.vratPradosh,
  purnima: S.vratPurnima,
  amavasya: S.vratAmavasya,
};
const MARKER_VRATA: Partial<Record<DayMarker, string>> = { ekadashi: 'ekadashi', pradosh: 'pradosh', purnima: 'purnima', amavasya: 'amavasya' };

interface Day {
  day: number;
  iso: string;
  weekday: number;
  p: PanchangDayData;
  festivals: FestivalDate[];
  marks: DayMarker[];
}

const FESTIVALS_BY_DATE = (() => {
  const map = new Map<string, FestivalDate[]>();
  for (const f of FESTIVAL_DATES) map.set(f.date, [...(map.get(f.date) ?? []), f]);
  return map;
})();

/** Sunrise-ish at the city: 6 AM on its own clock, as the website calendar reckons each day's udaya tithi. */
function cityMorning(year: number, month: number, day: number, city: LocationConfig): Date {
  return new Date(Date.UTC(year, month, day, 6, 0, 0) - city.utcOffsetHours * 3_600_000);
}

function buildMonth(year: number, month: number, city: LocationConfig): Day[] {
  const count = new Date(year, month + 1, 0).getDate();
  const days: Day[] = [];
  for (let d = 1; d <= count; d++) {
    const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const p = calculateEducationalPanchang(cityMorning(year, month, d, city), city);
    const festivals = FESTIVALS_BY_DATE.get(iso) ?? [];
    days.push({ day: d, iso, weekday: new Date(year, month, d).getDay(), p, festivals, marks: tithiMarkers(p.tithi.number, festivals.length > 0) });
  }
  return days;
}

function matches(day: Day, filter: Filter): boolean {
  if (filter === 'all') return true;
  if (filter === 'moons') return day.marks.includes('purnima') || day.marks.includes('amavasya');
  return day.marks.includes(filter);
}

function clampToRange(iso: string): { year: number; month: number; iso: string; outside: boolean } {
  const year = Number(iso.slice(0, 4));
  if (year < CALENDAR_FIRST_YEAR) return { year: CALENDAR_FIRST_YEAR, month: 0, iso: `${CALENDAR_FIRST_YEAR}-01-01`, outside: true };
  if (year > CALENDAR_LAST_YEAR) return { year: CALENDAR_LAST_YEAR, month: 11, iso: `${CALENDAR_LAST_YEAR}-12-31`, outside: true };
  return { year, month: Number(iso.slice(5, 7)) - 1, iso, outside: false };
}

function monthName(year: number, month: number, lang: 'en' | 'hi'): string {
  try {
    return new Intl.DateTimeFormat(lang === 'hi' ? 'hi-IN' : 'en-IN', { month: 'long' }).format(new Date(year, month, 15));
  } catch {
    return String(month + 1);
  }
}

/**
 * The website's month calendar (/panchang/calendar/): every day of a month with its udaya tithi, nakshatra and
 * moon, the Ekadashi, Pradosh, Purnima, Amavasya and festival days marked and filterable, and the chosen day
 * opened below with its four limbs, sun and moon, festivals and vrat guides. Worked out on the phone for the
 * chosen city with the website's own calculation.
 */
export default function CalendarScreen() {
  const insets = useSafeAreaInsets();
  const { palette } = usePrefs();
  const { t, lang } = useI18n();
  const { animate } = useMotion();
  const hues = huesFor(palette);
  const [city, setCity] = usePanchangCity();
  const todayIso = isoDate(todayForLocation(city));
  const start = useMemo(() => clampToRange(todayIso), [todayIso]);
  const [year, setYear] = useState(start.year);
  const [month, setMonth] = useState(start.month);
  const [selected, setSelected] = useState(start.iso);
  const [filter, setFilter] = useState<Filter>('all');
  const [cityOpen, setCityOpen] = useState(false);
  const [dir, setDir] = useState<1 | -1>(1);
  const scroll = useRef<{ scrollTo: (o: { y: number; animated?: boolean }) => void } | null>(null);
  const inspectorY = useRef(0);

  const days = useMemo(() => buildMonth(year, month, city), [year, month, city]);
  const lead = new Date(year, month, 1).getDay();
  const day = days.find((d) => d.iso === selected) ?? days[0];
  const weekdays = t(S.calWeekdays).split(' ');
  const cityName = lang === 'hi' ? city.nameHi : city.name;
  const atStart = year === CALENDAR_FIRST_YEAR && month === 0;
  const atEnd = year === CALENDAR_LAST_YEAR && month === 11;

  const showMonth = (y: number, m: number, pick?: string) => {
    setDir(y * 12 + m >= year * 12 + month ? 1 : -1);
    setYear(y);
    setMonth(m);
    setSelected(pick ?? `${y}-${String(m + 1).padStart(2, '0')}-01`);
  };
  const step = (by: 1 | -1) => {
    const idx = year * 12 + month + by;
    const y = Math.floor(idx / 12);
    if (y < CALENDAR_FIRST_YEAR || y > CALENDAR_LAST_YEAR) return;
    hapticSelect();
    showMonth(y, idx % 12);
  };
  const pick = (iso: string) => {
    hapticSelect();
    setSelected(iso);
    // On a phone the chosen day opens below the grid: bring it into view, as the website does on mobile.
    requestAnimationFrame(() => scroll.current?.scrollTo({ y: Math.max(0, inspectorY.current - 72), animated: animate }));
  };

  const monthFestivals = days.filter((d) => d.festivals.length > 0);
  const entering = animate ? (dir > 0 ? SlideInRight : SlideInLeft).duration(260) : undefined;

  return (
    <Backdrop>
      <Stack.Screen options={{ title: '', headerTransparent: true, headerStyle: { backgroundColor: 'transparent' } }} />
      <Animated.ScrollView
        ref={scroll as never}
        style={{ backgroundColor: 'transparent' }}
        contentContainerStyle={{ paddingTop: insets.top + 56, paddingHorizontal: SPACE.lg, paddingBottom: insets.bottom + SPACE.xxl * 2, rowGap: SPACE.md }}>
        <LargeHeader title={S.calendarTitle} eyebrow={S.calendarEyebrow} />

        {start.outside ? (
          <Card>
            <Muted>{t(S.calRange)}</Muted>
          </Card>
        ) : null}

        {/* Month, steps, year, place and filters: the website's toolbar, in thumb reach. */}
        <View style={[styles.toolbar, glass(palette, true)]}>
          <View style={styles.monthRow}>
            <IconButton icon="chevron-back" onPress={() => step(-1)} accessibilityLabel={t(S.calPrevMonth)} color={atStart ? palette.muted : palette.text} />
            <View style={{ flex: 1, alignItems: 'center' }} accessible accessibilityRole="header" accessibilityLiveRegion="polite">
              <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.title2, fontWeight: '800' }}>
                {monthName(year, month, lang)} {year}
              </Text>
              <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.footnote }}>
                {MASA_SPANS[month]}
              </Text>
            </View>
            <IconButton icon="chevron-forward" onPress={() => step(1)} accessibilityLabel={t(S.calNextMonth)} color={atEnd ? palette.muted : palette.text} />
          </View>
          <View style={styles.yearRow}>
            <View accessibilityRole="radiogroup" accessibilityLabel={t(S.calYear)} style={styles.chips}>
              {Array.from({ length: CALENDAR_LAST_YEAR - CALENDAR_FIRST_YEAR + 1 }, (_, i) => CALENDAR_FIRST_YEAR + i).map((y) => (
                <Chip key={y} label={String(y)} active={y === year} onPress={() => showMonth(y, month)} />
              ))}
            </View>
            {selected !== todayIso && !start.outside ? <Chip label={t(S.backToToday)} onPress={() => showMonth(start.year, start.month, start.iso)} /> : null}
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t(S.calCity(cityName))}
            onPress={() => setCityOpen(true)}
            style={({ pressed }) => [styles.cityBtn, { backgroundColor: quietFill(palette) }, pressed && { opacity: 0.7 }]}>
            <Ionicons name="location" size={18} color={palette.accent} />
            <Text maxFontSizeMultiplier={TITLE_FONT_CAP} numberOfLines={1} style={{ flex: 1, color: palette.text, fontSize: TYPE.callout, fontWeight: '600' }}>
              {cityName}
            </Text>
            <Ionicons name="chevron-down" size={16} color={palette.muted} />
          </Pressable>
        </View>

        <View accessibilityRole="radiogroup" accessibilityLabel={t(S.calShow)} style={styles.chips}>
          {FILTERS.map((f) => (
            <Chip key={f.id} label={t(f.label)} active={filter === f.id} onPress={() => setFilter(f.id)} />
          ))}
        </View>

        {/* The month grid. */}
        <View style={[styles.gridCard, glass(palette, true)]}>
          <View style={styles.week} importantForAccessibility="no-hide-descendants">
            {weekdays.map((w, i) => (
              <Text key={w} maxFontSizeMultiplier={1.3} style={[styles.weekday, { color: i === 0 ? hues.vermilion : palette.muted }]}>
                {w}
              </Text>
            ))}
          </View>
          <Animated.View key={`${year}-${month}`} entering={entering} style={styles.grid}>
            {Array.from({ length: lead }, (_, i) => (
              <View key={`lead-${i}`} style={styles.cell} />
            ))}
            {days.map((d) => (
              <DayCell
                key={d.iso}
                d={d}
                selected={d.iso === day.iso}
                today={d.iso === todayIso}
                dim={!matches(d, filter)}
                label={dayLabel(d, lang, d.iso === todayIso, t)}
                onPress={pick}
              />
            ))}
          </Animated.View>
          <View style={styles.legend} importantForAccessibility="no-hide-descendants">
            {(Object.keys(MARKER_HUE) as DayMarker[]).map((k) => (
              <View key={k} style={styles.legendItem}>
                <View style={[styles.dot, { backgroundColor: hues[MARKER_HUE[k]] }]} />
                <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.caption }}>
                  {t(MARKER_LABEL[k])}
                </Text>
              </View>
            ))}
            <View style={styles.legendItem}>
              <MoonGlyph tithi={8} size={12} />
              <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.caption }}>
                {t(S.calMoonPhase)}
              </Text>
            </View>
          </View>
        </View>

        {/* The chosen day, opened. */}
        <View onLayout={(e) => (inspectorY.current = e.nativeEvent.layout.y)}>
          <Animated.View key={day.iso + city.id} entering={animate ? FadeIn.duration(220) : undefined}>
            <DayDetail d={day} year={year} month={month} cityName={cityName} />
          </Animated.View>
        </View>

        {monthFestivals.length ? (
          <>
            <GroupTitle title={t(S.calThisMonth)} />
            <GroupCard>
              {monthFestivals.flatMap((d) =>
                d.festivals.map((f, j) => {
                  const name = lang === 'hi' ? (f.nameHindi ?? f.name) : f.name;
                  return (
                    <GroupRow
                      key={`${d.iso}-${f.name}`}
                      standalone={d === monthFestivals[0] && j === 0}
                      inset={72}
                      highlight={d.iso === day.iso}
                      accessibilityLabel={`${d.day} ${monthName(year, month, lang)}, ${name}`}
                      onPress={() => pick(d.iso)}>
                      <View style={[styles.dateChip, { backgroundColor: `${hues.lotus}1f` }]}>
                        <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: hues.lotus, fontSize: TYPE.title3, fontWeight: '800' }}>
                          {d.day}
                        </Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.callout, fontWeight: '700' }}>
                          {name}
                        </Text>
                        <Muted style={{ fontSize: TYPE.caption, marginTop: 1 }}>
                          {weekdays[d.weekday]} · {lang === 'hi' ? d.p.tithi.nameHi : d.p.tithi.transliteration}
                        </Muted>
                      </View>
                      <Ionicons name="chevron-forward" size={18} color={palette.muted} />
                    </GroupRow>
                  );
                }),
              )}
            </GroupCard>
          </>
        ) : null}

        <GroupTitle title={t(S.guidesTitle)} />
        <View style={styles.guideGrid}>
          {LIMB_IDS.map((id) => (
            <View key={id} style={styles.guideCell}>
              <GuideTile id={id} />
            </View>
          ))}
        </View>

        <GroupTitle title={t(S.calPrinciples)} />
        {CALENDAR_PRINCIPLES.map((pr) => (
          <KSection key={pr.title.en} title={t(pr.title)} hue={pr.hue}>
            <Para>{t(pr.text)}</Para>
          </KSection>
        ))}

        {CALENDAR_FAQS.length ? (
          <>
            <GroupTitle title={t(S.gQuestions)} />
            <FaqList items={CALENDAR_FAQS} />
          </>
        ) : null}

        <Muted style={{ marginTop: SPACE.sm, fontSize: TYPE.caption }}>{t(S.panchangAccuracy)}</Muted>
      </Animated.ScrollView>

      <CitySheet
        visible={cityOpen}
        selected={city.id}
        onClose={() => setCityOpen(false)}
        onPick={(id) => {
          setCity(id);
          setCityOpen(false);
        }}
      />
    </Backdrop>
  );
}

function dayLabel(d: Day, lang: 'en' | 'hi', today: boolean, t: (m: Msg) => string): string {
  const date = new Intl.DateTimeFormat(lang === 'hi' ? 'hi-IN' : 'en-IN', { numberingSystem: 'latn', weekday: 'long', day: 'numeric', month: 'long' }).format(
    new Date(Number(d.iso.slice(0, 4)), Number(d.iso.slice(5, 7)) - 1, d.day, 12),
  );
  const extra = [
    today ? t(S.calTodayA11y) : '',
    ...d.festivals.map((f) => (lang === 'hi' ? (f.nameHindi ?? f.name) : f.name)),
    ...d.marks.filter((k) => k !== 'festival').map((k) => t(MARKER_LABEL[k])),
  ]
    .filter(Boolean)
    .join(', ');
  return t(
    S.calDayA11y(date, lang === 'hi' ? d.p.tithi.nameHi : d.p.tithi.transliteration, lang === 'hi' ? d.p.nakshatra.nameHi : d.p.nakshatra.transliteration, extra),
  );
}

/** One day of the grid: the date, the moon, the tithi in Devanagari, and a dot for each observance. */
const DayCell = memo(function DayCell({
  d,
  selected,
  today,
  dim,
  label,
  onPress,
}: {
  d: Day;
  selected: boolean;
  today: boolean;
  dim: boolean;
  label: string;
  onPress: (iso: string) => void;
}) {
  const { palette } = usePrefs();
  const hues = huesFor(palette);
  const ink = selected ? palette.bg : palette.text;
  return (
    <Pressable
      onPress={() => onPress(d.iso)}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.cell,
        styles.day,
        d.festivals.length > 0 && !selected && { backgroundColor: palette.dark ? 'rgba(244,114,182,0.12)' : 'rgba(190,24,93,0.06)' },
        selected && { backgroundColor: palette.text },
        today && !selected && { borderColor: palette.accent, borderWidth: 1.5 },
        dim && { opacity: 0.32 },
        pressed && !selected && { backgroundColor: quietFill(palette) },
      ]}>
      <View style={styles.dayHead}>
        <Text
          maxFontSizeMultiplier={1.3}
          style={{ color: d.weekday === 0 && !selected ? hues.vermilion : ink, fontSize: TYPE.callout, fontWeight: '800', fontVariant: ['tabular-nums'] }}>
          {d.day}
        </Text>
        <MoonGlyph tithi={d.p.tithi.number} size={12} />
      </View>
      <Text maxFontSizeMultiplier={1.2} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75} style={{ color: selected ? palette.bg : palette.muted, fontSize: 10 }}>
        {d.p.tithi.nameHi}
      </Text>
      <View style={styles.marks}>
        {d.marks.map((k) => (
          <View key={k} style={[styles.dotSm, { backgroundColor: hues[MARKER_HUE[k]] }]} />
        ))}
      </View>
    </Pressable>
  );
});

/** The chosen day: its moon and date, festivals, four limbs (each a door to its guide), sun and moon, and vrat guides. */
function DayDetail({ d, year, month, cityName }: { d: Day; year: number; month: number; cityName: string }) {
  const { palette } = usePrefs();
  const { t, lang } = useI18n();
  const hues = huesFor(palette);
  const p = d.p;
  const slugs = daySlugs(p);
  const guide = (limb: LimbId): Href => ({ pathname: '/explore/guide/[limb]/[slug]', params: { limb, slug: slugs[limb] } });
  const limbs: { limb: LimbId; label: Msg; meta: string; name: string; sub: string; hue: keyof Hues }[] = [
    { limb: 'tithis', label: S.limbTithi, meta: lang === 'hi' ? p.tithi.pakshaHi : p.tithi.paksha, name: p.tithi.nameHi, sub: p.tithi.transliteration, hue: 'indigo' },
    { limb: 'nakshatras', label: S.limbNakshatra, meta: t(S.pada(p.nakshatra.pada)), name: p.nakshatra.nameHi, sub: p.nakshatra.transliteration, hue: 'peacock' },
    { limb: 'yogas', label: S.limbYoga, meta: t(S.yogaNature(p.yoga.nature)), name: p.yoga.nameHi, sub: p.yoga.transliteration, hue: 'gold' },
    { limb: 'karanas', label: S.limbKarana, meta: p.karana.nature.split(' ')[0], name: p.karana.nameHi, sub: p.karana.transliteration, hue: 'lotus' },
  ];
  const stats: { icon: 'sunny' | 'moon' | 'compass' | 'time' | 'moon-outline'; label: Msg; value: string; hue: keyof Hues }[] = [
    { icon: 'sunny', label: S.sunrise, value: p.solarTimes.sunrise, hue: 'gold' },
    { icon: 'moon', label: S.sunset, value: p.solarTimes.sunset, hue: 'vermilion' },
    { icon: 'compass', label: S.solarNoon, value: p.solarTimes.solarNoon, hue: 'saffron' },
    { icon: 'time', label: S.dayLength, value: p.solarTimes.dayLength, hue: 'peacock' },
    { icon: 'moon-outline', label: S.calMoonlight, value: `${p.paksha.illuminationPercent}%`, hue: 'indigo' },
  ];
  const vrats = d.marks.filter((k) => MARKER_VRATA[k]);
  const dateTitle = `${d.day} ${monthName(year, month, lang)} ${year}`;
  return (
    <View style={{ rowGap: SPACE.md }}>
      <BentoTile strong depth={null} glow={palette.dark ? 'rgba(129,140,248,0.22)' : 'rgba(79,70,229,0.10)'} style={{ rowGap: SPACE.md }}>
        <View style={styles.dayTop}>
          <Moon3D phase={phaseFromIllumination(p.paksha.illuminationPercent, p.paksha.isWaxing)} size={64} />
          <View style={{ flex: 1 }}>
            <Text accessibilityRole="header" maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.title2, fontWeight: '800' }}>
              {dateTitle}
            </Text>
            <Muted style={{ fontSize: TYPE.footnote }}>
              {lang === 'hi' ? p.dayOfWeekHi : p.dayOfWeek} · {t(S.calSeason(lang === 'hi' ? p.ritu.nameHi : p.ritu.transliteration))} · {cityName}
            </Muted>
          </View>
        </View>
        <Pressable
          accessibilityRole="link"
          onPress={() => router.push({ pathname: '/explore/panchang', params: { date: d.iso } })}
          style={({ pressed }) => [styles.action, accentFill(palette), pressed && { opacity: 0.85 }]}>
          <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.onAccent, fontSize: TYPE.subhead, fontWeight: '700' }}>
            {t(S.calOpenDay)}
          </Text>
          <Ionicons name="arrow-forward" size={16} color={palette.onAccent} />
        </Pressable>
      </BentoTile>

      {d.festivals.map((f) => {
        const page = f.festivalId ? festivalById(f.festivalId) : undefined;
        const name = lang === 'hi' ? (f.nameHindi ?? f.name) : f.name;
        return (
          <BentoTile
            key={f.name}
            depth={null}
            onPress={page ? () => router.push({ pathname: '/explore/festivals/[id]', params: { id: page.id } }) : undefined}
            accessibilityRole={page ? 'link' : undefined}
            accessibilityLabel={page ? `${name}. ${t(S.calReadFestival)}` : name}
            glow={`${hues.lotus}40`}
            style={{ flexDirection: 'row', alignItems: 'center', columnGap: SPACE.md }}>
            <Text allowFontScaling={false} style={{ fontSize: 30 }}>
              {page?.icon ?? '🪔'}
            </Text>
            <View style={{ flex: 1 }}>
              <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.title3, fontWeight: '800' }}>
                {name}
              </Text>
              {lang === 'hi' && f.nameHindi ? <Muted style={{ fontSize: TYPE.footnote }}>{f.name}</Muted> : null}
              {f.note && lang === 'en' ? <Muted style={{ fontSize: TYPE.footnote, marginTop: 2 }}>{f.note}</Muted> : null}
              {page ? (
                <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: hues.lotus, fontSize: TYPE.footnote, fontWeight: '700', marginTop: 4 }}>
                  {t(S.calReadFestival)} →
                </Text>
              ) : null}
            </View>
          </BentoTile>
        );
      })}

      <BentoRow>
        <LimbTile {...limbs[0]} href={guide(limbs[0].limb)} />
        <LimbTile {...limbs[1]} href={guide(limbs[1].limb)} />
      </BentoRow>
      <BentoRow>
        <LimbTile {...limbs[2]} href={guide(limbs[2].limb)} />
        <LimbTile {...limbs[3]} href={guide(limbs[3].limb)} />
      </BentoRow>

      <View style={styles.stats}>
        {stats.map((s) => (
          <View key={s.label.en} accessible accessibilityLabel={`${t(s.label)}: ${s.value}`} style={[styles.stat, glass(palette)]}>
            <View style={styles.statHead}>
              <Ionicons name={s.icon} size={14} color={hues[s.hue]} />
              <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: hues[s.hue], fontSize: TYPE.caption, fontWeight: '700' }}>
                {t(s.label)}
              </Text>
            </View>
            <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.callout, fontWeight: '800', fontVariant: ['tabular-nums'] }}>
              {s.value}
            </Text>
          </View>
        ))}
      </View>

      {vrats.length ? (
        <GroupCard>
          {vrats.map((k, i) => (
            <GroupRow
              key={k}
              standalone={i === 0}
              inset={SPACE.lg}
              accessibilityRole="link"
              accessibilityLabel={t(S.calVrataDates(t(MARKER_LABEL[k])))}
              onPress={() => router.push({ pathname: '/explore/panchang', params: { vrata: MARKER_VRATA[k], date: d.iso } })}>
              <View style={[styles.dot, { backgroundColor: hues[MARKER_HUE[k]] }]} />
              <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ flex: 1, color: palette.text, fontSize: TYPE.callout, fontWeight: '600' }}>
                {t(S.calVrataDates(t(MARKER_LABEL[k])))}
              </Text>
              <Ionicons name="chevron-forward" size={18} color={palette.muted} />
            </GroupRow>
          ))}
        </GroupCard>
      ) : null}
    </View>
  );
}

function LimbTile({ label, meta, name, sub, hue, href }: { label: Msg; meta: string; name: string; sub: string; hue: keyof Hues; href: Href }) {
  const { palette } = usePrefs();
  const { t } = useI18n();
  const color = huesFor(palette)[hue];
  return (
    <BentoTile
      depth={null}
      flex={1}
      minHeight={128}
      onPress={() => router.push(href)}
      accessibilityRole="link"
      accessibilityLabel={`${t(label)}: ${name}, ${sub}. ${meta}`}
      glow={`${color}33`}
      style={{ rowGap: 2, justifyContent: 'space-between' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', columnGap: SPACE.xs }}>
        <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color, fontSize: TYPE.caption, fontWeight: '800' }}>
          {t(label)}
        </Text>
        <Text maxFontSizeMultiplier={UI_FONT_CAP} numberOfLines={1} style={{ flexShrink: 1, color: palette.muted, fontSize: TYPE.caption }}>
          {meta}
        </Text>
      </View>
      <View>
        <Text maxFontSizeMultiplier={TITLE_FONT_CAP} numberOfLines={1} adjustsFontSizeToFit style={{ color: palette.text, fontSize: TYPE.title3, fontFamily: SANSKRIT_FONT }}>
          {name}
        </Text>
        <Text maxFontSizeMultiplier={TITLE_FONT_CAP} numberOfLines={1} style={{ color: palette.textSecondary, fontSize: TYPE.footnote }}>
          {sub}
        </Text>
      </View>
      <Ionicons name="arrow-forward" size={14} color={color} />
    </BentoTile>
  );
}

function GuideTile({ id }: { id: LimbId }) {
  const { palette } = usePrefs();
  const { t } = useI18n();
  const g = LIMB_GUIDES[id];
  const color = huesFor(palette)[g.hue];
  return (
    <BentoTile
      depth={null}
      minHeight={104}
      onPress={() => router.push({ pathname: '/explore/guide/[limb]', params: { limb: id } })}
      accessibilityLabel={`${t(g.title)}. ${t(g.eyebrow)}`}
      glow={`${color}2e`}
      style={{ rowGap: SPACE.sm, justifyContent: 'space-between' }}>
      <IconTile icon={g.icon} color={color} />
      <View>
        <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.callout, fontWeight: '700' }}>
          {t(g.title)}
        </Text>
        <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.caption }}>
          {t(g.eyebrow)}
        </Text>
      </View>
    </BentoTile>
  );
}

const styles = StyleSheet.create({
  toolbar: { borderRadius: RADIUS.card, padding: SPACE.md, rowGap: SPACE.sm },
  monthRow: { flexDirection: 'row', alignItems: 'center' },
  yearRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: SPACE.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACE.sm },
  cityBtn: { flexDirection: 'row', alignItems: 'center', columnGap: SPACE.sm, minHeight: TOUCH, paddingHorizontal: SPACE.md, borderRadius: RADIUS.control },
  gridCard: { borderRadius: RADIUS.card, paddingVertical: SPACE.sm, paddingHorizontal: SPACE.xs, overflow: 'hidden' },
  week: { flexDirection: 'row', marginBottom: SPACE.xs },
  weekday: { width: `${100 / 7}%`, textAlign: 'center', fontSize: TYPE.caption, fontWeight: '700' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: `${100 / 7}%`, minHeight: 64, padding: 2 },
  day: { borderRadius: RADIUS.tile, paddingHorizontal: 3, paddingVertical: 4, justifyContent: 'space-between', borderWidth: 1.5, borderColor: 'transparent' },
  dayHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  marks: { flexDirection: 'row', columnGap: 2, minHeight: 6 },
  dotSm: { width: 6, height: 6, borderRadius: 3 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  legend: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', columnGap: SPACE.md, rowGap: SPACE.xs, marginTop: SPACE.sm, paddingHorizontal: SPACE.sm },
  legendItem: { flexDirection: 'row', alignItems: 'center', columnGap: 5 },
  dayTop: { flexDirection: 'row', alignItems: 'center', columnGap: SPACE.lg },
  action: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', columnGap: SPACE.sm, minHeight: TOUCH, borderRadius: RADIUS.pill },
  stats: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACE.sm },
  stat: { flexGrow: 1, flexBasis: '30%', borderRadius: RADIUS.row, padding: SPACE.md, rowGap: 2 },
  statHead: { flexDirection: 'row', alignItems: 'center', columnGap: 5 },
  dateChip: { width: 44, height: 44, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  guideGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -SPACE.xs },
  guideCell: { width: '50%', padding: SPACE.xs },
});
