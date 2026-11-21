/**
 * A book's title page, and the one lavish thing in the app. The rest of the interface stays quiet, so that
 * opening a book feels like opening a book.
 *
 * Set like an illuminated manuscript's title page: the book's cover colours, washed with the website's
 * watercolour for that family of texts, a gilt mandala behind the book itself standing in 3D (Book3D), then
 * the title in Tiro Devanagari (the website's shloka face), the English name and the size of the book in plain
 * words, and the title-page line set between dandas (॥), the way a verse closes in the text.
 *
 * Motion is one orchestrated moment: as the page opens, the book turns from its spine to face you and settles,
 * the mandala blooms behind it, and the words arrive after it. Nothing else on the page animates on its own
 * (scroll parallax only follows your finger). With reduce motion the page is simply there; with light effects
 * the painting is a faint static wash and the mandala is still.
 */
import { useEffect, type ReactNode } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming, type SharedValue } from 'react-native-reanimated';

import { coverFill } from '@/components/ui';
import { useParallax } from '@/motion/parallax';
import { DURATION, SPRING } from '@/motion/tokens';
import { useMotion } from '@/motion/use-motion';
import { useAppState } from '@/state/app-state';
import type { Cover } from '@/theme/covers';
import { RADIUS, SPACE, TITLE_FONT_CAP, TYPE } from '@/theme/themes';

import { Book3D } from './book-3d';
import { artFor } from './cover-art';
import { Mandala } from './mandala';

/**
 * Tiro Devanagari Sanskrit, embedded by the typography work (#429, src/theme/fonts.ts). Until that font is in
 * the build the phone's own Devanagari face is used, so nothing breaks without it.
 */
const TITLE_FACE = 'TiroDevanagariSanskrit';

export function BookHero({
  cover,
  category,
  kind,
  title,
  englishTitle,
  facts,
  letter,
  scrollY,
  children,
}: {
  cover: Cover;
  /** Category key, for the painting. */
  category: string;
  /** The family of texts in the reader's language ("Itihasa", "इतिहास"). */
  kind?: string;
  /** The title in Devanagari. */
  title: string;
  englishTitle?: string;
  /** The book's size in plain words ("18 chapters and 701 verses"). */
  facts: string;
  letter: string;
  scrollY?: SharedValue<number>;
  children?: ReactNode;
}) {
  const { palette } = useAppState();
  const { animate, rich } = useMotion();
  const fallback = useSharedValue(0);
  const y = scrollY ?? fallback;
  const art = useParallax(y, 0.33, { enabled: rich });
  const stage = useParallax(y, 0.18, { enabled: rich, scaleBy: 0.08 });

  // The opening: 0 → 1 for the book, the mandala and the words, each on its own clock.
  const book = useSharedValue(animate ? 0 : 1);
  const bloom = useSharedValue(animate ? 0 : 1);
  const words = useSharedValue(animate ? 0 : 1);
  useEffect(() => {
    if (!animate) return;
    book.set(withSpring(1, SPRING.gentle));
    bloom.set(withDelay(120, withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) })));
    words.set(withDelay(260, withTiming(1, { duration: DURATION.enter, easing: Easing.out(Easing.quad) })));
  }, [animate, book, bloom, words]);

  const bookIn = useAnimatedStyle(() => ({
    opacity: Math.min(1, book.value * 1.6),
    transform: [{ perspective: 900 }, { translateY: (1 - book.value) * 26 }, { rotateY: `${(1 - book.value) * -38}deg` }, { scale: 0.92 + book.value * 0.08 }],
  }));
  const bloomIn = useAnimatedStyle(() => ({ opacity: bloom.value, transform: [{ scale: 0.82 + bloom.value * 0.18 }, { rotate: `${(1 - bloom.value) * -24}deg` }] }));
  const wordsIn = useAnimatedStyle(() => ({ opacity: words.value, transform: [{ translateY: (1 - words.value) * 8 }] }));

  const [deep] = cover.colors;

  return (
    <View style={[styles.hero, coverFill(cover, palette, true), !palette.lite && styles.lift]}>
      {/* The painting, blended into the cover colours. The blend sits on the moving layer itself: a blend inside
          a transformed wrapper would only blend with the wrapper. */}
      <Animated.View
        pointerEvents="none"
        style={[styles.art, { opacity: palette.lite ? 0.16 : 0.85, mixBlendMode: palette.lite ? undefined : 'soft-light' }, art]}>
        <Image source={artFor(category)} resizeMode="cover" accessibilityIgnoresInvertColors style={{ width: '100%', height: '100%' }} />
      </Animated.View>
      {!palette.lite ? (
        <>
          <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundImage: `radial-gradient(60% 40% at 50% 24%, ${cover.colors[2]} 0%, transparent 72%)`, opacity: 0.45 }]} />
          {/* Deepens toward the foot, so the white title and the gilt line stay readable over any painting. */}
          <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundImage: `linear-gradient(180deg, transparent 34%, ${deep}d9 72%, ${deep} 100%)` }]} />
        </>
      ) : null}

      <Animated.View style={[styles.stage, stage]}>
        <Animated.View style={[styles.mandala, bloomIn]}>
          <Mandala size={250} color={cover.foil} opacity={0.24} spin={rich} petals={16} />
        </Animated.View>
        <Animated.View style={bookIn}>
          <Book3D cover={cover} letter={letter} width={112} />
        </Animated.View>
      </Animated.View>

      <Animated.View style={[styles.words, wordsIn]}>
        {kind ? (
          <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={[styles.kind, { color: cover.foil }]}>
            {kind}
          </Text>
        ) : null}
        <Text accessibilityRole="header" maxFontSizeMultiplier={TITLE_FONT_CAP} style={styles.title}>
          {title}
        </Text>
        {englishTitle ? (
          <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={styles.english}>
            {englishTitle}
          </Text>
        ) : null}
        <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={styles.facts}>
          {facts}
        </Text>
        {cover.epigraph ? (
          <View style={styles.epigraph}>
            {/* Between dandas, as a verse closes in the text itself (a line that already ends in one keeps just the pair). */}
            <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={[styles.line, { color: cover.foil }]}>
              ॥ {cover.epigraph.sa.replace(/[\s।॥]+$/, '')} ॥
            </Text>
            <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={styles.source}>
              {cover.epigraph.source}
            </Text>
          </View>
        ) : null}
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { borderRadius: RADIUS.panel, overflow: 'hidden', paddingBottom: SPACE.xl },
  lift: { boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.28), 0 18px 40px rgba(10,20,50,0.32)' },
  art: { position: 'absolute', left: 0, right: 0, top: -60, bottom: -20 },
  stage: { alignItems: 'center', justifyContent: 'center', paddingTop: SPACE.lg, height: 212 },
  mandala: { position: 'absolute', top: SPACE.lg + 181 / 2 - 125 },
  // Centred: a title page is the one place in the app where the text sits on the axis of the book.
  words: { alignItems: 'center', paddingHorizontal: SPACE.xl - 2 },
  kind: { fontSize: TYPE.footnote, fontWeight: '600', marginBottom: SPACE.xs },
  // The largest type in the app, and the only Devanagari display face: the book's name, as on its cover.
  title: { fontFamily: TITLE_FACE, color: '#ffffff', fontSize: 38, lineHeight: 58, textAlign: 'center' },
  english: { color: '#ffffff', fontSize: TYPE.body, fontWeight: '600', textAlign: 'center', marginTop: -2 },
  facts: { color: 'rgba(255,255,255,0.74)', fontSize: TYPE.subhead, textAlign: 'center', marginTop: 2 },
  epigraph: { marginTop: SPACE.lg, rowGap: 2, alignItems: 'center', maxWidth: 320 },
  line: { fontFamily: TITLE_FACE, fontSize: TYPE.title3 + 1, lineHeight: (TYPE.title3 + 1) * 1.7, textAlign: 'center' },
  source: { color: 'rgba(255,255,255,0.7)', fontSize: TYPE.caption, textAlign: 'center' },
});
