import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Para } from '@/components/knowledge-ui';
import { Pill, Pills } from '@/components/learn-ui';
import { Backdrop, Card, Chip, LargeHeader } from '@/components/ui';
import { learn } from '@/content/learn';
import { S, useI18n } from '@/i18n';
import { useMotion } from '@/motion/use-motion';
import { usePrefs } from '@/state/app-state';
import { barClearance, SPACE, TITLE_FONT_CAP, TOUCH, TYPE, UI_FONT_CAP } from '@/theme/themes';

export { ErrorBoundary } from '@/components/error-boundary';

/**
 * Questions about the scriptures, as the website's /learn/faq: four groups (canon, ethics, schools, myths),
 * each answer opening in place, in Hindi or English with the reader's interface language, with its
 * references and, where a named person reviewed it, who and when.
 */
export default function FaqScreen() {
  const insets = useSafeAreaInsets();
  const { palette } = usePrefs();
  const { t, lang } = useI18n();
  const { animate } = useMotion();
  const { categories, items } = learn('faq');
  const [category, setCategory] = useState('all');
  const [open, setOpen] = useState<string | null>(null);
  const shown = category === 'all' ? items : items.filter((f) => f.category === category);

  return (
    <Backdrop quiet>
      <Stack.Screen options={{ title: '', headerTransparent: true, headerStyle: { backgroundColor: 'transparent' } }} />
      <ScrollView
        style={{ backgroundColor: 'transparent' }}
        contentContainerStyle={{ paddingTop: insets.top + 24, paddingHorizontal: SPACE.lg, paddingBottom: barClearance(insets.bottom), rowGap: SPACE.md }}>
        <LargeHeader title={S.learnFaqTitle} eyebrow={S.learnTitle} subtitle={t(S.faqCount(items.length))} />
        <View accessibilityRole="radiogroup" style={styles.chips}>
          <Chip label={t(S.faqAll)} active={category === 'all'} onPress={() => setCategory('all')} />
          {categories.map((c) => (
            <Chip key={c.key} label={t(c)} active={category === c.key} onPress={() => setCategory(c.key)} />
          ))}
        </View>
        {shown.map((f) => {
          const isOpen = open === f.id;
          return (
            <Card key={f.id} style={{ paddingVertical: SPACE.sm }}>
              <Pressable
                onPress={() => setOpen(isOpen ? null : f.id)}
                accessibilityRole="button"
                accessibilityState={{ expanded: isOpen }}
                style={({ pressed }) => [styles.q, pressed && { opacity: 0.7 }]}>
                <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ flex: 1, color: palette.text, fontSize: TYPE.body, fontWeight: '700', lineHeight: TYPE.body * 1.45 }}>
                  {f.question[lang] || f.question.en}
                </Text>
                <Ionicons name={isOpen ? 'remove' : 'add'} size={22} color={palette.accent} />
              </Pressable>
              {isOpen ? (
                <Animated.View entering={animate ? FadeIn.duration(200) : undefined} style={{ rowGap: SPACE.md, paddingBottom: SPACE.md }}>
                  <Para lang={lang}>{f.answer[lang] || f.answer.en}</Para>
                  {f.refs.length ? (
                    <View style={{ rowGap: SPACE.xs }}>
                      <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.caption, fontWeight: '700' }}>
                        {t(S.faqRefs)}
                      </Text>
                      <Pills>
                        {f.refs.map((r) => (
                          <Pill key={r} text={r} hue="indigo" />
                        ))}
                      </Pills>
                    </View>
                  ) : null}
                  {f.reviewer ? (
                    <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.caption }}>
                      {t(S.faqReviewed(f.reviewer, f.reviewed))}
                    </Text>
                  ) : null}
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
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACE.sm },
  q: { flexDirection: 'row', alignItems: 'center', columnGap: SPACE.md, minHeight: TOUCH },
});
