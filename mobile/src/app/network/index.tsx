import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BentoTile } from '@/components/bento';
import { KSection, Label, LangNote, openEntry, Para, pick, useOpenVerse, VerseBlock } from '@/components/knowledge-ui';
import { Dot, MAX_NODES, RadialMap } from '@/components/radial-map';
import { Backdrop, Card, Chip, LargeHeader, Muted } from '@/components/ui';
import { knowledge, type NetworkNode, type NetworkSeed, type RelationshipType } from '@/content/knowledge';
import { S, useI18n } from '@/i18n';
import { hapticSelect } from '@/motion/haptics';
import { useScrollY } from '@/motion/parallax';
import { TitleBar } from '@/motion/title-bar';
import { useMotion } from '@/motion/use-motion';
import { usePrefs } from '@/state/app-state';
import { SANSKRIT_FONT } from '@/theme/fonts';
import { barClearance, huesFor, quietFill, RADIUS, SPACE, TITLE_FONT_CAP, TOUCH, TYPE, UI_FONT_CAP, type Hues } from '@/theme/themes';

export { ErrorBoundary } from '@/components/error-boundary';

/** The website's five link colours, on the app's hues so every one passes the contrast test in both themes. */
const TYPE_HUE: Record<RelationshipType, keyof Hues> = {
  supporting: 'tulsi',
  parallel: 'peacock',
  contrasting: 'gold',
  cross_scripture: 'indigo',
  concept_connection: 'saffron',
};

/**
 * The verse relationship network, after dharmagranth.dev/network/: pick one of the website's featured verses
 * and see what it is linked to (supporting verses, parallel teachings, contrasting emphases, links across
 * scriptures, philosophical concepts), drawn as threads from the verse at the centre. Tap a node to read why
 * the two are linked and open it in the reader or its concept page. Every link is a reviewed one, built from
 * the website's own engine at bundle time.
 */
export default function NetworkScreen() {
  const { verse: param } = useLocalSearchParams<{ verse?: string }>();
  const insets = useSafeAreaInsets();
  const { palette } = usePrefs();
  const { t, lang } = useI18n();
  const { animate } = useMotion();
  const { width } = useWindowDimensions();
  const { scrollY, onScroll } = useScrollY();
  const hues = huesFor(palette);
  const data = knowledge('network');
  const labels = useMemo(() => new Map(data.categories.map((c) => [c.key, c])), [data]);

  const [seedId, setSeedId] = useState(() => data.items.find((s) => s.id === param)?.id ?? data.items[0]?.id);
  const seed = data.items.find((s) => s.id === seedId) ?? data.items[0];
  const [filter, setFilter] = useState<RelationshipType | 'all'>('all');
  const [nodeId, setNodeId] = useState<string | null>(null);

  const nodes = seed ? (filter === 'all' ? seed.nodes : seed.nodes.filter((n) => n.type === filter)) : [];
  const active = nodes.find((n) => n.id === nodeId) ?? nodes[0];
  const kindLabel = (type: RelationshipType) => {
    const c = labels.get(type);
    return c ? pick(c, lang) : type;
  };
  const types = seed ? (Object.keys(TYPE_HUE) as RelationshipType[]).filter((k) => seed.nodes.some((n) => n.type === k)) : [];

  const chooseSeed = (s: NetworkSeed) => {
    if (s.id === seedId) return;
    hapticSelect();
    setSeedId(s.id);
    setFilter('all');
    setNodeId(null);
  };

  if (!seed) return <Backdrop>{null}</Backdrop>;
  const ref = `${pick(seed.scripture, lang)} ${seed.ref}`;
  const mapWidth = Math.min(width - SPACE.lg * 4, 420);

  return (
    <Backdrop>
      <Stack.Screen options={{ title: '', headerTransparent: true, headerStyle: { backgroundColor: 'transparent' } }} />
      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={{ backgroundColor: 'transparent' }}
        contentContainerStyle={{ paddingTop: insets.top + 24, paddingHorizontal: SPACE.lg, paddingBottom: barClearance(insets.bottom), rowGap: SPACE.lg }}>
        <LargeHeader title={S.networkTitle} eyebrow={S.networkEyebrow} subtitle={t(S.networkSummary)} scrollY={scrollY} />

        {/* The featured verses as a ribbon of glass cards; the chosen one is lit. */}
        <View style={{ rowGap: SPACE.sm }}>
          <Label>{t(S.networkSeeds)}</Label>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginHorizontal: -SPACE.lg }}
            contentContainerStyle={{ paddingHorizontal: SPACE.lg, columnGap: SPACE.md }}
            accessibilityRole="radiogroup">
            {data.items.map((s) => {
              const on = s.id === seed.id;
              return (
                <View key={s.id} style={{ width: 220 }}>
                  <BentoTile
                    depth={null}
                    strong={on}
                    accessibilityRole="button"
                    accessibilityHint={on ? undefined : t(S.networkCenter)}
                    accessibilityLabel={`${pick(s.scripture, lang)} ${s.ref}. ${pick(s.theme, lang)}`}
                    onPress={() => chooseSeed(s)}
                    tint={on ? `${hues.gold}${palette.dark ? '2e' : '1a'}` : undefined}
                    glow={on ? `${hues.gold}55` : undefined}
                    minHeight={124}
                    style={{ rowGap: 4, borderWidth: on ? 1.5 : 0, borderColor: on ? `${hues.gold}aa` : 'transparent' }}>
                    <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: hues.gold, fontSize: TYPE.caption, fontWeight: '800' }}>
                      {`${pick(s.scripture, lang)} ${s.ref}`}
                    </Text>
                    <Text maxFontSizeMultiplier={UI_FONT_CAP} numberOfLines={3} style={{ color: palette.text, fontSize: TYPE.subhead, fontWeight: '700' }}>
                      {pick(s.theme, lang)}
                    </Text>
                    <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.caption, marginTop: 'auto' }}>
                      {`${s.nodes.length} · ${t(S.networkGraph)}`}
                    </Text>
                  </BentoTile>
                </View>
              );
            })}
          </ScrollView>
        </View>

        <Animated.View key={seed.id} entering={animate ? FadeIn.duration(240) : undefined} style={{ rowGap: SPACE.lg }}>
          {/* The verse at the centre, whole. */}
          <KSection title={`${t(S.networkCenter)}: ${ref}`} hue="gold">
            <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.callout, fontWeight: '700' }}>
              {pick(seed.theme, lang)}
            </Text>
            <VerseBlock sanskrit={seed.sanskrit} translation={seed.translation} reference={ref} hue="gold" target={seed.target} />
            {lang === 'en' ? <Para muted size={TYPE.subhead}>{seed.description}</Para> : null}
          </KSection>

          <Card style={{ rowGap: SPACE.md }}>
            <View style={styles.inline} accessibilityRole="header">
              <View style={[styles.bar, { backgroundColor: hues.peacock }]} />
              <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ flex: 1, color: palette.text, fontSize: TYPE.title3, fontWeight: '700' }}>
                {t(S.networkGraph)}
              </Text>
              <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.footnote }}>
                {seed.nodes.length}
              </Text>
            </View>

            {types.length > 1 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginHorizontal: -SPACE.lg }}
                contentContainerStyle={{ paddingHorizontal: SPACE.lg, columnGap: SPACE.sm }}
                accessibilityRole="radiogroup">
                <Chip label={t(S.filterAll)} active={filter === 'all'} onPress={() => setFilter('all')} />
                {types.map((k) => (
                  <Chip key={k} label={kindLabel(k)} active={filter === k} onPress={() => { setFilter(k); setNodeId(null); }} />
                ))}
              </ScrollView>
            ) : null}

            {nodes.length === 0 ? (
              <Muted>{t(S.networkNone)}</Muted>
            ) : (
              <View style={{ alignItems: 'center' }}>
                <RadialMap
                  width={mapWidth}
                  seed={`${seed.id}-${filter}`}
                  centerColor={hues.gold}
                  accessibilityLabel={t(S.networkGraphA11y(ref, nodes.length))}
                  center={
                    <>
                      <Text maxFontSizeMultiplier={1.2} style={{ color: hues.gold, fontFamily: SANSKRIT_FONT, fontSize: TYPE.title3, lineHeight: TYPE.title3 * 1.4 }}>
                        ॐ
                      </Text>
                      <Text maxFontSizeMultiplier={1.2} numberOfLines={2} style={{ color: palette.text, fontSize: TYPE.caption, fontWeight: '800', textAlign: 'center' }}>
                        {ref}
                      </Text>
                    </>
                  }
                  nodes={nodes.slice(0, MAX_NODES).map((n) => ({
                    key: n.id,
                    // Two short lines fit a node: the book and the verse number, or a concept and its Sanskrit.
                    label: n.type === 'concept_connection' ? n.label : n.scripture.length > 14 ? n.scripture.replace(/ Upanishad$/, ' Up.') : n.scripture,
                    sub: n.type === 'concept_connection' ? n.labelHi : n.label.slice(n.scripture.length).trim(),
                    color: hues[TYPE_HUE[n.type]],
                    selected: active?.id === n.id,
                    accessibilityLabel: t(S.networkNodeA11y(n.label, kindLabel(n.type))),
                    onPress: () => setNodeId(n.id),
                  }))}
                />
              </View>
            )}

            {/* Legend: the colour of each kind of link. */}
            <View style={styles.legend}>
              {types.map((k) => (
                <View key={k} style={styles.inline}>
                  <Dot color={hues[TYPE_HUE[k]]} />
                  <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.caption }}>
                    {kindLabel(k)}
                  </Text>
                </View>
              ))}
            </View>
          </Card>

          {active ? <NodeDetail key={active.id} node={active} kind={kindLabel(active.type)} color={hues[TYPE_HUE[active.type]]} /> : null}

          {nodes.length ? (
            <KSection title={t(S.networkAll)} hue="peacock">
              {nodes.map((n) => {
                const on = active?.id === n.id;
                return (
                  <Pressable
                    key={n.id}
                    accessibilityRole="button"
                    accessibilityState={{ selected: on }}
                    accessibilityLabel={t(S.networkNodeA11y(n.label, kindLabel(n.type)))}
                    onPress={() => {
                      hapticSelect();
                      setNodeId(n.id);
                    }}
                    style={({ pressed }) => [styles.row, { backgroundColor: on ? quietFill(palette) : 'transparent', opacity: pressed ? 0.7 : 1 }]}>
                    <Dot color={hues[TYPE_HUE[n.type]]} />
                    <View style={{ flex: 1 }}>
                      <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.subhead, fontWeight: '700' }}>
                        {n.label}
                      </Text>
                      <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.caption }}>
                        {kindLabel(n.type)}
                      </Text>
                    </View>
                    {on ? <Ionicons name="radio-button-on" size={16} color={palette.accent} /> : null}
                  </Pressable>
                );
              })}
            </KSection>
          ) : null}
        </Animated.View>

        <Card style={{ rowGap: SPACE.sm }}>
          <Text accessibilityRole="header" maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.callout, fontWeight: '700' }}>
            {t(S.networkMethod)}
          </Text>
          <Para lang={lang} muted size={TYPE.subhead}>
            {t(S.networkMethodNote)}
          </Para>
        </Card>
      </Animated.ScrollView>
      <TitleBar scrollY={scrollY} title={S.networkTitle} />
    </Backdrop>
  );
}

/** The chosen link: what kind it is, why the two are linked, the verse whole, and where to read it. */
function NodeDetail({ node, kind, color }: { node: NetworkNode; kind: string; color: string }) {
  const { palette } = usePrefs();
  const { t, lang } = useI18n();
  const { animate } = useMotion();
  const open = useOpenVerse()(node.target);
  return (
    <Animated.View entering={animate ? FadeIn.duration(200) : undefined}>
      <Card style={{ rowGap: SPACE.md, borderColor: `${color}66` }}>
        <View style={[styles.kind, { borderColor: `${color}88`, backgroundColor: `${color}${palette.dark ? '26' : '14'}` }]}>
          <Dot color={color} size={8} />
          <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.caption, fontWeight: '700' }}>
            {kind}
          </Text>
        </View>
        <Text accessibilityRole="header" maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.title3, fontWeight: '800' }}>
          {node.label}
        </Text>
        {node.scriptureSa && node.type !== 'concept_connection' ? (
          <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color, fontFamily: SANSKRIT_FONT, fontSize: TYPE.subhead, lineHeight: TYPE.subhead * 1.6 }}>
            {node.scriptureSa}
          </Text>
        ) : null}
        <LangNote content="en" />
        <View style={{ rowGap: 2 }}>
          <Label hue="indigo">{t(S.networkWhy)}</Label>
          <Para>{node.reason}</Para>
          {lang === 'hi' && node.labelHi ? <Para lang="hi" muted size={TYPE.subhead}>{node.labelHi}</Para> : null}
        </View>
        {node.sanskrit ? (
          <VerseBlock sanskrit={node.sanskrit} translation={node.translation} reference={node.label} hue="gold" target={node.target} />
        ) : node.translation ? (
          <Para muted>{node.translation}</Para>
        ) : null}
        {!node.sanskrit && open ? (
          <ActionRow icon="book-outline" label={t(S.kReadVerse)} onPress={open} />
        ) : null}
        {node.concept ? <ActionRow icon="git-network-outline" label={t(S.networkOpenConcept)} onPress={() => openEntry('concepts', node.concept as string)} /> : null}
      </Card>
    </Animated.View>
  );
}

function ActionRow({ icon, label, onPress }: { icon: 'book-outline' | 'git-network-outline'; label: string; onPress: () => void }) {
  const { palette } = usePrefs();
  return (
    <Pressable accessibilityRole="link" accessibilityLabel={label} onPress={onPress} style={({ pressed }) => [styles.action, { opacity: pressed ? 0.6 : 1 }]}>
      <Ionicons name={icon} size={18} color={palette.accent} />
      <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.accent, fontSize: TYPE.subhead, fontWeight: '600' }}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  inline: { flexDirection: 'row', alignItems: 'center', columnGap: SPACE.sm },
  bar: { width: 4, height: 20, borderRadius: 2 },
  legend: { flexDirection: 'row', flexWrap: 'wrap', columnGap: SPACE.lg, rowGap: SPACE.sm },
  kind: { flexDirection: 'row', alignItems: 'center', columnGap: 6, alignSelf: 'flex-start', borderWidth: 1, borderRadius: RADIUS.pill, paddingHorizontal: SPACE.md, paddingVertical: 4 },
  row: { flexDirection: 'row', alignItems: 'center', columnGap: SPACE.md, minHeight: TOUCH, borderRadius: RADIUS.control, paddingHorizontal: SPACE.sm },
  action: { flexDirection: 'row', alignItems: 'center', columnGap: 6, minHeight: TOUCH, alignSelf: 'flex-start' },
});
