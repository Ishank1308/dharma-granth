import { Stack, useLocalSearchParams } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Backdrop, Card, GroupTitle, Muted } from '@/components/ui';
import { mantraBySlug, mantraLines } from '@/content/explore';
import { S, useI18n, type Msg } from '@/i18n';
import { usePrefs } from '@/state/app-state';
import { fontCap, huesFor, quietFill, RADIUS, separator, SPACE, TITLE_FONT_CAP, TYPE } from '@/theme/themes';

export { ErrorBoundary } from '@/components/error-boundary';

/**
 * One mantra as on dharmagranth.dev/mantras/<slug>/: the whole text, its ṛṣi, devatā and chandas, the पदच्छेद
 * word by word, the भावार्थ in Hindi and English, why it is recited, and the website's questions and answers.
 */
export default function MantraScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { palette, settings } = usePrefs();
  const { t, lang } = useI18n();
  const hues = huesFor(palette);
  const m = mantraBySlug(String(id));
  const scale = settings.textScale;
  const cap = fontCap(scale);

  if (!m) {
    return (
      <Backdrop>
        <Stack.Screen options={{ title: t(S.notFoundTitle) }} />
        <View style={{ padding: SPACE.xl }}>
          <Muted>{t(S.notFoundTitle)}</Muted>
        </View>
      </Backdrop>
    );
  }

  const meta: { label: Msg; value?: string }[] = [
    { label: S.mantraRishi, value: m.rishi },
    { label: S.mantraDevata, value: m.devata },
    { label: S.mantraChhandas, value: m.chhandas },
    { label: S.mantraSource, value: m.sourceCoordinates },
  ];
  // The reader's language first, then the other, as the website shows both.
  const meanings = lang === 'hi' ? [m.hindiMeaning, m.englishMeaning] : [m.englishMeaning, m.hindiMeaning];

  return (
    <Backdrop>
      <Stack.Screen options={{ title: '', headerTransparent: true, headerStyle: { backgroundColor: 'transparent' } }} />
      <ScrollView
        style={{ backgroundColor: 'transparent' }}
        contentContainerStyle={{ paddingTop: insets.top + 56, paddingHorizontal: SPACE.lg, paddingBottom: insets.bottom + SPACE.xxl * 2 }}>
        <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.accent, fontSize: TYPE.caption, fontWeight: '700', letterSpacing: lang === 'hi' ? 0 : 0.5 }}>
          {lang === 'hi' ? m.categoryLabelHi : m.categoryLabel.toUpperCase()}
        </Text>
        <Text accessibilityRole="header" maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: 30, fontWeight: '800', marginTop: SPACE.xs }}>
          {lang === 'hi' ? m.titleHi : m.title}
        </Text>
        <Muted style={{ fontSize: TYPE.subhead, marginBottom: SPACE.lg }}>{lang === 'hi' ? m.title : m.titleHi}</Muted>

        {/* The whole mantra, every line, with its daṇḍas, as a gilt panel like the website's shloka. */}
        <Card strong style={{ paddingVertical: SPACE.xl, rowGap: SPACE.md }}>
          <View style={{ rowGap: 2 }}>
            {mantraLines(m.sanskrit).map((line, i) => (
              <Text
                key={i}
                maxFontSizeMultiplier={cap}
                style={{ color: palette.text, fontSize: TYPE.title3 * scale, lineHeight: TYPE.title3 * scale * 1.65, fontWeight: '600', textAlign: 'center' }}>
                {line}
              </Text>
            ))}
          </View>
          {settings.showTransliteration ? (
            <Text maxFontSizeMultiplier={cap} style={{ color: palette.muted, fontSize: TYPE.subhead * scale, lineHeight: TYPE.subhead * scale * 1.55, fontStyle: 'italic', textAlign: 'center' }}>
              {m.transliteration}
            </Text>
          ) : null}
          <View style={[styles.meta, { borderTopColor: separator(palette) }]}>
            {meta
              .filter((x) => x.value)
              .map((x) => (
                <Text key={x.label.en} maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.textSecondary, fontSize: TYPE.footnote, lineHeight: TYPE.footnote * 1.5 }}>
                  <Text style={{ color: hues.saffron, fontWeight: '700' }}>{t(x.label)} · </Text>
                  {x.value}
                </Text>
              ))}
          </View>
        </Card>

        <GroupTitle title={t(S.mantraWords)} />
        <Card strong style={{ paddingVertical: SPACE.sm }}>
          {m.wordMeanings.map((w, i) => (
            <View key={i} style={[styles.word, i > 0 && { borderTopWidth: StyleSheet.hairlineWidth * 2, borderTopColor: separator(palette) }]}>
              <View style={styles.wordHead}>
                <Text maxFontSizeMultiplier={cap} style={{ color: hues.saffron, fontSize: TYPE.callout * scale, fontWeight: '700' }}>
                  {w.sanskrit}
                </Text>
                {settings.showTransliteration ? (
                  <Text maxFontSizeMultiplier={cap} style={{ color: palette.muted, fontSize: TYPE.footnote * scale, fontStyle: 'italic' }}>
                    {w.iast}
                  </Text>
                ) : null}
              </View>
              <Text maxFontSizeMultiplier={cap} style={{ color: palette.textSecondary, fontSize: TYPE.subhead * scale, lineHeight: TYPE.subhead * scale * 1.5 }}>
                {lang === 'hi' ? w.hindi : w.english}
              </Text>
            </View>
          ))}
        </Card>

        <GroupTitle title={t(S.mantraMeaning)} />
        <Card strong style={{ rowGap: SPACE.md }}>
          {meanings.map((text, i) => (
            <Text
              key={i}
              maxFontSizeMultiplier={cap}
              style={{
                color: i === 0 ? palette.text : palette.textSecondary,
                fontSize: (i === 0 ? TYPE.callout : TYPE.subhead) * scale,
                lineHeight: (i === 0 ? TYPE.callout : TYPE.subhead) * scale * 1.6,
              }}>
              {text}
            </Text>
          ))}
        </Card>

        <GroupTitle title={t(S.mantraSignificance)} />
        <Card strong>
          <Text maxFontSizeMultiplier={cap} style={{ color: palette.textSecondary, fontSize: TYPE.callout * scale, lineHeight: TYPE.callout * scale * 1.6 }}>
            {lang === 'hi' ? m.significanceHi : m.significance}
          </Text>
        </Card>

        {m.faqs.length ? (
          <>
            <GroupTitle title={t(S.mantraQuestions)} />
            <Card strong style={{ paddingVertical: SPACE.xs }}>
              {m.faqs.map((f, i) => (
                <Faq key={i} first={i === 0} question={f.question}>
                  {f.answer}
                </Faq>
              ))}
            </Card>
          </>
        ) : null}
      </ScrollView>
    </Backdrop>
  );
}

function Faq({ question, children, first }: { question: string; children: ReactNode; first?: boolean }) {
  const { palette, settings } = usePrefs();
  const [open, setOpen] = useState(false);
  const scale = settings.textScale;
  return (
    <View style={!first ? { borderTopWidth: StyleSheet.hairlineWidth * 2, borderTopColor: separator(palette) } : undefined}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen((o) => !o)}
        style={({ pressed }) => [styles.faqQ, pressed && { backgroundColor: quietFill(palette) }]}>
        <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ flex: 1, color: palette.text, fontSize: TYPE.callout, fontWeight: '600' }}>
          {question}
        </Text>
        <Text style={{ color: palette.muted, fontSize: TYPE.title3 }}>{open ? '−' : '+'}</Text>
      </Pressable>
      {open ? (
        <Text
          maxFontSizeMultiplier={fontCap(scale)}
          style={{ color: palette.textSecondary, fontSize: TYPE.subhead * scale, lineHeight: TYPE.subhead * scale * 1.55, paddingBottom: SPACE.md }}>
          {children}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  meta: { borderTopWidth: StyleSheet.hairlineWidth * 2, paddingTop: SPACE.md, rowGap: SPACE.xs },
  word: { paddingVertical: SPACE.sm + 2, rowGap: 2 },
  wordHead: { flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap', columnGap: SPACE.sm },
  faqQ: { flexDirection: 'row', alignItems: 'center', columnGap: SPACE.md, minHeight: 48, paddingVertical: SPACE.sm, borderRadius: RADIUS.tile },
});
