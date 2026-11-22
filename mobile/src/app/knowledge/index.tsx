import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Backdrop, Card, GroupCard, GroupRow, LargeHeader } from '@/components/ui';
import { KINDS, knowledge } from '@/content/knowledge';
import { S, useI18n } from '@/i18n';
import { usePrefs } from '@/state/app-state';
import { barClearance, huesFor, RADIUS, SPACE, TOUCH, TYPE, UI_FONT_CAP } from '@/theme/themes';

export { ErrorBoundary } from '@/components/error-boundary';

/**
 * The knowledge hub, after the website's Learn and knowledge pages: Wisdom for life first (the way in for
 * someone who comes with a question, not a scripture name), then the five reference collections.
 */
export default function KnowledgeHub() {
  const insets = useSafeAreaInsets();
  const { palette } = usePrefs();
  const { t } = useI18n();
  const hues = huesFor(palette);
  const tileHues = huesFor({ dark: false });
  const wisdom = knowledge('wisdom');

  return (
    <Backdrop>
      <Stack.Screen options={{ title: '', headerTransparent: true, headerStyle: { backgroundColor: 'transparent' } }} />
      <ScrollView
        style={{ backgroundColor: 'transparent' }}
        contentContainerStyle={{ paddingTop: insets.top + 24, paddingHorizontal: SPACE.lg, paddingBottom: barClearance(insets.bottom), rowGap: SPACE.lg }}>
        <LargeHeader title={S.knowledgeTitle} eyebrow={S.knowledgeEyebrow} subtitle={t(S.knowledgeSummary)} />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${t(S.wisdomTitle)}. ${t(S.wisdomSummary)}`}
          onPress={() => router.push('/wisdom')}
          style={({ pressed }) => pressed && { transform: [{ scale: 0.985 }] }}>
          <Card strong style={{ borderRadius: RADIUS.panel - 2, rowGap: SPACE.md }}>
            <View style={styles.row}>
              <View style={[styles.lotus, { backgroundColor: palette.dark ? 'rgba(244,114,182,0.18)' : 'rgba(190,24,93,0.10)' }]}>
                <Ionicons name="flower-outline" size={24} color={hues.lotus} />
              </View>
              <View style={{ flex: 1 }}>
                <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.title3, fontWeight: '700' }}>
                  {t(S.wisdomTitle)}
                </Text>
                <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.footnote, marginTop: 2 }}>
                  {t(S.wisdomSummary)}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={palette.muted} />
            </View>
            {/* A few of the topics as a taste, the same first picks as the website's quick list. */}
            <View style={styles.tags}>
              {wisdom.items.slice(0, 6).map((topic) => (
                <View key={topic.id} style={[styles.tag, { borderColor: `${topic.accent}66` }]}>
                  <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.footnote, fontWeight: '600' }}>
                    {t(topic.title)}
                  </Text>
                </View>
              ))}
            </View>
          </Card>
        </Pressable>

        <GroupCard>
          {KINDS.map((k, i) => {
            const count = knowledge(k.kind).items.length;
            return (
              <GroupRow
                key={k.kind}
                standalone={i === 0}
                inset={64}
                accessibilityLabel={`${t(k.title)}, ${t(S.kEntries(count))}. ${t(k.blurb)}`}
                onPress={() => router.push({ pathname: '/knowledge/[kind]', params: { kind: k.kind } })}>
                {/* The deep hue in every theme, so the white glyph keeps its contrast on Dark too. */}
                <View style={[styles.icon, { backgroundColor: tileHues[k.hue] }]}>
                  <Ionicons name={k.icon} size={18} color="#ffffff" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.body, fontWeight: '600' }}>
                    {t(k.title)}
                  </Text>
                  <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.footnote, marginTop: 2 }}>
                    {t(k.blurb)}
                  </Text>
                </View>
                <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.footnote }}>
                  {count}
                </Text>
                <Ionicons name="chevron-forward" size={18} color={palette.muted} />
              </GroupRow>
            );
          })}
        </GroupCard>
      </ScrollView>
    </Backdrop>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', columnGap: SPACE.md },
  lotus: { width: TOUCH, height: TOUCH, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACE.sm },
  tag: { borderWidth: 1, borderRadius: RADIUS.pill, paddingHorizontal: SPACE.md, paddingVertical: 6 },
  icon: { width: 32, height: 32, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
});
