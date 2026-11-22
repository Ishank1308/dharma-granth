import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { KSection, Para, VerseBlock } from '@/components/knowledge-ui';
import { LinkButton } from '@/components/learn-ui';
import { Backdrop, Chip, LargeHeader } from '@/components/ui';
import { dailyAt, learn, todayDailyIndex } from '@/content/learn';
import { S, useI18n } from '@/i18n';
import { useMotion } from '@/motion/use-motion';
import { usePrefs } from '@/state/app-state';
import { barClearance, huesFor, quietFill, RADIUS, SPACE, TOUCH, TYPE, UI_FONT_CAP } from '@/theme/themes';

export { ErrorBoundary } from '@/components/error-boundary';

/**
 * The daily dharma journey, as the website's /daily: today's verse (the same one the website shows today,
 * counted on the Indian calendar), whole, with its meaning word by word, the teaching for today, a question
 * to sit with and one small practice. The arrows step through the other days' verses.
 */
export default function DailyScreen() {
  const insets = useSafeAreaInsets();
  const { palette } = usePrefs();
  const { t, lang } = useI18n();
  const { animate } = useMotion();
  const hues = huesFor(palette);
  const today = todayDailyIndex();
  const total = learn('daily').items.length;
  const [index, setIndex] = useState(today);
  const d = dailyAt(index);
  const p = (m: { en: string; hi: string }) => m[lang] || m.en;
  const shown = ((index % total) + total) % total;

  return (
    <Backdrop quiet>
      <Stack.Screen options={{ title: '', headerTransparent: true, headerStyle: { backgroundColor: 'transparent' } }} />
      <ScrollView
        style={{ backgroundColor: 'transparent' }}
        contentContainerStyle={{ paddingTop: insets.top + 24, paddingHorizontal: SPACE.lg, paddingBottom: barClearance(insets.bottom), rowGap: SPACE.lg }}>
        <LargeHeader title={S.learnDailyTitle} eyebrow={S.learnTitle} subtitle={t(S.learnDailyRow)} />

        <View style={styles.nav}>
          <Pressable onPress={() => setIndex(index - 1)} accessibilityRole="button" accessibilityLabel={t(S.dailyPrevDay)} style={[styles.round, { backgroundColor: quietFill(palette) }]}>
            <Ionicons name="chevron-back" size={20} color={palette.text} />
          </Pressable>
          <View style={{ flex: 1, alignItems: 'center' }} accessibilityLiveRegion="polite">
            <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: shown === today ? hues.gold : palette.muted, fontSize: TYPE.footnote, fontWeight: '700' }}>
              {shown === today ? t(S.dailyToday) : t(S.dailyOf(shown + 1, total))}
            </Text>
            <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.subhead, fontWeight: '600', textAlign: 'center' }}>
              {d.theme}
            </Text>
          </View>
          <Pressable onPress={() => setIndex(index + 1)} accessibilityRole="button" accessibilityLabel={t(S.dailyNextDay)} style={[styles.round, { backgroundColor: quietFill(palette) }]}>
            <Ionicons name="chevron-forward" size={20} color={palette.text} />
          </Pressable>
        </View>
        {shown !== today ? (
          <View style={{ alignItems: 'center' }}>
            <Chip label={t(S.dailyBackToday)} onPress={() => setIndex(today)} />
          </View>
        ) : null}

        <Animated.View key={d.id} entering={animate ? FadeIn.duration(220) : undefined} style={{ rowGap: SPACE.lg }}>
          <VerseBlock
            sanskrit={d.sanskrit}
            translit={d.translit}
            reference={`${p(d.scripture)} ${d.chapter}.${d.verse}`}
            hue="gold"
            target={{ id: d.scriptureId, chapter: d.chapter, verse: d.verse }}>
            {d.meter ? (
              <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.caption }}>
                {`${t(S.dailyMeter)}: ${d.meter}`}
              </Text>
            ) : null}
          </VerseBlock>

          <KSection title={t(S.dailyMeaning)} hue="saffron">
            <Para lang="hi">{d.meaning.hi}</Para>
            <Para lang="en">{d.meaning.en}</Para>
          </KSection>

          {d.words.length ? (
            <KSection title={t(S.dailyWords)} hue="indigo">
              {d.words.map((w, i) => (
                <View key={i} style={[styles.word, { backgroundColor: quietFill(palette) }]}>
                  <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: hues.indigo, fontSize: TYPE.callout, fontWeight: '700' }}>
                    {w.word}
                  </Text>
                  <Para size={TYPE.subhead} lang="en">
                    {w.meaning}
                  </Para>
                </View>
              ))}
            </KSection>
          ) : null}

          <KSection title={t(S.dailyTeaching)} hue="tulsi">
            <Para lang={lang}>{p(d.teaching)}</Para>
          </KSection>

          <KSection title={t(S.dailyReflect)} hue="lotus">
            <Para lang={lang} italic>
              {p(d.reflection)}
            </Para>
            <LinkButton
              label={t(S.journeyWrite)}
              icon="create-outline"
              onPress={() => router.push({ pathname: '/journal/edit', params: { id: d.scriptureId, chapter: String(d.chapter), verse: d.verse } })}
            />
          </KSection>

          <KSection title={t(S.dailyChallenge)} hue="gold">
            <Para lang={lang}>{p(d.challenge)}</Para>
          </KSection>
        </Animated.View>
      </ScrollView>
    </Backdrop>
  );
}

const styles = StyleSheet.create({
  nav: { flexDirection: 'row', alignItems: 'center', columnGap: SPACE.md },
  round: { width: TOUCH, height: TOUCH, borderRadius: TOUCH / 2, alignItems: 'center', justifyContent: 'center' },
  word: { borderRadius: RADIUS.control, padding: SPACE.md, rowGap: 2 },
});
