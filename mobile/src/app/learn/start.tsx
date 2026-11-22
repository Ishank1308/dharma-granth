import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, ScrollView, type ScrollViewInstance, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Para } from '@/components/knowledge-ui';
import { PrimaryButton } from '@/components/learn-ui';
import { Backdrop, Card, Chip, LargeHeader } from '@/components/ui';
import { appHref, learn, recommendationsFor } from '@/content/learn';
import { S, useI18n } from '@/i18n';
import { useMotion } from '@/motion/use-motion';
import { usePrefs } from '@/state/app-state';
import { useLearn } from '@/state/learn';
import { barClearance, huesFor, RADIUS, SPACE, TITLE_FONT_CAP, TYPE, UI_FONT_CAP, type Hues } from '@/theme/themes';

export { ErrorBoundary } from '@/components/error-boundary';

const REC_HUES: (keyof Hues)[] = ['saffron', 'indigo', 'peacock', 'gold', 'lotus'];

/**
 * Discover your path, as the website's /learn/start: five questions as choice chips, then the website's own
 * recommendations (a reading journey, a text, a concept, a daily practice and another path), each opening
 * the app screen that shows it. The answers are kept on the phone so the path is there next time.
 */
export default function StartScreen() {
  const insets = useSafeAreaInsets();
  const { palette } = usePrefs();
  const { t, lang } = useI18n();
  const { animate } = useMotion();
  const hues = huesFor(palette);
  const { progress, setDiscover } = useLearn();
  const { questions } = learn('discover');
  const [draft, setDraft] = useState<Record<string, string>>(() => progress.discover ?? {});
  const [shown, setShown] = useState<Record<string, string> | null>(() => progress.discover);
  const scroll = useRef<ScrollViewInstance>(null);
  const resultY = useRef(0);

  // The saved answers arrive a moment after the screen opens.
  const saved = progress.discover;
  const [seen, setSeen] = useState(saved);
  if (saved !== seen) {
    setSeen(saved);
    if (saved && !shown) {
      setDraft(saved);
      setShown(saved);
    }
  }

  const complete = questions.every((q) => draft[q.key]);
  const result = shown ? recommendationsFor(shown) : null;
  const p = (m: { en: string; hi: string }) => m[lang] || m.en;

  return (
    <Backdrop quiet>
      <Stack.Screen options={{ title: '', headerTransparent: true, headerStyle: { backgroundColor: 'transparent' } }} />
      <ScrollView
        ref={scroll}
        style={{ backgroundColor: 'transparent' }}
        contentContainerStyle={{ paddingTop: insets.top + 24, paddingHorizontal: SPACE.lg, paddingBottom: barClearance(insets.bottom), rowGap: SPACE.lg }}>
        <LargeHeader title={S.learnStartTitle} eyebrow={S.learnTitle} subtitle={t(S.startIntro)} />

        {questions.map((q, i) => (
          <Card key={q.key} style={{ rowGap: SPACE.md }}>
            <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.caption, fontWeight: '700' }}>
              {t(S.startQuestion(i + 1, questions.length))}
            </Text>
            <Text accessibilityRole="header" maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.title3, fontWeight: '700' }}>
              {p(q.question)}
            </Text>
            <View accessibilityRole="radiogroup" accessibilityLabel={p(q.question)} style={styles.chips}>
              {q.options.map((o) => (
                <Chip
                  key={o.value}
                  label={o.icon ? `${o.icon}  ${p(o.label)}` : p(o.label)}
                  accessibilityLabel={p(o.label)}
                  active={draft[q.key] === o.value}
                  onPress={() => setDraft((d) => ({ ...d, [q.key]: o.value }))}
                />
              ))}
            </View>
          </Card>
        ))}

        <PrimaryButton
          label={t(complete ? S.startShow : S.startAnswerAll)}
          icon="compass-outline"
          disabled={!complete}
          onPress={() => {
            setShown(draft);
            setDiscover(draft);
            setTimeout(() => scroll.current?.scrollTo({ y: Math.max(0, resultY.current - 80), animated: animate }), 60);
          }}
        />

        {result ? (
          <View
            onLayout={(e) => {
              resultY.current = e.nativeEvent.layout.y;
            }}
            style={{ rowGap: SPACE.md }}>
            <Text accessibilityRole="header" maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.title2, fontWeight: '800' }}>
              {t(S.startResult)}
            </Text>
            <Para muted size={TYPE.subhead} lang="en">
              {result.summary}
            </Para>
            {result.recs.map((r, i) => {
              const href = appHref(r.href);
              const color = hues[REC_HUES[i % REC_HUES.length]];
              const body = (
                <Card style={{ rowGap: SPACE.xs, borderColor: `${color}55` }}>
                  <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color, fontSize: TYPE.caption, fontWeight: '700' }}>
                    {lang === 'hi' ? r.kindHi : r.kind}
                  </Text>
                  <View style={styles.recHead}>
                    <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ flex: 1, color: palette.text, fontSize: TYPE.body, fontWeight: '700' }}>
                      {p(r.title)}
                    </Text>
                    {href ? <Ionicons name="chevron-forward" size={18} color={palette.muted} /> : null}
                  </View>
                  <Para size={TYPE.subhead} lang="en">
                    {r.summary}
                  </Para>
                  <Para muted size={TYPE.footnote} lang="en">
                    {r.reason}
                  </Para>
                </Card>
              );
              return (
                <Animated.View key={`${r.id}-${i}`} entering={animate ? FadeInDown.delay(i * 60).duration(260) : undefined}>
                  {href ? (
                    <Pressable
                      accessibilityRole="link"
                      accessibilityLabel={`${lang === 'hi' ? r.kindHi : r.kind}: ${p(r.title)}`}
                      onPress={() => router.push(href)}
                      style={({ pressed }) => pressed && { transform: [{ scale: 0.985 }] }}>
                      {body}
                    </Pressable>
                  ) : (
                    body
                  )}
                </Animated.View>
              );
            })}
            <View style={{ alignItems: 'center' }}>
              <Chip
                label={t(S.startAgain)}
                onPress={() => {
                  setDraft({});
                  setShown(null);
                  setDiscover(null);
                  scroll.current?.scrollTo({ y: 0, animated: animate });
                }}
              />
            </View>
          </View>
        ) : null}
      </ScrollView>
    </Backdrop>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACE.sm },
  recHead: { flexDirection: 'row', alignItems: 'center', columnGap: SPACE.sm, borderRadius: RADIUS.control },
});
