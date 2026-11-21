import type { ReactNode } from 'react';
import { StyleSheet, Text, View, type TextStyle } from 'react-native';

import { Card } from '@/components/ui';
import type { AshtavakraVerse } from '@/content/ashtavakra-types';
import { verseInChapter } from '@/content/ashtavakra';
import type { Msg } from '@/i18n';
import { sanskritLines, toDevanagari } from '@/lib/verse-format';
import { useAppState } from '@/state/app-state';
import { fontCap, SPACE, TYPE } from '@/theme/themes';

/** Paragraphs split on blank lines, in the reader's text size. */
export function Prose({ text, tone = 'text', size = TYPE.callout }: { text?: string; tone?: 'text' | 'secondary'; size?: number }) {
  const { palette, settings } = useAppState();
  if (!text) return null;
  const scale = settings.textScale;
  const style: TextStyle = {
    color: tone === 'text' ? palette.text : palette.textSecondary,
    fontSize: size * scale,
    lineHeight: size * scale * 1.65,
  };
  return (
    <View style={{ rowGap: SPACE.sm }}>
      {text
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean)
        .map((p, i) => (
          <Text key={i} selectable maxFontSizeMultiplier={fontCap(scale)} style={style}>
            {p}
          </Text>
        ))}
    </View>
  );
}

/** A small hued label over a block, as the website's study layers. */
export function LayerLabel({ msg, hue, extra }: { msg: Msg; hue: string; extra?: string }) {
  const { palette, lang } = useAppState();
  return (
    <View style={styles.labelRow}>
      <View style={[styles.dot, { backgroundColor: hue }]} />
      <Text style={[styles.label, { color: hue }, lang === 'hi' && styles.labelHi]}>{msg[lang]}</Text>
      {extra ? <Text style={[styles.badge, { color: palette.muted, borderColor: palette.border }]}>{extra}</Text> : null}
    </View>
  );
}

/** A section of a verse or chapter: a hued label and its content on one glass card. */
export function StudySection({ msg, hue, children }: { msg: Msg; hue: string; children: ReactNode }) {
  return (
    <Card style={{ marginBottom: SPACE.md }}>
      <LayerLabel msg={msg} hue={hue} />
      <View style={{ rowGap: SPACE.md, marginTop: SPACE.xs }}>{children}</View>
    </Card>
  );
}

/** A sub-heading inside a section. */
export function SubLabel({ msg }: { msg: Msg }) {
  const { palette, lang } = useAppState();
  return <Text style={{ color: palette.muted, fontSize: TYPE.footnote, fontWeight: '700', marginBottom: 2 }}>{msg[lang]}</Text>;
}

/** The whole shloka, every line, with the gilt ॥ N ॥ mark. Never cut short (CLAUDE.md rule 4). */
export function Shloka({ verse, size = TYPE.title3 }: { verse: AshtavakraVerse; size?: number }) {
  const { palette, settings } = useAppState();
  const lines = sanskritLines(verse.sanskrit);
  const scale = settings.textScale;
  return (
    <View
      style={[
        styles.shloka,
        {
          backgroundColor: palette.dark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.55)',
          borderColor: palette.dark ? 'rgba(227,178,60,0.18)' : 'rgba(180,120,40,0.16)',
        },
        !palette.lite && {
          backgroundImage: palette.dark
            ? 'radial-gradient(90% 80% at 50% 0%, rgba(227,178,60,0.12) 0%, rgba(255,255,255,0) 70%)'
            : 'radial-gradient(90% 80% at 50% 0%, rgba(255,255,255,0.9) 0%, rgba(215,134,42,0.10) 100%)',
        },
      ]}>
      {lines.map((line, i) => (
        <Text
          key={i}
          selectable
          maxFontSizeMultiplier={fontCap(scale)}
          style={{ color: palette.text, fontSize: size * scale, lineHeight: size * scale * 1.65, textAlign: 'center' }}>
          {/* A danda stays on the line of the word before it, as the website's keepDanda. */}
          {line.replace(/ (॥|।)/g, '\u00a0$1')}
          {i === lines.length - 1 ? (
            <Text style={{ color: palette.gold }}>{` ॥ ${toDevanagari(verseInChapter(verse.verseNumber))} ॥`}</Text>
          ) : null}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  labelRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', columnGap: 6, marginBottom: 2 },
  dot: { width: 7, height: 7, borderRadius: 4 },
  label: { fontSize: TYPE.caption, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6 },
  labelHi: { fontSize: TYPE.footnote, letterSpacing: 0 },
  badge: { fontSize: 10, borderWidth: StyleSheet.hairlineWidth, borderRadius: 6, paddingHorizontal: 4 },
  shloka: { rowGap: 2, paddingVertical: SPACE.md + 2, paddingHorizontal: SPACE.sm, borderRadius: 18, borderWidth: 1 },
});
