import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconButton } from '@/components/ui';
import { S, useI18n } from '@/i18n';
import { usePrefs } from '@/state/app-state';
import { quietFill, RADIUS, SPACE, TITLE_FONT_CAP, TOUCH, TYPE } from '@/theme/themes';

/** A grid of the chapter's verse numbers, so a reader can jump to any verse with one tap. */
export function VerseJumpSheet({
  visible,
  onClose,
  numbers,
  current,
  onPick,
}: {
  visible: boolean;
  onClose: () => void;
  numbers: string[];
  current: number;
  onPick: (index: number) => void;
}) {
  const insets = useSafeAreaInsets();
  const { palette, reduceMotion } = usePrefs();
  const { t } = useI18n();
  return (
    <Modal visible={visible} transparent animationType={reduceMotion ? 'none' : 'slide'} statusBarTranslucent navigationBarTranslucent onRequestClose={onClose}>
      {/* Tapping outside closes the sheet; screen readers use the Close button or Back instead. */}
      <Pressable style={styles.scrim} onPress={onClose} accessible={false} importantForAccessibility="no" />
      <View
        accessibilityViewIsModal
        style={[
          styles.sheet,
          { backgroundColor: palette.dark ? '#1c1c1e' : palette.card, paddingBottom: Math.max(insets.bottom, SPACE.lg) },
        ]}>
        <View style={[styles.grabber, { backgroundColor: quietFill(palette) }]} />
        <View style={styles.head}>
          <Text accessibilityRole="header" maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.title2, fontWeight: '700' }}>
            {t(S.jumpToVerse)}
          </Text>
          <IconButton icon="close" onPress={onClose} accessibilityLabel={t(S.close)} color={palette.text} />
        </View>
        <FlatList
          // Padded to whole rows, so the cells on a short last row keep the same width as the rest.
          data={[...numbers, ...Array.from({ length: (5 - (numbers.length % 5)) % 5 }, () => '')]}
          keyExtractor={(n, i) => `${n}-${i}`}
          numColumns={5}
          initialNumToRender={60}
          columnWrapperStyle={{ columnGap: SPACE.sm }}
          contentContainerStyle={{ rowGap: SPACE.sm, paddingBottom: SPACE.sm }}
          renderItem={({ item, index }) => {
            if (!item) return <View style={styles.cellSpacer} />;
            const active = index === current;
            return (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                accessibilityLabel={t(S.verseA11y(item))}
                onPress={() => onPick(index)}
                style={({ pressed }) => [
                  styles.cell,
                  { backgroundColor: active ? palette.accent : quietFill(palette) },
                  pressed && { opacity: 0.7 },
                ]}>
                <Text maxFontSizeMultiplier={1.4} style={{ color: active ? palette.onAccent : palette.text, fontSize: TYPE.callout, fontWeight: '600' }}>
                  {item}
                </Text>
              </Pressable>
            );
          }}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: '70%',
    borderTopLeftRadius: RADIUS.panel + 6,
    borderTopRightRadius: RADIUS.panel + 6,
    paddingHorizontal: SPACE.xl - 4,
    paddingTop: SPACE.sm,
  },
  grabber: { alignSelf: 'center', width: 40, height: 5, borderRadius: 3, marginBottom: SPACE.sm },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACE.sm },
  cellSpacer: { flex: 1 },
  cell: { flex: 1, minHeight: TOUCH, borderRadius: RADIUS.control, alignItems: 'center', justifyContent: 'center' },
});
