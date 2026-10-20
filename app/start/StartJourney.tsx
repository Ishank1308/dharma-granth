'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Compass,
  BookOpen,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Clock,
  EyeOff,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  Tag,
  Flame,
} from 'lucide-react';
import {
  buildRecommendations,
  JOURNEY_KEY,
  type DiscoverAnswers,
  type RecommendationSuite,
  type Interest,
  type Challenge,
  type Familiarity,
  type TimePref,
  type FormatPref,
} from '@/data/journeys';
import { useReaderSettings } from '@/lib/useReaderSettings';

interface QuestionDef {
  key: keyof DiscoverAnswers;
  en: string;
  hi: string;
  options: Array<{
    value: string;
    en: string;
    hi: string;
    icon?: string;
  }>;
}

const DISCOVERY_QUESTIONS: QuestionDef[] = [
  {
    key: 'interest',
    en: '1. What interests you most?',
    hi: '1. आप किस विषय में सबसे अधिक रुचि रखते हैं?',
    options: [
      { value: 'practical', en: 'Practical wisdom', hi: 'दैनिक जीवन में विवेक', icon: '🌱' },
      { value: 'devotion', en: 'Devotion and prayer', hi: 'भक्ति और समर्पण', icon: '🙏' },
      { value: 'self_knowledge', en: 'Self-knowledge', hi: 'आत्म-ज्ञान (आत्मा व ब्रह्म)', icon: '💡' },
      { value: 'meditation', en: 'Meditation and stillness', hi: 'ध्यान और शांति', icon: '🧘' },
      { value: 'stories', en: 'Stories and characters', hi: 'कथाएँ और चरित्र', icon: '📜' },
      { value: 'sanskrit', en: 'Learning Sanskrit', hi: 'श्लोकों से संस्कृत', icon: '🕉️' },
      { value: 'practice', en: 'Daily practice', hi: 'नित्य साधना', icon: '🕯️' },
    ],
  },
  {
    key: 'challenge',
    en: '2. What would you like help understanding?',
    hi: '2. आप किस मानवीय विषय पर मार्गदर्शन चाहते हैं?',
    options: [
      { value: 'duty', en: 'Duty and right action', hi: 'कर्तव्य और धर्म', icon: '⚖️' },
      { value: 'uncertainty', en: 'Uncertainty and anxiety', hi: 'अनिश्चितता और भय', icon: '🛡️' },
      { value: 'focus', en: 'Focus and discipline', hi: 'एकाग्रता और संकल्प', icon: '🎯' },
      { value: 'relationships', en: 'Relationships and compassion', hi: 'संबंध और करुणा', icon: '🤝' },
      { value: 'courage', en: 'Inner courage and resilience', hi: 'साहस और धैर्य', icon: '🦁' },
      { value: 'self', en: 'The nature of the Self', hi: 'स्वयं का स्वरूप (आत्म-तत्व)', icon: '✨' },
      { value: 'god', en: 'God and devotion', hi: 'ईश्वर और समर्पण भाव', icon: '🌸' },
    ],
  },
  {
    key: 'familiarity',
    en: '3. How familiar are you with scriptures?',
    hi: '3. शास्त्रों से आपका परिचय कितना है?',
    options: [
      { value: 'new', en: 'Completely new (first-time reader)', hi: 'प्रथम परिचय (नया पाठक)' },
      { value: 'some', en: 'Some familiarity (heard verses or stories)', hi: 'थोड़ा परिचय' },
      { value: 'regular', en: 'Regular reader (read chapters before)', hi: 'नियमित पाठक' },
      { value: 'deep', en: 'Deep study (traditional commentaries)', hi: 'गहन अध्ययन' },
    ],
  },
  {
    key: 'time',
    en: '4. How much time do you have?',
    hi: '4. आप दैनिक कितना समय देना चाहेंगे?',
    options: [
      { value: '5', en: '5 minutes a day', hi: '5 मिनट' },
      { value: '10', en: '10 minutes a day', hi: '10 मिनट' },
      { value: '20', en: '20 minutes a day', hi: '20 मिनट' },
      { value: 'deep', en: 'Longer study sessions', hi: 'विस्तृत अध्ययन' },
    ],
  },
  {
    key: 'format',
    en: '5. What format do you prefer?',
    hi: '5. आपको किस रूप में अध्ययन पसंद है?',
    options: [
      { value: 'reading', en: 'Reading text with simple explanations', hi: 'पढ़ना (सरल भावार्थ सहित)' },
      { value: 'audio', en: 'Listening to chanted pronunciation', hi: 'सुनना (मंत्र उच्चारण सहित)' },
      { value: 'visual', en: 'Visual diagrams and teaching flows', hi: 'चित्र व दृश्य प्रवाह' },
      { value: 'mixed', en: 'A balanced mixed format', hi: 'मिश्रित रूप' },
    ],
  },
];

type AnswersDraft = Partial<Record<keyof DiscoverAnswers, string>>;

export function StartJourney() {
  const { update } = useReaderSettings();
  const [draft, setDraft] = useState<AnswersDraft>({});
  const [savedSuite, setSavedSuite] = useState<RecommendationSuite | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [personalizationDisabled, setPersonalizationDisabled] = useState(false);
  const [dismissedCategories, setDismissedCategories] = useState<string[]>([]);
  const [notice, setNotice] = useState<string>('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(JOURNEY_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as DiscoverAnswers;
        setDraft(parsed);
        const suite = buildRecommendations(parsed);
        setSavedSuite(suite);
      }
    } catch {}
    setLoaded(true);
  }, []);

  const isFormComplete = DISCOVERY_QUESTIONS.every((q) => Boolean(draft[q.key]));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormComplete) return;

    const answers = draft as unknown as DiscoverAnswers;
    try {
      localStorage.setItem(JOURNEY_KEY, JSON.stringify(answers));
    } catch {}

    // Apply gentle reader settings without taking over the screen
    update(
      'readerMode',
      answers.time === '5' ? 'quick' : answers.familiarity === 'deep' ? 'deep' : 'simple'
    );

    const suite = buildRecommendations(answers);
    setSavedSuite(suite);
    setDismissedCategories([]);
    showNotice('Preferences saved locally. Here are your recommendations.');
  };

  const handleResetPreferences = () => {
    try {
      localStorage.removeItem(JOURNEY_KEY);
    } catch {}
    setSavedSuite(null);
    setDraft({});
    setDismissedCategories([]);
    showNotice('Preferences reset.');
  };

  const handleDismissCategory = (category: string) => {
    setDismissedCategories((prev) => [...prev, category]);
    showNotice(`${category} dismissed from view.`);
  };

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(''), 3000);
  };

  return (
    <main id="main" className="mx-auto max-w-4xl px-4 sm:px-6 py-10 space-y-8 animate-fade-in text-dharma-text">
      {/* ── Title & Ethical Philosophy Header ───────────────────────── */}
      <header className="space-y-3 pb-6 border-b border-dharma-border">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-lg bg-saffron-100 dark:bg-saffron-950/60 text-saffron-700 dark:text-saffron-300">
            <Compass className="w-5 h-5" />
          </span>
          <span className="text-xs uppercase tracking-wider font-bold text-saffron-700 dark:text-saffron-400">
            Interactive Orientation · अध्ययन मार्ग खोजें
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-dharma-text">
          Discover Your Path
        </h1>
        <p lang="hi" className="font-devanagari text-lg text-dharma-muted">
          अपना अध्ययन मार्ग खोजें
        </p>

        <p className="text-sm sm:text-base text-dharma-muted max-w-2xl leading-relaxed">
          Help beginners find a serene starting point without requiring you to understand scripture categories, philosophical schools, or Sanskrit terms. No account required.
        </p>

        {/* Ethical Non-Classification Notice */}
        <aside
          aria-label="Privacy and Non-Classification Notice"
          className="rounded-2xl border border-dharma-border bg-dharma-card p-4 text-xs text-dharma-muted flex items-start gap-3"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Calm & Private:</strong> We do not classify you spiritually, assign religious labels, or claim to determine your &quot;true spiritual path&quot;. Your answers stay in this browser only and can be reset anytime.
          </p>
        </aside>
      </header>

      {/* Live Toast Notice */}
      {notice && (
        <div
          role="status"
          aria-live="polite"
          className="rounded-xl bg-saffron-50 dark:bg-saffron-950/40 border border-saffron-200 dark:border-saffron-900/50 p-3 text-xs text-saffron-900 dark:text-saffron-200 flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-saffron-600" />
          {notice}
        </div>
      )}

      {/* ── RESULTS PAGE: 5 DISTINCT RECOMMENDATION TILES ─────────── */}
      {savedSuite && !personalizationDisabled ? (
        <section aria-labelledby="recommendations-heading" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-dharma-border">
            <div>
              <p className="text-xs uppercase tracking-wider font-bold text-emerald-700 dark:text-emerald-400">
                Recommended Starting Points
              </p>
              <h2 id="recommendations-heading" className="font-serif text-2xl font-bold text-dharma-text mt-0.5">
                This may be a helpful place to begin
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setSavedSuite(null)}
              className="focus-ring inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-dharma-border bg-dharma-card hover:border-saffron-400 text-xs font-semibold text-dharma-text transition-colors self-start sm:self-center"
            >
              Change Answers
            </button>
          </div>

          <p className="text-xs text-dharma-muted italic bg-dharma-card p-3 rounded-xl border border-dharma-border">
            {savedSuite.explanationSummary}
          </p>

          {/* 5 Recommendation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              savedSuite.primaryJourney,
              savedSuite.scripture,
              savedSuite.concept,
              savedSuite.dailyPractice,
              savedSuite.alternativePath,
            ]
              .filter((rec) => !dismissedCategories.includes(rec.category))
              .map((rec, i) => (
                <article
                  key={rec.id}
                  className={`rounded-3xl border border-dharma-border bg-dharma-card p-6 flex flex-col justify-between shadow-sm hover:border-saffron-400 transition-all ${
                    rec.category === 'Primary Reading Journey' ? 'md:col-span-2 bg-gradient-to-br from-dharma-card to-dharma-bg' : ''
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-bold uppercase tracking-wider text-saffron-800 dark:text-saffron-300 text-[10px] bg-saffron-50 dark:bg-saffron-950/40 px-2.5 py-0.5 rounded-full border border-saffron-200 dark:border-saffron-900/40">
                        {rec.category} · {rec.categoryHi}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDismissCategory(rec.category)}
                        className="text-[11px] text-dharma-muted hover:text-dharma-text"
                        title="Dismiss this recommendation"
                      >
                        Dismiss
                      </button>
                    </div>

                    <h3 className="font-serif text-lg sm:text-xl font-bold text-dharma-text mt-1">
                      {rec.title}
                    </h3>
                    <p lang="hi" className="font-devanagari text-xs text-dharma-muted">
                      {rec.titleHi}
                    </p>

                    <p className="text-xs sm:text-sm text-dharma-muted mt-2 leading-relaxed">
                      {rec.summary}
                    </p>

                    <div className="mt-3 p-3 rounded-xl bg-dharma-bg border border-dharma-border text-xs text-dharma-text">
                      <span className="font-semibold text-dharma-text">Why:</span> {rec.reason}
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-dharma-border/60 flex items-center justify-between">
                    <Link
                      href={rec.href}
                      className="focus-ring inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-semibold text-xs transition-colors shadow-2xs"
                    >
                      Begin Here
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
          </div>

          {/* Action Toolbar */}
          <div className="pt-4 border-t border-dharma-border flex flex-wrap items-center justify-between gap-3 text-xs text-dharma-muted">
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/journeys"
                className="hover:text-dharma-text underline focus-ring"
              >
                Explore All Guided Paths
              </Link>
              <span>·</span>
              <button
                type="button"
                onClick={() => setPersonalizationDisabled(true)}
                className="hover:text-dharma-text underline focus-ring"
              >
                Disable Personalization
              </button>
            </div>

            <button
              type="button"
              onClick={handleResetPreferences}
              className="text-red-600 hover:text-red-700 underline focus-ring flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset All Preferences
            </button>
          </div>
        </section>
      ) : (
        /* ── 5 QUESTION DISCOVERY FORM ──────────────────────────────── */
        <form onSubmit={handleSubmit} className="space-y-6">
          {DISCOVERY_QUESTIONS.map((q) => (
            <fieldset
              key={q.key}
              className="rounded-3xl border border-dharma-border bg-dharma-card p-6 shadow-sm space-y-3"
            >
              <legend className="px-1 font-serif text-base sm:text-lg font-bold text-dharma-text">
                {q.en}{' '}
                <span lang="hi" className="font-devanagari text-sm font-normal text-dharma-muted block sm:inline">
                  · {q.hi}
                </span>
              </legend>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {q.options.map((o) => {
                  const isChecked = draft[q.key] === o.value;
                  return (
                    <label
                      key={o.value}
                      className={`flex min-h-[48px] cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-xs sm:text-sm transition-all focus-within:ring-2 focus-within:ring-saffron-500 ${
                        isChecked
                          ? 'border-saffron-600 bg-saffron-50/80 dark:bg-saffron-950/40 text-saffron-950 dark:text-saffron-100 font-semibold shadow-2xs'
                          : 'border-dharma-border bg-dharma-bg text-dharma-text hover:border-dharma-border-hover'
                      }`}
                    >
                      <input
                        type="radio"
                        name={q.key}
                        value={o.value}
                        checked={isChecked}
                        onChange={() => setDraft({ ...draft, [q.key]: o.value })}
                        className="h-4 w-4 accent-saffron-600"
                      />
                      <div className="flex items-center gap-2">
                        {o.icon && <span className="text-base">{o.icon}</span>}
                        <span>
                          {o.en}{' '}
                          <span lang="hi" className="font-devanagari text-dharma-muted text-xs block sm:inline">
                            · {o.hi}
                          </span>
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ))}

          {/* Submit & Fallback Navigation */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={!isFormComplete}
                className="focus-ring min-h-[48px] px-8 rounded-xl bg-saffron-600 hover:bg-saffron-700 disabled:opacity-40 text-white font-semibold text-sm transition-all shadow-sm flex items-center gap-2"
              >
                <span>Find My Starting Points</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                href="/scriptures"
                className="text-xs text-dharma-muted hover:text-dharma-text underline focus-ring"
              >
                Skip and browse library directly
              </Link>
            </div>

            {!isFormComplete && (
              <p className="text-xs text-dharma-muted">
                Please answer all five short questions to see personalized suggestions.
              </p>
            )}
          </div>
        </form>
      )}
    </main>
  );
}
