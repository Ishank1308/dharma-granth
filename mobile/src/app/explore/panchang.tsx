import Ionicons from '@expo/vector-icons/Ionicons';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { router, Stack, useLocalSearchParams, type Href } from 'expo-router';
import { useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Moon3D, phaseFromIllumination } from '@/components/art/moon';
import { SkyArc, useCityMinute } from '@/components/art/sky-arc';
import { CitySheet } from '@/components/city-sheet';
import { Backdrop, Card, Chip, glass, GroupCard, GroupRow, GroupTitle, IconButton, LargeHeader, Muted } from '@/components/ui';
import {
  addDays,
  calculateEducationalPanchang,
  formatDay,
  formatPanchangClock,
  fromIso,
  isoDate,
  rahuAbhijit,
  todayForLocation,
  upcomingVrats,
  VRATA_KINDS,
  type PanchangDayData,
  type VrataKind,
} from '@/content/explore';
import { daySlugs, type LimbId } from '@/content/panchang-guides';
import { S, useI18n, type Msg } from '@/i18n';
import { usePanchangCity } from '@/lib/panchang-city';
import { usePrefs } from '@/state/app-state';
import { fontCap, huesFor, quietFill, RADIUS, SPACE, TITLE_FONT_CAP, TOUCH, TYPE } from '@/theme/themes';

export { ErrorBoundary } from '@/components/error-boundary';

const VRATA_LABEL: Record<VrataKind, Msg> = {
  ekadashi: S.vratEkadashi,
  purnima: S.vratPurnima,
  amavasya: S.vratAmavasya,
  pradosh: S.vratPradosh,
};

/**
 * The day's Panchang for a chosen city and date, worked out on the phone with the website's own calculation
 * (lib/panchang.ts): tithi with the moon, the five limbs with their meanings, sunrise and the muhurtas, and the
 * next Ekadashi, Purnima, Amavasya and Pradosh dates from the website's vrat tables.
 */
export default function PanchangScreen() {
  const insets = useSafeAreaInsets();
  const { palette, settings } = usePrefs();
  const { t, lang } = useI18n();
  const hues = huesFor(palette);
  const [city, setCity] = usePanchangCity();
  // The month calendar and the tithi guides open this screen on a day (?date=YYYY-MM-DD) or a vrat (?vrata=…).
  const params = useLocalSearchParams<{ date?: string; vrata?: string }>();
  const [picked, setPicked] = useState<Date | null>(() => (params.date && /^\d{4}-\d{2}-\d{2}$/.test(params.date) ? fromIso(params.date) : null));
  const [cityOpen, setCityOpen] = useState(false);
  const [vrata, setVrata] = useState<VrataKind>(() => (VRATA_KINDS as string[]).includes(params.vrata ?? '') ? (params.vrata as VrataKind) : 'ekadashi');

  const today = todayForLocation(city);
  const day = picked ?? today;
  const isToday = isoDate(day) === isoDate(today);
  const p = useMemo(() => calculateEducationalPanchang(day, city), [day, city]);
  const muhurta = rahuAbhijit(p);
  const slugs = daySlugs(p);
  const guide = (limb: LimbId): Href => ({ pathname: '/explore/guide/[limb]/[slug]', params: { limb, slug: slugs[limb] } });
  const nowMinute = useCityMinute(city.utcOffsetHours);
  const skyLabel = !muhurta
    ? S.skyDayA11y(p.solarTimes.sunrise, p.solarTimes.sunset)
    : !isToday
      ? S.skyDayA11y(p.solarTimes.sunrise, p.solarTimes.sunset)
      : nowMinute < muhurta.sunriseMinute || nowMinute > muhurta.sunsetMinute
        ? S.skyNightA11y(p.solarTimes.sunrise, p.solarTimes.sunset)
        : S.skyNowA11y(
            Math.round(((nowMinute - muhurta.sunriseMinute) / Math.max(1, muhurta.sunsetMinute - muhurta.sunriseMinute)) * 100),
            p.solarTimes.sunrise,
            p.solarTimes.sunset,
          );

  const pickDate = () => {
    if (Platform.OS !== 'android') return;
    DateTimePickerAndroid.open({
      mode: 'date',
      value: day,
      minimumDate: new Date(1950, 0, 1),
      maximumDate: new Date(2100, 11, 31),
      onValueChange: (_e, d) => {
        if (d) setPicked(new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0));
      },
    });
  };

  const cityName = lang === 'hi' ? city.nameHi : city.name;
  const dateLabel = lang === 'hi' ? p.fullDateHindi : p.fullDateEnglish;

  return (
    <Backdrop>
      <Stack.Screen options={{ title: '', headerTransparent: true, headerStyle: { backgroundColor: 'transparent' } }} />
      <ScrollView
        style={{ backgroundColor: 'transparent' }}
        contentContainerStyle={{ paddingTop: insets.top + 56, paddingHorizontal: SPACE.lg, paddingBottom: insets.bottom + SPACE.xxl * 2 }}>
        <LargeHeader title={S.panchangTitle} eyebrow={S.panchangEyebrow} />

        {/* Where and when: the city, and the day with one-tap steps either side, all within thumb reach. */}
        <View style={[styles.controls, glass(palette, true)]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t(S.cityA11y(cityName))}
            onPress={() => setCityOpen(true)}
            style={({ pressed }) => [styles.cityBtn, { backgroundColor: quietFill(palette) }, pressed && { opacity: 0.7 }]}>
            <Ionicons name="location" size={18} color={palette.accent} />
            <Text maxFontSizeMultiplier={TITLE_FONT_CAP} numberOfLines={1} style={{ flex: 1, color: palette.text, fontSize: TYPE.callout, fontWeight: '600' }}>
              {cityName}
            </Text>
            <Ionicons name="chevron-down" size={16} color={palette.muted} />
          </Pressable>
          <View style={styles.dateRow}>
            <IconButton icon="chevron-back" onPress={() => setPicked(addDays(day, -1))} accessibilityLabel={t(S.previousDay)} color={palette.text} />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t(S.pickDateA11y(dateLabel))}
              onPress={pickDate}
              style={({ pressed }) => [styles.dateBtn, pressed && { opacity: 0.7 }]}>
              <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.callout, fontWeight: '700', textAlign: 'center' }}>
                {dateLabel}
              </Text>
            </Pressable>
            <IconButton icon="chevron-forward" onPress={() => setPicked(addDays(day, 1))} accessibilityLabel={t(S.nextDay)} color={palette.text} />
          </View>
          {!isToday ? (
            <View style={{ alignItems: 'center' }}>
              <Chip label={t(S.backToToday)} onPress={() => setPicked(null)} />
            </View>
          ) : null}
        </View>

        <MoonCard p={p} />

        <GroupTitle title={t(S.fiveLimbs)} detail={cityName} />
        <GroupCard>
          <Limb
            first
            label={S.limbTithi}
            color={hues.saffron}
            name={p.tithi.transliteration}
            nameHi={p.tithi.nameHi}
            badge={`#${p.tithi.number}`}
            meaning={p.tithi.meta.explanation}
            href={guide('tithis')}
          />
          <Limb
            label={S.limbPaksha}
            color={hues.gold}
            name={p.paksha.transliteration}
            nameHi={p.paksha.nameHi}
            badge={t(S.illumination(p.paksha.illuminationPercent))}
            meaning={p.paksha.explanation}
          />
          <Limb
            label={S.limbNakshatra}
            color={hues.indigo}
            name={p.nakshatra.transliteration}
            nameHi={p.nakshatra.nameHi}
            badge={t(S.pada(p.nakshatra.pada))}
            extra={t(S.deityLord(p.nakshatra.deity, p.nakshatra.rulingPlanet))}
            meaning={p.nakshatra.explanation}
            href={guide('nakshatras')}
          />
          <Limb
            label={S.limbYoga}
            color={hues.peacock}
            name={p.yoga.transliteration}
            nameHi={p.yoga.nameHi}
            badge={t(S.yogaNature(p.yoga.nature))}
            badgeTone={p.yoga.nature === 'Auspicious' ? hues.tulsi : p.yoga.nature === 'Neutral' ? hues.indigo : hues.gold}
            meaning={p.yoga.explanation}
            href={guide('yogas')}
          />
          <Limb
            label={S.limbKarana}
            color={hues.lotus}
            name={p.karana.transliteration}
            nameHi={p.karana.nameHi}
            badge={p.karana.nature.split(' ')[0]}
            meaning={p.karana.explanation}
            href={guide('karanas')}
          />
          <Limb
            label={S.limbVara}
            color={hues.vermilion}
            name={p.vara.transliteration}
            nameHi={p.vara.nameHi}
            badge={lang === 'hi' ? p.vara.grahaLordHi : p.vara.grahaLord}
            meaning={p.vara.explanation}
            href={guide('varas')}
          />
          <Limb
            label={S.limbRitu}
            color={hues.tulsi}
            name={p.ritu.transliteration}
            nameHi={`${p.ritu.nameHi} ऋतु`}
            badge={p.ritu.seasonEn}
            extra={p.ritu.months}
            meaning={`${p.ritu.explanation} ${p.ritu.spiritualFocus}`}
          />
        </GroupCard>

        <GroupTitle title={t(S.sunAndMuhurta)} />
        {muhurta ? (
          <>
            <View style={styles.tiles}>
              <Tile icon="sunny" color={hues.gold} label={t(S.sunrise)} value={p.solarTimes.sunrise} />
              <Tile icon="moon" color={hues.vermilion} label={t(S.sunset)} value={p.solarTimes.sunset} />
              <Tile icon="time" color={hues.indigo} label={t(S.dayLength)} value={p.solarTimes.dayLength} />
              <Tile icon="compass" color={hues.lotus} label={t(S.solarNoon)} value={p.solarTimes.solarNoon} />
            </View>
            {/* The sun's path across the day, then the daylight as one bar, sunrise to sunset, as on the website's muhurta page. */}
            <Card strong style={{ marginTop: SPACE.md, rowGap: SPACE.md }}>
              <SkyArc
                sunriseMinute={muhurta.sunriseMinute}
                sunsetMinute={muhurta.sunsetMinute}
                nowMinute={isToday ? nowMinute : null}
                accessibilityLabel={t(skyLabel)}
              />
              <View accessible={false} importantForAccessibility="no-hide-descendants">
                <View style={[styles.dayBar, { backgroundColor: palette.dark ? 'rgba(251,191,36,0.16)' : 'rgba(217,119,6,0.14)' }]}>
                  <View style={[styles.segment, { left: `${muhurta.rahu.offset * 100}%`, width: `${muhurta.rahu.width * 100}%`, backgroundColor: hues.vermilion }]} />
                  {muhurta.abhijit ? (
                    <View
                      style={[styles.segment, { left: `${muhurta.abhijit.offset * 100}%`, width: `${muhurta.abhijit.width * 100}%`, backgroundColor: hues.tulsi }]}
                    />
                  ) : null}
                </View>
                <View style={styles.barEnds}>
                  <Muted style={{ fontSize: TYPE.caption }}>{p.solarTimes.sunrise}</Muted>
                  <Muted style={{ fontSize: TYPE.caption }}>{p.solarTimes.sunset}</Muted>
                </View>
              </View>
              <Window
                color={hues.indigo}
                label={t(S.brahmaMuhurta)}
                value={t(S.timeRange(formatPanchangClock(muhurta.brahma.start), formatPanchangClock(muhurta.brahma.end)))}
              />
              <Window
                color={hues.tulsi}
                label={t(S.abhijitMuhurta)}
                value={
                  muhurta.abhijit
                    ? t(S.timeRange(formatPanchangClock(muhurta.abhijit.start), formatPanchangClock(muhurta.abhijit.end)))
                    : t(S.abhijitWednesday)
                }
              />
              <Window
                color={hues.vermilion}
                label={t(S.rahuKaal)}
                value={t(S.timeRange(formatPanchangClock(muhurta.rahu.start), formatPanchangClock(muhurta.rahu.end)))}
                note={t(S.rahuNote)}
              />
            </Card>
          </>
        ) : (
          <Card>
            <Muted style={{ fontSize: TYPE.subhead }}>{t(S.sunUnavailable)}</Muted>
          </Card>
        )}

        <GroupTitle title={t(S.vratDates)} />
        <View accessibilityRole="radiogroup" style={styles.chips}>
          {VRATA_KINDS.map((k) => (
            <Chip key={k} label={t(VRATA_LABEL[k])} active={vrata === k} onPress={() => setVrata(k)} />
          ))}
        </View>
        <VratList kind={vrata} fromIso={isoDate(today)} />

        <Muted style={{ marginTop: SPACE.lg, lineHeight: TYPE.footnote * settings.textScale * 1.5 }}>{t(S.panchangAccuracy)}</Muted>
      </ScrollView>

      <CitySheet visible={cityOpen} selected={city.id} onClose={() => setCityOpen(false)} onPick={(id) => { setCity(id); setCityOpen(false); }} />
    </Backdrop>
  );
}

function MoonCard({ p }: { p: PanchangDayData }) {
  const { palette, settings } = usePrefs();
  const { t, lang } = useI18n();
  const hues = huesFor(palette);
  const cap = fontCap(settings.textScale);
  return (
    <Card strong style={{ marginTop: SPACE.md, rowGap: SPACE.md }}>
      <View style={styles.moonRow}>
        <Moon3D phase={phaseFromIllumination(p.paksha.illuminationPercent, p.paksha.isWaxing)} size={72} />
        <View style={{ flex: 1 }}>
          <View style={styles.pillRow}>
            <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: hues.saffron, fontSize: TYPE.caption, fontWeight: '700' }}>
              {lang === 'hi' ? p.paksha.nameHi : p.paksha.transliteration}
            </Text>
            <View style={[styles.pill, { backgroundColor: palette.dark ? 'rgba(251,146,60,0.16)' : 'rgba(194,65,12,0.10)' }]}>
              <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: hues.saffron, fontSize: 11, fontWeight: '700' }}>
                {t(S.illumination(p.paksha.illuminationPercent))}
              </Text>
            </View>
          </View>
          <Text accessibilityRole="header" maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.title2, fontWeight: '800', marginTop: 2 }}>
            {lang === 'hi' ? p.tithi.nameHi : `${p.tithi.transliteration} · ${p.tithi.nameHi}`}
          </Text>
          <Muted>{t(S.lunarDay(p.tithi.number))}</Muted>
        </View>
      </View>
      <View>
        <View
          accessibilityRole="progressbar"
          accessibilityLabel={t(S.tithiProgress(p.tithi.progressPercent))}
          accessibilityValue={{ min: 0, max: 100, now: p.tithi.progressPercent }}
          style={[styles.track, { backgroundColor: quietFill(palette) }]}>
          <View
            style={[
              styles.fill,
              { width: `${p.tithi.progressPercent}%`, backgroundColor: hues.saffron },
              !palette.lite && { backgroundImage: `linear-gradient(90deg, ${palette.accentGradient[1]} 0%, ${hues.gold} 100%)` },
            ]}
          />
        </View>
        <Muted style={{ fontSize: TYPE.caption, marginTop: SPACE.xs }}>{t(S.tithiProgress(p.tithi.progressPercent))}</Muted>
      </View>
      <View style={[styles.focus, { backgroundColor: quietFill(palette) }]}>
        <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.footnote, fontWeight: '700' }}>
          ✦ {t(S.dayFocus)}
        </Text>
        <Text maxFontSizeMultiplier={cap} style={{ color: palette.textSecondary, fontSize: TYPE.footnote * settings.textScale, lineHeight: TYPE.footnote * settings.textScale * 1.5, marginTop: 2 }}>
          {p.tithi.meta.spiritualFocus}
        </Text>
      </View>
    </Card>
  );
}

/** One limb of the day: its name in Sanskrit and transliteration, a badge, and its meaning on tap. */
function Limb({
  label,
  color,
  name,
  nameHi,
  badge,
  badgeTone,
  extra,
  meaning,
  first,
  href,
}: {
  label: Msg;
  color: string;
  name: string;
  nameHi: string;
  badge?: string;
  badgeTone?: string;
  extra?: string;
  meaning: string;
  first?: boolean;
  /** The limb's reference page, linked under its meaning. */
  href?: Href;
}) {
  const { palette, settings } = usePrefs();
  const { t, lang } = useI18n();
  const [open, setOpen] = useState(false);
  const cap = fontCap(settings.textScale);
  const primary = lang === 'hi' ? nameHi : name;
  const secondary = lang === 'hi' ? name : nameHi;
  const tone = badgeTone ?? color;
  return (
    <GroupRow
      standalone={first}
      inset={SPACE.lg}
      accessibilityLabel={`${t(label)}: ${primary}${badge ? `, ${badge}` : ''}. ${open ? t(S.hideMeaning) : t(S.showMeaning)}`}
      accessibilityHint={open ? meaning : undefined}
      onPress={() => setOpen((o) => !o)}
      style={{ alignItems: 'flex-start', paddingVertical: SPACE.md }}>
      <View style={[styles.limbBar, { backgroundColor: color }]} />
      <View style={{ flex: 1, rowGap: 2 }}>
        <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color, fontSize: TYPE.caption, fontWeight: '700', letterSpacing: lang === 'hi' ? 0 : 0.5 }}>
          {lang === 'hi' ? t(label) : t(label).toUpperCase()}
        </Text>
        <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.title3, fontWeight: '700' }}>
          {primary}
        </Text>
        <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.subhead }}>
          {secondary}
          {extra ? ` · ${extra}` : ''}
        </Text>
        {open ? (
          <Text maxFontSizeMultiplier={cap} style={{ color: palette.textSecondary, fontSize: TYPE.subhead * settings.textScale, lineHeight: TYPE.subhead * settings.textScale * 1.5, marginTop: SPACE.xs }}>
            {meaning}
          </Text>
        ) : null}
        {open && href ? (
          <Pressable
            accessibilityRole="link"
            onPress={() => router.push(href)}
            hitSlop={8}
            style={({ pressed }) => [styles.guideLink, pressed && { opacity: 0.6 }]}>
            <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color, fontSize: TYPE.subhead, fontWeight: '700' }}>
              {t(S.gAbout(primary))}
            </Text>
            <Ionicons name="arrow-forward" size={14} color={color} />
          </Pressable>
        ) : null}
      </View>
      <View style={{ alignItems: 'flex-end', rowGap: SPACE.sm }}>
        {badge ? (
          <View style={[styles.pill, { backgroundColor: palette.dark ? 'rgba(255,255,255,0.08)' : 'rgba(60,40,20,0.06)' }]}>
            <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: tone, fontSize: 11, fontWeight: '700' }}>
              {badge}
            </Text>
          </View>
        ) : null}
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={16} color={palette.muted} />
      </View>
    </GroupRow>
  );
}

function Tile({ icon, color, label, value }: { icon: 'sunny' | 'moon' | 'time' | 'compass'; color: string; label: string; value: string }) {
  const { palette } = usePrefs();
  return (
    <View accessible accessibilityLabel={`${label}: ${value}`} style={[styles.tile, glass(palette)]}>
      <View style={styles.tileHead}>
        <Ionicons name={icon} size={16} color={color} />
        <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color, fontSize: TYPE.caption, fontWeight: '700' }}>
          {label}
        </Text>
      </View>
      <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.title3, fontWeight: '800', fontVariant: ['tabular-nums'] }}>
        {value}
      </Text>
    </View>
  );
}

function Window({ color, label, value, note }: { color: string; label: string; value: string; note?: string }) {
  const { palette } = usePrefs();
  return (
    <View accessible accessibilityLabel={`${label}: ${value}${note ? `. ${note}` : ''}`} style={styles.window}>
      <View style={[styles.windowDot, { backgroundColor: color }]} />
      <View style={{ flex: 1 }}>
        <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.callout, fontWeight: '600' }}>
          {label}
        </Text>
        {note ? <Muted style={{ fontSize: TYPE.caption }}>{note}</Muted> : null}
      </View>
      <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.subhead, fontWeight: '700', fontVariant: ['tabular-nums'], textAlign: 'right', flexShrink: 1 }}>
        {value}
      </Text>
    </View>
  );
}

function VratList({ kind, fromIso }: { kind: VrataKind; fromIso: string }) {
  const { palette } = usePrefs();
  const { t, lang } = useI18n();
  const items = upcomingVrats(kind, fromIso);
  if (!items.length) {
    return (
      <Card>
        <Muted>{t(S.vratNone)}</Muted>
      </Card>
    );
  }
  return (
    <GroupCard>
      {items.map((v, i) => (
        <GroupRow key={v.dateEn + v.name} standalone={i === 0} inset={SPACE.lg} highlight={v.highlight} accessibilityLabel={`${v.name}, ${formatDay(v.dateEn, lang)}`}>
          <View style={{ flex: 1 }}>
            <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.callout, fontWeight: '600' }}>
              {v.name}
            </Text>
            <Muted style={{ fontSize: TYPE.caption, marginTop: 1 }}>{[v.month, v.paksha].filter(Boolean).join(' · ')}</Muted>
          </View>
          <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: v.highlight ? palette.accent : palette.text, fontSize: TYPE.footnote, fontWeight: '700', textAlign: 'right' }}>
            {formatDay(v.dateEn, lang)}
          </Text>
        </GroupRow>
      ))}
    </GroupCard>
  );
}

const styles = StyleSheet.create({
  controls: { borderRadius: RADIUS.card, padding: SPACE.md, rowGap: SPACE.sm },
  cityBtn: { flexDirection: 'row', alignItems: 'center', columnGap: SPACE.sm, minHeight: TOUCH, paddingHorizontal: SPACE.md, borderRadius: RADIUS.control },
  dateRow: { flexDirection: 'row', alignItems: 'center' },
  dateBtn: { flex: 1, minHeight: TOUCH, justifyContent: 'center', paddingHorizontal: SPACE.xs },
  moonRow: { flexDirection: 'row', alignItems: 'center', columnGap: SPACE.lg },
  pillRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', columnGap: SPACE.sm, rowGap: 4 },
  pill: { paddingHorizontal: SPACE.sm, paddingVertical: 2, borderRadius: RADIUS.pill },
  track: { height: 8, borderRadius: 4, overflow: 'hidden' },
  fill: { height: 8, borderRadius: 4 },
  focus: { borderRadius: RADIUS.control, padding: SPACE.md },
  limbBar: { width: 4, alignSelf: 'stretch', borderRadius: 2 },
  tiles: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACE.sm },
  tile: { flexGrow: 1, flexBasis: '45%', borderRadius: RADIUS.row, padding: SPACE.md, rowGap: SPACE.xs },
  tileHead: { flexDirection: 'row', alignItems: 'center', columnGap: 6 },
  dayBar: { height: 14, borderRadius: 7, overflow: 'hidden' },
  segment: { position: 'absolute', top: 0, bottom: 0, borderRadius: 7 },
  barEnds: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  window: { flexDirection: 'row', alignItems: 'center', columnGap: SPACE.md, minHeight: 40 },
  windowDot: { width: 10, height: 10, borderRadius: 5 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACE.sm, marginBottom: SPACE.md },
  guideLink: { flexDirection: 'row', alignItems: 'center', columnGap: 6, minHeight: 40, alignSelf: 'flex-start', marginTop: SPACE.xs },
});
