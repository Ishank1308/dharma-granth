import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useLocalSearchParams } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Platform, Pressable, ScrollView, Share, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { captureRef } from 'react-native-view-shot';

import { EDITORIAL_STYLES, FORMAT_RATIO, ShareCard, SHARE_STYLES, type EditorialStyle, type ShareCardHandle, type ShareFormat, type ShareStyle } from '@/components/share-card';
import { editorialSwatch } from '@/components/share-editorial';
import { SANSKRIT_FONT } from '@/theme/fonts';
import { accentFill, Backdrop, Chip, glass, GroupTitle, Muted } from '@/components/ui';
import { getEntry, loadChapter, SITE } from '@/content/catalog';
import { S, useI18n, type Msg } from '@/i18n';
import { cleanVerseField, formatVerseRef, meaningState, sanskritLines, verseMarkNumber } from '@/lib/verse-format';
import { usePrefs } from '@/state/app-state';
import { coverFor } from '@/theme/covers';
import { RADIUS, SPACE, THEMES, TOUCH, TYPE } from '@/theme/themes';

export { ErrorBoundary } from '@/components/error-boundary';

type Meaning = 'hi' | 'en' | 'both' | 'none';
const MEANINGS: { key: Meaning; label: Msg }[] = [
  { key: 'hi', label: S.shareMeaningHi },
  { key: 'en', label: S.shareMeaningEn },
  { key: 'both', label: S.shareMeaningBoth },
  { key: 'none', label: S.shareMeaningNone },
];

/** The share image is 1080 px wide, the size Instagram and WhatsApp keep without recompressing much. */
const IMAGE_WIDTH = 1080;

/**
 * Share a verse as an image: a live preview of the card, a choice of look and of the meaning under the
 * shloka, then the Android share sheet. Opened from the share button on a verse.
 */
export default function ShareVerseScreen() {
  const params = useLocalSearchParams<{ id: string; chapter: string; verse: string }>();
  const id = String(params.id);
  const chapterNo = Number(params.chapter);
  const verseNo = String(params.verse);
  const insets = useSafeAreaInsets();
  const { width: screenW } = useWindowDimensions();
  const { palette } = usePrefs();
  const { t, lang } = useI18n();
  const entry = getEntry(id);
  const verse = useMemo(() => loadChapter(id, chapterNo)?.verses.find((v) => String(v.number) === verseNo), [id, chapterNo, verseNo]);
  const cover = useMemo(() => coverFor(id, entry?.category ?? 'other'), [id, entry?.category]);
  const state = verse ? meaningState(verse) : null;
  const hindi = verse && state?.hi === 'text' ? cleanVerseField(verse.hindi) : '';
  const english = verse && state?.en === 'text' ? cleanVerseField(verse.translation) : '';

  const [look, setLook] = useState<ShareStyle>('arch');
  const [format, setFormat] = useState<ShareFormat>('post');
  const [meaning, setMeaning] = useState<Meaning>(() => {
    if (lang === 'hi') return hindi ? 'hi' : english ? 'en' : 'none';
    return english ? 'en' : hindi ? 'hi' : 'none';
  });
  const [busy, setBusy] = useState(false);
  const cardRef = useRef<ShareCardHandle>(null);
  const cardHeight = useRef(0);

  // A story is tall, so its preview is narrower to keep the controls in reach; the export is 1080 px wide either way.
  const cardWidth = Math.min(screenW - SPACE.lg * 2, 420) * (format === 'story' ? 0.82 : 1);
  const ref = formatVerseRef(id, chapterNo, verseNo);
  const title = entry?.title ?? id;
  const lines = sanskritLines(verse?.sanskrit);

  if (!verse || !entry) {
    return (
      <Backdrop>
        <Stack.Screen options={{ title: t(S.shareImageTitle) }} />
        <View style={styles.missing}>
          <Muted style={{ textAlign: 'center', fontSize: TYPE.callout }}>{t(S.shareNoVerse)}</Muted>
        </View>
      </Backdrop>
    );
  }

  const showHi = (meaning === 'hi' || meaning === 'both') && !!hindi;
  const showEn = (meaning === 'en' || meaning === 'both') && !!english;

  const shareImage = async () => {
    if (!cardRef.current || busy) return;
    setBusy(true);
    try {
      const h = cardHeight.current || cardWidth * FORMAT_RATIO[format];
      const uri = await captureRef(cardRef, {
        format: 'png',
        quality: 1,
        result: Platform.OS === 'web' ? 'data-uri' : 'tmpfile',
        width: IMAGE_WIDTH,
        height: Math.round((IMAGE_WIDTH * h) / cardWidth),
        fileName: `dharmagranth-${id}-${ref.replace(/[^0-9a-z]+/gi, '-')}`,
      });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: t(S.shareImageA11y(ref)), UTI: 'public.png' });
      }
    } catch (e) {
      Alert.alert(t(S.shareFailed), e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  const shareText = () => {
    // The whole verse goes out: every line of the Sanskrit, never a cut-down excerpt.
    const message = [`${title} ${ref}`, lines.join('\n'), hindi, english, `${SITE}/scripture/${id}/chapter/${chapterNo}/`]
      .filter(Boolean)
      .join('\n\n');
    Share.share({ message }).catch(() => {});
  };

  const EDITORIAL_LABELS: Record<EditorialStyle, Msg> = {
    arch: S.shareStyleArch,
    midnight: S.shareStyleMidnight,
    sage: S.shareStyleSage,
    aura: S.shareStyleAura,
    manuscript: S.shareStyleManuscript,
  };
  const isEditorial = (s: ShareStyle): s is EditorialStyle => (EDITORIAL_STYLES as string[]).includes(s);
  const lookLabel = (s: ShareStyle) =>
    isEditorial(s) ? t(EDITORIAL_LABELS[s]) : s === 'cover' ? t(S.shareStyleCover) : lang === 'hi' ? THEMES[s].labelHi : THEMES[s].label;
  const a11yCard = [t(S.shareCardA11y(`${title} ${ref}`)), lines.join(' '), showHi ? hindi : '', showEn ? english : ''].filter(Boolean).join('. ');

  return (
    <Backdrop>
      <Stack.Screen options={{ title: t(S.shareImageTitle) }} />
      <ScrollView
        style={{ backgroundColor: 'transparent' }}
        contentContainerStyle={{ paddingHorizontal: SPACE.lg, paddingTop: SPACE.md, paddingBottom: insets.bottom + 120 }}>
        <View
          accessible
          accessibilityRole="image"
          accessibilityLabel={a11yCard}
          style={[styles.preview, { width: cardWidth }, !palette.lite && { boxShadow: palette.dark ? '0 18px 40px rgba(0,0,0,0.6)' : '0 18px 40px rgba(60,30,10,0.22)' }]}>
          <View
            onLayout={(e) => {
              cardHeight.current = e.nativeEvent.layout.height;
            }}>
            <ShareCard
              ref={cardRef}
              width={cardWidth}
              look={look}
              format={format}
              cover={cover}
              bookTitle={entry.titleSanskrit ?? entry.title}
              bookTitleEn={entry.titleSanskrit ? entry.title : undefined}
              verseRef={ref}
              markNumber={verseMarkNumber(verse.number)}
              lines={lines}
              hindi={showHi ? hindi : undefined}
              english={showEn ? english : undefined}
            />
          </View>
        </View>
        <Muted style={{ textAlign: 'center', marginTop: SPACE.sm }}>{t(S.shareFullVerse)}</Muted>

        <GroupTitle title={t(S.shareStyle)} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          accessibilityRole="radiogroup"
          accessibilityLabel={t(S.shareStyle)}
          style={{ marginHorizontal: -SPACE.lg }}
          contentContainerStyle={styles.swatches}>
          {SHARE_STYLES.map((s) => {
            const active = s === look;
            const ed = isEditorial(s) ? editorialSwatch(s) : null;
            const p = ed || s === 'cover' ? null : THEMES[s as keyof typeof THEMES];
            return (
              <Pressable
                key={s}
                onPress={() => setLook(s)}
                accessibilityRole="radio"
                accessibilityState={{ checked: active }}
                accessibilityLabel={lookLabel(s)}
                style={({ pressed }) => [styles.swatchBtn, pressed && { opacity: 0.75 }]}>
                <View
                  style={[
                    styles.swatch,
                    { borderColor: active ? palette.accent : palette.border, borderWidth: active ? 2.5 : 1 },
                    ed
                      ? { backgroundColor: ed.bg, backgroundImage: ed.image }
                      : p
                      ? { backgroundColor: p.bg, backgroundImage: `radial-gradient(80% 60% at 20% 10%, ${p.aurora[0]} 0%, transparent 70%), radial-gradient(70% 60% at 90% 90%, ${p.aurora[2]} 0%, transparent 70%)` }
                      : { backgroundColor: cover.colors[1], backgroundImage: `linear-gradient(160deg, ${cover.colors[0]} 0%, ${cover.colors[1]} 60%, ${cover.colors[2]} 130%)` },
                  ]}>
                  <Text allowFontScaling={false} style={{ fontFamily: SANSKRIT_FONT, color: ed ? (s === 'arch' ? '#fbeedd' : ed.accent) : p ? p.gold : cover.foil, fontSize: 20 }}>
                    ॐ
                  </Text>
                </View>
                <Text
                  maxFontSizeMultiplier={1.6}
                  numberOfLines={2}
                  style={{ color: active ? palette.accent : palette.textSecondary, fontSize: TYPE.caption, fontWeight: active ? '700' : '500', textAlign: 'center' }}>
                  {lookLabel(s)}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <GroupTitle title={t(S.shareFormat)} />
        <View accessibilityRole="radiogroup" accessibilityLabel={t(S.shareFormat)} style={styles.chips}>
          <Chip label={t(S.shareFormatPost)} active={format === 'post'} onPress={() => setFormat('post')} />
          <Chip label={t(S.shareFormatStory)} active={format === 'story'} onPress={() => setFormat('story')} />
        </View>

        <GroupTitle title={t(S.shareMeaning)} />
        <View accessibilityRole="radiogroup" accessibilityLabel={t(S.shareMeaning)} style={styles.chips}>
          {MEANINGS.filter((m) => (m.key === 'hi' ? !!hindi : m.key === 'en' ? !!english : m.key === 'both' ? !!hindi && !!english : true)).map((m) => (
            <Chip key={m.key} label={t(m.label)} active={meaning === m.key} onPress={() => setMeaning(m.key)} />
          ))}
        </View>
      </ScrollView>

      {/* Actions in the thumb zone. */}
      <View
        style={[
          styles.actions,
          { paddingBottom: Math.max(insets.bottom, SPACE.sm) + SPACE.sm },
          // Fades the scrolled content out under the buttons, so their labels never sit on top of text.
          { backgroundImage: `linear-gradient(to top, ${palette.bg} 55%, transparent 100%)` },
        ]}>
        <Pressable
          onPress={shareText}
          accessibilityRole="button"
          accessibilityLabel={t(S.shareTextBtn)}
          style={({ pressed }) => [styles.secondary, glass(palette, true), pressed && { opacity: 0.8 }]}>
          <Ionicons name="text-outline" size={18} color={palette.text} />
          <Text maxFontSizeMultiplier={1.4} style={{ color: palette.text, fontSize: TYPE.subhead, fontWeight: '600' }}>
            {t(S.shareTextBtn)}
          </Text>
        </Pressable>
        <Pressable
          onPress={shareImage}
          disabled={busy}
          accessibilityRole="button"
          accessibilityState={{ busy, disabled: busy }}
          accessibilityLabel={t(S.shareImageA11y(`${title} ${ref}`))}
          style={({ pressed }) => [styles.primary, accentFill(palette), pressed && { transform: [{ scale: 0.97 }] }]}>
          {busy ? <ActivityIndicator color={palette.onAccent} /> : <Ionicons name="image-outline" size={20} color={palette.onAccent} />}
          <Text maxFontSizeMultiplier={1.4} style={{ color: palette.onAccent, fontSize: TYPE.body, fontWeight: '700' }}>
            {t(S.shareImageBtn)}
          </Text>
        </Pressable>
      </View>
    </Backdrop>
  );
}

const styles = StyleSheet.create({
  missing: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACE.xl },
  preview: { alignSelf: 'center', borderRadius: RADIUS.tile, overflow: 'hidden' },
  swatches: { flexDirection: 'row', columnGap: SPACE.xs, paddingHorizontal: SPACE.lg },
  swatchBtn: { width: 72, alignItems: 'center', rowGap: 6, minHeight: TOUCH, paddingVertical: SPACE.xs },
  swatch: { width: 52, height: 64, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACE.sm },
  actions: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    columnGap: SPACE.sm,
    paddingHorizontal: SPACE.lg,
    paddingTop: SPACE.xl,
  },
  secondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 6,
    minHeight: TOUCH + 8,
    paddingHorizontal: SPACE.lg,
    borderRadius: RADIUS.pill,
  },
  primary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: SPACE.sm,
    minHeight: TOUCH + 8,
    borderRadius: RADIUS.pill,
  },
});
