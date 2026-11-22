import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useScrollToTop } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, SectionList, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CoverBook } from '@/components/art/cover-book';
import { Backdrop, Card, Chip, CoverTile, coverFill, glass, GroupCard, GroupRow, GroupTitle, IconTile, LargeHeader, Muted } from '@/components/ui';
import { CATALOG, CATEGORIES, dailyVerse, getEntry, loadChapter } from '@/content/catalog';
import { useDownloads } from '@/content/downloads';
import type { CatalogEntry } from '@/content/types';
import { S, useI18n } from '@/i18n';
import { dateFromDayKey, useToday } from '@/lib/use-today';
import { formatVerseRef, sanskritLines } from '@/lib/verse-format';
import { AnimatedSectionList, useScrollY } from '@/motion/parallax';
import { PressableScale } from '@/motion/pressable-scale';
import { TitleBar } from '@/motion/title-bar';
import { toScript } from '@/lib/sanskrit-script';
import { useAppState } from '@/state/app-state';
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
  const { palette, settings } = useAppState();
  const { t } = useI18n();
  // Re-picked when the date changes, so the card turns over at midnight even if the app stays open.
  const today = useToday();
  const pick = useMemo(() => dailyVerse(dateFromDayKey(today)), [today]);
  if (!pick) return null;
  const verse = loadChapter(pick.id, pick.chapter)?.verses[pick.index];
  if (!verse) return null;
  const lines = sanskritLines(verse.sanskrit);
  const ref = t(S.gitaRef(formatVerseRef(pick.id, pick.chapter, verse.number)));
  // A verse is a page of a book, so the card wears that book's cover: one of the few places colour is lavish.
  const cover = coverFor(pick.id, getEntry(pick.id)?.category ?? 'other');
  return (
    <PressableScale
      accessibilityRole="button"
      // The label carries the verse itself: a label made of the action alone would hide the shloka from TalkBack.
      accessibilityLabel={t(S.verseOfTheDayFullA11y(ref, lines.join('\n')))}
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
          <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: 'rgba(255,255,255,0.78)', fontSize: TYPE.footnote }}>
            {ref}
          </Text>
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

function BookShelf() {
  const { palette } = useAppState();
  const { t, lang } = useI18n();
  const books = SHELF.map((id) => getEntry(id)).filter((b): b is CatalogEntry => !!b);
  if (books.length === 0) return null;
  return (
    <View style={{ rowGap: SPACE.sm }}>
      <GroupTitle title={t(S.shelfTitle)} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        // Room for the covers' shadows, which a scroller would otherwise clip.
        style={{ marginHorizontal: -SPACE.lg, marginTop: -SPACE.sm }}
        contentContainerStyle={{ paddingHorizontal: SPACE.lg, paddingTop: SPACE.sm, paddingBottom: SPACE.lg, columnGap: SPACE.lg }}>
        {books.map((b) => {
          const title = lang === 'hi' ? (b.titleSanskrit ?? b.title) : b.title;
          return (
            <PressableScale
              key={b.id}
              accessibilityRole="button"
              accessibilityLabel={t(S.openBookA11y(b.title))}
              onPress={() => router.push({ pathname: '/scripture/[id]', params: { id: b.id } })}
              style={{ width: 92, rowGap: SPACE.sm }}>
              <CoverBook cover={coverFor(b.id, b.category)} letter={monogram(b.titleSanskrit ?? b.title)} width={84} />
              <Text numberOfLines={2} maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.footnote, fontWeight: '500' }}>
                {title}
              </Text>
            </PressableScale>
          );
        })}
      </ScrollView>
    </View>
  );
}

function ContinueCard() {
  const { lastRead, palette } = useAppState();
  const { t } = useI18n();
  if (!lastRead) return null;
  const entry = getEntry(lastRead.id);
  const idx = entry ? entry.chapters.findIndex((c) => c.number === lastRead.chapter) : -1;
  const ch = entry && idx >= 0 ? entry.chapters[idx] : undefined;
  if (!entry || !ch) return null;
  const cover = coverFor(entry.id, entry.category);
  const progress = (idx + 1) / entry.chapters.length;
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={t(S.continueReadingA11y(entry.title, ch.number))}
      onPress={() => router.push({ pathname: '/scripture/[id]/[chapter]', params: { id: entry.id, chapter: String(ch.number) } })}
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
              {ch.titleSanskrit ? `${t(S.chapterN(ch.number))}, ${ch.titleSanskrit}` : t(S.chapterN(ch.number))}
            </Text>
          </View>
          <View style={[styles.play, { backgroundColor: palette.dark ? 'rgba(255,159,10,0.16)' : 'rgba(194,65,12,0.10)' }]}>
            <Ionicons name="play" size={18} color={palette.accent} />
          </View>
        </View>
        {/* How far through the book: chapter by chapter, in the book's own cover colours. */}
        <View style={[styles.track, { backgroundColor: quietFill(palette) }]}>
          <View style={[styles.fill, coverFill(cover, palette), { width: `${Math.max(4, Math.round(progress * 100))}%` }]} />
        </View>
      </Card>
    </PressableScale>
  );
}

/** The way into the knowledge pages and Wisdom for life (src/app/knowledge, src/app/wisdom). */
function KnowledgeCard() {
  const { palette } = useAppState();
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
  const { palette } = useAppState();
  const { installed } = useDownloads();
  const { t, lang } = useI18n();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const { scrollY, onScroll } = useScrollY();
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
            <ContinueCard />
            <DailyVerseCard />
            <BookShelf />
            <KnowledgeCard />
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
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t(S.searchVersesFor(query.trim()))}
                onPress={() => router.push({ pathname: '/search', params: { q: query.trim() } })}
                style={({ pressed }) => [styles.verseSearch, glass(palette), { opacity: pressed ? 0.8 : 1 }]}>
                <Ionicons name="text-outline" size={18} color={palette.accent} />
                <Text style={{ flex: 1, color: palette.text, fontSize: TYPE.subhead, fontWeight: '600' }}>{t(S.searchVersesFor(query.trim()))}</Text>
                <Ionicons name="chevron-forward" size={18} color={palette.muted} />
              </Pressable>
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
        renderItem={({ item, index, section }) => {
          const cover = coverFor(item.id, item.category);
          const status = item.bundled ? S.availableOffline : installed[item.id] ? S.downloadedOffline : S.canDownload;
          return (
            <GroupRow
              first={index === 0}
              last={index === section.data.length - 1}
              inset={72}
              accessibilityLabel={`${t(S.bookA11y(item.title, item.chapters.length))}, ${t(status)}`}
              onPress={() => router.push({ pathname: '/scripture/[id]', params: { id: item.id } })}>
              <CoverTile cover={cover} letter={monogram(item.titleSanskrit ?? item.title)} />
              <View style={{ flex: 1 }}>
                <Text style={{ color: palette.text, fontSize: TYPE.body, fontWeight: '600' }}>{item.titleSanskrit ?? item.title}</Text>
                <Text style={{ color: palette.muted, fontSize: TYPE.footnote, marginTop: 2 }}>
                  {item.title} · {t(S.bookSummary(item.chapters.length, item.totalVerses))}
                </Text>
              </View>
              {item.bundled || installed[item.id] ? null : <Ionicons name="cloud-download-outline" size={18} color={palette.muted} />}
              <Ionicons name="chevron-forward" size={18} color={palette.muted} />
            </GroupRow>
          );
        }}
        ListEmptyComponent={<Muted style={{ marginTop: SPACE.xl, textAlign: 'center' }}>{t(S.noMatch(query))}</Muted>}
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
