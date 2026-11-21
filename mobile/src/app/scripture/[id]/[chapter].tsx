import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useRecitation } from '@/audio/player';
import { RECITATION_CREDIT, recitedVerses } from '@/audio/recitation';
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
  const { palette, settings, isBookmarked, toggleBookmark, setLastRead } = useAppState();
  const entry = getEntry(id);
  const meta = entry?.chapters.find((c) => c.number === chapterNo);
  const chapter = useMemo(() => loadChapter(id, chapterNo), [id, chapterNo]);
  const listRef = useRef<FlatList<Verse>>(null);
  const jumped = useRef(false);
  const insets = useSafeAreaInsets();
  const recitation = useRecitation();
  const { currentKey, phase, toggleVerse, playChapter, pause, resume, stop } = recitation;
  const recited = useMemo(() => recitedVerses(id, chapterNo), [id, chapterNo]);
  const recitedSet = useMemo(() => new Set(recited), [recited]);
  const keyPrefix = `${id}/${chapterNo}/`;
  const playingHere = currentKey?.startsWith(keyPrefix) ? currentKey.slice(keyPrefix.length) : null;

  // Recitation belongs to the chapter on screen: leaving it (or switching chapter) stops the audio.
  useEffect(() => stop, [id, chapterNo, stop]);

  // Keep the verse being recited in view while a whole chapter plays.
  useEffect(() => {
    if (!playingHere || !recitation.continuous || !chapter) return;
    const index = chapter.verses.findIndex((v) => String(v.number) === playingHere);
    if (index >= 0) listRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.1 });
  }, [playingHere, recitation.continuous, chapter]);

  useEffect(() => {
    if (chapter) setLastRead(id, chapterNo);
  }, [id, chapterNo, chapter, setLastRead]);

  const target = params.verse ? (chapter?.verses.findIndex((v) => String(v.number) === String(params.verse)) ?? -1) : -1;

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
        audio={recitedSet.has(String(item.number)) ? (playingHere === String(item.number) ? phase : 'idle') : undefined}
        onToggleAudio={() => toggleVerse(id, chapterNo, String(item.number))}
      />
    ),
    [id, chapterNo, entry?.title, palette, settings, isBookmarked, toggleBookmark, recitedSet, playingHere, phase, toggleVerse],
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
          contentContainerStyle={{ padding: SPACE.lg, paddingBottom: SPACE.xxl * 2 + (playingHere ? 72 : 0) }}
          data={chapter.verses}
          extraData={`${playingHere}:${phase}`}
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
            <View style={{ marginBottom: SPACE.lg, alignItems: 'center', rowGap: SPACE.xs }}>
              <Eyebrow en={`Chapter ${chapterNo}`} hi={`अध्याय ${toDevanagari(chapterNo)}`} style={{ alignSelf: 'center' }} />
              <Text style={{ color: palette.text, fontSize: TYPE.title2, fontWeight: '800', textAlign: 'center', marginTop: SPACE.xs }}>
                {meta.titleSanskrit ?? meta.title}
              </Text>
              {meta.titleSanskrit ? <Text style={{ color: palette.muted, fontSize: TYPE.subhead }}>{meta.title}</Text> : null}
              <Muted style={{ marginTop: SPACE.xs }}>{chapter.verses.length} verses</Muted>
              {recited.length > 0 ? (
                <View style={{ alignItems: 'center', marginTop: SPACE.sm, rowGap: SPACE.xs }}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Listen to the Sanskrit recitation of this chapter"
                    onPress={() => playChapter(id, chapterNo, recited)}
                    style={[styles.pageBtn, glass(palette)]}>
                    <Ionicons name="headset-outline" size={18} color={palette.accent} />
                    <Text style={{ color: palette.accent, fontWeight: '600' }}>Listen</Text>
                    <Text style={{ color: palette.muted, fontWeight: '600' }}>
                      पाठ सुनें
                    </Text>
                  </Pressable>
                  <Text style={{ color: palette.muted, fontSize: TYPE.caption }}>{RECITATION_CREDIT}</Text>
                </View>
              ) : null}
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
        {playingHere ? (
          <View style={[styles.miniPlayer, glass(palette, true), { bottom: insets.bottom + SPACE.md }]}>
            <Ionicons name="musical-notes-outline" size={18} color={palette.accent} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: palette.text, fontWeight: '700' }} numberOfLines={1}>
                {entry.title} {chapterNo}.{playingHere}
              </Text>
              <Text style={{ color: palette.muted, fontSize: TYPE.caption }} numberOfLines={1}>
                {phase === 'error'
                  ? 'Could not load. Check your connection.'
                  : recitation.continuous
                    ? 'Reciting the chapter'
                    : 'Reciting this verse'}
              </Text>
            </View>
            <Pressable
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={phase === 'playing' ? 'Pause recitation' : 'Play recitation'}
              onPress={phase === 'playing' ? pause : resume}
              style={styles.miniBtn}>
              {phase === 'loading' ? (
                <ActivityIndicator size="small" color={palette.accent} />
              ) : (
                <Ionicons name={phase === 'playing' ? 'pause' : phase === 'error' ? 'refresh' : 'play'} size={22} color={palette.accent} />
              )}
            </Pressable>
            <Pressable hitSlop={8} accessibilityRole="button" accessibilityLabel="Stop recitation" onPress={stop} style={styles.miniBtn}>
              <Ionicons name="close" size={22} color={palette.muted} />
            </Pressable>
          </View>
        ) : null}
      </>
    </Backdrop>
  );
}

const styles = StyleSheet.create({
  miniPlayer: {
    position: 'absolute',
    left: SPACE.lg,
    right: SPACE.lg,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: SPACE.md,
    paddingVertical: SPACE.sm,
    paddingLeft: SPACE.lg,
    paddingRight: SPACE.sm,
    borderRadius: 999,
  },
  miniBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
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
