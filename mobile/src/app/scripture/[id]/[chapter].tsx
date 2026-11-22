import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, type FlatList, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { GestureDetector, usePanGesture } from 'react-native-gesture-handler';
import Animated, { Extrapolation, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import { useRecitation } from '@/audio/player';
import { recitedVerses } from '@/audio/recitation';
import { ChapterSummaryCard } from '@/components/chapter-summary';
import { ReadingSheet } from '@/components/reading-sheet';
import { accentFill, Backdrop, Eyebrow, FloatingBar, glass, IconButton, Muted } from '@/components/ui';
import { VerseCard } from '@/components/verse-card';
import { VerseJumpSheet } from '@/components/verse-jump-sheet';
import { getEntry, loadChapter } from '@/content/catalog';
import { useDownloads } from '@/content/downloads';
import { chapterSummary, summaryCollection } from '@/content/study';
import type { Verse } from '@/content/types';
import { S, type Msg } from '@/i18n';
import { READ_DWELL_MS } from '@/lib/progress';
import { toDevanagari } from '@/lib/verse-format';
import { hapticSelect } from '@/motion/haptics';
import { PressableScale } from '@/motion/pressable-scale';
import { FlyIn } from '@/motion/shared-origin';
import { DURATION, SPRING } from '@/motion/tokens';
import { useScreenReader } from '@/motion/use-screen-reader';
import { useToast } from '@/motion/toast';
import { useMotion } from '@/motion/use-motion';
import { useAppState } from '@/state/app-state';
import { useJournal } from '@/state/journal';
import { coverFor } from '@/theme/covers';
import { SANSKRIT_FONT } from '@/theme/fonts';
import { BAR_GAP, BAR_HEIGHT, barClearance, quietFill, SPACE, TITLE_FONT_CAP, TOUCH, TYPE, UI_FONT_CAP } from '@/theme/themes';

export { ErrorBoundary } from '@/components/error-boundary';

const VIEWABILITY = { itemVisiblePercentThreshold: 40 };
/** How far a sideways swipe must travel to turn the chapter. */
const TURN_AT = 96;

/**
 * A verse this many cards or more past the first one in the list is reached by starting the list a couple
 * of verses before it, rather than by rendering every card on the way (which took about 30 seconds for
 * Ramcharitmanas 1.250 on an emulator). "Earlier verses" at the top brings back the ones before.
 */
const FAR = 30;
const LEAD = 2;
const EARLIER: Msg = { en: 'Show earlier verses', hi: 'पिछले श्लोक दिखाएँ' };

export default function ChapterScreen() {
  const params = useLocalSearchParams<{ id: string; chapter: string; verse?: string }>();
  const id = String(params.id);
  const chapterNo = Number(params.chapter);
  const insets = useSafeAreaInsets();
  const { palette, settings, lang, bookmarks, toggleBookmark, setLastRead, markRead, lightEffects } = useAppState();
  const t = (m: Msg) => m[lang];
  const entry = getEntry(id);
  const meta = entry?.chapters.find((c) => c.number === chapterNo);
  const downloaded = useDownloads().installed[id];
  // Re-read when the book is downloaded, updated or deleted while this screen is open.
  const chapter = useMemo(() => loadChapter(id, chapterNo), [id, chapterNo, downloaded]); // eslint-disable-line react-hooks/exhaustive-deps
  const cover = useMemo(() => coverFor(id, entry?.category ?? 'other'), [id, entry?.category]);
  const listRef = useRef<FlatList<Verse>>(null);
  const jumped = useRef(false);
  const target = params.verse ? (chapter?.verses.findIndex((v) => String(v.number) === String(params.verse)) ?? -1) : -1;
  // The list shows chapter.verses from `base` on (see FAR). Indexes everywhere else are into the whole chapter.
  const [base, setBase] = useState(() => (target >= FAR ? target - LEAD : 0));
  const baseRef = useRef(base);
  const data = useMemo(() => (chapter ? (base > 0 ? chapter.verses.slice(base) : chapter.verses) : []), [chapter, base]);
  const [sheet, setSheet] = useState<'none' | 'reading' | 'jump'>('none');
  const [visibleIndex, setVisibleIndex] = useState(0);
  // How far through the chapter the verse on screen is, drawn as a hairline under the header.
  const { animate } = useMotion();
  const progress = useSharedValue(0);
  const progressStyle = useAnimatedStyle(() => ({ transform: [{ scaleX: progress.value }] }));
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
  // A verse's play button recites on through the rest of the chapter; Pause or Stop ends it.
  const onToggleAudio = useCallback((verse: string) => toggleVerse(id, chapterNo, verse, recited), [toggleVerse, id, chapterNo, recited]);
  // Recitation belongs to the chapter on screen: leaving it, or turning to another chapter, stops it.
  useEffect(() => stop, [id, chapterNo, stop]);


  /**
   * Scroll the target verse to the top. Verse heights vary, so FlatList only knows where a card is once
   * it has rendered, and it keeps the list's scrollable length to the cards measured so far. A far verse
   * is reached in steps: each failed attempt scrolls to the last measured card, the list renders the
   * next few, and we try again. Once it lands, two more jumps absorb cards that measured late.
   */
  const jumpToTarget = () => {
    if (goal.current < 0 || userScrolled.current) return;
    jumpFailed.current = false;
    listRef.current?.scrollToIndex({ index: Math.max(0, goal.current - baseRef.current), animated: false, viewPosition: 0 });
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

  // Turning back slides the page in from the left (src/app/_layout reads `dir`).
  const go = (n: number, dir?: 'prev') =>
    router.replace({ pathname: '/scripture/[id]/[chapter]', params: dir ? { id, chapter: String(n), dir } : { id, chapter: String(n) } });
  const turn = (step: 1 | -1) => {
    if (step === 1 && next) go(next.number);
    else if (step === -1 && prev) go(prev.number, 'prev');
  };

  /**
   * Swipe sideways to turn the chapter, as a page: the text leans with your finger, the neighbouring
   * chapter's arrow grows at the edge, and a tick says it will turn when you let go. Vertical scrolling
   * wins any diagonal, so reading is never interrupted. The toolbar's arrows do the same for TalkBack.
   */
  const hasPrev = !!prev;
  const hasNext = !!next;
  const dragX = useSharedValue(0);
  const armed = useSharedValue(0);
  const swipe = usePanGesture({
    activeOffsetX: [-24, 24],
    failOffsetY: [-14, 14],
    onUpdate: (e) => {
      'worklet';
      let x = e.translationX;
      // Past the first or last chapter the page only gives a little.
      if ((x > 0 && !hasPrev) || (x < 0 && !hasNext)) x *= 0.15;
      dragX.set(x);
      const past = Math.abs(x) > TURN_AT ? 1 : 0;
      if (past !== armed.get()) {
        armed.set(past);
        if (past) scheduleOnRN(hapticSelect);
      }
    },
    onDeactivate: (e) => {
      'worklet';
      const x = dragX.get();
      if (hasNext && (x < -TURN_AT || (e.velocityX < -900 && x < -40))) scheduleOnRN(turn, 1);
      else if (hasPrev && (x > TURN_AT || (e.velocityX > 900 && x > 40))) scheduleOnRN(turn, -1);
      dragX.set(animate ? withSpring(0, SPRING.settle) : 0);
      armed.set(0);
    },
  });
  const pageLean = useAnimatedStyle(() => ({ transform: [{ translateX: dragX.get() * 0.35 }] }));
  const prevCue = useAnimatedStyle(() => {
    const p = interpolate(dragX.get(), [0, TURN_AT], [0, 1], Extrapolation.CLAMP);
    return { opacity: p, transform: [{ translateX: (1 - p) * -24 }, { scale: 0.7 + p * 0.3 }] };
  });
  const nextCue = useAnimatedStyle(() => {
    const p = interpolate(-dragX.get(), [0, TURN_AT], [0, 1], Extrapolation.CLAMP);
    return { opacity: p, transform: [{ translateX: (1 - p) * 24 }, { scale: 0.7 + p * 0.3 }] };
  });
  const prevFill = useAnimatedStyle(() => ({ opacity: dragX.get() > TURN_AT ? 1 : 0 }));
  const nextFill = useAnimatedStyle(() => ({ opacity: -dragX.get() > TURN_AT ? 1 : 0 }));

  /**
   * The toolbar steps aside while you read down the chapter and comes back the moment you scroll up, reach
   * the end, or return to the top, as in Apple Books. It stays put for TalkBack, during a recitation, and
   * with reduce motion.
   */
  const screenReader = useScreenReader();
  const pinBar = screenReader || !animate;
  const barAway = useSharedValue(0);
  const lastY = useSharedValue(0);
  // Only the reader's own scrolling moves the bar: a jump to a linked or picked verse leaves it in place.
  // (The web preview scrolls by wheel, which has no drag events, so there any scroll counts.)
  const fingerScroll = useSharedValue(Platform.OS === 'web' ? 1 : 0);
  const fingerOn = () => fingerScroll.set(1);
  const fingerOff = () => {
    if (Platform.OS !== 'web') fingerScroll.set(0);
  };
  const onScroll = useAnimatedScrollHandler((e) => {
    const yy = e.contentOffset.y;
    const dy = yy - lastY.get();
    lastY.set(yy);
    const nearEnd = yy + e.layoutMeasurement.height > e.contentSize.height - 160;
    const own = fingerScroll.get() > 0;
    const want = pinBar || yy < 120 || nearEnd || (own && dy < -4) ? 0 : own && dy > 4 ? 1 : barAway.get() > 0.5 ? 1 : 0;
    const now = barAway.get() > 0.5 ? 1 : 0;
    if (want !== now) barAway.set(withSpring(want, SPRING.settle));
  });
  const barStyle = useAnimatedStyle(() => ({
    opacity: 1 - barAway.get() * 0.4,
    transform: [{ translateY: barAway.get() * (BAR_HEIGHT + insets.bottom + BAR_GAP + SPACE.lg) }],
  }));

  // Bookmarked verse numbers in this chapter only. With a stable toggle callback, saving one verse
  // re-renders that one card instead of every card on screen (VerseCard is memoised).
  const saved = useMemo(
    () => new Set(bookmarks.filter((b) => b.id === id && b.chapter === chapterNo).map((b) => b.verse)),
    [bookmarks, id, chapterNo],
  );
  // Saving or removing confirms itself with a toast and Undo, so the reader never meets a dialog mid-chapter.
  const toast = useToast();
  const savedRef = useRef(saved);
  useEffect(() => {
    savedRef.current = saved;
  }, [saved]);
  const onToggleBookmark = useCallback(
    (verse: string) => {
      const wasSaved = savedRef.current.has(verse);
      toggleBookmark(id, chapterNo, verse);
      toast.show((wasSaved ? S.toastRemoved : S.toastSaved)[lang], {
        icon: wasSaved ? 'bookmark-outline' : 'bookmark',
        action: { label: S.undo[lang], onPress: () => toggleBookmark(id, chapterNo, verse) },
      });
    },
    [toggleBookmark, id, chapterNo, toast, lang],
  );

  // Journal reflections per verse in this chapter, so the pen on a verse fills in once it has one.
  const { journal } = useJournal();
  const reflections = useMemo(() => {
    const counts = new Map<string, number>();
    for (const e of journal.entries) {
      for (const r of e.refs) if (r.id === id && r.chapter === chapterNo) counts.set(r.verse, (counts.get(r.verse) ?? 0) + 1);
    }
    return counts;
  }, [journal.entries, id, chapterNo]);

  // The verse at the top of the screen, for the toolbar's "Verse 12 of 47".
  // FlatList must get the same callback on every render; setVisibleIndex never changes, so no deps.
  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: { index?: number | null }[] }) => {
    const offset = baseRef.current;
    const first = viewableItems.find((v) => v.index != null);
    if (first?.index != null) setVisibleIndex(first.index + offset);
    const now = Date.now();
    const onScreen = new Set<number>();
    for (const v of viewableItems) {
      if (v.index == null) continue;
      const i = v.index + offset;
      onScreen.add(i);
      if (!visibleSince.current.has(i)) visibleSince.current.set(i, now);
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

  const fraction = numbers.length > 0 ? Math.min(1, (visibleIndex + 1) / numbers.length) : 0;
  useEffect(() => {
    progress.set(animate ? withTiming(fraction, { duration: DURATION.quick }) : fraction);
  }, [fraction, animate, progress]);

  /**
   * Bring verse `index` of the chapter to the top. A verse far from the cards already in the list, or
   * before them, restarts the list just above it (see FAR); the jump then runs once the list has the new cards.
   */
  const reach = (index: number, byHand = true) => {
    goal.current = index;
    if (byHand) userScrolled.current = false;
    settled.current = false;
    highestSeen.current = -1;
    stalls.current = 0;
    const from = Math.max(visibleIndex, base);
    const nextBase = index < base || index - from >= FAR ? (index >= FAR ? index - LEAD : 0) : base;
    if (nextBase !== base) setBase(nextBase);
    else jumpToTarget();
  };
  useEffect(() => {
    baseRef.current = base;
    if (goal.current >= 0) jumpToTarget();
  }, [base]); // eslint-disable-line react-hooks/exhaustive-deps

  // A verse picked in the jump sheet is reached the same way as a linked verse.
  const jumpTo = (index: number) => {
    setSheet('none');
    reach(index);
  };

  // A verse link opened while this chapter is already on screen (a widget, a notification or search
  // reusing the screen) changes only the verse param, so jump to it here.
  const lastLinked = useRef(params.verse);
  useEffect(() => {
    if (params.verse === lastLinked.current) return;
    lastLinked.current = params.verse;
    if (target >= 0 && jumped.current) reach(target);
  }, [params.verse, target]); // eslint-disable-line react-hooks/exhaustive-deps

  // "Earlier verses": put back up to FAR cards above the list and land on the one just above where it began.
  const showEarlier = () => {
    const nextBase = Math.max(0, base - FAR);
    goal.current = base - 1;
    userScrolled.current = false;
    settled.current = false;
    highestSeen.current = -1;
    stalls.current = 0;
    setBase(nextBase);
  };

  // While a whole chapter is recited, bring each verse to the top as it starts, unless the reader has
  // scrolled away by hand since pressing Play.
  useEffect(() => {
    if (!playingHere || !continuous) return;
    const index = numbers.indexOf(playingHere);
    if (index < 0 || userScrolled.current) return;
    reach(index, false);
  }, [playingHere, continuous]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (playingHere || pinBar) barAway.set(0);
  }, [playingHere, pinBar, barAway]);

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
      reflections={reflections.get(String(item.number)) ?? 0}
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
  // The chapter's summary (सार), where the website has one: the Gita and the Yoga Sutra.
  const summaries = summaryCollection(id);
  const summary = chapterSummary(id, chapterNo);
  const shownVerse = numbers[Math.min(visibleIndex, Math.max(total - 1, 0))] ?? '';

  return (
    <Backdrop quiet>
      <>
        <Stack.Screen
          options={{
            title: t(S.chapterN(chapterNo)),
            // Where you are, in two lines rather than a dot-joined string: the chapter, then its name.
            headerTitle: () => (
              <View style={{ alignItems: 'center' }} accessible accessibilityRole="header">
                <Text numberOfLines={1} maxFontSizeMultiplier={1.3} style={{ color: palette.text, fontSize: TYPE.callout, fontWeight: '700' }}>
                  {t(S.chapterN(chapterNo))}
                </Text>
                <Text numberOfLines={1} maxFontSizeMultiplier={1.3} style={{ color: palette.muted, fontSize: TYPE.caption }}>
                  {meta.titleSanskrit ?? meta.title}
                </Text>
              </View>
            ),
            headerTitleAlign: 'center',
            headerBackground: () => (
              <View style={[StyleSheet.absoluteFill, { backgroundColor: palette.chrome }]}>
                <View style={[styles.progressTrack, { backgroundColor: quietFill(palette) }]}>
                  <Animated.View style={[styles.progressFill, { backgroundColor: palette.accent }, progressStyle]} />
                </View>
              </View>
            ),
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
        <GestureDetector gesture={swipe}>
        <Animated.View style={[styles.page, pageLean]}>
        <Animated.FlatList
          ref={listRef as never}
          onScroll={onScroll}
          scrollEventThrottle={16}
          style={{ backgroundColor: 'transparent' }}
          contentContainerStyle={{ padding: SPACE.lg, paddingBottom: barClearance(insets.bottom) }}
          data={data}
          keyExtractor={(v, i) => `${v.number}-${i}`}
          renderItem={renderItem}
          extraData={`${playingHere}:${phase}`}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={VIEWABILITY}
          // Never render up to the target verse in one go: a bookmark deep in Bala Kand (1,958 verses)
          // would mount ~1,500 cards on the JS thread and freeze the phone. Jump instead (below).
          // A verse card with its translation fills most of a phone screen, so a few cards cover the first
          // paint. Under Light effects (budget phones on Automatic) the list keeps fewer screens mounted
          // around the one in view: less JS work per scroll and less memory, at the cost of a blank flash
          // only on a very hard fling.
          initialNumToRender={lightEffects ? 3 : 6}
          maxToRenderPerBatch={lightEffects ? 4 : 6}
          windowSize={lightEffects ? 5 : 7}
          onLayout={() => {
            if (target <= 0 || jumped.current) return;
            jumped.current = true;
            goal.current = target;
            jumpToTarget();
          }}
          onScrollBeginDrag={() => {
            userScrolled.current = true;
            fingerOn();
          }}
          onScrollEndDrag={fingerOff}
          onMomentumScrollBegin={fingerOn}
          onMomentumScrollEnd={fingerOff}
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
              {base > 0 ? (
                <Pressable
                  accessibilityRole="button"
                  onPress={showEarlier}
                  style={({ pressed }) => [styles.pageBtn, glass(palette), { marginBottom: SPACE.md }, pressed && { opacity: 0.75 }]}>
                  <Ionicons name="chevron-up" size={18} color={palette.accent} />
                  <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.accent, fontWeight: '600' }}>
                    {t(EARLIER)}
                  </Text>
                </Pressable>
              ) : null}
              {/* The chapter's numeral in the shloka face, as a printed book heads a chapter. Tapped in the
                  contents, it flies here from the row (src/motion/shared-origin). */}
              <FlyIn from={`chapter:${id}:${chapterNo}`}>
                <Text
                  accessibilityElementsHidden
                  importantForAccessibility="no"
                  allowFontScaling={false}
                  style={{ fontFamily: SANSKRIT_FONT, color: palette.gold, fontSize: 56, lineHeight: 84, textAlign: 'center' }}>
                  {toDevanagari(chapterNo)}
                </Text>
              </FlyIn>
              <Eyebrow en={`Chapter ${chapterNo}`} hi={`अध्याय ${toDevanagari(chapterNo)}`} style={{ alignSelf: 'center' }} />
              <Text
                accessibilityRole="header"
                maxFontSizeMultiplier={TITLE_FONT_CAP}
                style={{ color: palette.text, fontSize: TYPE.title1, fontWeight: '700', textAlign: 'center', marginTop: SPACE.xs }}>
                {meta.titleSanskrit ?? meta.title}
              </Text>
              {meta.titleSanskrit ? (
                <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.subhead }}>
                  {meta.title}
                </Text>
              ) : null}
              <Muted style={{ marginTop: SPACE.xs }}>{t(S.verseCount(total))}</Muted>
              {recited.length > 0 ? (
                <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.caption }}>
                  {t(S.recitationCredit)}
                </Text>
              ) : null}
              {summaries && summary ? (
                <ChapterSummaryCard
                  scriptureId={id}
                  collection={summaries}
                  summary={summary}
                  onJumpToVerse={(verse) => {
                    const index = numbers.indexOf(String(verse));
                    if (index >= 0) jumpTo(index);
                  }}
                />
              ) : null}
            </View>
          }
          ListEmptyComponent={<Muted style={{ textAlign: 'center' }}>{t(S.noVersesYet)}</Muted>}
          ListFooterComponent={
            next ? (
              // The end of the chapter leads straight on to the next one.
              <PressableScale
                haptic
                accessibilityRole="button"
                accessibilityLabel={t(S.nextChapterA11y(next.title))}
                onPress={() => go(next.number)}
                style={[styles.nextCard, glass(palette, true)]}>
                <View style={{ flex: 1 }}>
                  <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.accent, fontSize: TYPE.footnote, fontWeight: '700' }}>
                    {t(S.nextChapterLabel)}
                  </Text>
                  <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.body, fontWeight: '600', marginTop: 2 }}>
                    {next.titleSanskrit ?? next.title}
                  </Text>
                  <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.footnote }}>
                    {t(S.chapterN(next.number))}
                  </Text>
                </View>
                <Ionicons name="arrow-forward" size={22} color={palette.accent} />
              </PressableScale>
            ) : undefined
          }
        />
        </Animated.View>
        </GestureDetector>

        {/* The neighbouring chapters' arrows, growing at the edges as a sideways swipe turns the page. */}
        {prev ? (
          <Animated.View pointerEvents="none" style={[styles.cue, { left: SPACE.md }, prevCue]}>
            <View style={[styles.cueDot, glass(palette, true)]}>
              <Animated.View style={[StyleSheet.absoluteFill, styles.cueFill, accentFill(palette), prevFill]} />
              <Ionicons name="chevron-back" size={22} color={palette.text} />
            </View>
            <Text maxFontSizeMultiplier={UI_FONT_CAP} style={[styles.cueLabel, { color: palette.muted }]}>
              {t(S.chapterN(prev.number))}
            </Text>
          </Animated.View>
        ) : null}
        {next ? (
          <Animated.View pointerEvents="none" style={[styles.cue, { right: SPACE.md }, nextCue]}>
            <View style={[styles.cueDot, glass(palette, true)]}>
              <Animated.View style={[StyleSheet.absoluteFill, styles.cueFill, accentFill(palette), nextFill]} />
              <Ionicons name="chevron-forward" size={22} color={palette.text} />
            </View>
            <Text maxFontSizeMultiplier={UI_FONT_CAP} style={[styles.cueLabel, { color: palette.muted }]}>
              {t(S.chapterN(next.number))}
            </Text>
          </Animated.View>
        ) : null}

        {/* The reader's controls, in the thumb zone: previous chapter, where you are (tap to jump), next chapter. */}
        <Animated.View pointerEvents="box-none" style={[styles.toolbarWrap, { bottom: Math.max(insets.bottom, SPACE.sm) + BAR_GAP }, barStyle]}>
          <FloatingBar style={styles.toolbar}>
            <IconButton
              icon="chevron-back"
              onPress={() => prev && go(prev.number, 'prev')}
              disabled={!prev}
              accessibilityLabel={prev ? t(S.prevChapterA11y(prev.title)) : t(S.firstChapter)}
              color={prev ? palette.text : palette.border}
            />
            {recited.length > 0 ? (
              // The toolbar's one filled control: listening is the thing this bar offers beyond turning pages.
              <PressableScale
                scaleTo={0.9}
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
                style={[styles.roundBtn, accentFill(palette)]}>
                {playingHere && phase === 'loading' ? (
                  <ActivityIndicator size="small" color={palette.onAccent} />
                ) : (
                  <Ionicons
                    name={playingHere && phase === 'playing' ? 'pause' : playingHere && phase === 'error' ? 'refresh' : 'play'}
                    size={21}
                    color={palette.onAccent}
                  />
                )}
              </PressableScale>
            ) : null}
            <PressableScale
              scaleTo={0.94}
              accessibilityRole="button"
              accessibilityLabel={
                playingHere
                  ? `${t(S.recitingVerse(playingHere, total))}. ${t(S.jumpToVerseA11y(playingHere, total))}`
                  : t(S.jumpToVerseA11y(shownVerse, total))
              }
              onPress={() => total > 0 && setSheet('jump')}
              style={[styles.position, { backgroundColor: quietFill(palette) }]}>
              <Text
                maxFontSizeMultiplier={1.4}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.8}
                style={{ color: palette.text, fontSize: TYPE.subhead, fontWeight: '700' }}>
                {playingHere ? (
                  <Ionicons name="musical-notes" size={TYPE.subhead} color={palette.accent} accessibilityElementsHidden />
                ) : null}
                {playingHere ? ' ' : ''}
                {playingHere ? t(S.verseOfShort(playingHere, total)) : t(S.verseOf(shownVerse, total))}
              </Text>
            </PressableScale>
            {playingHere ? <IconButton icon="stop" onPress={stop} accessibilityLabel={t(S.stopRecitation)} color={palette.muted} /> : null}
            <IconButton
              icon="chevron-forward"
              onPress={() => next && go(next.number)}
              disabled={!next}
              accessibilityLabel={next ? t(S.nextChapterA11y(next.title)) : t(S.lastChapter)}
              color={next ? palette.text : palette.border}
            />
          </FloatingBar>
        </Animated.View>

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
  progressTrack: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 2 },
  progressFill: { height: 2, transformOrigin: 'left' },
  toolbarWrap: { position: 'absolute', left: SPACE.lg, right: SPACE.lg },
  page: { flex: 1 },
  cue: { position: 'absolute', top: '42%', alignItems: 'center', rowGap: SPACE.xs },
  cueDot: { width: TOUCH, height: TOUCH, borderRadius: TOUCH / 2, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  cueFill: { borderRadius: TOUCH / 2 },
  cueLabel: { fontSize: TYPE.caption, fontWeight: '600' },
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
