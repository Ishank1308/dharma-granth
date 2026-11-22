import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack } from 'expo-router';
import { Linking, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { KSection, Label, LangNote, Para } from '@/components/knowledge-ui';
import { Backdrop, GroupCard, GroupRow, IconTile, LargeHeader } from '@/components/ui';
import { CATALOG, SITE } from '@/content/catalog';
import { SOURCES, type SourceEdition } from '@/content/compare';
import { D, useI18n, type Msg } from '@/i18n';
import { usePrefs } from '@/state/app-state';
import { huesFor, SPACE, TITLE_FONT_CAP, TYPE, type Hues } from '@/theme/themes';

export { ErrorBoundary } from '@/components/error-boundary';

/** The website's /methodology, in short: each statement kept true to it. */
const METHOD: { title: Msg; body: Msg; hue: keyof Hues }[] = [
  { title: D.mSourcesTitle, body: D.mSources, hue: 'saffron' },
  { title: D.mTranslationsTitle, body: D.mTranslations, hue: 'peacock' },
  { title: D.mExplainTitle, body: D.mExplain, hue: 'indigo' },
  { title: D.mAiTitle, body: D.mAi, hue: 'lotus' },
  { title: D.mReviewTitle, body: D.mReview, hue: 'gold' },
  { title: D.mArtTitle, body: D.mArt, hue: 'saffron' },
  { title: D.mRightsTitle, body: D.mRights, hue: 'tulsi' },
];

const FIELDS: { key: keyof SourceEdition; label: Msg }[] = [
  { key: 'sanskritEdition', label: D.srcEdition },
  { key: 'publisherArchive', label: D.srcPublisher },
  { key: 'primaryTranslator', label: D.srcTranslator },
  { key: 'traditionalCommentaryAuthor', label: D.srcCommentary },
  { key: 'numberingSystemNote', label: D.srcNumbering },
];

/**
 * About, methodology and sources, after the website's /methodology and /sources: where the texts come from,
 * what is machine-assisted, what has not been reviewed, and the edition behind each text in the app.
 * Opened from Settings → About.
 */
export default function AboutScreen() {
  const insets = useSafeAreaInsets();
  const { palette } = usePrefs();
  const { t, lang } = useI18n();
  const hues = huesFor(palette);
  const books = CATALOG.filter((b) => SOURCES[b.id]);

  const link = (label: string, url: string, icon: keyof typeof Ionicons.glyphMap, color: string, first: boolean) => (
    <GroupRow standalone={first} inset={60} accessibilityRole="link" onPress={() => Linking.openURL(url).catch(() => {})}>
      <IconTile icon={icon} color={color} />
      <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ flex: 1, color: palette.text, fontSize: TYPE.body }}>
        {label}
      </Text>
      <Ionicons name="open-outline" size={18} color={palette.muted} />
    </GroupRow>
  );

  return (
    <Backdrop>
      <Stack.Screen options={{ title: '', headerTransparent: true, headerStyle: { backgroundColor: 'transparent' } }} />
      <ScrollView
        style={{ backgroundColor: 'transparent' }}
        contentContainerStyle={{ paddingTop: insets.top + 24, paddingHorizontal: SPACE.lg, paddingBottom: insets.bottom + SPACE.xxl * 2, rowGap: SPACE.md }}>
        <LargeHeader title={D.aboutTitle} eyebrow={D.aboutEyebrow} />
        <Para>{t(D.aboutIntro)}</Para>

        <KSection title={t(D.aboutPrivacyTitle)} hue="tulsi">
          <Para>{t(D.aboutPrivacy)}</Para>
        </KSection>

        {METHOD.map((m) => (
          <KSection key={m.title.en} title={t(m.title)} hue={m.hue}>
            <Para>{t(m.body)}</Para>
          </KSection>
        ))}

        <GroupCard>
          {link(t(D.fullMethodology), `${SITE}/methodology/`, 'reader', hues.indigo, true)}
          {link(t(D.fullSources), `${SITE}/sources/`, 'library', hues.saffron, false)}
        </GroupCard>

        <View style={{ marginTop: SPACE.md, rowGap: SPACE.xs }}>
          <Text accessibilityRole="header" maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.title2, fontWeight: '800' }}>
            {t(D.sourcesTitle)}
          </Text>
          <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.subhead }}>
            {t(D.sourcesSub(books.length))}
          </Text>
        </View>
        <LangNote content="en" />
        {books.map((b) => {
          const s = SOURCES[b.id];
          return (
            <KSection key={b.id} title={(lang === 'hi' && b.titleSanskrit) || b.title} hue="gold">
              {FIELDS.filter((f) => s[f.key]).map((f) => (
                <View key={f.key} style={{ rowGap: 2 }}>
                  <Label hue="gold">{t(f.label).toUpperCase()}</Label>
                  <Para size={TYPE.subhead} lang="en">
                    {s[f.key]}
                  </Para>
                </View>
              ))}
            </KSection>
          );
        })}
      </ScrollView>
    </Backdrop>
  );
}
