import { Stack } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { QuizRow } from '@/components/quiz';
import { Backdrop, GroupTitle, LargeHeader, Muted } from '@/components/ui';
import { QUIZZES } from '@/content/study';
import { S, useI18n } from '@/i18n';
import { useQuizResults } from '@/state/quiz-scores';
import { SPACE } from '@/theme/themes';

/** Every quiz: the knowledge check of each /learn/ course first, then the standalone quizzes. */
export default function QuizListScreen() {
  const insets = useSafeAreaInsets();
  const { t, lang } = useI18n();
  const results = useQuizResults();
  const groups = [
    { title: S.quizCourseSection, data: QUIZZES.filter((q) => q.course) },
    { title: S.quizMoreSection, data: QUIZZES.filter((q) => !q.course) },
  ].filter((g) => g.data.length > 0);

  return (
    <Backdrop>
      <>
        <Stack.Screen options={{ title: '', headerTransparent: true, headerStyle: { backgroundColor: 'transparent' } }} />
        <ScrollView
          style={{ backgroundColor: 'transparent' }}
          contentContainerStyle={{ paddingTop: insets.top + 24, paddingHorizontal: SPACE.lg, paddingBottom: insets.bottom + SPACE.xxl * 2 }}>
          <LargeHeader title={S.quizzesTitle} eyebrow={S.quizzesEyebrow} subtitle={t(S.quizzesIntro(QUIZZES.length))}>
            {lang === 'hi' ? <Muted>{t(S.quizEnglishNote)}</Muted> : null}
          </LargeHeader>
          {groups.map((g) => (
            <View key={g.title.en}>
              <GroupTitle title={t(g.title)} detail={String(g.data.length)} />
              {g.data.map((q, i) => (
                <QuizRow key={q.id} quiz={q} result={results[q.id]} first={i === 0} last={i === g.data.length - 1} />
              ))}
            </View>
          ))}
        </ScrollView>
      </>
    </Backdrop>
  );
}
