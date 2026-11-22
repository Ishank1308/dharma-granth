/**
 * Building blocks of the Learn screens, after the website's /learn pages: a progress bar, a row of section
 * tabs, a primary button, a lesson tick, and the course study formats (flashcards that turn over, a slide
 * deck you swipe, a mind map that opens branch by branch, and a timeline). Quizzes are left out on purpose.
 */
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, type Href } from 'expo-router';
import { useMemo, useState, type ComponentProps, type ReactNode } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

import { Para, VerseBlock } from '@/components/knowledge-ui';
import { accentFill, Card, Chip, glass } from '@/components/ui';
import type { Course, MindNode } from '@/content/learn';
import { S, useI18n } from '@/i18n';
import { hapticSelect, hapticTap } from '@/motion/haptics';
import { PressableScale } from '@/motion/pressable-scale';
import { SPRING } from '@/motion/tokens';
import { useMotion } from '@/motion/use-motion';
import { usePrefs } from '@/state/app-state';
import { fontCap, huesFor, quietFill, RADIUS, SPACE, TITLE_FONT_CAP, TOUCH, TYPE, UI_FONT_CAP, type Hues } from '@/theme/themes';

type IconName = ComponentProps<typeof Ionicons>['name'];

/** A thin rounded bar, filled to `value` (0..1) in the hue. */
export function ProgressBar({ value, hue = 'saffron', height = 6 }: { value: number; hue?: keyof Hues; height?: number }) {
  const { palette } = usePrefs();
  const color = huesFor(palette)[hue];
  const pct = Math.max(0, Math.min(1, value));
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(pct * 100) }}
      style={{ height, borderRadius: height / 2, backgroundColor: quietFill(palette), overflow: 'hidden' }}>
      <View style={{ width: `${pct * 100}%`, height, borderRadius: height / 2, backgroundColor: color }} />
    </View>
  );
}

/** Section tabs as a scrolling row of chips (the website's tab bar on a course page). */
export function SectionTabs<T extends string>({
  tabs,
  value,
  onChange,
  label,
}: {
  tabs: { key: T; title: string }[];
  value: T;
  onChange: (key: T) => void;
  label: string;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      accessibilityRole="radiogroup"
      accessibilityLabel={label}
      contentContainerStyle={{ columnGap: SPACE.sm, paddingVertical: 4, paddingHorizontal: 2 }}>
      {tabs.map((t) => (
        <Chip key={t.key} label={t.title} active={t.key === value} onPress={() => onChange(t.key)} />
      ))}
    </ScrollView>
  );
}

/** The one saffron action on a screen. */
export function PrimaryButton({ label, icon, onPress, disabled }: { label: string; icon?: IconName; onPress: () => void; disabled?: boolean }) {
  const { palette } = usePrefs();
  return (
    <PressableScale
      onPress={disabled ? undefined : onPress}
      haptic={!disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      style={[styles.primary, disabled ? { backgroundColor: quietFill(palette) } : accentFill(palette)]}>
      {icon ? <Ionicons name={icon} size={18} color={disabled ? palette.muted : palette.onAccent} /> : null}
      <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: disabled ? palette.muted : palette.onAccent, fontSize: TYPE.body, fontWeight: '700' }}>
        {label}
      </Text>
    </PressableScale>
  );
}

/** A quiet text button with an icon (open in the library, write a reflection). */
export function LinkButton({ label, icon, onPress }: { label: string; icon: IconName; onPress: () => void }) {
  const { palette } = usePrefs();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="link"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.link, { opacity: pressed ? 0.6 : 1 }]}>
      <Ionicons name={icon} size={16} color={palette.accent} />
      <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.accent, fontSize: TYPE.subhead, fontWeight: '600' }}>
        {label}
      </Text>
    </Pressable>
  );
}

export const go = (href: Href | null) => (href ? () => router.push(href) : undefined);

/** A round tick that marks a lesson done, with a spring as it fills. */
export function DoneTick({ done, onToggle, label, hue = 'tulsi' }: { done: boolean; onToggle: () => void; label: string; hue?: keyof Hues }) {
  const { palette } = usePrefs();
  const { animate } = useMotion();
  const color = huesFor(palette)[hue];
  const s = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));
  return (
    <Pressable
      onPress={() => {
        hapticTap();
        if (animate) {
          s.set(0.7);
          s.set(withSpring(1, SPRING.lively));
        }
        onToggle();
      }}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: done }}
      accessibilityLabel={label}
      hitSlop={8}
      style={styles.tickHit}>
      <Animated.View style={[styles.tick, { borderColor: done ? color : palette.muted, backgroundColor: done ? color : 'transparent' }, style]}>
        {done ? <Ionicons name="checkmark" size={18} color="#ffffff" /> : null}
      </Animated.View>
    </Pressable>
  );
}

/** A small capsule of text (level, minutes, a keyword). */
export function Pill({ text, hue }: { text: string; hue?: keyof Hues }) {
  const { palette } = usePrefs();
  const color = hue ? huesFor(palette)[hue] : palette.muted;
  return (
    <View style={[styles.pill, { borderColor: `${color}66`, backgroundColor: hue ? `${color}${palette.dark ? '2a' : '14'}` : quietFill(palette) }]}>
      <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: hue ? color : palette.text, fontSize: TYPE.caption, fontWeight: '700' }}>
        {text}
      </Text>
    </View>
  );
}

export function Pills({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.pills, style]}>{children}</View>;
}

/** A list of short lines with a dot in the hue (outcomes, checklists). */
export function Bullets({ items, hue = 'saffron', icon }: { items: string[]; hue?: keyof Hues; icon?: IconName }) {
  const { palette } = usePrefs();
  const color = huesFor(palette)[hue];
  return (
    <View style={{ rowGap: SPACE.sm }}>
      {items.map((item, i) => (
        <View key={i} style={styles.bullet}>
          {icon ? <Ionicons name={icon} size={16} color={color} style={{ marginTop: 3 }} /> : <View style={[styles.dot, { backgroundColor: color }]} />}
          <View style={{ flex: 1 }}>
            <Para>{item}</Para>
          </View>
        </View>
      ))}
    </View>
  );
}

// ─── Flashcards ──────────────────────────────────────────────────────────────

/**
 * The course's flashcards, one at a time: the question (and its Sanskrit) on the front, the answer on the
 * back. A tap turns the card over in 3D; with animations off it simply changes face.
 */
export function Flashcards({ cards, hue }: { cards: Course['flashcards']; hue: keyof Hues }) {
  const { palette, settings } = usePrefs();
  const { t } = useI18n();
  const { animate } = useMotion();
  const [order, setOrder] = useState(() => cards.map((_, i) => i));
  const [index, setIndex] = useState(0);
  const [back, setBack] = useState(false);
  const turn = useSharedValue(0);
  const color = huesFor(palette)[hue];
  const card = cards[order[index]];

  const front = useAnimatedStyle(() => ({
    transform: [{ perspective: 1200 }, { rotateY: `${interpolate(turn.value, [0, 1], [0, 180])}deg` }],
    opacity: turn.value < 0.5 ? 1 : 0,
  }));
  const rear = useAnimatedStyle(() => ({
    transform: [{ perspective: 1200 }, { rotateY: `${interpolate(turn.value, [0, 1], [180, 360])}deg` }],
    opacity: turn.value < 0.5 ? 0 : 1,
  }));

  if (!card) return null;
  const flip = () => {
    hapticSelect();
    const to = back ? 0 : 1;
    turn.set(animate ? withTiming(to, { duration: 420 }) : to);
    setBack(!back);
  };
  const move = (delta: number) => {
    turn.set(0);
    setBack(false);
    setIndex((i) => (i + delta + cards.length) % cards.length);
  };
  const shuffle = () => {
    const next = [...order];
    for (let i = next.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [next[i], next[j]] = [next[j], next[i]];
    }
    turn.set(0);
    setBack(false);
    setOrder(next);
    setIndex(0);
  };
  const size = TYPE.title3 * settings.textScale;

  return (
    <View style={{ rowGap: SPACE.md }}>
      <Pressable onPress={flip} accessibilityRole="button" accessibilityLabel={back ? `${t(S.flashAnswer)}. ${card.en}` : `${t(S.flashQuestion)}. ${card.question}`} accessibilityHint={t(S.flashTurnA11y)}>
        <View style={{ minHeight: 280 }}>
          <Animated.View style={[styles.flash, glass(palette, true), { borderColor: `${color}55` }, front]}>
            <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color, fontSize: TYPE.caption, fontWeight: '700' }}>
              {t(S.flashQuestion)}
            </Text>
            {card.sanskrit ? (
              <Text maxFontSizeMultiplier={fontCap(settings.textScale)} style={{ color: palette.text, fontSize: size, lineHeight: size * 1.6, fontWeight: '600', textAlign: 'center' }}>
                {card.sanskrit}
              </Text>
            ) : null}
            {card.translit ? (
              <Text maxFontSizeMultiplier={fontCap(settings.textScale)} style={{ color: palette.muted, fontSize: TYPE.footnote * settings.textScale, fontStyle: 'italic', textAlign: 'center' }}>
                {card.translit}
              </Text>
            ) : null}
            <Text maxFontSizeMultiplier={fontCap(settings.textScale)} style={{ color: palette.text, fontSize: TYPE.body * settings.textScale, lineHeight: TYPE.body * settings.textScale * 1.45, textAlign: 'center' }}>
              {card.question}
            </Text>
            <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.caption }}>
              {t(S.flashTap)}
            </Text>
          </Animated.View>
          <Animated.View style={[styles.flash, styles.flashBack, glass(palette, true), { borderColor: `${color}88`, backgroundColor: `${color}${palette.dark ? '26' : '12'}` }, rear]}>
            <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color, fontSize: TYPE.caption, fontWeight: '700' }}>
              {t(S.flashAnswer)}
            </Text>
            {card.hi ? (
              <Text maxFontSizeMultiplier={fontCap(settings.textScale)} style={{ color: palette.text, fontSize: TYPE.callout * settings.textScale, lineHeight: TYPE.callout * settings.textScale * 1.7, textAlign: 'center' }}>
                {card.hi}
              </Text>
            ) : null}
            <Text maxFontSizeMultiplier={fontCap(settings.textScale)} style={{ color: palette.text, fontSize: TYPE.body * settings.textScale, lineHeight: TYPE.body * settings.textScale * 1.45, fontWeight: '600', textAlign: 'center' }}>
              {card.en}
            </Text>
            {card.note ? (
              <Text maxFontSizeMultiplier={fontCap(settings.textScale)} style={{ color: palette.muted, fontSize: TYPE.footnote * settings.textScale, lineHeight: TYPE.footnote * settings.textScale * 1.5, textAlign: 'center' }}>
                {card.note}
              </Text>
            ) : null}
          </Animated.View>
        </View>
      </Pressable>
      <Pager index={index} total={cards.length} onMove={move}>
        <Pressable onPress={shuffle} accessibilityRole="button" accessibilityLabel={t(S.shuffle)} hitSlop={8} style={styles.round}>
          <Ionicons name="shuffle" size={20} color={palette.accent} />
        </Pressable>
      </Pager>
    </View>
  );
}

/** Previous, "3 of 12", next. */
function Pager({ index, total, onMove, children }: { index: number; total: number; onMove: (delta: number) => void; children?: ReactNode }) {
  const { palette } = usePrefs();
  const { t } = useI18n();
  return (
    <View style={styles.pager}>
      <Pressable onPress={() => onMove(-1)} accessibilityRole="button" accessibilityLabel={t(S.prevCard)} style={[styles.round, { backgroundColor: quietFill(palette) }]}>
        <Ionicons name="chevron-back" size={20} color={palette.text} />
      </Pressable>
      <Text maxFontSizeMultiplier={UI_FONT_CAP} accessibilityLiveRegion="polite" style={{ flex: 1, textAlign: 'center', color: palette.muted, fontSize: TYPE.footnote, fontWeight: '600' }}>
        {t(S.cardOf(index + 1, total))}
      </Text>
      {children}
      <Pressable onPress={() => onMove(1)} accessibilityRole="button" accessibilityLabel={t(S.nextCard)} style={[styles.round, { backgroundColor: quietFill(palette) }]}>
        <Ionicons name="chevron-forward" size={20} color={palette.text} />
      </Pressable>
    </View>
  );
}

// ─── Slides ──────────────────────────────────────────────────────────────────

/** The course's slide deck as a horizontal pager, each slide a whole verse with its explanation. */
export function SlideDeck({ slides, hue, width }: { slides: Course['slides']; hue: keyof Hues; width: number }) {
  const { palette, settings } = usePrefs();
  const { t } = useI18n();
  const [index, setIndex] = useState(0);
  const color = huesFor(palette)[hue];
  const gap = SPACE.md;
  const size = TYPE.title3 * settings.textScale;
  return (
    <View style={{ rowGap: SPACE.md }}>
      <FlatList
        data={slides}
        horizontal
        keyExtractor={(s) => s.id}
        showsHorizontalScrollIndicator={false}
        snapToInterval={width + gap}
        decelerationRate="fast"
        disableIntervalMomentum
        ItemSeparatorComponent={() => <View style={{ width: gap }} />}
        onMomentumScrollEnd={(e) => {
          const i = Math.round(e.nativeEvent.contentOffset.x / (width + gap));
          if (i !== index) hapticSelect();
          setIndex(i);
        }}
        renderItem={({ item, index: i }) => (
          <View
            accessible
            accessibilityLabel={`${t(S.cardOf(i + 1, slides.length))}. ${item.en}`}
            style={[styles.slide, glass(palette, true), { width, borderColor: `${color}55` }]}>
            <View style={[styles.slideBar, { backgroundColor: color }]} />
            {item.sanskrit ? (
              <View accessibilityLanguage="sa">
                {item.sanskrit.split('\n').map((line, k) => (
                  <Text key={k} maxFontSizeMultiplier={fontCap(settings.textScale)} style={{ color: palette.text, fontSize: size, lineHeight: size * 1.6, fontWeight: '600' }}>
                    {line}
                  </Text>
                ))}
              </View>
            ) : null}
            {item.translit ? (
              <Text maxFontSizeMultiplier={fontCap(settings.textScale)} style={{ color: palette.muted, fontSize: TYPE.footnote * settings.textScale, fontStyle: 'italic' }}>
                {item.translit}
              </Text>
            ) : null}
            {item.hi ? <Para lang="hi">{item.hi}</Para> : null}
            <Para weight="600" lang="en">
              {item.en}
            </Para>
            {item.explanation ? (
              <Para muted size={TYPE.subhead} lang="en">
                {item.explanation}
              </Para>
            ) : null}
            {item.keywords.length ? (
              <Pills>
                {item.keywords.map((k) => (
                  <Pill key={k} text={k} hue={hue} />
                ))}
              </Pills>
            ) : null}
          </View>
        )}
      />
      <View style={styles.dots} importantForAccessibility="no-hide-descendants">
        {slides.map((s, i) => (
          <View key={s.id} style={[styles.pageDot, { backgroundColor: i === index ? color : quietFill(palette), width: i === index ? 18 : 6 }]} />
        ))}
      </View>
    </View>
  );
}

// ─── Mind map ────────────────────────────────────────────────────────────────

/** Every node id under (and including) a node. */
function allIds(node: MindNode): string[] {
  return [node.id, ...node.children.flatMap(allIds)];
}

/**
 * The course's mind map as a branching outline: the root, then each branch opening to its children, joined
 * by a line in the branch's hue so the shape of the idea stays visible on a narrow screen.
 */
export function MindMap({ root, hue }: { root: MindNode; hue: keyof Hues }) {
  const { t } = useI18n();
  const ids = useMemo(() => allIds(root), [root]);
  const [open, setOpen] = useState<Set<string>>(() => new Set([root.id]));
  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const all = open.size >= ids.length;
  return (
    <View style={{ rowGap: SPACE.sm }}>
      <View style={{ alignSelf: 'flex-end' }}>
        <Chip label={t(all ? S.mindCollapseAll : S.mindExpandAll)} onPress={() => setOpen(all ? new Set([root.id]) : new Set(ids))} />
      </View>
      <MindBranch node={root} depth={0} open={open} toggle={toggle} hue={hue} />
    </View>
  );
}

const BRANCH_HUES: (keyof Hues)[] = ['saffron', 'indigo', 'peacock', 'lotus', 'tulsi', 'gold', 'vermilion'];

function MindBranch({ node, depth, open, toggle, hue }: { node: MindNode; depth: number; open: Set<string>; toggle: (id: string) => void; hue: keyof Hues }) {
  const { palette } = usePrefs();
  const { t } = useI18n();
  const color = huesFor(palette)[hue];
  const isOpen = open.has(node.id);
  const has = node.children.length > 0;
  return (
    <View>
      <Pressable
        onPress={has ? () => toggle(node.id) : undefined}
        accessibilityRole={has ? 'button' : undefined}
        accessibilityState={has ? { expanded: isOpen } : undefined}
        accessibilityLabel={has ? t(S.mindExpandA11y(node.label, isOpen)) : `${node.label}. ${node.description}`}
        style={({ pressed }) => [
          styles.mindNode,
          depth === 0
            ? { backgroundColor: `${color}${palette.dark ? '33' : '1c'}`, borderColor: `${color}88` }
            : { backgroundColor: quietFill(palette), borderColor: `${color}44` },
          pressed && has && { opacity: 0.75 },
        ]}>
        <View style={{ flex: 1, rowGap: 2 }}>
          <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.text, fontSize: depth === 0 ? TYPE.title3 : TYPE.callout, fontWeight: depth === 0 ? '800' : '700' }}>
            {node.label}
          </Text>
          {node.sanskrit ? (
            <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color, fontSize: TYPE.footnote, fontWeight: '600' }}>
              {node.sanskrit}
            </Text>
          ) : null}
          {node.description ? (
            <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.footnote, lineHeight: TYPE.footnote * 1.45 }}>
              {node.description}
            </Text>
          ) : null}
        </View>
        {has ? <Ionicons name={isOpen ? 'remove-circle-outline' : 'add-circle-outline'} size={22} color={color} /> : null}
      </Pressable>
      {has && isOpen ? (
        <View style={[styles.mindChildren, { borderLeftColor: `${color}66` }]}>
          {node.children.map((child, i) => (
            <View key={child.id} style={styles.mindChild}>
              <View style={[styles.mindStub, { backgroundColor: `${color}66` }]} />
              <View style={{ flex: 1 }}>
                <MindBranch node={child} depth={depth + 1} open={open} toggle={toggle} hue={depth === 0 ? BRANCH_HUES[i % BRANCH_HUES.length] : hue} />
              </View>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

// ─── Timeline ────────────────────────────────────────────────────────────────

/** Events down a line, each with its date in the hue. */
export function TimelineList({ events, hue }: { events: { id: string; year: string; title: string; description: string; sanskrit?: string }[]; hue: keyof Hues }) {
  const { palette } = usePrefs();
  const color = huesFor(palette)[hue];
  return (
    <View>
      {events.map((e, i) => (
        <View key={e.id} style={styles.tlRow}>
          <View style={styles.tlRail}>
            <View style={[styles.tlDot, { backgroundColor: color, borderColor: palette.bg }]} />
            {i < events.length - 1 ? <View style={[styles.tlLine, { backgroundColor: `${color}55` }]} /> : null}
          </View>
          <View style={{ flex: 1, paddingBottom: SPACE.lg, rowGap: 2 }}>
            <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color, fontSize: TYPE.caption, fontWeight: '800', letterSpacing: 0.3 }}>
              {e.year}
            </Text>
            <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.body, fontWeight: '700' }}>
              {e.title}
            </Text>
            {e.sanskrit ? (
              <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.footnote }}>
                {e.sanskrit}
              </Text>
            ) : null}
            <Para muted size={TYPE.subhead}>
              {e.description}
            </Para>
          </View>
        </View>
      ))}
    </View>
  );
}

/** A whole verse from course data (plain strings), with a reader link when the reference is the Gita. */
export function PlainVerseBlock({ v, hue, children }: { v: { sanskrit: string; translit: string; en: string; ref: string }; hue?: keyof Hues; children?: ReactNode }) {
  const gita = /(?:Bhagavad\s*)?Gita\s+(\d+)\.(\d+)/i.exec(v.ref) ?? /^BG\s+(\d+)\.(\d+)/.exec(v.ref);
  return (
    <VerseBlock
      sanskrit={v.sanskrit}
      translit={v.translit}
      translation={v.en}
      reference={v.ref}
      hue={hue}
      target={gita ? { id: 'bhagavadgita', chapter: Number(gita[1]), verse: Number(gita[2]) } : null}>
      {children}
    </VerseBlock>
  );
}

/** A card that opens another screen: an emoji or icon tile, title, a line, and a chevron. */
export function DoorCard({
  title,
  detail,
  icon,
  emoji,
  hue,
  onPress,
  children,
  strong,
}: {
  title: string;
  detail?: string;
  icon?: IconName;
  emoji?: string;
  hue: keyof Hues;
  onPress: () => void;
  children?: ReactNode;
  strong?: boolean;
}) {
  const { palette } = usePrefs();
  const color = huesFor(palette)[hue];
  return (
    <PressableScale onPress={onPress} accessibilityRole="button" accessibilityLabel={detail ? `${title}. ${detail}` : title}>
      <Card strong={strong} style={{ rowGap: SPACE.md, borderColor: `${color}44` }}>
        <View style={styles.doorRow}>
          <View style={[styles.doorTile, { backgroundColor: `${color}${palette.dark ? '33' : '1c'}`, borderColor: `${color}55` }]}>
            {emoji ? (
              <Text allowFontScaling={false} style={{ fontSize: 24 }}>
                {emoji}
              </Text>
            ) : (
              <Ionicons name={icon ?? 'book-outline'} size={22} color={color} />
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.title3, fontWeight: '700' }}>
              {title}
            </Text>
            {detail ? (
              <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.footnote, marginTop: 2 }}>
                {detail}
              </Text>
            ) : null}
          </View>
          <Ionicons name="chevron-forward" size={18} color={palette.muted} />
        </View>
        {children}
      </Card>
    </PressableScale>
  );
}

/** The width of a full-bleed card inside the screen's side padding. */
export function useCardWidth() {
  const { width } = useWindowDimensions();
  return width - SPACE.lg * 2;
}

const styles = StyleSheet.create({
  primary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: SPACE.sm,
    minHeight: TOUCH + 4,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACE.xl,
  },
  link: { flexDirection: 'row', alignItems: 'center', columnGap: 6, minHeight: TOUCH, alignSelf: 'flex-start' },
  tickHit: { width: TOUCH, height: TOUCH, alignItems: 'center', justifyContent: 'center' },
  tick: { width: 30, height: 30, borderRadius: 15, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  pill: { borderWidth: 1, borderRadius: RADIUS.pill, paddingHorizontal: 10, paddingVertical: 4 },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  bullet: { flexDirection: 'row', alignItems: 'flex-start', columnGap: SPACE.sm },
  dot: { width: 6, height: 6, borderRadius: 3, marginTop: 10 },
  flash: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: RADIUS.panel,
    borderWidth: 1,
    padding: SPACE.xl,
    alignItems: 'center',
    justifyContent: 'center',
    rowGap: SPACE.md,
    backfaceVisibility: 'hidden',
  },
  flashBack: {},
  pager: { flexDirection: 'row', alignItems: 'center', columnGap: SPACE.sm },
  round: { width: TOUCH, height: TOUCH, borderRadius: TOUCH / 2, alignItems: 'center', justifyContent: 'center' },
  slide: { borderRadius: RADIUS.panel, borderWidth: 1, padding: SPACE.xl, rowGap: SPACE.md, minHeight: 320, overflow: 'hidden' },
  slideBar: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4 },
  dots: { flexDirection: 'row', justifyContent: 'center', columnGap: 6, flexWrap: 'wrap', rowGap: 6 },
  pageDot: { height: 6, borderRadius: 3 },
  mindNode: { flexDirection: 'row', alignItems: 'center', columnGap: SPACE.sm, borderWidth: 1, borderRadius: RADIUS.control, padding: SPACE.md, minHeight: TOUCH },
  mindChildren: { marginLeft: SPACE.lg, borderLeftWidth: 2, paddingTop: SPACE.sm, rowGap: SPACE.sm },
  mindChild: { flexDirection: 'row', alignItems: 'flex-start' },
  mindStub: { width: SPACE.md, height: 2, marginTop: 24 },
  tlRow: { flexDirection: 'row', columnGap: SPACE.md },
  tlRail: { width: 16, alignItems: 'center' },
  tlDot: { width: 14, height: 14, borderRadius: 7, borderWidth: 3, marginTop: 2 },
  tlLine: { width: 2, flex: 1, marginTop: 2 },
  doorRow: { flexDirection: 'row', alignItems: 'center', columnGap: SPACE.md },
  doorTile: { width: 48, height: 48, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
});
