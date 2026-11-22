/**
 * Shared pieces of the Wisdom pathways screens (src/app/pathways): each pathway's hue, opening one, and the
 * breathing pause from the website's "Pause and reflect" block, drawn as a lamp-lit circle that swells on the
 * in-breath and settles on the out-breath.
 */
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { AccessibilityInfo, StyleSheet, Text, View } from 'react-native';
import Animated, { cancelAnimation, Easing, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

import { knowledge } from '@/content/knowledge';
import { S, useI18n } from '@/i18n';
import { useMotion } from '@/motion/use-motion';
import { usePrefs } from '@/state/app-state';
import { TYPE, UI_FONT_CAP, type Hues } from '@/theme/themes';

/** Each pathway keeps one hue, so its tile, its page and its stages read as one thing. */
const PATH_HUES: (keyof Hues)[] = ['saffron', 'indigo', 'tulsi', 'lotus', 'peacock', 'gold', 'vermilion'];

export function pathwayHue(id: string): keyof Hues {
  const i = Math.max(0, knowledge('pathways').items.findIndex((p) => p.id === id));
  return PATH_HUES[i % PATH_HUES.length];
}

export function openPathway(slug: string, starter?: string) {
  router.push({ pathname: '/pathways/[slug]', params: starter ? { slug, starter } : { slug } });
}

/** One breath: four seconds in, six out, the slow exhale that calms. */
const IN_MS = 4000;
const OUT_MS = 6000;

/**
 * The breathing circle. It swells and settles with the breath and names each half; with reduce motion it is a
 * still circle and the website's sentence ("Breathe in… breathe out…"). TalkBack hears the sentence once.
 */
export function BreathingCircle({ color }: { color: string }) {
  const { palette } = usePrefs();
  const { t } = useI18n();
  const { animate } = useMotion();
  const breath = useSharedValue(0);
  const [inhale, setInhale] = useState(true);

  useEffect(() => {
    AccessibilityInfo.announceForAccessibility(t(S.pathwayBreatheStill));
    if (!animate) return;
    breath.set(
      withRepeat(
        withSequence(
          withTiming(1, { duration: IN_MS, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: OUT_MS, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
      ),
    );
    // The words follow the circle on the JS side; a timer is enough for a label.
    let on = true;
    let timer: ReturnType<typeof setTimeout>;
    const step = (isIn: boolean) => {
      if (!on) return;
      setInhale(isIn);
      timer = setTimeout(() => step(!isIn), isIn ? IN_MS : OUT_MS);
    };
    step(true);
    return () => {
      on = false;
      clearTimeout(timer);
      cancelAnimation(breath);
    };
  }, [animate, breath, t]);

  const circle = useAnimatedStyle(() => ({ transform: [{ scale: 0.62 + breath.value * 0.38 }], opacity: 0.55 + breath.value * 0.45 }));

  return (
    <View style={styles.wrap} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
      <View style={[styles.outer, { borderColor: `${color}55` }]}>
        <Animated.View
          style={[
            styles.inner,
            { backgroundColor: `${color}${palette.dark ? '40' : '26'}`, borderColor: color },
            palette.lite ? null : { backgroundImage: `radial-gradient(circle, ${color}66 0%, ${color}14 70%)` },
            circle,
          ]}
        />
        <Text maxFontSizeMultiplier={UI_FONT_CAP} style={[styles.word, { color: palette.text }]}>
          {animate ? t(inhale ? S.pathwayBreatheIn : S.pathwayBreatheOut) : ''}
        </Text>
      </View>
      {!animate ? (
        <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.footnote, textAlign: 'center' }}>
          {t(S.pathwayBreatheStill)}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', rowGap: 8, paddingVertical: 8 },
  outer: { width: 168, height: 168, borderRadius: 84, borderWidth: 1, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
  inner: { position: 'absolute', width: 150, height: 150, borderRadius: 75, borderWidth: 1.5 },
  word: { fontSize: TYPE.callout, fontWeight: '700' },
});
