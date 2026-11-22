/**
 * Building blocks of the Panchang guides, the month calendar and the ritual pages: a hue pill, a grid of
 * labelled facts, bullet and numbered lists that follow the reader's text size, and the website's
 * questions and answers as tap-to-open rows.
 */
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, type Href } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { glass, GroupCard, GroupRow } from '@/components/ui';
import { S, useI18n, type Msg } from '@/i18n';
import { useMotion } from '@/motion/use-motion';
import { usePrefs } from '@/state/app-state';
import { fontCap, huesFor, quietFill, RADIUS, SPACE, TITLE_FONT_CAP, TYPE, UI_FONT_CAP, type Hues } from '@/theme/themes';

/** A small capsule in a hue: a tithi's class, a yoga's nature, "Today". */
export function HuePill({ label, hue, solid }: { label: string; hue: keyof Hues; solid?: boolean }) {
  const { palette } = usePrefs();
  const color = huesFor(palette)[hue];
  return (
    <View style={[styles.pill, { backgroundColor: solid ? color : `${color}1f`, borderColor: `${color}55` }]}>
      <Text maxFontSizeMultiplier={UI_FONT_CAP} numberOfLines={1} style={{ color: solid ? palette.bg : color, fontSize: 11, fontWeight: '700' }}>
        {label}
      </Text>
    </View>
  );
}

/** Labelled facts two to a row, each label in its own small type over the value (the website's attribute cards). */
export function FactGrid({ facts, hue = 'saffron' }: { facts: { label: Msg; value: string }[]; hue?: keyof Hues }) {
  const { palette, settings } = usePrefs();
  const { t } = useI18n();
  const color = huesFor(palette)[hue];
  const cap = fontCap(settings.textScale);
  return (
    <View style={styles.facts}>
      {facts
        .filter((f) => f.value)
        .map((f) => (
          <View key={f.label.en} accessible accessibilityLabel={`${t(f.label)}: ${f.value}`} style={[styles.fact, glass(palette)]}>
            <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color, fontSize: TYPE.caption, fontWeight: '700' }}>
              {t(f.label)}
            </Text>
            <Text
              maxFontSizeMultiplier={cap}
              style={{ color: palette.text, fontSize: TYPE.subhead * settings.textScale, lineHeight: TYPE.subhead * settings.textScale * 1.45, fontWeight: '600' }}>
              {f.value}
            </Text>
          </View>
        ))}
    </View>
  );
}

/** A bulleted list; an item with `href` is a link to the app's own page. */
export function Bullets({ items, numbered }: { items: { text: string; href?: Href }[]; numbered?: boolean }) {
  const { palette, settings } = usePrefs();
  const scale = settings.textScale;
  const body = { color: palette.textSecondary, fontSize: TYPE.callout * scale, lineHeight: TYPE.callout * scale * 1.55 };
  return (
    <View style={{ rowGap: SPACE.sm }}>
      {items.map((item, i) => {
        const mark = numbered ? (
          <View style={[styles.num, { backgroundColor: quietFill(palette) }]}>
            <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.accent, fontSize: TYPE.caption, fontWeight: '800' }}>
              {i + 1}
            </Text>
          </View>
        ) : (
          <Text style={[body, { color: palette.accent }]}>•</Text>
        );
        if (item.href) {
          const href = item.href;
          return (
            <Pressable
              key={i}
              accessibilityRole="link"
              onPress={() => router.push(href)}
              style={({ pressed }) => [styles.bullet, { minHeight: 40 }, pressed && { opacity: 0.6 }]}>
              {mark}
              <Text maxFontSizeMultiplier={fontCap(scale)} style={[body, { flex: 1, color: palette.accent, fontWeight: '600' }]}>
                {item.text}
              </Text>
              <Ionicons name="chevron-forward" size={16} color={palette.accent} style={{ marginTop: 3 }} />
            </Pressable>
          );
        }
        return (
          <View key={i} style={styles.bullet}>
            {mark}
            <Text maxFontSizeMultiplier={fontCap(scale)} style={[body, { flex: 1 }]}>
              {item.text}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

/** A quiet panel with a gilt label over a quoted line (the website's "Spiritual focus" box). */
export function FocusNote({ label, children, hue = 'gold' }: { label: string; children: ReactNode; hue?: keyof Hues }) {
  const { palette, settings } = usePrefs();
  const color = huesFor(palette)[hue];
  const scale = settings.textScale;
  return (
    <View style={[styles.focus, { backgroundColor: `${color}14`, borderLeftColor: color }]}>
      <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color, fontSize: TYPE.caption, fontWeight: '700' }}>
        ✦ {label}
      </Text>
      <Text
        maxFontSizeMultiplier={fontCap(scale)}
        style={{ color: palette.text, fontSize: TYPE.callout * scale, lineHeight: TYPE.callout * scale * 1.55, fontStyle: 'italic', marginTop: 4 }}>
        {children}
      </Text>
    </View>
  );
}

/** The website's questions and answers: each a row that opens to its answer. */
export function FaqList({ items }: { items: { q: string; a: string; extra?: string }[] }) {
  return (
    <GroupCard>
      {items.map((f, i) => (
        <FaqRow key={i} first={i === 0} item={f} />
      ))}
    </GroupCard>
  );
}

function FaqRow({ item, first }: { item: { q: string; a: string; extra?: string }; first: boolean }) {
  const { palette, settings } = usePrefs();
  const { t } = useI18n();
  const { animate } = useMotion();
  const [open, setOpen] = useState(false);
  const scale = settings.textScale;
  const cap = fontCap(scale);
  return (
    <GroupRow
      standalone={first}
      inset={SPACE.lg}
      onPress={() => setOpen((o) => !o)}
      accessibilityLabel={`${item.q}. ${open ? t(S.hideMeaning) : t(S.showMeaning)}`}
      style={{ alignItems: 'flex-start', paddingVertical: SPACE.md }}>
      <View style={{ flex: 1, rowGap: SPACE.sm }}>
        <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.callout, fontWeight: '700', lineHeight: TYPE.callout * 1.45 }}>
          {item.q}
        </Text>
        {open ? (
          <Animated.View entering={animate ? FadeIn.duration(220) : undefined} style={{ rowGap: SPACE.sm }}>
            <Text maxFontSizeMultiplier={cap} style={{ color: palette.textSecondary, fontSize: TYPE.subhead * scale, lineHeight: TYPE.subhead * scale * 1.6 }}>
              {item.a}
            </Text>
            {item.extra ? (
              <Text maxFontSizeMultiplier={cap} style={{ color: palette.muted, fontSize: TYPE.footnote * scale, lineHeight: TYPE.footnote * scale * 1.6, fontStyle: 'italic' }}>
                {item.extra}
              </Text>
            ) : null}
          </Animated.View>
        ) : null}
      </View>
      <Ionicons name={open ? 'remove' : 'add'} size={20} color={palette.accent} style={{ marginTop: 2 }} />
    </GroupRow>
  );
}

const styles = StyleSheet.create({
  pill: { alignSelf: 'flex-start', paddingHorizontal: SPACE.sm, paddingVertical: 2, borderRadius: RADIUS.pill, borderWidth: StyleSheet.hairlineWidth },
  facts: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACE.sm },
  fact: { flexGrow: 1, flexBasis: '45%', borderRadius: RADIUS.control, padding: SPACE.md, rowGap: 2 },
  bullet: { flexDirection: 'row', columnGap: SPACE.sm, alignItems: 'flex-start' },
  num: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  focus: { borderRadius: RADIUS.control, padding: SPACE.md, borderLeftWidth: 3 },
});
