import Ionicons from '@expo/vector-icons/Ionicons';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type TextStyle } from 'react-native';

import { S, type Lang, type Msg } from '@/i18n';
import { lightMarkdown, type ModernContext } from '@/lib/modern-context';
import type { WordGloss } from '@/lib/word-gloss';
import { huesFor, SPACE, TOUCH, TYPE, UI_FONT_CAP, type Palette } from '@/theme/themes';

/**
 * The website's verse study, in the same order and under the same headings as its chapter reader
 * (app/components/VerseCard.tsx, lib/sacred-reading-order.ts):
 * अर्थ, then "व्याख्या एवं संदर्भ" holding पदच्छेद एवं शब्दार्थ and one connected flow of
 * व्याख्या → आधुनिक संदर्भ → चिंतन.
 */

/** The website's colour for each layer of the reading order (app/styles/colour.css, --branch). */
export type SacredSection = 'arth' | 'vyakhya' | 'modern' | 'reflection';
export function sectionHue(section: SacredSection, palette: Palette): string {
  const hues = huesFor(palette);
  return { arth: hues.peacock, vyakhya: hues.saffron, modern: hues.indigo, reflection: hues.lotus }[section];
}

/** `amount` of colour `a` over `b`, both #rrggbb: the website's color-mix() for the small English names. */
function mix(a: string, b: string, amount: number): string {
  const rgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  if (!/^#[0-9a-f]{6}$/i.test(a) || !/^#[0-9a-f]{6}$/i.test(b)) return a;
  const [x, y] = [rgb(a), rgb(b)];
  return `#${x.map((v, i) => Math.round(v * amount + y[i] * (1 - amount)).toString(16).padStart(2, '0')).join('')}`;
}

/**
 * A section heading as on the website: a bead in the section's colour, the Hindi name in bold, and the
 * English name in small capitals beside it, tinted toward the same colour.
 */
export function SacredHeading({ msg, palette, badge, section }: { msg: Msg; palette: Palette; badge?: string; section: SacredSection }) {
  const hue = sectionHue(section, palette);
  return (
    <View style={styles.heading} accessibilityRole="header" accessible accessibilityLabel={`${msg.hi}, ${msg.en}`}>
      <View style={[styles.beadHalo, { backgroundColor: `${hue}2e` }]}>
        <View style={[styles.bead, { backgroundColor: hue }]} />
      </View>
      <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.subhead, fontWeight: '700' }}>{msg.hi}</Text>
      <Text
        maxFontSizeMultiplier={UI_FONT_CAP}
        style={{ color: mix(hue, palette.text, palette.dark ? 0.85 : 0.58), fontSize: TYPE.caption - 1, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1.4 }}>
        {msg.en}
      </Text>
      {badge ? <Badge text={badge} palette={palette} /> : null}
    </View>
  );
}

export function Badge({ text, palette }: { text: string; palette: Palette }) {
  return <Text maxFontSizeMultiplier={UI_FONT_CAP} style={[styles.badge, { color: palette.muted, borderColor: palette.border }]}>{text}</Text>;
}

/** A small bilingual eyebrow inside a section, such as "भावार्थ · Hindi". */
export function SubLabel({ msg, palette, color }: { msg: Msg; palette: Palette; color?: string }) {
  return (
    <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: color ?? palette.muted, fontSize: TYPE.caption, fontWeight: '700', marginBottom: 4 }}>
      {msg.hi === msg.en ? msg.en : `${msg.hi} · ${msg.en}`}
    </Text>
  );
}

/**
 * The rail that joins व्याख्या, आधुनिक संदर्भ and चिंतन into one reading flow. As on the website it runs
 * from saffron through indigo to lotus, so each section's colour is where its heading sits.
 */
export function ConnectedFlow({ palette, children }: { palette: Palette; children: ReactNode }) {
  const hues = huesFor(palette);
  return (
    <View style={styles.flow}>
      <View
        pointerEvents="none"
        style={[
          styles.rail,
          palette.lite
            ? { backgroundColor: `${hues.saffron}80` }
            : { backgroundImage: `linear-gradient(180deg, ${hues.saffron}99 0%, ${hues.indigo}80 55%, ${hues.lotus}80 100%)` },
        ]}
      />
      {children}
    </View>
  );
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
      <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.footnote, fontWeight: '500', flex: 1 }}>
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
      <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: color ?? palette.muted, fontSize: TYPE.footnote, fontWeight: '600', flexShrink: 1 }}>
        {msg.hi} · {msg.en}
      </Text>
    </Pressable>
  );
}

/** पदच्छेद एवं शब्दार्थ: small, inline and wrapping like a line of text ("pada · meaning; pada · meaning"), not a showcase of boxes. */
export function WordByWord({ glosses, raw, palette, cap }: { glosses: WordGloss[]; raw: string; palette: Palette; cap: number }) {
  const hues = huesFor(palette);
  const small: TextStyle = { fontSize: TYPE.caption, lineHeight: TYPE.caption * 1.7 };
  return (
    <View style={styles.words}>
      <Text selectable maxFontSizeMultiplier={cap} style={[small, { color: palette.muted }]}>
        <Text style={{ color: hues.gold, fontWeight: '700' }}>{`${S.wordByWord.hi}: `}</Text>
        {glosses.length > 0
          ? glosses.map((g, i) => (
              <Text key={i}>
                <Text style={{ color: palette.textSecondary, fontWeight: '600' }}>{g.pada}</Text>
                {` ${g.meaning}`}
                {i < glosses.length - 1 ? '; ' : ''}
              </Text>
            ))
          : raw}
      </Text>
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
          <SubLabel msg={S.practicalApplication} palette={palette} color={huesFor(palette).indigo} />
          <Markdown text={parsed.application} style={style} palette={palette} cap={cap} />
        </View>
      ) : null}
    </View>
  );
}

/** The चिंतन प्रश्न: a quoted question on a rule in चिंतन's own colour. */
export function ReflectionBody({ question, style, palette, cap }: { question: string; style: TextStyle; palette: Palette; cap: number }) {
  return (
    <View style={[styles.reflection, { borderLeftColor: huesFor(palette).lotus }]}>
      <Text selectable maxFontSizeMultiplier={cap} style={[style, { fontWeight: '600' }]}>{`“${question.trim()}”`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', columnGap: SPACE.sm, rowGap: 4, marginBottom: SPACE.sm },
  beadHalo: { width: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  bead: { width: 10, height: 10, borderRadius: 5 },
  badge: { fontSize: TYPE.caption - 1, borderWidth: StyleSheet.hairlineWidth, borderRadius: 6, paddingHorizontal: 4, alignSelf: 'center' },
  flow: { paddingLeft: SPACE.md + 3, rowGap: SPACE.lg + 4, marginTop: SPACE.md },
  rail: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, borderRadius: 2 },
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: SPACE.sm,
    minHeight: TOUCH,
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
    minHeight: TOUCH,
    paddingHorizontal: SPACE.md,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
  words: { marginTop: SPACE.md },
  li: { flexDirection: 'row', columnGap: 8 },
  reflection: { borderLeftWidth: 2, paddingLeft: SPACE.md },
});
