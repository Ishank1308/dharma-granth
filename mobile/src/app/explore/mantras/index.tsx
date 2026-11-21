import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Backdrop, Chip, GroupRow, LargeHeader, Muted } from '@/components/ui';
import { MANTRA_CATEGORIES, mantraLines, MANTRAS, type MantraCategory } from '@/content/explore';
import { S, useI18n, type Msg } from '@/i18n';
import { useAppState } from '@/state/app-state';
import { huesFor, SPACE, TITLE_FONT_CAP, TYPE } from '@/theme/themes';

export { ErrorBoundary } from '@/components/error-boundary';

const MANTRA_CATEGORY_LABEL: Record<MantraCategory, Msg> = {
  vedic: S.mantraCatVedic,
  shanti: S.mantraCatShanti,
  stotra: S.mantraCatStotra,
};

/** Vedic mantras, शान्ति पाठ and stotras, as dharmagranth.dev/mantras/, filtered by kind. */
export default function MantrasScreen() {
  const insets = useSafeAreaInsets();
  const { palette } = useAppState();
  const { t, lang } = useI18n();
  const hues = huesFor(palette);
  const [cat, setCat] = useState<MantraCategory | 'all'>('all');
  const list = cat === 'all' ? MANTRAS : MANTRAS.filter((m) => m.category === cat);
  const tone: Record<MantraCategory, string> = { vedic: hues.saffron, shanti: hues.peacock, stotra: hues.indigo };

  return (
    <Backdrop>
      <Stack.Screen options={{ title: '', headerTransparent: true, headerStyle: { backgroundColor: 'transparent' } }} />
      <FlatList
        style={{ backgroundColor: 'transparent' }}
        contentContainerStyle={{ paddingTop: insets.top + 56, paddingHorizontal: SPACE.lg, paddingBottom: insets.bottom + SPACE.xxl * 2 }}
        data={list}
        keyExtractor={(m) => m.slug}
        ListHeaderComponent={
          <View style={{ marginBottom: SPACE.md }}>
            <LargeHeader title={S.mantrasTitle} eyebrow={S.mantrasEyebrow} subtitle={t(S.mantraCount(list.length))} />
            <View accessibilityRole="radiogroup" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACE.sm }}>
              <Chip label={t(S.filterAll)} active={cat === 'all'} onPress={() => setCat('all')} />
              {MANTRA_CATEGORIES.map((c) => (
                <Chip key={c} label={t(MANTRA_CATEGORY_LABEL[c])} active={cat === c} onPress={() => setCat(c)} />
              ))}
            </View>
          </View>
        }
        renderItem={({ item, index }) => {
          // The opening line, whole up to its daṇḍa, so the list never cuts a verse mid-word.
          const first = mantraLines(item.sanskrit)[0] ?? item.sanskrit;
          const title = lang === 'hi' ? item.titleHi : item.title;
          return (
            <GroupRow
              first={index === 0}
              last={index === list.length - 1}
              inset={SPACE.lg + 16}
              accessibilityLabel={`${title}. ${t(MANTRA_CATEGORY_LABEL[item.category])}. ${item.sourceCoordinates}`}
              onPress={() => router.push({ pathname: '/explore/mantras/[id]', params: { id: item.slug } })}>
              <View style={{ width: 4, alignSelf: 'stretch', borderRadius: 2, backgroundColor: tone[item.category] }} />
              <View style={{ flex: 1, rowGap: 2 }}>
                <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.body, fontWeight: '700' }}>
                  {title}
                </Text>
                <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: hues.gold, fontSize: TYPE.subhead }}>
                  {first}
                </Text>
                <Muted style={{ fontSize: TYPE.caption }}>
                  {lang === 'hi' ? item.categoryLabelHi : item.categoryLabel} · {item.sourceCoordinates}
                </Muted>
              </View>
              <Ionicons name="chevron-forward" size={18} color={palette.muted} />
            </GroupRow>
          );
        }}
      />
    </Backdrop>
  );
}
