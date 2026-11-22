import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack, type Href } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BentoCol, BentoDepth, BentoRow, BentoTile } from '@/components/bento';
import { ActionButton, ProgressBar, Stat, VersePickSheet } from '@/components/desk-ui';
import { Backdrop, Chip, GroupCard, GroupRow, GroupTitle, IconButton, IconTile, LargeHeader, Muted } from '@/components/ui';
import { getEntry } from '@/content/catalog';
import { verseLabel } from '@/content/compare';
import { COLLECTION_LABELS, D, S, useI18n } from '@/i18n';
import { queueKey, studyStats, weekSoFar, type QueueItem } from '@/lib/desk';
import { allCollections, collectionCounts, formatDay, isBuiltin } from '@/lib/journal';
import { dayKey, percentRead, streakInfo } from '@/lib/progress';
import { useToday } from '@/lib/use-today';
import { formatVerseRef } from '@/lib/verse-format';
import { useScrollY } from '@/motion/parallax';
import { TitleBar } from '@/motion/title-bar';
import { useToast } from '@/motion/toast';
import { useAppState, usePrefs } from '@/state/app-state';
import { useDesk } from '@/state/desk';
import { useJournal } from '@/state/journal';
import { huesFor, RADIUS, SPACE, TITLE_FONT_CAP, TYPE, UI_FONT_CAP } from '@/theme/themes';

export { ErrorBoundary } from '@/components/error-boundary';

const sizes = (id: string) => getEntry(id)?.chapters;

const openVerse = (q: QueueItem) =>
  router.push({ pathname: '/scripture/[id]/[chapter]', params: { id: q.id, chapter: String(q.chapter), verse: q.verse } });

/**
 * The study desk, as the website's /practice/desk and /practice/dashboard in one screen: this week's reading
 * against a goal the reader sets, plain counts from reading progress, the reading queue (ordered by hand),
 * saved verses, reflections, and doors to the study sheet and compare. All of it is on the phone only.
 */
export default function DeskScreen() {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const { palette, progress, bookmarks, lastRead } = useAppState();
  const { journal } = useJournal();
  const { desk, enqueue, dequeue, move, setGoal } = useDesk();
  const { t, lang } = useI18n();
  const toast = useToast();
  const hues = huesFor(palette);
  const { scrollY, onScroll } = useScrollY();
  const depth = useMemo(() => ({ scrollY, windowHeight: height }), [scrollY, height]);
  const [picking, setPicking] = useState(false);

  useToday(); // re-render at midnight, so the week moves on
  const today = dayKey();
  const stats = useMemo(() => studyStats(progress, today, sizes), [progress, today]);
  const streak = streakInfo(progress, today);
  const week = weekSoFar(today);
  const readDays = new Set(progress.days);
  const shortDays = t(D.weekdaysShort).split(',');
  const longDays = t(D.weekdaysLong).split(',');

  const counts = useMemo(() => collectionCounts(journal, bookmarks), [journal, bookmarks]);
  const collections = allCollections(journal).filter((c) => (counts[c.id] ?? 0) > 0);
  const queued = new Set(desk.queue.map(queueKey));
  const unqueued = bookmarks.filter((b) => !queued.has(queueKey(b))).map((b) => ({ id: b.id, chapter: b.chapter, verse: b.verse }));
  const recentNotes = [...journal.entries].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1)).slice(0, 3);
  const lastEntry = lastRead ? getEntry(lastRead.id) : undefined;

  const add = (items: QueueItem[]) => toast.show(t(D.queueAdded(enqueue(items))), { icon: 'list' });

  return (
    <Backdrop>
      <Stack.Screen options={{ title: '', headerTransparent: true, headerStyle: { backgroundColor: 'transparent' } }} />
      <BentoDepth.Provider value={depth}>
        <Animated.ScrollView
          onScroll={onScroll}
          scrollEventThrottle={16}
          style={{ backgroundColor: 'transparent' }}
          contentContainerStyle={{ paddingTop: insets.top + 24, paddingHorizontal: SPACE.lg, paddingBottom: insets.bottom + SPACE.xxl * 2, rowGap: SPACE.md }}>
          <LargeHeader title={D.deskTitle} eyebrow={D.deskEyebrow} subtitle={t(D.deskSub)} scrollY={scrollY} />

          {/* The week, as a bento: the goal tall on the left, the counts stacked beside it. */}
          <BentoRow>
            <BentoTile flex={1.25} strong minHeight={250} glow={`${hues.saffron}33`} style={{ rowGap: SPACE.md, justifyContent: 'space-between' }}>
              <View>
                <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.accent, fontSize: TYPE.caption, fontWeight: '700' }}>
                  {lang === 'hi' ? t(D.weekTitle) : t(D.weekTitle).toUpperCase()}
                </Text>
                <Text accessibilityRole="header" maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.title2, fontWeight: '800', marginTop: 2 }}>
                  {t(D.weekProgress(stats.daysThisWeek, desk.goal))}
                </Text>
                {stats.daysThisWeek >= desk.goal ? (
                  <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: hues.tulsi, fontSize: TYPE.subhead, fontWeight: '700', marginTop: SPACE.xs }}>
                    {t(D.weekMet)}
                  </Text>
                ) : null}
              </View>
              <View style={styles.week}>
                {shortDays.map((label, i) => {
                  const day = week[i];
                  const read = day ? readDays.has(day) : false;
                  const future = !day;
                  return (
                    <View key={i} accessible accessibilityLabel={t(D.weekDayA11y(longDays[i], read))} style={styles.dayCol}>
                      <View
                        style={[
                          styles.dayDot,
                          read
                            ? { backgroundColor: hues.saffron, borderColor: hues.saffron }
                            : { borderColor: future ? palette.rim : palette.muted, opacity: future ? 0.5 : 1 },
                        ]}>
                        {read ? <Ionicons name="checkmark" size={14} color="#fff" /> : null}
                      </View>
                      <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.caption }}>
                        {label}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </BentoTile>
            <BentoCol>
              <BentoTile flex={1} glow={`${hues.gold}2e`}>
                <Stat value={stats.versesRead.toLocaleString('en-IN')} label={t(D.statVerses)} detail={t(D.statChapters(stats.chaptersTouched, stats.booksStarted))} color={hues.gold} />
              </BentoTile>
              <BentoTile flex={1} glow={`${hues.peacock}2e`}>
                <Stat value={stats.daysRead.toLocaleString('en-IN')} label={t(D.statDays)} detail={t(D.statStreak(streak.current, streak.best))} color={hues.peacock} />
              </BentoTile>
            </BentoCol>
          </BentoRow>

          <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.footnote, fontWeight: '600', marginTop: SPACE.xs }}>
            {t(D.weekGoal)}
          </Text>
          <View accessibilityRole="radiogroup" accessibilityLabel={t(D.weekGoal)} style={styles.chips}>
            {[1, 2, 3, 4, 5, 6, 7].map((d) => (
              <Chip key={d} label={String(d)} active={desk.goal === d} onPress={() => setGoal(d)} accessibilityLabel={t(D.weekGoalA11y(d))} />
            ))}
          </View>

          {lastRead && lastEntry ? (
            <>
              <GroupTitle title={t(D.continueReading)} />
              <GroupCard>
                <GroupRow
                  standalone
                  onPress={() =>
                    router.push({
                      pathname: '/scripture/[id]/[chapter]',
                      params: { id: lastRead.id, chapter: String(lastRead.chapter), ...(lastRead.verse ? { verse: lastRead.verse } : null) },
                    })
                  }>
                  <IconTile icon="bookmark" color={hues.saffron} />
                  <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ flex: 1, color: palette.text, fontSize: TYPE.body, fontWeight: '600' }}>
                    {lastRead.verse
                      ? verseLabel(lastRead.id, lastRead.chapter, lastRead.verse, lang)
                      : `${(lang === 'hi' && lastEntry.titleSanskrit) || lastEntry.title} · ${lastRead.chapter}`}
                  </Text>
                  <Ionicons name="chevron-forward" size={18} color={palette.muted} />
                </GroupRow>
              </GroupCard>
            </>
          ) : null}

          {stats.books.length > 0 ? (
            <>
              <GroupTitle title={t(D.inProgress)} />
              <GroupCard>
                {stats.books.slice(0, 4).map((b, i) => {
                  const entry = getEntry(b.id);
                  const title = (lang === 'hi' && entry?.titleSanskrit) || entry?.title || b.id;
                  const pct = percentRead(b.read, b.total);
                  return (
                    <GroupRow
                      key={b.id}
                      standalone={i === 0}
                      inset={SPACE.lg}
                      accessibilityLabel={t(D.bookProgressA11y(title, pct))}
                      onPress={() => router.push({ pathname: '/scripture/[id]', params: { id: b.id } })}>
                      <View style={{ flex: 1, rowGap: SPACE.xs }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', columnGap: SPACE.sm }}>
                          <Text maxFontSizeMultiplier={TITLE_FONT_CAP} numberOfLines={2} style={{ flex: 1, color: palette.text, fontSize: TYPE.body, fontWeight: '600' }}>
                            {title}
                          </Text>
                          <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.footnote, fontVariant: ['tabular-nums'] }}>
                            {pct}%
                          </Text>
                        </View>
                        <ProgressBar value={pct} color={hues.tulsi} />
                      </View>
                    </GroupRow>
                  );
                })}
              </GroupCard>
            </>
          ) : null}

          <GroupTitle title={t(D.queueTitle)} detail={desk.queue.length ? String(desk.queue.length) : undefined} />
          {desk.queue.length === 0 ? (
            <Muted style={{ paddingHorizontal: SPACE.xs }}>{t(D.queueEmpty)}</Muted>
          ) : (
            <GroupCard>
              {desk.queue.map((q, i) => {
                const label = verseLabel(q.id, q.chapter, q.verse, lang);
                return (
                  <GroupRow key={queueKey(q)} standalone={i === 0} inset={52} style={{ paddingRight: SPACE.xs }}>
                    <Text
                      onPress={() => openVerse(q)}
                      accessibilityRole="link"
                      maxFontSizeMultiplier={TITLE_FONT_CAP}
                      style={{ flex: 1, color: palette.text, fontSize: TYPE.body, fontWeight: '600', paddingVertical: SPACE.sm }}>
                      <Text style={{ color: palette.accent, fontVariant: ['tabular-nums'] }}>{i + 1}. </Text>
                      {label}
                    </Text>
                    <IconButton icon="arrow-up" disabled={i === 0} onPress={() => move(i, -1)} accessibilityLabel={t(D.queueUp(label))} />
                    <IconButton icon="arrow-down" disabled={i === desk.queue.length - 1} onPress={() => move(i, 1)} accessibilityLabel={t(D.queueDown(label))} />
                    <IconButton
                      icon="close"
                      onPress={() => {
                        dequeue(q);
                        toast.show(t(D.queueRemoved), { icon: 'trash-outline', action: { label: t(S.undo), onPress: () => enqueue([q]) } });
                      }}
                      accessibilityLabel={t(D.queueRemove(label))}
                    />
                  </GroupRow>
                );
              })}
            </GroupCard>
          )}
          <ActionButton icon="add" label={t(D.queueAddSaved)} onPress={() => setPicking(true)} />

          <GroupTitle title={t(D.savedTitle)} detail={t(D.savedCount(bookmarks.length))} />
          {bookmarks.length === 0 ? (
            <Muted style={{ paddingHorizontal: SPACE.xs }}>{t(D.noSavedYet)}</Muted>
          ) : (
            <GroupCard>
              {collections.map((c, i) => (
                <GroupRow key={c.id} standalone={i === 0} onPress={() => router.push('/bookmarks')}>
                  <IconTile icon={c.id === 'favourites' ? 'heart' : c.id === 'read-later' ? 'time' : 'albums'} color={i % 2 ? hues.indigo : hues.lotus} />
                  <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ flex: 1, color: palette.text, fontSize: TYPE.body }}>
                    {isBuiltin(c.id) ? t(COLLECTION_LABELS[c.id]) : c.name}
                  </Text>
                  <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.subhead, fontVariant: ['tabular-nums'] }}>
                    {counts[c.id]}
                  </Text>
                  <Ionicons name="chevron-forward" size={18} color={palette.muted} />
                </GroupRow>
              ))}
            </GroupCard>
          )}

          <GroupTitle title={t(D.notesTitle)} detail={journal.entries.length ? String(journal.entries.length) : undefined} />
          {recentNotes.length === 0 ? (
            <Muted style={{ paddingHorizontal: SPACE.xs }}>{t(D.notesEmpty)}</Muted>
          ) : (
            <GroupCard>
              {recentNotes.map((e, i) => {
                const ref = e.refs[0];
                const refLabel = ref ? `${getEntry(ref.id)?.title ?? ref.id} ${formatVerseRef(ref.id, ref.chapter, ref.verse)}` : '';
                return (
                  <GroupRow key={e.id} standalone={i === 0} onPress={() => router.push({ pathname: '/journal/edit', params: { entry: e.id } })}>
                    <IconTile icon="leaf" color={hues.tulsi} />
                    <View style={{ flex: 1 }}>
                      <Text maxFontSizeMultiplier={TITLE_FONT_CAP} numberOfLines={1} style={{ color: palette.text, fontSize: TYPE.body, fontWeight: '600' }}>
                        {e.title || e.body.split('\n')[0] || t(D.untitled)}
                      </Text>
                      <Text maxFontSizeMultiplier={TITLE_FONT_CAP} numberOfLines={1} style={{ color: palette.muted, fontSize: TYPE.footnote }}>
                        {[formatDay(e.updatedAt, lang), refLabel].filter(Boolean).join(' · ')}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={palette.muted} />
                  </GroupRow>
                );
              })}
            </GroupCard>
          )}
          <View style={styles.pair}>
            <View style={{ flex: 1 }}>
              <ActionButton icon="create-outline" label={t(D.newReflection)} onPress={() => router.push('/journal/edit')} />
            </View>
            <View style={{ flex: 1 }}>
              <ActionButton icon="book-outline" label={t(D.openJournal)} onPress={() => router.push('/journal')} />
            </View>
          </View>

          <GroupTitle title={t(D.toolsTitle)} />
          <BentoRow>
            <ToolTile title={t(D.sheetTitle)} detail={t(D.sheetEntry)} icon="document-text" color={hues.vermilion} href="/sheet" />
            <ToolTile title={t(D.compareTitle)} detail={t(D.compareEntry)} icon="git-compare" color={hues.indigo} href="/compare" />
          </BentoRow>

          <Muted style={{ marginTop: SPACE.sm, paddingHorizontal: SPACE.xs }}>{t(D.deskNoJudging)}</Muted>
        </Animated.ScrollView>
      </BentoDepth.Provider>
      <TitleBar scrollY={scrollY} title={D.deskTitle} />

      <VersePickSheet
        visible={picking}
        title={t(D.queuePickTitle)}
        items={unqueued}
        empty={bookmarks.length ? t(D.queuePickEmpty) : t(D.noSavedYet)}
        onClose={() => setPicking(false)}
        onPick={(q) => add([q])}
        header={
          unqueued.length > 1 ? (
            <View style={{ marginBottom: SPACE.md }}>
              <ActionButton
                primary
                icon="albums"
                label={t(D.queueAddAll(unqueued.length))}
                onPress={() => {
                  add(unqueued);
                  setPicking(false);
                }}
              />
            </View>
          ) : null
        }
      />
    </Backdrop>
  );
}

function ToolTile({ title, detail, icon, color, href }: { title: string; detail: string; icon: keyof typeof Ionicons.glyphMap; color: string; href: Href }) {
  const { palette } = usePrefs();
  return (
    <BentoTile flex={1} minHeight={132} glow={`${color}2e`} accessibilityLabel={`${title}. ${detail}`} onPress={() => router.push(href)} style={{ justifyContent: 'space-between', rowGap: SPACE.md }}>
      <IconTile icon={icon} color={color} />
      <View>
        <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.body, fontWeight: '700' }}>
          {title}
        </Text>
        <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.footnote, marginTop: 1 }}>
          {detail}
        </Text>
      </View>
    </BentoTile>
  );
}

const styles = StyleSheet.create({
  week: { flexDirection: 'row', justifyContent: 'space-between' },
  dayCol: { alignItems: 'center', rowGap: SPACE.xs },
  dayDot: { width: 24, height: 24, borderRadius: RADIUS.pill, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACE.sm },
  pair: { flexDirection: 'row', columnGap: SPACE.sm },
});
