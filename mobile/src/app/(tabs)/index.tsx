import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, SectionList, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Backdrop, Bilingual, Card, Chip, Eyebrow, glass, GlassRow, Muted, SectionTitle } from '@/components/ui';
import { CATALOG, CATEGORIES, dailyVerse, getEntry, loadChapter } from '@/content/catalog';
import type { CatalogEntry } from '@/content/types';
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
  const pick = useMemo(() => dailyVerse(), []);
  if (!pick) return null;
  const verse = loadChapter(pick.id, pick.chapter)?.verses[pick.index];
  if (!verse) return null;
  const lines = sanskritLines(verse.sanskrit);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Open the verse of the day"
      onPress={() =>
        router.push({
          pathname: '/scripture/[id]/[chapter]',
          params: { id: pick.id, chapter: String(pick.chapter), verse: String(verse.number) },
        })
      }>
      <Card>
        <Bilingual en="Verse of the day" hi="आज का श्लोक" size={TYPE.footnote} color={palette.accent} />
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
        <Muted style={{ marginTop: SPACE.sm }}>Bhagavad Gita {formatVerseRef(pick.id, pick.chapter, verse.number)}</Muted>
      </Card>
    </Pressable>
  );
}

function ContinueCard() {
  const { lastRead, palette } = useAppState();
  if (!lastRead) return null;
  const entry = getEntry(lastRead.id);
  const ch = entry?.chapters.find((c) => c.number === lastRead.chapter);
  if (!entry || !ch) return null;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push({ pathname: '/scripture/[id]/[chapter]', params: { id: entry.id, chapter: String(ch.number) } })}>
      <Card style={{ flexDirection: 'row', alignItems: 'center', columnGap: SPACE.md }}>
        <Ionicons name="book-outline" size={24} color={palette.accent} />
        <View style={{ flex: 1 }}>
          <Bilingual en="Continue reading" hi="पढ़ना जारी रखें" size={TYPE.footnote} color={palette.accent} />
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
              <Eyebrow en="Scripture library" hi="ग्रन्थ संग्रह" />
              <View>
                <Text style={{ color: palette.text, fontSize: 34, fontWeight: '800', letterSpacing: -0.6 }}>Dharma Granth</Text>
                <Text style={{ color: palette.accent, fontSize: TYPE.title2, fontWeight: '600' }}>धर्म ग्रन्थ</Text>
              </View>
            </View>
            <ContinueCard />
            <DailyVerseCard />
            <View style={[styles.search, glass(palette, true)]}>
              <Ionicons name="search" size={18} color={palette.muted} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search scriptures / ग्रन्थ खोजें"
                placeholderTextColor={palette.muted}
                style={{ flex: 1, color: palette.text, fontSize: TYPE.callout, paddingVertical: SPACE.sm }}
                accessibilityLabel="Search scriptures"
                autoCorrect={false}
              />
            </View>
            <View style={styles.chips}>
              <Chip label="All · सभी" active={!category} onPress={() => setCategory(null)} />
              {CATEGORIES.map((c) => (
                <Chip
                  key={c.key}
                  label={`${c.en} · ${c.hi}`}
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
            accessibilityLabel={`${item.title}, ${item.chapters.length} chapters`}
            onPress={() => router.push({ pathname: '/scripture/[id]', params: { id: item.id } })}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: palette.text, fontSize: TYPE.body, fontWeight: '600' }}>{item.titleSanskrit ?? item.title}</Text>
              <Text style={{ color: palette.muted, fontSize: TYPE.footnote, marginTop: 2 }}>
                {item.title} · {item.chapters.length} ch · {item.totalVerses.toLocaleString('en-IN')} verses
              </Text>
            </View>
            {item.bundled ? (
              <Ionicons name="download-outline" size={16} color={palette.gold} accessibilityLabel="Available offline" />
            ) : (
              <Ionicons name="globe-outline" size={16} color={palette.muted} accessibilityLabel="Opens on dharmagranth.dev" />
            )}
            <Ionicons name="chevron-forward" size={18} color={palette.muted} />
          </GlassRow>
        )}
        ListEmptyComponent={<Muted style={{ marginTop: SPACE.xl, textAlign: 'center' }}>No scripture matches “{query}”.</Muted>}
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
