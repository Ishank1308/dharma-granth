import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, SectionList, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BentoRow, BentoTile } from '@/components/bento';
import { Backdrop, Chip, glass, GroupTitle, LargeHeader, Muted } from '@/components/ui';
import { knowledge, matchWisdom, type WisdomTopic } from '@/content/knowledge';
import { S, useI18n } from '@/i18n';
import { usePrefs } from '@/state/app-state';
import { barClearance, RADIUS, SPACE, TOUCH, TYPE, UI_FONT_CAP } from '@/theme/themes';

export { ErrorBoundary } from '@/components/error-boundary';

/**
 * Wisdom for life, after dharmagranth.dev/wisdom-for-life/: start from what you are facing (fear, anger,
 * grief, a hard decision), not from a scripture name, and get the verses that speak to it. Topics sit in a
 * bento of glass tiles, two to a row, the wider one swapping sides each row.
 */
export default function WisdomIndex() {
  const insets = useSafeAreaInsets();
  const { palette } = usePrefs();
  const { t } = useI18n();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const data = knowledge('wisdom');

  const sections = useMemo(() => {
    const found = matchWisdom(query);
    return data.categories
      .filter((c) => !category || c.key === category)
      .map((c) => {
        const items = found.filter((x) => x.category === c.key);
        // Bento rows of two, the wider tile swapping sides row by row, so the grid reads asymmetric.
        const rows: WisdomTopic[][] = [];
        for (let i = 0; i < items.length; i += 2) rows.push(items.slice(i, i + 2));
        return { key: c.key, title: t(c), count: items.length, data: rows };
      })
      .filter((s) => s.count > 0);
  }, [query, category, data, t]);

  return (
    <Backdrop>
      <Stack.Screen options={{ title: '', headerTransparent: true, headerStyle: { backgroundColor: 'transparent' } }} />
      <SectionList
        style={{ backgroundColor: 'transparent' }}
        contentContainerStyle={{ paddingTop: insets.top + 24, paddingHorizontal: SPACE.lg, paddingBottom: barClearance(insets.bottom) }}
        sections={sections}
        keyExtractor={(row) => row.map((x) => x.id).join('+')}
        stickySectionHeadersEnabled={false}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View style={{ rowGap: SPACE.md, marginBottom: SPACE.sm }}>
            <LargeHeader title={S.wisdomTitle} eyebrow={S.wisdomEyebrow} subtitle={`${t(S.wisdomSummary)} · ${t(S.wisdomTopics(data.items.length))}`} />
            <View style={[styles.search, glass(palette, true)]}>
              <Ionicons name="heart-outline" size={18} color={palette.muted} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder={t(S.wisdomAsk)}
                placeholderTextColor={palette.muted}
                accessibilityLabel={t(S.wisdomAsk)}
                autoCorrect={false}
                style={{ flex: 1, color: palette.text, fontSize: TYPE.callout, minHeight: TOUCH }}
              />
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginHorizontal: -SPACE.lg }}
              contentContainerStyle={{ paddingHorizontal: SPACE.lg, columnGap: SPACE.sm }}
              accessibilityRole="radiogroup">
              <Chip label={t(S.filterAll)} active={!category} onPress={() => setCategory(null)} />
              {data.categories.map((c) => (
                <Chip key={c.key} label={t(c)} active={category === c.key} onPress={() => setCategory(category === c.key ? null : c.key)} />
              ))}
            </ScrollView>
          </View>
        }
        renderSectionHeader={({ section }) => <GroupTitle title={section.title} detail={String(section.count)} />}
        renderItem={({ item, index }) => (
          <BentoRow style={{ marginBottom: SPACE.md }}>
            {item.map((topic, i) => (
              <TopicCard key={topic.id} topic={topic} flex={item.length === 1 ? 1 : (index + i) % 2 === 0 ? 1.3 : 1} />
            ))}
          </BentoRow>
        )}
        ListEmptyComponent={<Muted style={{ marginTop: SPACE.xl, textAlign: 'center' }}>{t(S.kNoMatch(query))}</Muted>}
      />
    </Backdrop>
  );
}

/** A topic as a bento tile: its own accent colour down the side and pooling at the foot, title, Sanskrit line, summary. */
function TopicCard({ topic, flex }: { topic: WisdomTopic; flex: number }) {
  const { palette } = usePrefs();
  const { t } = useI18n();
  return (
    <BentoTile
      flex={flex}
      depth={null}
      accessibilityLabel={t(S.wisdomOpenA11y(t(topic.title), topic.verses.length))}
      onPress={() => router.push({ pathname: '/wisdom/[slug]', params: { slug: topic.id } })}
      glow={`${topic.accent}30`}
      padding={0}
      style={{ flexDirection: 'row' }}>
      <View style={[styles.stripe, { backgroundColor: topic.accent }]} />
      <View style={{ flex: 1, rowGap: 4, padding: SPACE.md, paddingLeft: SPACE.md + 2 }}>
        {/* The Sanskrit line wraps rather than being cut off mid-word. */}
        <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: topic.accent, fontSize: TYPE.footnote, lineHeight: TYPE.footnote * 1.5, fontWeight: '700' }}>
          {topic.sanskrit}
        </Text>
        <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.callout, fontWeight: '700' }}>
          {t(topic.title)}
        </Text>
        <Text maxFontSizeMultiplier={UI_FONT_CAP} numberOfLines={4} style={{ color: palette.textSecondary, fontSize: TYPE.footnote, lineHeight: TYPE.footnote * 1.5 }}>
          {t(topic.short)}
        </Text>
        <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.caption, marginTop: 'auto', paddingTop: 2 }}>
          {`${t(S.wisdomVerseCount(topic.verses.length))} · ${t(S.wisdomMinutes(topic.minutes))}`}
        </Text>
      </View>
    </BentoTile>
  );
}

const styles = StyleSheet.create({
  search: { flexDirection: 'row', alignItems: 'center', columnGap: SPACE.sm, borderRadius: RADIUS.pill, paddingHorizontal: SPACE.lg },
  stripe: { width: 4 },
});
