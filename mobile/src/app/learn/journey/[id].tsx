import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, type ScrollViewInstance, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { KSection, LabeledText, LangNote, Para, VerseBlock } from '@/components/knowledge-ui';
import { LinkButton, Pill, Pills, PrimaryButton, ProgressBar } from '@/components/learn-ui';
import { Backdrop, Card, Muted } from '@/components/ui';
import { JOURNEY_HUE, journeyById, LEVEL_HUE } from '@/content/learn';
import { S, useI18n } from '@/i18n';
import { doneCount, nextLesson } from '@/lib/learn-progress';
import { useMotion } from '@/motion/use-motion';
import { usePrefs } from '@/state/app-state';
import { useLearn } from '@/state/learn';
import { barClearance, huesFor, quietFill, RADIUS, SPACE, TITLE_FONT_CAP, TOUCH, TYPE, UI_FONT_CAP } from '@/theme/themes';

export { ErrorBoundary } from '@/components/error-boundary';

/**
 * A guided reading journey, as the website's /learn/journeys/<id>: one lesson at a time, each a whole verse
 * from the library with its context, what it says to us, a reflection and something to try. It opens on the
 * first lesson not yet done; the steps along the top jump to any lesson.
 */
export default function JourneyScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { palette } = usePrefs();
  const { t, lang } = useI18n();
  const { animate } = useMotion();
  const hues = huesFor(palette);
  const { progress, setLesson } = useLearn();
  const journey = journeyById(String(id));
  const ids = journey?.lessons.map((l) => l.id) ?? [];
  const [index, setIndex] = useState(() => (journey ? nextLesson(progress, 'journeys', journey.id, ids) : 0));
  const scroll = useRef<ScrollViewInstance>(null);
  const lessonY = useRef(0);
  const first = useRef(true);

  // The stored progress arrives a moment after the screen opens: start on the first unfinished lesson then.
  const finished = progress.journeys[journey?.id ?? ''] ?? [];
  const settled = useRef(false);
  useEffect(() => {
    if (!journey || settled.current || finished.length === 0) return;
    settled.current = true;
    setIndex(nextLesson(progress, 'journeys', journey.id, ids));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished.length]);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    scroll.current?.scrollTo({ y: Math.max(0, lessonY.current - 120), animated: animate });
  }, [index, animate]);

  if (!journey) {
    return (
      <Backdrop>
        <Stack.Screen options={{ title: t(S.notFoundTitle) }} />
        <Muted style={{ margin: SPACE.xl }}>{t(S.notFoundTitle)}</Muted>
      </Backdrop>
    );
  }

  const hue = JOURNEY_HUE[journey.category] ?? 'saffron';
  const color = hues[hue];
  const done = doneCount(progress, 'journeys', journey.id, ids);
  const doneSet = new Set(finished);
  const lesson = journey.lessons[index];
  const last = index === journey.lessons.length - 1;
  const allDone = done === journey.lessons.length;
  const title = journey.title[lang] || journey.title.en;

  const finishAndNext = () => {
    setLesson('journeys', journey.id, lesson.id, true);
    if (!last) setIndex(index + 1);
  };

  return (
    <Backdrop quiet>
      <Stack.Screen options={{ title: '', headerTransparent: true, headerStyle: { backgroundColor: 'transparent' } }} />
      <ScrollView
        ref={scroll}
        style={{ backgroundColor: 'transparent' }}
        contentContainerStyle={{ paddingTop: insets.top + 56, paddingHorizontal: SPACE.lg, paddingBottom: barClearance(insets.bottom), rowGap: SPACE.lg }}>
        <View style={[styles.hero, { borderColor: `${color}55`, backgroundColor: `${color}${palette.dark ? '30' : '16'}` }]}>
          <Text allowFontScaling={false} style={{ fontSize: 36 }}>
            {journey.icon}
          </Text>
          <Text accessibilityRole="header" maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.title1, fontWeight: '800', lineHeight: TYPE.title1 * 1.25 }}>
            {title}
          </Text>
          {lang === 'en' ? (
            <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color, fontSize: TYPE.subhead, fontWeight: '600' }}>
              {journey.title.hi}
            </Text>
          ) : null}
          <Para lang="en">{journey.objective}</Para>
          <LabeledText label={t(S.journeyFor)} text={journey.audience} lang="en" />
          <Pills>
            <Pill text={t(S.learnJourneyCategory(journey.category))} hue={hue} />
            <Pill text={t(S.learnLevel(journey.level))} hue={LEVEL_HUE[journey.level]} />
            <Pill text={t(S.learnMinutesEach(journey.minutes))} />
          </Pills>
          <View style={{ rowGap: 6, marginTop: SPACE.xs }}>
            <ProgressBar value={done / journey.lessons.length} hue={hue} />
            <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.caption, fontWeight: '600' }}>
              {t(S.learnDone(done, journey.lessons.length))}
            </Text>
          </View>
        </View>

        {journey.review !== 'reviewed' ? (
          <View style={[styles.note, { backgroundColor: quietFill(palette) }]}>
            <Ionicons name="information-circle-outline" size={18} color={palette.muted} />
            <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ flex: 1, color: palette.muted, fontSize: TYPE.footnote, lineHeight: TYPE.footnote * 1.5 }}>
              {t(S.journeyDraft)}
            </Text>
          </View>
        ) : null}
        <LangNote content="en" />

        {/* The lessons as steps: done ones filled, the open one ringed. */}
        <View style={styles.steps} accessibilityRole="tablist">
          {journey.lessons.map((l, i) => {
            const isDone = doneSet.has(l.id);
            const active = i === index;
            return (
              <Pressable
                key={l.id}
                onPress={() => setIndex(i)}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
                accessibilityLabel={t(S.journeyLessonA11y(i + 1, isDone))}
                style={styles.stepHit}>
                <View
                  style={[
                    styles.step,
                    { borderColor: active ? color : isDone ? hues.tulsi : palette.border, backgroundColor: isDone ? hues.tulsi : active ? `${color}22` : 'transparent' },
                  ]}>
                  {isDone ? (
                    <Ionicons name="checkmark" size={16} color="#ffffff" />
                  ) : (
                    <Text maxFontSizeMultiplier={1.3} style={{ color: active ? color : palette.muted, fontSize: TYPE.footnote, fontWeight: '700' }}>
                      {i + 1}
                    </Text>
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>

        <Animated.View
          key={lesson.id}
          entering={animate ? FadeIn.duration(220) : undefined}
          onLayout={(e) => {
            lessonY.current = e.nativeEvent.layout.y;
          }}
          style={{ rowGap: SPACE.lg }}>
          <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.footnote, fontWeight: '700' }}>
            {t(S.journeyLessonOf(index + 1, journey.lessons.length))}
          </Text>
          {lesson.text ? (
            <VerseBlock
              sanskrit={lesson.text.sanskrit}
              translit={lesson.text.translit}
              translation={(lang === 'hi' && lesson.text.hi) || lesson.text.en || lesson.text.hi}
              reference={lesson.ref[lang] || lesson.ref.en}
              hue={hue}
              target={{ id: lesson.scriptureId, chapter: lesson.chapter, verse: lesson.verse }}
            />
          ) : (
            <Card>
              <Muted>{t(S.journeyVerseMissing)}</Muted>
            </Card>
          )}
          <KSection title={t(S.journeyContext)} hue="indigo">
            <Para lang="en">{lesson.context}</Para>
          </KSection>
          <KSection title={t(S.journeyExplanation)} hue={hue}>
            <Para lang="en">{lesson.explanation}</Para>
          </KSection>
          <KSection title={t(S.journeyReflection)} hue="lotus">
            <Para lang="en" italic>
              {lesson.reflection}
            </Para>
            <LinkButton
              label={t(S.journeyWrite)}
              icon="create-outline"
              onPress={() =>
                router.push({ pathname: '/journal/edit', params: { id: lesson.scriptureId, chapter: String(lesson.chapter), verse: lesson.verse } })
              }
            />
          </KSection>
          {lesson.activity ? (
            <KSection title={t(S.journeyActivity)} hue="tulsi">
              <Para lang="en">{lesson.activity}</Para>
            </KSection>
          ) : null}

          {allDone && last ? (
            <Card style={{ borderColor: `${hues.tulsi}66` }}>
              <Para>{t(S.journeyComplete)}</Para>
            </Card>
          ) : (
            <PrimaryButton label={t(last ? S.journeyFinish : S.journeyFinishNext)} icon={last ? 'ribbon-outline' : 'arrow-forward'} onPress={finishAndNext} />
          )}
        </Animated.View>

        {journey.sources.length ? (
          <KSection title={t(S.kSources)} hue="gold">
            {journey.sources.map((s, i) => (
              <Para key={i} muted size={TYPE.footnote} lang="en">
                {s}
              </Para>
            ))}
            <Para muted size={TYPE.footnote} lang="en">
              {journey.curator}
            </Para>
          </KSection>
        ) : null}
      </ScrollView>
    </Backdrop>
  );
}

const styles = StyleSheet.create({
  hero: { borderWidth: 1, borderRadius: RADIUS.panel, padding: SPACE.xl, rowGap: SPACE.sm },
  note: { flexDirection: 'row', alignItems: 'flex-start', columnGap: SPACE.sm, borderRadius: RADIUS.control, padding: SPACE.md },
  steps: { flexDirection: 'row', flexWrap: 'wrap' },
  stepHit: { width: TOUCH, height: TOUCH, alignItems: 'center', justifyContent: 'center' },
  step: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
});
