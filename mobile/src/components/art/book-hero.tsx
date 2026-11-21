/**
 * A book's title page: its cover colours washed with the website's watercolour for that family of texts, a slowly
 * turning gilt mandala, and the book itself standing in 3D (Book3D), above the title and the epigraph.
 *
 * Scroll-linked when given `scrollY`: the painting drifts at a third of the page's speed and the book at a fifth,
 * so the layers separate in depth as the chapter list slides up over them. All of that switches off with light
 * effects or reduce motion, leaving the same page, still.
 */
import type { ReactNode } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Animated, { type SharedValue, useSharedValue } from 'react-native-reanimated';

import { coverFill } from '@/components/ui';
import { useParallax } from '@/motion/parallax';
import { Reveal } from '@/motion/reveal';
import { useMotion } from '@/motion/use-motion';
import { useAppState } from '@/state/app-state';
import type { Cover } from '@/theme/covers';
import { RADIUS, SPACE, TITLE_FONT_CAP, TYPE } from '@/theme/themes';

import { Book3D } from './book-3d';
import { artFor } from './cover-art';
import { Mandala } from './mandala';

export function BookHero({
  cover,
  category,
  eyebrow,
  title,
  subtitle,
  letter,
  scrollY,
  children,
}: {
  cover: Cover;
  category: string;
  eyebrow?: string;
  title: string;
  subtitle: string;
  letter: string;
  scrollY?: SharedValue<number>;
  children?: ReactNode;
}) {
  const { palette } = useAppState();
  const { rich } = useMotion();
  const fallback = useSharedValue(0);
  const y = scrollY ?? fallback;
  const art = useParallax(y, 0.33, { enabled: rich });
  const book = useParallax(y, 0.18, { enabled: rich, scaleBy: 0.08 });
  const [deep] = cover.colors;

  return (
    <View style={[styles.hero, coverFill(cover, palette, true), !palette.lite && styles.lift]}>
      {/* The painting, blended into the cover colours. */}
      {/* The blend sits on the moving layer itself: a blend inside a transformed wrapper would only blend with the wrapper. */}
      <Animated.View
        pointerEvents="none"
        style={[styles.art, { opacity: palette.lite ? 0.16 : 0.85, mixBlendMode: palette.lite ? undefined : 'soft-light' }, art]}>
        <Image
          source={artFor(category)}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
          style={{ width: '100%', height: '100%' }}
        />
      </Animated.View>
      {!palette.lite ? (
        <>
          <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundImage: `radial-gradient(65% 45% at 50% 22%, ${cover.colors[2]} 0%, transparent 72%)`, opacity: 0.5 }]} />
          {/* Deepens toward the foot, so the white title and gilt line stay readable over any painting. */}
          <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundImage: `linear-gradient(180deg, transparent 30%, ${deep}cc 78%, ${deep} 100%)` }]} />
        </>
      ) : null}

      <Animated.View style={[styles.stage, book]}>
        <Mandala size={250} color={cover.foil} opacity={0.22} spin={rich} petals={16} style={styles.mandala} />
        <Book3D cover={cover} letter={letter} width={112} />
      </Animated.View>

      <Reveal index={1} style={styles.text}>
        {eyebrow ? (
          <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={[styles.eyebrow, { color: cover.foil }]}>
            {eyebrow}
          </Text>
        ) : null}
        <Text accessibilityRole="header" maxFontSizeMultiplier={TITLE_FONT_CAP} style={styles.title}>
          {title}
        </Text>
        <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={styles.sub}>
          {subtitle}
        </Text>
        {cover.epigraph ? (
          <View style={styles.epigraph}>
            <View style={styles.ruleRow}>
              <View style={[styles.rule, { backgroundColor: cover.foil }]} />
              <Text allowFontScaling={false} style={{ color: cover.foil, fontSize: 12 }}>
                ✦
              </Text>
              <View style={[styles.rule, { backgroundColor: cover.foil }]} />
            </View>
            <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: cover.foil, fontSize: TYPE.callout + 1, lineHeight: (TYPE.callout + 1) * 1.6, textAlign: 'center' }}>
              {cover.epigraph.sa}
            </Text>
            <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: 'rgba(255,255,255,0.75)', fontSize: TYPE.caption, textAlign: 'center' }}>
              {cover.epigraph.source}
            </Text>
          </View>
        ) : null}
        {children}
      </Reveal>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { borderRadius: RADIUS.panel, overflow: 'hidden', paddingBottom: SPACE.xl },
  lift: { boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.28), 0 18px 40px rgba(10,20,50,0.32)' },
  art: { position: 'absolute', left: 0, right: 0, top: -60, bottom: -20 },
  stage: { alignItems: 'center', justifyContent: 'center', paddingTop: SPACE.lg, height: 208 },
  mandala: { position: 'absolute', top: SPACE.lg + 181 / 2 - 125 },
  text: { alignItems: 'center', paddingHorizontal: SPACE.xl - 2, rowGap: 2 },
  eyebrow: { fontSize: TYPE.caption, fontWeight: '700', letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: SPACE.xs },
  title: { color: '#ffffff', fontSize: 32, lineHeight: 48, fontWeight: '600', textAlign: 'center' },
  sub: { color: 'rgba(255,255,255,0.86)', fontSize: TYPE.subhead, textAlign: 'center' },
  epigraph: { marginTop: SPACE.md, rowGap: SPACE.xs, alignItems: 'center', alignSelf: 'stretch' },
  ruleRow: { flexDirection: 'row', alignItems: 'center', columnGap: SPACE.sm, alignSelf: 'stretch', justifyContent: 'center' },
  rule: { height: 1, flex: 1, maxWidth: 90, opacity: 0.55 },
});
