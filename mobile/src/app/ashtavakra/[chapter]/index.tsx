import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { FlatList, Pressable, Share, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LayerLabel, Prose, Shloka, StudySection, SubLabel } from '@/components/ashtavakra-ui';
import { Backdrop, Card, Eyebrow, Muted } from '@/components/ui';
import { ASHTAVAKRA_CHAPTERS, ASHTAVAKRA_WEB, loadAshtavakraChapter, speakerName, verseInChapter } from '@/content/ashtavakra';
import type { AshtavakraVerse } from '@/content/ashtavakra-types';
import { S, useI18n } from '@/i18n';
import { sanskritLines } from '@/lib/verse-format';
import { usePrefs } from '@/state/app-state';
import { fontCap, huesFor, RADIUS, SPACE, TITLE_FONT_CAP, TOUCH, TYPE } from '@/theme/themes';

/** One prakarana: its introduction, every verse with its meaning, then the closing summary and practice. */
export default function AshtavakraChapterScreen() {
  const params = useLocalSearchParams<{ chapter: string }>();
  const n = Number(params.chapter);
  const insets = useSafeAreaInsets();
  const { palette, settings } = usePrefs();
  const { t } = useI18n();
  const hues = huesFor(palette);
  const chapter = useMemo(() => loadAshtavakraChapter(n), [n]);
  const meta = ASHTAVAKRA_CHAPTERS.find((c) => c.number === n);
  const next = ASHTAVAKRA_CHAPTERS.find((c) => c.number === n + 1 && c.verseCount > 0);
  const scale = settings.textScale;
  const cap = fontCap(scale);

  if (!chapter || !meta) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: t(S.notFoundTitle) }} />
        <Muted>{t(S.scriptureNotFound)}</Muted>
      </View>
    );
  }

  const open = (v: AshtavakraVerse) =>
    router.push({ pathname: '/ashtavakra/[chapter]/[verse]', params: { chapter: String(n), verse: verseInChapter(v.verseNumber) } });

  const share = (v: AshtavakraVerse) => {
    // The whole verse: every line of the Sanskrit, never an excerpt.
    const message = [`अष्टावक्र गीता ${v.verseNumber}`, sanskritLines(v.sanskrit).join('\n'), v.literalHindiMeaning, v.englishTranslation, `${ASHTAVAKRA_WEB}${n}/${verseInChapter(v.verseNumber)}/`]
      .filter(Boolean)
      .join('\n\n');
    Share.share({ message }).catch(() => {});
  };

  const header = (
    <View style={{ marginBottom: SPACE.md }}>
      <View style={styles.hero}>
        <Eyebrow en={`${t(S.prakaranaN(n))} · ${meta.bookTitle}`} hi={`${t(S.prakaranaN(n))} · ${meta.bookTitle}`} />
        <Text accessibilityRole="header" maxFontSizeMultiplier={TITLE_FONT_CAP} style={[styles.title, { color: palette.text }]}>
          {chapter.title}
        </Text>
        {chapter.hero.oneLineSummary ? (
          <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.textSecondary, fontSize: TYPE.callout, lineHeight: TYPE.callout * 1.55, textAlign: 'center' }}>
            {chapter.hero.oneLineSummary}
          </Text>
        ) : null}
        <View style={[styles.paletteRule]}>
          {meta.palette.map((c) => (
            <View key={c} style={[styles.swatch, { backgroundColor: c }]} />
          ))}
        </View>
      </View>
      {chapter.centralQuestion ? (
        <View style={[styles.question, { borderLeftColor: hues.saffron, backgroundColor: palette.dark ? 'rgba(251,146,60,0.08)' : 'rgba(194,65,12,0.06)' }]}>
          <SubLabel msg={S.centralQuestion} />
          <Text maxFontSizeMultiplier={cap} style={{ color: palette.text, fontSize: TYPE.body * scale, lineHeight: TYPE.body * scale * 1.5, fontWeight: '600' }}>
            {chapter.centralQuestion}
          </Text>
        </View>
      ) : null}
      {chapter.introduction ? (
        <StudySection msg={S.introduction} hue={hues.indigo}>
          <Prose text={chapter.introduction} />
          {chapter.mainTeaching ? (
            <View>
              <SubLabel msg={S.mainTeaching} />
              <Prose text={chapter.mainTeaching} />
            </View>
          ) : null}
        </StudySection>
      ) : null}
      {chapter.beforeYouRead.length ? (
        <StudySection msg={S.beforeYouRead} hue={hues.peacock}>
          {chapter.beforeYouRead.map((b, i) => (
            <View key={i} style={styles.li}>
              <Text style={{ color: hues.peacock, fontSize: TYPE.callout }}>•</Text>
              <View style={{ flex: 1 }}>
                <Prose text={b} />
              </View>
            </View>
          ))}
        </StudySection>
      ) : null}
      {chapter.concepts.length ? (
        <StudySection msg={S.keyConcepts} hue={hues.gold}>
          {chapter.concepts.map((c) => (
            <View key={c.term}>
              <Text maxFontSizeMultiplier={cap} style={{ color: palette.text, fontSize: TYPE.callout * scale, fontWeight: '700' }}>
                {c.term}
              </Text>
              <Prose text={c.definition} tone="secondary" size={TYPE.subhead} />
            </View>
          ))}
        </StudySection>
      ) : null}
    </View>
  );

  const end = chapter.end;
  const footer = (
    <View style={{ marginTop: SPACE.sm }}>
      {chapter.closingLine ? (
        <Text maxFontSizeMultiplier={cap} style={{ color: palette.gold, textAlign: 'center', fontSize: TYPE.callout * scale, lineHeight: TYPE.callout * scale * 1.6, marginBottom: SPACE.lg }}>
          {chapter.closingLine}
        </Text>
      ) : null}
      {end.simpleSummary ? (
        <StudySection msg={S.chapterSummary} hue={hues.indigo}>
          <Prose text={end.simpleSummary} />
        </StudySection>
      ) : null}
      {end.fiveTeachings?.length ? (
        <StudySection msg={S.fiveTeachings} hue={hues.saffron}>
          {end.fiveTeachings.map((ft, i) => (
            <View key={i} style={styles.li}>
              <Text style={{ color: hues.saffron, fontSize: TYPE.callout, fontWeight: '700' }}>{i + 1}.</Text>
              <View style={{ flex: 1 }}>
                <Prose text={ft.teaching} />
                {ft.verses.length ? <Text style={{ color: palette.muted, fontSize: TYPE.footnote }}>{ft.verses.join(', ')}</Text> : null}
              </View>
            </View>
          ))}
        </StudySection>
      ) : null}
      {end.misunderstandings?.length ? (
        <StudySection msg={S.misunderstandings} hue={hues.vermilion}>
          {end.misunderstandings.map((m, i) => (
            <Prose key={i} text={m} />
          ))}
        </StudySection>
      ) : null}
      {end.reflectionQuestions?.length || end.fiveMinutePractice ? (
        <StudySection msg={S.reflectionQuestions} hue={hues.lotus}>
          {end.reflectionQuestions?.map((q, i) => (
            <Text key={i} maxFontSizeMultiplier={cap} style={{ color: palette.text, fontSize: TYPE.callout * scale, lineHeight: TYPE.callout * scale * 1.55, fontWeight: '600' }}>
              {`“${q}”`}
            </Text>
          ))}
          {end.fiveMinutePractice ? (
            <View>
              <SubLabel msg={S.fiveMinutePractice} />
              <Prose text={end.fiveMinutePractice} />
            </View>
          ) : null}
        </StudySection>
      ) : null}
      {end.faqs?.length ? (
        <StudySection msg={S.questionsAnswers} hue={hues.peacock}>
          {end.faqs.map((f, i) => (
            <View key={i}>
              <Text maxFontSizeMultiplier={cap} style={{ color: palette.text, fontSize: TYPE.callout * scale, fontWeight: '700', marginBottom: 2 }}>
                {f.q}
              </Text>
              <Prose text={f.a} tone="secondary" size={TYPE.subhead} />
            </View>
          ))}
        </StudySection>
      ) : null}
      {chapter.source?.title ? (
        <Muted style={{ textAlign: 'center', marginVertical: SPACE.md }}>{t(S.sourceLine(chapter.source.title, chapter.source.publisher ?? ''))}</Muted>
      ) : null}
      {next ? (
        <Pressable
          accessibilityRole="button"
          onPress={() => router.replace({ pathname: '/ashtavakra/[chapter]', params: { chapter: String(next.number) } })}
          style={({ pressed }) => [styles.next, { borderColor: palette.border, backgroundColor: palette.glassStrong }, pressed && { opacity: 0.7 }]}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: palette.muted, fontSize: TYPE.footnote }}>{t(S.nextChapterLabel)}</Text>
            <Text style={{ color: palette.text, fontSize: TYPE.body, fontWeight: '700' }}>
              {t(S.prakaranaN(next.number))} · {next.title}
            </Text>
          </View>
          <Ionicons name="arrow-forward" size={20} color={palette.accent} />
        </Pressable>
      ) : null}
    </View>
  );

  return (
    <Backdrop quiet>
      <Stack.Screen options={{ title: t(S.ashtavakraTitle) }} />
      <FlatList
        style={{ backgroundColor: 'transparent' }}
        contentContainerStyle={{ padding: SPACE.lg, paddingBottom: insets.bottom + SPACE.xxl * 2 }}
        data={chapter.verses}
        keyExtractor={(v) => v.verseNumber}
        initialNumToRender={4}
        windowSize={7}
        ListHeaderComponent={header}
        ListFooterComponent={footer}
        renderItem={({ item: v }) => {
          const speaker = speakerName(v.speaker);
          return (
            <Card strong style={{ marginBottom: SPACE.md }}>
              <View style={styles.cardHead}>
                <View style={[styles.ref, { backgroundColor: '#17213f' }]}>
                  <Text style={styles.refText}>{v.verseNumber}</Text>
                </View>
                {speaker ? <Text style={{ flex: 1, color: palette.gold, fontSize: TYPE.footnote, fontWeight: '700' }}>{speaker} उवाच</Text> : <View style={{ flex: 1 }} />}
                <Pressable
                  onPress={() => share(v)}
                  accessibilityRole="button"
                  accessibilityLabel={t(S.shareVerseA11y(v.verseNumber))}
                  style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.6 }]}>
                  <Ionicons name="share-outline" size={20} color={palette.muted} />
                </Pressable>
              </View>
              <Shloka verse={v} />
              {settings.showTransliteration && v.iast ? (
                <Text selectable maxFontSizeMultiplier={cap} style={{ color: palette.textSecondary, fontStyle: 'italic', textAlign: 'center', fontSize: TYPE.subhead * scale, lineHeight: TYPE.subhead * scale * 1.5, marginTop: SPACE.sm }}>
                  {v.iast}
                </Text>
              ) : null}
              {settings.showHindi && v.literalHindiMeaning ? (
                <View style={{ marginTop: SPACE.md }}>
                  <LayerLabel msg={S.sectionArth} hue={hues.peacock} extra={v.verificationStatus === 'review-required' ? t(S.needsReview) : undefined} />
                  <Prose text={v.literalHindiMeaning} size={TYPE.body} />
                </View>
              ) : null}
              {settings.showEnglish && v.englishTranslation ? (
                <View style={{ marginTop: SPACE.md }}>
                  <LayerLabel msg={S.labelEnglish} hue={hues.indigo} />
                  <Prose text={v.englishTranslation} size={TYPE.body} />
                </View>
              ) : null}
              {v.oneLineSummaryHindi ? (
                <View style={[styles.oneLine, { backgroundColor: palette.dark ? 'rgba(251,191,36,0.08)' : 'rgba(180,83,9,0.06)', borderLeftColor: hues.gold }]}>
                  <SubLabel msg={S.inOneLine} />
                  <Prose text={v.oneLineSummaryHindi} />
                </View>
              ) : null}
              <Pressable
                onPress={() => open(v)}
                accessibilityRole="button"
                accessibilityLabel={t(S.readFullVerseA11y(v.verseNumber))}
                style={({ pressed }) => [styles.more, pressed && { opacity: 0.6 }]}>
                <Text style={{ color: hues.saffron, fontSize: TYPE.subhead, fontWeight: '700' }}>{t(S.readFullVerse)}</Text>
                <Ionicons name="arrow-forward" size={16} color={hues.saffron} />
              </Pressable>
            </Card>
          );
        }}
      />
    </Backdrop>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  hero: { alignItems: 'center', rowGap: SPACE.sm, paddingVertical: SPACE.lg },
  title: { fontSize: 28, lineHeight: 40, fontWeight: '700', textAlign: 'center' },
  paletteRule: { flexDirection: 'row', columnGap: 4, marginTop: SPACE.xs },
  swatch: { width: 28, height: 6, borderRadius: 3 },
  question: { borderLeftWidth: 3, borderRadius: 14, padding: SPACE.md, marginBottom: SPACE.md },
  li: { flexDirection: 'row', columnGap: SPACE.sm },
  cardHead: { flexDirection: 'row', alignItems: 'center', columnGap: SPACE.sm, marginBottom: SPACE.sm },
  ref: { borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4 },
  refText: { color: '#ffffff', fontSize: TYPE.footnote, fontWeight: '700', letterSpacing: 0.5 },
  iconBtn: { width: TOUCH, height: TOUCH, borderRadius: TOUCH / 2, alignItems: 'center', justifyContent: 'center', marginRight: -SPACE.sm },
  oneLine: { marginTop: SPACE.md, borderLeftWidth: 3, borderRadius: 12, padding: SPACE.md },
  more: { flexDirection: 'row', alignItems: 'center', columnGap: 6, minHeight: TOUCH, alignSelf: 'flex-start', marginTop: SPACE.xs },
  next: { flexDirection: 'row', alignItems: 'center', columnGap: SPACE.md, borderWidth: 1, borderRadius: RADIUS.row, padding: SPACE.lg, marginTop: SPACE.md },
});
