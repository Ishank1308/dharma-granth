/**
 * A small standing book, for shelves, the Continue cards and the rows of the book list: the cloth binding
 * (src/components/art/cover-face) over its page block, with a silk marker hanging from the larger ones,
 * turned a little toward you. It does not move on its own; the one book that tilts with your finger and the
 * phone is the title page's (Book3D).
 *
 * With light effects the sheen and the shadow go, like every other surface.
 *
 * In the rows of the book list the cover is 40 dp wide and there are dozens of them, so it is drawn from a few
 * plain views instead (SmallCover): cloth, spine, and the painting or emblem under a round-headed arch. Weave and
 * shading cannot be seen at that size, and the list has to scroll as freely as it did with flat tiles.
 */
import { memo } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { usePrefs } from '@/state/app-state';
import type { Cover } from '@/theme/covers';

import type { CoverArt } from './cover-art';
import { CoverFace, COVER_RATIO, Marker } from './cover-face';
import { EMBLEMS } from './emblems';

/** Below this width a cover is drawn as a SmallCover. */
const FINE_FROM = 44;

export function CoverBook({
  cover,
  art,
  title,
  width = 64,
  turn = -10,
}: {
  cover: Cover;
  /** The painting or emblem in the arch (coverArt in src/components/art/cover-art). */
  art: CoverArt;
  /** The book's name in Devanagari; stamped on covers wide enough to carry it. */
  title?: string;
  width?: number;
  turn?: number;
}) {
  const { palette } = usePrefs();
  const height = Math.round(width * COVER_RATIO);
  const lite = palette.lite;
  if (width < FINE_FROM) return <SmallCover cover={cover} emblem={art.emblem} plate={art.plate} width={width} height={height} />;
  const pages = Math.max(2, Math.round(width * 0.05));
  const marker = width >= 76;
  const tail = marker ? Math.round(width * 0.13) : 0;
  return (
    <View
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden
      style={{ width: width + pages, height: height + tail, transform: turn && !lite ? [{ perspective: 700 }, { rotateY: `${turn}deg` }] : undefined }}>
      {/* The silk marker, hanging from the foot. */}
      {marker ? <Marker color={cover.colors[2]} width={Math.round(width * 0.07)} length={tail + 3} left={width * 0.7} top={height - 3} /> : null}
      {/* The page block, showing past the cover's fore-edge. */}
      <View
        style={[
          styles.pages,
          { left: pages, width, height: height - 4, borderTopRightRadius: width * 0.08, borderBottomRightRadius: width * 0.08 },
          !lite && { backgroundImage: 'repeating-linear-gradient(0deg, #f4ead4 0px, #f4ead4 1.5px, #d9c8a4 1.5px, #d9c8a4 2.2px)' },
        ]}
      />
      <View
        style={[
          styles.cover,
          { width, height, borderTopRightRadius: width * 0.1, borderBottomRightRadius: width * 0.1, backgroundColor: cover.colors[1] },
          !lite && { boxShadow: `0 1px 1px rgba(0,0,0,0.35), 0 ${Math.round(width * 0.13)}px ${Math.round(width * 0.2)}px -${Math.round(width * 0.05)}px rgba(40,20,5,0.5)` },
        ]}>
        <View style={[styles.clip, { borderTopRightRadius: width * 0.1, borderBottomRightRadius: width * 0.1 }]}>
          <CoverFace cover={cover} emblem={art.emblem} plate={art.plate} title={title} width={width} />
          {!lite ? (
            // Light across the cloth, and the pale line where the board's edge has rubbed.
            <View
              pointerEvents="none"
              style={[
                StyleSheet.absoluteFill,
                styles.rubbed,
                { borderTopRightRadius: width * 0.1, borderBottomRightRadius: width * 0.1, backgroundImage: 'linear-gradient(112deg, transparent 28%, rgba(255,255,255,0.13) 44%, transparent 58%)' },
              ]}
            />
          ) : null}
        </View>
      </View>
    </View>
  );
}

const SmallCover = memo(function SmallCover({ cover, emblem, plate, width, height }: { cover: Cover; emblem: CoverArt['emblem']; plate: CoverArt['plate']; width: number; height: number }) {
  const [deep, mid] = cover.colors;
  const arch = Math.round(width * 0.62);
  const tall = Math.round(height * 0.7);
  return (
    <View importantForAccessibility="no-hide-descendants" accessibilityElementsHidden style={[styles.small, { width, height, backgroundColor: mid, borderLeftColor: deep, borderLeftWidth: Math.round(width * 0.12) }]}>
      {plate ? (
        <Image
          source={plate}
          resizeMode="cover"
          // Decoded at the size it is shown, so a list of them holds thumbnails in memory and not the full plates.
          resizeMethod="resize"
          accessibilityIgnoresInvertColors
          style={{ width: arch, height: tall, borderTopLeftRadius: arch / 2, borderTopRightRadius: arch / 2, borderWidth: 1, borderColor: cover.foil }}
        />
      ) : (
        <View style={[styles.niche, { width: arch, height: tall, borderTopLeftRadius: arch / 2, borderTopRightRadius: arch / 2, backgroundColor: deep, borderColor: cover.foil }]}>
          <Svg width={arch * 0.8} height={arch * 0.8} viewBox="0 0 64 64">
            <Path d={EMBLEMS[emblem].join('')} fill="none" stroke={cover.foil} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  small: { alignItems: 'center', justifyContent: 'center', borderTopLeftRadius: 2, borderBottomLeftRadius: 2, borderTopRightRadius: 4, borderBottomRightRadius: 4, overflow: 'hidden' },
  niche: { alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  pages: { position: 'absolute', top: 2, backgroundColor: '#efe4cc', borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(0,0,0,0.14)' },
  cover: { borderTopLeftRadius: 3, borderBottomLeftRadius: 3 },
  // The clip is its own layer, so the cover's shadow is not cut off with the drawing.
  rubbed: { borderTopLeftRadius: 3, borderBottomLeftRadius: 3, boxShadow: 'inset 0 0 0 1px rgba(255,235,200,0.2)' },
  clip: { flex: 1, borderTopLeftRadius: 3, borderBottomLeftRadius: 3, overflow: 'hidden' },
});
