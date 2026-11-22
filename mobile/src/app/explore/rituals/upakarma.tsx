import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack, type Href } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

import { Mandala } from '@/components/art/mandala';
import { BentoRow, BentoTile } from '@/components/bento';
import { Bullets, FaqList, FocusNote, HuePill } from '@/components/guide-ui';
import { KSection, Para } from '@/components/knowledge-ui';
import { Backdrop, Card, glass, GroupTitle, IconButton, Muted } from '@/components/ui';
import {
  BRAHMAGRANTHI,
  JAPA_TARGET,
  REGIONAL_UPAKARMA_TRADITIONS,
  SACRED_THREAD_INTRO,
  THREE_RINAS,
  UPAKARMA_FAQS,
  UPAKARMA_INTRO,
  UPAKARMA_MANTRAS,
  UPAKARMA_STEPS,
  YAJNOPAVITA_TANTUS,
  type UpakarmaMantra,
} from '@/content/rituals';
import { S, useI18n, type Msg } from '@/i18n';
import { hapticOn, hapticSelect } from '@/motion/haptics';
import { PressableScale } from '@/motion/pressable-scale';
import { useMotion } from '@/motion/use-motion';
import { usePrefs } from '@/state/app-state';
import { SANSKRIT_FONT } from '@/theme/fonts';
import { fontCap, huesFor, quietFill, RADIUS, SPACE, TITLE_FONT_CAP, TOUCH, TYPE, UI_FONT_CAP } from '@/theme/themes';

export { ErrorBoundary } from '@/components/error-boundary';

const RINA_HUES = ['gold', 'indigo', 'tulsi'] as const;

/**
 * The website's Upakarma guide (/rituals/upakarma/): the five steps one at a time with their actions and
 * mantras, the 108 Kamokarshit japa counter, the sacred thread's three strands and nine threads, Upakarma
 * across India, and the guide's questions and answers. Step ticks and the count live only on this screen,
 * as on the website.
 */
export default function UpakarmaScreen() {
  const insets = useSafeAreaInsets();
  const { palette } = usePrefs();
  const { t, lang } = useI18n();
  const { animate, rich } = useMotion();
  const hues = huesFor(palette);
  const hi = lang === 'hi';
  const [active, setActive] = useState(0);
  const [done, setDone] = useState<Record<number, boolean>>({});
  const [tantu, setTantu] = useState(1);
  const step = UPAKARMA_STEPS[active];
  const mantra = step.mantraRef ? UPAKARMA_MANTRAS[step.mantraRef] : null;
  const doneCount = Object.values(done).filter(Boolean).length;
  const total = UPAKARMA_STEPS.length;
  const selectedTantu = YAJNOPAVITA_TANTUS.find((x) => x.number === tantu) ?? YAJNOPAVITA_TANTUS[0];
  const toggleDone = () => {
    const next = !done[step.stepNumber];
    if (next) hapticOn();
    setDone((d) => ({ ...d, [step.stepNumber]: next }));
  };

  const related: { label: Msg; href: Href }[] = [
    { label: S.upaRelGayatri, href: { pathname: '/explore/mantras/[id]', params: { id: 'gayatri-mantra' } } },
    { label: S.upaRelPurnima, href: { pathname: '/explore/panchang', params: { vrata: 'purnima' } } },
    { label: S.upaRelGuruvara, href: { pathname: '/explore/guide/[limb]/[slug]', params: { limb: 'varas', slug: 'guruvara' } } },
  ];

  return (
    <Backdrop>
      <Stack.Screen options={{ title: '', headerTransparent: true, headerStyle: { backgroundColor: 'transparent' } }} />
      <Animated.ScrollView
        style={{ backgroundColor: 'transparent' }}
        contentContainerStyle={{ paddingTop: insets.top + 56, paddingHorizontal: SPACE.lg, paddingBottom: insets.bottom + SPACE.xxl * 2, rowGap: SPACE.md }}>
        {/* Title page: a faint turning mandala behind the invocation, as on Home. */}
        <BentoTile strong depth={null} radius={RADIUS.panel} padding={SPACE.xl} glow={palette.dark ? 'rgba(251,191,36,0.24)' : 'rgba(217,119,6,0.14)'} style={{ rowGap: SPACE.sm }}>
          {rich ? (
            <View pointerEvents="none" style={styles.mandala}>
              <Mandala size={220} color={hues.gold} spin />
            </View>
          ) : null}
          <HuePill label={t(S.upakarmaEyebrow)} hue="gold" />
          <Text accessibilityRole="header" maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: 30, lineHeight: 46, fontFamily: SANSKRIT_FONT, marginTop: SPACE.xs }}>
            उपाकर्म एवं यज्ञोपवीत संस्कार विधान
          </Text>
          {!hi ? (
            <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: hues.gold, fontSize: TYPE.callout, fontWeight: '700' }}>
              {t(S.upakarmaTitle)}
            </Text>
          ) : null}
          <Para muted>{t(UPAKARMA_INTRO)}</Para>
        </BentoTile>

        {/* The five steps. */}
        <View style={styles.headRow}>
          <GroupTitle title={t(S.upaSteps)} />
          <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: hues.tulsi, fontSize: TYPE.footnote, fontWeight: '700' }}>
            {t(S.upaStepsDone(doneCount, total))}
          </Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -SPACE.lg }} contentContainerStyle={styles.steps}>
          <View accessibilityRole="radiogroup" style={{ flexDirection: 'row', columnGap: SPACE.sm }}>
            {UPAKARMA_STEPS.map((s, i) => {
              const on = i === active;
              const name = (hi ? s.nameHi : s.name).split('(')[0].trim();
              return (
                <PressableScale
                  key={s.stepNumber}
                  scaleTo={0.94}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: on }}
                  accessibilityLabel={t(S.upaStepA11y(s.stepNumber, name, !!done[s.stepNumber]))}
                  onPress={() => {
                    if (!on) hapticSelect();
                    setActive(i);
                  }}
                  style={[styles.step, on ? { backgroundColor: palette.text } : glass(palette)]}>
                  <View style={[styles.stepNum, { backgroundColor: on ? palette.bg : quietFill(palette) }]}>
                    {done[s.stepNumber] ? (
                      <Ionicons name="checkmark" size={14} color={hues.tulsi} />
                    ) : (
                      <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: on ? palette.text : palette.muted, fontSize: TYPE.caption, fontWeight: '800' }}>
                        {s.stepNumber}
                      </Text>
                    )}
                  </View>
                  <Text maxFontSizeMultiplier={UI_FONT_CAP} numberOfLines={1} style={{ color: on ? palette.bg : palette.text, fontSize: TYPE.footnote, fontWeight: '700' }}>
                    {name}
                  </Text>
                </PressableScale>
              );
            })}
          </View>
        </ScrollView>

        <Animated.View key={step.stepNumber} entering={animate ? FadeIn.duration(240) : undefined} style={{ rowGap: SPACE.md }}>
          <Card strong style={{ rowGap: SPACE.md }}>
            <View>
              <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: hues.saffron, fontSize: TYPE.caption, fontWeight: '800' }}>
                {t(S.upaStep(step.stepNumber, total))} · {hi ? step.durationHi : step.duration}
              </Text>
              <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.title2, fontWeight: '800', marginTop: 2 }}>
                {hi ? step.nameHi : step.name}
              </Text>
              <Muted style={{ fontSize: TYPE.footnote }}>{hi ? step.name : step.nameHi}</Muted>
            </View>
            <Para lang={lang}>{hi ? step.descriptionHi : step.description}</Para>
            <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.caption, fontWeight: '700' }}>
              {t(S.upaActions)}
            </Text>
            <Bullets numbered items={(hi ? step.ritualsHi : step.rituals).map((text) => ({ text }))} />
            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: !!done[step.stepNumber] }}
              onPress={toggleDone}
              style={({ pressed }) => [
                styles.doneBtn,
                done[step.stepNumber] ? { backgroundColor: `${hues.tulsi}22`, borderColor: `${hues.tulsi}66` } : { backgroundColor: quietFill(palette), borderColor: 'transparent' },
                pressed && { opacity: 0.75 },
              ]}>
              <Ionicons name={done[step.stepNumber] ? 'checkmark-circle' : 'ellipse-outline'} size={20} color={done[step.stepNumber] ? hues.tulsi : palette.muted} />
              <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: done[step.stepNumber] ? hues.tulsi : palette.text, fontSize: TYPE.subhead, fontWeight: '700' }}>
                {done[step.stepNumber] ? t(S.upaDone) : t(S.upaMarkDone)}
              </Text>
            </Pressable>
          </Card>
          {mantra ? <MantraPanel m={mantra} /> : null}
        </Animated.View>

        {/* The sacred thread. */}
        <GroupTitle title={t(S.upaThread)} />
        <Para muted>{t(SACRED_THREAD_INTRO)}</Para>
        <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.callout, fontWeight: '700' }}>
          {t(S.upaThreeDebts)}
        </Text>
        {THREE_RINAS.map((r, i) => (
          <Card key={r.name.en} style={{ rowGap: SPACE.xs }}>
            <View style={styles.rinaHead}>
              <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ flex: 1, color: palette.text, fontSize: TYPE.callout, fontWeight: '800' }}>
                {i + 1}. {t(r.name)}
              </Text>
              <HuePill label={t(r.guna)} hue={RINA_HUES[i]} />
            </View>
            <Para>{t(r.text)}</Para>
          </Card>
        ))}

        <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.callout, fontWeight: '700', marginTop: SPACE.sm }}>
          {t(S.upaNineThreads)}
        </Text>
        <View accessibilityRole="radiogroup" style={styles.tantus}>
          {YAJNOPAVITA_TANTUS.map((x) => {
            const on = x.number === tantu;
            return (
              <PressableScale
                key={x.number}
                scaleTo={0.94}
                accessibilityRole="radio"
                accessibilityState={{ checked: on }}
                accessibilityLabel={`${t(S.upaTantu(x.number))}: ${hi ? x.deityHi : x.deity}`}
                onPress={() => {
                  if (!on) hapticSelect();
                  setTantu(x.number);
                }}
                style={[styles.tantu, on ? { backgroundColor: palette.text } : glass(palette)]}>
                <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: on ? palette.bg : hues.gold, fontSize: TYPE.caption, fontWeight: '800' }}>
                  {x.number}
                </Text>
                <Text maxFontSizeMultiplier={UI_FONT_CAP} numberOfLines={1} style={{ color: on ? palette.bg : palette.text, fontSize: TYPE.caption, fontWeight: '600' }}>
                  {x.deityHi.split(' ')[0]}
                </Text>
              </PressableScale>
            );
          })}
        </View>
        <Animated.View key={tantu} entering={animate ? FadeIn.duration(200) : undefined}>
          <Card style={{ rowGap: SPACE.xs }}>
            <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: hues.gold, fontSize: TYPE.subhead, fontWeight: '800' }}>
              {t(S.upaTantu(selectedTantu.number))}: {selectedTantu.deityHi} ({selectedTantu.deity})
            </Text>
            <Para>{hi ? selectedTantu.principleHi : selectedTantu.principle}</Para>
            <Muted style={{ fontStyle: 'italic' }}>{hi ? selectedTantu.principle : selectedTantu.principleHi}</Muted>
          </Card>
        </Animated.View>
        <FocusNote label={t(S.upaBrahmagranthi)} hue="gold">
          {t(BRAHMAGRANTHI)}
        </FocusNote>

        <GroupTitle title={t(S.upaRegions)} />
        {REGIONAL_UPAKARMA_TRADITIONS.map((r) => (
          <KSection key={r.region} title={hi ? r.nameHi : r.name} hue="lotus">
            <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: hues.lotus, fontSize: TYPE.caption, fontWeight: '800' }}>
              {r.region} · {r.timing}
            </Text>
            <Para lang={lang}>{hi ? r.descriptionHi : r.description}</Para>
          </KSection>
        ))}

        <GroupTitle title={t(S.upaFaqs)} />
        <FaqList items={UPAKARMA_FAQS.map((f) => (hi ? { q: f.questionHi, a: f.answerHi, extra: f.answer } : { q: f.question, a: f.answer, extra: f.answerHi }))} />

        <GroupTitle title={t(S.upaRelated)} />
        <BentoRow>
          {related.map((r) => (
            <BentoTile key={r.label.en} depth={null} flex={1} minHeight={72} onPress={() => router.push(r.href)} accessibilityRole="link" accessibilityLabel={t(r.label)} padding={SPACE.md}>
              <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.footnote, fontWeight: '700' }}>
                {t(r.label)}
              </Text>
              <Ionicons name="arrow-forward" size={14} color={palette.accent} style={{ marginTop: SPACE.xs }} />
            </BentoTile>
          ))}
        </BentoRow>
      </Animated.ScrollView>
    </Backdrop>
  );
}

/** A step's mantra: every line whole in the shloka face, its IAST, meaning and why it is said; the 108 counter for Kamokarshit. */
function MantraPanel({ m }: { m: UpakarmaMantra }) {
  const { palette, settings } = usePrefs();
  const { t, lang } = useI18n();
  const hues = huesFor(palette);
  const scale = settings.textScale;
  const cap = fontCap(scale);
  const hi = lang === 'hi';
  return (
    <Card strong style={{ rowGap: SPACE.md, borderColor: `${hues.saffron}55` }}>
      <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: hues.saffron, fontSize: TYPE.footnote, fontWeight: '800' }}>
        ✦ {hi ? m.titleHi : m.title}
      </Text>
      <View style={[styles.verse, { backgroundColor: quietFill(palette) }]}>
        {m.sanskrit.split('\n').map((line, i) => (
          <Text
            key={i}
            maxFontSizeMultiplier={cap}
            style={{ color: palette.text, fontFamily: SANSKRIT_FONT, fontSize: TYPE.title3 * scale, lineHeight: TYPE.title3 * scale * 1.75, textAlign: 'center' }}>
            {line}
          </Text>
        ))}
        {settings.showTransliteration ? (
          <View style={{ marginTop: SPACE.sm, rowGap: 2 }}>
            {m.iast.split('\n').map((line, i) => (
              <Text key={i} maxFontSizeMultiplier={cap} style={{ color: hues.saffron, fontSize: TYPE.footnote * scale, lineHeight: TYPE.footnote * scale * 1.55, fontStyle: 'italic', textAlign: 'center' }}>
                {line}
              </Text>
            ))}
          </View>
        ) : null}
      </View>
      <View style={{ rowGap: 2 }}>
        <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.caption, fontWeight: '700' }}>
          {t(S.upaMantraMeaning)}
        </Text>
        <Para lang={lang}>{hi ? m.hindi : m.english}</Para>
      </View>
      <View style={{ rowGap: 2 }}>
        <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.caption, fontWeight: '700' }}>
          {t(S.upaSignificance)}
        </Text>
        <Para lang={lang}>{hi ? m.significanceHi : m.significance}</Para>
      </View>
      {m.id === 'kamokarshin' ? <JapaCounter /> : null}
    </Card>
  );
}

/** The 108 japa counter: a ring that fills bead by bead, a tick on each count and a gentle tap at 108. */
function JapaCounter() {
  const { palette } = usePrefs();
  const { t } = useI18n();
  const hues = huesFor(palette);
  const [count, setCount] = useState(0);
  const size = 132;
  const r = 56;
  const circ = 2 * Math.PI * r;
  const full = count >= JAPA_TARGET;
  const add = () => {
    if (full) return;
    const next = count + 1;
    if (next === JAPA_TARGET) hapticOn();
    else hapticSelect();
    setCount(next);
  };
  return (
    <View style={[styles.japa, { backgroundColor: quietFill(palette) }]}>
      <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.callout, fontWeight: '800' }}>
        {t(S.upaJapa)}
      </Text>
      <Muted style={{ textAlign: 'center' }}>{t(S.upaJapaNote)}</Muted>
      <PressableScale
        onPress={add}
        scaleTo={0.94}
        accessibilityRole="button"
        accessibilityLabel={`${t(S.upaJapaAdd)}. ${t(S.upaJapaCount(count, JAPA_TARGET))}`}
        accessibilityValue={{ min: 0, max: JAPA_TARGET, now: count }}
        style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center', marginVertical: SPACE.sm }}>
        <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
          <Circle cx={size / 2} cy={size / 2} r={r} stroke={palette.dark ? 'rgba(255,255,255,0.10)' : 'rgba(60,40,20,0.10)'} strokeWidth={8} fill="none" />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={full ? hues.tulsi : hues.saffron}
            strokeWidth={8}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={`${circ} ${circ}`}
            strokeDashoffset={circ * (1 - count / JAPA_TARGET)}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: full ? hues.tulsi : palette.text, fontSize: 34, fontWeight: '800', fontVariant: ['tabular-nums'] }}>
          {count}
        </Text>
        <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.caption, fontWeight: '700' }}>
          {full ? t(S.upaJapaDone) : `/ ${JAPA_TARGET} · ${t(S.upaJapaAdd)}`}
        </Text>
      </PressableScale>
      <IconButton icon="refresh" onPress={() => setCount(0)} accessibilityLabel={t(S.upaJapaReset)} color={palette.muted} />
    </View>
  );
}

const styles = StyleSheet.create({
  mandala: { position: 'absolute', right: -60, top: -50, opacity: 0.5 },
  headRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' },
  steps: { paddingHorizontal: SPACE.lg },
  step: { flexDirection: 'row', minHeight: TOUCH, borderRadius: RADIUS.pill, paddingVertical: SPACE.xs, paddingLeft: SPACE.xs, paddingRight: SPACE.md, alignItems: 'center', columnGap: SPACE.sm },
  stepNum: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  doneBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', columnGap: SPACE.sm, minHeight: TOUCH, borderRadius: RADIUS.pill, borderWidth: 1 },
  verse: { borderRadius: RADIUS.control, padding: SPACE.md },
  japa: { borderRadius: RADIUS.control, padding: SPACE.md, alignItems: 'center', rowGap: SPACE.xs },
  rinaHead: { flexDirection: 'row', alignItems: 'center', columnGap: SPACE.sm },
  tantus: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACE.xs },
  tantu: { width: '31.5%', flexGrow: 1, minHeight: TOUCH, borderRadius: RADIUS.control, alignItems: 'center', justifyContent: 'center', paddingVertical: SPACE.xs, paddingHorizontal: 4 },
});
