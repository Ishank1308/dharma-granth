import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { KSection, LabeledText, LangNote, Para } from '@/components/knowledge-ui';
import {
  Bullets,
  DoneTick,
  Flashcards,
  go,
  LinkButton,
  MindMap,
  Pill,
  Pills,
  PlainVerseBlock,
  ProgressBar,
  SectionTabs,
  SlideDeck,
  TimelineList,
  useCardWidth,
} from '@/components/learn-ui';
import { Backdrop, Card, Muted } from '@/components/ui';
import { appHref, courseById, hueFor, LEVEL_HUE } from '@/content/learn';
import { S, useI18n } from '@/i18n';
import { doneCount } from '@/lib/learn-progress';
import { usePrefs } from '@/state/app-state';
import { useLearn } from '@/state/learn';
import { barClearance, huesFor, quietFill, RADIUS, SPACE, TITLE_FONT_CAP, TYPE, UI_FONT_CAP } from '@/theme/themes';

export { ErrorBoundary } from '@/components/error-boundary';

type Tab = 'overview' | 'lessons' | 'concepts' | 'flashcards' | 'slides' | 'mindmap' | 'timeline' | 'revision';

/**
 * One course, as the website's /learn/<course>: a hero with the reader's progress, then its sections as
 * tabs (overview, lessons, concepts, flashcards, slides, mind map, timeline, revision). The website's
 * knowledge check is left out: the app has no quizzes.
 */
export default function CourseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { palette } = usePrefs();
  const { t } = useI18n();
  const hues = huesFor(palette);
  const width = useCardWidth();
  const { progress, setLesson } = useLearn();
  const [tab, setTab] = useState<Tab>('overview');
  const course = courseById(String(id));

  if (!course) {
    return (
      <Backdrop>
        <Stack.Screen options={{ title: t(S.notFoundTitle) }} />
        <Muted style={{ margin: SPACE.xl }}>{t(S.notFoundTitle)}</Muted>
      </Backdrop>
    );
  }

  const hue = hueFor(course.hue);
  const color = hues[hue];
  const lessonIds = course.lessons.map((l) => l.id);
  const done = doneCount(progress, 'courses', course.id, lessonIds);
  const finished = new Set(progress.courses[course.id] ?? []);
  const tabs: { key: Tab; title: string }[] = [
    { key: 'overview', title: t(S.courseOverview) },
    { key: 'lessons', title: t(S.courseLessons) },
    { key: 'concepts', title: t(S.courseConcepts) },
    ...(course.flashcards.length ? [{ key: 'flashcards' as const, title: t(S.courseFlashcards) }] : []),
    ...(course.slides.length ? [{ key: 'slides' as const, title: t(S.courseSlides) }] : []),
    { key: 'mindmap', title: t(S.courseMindmap) },
    ...(course.timeline.length ? [{ key: 'timeline' as const, title: t(S.courseTimeline) }] : []),
    { key: 'revision', title: t(S.courseRevision) },
  ];

  return (
    <Backdrop quiet>
      <Stack.Screen options={{ title: '', headerTransparent: true, headerStyle: { backgroundColor: 'transparent' } }} />
      <ScrollView
        style={{ backgroundColor: 'transparent' }}
        stickyHeaderIndices={[1]}
        contentContainerStyle={{ paddingTop: insets.top + 56, paddingHorizontal: SPACE.lg, paddingBottom: barClearance(insets.bottom), rowGap: SPACE.lg }}>
        <View style={[styles.hero, { borderColor: `${color}55`, backgroundColor: `${color}${palette.dark ? '30' : '16'}` }]}>
          <Text allowFontScaling={false} style={{ fontSize: 40 }}>
            {course.icon}
          </Text>
          <Text accessibilityRole="header" maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.title1, fontWeight: '800', lineHeight: TYPE.title1 * 1.25 }}>
            {course.title}
          </Text>
          <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color, fontSize: TYPE.subhead, fontWeight: '600' }}>
            {course.sanskrit}
          </Text>
          <Para muted size={TYPE.subhead} lang="en">
            {course.subtitle}
          </Para>
          <Pills>
            <Pill text={t(S.learnLevel(course.level))} hue={LEVEL_HUE[course.level]} />
            <Pill text={t(S.learnMinutes(course.minutes))} />
            <Pill text={t(S.learnLessons(course.lessons.length))} />
          </Pills>
          <View style={{ rowGap: 6, marginTop: SPACE.xs }}>
            <ProgressBar value={done / Math.max(1, course.lessons.length)} hue={hue} />
            <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.caption, fontWeight: '600' }}>
              {t(S.learnDone(done, course.lessons.length))}
            </Text>
          </View>
        </View>

        {/* Sticky, so the sections stay in reach while a long tab scrolls. */}
        <View style={[styles.tabs, { backgroundColor: palette.dark ? 'rgba(18,14,10,0.86)' : 'rgba(255,250,244,0.9)' }]}>
          <SectionTabs tabs={tabs} value={tab} onChange={setTab} label={t(S.courseSections)} />
        </View>

        <LangNote content="en" />

        {tab === 'overview' ? (
          <>
            <KSection title={t(S.courseObjective)} hue={hue}>
              <Para lang="en">{course.objective}</Para>
            </KSection>
            <KSection title={t(S.courseInvocation)} hue="gold">
              <PlainVerseBlock v={{ ...course.overview.mangal, en: course.overview.mangal.meaning, ref: course.overview.mangal.source }} hue="gold" />
            </KSection>
            <KSection title={t(S.coursePremise)} hue={hue}>
              <Para lang="en">{course.overview.premise}</Para>
              <LabeledText label={t(S.courseContext)} text={course.overview.context} hue="indigo" lang="en" />
              <LabeledText label={t(S.coursePrereq)} text={course.overview.prerequisites} hue="peacock" lang="en" />
              <LabeledText label={t(S.courseMethod)} text={course.overview.method} hue="tulsi" lang="en" />
            </KSection>
            <KSection title={t(S.courseOutcomes)} hue="tulsi">
              <Bullets items={course.overview.outcomes} hue="tulsi" icon="checkmark-circle-outline" />
            </KSection>
            {course.scriptures.length ? (
              <KSection title={t(S.courseTexts)} hue="peacock">
                {course.scriptures.map((s) => {
                  const open = go(appHref(s.href));
                  return (
                    <View key={s.id} style={[styles.well, { backgroundColor: quietFill(palette) }]}>
                      <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.body, fontWeight: '700' }}>
                        {`${s.sanskrit} · ${s.title}`}
                      </Text>
                      <Para muted size={TYPE.subhead} lang="en">
                        {s.description}
                      </Para>
                      {open ? <LinkButton label={t(S.lessonOpen)} icon="book-outline" onPress={open} /> : null}
                    </View>
                  );
                })}
              </KSection>
            ) : null}
          </>
        ) : null}

        {tab === 'lessons'
          ? course.lessons.map((l, i) => {
              const isDone = finished.has(l.id);
              const open = go(appHref(l.href));
              return (
                <Card key={l.id} style={{ rowGap: SPACE.md, borderColor: isDone ? `${hues.tulsi}66` : undefined }}>
                  <View style={styles.lessonHead}>
                    <View style={[styles.num, { backgroundColor: `${color}${palette.dark ? '33' : '1c'}` }]}>
                      <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color, fontSize: TYPE.subhead, fontWeight: '800' }}>
                        {i + 1}
                      </Text>
                    </View>
                    <View style={{ flex: 1, rowGap: 2 }}>
                      <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.body, fontWeight: '700' }}>
                        {l.title}
                      </Text>
                      <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.footnote }}>
                        {[l.sanskrit, t(S.learnMinutes(l.minutes))].filter(Boolean).join(' · ')}
                      </Text>
                    </View>
                    <DoneTick done={isDone} label={t(S.lessonMarkA11y(l.title, isDone))} onToggle={() => setLesson('courses', course.id, l.id, !isDone)} />
                  </View>
                  <Para lang="en">{l.description}</Para>
                  {l.verse ? <PlainVerseBlock v={l.verse} hue={hue} /> : null}
                  {l.concepts.length ? (
                    <Pills>
                      {l.concepts.map((c) => (
                        <Pill key={c} text={c} />
                      ))}
                    </Pills>
                  ) : null}
                  {open ? <LinkButton label={t(S.lessonRead)} icon="book-outline" onPress={open} /> : null}
                </Card>
              );
            })
          : null}

        {tab === 'concepts'
          ? course.concepts.map((c) => (
              <KSection key={c.id} title={`${c.sanskrit} · ${c.term}`} hue={hue}>
                <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.footnote, fontStyle: 'italic' }}>
                  {c.translit}
                </Text>
                <Para lang="en">{c.definition}</Para>
                <Para muted size={TYPE.subhead} lang="en">
                  {c.context}
                </Para>
                <LabeledText label={t(S.conceptAnchor)} text={c.anchor} hue="gold" lang="en" />
              </KSection>
            ))
          : null}

        {tab === 'flashcards' ? <Flashcards cards={course.flashcards} hue={hue} /> : null}
        {tab === 'slides' ? <SlideDeck slides={course.slides} hue={hue} width={width} /> : null}
        {tab === 'mindmap' ? <MindMap root={course.mindmap} hue={hue} /> : null}
        {tab === 'timeline' ? (
          <Card>
            <TimelineList events={course.timeline} hue={hue} />
          </Card>
        ) : null}

        {tab === 'revision' ? (
          <>
            <KSection title={t(S.revisionCadence)} hue={hue}>
              <Para lang="en">{course.revision.cadence}</Para>
              {course.revision.today.length ? (
                <>
                  <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.caption, fontWeight: '700' }}>
                    {t(S.revisionToday)}
                  </Text>
                  <Bullets items={course.revision.today} hue={hue} />
                </>
              ) : null}
            </KSection>
            {course.revision.verses.length ? (
              <KSection title={t(S.revisionVerses)} hue="gold">
                {course.revision.verses.map((v) => (
                  <PlainVerseBlock key={v.ref} v={v} hue="gold">
                    <Para muted size={TYPE.subhead} lang="en">
                      {v.key}
                    </Para>
                  </PlainVerseBlock>
                ))}
              </KSection>
            ) : null}
            <KSection title={t(S.revisionReflection)} hue="indigo">
              <Para weight="700" lang="en">
                {course.revision.reflection.title}
              </Para>
              {course.revision.reflection.sanskritFocus ? (
                <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: hues.indigo, fontSize: TYPE.callout, fontWeight: '600' }}>
                  {course.revision.reflection.sanskritFocus}
                </Text>
              ) : null}
              <Para lang="en" italic>
                {course.revision.reflection.prompt}
              </Para>
              <LabeledText label={t(S.revisionApply)} text={course.revision.reflection.practicalApplication} hue="tulsi" lang="en" />
            </KSection>
            {course.revision.checklist.length ? (
              <KSection title={t(S.revisionRecall)} hue="tulsi">
                <Bullets items={course.revision.checklist} hue="tulsi" icon="ellipse-outline" />
              </KSection>
            ) : null}
          </>
        ) : null}
      </ScrollView>
    </Backdrop>
  );
}

const styles = StyleSheet.create({
  hero: { borderWidth: 1, borderRadius: RADIUS.panel, padding: SPACE.xl, rowGap: SPACE.sm },
  tabs: { marginHorizontal: -SPACE.lg, paddingHorizontal: SPACE.lg, paddingVertical: SPACE.xs },
  well: { borderRadius: RADIUS.control, padding: SPACE.md, rowGap: SPACE.xs },
  lessonHead: { flexDirection: 'row', alignItems: 'center', columnGap: SPACE.md },
  num: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
});
