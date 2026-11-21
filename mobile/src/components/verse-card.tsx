import Ionicons from '@expo/vector-icons/Ionicons';
import { memo, useState } from 'react';
import { Pressable, Share, StyleSheet, Text, View } from 'react-native';

import type { Verse } from '@/content/types';
import { useChapterVyakhya } from '@/content/vyakhya';
import {
  cleanVerseField,
  formatVerseRef,
  meaningState,
  MEANING_COPY,
  sanskritLines,
  splitVyakhyaCommentary,
  toDevanagari,
  verseMarkNumber,
} from '@/lib/verse-format';
import { S, type Lang, type Msg } from '@/i18n';
import type { Settings } from '@/lib/backup';
import type { Cover } from '@/theme/covers';
import { fontCap, huesFor, SPACE, TOUCH, TYPE, type Palette } from '@/theme/themes';
import { LifeLesson } from './life-lesson';
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

/** Long व्याख्या opens at this many lines; the rest is a tap away so a chapter stays easy to scroll. */
const VYAKHYA_LINES = 6;

function VerseCardImpl({ scriptureId, scriptureTitle, chapter, verse, palette, settings, lang, cover, bookmarked, onToggleBookmark }: Props) {
  const hues = huesFor(palette);
  const t = (m: Msg) => m[lang];
  // A tap on Notes overrides the "Open notes by default" setting until that setting changes again.
  const [override, setOverride] = useState<{ when: boolean; open: boolean } | null>(null);
  const notesOpen = override && override.when === settings.showNotes ? override.open : settings.showNotes;
  const setNotesOpen = (f: (open: boolean) => boolean) => setOverride({ when: settings.showNotes, open: f(notesOpen) });
  const scale = settings.textScale;
  const cap = fontCap(scale);
  const ref = formatVerseRef(scriptureId, chapter, verse.number);
  const lines = sanskritLines(verse.sanskrit);
  const state = meaningState(verse);
  const hindi = cleanVerseField(verse.hindi);
  const english = cleanVerseField(verse.translation);
  const translit = cleanVerseField(verse.transliteration);
  const [vyakhyaOpen, setVyakhyaOpen] = useState(false);
  // The website's Hindi notes for this chapter, once they are on the phone (src/content/vyakhya.ts).
  const chapterNotes = useChapterVyakhya(scriptureId, chapter);
  const extra = chapterNotes?.[String(verse.number)];
  const wordMeaning = cleanVerseField(verse.wordMeaning);
  // As on the website: Hindi prose is the व्याख्या, English the commentary, whichever field holds it.
  const split = splitVyakhyaCommentary(
    [cleanVerseField(extra?.v), cleanVerseField(verse.explanation), cleanVerseField(verse.commentary)],
    wordMeaning,
  );
  const vyakhya = split.vyakhya;
  const vyakhyaDraft = Boolean(extra?.vd && vyakhya && vyakhya === cleanVerseField(extra.v));
  const lifeLesson = settings.showVyakhya ? cleanVerseField(extra?.l) : '';
  const showVyakhya = settings.showVyakhya && Boolean(vyakhya);
  const notes = [
    { key: 'word', label: S.labelWordMeaning, text: wordMeaning, draft: false },
    // With the व्याख्या layer turned off it still sits among the notes, as before.
    { key: 'vyakhya', label: S.labelVyakhya, text: settings.showVyakhya ? '' : (vyakhya ?? ''), draft: vyakhyaDraft },
    { key: 'commentary', label: S.labelCommentary, text: split.commentary ?? '', draft: false },
    { key: 'research', label: S.labelResearch, text: cleanVerseField(extra?.r), draft: Boolean(extra?.rd) },
  ].filter((n) => n.text);
  const draftBadge = lang === 'hi' ? MEANING_COPY.aiLabelHi : MEANING_COPY.aiLabelEn;

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
              style={{ color: palette.text, fontSize: TYPE.title3 * scale, lineHeight: TYPE.title3 * scale * 1.6, textAlign: 'center' }}>
              {line}
              {i === lines.length - 1 ? (
                // The gilt verse mark.
                <Text style={{ color: palette.gold }}>{`\u00a0॥\u00a0${toDevanagari(verseMarkNumber(verse.number))}\u00a0॥`}</Text>
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
                lineHeight: TYPE.body * scale * 1.5,
              },
            ]}>
            {state.en === 'text' ? english : state.en === 'with' ? MEANING_COPY.enWith(verse.translationSeeVerse!) : MEANING_COPY.enPending}
          </Text>
        </View>
      ) : null}

      {showVyakhya ? (
        <View style={styles.block}>
          <Label msg={S.labelVyakhya} lang={lang} palette={palette} hue={hues.saffron} extra={vyakhyaDraft ? draftBadge : undefined} />
          <Text
            selectable
            numberOfLines={vyakhyaOpen ? undefined : VYAKHYA_LINES}
            maxFontSizeMultiplier={cap}
            style={[styles.body, { color: palette.text, fontSize: TYPE.callout * scale, lineHeight: TYPE.callout * scale * 1.65 }]}>
            {vyakhya}
          </Text>
          {vyakhya!.length > 320 || vyakhya!.includes('\n') ? (
            <Pressable
              onPress={() => setVyakhyaOpen((o) => !o)}
              accessibilityRole="button"
              accessibilityState={{ expanded: vyakhyaOpen }}
              style={({ pressed }) => [styles.moreBtn, pressed && { opacity: 0.6 }]}>
              <Text style={{ color: hues.saffron, fontSize: TYPE.subhead, fontWeight: '600' }}>{t(vyakhyaOpen ? S.vyakhyaLess : S.vyakhyaMore)}</Text>
              <Ionicons name={vyakhyaOpen ? 'chevron-up' : 'chevron-down'} size={14} color={hues.saffron} />
            </Pressable>
          ) : null}
        </View>
      ) : null}

      {lifeLesson ? (
        <LifeLesson text={lifeLesson} palette={palette} lang={lang} scale={scale} draftBadge={extra?.ld ? draftBadge : undefined} />
      ) : null}

      {notes.length > 0 ? (
        <View style={styles.block}>
          <Pressable
            onPress={() => setNotesOpen((o) => !o)}
            accessibilityRole="button"
            accessibilityState={{ expanded: notesOpen }}
            style={styles.notesToggle}>
            <View style={[styles.layerDot, { backgroundColor: palette.muted }]} />
            <Text style={[styles.label, { color: palette.muted }, lang === 'hi' && styles.labelHi]}>{t(S.labelNotes)}</Text>
            <Ionicons name={notesOpen ? 'chevron-up' : 'chevron-down'} size={14} color={palette.muted} />
          </Pressable>
          {notesOpen
            ? notes.map((n) => (
                <View key={n.key} style={{ marginTop: SPACE.sm }}>
                  <Label msg={n.label} lang={lang} palette={palette} hue={palette.muted} extra={n.draft ? draftBadge : undefined} />
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
  moreBtn: { flexDirection: 'row', alignItems: 'center', columnGap: 4, minHeight: TOUCH - 8, alignSelf: 'flex-start' },
  notesToggle: { flexDirection: 'row', alignItems: 'center', columnGap: 6, minHeight: TOUCH - 4 },
});
