import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { Backdrop, Eyebrow, glass, Muted } from '@/components/ui';
import { VerseCard } from '@/components/verse-card';
import { getEntry, loadChapter } from '@/content/catalog';
import { useDownloads } from '@/content/downloads';
import type { Verse } from '@/content/types';
import { S, type Msg } from '@/i18n';
import { toDevanagari } from '@/lib/verse-format';
import { useAppState } from '@/state/app-state';
import { SPACE, TYPE } from '@/theme/themes';

export default function ChapterScreen() {
  const params = useLocalSearchParams<{ id: string; chapter: string; verse?: string }>();
  const id = String(params.id);
  const chapterNo = Number(params.chapter);
  const { palette, settings, lang, bookmarks, toggleBookmark, setLastRead } = useAppState();
  const t = (m: Msg) => m[lang];
  const entry = getEntry(id);
  const meta = entry?.chapters.find((c) => c.number === chapterNo);
  const downloaded = useDownloads().installed[id];
  // Re-read when the book is downloaded, updated or deleted while this screen is open.
  const chapter = useMemo(() => loadChapter(id, chapterNo), [id, chapterNo, downloaded]); // eslint-disable-line react-hooks/exhaustive-deps
  const listRef = useRef<FlatList<Verse>>(null);
  const jumped = useRef(false);
  // Jumping to a verse (see jumpToTarget below). userScrolled is set once the reader scrolls by hand,
  // so the jump never fights their finger.
  const userScrolled = useRef(false);
  const jumpFailed = useRef(false);
  const settled = useRef(false);
  const highestSeen = useRef(-1);
  const stalls = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const later = (fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  };

  useEffect(() => {
    if (chapter) setLastRead(id, chapterNo);
  }, [id, chapterNo, chapter, setLastRead]);

  const target = params.verse ? (chapter?.verses.findIndex((v) => String(v.number) === String(params.verse)) ?? -1) : -1;

  /**
   * Scroll the target verse to the top. Verse heights vary, so FlatList only knows where a card is once
   * it has rendered, and it keeps the list's scrollable length to the cards measured so far. A far verse
   * is reached in steps: each failed attempt scrolls to the last measured card, the list renders the
   * next few, and we try again. Once it lands, two more jumps absorb cards that measured late.
   */
  const jumpToTarget = () => {
    if (target <= 0 || userScrolled.current) return;
    jumpFailed.current = false;
    listRef.current?.scrollToIndex({ index: target, animated: false, viewPosition: 0 });
    // onScrollToIndexFailed runs synchronously inside scrollToIndex, so this tells us if it landed.
    if (!jumpFailed.current && !settled.current) {
      settled.current = true;
      later(jumpToTarget, 300);
      later(jumpToTarget, 900);
    }
  };

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

  // A plain function: the React Compiler memoizes it on these same inputs. (A manual useCallback here
  // makes the compiler skip this whole component, because the localized labels below read `entry`.)
  const renderItem = ({ item }: { item: Verse }) => (
    <VerseCard
      scriptureId={id}
      scriptureTitle={entry?.title ?? id}
      chapter={chapterNo}
      verse={item}
      palette={palette}
      settings={settings}
      lang={lang}
      bookmarked={saved.has(String(item.number))}
      onToggleBookmark={onToggleBookmark}
    />
  );

  if (!entry || !meta || !chapter) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: entry?.title ?? '' }} />
        <Muted style={{ textAlign: 'center' }}>
          {entry && !entry.bundled && !downloaded ? t(S.chapterNeedsDownload(entry.title)) : t(S.chapterUnavailable)}
        </Muted>
        {entry && !entry.bundled && !downloaded ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => router.replace({ pathname: '/scripture/[id]', params: { id } })}
            style={[styles.pageBtn, glass(palette), { marginTop: SPACE.lg }]}>
            <Text style={{ color: palette.accent, fontWeight: '600' }}>{t(S.goToDownload)}</Text>
          </Pressable>
        ) : null}
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
            jumpToTarget();
          }}
          onScrollBeginDrag={() => {
            userScrolled.current = true;
          }}
          onScrollToIndexFailed={(info) => {
            jumpFailed.current = true;
            if (userScrolled.current) return;
            // Give up only if several steps in a row render nothing new.
            stalls.current = info.highestMeasuredFrameIndex > highestSeen.current ? 0 : stalls.current + 1;
            highestSeen.current = Math.max(highestSeen.current, info.highestMeasuredFrameIndex);
            if (stalls.current > 12) return;
            if (info.highestMeasuredFrameIndex > 0) {
              listRef.current?.scrollToIndex({ index: info.highestMeasuredFrameIndex, animated: false, viewPosition: 0 });
            }
            later(jumpToTarget, 80);
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
