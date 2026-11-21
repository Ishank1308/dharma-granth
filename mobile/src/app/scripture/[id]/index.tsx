import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Linking, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BookHero } from '@/components/art/book-hero';
import { DownloadCard } from '@/components/download-card';
import { accentFill, Backdrop, barSurface, GroupRow, IconTile, Muted } from '@/components/ui';
import { CATEGORIES, getEntry, webUrl } from '@/content/catalog';
import { useDownloads } from '@/content/downloads';
import { summaryCollection } from '@/content/study';
import { S, useI18n } from '@/i18n';
import { toDevanagari } from '@/lib/verse-format';
import { useScrollProgressStyle, useScrollY } from '@/motion/parallax';
import { PressableScale } from '@/motion/pressable-scale';
import { useAppState } from '@/state/app-state';
import { coverFor, monogram } from '@/theme/covers';
import { SANSKRIT_FONT } from '@/theme/fonts';
import { BAR_GAP, BAR_HEIGHT, barClearance, huesFor, RADIUS, SPACE, TYPE, UI_FONT_CAP } from '@/theme/themes';

export default function ScriptureScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { palette, lastRead, bookmarks } = useAppState();
  const { t } = useI18n();
  const entry = getEntry(String(id));
  const { installed } = useDownloads();
  // The header frosts over, and the book's name slides into it, once the title page has scrolled away.
  const { scrollY, onScroll } = useScrollY();
  const headerGlass = useScrollProgressStyle(scrollY, 260, 340);
  const headerTitle = useScrollProgressStyle(scrollY, 300, 360, 8);

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

  const open = (chapter: number) => {
    if (offline) {
      router.push({ pathname: '/scripture/[id]/[chapter]', params: { id: entry.id, chapter: String(chapter) } });
    } else {
      Linking.openURL(webUrl(entry.id, chapter)).catch(() => {});
    }
  };

  const last = entry.chapters.length - 1;
  // Every chapter's summary, where the website has them.
  const summaries = summaryCollection(entry.id);

  return (
    <Backdrop>
      <>
        {/* The page takes on the book's own colour, like a cover lighting the table it lies on, so moving from
            the library into a book feels like a change of place. */}
        {!palette.lite ? (
          <View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              { backgroundImage: `radial-gradient(120% 55% at 50% 0%, ${cover.colors[1]}${palette.dark ? '59' : '38'} 0%, transparent 70%)` },
            ]}
          />
        ) : null}
        {/* The header floats over the cover; the title is on the cover itself. */}
        <Stack.Screen
          options={{
            title: '',
            headerTransparent: true,
            headerStyle: { backgroundColor: 'transparent' },
            headerBackground: () => (
              <Animated.View
                style={[
                  StyleSheet.absoluteFill,
                  { backgroundColor: barSurface(palette), borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: palette.border },
                  headerGlass,
                ]}
              />
            ),
            headerTitle: () => (
              <Animated.Text numberOfLines={1} maxFontSizeMultiplier={1.3} style={[{ color: palette.text, fontSize: TYPE.body, fontWeight: '700' }, headerTitle]}>
                {entry.titleSanskrit ?? entry.title}
              </Animated.Text>
            ),
          }}
        />
        <Animated.FlatList
          style={{ backgroundColor: 'transparent' }}
          onScroll={onScroll}
          scrollEventThrottle={16}
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
              {/* The book's title page: its website cover colours and watercolour, a 3D book you can tilt, and the
                  same title-page line as on dharmagranth.dev. */}
              <BookHero
                cover={cover}
                category={entry.category}
                kind={cat ? t(cat) : undefined}
                title={entry.titleSanskrit ?? entry.title}
                englishTitle={entry.titleSanskrit ? entry.title : undefined}
                facts={t(S.titlePageFacts(entry.chapters.length, entry.totalVerses))}
                letter={monogram(entry.titleSanskrit ?? entry.title)}
                scrollY={scrollY}>
                <View style={styles.badges}>
                  <View style={styles.badge}>
                    <Ionicons name={offline ? 'checkmark' : 'cloud-download-outline'} size={14} color={cover.foil} />
                    <Text maxFontSizeMultiplier={UI_FONT_CAP} style={styles.badgeText}>
                      {t(offline ? S.onThisPhone : S.canDownload)}
                    </Text>
                  </View>
                  {saved > 0 ? (
                    <View style={styles.badge}>
                      <Ionicons name="bookmark-outline" size={14} color={cover.foil} />
                      <Text maxFontSizeMultiplier={UI_FONT_CAP} style={styles.badgeText}>
                        {t(S.savedCount(saved))}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </BookHero>
              {!entry.bundled ? <DownloadCard entry={entry} /> : null}
              {summaries ? (
                <GroupRow
                  first
                  last
                  inset={64}
                  accessibilityRole="link"
                  accessibilityLabel={`${t(summaries.heading)}. ${t(S.summaryAllSub)}`}
                  onPress={() => router.push({ pathname: '/summary/[id]', params: { id: entry.id } })}
                  style={{ marginBottom: 0 }}>
                  <IconTile icon="reader-outline" color={huesFor(palette).peacock} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: palette.text, fontSize: TYPE.body, fontWeight: '600' }}>{t(summaries.heading)}</Text>
                    <Text style={{ color: palette.muted, fontSize: TYPE.footnote, marginTop: 2 }}>{t(S.summaryAllSub)}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={palette.muted} />
                </GroupRow>
              ) : null}
            </View>
          }
          renderItem={({ item, index }) => {
            const current = resume?.number === item.number;
            return (
              <GroupRow
                first={index === 0}
                last={index === last}
                inset={64}
                highlight={current}
                accessibilityRole={offline ? 'button' : 'link'}
                accessibilityLabel={`${t(S.chapterA11y(item.number, item.title))}${current ? `, ${t(S.readingNowA11y)}` : ''}`}
                accessibilityHint={offline ? undefined : t(S.opensOnWebsite)}
                onPress={() => open(item.number)}>
                <Text style={[styles.num, { color: current ? palette.accent : palette.gold }]}>
                  {toDevanagari(item.number)}
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: palette.text, fontSize: TYPE.body, fontWeight: '600' }}>{item.titleSanskrit ?? item.title}</Text>
                  <Text style={{ color: current ? palette.accent : palette.muted, fontSize: TYPE.footnote, marginTop: 2 }}>
                    {current
                      ? t(S.readingNow)
                      : `${item.titleSanskrit ? item.title : t(S.chapterN(item.number))}${item.verseCount ? `, ${t(S.verseCount(item.verseCount))}` : ''}`}
                  </Text>
                </View>
                <Ionicons name={offline ? 'chevron-forward' : 'open-outline'} size={18} color={palette.muted} />
              </GroupRow>
            );
          }}
        />
        {resume && !palette.lite ? (
          // The list fades into the page behind the button, so rows never look cut off by it.
          <View
            pointerEvents="none"
            style={[styles.fade, { height: barClearance(insets.bottom) + SPACE.lg, backgroundImage: `linear-gradient(180deg, transparent 0%, ${palette.bg} 60%)` }]}
          />
        ) : null}
        {resume ? (
          // Continue where you left off, in the thumb zone.
          <PressableScale
            haptic
            accessibilityRole="button"
            accessibilityLabel={t(S.continueReadingA11y(entry.title, resume.number))}
            onPress={() => open(resume.number)}
            style={[styles.resume, accentFill(palette), { bottom: Math.max(insets.bottom, SPACE.sm) + BAR_GAP }]}>
            <Ionicons name="play" size={18} color={palette.onAccent} />
            <Text maxFontSizeMultiplier={1.4} style={{ color: palette.onAccent, fontSize: TYPE.body, fontWeight: '700' }}>
              {t(S.continueChapter(resume.number))}
            </Text>
          </PressableScale>
        ) : null}
      </>
    </Backdrop>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  // minWidth, not width: chapter numbers like १२० grow past 32 dp at large font sizes.
  // Chapter numerals in the shloka face, gilt, as a printed book numbers its chapters.
  num: { minWidth: 32, fontFamily: SANSKRIT_FONT, fontSize: TYPE.title3 + 1, lineHeight: (TYPE.title3 + 1) * 1.5, textAlign: 'center' },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACE.sm, marginTop: SPACE.lg, justifyContent: 'center' },
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
  fade: { position: 'absolute', left: 0, right: 0, bottom: 0 },
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
