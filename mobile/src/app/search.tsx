import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Backdrop, barSurface, Card, Chip, coverFill, glass, GroupTitle, LargeHeader, Muted } from '@/components/ui';
import { getEntry } from '@/content/catalog';
import { useDownloads } from '@/content/downloads';
import {
  BUNDLED_SEARCHABLE_COUNT,
  MAX_RESULTS,
  prepareSearchIndexes,
  searchSections,
  searchVerses,
  snippetFor,
  useSearchIndexing,
  type QueryToken,
  type SearchResult,
  type VerseHit,
} from '@/content/search';
import { S, useI18n } from '@/i18n';
import { useKeyboardHeight } from '@/lib/use-keyboard-height';
import { formatVerseRef } from '@/lib/verse-format';
import { usePrefs } from '@/state/app-state';
import { coverFor } from '@/theme/covers';
import type { Palette } from '@/theme/themes';
import { BAR_GAP, BAR_HEIGHT, fontCap, huesFor, RADIUS, SPACE, TITLE_FONT_CAP, TYPE } from '@/theme/themes';

const EXAMPLES = ['कर्मण्येवाधिकारस्ते', 'शान्ति', 'आत्मा', 'krishna', 'karma yoga', 'fruits of action'];

const NO_HITS: VerseHit[] = [];
const NO_TOKENS: QueryToken[] = [];

const FIELD_LABEL = { sa: 'संस्कृत', hi: 'हिन्दी', en: 'English' } as const;

const ResultCard = memo(function ResultCard({
  hit,
  tokens,
  palette,
  textScale,
  a11y,
}: {
  hit: VerseHit;
  tokens: QueryToken[];
  palette: Palette;
  textScale: number;
  a11y: (ref: string, text: string) => string;
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

  // The same hue as the matching layer in the reader: Hindi peacock, English indigo, Sanskrit gold.
  const hues = huesFor(palette);
  const dot = snippet.field === 'hi' ? hues.peacock : snippet.field === 'en' ? hues.indigo : palette.gold;
  const size = (snippet.field === 'en' ? TYPE.subhead : TYPE.callout) * textScale;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={a11y(ref, snippet.text)}
      onPress={() =>
        router.push({
          pathname: '/scripture/[id]/[chapter]',
          params: { id: hit.id, chapter: String(hit.chapter), verse: hit.number },
        })
      }
      style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.985 : 1 }] })}>
      <Card style={{ marginBottom: SPACE.md }}>
        <View style={styles.cardHead}>
          {/* The reference in the book's cover colours, as on the Saved tab and the verse cards. */}
          <View style={[styles.ref, coverFill(coverFor(hit.id, entry?.category ?? 'other'), palette, true)]}>
            <Text maxFontSizeMultiplier={TITLE_FONT_CAP} numberOfLines={1} style={{ color: '#ffffff', fontWeight: '700', fontSize: TYPE.footnote }}>
              {ref}
            </Text>
          </View>
          <View style={styles.field}>
            <View style={[styles.dot, { backgroundColor: dot }]} />
            <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.caption }}>
              {FIELD_LABEL[snippet.field]}
            </Text>
          </View>
        </View>
        <Text maxFontSizeMultiplier={fontCap(textScale)} style={{ color: palette.text, fontSize: size, lineHeight: size * 1.6 }}>
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

/**
 * Verse search. The field floats at the foot of the screen, in the thumb zone as One UI asks, and rides just
 * above the keyboard while typing. With nothing typed a large header explains what can be searched; once a
 * search runs the header steps aside (as Apple's large titles do) so the results get the room.
 */
export default function SearchScreen() {
  const params = useLocalSearchParams<{ q?: string }>();
  const insets = useSafeAreaInsets();
  const keyboard = useKeyboardHeight();
  const { palette, settings } = usePrefs();
  const { t } = useI18n();
  const [query, setQuery] = useState(typeof params.q === 'string' ? params.q : '');
  const [section, setSection] = useState<string | null>(null);
  // Downloaded large texts are searched too. Their index is built during the download; a text
  // downloaded by an older version of the app gets one built here, in the background.
  const { installed } = useDownloads();
  const downloaded = useMemo(() => Object.keys(installed).sort(), [installed]);
  const indexing = useSearchIndexing();
  const sections = useMemo(() => searchSections(downloaded), [downloaded]);
  useEffect(() => prepareSearchIndexes(downloaded), [downloaded]);
  // The last finished search, tagged with what it searched for, so a newer query shows as busy.
  const [done, setDone] = useState<{ key: string; result: SearchResult } | null>(null);
  const run = useRef(0);
  const q = query.trim();
  const key = `${section ?? ''}\u0000${q}\u0000${downloaded.join(',')}\u0000${indexing.generation}`;
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
  const status = !q
    ? null
    : busy && !result
      ? t(S.searching)
      : result
        ? result.tokens.length === 0
          ? t(S.searchTooShort)
          : result.total === 0
            ? null
            : result.total > MAX_RESULTS
              ? t(S.searchResultBest(MAX_RESULTS, result.total))
              : t(S.searchResultCount(result.total))
        : null;

  // The field sits where the tab bar sits, or just above the keys while the keyboard is up. The keyboard
  // height Android reports leaves out the navigation bar, so that inset is added back.
  const dockBottom = keyboard > 0 ? keyboard + insets.bottom + SPACE.sm : Math.max(insets.bottom, SPACE.sm) + BAR_GAP;
  const a11y = (ref: string, text: string) => t(S.searchResultA11y(ref, text));

  const filters = (
    // One row that scrolls sideways, as on the Library tab.
    <ScrollView
      horizontal
      accessibilityRole="radiogroup"
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      // Vertical room so the chips' shadows aren't cut off at the scroller's edge.
      style={{ marginHorizontal: -SPACE.lg, marginVertical: -SPACE.sm }}
      contentContainerStyle={{ paddingHorizontal: SPACE.lg, paddingVertical: SPACE.sm, columnGap: SPACE.sm }}>
      <Chip label={t(S.filterAll)} active={!section} onPress={() => setSection(null)} />
      {sections.map((c) => (
        <Chip key={c.key} label={t(c)} active={section === c.key} onPress={() => setSection(section === c.key ? null : c.key)} />
      ))}
    </ScrollView>
  );

  return (
    <Backdrop>
      <>
        {/* The header floats over the page: the back button stays, the title lives in the large header. */}
        <Stack.Screen options={{ title: '', headerTransparent: true, headerStyle: { backgroundColor: 'transparent' } }} />
        <FlatList
          style={{ backgroundColor: 'transparent' }}
          contentContainerStyle={{
            paddingTop: insets.top + 56,
            paddingHorizontal: SPACE.lg,
            paddingBottom: dockBottom + BAR_HEIGHT + SPACE.xl,
          }}
          data={hits}
          keyExtractor={(h) => `${h.id}:${h.line}`}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          initialNumToRender={8}
          windowSize={7}
          ListHeaderComponent={
            <View style={{ rowGap: SPACE.md, marginBottom: SPACE.lg }}>
              {!q ? (
                <LargeHeader
                  title={S.searchTitle}
                  eyebrow={S.searchEyebrow}
                  subtitle={t(S.searchIntro(BUNDLED_SEARCHABLE_COUNT + downloaded.length, downloaded.length))}
                />
              ) : (
                <Text accessibilityRole="header" maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.title2, fontWeight: '700' }}>
                  {t(S.searchTitle)}
                </Text>
              )}
              {filters}
              {status ? (
                <Text accessibilityLiveRegion="polite" maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.footnote }}>
                  {status}
                </Text>
              ) : null}
              {indexing.pending.length > 0 ? (
                <Muted>{t(S.searchPreparingDownloads(indexing.pending.map((id) => getEntry(id)?.title ?? id).join(', ')))}</Muted>
              ) : null}
            </View>
          }
          renderItem={({ item }) => (
            <ResultCard hit={item} tokens={result ? result.tokens : NO_TOKENS} palette={palette} textScale={settings.textScale} a11y={a11y} />
          )}
          ListEmptyComponent={
            !q ? (
              <View>
                <GroupTitle title={t(S.searchTry)} />
                <View style={styles.examples}>
                  {EXAMPLES.map((ex) => (
                    <Chip key={ex} label={ex} onPress={() => setQuery(ex)} accessibilityLabel={t(S.searchForA11y(ex))} />
                  ))}
                </View>
              </View>
            ) : result && !busy && result.tokens.length > 0 ? (
              <Muted style={{ textAlign: 'center', marginTop: SPACE.xl }}>{t(S.searchNoVerse(q, !!section))}</Muted>
            ) : undefined
          }
        />
        <View pointerEvents="box-none" style={[styles.dock, { bottom: dockBottom }]}>
          <View
            style={[
              styles.searchBar,
              glass(palette, true),
              { backgroundColor: barSurface(palette) },
              !palette.lite && { boxShadow: palette.dark ? '0 12px 30px rgba(0,0,0,0.5)' : '0 12px 32px rgba(60,30,10,0.16)' },
            ]}>
            <Ionicons name="search" size={20} color={palette.muted} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              autoFocus={!params.q}
              placeholder={t(S.searchField)}
              placeholderTextColor={palette.muted}
              maxFontSizeMultiplier={TITLE_FONT_CAP}
              style={{ flex: 1, color: palette.text, fontSize: TYPE.body, paddingVertical: SPACE.sm }}
              accessibilityLabel={t(S.searchInsideVerses)}
              autoCorrect={false}
              autoCapitalize="none"
              returnKeyType="search"
            />
            {busy ? <ActivityIndicator size="small" color={palette.accent} /> : null}
            {query && !busy ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t(S.clearSearch)}
                onPress={() => setQuery('')}
                style={styles.clear}>
                <Ionicons name="close-circle" size={22} color={palette.muted} />
              </Pressable>
            ) : null}
          </View>
        </View>
      </>
    </Backdrop>
  );
}

const styles = StyleSheet.create({
  dock: { position: 'absolute', left: SPACE.lg, right: SPACE.lg },
  searchBar: {
    height: BAR_HEIGHT,
    borderRadius: BAR_HEIGHT / 2,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: SPACE.sm,
    paddingLeft: SPACE.lg + 2,
    paddingRight: SPACE.xs,
  },
  // 48 dp touch target for the clear button (Android accessibility minimum).
  clear: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  examples: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACE.sm },
  cardHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', columnGap: SPACE.sm, marginBottom: SPACE.sm },
  ref: { flexShrink: 1, borderRadius: RADIUS.pill, paddingHorizontal: SPACE.md, paddingVertical: 4 },
  field: { flexDirection: 'row', alignItems: 'center', columnGap: 5 },
  dot: { width: 7, height: 7, borderRadius: 4 },
});
