/**
 * Kinetic typography: a title arrives word by word, a verse line by line.
 *
 * - KineticText splits on spaces only, so a Devanagari word (its conjuncts, matras and the danda after it)
 *   always moves as one piece and is never broken mid-akshara. Each word rises a little and settles on a
 *   spring, one after another, as a sentence is spoken.
 * - KineticLines reveals a shloka one full line at a time. Every line is drawn complete from the start
 *   (only its opacity and position move), so a verse is never cut short, and the closing ॥ lands last.
 *
 * Both run once, as layout animations on the UI thread, so they cost the JS thread nothing. With reduce
 * motion (Android's "Remove animations" or the app's switch) the text is simply there. TalkBack reads the
 * whole title as one heading, never word by word.
 */
import { Fragment, type ReactNode } from 'react';
import { Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import Animated, { withDelay, withSpring, withTiming, type EntryAnimationsValues, type LayoutAnimation } from 'react-native-reanimated';

import { DURATION, SPRING } from './tokens';
import { useMotion } from './use-motion';

type Entering = (values: EntryAnimationsValues) => LayoutAnimation;

/** A word rising into place: up from a little below, from slightly smaller, fading in. */
function wordRise(delay: number, rise: number): Entering {
  return () => {
    'worklet';
    return {
      initialValues: { opacity: 0, transform: [{ translateY: rise }, { scale: 0.94 }] },
      animations: {
        opacity: withDelay(delay, withTiming(1, { duration: DURATION.enter })),
        transform: [{ translateY: withDelay(delay, withSpring(0, SPRING.settle)) }, { scale: withDelay(delay, withSpring(1, SPRING.settle)) }],
      },
    };
  };
}

/** A verse line easing in: a shorter rise, a slower fade, like ink settling into paper. */
function lineRise(delay: number): Entering {
  return () => {
    'worklet';
    return {
      initialValues: { opacity: 0, transform: [{ translateY: 8 }] },
      animations: {
        opacity: withDelay(delay, withTiming(1, { duration: 520 })),
        transform: [{ translateY: withDelay(delay, withSpring(0, SPRING.gentle)) }],
      },
    };
  };
}

/** A run of text in one style; `'\n'` is a line break. */
export type Segment = { text: string; style?: StyleProp<TextStyle> } | '\n';

export interface KineticTextProps {
  segments: Segment[];
  /** The style every word shares (size, weight, colour, line height). */
  style: StyleProp<TextStyle>;
  /** Wait this long before the first word, in ms. */
  delay?: number;
  /** The gap between one word and the next, in ms. */
  step?: number;
  /** How far each word rises, in dp. */
  rise?: number;
  maxFontSizeMultiplier?: number;
  /** Read as a heading by TalkBack. */
  header?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

function plain(segments: Segment[]): string {
  return segments.map((s) => (s === '\n' ? '\n' : s.text)).join('');
}

export function KineticText({ segments, style, delay = 0, step = 60, rise = 14, maxFontSizeMultiplier, header, containerStyle }: KineticTextProps) {
  const { animate } = useMotion();
  const label = plain(segments).replace(/\n/g, ' ');

  if (!animate) {
    return (
      <View accessible accessibilityRole={header ? 'header' : undefined} accessibilityLabel={label} style={containerStyle}>
        <Text maxFontSizeMultiplier={maxFontSizeMultiplier} style={style}>
          {segments.map((s, i) => (s === '\n' ? '\n' : <Text key={i} style={s.style}>{s.text}</Text>))}
        </Text>
      </View>
    );
  }

  let index = 0;
  const nodes: ReactNode[] = [];
  segments.forEach((s, si) => {
    if (s === '\n') {
      nodes.push(<View key={`br${si}`} style={{ width: '100%', height: 0 }} />);
      return;
    }
    // Words keep their trailing space, so the gap at a wrap is the same as anywhere else.
    const words = s.text.match(/\S+\s*|\s+/gu) ?? [];
    words.forEach((w, wi) => {
      const at = delay + index * step;
      index += 1;
      nodes.push(
        <Animated.Text key={`${si}-${wi}`} entering={wordRise(at, rise)} maxFontSizeMultiplier={maxFontSizeMultiplier} style={[style, s.style]}>
          {w}
        </Animated.Text>,
      );
    });
  });

  return (
    <View
      accessible
      accessibilityRole={header ? 'header' : undefined}
      accessibilityLabel={label}
      style={[{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-end' }, containerStyle]}>
      {nodes}
    </View>
  );
}

export interface KineticLinesProps {
  lines: string[];
  style: StyleProp<TextStyle>;
  /** The closing mark after the last line (॥), in its own colour. */
  seal?: { text: string; color: string };
  delay?: number;
  step?: number;
  maxFontSizeMultiplier?: number;
}

/** A verse, every line complete, revealed one line after another. */
export function KineticLines({ lines, style, seal, delay = 120, step = 180, maxFontSizeMultiplier }: KineticLinesProps) {
  const { animate } = useMotion();
  const last = lines.length - 1;
  const Line = animate ? Animated.Text : Text;
  return (
    <>
      {lines.map((l, i) => (
        <Line key={i} entering={animate ? lineRise(delay + i * step) : undefined} maxFontSizeMultiplier={maxFontSizeMultiplier} style={style}>
          {l}
          {i === last && seal ? (
            <Fragment>
              {' '}
              <Text style={{ color: seal.color }}>{seal.text}</Text>
            </Fragment>
          ) : null}
        </Line>
      ))}
    </>
  );
}

