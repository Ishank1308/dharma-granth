import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { Backdrop, Eyebrow, glass, Muted } from '@/components/ui';
import { VerseCard } from '@/components/verse-card';
import { getEntry, loadChapter } from '@/content/catalog';
import type { Verse } from '@/content/types';
import { toDevanagari } from '@/lib/verse-format';
import { useAppState } from '@/state/app-state';
import { SPACE, TYPE } from '@/theme/themes';

export default function ChapterScreen() {
  const params = useLocalSearchParams<{ id: string; chapter: string; verse?: string }>();
  const id = String(params.id);
  const chapterNo = Number(params.chapter);
  const { palette, settings, bookmarks, toggleBookmark, setLastRead } = useAppState();
  const entry = getEntry(id);
  const meta = entry?.chapters.find((c) => c.number === chapterNo);
  const chapter = useMemo(() => loadChapter(id, chapterNo), [id, chapterNo]);
  const listRef = useRef<FlatList<Verse>>(null);
  const jumped = useRef(false);
  const jumpTries = useRef(0);

  useEffect(() => {
    if (chapter) setLastRead(id, chapterNo);
  }, [id, chapterNo, chapter, setLastRead]);

  const target = params.verse ? (chapter?.verses.findIndex((v) => String(v.number) === String(params.verse)) ?? -1) : -1;

  const idx = entry ? entry.chapters.findIndex((c) => c.number === chapterNo) : -1;
  const prev = idx > 0 ? entry!.chapters[idx - 1] : undefined;
  const next = entry && idx >= 0 && idx < entry.chapters.length - 1 ? entry.chapters[idx + 1] : undefined;

  const go = (n: number) => router.replace({ pathname: '/scripture/[id]/[chapter]', params: { id, chapter: String(n) } });

  // Bookmarked verse numbers in this chapter only. With a stable toggle callback, saving one verse
  // re-renders that one card instead of every card on screen (VerseCard is memoised).
  const saved = useMemo(
    () => new Set(bookmarks.filter((b) => b.id === id && b.chapter === chapterNo).map((b) => b.verse)),
    [bookmarks, id, chapterNo],
  );
  const onToggleBookmark = useCallback((verse: string) => toggleBookmark(id, chapterNo, verse), [toggleBookmark, id, chapterNo]);

  const renderItem = useCallback(
    ({ item }: { item: Verse }) => (
      <VerseCard
        scriptureId={id}
        scriptureTitle={entry?.title ?? id}
        chapter={chapterNo}
        verse={item}
        palette={palette}
        settings={settings}
        bookmarked={saved.has(String(item.number))}
        onToggleBookmark={onToggleBookmark}
      />
    ),
    [id, chapterNo, entry?.title, palette, settings, saved, onToggleBookmark],
  );

  if (!entry || !meta || !chapter) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: entry?.title ?? '' }} />
        <Muted>This chapter is not available in the app.</Muted>
      </View>
    );
  }

  return (
    <Backdrop quiet>
      <>
        <Stack.Screen options={{ title: `${entry.title} · ${chapterNo}` }} />
        <FlatList
          ref={listRef}
          style={{ backgroundColor: 'transparent' }}
          contentContainerStyle={{ padding: SPACE.lg, paddingBottom: SPACE.xxl * 2 }}
          data={chapter.verses}
          keyExtractor={(v, i) => `${v.number}-${i}`}
          renderItem={renderItem}
          // Never render up to the target verse in one go: a bookmark deep in Bala Kand (1,958 verses)
          // would mount ~1,500 cards on the JS thread and freeze the phone. Jump instead (below).
          initialNumToRender={6}
          maxToRenderPerBatch={6}
          windowSize={7}
          onLayout={() => {
            if (target <= 0 || jumped.current) return;
            jumped.current = true;
            listRef.current?.scrollToIndex({ index: target, animated: false, viewPosition: 0 });
          }}
          onScrollToIndexFailed={(info) => {
            // Verse heights vary, so jump to an estimate, let that window render, then retry a few times.
            if (jumpTries.current >= 8) return;
            jumpTries.current += 1;
            listRef.current?.scrollToOffset({ offset: info.averageItemLength * info.index, animated: false });
            setTimeout(() => listRef.current?.scrollToIndex({ index: info.index, animated: false }), 120);
          }}
          ListHeaderComponent={
            <View style={{ marginBottom: SPACE.lg, alignItems: 'center', rowGap: SPACE.xs }}>
              <Eyebrow en={`Chapter ${chapterNo}`} hi={`अध्याय ${toDevanagari(chapterNo)}`} style={{ alignSelf: 'center' }} />
              <Text style={{ color: palette.text, fontSize: TYPE.title2, fontWeight: '800', textAlign: 'center', marginTop: SPACE.xs }}>
                {meta.titleSanskrit ?? meta.title}
              </Text>
              {meta.titleSanskrit ? <Text style={{ color: palette.muted, fontSize: TYPE.subhead }}>{meta.title}</Text> : null}
              <Muted style={{ marginTop: SPACE.xs }}>{chapter.verses.length} verses</Muted>
            </View>
          }
          ListEmptyComponent={<Muted style={{ textAlign: 'center' }}>No verses in this chapter yet.</Muted>}
          ListFooterComponent={
            <View style={styles.pager}>
              {prev ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Previous chapter, ${prev.title}`}
                  onPress={() => go(prev.number)}
                  style={[styles.pageBtn, glass(palette)]}>
                  <Ionicons name="chevron-back" size={18} color={palette.accent} />
                  <Text style={{ color: palette.accent, fontWeight: '600' }}>Chapter {prev.number}</Text>
                </Pressable>
              ) : (
                <View />
              )}
              {next ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Next chapter, ${next.title}`}
                  onPress={() => go(next.number)}
                  style={[styles.pageBtn, glass(palette)]}>
                  <Text style={{ color: palette.accent, fontWeight: '600' }}>Chapter {next.number}</Text>
                  <Ionicons name="chevron-forward" size={18} color={palette.accent} />
                </Pressable>
              ) : (
                <View />
              )}
            </View>
          }
        />
      </>
    </Backdrop>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACE.xl },
  pager: { flexDirection: 'row', justifyContent: 'space-between', marginTop: SPACE.lg },
  pageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 4,
    paddingVertical: SPACE.sm + 2,
    paddingHorizontal: SPACE.lg,
    borderRadius: 999,
  },
});
