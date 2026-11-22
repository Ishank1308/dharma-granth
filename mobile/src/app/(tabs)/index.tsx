import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useScrollToTop } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { ScrollView, SectionList, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import Animated, { useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, type SharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CoverBook } from '@/components/art/cover-book';
import { EmptyArt } from '@/components/art/empty-art';
import { ReadingStreakCard } from '@/components/reading-streak';
import { Backdrop, Card, Chip, CoverTile, coverFill, glass, GroupCard, GroupRow, GroupTitle, IconTile, LargeHeader, Muted } from '@/components/ui';
import { CATALOG, CATEGORIES, dailyVerse, getEntry, loadChapter } from '@/content/catalog';
import { useDownloads } from '@/content/downloads';
import type { CatalogEntry } from '@/content/types';
import { S, useI18n } from '@/i18n';
import { bookReadCount, isVerseRead, percentRead } from '@/lib/progress';
import { dateFromDayKey, useToday } from '@/lib/use-today';
import { formatVerseRef, sanskritLines } from '@/lib/verse-format';
import { AnimatedSectionList, useScrollY } from '@/motion/parallax';
import { PressableScale } from '@/motion/pressable-scale';
import { useOriginPress } from '@/motion/shared-origin';
import { useStagger } from '@/motion/stagger';
import { useMotion } from '@/motion/use-motion';
import { TitleBar } from '@/motion/title-bar';
import { toScript } from '@/lib/sanskrit-script';
import { useAppState, usePrefs } from '@/state/app-state';
import { sanskritFont } from '@/theme/fonts';
import { coverFor, monogram } from '@/theme/covers';
import { barClearance, fontCap, huesFor, quietFill, RADIUS, SPACE, TITLE_FONT_CAP, TOUCH, TYPE, UI_FONT_CAP } from '@/theme/themes';

export { ErrorBoundary } from '@/components/error-boundary';

function matches(b: CatalogEntry, q: string) {
  if (!q) return true;
  const needle = q.trim().toLowerCase();
  return b.title.toLowerCase().includes(needle) || (b.titleSanskrit ?? '').includes(q.trim()) || b.id.includes(needle);
}

function DailyVerseCard() {
  const { palette, settings } = usePrefs();
  const { progress } = useAppState();
  const { t } = useI18n();
  // Re-picked when the date changes, so the card turns over at midnight even if the app stays open.
  const today = useToday();
  const pick = useMemo(() => dailyVerse(dateFromDayKey(today)), [today]);
  if (!pick) return null;
  const verse = loadChapter(pick.id, pick.chapter)?.verses[pick.index];
  if (!verse) return null;
  const lines = sanskritLines(verse.sanskrit);
  const read = isVerseRead(progress, pick.id, pick.chapter, verse.number);
  const ref = t(S.gitaRef(formatVerseRef(pick.id, pick.chapter, verse.number)));
  // A verse is a page of a book, so the card wears that book's cover: one of the few places colour is lavish.
  const cover = coverFor(pick.id, getEntry(pick.id)?.category ?? 'other');
  return (
    <PressableScale
      accessibilityRole="button"
      // The label carries the verse itself: a label made of the action alone would hide the shloka from TalkBack.
      accessibilityLabel={`${t(S.verseOfTheDayFullA11y(ref, lines.join('\n')))}${read ? `. ${t(S.verseReadToday)}` : ''}`}
      accessibilityHint={t(S.verseOfTheDayA11y)}
      onPress={() =>
        router.push({
          pathname: '/scripture/[id]/[chapter]',
          params: { id: pick.id, chapter: String(pick.chapter), verse: String(verse.number) },
        })
      }
      haptic>
      <View style={[styles.daily, coverFill(cover, palette, true), !palette.lite && styles.dailyLift]}>
        {!palette.lite ? (
          <View
            pointerEvents="none"
            style={[StyleSheet.absoluteFill, { backgroundImage: `radial-gradient(70% 60% at 85% 0%, ${cover.colors[2]}73 0%, transparent 70%)` }]}
          />
        ) : null}
        <View style={styles.cardHead}>
          <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: cover.foil, fontSize: TYPE.footnote, fontWeight: '600' }}>
            {t(S.verseOfTheDay)}
          </Text>
          <View style={styles.refRow}>
            {read ? <Ionicons name="checkmark-circle" size={14} color="rgba(255,255,255,0.9)" /> : null}
            <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: 'rgba(255,255,255,0.78)', fontSize: TYPE.footnote }}>
              {ref}
            </Text>
          </View>
        </View>
        {/* The whole verse, every line: never cut a shloka to fit the card. */}
        <View style={{ marginTop: SPACE.sm }}>
          {lines.map((l, i) => (
            <Text
              key={i}
              maxFontSizeMultiplier={fontCap(settings.textScale)}
              style={[
                {
                  color: '#ffffff',
                  fontSize: TYPE.body * settings.textScale,
                  lineHeight: TYPE.body * settings.textScale * 1.75,
                },
                sanskritFont(settings.sanskritScript),
              ]}>
              {toScript(l, settings.sanskritScript)}
            </Text>
          ))}
        </View>
      </View>
    </PressableScale>
  );
}

/** A few well-known books standing on a shelf, so a first visit has somewhere obvious to begin. */
const SHELF = ['bhagavadgita', 'ramcharitmanas', 'katha', 'ishavasya', 'yogasutra', 'vivekchudamani'];

const SHELF_ITEM = 92;
const SHELF_STRIDE = SHELF_ITEM + SPACE.lg;

/**
 * The shelf turns as it scrolls, like books on a carousel: each cover faces you as it passes the middle and
 * turns away toward the edges, lifting a little at the centre. It snaps book by book. With light effects or
 * reduce motion the covers stand still at a fixed angle.
 */
function BookShelf() {
  const { t } = useI18n();
  const { rich } = useMotion();
  const { width } = useWindowDimensions();
  const scrollX = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollX.set(e.contentOffset.x);
  });
  const books = SHELF.map((id) => getEntry(id)).filter((b): b is CatalogEntry => !!b);
  if (books.length === 0) return null;
  return (
    <View style={{ rowGap: SPACE.sm }}>
      <GroupTitle title={t(S.shelfTitle)} />
      <Animated.ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        snapToInterval={SHELF_STRIDE}
        decelerationRate="fast"
        // Room for the covers' shadows, which a scroller would otherwise clip.
        style={{ marginHorizontal: -SPACE.lg, marginTop: -SPACE.sm }}
        contentContainerStyle={{ paddingHorizontal: SPACE.lg, paddingTop: SPACE.md, paddingBottom: SPACE.lg, columnGap: SPACE.lg }}>
        {books.map((b, i) => (
          <ShelfBook key={b.id} book={b} index={i} scrollX={scrollX} viewport={width} turning={rich} />
        ))}
      </Animated.ScrollView>
    </View>
  );
}

function ShelfBook({ book, index, scrollX, viewport, turning }: { book: CatalogEntry; index: number; scrollX: SharedValue<number>; viewport: number; turning: boolean }) {
  const { palette } = usePrefs();
  const { t, lang } = useI18n();
  const { ref, press } = useOriginPress(`book:${book.id}`);
  const title = lang === 'hi' ? (book.titleSanskrit ?? book.title) : book.title;
  const turn = useAnimatedStyle(() => {
    if (!turning) return {};
    const centre = SPACE.lg + index * SHELF_STRIDE + SHELF_ITEM / 2 - scrollX.get();
    const n = Math.max(-1, Math.min(1, (centre - viewport / 2) / (viewport / 2)));
    return { transform: [{ perspective: 700 }, { rotateY: `${n * -24}deg` }, { translateY: -(1 - Math.abs(n)) * 6 }] };
  });
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={t(S.openBookA11y(book.title))}
      onPress={() => press(() => router.push({ pathname: '/scripture/[id]', params: { id: book.id, via: 'cover' } }))}
      style={{ width: SHELF_ITEM, rowGap: SPACE.sm }}>
      <Animated.View style={turn}>
        <View ref={ref} collapsable={false}>
          <CoverBook cover={coverFor(book.id, book.category)} letter={monogram(book.titleSanskrit ?? book.title)} width={84} turn={turning ? 0 : -10} />
        </View>
      </Animated.View>
      <Text numberOfLines={2} maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.footnote, fontWeight: '500' }}>
        {title}
      </Text>
    </PressableScale>
  );
}

function ContinueCard() {
  const { lastRead, palette, progress } = useAppState();
  const { t } = useI18n();
  if (!lastRead) return null;
  const entry = getEntry(lastRead.id);
  const idx = entry ? entry.chapters.findIndex((c) => c.number === lastRead.chapter) : -1;
  const ch = entry && idx >= 0 ? entry.chapters[idx] : undefined;
  if (!entry || !ch) return null;
  const cover = coverFor(entry.id, entry.category);
  // How much of the book has been read, verse by verse. Before any verse counts, fall back to the
  // chapter's place in the book, as before.
  const read = bookReadCount(progress, entry.id, entry.chapters);
  const pct = percentRead(read, entry.totalVerses);
  const fraction = read > 0 && entry.totalVerses > 0 ? read / entry.totalVerses : (idx + 1) / entry.chapters.length;
  const verse = lastRead.verse;
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={
        verse ? t(S.continueReadingVerseA11y(entry.title, ch.number, verse, pct)) : t(S.continueReadingA11y(entry.title, ch.number))
      }
      onPress={() =>
        router.push({
          pathname: '/scripture/[id]/[chapter]',
          params: verse ? { id: entry.id, chapter: String(ch.number), verse } : { id: entry.id, chapter: String(ch.number) },
        })
      }
      haptic>
      <Card strong style={{ borderRadius: RADIUS.panel - 2, rowGap: SPACE.md }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: SPACE.md }}>
          <CoverBook cover={cover} letter={monogram(entry.titleSanskrit ?? entry.title)} width={52} turn={0} />
          <View style={{ flex: 1 }}>
            <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.accent, fontSize: TYPE.footnote, fontWeight: '700' }}>
              {t(S.continueReading)}
            </Text>
            <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.body, fontWeight: '600', marginTop: 2 }}>
              {entry.title}
            </Text>
            <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.footnote, marginTop: 1 }}>
              {verse ? t(S.continueAtVerse(ch.number, verse)) : t(S.chapterN(ch.number))}
              {ch.titleSanskrit ? `, ${ch.titleSanskrit}` : ''}
            </Text>
          </View>
          <View style={[styles.play, { backgroundColor: palette.dark ? 'rgba(255,159,10,0.16)' : 'rgba(194,65,12,0.10)' }]}>
            <Ionicons name="play" size={18} color={palette.accent} />
          </View>
        </View>
        {/* How far through the book, in the book's own cover colours. */}
        <View style={styles.trackRow}>
          <View style={[styles.track, { flex: 1, backgroundColor: quietFill(palette) }]}>
            <View style={[styles.fill, coverFill(cover, palette), { width: `${Math.max(4, Math.round(fraction * 100))}%` }]} />
          </View>
          {pct > 0 ? (
            <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.caption, fontWeight: '600' }}>
              {pct === 100 ? t(S.bookFinished) : t(S.percentRead(pct))}
            </Text>
          ) : null}
        </View>
      </Card>
    </PressableScale>
  );
}

/** One book in the list. Its tile flies onto the title page as the book opens (src/motion/shared-origin). */
function BookRow({ item, first, last, downloaded }: { item: CatalogEntry; first: boolean; last: boolean; downloaded: boolean }) {
  const { palette } = usePrefs();
  const { progress } = useAppState();
  const { t } = useI18n();
  const { ref, press } = useOriginPress(`book:${item.id}`);
  const cover = coverFor(item.id, item.category);
  const status = item.bundled ? S.availableOffline : downloaded ? S.downloadedOffline : S.canDownload;
  const pct = percentRead(bookReadCount(progress, item.id, item.chapters), item.totalVerses);
  const readLabel = pct === 100 ? S.bookFinished : pct > 0 ? S.percentRead(pct) : undefined;
  return (
    <GroupRow
      first={first}
      last={last}
      inset={72}
      accessibilityLabel={`${t(S.bookA11y(item.title, item.chapters.length))}, ${t(status)}${readLabel ? `, ${t(readLabel)}` : ''}`}
      onPress={() => press(() => router.push({ pathname: '/scripture/[id]', params: { id: item.id, via: 'cover' } }))}>
      <View ref={ref} collapsable={false}>
        <CoverTile cover={cover} letter={monogram(item.titleSanskrit ?? item.title)} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: palette.text, fontSize: TYPE.body, fontWeight: '600' }}>{item.titleSanskrit ?? item.title}</Text>
        <Text style={{ color: palette.muted, fontSize: TYPE.footnote, marginTop: 2 }}>
          {item.title} · {t(S.bookSummary(item.chapters.length, item.totalVerses))}
          {readLabel ? <Text style={{ color: palette.accent, fontWeight: '600' }}>{` · ${t(readLabel)}`}</Text> : null}
        </Text>
      </View>
      {item.bundled || downloaded ? null : <Ionicons name="cloud-download-outline" size={18} color={palette.muted} />}
      <Ionicons name="chevron-forward" size={18} color={palette.muted} />
    </GroupRow>
  );
}

/** The way into the knowledge pages and Wisdom for life (src/app/knowledge, src/app/wisdom). */
function KnowledgeCard() {
  const { palette } = usePrefs();
  const { t } = useI18n();
  // Deep hues in every theme, so the white glyph keeps its contrast on Dark too.
  const hues = huesFor({ dark: false });
  const rows = [
    { key: 'wisdom', title: S.wisdomTitle, detail: S.wisdomEntryDetail, icon: 'flower-outline' as const, color: hues.lotus, go: () => router.push('/wisdom') },
    { key: 'knowledge', title: S.knowledgeTitle, detail: S.knowledgeEntryDetail, icon: 'compass-outline' as const, color: hues.indigo, go: () => router.push('/knowledge') },
  ];
  return (
    <GroupCard>
      {rows.map((r, i) => (
        <GroupRow key={r.key} standalone={i === 0} inset={60} accessibilityLabel={`${t(r.title)}. ${t(r.detail)}`} onPress={r.go}>
          <IconTile icon={r.icon} color={r.color} />
          <View style={{ flex: 1 }}>
            <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.body, fontWeight: '600' }}>
              {t(r.title)}
            </Text>
            <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.footnote, marginTop: 2 }}>
              {t(r.detail)}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={palette.muted} />
        </GroupRow>
      ))}
    </GroupCard>
  );
}

export default function LibraryScreen() {
  const insets = useSafeAreaInsets();
  const { palette } = usePrefs();
  const { installed } = useDownloads();
  const { t, lang } = useI18n();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const { scrollY, onScroll } = useScrollY();
  // The cards and the first rows rise in, one after another, the first time the Library opens.
  const stagger = useStagger();
  // Tapping the Library tab again while on it scrolls back up to the header, as on iOS and One UI.
  const listRef = useRef<SectionList<CatalogEntry, { key: string; en: string; hi: string; data: CatalogEntry[] }>>(null);
  // The hook reaches the list's scroll view through getScrollResponder() at runtime; only its typings are
  // narrower than SectionList's, hence the cast.
  useScrollToTop(listRef as unknown as Parameters<typeof useScrollToTop>[0]);

  const sections = useMemo(() => {
    return CATEGORIES.filter((c) => !category || c.key === category)
      .map((c) => ({
        key: c.key,
        en: c.en,
        hi: c.hi,
        data: CATALOG.filter((b) => b.category === c.key && matches(b, query)).sort((a, b) => Number(b.bundled) - Number(a.bundled)),
      }))
      .filter((s) => s.data.length > 0);
  }, [query, category]);

  const offline = CATALOG.filter((b) => b.bundled || installed[b.id]).length;

  return (
    <Backdrop>
      <AnimatedSectionList
        ref={listRef as never}
        style={{ backgroundColor: 'transparent' }}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: insets.top, paddingHorizontal: SPACE.lg, paddingBottom: barClearance(insets.bottom) }}
        sections={sections}
        keyExtractor={(b) => b.id}
        stickySectionHeadersEnabled={false}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View style={{ rowGap: SPACE.md }}>
            <LargeHeader
              title={S.appName}
              scrollY={scrollY}
              eyebrow={S.libraryEyebrow}
              subtitle={t(S.librarySummary(offline, CATALOG.length - offline))}>
              {/* The name reads in both scripts; the interface language leads. */}
              <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.accent, fontSize: TYPE.title3 + 1, fontWeight: '700', marginTop: -SPACE.xs }}>
                {lang === 'hi' ? S.appName.en : S.appName.hi}
              </Text>
            </LargeHeader>
            <Animated.View entering={stagger(0)}>
              <ContinueCard />
            </Animated.View>
            <Animated.View entering={stagger(1)}>
              <ReadingStreakCard />
            </Animated.View>
            <Animated.View entering={stagger(2)}>
              <DailyVerseCard />
            </Animated.View>
            <Animated.View entering={stagger(3)}>
              <BookShelf />
            </Animated.View>
            <Animated.View entering={stagger(4)}>
              <KnowledgeCard />
            </Animated.View>
            <View style={[styles.search, glass(palette, true)]}>
              <Ionicons name="search" size={18} color={palette.muted} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder={t(S.searchPlaceholder)}
                placeholderTextColor={palette.muted}
                style={{ flex: 1, color: palette.text, fontSize: TYPE.callout, minHeight: TOUCH }}
                accessibilityLabel={t(S.searchPlaceholder)}
                autoCorrect={false}
              />
            </View>
            {query.trim() ? (
              <PressableScale
                accessibilityRole="button"
                accessibilityLabel={t(S.searchVersesFor(query.trim()))}
                onPress={() => router.push({ pathname: '/search', params: { q: query.trim() } })}
                style={[styles.verseSearch, glass(palette)]}>
                <Ionicons name="text-outline" size={18} color={palette.accent} />
                <Text style={{ flex: 1, color: palette.text, fontSize: TYPE.subhead, fontWeight: '600' }}>{t(S.searchVersesFor(query.trim()))}</Text>
                <Ionicons name="chevron-forward" size={18} color={palette.muted} />
              </PressableScale>
            ) : null}
            {/* One row that scrolls sideways, rather than ten chips wrapping onto four lines. */}
            <ScrollView
              horizontal
              accessibilityRole="radiogroup"
              showsHorizontalScrollIndicator={false}
              // Vertical room so the chips' shadows aren't cut off at the scroller's edge.
              style={{ marginHorizontal: -SPACE.lg, marginVertical: -SPACE.sm }}
              contentContainerStyle={{ paddingHorizontal: SPACE.lg, paddingVertical: SPACE.sm, columnGap: SPACE.sm }}>
              <Chip label={t(S.filterAll)} active={!category} onPress={() => setCategory(null)} />
              {CATEGORIES.map((c) => (
                <Chip key={c.key} label={t(c)} active={category === c.key} onPress={() => setCategory(category === c.key ? null : c.key)} />
              ))}
            </ScrollView>
          </View>
        }
        renderSectionHeader={({ section }) => <GroupTitle title={t(section)} detail={String(section.data.length)} />}
        renderItem={({ item, index, section }) => (
          <Animated.View entering={stagger(index)}>
            <BookRow item={item} first={index === 0} last={index === section.data.length - 1} downloaded={!!installed[item.id]} />
          </Animated.View>
        )}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: SPACE.lg, rowGap: SPACE.sm }}>
            <EmptyArt kind="search" size={112} />
            <Muted style={{ textAlign: 'center' }}>{t(S.noMatch(query))}</Muted>
          </View>
        }
      />
      <TitleBar scrollY={scrollY} title={S.appName} />
    </Backdrop>
  );
}

const styles = StyleSheet.create({
  daily: { borderRadius: RADIUS.panel - 2, padding: SPACE.lg + 2, overflow: 'hidden' },
  dailyLift: { boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.22), 0 14px 32px rgba(10,20,50,0.28)' },
  cardHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', columnGap: SPACE.sm, flexWrap: 'wrap' },
  play: { width: TOUCH, height: TOUCH, borderRadius: TOUCH / 2, alignItems: 'center', justifyContent: 'center' },
  refRow: { flexDirection: 'row', alignItems: 'center', columnGap: 4 },
  trackRow: { flexDirection: 'row', alignItems: 'center', columnGap: SPACE.sm },
  track: { height: 4, borderRadius: 2, overflow: 'hidden' },
  fill: { height: 4, borderRadius: 2 },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: SPACE.sm,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACE.lg,
  },
  verseSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: SPACE.sm,
    borderRadius: RADIUS.row,
    paddingHorizontal: SPACE.lg,
    minHeight: TOUCH + 4,
  },
});
