/**
 * Building blocks of the knowledge pages and Wisdom for life, after the website's knowledge pages
 * (app/concepts, app/characters, app/wisdom-for-life): a glass section card with a hue-tinted heading,
 * reading text that follows the reader's text size, full verse blocks and linked name chips.
 */
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { Card } from '@/components/ui';
import { getEntry } from '@/content/catalog';
import { useDownloads } from '@/content/downloads';
import { findByName, type KnowledgeKind, type KVerse } from '@/content/knowledge';
import { S, useI18n, type Msg } from '@/i18n';
import { sanskritLines } from '@/lib/verse-format';
import { usePrefs } from '@/state/app-state';
import { fontCap, huesFor, quietFill, RADIUS, SPACE, TOUCH, TYPE, UI_FONT_CAP, type Hues } from '@/theme/themes';

/** A section of a knowledge page: a glass card with a heading in the page's hue. */
export function KSection({
  title,
  hue = 'saffron',
  children,
  style,
}: {
  title: string;
  hue?: keyof Hues;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const { palette } = usePrefs();
  const color = huesFor(palette)[hue];
  return (
    <Card style={[{ rowGap: SPACE.md }, style]}>
      <View style={styles.sectionHead} accessibilityRole="header">
        <View style={[styles.bar, { backgroundColor: color }]} />
        <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ flexShrink: 1, color: palette.text, fontSize: TYPE.title3, fontWeight: '700' }}>
          {title}
        </Text>
      </View>
      {children}
    </Card>
  );
}

/** Reading text: follows the reader's text size, with a generous line height for Devanagari. */
export function Para({
  children,
  muted,
  size = TYPE.callout,
  weight,
  italic,
  lang,
}: {
  children: ReactNode;
  muted?: boolean;
  size?: number;
  weight?: '400' | '600' | '700';
  italic?: boolean;
  /** Script of this text: Devanagari gets a taller line. */
  lang?: 'en' | 'hi' | 'sa';
}) {
  const { palette, settings } = usePrefs();
  const px = size * settings.textScale;
  return (
    <Text
      maxFontSizeMultiplier={fontCap(settings.textScale)}
      style={{
        color: muted ? palette.muted : palette.text,
        fontSize: px,
        lineHeight: px * (lang === 'en' ? 1.5 : 1.7),
        fontWeight: weight,
        fontStyle: italic ? 'italic' : 'normal',
      }}>
      {children}
    </Text>
  );
}

/** A small label over a block of text ("Insight", "Today", "Debated"). */
export function Label({ children, hue }: { children: ReactNode; hue?: keyof Hues }) {
  const { palette } = usePrefs();
  return (
    <Text
      maxFontSizeMultiplier={UI_FONT_CAP}
      style={{ color: hue ? huesFor(palette)[hue] : palette.muted, fontSize: TYPE.caption, fontWeight: '700', letterSpacing: 0.4 }}>
      {children}
    </Text>
  );
}

/**
 * A note that this content exists in one language only, shown only when that is not the reader's interface
 * language (the website writes the dictionary, characters and places in English, concept summaries in Hindi).
 */
export function LangNote({ content }: { content: 'en' | 'hi' }) {
  const { t, lang } = useI18n();
  const { palette } = usePrefs();
  if (content === lang) return null;
  return (
    <View style={[styles.note, { backgroundColor: quietFill(palette) }]}>
      <Ionicons name="language-outline" size={16} color={palette.muted} />
      <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ flex: 1, color: palette.muted, fontSize: TYPE.footnote }}>
        {t(content === 'en' ? S.kEnglishOnly : S.kHindiOnly)}
      </Text>
    </View>
  );
}

/** "Bhagavad Gita 2.47" or "Gita 2.47" -> where it is in the library. Other references stay plain text. */
export function libraryTarget(v: Pick<KVerse, 'scriptureId' | 'chapter' | 'verse'> & { ref: string }) {
  if (v.scriptureId && v.chapter != null) return { id: v.scriptureId, chapter: v.chapter, verse: v.verse };
  const gita = /(?:Bhagavad\s*)?Gita\s+(\d+)\.(\d+)/i.exec(v.ref);
  if (gita) return { id: 'bhagavadgita', chapter: Number(gita[1]), verse: Number(gita[2]) };
  return null;
}

/** Opens a verse in the reader when its book is on the phone (bundled or downloaded); otherwise null. */
export function useOpenVerse() {
  const { installed } = useDownloads();
  return (target: { id: string; chapter: number; verse?: number | string } | null) => {
    if (!target) return null;
    const entry = getEntry(target.id);
    if (!entry || !(entry.bundled || installed[entry.id])) return null;
    if (!entry.chapters.some((c) => c.number === target.chapter)) return null;
    return () =>
      router.push({
        pathname: '/scripture/[id]/[chapter]',
        params: {
          id: target.id,
          chapter: String(target.chapter),
          ...(target.verse != null ? { verse: String(target.verse) } : null),
        },
      });
  };
}

/**
 * A verse, always whole: every line of the Sanskrit, then the transliteration and the translation, and a
 * link into the reader when the book is on the phone. Never cut a shloka to fit.
 */
export function VerseBlock({
  sanskrit,
  translit,
  translation,
  reference,
  target,
  hue = 'saffron',
  children,
}: {
  sanskrit: string;
  translit?: string;
  translation?: string;
  reference: string;
  target?: { id: string; chapter: number; verse?: number | string } | null;
  hue?: keyof Hues;
  children?: ReactNode;
}) {
  const { palette, settings } = usePrefs();
  const { t } = useI18n();
  const open = useOpenVerse()(target ?? null);
  const color = huesFor(palette)[hue];
  const size = TYPE.body * settings.textScale;
  return (
    <View style={[styles.verse, { borderLeftColor: color, backgroundColor: quietFill(palette) }]}>
      <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color, fontSize: TYPE.footnote, fontWeight: '700' }}>
        {reference}
      </Text>
      <View accessible accessibilityLanguage="sa">
        {sanskritLines(sanskrit).map((line, i) => (
          <Text
            key={i}
            maxFontSizeMultiplier={fontCap(settings.textScale)}
            style={{ color: palette.text, fontSize: size, lineHeight: size * 1.7, fontWeight: '500' }}>
            {line}
          </Text>
        ))}
      </View>
      {translit ? (
        <Text maxFontSizeMultiplier={fontCap(settings.textScale)} style={{ color: palette.muted, fontSize: TYPE.footnote * settings.textScale, fontStyle: 'italic', lineHeight: TYPE.footnote * settings.textScale * 1.55 }}>
          {translit}
        </Text>
      ) : null}
      {translation ? <Para>{translation}</Para> : null}
      {children}
      {open ? (
        <Pressable
          onPress={open}
          accessibilityRole="link"
          accessibilityLabel={t(S.kReadVerseA11y(reference))}
          style={({ pressed }) => [styles.readLink, { opacity: pressed ? 0.6 : 1 }]}>
          <Ionicons name="book-outline" size={16} color={palette.accent} />
          <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.accent, fontSize: TYPE.subhead, fontWeight: '600' }}>
            {t(S.kReadVerse)}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

/** A KVerse from the bundled data, in the reader's language where the data has both. */
export function KVerseBlock({ v, hue }: { v: KVerse; hue?: keyof Hues }) {
  const { lang } = useI18n();
  const ref = typeof v.ref === 'string' ? v.ref : v.ref[lang] || v.ref.en;
  const translation = (lang === 'hi' && v.hi) || v.en || v.hi;
  return (
    <VerseBlock
      sanskrit={v.sanskrit}
      translit={v.translit}
      translation={translation}
      reference={ref}
      hue={hue}
      target={libraryTarget({ ...v, ref: typeof v.ref === 'string' ? v.ref : v.ref.en })}
    />
  );
}

/** A row of names; a name that has its own page (a character, place, concept or term) becomes a link. */
export function NameChips({ names, prefer }: { names: string[]; prefer?: KnowledgeKind }) {
  const { palette } = usePrefs();
  const { t } = useI18n();
  return (
    <View style={styles.chips}>
      {names.map((name) => {
        const page = findByName(name, prefer);
        const body = (
          <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: page ? palette.accent : palette.text, fontSize: TYPE.footnote, fontWeight: '600' }}>
            {name}
          </Text>
        );
        if (!page) {
          return (
            <View key={name} style={[styles.chip, { backgroundColor: quietFill(palette) }]}>
              {body}
            </View>
          );
        }
        return (
          <Pressable
            key={name}
            accessibilityRole="link"
            accessibilityLabel={t(S.kOpenEntryA11y(name))}
            onPress={() => openEntry(page.kind, page.id)}
            hitSlop={6}
            style={({ pressed }) => [
              styles.chip,
              { backgroundColor: palette.dark ? 'rgba(255,159,10,0.14)' : 'rgba(194,65,12,0.08)', opacity: pressed ? 0.7 : 1 },
            ]}>
            {body}
            <Ionicons name="chevron-forward" size={12} color={palette.accent} />
          </Pressable>
        );
      })}
    </View>
  );
}

export function openEntry(kind: KnowledgeKind, id: string) {
  router.push({ pathname: '/knowledge/[kind]/[id]', params: { kind, id } });
}

/** The tinted square at the head of an entry: its emoji (characters, places) or its Devanagari initial. */
export function EntryTile({ hue, icon, letter, size = 44 }: { hue: keyof Hues; icon?: string; letter?: string; size?: number }) {
  const { palette } = usePrefs();
  const color = huesFor(palette)[hue];
  return (
    <View
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.3),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: palette.dark ? `${color}33` : `${color}1f`,
        borderWidth: 1,
        borderColor: `${color}55`,
      }}>
      <Text allowFontScaling={false} style={{ fontSize: Math.round(size * (icon ? 0.5 : 0.42)), color, fontWeight: '700' }}>
        {icon || letter}
      </Text>
    </View>
  );
}

/** A pair of a label and its text, stacked, used for the reflections and the place identifications. */
export function LabeledText({ label, text, hue, lang }: { label: string; text: string; hue?: keyof Hues; lang?: 'en' | 'hi' }) {
  if (!text) return null;
  return (
    <View style={{ rowGap: 2 }}>
      <Label hue={hue}>{label}</Label>
      <Para lang={lang}>{text}</Para>
    </View>
  );
}

/** Picks the reader's language from a pair, falling back to whichever side has text. */
export function pick(m: Msg, lang: 'en' | 'hi'): string {
  return m[lang] || m.en || m.hi;
}

const styles = StyleSheet.create({
  sectionHead: { flexDirection: 'row', alignItems: 'center', columnGap: SPACE.sm },
  bar: { width: 4, height: 20, borderRadius: 2 },
  note: { flexDirection: 'row', alignItems: 'center', columnGap: SPACE.sm, borderRadius: RADIUS.control, padding: SPACE.md },
  verse: { borderLeftWidth: 3, borderRadius: RADIUS.control, padding: SPACE.md, rowGap: SPACE.sm },
  readLink: { flexDirection: 'row', alignItems: 'center', columnGap: 6, minHeight: TOUCH, alignSelf: 'flex-start' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACE.sm },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 4,
    minHeight: 36,
    paddingHorizontal: SPACE.md,
    borderRadius: RADIUS.pill,
  },
});
