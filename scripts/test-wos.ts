/**
 * Test Suite: Dharma Granth Wisdom Operating System (WOS)
 * 
 * Validates the core engines, data integrity, non-extractive principles,
 * 10 questions, 10 emotions, 8 journeys, 7 attentional modes,
 * daily wisdom, and ethical analytics.
 * 
 * Run with: npx tsx scripts/test-wos.ts
 */

import assert from 'node:assert/strict';
import { CANONICAL_QUESTIONS, getQuestionById, searchQuestions } from '../lib/wos/question-wisdom';
import { CORE_EMOTIONS, getEmotionById, searchEmotions } from '../lib/wos/emotion-wisdom';
import { WISDOM_JOURNEYS, getJourneyById } from '../lib/wos/wisdom-journeys';
import { getDailyWisdom } from '../lib/wos/daily-wisdom';
import { ATTENTIONAL_MODE_CONFIGS } from '../lib/wos/wellbeing-modes';
import { computeEthicalAnalytics } from '../lib/wos/wisdom-analytics';
import { generateWisdomRecommendations } from '../lib/wos/contextual-engine';
import { CANONICAL_REFLECTION_PROMPTS, getReflectionPrompt } from '../lib/wos/reflection-engine';
import { SEO_WISDOM_CLUSTERS, generateFAQJsonLd } from '../lib/wos/seo-universe';

function testQuestions() {
  console.log('Testing WOS Questions Engine...');
  assert.equal(CANONICAL_QUESTIONS.length, 10, 'Must have exactly 10 canonical existential questions');

  for (const q of CANONICAL_QUESTIONS) {
    assert.ok(q.id, 'Question must have id');
    assert.ok(q.questionEn, 'Question must have English text');
    assert.ok(q.questionHi, 'Question must have Hindi text');
    assert.ok(q.sanskritInquiry, 'Question must have Sanskrit inquiry');
    assert.ok(q.philosophicalPivotEn, 'Question must have English philosophical pivot');
    assert.ok(q.philosophicalPivotHi, 'Question must have Hindi philosophical pivot');
    assert.ok(q.primaryVerses.length > 0, `Question ${q.id} must have at least one canonical verse`);
    assert.ok(q.reflectionPrompts.length > 0, `Question ${q.id} must have reflection prompts`);
    assert.ok(q.contemplativeActionEn, `Question ${q.id} must have English contemplative action`);
    assert.ok(q.contemplativeActionHi, `Question ${q.id} must have Hindi contemplative action`);

    // Verify verse structure
    for (const v of q.primaryVerses) {
      assert.ok(v.scriptureId, 'Verse must have scriptureId');
      assert.ok(v.chapterNumber > 0, 'Verse must have valid chapter');
      assert.ok(v.sanskritDevanagari, 'Verse must have Sanskrit Devanagari');
      assert.ok(v.translationHi, 'Verse must have Hindi translation');
      assert.ok(v.translationEn, 'Verse must have English translation');
      assert.ok(v.readerHref.startsWith('/scripture/'), 'Verse must have valid readerHref');
    }
  }

  // Lookup and search
  const whoAmI = getQuestionById('who-am-i');
  assert.ok(whoAmI, 'Must resolve who-am-i');
  assert.equal(whoAmI?.category, 'identity');

  const angerResults = searchQuestions('anger');
  assert.ok(angerResults.some((q) => q.id === 'how-do-i-control-anger'), 'Must find anger question');
  console.log('✓ Questions Engine: 10 canonical questions validated.');
}

function testEmotions() {
  console.log('Testing WOS Emotions Engine...');
  assert.equal(CORE_EMOTIONS.length, 10, 'Must have exactly 10 core emotional portals');

  for (const emo of CORE_EMOTIONS) {
    assert.ok(emo.id, 'Emotion must have id');
    assert.ok(emo.emotionEn, 'Emotion must have English title');
    assert.ok(emo.emotionHi, 'Emotion must have Hindi title');
    assert.ok(emo.sanskritTerm, 'Emotion must have Sanskrit term');
    assert.ok(emo.rootInsightEn, 'Emotion must have root insight');
    assert.ok(emo.pauseExercise.durationSeconds >= 30, 'Pause exercise must be at least 30s');
    assert.ok(emo.primaryVerses.length > 0, 'Emotion must have primary verses');
    assert.ok(emo.reflectionQuestions.length > 0, 'Emotion must have reflection questions');
    assert.ok(emo.practicalActions.length > 0, 'Emotion must have practical actions');
  }

  const anxious = getEmotionById('anxious');
  assert.ok(anxious, 'Must resolve anxious');
  assert.equal(anxious?.pauseExercise.durationSeconds, 90);

  const searchResults = searchEmotions('शोक');
  assert.ok(searchResults.some((e) => e.id === 'grieving'), 'Must find grieving by Hindi term');
  console.log('✓ Emotions Engine: 10 emotional entry points validated.');
}

function testJourneys() {
  console.log('Testing WOS Journeys Engine...');
  assert.equal(WISDOM_JOURNEYS.length, 8, 'Must have 8 core structured pathways');

  const requiredIds = [
    '7-days-inner-calm',
    '21-days-bhagavad-gita',
    'overcoming-fear-through-dharma',
    'finding-purpose',
    'discipline-and-self-mastery',
    'understanding-karma',
    'emotional-balance',
    'detachment-without-indifference',
  ];

  for (const id of requiredIds) {
    const journey = getJourneyById(id);
    assert.ok(journey, `Must find journey ${id}`);
    assert.ok(journey.steps.length > 0, `Journey ${id} must have steps`);

    // Verify 5-step daily pedagogy on Day 1
    const step1 = journey.steps[0]!;
    assert.equal(step1.dayNumber, 1);
    assert.ok(step1.verse.sanskritDevanagari, 'Step 1: Read must have Sanskrit verse');
    assert.ok(step1.reflectionInsightEn, 'Step 2: Reflect must have insight');
    assert.ok(step1.reflectionPromptEn, 'Step 2: Reflect must have prompt');
    assert.ok(step1.contemplativePracticeEn, 'Step 3: Practice must have instructions');
    assert.ok(step1.practiceDurationSeconds >= 60, 'Step 3: Practice must have duration');
    assert.ok(step1.dailyMicroActionEn, 'Step 4: Apply must have micro-action');
    assert.ok(step1.eveningCheckInPromptEn, 'Step 5: Review must have evening check-in');
  }
  console.log('✓ Journeys Engine: 8 structured pathways with 5-phase daily pedagogy validated.');
}

function testDailyWisdom() {
  console.log('Testing Daily Wisdom Sacred Rhythm...');
  const today = new Date('2026-10-24T12:00:00Z');
  const bundle = getDailyWisdom(today);

  assert.equal(bundle.date, '2026-10-24');
  assert.ok(bundle.verse.citation, 'Daily wisdom must have verse citation');
  assert.ok(bundle.reflectionEn, 'Daily wisdom must have reflection');
  assert.ok(bundle.questionOfTheDayEn, 'Daily wisdom must have question of the day');
  assert.ok(bundle.practiceOfTheDayEn, 'Daily wisdom must have practice of the day');
  assert.ok(bundle.sacredNoteEn, 'Daily wisdom must have sacred quiet-exit note');

  // Verify determinism: same date produces same bundle
  const bundle2 = getDailyWisdom(today);
  assert.equal(bundle.verse.citation, bundle2.verse.citation);
  console.log('✓ Daily Wisdom: Date-deterministic sacred rhythm validated.');
}

function testContextualEngine() {
  console.log('Testing Contextual Wisdom Engine...');
  const recommendations = generateWisdomRecommendations({
    recentVerseIds: [],
    bookmarkedVerseIds: [],
    exploredQuestionIds: ['who-am-i'],
    exploredEmotionIds: ['anxious'],
    viewedTopicSlugs: [],
  });

  assert.ok(recommendations.length > 0, 'Contextual engine must generate recommendations');
  for (const rec of recommendations) {
    assert.ok(rec.reasonEn.includes('Recommended because') || rec.reasonEn.includes('Suggested for reflection'),
      'Recommendation must be transparent and explainable');
    assert.ok(rec.href.startsWith('/scripture/'), 'Recommendation must link to primary scripture');
  }
  console.log('✓ Contextual Engine: Transparent and explainable recommendations validated.');
}

function testGuidedReflections() {
  console.log('Testing Guided Reflection Prompts...');
  assert.equal(CANONICAL_REFLECTION_PROMPTS.length, 4, 'Must have 4 canonical reflection prompts');
  const types = CANONICAL_REFLECTION_PROMPTS.map((p) => p.type);
  assert.ok(types.includes('insight'), 'Must include insight prompt');
  assert.ok(types.includes('resonance'), 'Must include resonance prompt');
  assert.ok(types.includes('action'), 'Must include action prompt');
  assert.ok(types.includes('challenge'), 'Must include challenge prompt');

  const actionPrompt = getReflectionPrompt('action');
  assert.equal(actionPrompt.type, 'action');
  console.log('✓ Guided Reflection: 4 canonical prompts validated.');
}

function testWellbeingModes() {
  console.log('Testing Attentional Wellbeing Modes...');
  const modes = Object.keys(ATTENTIONAL_MODE_CONFIGS);
  assert.equal(modes.length, 8, 'Must configure standard + 7 attentional modes');

  const focus = ATTENTIONAL_MODE_CONFIGS.focus;
  assert.equal(focus.hideNavigation, true, 'Focus mode must hide navigation');
  assert.equal(focus.hideChrome, true, 'Focus mode must hide chrome');

  const detox = ATTENTIONAL_MODE_CONFIGS['digital-detox'];
  assert.equal(detox.encourageScreenClose, true, 'Digital detox mode must encourage closing the screen');
  console.log('✓ Attentional Modes: 7 wellbeing modes configured with attentional boundaries.');
}

function testEthicalAnalytics() {
  console.log('Testing Ethical Wisdom Analytics...');
  const analytics = computeEthicalAnalytics(28);
  assert.equal(analytics.windowDays, 28);
  assert.equal(typeof analytics.studyHoursTotal, 'number');
  assert.equal(typeof analytics.studyMinutesTotal, 'number');
  assert.equal(typeof analytics.activeReadingDaysCount, 'number');
  assert.equal(typeof analytics.reflectionsWrittenCount, 'number');

  // Verify strict absence of gamification / streak metrics
  const keys = Object.keys(analytics);
  assert.equal(keys.includes('currentStreak'), false, 'Must NEVER have daily streak counter');
  assert.equal(keys.includes('longestStreak'), false, 'Must NEVER have longest streak counter');
  assert.equal(keys.includes('xpPoints'), false, 'Must NEVER have XP points');
  assert.equal(keys.includes('badgesEarned'), false, 'Must NEVER have badges earned');
  console.log('✓ Ethical Analytics: Validated zero streaks and zero vanity metrics.');
}

function testSEOUniverse() {
  console.log('Testing SEO Knowledge Universe...');
  assert.ok(SEO_WISDOM_CLUSTERS.length >= 7, 'Must have at least 7 high-intent SEO clusters');

  const gitaFear = SEO_WISDOM_CLUSTERS.find((c) => c.slug === 'gita-on-fear');
  assert.ok(gitaFear, 'Must have gita-on-fear cluster');
  assert.ok(gitaFear.faqList.length > 0, 'Cluster must have FAQs');

  const jsonLd = generateFAQJsonLd(gitaFear);
  assert.equal(jsonLd['@type'], 'FAQPage');
  assert.ok(Array.isArray(jsonLd.mainEntity));
  console.log('✓ SEO Universe: Clusters and FAQPage schema generation validated.');
}

function main() {
  console.log('=== Dharma Granth: Wisdom Operating System (WOS) Test Suite ===\n');
  testQuestions();
  testEmotions();
  testJourneys();
  testDailyWisdom();
  testContextualEngine();
  testGuidedReflections();
  testWellbeingModes();
  testEthicalAnalytics();
  testSEOUniverse();
  console.log('\nAll WOS Architecture & Engine Tests PASSED successfully! 🕉️');
}

main();
