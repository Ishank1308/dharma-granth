import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, SectionList, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Backdrop, Bilingual, Card, Chip, Eyebrow, glass, GlassRow, Muted, PageTitle, SectionTitle } from '@/components/ui';
import { CATALOG, CATEGORIES, dailyVerse, getEntry, loadChapter } from '@/content/catalog';
import type { CatalogEntry } from '@/content/types';
import { S, useI18n } from '@/i18n';
import { formatVerseRef, sanskritLines } from '@/lib/verse-format';
import { useAppState } from '@/state/app-state';
import { RADIUS, SPACE, TYPE } from '@/theme/themes';

function matches(b: CatalogEntry, q: string) {
  if (!q) return true;
  const needle = q.trim().toLowerCase();
  return b.title.toLowerCase().includes(needle) || (b.titleSanskrit ?? '').includes(q.trim()) || b.id.includes(needle);
}

function DailyVerseCard() {
  const { palette, settings } = useAppState();
  const { t } = useI18n();
  const pick = useMemo(() => dailyVerse(), []);
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
      }>
      <Card>
        <Bilingual {...S.verseOfTheDay} size={TYPE.footnote} color={palette.accent} />
        <View style={{ marginTop: SPACE.sm }}>
          {lines.map((l, i) => (
            <Text
              key={i}
              style={{
                color: palette.text,
                fontSize: TYPE.callout * settings.textScale,
                lineHeight: TYPE.callout * settings.textScale * 1.6,
              }}>
              {l}
            </Text>
          ))}
        </View>
        <Muted style={{ marginTop: SPACE.sm }}>{t(S.gitaRef(formatVerseRef(pick.id, pick.chapter, verse.number)))}</Muted>
      </Card>
    </Pressable>
  );
}

function ContinueCard() {
  const { lastRead, palette } = useAppState();
  const { t } = useI18n();
  if (!lastRead) return null;
  const entry = getEntry(lastRead.id);
  const ch = entry?.chapters.find((c) => c.number === lastRead.chapter);
  if (!entry || !ch) return null;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t(S.continueReadingA11y(entry.title))}
      onPress={() => router.push({ pathname: '/scripture/[id]/[chapter]', params: { id: entry.id, chapter: String(ch.number) } })}>
      <Card style={{ flexDirection: 'row', alignItems: 'center', columnGap: SPACE.md }}>
        <Ionicons name="book-outline" size={24} color={palette.accent} />
        <View style={{ flex: 1 }}>
          <Bilingual {...S.continueReading} size={TYPE.footnote} color={palette.accent} />
          <Text style={{ color: palette.text, fontSize: TYPE.callout, fontWeight: '600', marginTop: 2 }}>
            {entry.title} · {ch.titleSanskrit ?? ch.title}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={palette.muted} />
      </Card>
    </Pressable>
  );
}

export default function LibraryScreen() {
  const insets = useSafeAreaInsets();
  const { palette } = useAppState();
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

  return (
    <Backdrop>
      <SectionList
        style={{ backgroundColor: 'transparent' }}
        contentContainerStyle={{ paddingTop: insets.top + SPACE.lg, paddingHorizontal: SPACE.lg, paddingBottom: SPACE.xxl * 3 }}
        sections={sections}
        keyExtractor={(b) => b.id}
        stickySectionHeadersEnabled={false}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View style={{ rowGap: SPACE.md }}>
            <View style={{ rowGap: SPACE.sm }}>
              <Eyebrow {...S.libraryEyebrow} />
              {/* The name reads in both scripts; the interface language leads. */}
              <View>
                <PageTitle {...S.appName} />
                <Text style={{ color: palette.accent, fontSize: TYPE.title2, fontWeight: '600' }}>
                  {lang === 'hi' ? S.appName.en : S.appName.hi}
                </Text>
              </View>
            </View>
            <ContinueCard />
            <DailyVerseCard />
            <View style={[styles.search, glass(palette, true)]}>
              <Ionicons name="search" size={18} color={palette.muted} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder={t(S.searchPlaceholder)}
                placeholderTextColor={palette.muted}
                style={{ flex: 1, color: palette.text, fontSize: TYPE.callout, paddingVertical: SPACE.sm }}
                accessibilityLabel={t(S.searchPlaceholder)}
                autoCorrect={false}
              />
            </View>
            <View style={styles.chips}>
              <Chip label={t(S.filterAll)} active={!category} onPress={() => setCategory(null)} />
              {CATEGORIES.map((c) => (
                <Chip
                  key={c.key}
                  label={t(c)}
                  active={category === c.key}
                  onPress={() => setCategory(category === c.key ? null : c.key)}
                />
              ))}
            </View>
          </View>
        }
        renderSectionHeader={({ section }) => <SectionTitle en={section.en} hi={section.hi} />}
        renderItem={({ item }) => (
          <GlassRow
            accessibilityLabel={t(S.bookA11y(item.title, item.chapters.length))}
            onPress={() => router.push({ pathname: '/scripture/[id]', params: { id: item.id } })}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: palette.text, fontSize: TYPE.body, fontWeight: '600' }}>{item.titleSanskrit ?? item.title}</Text>
              <Text style={{ color: palette.muted, fontSize: TYPE.footnote, marginTop: 2 }}>
                {item.title} · {t(S.bookSummary(item.chapters.length, item.totalVerses))}
              </Text>
            </View>
            {item.bundled ? (
              <Ionicons name="download-outline" size={16} color={palette.gold} accessibilityLabel={t(S.availableOffline)} />
            ) : (
              <Ionicons name="globe-outline" size={16} color={palette.muted} accessibilityLabel={t(S.opensOnWebsite)} />
            )}
            <Ionicons name="chevron-forward" size={18} color={palette.muted} />
          </GlassRow>
        )}
        ListEmptyComponent={<Muted style={{ marginTop: SPACE.xl, textAlign: 'center' }}>{t(S.noMatch(query))}</Muted>}
      />
    </Backdrop>
  );
}

const styles = StyleSheet.create({
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: SPACE.sm,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACE.lg,
    paddingVertical: 2,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACE.sm },
});
