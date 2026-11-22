import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, { type SharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Mandala } from '@/components/art/mandala';
import { Moon3D, phaseFromIllumination } from '@/components/art/moon';
import { useTabTop } from '@/lib/use-tab-top';
import { BentoCol, BentoDepth, BentoRow, BentoTile } from '@/components/bento';
import { Backdrop, coverFill, CoverTile, glass, GroupCard, GroupRow, GroupTitle } from '@/components/ui';
import { CATALOG, dailyVerse, getEntry, loadChapter } from '@/content/catalog';
import { useDownloads } from '@/content/downloads';
import { daysBetween, todayPanchang, upcomingFestivals } from '@/content/explore';
import { FEATURED, LIFE_GUIDES, PRACTICE_GUIDES, SAYINGS, SHELF, WISDOM_PICKS, type Guide, type Passage } from '@/content/home-picks';
import { knowledge, type WisdomTopic } from '@/content/knowledge';
import { AnimatedIcon } from '@/motion/animated-icon';
import { KineticLines, KineticText } from '@/motion/kinetic';
import { useParallax, useScrollY } from '@/motion/parallax';
import { PressableScale } from '@/motion/pressable-scale';
import { TitleBar } from '@/motion/title-bar';
import { useMotion } from '@/motion/use-motion';
import { S, useI18n } from '@/i18n';
import { daysSince, moodFor, type Mood } from '@/lib/mood';
import { usePanchangCity } from '@/lib/panchang-city';
import { bookReadCount, dayKey, percentRead, streakInfo } from '@/lib/progress';
import { dateFromDayKey, useToday } from '@/lib/use-today';
import { formatVerseRef, sanskritLines } from '@/lib/verse-format';
import { useAppState, usePrefs } from '@/state/app-state';
import { coverFor, monogram } from '@/theme/covers';
import { SANSKRIT_FONT } from '@/theme/fonts';
import { barClearance, fontCap, huesFor, quietFill, RADIUS, SPACE, TITLE_FONT_CAP, TOUCH, TYPE } from '@/theme/themes';

export { ErrorBoundary } from '@/components/error-boundary';

/**
 * Home, after the website's home page (app/page.tsx): the promise and a way in (hero, search, a featured
 * passage), the reader's own place (continue reading, verse of the day), the library as book covers,
 * doorways by question and by practice, and the Upanishads' sayings. The Library tab keeps the full list.
 *
 * The top is a bento grid (src/components/bento.tsx): asymmetric glass tiles for the reader's own day (where
 * they left off, the moon and tithi, the streak, the next festival, mantras). The greeting reads the hour,
 * the lunar day and the reader's rhythm (src/lib/mood.ts), and the hero's light shifts with it. The title
 * and verses arrive as kinetic type; the hero drifts behind the page as it scrolls, and a compact glass
 * title bar takes over at the top.
 */

function open(p: Passage | string) {
  if (typeof p === 'string') {
    router.push(p as never);
    return;
  }
  if (p.chapter == null) {
    router.push({ pathname: '/scripture/[id]', params: { id: p.id } });
    return;
  }
  router.push({
    pathname: '/scripture/[id]/[chapter]',
    params: p.verse ? { id: p.id, chapter: String(p.chapter), verse: p.verse } : { id: p.id, chapter: String(p.chapter) },
  });
}


/** The small accent label over a card or section, like the website's uppercase kickers. */
function Kicker({ children, color }: { children: string; color: string }) {
  const { lang } = useI18n();
  return (
    <Text
      maxFontSizeMultiplier={TITLE_FONT_CAP}
      style={{ color, fontSize: TYPE.caption, fontWeight: '700', letterSpacing: lang === 'hi' ? 0 : 1.2 }}>
      {lang === 'hi' ? children : children.toUpperCase()}
    </Text>
  );
}

/** Today's tone: the hour, the lunar day, a festival, and how the reader has been reading. */
function useMood(): { mood: Mood; panchang: ReturnType<typeof todayPanchang> } {
  const { progress } = useAppState();
  const { lang } = useI18n();
  const [city] = usePanchangCity();
  // Recomputed whenever Home comes back into view, so the day (and the hour's greeting) turns over.
  const [now, setNow] = useState(() => new Date());
  useFocusEffect(useCallback(() => setNow(new Date()), []));
  const panchang = useMemo(() => todayPanchang(city, now), [city, now]);
  const mood = useMemo(() => {
    const today = dayKey(now);
    const info = streakInfo(progress, today);
    const last = progress.days.reduce<string | undefined>((m, d) => (!m || d > m ? d : m), undefined);
    const fest = upcomingFestivals(panchang.isoDate, 1)[0];
    const festivalToday = fest && fest.date === panchang.isoDate ? (lang === 'hi' ? (fest.nameHindi ?? fest.name) : fest.name) : undefined;
    return moodFor({
      now,
      tithi: panchang.tithi.name,
      festivalToday,
      readToday: info.readToday,
      streak: info.current,
      daysAway: last ? daysSince(last, today) : undefined,
    });
  }, [now, progress, panchang, lang]);
  return { mood, panchang };
}

function Hero({ mood, scrollY }: { mood: Mood; scrollY: SharedValue<number> }) {
  const { palette } = usePrefs();
  const { t, lang } = useI18n();
  const { rich } = useMotion();
  const today = useToday();
  const date = dateFromDayKey(today);
  const dateLabel = useMemo(() => {
    try {
      return date.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
    } catch {
      return '';
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [today, lang]);
  // Immersive scroll: the light behind drifts at half speed, the words lift away a little faster than the page.
  const light = useParallax(scrollY, 0.5, { enabled: rich });
  const words = useParallax(scrollY, 0.18, { enabled: rich, fadeOver: 320 });
  const [warm, cool] = palette.dark ? mood.glow.dark : mood.glow.light;
  const hues = huesFor(palette);
  const size = TYPE.largeTitle + 4;

  return (
    <View style={{ paddingTop: SPACE.xl }}>
      {palette.lite ? null : (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.heroLight,
            { backgroundImage: `radial-gradient(60% 55% at 18% 30%, ${warm} 0%, transparent 70%), radial-gradient(55% 50% at 92% 62%, ${cool} 0%, transparent 72%)` },
            light,
          ]}>
          {/* A gold mandala behind the words, turning once a minute: the hush of a temple, kept faint. */}
          <Mandala size={300} color={hues.gold} opacity={palette.dark ? 0.16 : 0.13} petals={16} spin={rich} style={styles.heroMandala} />
        </Animated.View>
      )}
      <Animated.View style={[{ rowGap: SPACE.md }, words]}>
        <View style={[styles.eyebrow, glass(palette)]}>
          <AnimatedIcon name={mood.icon} size={14} color={palette.accent} motion={mood.occasion ? 'pop' : 'breathe'} trigger={1} />
          <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ flexShrink: 1, color: palette.accent, fontSize: TYPE.caption, fontWeight: '700' }}>
            {dateLabel ? `${t(mood.greeting)} · ${dateLabel}` : t(mood.greeting)}
          </Text>
        </View>
        {/* ॥ श्री ॥, the invocation that opens a manuscript, in gilt above the title. */}
        <Text
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          allowFontScaling={false}
          style={{ fontFamily: SANSKRIT_FONT, color: hues.gold, fontSize: TYPE.title3, lineHeight: TYPE.title3 * 1.6, letterSpacing: 2, marginBottom: -SPACE.sm }}>
          ॥ श्री ॥
        </Text>
        <KineticText
          header
          delay={120}
          step={90}
          rise={18}
          maxFontSizeMultiplier={TITLE_FONT_CAP}
          style={{ color: palette.text, fontSize: size, lineHeight: size * (lang === 'hi' ? 1.35 : 1.08), fontWeight: '800', letterSpacing: lang === 'hi' ? 0 : -1 }}
          segments={[{ text: t(S.homeTitleLead) }, '\n', { text: t(S.homeTitleAccent), style: { color: palette.accent } }]}
        />
        {/* The Hindi line stays in Hindi in both languages, as on the website. */}
        <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.title3, lineHeight: TYPE.title3 * 1.5, fontWeight: '600' }}>
          {S.homeTagline.hi}
        </Text>
        <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.subhead, lineHeight: TYPE.subhead * 1.5 }}>
          {t(S.homeIntro)}
        </Text>
        {/* A gentle word for today: never a demand, at most one verse. */}
        <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.textSecondary, fontSize: TYPE.subhead, lineHeight: TYPE.subhead * 1.5, fontStyle: lang === 'hi' ? 'normal' : 'italic' }}>
          {t(mood.note)}
        </Text>
        <SearchPill />
      </Animated.View>
    </View>
  );
}

function SearchPill() {
  const { palette } = usePrefs();
  const { t } = useI18n();
  const [taps, setTaps] = useState(0);
  return (
    <PressableScale
      accessibilityRole="search"
      accessibilityLabel={t(S.searchInsideVerses)}
      onPressIn={() => setTaps((n) => n + 1)}
      onPress={() => router.push('/search')}
      style={[styles.search, glass(palette, true)]}>
      <AnimatedIcon name="search" size={20} color={palette.accent} motion="wiggle" trigger={taps} />
      <Text maxFontSizeMultiplier={TITLE_FONT_CAP} numberOfLines={1} style={{ flex: 1, color: palette.muted, fontSize: TYPE.callout }}>
        {t(S.homeSearch)}
      </Text>
    </PressableScale>
  );
}

/**
 * The featured passage, the website hero's dark card: deep plum with gold rings, the whole verse (both
 * lines, never cut short) and a quiet note. The colours are the website's own and stay in every theme.
 */
function FeaturedPassage() {
  const { palette, settings } = usePrefs();
  const { t } = useI18n();
  const verse = loadChapter(FEATURED.id, FEATURED.chapter!)?.verses.find((v) => String(v.number) === FEATURED.verse);
  const lines = sanskritLines(verse?.sanskrit);
  if (!verse || lines.length === 0) return null;
  const size = TYPE.title3 * settings.textScale;
  return (
    <BentoTile
      accessibilityLabel={t(S.homeFeaturedA11y)}
      onPress={() => open(FEATURED)}
      radius={RADIUS.panel + 2}
      padding={SPACE.xl}
      glow="rgba(246,199,104,0.18)"
      surface={{
        ...styles.featured,
        ...(palette.lite
          ? null
          : {
              backgroundImage:
                'radial-gradient(circle at 85% 22%, rgba(245,189,100,0.24) 0%, transparent 46%), linear-gradient(140deg, rgba(181,88,53,0.22) 0%, transparent 65%)',
              boxShadow: 'inset 1px 1px 0 rgba(253,230,138,0.35), 0 24px 50px -24px rgba(58,29,15,0.6)',
            }),
      }}>
        <View pointerEvents="none" style={[styles.ring, { width: 300, height: 300, right: -120, top: 20 }]} />
        <View pointerEvents="none" style={[styles.ring, { width: 220, height: 220, right: -70, top: 60, borderColor: 'rgba(253,230,138,0.2)' }]} />
        <View pointerEvents="none" style={[styles.ring, { width: 150, height: 150, right: -30, top: 95 }]} />

        <View style={styles.featuredHead}>
          <View style={{ flex: 1 }}>
            <Kicker color="#f4d39a">{t(S.homeFeatured)}</Kicker>
            <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: '#fbe6c4', fontSize: TYPE.footnote, marginTop: 4 }}>
              श्रीमद्भगवद्गीता · अध्याय 2, श्लोक 47
            </Text>
          </View>
          <View style={styles.featuredArrow}>
            <Ionicons name="arrow-forward" size={18} color="#fff7e9" />
          </View>
        </View>

        <View style={{ marginVertical: SPACE.xl, rowGap: SPACE.sm }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 6 }}>
            <Ionicons name="sparkles" size={14} color="#f4d39a" />
            <Kicker color="#f4d39a">{t(S.homeFeaturedTheme)}</Kicker>
          </View>
          {/* Every line of the verse, revealed one after another: a shloka is never cut to fit a card. */}
          <KineticLines
            lines={lines}
            delay={500}
            seal={{ text: '॥', color: '#f6c768' }}
            maxFontSizeMultiplier={fontCap(settings.textScale)}
            style={{ fontFamily: SANSKRIT_FONT, color: '#fffaf0', fontSize: size, lineHeight: size * 1.8 }}
          />
        </View>

        <View style={styles.featuredFoot}>
          <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ flex: 1, color: '#f8ddad', fontSize: TYPE.footnote, lineHeight: TYPE.footnote * 1.5 }}>
            {t(S.homeFeaturedNote)}
          </Text>
          <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: '#fff7e9', fontSize: TYPE.footnote, fontWeight: '700' }}>
            {t(S.homeReadVerse)} →
          </Text>
        </View>
    </BentoTile>
  );
}

/** Two doorways under the featured card, as on the website: the Gita (the wider tile), and the Upanishads. */
function QuickTiles() {
  const { palette } = usePrefs();
  const { t } = useI18n();
  const upanishads = CATALOG.filter((b) => b.category === 'upanishad' && b.bundled).length;
  const wash = palette.dark ? 'rgba(255,159,10,0.14)' : 'rgba(255,237,213,0.72)';
  return (
    <BentoRow>
      <BentoTile
        flex={1.45}
        minHeight={128}
        tint={palette.lite ? undefined : wash}
        glow={palette.dark ? 'rgba(255,159,10,0.18)' : 'rgba(234,88,12,0.14)'}
        accessibilityLabel={`${t(S.homeStartGita)}, ${t(S.homeStartGitaDetail)}`}
        onPress={() => open({ id: 'bhagavadgita' })}
        style={styles.quick}>
        <View style={styles.quickTop}>
          <Ionicons name="book" size={24} color={palette.accent} />
          <Ionicons name="arrow-forward" size={16} color={palette.accent} />
        </View>
        <View>
          <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.body, fontWeight: '800' }}>
            {t(S.homeStartGita)}
          </Text>
          <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.caption, marginTop: 2 }}>
            {t(S.homeStartGitaDetail)}
          </Text>
        </View>
      </BentoTile>
      <BentoTile
        flex={1}
        minHeight={128}
        accessibilityLabel={`${t(S.homeUpanishads)}, ${t(S.homeUpanishadsDetail(upanishads))}`}
        onPress={() => router.navigate('/')}
        style={styles.quick}>
        <View style={styles.quickTop}>
          <Ionicons name="compass" size={22} color={palette.accent} />
        </View>
        <View>
          <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.callout, fontWeight: '700' }}>
            {t(S.homeUpanishads)}
          </Text>
          <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.caption, marginTop: 2 }}>
            {t(S.homeUpanishadsDetail(upanishads))}
          </Text>
        </View>
      </BentoTile>
    </BentoRow>
  );
}

/**
 * The reader's own day as a bento: a tall tile for where they left off (or a first step into the Gita), the
 * moon and tithi and the reading streak stacked beside it, then the next festival (wider) and the mantras.
 */
function TodayBento({ panchang }: { panchang: ReturnType<typeof todayPanchang> }) {
  const { palette, progress, settings } = useAppState();
  const { t, lang } = useI18n();
  const hues = huesFor(palette);
  const showStreak = settings.showStreak && progress.days.length > 0;
  const next = upcomingFestivals(panchang.isoDate, 1)[0];
  const tithi = lang === 'hi' ? panchang.tithi.nameHi : panchang.tithi.transliteration;
  const paksha = lang === 'hi' ? panchang.paksha.nameHi : panchang.paksha.transliteration;
  const cityName = lang === 'hi' ? panchang.location.nameHi : panchang.location.name;
  const nakshatra = lang === 'hi' ? panchang.nakshatra.nameHi : panchang.nakshatra.transliteration;

  return (
    <View style={{ rowGap: SPACE.md }}>
      <BentoRow>
        <BentoCol flex={1.25}>
          <ContinueTile />
        </BentoCol>
        <BentoCol flex={1}>
          <BentoTile
            flex={1}
            accessibilityLabel={`${t(S.openPanchangA11y)}. ${tithi}, ${paksha}, ${nakshatra}`}
            onPress={() => open('/explore/panchang')}
            glow={palette.dark ? 'rgba(129,140,248,0.20)' : 'rgba(79,70,229,0.10)'}
            style={{ rowGap: SPACE.sm }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Moon3D phase={phaseFromIllumination(panchang.paksha.illuminationPercent, panchang.paksha.isWaxing)} size={40} />
              <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.caption, fontWeight: '600' }}>
                {Math.round(panchang.paksha.illuminationPercent)}%
              </Text>
            </View>
            <View>
              <Kicker color={palette.accent}>{t(S.todayAt(cityName))}</Kicker>
              <Text maxFontSizeMultiplier={TITLE_FONT_CAP} numberOfLines={2} style={{ color: palette.text, fontSize: TYPE.callout, fontWeight: '800', marginTop: 2 }}>
                {tithi}
              </Text>
              <Text maxFontSizeMultiplier={TITLE_FONT_CAP} numberOfLines={1} style={{ color: palette.muted, fontSize: TYPE.caption, marginTop: 1 }}>
                {paksha}
              </Text>
              <View style={{ marginTop: 6, rowGap: 2 }}>
                <View style={styles.sunRow}>
                  <Ionicons name="sunny-outline" size={12} color={hues.gold} />
                  <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.textSecondary, fontSize: TYPE.caption }}>
                    {panchang.solarTimes.sunrise}
                  </Text>
                </View>
                <View style={styles.sunRow}>
                  <Ionicons name="moon-outline" size={12} color={hues.vermilion} />
                  <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.textSecondary, fontSize: TYPE.caption }}>
                    {panchang.solarTimes.sunset}
                  </Text>
                </View>
              </View>
            </View>
          </BentoTile>
          {showStreak ? <StreakTile /> : null}
        </BentoCol>
      </BentoRow>
      <BentoRow>
        {next ? (
          <BentoTile
            flex={1.5}
            accessibilityLabel={`${t(S.nextFestival)}: ${lang === 'hi' ? (next.nameHindi ?? next.name) : next.name}, ${t(S.inDays(daysBetween(panchang.isoDate, next.date)))}`}
            onPress={() => open('/explore/festivals')}
            glow={palette.dark ? 'rgba(244,114,182,0.20)' : 'rgba(219,39,119,0.10)'}
            style={{ rowGap: SPACE.xs, justifyContent: 'space-between', minHeight: 112 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Kicker color={hues.lotus}>{t(S.bentoNextFestival)}</Kicker>
              <Ionicons name="sparkles" size={16} color={hues.lotus} />
            </View>
            <Text maxFontSizeMultiplier={TITLE_FONT_CAP} numberOfLines={2} style={{ color: palette.text, fontSize: TYPE.body, fontWeight: '800' }}>
              {lang === 'hi' ? (next.nameHindi ?? next.name) : next.name}
            </Text>
            <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.caption, fontWeight: '600' }}>
              {t(S.inDays(daysBetween(panchang.isoDate, next.date)))}
            </Text>
          </BentoTile>
        ) : null}
        <BentoTile
          flex={1}
          accessibilityLabel={`${t(S.bentoMantras)}, ${t(S.bentoMantrasDetail)}`}
          onPress={() => open('/explore/mantras')}
          glow={palette.dark ? 'rgba(45,212,191,0.18)' : 'rgba(13,148,136,0.10)'}
          style={{ rowGap: SPACE.xs, justifyContent: 'space-between', minHeight: 112 }}>
          <Text allowFontScaling={false} style={{ color: hues.peacock, fontSize: 30, lineHeight: 40 }}>
            ॐ
          </Text>
          <View>
            <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.callout, fontWeight: '700' }}>
              {t(S.bentoMantras)}
            </Text>
            <Text maxFontSizeMultiplier={TITLE_FONT_CAP} numberOfLines={2} style={{ color: palette.muted, fontSize: TYPE.caption, marginTop: 1 }}>
              {t(S.bentoMantrasDetail)}
            </Text>
          </View>
        </BentoTile>
      </BentoRow>
    </View>
  );
}

/** Where the reader left off, as the tall tile: cover, place, the book's progress; or a first step into the Gita. */
function ContinueTile() {
  const { lastRead, palette, progress } = useAppState();
  const { t } = useI18n();
  const entry = lastRead ? getEntry(lastRead.id) : undefined;
  const idx = entry && lastRead ? entry.chapters.findIndex((c) => c.number === lastRead.chapter) : -1;
  const ch = entry && idx >= 0 ? entry.chapters[idx] : undefined;

  if (!lastRead || !entry || !ch) {
    const gita = getEntry('bhagavadgita');
    const cover = coverFor('bhagavadgita', gita?.category ?? 'smriti');
    return (
      <BentoTile
        flex={1}
        minHeight={236}
        accessibilityLabel={`${t(S.bentoBegin)}. ${gita ? t(S.bentoBeginDetail(gita.chapters.length, gita.totalVerses)) : ''}`}
        onPress={() => open({ id: 'bhagavadgita', chapter: 1 })}
        surface={coverFill(cover, palette)}
        glow="rgba(0,0,0,0.25)"
        style={{ justifyContent: 'space-between' }}>
        <Text allowFontScaling={false} style={{ color: cover.foil, fontSize: 44, lineHeight: 60 }}>
          {monogram(gita?.titleSanskrit ?? 'गीता')}
        </Text>
        <View style={{ rowGap: 4 }}>
          <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: '#fffaf0', fontSize: TYPE.title3, fontWeight: '800' }}>
            {t(S.bentoBegin)}
          </Text>
          {gita ? (
            <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: cover.foil, fontSize: TYPE.caption, lineHeight: TYPE.caption * 1.5 }}>
              {t(S.bentoBeginDetail(gita.chapters.length, gita.totalVerses))}
            </Text>
          ) : null}
          <View style={[styles.play, { marginTop: SPACE.sm, backgroundColor: 'rgba(255,255,255,0.16)' }]}>
            <AnimatedIcon name="arrow-forward" size={18} color="#fffaf0" motion="nudge" trigger={1} />
          </View>
        </View>
      </BentoTile>
    );
  }

  const cover = coverFor(entry.id, entry.category);
  // Verse by verse once any verse counts as read; before that, the chapter's place in the book.
  const read = bookReadCount(progress, entry.id, entry.chapters);
  const pct = percentRead(read, entry.totalVerses);
  const fraction = read > 0 && entry.totalVerses > 0 ? read / entry.totalVerses : (idx + 1) / entry.chapters.length;
  const verse = lastRead.verse;
  return (
    <BentoTile
      flex={1}
      minHeight={236}
      strong
      accessibilityLabel={verse ? t(S.continueReadingVerseA11y(entry.title, ch.number, verse, pct)) : t(S.continueReadingA11y(entry.title, ch.number))}
      onPress={() => open({ id: entry.id, chapter: ch.number, verse })}
      glow={palette.dark ? 'rgba(255,159,10,0.16)' : 'rgba(234,88,12,0.10)'}
      style={{ justifyContent: 'space-between', rowGap: SPACE.md }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <CoverTile cover={cover} letter={monogram(entry.titleSanskrit ?? entry.title)} size={56} />
        <View style={[styles.play, { backgroundColor: palette.dark ? 'rgba(255,159,10,0.16)' : 'rgba(194,65,12,0.10)' }]}>
          <AnimatedIcon name="play" size={18} color={palette.accent} motion="breathe" trigger={1} />
        </View>
      </View>
      <View style={{ rowGap: 3 }}>
        <Kicker color={palette.accent}>{t(S.continueReading)}</Kicker>
        <Text maxFontSizeMultiplier={TITLE_FONT_CAP} numberOfLines={2} style={{ color: palette.text, fontSize: TYPE.title3, fontWeight: '800' }}>
          {entry.titleSanskrit ?? entry.title}
        </Text>
        <Text maxFontSizeMultiplier={TITLE_FONT_CAP} numberOfLines={2} style={{ color: palette.muted, fontSize: TYPE.footnote }}>
          {verse ? t(S.continueAtVerse(ch.number, verse)) : t(S.chapterN(ch.number))}
          {ch.titleSanskrit ? ` · ${ch.titleSanskrit}` : ch.title ? ` · ${ch.title}` : ''}
        </Text>
      </View>
      <View style={{ rowGap: 6 }}>
        <View style={[styles.track, { backgroundColor: quietFill(palette) }]}>
          <View style={[styles.fill, coverFill(cover, palette), { width: `${Math.max(4, Math.round(fraction * 100))}%` }]} />
        </View>
        {pct > 0 ? (
          <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.caption, fontWeight: '600' }}>
            {pct === 100 ? t(S.bookFinished) : t(S.percentRead(pct))}
          </Text>
        ) : null}
      </View>
    </BentoTile>
  );
}

/**
 * The gentle streak as a small tile: the days in a row as a big numeral, the week as seven dots. A missed
 * day reads "A verse a day", never zero. One sentence for TalkBack, as the full streak card.
 */
function StreakTile() {
  const { palette, progress } = useAppState();
  const { t } = useI18n();
  const today = dayKey(dateFromDayKey(useToday()));
  const info = useMemo(() => streakInfo(progress, today), [progress, today]);
  const alive = info.current > 0;
  const readThisWeek = info.week.filter((d) => d.read).length;
  return (
    <BentoTile
      accessibilityLabel={t(S.streakA11y(info.current, info.best, info.readToday, readThisWeek))}
      glow={alive ? (palette.dark ? 'rgba(255,159,10,0.22)' : 'rgba(234,88,12,0.12)') : undefined}
      style={{ rowGap: SPACE.sm }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 6 }}>
        <AnimatedIcon name={alive ? 'flame' : 'flame-outline'} size={20} color={palette.accent} motion="breathe" trigger={alive ? 1 : 0} />
        {alive ? (
          <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.title2, fontWeight: '800' }}>
            {info.current}
            <Text style={{ color: palette.muted, fontSize: TYPE.caption, fontWeight: '600' }}> {t(S.bentoStreakDays(info.current))}</Text>
          </Text>
        ) : (
          <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ flexShrink: 1, color: palette.text, fontSize: TYPE.footnote, fontWeight: '700' }}>
            {t(S.bentoStreakNone)}
          </Text>
        )}
      </View>
      <View style={styles.weekDots}>
        {info.week.map((d) => (
          <View
            key={d.day}
            style={[
              styles.weekDot,
              { backgroundColor: d.read ? palette.accent : quietFill(palette) },
              d.day === today && !d.read && { borderWidth: 1.5, borderColor: palette.accent, backgroundColor: 'transparent' },
            ]}
          />
        ))}
      </View>
    </BentoTile>
  );
}

function VerseOfTheDay() {
  const { palette, settings } = usePrefs();
  const { t } = useI18n();
  const today = useToday();
  const pick = useMemo(() => dailyVerse(dateFromDayKey(today)), [today]);
  if (!pick) return null;
  const verse = loadChapter(pick.id, pick.chapter)?.verses[pick.index];
  if (!verse) return null;
  const lines = sanskritLines(verse.sanskrit);
  const hues = huesFor(palette);
  const size = TYPE.callout * settings.textScale;
  return (
    <BentoTile
      accessibilityLabel={t(S.verseOfTheDayA11y)}
      onPress={() => open({ id: pick.id, chapter: pick.chapter, verse: String(verse.number) })}
      radius={RADIUS.panel - 2}
      glow={palette.dark ? 'rgba(250,204,21,0.12)' : 'rgba(217,119,6,0.08)'}
      style={{ paddingLeft: SPACE.lg + 6 }}>
        <View pointerEvents="none" style={[styles.goldBar, { backgroundColor: hues.gold }]} />
        <View style={styles.cardHead}>
          <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 6 }}>
            <Ionicons name="sunny" size={14} color={palette.accent} />
            <Kicker color={palette.accent}>{t(S.verseOfTheDay)}</Kicker>
          </View>
          <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.caption }}>
            {t(S.gitaRef(formatVerseRef(pick.id, pick.chapter, verse.number)))}
          </Text>
        </View>
        {/* The whole verse, every line, arriving line by line: never cut a shloka to fit the card. */}
        <View style={{ marginTop: SPACE.sm }}>
          <KineticLines
            lines={lines}
            delay={700}
            seal={{ text: '॥', color: hues.gold }}
            maxFontSizeMultiplier={fontCap(settings.textScale)}
            style={{ fontFamily: SANSKRIT_FONT, color: palette.text, fontSize: size, lineHeight: size * 1.8 }}
          />
        </View>
    </BentoTile>
  );
}

function SectionHead({ title, detail, action }: { title: string; detail?: string; action?: ReactNode }) {
  const { palette } = usePrefs();
  return (
    <View style={styles.sectionHead}>
      <View style={{ flex: 1 }}>
        <GroupTitle title={title} />
        {detail ? (
          <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.footnote, marginTop: -SPACE.xs }}>
            {detail}
          </Text>
        ) : null}
      </View>
      {action}
    </View>
  );
}

/** The library as book covers, after the website's HomeLibrary tiles, in each book's own colours. */
function Shelf() {
  const { palette } = usePrefs();
  const { t } = useI18n();
  const books = SHELF.map(getEntry).filter((b): b is NonNullable<typeof b> => !!b && b.bundled);
  return (
    <View>
      <SectionHead
        title={t(S.homeShelf)}
        action={
          <PressableScale
            accessibilityRole="link"
            accessibilityLabel={t(S.homeSeeAllA11y(CATALOG.length))}
            onPress={() => router.navigate('/')}
            hitSlop={8}
            style={[styles.seeAll]}>
            <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.accent, fontSize: TYPE.subhead, fontWeight: '600' }}>
              {t(S.homeSeeAll)}
            </Text>
            <Ionicons name="chevron-forward" size={16} color={palette.accent} />
          </PressableScale>
        }
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0, marginHorizontal: -SPACE.lg, marginVertical: -SPACE.lg + 4 }}
        contentContainerStyle={{ paddingHorizontal: SPACE.lg, columnGap: SPACE.md, paddingVertical: SPACE.lg, alignItems: 'flex-start' }}>
        {books.map((b) => {
          const cover = coverFor(b.id, b.category);
          const sa = b.titleSanskrit ?? b.title;
          return (
            <PressableScale
              key={b.id}
              accessibilityRole="button"
              accessibilityLabel={t(S.bookA11y(b.title, b.chapters.length))}
              onPress={() => open({ id: b.id })}
              style={[
                styles.book,
                coverFill(cover, palette),
                !palette.lite && { boxShadow: palette.dark ? '0 10px 24px rgba(0,0,0,0.5)' : '0 10px 22px rgba(60,30,10,0.18)' }
              ]}>
              {/* Gilt frame, like a cloth-bound cover. */}
              {/* A soft dark scrim under the titles, so they read on every cover's light end. */}
              <View pointerEvents="none" style={[styles.bookScrim, palette.lite ? null : { backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 100%)' }]} />
              <View pointerEvents="none" style={[styles.bookFrame, { borderColor: `${cover.foil}55` }]} />
              <Text allowFontScaling={false} style={{ color: cover.foil, fontSize: 40, lineHeight: 56, textAlign: 'center' }}>
                {monogram(sa)}
              </Text>
              <View>
                <Text maxFontSizeMultiplier={1.3} numberOfLines={2} style={{ color: '#fffaf0', fontSize: TYPE.subhead, fontWeight: '700', textAlign: 'center' }}>
                  {sa}
                </Text>
                <Text maxFontSizeMultiplier={1.3} numberOfLines={1} style={{ color: cover.foil, fontSize: TYPE.caption, textAlign: 'center', marginTop: 2 }}>
                  {b.title}
                </Text>
              </View>
            </PressableScale>
          );
        })}
      </ScrollView>
    </View>
  );
}

function GuideCard({ title, icon, guides, tint }: { title: string; icon: 'compass' | 'sunny'; guides: Guide[]; tint: string }) {
  const { palette } = usePrefs();
  const { t } = useI18n();
  return (
    <GroupCard>
      <View style={styles.guideHead}>
        <View style={[styles.guideIcon, { backgroundColor: tint }]}>
          <Ionicons name={icon} size={18} color="#ffffff" />
        </View>
        <Text accessibilityRole="header" maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.body, fontWeight: '700' }}>
          {title}
        </Text>
      </View>
      {guides.map((g) => (
        <GroupRow key={g.label.en} inset={56} accessibilityLabel={t(g.label)} onPress={() => open(g.to)}>
          <Ionicons name={g.icon} size={20} color={palette.accent} style={{ width: 24, textAlign: 'center' }} />
          <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ flex: 1, color: palette.text, fontSize: TYPE.callout }}>
            {t(g.label)}
          </Text>
          <Ionicons name="chevron-forward" size={18} color={palette.muted} />
        </GroupRow>
      ))}
    </GroupCard>
  );
}

function Guides() {
  const { palette } = usePrefs();
  const { t } = useI18n();
  const hues = huesFor(palette);
  return (
    <View style={{ rowGap: SPACE.md }}>
      <SectionHead title={t(S.homeGuides)} detail={t(S.homeGuidesDetail)} />
      <GuideCard title={t(S.homeGuideLife)} icon="compass" guides={LIFE_GUIDES} tint={hues.lotus} />
      <GuideCard title={t(S.homeGuidePractice)} icon="sunny" guides={PRACTICE_GUIDES} tint={hues.gold} />
    </View>
  );
}

/**
 * Wisdom for life, as the website's "Living sanctuary" doorway: a few topics as tiles in their own accent
 * colours, then the way into every topic and the knowledge pages (src/app/wisdom, src/app/knowledge).
 */
function Wisdom() {
  const { palette } = usePrefs();
  const { t } = useI18n();
  const hues = huesFor(palette);
  const data = knowledge('wisdom');
  const topics = WISDOM_PICKS.map((id) => data.items.find((x) => x.id === id)).filter((x): x is NonNullable<typeof x> => !!x);
  return (
    <View style={{ rowGap: SPACE.md }}>
      <SectionHead title={t(S.wisdomTitle)} detail={t(S.homeWisdomDetail)} />
      {/* An asymmetric bento: the first topic tall, the next two stacked beside it, then a narrow-wide pair. */}
      <BentoRow>
        {topics[0] ? <WisdomTile topic={topics[0]} flex={1.15} tall /> : null}
        <BentoCol>
          {topics.slice(1, 3).map((w) => (
            <WisdomTile key={w.id} topic={w} />
          ))}
        </BentoCol>
      </BentoRow>
      {topics.length > 3 ? (
        <BentoRow>
          {topics.slice(3, 5).map((w, i) => (
            <WisdomTile key={w.id} topic={w} flex={i === 0 ? 1 : 1.35} />
          ))}
        </BentoRow>
      ) : null}
      <GroupCard>
        <GroupRow standalone inset={56} accessibilityLabel={t(S.homeAllTopics(data.items.length))} onPress={() => open('/wisdom')}>
          <View style={[styles.guideIcon, { backgroundColor: hues.lotus }]}>
            <Ionicons name="flower-outline" size={18} color="#ffffff" />
          </View>
          <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ flex: 1, color: palette.text, fontSize: TYPE.callout }}>
            {t(S.homeAllTopics(data.items.length))}
          </Text>
          <Ionicons name="chevron-forward" size={18} color={palette.muted} />
        </GroupRow>
        <GroupRow inset={56} accessibilityLabel={`${t(S.knowledgeTitle)}, ${t(S.knowledgeEntryDetail)}`} onPress={() => open('/knowledge')}>
          <View style={[styles.guideIcon, { backgroundColor: hues.indigo }]}>
            <Ionicons name="compass-outline" size={18} color="#ffffff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.callout }}>
              {t(S.knowledgeTitle)}
            </Text>
            <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.caption, marginTop: 1 }}>
              {t(S.knowledgeEntryDetail)}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={palette.muted} />
        </GroupRow>
      </GroupCard>
    </View>
  );
}

function WisdomTile({ topic, flex = 1, tall }: { topic: WisdomTopic; flex?: number; tall?: boolean }) {
  const { palette } = usePrefs();
  const { t } = useI18n();
  return (
    <BentoTile
      flex={flex}
      minHeight={tall ? 220 : 104}
      accessibilityLabel={t(S.homeTopicA11y(t(topic.title), topic.minutes))}
      onPress={() => open(`/wisdom/${topic.id}`)}
      glow={`${topic.accent}33`}
      style={{ rowGap: SPACE.xs, paddingLeft: SPACE.lg + 4 }}>
      <View pointerEvents="none" style={[styles.wisdomStripe, { backgroundColor: topic.accent }]} />
      {tall ? (
        <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: topic.accent, fontSize: TYPE.callout, lineHeight: TYPE.callout * 1.55, fontWeight: '700', marginBottom: 'auto' }}>
          {topic.sanskrit}
        </Text>
      ) : null}
      <Text maxFontSizeMultiplier={TITLE_FONT_CAP} numberOfLines={2} style={{ color: palette.text, fontSize: tall ? TYPE.title3 : TYPE.subhead, fontWeight: '700' }}>
        {t(topic.title)}
      </Text>
      <Text maxFontSizeMultiplier={TITLE_FONT_CAP} numberOfLines={tall ? 4 : 2} style={{ color: palette.muted, fontSize: TYPE.caption, lineHeight: TYPE.caption * 1.5 }}>
        {t(topic.short)}
      </Text>
    </BentoTile>
  );
}

/** The website's band of Upanishadic sayings, as cards that scroll sideways under the reader's thumb. */
function Sayings() {
  const { palette, settings } = usePrefs();
  const { t } = useI18n();
  const size = TYPE.title2 * settings.textScale;
  return (
    <View>
      <SectionHead title={t(S.homeSayings)} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={260 + SPACE.md}
        decelerationRate="fast"
        style={{ flexGrow: 0, marginHorizontal: -SPACE.lg, marginVertical: -SPACE.lg + 4 }}
        contentContainerStyle={{ paddingHorizontal: SPACE.lg, columnGap: SPACE.md, paddingVertical: SPACE.lg, alignItems: 'flex-start' }}>
        {SAYINGS.map((s) => (
          <PressableScale
            key={s.sa}
            accessibilityRole="link"
            accessibilityLabel={`${s.sa}. ${t(S.homeSayingA11y(t(s.gloss), t(s.cite)))}`}
            onPress={() => open(s)}
            style={[styles.saying, glass(palette)]}>
            <Text maxFontSizeMultiplier={fontCap(settings.textScale)} style={{ color: palette.accent, fontSize: size, lineHeight: size * 1.6, fontWeight: '600' }}>
              {s.sa.replace(/[\s।॥]+$/u, '')}
              <Text style={{ color: huesFor(palette).gold }}> ॥</Text>
            </Text>
            <View style={{ rowGap: 4 }}>
              <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.textSecondary, fontSize: TYPE.subhead, lineHeight: TYPE.subhead * 1.45 }}>
                {t(s.gloss)}
              </Text>
              <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.caption }}>
                {t(s.cite)}
              </Text>
            </View>
          </PressableScale>
        ))}
      </ScrollView>
    </View>
  );
}

/** The website's trust strip, in one quiet line: what the app is, and what works offline. */
function TrustStrip() {
  const { palette } = usePrefs();
  const { t } = useI18n();
  const { installed } = useDownloads();
  const offline = CATALOG.filter((b) => b.bundled || installed[b.id]);
  const verses = offline.reduce((sum, b) => sum + b.totalVerses, 0);
  return (
    <View style={{ alignItems: 'center', rowGap: 4, paddingVertical: SPACE.lg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 6 }}>
        <Ionicons name="shield-checkmark-outline" size={15} color={palette.accent} />
        <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.caption, fontWeight: '600' }}>
          {t(S.homeTrust)}
        </Text>
      </View>
      <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.caption, textAlign: 'center' }}>
        {t(S.homeStats(offline.length, verses))}
      </Text>
    </View>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const topRef = useTabTop();
  const { height } = useWindowDimensions();
  const { scrollY, onScroll } = useScrollY();
  const { mood, panchang } = useMood();
  const depth = useMemo(() => ({ scrollY, windowHeight: height }), [scrollY, height]);
  return (
    <Backdrop>
      <BentoDepth.Provider value={depth}>
        <Animated.ScrollView
          ref={topRef as never}
          onScroll={onScroll}
          scrollEventThrottle={16}
          style={{ backgroundColor: 'transparent' }}
          contentContainerStyle={{ paddingTop: insets.top, paddingHorizontal: SPACE.lg, paddingBottom: barClearance(insets.bottom), rowGap: SPACE.lg }}>
          <Hero mood={mood} scrollY={scrollY} />
          <TodayBento panchang={panchang} />
          <FeaturedPassage />
          <QuickTiles />
          <VerseOfTheDay />
          <Shelf />
          <Guides />
          <Wisdom />
          <Sayings />
          <TrustStrip />
        </Animated.ScrollView>
      </BentoDepth.Provider>
      <TitleBar scrollY={scrollY} title={mood.greeting} />
    </Backdrop>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: SPACE.sm,
    paddingHorizontal: SPACE.md,
    paddingVertical: 7,
    borderRadius: RADIUS.pill,
  },
  heroLight: { position: 'absolute', left: -SPACE.lg, right: -SPACE.lg, top: -120, height: 520 },
  heroMandala: { position: 'absolute', right: -90, top: 70 },
  sunRow: { flexDirection: 'row', alignItems: 'center', columnGap: 5 },
  weekDots: { flexDirection: 'row', justifyContent: 'space-between' },
  weekDot: { width: 10, height: 10, borderRadius: 5 },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: SPACE.sm,
    minHeight: TOUCH + 4,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACE.lg,
    marginTop: SPACE.xs,
  },
  featured: {
    borderRadius: RADIUS.panel + 2,
    padding: SPACE.xl,
    backgroundColor: '#321c27',
    borderWidth: 1,
    borderColor: 'rgba(253,230,138,0.25)',
    overflow: 'hidden',
  },
  ring: { position: 'absolute', borderRadius: 999, borderWidth: 1, borderColor: 'rgba(253,230,138,0.14)' },
  featuredHead: { flexDirection: 'row', alignItems: 'flex-start', columnGap: SPACE.md },
  featuredArrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,247,233,0.25)',
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  featuredFoot: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    columnGap: SPACE.md,
    rowGap: SPACE.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,247,233,0.2)',
    paddingTop: SPACE.lg,
  },
  quick: { justifyContent: 'space-between' },
  quickTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  play: { width: TOUCH, height: TOUCH, borderRadius: TOUCH / 2, alignItems: 'center', justifyContent: 'center' },
  track: { height: 4, borderRadius: 2, overflow: 'hidden' },
  fill: { height: 4, borderRadius: 2 },
  cardHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', columnGap: SPACE.sm, flexWrap: 'wrap' },
  goldBar: { position: 'absolute', left: 0, top: SPACE.lg, bottom: SPACE.lg, width: 3, borderTopRightRadius: 2, borderBottomRightRadius: 2 },
  sectionHead: { flexDirection: 'row', alignItems: 'flex-end', columnGap: SPACE.md, marginBottom: SPACE.sm },
  seeAll: { flexDirection: 'row', alignItems: 'center', minHeight: TOUCH, columnGap: 2 },
  book: {
    width: 132,
    height: 184,
    borderRadius: RADIUS.row,
    padding: SPACE.md,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  bookScrim: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 96 },
  bookFrame: { position: 'absolute', top: 6, left: 6, right: 6, bottom: 6, borderWidth: 1, borderRadius: RADIUS.row - 6 },
  guideHead: { flexDirection: 'row', alignItems: 'center', columnGap: SPACE.md, paddingHorizontal: SPACE.lg, paddingTop: SPACE.lg, paddingBottom: SPACE.sm },
  guideIcon: { width: 32, height: 32, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  fact: { flexDirection: 'row', alignItems: 'center', columnGap: 5, paddingHorizontal: SPACE.sm + 2, paddingVertical: 6, borderRadius: RADIUS.pill },
  facts: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACE.sm },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACE.sm, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(128,128,128,0.25)', paddingTop: SPACE.md },
  pill: { minHeight: TOUCH - 4, paddingHorizontal: SPACE.lg, borderRadius: RADIUS.pill, justifyContent: 'center' },
  wisdomStripe: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4 },
  saying: { width: 260, minHeight: 150, borderRadius: RADIUS.card, padding: SPACE.lg, justifyContent: 'space-between', rowGap: SPACE.md },
});
