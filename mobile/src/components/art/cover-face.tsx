/**
 * The front of a book, as the cloth-bound devotional editions kept in a puja room: woven bookcloth in the
 * book's cover colours, darkened toward its edges by handling; a double rule, cut corners and the title
 * pressed into it in gold leaf; a shrine arch; and a rounded, banded spine down the left edge.
 *
 * In the arch sits the book's painting where it has one (src/components/art/cover-art: Krishna and Arjuna on
 * the chariot for the Gita, the coronation of Rama for the Manas), pasted on as old pictorial bindings were.
 * A book without a painting has its emblem stamped there in gold, glowing (src/components/art/emblems).
 *
 * One drawing serves every size. From 76 dp wide the cover carries its title; below that (the Continue card,
 * the rows of the book list) the arch fills the cover, because type that small would only be noise.
 *
 * Drawn once as a still SVG under one small tiled texture, so a shelf of them costs nothing while it scrolls.
 * With light effects the cloth is a flat fill: no weave, no gradients, no shading. `draw` traces the emblem
 * with a pen as the cover appears (the title page's book).
 */
import { memo, useId } from 'react';
import { Image, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
import Svg, { Circle, ClipPath, Defs, G, LinearGradient, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

import { usePrefs } from '@/state/app-state';
import type { Cover } from '@/theme/covers';
import { SANSKRIT_FONT } from '@/theme/fonts';

import { EMBLEMS, LineArt, type EmblemName } from './emblems';

/** The drawing's grid, and a cover's proportions everywhere. */
const W = 100;
const H = 140;
export const COVER_RATIO = H / W;
/** The axis of the front board, right of the spine. */
const CX = 54;
const SPINE = 12;
/** Bookcloth: light and dark threads with their own transparency, so it lies over any colour without a blend mode. */
const CLOTH = require('../../../assets/covers/cloth.webp') as ImageSourcePropType;
/** From this width the cover has room for its title. */
const TITLE_FROM = 76;

/** A shrine niche: straight jambs, a swelling shoulder and a pointed crown. */
function arch(x0: number, x1: number, top: number, spring: number, base: number): string {
  const cx = (x0 + x1) / 2;
  const w = (x1 - x0) / 2;
  return `M${x0} ${base}V${spring}C${x0} ${spring - w * 0.5} ${cx - w * 0.42} ${top + w * 0.62} ${cx} ${top}C${cx + w * 0.42} ${top + w * 0.62} ${x1} ${spring - w * 0.5} ${x1} ${spring}V${base}Z`;
}

function burst(cy: number, from: number): string {
  let d = '';
  for (let i = 0; i < 28; i++) {
    const a = (i * 2 * Math.PI) / 28;
    d += `M${(CX + Math.cos(a) * from).toFixed(1)} ${(cy + Math.sin(a) * from).toFixed(1)}L${(CX + Math.cos(a) * 60).toFixed(1)} ${(cy + Math.sin(a) * 60).toFixed(1)}`;
  }
  return d;
}

interface Layout {
  niche: string;
  inner: string;
  /** The niche's box: its jambs, crown and sill. */
  x0: number;
  x1: number;
  top: number;
  base: number;
  /** The emblem's centre line and its scale from the 64 grid. */
  ey: number;
  es: number;
  rays: string;
  /** Where the title sits, as fractions of the cover's height. */
  titleTop: number;
  titleHeight: number;
}
const layout = (full: boolean, plate: boolean): Layout => {
  // A painting wants a larger window than an emblem does.
  const [x0, x1, top, spring, base] = full ? (plate ? [22, 86, 12, 54, 97] : [27, 81, 15, 52, 86]) : [22, 86, 18, 62, 120];
  const ey = full ? 57 : 76;
  return {
    niche: arch(x0, x1, top, spring, base),
    inner: arch(x0 + 3, x1 - 3, top + 5, spring + 1, base),
    x0,
    x1,
    top,
    base,
    ey,
    es: full ? 0.6 : 0.72,
    rays: burst(ey, full ? 17 : 22),
    titleTop: plate ? 0.715 : 0.635,
    titleHeight: plate ? 0.2 : 0.22,
  };
};
const LAYOUTS = { full: layout(true, false), fullPlate: layout(true, true), mini: layout(false, false) };
const CORNERS = 'M17 18a9 9 0 0 0 9 -9M91 18a9 9 0 0 1 -9 -9M17 122a9 9 0 0 1 9 9M91 122a9 9 0 0 0 -9 9';
const TAILPIECE = 'M38 126H49M59 126H70M54 123.4L56.6 126L54 128.6L51.4 126Z';

/** How much taller a line of the title is than its type. */
const LEADING = 1.42;

/**
 * Type that fits the board: the longest word decides its width, between a floor and the size a short title is
 * set at, and a title of several words must fit the space under the arch in two lines.
 */
function titleSize(title: string, width: number, room: number): number {
  const words = title.split(/\s+/);
  const longest = Math.max(...words.map((w) => w.length));
  const fits = (room * COVER_RATIO) / (Math.min(2, words.length) * LEADING);
  return Math.round(Math.min(0.13, fits, Math.max(0.07, 0.71 / (longest * 0.46))) * width * 10) / 10;
}

export const CoverFace = memo(function CoverFace({
  cover,
  emblem,
  plate,
  title,
  width,
  draw,
  drawDelay = 0,
}: {
  cover: Cover;
  emblem: EmblemName;
  /** The book's painting, shown in the arch in place of the emblem. */
  plate?: ImageSourcePropType;
  /** The book's name in Devanagari, stamped under the arch when the cover is wide enough. */
  title?: string;
  width: number;
  /** Trace the emblem with a pen as the cover appears. */
  draw?: boolean;
  drawDelay?: number;
}) {
  const { palette } = usePrefs();
  // Ids are global on the web preview, so each cover names its own gradients.
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const lite = palette.lite;
  const full = width >= TITLE_FROM && !!title;
  const L = full ? (plate ? LAYOUTS.fullPlate : LAYOUTS.full) : LAYOUTS.mini;
  const [deep, mid, light] = cover.colors;
  const foil = cover.foil;
  const gilt = lite ? foil : `url(#${id}f)`;
  const height = Math.round(width * COVER_RATIO);
  const k = width / W;
  const box = 64 * L.es * k;
  const size = full ? titleSize(title, width, L.titleHeight) : 0;

  // Everything pressed into the cloth in gold. Drawn twice: once as the shadow the press leaves, once as the leaf.
  const stamped = (
    <>
      <Rect x={15} y={7} width={78} height={126} rx={2} strokeWidth={full ? 1 : 1.4} />
      {full ? (
        <>
          <Rect x={17.6} y={9.6} width={72.8} height={120.8} rx={1} strokeWidth={0.4} />
          <Path d={CORNERS} strokeWidth={0.6} />
          {plate ? null : <Path d={L.inner} strokeWidth={0.4} opacity={0.8} />}
          <Path d={`M${L.x0 - 1} ${L.base + 2.6}H${L.x1 + 1}`} strokeWidth={0.5} />
          {/* A painted cover gives the tailpiece's room to the painting. */}
          {plate ? null : <Path d={TAILPIECE} strokeWidth={0.65} />}
        </>
      ) : null}
      <Path d={L.niche} strokeWidth={full ? 1.2 : 1.6} />
      <Path d={`M${L.x0 - 3} ${L.base}H${L.x1 + 3}`} strokeWidth={full ? 1.6 : 2} />
      {draw || plate ? null : (
        <G transform={`translate(${CX - 32 * L.es} ${L.ey - 32 * L.es}) scale(${L.es})`} strokeWidth={full ? 1.9 : 2.3}>
          {EMBLEMS[emblem].map((d, i) => (
            <Path key={i} d={d} />
          ))}
        </G>
      )}
    </>
  );

  return (
    <View style={{ width, height }}>
      {plate ? (
        // An ordinary image under the drawing, so the system scales and caches it like any other picture.
        <Image
          source={plate}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
          style={{ position: 'absolute', left: L.x0 * k - 0.5, top: L.top * k - 0.5, width: (L.x1 - L.x0) * k + 1, height: (L.base - L.top) * k + 1 }}
        />
      ) : null}
      {/* Placed like the layers around it, so the web preview stacks them in this order too. */}
      <Svg width={width} height={height} viewBox={`0 0 ${W} ${H}`} style={styles.drawing}>
        <Defs>
          {lite ? null : (
            <>
              <LinearGradient id={`${id}c`} x1={0} y1={0} x2={W} y2={H} gradientUnits="userSpaceOnUse">
                <Stop offset={0} stopColor={mid} />
                <Stop offset={1} stopColor={deep} />
              </LinearGradient>
              {/* Gold leaf catches the light unevenly: pale where it faces it, bronze where it turns away. */}
              <LinearGradient id={`${id}f`} x1={0} y1={0} x2={W} y2={H} gradientUnits="userSpaceOnUse">
                <Stop offset={0} stopColor="#fff1bf" />
                <Stop offset={0.3} stopColor={foil} />
                <Stop offset={0.62} stopColor="#a87a25" />
                <Stop offset={0.85} stopColor={foil} />
                <Stop offset={1} stopColor="#8a621c" />
              </LinearGradient>
              <RadialGradient id={`${id}h`} cx={CX} cy={L.ey} r={full ? 34 : 44} gradientUnits="userSpaceOnUse">
                <Stop offset={0} stopColor={light} stopOpacity={0.7} />
                <Stop offset={1} stopColor={light} stopOpacity={0} />
              </RadialGradient>
              {/* Years of hands: the boards darken toward their edges. */}
              <RadialGradient id={`${id}v`} cx={50} cy={60} r={95} gradientUnits="userSpaceOnUse">
                <Stop offset={0.45} stopColor="#000000" stopOpacity={0} />
                <Stop offset={1} stopColor="#000000" stopOpacity={0.42} />
              </RadialGradient>
              <LinearGradient id={`${id}s`} x1={0} y1={0} x2={SPINE} y2={0} gradientUnits="userSpaceOnUse">
                <Stop offset={0} stopColor="#000000" stopOpacity={0.62} />
                <Stop offset={0.38} stopColor="#ffffff" stopOpacity={0.16} />
                <Stop offset={0.8} stopColor="#000000" stopOpacity={0.12} />
                <Stop offset={1} stopColor="#000000" stopOpacity={0.42} />
              </LinearGradient>
              {/* The painting sits a little below the cloth, so its head and foot fall into shade. */}
              <LinearGradient id={`${id}p`} x1={0} y1={L.top} x2={0} y2={L.base} gradientUnits="userSpaceOnUse">
                <Stop offset={0} stopColor="#000000" stopOpacity={0.28} />
                <Stop offset={0.25} stopColor="#000000" stopOpacity={0} />
                <Stop offset={0.7} stopColor="#000000" stopOpacity={0} />
                <Stop offset={1} stopColor="#000000" stopOpacity={0.38} />
              </LinearGradient>
            </>
          )}
          <ClipPath id={`${id}k`}>
            <Path d={L.niche} />
          </ClipPath>
        </Defs>
        {/* The cloth. */}
        {plate ? (
          // The cloth is cut away at the niche, and the painting shows through from behind it.
          <>
            <Path d={`M0 0H${W}V${H}H0Z${L.niche}`} fillRule="evenodd" fill={lite ? mid : `url(#${id}c)`} />
            <G clipPath={`url(#${id}k)`}>
              {lite ? null : <Rect x={L.x0} y={L.top} width={L.x1 - L.x0} height={L.base - L.top} fill={`url(#${id}p)`} />}
              <Path d={L.niche} fill="none" stroke="#000000" strokeOpacity={0.5} strokeWidth={2.4} />
            </G>
          </>
        ) : (
          <Rect width={W} height={H} fill={lite ? mid : `url(#${id}c)`} />
        )}
        {plate ? null : (
          // The niche sunk into the cloth, lit from within.
          <>
            <Path d={L.niche} fill={deep} fillOpacity={0.55} />
            {lite ? null : (
              <G clipPath={`url(#${id}k)`}>
                <Rect width={W} height={H} fill={`url(#${id}h)`} />
                {full ? <Path d={L.rays} stroke={foil} strokeOpacity={0.16} strokeWidth={0.5} /> : null}
              </G>
            )}
          </>
        )}
        {lite ? null : <Rect width={W} height={H} fill={`url(#${id}v)`} />}
        {lite ? null : (
          <G fill="none" stroke="#000000" strokeOpacity={0.45} strokeLinecap="round" strokeLinejoin="round" transform="translate(0.35 0.45)">
            {stamped}
          </G>
        )}
        <G fill="none" stroke={gilt} strokeLinecap="round" strokeLinejoin="round">
          {stamped}
        </G>
        <Circle cx={CX} cy={L.top - 3.2} r={1.3} fill={foil} />
        {/* The spine: rounded, with raised bands, and the joint where the board hinges. */}
        <Rect width={SPINE} height={H} fill={deep} />
        {lite ? null : <Rect width={SPINE} height={H} fill={`url(#${id}s)`} />}
        <Path d={`M0 14H${SPINE}M0 17H${SPINE}M0 123H${SPINE}M0 126H${SPINE}${full ? `M0 44H${SPINE}M0 96H${SPINE}` : ''}`} stroke={foil} strokeOpacity={0.8} strokeWidth={full ? 0.7 : 1} />
        <Rect x={SPINE} width={1.1} height={H} fill="#000000" fillOpacity={0.38} />
        {lite ? null : <Rect x={SPINE + 1.1} width={0.6} height={H} fill="#ffffff" fillOpacity={0.12} />}
      </Svg>
      {/* The weave, over cloth, gold and painting alike. */}
      {lite ? null : <Image source={CLOTH} resizeMode="repeat" accessibilityIgnoresInvertColors style={StyleSheet.absoluteFill} />}
      {draw && !plate ? (
        <View pointerEvents="none" style={{ position: 'absolute', left: (CX - 32 * L.es) * k, top: (L.ey - 32 * L.es) * k }}>
          <LineArt paths={EMBLEMS[emblem]} size={box} color={foil} strokeWidth={full ? 1.9 : 2.3} delay={drawDelay} />
        </View>
      ) : null}
      {full ? (
        <View pointerEvents="none" style={[styles.title, { left: width * 0.19, right: width * 0.1, top: height * L.titleTop, height: height * L.titleHeight }]}>
          <Text
            allowFontScaling={false}
            numberOfLines={2}
            style={[{ fontFamily: SANSKRIT_FONT, color: foil, fontSize: size, lineHeight: size * LEADING, textAlign: 'center' }, lite ? null : styles.pressed]}>
            {title}
          </Text>
        </View>
      ) : null}
    </View>
  );
});

/** The silk marker hanging from the foot of a book, its end cut to a swallowtail. */
export function Marker({ color, width, length, left, top }: { color: string; width: number; length: number; left: number; top: number }) {
  return (
    <Svg pointerEvents="none" width={width} height={length} viewBox="0 0 10 24" preserveAspectRatio="none" style={{ position: 'absolute', left, top }}>
      <Path d="M0 0H10V24L5 18L0 24Z" fill={color} />
      {/* Shaded where it leaves the pages. */}
      <Rect width={10} height={5} fill="#000000" fillOpacity={0.3} />
    </Svg>
  );
}

const styles = StyleSheet.create({
  drawing: { position: 'absolute', left: 0, top: 0 },
  title: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  pressed: { textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0.6, height: 0.8 }, textShadowRadius: 0.5 },
});
