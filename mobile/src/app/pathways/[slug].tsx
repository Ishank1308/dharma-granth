import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Mandala } from '@/components/art/mandala';
import { BentoTile } from '@/components/bento';
import { KSection, Label, LabeledText, openEntry, Para, pick, VerseBlock } from '@/components/knowledge-ui';
import { BreathingCircle, openPathway, pathwayHue } from '@/components/pathway-ui';
import { Backdrop, Card, Chip, Muted } from '@/components/ui';
import { knowledge, type PathwayStarter, type WisdomPathway } from '@/content/knowledge';
import { S, useI18n } from '@/i18n';
import { KineticText } from '@/motion/kinetic';
import { useMotion } from '@/motion/use-motion';
import { usePrefs } from '@/state/app-state';
import { SANSKRIT_FONT } from '@/theme/fonts';
import { barClearance, huesFor, quietFill, RADIUS, SPACE, TITLE_FONT_CAP, TOUCH, TYPE, UI_FONT_CAP } from '@/theme/themes';

export { ErrorBoundary } from '@/components/error-boundary';

/**
 * One wisdom pathway, in the website's calm order: the question and introduction, why people face this and its
 * scriptural foundations, each verse whole with Arth, Vyakhya and modern context, the lineage of masters, a
 * pause to reflect, and related pathways. Opened from a life-question starter, it first lays out that
 * starter's journey in stages.
 */
export default function PathwayScreen() {
  const { slug, starter: starterId } = useLocalSearchParams<{ slug: string; starter?: string }>();
  const insets = useSafeAreaInsets();
  const { palette } = usePrefs();
  const { t, lang } = useI18n();
  const { rich } = useMotion();
  const data = knowledge('pathways');
  const p = data.items.find((x) => x.id === String(slug));
  const starter = starterId ? data.starters.find((s) => s.id === String(starterId) && s.pathway === String(slug)) : undefined;

  if (!p) {
    return (
      <Backdrop>
        <Stack.Screen options={{ title: t(S.notFoundTitle) }} />
        <Muted style={{ margin: SPACE.xl }}>{t(S.notFoundTitle)}</Muted>
      </Backdrop>
    );
  }

  const hues = huesFor(palette);
  const color = hues[pathwayHue(p.id)];
  const m = (x: { en: string; hi: string }) => pick(x, lang);
  const topics = knowledge('wisdom').items;
  const concepts = knowledge('concepts').items;

  return (
    <Backdrop quiet>
      <Stack.Screen options={{ title: '', headerTransparent: true, headerStyle: { backgroundColor: 'transparent' } }} />
      <ScrollView
        style={{ backgroundColor: 'transparent' }}
        contentContainerStyle={{ paddingTop: insets.top + 56, paddingHorizontal: SPACE.lg, paddingBottom: barClearance(insets.bottom), rowGap: SPACE.lg }}>
        {/* Hero: the pathway's hue as a soft wash, a gold mandala turning slowly behind the Sanskrit line. */}
        <View style={[styles.hero, { borderColor: `${color}55`, backgroundColor: `${color}${palette.dark ? '2b' : '14'}` }]}>
          <Mandala size={220} color={hues.gold} opacity={palette.dark ? 0.22 : 0.18} spin={rich} style={styles.heroMandala} />
          <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color, fontSize: TYPE.footnote, fontWeight: '700' }}>
            {m(p.question)}
          </Text>
          <KineticText
            header
            delay={60}
            segments={[{ text: m(p.title) }]}
            maxFontSizeMultiplier={TITLE_FONT_CAP}
            style={{ color: palette.text, fontSize: TYPE.title1, fontWeight: '800', lineHeight: TYPE.title1 * 1.25 }}
          />
          {p.sanskrit ? (
            <Text
              accessibilityLanguage="sa"
              maxFontSizeMultiplier={TITLE_FONT_CAP}
              style={{ color: hues.gold, fontFamily: SANSKRIT_FONT, fontSize: TYPE.title3, lineHeight: TYPE.title3 * 1.6 }}>
              {`॥ ${p.sanskrit} ॥`}
            </Text>
          ) : null}
          {lang === 'en' ? <Para muted size={TYPE.subhead}>{p.masters}</Para> : null}
          <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.caption }}>
            {t(S.pathwayMeta(p.lenses.length, p.lineage.length, p.minutes))}
          </Text>
        </View>

        {starter ? <Journey starter={starter} p={p} color={color} /> : null}

        <KSection title={t(S.pathwayIntro)} hue="lotus">
          <Para lang={lang} size={TYPE.body}>
            {m(p.intro)}
          </Para>
        </KSection>

        <KSection title={t(S.pathwayWhy)} hue="vermilion">
          <Para lang={lang}>{m(p.why)}</Para>
        </KSection>
        <KSection title={t(S.pathwayFoundations)} hue="indigo">
          <Para lang={lang}>{m(p.foundations)}</Para>
        </KSection>

        <KSection title={t(S.pathwayVerses)} hue="saffron">
          {p.lenses.map((l, i) => {
            const topic = topics.find((x) => x.id === l.topic);
            return (
              <View key={i} style={{ rowGap: SPACE.md }}>
                <VerseBlock
                  sanskrit={l.verse.sanskrit}
                  translit={l.verse.translit}
                  translation={m(l.verse.meaning)}
                  reference={m(l.verse.ref)}
                  hue="gold"
                  target={{ id: l.verse.scriptureId, chapter: l.verse.chapter, verse: l.verse.verse }}
                />
                <View style={[styles.well, { backgroundColor: quietFill(palette) }]}>
                  <LabeledText label={t(S.pathwayArth)} text={m(l.arth)} hue="saffron" lang={lang} />
                  <LabeledText label={t(S.pathwayVyakhya)} text={m(l.vyakhya)} hue="indigo" lang={lang} />
                  <LabeledText label={t(S.pathwayModern)} text={m(l.modern)} hue="tulsi" lang={lang} />
                </View>
                {l.lineage.length ? (
                  <View style={styles.chips}>
                    {l.lineage.map((id) =>
                      data.masters[id] ? (
                        <View key={id} style={[styles.tag, { borderColor: `${hues.gold}66` }]}>
                          <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.caption, fontWeight: '600' }}>
                            {m(data.masters[id].name)}
                          </Text>
                        </View>
                      ) : null,
                    )}
                  </View>
                ) : null}
                {topic ? (
                  <Pressable
                    accessibilityRole="link"
                    onPress={() => router.push({ pathname: '/wisdom/[slug]', params: { slug: topic.id } })}
                    style={({ pressed }) => [styles.link, { opacity: pressed ? 0.6 : 1 }]}>
                    <Ionicons name="leaf-outline" size={16} color={palette.accent} />
                    <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ flexShrink: 1, color: palette.accent, fontSize: TYPE.subhead, fontWeight: '600' }}>
                      {t(S.pathwayFromTopic(m(topic.title)))}
                    </Text>
                  </Pressable>
                ) : null}
                {i < p.lenses.length - 1 ? <Divider color={hues.gold} /> : null}
              </View>
            );
          })}
        </KSection>

        {p.lineage.length ? (
          <KSection title={t(S.pathwayLineage)} hue="gold">
            <Para lang={lang}>{m(p.sageNote)}</Para>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginHorizontal: -SPACE.lg }}
              contentContainerStyle={{ paddingHorizontal: SPACE.lg, columnGap: SPACE.md }}>
              {p.lineage.map((id, i) => {
                const master = data.masters[id];
                if (!master) return null;
                return (
                  <View key={id} style={[styles.master, { backgroundColor: quietFill(palette), borderTopColor: hues.gold }]}>
                    <View style={styles.inline}>
                      <View style={[styles.bead, { borderColor: hues.gold }]}>
                        <Text maxFontSizeMultiplier={1.2} style={{ color: hues.gold, fontSize: TYPE.caption, fontWeight: '800' }}>
                          {i + 1}
                        </Text>
                      </View>
                      <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ flex: 1, color: palette.text, fontSize: TYPE.callout, fontWeight: '700' }}>
                        {m(master.name)}
                      </Text>
                    </View>
                    <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.caption }}>
                      {[m(master.kind), master.tradition, master.era].filter(Boolean).join(' · ')}
                    </Text>
                    <Para lang={lang} size={TYPE.subhead}>
                      {m(master.teaching)}
                    </Para>
                  </View>
                );
              })}
            </ScrollView>
            <Muted>{t(S.pathwayLineageNote)}</Muted>
          </KSection>
        ) : null}

        <Reflect p={p} />

        {p.concepts.some((id) => concepts.some((c) => c.id === id)) ? (
          <KSection title={t(S.pathwayConcepts)} hue="saffron">
            <View style={styles.chips}>
              {p.concepts.map((id) => {
                const c = concepts.find((x) => x.id === id);
                return c ? <Chip key={id} label={`${c.sanskrit} · ${c.label}`} onPress={() => openEntry('concepts', id)} /> : null;
              })}
            </View>
          </KSection>
        ) : null}

        {p.related.length ? (
          <View style={{ rowGap: SPACE.md }}>
            <Text accessibilityRole="header" maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.title3, fontWeight: '700' }}>
              {t(S.pathwayRelated)}
            </Text>
            {p.related.map((id) => {
              const r = data.items.find((x) => x.id === id);
              if (!r) return null;
              const rc = hues[pathwayHue(r.id)];
              return (
                <BentoTile
                  key={id}
                  depth={null}
                  accessibilityLabel={t(S.pathwayOpenA11y(m(r.title)))}
                  onPress={() => openPathway(r.id)}
                  glow={`${rc}26`}
                  style={{ flexDirection: 'row', alignItems: 'center', columnGap: SPACE.md }}>
                  <View style={{ flex: 1, rowGap: 2 }}>
                    <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: rc, fontSize: TYPE.caption, fontWeight: '700' }}>
                      {m(r.question)}
                    </Text>
                    <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.callout, fontWeight: '700' }}>
                      {m(r.title)}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={palette.muted} />
                </BentoTile>
              );
            })}
          </View>
        ) : null}
      </ScrollView>
    </Backdrop>
  );
}

/** The starter's journey: numbered stages on a gold thread, each naming its focus and what it reads. */
function Journey({ starter, p, color }: { starter: PathwayStarter; p: WisdomPathway; color: string }) {
  const { palette } = usePrefs();
  const { t, lang } = useI18n();
  const hues = huesFor(palette);
  const m = (x: { en: string; hi: string }) => pick(x, lang);
  return (
    <KSection title={t(S.pathwayStages(starter.stages.length))} hue="gold">
      <Para lang={lang} muted>
        {m(starter.intro)}
      </Para>
      <View>
        {starter.stages.map((st, i) => {
          const verses = st.lenses.map((k) => p.lenses[k]).filter(Boolean);
          const asks = [...st.reflections.map((k) => p.reflections[k]), ...st.contemplations.map((k) => p.contemplations[k])].filter(Boolean);
          return (
            <View key={i} style={styles.stage}>
              <View style={styles.rail}>
                <View style={[styles.stageBead, { backgroundColor: `${color}${palette.dark ? '40' : '22'}`, borderColor: color }]}>
                  <Text maxFontSizeMultiplier={1.2} style={{ color: palette.text, fontSize: TYPE.caption, fontWeight: '800' }}>
                    {i + 1}
                  </Text>
                </View>
                {i < starter.stages.length - 1 ? <View style={[styles.thread, { backgroundColor: `${hues.gold}66` }]} /> : null}
              </View>
              <View style={{ flex: 1, rowGap: 4, paddingBottom: SPACE.lg }}>
                <Label hue="gold">{t(S.pathwayStage(i + 1))}</Label>
                <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.body, fontWeight: '700' }}>
                  {m(st.title)}
                </Text>
                <Para lang={lang} size={TYPE.subhead}>
                  {m(st.focus)}
                </Para>
                {verses.map((l, k) => (
                  <View key={`v${k}`} style={styles.inline}>
                    <Ionicons name="book-outline" size={14} color={hues.gold} />
                    <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ flex: 1, color: palette.muted, fontSize: TYPE.footnote, fontWeight: '600' }}>
                      {m(l.verse.ref)}
                    </Text>
                  </View>
                ))}
                {asks.map((a, k) => (
                  <View key={`a${k}`} style={styles.inline}>
                    <Ionicons name="help-circle-outline" size={14} color={hues.tulsi} />
                    <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ flex: 1, color: palette.muted, fontSize: TYPE.footnote }}>
                      {m(a)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          );
        })}
      </View>
    </KSection>
  );
}

/** Pause and reflect: no feed, no streak. A breath, a question, one small action. */
function Reflect({ p }: { p: WisdomPathway }) {
  const { palette } = usePrefs();
  const { t, lang } = useI18n();
  const hues = huesFor(palette);
  const [paused, setPaused] = useState(false);
  const m = (x: { en: string; hi: string }) => pick(x, lang);
  return (
    <Card style={{ rowGap: SPACE.md }}>
      <View style={styles.inline} accessibilityRole="header">
        <View style={[styles.bar, { backgroundColor: hues.tulsi }]} />
        <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ flex: 1, color: palette.text, fontSize: TYPE.title3, fontWeight: '700' }}>
          {t(S.pathwayReflect)}
        </Text>
      </View>
      <Para lang={lang} muted>
        {t(S.pathwayReflectNote)}
      </Para>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: paused }}
        onPress={() => setPaused((v) => !v)}
        style={({ pressed }) => [styles.pause, { borderColor: `${hues.tulsi}88`, backgroundColor: quietFill(palette), opacity: pressed ? 0.75 : 1 }]}>
        <Ionicons name={paused ? 'play-outline' : 'pause-outline'} size={18} color={hues.tulsi} />
        <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.subhead, fontWeight: '700' }}>
          {t(paused ? S.pathwayResume : S.pathwayPause)}
        </Text>
      </Pressable>
      {paused ? <BreathingCircle color={hues.tulsi} /> : null}
      {p.reflections.map((q, i) => (
        <View key={`q${i}`} style={[styles.well, { backgroundColor: quietFill(palette) }]}>
          <Para lang={lang} weight="600">
            {m(q)}
          </Para>
        </View>
      ))}
      {p.contemplations.map((q, i) => (
        <View key={`c${i}`} style={[styles.well, { backgroundColor: quietFill(palette), borderLeftWidth: 3, borderLeftColor: hues.indigo }]}>
          <Para lang={lang} italic>
            {m(q)}
          </Para>
        </View>
      ))}
    </Card>
  );
}

/** A small ornament between verses: a gold rule with a dot, instead of a hard line. */
function Divider({ color }: { color: string }) {
  return (
    <View style={styles.divider} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
      <View style={[styles.rule, { backgroundColor: `${color}55` }]} />
      <Text style={{ color, fontSize: 12 }}>✦</Text>
      <View style={[styles.rule, { backgroundColor: `${color}55` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { borderWidth: 1, borderRadius: RADIUS.panel, padding: SPACE.xl, rowGap: SPACE.sm, overflow: 'hidden' },
  heroMandala: { position: 'absolute', right: -70, top: -60 },
  well: { borderRadius: RADIUS.control, padding: SPACE.md, rowGap: SPACE.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACE.sm },
  tag: { borderWidth: 1, borderRadius: RADIUS.pill, paddingHorizontal: SPACE.md, paddingVertical: 4 },
  link: { flexDirection: 'row', alignItems: 'center', columnGap: 6, minHeight: TOUCH, alignSelf: 'flex-start' },
  inline: { flexDirection: 'row', alignItems: 'center', columnGap: SPACE.sm },
  master: { width: 240, borderRadius: RADIUS.control, borderTopWidth: 2, padding: SPACE.md, rowGap: SPACE.xs },
  bead: { width: 24, height: 24, borderRadius: 12, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  stage: { flexDirection: 'row', columnGap: SPACE.md },
  rail: { width: 28, alignItems: 'center' },
  stageBead: { width: 28, height: 28, borderRadius: 14, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  thread: { width: 2, flex: 1, marginTop: 4 },
  bar: { width: 4, height: 20, borderRadius: 2 },
  pause: { flexDirection: 'row', alignItems: 'center', columnGap: SPACE.sm, alignSelf: 'flex-start', minHeight: TOUCH, paddingHorizontal: SPACE.lg, borderRadius: RADIUS.pill, borderWidth: 1 },
  divider: { flexDirection: 'row', alignItems: 'center', columnGap: SPACE.sm, marginTop: SPACE.xs },
  rule: { flex: 1, height: 1 },
});
