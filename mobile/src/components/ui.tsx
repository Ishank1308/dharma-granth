import type { ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';

import { useAppState } from '@/state/app-state';
import { fontCap, RADIUS, SPACE, TITLE_FONT_CAP, TYPE, type Palette } from '@/theme/themes';

/**
 * Frosted glass, after the website's Liquid Glass cards (app/styles/colour.css):
 * a translucent surface over the aurora, a lit top edge, a soft rim and a diagonal sheen.
 * Android has no cheap backdrop blur, so the frost comes from translucency and the sheen;
 * the web build also gets a real backdrop-filter.
 */
export function glass(palette: Palette, strong = false): ViewStyle {
  const sheen = palette.dark
    ? 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 45%)'
    : 'linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 50%)';
  return {
    backgroundColor: strong ? palette.glassStrong : palette.glass,
    borderColor: palette.rim,
    borderWidth: 1,
    backgroundImage: sheen,
    boxShadow: palette.dark
      ? `inset 0 1px 0 ${palette.rimTop}, 0 10px 30px rgba(0,0,0,0.45)`
      : `inset 0 1px 0 ${palette.rimTop}, 0 8px 24px rgba(60,30,10,0.08), 0 1px 2px rgba(60,30,10,0.06)`,
    ...(Platform.OS === 'web' ? ({ backdropFilter: 'saturate(190%) blur(22px)' } as ViewStyle) : null),
  };
}

/** Accent gradient fill for active chips and primary buttons. */
export function accentFill(palette: Palette): ViewStyle {
  return {
    backgroundColor: palette.accentGradient[1],
    backgroundImage: `linear-gradient(135deg, ${palette.accentGradient[0]} 0%, ${palette.accentGradient[1]} 100%)`,
    borderColor: 'rgba(255,255,255,0.25)',
    borderWidth: 1,
    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.35), 0 6px 16px ${palette.dark ? 'rgba(255,138,0,0.25)' : 'rgba(194,65,12,0.28)'}`,
  };
}

/**
 * The aurora behind every screen: five soft pools of colour like the website's body::before,
 * so the glass above has something to frost. Drawn once, behind the navigator.
 */
export function Aurora({ quiet = false }: { quiet?: boolean }) {
  const { palette } = useAppState();
  const [saffron, lotus, peacock, indigo, gold] = palette.aurora;
  const pools = [
    `radial-gradient(70% 45% at 10% 6%, ${saffron} 0%, transparent 70%)`,
    `radial-gradient(60% 40% at 95% 18%, ${lotus} 0%, transparent 70%)`,
    `radial-gradient(75% 45% at 80% 92%, ${peacock} 0%, transparent 72%)`,
    `radial-gradient(60% 40% at 8% 70%, ${indigo} 0%, transparent 70%)`,
    `radial-gradient(55% 35% at 50% 45%, ${gold} 0%, transparent 72%)`,
  ].join(', ');
  return (
    <View
      pointerEvents="none"
      style={[StyleSheet.absoluteFill, { backgroundColor: palette.bg, backgroundImage: pools, opacity: quiet ? 0.6 : 1 }]}
    />
  );
}

/** A screen's backdrop: the aurora with the screen's content on top. */
export function Backdrop({ children, quiet }: { children: ReactNode; quiet?: boolean }) {
  return (
    <View style={{ flex: 1 }}>
      <Aurora quiet={quiet} />
      {children}
    </View>
  );
}

/**
 * Interface text in the reader's language (Settings → Language). Components take both strings so a
 * pair from @/i18n/strings can be spread straight in: <SectionTitle {...S.theme} />.
 */
export function Bilingual({
  en,
  hi,
  size = TYPE.callout,
  color,
  weight = '600',
  style,
}: {
  en: string;
  hi: string;
  size?: number;
  color?: string;
  weight?: TextStyle['fontWeight'];
  style?: StyleProp<ViewStyle>;
}) {
  const { palette, settings, lang } = useAppState();
  return (
    <View style={[styles.bilingual, style]}>
      <Text
        maxFontSizeMultiplier={fontCap(settings.textScale)}
        style={{ flexShrink: 1, fontSize: size * settings.textScale, fontWeight: weight, color: color ?? palette.text }}>
        {lang === 'hi' ? hi : en}
      </Text>
    </View>
  );
}

/** A screen's large title, in the reader's language. */
export function PageTitle({ en, hi }: { en: string; hi: string }) {
  const { palette, lang } = useAppState();
  return (
    <Text
      maxFontSizeMultiplier={TITLE_FONT_CAP}
      style={{ color: palette.text, fontSize: 34, fontWeight: '800', letterSpacing: lang === 'hi' ? 0 : -0.6 }}>
      {lang === 'hi' ? hi : en}
    </Text>
  );
}

export function Card({ children, style, strong }: { children: ReactNode; style?: StyleProp<ViewStyle>; strong?: boolean }) {
  const { palette } = useAppState();
  return <View style={[styles.card, glass(palette, strong), style]}>{children}</View>;
}

/** A tappable glass tile for lists of scriptures and chapters. */
export function GlassRow({
  children,
  onPress,
  accessibilityLabel,
  accessibilityRole = 'button',
}: {
  children: ReactNode;
  onPress: () => void;
  accessibilityLabel?: string;
  accessibilityRole?: 'button' | 'link';
}) {
  const { palette } = useAppState();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [styles.row, glass(palette), pressed && { transform: [{ scale: 0.985 }], opacity: 0.85 }]}>
      {children}
    </Pressable>
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
      style={({ pressed }) => [styles.chip, active ? accentFill(palette) : glass(palette), { opacity: pressed ? 0.75 : 1 }]}>
      <Text style={{ color: active ? palette.onAccent : palette.text, fontSize: TYPE.footnote, fontWeight: '600' }}>{label}</Text>
    </Pressable>
  );
}

/** The small frosted capsule over a page title, like the website's eyebrow. */
export function Eyebrow({ en, hi, style }: { en: string; hi: string; style?: StyleProp<ViewStyle> }) {
  const { palette, lang } = useAppState();
  return (
    <View style={[styles.eyebrow, glass(palette), style]}>
      <View style={[styles.dot, { backgroundColor: palette.accent }]} />
      <Text style={{ flexShrink: 1, color: palette.accent, fontSize: TYPE.caption, fontWeight: '700', letterSpacing: lang === 'hi' ? 0 : 0.6 }}>
        {lang === 'hi' ? hi : en.toUpperCase()}
      </Text>
    </View>
  );
}

export function SectionTitle({ en, hi }: { en: string; hi: string }) {
  const { palette, lang } = useAppState();
  return (
    <View style={styles.sectionTitle}>
      <Text style={{ flexShrink: 1, color: palette.text, fontSize: TYPE.title3, fontWeight: '700' }}>
        {lang === 'hi' ? hi : en}
      </Text>
    </View>
  );
}

export function Muted({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  const { palette, settings } = useAppState();
  return (
    <Text maxFontSizeMultiplier={fontCap(settings.textScale)} style={[{ color: palette.muted, fontSize: TYPE.footnote * settings.textScale }, style]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  bilingual: { flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap', columnGap: SPACE.sm },
  card: { borderRadius: RADIUS.card, padding: SPACE.lg, overflow: 'hidden' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: SPACE.md,
    paddingVertical: SPACE.md,
    paddingHorizontal: SPACE.lg,
    borderRadius: RADIUS.row,
    marginBottom: SPACE.sm,
  },
  chip: { paddingHorizontal: SPACE.md + 2, paddingVertical: 7, borderRadius: RADIUS.pill },
  eyebrow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    columnGap: 6,
    paddingHorizontal: SPACE.md,
    paddingVertical: 5,
    borderRadius: RADIUS.pill,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  sectionTitle: {
    flexDirection: 'row',
    alignItems: 'baseline',
    columnGap: SPACE.sm,
    marginTop: SPACE.xl,
    marginBottom: SPACE.md,
  },
});
