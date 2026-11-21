import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Backdrop, Bilingual, Card, Chip, glass, Muted } from '@/components/ui';
import { getEntry } from '@/content/catalog';
import {
  MAX_RESULTS,
  SEARCH_SECTIONS,
  SEARCHABLE_COUNT,
  searchVerses,
  snippetFor,
  type QueryToken,
  type SearchResult,
  type VerseHit,
} from '@/content/search';
import { formatVerseRef } from '@/lib/verse-format';
import { useAppState } from '@/state/app-state';
import type { Palette } from '@/theme/themes';
import { RADIUS, SPACE, TYPE } from '@/theme/themes';

const EXAMPLES = ['कर्मण्येवाधिकारस्ते', 'शान्ति', 'आत्मा', 'krishna', 'karma yoga', 'fruits of action'];

const NO_HITS: VerseHit[] = [];
const NO_TOKENS: QueryToken[] = [];

const FIELD_LABEL = { sa: 'संस्कृत', hi: 'हिन्दी', en: 'English' } as const;

const ResultCard = memo(function ResultCard({
  hit,
  tokens,
  palette,
  textScale,
}: {
  hit: VerseHit;
  tokens: QueryToken[];
  palette: Palette;
  textScale: number;
}) {
  const snippet = useMemo(() => snippetFor(hit, tokens), [hit, tokens]);
  const entry = getEntry(hit.id);
  const ref = `${entry?.title ?? hit.id} ${formatVerseRef(hit.id, hit.chapter, hit.number)}`;
  if (!snippet) return null;

  // Split the snippet into plain and highlighted runs.
  const runs: { text: string; mark: boolean }[] = [];
  let at = 0;
  for (const [a, b] of snippet.marks) {
    if (a > at) runs.push({ text: snippet.text.slice(at, a), mark: false });
    runs.push({ text: snippet.text.slice(a, b), mark: true });
    at = b;
  }
  if (at < snippet.text.length) runs.push({ text: snippet.text.slice(at), mark: false });

  const size = (snippet.field === 'en' ? TYPE.subhead : TYPE.callout) * textScale;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${ref}. ${snippet.text}`}
      onPress={() =>
        router.push({
          pathname: '/scripture/[id]/[chapter]',
          params: { id: hit.id, chapter: String(hit.chapter), verse: hit.number },
        })
      }
      style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.985 : 1 }] })}>
      <Card style={{ marginBottom: SPACE.md }}>
        <View style={styles.cardHead}>
          <Text style={{ color: palette.gold, fontWeight: '700', fontSize: TYPE.footnote, flexShrink: 1 }} numberOfLines={1}>
            {ref}
          </Text>
          <Text style={{ color: palette.muted, fontSize: TYPE.caption }}>{FIELD_LABEL[snippet.field]}</Text>
        </View>
        <Text style={{ color: palette.text, fontSize: size, lineHeight: size * 1.6 }}>
          {runs.map((r, i) =>
            r.mark ? (
              <Text
                key={i}
                style={{
                  color: palette.accent,
                  fontWeight: '700',
                  backgroundColor: palette.dark ? 'rgba(255,159,10,0.16)' : 'rgba(194,65,12,0.10)',
                }}>
                {r.text}
              </Text>
            ) : (
              <Text key={i}>{r.text}</Text>
            ),
          )}
        </Text>
      </Card>
    </Pressable>
  );
});

export default function SearchScreen() {
  const params = useLocalSearchParams<{ q?: string }>();
  const { palette, settings } = useAppState();
  const [query, setQuery] = useState(typeof params.q === 'string' ? params.q : '');
  const [section, setSection] = useState<string | null>(null);
  // The last finished search, tagged with what it searched for, so a newer query shows as busy.
  const [done, setDone] = useState<{ key: string; result: SearchResult } | null>(null);
  const run = useRef(0);
  const q = query.trim();
  const key = `${section ?? ''}\u0000${q}`;
  const result: SearchResult | null = q !== '' && done ? done.result : null;
  const busy = !!q && done?.key !== key;

  useEffect(() => {
    const id = ++run.current;
    if (!q) return;
    // Wait for a pause in typing, then search; a newer keystroke makes this run stale.
    const timer = setTimeout(() => {
      searchVerses(q, { section, isStale: () => run.current !== id })
        .then((r) => {
          if (r && run.current === id) setDone({ key, result: r });
        })
        .catch(() => {
          if (run.current === id) setDone({ key, result: { tokens: [], hits: [], total: 0 } });
        });
    }, 250);
    return () => clearTimeout(timer);
  }, [q, section, key]);

  const hits = result ? result.hits : NO_HITS;
  const status = !query.trim()
    ? null
    : busy && !result
      ? 'Searching…'
      : result
        ? result.tokens.length === 0
          ? 'Type at least two letters.'
          : result.total === 0
            ? null
            : result.total > MAX_RESULTS
              ? `Best ${MAX_RESULTS} of ${result.total.toLocaleString('en-IN')} verses`
              : `${result.total.toLocaleString('en-IN')} ${result.total === 1 ? 'verse' : 'verses'}`
        : null;

  return (
    <Backdrop>
      <>
        <Stack.Screen options={{ title: 'Search verses' }} />
        <FlatList
          style={{ backgroundColor: 'transparent' }}
          contentContainerStyle={{ padding: SPACE.lg, paddingBottom: SPACE.xxl * 3 }}
          data={hits}
          keyExtractor={(h) => `${h.id}:${h.line}`}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          initialNumToRender={8}
          windowSize={7}
          ListHeaderComponent={
            <View style={{ rowGap: SPACE.md, marginBottom: SPACE.lg }}>
              <View style={[styles.search, glass(palette, true)]}>
                <Ionicons name="search" size={18} color={palette.muted} />
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  autoFocus={!params.q}
                  placeholder="Search verses / श्लोक खोजें"
                  placeholderTextColor={palette.muted}
                  style={{ flex: 1, color: palette.text, fontSize: TYPE.callout, paddingVertical: SPACE.sm }}
                  accessibilityLabel="Search inside verses"
                  autoCorrect={false}
                  autoCapitalize="none"
                  returnKeyType="search"
                />
                {busy ? <ActivityIndicator size="small" color={palette.accent} /> : null}
                {query && !busy ? (
                  <Pressable hitSlop={10} accessibilityRole="button" accessibilityLabel="Clear search" onPress={() => setQuery('')}>
                    <Ionicons name="close-circle" size={18} color={palette.muted} />
                  </Pressable>
                ) : null}
              </View>
              <View style={styles.chips}>
                <Chip label="All · सभी" active={!section} onPress={() => setSection(null)} />
                {SEARCH_SECTIONS.map((c) => (
                  <Chip
                    key={c.key}
                    label={`${c.en} · ${c.hi}`}
                    active={section === c.key}
                    onPress={() => setSection(section === c.key ? null : c.key)}
                  />
                ))}
              </View>
              {status ? <Muted>{status}</Muted> : null}
            </View>
          }
          renderItem={({ item }) => (
            <ResultCard hit={item} tokens={result ? result.tokens : NO_TOKENS} palette={palette} textScale={settings.textScale} />
          )}
          ListEmptyComponent={
            !query.trim() ? (
              <Card>
                <Bilingual en="Search inside the verses" hi="श्लोकों में खोजें" color={palette.accent} />
                <Muted style={{ marginTop: SPACE.sm }}>
                  Sanskrit, Hindi, transliteration or English, across the {SEARCHABLE_COUNT} texts in the app. Works offline.
                </Muted>
                <View style={[styles.chips, { marginTop: SPACE.md }]}>
                  {EXAMPLES.map((ex) => (
                    <Chip key={ex} label={ex} onPress={() => setQuery(ex)} accessibilityLabel={`Search for ${ex}`} />
                  ))}
                </View>
              </Card>
            ) : result && !busy && result.tokens.length > 0 ? (
              <Muted style={{ textAlign: 'center', marginTop: SPACE.xl }}>
                No verse matches “{q}”{section ? ' in this section' : ''}. Try fewer words or another spelling.
              </Muted>
            ) : undefined
          }
        />
      </>
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
  cardHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', columnGap: SPACE.sm, marginBottom: SPACE.sm },
});
