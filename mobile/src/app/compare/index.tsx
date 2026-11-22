import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BentoDepth, BentoTile } from '@/components/bento';
import { encodeVerse } from '@/components/compare-ui';
import { ActionButton, VersePickSheet } from '@/components/desk-ui';
import { Backdrop, GroupTitle, LargeHeader } from '@/components/ui';
import { COMPARE_SETS, verseLabel } from '@/content/compare';
import { D, useI18n } from '@/i18n';
import { queueKey, type QueueItem } from '@/lib/desk';
import { useScrollY } from '@/motion/parallax';
import { TitleBar } from '@/motion/title-bar';
import { useAppState } from '@/state/app-state';
import { useDesk } from '@/state/desk';
import { huesFor, quietFill, RADIUS, SPACE, TITLE_FONT_CAP, TOUCH, TYPE, UI_FONT_CAP } from '@/theme/themes';

export { ErrorBoundary } from '@/components/error-boundary';

const SET_HUES = ['saffron', 'indigo', 'peacock', 'lotus', 'gold', 'tulsi'] as const;

/**
 * Scripture pages side by side, as the website's /compare: the website's comparison sets, plus any two
 * verses the reader picks from their saved verses and queue, shown next to each other.
 */
export default function CompareScreen() {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const { palette, bookmarks } = useAppState();
  const { desk } = useDesk();
  const { t, lang } = useI18n();
  const hues = huesFor(palette);
  const { scrollY, onScroll } = useScrollY();
  const depth = useMemo(() => ({ scrollY, windowHeight: height }), [scrollY, height]);
  const [a, setA] = useState<QueueItem | null>(null);
  const [b, setB] = useState<QueueItem | null>(null);
  const [picking, setPicking] = useState<'A' | 'B' | null>(null);

  // Saved verses first, then queued ones not saved, without repeats.
  const choices = useMemo(() => {
    const seen = new Set<string>();
    const out: QueueItem[] = [];
    for (const v of [...bookmarks, ...desk.queue]) {
      const q = { id: v.id, chapter: v.chapter, verse: v.verse };
      if (seen.has(queueKey(q))) continue;
      seen.add(queueKey(q));
      out.push(q);
    }
    return out;
  }, [bookmarks, desk.queue]);

  const slot = (name: 'A' | 'B', value: QueueItem | null, color: string) => (
    <Pressable
      onPress={() => setPicking(name)}
      accessibilityRole="button"
      accessibilityLabel={`${t(D.compareSlot(name))}: ${value ? verseLabel(value.id, value.chapter, value.verse, lang) : t(D.compareChoose)}`}
      style={({ pressed }) => [styles.slot, { backgroundColor: quietFill(palette), borderColor: color }, pressed && { opacity: 0.7 }]}>
      <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color, fontSize: TYPE.caption, fontWeight: '800' }}>
        {t(D.compareSlot(name))}
      </Text>
      <Text maxFontSizeMultiplier={TITLE_FONT_CAP} numberOfLines={2} style={{ color: value ? palette.text : palette.muted, fontSize: TYPE.subhead, fontWeight: '600' }}>
        {value ? verseLabel(value.id, value.chapter, value.verse, lang) : t(D.compareChoose)}
      </Text>
    </Pressable>
  );

  return (
    <Backdrop>
      <Stack.Screen options={{ title: '', headerTransparent: true, headerStyle: { backgroundColor: 'transparent' } }} />
      <BentoDepth.Provider value={depth}>
        <Animated.ScrollView
          onScroll={onScroll}
          scrollEventThrottle={16}
          style={{ backgroundColor: 'transparent' }}
          contentContainerStyle={{ paddingTop: insets.top + 24, paddingHorizontal: SPACE.lg, paddingBottom: insets.bottom + SPACE.xxl * 2, rowGap: SPACE.md }}>
          <LargeHeader title={D.compareTitle} eyebrow={D.compareEyebrow} subtitle={t(D.compareSub)} scrollY={scrollY} />

          <BentoTile strong glow={`${hues.indigo}2e`} style={{ rowGap: SPACE.md }}>
            <View>
              <Text accessibilityRole="header" maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.title3, fontWeight: '800' }}>
                {t(D.comparePairTitle)}
              </Text>
              <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.footnote, marginTop: 2 }}>
                {t(D.comparePairSub)}
              </Text>
            </View>
            <View style={styles.slots}>
              {slot('A', a, hues.saffron)}
              <Ionicons name="swap-horizontal" size={20} color={palette.muted} />
              {slot('B', b, hues.indigo)}
            </View>
            <ActionButton
              primary
              icon="git-compare"
              label={t(D.compareShow)}
              disabled={!a || !b}
              onPress={() => a && b && router.push({ pathname: '/compare/[id]', params: { id: 'pair', a: encodeVerse(a), b: encodeVerse(b) } })}
            />
          </BentoTile>

          <GroupTitle title={t(D.compareSets)} />
          {COMPARE_SETS.map((c, i) => {
            const hue = hues[SET_HUES[i % SET_HUES.length]];
            return (
              <BentoTile
                key={c.id}
                glow={`${hue}2e`}
                accessibilityLabel={`${t(c.title)}. ${t(c.blurb)}`}
                onPress={() => router.push({ pathname: '/compare/[id]', params: { id: c.id } })}
                style={{ flexDirection: 'row', alignItems: 'center', columnGap: SPACE.md }}>
                <View style={[styles.mark, { borderColor: hue }]}>
                  <Text allowFontScaling={false} style={{ color: hue, fontSize: TYPE.title3, fontWeight: '800' }}>
                    {c.links.length}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.body, fontWeight: '700' }}>
                    {t(c.title)}
                  </Text>
                  <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.footnote, marginTop: 1 }}>
                    {t(c.blurb)}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={palette.muted} />
              </BentoTile>
            );
          })}
        </Animated.ScrollView>
      </BentoDepth.Provider>
      <TitleBar scrollY={scrollY} title={D.compareTitle} />

      <VersePickSheet
        visible={picking !== null}
        title={picking ? t(D.compareSlot(picking)) : ''}
        items={choices}
        empty={t(D.noSavedYet)}
        onClose={() => setPicking(null)}
        onPick={(q) => {
          if (picking === 'A') setA(q);
          else setB(q);
          setPicking(null);
        }}
        header={
          <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.footnote, marginBottom: SPACE.sm, paddingHorizontal: SPACE.xs }}>
            {t(D.comparePickSource)}
          </Text>
        }
      />
    </Backdrop>
  );
}

const styles = StyleSheet.create({
  slots: { flexDirection: 'row', alignItems: 'center', columnGap: SPACE.sm },
  slot: { flex: 1, minHeight: TOUCH + 24, borderRadius: RADIUS.row, borderWidth: 1.5, padding: SPACE.md, rowGap: 2, justifyContent: 'center' },
  mark: { width: 44, height: 44, borderRadius: 22, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
});
