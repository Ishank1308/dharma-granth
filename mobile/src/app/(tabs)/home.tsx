import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useMemo, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Backdrop, Card, coverFill, CoverTile, glass, GroupCard, GroupRow, GroupTitle } from '@/components/ui';
import { CATALOG, dailyVerse, getEntry, loadChapter } from '@/content/catalog';
import { useDownloads } from '@/content/downloads';
import { FEATURED, LIFE_GUIDES, PRACTICE_GUIDES, SAYINGS, SHELF, type Guide, type Passage } from '@/content/home-picks';
import { S, useI18n, type Msg } from '@/i18n';
import { dateFromDayKey, useToday } from '@/lib/use-today';
import { formatVerseRef, sanskritLines } from '@/lib/verse-format';
import { useAppState } from '@/state/app-state';
import { coverFor, monogram } from '@/theme/covers';
import { barClearance, fontCap, huesFor, quietFill, RADIUS, SPACE, TITLE_FONT_CAP, TOUCH, TYPE } from '@/theme/themes';

/**
 * Home, after the website's home page (app/page.tsx): the promise and a way in (hero, search, a featured
 * passage), the reader's own place (continue reading, verse of the day), the library as book covers,
 * doorways by question and by practice, and the Upanishads' sayings. The Library tab keeps the full list.
 *
 * Other screens' features join here as they land: the reading streak (progress), today's Panchang
 * (Explore) and Wisdom for life (knowledge pages).
 */

function open(p: Passage) {
  if (p.chapter == null) {
    router.push({ pathname: '/scripture/[id]', params: { id: p.id } });
    return;
  }
  router.push({
    pathname: '/scripture/[id]/[chapter]',
    params: p.verse ? { id: p.id, chapter: String(p.chapter), verse: p.verse } : { id: p.id, chapter: String(p.chapter) },
  });
}

/** Press feedback shared by the cards: a slight sink, as the Library's cards. */
function usePressed() {
  return (pressed: boolean): ViewStyle | null => (pressed ? { transform: [{ scale: 0.985 }], opacity: 0.95 } : null);
}

function greeting(hour: number): Msg {
  if (hour >= 4 && hour < 12) return S.homeGreetingMorning;
  if (hour >= 17 || hour < 4) return S.homeGreetingEvening;
  return S.homeGreetingDay;
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

function Hero() {
  const { palette } = useAppState();
  const { t, lang } = useI18n();
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
  const hello = t(greeting(new Date().getHours()));

  return (
    <View style={{ paddingTop: SPACE.xl, rowGap: SPACE.md }}>
      <View style={[styles.eyebrow, glass(palette)]}>
        <View style={[styles.dot, { backgroundColor: palette.accent }]} />
        <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ flexShrink: 1, color: palette.accent, fontSize: TYPE.caption, fontWeight: '700' }}>
          {dateLabel ? `${hello} · ${dateLabel}` : hello}
        </Text>
      </View>
      <View accessibilityRole="header" accessible>
        <Text
          maxFontSizeMultiplier={TITLE_FONT_CAP}
          style={{ color: palette.text, fontSize: TYPE.largeTitle + 4, lineHeight: (TYPE.largeTitle + 4) * (lang === 'hi' ? 1.35 : 1.08), fontWeight: '800', letterSpacing: lang === 'hi' ? 0 : -1 }}>
          {t(S.homeTitleLead)}
          {'\n'}
          <Text style={{ color: palette.accent }}>{t(S.homeTitleAccent)}</Text>
        </Text>
      </View>
      {/* The Hindi line stays in Hindi in both languages, as on the website. */}
      <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.title3, lineHeight: TYPE.title3 * 1.5, fontWeight: '600' }}>
        {S.homeTagline.hi}
      </Text>
      <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.subhead, lineHeight: TYPE.subhead * 1.5 }}>
        {t(S.homeIntro)}
      </Text>
      <Pressable
        accessibilityRole="search"
        accessibilityLabel={t(S.searchInsideVerses)}
        onPress={() => router.push('/search')}
        style={({ pressed }) => [styles.search, glass(palette, true), pressed && { opacity: 0.8 }]}>
        <Ionicons name="search" size={20} color={palette.accent} />
        <Text maxFontSizeMultiplier={TITLE_FONT_CAP} numberOfLines={1} style={{ flex: 1, color: palette.muted, fontSize: TYPE.callout }}>
          {t(S.homeSearch)}
        </Text>
      </Pressable>
    </View>
  );
}

/**
 * The featured passage, the website hero's dark card: deep plum with gold rings, the whole verse (both
 * lines, never cut short) and a quiet note. The colours are the website's own and stay in every theme.
 */
function FeaturedPassage() {
  const { palette, settings } = useAppState();
  const { t } = useI18n();
  const pressed = usePressed();
  const verse = loadChapter(FEATURED.id, FEATURED.chapter!)?.verses.find((v) => String(v.number) === FEATURED.verse);
  const lines = sanskritLines(verse?.sanskrit);
  if (!verse || lines.length === 0) return null;
  const size = TYPE.title3 * settings.textScale;
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={t(S.homeFeaturedA11y)} onPress={() => open(FEATURED)} style={({ pressed: p }) => pressed(p)}>
      <View
        style={[
          styles.featured,
          palette.lite
            ? null
            : {
                backgroundImage:
                  'radial-gradient(circle at 85% 22%, rgba(245,189,100,0.24) 0%, transparent 46%), linear-gradient(140deg, rgba(181,88,53,0.22) 0%, transparent 65%)',
                boxShadow: '0 24px 50px -24px rgba(58,29,15,0.6)',
              },
        ]}>
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
          {/* Every line of the verse: a shloka is never cut to fit a card. */}
          {lines.map((l, i) => (
            <Text
              key={i}
              maxFontSizeMultiplier={fontCap(settings.textScale)}
              style={{ color: '#fffaf0', fontSize: size, lineHeight: size * 1.7, fontWeight: '600' }}>
              {l}
              {i === lines.length - 1 ? <Text style={{ color: '#f6c768' }}> ॥</Text> : null}
            </Text>
          ))}
        </View>

        <View style={styles.featuredFoot}>
          <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ flex: 1, color: '#f8ddad', fontSize: TYPE.footnote, lineHeight: TYPE.footnote * 1.5 }}>
            {t(S.homeFeaturedNote)}
          </Text>
          <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: '#fff7e9', fontSize: TYPE.footnote, fontWeight: '700' }}>
            {t(S.homeReadVerse)} →
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

/** Two doorways under the featured card, as on the website: the Gita, and the Upanishads. */
function QuickTiles() {
  const { palette } = useAppState();
  const { t } = useI18n();
  const pressed = usePressed();
  const upanishads = CATALOG.filter((b) => b.category === 'upanishad' && b.bundled).length;
  const tile = (key: string, icon: 'book' | 'compass', title: string, detail: string, onPress: () => void, tinted: boolean) => (
    <Pressable
      key={key}
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${detail}`}
      onPress={onPress}
      style={({ pressed: p }) => [
        styles.quick,
        glass(palette, !tinted),
        tinted && { backgroundColor: palette.dark ? 'rgba(255,159,10,0.14)' : 'rgba(194,65,12,0.08)' },
        pressed(p),
      ]}>
      <View style={styles.quickTop}>
        <Ionicons name={icon} size={22} color={palette.accent} />
        <Ionicons name="arrow-forward" size={16} color={palette.accent} />
      </View>
      <View>
        <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.callout, fontWeight: '700' }}>
          {title}
        </Text>
        <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.caption, marginTop: 2 }}>
          {detail}
        </Text>
      </View>
    </Pressable>
  );
  return (
    <View style={{ flexDirection: 'row', columnGap: SPACE.md }}>
      {tile('gita', 'book', t(S.homeStartGita), t(S.homeStartGitaDetail), () => open({ id: 'bhagavadgita' }), true)}
      {tile('upanishads', 'compass', t(S.homeUpanishads), t(S.homeUpanishadsDetail(upanishads)), () => router.navigate('/'), false)}
    </View>
  );
}

function ContinueCard() {
  const { lastRead, palette } = useAppState();
  const { t } = useI18n();
  const pressed = usePressed();
  if (!lastRead) return null;
  const entry = getEntry(lastRead.id);
  const idx = entry ? entry.chapters.findIndex((c) => c.number === lastRead.chapter) : -1;
  const ch = entry && idx >= 0 ? entry.chapters[idx] : undefined;
  if (!entry || !ch) return null;
  const cover = coverFor(entry.id, entry.category);
  const progress = (idx + 1) / entry.chapters.length;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t(S.continueReadingA11y(entry.title, ch.number))}
      onPress={() => open({ id: entry.id, chapter: ch.number })}
      style={({ pressed: p }) => pressed(p)}>
      <Card strong style={{ borderRadius: RADIUS.panel - 2, rowGap: SPACE.md }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: SPACE.md }}>
          <CoverTile cover={cover} letter={monogram(entry.titleSanskrit ?? entry.title)} size={52} />
          <View style={{ flex: 1 }}>
            <Kicker color={palette.accent}>{t(S.continueReading)}</Kicker>
            <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.body, fontWeight: '700', marginTop: 3 }}>
              {entry.titleSanskrit ?? entry.title}
            </Text>
            <Text maxFontSizeMultiplier={TITLE_FONT_CAP} numberOfLines={1} style={{ color: palette.muted, fontSize: TYPE.footnote, marginTop: 1 }}>
              {t(S.chapterN(ch.number))}
              {ch.titleSanskrit ? ` · ${ch.titleSanskrit}` : ch.title ? ` · ${ch.title}` : ''}
            </Text>
          </View>
          <View style={[styles.play, { backgroundColor: palette.dark ? 'rgba(255,159,10,0.16)' : 'rgba(194,65,12,0.10)' }]}>
            <Ionicons name="play" size={18} color={palette.accent} />
          </View>
        </View>
        <View style={[styles.track, { backgroundColor: quietFill(palette) }]}>
          <View style={[styles.fill, coverFill(cover, palette), { width: `${Math.max(4, Math.round(progress * 100))}%` }]} />
        </View>
      </Card>
    </Pressable>
  );
}

function VerseOfTheDay() {
  const { palette, settings } = useAppState();
  const { t } = useI18n();
  const pressed = usePressed();
  const today = useToday();
  const pick = useMemo(() => dailyVerse(dateFromDayKey(today)), [today]);
  if (!pick) return null;
  const verse = loadChapter(pick.id, pick.chapter)?.verses[pick.index];
  if (!verse) return null;
  const lines = sanskritLines(verse.sanskrit);
  const hues = huesFor(palette);
  const size = TYPE.callout * settings.textScale;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t(S.verseOfTheDayA11y)}
      onPress={() => open({ id: pick.id, chapter: pick.chapter, verse: String(verse.number) })}
      style={({ pressed: p }) => pressed(p)}>
      <Card style={{ borderRadius: RADIUS.panel - 2, paddingLeft: SPACE.lg + 6 }}>
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
        {/* The whole verse, every line: never cut a shloka to fit the card. */}
        <View style={{ marginTop: SPACE.sm }}>
          {lines.map((l, i) => (
            <Text key={i} maxFontSizeMultiplier={fontCap(settings.textScale)} style={{ color: palette.text, fontSize: size, lineHeight: size * 1.65 }}>
              {l}
              {i === lines.length - 1 ? <Text style={{ color: hues.gold }}> ॥</Text> : null}
            </Text>
          ))}
        </View>
      </Card>
    </Pressable>
  );
}

function SectionHead({ title, detail, action }: { title: string; detail?: string; action?: ReactNode }) {
  const { palette } = useAppState();
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
  const { palette } = useAppState();
  const { t } = useI18n();
  const pressed = usePressed();
  const books = SHELF.map(getEntry).filter((b): b is NonNullable<typeof b> => !!b && b.bundled);
  return (
    <View>
      <SectionHead
        title={t(S.homeShelf)}
        action={
          <Pressable
            accessibilityRole="link"
            accessibilityLabel={t(S.homeSeeAllA11y(CATALOG.length))}
            onPress={() => router.navigate('/')}
            hitSlop={8}
            style={({ pressed: p }) => [styles.seeAll, p && { opacity: 0.6 }]}>
            <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.accent, fontSize: TYPE.subhead, fontWeight: '600' }}>
              {t(S.homeSeeAll)}
            </Text>
            <Ionicons name="chevron-forward" size={16} color={palette.accent} />
          </Pressable>
        }
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginHorizontal: -SPACE.lg, marginVertical: -SPACE.lg + 4 }}
        contentContainerStyle={{ paddingHorizontal: SPACE.lg, columnGap: SPACE.md, paddingVertical: SPACE.lg }}>
        {books.map((b) => {
          const cover = coverFor(b.id, b.category);
          const sa = b.titleSanskrit ?? b.title;
          return (
            <Pressable
              key={b.id}
              accessibilityRole="button"
              accessibilityLabel={t(S.bookA11y(b.title, b.chapters.length))}
              onPress={() => open({ id: b.id })}
              style={({ pressed: p }) => [
                styles.book,
                coverFill(cover, palette),
                !palette.lite && { boxShadow: palette.dark ? '0 10px 24px rgba(0,0,0,0.5)' : '0 10px 22px rgba(60,30,10,0.18)' },
                pressed(p),
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
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

function GuideCard({ title, icon, guides, tint }: { title: string; icon: 'compass' | 'sunny'; guides: Guide[]; tint: string }) {
  const { palette } = useAppState();
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
  const { palette } = useAppState();
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

/** The website's band of Upanishadic sayings, as cards that scroll sideways under the reader's thumb. */
function Sayings() {
  const { palette, settings } = useAppState();
  const { t } = useI18n();
  const pressed = usePressed();
  const size = TYPE.title2 * settings.textScale;
  return (
    <View>
      <SectionHead title={t(S.homeSayings)} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={260 + SPACE.md}
        decelerationRate="fast"
        style={{ marginHorizontal: -SPACE.lg, marginVertical: -SPACE.lg + 4 }}
        contentContainerStyle={{ paddingHorizontal: SPACE.lg, columnGap: SPACE.md, paddingVertical: SPACE.lg }}>
        {SAYINGS.map((s) => (
          <Pressable
            key={s.sa}
            accessibilityRole="link"
            accessibilityLabel={`${s.sa}. ${t(S.homeSayingA11y(t(s.gloss), t(s.cite)))}`}
            onPress={() => open(s)}
            style={({ pressed: p }) => [styles.saying, glass(palette), pressed(p)]}>
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
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

/** The website's trust strip, in one quiet line: what the app is, and what works offline. */
function TrustStrip() {
  const { palette } = useAppState();
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
  return (
    <Backdrop>
      <ScrollView
        style={{ backgroundColor: 'transparent' }}
        contentContainerStyle={{ paddingTop: insets.top, paddingHorizontal: SPACE.lg, paddingBottom: barClearance(insets.bottom), rowGap: SPACE.lg }}>
        <Hero />
        <FeaturedPassage />
        <QuickTiles />
        <ContinueCard />
        <VerseOfTheDay />
        <Shelf />
        <Guides />
        <Sayings />
        <TrustStrip />
      </ScrollView>
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
  dot: { width: 6, height: 6, borderRadius: 3 },
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
  quick: { flex: 1, minHeight: 128, borderRadius: RADIUS.card, padding: SPACE.lg, justifyContent: 'space-between' },
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
  saying: { width: 260, minHeight: 150, borderRadius: RADIUS.card, padding: SPACE.lg, justifyContent: 'space-between', rowGap: SPACE.md },
});
