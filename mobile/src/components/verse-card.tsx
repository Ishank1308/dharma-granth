import Ionicons from '@expo/vector-icons/Ionicons';
import { memo, useState } from 'react';
import { ActivityIndicator, Pressable, Share, StyleSheet, Text, View } from 'react-native';

import type { RecitationPhase } from '@/audio/player';

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
import { S, type Lang, type Msg } from '@/i18n';
import { toScript } from '@/lib/sanskrit-script';
import { LINE_FACTOR, sanskritFont } from '@/theme/fonts';
import type { Settings } from '@/lib/backup';
import type { Cover } from '@/theme/covers';
import { fontCap, huesFor, SPACE, TOUCH, TYPE, type Palette } from '@/theme/themes';
import { Card, coverFill } from './ui';

interface Props {
  scriptureId: string;
  scriptureTitle: string;
  chapter: number;
  verse: Verse;
  palette: Palette;
  settings: Settings;
  /** Interface language, for labels and screen-reader text. The verse text itself is never translated. */
  lang: Lang;
  /** The book's cover colours (src/theme/covers.ts): the verse number capsule and the card's top edge wear them. */
  cover: Cover;
  bookmarked: boolean;
  /** Called with the verse number; keep it stable (useCallback) so memo skips unchanged cards. */
  onToggleBookmark: (verse: string) => void;
  /** Set only when this verse has recitation audio: 'idle' unless it is the verse that is loaded. */
  audio?: RecitationPhase;
  /** Called with the verse number; keep it stable like onToggleBookmark. */
  onToggleAudio?: (verse: string) => void;
}

/** A study layer's label, led by a dot in the layer's own hue, as on the website. */
function Label({ msg, lang, palette, extra, hue }: { msg: Msg; lang: Lang; palette: Palette; extra?: string; hue?: string }) {
  return (
    <View style={styles.labelRow}>
      {hue ? <View style={[styles.layerDot, { backgroundColor: hue }]} /> : null}
      <Text style={[styles.label, { color: hue ?? palette.accent }, lang === 'hi' && styles.labelHi]}>{msg[lang]}</Text>
      {extra ? <Text style={[styles.badge, { color: palette.muted, borderColor: palette.border }]}>{extra}</Text> : null}
    </View>
  );
}

function VerseCardImpl({
  scriptureId,
  scriptureTitle,
  chapter,
  verse,
  palette,
  settings,
  lang,
  cover,
  bookmarked,
  onToggleBookmark,
  audio,
  onToggleAudio,
}: Props) {
  const hues = huesFor(palette);
  const t = (m: Msg) => m[lang];
  // A tap on Notes overrides the "Open notes by default" setting until that setting changes again.
  const [override, setOverride] = useState<{ when: boolean; open: boolean } | null>(null);
  const notesOpen = override && override.when === settings.showNotes ? override.open : settings.showNotes;
  const setNotesOpen = (f: (open: boolean) => boolean) => setOverride({ when: settings.showNotes, open: f(notesOpen) });
  const scale = settings.textScale;
  const cap = fontCap(scale);
  const lh = LINE_FACTOR[settings.lineSpacing];
  const script = settings.sanskritScript;
  const ref = formatVerseRef(scriptureId, chapter, verse.number);
  const lines = sanskritLines(verse.sanskrit);
  const state = meaningState(verse);
  const hindi = cleanVerseField(verse.hindi);
  const english = cleanVerseField(verse.translation);
  const translit = cleanVerseField(verse.transliteration);
  const notes = [
    { key: 'word', label: S.labelWordMeaning, text: cleanVerseField(verse.wordMeaning) },
    { key: 'commentary', label: S.labelCommentary, text: cleanVerseField(verse.commentary) },
    { key: 'explanation', label: S.labelExplanation, text: cleanVerseField(verse.explanation) },
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
      {/* The book's cover colours along the top edge, as the website's verse cards. */}
      <View pointerEvents="none" style={[styles.edge, coverFill(cover, palette)]} />
      <View style={styles.header}>
        <View style={[styles.refPill, coverFill(cover, palette, true)]}>
          <Text style={styles.ref} accessibilityLabel={t(S.verseA11y(ref))}>
            {ref}
          </Text>
        </View>
        <View style={styles.actions}>
          {audio && onToggleAudio ? (
            <Pressable
              onPress={() => onToggleAudio(String(verse.number))}
              style={({ pressed }) => [
                styles.iconBtn,
                audio !== 'idle' && audio !== 'error' && { backgroundColor: palette.dark ? 'rgba(255,159,10,0.16)' : 'rgba(194,65,12,0.10)' },
                pressed && { opacity: 0.6 },
              ]}
              accessibilityRole="button"
              accessibilityState={{ busy: audio === 'loading', selected: audio === 'playing' }}
              accessibilityLabel={t(
                audio === 'playing' ? S.pauseVerseA11y(ref) : audio === 'error' ? S.retryVerseA11y(ref) : S.listenVerseA11y(ref),
              )}>
              {audio === 'loading' ? (
                <ActivityIndicator size="small" color={palette.accent} />
              ) : (
                <Ionicons
                  name={audio === 'playing' ? 'pause' : audio === 'error' ? 'refresh' : 'play-outline'}
                  size={20}
                  color={audio === 'idle' ? palette.muted : palette.accent}
                />
              )}
            </Pressable>
          ) : null}
          <Pressable
            onPress={share}
            style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.6 }]}
            accessibilityRole="button"
            accessibilityLabel={t(S.shareVerseA11y(ref))}>
            <Ionicons name="share-outline" size={20} color={palette.muted} />
          </Pressable>
          <Pressable
            onPress={() => onToggleBookmark(String(verse.number))}
            style={({ pressed }) => [
              styles.iconBtn,
              bookmarked && { backgroundColor: palette.dark ? 'rgba(255,159,10,0.16)' : 'rgba(194,65,12,0.10)' },
              pressed && { opacity: 0.6 },
            ]}
            accessibilityRole="button"
            accessibilityState={{ selected: bookmarked }}
            accessibilityLabel={t(bookmarked ? S.unbookmarkVerseA11y(ref) : S.bookmarkVerseA11y(ref))}>
            <Ionicons name={bookmarked ? 'bookmark' : 'bookmark-outline'} size={20} color={bookmarked ? palette.accent : palette.muted} />
          </Pressable>
        </View>
      </View>

      {lines.length > 0 ? (
        <View
          style={[
            styles.sanskrit,
            {
              backgroundColor: palette.dark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.55)',
              borderColor: palette.dark ? 'rgba(246,199,104,0.16)' : 'rgba(180,120,40,0.16)',
            },
            // A soft light from above on the shloka, as the website's luminous panel.
            !palette.lite && {
              backgroundImage: palette.dark
                ? 'radial-gradient(90% 80% at 50% 0%, rgba(246,199,104,0.10) 0%, rgba(255,255,255,0) 70%)'
                : 'radial-gradient(90% 80% at 50% 0%, rgba(255,255,255,0.9) 0%, rgba(246,199,104,0.10) 100%)',
            },
          ]}>
          {lines.map((line, i) => (
            <Text
              key={i}
              selectable
              maxFontSizeMultiplier={cap}
              style={[
                { color: palette.text, fontSize: TYPE.title3 * scale, lineHeight: TYPE.title3 * scale * 1.7 * lh, textAlign: 'center' },
                sanskritFont(script),
              ]}>
              {toScript(line, script)}
              {i === lines.length - 1 ? (
                // The gilt verse mark.
                <Text style={{ color: palette.gold }}>{`\u00a0॥\u00a0${toScript(toDevanagari(verseMarkNumber(verse.number)), script)}\u00a0॥`}</Text>
              ) : null}
            </Text>
          ))}
        </View>
      ) : null}

      {settings.showTransliteration && translit ? (
        <Text
          selectable
          maxFontSizeMultiplier={cap}
          style={{
            color: palette.textSecondary,
            fontSize: TYPE.subhead * scale,
            lineHeight: TYPE.subhead * scale * 1.5 * lh,
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
            msg={verse.hindiRange ? S.labelHindiRange(verse.hindiRange) : S.labelHindi}
            lang={lang}
            palette={palette}
            hue={hues.peacock}
            extra={verse.hindiSource === 'ai' ? MEANING_COPY.aiLabelHi : undefined}
          />
          <Text
            selectable
            maxFontSizeMultiplier={cap}
            style={[
              styles.body,
              {
                color: state.hi === 'text' ? palette.text : palette.muted,
                fontSize: TYPE.body * scale,
                lineHeight: TYPE.body * scale * 1.55 * lh,
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
            msg={verse.translationRange ? S.labelEnglishRange(verse.translationRange) : S.labelEnglish}
            lang={lang}
            palette={palette}
            hue={hues.indigo}
            extra={verse.translationSource === 'ai' ? MEANING_COPY.aiLabelEn : undefined}
          />
          <Text
            selectable
            maxFontSizeMultiplier={cap}
            style={[
              styles.body,
              {
                color: state.en === 'text' ? palette.text : palette.muted,
                fontSize: TYPE.body * scale,
                lineHeight: TYPE.body * scale * 1.5 * lh,
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
            <View style={[styles.layerDot, { backgroundColor: hues.saffron }]} />
            <Text style={[styles.label, { color: hues.saffron }, lang === 'hi' && styles.labelHi]}>{t(S.labelNotes)}</Text>
            <Ionicons name={notesOpen ? 'chevron-up' : 'chevron-down'} size={14} color={palette.muted} />
          </Pressable>
          {notesOpen
            ? notes.map((n) => (
                <View key={n.key} style={{ marginTop: SPACE.sm }}>
                  <Label msg={n.label} lang={lang} palette={palette} hue={hues.saffron} />
                  <Text
                    selectable
                    maxFontSizeMultiplier={cap}
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', columnGap: SPACE.sm, marginBottom: SPACE.sm },
  ref: { color: '#ffffff', fontSize: TYPE.footnote, fontWeight: '700', letterSpacing: 0.5 },
  actions: { flexDirection: 'row', columnGap: SPACE.xs, marginRight: -SPACE.sm },
  iconBtn: { width: TOUCH, height: TOUCH, borderRadius: TOUCH / 2, alignItems: 'center', justifyContent: 'center' },
  edge: { position: 'absolute', top: 0, left: 0, right: 0, height: 3 },
  layerDot: { width: 7, height: 7, borderRadius: 4 },
  // Shrinks and wraps before it can push the share and save buttons off a card at large font sizes.
  refPill: { flexShrink: 1, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4 },
  sanskrit: { rowGap: 2, paddingVertical: SPACE.md + 2, paddingHorizontal: SPACE.sm, borderRadius: 18, borderWidth: 1 },
  block: { marginTop: SPACE.md },
  labelRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', columnGap: 6, marginBottom: 2 },
  label: { fontSize: TYPE.caption, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6 },
  // Devanagari has no case, and letter-spacing breaks its conjuncts apart.
  labelHi: { fontSize: TYPE.footnote, letterSpacing: 0 },
  badge: { fontSize: 10, borderWidth: StyleSheet.hairlineWidth, borderRadius: 6, paddingHorizontal: 4 },
  body: {},
  notesToggle: { flexDirection: 'row', alignItems: 'center', columnGap: 6, minHeight: TOUCH - 4 },
});
