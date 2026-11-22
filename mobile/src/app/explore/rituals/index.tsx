import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BentoTile } from '@/components/bento';
import { HuePill } from '@/components/guide-ui';
import { LangNote, Para } from '@/components/knowledge-ui';
import { Backdrop, Card, Chip, glass, GroupTitle, LargeHeader, Muted } from '@/components/ui';
import { filterRituals, RITUAL_CATEGORIES, RITUALS, type Ritual, type RitualCategory } from '@/content/rituals';
import { S, useI18n, type Msg } from '@/i18n';
import { useStagger } from '@/motion/stagger';
import { PressableScale } from '@/motion/pressable-scale';
import { usePrefs } from '@/state/app-state';
import { festivalColors } from '@/theme/festival-colors';
import { SANSKRIT_FONT } from '@/theme/fonts';
import { huesFor, quietFill, RADIUS, scriptSize, SPACE, TITLE_FONT_CAP, TOUCH, TYPE, UI_FONT_CAP } from '@/theme/themes';

export { ErrorBoundary } from '@/components/error-boundary';

const CATEGORY_LABEL: Record<RitualCategory, Msg> = {
  all: S.ritualCatAll,
  daily: S.ritualCatDaily,
  temple: S.ritualCatTemple,
  homa: S.ritualCatHoma,
  'sacred-forms': S.ritualCatForms,
};

/**
 * The website's temple and ritual explainer (/rituals/): the Upakarma guide featured first, then every ritual
 * as a tile in its own colours, filtered by the website's four groups or searched by name.
 */
export default function RitualsScreen() {
  const insets = useSafeAreaInsets();
  const { palette, lang } = usePrefs();
  const { t } = useI18n();
  const hues = huesFor(palette);
  const stagger = useStagger();
  const [category, setCategory] = useState<RitualCategory>('all');
  const [query, setQuery] = useState('');
  const list = useMemo(() => filterRituals(category, query), [category, query]);

  return (
    <Backdrop>
      <Stack.Screen options={{ title: '', headerTransparent: true, headerStyle: { backgroundColor: 'transparent' } }} />
      <Animated.ScrollView
        keyboardShouldPersistTaps="handled"
        style={{ backgroundColor: 'transparent' }}
        contentContainerStyle={{ paddingTop: insets.top + 56, paddingHorizontal: SPACE.lg, paddingBottom: insets.bottom + SPACE.xxl * 2, rowGap: SPACE.md }}>
        <LargeHeader title={S.ritualsTitle} eyebrow={S.ritualsEyebrow} />
        <Para muted>{t(S.ritualsIntro(RITUALS.length))}</Para>

        {/* The featured Upakarma guide, as the website's gold banner. */}
        <BentoTile
          strong
          onPress={() => router.push('/explore/rituals/upakarma')}
          accessibilityLabel={`${t(S.ritualFeatured)}: ${t(S.upakarmaTitle)}. ${t(S.upakarmaShort)}`}
          glow={palette.dark ? 'rgba(251,191,36,0.26)' : 'rgba(217,119,6,0.16)'}
          tint={palette.dark ? 'rgba(251,191,36,0.06)' : 'rgba(253,230,138,0.22)'}
          style={{ rowGap: SPACE.sm }}>
          <HuePill label={t(S.ritualFeatured)} hue="gold" />
          <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: SPACE.md }}>
            <Text allowFontScaling={false} style={{ fontSize: 34 }}>
              🧵
            </Text>
            <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ flex: 1, color: palette.text, fontSize: TYPE.title3, fontWeight: '800' }}>
              {t(S.upakarmaTitle)}
            </Text>
            <Ionicons name="chevron-forward" size={18} color={palette.muted} />
          </View>
          <Muted style={{ fontSize: TYPE.footnote }}>{t(S.upakarmaShort)}</Muted>
        </BentoTile>

        <View style={[styles.search, glass(palette)]}>
          <Ionicons name="search" size={18} color={palette.muted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t(S.ritualSearch)}
            placeholderTextColor={palette.muted}
            accessibilityLabel={t(S.ritualSearch)}
            maxFontSizeMultiplier={UI_FONT_CAP}
            returnKeyType="search"
            style={{ flex: 1, minHeight: TOUCH, color: palette.text, fontSize: scriptSize(TYPE.callout, lang) }}
          />
          {query ? (
            <Pressable accessibilityRole="button" accessibilityLabel={t(S.ritualClear)} onPress={() => setQuery('')} hitSlop={8} style={styles.clear}>
              <Ionicons name="close-circle" size={20} color={palette.muted} />
            </Pressable>
          ) : null}
        </View>
        <View accessibilityRole="radiogroup" style={styles.chips}>
          {RITUAL_CATEGORIES.map((c) => (
            <Chip key={c} label={t(CATEGORY_LABEL[c])} active={category === c} onPress={() => setCategory(c)} />
          ))}
        </View>

        <GroupTitle title={t(CATEGORY_LABEL[category])} detail={t(S.ritualCount(list.length))} />
        <LangNote content="hi" />
        {list.length === 0 ? (
          <Card style={{ alignItems: 'center', rowGap: SPACE.sm }}>
            <Para>{t(S.ritualNone)}</Para>
            <Chip
              label={t(S.ritualShowAll(RITUALS.length))}
              onPress={() => {
                setQuery('');
                setCategory('all');
              }}
            />
          </Card>
        ) : (
          list.map((r, i) => (
            <Animated.View key={r.id} entering={stagger(i)}>
              <RitualRow r={r} warn={hues.gold} />
            </Animated.View>
          ))
        )}
      </Animated.ScrollView>
    </Backdrop>
  );
}

function RitualRow({ r, warn }: { r: Ritual; warn: string }) {
  const { palette } = usePrefs();
  const { t } = useI18n();
  const [from, to] = festivalColors(r.gradient);
  return (
    <PressableScale
      onPress={() => router.push({ pathname: '/explore/rituals/[id]', params: { id: r.id } })}
      accessibilityRole="button"
      accessibilityLabel={`${r.name}, ${r.sanskrit}. ${r.shortDesc}${r.requiresInitiation ? `. ${t(S.ritualInitiation)}` : ''}`}
      style={[styles.row, glass(palette)]}>
      <View style={[styles.stripe, { backgroundColor: from }, !palette.lite && { backgroundImage: `linear-gradient(90deg, ${from} 0%, ${to} 100%)` }]} />
      <View style={[styles.icon, { backgroundColor: from }, !palette.lite && { backgroundImage: `linear-gradient(140deg, ${from} 0%, ${to} 100%)` }]}>
        <Text allowFontScaling={false} style={{ fontSize: 26 }}>
          {r.icon}
        </Text>
      </View>
      <View style={{ flex: 1, rowGap: 2 }}>
        <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.title3, fontFamily: SANSKRIT_FONT }}>
          {r.sanskrit}
        </Text>
        <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.textSecondary, fontSize: TYPE.footnote, fontWeight: '600' }}>
          {r.name}
        </Text>
        <Muted style={{ fontSize: TYPE.footnote, marginTop: 2 }}>{r.shortDesc}</Muted>
        {r.requiresInitiation ? (
          <View style={[styles.warn, { backgroundColor: quietFill(palette) }]}>
            <Ionicons name="alert-circle" size={14} color={warn} />
            <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: warn, fontSize: TYPE.caption, fontWeight: '700' }}>
              {t(S.ritualInitiation)}
            </Text>
          </View>
        ) : null}
      </View>
      <Ionicons name="chevron-forward" size={18} color={palette.muted} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  search: { flexDirection: 'row', alignItems: 'center', columnGap: SPACE.sm, borderRadius: RADIUS.pill, paddingHorizontal: SPACE.md },
  clear: { minWidth: 32, minHeight: 32, alignItems: 'center', justifyContent: 'center' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACE.sm },
  row: { flexDirection: 'row', alignItems: 'center', columnGap: SPACE.md, borderRadius: RADIUS.card, padding: SPACE.md, paddingTop: SPACE.md + 3, overflow: 'hidden' },
  stripe: { position: 'absolute', top: 0, left: 0, right: 0, height: 3 },
  icon: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  warn: { flexDirection: 'row', alignItems: 'center', columnGap: 4, alignSelf: 'flex-start', borderRadius: RADIUS.pill, paddingHorizontal: SPACE.sm, paddingVertical: 2, marginTop: SPACE.xs },
});
