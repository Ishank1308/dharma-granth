import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps, ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, Text, useWindowDimensions, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppState } from '@/state/app-state';
import type { Cover } from '@/theme/covers';
import { BAR_HEIGHT, fontCap, RADIUS, separator, SPACE, TITLE_FONT_CAP, TOUCH, TYPE, type Palette } from '@/theme/themes';

/**
 * Frosted glass, after the website's Liquid Glass cards (app/styles/colour.css):
 * a translucent surface over the aurora, a lit top edge, a soft rim and a diagonal sheen.
 * Android has no cheap backdrop blur, so the frost comes from translucency and the sheen;
 * the web build also gets a real backdrop-filter.
 *
 * With light effects (palette.lite) the surface, rim and lit top edge stay, as a plain top border, but the
 * blurred drop shadow, the inset shadow and the gradient sheen go: those are what a budget GPU repaints on
 * every scrolled frame.
 */
export function glass(palette: Palette, strong = false): ViewStyle {
  if (palette.lite) {
    return {
      backgroundColor: strong ? palette.glassStrong : palette.glass,
      borderColor: palette.rim,
      borderTopColor: palette.rimTop,
      borderWidth: 1,
    };
  }
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
  if (palette.lite) {
    return {
      backgroundColor: palette.accentGradient[1],
      borderColor: 'rgba(255,255,255,0.25)',
      borderTopColor: 'rgba(255,255,255,0.4)',
      borderWidth: 1,
    };
  }
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
 *
 * With light effects it is cached as a GPU texture, so scrolling a list over it no longer repaints five
 * full-screen gradients each frame. It looks the same; it only costs one screen-sized texture of memory.
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
      renderToHardwareTextureAndroid={!!palette.lite}
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
      <StatusBarScrim />
    </View>
  );
}

/**
 * A strip of the page colour behind the status bar. Lists scroll under the edge-to-edge status bar, and without
 * it a scrolled heading ("Itihasa") runs into the clock and the battery icons.
 */
function StatusBarScrim() {
  const { palette } = useAppState();
  const { top } = useSafeAreaInsets();
  if (!top) return null;
  return (
    <View
      pointerEvents="none"
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      style={{ position: 'absolute', top: 0, left: 0, right: 0, height: top, backgroundColor: palette.bg }}
    />
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

/**
 * A book's cover colours as a fill, the same gradient as its cover on dharmagranth.dev. Light effects keep
 * the mid colour as a flat fill.
 */
export function coverFill(cover: Cover, palette: Palette, behindText = false): ViewStyle {
  const [deep, mid, light] = cover.colors;
  if (palette.lite) return { backgroundColor: behindText ? deep : mid };
  return {
    backgroundColor: mid,
    // Behind small white text (the verse number capsule) the gradient stops at the mid colour, which keeps
    // the label above 4.5:1 for every cover; the light end is for large type and decoration only.
    backgroundImage: behindText
      ? `linear-gradient(140deg, ${deep} 0%, ${mid} 100%)`
      : `linear-gradient(140deg, ${deep} 0%, ${mid} 55%, ${light} 100%)`,
  };
}

/**
 * The top of a primary screen, after One UI: on open the header holds the top third of the screen with the
 * title near its foot, so the content, and every control, starts within reach of the thumb. It scrolls away
 * with the list, so the reading space comes back as soon as the reader scrolls.
 */
export function LargeHeader({
  title,
  eyebrow,
  subtitle,
  children,
}: {
  title: { en: string; hi: string };
  eyebrow?: { en: string; hi: string };
  subtitle?: string;
  children?: ReactNode;
}) {
  const { palette } = useAppState();
  const { height } = useWindowDimensions();
  return (
    <View style={[styles.largeHeader, { minHeight: Math.round(height * 0.28) }]}>
      {eyebrow ? <Eyebrow {...eyebrow} /> : null}
      <View accessibilityRole="header">
        <PageTitle {...title} />
      </View>
      {children}
      {subtitle ? (
        <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.subhead }}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

/** A section heading over a grouped card, with an optional count or note on the right. */
export function GroupTitle({ title, detail }: { title: string; detail?: string }) {
  const { palette } = useAppState();
  return (
    <View style={styles.groupTitle} accessibilityRole="header">
      <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ flexShrink: 1, color: palette.text, fontSize: TYPE.title2 - 2, fontWeight: '700' }}>
        {title}
      </Text>
      {detail ? (
        <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.footnote }}>
          {detail}
        </Text>
      ) : null}
    </View>
  );
}

/**
 * A grouped list, as Apple's inset grouped lists and One UI's cards: one rounded surface with hairlines
 * between the rows, in place of a stack of separately shadowed tiles. Rows are GroupRow children.
 */
export function GroupCard({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const { palette } = useAppState();
  return <View style={[styles.group, groupSurface(palette), style]}>{children}</View>;
}

/** The grouped card's surface: the strong glass without the drop shadow, so long lists stay cheap to draw. */
export function groupSurface(palette: Palette): ViewStyle {
  return {
    backgroundColor: palette.glassStrong,
    borderColor: palette.rim,
    borderTopColor: palette.rimTop,
    borderWidth: 1,
  };
}

/**
 * One row of a grouped list. For a list too long to render at once (chapters, books), pass `first` and
 * `last` and render each row on its own: the row rounds its own corners and draws the hairline above it,
 * so a FlatList can recycle rows and still look like one card.
 */
export function GroupRow({
  children,
  onPress,
  accessibilityLabel,
  accessibilityRole = 'button',
  accessibilityHint,
  first,
  last,
  standalone,
  inset = 60,
  highlight,
  style,
}: {
  children: ReactNode;
  onPress?: () => void;
  accessibilityLabel?: string;
  accessibilityRole?: 'button' | 'link' | 'none';
  accessibilityHint?: string;
  /** Set on rows rendered one by one in a list, so each row draws its own share of the card. */
  first?: boolean;
  last?: boolean;
  /** A row inside a GroupCard: the card draws the surface. */
  standalone?: boolean;
  /** Where the hairline above the row starts, so it lines up with the text, not the icon. */
  inset?: number;
  highlight?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const { palette } = useAppState();
  const own = first !== undefined || last !== undefined;
  const surface: ViewStyle | null = own
    ? {
        backgroundColor: palette.glassStrong,
        borderColor: palette.rim,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderTopWidth: first ? 1 : 0,
        borderBottomWidth: last ? 1 : 0,
        borderTopColor: first ? palette.rimTop : palette.rim,
        borderTopLeftRadius: first ? RADIUS.group : 0,
        borderTopRightRadius: first ? RADIUS.group : 0,
        borderBottomLeftRadius: last ? RADIUS.group : 0,
        borderBottomRightRadius: last ? RADIUS.group : 0,
        marginBottom: last ? SPACE.lg : 0,
        overflow: 'hidden',
      }
    : null;
  const divider = (own ? !first : !standalone) ? (
    <View pointerEvents="none" style={[styles.divider, { left: inset, backgroundColor: separator(palette) }]} />
  ) : null;
  const body = (pressed: boolean) => [
    styles.groupRow,
    surface,
    highlight && { backgroundColor: palette.dark ? 'rgba(255,159,10,0.12)' : 'rgba(234,88,12,0.08)' },
    pressed && { backgroundColor: palette.dark ? 'rgba(255,255,255,0.08)' : 'rgba(60,40,20,0.06)' },
    style,
  ];
  if (!onPress) {
    return (
      <View style={body(false)} accessible={!!accessibilityLabel} accessibilityLabel={accessibilityLabel}>
        {divider}
        {children}
      </View>
    );
  }
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole={accessibilityRole === 'none' ? undefined : accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      style={({ pressed }) => body(pressed)}>
      {divider}
      {children}
    </Pressable>
  );
}

/** A book's monogram in its cover colours, with the foil letter, as the website's library tiles. */
export function CoverTile({ cover, letter, size = 44 }: { cover: Cover; letter: string; size?: number }) {
  const { palette } = useAppState();
  return (
    <View
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden
      style={[
        { width: size, height: size, borderRadius: Math.round(size * 0.3), alignItems: 'center', justifyContent: 'center' },
        coverFill(cover, palette),
      ]}>
      <Text allowFontScaling={false} style={{ color: cover.foil, fontSize: Math.round(size * 0.44), lineHeight: Math.round(size * 0.62) }}>
        {letter}
      </Text>
    </View>
  );
}

/** A settings row's coloured icon tile, as Apple's Settings and One UI: white glyph on one spectrum hue. */
export function IconTile({ icon, color }: { icon: ComponentProps<typeof Ionicons>['name']; color: string }) {
  return (
    <View
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden
      style={{ width: 32, height: 32, borderRadius: 9, backgroundColor: color, alignItems: 'center', justifyContent: 'center' }}>
      <Ionicons name={icon} size={18} color="#ffffff" />
    </View>
  );
}

/** A round icon button with a full 48 dp touch target. */
export function IconButton({
  icon,
  onPress,
  accessibilityLabel,
  selected,
  tone = 'quiet',
  color,
  size = TOUCH,
  disabled,
}: {
  disabled?: boolean;
  icon: ComponentProps<typeof Ionicons>['name'];
  onPress: () => void;
  accessibilityLabel: string;
  selected?: boolean;
  tone?: 'quiet' | 'glass' | 'accent' | 'clear';
  color?: string;
  size?: number;
}) {
  const { palette } = useAppState();
  const fill: ViewStyle | null =
    tone === 'accent'
      ? accentFill(palette)
      : tone === 'glass'
        ? glass(palette, true)
        : tone === 'quiet'
          ? { backgroundColor: selected ? (palette.dark ? 'rgba(255,159,10,0.18)' : 'rgba(194,65,12,0.10)') : 'transparent' }
          : null;
  const tint = color ?? (tone === 'accent' ? palette.onAccent : selected ? palette.accent : palette.muted);
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
      accessibilityState={{ selected, disabled }}
      style={({ pressed }) => [
        { width: size, height: size, borderRadius: size / 2, alignItems: 'center', justifyContent: 'center' },
        fill,
        pressed && { opacity: 0.7, transform: [{ scale: 0.94 }] },
      ]}>
      <Ionicons name={icon} size={Math.round(size * 0.44)} color={tint} />
    </Pressable>
  );
}

/**
 * The floating bars' surface: the theme's card colour, nearly opaque. Android has no backdrop blur, so a
 * thinner glass would let the list scrolling underneath show through the labels; with light effects it
 * is fully opaque.
 */
export function barSurface(palette: Palette): string {
  const hex = (palette.dark ? '#1c1c1e' : palette.card).replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return `rgba(${r}, ${g}, ${b}, ${palette.lite ? 1 : 0.94})`;
}

/**
 * A floating glass capsule pinned above the bottom edge: the tab bar and the reader's toolbar. It holds
 * every control in the thumb zone, as One UI asks, and floats over the content like Apple's Liquid Glass.
 */
export function FloatingBar({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const { palette } = useAppState();
  return (
    <View
      style={[
        styles.floatingBar,
        glass(palette, true),
        { backgroundColor: barSurface(palette) },
        !palette.lite && { boxShadow: palette.dark ? '0 12px 30px rgba(0,0,0,0.5)' : '0 12px 32px rgba(60,30,10,0.16)' },
        style,
      ]}>
      {children}
    </View>
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
  largeHeader: { justifyContent: 'flex-end', rowGap: SPACE.sm, paddingBottom: SPACE.lg },
  groupTitle: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    columnGap: SPACE.sm,
    paddingHorizontal: SPACE.xs,
    marginTop: SPACE.lg,
    marginBottom: SPACE.sm,
  },
  group: { borderRadius: RADIUS.group, overflow: 'hidden' },
  groupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: SPACE.md,
    minHeight: 60,
    paddingVertical: SPACE.sm + 2,
    paddingHorizontal: SPACE.lg,
  },
  divider: { position: 'absolute', top: 0, right: 0, height: StyleSheet.hairlineWidth * 2 },
  floatingBar: {
    height: BAR_HEIGHT,
    borderRadius: BAR_HEIGHT / 2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACE.sm,
  },
  sectionTitle: {
    flexDirection: 'row',
    alignItems: 'baseline',
    columnGap: SPACE.sm,
    marginTop: SPACE.xl,
    marginBottom: SPACE.md,
  },
});
