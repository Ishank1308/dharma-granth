import Ionicons from '@expo/vector-icons/Ionicons';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type TextStyle } from 'react-native';

import { S, type Lang, type Msg } from '@/i18n';
import { lightMarkdown, type ModernContext } from '@/lib/modern-context';
import type { WordGloss } from '@/lib/word-gloss';
import { huesFor, SPACE, TOUCH, TYPE, type Palette } from '@/theme/themes';

/**
 * The website's verse study, in the same order and under the same headings as its chapter reader
 * (app/components/VerseCard.tsx, lib/sacred-reading-order.ts):
 * अर्थ, then "व्याख्या एवं संदर्भ" holding पदच्छेद एवं शब्दार्थ and one connected flow of
 * व्याख्या → आधुनिक संदर्भ → चिंतन.
 */

/** A section heading as on the website: the Hindi name in bold, the English name in small capitals beside it. */
export function SacredHeading({ msg, palette, badge }: { msg: Msg; palette: Palette; badge?: string }) {
  return (
    <View style={styles.heading} accessibilityRole="header">
      <Text style={{ color: palette.text, fontSize: TYPE.subhead, fontWeight: '700' }}>{msg.hi}</Text>
      <Text style={{ color: palette.muted, fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1.4 }}>{msg.en}</Text>
      {badge ? <Badge text={badge} palette={palette} /> : null}
    </View>
  );
}

export function Badge({ text, palette }: { text: string; palette: Palette }) {
  return <Text style={[styles.badge, { color: palette.muted, borderColor: palette.border }]}>{text}</Text>;
}

/** A small bilingual eyebrow inside a section, such as "भावार्थ · Hindi". */
export function SubLabel({ msg, palette, color }: { msg: Msg; palette: Palette; color?: string }) {
  return (
    <Text style={{ color: color ?? palette.muted, fontSize: TYPE.caption, fontWeight: '700', marginBottom: 4 }}>
      {msg.hi === msg.en ? msg.en : `${msg.hi} · ${msg.en}`}
    </Text>
  );
}

/** The gold rail that joins व्याख्या, आधुनिक संदर्भ and चिंतन into one reading flow. */
export function ConnectedFlow({ palette, children }: { palette: Palette; children: ReactNode }) {
  return <View style={[styles.flow, { borderLeftColor: palette.dark ? 'rgba(251,191,36,0.32)' : 'rgba(180,83,9,0.32)' }]}>{children}</View>;
}

/** The "व्याख्या एवं संदर्भ · Verse study" disclosure row. */
export function StudyToggle({ open, onPress, palette, lang }: { open: boolean; onPress: () => void; palette: Palette; lang: Lang }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ expanded: open }}
      accessibilityLabel={S.verseStudy[lang]}
      style={({ pressed }) => [
        styles.toggle,
        { borderColor: palette.border, backgroundColor: palette.dark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.5)' },
        pressed && { opacity: 0.7 },
      ]}>
      <Text style={{ color: palette.muted, fontSize: TYPE.footnote, fontWeight: '500', flex: 1 }}>
        {S.verseStudy.hi} · {S.verseStudy.en}
      </Text>
      <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={16} color={palette.muted} />
    </Pressable>
  );
}

export function PillButton({ msg, icon, onPress, palette, color }: { msg: Msg; icon: keyof typeof Ionicons.glyphMap; onPress: () => void; palette: Palette; color?: string }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.pill, { borderColor: color ? palette.border : 'transparent' }, pressed && { opacity: 0.6 }]}>
      <Ionicons name={icon} size={14} color={color ?? palette.muted} />
      <Text style={{ color: color ?? palette.muted, fontSize: TYPE.footnote, fontWeight: '600' }}>
        {msg.hi} · {msg.en}
      </Text>
    </Pressable>
  );
}

/** पदच्छेद एवं शब्दार्थ: one chip per word, "pada · meaning"; prose that is not a gloss shows as it is. */
export function WordByWord({ glosses, raw, palette, cap }: { glosses: WordGloss[]; raw: string; palette: Palette; cap: number }) {
  const hues = huesFor(palette);
  return (
    <View
      style={[
        styles.words,
        {
          borderColor: palette.dark ? 'rgba(251,191,36,0.22)' : 'rgba(217,119,6,0.25)',
          backgroundColor: palette.dark ? 'rgba(251,191,36,0.06)' : 'rgba(251,191,36,0.07)',
        },
      ]}>
      <View style={styles.wordsHead}>
        <Ionicons name="document-text-outline" size={12} color={hues.gold} />
        <Text style={{ color: hues.gold, fontSize: TYPE.caption, fontWeight: '700' }}>{S.wordByWord.hi}</Text>
        <Text style={{ color: palette.muted, fontSize: 10 }}>· {S.wordByWord.en}</Text>
      </View>
      {glosses.length > 0 ? (
        <View style={styles.chips}>
          {glosses.map((g, i) => (
            <View key={i} style={[styles.chip, { borderColor: palette.dark ? 'rgba(251,191,36,0.25)' : 'rgba(217,119,6,0.22)' }]}>
              <Text selectable maxFontSizeMultiplier={cap} style={{ fontSize: TYPE.footnote }}>
                <Text style={{ color: palette.text, fontWeight: '700' }}>{g.pada}</Text>
                <Text style={{ color: palette.muted }}>{`  ·  ${g.meaning}`}</Text>
              </Text>
            </View>
          ))}
        </View>
      ) : (
        <Text selectable maxFontSizeMultiplier={cap} style={{ color: palette.text, fontSize: TYPE.footnote, lineHeight: TYPE.footnote * 1.6 }}>
          {raw}
        </Text>
      )}
    </View>
  );
}

const STRUCTURED = new Set(['प्रसंग एवं भाव', 'पद-विवेचन', 'जीवन-साधना']);

/** The व्याख्या as paragraphs; "प्रसंग एवं भाव — …" style lead-ins are bold, as on the website. */
export function VyakhyaText({ text, style, cap }: { text: string; style: TextStyle; cap: number }) {
  const paragraphs = text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  return (
    <View style={{ rowGap: SPACE.sm + 2 }}>
      {paragraphs.map((p, i) => {
        const cut = p.indexOf(' — ');
        const head = cut >= 0 ? p.slice(0, cut) : '';
        return (
          <Text key={i} selectable maxFontSizeMultiplier={cap} style={style}>
            {STRUCTURED.has(head) ? (
              <>
                <Text style={{ fontWeight: '700' }}>{`${head} — `}</Text>
                {p.slice(cut + 3)}
              </>
            ) : (
              p
            )}
          </Text>
        );
      })}
    </View>
  );
}

function Markdown({ text, style, palette, cap }: { text: string; style: TextStyle; palette: Palette; cap: number }) {
  return (
    <View style={{ rowGap: 6 }}>
      {lightMarkdown(text).map((b, i) => (
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

/** आधुनिक संदर्भ's body: the context with no heading of its own (the section already says it), then the practical steps. */
export function ModernContextBody({ parsed, style, palette, cap }: { parsed: ModernContext; style: TextStyle; palette: Palette; cap: number }) {
  return (
    <View style={{ rowGap: SPACE.md }}>
      {parsed.context ? <Markdown text={parsed.context} style={style} palette={palette} cap={cap} /> : null}
      {parsed.application ? (
        <View>
          <SubLabel msg={S.practicalApplication} palette={palette} />
          <Markdown text={parsed.application} style={style} palette={palette} cap={cap} />
        </View>
      ) : null}
    </View>
  );
}

/** The चिंतन प्रश्न: a quoted question with a saffron rule, as the website's ReflectionBody. */
export function ReflectionBody({ question, style, palette, cap }: { question: string; style: TextStyle; palette: Palette; cap: number }) {
  return (
    <View style={[styles.reflection, { borderLeftColor: huesFor(palette).saffron }]}>
      <Text selectable maxFontSizeMultiplier={cap} style={[style, { fontWeight: '600' }]}>{`“${question.trim()}”`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: { flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap', columnGap: SPACE.sm, rowGap: 4, marginBottom: SPACE.sm },
  badge: { fontSize: 10, borderWidth: StyleSheet.hairlineWidth, borderRadius: 6, paddingHorizontal: 4, alignSelf: 'center' },
  flow: { borderLeftWidth: 2, paddingLeft: SPACE.md, rowGap: SPACE.lg + 4, marginTop: SPACE.md },
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: SPACE.sm,
    minHeight: TOUCH - 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    paddingHorizontal: SPACE.md,
    marginTop: SPACE.md,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    columnGap: 6,
    minHeight: TOUCH - 4,
    paddingHorizontal: SPACE.md,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
  words: { borderWidth: StyleSheet.hairlineWidth, borderRadius: 12, padding: SPACE.sm + 2, marginTop: SPACE.md },
  wordsHead: { flexDirection: 'row', alignItems: 'center', columnGap: 4, marginBottom: SPACE.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { borderWidth: StyleSheet.hairlineWidth, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, maxWidth: '100%' },
  li: { flexDirection: 'row', columnGap: 8 },
  reflection: { borderLeftWidth: 2, paddingLeft: SPACE.md },
});
