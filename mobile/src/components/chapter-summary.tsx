import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { glass } from '@/components/ui';
import type { ChapterSummary, KeyVerse, SummaryCollection } from '@/content/study';
import { S, type Lang } from '@/i18n';
import { useAppState } from '@/state/app-state';
import { fontCap, huesFor, quietFill, RADIUS, SPACE, TITLE_FONT_CAP, TOUCH, TYPE } from '@/theme/themes';

/**
 * The summary text in one language, with a pill that switches to the other. It opens in the interface
 * language; the website shows both, but on a phone one at a time keeps the chapter's verses close.
 */
export function SummaryBody({ summary, collapsible = false }: { summary: ChapterSummary; collapsible?: boolean }) {
  const { palette, settings, lang } = useAppState();
  // Follows the interface language until the reader flips it (settings load after the first render).
  const [flipped, setFlipped] = useState(false);
  const shown: Lang = flipped ? (lang === 'hi' ? 'en' : 'hi') : lang;
  const [open, setOpen] = useState(!collapsible);
  const text = shown === 'hi' ? summary.hi : summary.en || summary.hi;
  const size = TYPE.callout * settings.textScale;
  const t = (m: { en: string; hi: string }) => m[lang];
  return (
    <View style={{ rowGap: SPACE.sm }}>
      <Text
       
        maxFontSizeMultiplier={fontCap(settings.textScale)}
        numberOfLines={open ? undefined : 4}
        style={{ color: palette.text, fontSize: shown === 'hi' ? size + 1 : size, lineHeight: size * (shown === 'hi' ? 1.75 : 1.55) }}>
        {text}
      </Text>
      <View style={styles.bodyActions}>
        {collapsible ? (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ expanded: open }}
            onPress={() => setOpen((o) => !o)}
            hitSlop={8}
            style={({ pressed }) => [styles.textBtn, pressed && { opacity: 0.6 }]}>
            <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.accent, fontSize: TYPE.footnote, fontWeight: '700' }}>
              {t(open ? S.summaryLess : S.summaryMore)}
            </Text>
            <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={14} color={palette.accent} />
          </Pressable>
        ) : (
          <View />
        )}
        {summary.en ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => setFlipped((f) => !f)}
            style={({ pressed }) => [styles.langPill, { backgroundColor: quietFill(palette) }, pressed && { opacity: 0.7 }]}>
            <Ionicons name="language-outline" size={14} color={palette.muted} />
            <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.textSecondary, fontSize: TYPE.caption + 1, fontWeight: '600' }}>
              {S.summaryReadOther[shown]}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

/** The chapter's key verses as tappable rows: the verse number in a gold disc, then what happens there. */
export function KeyVerseList({ verses, sutras, onPick }: { verses: KeyVerse[]; sutras: boolean; onPick: (verse: number) => void }) {
  const { palette, lang } = useAppState();
  const hues = huesFor(palette);
  if (verses.length === 0) return null;
  return (
    <View style={{ rowGap: 2 }}>
      <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.caption, fontWeight: '700', letterSpacing: lang === 'hi' ? 0 : 0.5, marginBottom: SPACE.xs }}>
        {lang === 'hi' ? S.summaryKeyVerses(sutras).hi : S.summaryKeyVerses(sutras).en.toUpperCase()}
      </Text>
      {verses.map((k) => (
        <Pressable
          key={k.verse}
          accessibilityRole="link"
          accessibilityLabel={S.keyVerseA11y(k.verse, k.note)[lang]}
          onPress={() => onPick(k.verse)}
          style={({ pressed }) => [styles.keyRow, pressed && { backgroundColor: quietFill(palette) }]}>
          <View style={[styles.keyNum, { borderColor: hues.gold }]}>
            <Text allowFontScaling={false} style={{ color: hues.gold, fontSize: TYPE.footnote, fontWeight: '700' }}>
              {k.verse}
            </Text>
          </View>
          <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ flex: 1, color: palette.textSecondary, fontSize: TYPE.subhead, lineHeight: TYPE.subhead * 1.4 }}>
            {k.note}
          </Text>
          <Ionicons name="arrow-forward" size={16} color={palette.muted} />
        </Pressable>
      ))}
    </View>
  );
}

/** The editorial note under every summary, as on the website. */
export function EditorialNote({ reviewed }: { reviewed: boolean }) {
  const { palette, lang } = useAppState();
  return (
    <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.caption, lineHeight: TYPE.caption * 1.45 }}>
      {(reviewed ? S.summaryReviewed : S.summaryDraft)[lang]}
    </Text>
  );
}

/**
 * The "अध्याय सार" card at the top of a chapter, after the website's ChapterSummaryBox: the summary
 * (folded to four lines), the key verses, which scroll the reader to that verse, and a link to the
 * summaries of every chapter.
 */
export function ChapterSummaryCard({
  scriptureId,
  collection,
  summary,
  onJumpToVerse,
}: {
  scriptureId: string;
  collection: SummaryCollection;
  summary: ChapterSummary;
  onJumpToVerse: (verse: number) => void;
}) {
  const { palette, lang } = useAppState();
  return (
    <View style={[styles.card, glass(palette, true)]}>
      <View style={styles.head}>
        <View style={[styles.icon, { backgroundColor: quietFill(palette) }]}>
          <Ionicons name="book-outline" size={16} color={palette.accent} />
        </View>
        <Text accessibilityRole="header" maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ flex: 1, color: palette.text, fontSize: TYPE.subhead, fontWeight: '700' }}>
          {S.summaryHeading(collection.unit)[lang]}
        </Text>
      </View>
      <SummaryBody summary={summary} collapsible />
      <KeyVerseList verses={summary.keyVerses} sutras={collection.sutras} onPick={onJumpToVerse} />
      <View style={[styles.foot, { borderTopColor: palette.border }]}>
        <EditorialNote reviewed={summary.reviewed} />
        <Pressable
          accessibilityRole="link"
          onPress={() => router.push({ pathname: '/summary/[id]', params: { id: scriptureId, chapter: String(summary.chapter) } })}
          style={({ pressed }) => [styles.allLink, glass(palette), pressed && { opacity: 0.75 }]}>
          <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.accent, fontSize: TYPE.footnote, fontWeight: '700' }}>
            {collection.heading[lang]}
          </Text>
          <Ionicons name="arrow-forward" size={14} color={palette.accent} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: RADIUS.card, padding: SPACE.lg, rowGap: SPACE.md, alignSelf: 'stretch', marginTop: SPACE.md },
  head: { flexDirection: 'row', alignItems: 'center', columnGap: SPACE.sm },
  icon: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  bodyActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: SPACE.sm },
  textBtn: { flexDirection: 'row', alignItems: 'center', columnGap: 4, minHeight: 32 },
  langPill: { flexDirection: 'row', alignItems: 'center', columnGap: 6, minHeight: 32, paddingHorizontal: SPACE.md, borderRadius: RADIUS.pill },
  keyRow: { flexDirection: 'row', alignItems: 'center', columnGap: SPACE.md, minHeight: TOUCH, paddingVertical: 6, paddingHorizontal: SPACE.xs, borderRadius: RADIUS.tile },
  keyNum: { minWidth: 32, height: 32, borderRadius: 16, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  foot: { borderTopWidth: StyleSheet.hairlineWidth, paddingTop: SPACE.md, rowGap: SPACE.md },
  allLink: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', columnGap: 6, minHeight: 36, paddingHorizontal: SPACE.md, borderRadius: RADIUS.pill },
});
