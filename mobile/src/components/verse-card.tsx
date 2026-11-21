import Ionicons from '@expo/vector-icons/Ionicons';
import { memo, useState } from 'react';
import { Pressable, Share, StyleSheet, Text, View } from 'react-native';

import type { Verse } from '@/content/types';
import {
  cleanVerseField,
  formatVerseRef,
  meaningState,
  MEANING_COPY,
  sanskritLines,
  toDevanagari,
  verseMarkNumber,
} from '@/lib/verse-format';
import type { Settings } from '@/lib/backup';
import { SPACE, TYPE, type Palette } from '@/theme/themes';
import { Card, glass } from './ui';

interface Props {
  scriptureId: string;
  scriptureTitle: string;
  chapter: number;
  verse: Verse;
  palette: Palette;
  settings: Settings;
  bookmarked: boolean;
  /** Called with the verse number; keep it stable (useCallback) so memo skips unchanged cards. */
  onToggleBookmark: (verse: string) => void;
}

function Label({ en, hi, palette, extra }: { en: string; hi: string; palette: Palette; extra?: string }) {
  return (
    <View style={styles.labelRow}>
      <Text style={[styles.label, { color: palette.accent }]}>{en}</Text>
      <Text style={[styles.label, { color: palette.muted }]}>{hi}</Text>
      {extra ? <Text style={[styles.badge, { color: palette.muted, borderColor: palette.border }]}>{extra}</Text> : null}
    </View>
  );
}

function VerseCardImpl({ scriptureId, scriptureTitle, chapter, verse, palette, settings, bookmarked, onToggleBookmark }: Props) {
  // A tap on Notes overrides the "Open notes by default" setting until that setting changes again.
  const [override, setOverride] = useState<{ when: boolean; open: boolean } | null>(null);
  const notesOpen = override && override.when === settings.showNotes ? override.open : settings.showNotes;
  const setNotesOpen = (f: (open: boolean) => boolean) => setOverride({ when: settings.showNotes, open: f(notesOpen) });
  const scale = settings.textScale;
  const ref = formatVerseRef(scriptureId, chapter, verse.number);
  const lines = sanskritLines(verse.sanskrit);
  const state = meaningState(verse);
  const hindi = cleanVerseField(verse.hindi);
  const english = cleanVerseField(verse.translation);
  const translit = cleanVerseField(verse.transliteration);
  const notes = [
    { en: 'Word meaning', hi: 'शब्दार्थ', text: cleanVerseField(verse.wordMeaning) },
    { en: 'Commentary', hi: 'व्याख्या', text: cleanVerseField(verse.commentary) },
    { en: 'Explanation', hi: 'विवेचन', text: cleanVerseField(verse.explanation) },
  ].filter((n) => n.text);

  const share = () => {
    // The whole verse goes out: every line of the Sanskrit, never a cut-down excerpt.
    const message = [
      `${scriptureTitle} ${ref}`,
      lines.join('\n'),
      hindi,
      english,
      `https://dharmagranth.dev/scripture/${scriptureId}/chapter/${chapter}/`,
    ]
      .filter(Boolean)
      .join('\n\n');
    Share.share({ message }).catch(() => {});
  };

  return (
    <Card style={styles.card} strong>
      <View style={styles.header}>
        <View
          style={[
            styles.refPill,
            {
              backgroundColor: palette.dark ? 'rgba(229,193,88,0.14)' : 'rgba(198,146,52,0.12)',
              borderColor: palette.dark ? 'rgba(229,193,88,0.3)' : 'rgba(198,146,52,0.3)',
            },
          ]}>
          <Text style={[styles.ref, { color: palette.gold }]} accessibilityLabel={`Verse ${ref}`}>
            {ref}
          </Text>
        </View>
        <View style={styles.actions}>
          <Pressable
            onPress={share}
            hitSlop={6}
            style={[styles.iconBtn, glass(palette)]}
            accessibilityRole="button"
            accessibilityLabel={`Share verse ${ref}`}>
            <Ionicons name="share-outline" size={18} color={palette.muted} />
          </Pressable>
          <Pressable
            onPress={() => onToggleBookmark(String(verse.number))}
            hitSlop={6}
            style={[styles.iconBtn, glass(palette)]}
            accessibilityRole="button"
            accessibilityState={{ selected: bookmarked }}
            accessibilityLabel={bookmarked ? `Remove bookmark ${ref}` : `Bookmark verse ${ref}`}>
            <Ionicons name={bookmarked ? 'bookmark' : 'bookmark-outline'} size={18} color={bookmarked ? palette.accent : palette.muted} />
          </Pressable>
        </View>
      </View>

      {lines.length > 0 ? (
        <View
          style={[
            styles.sanskrit,
            { backgroundColor: palette.dark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.45)', borderColor: palette.rim },
          ]}>
          {lines.map((line, i) => (
            <Text
              key={i}
              selectable
              style={{ color: palette.text, fontSize: TYPE.title3 * scale, lineHeight: TYPE.title3 * scale * 1.6, textAlign: 'center' }}>
              {line}
              {i === lines.length - 1 ? `\u00a0॥\u00a0${toDevanagari(verseMarkNumber(verse.number))}\u00a0॥` : ''}
            </Text>
          ))}
        </View>
      ) : null}

      {settings.showTransliteration && translit ? (
        <Text
          selectable
          style={{
            color: palette.textSecondary,
            fontSize: TYPE.subhead * scale,
            lineHeight: TYPE.subhead * scale * 1.5,
            fontStyle: 'italic',
            textAlign: 'center',
            marginTop: SPACE.sm,
          }}>
          {translit}
        </Text>
      ) : null}

      {settings.showHindi ? (
        <View style={styles.block}>
          <Label
            en="Hindi"
            hi={verse.hindiRange ? MEANING_COPY.hiRange(verse.hindiRange) : 'हिन्दी अर्थ'}
            palette={palette}
            extra={verse.hindiSource === 'ai' ? MEANING_COPY.aiLabelHi : undefined}
          />
          <Text
            selectable
            style={[
              styles.body,
              {
                color: state.hi === 'text' ? palette.text : palette.muted,
                fontSize: TYPE.body * scale,
                lineHeight: TYPE.body * scale * 1.55,
              },
            ]}>
            {state.hi === 'text'
              ? hindi
              : state.hi === 'review'
                ? MEANING_COPY.hiReview
                : state.hi === 'with'
                  ? MEANING_COPY.hiWith(verse.hindiSeeVerse!)
                  : MEANING_COPY.hiPending}
          </Text>
        </View>
      ) : null}

      {settings.showEnglish ? (
        <View style={styles.block}>
          <Label
            en={verse.translationRange ? MEANING_COPY.enRange(verse.translationRange) : 'English'}
            hi="अंग्रेज़ी अनुवाद"
            palette={palette}
            extra={verse.translationSource === 'ai' ? MEANING_COPY.aiLabelEn : undefined}
          />
          <Text
            selectable
            style={[
              styles.body,
              {
                color: state.en === 'text' ? palette.text : palette.muted,
                fontSize: TYPE.body * scale,
                lineHeight: TYPE.body * scale * 1.5,
              },
            ]}>
            {state.en === 'text' ? english : state.en === 'with' ? MEANING_COPY.enWith(verse.translationSeeVerse!) : MEANING_COPY.enPending}
          </Text>
        </View>
      ) : null}

      {notes.length > 0 ? (
        <View style={styles.block}>
          <Pressable
            onPress={() => setNotesOpen((o) => !o)}
            accessibilityRole="button"
            accessibilityState={{ expanded: notesOpen }}
            style={styles.notesToggle}>
            <Text style={[styles.label, { color: palette.accent }]}>Notes</Text>
            <Text style={[styles.label, { color: palette.muted }]}>टिप्पणी</Text>
            <Ionicons name={notesOpen ? 'chevron-up' : 'chevron-down'} size={14} color={palette.muted} />
          </Pressable>
          {notesOpen
            ? notes.map((n) => (
                <View key={n.en} style={{ marginTop: SPACE.sm }}>
                  <Label en={n.en} hi={n.hi} palette={palette} />
                  <Text
                    selectable
                    style={[
                      styles.body,
                      { color: palette.textSecondary, fontSize: TYPE.callout * scale, lineHeight: TYPE.callout * scale * 1.5 },
                    ]}>
                    {n.text}
                  </Text>
                </View>
              ))
            : null}
        </View>
      ) : null}
    </Card>
  );
}

export const VerseCard = memo(VerseCardImpl);

const styles = StyleSheet.create({
  card: { marginBottom: SPACE.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACE.sm },
  ref: { fontSize: TYPE.footnote, fontWeight: '700', letterSpacing: 0.5 },
  actions: { flexDirection: 'row', columnGap: SPACE.sm },
  iconBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  refPill: { borderRadius: 999, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 3 },
  sanskrit: { rowGap: 2, paddingVertical: SPACE.md, paddingHorizontal: SPACE.sm, borderRadius: 16, borderWidth: 1 },
  block: { marginTop: SPACE.md },
  labelRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', columnGap: SPACE.sm, marginBottom: 2 },
  label: { fontSize: TYPE.caption, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6 },
  badge: { fontSize: 10, borderWidth: StyleSheet.hairlineWidth, borderRadius: 6, paddingHorizontal: 4 },
  body: {},
  notesToggle: { flexDirection: 'row', alignItems: 'center', columnGap: SPACE.sm, paddingVertical: SPACE.xs },
});
