import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { accentFill, Backdrop, Card, Chip, coverFill, glass, LargeHeader, Muted } from '@/components/ui';
import { getEntry } from '@/content/catalog';
import { MOOD_LABELS, S, useI18n } from '@/i18n';
import { allTags, filterEntries, formatDay, MOODS, type JournalEntry, type JournalMood } from '@/lib/journal';
import { formatVerseRef } from '@/lib/verse-format';
import { usePrefs } from '@/state/app-state';
import { useJournal } from '@/state/journal';
import { coverFor } from '@/theme/covers';
import { fontCap, huesFor, RADIUS, SPACE, TITLE_FONT_CAP, TOUCH, TYPE } from '@/theme/themes';

/** The Svadhyaya journal: every reflection, newest first, with search and the website's mood filter. */
export default function JournalScreen() {
  const insets = useSafeAreaInsets();
  const { palette, settings } = usePrefs();
  const { journal } = useJournal();
  const { t } = useI18n();
  const [query, setQuery] = useState('');
  const [mood, setMood] = useState<JournalMood | undefined>();
  const [tag, setTag] = useState<string | undefined>();
  const tags = useMemo(() => allTags(journal.entries), [journal.entries]);
  const shown = useMemo(() => filterEntries(journal.entries, { query, mood, tag }), [journal.entries, query, mood, tag]);
  const filtering = !!(query.trim() || mood || tag);
  const cap = fontCap(settings.textScale);
  const hues = huesFor(palette);

  return (
    <Backdrop>
      <Stack.Screen options={{ title: '' }} />
      <FlatList
        style={{ backgroundColor: 'transparent' }}
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: SPACE.lg, paddingBottom: insets.bottom + 120 }}
        data={shown}
        keyExtractor={(e) => e.id}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View>
            <LargeHeader
              title={S.journalTitle}
              eyebrow={S.journalEyebrow}
              subtitle={journal.entries.length ? t(S.journalSummary(journal.entries.length)) : undefined}
            />
            {journal.entries.length ? (
              <View style={{ rowGap: SPACE.md, marginBottom: SPACE.lg }}>
                <View style={[styles.search, glass(palette, true)]}>
                  <Ionicons name="search" size={18} color={palette.muted} />
                  <TextInput
                    value={query}
                    onChangeText={setQuery}
                    placeholder={t(S.journalSearch)}
                    placeholderTextColor={palette.muted}
                    accessibilityLabel={t(S.journalSearch)}
                    maxFontSizeMultiplier={cap}
                    style={{ flex: 1, color: palette.text, fontSize: TYPE.body, minHeight: TOUCH }}
                    returnKeyType="search"
                  />
                  {query ? (
                    <Pressable onPress={() => setQuery('')} accessibilityRole="button" accessibilityLabel={t(S.close)} style={styles.clear}>
                      <Ionicons name="close-circle" size={18} color={palette.muted} />
                    </Pressable>
                  ) : null}
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  accessibilityRole="radiogroup"
                  accessibilityLabel={t(S.moodLabel)}
                  contentContainerStyle={styles.chipRow}>
                  <Chip label={`✨ ${t(S.moodAll)}`} active={!mood} onPress={() => setMood(undefined)} accessibilityLabel={t(S.moodAll)} />
                  {MOODS.map((m) => (
                    <Chip
                      key={m.id}
                      label={`${m.emoji} ${t(MOOD_LABELS[m.id])}`}
                      accessibilityLabel={t(MOOD_LABELS[m.id])}
                      active={mood === m.id}
                      onPress={() => setMood(mood === m.id ? undefined : m.id)}
                    />
                  ))}
                </ScrollView>
                {tags.length ? (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
                    {tags.map((tg) => (
                      <Chip key={tg} label={`#${tg}`} active={tag === tg} onPress={() => setTag(tag === tg ? undefined : tg)} />
                    ))}
                  </ScrollView>
                ) : null}
              </View>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          filtering ? (
            <Muted style={{ textAlign: 'center', marginTop: SPACE.xl, fontSize: TYPE.callout }}>{t(S.journalNoMatch)}</Muted>
          ) : (
            <View style={styles.empty}>
              <View style={[styles.emptyIcon, { backgroundColor: palette.dark ? 'rgba(255,159,10,0.14)' : 'rgba(194,65,12,0.10)' }]}>
                <Ionicons name="leaf-outline" size={44} color={hues.saffron} />
              </View>
              <Text accessibilityRole="header" maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.title2, fontWeight: '700', textAlign: 'center' }}>
                {t(S.journalEmptyTitle)}
              </Text>
              <Muted style={{ textAlign: 'center', fontSize: TYPE.callout, lineHeight: TYPE.callout * 1.5 }}>{t(S.journalEmpty)}</Muted>
            </View>
          )
        }
        renderItem={({ item }) => <EntryCard entry={item} />}
      />

      <View pointerEvents="box-none" style={[styles.fabWrap, { bottom: Math.max(insets.bottom, SPACE.sm) + SPACE.md }]}>
        <Pressable
          onPress={() => router.push('/journal/edit')}
          accessibilityRole="button"
          accessibilityLabel={t(S.newReflection)}
          style={({ pressed }) => [styles.fab, accentFill(palette), pressed && { transform: [{ scale: 0.96 }] }]}>
          <Ionicons name="create-outline" size={20} color={palette.onAccent} />
          <Text maxFontSizeMultiplier={1.4} style={{ color: palette.onAccent, fontSize: TYPE.body, fontWeight: '700' }}>
            {t(S.newReflection)}
          </Text>
        </Pressable>
      </View>
    </Backdrop>
  );
}

function EntryCard({ entry }: { entry: JournalEntry }) {
  const { palette, settings } = usePrefs();
  const { t, lang } = useI18n();
  const cap = fontCap(settings.textScale);
  const scale = settings.textScale;
  const mood = MOODS.find((m) => m.id === entry.mood);
  const title = entry.title || t(S.untitled);
  return (
    <Pressable
      onPress={() => router.push({ pathname: '/journal/edit', params: { entry: entry.id } })}
      accessibilityRole="button"
      accessibilityLabel={t(S.openReflectionA11y(title))}
      style={({ pressed }) => [pressed && { opacity: 0.85, transform: [{ scale: 0.99 }] }]}>
      <Card style={styles.card}>
        <View style={styles.meta}>
          {mood ? (
            <View style={[styles.moodDot, { backgroundColor: palette.dark ? 'rgba(255,255,255,0.08)' : 'rgba(194,65,12,0.08)' }]}>
              <Text allowFontScaling={false} style={{ fontSize: 16 }}>
                {mood.emoji}
              </Text>
            </View>
          ) : null}
          <Text maxFontSizeMultiplier={cap} style={{ flexShrink: 1, color: palette.muted, fontSize: TYPE.footnote }}>
            {formatDay(entry.createdAt, lang)}
            {mood ? ` · ${t(MOOD_LABELS[mood.id])}` : ''}
          </Text>
        </View>
        <Text maxFontSizeMultiplier={cap} style={{ color: palette.text, fontSize: TYPE.title3 * scale, fontWeight: '700', marginTop: SPACE.sm }}>
          {title}
        </Text>
        {entry.body.trim() ? (
          <Text
            maxFontSizeMultiplier={cap}
            numberOfLines={4}
            style={{ color: palette.textSecondary, fontSize: TYPE.callout * scale, lineHeight: TYPE.callout * scale * 1.5, marginTop: SPACE.xs }}>
            {entry.body.trim()}
          </Text>
        ) : null}
        {entry.refs.length ? (
          <View style={styles.refs}>
            {entry.refs.map((r) => {
              const book = getEntry(r.id);
              return (
                <View key={`${r.id}:${r.chapter}:${r.verse}`} style={[styles.refPill, coverFill(coverFor(r.id, book?.category ?? 'other'), palette, true)]}>
                  <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: '#ffffff', fontSize: TYPE.caption, fontWeight: '700' }}>
                    {`${book?.title ?? r.id} ${formatVerseRef(r.id, r.chapter, r.verse)}`}
                  </Text>
                </View>
              );
            })}
          </View>
        ) : null}
        {entry.tags.length ? (
          <Text maxFontSizeMultiplier={cap} style={{ color: palette.accent, fontSize: TYPE.footnote, marginTop: SPACE.sm }}>
            {entry.tags.map((tg) => `#${tg}`).join('  ')}
          </Text>
        ) : null}
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  search: { flexDirection: 'row', alignItems: 'center', columnGap: SPACE.sm, paddingLeft: SPACE.lg, paddingRight: SPACE.xs, borderRadius: RADIUS.pill },
  clear: { width: TOUCH, height: TOUCH, alignItems: 'center', justifyContent: 'center' },
  chipRow: { columnGap: SPACE.sm, paddingRight: SPACE.lg },
  card: { marginBottom: SPACE.md },
  meta: { flexDirection: 'row', alignItems: 'center', columnGap: SPACE.sm },
  moodDot: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  refs: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACE.xs, marginTop: SPACE.md },
  refPill: { borderRadius: RADIUS.pill, paddingHorizontal: SPACE.md, paddingVertical: 4 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', rowGap: SPACE.md, paddingHorizontal: SPACE.lg, paddingBottom: SPACE.xxl },
  emptyIcon: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center', marginBottom: SPACE.sm },
  fabWrap: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  fab: { flexDirection: 'row', alignItems: 'center', columnGap: SPACE.sm, minHeight: TOUCH + 8, paddingHorizontal: SPACE.xl, borderRadius: RADIUS.pill },
});
