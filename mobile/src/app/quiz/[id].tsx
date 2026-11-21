import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, Pressable, ScrollView, type ScrollViewInstance, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { OptionButton, ScoreBurst, type OptionState } from '@/components/quiz';
import { accentFill, Backdrop, glass, Muted } from '@/components/ui';
import { getQuiz } from '@/content/study';
import { S, type Msg } from '@/i18n';
import { haptics } from '@/lib/haptics';
import { useReducedMotion } from '@/lib/use-reduced-motion';
import { useAppState } from '@/state/app-state';
import { recordQuizResult, useQuizResults } from '@/state/quiz-scores';
import { BAR_GAP, BAR_HEIGHT, huesFor, quietFill, RADIUS, SPACE, TITLE_FONT_CAP, TOUCH, TYPE } from '@/theme/themes';

/** A pass, as on the website's QuizRunner: 70% or more. */
const PASS = 0.7;

export default function QuizScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const quiz = getQuiz(String(id));
  const insets = useSafeAreaInsets();
  const { palette, lang } = useAppState();
  const t = (m: Msg) => m[lang];
  const hues = huesFor(palette);
  const reduce = useReducedMotion();
  const results = useQuizResults();

  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [streak, setStreak] = useState(0);
  const [finished, setFinished] = useState(false);
  const [newBest, setNewBest] = useState(false);
  const scroller = useRef<ScrollViewInstance>(null);

  // Motion: the question card slides in from the right, the explanation rises in once answered, and
  // the progress bar fills as each question is answered.
  const enter = useState(() => new Animated.Value(1))[0];
  const reveal = useState(() => new Animated.Value(0))[0];
  const progress = useState(() => new Animated.Value(0))[0];

  const total = quiz?.questions.length ?? 0;
  const question = quiz?.questions[index];
  const score = answers.reduce((n, a, i) => n + (quiz && a === quiz.questions[i].answer ? 1 : 0), 0);

  useEffect(() => {
    const done = (index + (picked != null ? 1 : 0)) / Math.max(total, 1);
    if (reduce) progress.setValue(done);
    else Animated.timing(progress, { toValue: done, duration: 420, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
  }, [index, picked, total, reduce, progress]);

  if (!quiz || !question) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: '' }} />
        <Muted>{t(S.quizNotFound)}</Muted>
      </View>
    );
  }

  const title = lang === 'hi' && quiz.titleHi ? quiz.titleHi : quiz.title;

  const answer = (i: number) => {
    if (picked != null) return;
    const right = i === question.answer;
    setPicked(i);
    setAnswers((a) => [...a, i]);
    setStreak((s) => (right ? s + 1 : 0));
    if (right) haptics.correct();
    else haptics.wrong();
    AccessibilityInfo.announceForAccessibility(
      `${right ? t(S.quizCheer(index)) : `${t(S.quizNotQuite)}. ${t(S.quizRightAnswer(question.options[question.answer]))}`}. ${question.why}`,
    );
    if (reduce) reveal.setValue(1);
    else {
      reveal.setValue(0);
      Animated.timing(reveal, { toValue: 1, duration: 360, delay: right ? 120 : 300, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
    }
    // Bring the explanation into view once it has laid out.
    setTimeout(() => scroller.current?.scrollToEnd({ animated: !reduce }), right ? 200 : 380);
  };

  const next = () => {
    haptics.tap();
    if (index < total - 1) {
      setIndex(index + 1);
      setPicked(null);
      reveal.setValue(0);
      scroller.current?.scrollTo({ y: 0, animated: false });
      if (!reduce) {
        enter.setValue(0);
        Animated.spring(enter, { toValue: 1, friction: 9, tension: 70, useNativeDriver: true }).start();
      }
      return;
    }
    const prev = results[quiz.id];
    setNewBest(!!prev && prev.total === total && score > prev.best);
    recordQuizResult(quiz.id, score, total);
    if (score / total >= PASS) haptics.celebrate();
    setFinished(true);
    scroller.current?.scrollTo({ y: 0, animated: false });
  };

  const restart = () => {
    haptics.tap();
    setIndex(0);
    setPicked(null);
    setAnswers([]);
    setStreak(0);
    setFinished(false);
    setNewBest(false);
    reveal.setValue(0);
    progress.setValue(0);
  };

  const stateOf = (i: number): OptionState => {
    if (picked == null) return 'idle';
    if (i === question.answer) return picked === i ? 'right' : 'reveal';
    if (i === picked) return 'wrong';
    return 'dim';
  };

  const right = picked === question.answer;

  if (finished) {
    const ratio = score / total;
    const tier = ratio === 1 ? 'perfect' : ratio >= PASS ? 'passed' : 'keep';
    return (
      <Backdrop>
        <>
          <Stack.Screen options={{ title }} />
          <ScrollView
            ref={scroller}
            style={{ backgroundColor: 'transparent' }}
            contentContainerStyle={{ padding: SPACE.lg, paddingBottom: insets.bottom + SPACE.xxl * 2, rowGap: SPACE.lg }}>
            <View style={{ alignItems: 'center', rowGap: SPACE.sm }}>
              <ScoreBurst score={score} total={total} celebrate={tier !== 'keep'} reduce={reduce} />
              <Text accessibilityRole="header" maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.title1, fontWeight: '800', textAlign: 'center' }}>
                {t(tier === 'perfect' ? S.quizPerfect : tier === 'passed' ? S.quizPassed : S.quizKeepGoing)}
              </Text>
              <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.textSecondary, fontSize: TYPE.callout, fontWeight: '600' }}>
                {t(S.quizScore(score, total))}
              </Text>
              <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.subhead, textAlign: 'center', paddingHorizontal: SPACE.lg }}>
                {t(tier === 'perfect' ? S.quizPerfectLine : tier === 'passed' ? S.quizPassedLine : S.quizKeepGoingLine)}
              </Text>
              {newBest ? (
                <View style={[styles.chip, { borderColor: hues.gold }]}>
                  <Ionicons name="trophy" size={14} color={hues.gold} />
                  <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: hues.gold, fontSize: TYPE.footnote, fontWeight: '700' }}>
                    {t(S.quizNewBest)}
                  </Text>
                </View>
              ) : null}
            </View>
            <View style={styles.actions}>
              <Pressable
                accessibilityRole="button"
                onPress={restart}
                style={({ pressed }) => [styles.action, accentFill(palette), pressed && { transform: [{ scale: 0.97 }] }]}>
                <Ionicons name="refresh" size={18} color={palette.onAccent} />
                <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.onAccent, fontSize: TYPE.callout, fontWeight: '700' }}>
                  {t(S.quizRetry)}
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={() => (router.canGoBack() ? router.back() : router.replace('/quiz'))}
                style={({ pressed }) => [styles.action, glass(palette, true), pressed && { transform: [{ scale: 0.97 }] }]}>
                <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.accent, fontSize: TYPE.callout, fontWeight: '700' }}>
                  {t(S.quizAllQuizzes)}
                </Text>
              </Pressable>
            </View>

            {/* Every question again, with the reader's answer and the right one. */}
            <Text accessibilityRole="header" maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.title3, fontWeight: '700', marginTop: SPACE.sm }}>
              {t(S.quizReview)}
            </Text>
            {quiz.questions.map((q, i) => {
              const ok = answers[i] === q.answer;
              return (
                <View key={q.id} style={[styles.review, glass(palette)]}>
                  <View style={{ flexDirection: 'row', columnGap: SPACE.sm, alignItems: 'flex-start' }}>
                    <Ionicons name={ok ? 'checkmark-circle' : 'close-circle'} size={22} color={ok ? hues.tulsi : hues.vermilion} />
                    <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ flex: 1, color: palette.text, fontSize: TYPE.callout, fontWeight: '600', lineHeight: TYPE.callout * 1.4 }}>
                      {q.q}
                    </Text>
                  </View>
                  {!ok && answers[i] != null ? (
                    <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={[styles.reviewLine, { color: hues.vermilion, textDecorationLine: 'line-through' }]}>
                      {q.options[answers[i]]}
                    </Text>
                  ) : null}
                  <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={[styles.reviewLine, { color: hues.tulsi, fontWeight: '600' }]}>
                    {q.options[q.answer]}
                  </Text>
                  <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={[styles.reviewLine, { color: palette.muted }]}>
                    {q.why}
                  </Text>
                </View>
              );
            })}
          </ScrollView>
        </>
      </Backdrop>
    );
  }

  return (
    <Backdrop>
      <>
        <Stack.Screen options={{ title }} />
        <ScrollView
          ref={scroller}
          style={{ backgroundColor: 'transparent' }}
          contentContainerStyle={{ padding: SPACE.lg, paddingBottom: insets.bottom + BAR_HEIGHT + BAR_GAP * 3 + SPACE.lg, rowGap: SPACE.md }}>
          {/* Where you are: a bar that fills as you answer, the count, and a streak once two land in a row. */}
          <View style={{ rowGap: SPACE.sm }}>
            <View style={styles.statusRow}>
              <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.footnote, fontWeight: '700' }}>
                {t(S.quizQuestionOf(index + 1, total))}
              </Text>
              {streak >= 2 ? (
                <View style={[styles.chip, { borderColor: hues.saffron }]}>
                  <Ionicons name="flame" size={13} color={hues.saffron} />
                  <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: hues.saffron, fontSize: TYPE.caption, fontWeight: '700' }}>
                    {t(S.quizStreak(streak))}
                  </Text>
                </View>
              ) : null}
            </View>
            <View
              style={[styles.track, { backgroundColor: quietFill(palette) }]}
              accessibilityRole="progressbar"
              accessibilityValue={{ min: 0, max: total, now: index + (picked != null ? 1 : 0) }}>
              <Animated.View
                style={[
                  styles.fill,
                  accentFill(palette),
                  { borderWidth: 0, width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) },
                ]}
              />
            </View>
          </View>

          {lang === 'hi' ? <Muted>{t(S.quizEnglishNote)}</Muted> : null}

          <Animated.View
            style={{
              rowGap: SPACE.md,
              opacity: enter,
              transform: [{ translateX: enter.interpolate({ inputRange: [0, 1], outputRange: [36, 0] }) }],
            }}>
            <View style={[styles.questionCard, glass(palette, true)]}>
              <Text accessibilityRole="header" maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.title3 + 1, lineHeight: (TYPE.title3 + 1) * 1.35, fontWeight: '700' }}>
                {question.q}
              </Text>
            </View>
            {question.options.map((o, i) => (
              <OptionButton key={`${question.id}-${i}`} index={i} text={o} state={stateOf(i)} disabled={picked != null} reduce={reduce} onPress={() => answer(i)} />
            ))}
          </Animated.View>

          {picked != null ? (
            <Animated.View
              style={[
                styles.feedback,
                glass(palette),
                { borderLeftWidth: 4, borderLeftColor: right ? hues.tulsi : hues.vermilion },
                { opacity: reveal, transform: [{ translateY: reveal.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) }] },
              ]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: SPACE.sm }}>
                <Ionicons name={right ? 'sparkles' : 'bulb-outline'} size={20} color={right ? hues.tulsi : hues.gold} />
                <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: right ? hues.tulsi : palette.text, fontSize: TYPE.body, fontWeight: '800' }}>
                  {t(right ? S.quizCheer(index) : S.quizNotQuite)}
                </Text>
              </View>
              {!right ? (
                <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.subhead, fontWeight: '600' }}>
                  {t(S.quizRightAnswer(question.options[question.answer]))}
                </Text>
              ) : null}
              <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.textSecondary, fontSize: TYPE.subhead, lineHeight: TYPE.subhead * 1.5 }}>
                {question.why}
              </Text>
            </Animated.View>
          ) : null}
        </ScrollView>

        {picked != null ? (
          // Next, in the thumb zone, as the book page's Continue button.
          <Animated.View
            style={[
              styles.nextWrap,
              { bottom: Math.max(insets.bottom, SPACE.sm) + BAR_GAP, opacity: reveal, transform: [{ translateY: reveal.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] },
            ]}>
            <Pressable
              accessibilityRole="button"
              onPress={next}
              style={({ pressed }) => [styles.next, accentFill(palette), pressed && { transform: [{ scale: 0.97 }] }]}>
              <Text maxFontSizeMultiplier={1.4} style={{ color: palette.onAccent, fontSize: TYPE.body, fontWeight: '700' }}>
                {t(index < total - 1 ? S.quizNext : S.quizSeeScore)}
              </Text>
              <Ionicons name={index < total - 1 ? 'arrow-forward' : 'trophy-outline'} size={18} color={palette.onAccent} />
            </Pressable>
          </Animated.View>
        ) : null}
      </>
    </Backdrop>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACE.xl },
  statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 26 },
  chip: { flexDirection: 'row', alignItems: 'center', columnGap: 4, borderWidth: 1, borderRadius: RADIUS.pill, paddingHorizontal: 10, paddingVertical: 3 },
  track: { height: 6, borderRadius: 3, overflow: 'hidden' },
  fill: { height: 6, borderRadius: 3 },
  questionCard: { borderRadius: RADIUS.card, padding: SPACE.lg + 2 },
  feedback: { borderRadius: RADIUS.row, padding: SPACE.lg, rowGap: SPACE.sm },
  nextWrap: { position: 'absolute', left: SPACE.lg, right: SPACE.lg },
  next: {
    height: BAR_HEIGHT - 4,
    borderRadius: RADIUS.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: SPACE.sm,
  },
  actions: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: SPACE.sm },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: SPACE.sm,
    minHeight: TOUCH,
    paddingHorizontal: SPACE.xl,
    borderRadius: RADIUS.pill,
  },
  review: { borderRadius: RADIUS.row, padding: SPACE.lg, rowGap: 6 },
  reviewLine: { fontSize: TYPE.subhead, lineHeight: TYPE.subhead * 1.45, marginLeft: 30 },
});
