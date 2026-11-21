import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, SectionList, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Backdrop, Chip, glass, GroupTitle, LargeHeader, Muted } from '@/components/ui';
import { knowledge, matchWisdom, type WisdomTopic } from '@/content/knowledge';
import { S, useI18n } from '@/i18n';
import { useAppState } from '@/state/app-state';
import { barClearance, RADIUS, SPACE, TOUCH, TYPE, UI_FONT_CAP } from '@/theme/themes';

/**
 * Wisdom for life, after dharmagranth.dev/wisdom-for-life/: start from what you are facing (fear, anger,
 * grief, a hard decision), not from a scripture name, and get the verses that speak to it.
 */
export default function WisdomIndex() {
  const insets = useSafeAreaInsets();
  const { palette } = useAppState();
  const { t } = useI18n();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const data = knowledge('wisdom');

  const sections = useMemo(() => {
    const found = matchWisdom(query);
    return data.categories
      .filter((c) => !category || c.key === category)
      .map((c) => ({ key: c.key, title: t(c), data: found.filter((x) => x.category === c.key) }))
      .filter((s) => s.data.length > 0);
  }, [query, category, data, t]);

  return (
    <Backdrop>
      <Stack.Screen options={{ title: '', headerTransparent: true, headerStyle: { backgroundColor: 'transparent' } }} />
      <SectionList
        style={{ backgroundColor: 'transparent' }}
        contentContainerStyle={{ paddingTop: insets.top + 24, paddingHorizontal: SPACE.lg, paddingBottom: barClearance(insets.bottom) }}
        sections={sections}
        keyExtractor={(x) => x.id}
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
        renderSectionHeader={({ section }) => <GroupTitle title={section.title} detail={String(section.data.length)} />}
        renderItem={({ item }) => <TopicCard topic={item} />}
        ListEmptyComponent={<Muted style={{ marginTop: SPACE.xl, textAlign: 'center' }}>{t(S.kNoMatch(query))}</Muted>}
      />
    </Backdrop>
  );
}

/** A topic as the website's topic card: its own accent colour down the side, title, Sanskrit line, summary. */
function TopicCard({ topic }: { topic: WisdomTopic }) {
  const { palette } = useAppState();
  const { t } = useI18n();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t(S.wisdomOpenA11y(t(topic.title), topic.verses.length))}
      onPress={() => router.push({ pathname: '/wisdom/[slug]', params: { slug: topic.id } })}
      style={({ pressed }) => [styles.card, glass(palette), pressed && { transform: [{ scale: 0.985 }], opacity: 0.9 }]}>
      <View style={[styles.stripe, { backgroundColor: topic.accent }]} />
      <View style={{ flex: 1, rowGap: 4, paddingVertical: SPACE.md }}>
        <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.body, fontWeight: '700' }}>
          {t(topic.title)}
        </Text>
        <Text maxFontSizeMultiplier={UI_FONT_CAP} numberOfLines={1} style={{ color: palette.muted, fontSize: TYPE.caption }}>
          {topic.sanskrit}
        </Text>
        <Text maxFontSizeMultiplier={UI_FONT_CAP} numberOfLines={3} style={{ color: palette.text, fontSize: TYPE.footnote, lineHeight: TYPE.footnote * 1.5 }}>
          {t(topic.short)}
        </Text>
        <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.caption, marginTop: 2 }}>
          {`${t(S.wisdomVerseCount(topic.verses.length))} · ${t(S.wisdomMinutes(topic.minutes))}`}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={palette.muted} style={{ alignSelf: 'center' }} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  search: { flexDirection: 'row', alignItems: 'center', columnGap: SPACE.sm, borderRadius: RADIUS.pill, paddingHorizontal: SPACE.lg },
  card: {
    flexDirection: 'row',
    columnGap: SPACE.md,
    borderRadius: RADIUS.card,
    paddingRight: SPACE.md,
    marginBottom: SPACE.md,
    overflow: 'hidden',
  },
  stripe: { width: 5 },
});
