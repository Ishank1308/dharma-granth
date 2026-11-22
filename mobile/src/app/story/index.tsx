import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack } from 'expo-router';
import { useMemo, useState, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Mandala } from '@/components/art/mandala';
import { BentoRow, BentoTile } from '@/components/bento';
import { KSection, KVerseBlock, Label, LangNote, openEntry, Para } from '@/components/knowledge-ui';
import { MAX_NODES, RadialMap } from '@/components/radial-map';
import { Backdrop, Card, Chip, LargeHeader, Muted } from '@/components/ui';
import { findByName, hueKey, knowledge, type Character, type Timeline } from '@/content/knowledge';
import { S, useI18n, type Msg } from '@/i18n';
import { hapticSelect } from '@/motion/haptics';
import { useScrollY } from '@/motion/parallax';
import { TitleBar } from '@/motion/title-bar';
import { useMotion } from '@/motion/use-motion';
import { usePrefs } from '@/state/app-state';
import { SANSKRIT_FONT } from '@/theme/fonts';
import { barClearance, huesFor, quietFill, RADIUS, SPACE, TITLE_FONT_CAP, TOUCH, TYPE, UI_FONT_CAP, type Hues } from '@/theme/themes';

export { ErrorBoundary } from '@/components/error-boundary';

type Narrative = 'ramayana' | 'mahabharata';
type View_ = 'characters' | 'relations' | 'events' | 'dialogue' | 'decisions' | 'teaching';

/** What kind of text each block is, as the website labels it. Nothing is presented as historical fact. */
type Kind = 'scriptural' | 'traditional' | 'editorial';
const KIND: Record<Kind, { label: Msg; note: Msg; hue: keyof Hues }> = {
  scriptural: { label: S.kindScriptural, note: S.kindScripturalNote, hue: 'gold' },
  traditional: { label: S.kindTraditional, note: S.kindTraditionalNote, hue: 'tulsi' },
  editorial: { label: S.kindEditorial, note: S.kindEditorialNote, hue: 'indigo' },
};

const VIEWS: { id: View_; label: Msg }[] = [
  { id: 'characters', label: S.storyCharacters },
  { id: 'relations', label: S.storyRelations },
  { id: 'events', label: S.storyEvents },
  { id: 'dialogue', label: S.storyDialogue },
  { id: 'decisions', label: S.storyDecisions },
  { id: 'teaching', label: S.storyTeaching },
];

const NARRATIVES: { id: Narrative; title: Msg; sanskrit: string; hue: keyof Hues }[] = [
  { id: 'ramayana', title: S.storyRamayana, sanskrit: 'रामायणम्', hue: 'saffron' },
  { id: 'mahabharata', title: S.storyMahabharata, sanskrit: 'महाभारतम्', hue: 'indigo' },
];

/**
 * Story mode, after dharmagranth.dev/story/ (कथा-दर्शन): the Ramayana and the Mahabharata through their
 * characters, relationships, events, dialogue, decision points and teachings, from the same character and
 * timeline data as the knowledge pages. Every block carries the website's label for what it is (scriptural,
 * traditional, editorial), and events follow the order of the telling, not dates.
 */
export default function StoryScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const { animate } = useMotion();
  const { scrollY, onScroll } = useScrollY();
  const [narrative, setNarrative] = useState<Narrative>('ramayana');
  const [view, setView] = useState<View_>('characters');
  const [selectedId, setSelectedId] = useState('');

  const characters = knowledge('characters').items;
  const cast = useMemo(() => characters.filter((c) => c.category === narrative), [characters, narrative]);
  const selected = cast.find((c) => c.id === selectedId) ?? cast[0];
  const timeline = knowledge('timelines').items.find((x) => x.id === `${narrative}-narrative`);
  const counts = useMemo(
    () => Object.fromEntries(NARRATIVES.map((n) => [n.id, characters.filter((c) => c.category === n.id).length])),
    [characters],
  );

  const choose = (id: string) => setSelectedId(id);

  return (
    <Backdrop>
      <Stack.Screen options={{ title: '', headerTransparent: true, headerStyle: { backgroundColor: 'transparent' } }} />
      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={{ backgroundColor: 'transparent' }}
        contentContainerStyle={{ paddingTop: insets.top + 24, paddingHorizontal: SPACE.lg, paddingBottom: barClearance(insets.bottom), rowGap: SPACE.lg }}>
        <LargeHeader title={S.storyTitle} eyebrow={S.storyEyebrow} subtitle={`${t(S.storySummary)} ${t(S.storyOrder)}`} scrollY={scrollY} />

        {/* The two epics as a pair of glass tiles, the chosen one lit in its hue. */}
        <BentoRow>
          {NARRATIVES.map((n, i) => (
            <NarrativeTile
              key={n.id}
              title={t(n.title)}
              sanskrit={n.sanskrit}
              detail={t(S.storyCast(counts[n.id] ?? 0))}
              hue={n.hue}
              active={narrative === n.id}
              flex={narrative === n.id ? 1.25 : 1}
              mirror={i === 1}
              onPress={() => {
                if (narrative === n.id) return;
                hapticSelect();
                setNarrative(n.id);
                setSelectedId('');
              }}
            />
          ))}
        </BentoRow>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginHorizontal: -SPACE.lg }}
          contentContainerStyle={{ paddingHorizontal: SPACE.lg, columnGap: SPACE.sm }}
          accessibilityRole="radiogroup"
          accessibilityLabel={t(S.storyViews)}>
          {VIEWS.map((v) => (
            <Chip key={v.id} label={t(v.label)} active={view === v.id} onPress={() => setView(v.id)} />
          ))}
        </ScrollView>

        {view !== 'events' && selected ? <CastStrip cast={cast} selected={selected.id} onChoose={choose} /> : null}

        <LangNote content={view === 'events' ? 'hi' : 'en'} />

        {/* The panel cross-fades as the view, story or character changes. */}
        <Animated.View key={`${narrative}-${view}-${selected?.id}`} entering={animate ? FadeIn.duration(220) : undefined} style={{ rowGap: SPACE.lg }}>
          {selected ? <Panel view={view} c={selected} cast={cast} onChoose={choose} timeline={timeline} /> : null}
        </Animated.View>

        <Legend />
      </Animated.ScrollView>
      <TitleBar scrollY={scrollY} title={S.storyTitle} />
    </Backdrop>
  );
}

/** One epic as a bento tile: its Sanskrit name in the shloka face over a faint turning mandala. */
function NarrativeTile({
  title,
  sanskrit,
  detail,
  hue,
  active,
  flex,
  mirror,
  onPress,
}: {
  title: string;
  sanskrit: string;
  detail: string;
  hue: keyof Hues;
  active: boolean;
  flex: number;
  mirror: boolean;
  onPress: () => void;
}) {
  const { palette } = usePrefs();
  const { rich } = useMotion();
  const color = huesFor(palette)[hue];
  return (
    <BentoTile
      flex={flex}
      minHeight={128}
      strong={active}
      depth={null}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${detail}`}
      tint={active ? `${color}${palette.dark ? '2e' : '18'}` : undefined}
      glow={`${color}${active ? '55' : '22'}`}
      onPress={onPress}
      style={{ justifyContent: 'flex-end', rowGap: 2, borderWidth: active ? 1.5 : 0, borderColor: active ? `${color}aa` : 'transparent' }}>
      <Mandala size={120} color={color} opacity={active ? 0.3 : 0.14} spin={rich && active} style={[styles.tileMandala, mirror ? { left: -36 } : { right: -36 }]} />
      <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color, fontFamily: SANSKRIT_FONT, fontSize: TYPE.title2, lineHeight: TYPE.title2 * 1.5 }}>
        {sanskrit}
      </Text>
      <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.callout, fontWeight: '700' }}>
        {title}
      </Text>
      <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.caption }}>
        {detail}
      </Text>
      {active ? <Ionicons name="checkmark-circle" size={18} color={color} style={styles.tick} /> : null}
    </BentoTile>
  );
}

/** The cast as a row of medallions: each character's emblem in a ring of its colour, the chosen one gilded. */
function CastStrip({ cast, selected, onChoose }: { cast: Character[]; selected: string; onChoose: (id: string) => void }) {
  const { palette } = usePrefs();
  const { t } = useI18n();
  const hues = huesFor(palette);
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ marginHorizontal: -SPACE.lg }}
      contentContainerStyle={{ paddingHorizontal: SPACE.lg, columnGap: SPACE.md }}
      accessibilityRole="radiogroup"
      accessibilityLabel={t(S.storyChooseCharacter)}>
      {cast.map((c) => {
        const on = c.id === selected;
        const color = hues[hueKey(c.hue)];
        return (
          <Pressable
            key={c.id}
            accessibilityRole="radio"
            accessibilityState={{ checked: on }}
            accessibilityLabel={`${c.name}, ${c.sanskrit}`}
            onPress={() => {
              if (!on) hapticSelect();
              onChoose(c.id);
            }}
            style={({ pressed }) => [styles.medal, { opacity: pressed ? 0.75 : 1 }]}>
            <View
              style={[
                styles.ring,
                {
                  borderColor: on ? hues.gold : `${color}66`,
                  borderWidth: on ? 2.5 : 1.5,
                  backgroundColor: `${color}${palette.dark ? '33' : '18'}`,
                  transform: [{ scale: on ? 1.06 : 1 }],
                },
              ]}>
              <Text allowFontScaling={false} style={{ fontSize: 26 }}>
                {c.icon}
              </Text>
            </View>
            <Text maxFontSizeMultiplier={1.4} numberOfLines={1} style={{ color: on ? palette.text : palette.muted, fontSize: TYPE.caption, fontWeight: on ? '700' : '500' }}>
              {c.name}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

/** A block of the story with its label: what kind of text this is. */
function Block({ kind, title, children }: { kind: Kind; title: string; children: ReactNode }) {
  return (
    <KSection title={title} hue={KIND[kind].hue}>
      <KindChip kind={kind} />
      {children}
    </KSection>
  );
}

function KindChip({ kind }: { kind: Kind }) {
  const { palette } = usePrefs();
  const { t } = useI18n();
  const color = huesFor(palette)[KIND[kind].hue];
  return (
    <View style={[styles.kind, { borderColor: `${color}66`, backgroundColor: `${color}${palette.dark ? '26' : '12'}` }]}>
      <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.caption, fontWeight: '700' }}>
        {t(KIND[kind].label)}
      </Text>
    </View>
  );
}

function Panel({
  view,
  c,
  cast,
  onChoose,
  timeline,
}: {
  view: View_;
  c: Character;
  cast: Character[];
  onChoose: (id: string) => void;
  timeline: Timeline | undefined;
}) {
  const { palette } = usePrefs();
  const { t } = useI18n();
  const hues = huesFor(palette);
  const { width } = useWindowDimensions();

  switch (view) {
    case 'characters':
      return (
        <Block kind="traditional" title={`${c.name} · ${c.sanskrit}`}>
          <View style={styles.inline}>
            <View style={[styles.bigMedal, { borderColor: hues.gold, backgroundColor: `${hues[hueKey(c.hue)]}${palette.dark ? '33' : '18'}` }]}>
              <Text allowFontScaling={false} style={{ fontSize: 34 }}>
                {c.icon}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: hues.gold, fontFamily: SANSKRIT_FONT, fontSize: TYPE.title3, lineHeight: TYPE.title3 * 1.5 }}>
                {c.sanskrit}
              </Text>
              <Para weight="600">{c.short}</Para>
            </View>
          </View>
          <Para muted>{c.biography}</Para>
          <LinkRow icon="person-circle-outline" label={t(S.storyFullPage)} onPress={() => openEntry('characters', c.id)} />
        </Block>
      );

    case 'relations': {
      const rel = c.relations.slice(0, MAX_NODES);
      const inCast = (name: string) => {
        const page = findByName(name, 'characters');
        return page && cast.some((x) => x.id === page.id) ? page.id : null;
      };
      return (
        <Block kind="editorial" title={t(S.storyRelationsOf(c.name))}>
          <View style={{ alignItems: 'center' }}>
            <RadialMap
              width={Math.min(width - SPACE.lg * 2 - SPACE.lg * 2, 420)}
              seed={c.id}
              centerColor={hues.gold}
              accessibilityLabel={t(S.storyRelationsOf(c.name))}
              center={
                <>
                  <Text allowFontScaling={false} style={{ fontSize: 24 }}>
                    {c.icon}
                  </Text>
                  <Text maxFontSizeMultiplier={1.3} numberOfLines={2} style={{ color: palette.text, fontSize: TYPE.footnote, fontWeight: '800', textAlign: 'center' }}>
                    {c.name}
                  </Text>
                </>
              }
              nodes={rel.map((r, i) => {
                const id = inCast(r.name);
                return {
                  key: `${r.name}-${i}`,
                  label: r.name,
                  sub: r.relation,
                  color: id ? hues.saffron : hues.indigo,
                  accessibilityLabel: id ? t(S.storyRelationTap(r.name)) : `${r.name}, ${r.relation}`,
                  onPress: id ? () => onChoose(id) : undefined,
                };
              })}
            />
          </View>
          <View style={{ rowGap: SPACE.sm }}>
            {c.relations.map((r, i) => {
              const id = inCast(r.name);
              return (
                <Pressable
                  key={i}
                  disabled={!id}
                  accessibilityRole={id ? 'button' : 'text'}
                  accessibilityLabel={id ? t(S.storyRelationTap(r.name)) : `${r.name}, ${r.relation}`}
                  onPress={id ? () => onChoose(id) : undefined}
                  style={({ pressed }) => [styles.relRow, { opacity: pressed ? 0.7 : 1 }]}>
                  <View style={[styles.relDot, { backgroundColor: id ? hues.saffron : hues.indigo }]} />
                  <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ flex: 1, color: palette.text, fontSize: TYPE.subhead }}>
                    <Text style={{ fontWeight: '700' }}>{r.name}</Text>
                    <Text style={{ color: palette.muted }}>{`  ·  ${r.relation}`}</Text>
                  </Text>
                  {id ? <Ionicons name="chevron-forward" size={16} color={palette.muted} /> : null}
                </Pressable>
              );
            })}
          </View>
          <Muted>{t(S.storyRelationsNote)}</Muted>
        </Block>
      );
    }

    case 'events':
      return (
        <Block kind="traditional" title={timeline?.title ?? t(S.storyEvents)}>
          {timeline ? (
            <View>
              {timeline.events.map((e, i) => (
                <View key={e.id} style={styles.event}>
                  {/* The thread of the telling: a gold line, a lamp at each event. */}
                  <View style={styles.rail}>
                    <View style={[styles.lamp, { backgroundColor: hues.gold, boxShadow: palette.lite ? undefined : `0 0 10px ${hues.gold}` }]} />
                    {i < timeline.events.length - 1 ? <View style={[styles.thread, { backgroundColor: `${hues.gold}66` }]} /> : null}
                  </View>
                  <View style={{ flex: 1, rowGap: 4, paddingBottom: SPACE.lg }}>
                    <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.body, fontWeight: '700' }}>
                      {e.title}
                    </Text>
                    {e.sanskrit ? (
                      <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: hues.gold, fontFamily: SANSKRIT_FONT, fontSize: TYPE.subhead, lineHeight: TYPE.subhead * 1.6 }}>
                        {e.sanskrit}
                      </Text>
                    ) : null}
                    <Para lang="hi">{e.description}</Para>
                    {e.significance ? (
                      <Para lang="hi" muted size={TYPE.subhead}>
                        {e.significance}
                      </Para>
                    ) : null}
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <Muted>{t(S.storyNoEvents)}</Muted>
          )}
        </Block>
      );

    case 'dialogue':
      return (
        <Block kind="editorial" title={t(S.storyDialogueOf(c.name))}>
          {c.dialogues.length === 0 ? (
            <Muted>{t(S.storyNoDialogue)}</Muted>
          ) : (
            c.dialogues.map((d, i) => (
              <View key={i} style={[styles.quote, { backgroundColor: quietFill(palette), borderLeftColor: hues.indigo }]}>
                <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.subhead, fontWeight: '700' }}>
                  {d.speaker}
                  <Text style={{ color: palette.muted, fontWeight: '400' }}>{`  ·  ${d.context}`}</Text>
                </Text>
                <Para italic>{`“${d.text}”`}</Para>
                <Muted>{t(S.storyParaphrase(d.reference))}</Muted>
              </View>
            ))
          )}
        </Block>
      );

    case 'decisions':
      return (
        <Block kind="traditional" title={t(S.storyDecisionsOf(c.name))}>
          {c.dilemmas.length === 0 ? (
            <Muted>{t(S.storyNoDecisions)}</Muted>
          ) : (
            c.dilemmas.map((d, i) => (
              <View key={i} style={[styles.well, { backgroundColor: quietFill(palette) }]}>
                <View style={styles.inline}>
                  <Ionicons name="git-branch-outline" size={18} color={hues.tulsi} />
                  <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ flex: 1, color: palette.text, fontSize: TYPE.body, fontWeight: '700' }}>
                    {d.title}
                  </Text>
                </View>
                <Para muted>{d.description}</Para>
                <Label hue="tulsi">{t(S.storyResolves)}</Label>
                <Para>{d.resolution}</Para>
              </View>
            ))
          )}
        </Block>
      );

    case 'teaching':
      return (
        <>
          <Block kind="scriptural" title={t(S.storyVersesOf(c.name))}>
            {c.verses.length === 0 ? <Muted>{t(S.storyNoVerses)}</Muted> : c.verses.map((v, i) => <KVerseBlock key={i} v={v} hue="gold" />)}
          </Block>
          {c.interpretations.length ? (
            <Block kind="traditional" title={t(S.storyReadings)}>
              {c.interpretations.map((x, i) => (
                <View key={i} style={{ rowGap: 2 }}>
                  <Label hue="tulsi">{x.tradition}</Label>
                  <Para>{x.view}</Para>
                </View>
              ))}
              <Muted>{t(S.storyReadingsNote)}</Muted>
            </Block>
          ) : null}
        </>
      );
  }
}

function LinkRow({ icon, label, onPress }: { icon: 'person-circle-outline'; label: string; onPress: () => void }) {
  const { palette } = usePrefs();
  return (
    <Pressable accessibilityRole="link" accessibilityLabel={label} onPress={onPress} style={({ pressed }) => [styles.link, { opacity: pressed ? 0.6 : 1 }]}>
      <Ionicons name={icon} size={18} color={palette.accent} />
      <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.accent, fontSize: TYPE.subhead, fontWeight: '600' }}>
        {label}
      </Text>
    </Pressable>
  );
}

function Legend() {
  const { t } = useI18n();
  const { palette } = usePrefs();
  return (
    <Card style={{ rowGap: SPACE.md }}>
      <Text accessibilityRole="header" maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.callout, fontWeight: '700' }}>
        {t(S.storyLegend)}
      </Text>
      {(Object.keys(KIND) as Kind[]).map((k) => (
        <View key={k} style={{ rowGap: 4 }}>
          <KindChip kind={k} />
          <Muted>{t(KIND[k].note)}</Muted>
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  tileMandala: { position: 'absolute', top: -30 },
  tick: { position: 'absolute', top: SPACE.md, right: SPACE.md },
  medal: { alignItems: 'center', rowGap: 6, width: 68, minHeight: TOUCH },
  ring: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  bigMedal: { width: 68, height: 68, borderRadius: 34, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  kind: { alignSelf: 'flex-start', borderWidth: 1, borderRadius: RADIUS.pill, paddingHorizontal: SPACE.md, paddingVertical: 4 },
  inline: { flexDirection: 'row', alignItems: 'center', columnGap: SPACE.md },
  link: { flexDirection: 'row', alignItems: 'center', columnGap: 6, minHeight: TOUCH, alignSelf: 'flex-start' },
  relRow: { flexDirection: 'row', alignItems: 'center', columnGap: SPACE.sm, minHeight: 36 },
  relDot: { width: 8, height: 8, borderRadius: 4 },
  event: { flexDirection: 'row', columnGap: SPACE.md },
  rail: { width: 14, alignItems: 'center' },
  lamp: { width: 12, height: 12, borderRadius: 6, marginTop: 5 },
  thread: { width: 2, flex: 1, marginTop: 4 },
  quote: { borderLeftWidth: 3, borderRadius: RADIUS.control, padding: SPACE.md, rowGap: SPACE.sm },
  well: { borderRadius: RADIUS.control, padding: SPACE.md, rowGap: SPACE.sm },
});
