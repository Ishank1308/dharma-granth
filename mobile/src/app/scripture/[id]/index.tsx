import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { FlatList, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DownloadCard } from '@/components/download-card';
import { accentFill, Backdrop, coverFill, GroupRow, Muted } from '@/components/ui';
import { CATEGORIES, getEntry, webUrl } from '@/content/catalog';
import { useDownloads } from '@/content/downloads';
import { S, useI18n } from '@/i18n';
import { bookReadCount, chapterReadCount, percentRead } from '@/lib/progress';
import { toDevanagari } from '@/lib/verse-format';
import { useAppState } from '@/state/app-state';
import { coverFor } from '@/theme/covers';
import { BAR_GAP, BAR_HEIGHT, barClearance, RADIUS, SPACE, TITLE_FONT_CAP, TYPE } from '@/theme/themes';

export default function ScriptureScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { palette, lastRead, bookmarks, progress } = useAppState();
  const { t } = useI18n();
  const entry = getEntry(String(id));
  const { installed } = useDownloads();

  if (!entry) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: t(S.notFoundTitle) }} />
        <Muted>{t(S.scriptureNotFound)}</Muted>
      </View>
    );
  }

  const cat = CATEGORIES.find((c) => c.key === entry.category);
  const cover = coverFor(entry.id, entry.category);

  // Bundled books and downloaded books open in the app; the rest open on the website until downloaded.
  const offline = entry.bundled || Boolean(installed[entry.id]);
  const resume = offline && lastRead?.id === entry.id ? entry.chapters.find((c) => c.number === lastRead.chapter) : undefined;
  const saved = bookmarks.filter((b) => b.id === entry.id).length;
  const bookPct = percentRead(bookReadCount(progress, entry.id, entry.chapters), entry.totalVerses);

  const open = (chapter: number, verse?: string) => {
    if (offline) {
      router.push({
        pathname: '/scripture/[id]/[chapter]',
        params: verse ? { id: entry.id, chapter: String(chapter), verse } : { id: entry.id, chapter: String(chapter) },
      });
    } else {
      Linking.openURL(webUrl(entry.id, chapter)).catch(() => {});
    }
  };

  const last = entry.chapters.length - 1;

  return (
    <Backdrop>
      <>
        {/* The header floats over the cover; the title is on the cover itself. */}
        <Stack.Screen options={{ title: '', headerTransparent: true, headerStyle: { backgroundColor: 'transparent' } }} />
        <FlatList
          style={{ backgroundColor: 'transparent' }}
          contentContainerStyle={{
            paddingTop: insets.top + 56,
            paddingHorizontal: SPACE.lg,
            paddingBottom: resume ? barClearance(insets.bottom) : SPACE.xxl * 2,
          }}
          data={entry.chapters}
          keyExtractor={(c) => String(c.number)}
          initialNumToRender={30}
          ListHeaderComponent={
            <View style={{ marginBottom: SPACE.lg, rowGap: SPACE.md }}>
              {/* The book's cover, in the same colours and with the same title-page line as on the website. */}
              {/* Deep to mid only behind the text, so the white title and line stay readable on every cover; the light
                  colour glows in the corner. */}
              <View style={[styles.cover, coverFill(cover, palette, true), !palette.lite && styles.coverLift]}>
                {!palette.lite ? (
                  <View
                    pointerEvents="none"
                    style={[StyleSheet.absoluteFill, { backgroundImage: `radial-gradient(60% 55% at 100% 0%, ${cover.colors[2]} 0%, transparent 70%)`, opacity: 0.55 }]}
                  />
                ) : null}
                <View pointerEvents="none" style={[styles.ring, { borderColor: cover.foil, opacity: 0.35, width: 170, height: 170, right: -40, top: -40 }]} />
                <View pointerEvents="none" style={[styles.ring, { borderColor: cover.foil, opacity: 0.22, width: 116, height: 116, right: -12, top: -12 }]} />
                {cat ? (
                  <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={[styles.coverEyebrow, { color: cover.foil }]}>
                    {t(cat)}
                  </Text>
                ) : null}
                <Text accessibilityRole="header" maxFontSizeMultiplier={TITLE_FONT_CAP} style={styles.coverTitle}>
                  {entry.titleSanskrit ?? entry.title}
                </Text>
                <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={styles.coverSub}>
                  {entry.title} · {t(S.chaptersVerses(entry.chapters.length, entry.totalVerses))}
                </Text>
                {cover.epigraph ? (
                  <View style={{ marginTop: SPACE.md }}>
                    <View style={[styles.foilRule, { backgroundColor: cover.foil }]} />
                    <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: cover.foil, fontSize: TYPE.callout + 1, lineHeight: (TYPE.callout + 1) * 1.6, marginTop: SPACE.sm }}>
                      {cover.epigraph.sa}
                    </Text>
                    <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: 'rgba(255,255,255,0.72)', fontSize: TYPE.caption }}>
                      {cover.epigraph.source}
                    </Text>
                  </View>
                ) : null}
                <View style={styles.badges}>
                  <View style={styles.badge}>
                    <Ionicons name={offline ? 'checkmark' : 'cloud-download-outline'} size={14} color={cover.foil} />
                    <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={styles.badgeText}>
                      {t(offline ? S.onThisPhone : S.canDownload)}
                    </Text>
                  </View>
                  {bookPct > 0 ? (
                    <View style={styles.badge}>
                      <Ionicons name={bookPct === 100 ? 'checkmark-done' : 'book-outline'} size={14} color={cover.foil} />
                      <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={styles.badgeText}>
                        {t(bookPct === 100 ? S.bookFinished : S.percentRead(bookPct))}
                      </Text>
                    </View>
                  ) : null}
                  {saved > 0 ? (
                    <View style={styles.badge}>
                      <Ionicons name="bookmark-outline" size={14} color={cover.foil} />
                      <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={styles.badgeText}>
                        {t(S.savedCount(saved))}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>
              {!entry.bundled ? <DownloadCard entry={entry} /> : null}
            </View>
          }
          renderItem={({ item, index }) => {
            const current = resume?.number === item.number;
            const read = chapterReadCount(progress, entry.id, item.number, item.verseCount);
            const done = item.verseCount > 0 && read >= item.verseCount;
            const readText = done ? t(S.chapterRead) : read > 0 && item.verseCount > 0 ? t(S.chapterReadOf(read, item.verseCount)) : '';
            return (
              <GroupRow
                first={index === 0}
                last={index === last}
                inset={64}
                highlight={current}
                accessibilityRole={offline ? 'button' : 'link'}
                accessibilityLabel={`${t(S.chapterA11y(item.number, item.title))}${current ? `, ${t(S.readingNow)}` : ''}${readText ? `, ${readText}` : ''}`}
                onPress={() => open(item.number)}>
                <Text style={[styles.num, { color: current ? palette.accent : palette.gold, fontWeight: current ? '800' : '600' }]}>
                  {toDevanagari(item.number)}
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: palette.text, fontSize: TYPE.body, fontWeight: '600' }}>{item.titleSanskrit ?? item.title}</Text>
                  <Text style={{ color: current ? palette.accent : palette.muted, fontSize: TYPE.footnote, marginTop: 2 }}>
                    {current
                      ? `${t(S.readingNow)}${readText && !done ? ` · ${readText}` : ''}`
                      : readText && !done
                        ? `${item.titleSanskrit ? item.title : t(S.chapterN(item.number))} · ${readText}`
                        : `${item.titleSanskrit ? item.title : t(S.chapterN(item.number))}${item.verseCount ? ` · ${t(S.verseCount(item.verseCount))}` : ''}`}
                  </Text>
                </View>
                {done ? <Ionicons name="checkmark-circle" size={20} color={palette.accent} /> : null}
                <Ionicons name={offline ? 'chevron-forward' : 'open-outline'} size={18} color={palette.muted} />
              </GroupRow>
            );
          }}
        />
        {resume ? (
          // Continue where you left off, in the thumb zone.
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t(S.continueReadingA11y(entry.title, resume.number))}
            // Lands on the verse the reader left at, as the Library's Continue card does.
            onPress={() => open(resume.number, lastRead?.verse)}
            style={({ pressed }) => [
              styles.resume,
              accentFill(palette),
              { bottom: Math.max(insets.bottom, SPACE.sm) + BAR_GAP },
              pressed && { transform: [{ scale: 0.97 }] },
            ]}>
            <Ionicons name="play" size={18} color={palette.onAccent} />
            <Text maxFontSizeMultiplier={1.4} style={{ color: palette.onAccent, fontSize: TYPE.body, fontWeight: '700' }}>
              {t(S.continueChapter(resume.number))}
            </Text>
          </Pressable>
        ) : null}
      </>
    </Backdrop>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  // minWidth, not width: chapter numbers like १२० grow past 32 dp at large font sizes.
  num: { minWidth: 32, fontSize: TYPE.title3 + 1, textAlign: 'center' },
  cover: { borderRadius: RADIUS.panel, padding: SPACE.xl - 2, overflow: 'hidden' },
  coverLift: { boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.28), 0 14px 34px rgba(10,20,50,0.30)' },
  ring: { position: 'absolute', borderWidth: 1, borderRadius: 999 },
  coverEyebrow: { fontSize: TYPE.caption, fontWeight: '700', letterSpacing: 0.6, textTransform: 'uppercase' },
  coverTitle: { color: '#ffffff', fontSize: 32, lineHeight: 48, fontWeight: '600', marginTop: SPACE.sm },
  coverSub: { color: 'rgba(255,255,255,0.84)', fontSize: TYPE.subhead },
  foilRule: { height: 1, width: '70%', opacity: 0.6 },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACE.sm, marginTop: SPACE.lg },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 6,
    minHeight: 30,
    paddingHorizontal: SPACE.md,
    borderRadius: RADIUS.pill,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  badgeText: { color: '#ffffff', fontSize: TYPE.footnote, fontWeight: '500' },
  resume: {
    position: 'absolute',
    left: SPACE.lg,
    right: SPACE.lg,
    height: BAR_HEIGHT - 4,
    borderRadius: RADIUS.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: SPACE.sm,
  },
});
