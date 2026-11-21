import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, SectionList, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Backdrop, Card, Chip, CoverTile, coverFill, glass, GroupCard, GroupRow, GroupTitle, IconTile, LargeHeader, Muted } from '@/components/ui';
import { CATALOG, CATEGORIES, dailyVerse, getEntry, loadChapter } from '@/content/catalog';
import { useDownloads } from '@/content/downloads';
import type { CatalogEntry } from '@/content/types';
import { S, useI18n } from '@/i18n';
import { dateFromDayKey, useToday } from '@/lib/use-today';
import { formatVerseRef, sanskritLines } from '@/lib/verse-format';
import { useAppState } from '@/state/app-state';
import { coverFor, monogram } from '@/theme/covers';
import { barClearance, fontCap, huesFor, quietFill, RADIUS, SPACE, TITLE_FONT_CAP, TOUCH, TYPE } from '@/theme/themes';

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
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t(S.verseOfTheDayA11y)}
      onPress={() =>
        router.push({
          pathname: '/scripture/[id]/[chapter]',
          params: { id: pick.id, chapter: String(pick.chapter), verse: String(verse.number) },
        })
      }
      style={({ pressed }) => pressed && { transform: [{ scale: 0.985 }] }}>
      <Card style={{ borderRadius: RADIUS.panel - 2 }}>
        <View style={styles.cardHead}>
          <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.accent, fontSize: TYPE.footnote, fontWeight: '700' }}>
            {t(S.verseOfTheDay)}
          </Text>
          <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.caption }}>
            {t(S.gitaRef(formatVerseRef(pick.id, pick.chapter, verse.number)))}
          </Text>
        </View>
        {/* The whole verse, every line: never cut a shloka to fit the card. */}
        <View style={{ marginTop: SPACE.sm }}>
          {lines.map((l, i) => (
            <Text
              key={i}
              maxFontSizeMultiplier={fontCap(settings.textScale)}
              style={{
                color: palette.text,
                fontSize: TYPE.callout * settings.textScale,
                lineHeight: TYPE.callout * settings.textScale * 1.65,
              }}>
              {l}
            </Text>
          ))}
        </View>
      </Card>
    </Pressable>
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
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t(S.continueReadingA11y(entry.title, ch.number))}
      onPress={() => router.push({ pathname: '/scripture/[id]/[chapter]', params: { id: entry.id, chapter: String(ch.number) } })}
      style={({ pressed }) => pressed && { transform: [{ scale: 0.985 }] }}>
      <Card strong style={{ borderRadius: RADIUS.panel - 2, rowGap: SPACE.md }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: SPACE.md }}>
          <CoverTile cover={cover} letter={monogram(entry.titleSanskrit ?? entry.title)} size={TOUCH} />
          <View style={{ flex: 1 }}>
            <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.accent, fontSize: TYPE.footnote, fontWeight: '700' }}>
              {t(S.continueReading)}
            </Text>
            <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.body, fontWeight: '600', marginTop: 2 }}>
              {entry.title} · {t(S.chapterN(ch.number))}
            </Text>
            {ch.titleSanskrit ? (
              <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.footnote, marginTop: 1 }}>
                {ch.titleSanskrit}
              </Text>
            ) : null}
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
    </Pressable>
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
            <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.body, fontWeight: '600' }}>
              {t(r.title)}
            </Text>
            <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.footnote, marginTop: 2 }}>
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
      <SectionList
        style={{ backgroundColor: 'transparent' }}
        contentContainerStyle={{ paddingTop: insets.top, paddingHorizontal: SPACE.lg, paddingBottom: barClearance(insets.bottom) }}
        sections={sections}
        keyExtractor={(b) => b.id}
        stickySectionHeadersEnabled={false}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View style={{ rowGap: SPACE.md }}>
            <LargeHeader
              title={S.appName}
              eyebrow={S.libraryEyebrow}
              subtitle={t(S.librarySummary(offline, CATALOG.length - offline))}>
              {/* The name reads in both scripts; the interface language leads. */}
              <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.accent, fontSize: TYPE.title3 + 1, fontWeight: '600', marginTop: -SPACE.xs }}>
                {lang === 'hi' ? S.appName.en : S.appName.hi}
              </Text>
            </LargeHeader>
            <ContinueCard />
            <DailyVerseCard />
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
    </Backdrop>
  );
}

const styles = StyleSheet.create({
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
