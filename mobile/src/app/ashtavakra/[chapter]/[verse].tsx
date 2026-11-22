import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LayerLabel, Prose, Shloka, StudySection, SubLabel } from '@/components/ashtavakra-ui';
import { Backdrop, Card, Muted } from '@/components/ui';
import { loadAshtavakraChapter, speakerName, verseInChapter } from '@/content/ashtavakra';
import { S, useI18n } from '@/i18n';
import { usePrefs } from '@/state/app-state';
import { fontCap, huesFor, RADIUS, SPACE, TOUCH, TYPE } from '@/theme/themes';

/**
 * One verse with every layer the website gives it, in the same order: श्लोक → अर्थ → व्याख्या →
 * आधुनिक संदर्भ → चिंतन (lib/sacred-reading-order.ts).
 */
export default function AshtavakraVerseScreen() {
  const params = useLocalSearchParams<{ chapter: string; verse: string }>();
  const n = Number(params.chapter);
  const insets = useSafeAreaInsets();
  const { palette, settings } = usePrefs();
  const { t } = useI18n();
  const hues = huesFor(palette);
  const chapter = useMemo(() => loadAshtavakraChapter(n), [n]);
  const index = chapter?.verses.findIndex((v) => verseInChapter(v.verseNumber) === String(params.verse)) ?? -1;
  const v = index >= 0 ? chapter!.verses[index] : undefined;
  const scale = settings.textScale;
  const cap = fontCap(scale);

  if (!chapter || !v) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: t(S.notFoundTitle) }} />
        <Muted>{t(S.scriptureNotFound)}</Muted>
      </View>
    );
  }

  const prev = chapter.verses[index - 1];
  const next = chapter.verses[index + 1];
  const go = (verseNumber: string) =>
    router.replace({ pathname: '/ashtavakra/[chapter]/[verse]', params: { chapter: String(n), verse: verseInChapter(verseNumber) } });
  const speaker = speakerName(v.speaker);

  return (
    <Backdrop quiet>
      <Stack.Screen options={{ title: `${t(S.ashtavakraTitle)} ${v.verseNumber}` }} />
      <ScrollView style={{ backgroundColor: 'transparent' }} contentContainerStyle={{ padding: SPACE.lg, paddingBottom: insets.bottom + SPACE.xxl * 2 }}>
        <Card strong style={{ marginBottom: SPACE.md }}>
          {speaker ? <Text style={{ color: palette.gold, fontSize: TYPE.footnote, fontWeight: '700', textAlign: 'center', marginBottom: SPACE.sm }}>{speaker} उवाच</Text> : null}
          <Shloka verse={v} size={TYPE.title2} />
          {v.iast ? (
            <Text selectable maxFontSizeMultiplier={cap} style={{ color: palette.textSecondary, fontStyle: 'italic', textAlign: 'center', fontSize: TYPE.subhead * scale, lineHeight: TYPE.subhead * scale * 1.5, marginTop: SPACE.sm }}>
              {v.iast}
            </Text>
          ) : null}
          {v.padaccheda ? (
            <View style={{ marginTop: SPACE.md }}>
              <SubLabel msg={S.padaccheda} />
              <Prose text={v.padaccheda} />
            </View>
          ) : null}
          {v.wordMeanings?.length ? (
            <View style={{ marginTop: SPACE.md }}>
              <SubLabel msg={S.labelWordMeaning} />
              <View style={[styles.words, { borderColor: palette.border }]}>
                {v.wordMeanings.map((w, i) => (
                  <View key={i} style={[styles.wordRow, i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: palette.border }]}>
                    <Text selectable maxFontSizeMultiplier={cap} style={{ flex: 1, color: palette.text, fontSize: TYPE.callout * scale, fontWeight: '600' }}>
                      {w.sanskrit}
                    </Text>
                    <Text selectable maxFontSizeMultiplier={cap} style={{ flex: 1.3, color: palette.textSecondary, fontSize: TYPE.callout * scale }}>
                      {w.hindi}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}
        </Card>

        <StudySection msg={S.sectionArth} hue={hues.peacock}>
          {v.verificationStatus === 'review-required' ? <LayerLabel msg={S.needsReview} hue={palette.muted} /> : null}
          {v.literalHindiMeaning ? (
            <View>
              <SubLabel msg={S.literalMeaning} />
              <Prose text={v.literalHindiMeaning} size={TYPE.body} />
            </View>
          ) : null}
          {v.englishTranslation ? (
            <View>
              <SubLabel msg={S.labelEnglish} />
              <Prose text={v.englishTranslation} size={TYPE.body} />
            </View>
          ) : null}
        </StudySection>

        <StudySection msg={S.sectionVyakhya} hue={hues.saffron}>
          {v.bookBasedHindiExplanation ? (
            <View>
              <SubLabel msg={S.bookCommentary} />
              <Muted style={{ fontSize: TYPE.caption, marginBottom: SPACE.xs }}>{t(S.bookCommentaryNote)}</Muted>
              <Prose text={v.bookBasedHindiExplanation} />
            </View>
          ) : null}
          {v.simpleHindiExplanation ? (
            <View>
              <SubLabel msg={S.inSimpleHindi} />
              <Prose text={v.simpleHindiExplanation} />
            </View>
          ) : null}
          {v.simpleEnglishExplanation ? (
            <View>
              <SubLabel msg={S.inSimpleEnglish} />
              <Prose text={v.simpleEnglishExplanation} />
            </View>
          ) : null}
          {v.philosophicalExplanationHindi ? (
            <View>
              <SubLabel msg={S.philosophical} />
              <Prose text={v.philosophicalExplanationHindi} />
            </View>
          ) : null}
          {v.analogyHindi ? (
            <View>
              <SubLabel msg={S.analogy} />
              <Prose text={v.analogyHindi} />
            </View>
          ) : null}
          {v.commonMisunderstandingHindi ? (
            <View style={[styles.callout, { borderLeftColor: hues.vermilion }]}>
              <SubLabel msg={S.misunderstanding} />
              <Prose text={v.commonMisunderstandingHindi} />
            </View>
          ) : null}
        </StudySection>

        {v.modernExampleHindi || v.messageForTodayHindi || v.practicalApplicationHindi ? (
          <StudySection msg={S.sectionModern} hue={hues.gold}>
            <Prose text={v.modernExampleHindi} />
            {v.messageForTodayHindi ? (
              <View>
                <SubLabel msg={S.messageForToday} />
                <Prose text={v.messageForTodayHindi} />
              </View>
            ) : null}
            {v.practicalApplicationHindi ? (
              <View>
                <SubLabel msg={S.practicalApplication} />
                <Prose text={v.practicalApplicationHindi} />
              </View>
            ) : null}
          </StudySection>
        ) : null}

        {v.reflectionQuestionHindi || v.shortPracticeHindi || v.oneLineSummaryHindi ? (
          <StudySection msg={S.sectionReflection} hue={hues.lotus}>
            {v.reflectionQuestionHindi ? (
              <View style={[styles.callout, { borderLeftColor: hues.saffron }]}>
                <Text selectable maxFontSizeMultiplier={cap} style={{ color: palette.text, fontSize: TYPE.body * scale, lineHeight: TYPE.body * scale * 1.55, fontWeight: '600' }}>
                  {`“${v.reflectionQuestionHindi}”`}
                </Text>
              </View>
            ) : null}
            {v.shortPracticeHindi ? (
              <View>
                <SubLabel msg={S.shortPractice} />
                <Prose text={v.shortPracticeHindi} />
              </View>
            ) : null}
            {v.oneLineSummaryHindi ? (
              <View>
                <SubLabel msg={S.inOneLine} />
                <Prose text={v.oneLineSummaryHindi} />
              </View>
            ) : null}
          </StudySection>
        ) : null}

        <View style={styles.pager}>
          {prev ? (
            <Pressable accessibilityRole="button" accessibilityLabel={t(S.prevVerse)} onPress={() => go(prev.verseNumber)} style={({ pressed }) => [styles.pageBtn, { borderColor: palette.border, backgroundColor: palette.glassStrong }, pressed && { opacity: 0.7 }]}>
              <Ionicons name="chevron-back" size={18} color={palette.accent} />
              <Text style={{ color: palette.text, fontSize: TYPE.subhead, fontWeight: '600' }}>{prev.verseNumber}</Text>
            </Pressable>
          ) : (
            <View />
          )}
          {next ? (
            <Pressable accessibilityRole="button" accessibilityLabel={t(S.nextVerse)} onPress={() => go(next.verseNumber)} style={({ pressed }) => [styles.pageBtn, { borderColor: palette.border, backgroundColor: palette.glassStrong }, pressed && { opacity: 0.7 }]}>
              <Text style={{ color: palette.text, fontSize: TYPE.subhead, fontWeight: '600' }}>{next.verseNumber}</Text>
              <Ionicons name="chevron-forward" size={18} color={palette.accent} />
            </Pressable>
          ) : null}
        </View>
      </ScrollView>
    </Backdrop>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  words: { borderWidth: StyleSheet.hairlineWidth, borderRadius: 12, overflow: 'hidden' },
  wordRow: { flexDirection: 'row', columnGap: SPACE.md, paddingVertical: SPACE.sm, paddingHorizontal: SPACE.md },
  callout: { borderLeftWidth: 3, paddingLeft: SPACE.md },
  pager: { flexDirection: 'row', justifyContent: 'space-between', marginTop: SPACE.sm },
  pageBtn: { flexDirection: 'row', alignItems: 'center', columnGap: 6, minHeight: TOUCH, paddingHorizontal: SPACE.lg, borderRadius: RADIUS.pill, borderWidth: 1 },
});
