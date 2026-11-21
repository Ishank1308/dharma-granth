import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';

import { useAppState } from '@/state/app-state';
import { RADIUS, SPACE, TYPE } from '@/theme/themes';

/**
 * English and Hindi as two separate Text elements, so screen readers and text extraction
 * never run them together ("Homeमुख"), same rule as the website header.
 */
export function Bilingual({
  en,
  hi,
  size = TYPE.callout,
  color,
  hiColor,
  weight = '600',
  style,
}: {
  en: string;
  hi: string;
  size?: number;
  color?: string;
  hiColor?: string;
  weight?: TextStyle['fontWeight'];
  style?: StyleProp<ViewStyle>;
}) {
  const { palette, settings } = useAppState();
  const s = size * settings.textScale;
  return (
    <View style={[styles.bilingual, style]}>
      <Text style={{ fontSize: s, fontWeight: weight, color: color ?? palette.text }}>{en}</Text>
      <Text style={{ fontSize: s * 0.92, color: hiColor ?? palette.muted }}>{hi}</Text>
    </View>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const { palette } = useAppState();
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: palette.card,
          borderColor: palette.border,
          shadowColor: palette.dark ? 'transparent' : '#000',
        },
        style,
      ]}>
      {children}
    </View>
  );
}

export function Chip({
  label,
  active,
  onPress,
  accessibilityLabel,
}: {
  label: string;
  active?: boolean;
  onPress: () => void;
  accessibilityLabel?: string;
}) {
  const { palette } = useAppState();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: !!active }}
      accessibilityLabel={accessibilityLabel ?? label}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: active ? palette.accent : palette.cardSoft,
          borderColor: active ? palette.accent : palette.border,
          opacity: pressed ? 0.7 : 1,
        },
      ]}>
      <Text style={{ color: active ? '#fff' : palette.text, fontSize: TYPE.footnote, fontWeight: '600' }}>{label}</Text>
    </Pressable>
  );
}

export function SectionTitle({ en, hi }: { en: string; hi: string }) {
  const { palette } = useAppState();
  return (
    <View style={styles.sectionTitle}>
      <Text style={{ color: palette.text, fontSize: TYPE.title3, fontWeight: '700' }}>{en}</Text>
      <Text style={{ color: palette.accent, fontSize: TYPE.subhead }}>{hi}</Text>
    </View>
  );
}

export function Muted({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  const { palette, settings } = useAppState();
  return <Text style={[{ color: palette.muted, fontSize: TYPE.footnote * settings.textScale }, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  bilingual: { flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap', columnGap: SPACE.sm },
  card: {
    borderRadius: RADIUS.card,
    borderWidth: StyleSheet.hairlineWidth,
    padding: SPACE.lg,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  chip: {
    paddingHorizontal: SPACE.md,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
    borderWidth: StyleSheet.hairlineWidth,
  },
  sectionTitle: {
    flexDirection: 'row',
    alignItems: 'baseline',
    columnGap: SPACE.sm,
    marginTop: SPACE.xl,
    marginBottom: SPACE.sm,
  },
});
