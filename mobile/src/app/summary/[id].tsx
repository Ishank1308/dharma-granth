import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useRef } from 'react';
import { Pressable, ScrollView, type ScrollViewInstance, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EditorialNote, KeyVerseList, SummaryBody } from '@/components/chapter-summary';
import { accentFill, Backdrop, glass, LargeHeader, Muted } from '@/components/ui';
import { getEntry } from '@/content/catalog';
import { useDownloads } from '@/content/downloads';
import { summaryCollection } from '@/content/study';
import { S, useI18n } from '@/i18n';
import { toDevanagari } from '@/lib/verse-format';
import { useAppState } from '@/state/app-state';
import { huesFor, RADIUS, SPACE, TITLE_FONT_CAP, TOUCH, TYPE } from '@/theme/themes';

/**
 * Every chapter's summary on one page, as the website's /scripture/{id}/summary/: the chapter name, what
 * it covers, its key verses (each opens the reader at that verse) and a button into the chapter.
 * Opened from a chapter's summary card, it scrolls to that chapter.
 */
export default function SummaryScreen() {
  const params = useLocalSearchParams<{ id: string; chapter?: string }>();
  const id = String(params.id);
  const insets = useSafeAreaInsets();
  const { palette } = useAppState();
  const { t, lang } = useI18n();
  const entry = getEntry(id);
  const collection = summaryCollection(id);
  const { installed } = useDownloads();
  const offline = Boolean(entry?.bundled || installed[id]);
  const scroller = useRef<ScrollViewInstance>(null);
  const scrolled = useRef(false);
  const hues = huesFor(palette);

  if (!entry || !collection) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: '' }} />
        <Muted>{t(S.chapterUnavailable)}</Muted>
      </View>
    );
  }

  const open = (chapter: number, verse?: number) =>
    router.push({
      pathname: '/scripture/[id]/[chapter]',
      params: { id, chapter: String(chapter), ...(verse != null ? { verse: String(verse) } : {}) },
    });

  return (
    <Backdrop>
      <>
        <Stack.Screen options={{ title: '', headerTransparent: true, headerStyle: { backgroundColor: 'transparent' } }} />
        <ScrollView
          ref={scroller}
          style={{ backgroundColor: 'transparent' }}
          contentContainerStyle={{ paddingTop: insets.top + 24, paddingHorizontal: SPACE.lg, paddingBottom: insets.bottom + SPACE.xxl * 2, rowGap: SPACE.md }}>
          <LargeHeader title={collection.heading} eyebrow={{ en: entry.title, hi: entry.titleSanskrit ?? entry.title }} subtitle={t(S.summaryAllSub)} />
          {collection.chapters.map((c) => {
            const meta = entry.chapters.find((ch) => ch.number === c.chapter);
            const name = (lang === 'hi' ? c.nameHi : c.nameEn) ?? meta?.titleSanskrit ?? meta?.title;
            const other = (lang === 'hi' ? c.nameEn : c.nameHi) ?? (meta?.titleSanskrit ? meta.title : undefined);
            return (
              <View
                key={c.chapter}
                onLayout={(e) => {
                  if (scrolled.current || String(c.chapter) !== params.chapter) return;
                  scrolled.current = true;
                  scroller.current?.scrollTo({ y: Math.max(0, e.nativeEvent.layout.y - insets.top - 56), animated: false });
                }}
                style={[styles.card, glass(palette, true)]}>
                <View style={styles.head}>
                  <View style={[styles.num, { borderColor: hues.gold }]}>
                    <Text allowFontScaling={false} style={{ color: hues.gold, fontSize: TYPE.title3, fontWeight: '600' }}>
                      {toDevanagari(c.chapter)}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.accent, fontSize: TYPE.caption, fontWeight: '700' }}>
                      {lang === 'hi' ? `${collection.unit.hi} ${c.chapter}` : `${collection.unit.en.toUpperCase()} ${c.chapter}`}
                    </Text>
                    <Text accessibilityRole="header" maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.title3, fontWeight: '700' }}>
                      {name}
                    </Text>
                    {other ? (
                      <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.footnote }}>
                        {other}
                      </Text>
                    ) : null}
                  </View>
                </View>
                <SummaryBody summary={c} />
                <KeyVerseList verses={c.keyVerses} sutras={collection.sutras} onPick={(v) => (offline ? open(c.chapter, v) : undefined)} />
                <EditorialNote reviewed={c.reviewed} />
                {offline ? (
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => open(c.chapter)}
                    style={({ pressed }) => [styles.read, accentFill(palette), pressed && { transform: [{ scale: 0.97 }] }]}>
                    <Ionicons name="book" size={16} color={palette.onAccent} />
                    <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.onAccent, fontSize: TYPE.subhead, fontWeight: '700' }}>
                      {t(S.summaryReadChapter(collection.unit))}
                    </Text>
                  </Pressable>
                ) : null}
              </View>
            );
          })}
        </ScrollView>
      </>
    </Backdrop>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACE.xl },
  card: { borderRadius: RADIUS.card, padding: SPACE.lg, rowGap: SPACE.md },
  head: { flexDirection: 'row', alignItems: 'center', columnGap: SPACE.md },
  num: { width: 44, height: 44, borderRadius: 22, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  read: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    columnGap: SPACE.sm,
    minHeight: TOUCH - 4,
    paddingHorizontal: SPACE.lg,
    borderRadius: RADIUS.pill,
  },
});
