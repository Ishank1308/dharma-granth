import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';

import { GroupRow } from '@/components/ui';
import type { Quiz } from '@/content/study';
import { S, type Msg } from '@/i18n';
import type { QuizResult } from '@/state/quiz-scores';
import { useAppState } from '@/state/app-state';
import { huesFor, quietFill, RADIUS, SPACE, TITLE_FONT_CAP, TOUCH, TYPE, type Palette } from '@/theme/themes';

export const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

/** One quiz in a grouped list: the course's icon, the title in the interface language, size, level and best score. */
export function QuizRow({ quiz, result, first, last }: { quiz: Quiz; result?: QuizResult; first?: boolean; last?: boolean }) {
  const { palette, lang } = useAppState();
  const t = (m: Msg) => m[lang];
  const title = lang === 'hi' && quiz.titleHi ? quiz.titleHi : quiz.title;
  const sub = lang === 'hi' && quiz.titleHi ? quiz.title : undefined;
  const perfect = result && result.best === result.total;
  const meta = `${t(S.quizQuestions(quiz.questions.length))} · ${t(S.quizDifficulty(quiz.difficulty))}`;
  return (
    <GroupRow
      first={first}
      last={last}
      inset={72}
      accessibilityLabel={[title, meta, result ? t(S.quizBest(result.best, result.total)) : ''].filter(Boolean).join(', ')}
      onPress={() => router.push({ pathname: '/quiz/[id]', params: { id: quiz.id } })}>
      <View style={[styles.rowIcon, { backgroundColor: quietFill(palette) }]}>
        {quiz.course?.icon ? (
          <Text allowFontScaling={false} style={{ fontSize: 22 }}>
            {quiz.course.icon}
          </Text>
        ) : (
          <Ionicons name="help-circle-outline" size={24} color={palette.accent} />
        )}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: palette.text, fontSize: TYPE.body, fontWeight: '600' }}>{title}</Text>
        {sub ? <Text style={{ color: palette.muted, fontSize: TYPE.footnote }}>{sub}</Text> : null}
        <Text style={{ color: palette.muted, fontSize: TYPE.footnote, marginTop: 2 }}>{meta}</Text>
      </View>
      {result ? <BestBadge result={result} perfect={!!perfect} palette={palette} label={t(S.quizBest(result.best, result.total))} /> : null}
      <Ionicons name="chevron-forward" size={18} color={palette.muted} />
    </GroupRow>
  );
}

function BestBadge({ result, perfect, palette, label }: { result: QuizResult; perfect: boolean; palette: Palette; label: string }) {
  const hues = huesFor(palette);
  const color = perfect ? hues.gold : palette.muted;
  return (
    <View style={[styles.best, { borderColor: color }]} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {perfect ? <Ionicons name="star" size={11} color={color} /> : null}
      <Text allowFontScaling={false} style={{ color, fontSize: TYPE.caption, fontWeight: '700' }}>
        {perfect ? `${result.best}/${result.total}` : label}
      </Text>
    </View>
  );
}

export type OptionState = 'idle' | 'right' | 'wrong' | 'reveal' | 'dim';

/**
 * One answer. Once the reader answers, the right option pops and turns tulsi green with a tick; a wrong
 * pick shakes and turns vermilion, and the right one is shown beside it. Native-driver transforms only,
 * so it stays smooth on budget phones; with "Remove animations" on it changes colour without moving.
 */
export function OptionButton({
  index,
  text,
  state,
  disabled,
  reduce,
  onPress,
}: {
  index: number;
  text: string;
  state: OptionState;
  disabled: boolean;
  reduce: boolean;
  onPress: () => void;
}) {
  const { palette, lang } = useAppState();
  const hues = huesFor(palette);
  const scale = useState(() => new Animated.Value(1))[0];
  const shake = useState(() => new Animated.Value(0))[0];
  const mark = useState(() => new Animated.Value(state === 'right' || state === 'wrong' || state === 'reveal' ? 1 : 0))[0];

  useEffect(() => {
    if (state === 'idle' || state === 'dim') {
      mark.setValue(0);
      return;
    }
    if (reduce) {
      mark.setValue(1);
      return;
    }
    mark.setValue(0);
    Animated.spring(mark, { toValue: 1, friction: 5, tension: 160, useNativeDriver: true }).start();
    if (state === 'right') {
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.05, duration: 120, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, friction: 4, tension: 140, useNativeDriver: true }),
      ]).start();
    } else if (state === 'wrong') {
      Animated.sequence(
        [-10, 10, -7, 7, -3, 0].map((x) => Animated.timing(shake, { toValue: x, duration: 55, easing: Easing.linear, useNativeDriver: true })),
      ).start();
    }
  }, [state, reduce, mark, scale, shake]);

  const tone =
    state === 'right' || state === 'reveal'
      ? { border: hues.tulsi, fill: palette.dark ? 'rgba(74,222,128,0.16)' : 'rgba(21,128,61,0.10)', icon: 'checkmark' as const }
      : state === 'wrong'
        ? { border: hues.vermilion, fill: palette.dark ? 'rgba(251,113,133,0.16)' : 'rgba(190,18,60,0.08)', icon: 'close' as const }
        : null;
  const stateLabel = state === 'right' || state === 'reveal' ? S.quizOptionRight : state === 'wrong' ? S.quizOptionPicked : null;

  return (
    <Animated.View style={{ transform: [{ scale }, { translateX: shake }], opacity: state === 'dim' ? 0.5 : 1 }}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled, selected: state === 'right' || state === 'wrong' }}
        accessibilityLabel={`${S.quizOptionA11y(LETTERS[index], text)[lang]}${stateLabel ? `, ${stateLabel[lang]}` : ''}`}
        disabled={disabled}
        onPress={onPress}
        style={({ pressed }) => [
          styles.option,
          {
            backgroundColor: tone?.fill ?? palette.glassStrong,
            borderColor: tone?.border ?? palette.rim,
            borderTopColor: tone?.border ?? palette.rimTop,
            borderWidth: tone ? 1.5 : 1,
          },
          pressed && !disabled && { transform: [{ scale: 0.98 }], backgroundColor: quietFill(palette) },
        ]}>
        <View style={[styles.letter, { backgroundColor: tone ? tone.border : quietFill(palette) }]}>
          {tone ? (
            <Animated.View style={{ transform: [{ scale: mark }] }}>
              <Ionicons name={tone.icon} size={18} color="#ffffff" />
            </Animated.View>
          ) : (
            <Text allowFontScaling={false} style={{ color: palette.textSecondary, fontSize: TYPE.subhead, fontWeight: '700' }}>
              {LETTERS[index]}
            </Text>
          )}
        </View>
        <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ flex: 1, color: palette.text, fontSize: TYPE.callout, lineHeight: TYPE.callout * 1.4, fontWeight: '500' }}>
          {text}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

/**
 * The finish: a score disc that counts up, and for a pass a ring of marigold, lotus and gold petals that
 * opens out once and settles. Still, without the burst, when animations are off.
 */
export function ScoreBurst({ score, total, celebrate, reduce }: { score: number; total: number; celebrate: boolean; reduce: boolean }) {
  const { palette } = useAppState();
  const hues = huesFor(palette);
  const [shown, setShown] = useState(reduce ? score : 0);
  const count = useState(() => new Animated.Value(0))[0];
  const pop = useState(() => new Animated.Value(reduce ? 1 : 0.6))[0];
  const burst = useState(() => new Animated.Value(0))[0];

  useEffect(() => {
    if (reduce) {
      pop.setValue(1);
      return;
    }
    const id = count.addListener(({ value }) => setShown(Math.round(value)));
    Animated.parallel([
      Animated.spring(pop, { toValue: 1, friction: 5, tension: 90, useNativeDriver: true }),
      Animated.timing(count, { toValue: score, duration: 300 + score * 90, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
      celebrate
        ? Animated.timing(burst, { toValue: 1, duration: 1100, delay: 150, easing: Easing.out(Easing.cubic), useNativeDriver: true })
        : Animated.delay(0),
    ]).start();
    return () => count.removeListener(id);
  }, [score, celebrate, reduce, count, pop, burst]);

  const colours = [hues.saffron, hues.lotus, hues.gold, hues.peacock, hues.vermilion, hues.indigo];
  const petals = Array.from({ length: 14 }, (_, i) => i);
  const ring = celebrate ? hues.gold : palette.accent;

  return (
    <View style={styles.burstWrap} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
      {celebrate && !reduce
        ? petals.map((i) => {
            const angle = (i / petals.length) * Math.PI * 2;
            const dist = 92 + (i % 3) * 14;
            return (
              <Animated.View
                key={i}
                pointerEvents="none"
                style={[
                  styles.petal,
                  {
                    backgroundColor: colours[i % colours.length],
                    opacity: burst.interpolate({ inputRange: [0, 0.15, 0.7, 1], outputRange: [0, 1, 0.9, 0] }),
                    transform: [
                      { translateX: burst.interpolate({ inputRange: [0, 1], outputRange: [0, Math.cos(angle) * dist] }) },
                      { translateY: burst.interpolate({ inputRange: [0, 1], outputRange: [0, Math.sin(angle) * dist + 18] }) },
                      { rotate: burst.interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${(i % 2 ? 1 : -1) * (160 + i * 12)}deg`] }) },
                      { scale: burst.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0.3, 1, 0.7] }) },
                    ],
                  },
                ]}
              />
            );
          })
        : null}
      <Animated.View
        style={[
          styles.disc,
          { borderColor: ring, backgroundColor: palette.glassStrong, transform: [{ scale: pop }] },
          !palette.lite && { boxShadow: `0 10px 30px ${celebrate ? 'rgba(234,179,8,0.30)' : 'rgba(0,0,0,0.12)'}` },
        ]}>
        <Text allowFontScaling={false} style={{ color: palette.text, fontSize: 44, fontWeight: '800', lineHeight: 52 }}>
          {reduce ? score : shown}
        </Text>
        <Text allowFontScaling={false} style={{ color: palette.muted, fontSize: TYPE.subhead, fontWeight: '600' }}>
          / {total}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  rowIcon: { width: 44, height: 44, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  best: { flexDirection: 'row', alignItems: 'center', columnGap: 3, borderWidth: 1, borderRadius: RADIUS.pill, paddingHorizontal: 8, paddingVertical: 3 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: SPACE.md,
    minHeight: TOUCH + 8,
    paddingVertical: SPACE.md,
    paddingHorizontal: SPACE.md,
    borderRadius: RADIUS.row,
  },
  letter: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  burstWrap: { width: 240, height: 200, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' },
  petal: { position: 'absolute', width: 10, height: 18, borderRadius: 6 },
  disc: { width: 136, height: 136, borderRadius: 68, borderWidth: 3, alignItems: 'center', justifyContent: 'center' },
});
