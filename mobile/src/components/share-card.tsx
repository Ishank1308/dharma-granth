import type { ComponentRef, Ref } from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';

import type { Cover } from '@/theme/covers';
import { THEMES, type ThemeName } from '@/theme/themes';
import { toDevanagari } from '@/lib/verse-format';

/**
 * A verse drawn as a keepsake card, captured to a PNG (react-native-view-shot) and shared through the
 * Android share sheet. Five looks: the book's own cover colours with gold foil, or one of the four reading
 * themes with its aurora.
 *
 * Philological rule: every line of the Sanskrit is on the card, never an excerpt. The card grows taller
 * for a long verse instead of cutting it, and the type steps down so it still reads well.
 */
export type ShareStyle = 'cover' | ThemeName;
export const SHARE_STYLES: ShareStyle[] = ['cover', 'day', 'sunset', 'paper', 'dark'];

export type ShareCardHandle = ComponentRef<typeof View>;

export interface ShareCardProps {
  /** The view that is captured to the PNG. */
  ref?: Ref<ShareCardHandle>;
  width: number;
  look: ShareStyle;
  cover: Cover;
  /** The book's Devanagari title, shown in foil at the top. */
  bookTitle: string;
  /** The book's English title, under it. */
  bookTitleEn?: string;
  /** "2.47" */
  verseRef: string;
  /** The number in the gilt verse mark (॥ ४७ ॥). */
  markNumber: string;
  lines: string[];
  hindi?: string;
  english?: string;
}

interface Look {
  bg: string;
  image: string;
  text: string;
  soft: string;
  foil: string;
  panel: string;
  panelRim: string;
  frame: string;
  dark: boolean;
}

function lookFor(look: ShareStyle, cover: Cover): Look {
  if (look === 'cover') {
    const [deep, mid, light] = cover.colors;
    return {
      bg: deep,
      image: [
        // A gold glow from above, a cool pool below, over the book's own cover gradient.
        `radial-gradient(85% 45% at 50% 0%, ${hexA(cover.foil, 0.34)} 0%, transparent 70%)`,
        `radial-gradient(70% 40% at 100% 100%, ${hexA(light, 0.45)} 0%, transparent 70%)`,
        `radial-gradient(60% 35% at 0% 85%, ${hexA(mid, 0.6)} 0%, transparent 70%)`,
        `linear-gradient(165deg, ${deep} 0%, ${mid} 62%, ${light} 135%)`,
      ].join(', '),
      text: '#fffaf0',
      soft: 'rgba(255, 248, 235, 0.86)',
      foil: cover.foil,
      panel: 'rgba(0, 0, 0, 0.18)',
      panelRim: hexA(cover.foil, 0.35),
      frame: hexA(cover.foil, 0.7),
      dark: true,
    };
  }
  const p = THEMES[look];
  const [saffron, lotus, peacock, indigo, gold] = p.aurora;
  return {
    bg: p.bg,
    image: [
      `radial-gradient(75% 40% at 8% 4%, ${saffron} 0%, transparent 70%)`,
      `radial-gradient(60% 35% at 98% 22%, ${lotus} 0%, transparent 70%)`,
      `radial-gradient(80% 40% at 82% 96%, ${peacock} 0%, transparent 72%)`,
      `radial-gradient(60% 38% at 4% 72%, ${indigo} 0%, transparent 70%)`,
      `radial-gradient(55% 30% at 50% 46%, ${gold} 0%, transparent 72%)`,
    ].join(', '),
    text: p.text,
    soft: p.textSecondary,
    foil: p.gold,
    panel: p.dark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.62)',
    panelRim: p.dark ? 'rgba(246,199,104,0.22)' : 'rgba(180,120,40,0.22)',
    frame: p.dark ? 'rgba(229,193,88,0.55)' : 'rgba(176,138,74,0.6)',
    dark: p.dark,
  };
}

/** #rrggbb with an alpha, for gradients over the cover colours. */
function hexA(hex: string, alpha: number): string {
  const m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
  if (!m) return hex;
  return `rgba(${parseInt(m[1], 16)}, ${parseInt(m[2], 16)}, ${parseInt(m[3], 16)}, ${alpha})`;
}

/** Steps the shloka's type down for long verses so a whole verse still fits a phone-shaped card. */
function sanskritSize(width: number, lines: string[]): number {
  const longest = Math.max(1, ...lines.map((l) => Array.from(l).length));
  const total = lines.reduce((s, l) => s + Array.from(l).length, 0);
  let k = 0.066;
  if (longest > 26) k = 0.06;
  if (longest > 34) k = 0.054;
  if (longest > 44 || total > 180) k = 0.048;
  if (total > 320) k = 0.042;
  return Math.round(width * k);
}

function meaningSize(width: number, text: string): number {
  const len = text.length;
  return Math.round(width * (len < 180 ? 0.042 : len < 360 ? 0.037 : len < 640 ? 0.033 : 0.03));
}

/** line · diamond · line, in foil. Drawn with views so it never depends on a symbol font. */
function Divider({ color, width }: { color: string; width: number }) {
  const d = Math.max(6, Math.round(width * 0.018));
  return (
    <View style={styles.divider}>
      <View style={[styles.rule, { backgroundColor: color, width: width * 0.16 }]} />
      <View style={{ width: d * 0.6, height: d * 0.6, transform: [{ rotate: '45deg' }], borderWidth: 1, borderColor: color }} />
      <View style={{ width: d, height: d, transform: [{ rotate: '45deg' }], backgroundColor: color }} />
      <View style={{ width: d * 0.6, height: d * 0.6, transform: [{ rotate: '45deg' }], borderWidth: 1, borderColor: color }} />
      <View style={[styles.rule, { backgroundColor: color, width: width * 0.16 }]} />
    </View>
  );
}

function Corner({ color, size, style }: { color: string; size: number; style: ViewStyle }) {
  return (
    <View pointerEvents="none" style={[{ position: 'absolute', width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
      <View style={{ width: size * 0.62, height: size * 0.62, transform: [{ rotate: '45deg' }], backgroundColor: color }} />
    </View>
  );
}

export function ShareCard({ ref, width, look, cover, bookTitle, bookTitleEn, verseRef, markNumber, lines, hindi, english }: ShareCardProps) {
  const L = lookFor(look, cover);
  const u = width / 360;
  const pad = Math.round(width * 0.1);
  const inset = Math.round(width * 0.04);
  const sa = sanskritSize(width, lines);
  const meanings = [hindi, english].filter((m): m is string => !!m);
  const mSize = meaningSize(width, meanings.join('\n'));
  const [deep, mid, light] = cover.colors;

  return (
    <View
      ref={ref}
      collapsable={false}
      style={{ width, minHeight: Math.round(width * 1.25), backgroundColor: L.bg, backgroundImage: L.image, overflow: 'hidden' }}>
      {/* Double foil frame with diamond corners. */}
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, { margin: inset, borderWidth: 1.5 * u, borderColor: L.frame, borderRadius: 14 * u }]} />
      <View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, { margin: inset + 5 * u, borderWidth: StyleSheet.hairlineWidth * 2, borderColor: L.frame, borderRadius: 10 * u, opacity: 0.6 }]}
      />
      {(['tl', 'tr', 'bl', 'br'] as const).map((c) => (
        <Corner
          key={c}
          color={L.foil}
          size={14 * u}
          style={{
            [c[0] === 't' ? 'top' : 'bottom']: inset - 7 * u,
            [c[1] === 'l' ? 'left' : 'right']: inset - 7 * u,
          }}
        />
      ))}

      <View style={{ paddingHorizontal: pad, paddingTop: pad * 0.9, paddingBottom: pad * 0.8, alignItems: 'center', flexGrow: 1 }}>
        {/* The book's cover colours as a thin band, on the theme looks; the cover look is already in them. */}
        {look !== 'cover' ? (
          <View
            style={{
              width: 64 * u,
              height: 4 * u,
              borderRadius: 2 * u,
              marginBottom: 12 * u,
              backgroundColor: mid,
              backgroundImage: `linear-gradient(90deg, ${deep} 0%, ${mid} 50%, ${light} 100%)`,
            }}
          />
        ) : null}
        <Text allowFontScaling={false} style={{ color: L.foil, fontSize: 15 * u, fontWeight: '700', textAlign: 'center' }}>
          {bookTitle}
        </Text>
        {bookTitleEn ? (
          <Text
            allowFontScaling={false}
            style={{ color: L.soft, fontSize: 9.5 * u, fontWeight: '600', letterSpacing: 2 * u, textTransform: 'uppercase', marginTop: 3 * u, textAlign: 'center' }}>
            {bookTitleEn}
          </Text>
        ) : null}
        <View style={{ marginTop: 10 * u, paddingHorizontal: 12 * u, paddingVertical: 3 * u, borderRadius: 999, borderWidth: 1, borderColor: L.panelRim }}>
          <Text allowFontScaling={false} style={{ color: L.foil, fontSize: 11 * u, fontWeight: '700', letterSpacing: 1 * u }}>
            {verseRef}
          </Text>
        </View>

        {/* ॐ in a soft halo. */}
        <View
          style={{
            marginTop: 16 * u,
            width: 46 * u,
            height: 46 * u,
            borderRadius: 23 * u,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: `radial-gradient(circle, ${L.dark ? 'rgba(255,214,120,0.32)' : 'rgba(234,150,40,0.22)'} 0%, transparent 70%)`,
          }}>
          <Text allowFontScaling={false} style={{ color: L.foil, fontSize: 26 * u, lineHeight: 34 * u }}>
            ॐ
          </Text>
        </View>

        <View style={{ flexGrow: 1, justifyContent: 'center', alignSelf: 'stretch', marginVertical: 14 * u }}>
          <View
            style={{
              alignSelf: 'stretch',
              paddingVertical: 16 * u,
              paddingHorizontal: 10 * u,
              borderRadius: 18 * u,
              borderWidth: 1,
              borderColor: L.panelRim,
              backgroundColor: L.panel,
              backgroundImage: L.dark
                ? 'radial-gradient(90% 80% at 50% 0%, rgba(246,199,104,0.12) 0%, rgba(255,255,255,0) 70%)'
                : 'radial-gradient(90% 80% at 50% 0%, rgba(255,255,255,0.9) 0%, rgba(246,199,104,0.10) 100%)',
            }}>
            {lines.map((line, i) => (
              <Text
                key={i}
                allowFontScaling={false}
                style={{ color: L.text, fontSize: sa, lineHeight: sa * 1.62, textAlign: 'center', fontWeight: '500' }}>
                {line}
                {i === lines.length - 1 ? (
                  <Text style={{ color: L.foil }}>{` ॥ ${toDevanagari(markNumber)} ॥`}</Text>
                ) : null}
              </Text>
            ))}
          </View>

          {meanings.length ? (
            <>
              <View style={{ marginTop: 16 * u, marginBottom: 12 * u }}>
                <Divider color={L.foil} width={width} />
              </View>
              {meanings.map((m, i) => (
                <Text
                  key={i}
                  allowFontScaling={false}
                  style={{
                    color: L.soft,
                    fontSize: mSize,
                    lineHeight: mSize * 1.55,
                    textAlign: 'center',
                    marginTop: i ? 10 * u : 0,
                    fontStyle: m === english && meanings.length > 1 ? 'italic' : 'normal',
                  }}>
                  {m}
                </Text>
              ))}
            </>
          ) : null}
        </View>

        <View style={{ alignItems: 'center', rowGap: 2 * u }}>
          <Text allowFontScaling={false} style={{ color: L.foil, fontSize: 12 * u, fontWeight: '700' }}>
            धर्म ग्रन्थ
          </Text>
          <Text allowFontScaling={false} style={{ color: L.soft, fontSize: 9.5 * u, fontWeight: '600', letterSpacing: 1.5 * u }}>
            dharmagranth.dev
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  divider: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', columnGap: 6 },
  rule: { height: 1, opacity: 0.7 },
});
