import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View, type TextStyle } from 'react-native';

import { S, type Lang } from '@/i18n';
import { lightMarkdown, parseModernContext } from '@/lib/modern-context';
import { fontCap, huesFor, SPACE, TOUCH, TYPE, type Palette } from '@/theme/themes';

function Markdown({ text, style, palette, numberOfLines, cap }: { text: string; style: TextStyle; palette: Palette; numberOfLines?: number; cap: number }) {
  const blocks = lightMarkdown(text);
  if (numberOfLines) {
    // Collapsed: one run of text, cut at a line count.
    return (
      <Text selectable numberOfLines={numberOfLines} maxFontSizeMultiplier={cap} style={style}>
        {blocks.map((b) => b.parts.map((p) => p.text).join('')).join('\n')}
      </Text>
    );
  }
  return (
    <View style={{ rowGap: 6 }}>
      {blocks.map((b, i) => (
        <View key={i} style={b.kind === 'li' ? styles.li : undefined}>
          {b.kind === 'li' ? <Text maxFontSizeMultiplier={cap} style={[style, { color: palette.muted }]}>•</Text> : null}
          <Text selectable maxFontSizeMultiplier={cap} style={[style, { flex: 1 }]}>
            {b.parts.map((p, j) =>
              p.bold ? (
                <Text key={j} style={{ fontWeight: '700' }}>
                  {p.text}
                </Text>
              ) : (
                p.text
              ),
            )}
          </Text>
        </View>
      ))}
    </View>
  );
}

/**
 * जीवन सूत्र: the verse brought into daily life, as the website's Modern Context block. आधुनिक संदर्भ opens
 * at a few lines; the practical steps and the चिंतन प्रश्न follow on a tap.
 */
export function LifeLesson({ text, palette, lang, scale, draftBadge }: { text: string; palette: Palette; lang: Lang; scale: number; draftBadge?: string }) {
  const [open, setOpen] = useState(false);
  const hues = huesFor(palette);
  const cap = fontCap(scale);
  const { context, application, question } = parseModernContext(text);
  const body: TextStyle = { color: palette.text, fontSize: TYPE.callout * scale, lineHeight: TYPE.callout * scale * 1.6 };
  const sub: TextStyle = { color: palette.muted, fontSize: TYPE.footnote, fontWeight: '700', marginBottom: 4 };
  const long = Boolean(application || question) || context.length > 240;

  return (
    <View
      style={[
        styles.panel,
        { borderLeftColor: hues.gold, backgroundColor: palette.dark ? 'rgba(251,191,36,0.08)' : 'rgba(180,83,9,0.06)' },
      ]}>
      <View style={styles.labelRow}>
        <Ionicons name="sparkles" size={12} color={hues.gold} />
        <Text style={[styles.label, { color: hues.gold }, lang === 'hi' && styles.labelHi]}>{S.labelLifeLesson[lang]}</Text>
        {draftBadge ? <Text style={[styles.badge, { color: palette.muted, borderColor: palette.border }]}>{draftBadge}</Text> : null}
      </View>
      {context ? <Markdown text={context} style={body} palette={palette} cap={cap} numberOfLines={open || !long ? undefined : 4} /> : null}
      {open && application ? (
        <View style={{ marginTop: SPACE.md }}>
          <Text style={sub}>{S.lifeApplication[lang]}</Text>
          <Markdown text={application} style={body} palette={palette} cap={cap} />
        </View>
      ) : null}
      {open && question ? (
        <View style={[styles.question, { borderLeftColor: hues.saffron }]}>
          <Text style={sub}>{S.lifeQuestion[lang]}</Text>
          <Text selectable maxFontSizeMultiplier={cap} style={[body, { fontWeight: '600' }]}>{`“${question}”`}</Text>
        </View>
      ) : null}
      {long ? (
        <Pressable
          onPress={() => setOpen((o) => !o)}
          accessibilityRole="button"
          accessibilityState={{ expanded: open }}
          style={({ pressed }) => [styles.more, pressed && { opacity: 0.6 }]}>
          <Text style={{ color: hues.gold, fontSize: TYPE.subhead, fontWeight: '600' }}>{(open ? S.vyakhyaLess : application || question ? S.lifeMore : S.readMore)[lang]}</Text>
          <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={14} color={hues.gold} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { marginTop: SPACE.md, borderLeftWidth: 3, borderRadius: 12, paddingVertical: SPACE.sm + 2, paddingHorizontal: SPACE.md },
  labelRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', columnGap: 6, marginBottom: 2 },
  label: { fontSize: TYPE.caption, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6 },
  labelHi: { fontSize: TYPE.footnote, letterSpacing: 0 },
  badge: { fontSize: 10, borderWidth: StyleSheet.hairlineWidth, borderRadius: 6, paddingHorizontal: 4 },
  li: { flexDirection: 'row', columnGap: 8 },
  question: { marginTop: SPACE.md, borderLeftWidth: 2, paddingLeft: SPACE.md },
  more: { flexDirection: 'row', alignItems: 'center', columnGap: 4, minHeight: TOUCH - 8, alignSelf: 'flex-start' },
});
