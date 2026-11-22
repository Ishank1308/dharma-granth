/**
 * The end of a chapter: a moment of stillness before the next one. A shanti patha closes a reading in the
 * tradition, so the page ends with it rather than with a button alone. Nothing to tap, nothing counted,
 * no confetti: the reader is told the chapter is complete and invited to stay with it for a breath.
 */
import { StyleSheet, Text, View } from 'react-native';

import { Muted } from '@/components/ui';
import { S, useI18n } from '@/i18n';
import { usePrefs } from '@/state/app-state';
import { SANSKRIT_FONT } from '@/theme/fonts';
import { huesFor, SPACE, TYPE, UI_FONT_CAP } from '@/theme/themes';

export function ChapterClose({ chapter, lastOf }: { chapter: number; /** The book's name, on its last chapter. */ lastOf?: string }) {
  const { palette } = usePrefs();
  const { t } = useI18n();
  const gold = palette.dark ? palette.gold : huesFor(palette).saffron;
  const note = lastOf ? t(S.chapterCloseBookNote(lastOf)) : t(S.chapterCloseNote);
  return (
    <View
      style={styles.wrap}
      accessible
      accessibilityLabel={`${t(S.chapterCloseA11y)} ${t(S.chapterCloseTitle(chapter))}. ${note}`}>
      <View style={[styles.rule, { backgroundColor: palette.border }]} />
      <Text maxFontSizeMultiplier={UI_FONT_CAP} style={[styles.shanti, { color: gold }]}>
        ॥ ॐ शान्तिः शान्तिः शान्तिः ॥
      </Text>
      <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.callout, fontWeight: '600', textAlign: 'center' }}>
        {t(S.chapterCloseTitle(chapter))}
      </Text>
      <Muted style={{ textAlign: 'center' }}>{note}</Muted>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', rowGap: SPACE.xs, paddingTop: SPACE.xl, paddingBottom: SPACE.xl, paddingHorizontal: SPACE.lg },
  rule: { width: 48, height: StyleSheet.hairlineWidth * 2, marginBottom: SPACE.md },
  shanti: { fontFamily: SANSKRIT_FONT, fontSize: TYPE.title3, lineHeight: TYPE.title3 * 1.7, textAlign: 'center' },
});
