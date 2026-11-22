import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LabeledText, Para, VerseBlock } from '@/components/knowledge-ui';
import { DoneTick, LinkButton, ProgressBar, SectionTabs } from '@/components/learn-ui';
import { Backdrop, Card, LargeHeader } from '@/components/ui';
import { learn, SHATKA_HUE, type GitaShatka } from '@/content/learn';
import { S, useI18n } from '@/i18n';
import { useMotion } from '@/motion/use-motion';
import { usePrefs } from '@/state/app-state';
import { useLearn } from '@/state/learn';
import { barClearance, huesFor, RADIUS, SPACE, TITLE_FONT_CAP, TYPE, UI_FONT_CAP } from '@/theme/themes';

export { ErrorBoundary } from '@/components/error-boundary';

/**
 * The Gita journey, as the website's /learn/journeys/gita: the eighteen chapters in their three shatkas
 * (karma, bhakti, jnana), each read as a human dilemma: Arjuna's crisis, Krishna's counsel, the key verse
 * whole, and what it asks of us today. Tap a chapter to open it; tick it once studied.
 */
export default function GitaJourneyScreen() {
  const insets = useSafeAreaInsets();
  const { palette } = usePrefs();
  const { t, lang } = useI18n();
  const { animate } = useMotion();
  const hues = huesFor(palette);
  const { progress, setGita } = useLearn();
  const { shatkas, items } = learn('gita');
  const [shatka, setShatka] = useState<GitaShatka['id']>('karma');
  const [open, setOpen] = useState<number | null>(null);
  const p = (m: { en: string; hi: string }) => m[lang] || m.en;
  const current = shatkas.find((s) => s.id === shatka) ?? shatkas[0];
  const hue = SHATKA_HUE[current.id];
  const color = hues[hue];
  const chapters = items.filter((c) => c.shatka === current.id);
  const studied = new Set(progress.gita);

  return (
    <Backdrop quiet>
      <Stack.Screen options={{ title: '', headerTransparent: true, headerStyle: { backgroundColor: 'transparent' } }} />
      <ScrollView
        style={{ backgroundColor: 'transparent' }}
        contentContainerStyle={{ paddingTop: insets.top + 24, paddingHorizontal: SPACE.lg, paddingBottom: barClearance(insets.bottom), rowGap: SPACE.lg }}>
        <LargeHeader title={S.learnGitaTitle} eyebrow={{ en: 'श्रीमद्भगवद्गीता', hi: 'श्रीमद्भगवद्गीता' }} subtitle={t(S.gitaIntro)} />
        <View style={{ rowGap: 6 }}>
          <ProgressBar value={progress.gita.length / 18} hue="saffron" />
          <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.caption, fontWeight: '600' }}>
            {t(S.gitaStudiedCount(progress.gita.length))}
          </Text>
        </View>

        <SectionTabs
          tabs={shatkas.map((s) => ({ key: s.id, title: `${p(s.name).replace(/\s*\(.*\)\s*$/, '')} · ${s.range}` }))}
          value={shatka}
          onChange={(k) => {
            setShatka(k);
            setOpen(null);
          }}
          label={t(S.learnGitaTitle)}
        />

        <View style={[styles.shatka, { borderColor: `${color}55`, backgroundColor: `${color}${palette.dark ? '2c' : '14'}` }]}>
          <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color, fontSize: TYPE.title2, fontWeight: '800' }}>
            {current.mahavakya}
          </Text>
          <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.body, fontWeight: '700' }}>
            {`${p(current.theme)} · ${t(S.gitaChapters(current.range))}`}
          </Text>
          <Para lang={lang}>{p(current.description)}</Para>
        </View>

        {chapters.map((c) => {
          const isOpen = open === c.chapter;
          const isDone = studied.has(c.chapter);
          return (
            <Card key={c.chapter} style={{ rowGap: SPACE.md, borderColor: isDone ? `${hues.tulsi}66` : undefined }}>
              <View style={styles.head}>
                <Pressable
                  onPress={() => setOpen(isOpen ? null : c.chapter)}
                  accessibilityRole="button"
                  accessibilityState={{ expanded: isOpen }}
                  accessibilityLabel={`${t(S.gitaChapter(c.chapter))}, ${p(c.title)}. ${p(c.tag)}`}
                  style={({ pressed }) => [styles.headPress, pressed && { opacity: 0.7 }]}>
                  <View style={[styles.num, { backgroundColor: `${color}${palette.dark ? '33' : '1c'}` }]}>
                    <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color, fontSize: TYPE.callout, fontWeight: '800' }}>
                      {c.chapter}
                    </Text>
                  </View>
                  <View style={{ flex: 1, rowGap: 2 }}>
                    <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.body, fontWeight: '700' }}>
                      {p(c.title)}
                    </Text>
                    <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.footnote }}>
                      {`${lang === 'hi' ? c.translit : c.sanskrit} · ${t(S.verseCount(c.verses))}`}
                    </Text>
                    <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color, fontSize: TYPE.caption, fontWeight: '700', marginTop: 2 }}>
                      {p(c.tag)}
                    </Text>
                  </View>
                  <Ionicons name={isOpen ? 'chevron-up' : 'chevron-down'} size={18} color={palette.muted} />
                </Pressable>
                <DoneTick done={isDone} label={t(S.lessonMarkA11y(p(c.title), isDone))} onToggle={() => setGita(c.chapter, !isDone)} />
              </View>
              <Para muted size={TYPE.subhead} lang={lang}>
                {p(c.dilemma)}
              </Para>
              {isOpen ? (
                <Animated.View entering={animate ? FadeIn.duration(200) : undefined} style={{ rowGap: SPACE.md }}>
                  <LabeledText label={t(S.gitaCrisis)} text={p(c.crisis)} hue="vermilion" lang={lang} />
                  <LabeledText label={t(S.gitaCounsel)} text={p(c.counsel)} hue="indigo" lang={lang} />
                  <VerseBlock
                    sanskrit={c.keyVerse.sanskrit}
                    translit={c.keyVerse.translit}
                    translation={p(c.keyVerse.meaning)}
                    reference={`${t(S.gitaKeyVerse)} · ${c.keyVerse.ref}`}
                    hue={hue}
                    target={{ id: 'bhagavadgita', chapter: c.chapter, verse: c.keyVerse.verse }}
                  />
                  <LabeledText label={t(S.gitaLife)} text={p(c.life)} hue="tulsi" lang={lang} />
                  <LinkButton
                    label={t(S.gitaReadChapter)}
                    icon="book-outline"
                    onPress={() => router.push({ pathname: '/scripture/[id]/[chapter]', params: { id: 'bhagavadgita', chapter: String(c.chapter) } })}
                  />
                </Animated.View>
              ) : null}
            </Card>
          );
        })}
      </ScrollView>
    </Backdrop>
  );
}

const styles = StyleSheet.create({
  shatka: { borderWidth: 1, borderRadius: RADIUS.panel, padding: SPACE.xl, rowGap: SPACE.sm },
  head: { flexDirection: 'row', alignItems: 'center', columnGap: SPACE.xs },
  headPress: { flex: 1, flexDirection: 'row', alignItems: 'center', columnGap: SPACE.md },
  num: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
});
