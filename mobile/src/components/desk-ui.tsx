import Ionicons from '@expo/vector-icons/Ionicons';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { verseLabel } from '@/content/compare';
import { useI18n } from '@/i18n';
import type { QueueItem } from '@/lib/desk';
import { Sheet } from '@/motion/sheet';
import { usePrefs } from '@/state/app-state';
import { quietFill, RADIUS, separator, SPACE, TITLE_FONT_CAP, TOUCH, TYPE, UI_FONT_CAP } from '@/theme/themes';

/** A thin progress bar in a hue, for a book's share read. */
export function ProgressBar({ value, color }: { value: number; color: string }) {
  const { palette } = usePrefs();
  return (
    <View style={[styles.track, { backgroundColor: quietFill(palette) }]}>
      <View style={[styles.fill, { width: `${Math.max(2, Math.min(100, value))}%`, backgroundColor: color }]} />
    </View>
  );
}

/** A big number with its label, inside a bento tile. */
export function Stat({ value, label, detail, color }: { value: string; label: string; detail?: string; color: string }) {
  const { palette } = usePrefs();
  return (
    <View accessible accessibilityLabel={`${label}: ${value}${detail ? `. ${detail}` : ''}`}>
      <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color, fontSize: TYPE.largeTitle, fontWeight: '800', fontVariant: ['tabular-nums'] }}>
        {value}
      </Text>
      <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.subhead, fontWeight: '700' }}>
        {label}
      </Text>
      {detail ? (
        <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.footnote, marginTop: 2 }}>
          {detail}
        </Text>
      ) : null}
    </View>
  );
}

/** A full-width capsule action: saffron for the one action to take, glass for the rest. */
export function ActionButton({
  label,
  icon,
  onPress,
  primary,
  disabled,
}: {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  primary?: boolean;
  disabled?: boolean;
}) {
  const { palette } = usePrefs();
  const color = primary ? palette.onAccent : palette.text;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.action,
        primary ? { backgroundColor: palette.accent } : { backgroundColor: quietFill(palette), borderColor: palette.rim, borderWidth: 1 },
        disabled && { opacity: 0.45 },
        pressed && { transform: [{ scale: 0.97 }] },
      ]}>
      {icon ? <Ionicons name={icon} size={18} color={color} /> : null}
      <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color, fontSize: TYPE.subhead, fontWeight: '700', flexShrink: 1, textAlign: 'center' }}>
        {label}
      </Text>
    </Pressable>
  );
}

/** A sheet listing verses to pick one from (saved verses, the queue). */
export function VersePickSheet({
  visible,
  title,
  items,
  empty,
  onPick,
  onClose,
  header,
}: {
  visible: boolean;
  title: string;
  items: QueueItem[];
  empty: string;
  onPick: (item: QueueItem) => void;
  onClose: () => void;
  header?: ReactNode;
}) {
  const { palette } = usePrefs();
  const { lang } = useI18n();
  return (
    <Sheet visible={visible} title={title} onClose={onClose}>
      {header}
      <ScrollView>
        {items.length === 0 ? (
          <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.body, padding: SPACE.sm }}>
            {empty}
          </Text>
        ) : (
          <View style={[styles.group, { backgroundColor: quietFill(palette) }]}>
            {items.map((q, i) => (
              <Pressable
                key={`${q.id}:${q.chapter}:${q.verse}`}
                onPress={() => onPick(q)}
                accessibilityRole="button"
                style={({ pressed }) => [styles.row, pressed && { backgroundColor: quietFill(palette) }]}>
                {i ? <View style={[styles.hairline, { backgroundColor: separator(palette) }]} /> : null}
                <Ionicons name="book-outline" size={20} color={palette.accent} />
                <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ flex: 1, color: palette.text, fontSize: TYPE.body }}>
                  {verseLabel(q.id, q.chapter, q.verse, lang)}
                </Text>
                <Ionicons name="add" size={20} color={palette.muted} />
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  track: { height: 6, borderRadius: 3, overflow: 'hidden' },
  fill: { height: 6, borderRadius: 3 },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: SPACE.sm,
    minHeight: TOUCH,
    paddingHorizontal: SPACE.lg,
    paddingVertical: SPACE.sm,
    borderRadius: RADIUS.pill,
  },
  group: { borderRadius: RADIUS.row, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', columnGap: SPACE.md, minHeight: TOUCH + 4, paddingHorizontal: SPACE.lg },
  hairline: { position: 'absolute', top: 0, left: 48, right: 0, height: StyleSheet.hairlineWidth * 2 },
});
