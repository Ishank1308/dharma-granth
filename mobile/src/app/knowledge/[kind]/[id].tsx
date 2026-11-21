import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useLocalSearchParams } from 'expo-router';
import type { ReactNode } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  EntryTile,
  KSection,
  KVerseBlock,
  Label,
  LabeledText,
  LangNote,
  NameChips,
  Para,
} from '@/components/knowledge-ui';
import { Backdrop, Card, Muted } from '@/components/ui';
import {
  hueKey,
  isKind,
  knowledge,
  type Character,
  type Concept,
  type KnowledgeKind,
  type Place,
  type Term,
  type Timeline,
} from '@/content/knowledge';
import { S, useI18n } from '@/i18n';
import { usePrefs } from '@/state/app-state';
import { barClearance, huesFor, quietFill, RADIUS, SPACE, TITLE_FONT_CAP, TOUCH, TYPE, UI_FONT_CAP, type Hues } from '@/theme/themes';

/** One entry of a knowledge collection, laid out in the website's section order for its kind. */
export default function KnowledgeEntry() {
  const params = useLocalSearchParams<{ kind: string; id: string }>();
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const kind = isKind(String(params.kind)) ? (String(params.kind) as KnowledgeKind) : null;
  const id = String(params.id);

  let body: ReactNode = null;
  if (kind === 'concepts') {
    const c = knowledge('concepts').items.find((x) => x.id === id);
    if (c) body = <ConceptPage c={c} />;
  } else if (kind === 'dictionary') {
    const x = knowledge('dictionary').items.find((e) => e.id === id);
    if (x) body = <TermPage x={x} />;
  } else if (kind === 'characters') {
    const x = knowledge('characters').items.find((e) => e.id === id);
    if (x) body = <CharacterPage x={x} />;
  } else if (kind === 'places') {
    const x = knowledge('places').items.find((e) => e.id === id);
    if (x) body = <PlacePage x={x} />;
  } else if (kind === 'timelines') {
    const x = knowledge('timelines').items.find((e) => e.id === id);
    if (x) body = <TimelinePage x={x} />;
  }

  return (
    <Backdrop quiet>
      <Stack.Screen options={{ title: '', headerTransparent: true, headerStyle: { backgroundColor: 'transparent' } }} />
      <ScrollView
        style={{ backgroundColor: 'transparent' }}
        contentContainerStyle={{ paddingTop: insets.top + 56, paddingHorizontal: SPACE.lg, paddingBottom: barClearance(insets.bottom), rowGap: SPACE.lg }}>
        {body ?? <Muted style={{ marginTop: SPACE.xl, textAlign: 'center' }}>{t(S.notFoundTitle)}</Muted>}
      </ScrollView>
    </Backdrop>
  );
}

/** The top of an entry: its tile, the Sanskrit name large, the Roman name, category and summary. */
function Hero({
  hue,
  icon,
  sanskrit,
  title,
  translit,
  category,
  summary,
  summaryLang,
}: {
  hue: keyof Hues;
  icon?: string;
  sanskrit: string;
  title: string;
  translit?: string;
  category?: string;
  summary?: string;
  summaryLang?: 'en' | 'hi';
}) {
  const { palette } = usePrefs();
  const color = huesFor(palette)[hue];
  return (
    <View style={{ rowGap: SPACE.md }}>
      <View style={styles.heroTop}>
        <EntryTile hue={hue} icon={icon} letter={sanskrit.slice(0, 1) || title.slice(0, 1)} size={64} />
        {category ? (
          <View style={[styles.catPill, { backgroundColor: palette.dark ? `${color}2e` : `${color}1a` }]}>
            <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color, fontSize: TYPE.caption, fontWeight: '700' }}>
              {category}
            </Text>
          </View>
        ) : null}
      </View>
      <View accessibilityRole="header">
        <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.largeTitle, fontWeight: '800', lineHeight: TYPE.largeTitle * 1.3 }}>
          {sanskrit || title}
        </Text>
        {sanskrit ? (
          <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color, fontSize: TYPE.title3, fontWeight: '600' }}>
            {title}
            {translit && translit.toLowerCase() !== title.toLowerCase() ? (
              <Text style={{ color: palette.muted, fontStyle: 'italic', fontWeight: '400' }}>{`  ${translit}`}</Text>
            ) : null}
          </Text>
        ) : null}
      </View>
      {summary ? <Para lang={summaryLang} size={TYPE.body}>{summary}</Para> : null}
    </View>
  );
}

function useCategory(kind: KnowledgeKind, key: string) {
  const { lang } = useI18n();
  const c = knowledge(kind).categories.find((x) => x.key === key);
  return { label: c ? (lang === 'hi' && c.hi ? c.hi : c.en) : '', hue: c?.hue };
}

function ConceptPage({ c }: { c: Concept }) {
  const { t, lang } = useI18n();
  const cat = useCategory('concepts', c.category);
  const hue = hueKey(cat.hue);
  const d = c.detail;
  const hi = lang === 'hi';
  const { palette } = usePrefs();
  const concepts = knowledge('concepts').items;
  return (
    <>
      <Hero
        hue={hue}
        sanskrit={c.sanskrit}
        title={c.label}
        translit={c.translit}
        category={cat.label}
        summary={(hi ? c.short.hi : c.short.en) || c.short.hi}
        summaryLang={hi || !c.short.en ? 'hi' : 'en'}
      />
      {c.descriptionHi ? (
        <KSection title={t(S.kDescription)} hue={hue}>
          <Para lang="hi">{c.descriptionHi}</Para>
          <LangNote content="hi" />
        </KSection>
      ) : null}
      {d ? (
        <KSection title={t(S.kDerivation)} hue={hue}>
          <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ fontSize: TYPE.title3, fontWeight: '700', color: huesFor(palette)[hue] }}>
            {t(S.kRoot(d.derivation.root))}
          </Text>
          <Para muted>{hi ? d.derivation.rootMeaningHi : d.derivation.rootMeaning}</Para>
          <Para lang={hi ? 'hi' : 'en'}>{hi ? d.derivation.etymologyHi : d.derivation.etymologyEn}</Para>
        </KSection>
      ) : null}
      {d && d.contextual.length ? (
        <KSection title={t(S.kContextual)} hue={hue}>
          {d.contextual.map((m, i) => (
            <LabeledText key={i} label={hi ? m.contextHi : m.context} text={hi ? m.meaningHi : m.meaningEn} hue={hue} lang={lang} />
          ))}
        </KSection>
      ) : null}
      {c.verses.length ? (
        <KSection title={t(S.kVerses)} hue={hue}>
          {c.verses.map((v, i) => (
            <KVerseBlock key={i} v={v} hue={hue} />
          ))}
        </KSection>
      ) : null}
      {d && d.traditions.length ? (
        <KSection title={t(S.kTraditions)} hue={hue}>
          {d.traditions.map((m, i) => (
            <LabeledText key={i} label={hi ? m.traditionHi : m.tradition} text={hi ? m.viewHi : m.viewEn} hue={hue} lang={lang} />
          ))}
        </KSection>
      ) : null}
      {d && d.misunderstandings.length ? (
        <KSection title={t(S.kMisunderstandings)} hue={hue}>
          {d.misunderstandings.map((m, i) => (
            <MythCard key={i} myth={hi ? m.mythHi : m.myth} correction={hi ? m.correctionHi : m.correction} />
          ))}
        </KSection>
      ) : null}
      {c.connections.length ? (
        <KSection title={t(S.kConnected)} hue={hue}>
          <NameChips names={c.connections.map((x) => concepts.find((k) => k.id === x)?.label ?? x)} prefer="concepts" />
        </KSection>
      ) : null}
      {d && d.sources.length ? <Sources items={d.sources} /> : null}
    </>
  );
}

function MythCard({ myth, correction }: { myth: string; correction: string }) {
  const { palette } = usePrefs();
  const { t, lang } = useI18n();
  const hues = huesFor(palette);
  return (
    <View style={[styles.well, { backgroundColor: quietFill(palette), rowGap: SPACE.sm }]}>
      <View style={styles.inline}>
        <Ionicons name="close-circle" size={16} color={hues.vermilion} />
        <Label hue="vermilion">{t(S.kMyth)}</Label>
      </View>
      <Para lang={lang}>{myth}</Para>
      <View style={styles.inline}>
        <Ionicons name="checkmark-circle" size={16} color={hues.tulsi} />
        <Label hue="tulsi">{t(S.kCorrection)}</Label>
      </View>
      <Para lang={lang}>{correction}</Para>
    </View>
  );
}

function Sources({ items }: { items: string[] }) {
  const { t } = useI18n();
  return (
    <KSection title={t(S.kSources)} hue="gold">
      {items.map((s, i) => (
        <Para key={i} muted size={TYPE.footnote}>
          {`${i + 1}. ${s}`}
        </Para>
      ))}
    </KSection>
  );
}

function TermPage({ x }: { x: Term }) {
  const { t } = useI18n();
  const cat = useCategory('dictionary', x.category);
  const hue = hueKey(cat.hue);
  return (
    <>
      <Hero hue={hue} sanskrit={x.sanskrit} title={x.term} translit={x.translit} category={cat.label} summary={x.short} summaryLang="en" />
      <LangNote content="en" />
      <KSection title={t(S.kDefinition)} hue={hue}>
        <Para lang="en">{x.definition}</Para>
      </KSection>
      {x.etymology ? (
        <KSection title={t(S.kEtymology)} hue={hue}>
          <Para lang="en">{x.etymology}</Para>
        </KSection>
      ) : null}
      {x.verses.length ? (
        <KSection title={t(S.kVerses)} hue={hue}>
          {x.verses.map((v, i) => (
            <KVerseBlock key={i} v={v} hue={hue} />
          ))}
        </KSection>
      ) : null}
      {x.crossTradition.length ? (
        <KSection title={t(S.kCrossTradition)} hue={hue}>
          {x.crossTradition.map((c, i) => (
            <LabeledText key={i} label={c.tradition} text={c.view} hue={hue} lang="en" />
          ))}
        </KSection>
      ) : null}
      {x.keyTexts.length ? (
        <KSection title={t(S.kKeyTexts)} hue={hue}>
          <NameChips names={x.keyTexts} />
        </KSection>
      ) : null}
      {x.related.length ? (
        <KSection title={t(S.kRelatedTerms)} hue={hue}>
          <NameChips names={x.related} prefer="dictionary" />
        </KSection>
      ) : null}
    </>
  );
}

function CharacterPage({ x }: { x: Character }) {
  const { t } = useI18n();
  const { palette } = usePrefs();
  const cat = useCategory('characters', x.category);
  const hue = hueKey(x.hue);
  const color = huesFor(palette)[hue];
  return (
    <>
      <Hero hue={hue} icon={x.icon} sanskrit={x.sanskrit} title={x.name} category={cat.label} summary={x.short} summaryLang="en" />
      <LangNote content="en" />
      <KSection title={t(S.kBiography)} hue={hue}>
        <Para lang="en">{x.biography}</Para>
      </KSection>
      {x.relations.length ? (
        <KSection title={t(S.kRelations)} hue={hue}>
          {x.relations.map((r, i) => (
            <View key={i} style={styles.relation}>
              <View style={{ flex: 1 }}>
                <NameChips names={[r.name]} prefer="characters" />
              </View>
              <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ flex: 1, color: palette.muted, fontSize: TYPE.footnote, textAlign: 'right' }}>
                {r.relation}
              </Text>
            </View>
          ))}
        </KSection>
      ) : null}
      {x.events.length ? (
        <KSection title={t(S.kEvents)} hue={hue}>
          {/* A vertical thread of events, as the website's character timeline. */}
          {x.events.map((e, i) => (
            <View key={i} style={styles.event}>
              <View style={styles.rail}>
                <View style={[styles.dot, { backgroundColor: color }]} />
                {i < x.events.length - 1 ? <View style={[styles.line, { backgroundColor: `${color}55` }]} /> : null}
              </View>
              <View style={{ flex: 1, paddingBottom: SPACE.md, rowGap: 2 }}>
                <Para weight="700">{e.title}</Para>
                <Para muted size={TYPE.subhead}>
                  {e.description}
                </Para>
              </View>
            </View>
          ))}
        </KSection>
      ) : null}
      {x.dialogues.length ? (
        <KSection title={t(S.kDialogues)} hue={hue}>
          {x.dialogues.map((d, i) => (
            <View key={i} style={[styles.well, { backgroundColor: quietFill(palette), rowGap: SPACE.xs }]}>
              <Label hue={hue}>{`${d.speaker} · ${d.context}`}</Label>
              <Para italic>{`“${d.text}”`}</Para>
              <Para muted size={TYPE.footnote}>
                {d.reference}
              </Para>
            </View>
          ))}
        </KSection>
      ) : null}
      {x.dilemmas.length ? (
        <KSection title={t(S.kDilemmas)} hue={hue}>
          {x.dilemmas.map((d, i) => (
            <View key={i} style={{ rowGap: SPACE.xs }}>
              <Para weight="700">{d.title}</Para>
              <Para>{d.description}</Para>
              <LabeledText label={t(S.kResolution)} text={d.resolution} hue={hue} lang="en" />
            </View>
          ))}
        </KSection>
      ) : null}
      {x.verses.length ? (
        <KSection title={t(S.kVerses)} hue={hue}>
          {x.verses.map((v, i) => (
            <KVerseBlock key={i} v={v} hue={hue} />
          ))}
        </KSection>
      ) : null}
      {x.interpretations.length ? (
        <KSection title={t(S.kInterpretations)} hue={hue}>
          {x.interpretations.map((c, i) => (
            <LabeledText key={i} label={c.tradition} text={c.view} hue={hue} lang="en" />
          ))}
        </KSection>
      ) : null}
    </>
  );
}

function PlacePage({ x }: { x: Place }) {
  const { t } = useI18n();
  const { palette } = usePrefs();
  const cat = useCategory('places', x.category);
  const hue = hueKey(x.hue);
  const id = x.identifications;
  const map = `geo:${x.coordinates.lat},${x.coordinates.lng}?q=${x.coordinates.lat},${x.coordinates.lng}(${encodeURIComponent(x.name)})`;
  return (
    <>
      <Hero hue={hue} icon={x.icon} sanskrit={x.sanskrit} title={x.name} category={cat.label} summary={x.short} summaryLang="en" />
      <LangNote content="en" />
      <KSection title={t(S.kDescription)} hue={hue}>
        <Para lang="en">{x.description}</Para>
        <LabeledText label={t(S.kSignificance)} text={x.significance} hue={hue} lang="en" />
      </KSection>
      <KSection title={t(S.kIdentification)} hue={hue}>
        <LabeledText label={t(S.kTraditional)} text={id.traditional} hue={hue} lang="en" />
        <LabeledText label={t(S.kPresentDay)} text={id.presentDay} hue={hue} lang="en" />
        {id.debated ? <LabeledText label={t(S.kDebated)} text={id.debated} hue="vermilion" lang="en" /> : null}
        {id.symbolic ? <LabeledText label={t(S.kSymbolic)} text={id.symbolic} hue="indigo" lang="en" /> : null}
        <Pressable
          accessibilityRole="link"
          accessibilityLabel={t(S.kOpenMapA11y(x.name))}
          onPress={() =>
            Linking.openURL(map).catch(() =>
              Linking.openURL(`https://www.openstreetmap.org/?mlat=${x.coordinates.lat}&mlon=${x.coordinates.lng}#map=9/${x.coordinates.lat}/${x.coordinates.lng}`).catch(() => {}),
            )
          }
          style={({ pressed }) => [styles.mapButton, { backgroundColor: quietFill(palette), opacity: pressed ? 0.7 : 1 }]}>
          <Ionicons name="map-outline" size={18} color={palette.accent} />
          <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ flex: 1, color: palette.accent, fontSize: TYPE.subhead, fontWeight: '600' }}>
            {t(S.kOpenMap)}
          </Text>
          <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.caption }}>
            {`${x.coordinates.lat.toFixed(2)}°, ${x.coordinates.lng.toFixed(2)}°`}
          </Text>
        </Pressable>
      </KSection>
      {x.associations.length ? (
        <KSection title={t(S.kAssociations)} hue={hue}>
          <NameChips names={x.associations} />
        </KSection>
      ) : null}
    </>
  );
}

function TimelinePage({ x }: { x: Timeline }) {
  const { t } = useI18n();
  const { palette } = usePrefs();
  const cat = useCategory('timelines', x.category);
  const note = knowledge('timelines').categories.find((c) => c.key === x.category)?.note;
  const hue: keyof Hues = (['indigo', 'saffron', 'tulsi', 'lotus', 'vermilion', 'gold'] as const)[
    Math.max(0, knowledge('timelines').categories.findIndex((c) => c.key === x.category)) % 6
  ];
  const color = huesFor(palette)[hue];
  return (
    <>
      <Hero hue={hue} sanskrit={x.sanskrit} title={x.title} category={cat.label} summary={x.description} summaryLang="hi" />
      {note ? (
        <Card style={{ flexDirection: 'row', columnGap: SPACE.sm, alignItems: 'center' }}>
          <Ionicons name="information-circle-outline" size={18} color={color} />
          <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ flex: 1, color: palette.text, fontSize: TYPE.footnote }}>
            {note}
          </Text>
        </Card>
      ) : null}
      <LangNote content="hi" />
      <KSection title={t(S.kEventCount(x.events.length))} hue={hue}>
        {x.events.map((e, i) => (
          <View key={e.id} style={styles.event}>
            <View style={styles.rail}>
              <View style={[styles.dot, { backgroundColor: color }]} />
              {i < x.events.length - 1 ? <View style={[styles.line, { backgroundColor: `${color}55` }]} /> : null}
            </View>
            <View style={{ flex: 1, paddingBottom: SPACE.lg, rowGap: 4 }}>
              <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color, fontSize: TYPE.caption, fontWeight: '700' }}>
                {e.date}
              </Text>
              <Para weight="700" lang="hi">
                {e.title}
                {e.sanskrit ? <Text style={{ color: palette.muted, fontWeight: '400' }}>{`  ${e.sanskrit}`}</Text> : null}
              </Para>
              <Para lang="hi" size={TYPE.subhead}>
                {e.description}
              </Para>
              {e.significance ? (
                <Para muted lang="hi" size={TYPE.footnote}>
                  {e.significance}
                </Para>
              ) : null}
              {e.figures.length ? <NameChips names={e.figures} prefer="characters" /> : null}
            </View>
          </View>
        ))}
      </KSection>
    </>
  );
}

const styles = StyleSheet.create({
  heroTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  catPill: { borderRadius: RADIUS.pill, paddingHorizontal: SPACE.md, paddingVertical: 6 },
  well: { borderRadius: RADIUS.control, padding: SPACE.md },
  inline: { flexDirection: 'row', alignItems: 'center', columnGap: 6 },
  relation: { flexDirection: 'row', alignItems: 'center', columnGap: SPACE.md },
  event: { flexDirection: 'row', columnGap: SPACE.md },
  rail: { width: 14, alignItems: 'center' },
  dot: { width: 12, height: 12, borderRadius: 6, marginTop: 6 },
  line: { width: 2, flex: 1, marginTop: 4 },
  mapButton: { flexDirection: 'row', alignItems: 'center', columnGap: SPACE.sm, minHeight: TOUCH, borderRadius: RADIUS.control, paddingHorizontal: SPACE.md },
});
