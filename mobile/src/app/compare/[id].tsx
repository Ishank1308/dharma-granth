import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CompareLinkRow, CompareVerse, decodeVerse, encodeVerse } from '@/components/compare-ui';
import { ActionButton } from '@/components/desk-ui';
import { Backdrop, GroupCard, LargeHeader, Muted } from '@/components/ui';
import { compareSet, verseLabel } from '@/content/compare';
import { D, S, useI18n } from '@/i18n';
import type { QueueItem } from '@/lib/desk';
import { usePrefs } from '@/state/app-state';
import { huesFor, SPACE, type Hues } from '@/theme/themes';

export { ErrorBoundary } from '@/components/error-boundary';

const COLUMN_HUES: (keyof Hues)[] = ['saffron', 'indigo', 'peacock', 'lotus'];

/**
 * Pages side by side. On a wide screen (a tablet, or a phone held sideways) the verses stand in columns;
 * on a phone held upright they are stacked, each in its own hue, so every line of each shloka stays whole
 * and readable. `pair` shows two verses the reader picked (params a and b).
 */
export default function CompareSetScreen() {
  const params = useLocalSearchParams<{ id: string; a?: string; b?: string }>();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { palette } = usePrefs();
  const { t, lang } = useI18n();
  const hues = huesFor(palette);
  const wide = width >= 600;

  const pair = params.id === 'pair';
  const set = pair ? undefined : compareSet(String(params.id));
  const verses: QueueItem[] = useMemo(() => {
    if (pair) return [decodeVerse(params.a), decodeVerse(params.b)].filter((v): v is QueueItem => v !== null);
    return (set?.links ?? []).flatMap((l) => (l.target.kind === 'verse' ? [{ id: l.target.id, chapter: l.target.chapter, verse: l.target.verse }] : []));
  }, [pair, set, params.a, params.b]);
  const others = (set?.links ?? []).filter((l) => l.target.kind !== 'verse');

  if (!pair && !set) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: '' }} />
        <Muted>{t(S.chapterUnavailable)}</Muted>
      </View>
    );
  }

  const title = pair ? D.comparePairTitle : set!.title;
  const subtitle = pair ? verses.map((v) => verseLabel(v.id, v.chapter, v.verse, lang)).join('  ·  ') : t(set!.blurb);

  return (
    <Backdrop>
      <Stack.Screen options={{ title: '', headerTransparent: true, headerStyle: { backgroundColor: 'transparent' } }} />
      <ScrollView
        style={{ backgroundColor: 'transparent' }}
        contentContainerStyle={{ paddingTop: insets.top + 24, paddingHorizontal: SPACE.lg, paddingBottom: insets.bottom + SPACE.xxl * 2, rowGap: SPACE.md }}>
        <LargeHeader title={title} eyebrow={D.compareTitle} subtitle={subtitle} />

        {verses.length > 0 ? (
          <View style={wide ? styles.columns : styles.stack}>
            {verses.map((v, i) => (
              <View key={`${encodeVerse(v)}:${i}`} style={wide ? { flex: 1 } : null}>
                <CompareVerse item={v} hue={COLUMN_HUES[i % COLUMN_HUES.length]} slot={pair ? (i === 0 ? 'A' : 'B') : undefined} />
              </View>
            ))}
          </View>
        ) : null}

        {pair && verses.length === 2 ? (
          <View style={styles.actions}>
            <View style={{ flex: 1 }}>
              <ActionButton
                icon="swap-horizontal"
                label={t(D.compareSwap)}
                onPress={() => router.setParams({ a: encodeVerse(verses[1]), b: encodeVerse(verses[0]) })}
              />
            </View>
            <View style={{ flex: 1 }}>
              <ActionButton
                icon="document-text-outline"
                label={t(D.compareSheetAdd)}
                onPress={() => router.push({ pathname: '/sheet', params: { add: verses.map(encodeVerse).join(',') } })}
              />
            </View>
          </View>
        ) : null}

        {others.length > 0 ? (
          <GroupCard>
            {others.map((l, i) => (
              <CompareLinkRow key={`${l.title.en}:${i}`} link={l} first={i === 0} hue={hues[COLUMN_HUES[(i + verses.length) % COLUMN_HUES.length]]} />
            ))}
          </GroupCard>
        ) : null}
      </ScrollView>
    </Backdrop>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACE.xl },
  columns: { flexDirection: 'row', columnGap: SPACE.md, alignItems: 'flex-start' },
  stack: { rowGap: SPACE.md },
  actions: { flexDirection: 'row', columnGap: SPACE.sm },
});
