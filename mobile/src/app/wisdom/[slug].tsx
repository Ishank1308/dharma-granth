import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { KSection, LabeledText, openEntry, Para, pick, VerseBlock } from '@/components/knowledge-ui';
import { Backdrop, Card, Muted } from '@/components/ui';
import { getEntry } from '@/content/catalog';
import { knowledge } from '@/content/knowledge';
import { S, useI18n } from '@/i18n';
import { useAppState } from '@/state/app-state';
import { barClearance, huesFor, quietFill, RADIUS, SPACE, TITLE_FONT_CAP, TOUCH, TYPE } from '@/theme/themes';

/**
 * One Wisdom for life topic, in the website's order: a compassionate opening, the verses (each whole, with
 * its setting and a link into the reader), the traditional context, practical reflections, related
 * concepts and texts, sources, and the care note that this is study, not treatment.
 */
export default function WisdomTopicScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const insets = useSafeAreaInsets();
  const { palette } = useAppState();
  const { t, lang } = useI18n();
  const hues = huesFor(palette);
  const items = knowledge('wisdom').items;
  const index = items.findIndex((x) => x.id === String(slug));
  const topic = items[index];

  if (!topic) {
    return (
      <Backdrop>
        <Stack.Screen options={{ title: t(S.notFoundTitle) }} />
        <Muted style={{ margin: SPACE.xl }}>{t(S.notFoundTitle)}</Muted>
      </Backdrop>
    );
  }

  const category = knowledge('wisdom').categories.find((c) => c.key === topic.category);
  const prev = items[index - 1];
  const next = items[index + 1];
  const p = (m: { en: string; hi: string }) => pick(m, lang);

  return (
    <Backdrop quiet>
      <Stack.Screen options={{ title: '', headerTransparent: true, headerStyle: { backgroundColor: 'transparent' } }} />
      <ScrollView
        style={{ backgroundColor: 'transparent' }}
        contentContainerStyle={{ paddingTop: insets.top + 56, paddingHorizontal: SPACE.lg, paddingBottom: barClearance(insets.bottom), rowGap: SPACE.lg }}>
        {/* Hero: the topic's own colour, as the website's gradient banner, kept as a tint so text stays legible. */}
        <View style={[styles.hero, { borderColor: `${topic.accent}55`, backgroundColor: `${topic.accent}${palette.dark ? '33' : '1a'}` }]}>
          {category ? (
            <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.caption, fontWeight: '700', letterSpacing: 0.4 }}>
              {t(category)}
            </Text>
          ) : null}
          <Text accessibilityRole="header" maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.largeTitle, fontWeight: '800', lineHeight: TYPE.largeTitle * 1.25 }}>
            {p(topic.title)}
          </Text>
          <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.subhead, opacity: 0.8 }}>
            {topic.sanskrit}
          </Text>
          <Para lang={lang}>{p(topic.short)}</Para>
          <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.caption }}>
            {`${t(S.wisdomVerseCount(topic.verses.length))} · ${t(S.wisdomMinutes(topic.minutes))}`}
          </Text>
        </View>

        <KSection title={t(S.wisdomIntro)} hue="lotus">
          <Para lang={lang} weight="600" size={TYPE.body}>
            {p(topic.intro.lead)}
          </Para>
          <Para lang={lang}>{p(topic.intro.body)}</Para>
          <View style={[styles.quote, { borderLeftColor: hues.lotus }]}>
            <Para lang={lang} italic>
              {p(topic.intro.foundation)}
            </Para>
          </View>
        </KSection>

        <KSection title={t(S.wisdomVerses)} hue="saffron">
          {topic.verses.map((v) => (
            <VerseBlock
              key={v.id}
              sanskrit={v.sanskrit}
              translit={v.translit}
              translation={p(v.meaning)}
              reference={p(v.ref)}
              target={{ id: v.scriptureId, chapter: v.chapter, verse: v.verse }}>
              {v.speaker ? (
                <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.caption, fontWeight: '600' }}>
                  {t(S.wisdomSpeaker(v.speaker, v.addressee))}
                </Text>
              ) : null}
              {p(v.setting) ? (
                <Para muted size={TYPE.footnote} lang={lang}>
                  {p(v.setting)}
                </Para>
              ) : null}
              {p(v.note) ? (
                <Para size={TYPE.subhead} lang={lang}>
                  {p(v.note)}
                </Para>
              ) : null}
            </VerseBlock>
          ))}
        </KSection>

        <KSection title={t(S.wisdomContext)} hue="indigo">
          <Para weight="700" lang={lang}>
            {p(topic.context.title)}
          </Para>
          <Para lang={lang}>{p(topic.context.body)}</Para>
        </KSection>

        {topic.reflections.length ? (
          <KSection title={t(S.wisdomReflection)} hue="tulsi">
            {topic.reflections.map((r, i) => (
              <View key={i} style={[styles.well, { backgroundColor: quietFill(palette) }]}>
                <Para weight="700" size={TYPE.body} lang={lang}>
                  {p(r.title)}
                </Para>
                <LabeledText label={t(S.wisdomInsight)} text={p(r.insight)} hue="tulsi" lang={lang} />
                <LabeledText label={t(S.wisdomContemplate)} text={p(r.prompt)} hue="indigo" lang={lang} />
                <LabeledText label={t(S.wisdomPractice)} text={p(r.practice)} hue="saffron" lang={lang} />
              </View>
            ))}
          </KSection>
        ) : null}

        {topic.concepts.length ? (
          <KSection title={t(S.wisdomConcepts)} hue="saffron">
            {topic.concepts.map((c, i) => {
              const body = (
                <>
                  <View style={{ flex: 1, rowGap: 2 }}>
                    <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.body, fontWeight: '600' }}>
                      {`${c.sanskrit}  ·  ${p(c.label)}`}
                    </Text>
                    <Para muted size={TYPE.footnote} lang={lang}>
                      {p(c.description)}
                    </Para>
                  </View>
                  {c.id ? <Ionicons name="chevron-forward" size={18} color={palette.muted} /> : null}
                </>
              );
              return c.id ? (
                <Pressable
                  key={i}
                  accessibilityRole="link"
                  accessibilityLabel={t(S.kOpenEntryA11y(p(c.label)))}
                  onPress={() => openEntry('concepts', c.id as string)}
                  style={({ pressed }) => [styles.linkRow, { opacity: pressed ? 0.7 : 1 }]}>
                  {body}
                </Pressable>
              ) : (
                <View key={i} style={styles.linkRow}>
                  {body}
                </View>
              );
            })}
          </KSection>
        ) : null}

        {topic.scriptures.some((s) => getEntry(s.id)) ? (
          <KSection title={t(S.wisdomScriptures)} hue="peacock">
            {topic.scriptures
              .filter((s) => getEntry(s.id))
              .map((s) => (
                <Pressable
                  key={s.id}
                  accessibilityRole="link"
                  accessibilityLabel={p(s.title)}
                  onPress={() => router.push({ pathname: '/scripture/[id]', params: { id: s.id } })}
                  style={({ pressed }) => [styles.linkRow, { opacity: pressed ? 0.7 : 1 }]}>
                  <Ionicons name="book-outline" size={18} color={hues.peacock} />
                  <View style={{ flex: 1 }}>
                    <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.body, fontWeight: '600' }}>
                      {s.sanskrit || p(s.title)}
                    </Text>
                    <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.footnote }}>
                      {p(s.title)}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={palette.muted} />
                </Pressable>
              ))}
          </KSection>
        ) : null}

        {topic.sources.length ? (
          <KSection title={t(S.kSources)} hue="gold">
            {topic.sources.map((s, i) => (
              <Para key={i} muted size={TYPE.footnote}>
                {`${i + 1}. ${s}`}
              </Para>
            ))}
          </KSection>
        ) : null}

        {/* The care note, always shown: these pages are study, not a substitute for help. */}
        <Card style={{ rowGap: SPACE.sm, borderColor: `${hues.vermilion}55` }}>
          <View style={styles.inline}>
            <Ionicons name="heart-circle-outline" size={20} color={hues.vermilion} />
            <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ flex: 1, color: palette.text, fontSize: TYPE.body, fontWeight: '700' }}>
              {p(topic.care.headline)}
            </Text>
          </View>
          <Para lang={lang} size={TYPE.subhead}>
            {p(topic.care.body)}
          </Para>
          <Para lang={lang} muted size={TYPE.footnote}>
            {p(topic.care.disclaimer)}
          </Para>
        </Card>

        <View style={styles.pager}>
          {prev ? <PagerButton label={t(S.wisdomPrev)} title={p(prev.title)} icon="chevron-back" onPress={() => router.replace({ pathname: '/wisdom/[slug]', params: { slug: prev.id } })} /> : <View style={{ flex: 1 }} />}
          {next ? <PagerButton label={t(S.wisdomNext)} title={p(next.title)} icon="chevron-forward" end onPress={() => router.replace({ pathname: '/wisdom/[slug]', params: { slug: next.id } })} /> : <View style={{ flex: 1 }} />}
        </View>
      </ScrollView>
    </Backdrop>
  );
}

function PagerButton({
  label,
  title,
  icon,
  end,
  onPress,
}: {
  label: string;
  title: string;
  icon: 'chevron-back' | 'chevron-forward';
  end?: boolean;
  onPress: () => void;
}) {
  const { palette } = useAppState();
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={`${label}: ${title}`}
      onPress={onPress}
      style={({ pressed }) => [styles.pagerButton, { backgroundColor: quietFill(palette), opacity: pressed ? 0.7 : 1 }, end && { justifyContent: 'flex-end' }]}>
      {!end ? <Ionicons name={icon} size={18} color={palette.accent} /> : null}
      <View style={{ flexShrink: 1, alignItems: end ? 'flex-end' : 'flex-start' }}>
        <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.caption }}>
          {label}
        </Text>
        <Text maxFontSizeMultiplier={TITLE_FONT_CAP} numberOfLines={2} style={{ color: palette.text, fontSize: TYPE.subhead, fontWeight: '600', textAlign: end ? 'right' : 'left' }}>
          {title}
        </Text>
      </View>
      {end ? <Ionicons name={icon} size={18} color={palette.accent} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hero: { borderWidth: 1, borderRadius: RADIUS.panel, padding: SPACE.xl, rowGap: SPACE.sm },
  quote: { borderLeftWidth: 3, paddingLeft: SPACE.md },
  well: { borderRadius: RADIUS.control, padding: SPACE.md, rowGap: SPACE.sm },
  linkRow: { flexDirection: 'row', alignItems: 'center', columnGap: SPACE.md, minHeight: TOUCH },
  inline: { flexDirection: 'row', alignItems: 'center', columnGap: SPACE.sm },
  pager: { flexDirection: 'row', columnGap: SPACE.md },
  pagerButton: { flex: 1, flexDirection: 'row', alignItems: 'center', columnGap: SPACE.sm, minHeight: TOUCH + 12, borderRadius: RADIUS.row, padding: SPACE.md },
});
