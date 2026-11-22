/**
 * A small standing book in its cover colours, for shelves and the Continue card: page edges, a shadowed
 * spine, a gilt frame and the foil monogram, turned a little toward you. It does not move on its own; the
 * one book that tilts with your finger and the phone is the title page's (Book3D).
 *
 * With light effects the gradient, sheen and shadow go and the cover is a flat fill, like every other surface.
 */
import { StyleSheet, Text, View } from 'react-native';

import { coverFill } from '@/components/ui';
import { usePrefs } from '@/state/app-state';
import type { Cover } from '@/theme/covers';
import { SANSKRIT_FONT } from '@/theme/fonts';

export function CoverBook({ cover, letter, width = 64, turn = -10 }: { cover: Cover; letter: string; width?: number; turn?: number }) {
  const { palette } = usePrefs();
  const height = Math.round(width * 1.38);
  const lite = palette.lite;
  return (
    <View
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden
      style={{ width: width + 4, height: height + 2, transform: turn && !lite ? [{ perspective: 700 }, { rotateY: `${turn}deg` }] : undefined }}>
      {/* The page block, showing past the cover's fore-edge. */}
      <View style={[styles.pages, { width, height: height - 4, borderTopRightRadius: width * 0.1, borderBottomRightRadius: width * 0.1 }]} />
      <View
        style={[
          styles.cover,
          { width, height, borderTopRightRadius: width * 0.12, borderBottomRightRadius: width * 0.12 },
          coverFill(cover, palette),
          !lite && {
            boxShadow: `inset ${Math.round(width * 0.08)}px 0 0 rgba(0,0,0,0.28), inset 0 0 0 1px ${cover.foil}55, 0 ${Math.round(width * 0.14)}px ${Math.round(width * 0.24)}px rgba(0,0,0,0.32)`,
          },
        ]}>
        <View pointerEvents="none" style={[styles.frame, { borderColor: cover.foil, left: width * 0.18, right: width * 0.1, top: width * 0.12, bottom: width * 0.12 }]} />
        <Text allowFontScaling={false} style={{ fontFamily: SANSKRIT_FONT, color: cover.foil, fontSize: Math.round(width * 0.42), lineHeight: Math.round(width * 0.66), marginLeft: width * 0.08 }}>
          {letter}
        </Text>
        {!lite ? (
          <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundImage: 'linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.2) 45%, transparent 60%)' }]} />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pages: { position: 'absolute', left: 4, top: 2, backgroundColor: '#efe4cc', borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(0,0,0,0.12)' },
  cover: { borderTopLeftRadius: 4, borderBottomLeftRadius: 4, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  frame: { position: 'absolute', borderWidth: 1, borderRadius: 3, opacity: 0.6 },
});
