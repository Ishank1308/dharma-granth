import type { ReactNode } from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { toDevanagari } from '@/lib/verse-format';
import { SANSKRIT_FONT, SERIF_FONT, SERIF_ITALIC_FONT } from '@/theme/fonts';

import { BudRule, Grain, Lotus, Mandala, SealRing, Sprig, Stars } from './share-art';
import { FORMAT_RATIO, type EditorialStyle, type ShareCardProps } from './share-card';

/**
 * The editorial share cards, after what is trending on Pinterest for quote and spiritual pins: an editorial
 * serif beside Tiro Devanagari, film grain, soft painterly gradients and fine line art (temple arch, lotus,
 * mandala, botanical sprigs, a manuscript seal). Every line of the shloka is always on the card; a long verse
 * makes the card taller and the type smaller, never shorter text.
 */

interface Spec {
  bg: string;
  image: string;
  grain: { tone: 'dark' | 'light'; opacity: number };
  /** Shloka and Hindi meaning. */
  ink: string;
  /** English meaning, the English title and the footer. */
  soft: string;
  /** Book title, verse number, verse mark and ornaments. */
  accent: string;
  /** Behind everything, full bleed (stars, mandala, sprigs, manuscript margins). */
  back?: (w: number, h: number, u: number) => ReactNode;
  /** The surface the text sits on, when the look has one (the arch). */
  panel?: (u: number) => ViewStyle;
  /** Over the title (an ornament). */
  top?: (u: number) => ReactNode;
  /** Under the meaning (lotus, seal). */
  bottom?: (u: number) => ReactNode;
  /** The footer's colour, when it sits outside the panel. */
  footer?: string;
}

const SPECS: Record<EditorialStyle, Spec> = {
  // Terracotta wall, a cream temple arch, a low sun behind it and a lotus at its foot.
  arch: {
    bg: '#b5532f',
    image: [
      'radial-gradient(60% 30% at 50% 6%, rgba(255,214,160,0.55) 0%, transparent 70%)',
      'linear-gradient(170deg, #c9693f 0%, #a8472a 55%, #7d321f 100%)',
    ].join(', '),
    grain: { tone: 'dark', opacity: 0.55 },
    ink: '#3b2216',
    soft: '#6b4a38',
    accent: '#a8472a',
    footer: '#fbeedd',
    panel: (u) => ({
      backgroundColor: '#f6ead8',
      backgroundImage: 'radial-gradient(80% 50% at 50% 0%, #fff8ec 0%, rgba(246,234,216,0) 80%)',
      borderTopLeftRadius: 999,
      borderTopRightRadius: 999,
      borderBottomLeftRadius: 10 * u,
      borderBottomRightRadius: 10 * u,
      paddingTop: 58 * u,
      boxShadow: '0 10px 30px rgba(60,20,8,0.35)',
    }),
    top: (u) => (
      <View style={{ width: 54 * u, height: 54 * u, borderRadius: 27 * u, backgroundColor: '#e9b98a', backgroundImage: 'radial-gradient(circle at 50% 40%, #f7d6a8 0%, #e2a26c 100%)', marginBottom: 12 * u, opacity: 0.9 }} />
    ),
    bottom: (u) => <Lotus width={70 * u} color="#a8472a" />,
  },

  // Indigo night, a gold mandala rising behind the verse, stars.
  midnight: {
    bg: '#0b1030',
    image: [
      'radial-gradient(70% 40% at 50% 30%, rgba(214,170,90,0.22) 0%, transparent 70%)',
      'radial-gradient(80% 50% at 50% 110%, rgba(70,60,160,0.5) 0%, transparent 70%)',
      'linear-gradient(180deg, #0a0f2c 0%, #121a46 60%, #1a1650 100%)',
    ].join(', '),
    grain: { tone: 'light', opacity: 0.35 },
    ink: '#f6ecd6',
    soft: 'rgba(240,228,205,0.82)',
    accent: '#e4bf6a',
    back: (w, h, u) => (
      <>
        <Stars width={w} height={h} color="#f3dfa8" />
        <View style={{ position: 'absolute', top: h * 0.08, left: (w - w * 0.92) / 2, opacity: 0.22 }}>
          <Mandala size={w * 0.92} color="#e4bf6a" />
        </View>
        <View style={[StyleSheet.absoluteFill, { margin: 16 * u, borderWidth: 0.8 * u, borderColor: 'rgba(228,191,106,0.5)', borderRadius: 4 * u }]} />
      </>
    ),
    top: (u) => <Text style={{ fontFamily: SANSKRIT_FONT, color: '#e4bf6a', fontSize: 30 * u, lineHeight: 40 * u, marginBottom: 6 * u }}>ॐ</Text>,
    bottom: (u) => (
      <View style={{ flexDirection: 'row', columnGap: 10 * u, alignItems: 'center' }}>
        {[3, 5, 3].map((d, i) => (
          <View key={i} style={{ width: d * u, height: d * u, borderRadius: d * u, backgroundColor: '#e4bf6a' }} />
        ))}
      </View>
    ),
  },

  // Linen and sage, botanical sprigs in two corners.
  sage: {
    bg: '#e8e4d6',
    image: [
      'radial-gradient(70% 45% at 0% 0%, rgba(150,168,132,0.35) 0%, transparent 70%)',
      'radial-gradient(70% 45% at 100% 100%, rgba(150,168,132,0.35) 0%, transparent 70%)',
      'linear-gradient(180deg, #ece8dc 0%, #e2ddcc 100%)',
    ].join(', '),
    grain: { tone: 'dark', opacity: 0.4 },
    ink: '#2e3a2a',
    soft: '#56634f',
    accent: '#6f8460',
    back: (w, h, u) => (
      <>
        <View style={{ position: 'absolute', left: -14 * u, bottom: -14 * u, opacity: 0.75 }}>
          <Sprig size={w * 0.3} color="#7e9470" />
        </View>
        <View style={{ position: 'absolute', right: -14 * u, top: -14 * u, opacity: 0.75 }}>
          <Sprig size={w * 0.27} color="#7e9470" flip />
        </View>
      </>
    ),
    top: (u) => <Text style={{ fontFamily: SERIF_ITALIC_FONT, color: '#6f8460', fontSize: 15 * u, letterSpacing: 3 * u, marginBottom: 8 * u }}>svādhyāya</Text>,
  },

  // A soft aura: peach, lilac and rose blooms on cream, heavy grain, plum ink.
  aura: {
    bg: '#fbefe6',
    image: [
      'radial-gradient(55% 40% at 15% 12%, rgba(255,170,120,0.85) 0%, transparent 70%)',
      'radial-gradient(60% 45% at 92% 30%, rgba(190,160,255,0.75) 0%, transparent 70%)',
      'radial-gradient(65% 45% at 30% 88%, rgba(255,150,190,0.7) 0%, transparent 70%)',
      'radial-gradient(50% 35% at 85% 92%, rgba(255,214,140,0.7) 0%, transparent 70%)',
    ].join(', '),
    grain: { tone: 'dark', opacity: 0.6 },
    ink: '#3a1f3d',
    soft: '#5c3d5e',
    accent: '#8c3f6e',
    top: (u) => (
      <View style={{ paddingHorizontal: 12 * u, paddingVertical: 4 * u, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.45)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.8)', marginBottom: 10 * u }}>
        <Text style={{ fontFamily: SERIF_FONT, color: '#8c3f6e', fontSize: 11 * u, letterSpacing: 2.5 * u }}>A VERSE FOR TODAY</Text>
      </View>
    ),
  },

  // A palm-leaf manuscript page: handmade paper, vermilion margins, ink, a seal.
  manuscript: {
    bg: '#eedfc0',
    image: [
      'radial-gradient(120% 90% at 50% 50%, rgba(255,248,230,0.6) 0%, rgba(120,80,30,0.28) 100%)',
      'linear-gradient(180deg, #f1e3c6 0%, #e6d2ab 100%)',
    ].join(', '),
    grain: { tone: 'dark', opacity: 0.7 },
    ink: '#2a180c',
    soft: '#5a3a1f',
    accent: '#b3261e',
    back: (w, h, u) => (
      <>
        {/* The red margin columns of a pothi, with a binding hole on each side. */}
        {[0, 1].map((side) => (
          <View key={side} style={{ position: 'absolute', top: 18 * u, bottom: 18 * u, [side ? 'right' : 'left']: 18 * u, width: 16 * u, flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ width: 2 * u, backgroundColor: '#b3261e' }} />
            <View style={{ width: 2 * u, backgroundColor: '#b3261e', opacity: 0.6 }} />
          </View>
        ))}
        <View style={{ position: 'absolute', top: 18 * u, left: 18 * u, right: 18 * u, height: 1.5 * u, backgroundColor: '#b3261e' }} />
        <View style={{ position: 'absolute', bottom: 18 * u, left: 18 * u, right: 18 * u, height: 1.5 * u, backgroundColor: '#b3261e' }} />
      </>
    ),
    top: (u) => <Text style={{ fontFamily: SANSKRIT_FONT, color: '#b3261e', fontSize: 18 * u, marginBottom: 4 * u }}>॥ श्री ॥</Text>,
    bottom: (u) => (
      <View style={{ width: 52 * u, height: 52 * u, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-8deg' }], opacity: 0.85 }}>
        <SealRing size={52 * u} color="#b3261e" />
        <Text style={{ fontFamily: SANSKRIT_FONT, color: '#b3261e', fontSize: 22 * u, lineHeight: 30 * u }}>ॐ</Text>
      </View>
    ),
  },
};

/** Steps the shloka down for long verses so a whole verse still fits. */
function shlokaSize(u: number, lines: string[], story: boolean): number {
  const longest = Math.max(1, ...lines.map((l) => Array.from(l).length));
  const total = lines.reduce((s, l) => s + Array.from(l).length, 0);
  let k = story ? 23 : 21;
  if (longest > 26) k -= 2;
  if (longest > 34) k -= 2;
  if (longest > 44 || total > 180) k -= 2;
  if (total > 320) k -= 2;
  return k * u;
}

function meaningSize(u: number, text: string): number {
  const len = text.length;
  return (len < 180 ? 15 : len < 360 ? 13.5 : len < 640 ? 12 : 11) * u;
}

export function EditorialCard({ ref, width, look, format = 'post', bookTitle, bookTitleEn, verseRef, markNumber, lines, hindi, english }: ShareCardProps & { look: EditorialStyle }) {
  const S = SPECS[look];
  const u = width / 360;
  const story = format === 'story';
  const minHeight = Math.round(width * FORMAT_RATIO[format]);
  const sa = shlokaSize(u, lines, story);
  const mSize = meaningSize(u, [hindi, english].filter(Boolean).join('\n'));
  const pad = (look === 'manuscript' ? 46 : 32) * u;
  const panel = S.panel?.(u);

  const body = (
    <View style={[{ flexGrow: 1, alignItems: 'center', paddingHorizontal: panel ? 24 * u : 0, paddingBottom: panel ? 26 * u : 0 }, panel]}>
      {S.top?.(u)}
      <Text allowFontScaling={false} style={{ fontFamily: SANSKRIT_FONT, color: S.accent, fontSize: 15 * u, textAlign: 'center' }}>
        {bookTitle}
      </Text>
      {bookTitleEn ? (
        <Text allowFontScaling={false} style={{ fontFamily: SERIF_FONT, color: S.soft, fontSize: 10.5 * u, letterSpacing: 3 * u, marginTop: 2 * u, textAlign: 'center' }}>
          {bookTitleEn.toUpperCase()}
        </Text>
      ) : null}
      <Text allowFontScaling={false} style={{ fontFamily: SERIF_ITALIC_FONT, color: S.accent, fontSize: 14 * u, marginTop: 4 * u }}>
        {`— ${verseRef} —`}
      </Text>

      <View style={{ flexGrow: 1, justifyContent: 'center', alignSelf: 'stretch', marginVertical: (story ? 26 : 16) * u }}>
        {lines.map((line, i) => (
          <Text key={i} allowFontScaling={false} style={{ fontFamily: SANSKRIT_FONT, color: S.ink, fontSize: sa, lineHeight: sa * 1.55, textAlign: 'center' }}>
            {line}
            {i === lines.length - 1 ? <Text style={{ color: S.accent }}>{` ॥ ${toDevanagari(markNumber)} ॥`}</Text> : null}
          </Text>
        ))}
        {hindi || english ? (
          <View style={{ alignItems: 'center', marginTop: 16 * u, marginBottom: 12 * u }}>
            <BudRule width={150 * u} color={S.accent} />
          </View>
        ) : null}
        {hindi ? (
          <Text allowFontScaling={false} style={{ fontFamily: SANSKRIT_FONT, color: S.ink, opacity: 0.88, fontSize: mSize, lineHeight: mSize * 1.6, textAlign: 'center' }}>
            {hindi}
          </Text>
        ) : null}
        {english ? (
          <Text
            allowFontScaling={false}
            style={{ fontFamily: SERIF_ITALIC_FONT, color: S.soft, fontSize: mSize * 1.18, lineHeight: mSize * 1.18 * 1.4, textAlign: 'center', marginTop: hindi ? 10 * u : 0 }}>
            {english}
          </Text>
        ) : null}
      </View>

      {S.bottom ? <View style={{ alignItems: 'center', marginBottom: 12 * u }}>{S.bottom(u)}</View> : null}
      {!S.footer ? <Footer u={u} color={S.soft} accent={S.accent} /> : null}
    </View>
  );

  return (
    <View ref={ref} collapsable={false} style={{ width, minHeight, backgroundColor: S.bg, backgroundImage: S.image, overflow: 'hidden' }}>
      {S.back?.(width, minHeight, u)}
      <Grain tone={S.grain.tone} opacity={S.grain.opacity} />
      <View style={{ flexGrow: 1, paddingHorizontal: pad, paddingTop: (story ? 70 : panel ? 34 : 44) * u, paddingBottom: (story ? 60 : panel ? 18 : 36) * u }}>
        {body}
        {S.footer ? (
          <View style={{ marginTop: 14 * u }}>
            <Footer u={u} color={S.footer} accent={S.footer} />
          </View>
        ) : null}
      </View>
    </View>
  );
}

function Footer({ u, color, accent }: { u: number; color: string; accent: string }) {
  return (
    <View style={{ alignItems: 'center', rowGap: 1 * u }}>
      <Text allowFontScaling={false} style={{ fontFamily: SANSKRIT_FONT, color: accent, fontSize: 12 * u }}>
        धर्म ग्रन्थ
      </Text>
      <Text allowFontScaling={false} style={{ fontFamily: SERIF_FONT, color, fontSize: 10 * u, letterSpacing: 2 * u }}>
        dharmagranth.dev
      </Text>
    </View>
  );
}

/** A look's colours for its swatch in the style picker. */
export function editorialSwatch(look: EditorialStyle): { bg: string; image: string; accent: string } {
  const s = SPECS[look];
  return { bg: s.bg, image: s.image, accent: s.accent };
}
