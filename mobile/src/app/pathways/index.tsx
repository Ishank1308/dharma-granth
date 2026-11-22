import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Mandala } from '@/components/art/mandala';
import { BentoRow, BentoTile } from '@/components/bento';
import { Para, pick } from '@/components/knowledge-ui';
import { openPathway, pathwayHue } from '@/components/pathway-ui';
import { Backdrop, Card, Chip, GroupTitle, LargeHeader, Muted } from '@/components/ui';
import { knowledge, type PathwayStarter, type WisdomPathway } from '@/content/knowledge';
import { S, useI18n } from '@/i18n';
import { useScrollY } from '@/motion/parallax';
import { TitleBar } from '@/motion/title-bar';
import { useMotion } from '@/motion/use-motion';
import { usePrefs } from '@/state/app-state';
import { SANSKRIT_FONT } from '@/theme/fonts';
import { barClearance, huesFor, SPACE, TITLE_FONT_CAP, TYPE, UI_FONT_CAP } from '@/theme/themes';

export { ErrorBoundary } from '@/components/error-boundary';

/**
 * Wisdom pathways, after dharmagranth.dev/wisdom-pathways/: begin from a real human question and walk to the
 * verses that answer it, with the masters who carried the teaching and a quiet pause at the end. Three ways in,
 * as on the website: the complete pathways, the life-question starters, and six discovery doors (emotion,
 * challenge, question, scripture, saint, concept).
 */
export default function PathwaysIndex() {
  const insets = useSafeAreaInsets();
  const { t, lang } = useI18n();
  const { palette } = usePrefs();
  const { scrollY, onScroll } = useScrollY();
  const data = knowledge('pathways');
  const rows: WisdomPathway[][] = [];
  for (let i = 0; i < data.items.length; i += 2) rows.push(data.items.slice(i, i + 2));

  return (
    <Backdrop>
      <Stack.Screen options={{ title: '', headerTransparent: true, headerStyle: { backgroundColor: 'transparent' } }} />
      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={{ backgroundColor: 'transparent' }}
        contentContainerStyle={{ paddingTop: insets.top + 24, paddingHorizontal: SPACE.lg, paddingBottom: barClearance(insets.bottom), rowGap: SPACE.md }}>
        <LargeHeader title={S.pathwaysTitle} eyebrow={S.pathwaysEyebrow} scrollY={scrollY} />
        <Para lang={lang} muted>
          {t(S.pathwaysLead)}
        </Para>

        <GroupTitle title={t(S.pathwaysComplete)} detail={String(data.items.length)} />
        {/* Asymmetric pairs: the wider tile swaps sides row by row. */}
        {rows.map((row, r) => (
          <BentoRow key={r}>
            {row.map((p, i) => (
              <PathwayTile key={p.id} p={p} flex={row.length === 1 ? 1 : (r + i) % 2 === 0 ? 1.3 : 1} />
            ))}
          </BentoRow>
        ))}

        <GroupTitle title={t(S.pathwaysStarters)} detail={String(data.starters.length)} />
        {data.starters.map((s) => (
          <StarterTile key={s.id} s={s} />
        ))}

        <GroupTitle title={t(S.pathwaysDiscovery)} />
        <Muted>{t(S.pathwaysDiscoveryNote)}</Muted>
        {data.discovery.map((g) => (
          <Card key={g.key} style={{ rowGap: SPACE.md }}>
            <Text accessibilityRole="header" maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.callout, fontWeight: '700' }}>
              {pick(g.label, lang)}
            </Text>
            <View style={styles.chips}>
              {g.entries.slice(0, 12).map((e) => (
                <Chip key={`${g.key}-${e.label.en}`} label={pick(e.label, lang)} onPress={() => openPathway(e.pathway)} />
              ))}
            </View>
          </Card>
        ))}
      </Animated.ScrollView>
      <TitleBar scrollY={scrollY} title={S.pathwaysTitle} />
    </Backdrop>
  );
}

/** A pathway as a bento tile: its question, its title, its Sanskrit line, and how long the walk is. */
function PathwayTile({ p, flex }: { p: WisdomPathway; flex: number }) {
  const { palette } = usePrefs();
  const { t, lang } = useI18n();
  const { rich } = useMotion();
  const color = huesFor(palette)[pathwayHue(p.id)];
  const title = pick(p.title, lang);
  return (
    <BentoTile
      flex={flex}
      minHeight={190}
      accessibilityLabel={`${t(S.pathwayOpenA11y(title))}. ${pick(p.question, lang)}`}
      onPress={() => openPathway(p.id)}
      glow={`${color}33`}
      style={{ rowGap: SPACE.xs, justifyContent: 'space-between' }}>
      <Mandala size={110} color={color} opacity={0.16} spin={false} style={styles.cornerMandala} />
      <View style={{ rowGap: SPACE.xs }}>
        <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color, fontSize: TYPE.caption, fontWeight: '700' }}>
          {pick(p.question, lang)}
        </Text>
        <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.callout, fontWeight: '800', lineHeight: TYPE.callout * 1.35 }}>
          {title}
        </Text>
        {p.sanskrit ? (
          <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.textSecondary, fontFamily: SANSKRIT_FONT, fontSize: TYPE.subhead, lineHeight: TYPE.subhead * 1.6 }}>
            {p.sanskrit}
          </Text>
        ) : null}
      </View>
      <View style={styles.meta}>
        <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ flex: 1, color: palette.muted, fontSize: TYPE.caption }}>
          {t(S.pathwayMeta(p.lenses.length, p.lineage.length, p.minutes))}
        </Text>
        <Ionicons name="arrow-forward" size={16} color={color} style={{ opacity: rich ? 1 : 0.9 }} />
      </View>
    </BentoTile>
  );
}

/**
 * A life-question starter. With a pathway it opens that pathway as a journey in stages; without one yet it
 * offers the Wisdom for life topics that already answer the question, as the website does.
 */
function StarterTile({ s }: { s: PathwayStarter }) {
  const { palette } = usePrefs();
  const { t, lang } = useI18n();
  const hues = huesFor(palette);
  const color = s.pathway ? hues[pathwayHue(s.pathway)] : hues.lotus;
  const topics = knowledge('wisdom').items;
  const title = pick(s.title, lang);
  const body = (
    <>
      <View style={[styles.stripe, { backgroundColor: color }]} />
      <View style={{ flex: 1, rowGap: SPACE.xs, padding: SPACE.lg, paddingLeft: SPACE.lg + 2 }}>
        <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color, fontSize: TYPE.caption, fontWeight: '700' }}>
          {pick(s.question, lang)}
        </Text>
        <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.body, fontWeight: '800' }}>
          {title}
        </Text>
        <Para lang={lang} muted size={TYPE.subhead}>
          {pick(s.intro, lang)}
        </Para>
        {s.pathway ? (
          <View style={styles.walk}>
            <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.accent, fontSize: TYPE.subhead, fontWeight: '700' }}>
              {`${t(S.pathwayWalk)} · ${t(S.pathwayStages(s.stages.length))}`}
            </Text>
            <Ionicons name="arrow-forward" size={16} color={palette.accent} />
          </View>
        ) : (
          <View style={{ rowGap: SPACE.sm, marginTop: SPACE.xs }}>
            <Muted>{t(S.pathwayBeginTopics)}</Muted>
            <View style={styles.chips}>
              {s.topics.map((id) => {
                const topic = topics.find((x) => x.id === id);
                return topic ? <Chip key={id} label={pick(topic.title, lang)} onPress={() => router.push({ pathname: '/wisdom/[slug]', params: { slug: id } })} /> : null;
              })}
            </View>
          </View>
        )}
      </View>
    </>
  );
  return s.pathway ? (
    <BentoTile
      depth={null}
      padding={0}
      accessibilityLabel={`${title}. ${pick(s.question, lang)}. ${t(S.pathwayWalk)}`}
      onPress={() => openPathway(s.pathway as string, s.id)}
      glow={`${color}26`}
      style={{ flexDirection: 'row' }}>
      {body}
    </BentoTile>
  ) : (
    <BentoTile depth={null} padding={0} glow={`${color}1f`} style={{ flexDirection: 'row' }}>
      {body}
    </BentoTile>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACE.sm },
  cornerMandala: { position: 'absolute', right: -34, top: -34 },
  meta: { flexDirection: 'row', alignItems: 'center', columnGap: SPACE.sm, marginTop: SPACE.sm },
  stripe: { width: 4 },
  walk: { flexDirection: 'row', alignItems: 'center', columnGap: 6, marginTop: SPACE.sm, minHeight: 32 },
});
