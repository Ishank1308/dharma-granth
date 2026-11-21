import Ionicons from '@expo/vector-icons/Ionicons';
import { memo, useState } from 'react';
import { AccessibilityInfo, ActivityIndicator, Pressable, Share, StyleSheet, Text, View } from 'react-native';

import type { RecitationPhase } from '@/audio/player';

import type { Verse } from '@/content/types';
import { useChapterVyakhya } from '@/content/vyakhya';
import {
  cleanVerseField,
  formatVerseRef,
  meaningState,
  MEANING_COPY,
  sanskritLines,
  isMostlyDevanagari,
  splitVyakhyaCommentary,
  toDevanagari,
  verseMarkNumber,
} from '@/lib/verse-format';
import { S, type Lang, type Msg } from '@/i18n';
import type { Settings } from '@/lib/backup';
import type { Cover } from '@/theme/covers';
import { fontCap, huesFor, SPACE, TOUCH, TYPE, type Palette } from '@/theme/themes';
import { parseModernContext } from '@/lib/modern-context';
import { parseWordMeanings } from '@/lib/word-gloss';
import { Card, coverFill } from './ui';
import {
  Badge,
  ConnectedFlow,
  ModernContextBody,
  PillButton,
  ReflectionBody,
  SacredHeading,
  StudyToggle,
  SubLabel,
  VyakhyaText,
  WordByWord,
} from './verse-study';

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
  // "व्याख्या एवं संदर्भ" opens by default when the setting says so; a tap overrides it for this card until the setting changes.
  const [override, setOverride] = useState<{ when: boolean; open: boolean } | null>(null);
  const studyOpen = override && override.when === settings.showVyakhya ? override.open : settings.showVyakhya;
  const setStudyOpen = (open: boolean) => setOverride({ when: settings.showVyakhya, open });
  // The deeper layers (पदच्छेद, आधुनिक परिप्रेक्ष्य) follow the setting, or one tap on this card.
  const [deepened, setDeepened] = useState(false);
  const deep = settings.showNotes || deepened;
  const scale = settings.textScale;
  const cap = fontCap(scale);
  const ref = formatVerseRef(scriptureId, chapter, verse.number);
  const lines = sanskritLines(verse.sanskrit);
  const state = meaningState(verse);
  const hindi = cleanVerseField(verse.hindi);
  const english = cleanVerseField(verse.translation);
  const translit = cleanVerseField(verse.transliteration);
  // The website's Hindi notes for this chapter, once they are on the phone (src/content/vyakhya.ts).
  const chapterNotes = useChapterVyakhya(scriptureId, chapter);
  const extra = chapterNotes?.[String(verse.number)];
  const wordMeaning = cleanVerseField(verse.wordMeaning);
  const glosses = parseWordMeanings(wordMeaning);
  // As on the website: Hindi prose is the व्याख्या, English the commentary, whichever field holds it.
  const split = splitVyakhyaCommentary(
    [cleanVerseField(extra?.v), cleanVerseField(verse.explanation), cleanVerseField(verse.commentary)],
    wordMeaning,
  );
  const vyakhya = split.vyakhya;
  const commentary = split.commentary;
  const draftBadge = lang === 'hi' ? MEANING_COPY.aiLabelHi : MEANING_COPY.aiLabelEn;
  const vyakhyaDraft = Boolean(extra?.vd && vyakhya && vyakhya === cleanVerseField(extra.v));
  const science = cleanVerseField(extra?.r);
  const lesson = cleanVerseField(extra?.l);
  const modern = lesson ? parseModernContext(lesson) : null;

  // The same gates as the website's VerseCard: which sections this verse has.
  const showVyakhyaSection = Boolean(vyakhya || commentary);
  const showScience = Boolean(deep && science);
  const showLessonModern = Boolean(modern && (modern.context || modern.application));
  const showModern = showScience || showLessonModern;
  const showReflection = Boolean(modern?.question);
  const showWords = Boolean(deep && wordMeaning);
  const hasStudy = Boolean(wordMeaning || showVyakhyaSection || science || lesson);
  const canDeepen = !deep && Boolean(wordMeaning || science);
  const showArth = settings.showHindi || settings.showEnglish;
  const bothLangs = settings.showHindi && settings.showEnglish;

  const prose = (hindiText: boolean) => ({
    color: palette.text,
    fontSize: (hindiText ? TYPE.callout : TYPE.body) * scale,
    lineHeight: (hindiText ? TYPE.callout * 1.75 : TYPE.body * 1.55) * scale,
  });

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
          {/* A heading, so TalkBack's heading navigation steps from verse to verse. */}
          <Text style={styles.ref} accessibilityRole="header" accessibilityLabel={t(S.verseA11y(ref))}>
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
            onPress={() => {
              onToggleBookmark(String(verse.number));
              AccessibilityInfo.announceForAccessibility(t(bookmarked ? S.verseRemovedAnnounce : S.verseSavedAnnounce));
            }}
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
        // One TalkBack stop for the whole shloka, read line after line, rather than one stop per line and the
        // ॥ marks read out as symbols.
        <View
          accessible
          accessibilityLabel={lines.join('\n')}
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

      {showArth ? (
        <View style={styles.section}>
          <SacredHeading msg={S.sacredArth} palette={palette} />
          {settings.showHindi ? (
            <View>
              {verse.hindiRange ? (
                <SubLabel msg={S.labelHindiRange(verse.hindiRange)} palette={palette} color={hues.saffron} />
              ) : bothLangs && state.hi === 'text' ? (
                <SubLabel msg={S.arthHindi} palette={palette} color={hues.saffron} />
              ) : null}
              <Text
                selectable
                maxFontSizeMultiplier={cap}
                style={{
                  color: state.hi === 'text' ? palette.text : palette.muted,
                  fontSize: TYPE.body * scale,
                  lineHeight: TYPE.body * scale * 1.6,
                }}>
                {state.hi === 'text'
                  ? hindi
                  : state.hi === 'review'
                    ? MEANING_COPY.hiReview
                    : state.hi === 'with'
                      ? MEANING_COPY.hiWith(verse.hindiSeeVerse!)
                      : MEANING_COPY.hiPending}
                {state.hi === 'text' && verse.hindiSource === 'ai' ? <Text style={{ color: palette.muted, fontSize: TYPE.caption - 1 }}>{`  ${MEANING_COPY.aiLabelHi}`}</Text> : null}
              </Text>
            </View>
          ) : null}
          {settings.showEnglish ? (
            <View style={settings.showHindi ? [styles.secondLang, { borderTopColor: palette.border }] : undefined}>
              {verse.translationRange ? (
                <SubLabel msg={S.labelEnglishRange(verse.translationRange)} palette={palette} color={hues.saffron} />
              ) : bothLangs && state.en === 'text' ? (
                <SubLabel msg={S.arthEnglish} palette={palette} color={hues.saffron} />
              ) : null}
              <Text
                selectable
                maxFontSizeMultiplier={cap}
                style={{
                  color: state.en === 'text' ? palette.text : palette.muted,
                  fontSize: TYPE.body * scale,
                  lineHeight: TYPE.body * scale * 1.5,
                }}>
                {state.en === 'text' ? english : state.en === 'with' ? MEANING_COPY.enWith(verse.translationSeeVerse!) : MEANING_COPY.enPending}
                {state.en === 'text' && verse.translationSource === 'ai' ? <Text style={{ color: palette.muted, fontSize: TYPE.caption - 1 }}>{`  ${MEANING_COPY.aiLabelEn}`}</Text> : null}
              </Text>
            </View>
          ) : null}
        </View>
      ) : null}

      {hasStudy ? <StudyToggle open={studyOpen} onPress={() => setStudyOpen(!studyOpen)} palette={palette} lang={lang} /> : null}

      {hasStudy && studyOpen ? (
        <View>
          {showWords ? <WordByWord glosses={glosses} raw={wordMeaning} palette={palette} cap={cap} /> : null}

          {showVyakhyaSection || showModern || showReflection ? (
            <ConnectedFlow palette={palette}>
              {showVyakhyaSection ? (
                <View>
                  <SacredHeading msg={S.sacredVyakhya} palette={palette} badge={vyakhyaDraft ? draftBadge : undefined} />
                  <View style={{ rowGap: SPACE.md }}>
                    {vyakhya ? (
                      <View
                        style={[
                          styles.panel,
                          {
                            borderColor: palette.dark ? 'rgba(251,191,36,0.2)' : 'rgba(217,119,6,0.2)',
                            backgroundColor: palette.dark ? 'rgba(251,191,36,0.05)' : 'rgba(251,191,36,0.06)',
                          },
                        ]}>
                        <VyakhyaText text={vyakhya} style={prose(true)} cap={cap} />
                      </View>
                    ) : null}
                    {commentary ? (
                      <View style={[styles.panel, { borderColor: palette.border }]}>
                        <SubLabel msg={S.commentaryEnglish} palette={palette} color={hues.saffron} />
                        <Text selectable maxFontSizeMultiplier={cap} style={prose(false)}>
                          {commentary}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              ) : null}

              {showModern ? (
                <View>
                  <SacredHeading msg={S.sacredModern} palette={palette} badge={extra?.ld && showLessonModern ? draftBadge : undefined} />
                  <View style={{ rowGap: SPACE.md }}>
                    {showScience ? (
                      <View style={[styles.panel, { borderColor: palette.border }]}>
                        <View style={styles.subRow}>
                          <SubLabel msg={S.modernPerspective} palette={palette} />
                          {extra?.rd ? <Badge text={draftBadge} palette={palette} /> : null}
                        </View>
                        <Text selectable maxFontSizeMultiplier={cap} style={prose(isMostlyDevanagari(science))}>
                          {science}
                        </Text>
                      </View>
                    ) : null}
                    {showLessonModern && modern ? <ModernContextBody parsed={modern} style={prose(isMostlyDevanagari(lesson))} palette={palette} cap={cap} /> : null}
                  </View>
                </View>
              ) : null}

              {showReflection && modern ? (
                <View>
                  <SacredHeading msg={S.sacredReflection} palette={palette} />
                  <ReflectionBody question={modern.question} style={prose(isMostlyDevanagari(modern.question))} palette={palette} cap={cap} />
                </View>
              ) : null}
            </ConnectedFlow>
          ) : null}

          <View style={[styles.studyFoot, { borderTopColor: palette.border }]}>
            {canDeepen ? <PillButton msg={S.verseStudyMore} icon="layers-outline" onPress={() => setDeepened(true)} palette={palette} color={hues.saffron} /> : null}
            <PillButton msg={S.verseStudyClose} icon="chevron-up" onPress={() => setStudyOpen(false)} palette={palette} />
          </View>
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
  // Shrinks and wraps before it can push the share and save buttons off a card at large font sizes.
  refPill: { flexShrink: 1, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4 },
  sanskrit: { rowGap: 2, paddingVertical: SPACE.md + 2, paddingHorizontal: SPACE.sm, borderRadius: 18, borderWidth: 1 },
  section: { marginTop: SPACE.md },
  secondLang: { marginTop: SPACE.sm, paddingTop: SPACE.sm, borderTopWidth: StyleSheet.hairlineWidth },
  panel: { borderWidth: StyleSheet.hairlineWidth, borderRadius: 14, padding: SPACE.md },
  subRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', columnGap: 6 },
  studyFoot: { marginTop: SPACE.lg, paddingTop: SPACE.sm, borderTopWidth: StyleSheet.hairlineWidth, rowGap: SPACE.xs, alignItems: 'center' },
});
