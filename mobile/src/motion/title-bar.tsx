/**
 * The top of a tab screen as the large title scrolls away, after Apple's large titles and scroll edge effect:
 *
 * - A scroll-edge fade under the status bar is always there, so list text never collides with the clock and
 *   icons. It fades the page into the backdrop rather than drawing a hard bar.
 * - As the large title slides under it, a compact glass bar fades in with the same title, centred. The large
 *   title fades out at the same moment (LargeHeader's `scrollY`), so there is always exactly one title.
 *
 * The bar takes no touches, so it never blocks a row under it. With light effects the fade is a flat tint.
 *
 *   const { scrollY, onScroll } = useScrollY();
 *   <Animated.FlatList onScroll={onScroll} ListHeaderComponent={<LargeHeader scrollY={scrollY} … />} />
 *   <TitleBar scrollY={scrollY} title={S.savedTitle} />
 */
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, { type SharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { barSurface } from '@/components/ui';
import { usePrefs } from '@/state/app-state';
import { TYPE } from '@/theme/themes';

import { titleSwap, useScrollProgressStyle } from './parallax';

export const TITLE_BAR_HEIGHT = 48;

export function TitleBar({ scrollY, title }: { scrollY: SharedValue<number>; title: { en: string; hi: string } }) {
  const { palette, lang } = usePrefs();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const [start, end] = titleSwap(height);
  const bar = useScrollProgressStyle(scrollY, start, end);
  const label = useScrollProgressStyle(scrollY, start + 10, end + 10, 6);
  const fadeTo = palette.bg;

  return (
    <View pointerEvents="none" style={[styles.wrap, { height: insets.top + TITLE_BAR_HEIGHT + 24 }]}>
      {/* Scroll edge: the page fades into the backdrop under the status bar. */}
      <View
        style={[
          styles.edge,
          { height: insets.top + 20 },
          palette.lite
            ? { backgroundColor: fadeTo, opacity: 0.85, height: insets.top }
            : { backgroundImage: `linear-gradient(180deg, ${fadeTo} 0%, ${fadeTo}cc ${Math.round((insets.top / (insets.top + 20)) * 100)}%, transparent 100%)` },
        ]}
      />
      <Animated.View
        style={[
          styles.bar,
          { height: insets.top + TITLE_BAR_HEIGHT, paddingTop: insets.top, backgroundColor: barSurface(palette), borderBottomColor: palette.border },
          bar,
        ]}>
        <Animated.View style={label}>
          <Text numberOfLines={1} maxFontSizeMultiplier={1.3} style={{ color: palette.text, fontSize: TYPE.body, fontWeight: '700', letterSpacing: lang === 'hi' ? 0 : -0.2 }}>
            {lang === 'hi' ? title.hi : title.en}
          </Text>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', top: 0, left: 0, right: 0 },
  edge: { position: 'absolute', top: 0, left: 0, right: 0 },
  bar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
