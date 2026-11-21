import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EntryTile, LangNote, openEntry } from '@/components/knowledge-ui';
import { Backdrop, Chip, glass, GroupRow, LargeHeader, Muted } from '@/components/ui';
import { entries, hueKey, isKind, KINDS, knowledge } from '@/content/knowledge';
import { S, useI18n } from '@/i18n';
import { useAppState } from '@/state/app-state';
import { barClearance, RADIUS, SPACE, TOUCH, TYPE, UI_FONT_CAP } from '@/theme/themes';

const fold = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

/** Language the website writes each collection's list text in (concepts mix both, so they get no note). */
const CONTENT_LANG: Partial<Record<string, 'en' | 'hi'>> = { dictionary: 'en', characters: 'en', places: 'en', timelines: 'hi' };

/** One knowledge collection: a filter field, category chips and the entries, as the website's index pages. */
export default function KnowledgeList() {
  const { kind: raw } = useLocalSearchParams<{ kind: string }>();
  const insets = useSafeAreaInsets();
  const { palette } = useAppState();
  const { t, lang } = useI18n();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | null>(null);

  const kind = isKind(String(raw)) ? (String(raw) as (typeof KINDS)[number]['kind']) : null;
  const meta = KINDS.find((k) => k.kind === kind);
  const categories = useMemo(() => (kind ? knowledge(kind).categories : []), [kind]);
  const all = useMemo(() => (kind ? entries(kind, lang) : []), [kind, lang]);

  const list = useMemo(() => {
    const q = fold(query.trim());
    return all.filter(
      (e) =>
        (!category || e.category === category) &&
        (!q || fold(`${e.title} ${e.terms} ${e.subtitle}`).includes(q) || e.sanskrit.includes(query.trim())),
    );
  }, [all, query, category]);

  if (!kind || !meta) {
    return (
      <Backdrop>
        <Stack.Screen options={{ title: t(S.notFoundTitle) }} />
        <Muted style={{ margin: SPACE.xl }}>{t(S.notFoundTitle)}</Muted>
      </Backdrop>
    );
  }

  const catLabel = (key: string) => {
    const c = categories.find((x) => x.key === key);
    if (!c) return key;
    return lang === 'hi' && c.hi ? c.hi : c.en;
  };
  const chipLabel = (c: (typeof categories)[number]) => (lang === 'hi' ? c.hi || c.en : c.en);

  return (
    <Backdrop>
      <Stack.Screen options={{ title: '', headerTransparent: true, headerStyle: { backgroundColor: 'transparent' } }} />
      <FlatList
        style={{ backgroundColor: 'transparent' }}
        contentContainerStyle={{ paddingTop: insets.top + 24, paddingHorizontal: SPACE.lg, paddingBottom: barClearance(insets.bottom) }}
        data={list}
        keyExtractor={(e) => e.id}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View style={{ rowGap: SPACE.md, marginBottom: SPACE.lg }}>
            <LargeHeader title={meta.title} eyebrow={S.knowledgeTitle} subtitle={`${t(meta.blurb)} · ${t(S.kEntries(all.length))}`} />
            <View style={[styles.search, glass(palette, true)]}>
              <Ionicons name="search" size={18} color={palette.muted} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder={t(S.kFilter(t(meta.title)))}
                placeholderTextColor={palette.muted}
                accessibilityLabel={t(S.kFilter(t(meta.title)))}
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
              {categories.map((c) => (
                <Chip key={c.key} label={chipLabel(c)} active={category === c.key} onPress={() => setCategory(category === c.key ? null : c.key)} />
              ))}
            </ScrollView>
            {CONTENT_LANG[kind] ? <LangNote content={CONTENT_LANG[kind]} /> : null}
          </View>
        }
        renderItem={({ item, index }) => (
          <GroupRow
            first={index === 0}
            last={index === list.length - 1}
            inset={72}
            accessibilityLabel={`${item.title}, ${item.sanskrit}. ${catLabel(item.category)}`}
            onPress={() => openEntry(kind, item.id)}>
            <EntryTile
              hue={hueKey(item.hue ?? categories.find((c) => c.key === item.category)?.hue ?? meta.hue)}
              icon={item.icon}
              letter={item.sanskrit.slice(0, 1) || item.title.slice(0, 1)}
            />
            <View style={{ flex: 1 }}>
              <View style={styles.titleRow}>
                <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ flexShrink: 1, color: palette.text, fontSize: TYPE.body, fontWeight: '600' }}>
                  {kind === 'timelines' ? item.title : item.sanskrit || item.title}
                </Text>
                {kind !== 'timelines' && item.sanskrit ? (
                  <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.footnote }}>
                    {item.title}
                  </Text>
                ) : null}
              </View>
              <Text numberOfLines={2} maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.footnote, marginTop: 2 }}>
                {item.subtitle}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={palette.muted} />
          </GroupRow>
        )}
        ListEmptyComponent={<Muted style={{ marginTop: SPACE.xl, textAlign: 'center' }}>{t(S.kNoMatch(query))}</Muted>}
      />
    </Backdrop>
  );
}

const styles = StyleSheet.create({
  search: { flexDirection: 'row', alignItems: 'center', columnGap: SPACE.sm, borderRadius: RADIUS.pill, paddingHorizontal: SPACE.lg },
  titleRow: { flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap', columnGap: SPACE.sm },
});
