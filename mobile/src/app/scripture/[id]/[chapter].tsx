import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useRecitation } from '@/audio/player';
import { recitedVerses } from '@/audio/recitation';
import { ReadingSheet } from '@/components/reading-sheet';
import { Backdrop, Eyebrow, FloatingBar, glass, IconButton, Muted } from '@/components/ui';
import { VerseCard } from '@/components/verse-card';
import { VerseJumpSheet } from '@/components/verse-jump-sheet';
import { getEntry, loadChapter } from '@/content/catalog';
import { useDownloads } from '@/content/downloads';
import type { Verse } from '@/content/types';
import { S, type Msg } from '@/i18n';
import { READ_DWELL_MS } from '@/lib/progress';
import { toDevanagari } from '@/lib/verse-format';
import { useAppState } from '@/state/app-state';
import { coverFor } from '@/theme/covers';
import { BAR_GAP, barClearance, SPACE, TITLE_FONT_CAP, TOUCH, TYPE } from '@/theme/themes';

const VIEWABILITY = { itemVisiblePercentThreshold: 40 };

export default function ChapterScreen() {
  const params = useLocalSearchParams<{ id: string; chapter: string; verse?: string }>();
  const id = String(params.id);
  const chapterNo = Number(params.chapter);
  const insets = useSafeAreaInsets();
  const { palette, settings, lang, bookmarks, toggleBookmark, setLastRead, markRead } = useAppState();
  const t = (m: Msg) => m[lang];
  const entry = getEntry(id);
  const meta = entry?.chapters.find((c) => c.number === chapterNo);
  const downloaded = useDownloads().installed[id];
  // Re-read when the book is downloaded, updated or deleted while this screen is open.
  const chapter = useMemo(() => loadChapter(id, chapterNo), [id, chapterNo, downloaded]); // eslint-disable-line react-hooks/exhaustive-deps
  const cover = useMemo(() => coverFor(id, entry?.category ?? 'other'), [id, entry?.category]);
  const listRef = useRef<FlatList<Verse>>(null);
  const jumped = useRef(false);
  const [sheet, setSheet] = useState<'none' | 'reading' | 'jump'>('none');
  const [visibleIndex, setVisibleIndex] = useState(0);
  // Jumping to a verse (see jumpToTarget below). userScrolled is set once the reader scrolls by hand,
  // so the jump never fights their finger.
  const userScrolled = useRef(false);
  // The verse being jumped to: the linked verse at first, then whichever verse is picked in the jump sheet.
  const goal = useRef(-1);
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
    if (chapter) setLastRead(id, chapterNo, params.verse ? String(params.verse) : undefined);
  }, [id, chapterNo, chapter, setLastRead, params.verse]);

  // Reading progress. Each verse on screen is timed from when it appeared; one that stays for
  // READ_DWELL_MS counts as read, so a fast fling through the chapter does not.
  const visibleSince = useRef(new Map<number, number>());
  const marked = useRef(new Set<number>());
  const lastTop = useRef(-1);

  // Recitation (src/audio): verses with audio get a play button, and the toolbar gains Play, which
  // recites the chapter from the verse on screen, then Pause and Stop while it plays.
  const { currentKey, phase, continuous, toggleVerse, playChapter, pause, resume, stop } = useRecitation();
  const recited = useMemo(() => recitedVerses(id, chapterNo), [id, chapterNo]);
  const recitedSet = useMemo(() => new Set(recited), [recited]);
  const keyPrefix = `${id}/${chapterNo}/`;
  const playingHere = currentKey?.startsWith(keyPrefix) ? currentKey.slice(keyPrefix.length) : null;
  const onToggleAudio = useCallback((verse: string) => toggleVerse(id, chapterNo, verse), [toggleVerse, id, chapterNo]);
  // Recitation belongs to the chapter on screen: leaving it, or turning to another chapter, stops it.
  useEffect(() => stop, [id, chapterNo, stop]);

  const target = params.verse ? (chapter?.verses.findIndex((v) => String(v.number) === String(params.verse)) ?? -1) : -1;

  /**
   * Scroll the target verse to the top. Verse heights vary, so FlatList only knows where a card is once
   * it has rendered, and it keeps the list's scrollable length to the cards measured so far. A far verse
   * is reached in steps: each failed attempt scrolls to the last measured card, the list renders the
   * next few, and we try again. Once it lands, two more jumps absorb cards that measured late.
   */
  const jumpToTarget = () => {
    if (goal.current < 0 || userScrolled.current) return;
    jumpFailed.current = false;
    listRef.current?.scrollToIndex({ index: goal.current, animated: false, viewPosition: 0 });
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

  // The verse at the top of the screen, for the toolbar's "Verse 12 of 47".
  // FlatList must get the same callback on every render; setVisibleIndex never changes, so no deps.
  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: { index?: number | null }[] }) => {
    const first = viewableItems.find((v) => v.index != null);
    if (first?.index != null) setVisibleIndex(first.index);
    const now = Date.now();
    const onScreen = new Set<number>();
    for (const v of viewableItems) {
      if (v.index == null) continue;
      onScreen.add(v.index);
      if (!visibleSince.current.has(v.index)) visibleSince.current.set(v.index, now);
    }
    for (const i of [...visibleSince.current.keys()]) if (!onScreen.has(i)) visibleSince.current.delete(i);
  }, []);

  // Twice a second while this screen is in front: mark verses that stayed long enough, and remember the
  // verse at the top so Continue reading lands on it. Paused when another screen covers this one.
  useFocusEffect(
    useCallback(() => {
      if (!chapter) return;
      const verses = chapter.verses;
      const start = Date.now();
      for (const i of visibleSince.current.keys()) visibleSince.current.set(i, start);
      const timer = setInterval(() => {
        const now = Date.now();
        const ready: string[] = [];
        for (const [i, since] of visibleSince.current) {
          if (now - since < READ_DWELL_MS || marked.current.has(i) || !verses[i]) continue;
          marked.current.add(i);
          ready.push(String(verses[i].number));
        }
        if (ready.length) markRead(id, chapterNo, ready);
        // While a linked verse is still being scrolled to, the top of the list is not where the reader is.
        if (goal.current >= 0 && !settled.current && !userScrolled.current) return;
        if (visibleSince.current.size === 0) return;
        const top = Math.min(...visibleSince.current.keys());
        if (top !== lastTop.current && verses[top]) {
          lastTop.current = top;
          setLastRead(id, chapterNo, String(verses[top].number));
        }
      }, 500);
      return () => clearInterval(timer);
    }, [chapter, id, chapterNo, markRead, setLastRead]),
  );

  const numbers = useMemo(() => (chapter ? chapter.verses.map((v) => String(v.number)) : []), [chapter]);

  // A verse picked in the jump sheet is reached the same way as a linked verse.
  const jumpTo = (index: number) => {
    setSheet('none');
    goal.current = index;
    userScrolled.current = false;
    settled.current = false;
    highestSeen.current = -1;
    stalls.current = 0;
    jumpToTarget();
  };

  // While a whole chapter is recited, bring each verse to the top as it starts, unless the reader has
  // scrolled away by hand since pressing Play.
  useEffect(() => {
    if (!playingHere || !continuous) return;
    const index = numbers.indexOf(playingHere);
    if (index < 0 || userScrolled.current) return;
    goal.current = index;
    settled.current = false;
    highestSeen.current = -1;
    stalls.current = 0;
    jumpToTarget();
  }, [playingHere, continuous]); // eslint-disable-line react-hooks/exhaustive-deps

  const onPlay = () => {
    if (playingHere) {
      if (phase === 'playing') pause();
      else resume();
      return;
    }
    userScrolled.current = false;
    const from = recited.find((v, i) => i >= 0 && numbers.indexOf(v) >= visibleIndex);
    playChapter(id, chapterNo, recited, from);
  };

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
      cover={cover}
      bookmarked={saved.has(String(item.number))}
      onToggleBookmark={onToggleBookmark}
      audio={recitedSet.has(String(item.number)) ? (playingHere === String(item.number) ? phase : 'idle') : undefined}
      onToggleAudio={onToggleAudio}
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

  const total = chapter.verses.length;
  const shownVerse = numbers[Math.min(visibleIndex, Math.max(total - 1, 0))] ?? '';

  return (
    <Backdrop quiet>
      <>
        <Stack.Screen
          options={{
            title: `${entry.title} · ${chapterNo}`,
            headerRight: () => (
              <IconButton
                icon="text"
                onPress={() => setSheet('reading')}
                accessibilityLabel={t(S.readingOptions)}
                color={palette.accent}
                tone="clear"
              />
            ),
          }}
        />
        <FlatList
          ref={listRef}
          style={{ backgroundColor: 'transparent' }}
          contentContainerStyle={{ padding: SPACE.lg, paddingBottom: barClearance(insets.bottom) }}
          data={chapter.verses}
          keyExtractor={(v, i) => `${v.number}-${i}`}
          renderItem={renderItem}
          extraData={`${playingHere}:${phase}`}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={VIEWABILITY}
          // Never render up to the target verse in one go: a bookmark deep in Bala Kand (1,958 verses)
          // would mount ~1,500 cards on the JS thread and freeze the phone. Jump instead (below).
          initialNumToRender={6}
          maxToRenderPerBatch={6}
          windowSize={7}
          onLayout={() => {
            if (target <= 0 || jumped.current) return;
            jumped.current = true;
            goal.current = target;
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
              <Text
                accessibilityRole="header"
                maxFontSizeMultiplier={TITLE_FONT_CAP}
                style={{ color: palette.text, fontSize: TYPE.title1, fontWeight: '700', textAlign: 'center', marginTop: SPACE.xs }}>
                {meta.titleSanskrit ?? meta.title}
              </Text>
              {meta.titleSanskrit ? (
                <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.subhead }}>
                  {meta.title}
                </Text>
              ) : null}
              <Muted style={{ marginTop: SPACE.xs }}>{t(S.verseCount(total))}</Muted>
              {recited.length > 0 ? (
                <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.caption }}>
                  {t(S.recitationCredit)}
                </Text>
              ) : null}
            </View>
          }
          ListEmptyComponent={<Muted style={{ textAlign: 'center' }}>{t(S.noVersesYet)}</Muted>}
          ListFooterComponent={
            next ? (
              // The end of the chapter leads straight on to the next one.
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t(S.nextChapterA11y(next.title))}
                onPress={() => go(next.number)}
                style={({ pressed }) => [styles.nextCard, glass(palette, true), pressed && { transform: [{ scale: 0.985 }] }]}>
                <View style={{ flex: 1 }}>
                  <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.accent, fontSize: TYPE.footnote, fontWeight: '700' }}>
                    {t(S.nextChapterLabel)}
                  </Text>
                  <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.body, fontWeight: '600', marginTop: 2 }}>
                    {next.titleSanskrit ?? next.title}
                  </Text>
                  <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.footnote }}>
                    {t(S.chapterN(next.number))}
                  </Text>
                </View>
                <Ionicons name="arrow-forward" size={22} color={palette.accent} />
              </Pressable>
            ) : undefined
          }
        />

        {/* The reader's controls, in the thumb zone: previous chapter, where you are (tap to jump), next chapter. */}
        <View pointerEvents="box-none" style={[styles.toolbarWrap, { bottom: Math.max(insets.bottom, SPACE.sm) + BAR_GAP }]}>
          <FloatingBar style={styles.toolbar}>
            <IconButton
              icon="chevron-back"
              onPress={() => prev && go(prev.number)}
              disabled={!prev}
              accessibilityLabel={prev ? t(S.prevChapterA11y(prev.title)) : t(S.firstChapter)}
              color={prev ? palette.accent : palette.border}
            />
            {recited.length > 0 ? (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ busy: phase === 'loading' && !!playingHere }}
                accessibilityLabel={t(
                  !playingHere
                    ? S.listenChapterA11y(recited.find((v) => numbers.indexOf(v) >= visibleIndex) ?? recited[0])
                    : phase === 'playing'
                      ? S.pauseRecitation
                      : phase === 'error'
                        ? S.retryRecitation
                        : S.resumeRecitation,
                )}
                onPress={onPlay}
                style={({ pressed }) => [styles.roundBtn, pressed && { opacity: 0.7, transform: [{ scale: 0.94 }] }]}>
                {playingHere && phase === 'loading' ? (
                  <ActivityIndicator size="small" color={palette.accent} />
                ) : (
                  <Ionicons
                    name={playingHere && phase === 'playing' ? 'pause' : playingHere && phase === 'error' ? 'refresh' : 'play'}
                    size={21}
                    color={palette.accent}
                  />
                )}
              </Pressable>
            ) : null}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={
                playingHere
                  ? `${t(S.recitingVerse(playingHere, total))}. ${t(S.jumpToVerseA11y(playingHere, total))}`
                  : t(S.jumpToVerseA11y(shownVerse, total))
              }
              onPress={() => total > 0 && setSheet('jump')}
              style={({ pressed }) => [
                styles.position,
                { backgroundColor: palette.dark ? 'rgba(255,159,10,0.14)' : 'rgba(194,65,12,0.08)' },
                pressed && { opacity: 0.75 },
              ]}>
              <Text maxFontSizeMultiplier={1.4} numberOfLines={1} style={{ color: palette.text, fontSize: TYPE.subhead, fontWeight: '700' }}>
                {playingHere ? (
                  <Ionicons name="musical-notes" size={TYPE.subhead} color={palette.accent} accessibilityElementsHidden />
                ) : null}
                {playingHere ? ' ' : ''}
                {t(S.verseOf(playingHere ?? shownVerse, total))}
              </Text>
            </Pressable>
            {playingHere ? <IconButton icon="stop" onPress={stop} accessibilityLabel={t(S.stopRecitation)} color={palette.muted} /> : null}
            <IconButton
              icon="chevron-forward"
              onPress={() => next && go(next.number)}
              disabled={!next}
              accessibilityLabel={next ? t(S.nextChapterA11y(next.title)) : t(S.lastChapter)}
              color={next ? palette.accent : palette.border}
            />
          </FloatingBar>
        </View>

        <ReadingSheet visible={sheet === 'reading'} onClose={() => setSheet('none')} />
        <VerseJumpSheet visible={sheet === 'jump'} onClose={() => setSheet('none')} numbers={numbers} current={visibleIndex} onPick={jumpTo} />
      </>
    </Backdrop>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACE.xl },
  pageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 4,
    minHeight: TOUCH,
    paddingHorizontal: SPACE.lg,
    borderRadius: 999,
  },
  nextCard: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: SPACE.md,
    borderRadius: 22,
    padding: SPACE.lg,
    marginTop: SPACE.sm,
  },
  roundBtn: { width: TOUCH, height: TOUCH, borderRadius: TOUCH / 2, alignItems: 'center', justifyContent: 'center' },
  toolbarWrap: { position: 'absolute', left: SPACE.lg, right: SPACE.lg },
  toolbar: { justifyContent: 'space-between' },
  position: {
    flexShrink: 1,
    minHeight: TOUCH,
    paddingHorizontal: SPACE.lg,
    borderRadius: TOUCH / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
