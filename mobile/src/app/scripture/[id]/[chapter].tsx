import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { Backdrop, Eyebrow, glass, Muted } from '@/components/ui';
import { VerseCard } from '@/components/verse-card';
import { getEntry, loadChapter } from '@/content/catalog';
import type { Verse } from '@/content/types';
import { S, type Msg } from '@/i18n';
import { toDevanagari } from '@/lib/verse-format';
import { useAppState } from '@/state/app-state';
import { SPACE, TYPE } from '@/theme/themes';

export default function ChapterScreen() {
  const params = useLocalSearchParams<{ id: string; chapter: string; verse?: string }>();
  const id = String(params.id);
  const chapterNo = Number(params.chapter);
  const { palette, settings, lang, isBookmarked, toggleBookmark, setLastRead } = useAppState();
  const t = (m: Msg) => m[lang];
  const entry = getEntry(id);
  const meta = entry?.chapters.find((c) => c.number === chapterNo);
  const chapter = useMemo(() => loadChapter(id, chapterNo), [id, chapterNo]);
  const listRef = useRef<FlatList<Verse>>(null);
  const jumped = useRef(false);

  useEffect(() => {
    if (chapter) setLastRead(id, chapterNo);
  }, [id, chapterNo, chapter, setLastRead]);

  const target = params.verse ? (chapter?.verses.findIndex((v) => String(v.number) === String(params.verse)) ?? -1) : -1;

  const idx = entry ? entry.chapters.findIndex((c) => c.number === chapterNo) : -1;
  const prev = idx > 0 ? entry!.chapters[idx - 1] : undefined;
  const next = entry && idx >= 0 && idx < entry.chapters.length - 1 ? entry.chapters[idx + 1] : undefined;

  const go = (n: number) => router.replace({ pathname: '/scripture/[id]/[chapter]', params: { id, chapter: String(n) } });

  // The React Compiler memoizes this, so FlatList rows only re-render when a dependency changes.
  const renderItem = ({ item }: { item: Verse }) => (
    <VerseCard
      scriptureId={id}
      scriptureTitle={entry?.title ?? id}
      chapter={chapterNo}
      verse={item}
      palette={palette}
      settings={settings}
      lang={lang}
      bookmarked={isBookmarked(id, chapterNo, String(item.number))}
      onToggleBookmark={() => toggleBookmark(id, chapterNo, String(item.number))}
    />
  );

  if (!entry || !meta || !chapter) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: entry?.title ?? '' }} />
        <Muted>{t(S.chapterUnavailable)}</Muted>
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
              <Muted style={{ marginTop: SPACE.xs }}>{t(S.verseCount(chapter.verses.length))}</Muted>
            </View>
          }
          ListEmptyComponent={<Muted style={{ textAlign: 'center' }}>{t(S.noVersesYet)}</Muted>}
          ListFooterComponent={
            <View style={styles.pager}>
              {prev ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={t(S.prevChapterA11y(prev.title))}
                  onPress={() => go(prev.number)}
                  style={[styles.pageBtn, glass(palette)]}>
                  <Ionicons name="chevron-back" size={18} color={palette.accent} />
                  <Text style={{ color: palette.accent, fontWeight: '600' }}>{t(S.chapterN(prev.number))}</Text>
                </Pressable>
              ) : (
                <View />
              )}
              {next ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={t(S.nextChapterA11y(next.title))}
                  onPress={() => go(next.number)}
                  style={[styles.pageBtn, glass(palette)]}>
                  <Text style={{ color: palette.accent, fontWeight: '600' }}>{t(S.chapterN(next.number))}</Text>
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
