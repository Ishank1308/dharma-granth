import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { Muted } from '@/components/ui';
import { VerseCard } from '@/components/verse-card';
import { getEntry, loadChapter } from '@/content/catalog';
import type { Verse } from '@/content/types';
import { useAppState } from '@/state/app-state';
import { SPACE, TYPE } from '@/theme/themes';

export default function ChapterScreen() {
  const params = useLocalSearchParams<{ id: string; chapter: string; verse?: string }>();
  const id = String(params.id);
  const chapterNo = Number(params.chapter);
  const { palette, settings, isBookmarked, toggleBookmark, setLastRead } = useAppState();
  const entry = getEntry(id);
  const meta = entry?.chapters.find((c) => c.number === chapterNo);
  const chapter = useMemo(() => loadChapter(id, chapterNo), [id, chapterNo]);
  const listRef = useRef<FlatList<Verse>>(null);
  const jumped = useRef(false);

  useEffect(() => {
    if (chapter) setLastRead(id, chapterNo);
  }, [id, chapterNo, chapter, setLastRead]);

  const target = params.verse ? chapter?.verses.findIndex((v) => String(v.number) === String(params.verse)) ?? -1 : -1;

  const idx = entry ? entry.chapters.findIndex((c) => c.number === chapterNo) : -1;
  const prev = idx > 0 ? entry!.chapters[idx - 1] : undefined;
  const next = entry && idx >= 0 && idx < entry.chapters.length - 1 ? entry.chapters[idx + 1] : undefined;

  const go = (n: number) => router.replace({ pathname: '/scripture/[id]/[chapter]', params: { id, chapter: String(n) } });

  const renderItem = useCallback(
    ({ item }: { item: Verse }) => (
      <VerseCard
        scriptureId={id}
        scriptureTitle={entry?.title ?? id}
        chapter={chapterNo}
        verse={item}
        palette={palette}
        settings={settings}
        bookmarked={isBookmarked(id, chapterNo, String(item.number))}
        onToggleBookmark={() => toggleBookmark(id, chapterNo, String(item.number))}
      />
    ),
    [id, chapterNo, entry?.title, palette, settings, isBookmarked, toggleBookmark],
  );

  if (!entry || !meta || !chapter) {
    return (
      <View style={[styles.center, { backgroundColor: palette.bg }]}>
        <Stack.Screen options={{ title: entry?.title ?? '' }} />
        <Muted>This chapter is not available in the app.</Muted>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: `${entry.title} · ${chapterNo}` }} />
      <FlatList
        ref={listRef}
        style={{ backgroundColor: palette.bg }}
        contentContainerStyle={{ padding: SPACE.lg, paddingBottom: SPACE.xxl * 2 }}
        data={chapter.verses}
        keyExtractor={(v, i) => `${v.number}-${i}`}
        renderItem={renderItem}
        initialNumToRender={target > 0 ? target + 3 : 6}
        windowSize={9}
        onLayout={() => {
          if (target <= 0 || jumped.current) return;
          jumped.current = true;
          listRef.current?.scrollToIndex({ index: target, animated: false, viewPosition: 0 });
        }}
        onScrollToIndexFailed={(info) => {
          listRef.current?.scrollToOffset({ offset: info.averageItemLength * info.index, animated: false });
          setTimeout(() => listRef.current?.scrollToIndex({ index: info.index, animated: false }), 100);
        }}
        ListHeaderComponent={
          <View style={{ marginBottom: SPACE.lg, alignItems: 'center' }}>
            <Text style={{ color: palette.gold, fontSize: TYPE.footnote, fontWeight: '700' }}>
              CHAPTER {chapterNo} · अध्याय {chapterNo}
            </Text>
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
              <Pressable accessibilityRole="button" accessibilityLabel={`Previous chapter, ${prev.title}`} onPress={() => go(prev.number)} style={styles.pageBtn}>
                <Ionicons name="chevron-back" size={18} color={palette.accent} />
                <Text style={{ color: palette.accent, fontWeight: '600' }}>Chapter {prev.number}</Text>
              </Pressable>
            ) : (
              <View />
            )}
            {next ? (
              <Pressable accessibilityRole="button" accessibilityLabel={`Next chapter, ${next.title}`} onPress={() => go(next.number)} style={styles.pageBtn}>
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
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACE.xl },
  pager: { flexDirection: 'row', justifyContent: 'space-between', marginTop: SPACE.lg },
  pageBtn: { flexDirection: 'row', alignItems: 'center', columnGap: 4, padding: SPACE.sm },
});
