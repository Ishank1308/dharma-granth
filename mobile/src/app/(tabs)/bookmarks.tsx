import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PracticeCard } from '@/components/practice-card';
import { accentFill, Backdrop, Card, coverFill, LargeHeader, Muted } from '@/components/ui';
import { getEntry, loadChapter } from '@/content/catalog';
import { S, useI18n } from '@/i18n';
import { cleanVerseField, formatVerseRef, meaningState, MEANING_COPY, sanskritLines } from '@/lib/verse-format';
import { useAppState } from '@/state/app-state';
import { coverFor } from '@/theme/covers';
import { barClearance, fontCap, huesFor, RADIUS, SPACE, TITLE_FONT_CAP, TOUCH, TYPE } from '@/theme/themes';

export default function BookmarksScreen() {
  const insets = useSafeAreaInsets();
  const { palette, settings, bookmarks, removeBookmark } = useAppState();
  const scale = settings.textScale;
  const cap = fontCap(scale);
  const { t } = useI18n();

  return (
    <Backdrop>
      <FlatList
        style={{ backgroundColor: 'transparent' }}
        contentContainerStyle={{ flexGrow: 1, paddingTop: insets.top, paddingHorizontal: SPACE.lg, paddingBottom: barClearance(insets.bottom) }}
        data={bookmarks}
        keyExtractor={(b) => `${b.id}:${b.chapter}:${b.verse}`}
        ListHeaderComponent={
          <>
            <LargeHeader
              title={S.savedTitle}
              eyebrow={S.savedEyebrow}
              subtitle={bookmarks.length ? t(S.savedSummary(bookmarks.length)) : undefined}
            />
            <PracticeCard />
          </>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={[styles.emptyIcon, { backgroundColor: palette.dark ? 'rgba(255,159,10,0.14)' : 'rgba(194,65,12,0.10)' }]}>
              <Ionicons name="flower-outline" size={44} color={huesFor(palette).saffron} />
            </View>
            <Text accessibilityRole="header" maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.title2, fontWeight: '700', textAlign: 'center' }}>
              {t(S.savedEmptyTitle)}
            </Text>
            <Muted style={{ textAlign: 'center', fontSize: TYPE.callout, lineHeight: TYPE.callout * 1.5 }}>{t(S.savedEmpty)}</Muted>
            {getEntry('bhagavadgita') ? (
              <Pressable
                accessibilityRole="button"
                onPress={() => router.push({ pathname: '/scripture/[id]', params: { id: 'bhagavadgita' } })}
                style={({ pressed }) => [styles.cta, accentFill(palette), pressed && { transform: [{ scale: 0.97 }] }]}>
                <Text maxFontSizeMultiplier={1.4} style={{ color: palette.onAccent, fontSize: TYPE.body, fontWeight: '700' }}>
                  {t(S.startWithGita)}
                </Text>
              </Pressable>
            ) : null}
          </View>
        }
        renderItem={({ item }) => {
          const entry = getEntry(item.id);
          const verse = loadChapter(item.id, item.chapter)?.verses.find((v) => String(v.number) === item.verse);
          const lines = sanskritLines(verse?.sanskrit);
          // The meaning follows the reader's "Show in verses" choices, as in the chapter reader.
          const state = verse ? meaningState(verse) : null;
          const hindi =
            !verse || !state || !settings.showHindi
              ? ''
              : state.hi === 'text'
                ? cleanVerseField(verse.hindi)
                : state.hi === 'with'
                  ? MEANING_COPY.hiWith(verse.hindiSeeVerse!)
                  : '';
          const english =
            !verse || !state || !settings.showEnglish
              ? ''
              : state.en === 'text'
                ? cleanVerseField(verse.translation)
                : state.en === 'with'
                  ? MEANING_COPY.enWith(verse.translationSeeVerse!)
                  : '';
          const ref = `${entry?.title ?? item.id} ${formatVerseRef(item.id, item.chapter, item.verse)}`;
          return (
            <Card style={styles.card}>
              {/* The remove button sits beside the open button, not inside it: TalkBack cannot reach a
                  button nested in another button, and nested touch targets misfire. */}
              <Pressable
                style={{ flex: 1 }}
                accessibilityRole="button"
                accessibilityLabel={t(S.openSavedA11y(ref))}
                onPress={() =>
                  router.push({
                    pathname: '/scripture/[id]/[chapter]',
                    params: { id: item.id, chapter: String(item.chapter), verse: item.verse },
                  })
                }>
                <View style={[styles.ref, coverFill(coverFor(item.id, entry?.category ?? 'other'), palette, true)]}>
                  <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: '#ffffff', fontWeight: '700', fontSize: TYPE.footnote }}>
                    {ref}
                  </Text>
                </View>
                {/* The full verse, every line, as saved. */}
                {lines.map((l, i) => (
                  <Text
                    key={i}
                    maxFontSizeMultiplier={cap}
                    style={{ color: palette.text, fontSize: TYPE.callout * scale, lineHeight: TYPE.callout * scale * 1.6 }}>
                    {l}
                  </Text>
                ))}
                {hindi ? (
                  <Text
                    maxFontSizeMultiplier={cap}
                    style={{
                      color: state?.hi === 'text' ? palette.textSecondary : palette.muted,
                      fontSize: TYPE.subhead * scale,
                      lineHeight: TYPE.subhead * scale * 1.55,
                      marginTop: SPACE.sm,
                    }}>
                    {hindi}
                  </Text>
                ) : null}
                {english ? (
                  <Text
                    maxFontSizeMultiplier={cap}
                    style={{
                      color: state?.en === 'text' ? palette.textSecondary : palette.muted,
                      fontSize: TYPE.subhead * scale,
                      lineHeight: TYPE.subhead * scale * 1.5,
                      marginTop: SPACE.sm,
                    }}>
                    {english}
                  </Text>
                ) : null}
              </Pressable>
              <Pressable
                style={styles.remove}
                accessibilityRole="button"
                accessibilityLabel={t(S.removeSavedA11y(ref))}
                onPress={() => removeBookmark(item)}>
                <Ionicons name="trash-outline" size={18} color={palette.muted} />
              </Pressable>
            </Card>
          );
        }}
      />
    </Backdrop>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: SPACE.md, flexDirection: 'row', alignItems: 'flex-start', columnGap: SPACE.sm },
  ref: { alignSelf: 'flex-start', borderRadius: RADIUS.pill, paddingHorizontal: SPACE.md, paddingVertical: 4, marginBottom: SPACE.sm },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', rowGap: SPACE.md, paddingHorizontal: SPACE.lg, paddingBottom: SPACE.xxl },
  emptyIcon: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center', marginBottom: SPACE.sm },
  cta: { marginTop: SPACE.md, minHeight: TOUCH + 8, paddingHorizontal: SPACE.xl, borderRadius: RADIUS.pill, alignItems: 'center', justifyContent: 'center' },
  // 48 dp touch target (Android accessibility minimum).
  remove: { width: 48, height: 48, marginTop: -SPACE.md, marginRight: -SPACE.md, alignItems: 'center', justifyContent: 'center' },
});
