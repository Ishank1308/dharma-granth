import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DoorCard, Pill, Pills, ProgressBar } from '@/components/learn-ui';
import { Backdrop, Chip, GroupCard, GroupRow, GroupTitle, LargeHeader } from '@/components/ui';
import { dailyAt, JOURNEY_HUE, learn, LEVEL_HUE, recommendationsFor, todayDailyIndex, hueFor } from '@/content/learn';
import { S, useI18n } from '@/i18n';
import { doneCount } from '@/lib/learn-progress';
import { useScrollY } from '@/motion/parallax';
import { useStagger } from '@/motion/stagger';
import { TitleBar } from '@/motion/title-bar';
import { usePrefs } from '@/state/app-state';
import { useLearn } from '@/state/learn';
import { barClearance, huesFor, SPACE, TITLE_FONT_CAP, TYPE, UI_FONT_CAP } from '@/theme/themes';

export { ErrorBoundary } from '@/components/error-boundary';

const CATEGORIES = ['all', 'foundations', 'yoga', 'life', 'healing'] as const;

/**
 * Learn, after the website's /learn: today's daily journey verse, "discover your path", the courses with
 * how far the reader has come in each, the guided reading journeys by theme, the Gita journey and the
 * questions about the scriptures. Progress lives on the phone and goes into the backup.
 */
export default function LearnHub() {
  const insets = useSafeAreaInsets();
  const { palette } = usePrefs();
  const { t, lang } = useI18n();
  const hues = huesFor(palette);
  const { progress } = useLearn();
  const { scrollY, onScroll } = useScrollY();
  const enter = useStagger();
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('all');

  const courses = learn('courses').items;
  const journeys = learn('journeys').items;
  const today = dailyAt(todayDailyIndex());
  const path = progress.discover ? recommendationsFor(progress.discover) : null;
  const shown = useMemo(() => (category === 'all' ? journeys : journeys.filter((j) => j.category === category)), [category, journeys]);
  const pick = (m: { en: string; hi: string }) => m[lang] || m.en;

  return (
    <Backdrop>
      <Stack.Screen options={{ title: '', headerTransparent: true, headerStyle: { backgroundColor: 'transparent' } }} />
      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={{ backgroundColor: 'transparent' }}
        contentContainerStyle={{ paddingTop: insets.top + 24, paddingHorizontal: SPACE.lg, paddingBottom: barClearance(insets.bottom), rowGap: SPACE.lg }}>
        <LargeHeader title={S.learnTitle} eyebrow={S.learnEyebrow} subtitle={t(S.learnSummary)} scrollY={scrollY} />

        <Animated.View entering={enter(0)}>
          <DoorCard strong title={t(S.learnDailyTitle)} detail={t(S.learnDailyRow)} icon="sunny-outline" hue="gold" onPress={() => router.push('/learn/daily')}>
            <View style={{ rowGap: 4 }}>
              <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: hues.gold, fontSize: TYPE.caption, fontWeight: '700' }}>
                {`${t(S.learnToday)} · ${pick(today.scripture)} ${today.chapter}.${today.verse}`}
              </Text>
              <Text maxFontSizeMultiplier={TITLE_FONT_CAP} numberOfLines={2} style={{ color: palette.text, fontSize: TYPE.callout, lineHeight: TYPE.callout * 1.6, fontWeight: '600' }}>
                {today.sanskrit.split('\n')[0]}
              </Text>
              <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.footnote }}>
                {today.theme}
              </Text>
            </View>
          </DoorCard>
        </Animated.View>

        <Animated.View entering={enter(1)}>
          <DoorCard title={t(S.learnStartTitle)} detail={t(S.learnStartRow)} icon="compass-outline" hue="peacock" onPress={() => router.push('/learn/start')}>
            {path ? (
              <View style={{ rowGap: 2 }}>
                <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: hues.peacock, fontSize: TYPE.caption, fontWeight: '700' }}>
                  {t(S.learnStartSaved)}
                </Text>
                <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.subhead, fontWeight: '600' }}>
                  {pick(path.recs[0].title)}
                </Text>
              </View>
            ) : null}
          </DoorCard>
        </Animated.View>

        <GroupTitle title={t(S.learnCourses)} detail={String(courses.length)} />
        <GroupCard>
          {courses.map((c, i) => {
            const done = doneCount(progress, 'courses', c.id, c.lessons.map((l) => l.id));
            const hue = hueFor(c.hue);
            return (
              <GroupRow
                key={c.id}
                standalone={i === 0}
                inset={72}
                accessibilityLabel={t(S.learnOpenA11y(c.title, `${t(S.learnLevel(c.level))}, ${t(S.learnLessons(c.lessons.length))}, ${t(S.learnDone(done, c.lessons.length))}`))}
                onPress={() => router.push({ pathname: '/learn/course/[id]', params: { id: c.id } })}>
                <View style={[styles.emoji, { backgroundColor: `${hues[hue]}${palette.dark ? '33' : '1c'}` }]}>
                  <Text allowFontScaling={false} style={{ fontSize: 22 }}>
                    {c.icon}
                  </Text>
                </View>
                <View style={{ flex: 1, rowGap: 4 }}>
                  <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.body, fontWeight: '600' }}>
                    {c.title}
                  </Text>
                  <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.footnote }}>
                    {`${c.sanskrit} · ${t(S.learnLevel(c.level))} · ${t(S.learnMinutes(c.minutes))}`}
                  </Text>
                  {done > 0 ? <ProgressBar value={done / c.lessons.length} hue={hue} height={4} /> : null}
                </View>
                <Ionicons name="chevron-forward" size={18} color={palette.muted} />
              </GroupRow>
            );
          })}
        </GroupCard>

        <GroupTitle title={t(S.learnJourneys)} detail={String(journeys.length)} />
        <View accessibilityRole="radiogroup" style={styles.chips}>
          {CATEGORIES.map((key) => (
            <Chip key={key} label={key === 'all' ? t(S.faqAll) : t(S.learnJourneyCategory(key))} active={category === key} onPress={() => setCategory(key)} />
          ))}
        </View>
        <GroupCard>
          {shown.map((j, i) => {
            const done = doneCount(progress, 'journeys', j.id, j.lessons.map((l) => l.id));
            const hue = JOURNEY_HUE[j.category] ?? 'saffron';
            return (
              <GroupRow
                key={j.id}
                standalone={i === 0}
                inset={72}
                accessibilityLabel={t(S.learnOpenA11y(pick(j.title), `${t(S.learnLessons(j.lessons.length))}, ${t(S.learnDone(done, j.lessons.length))}`))}
                onPress={() => router.push({ pathname: '/learn/journey/[id]', params: { id: j.id } })}>
                <View style={[styles.emoji, { backgroundColor: `${hues[hue]}${palette.dark ? '33' : '1c'}` }]}>
                  <Text allowFontScaling={false} style={{ fontSize: 22 }}>
                    {j.icon}
                  </Text>
                </View>
                <View style={{ flex: 1, rowGap: 4 }}>
                  <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.body, fontWeight: '600' }}>
                    {pick(j.title)}
                  </Text>
                  <Pills>
                    <Pill text={t(S.learnLevel(j.level))} hue={LEVEL_HUE[j.level]} />
                    <Pill text={t(S.learnLessons(j.lessons.length))} />
                    {done > 0 ? <Pill text={t(S.learnDone(done, j.lessons.length))} hue="tulsi" /> : null}
                  </Pills>
                </View>
                <Ionicons name="chevron-forward" size={18} color={palette.muted} />
              </GroupRow>
            );
          })}
        </GroupCard>

        <GroupTitle title={t(S.learnMore)} />
        <DoorCard
          title={t(S.learnGitaTitle)}
          detail={progress.gita.length ? t(S.gitaStudiedCount(progress.gita.length)) : t(S.learnGitaRow)}
          emoji="🏹"
          hue="saffron"
          onPress={() => router.push('/learn/gita')}
        />
        <DoorCard title={t(S.learnFaqTitle)} detail={t(S.learnFaqRow)} icon="help-circle-outline" hue="indigo" onPress={() => router.push('/learn/faq')} />
      </Animated.ScrollView>
      <TitleBar scrollY={scrollY} title={S.learnTitle} />
    </Backdrop>
  );
}

const styles = StyleSheet.create({
  emoji: { width: 44, height: 44, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACE.sm },
});
