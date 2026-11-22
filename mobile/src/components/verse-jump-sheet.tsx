import { FlatList, StyleSheet, Text, View } from 'react-native';

import { S, useI18n } from '@/i18n';
import { PressableScale } from '@/motion/pressable-scale';
import { Sheet } from '@/motion/sheet';
import { usePrefs } from '@/state/app-state';
import { quietFill, RADIUS, SPACE, TOUCH, TYPE } from '@/theme/themes';

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
  const { palette } = usePrefs();
  const { t } = useI18n();
  return (
    <Sheet visible={visible} title={t(S.jumpToVerse)} onClose={onClose} maxHeight="70%">
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
              <PressableScale
                scaleTo={0.9}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                accessibilityLabel={t(S.verseA11y(item))}
                onPress={() => onPick(index)}
                style={[styles.cell, { backgroundColor: active ? palette.accent : quietFill(palette) }]}>
                <Text maxFontSizeMultiplier={1.4} style={{ color: active ? palette.onAccent : palette.text, fontSize: TYPE.callout, fontWeight: '600' }}>
                  {item}
                </Text>
              </PressableScale>
            );
          }}
        />
    </Sheet>
  );
}

const styles = StyleSheet.create({
  cellSpacer: { flex: 1 },
  cell: { flex: 1, minHeight: TOUCH, borderRadius: RADIUS.control, alignItems: 'center', justifyContent: 'center' },
});
