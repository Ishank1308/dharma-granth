'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Bath,
  CheckCircle2,
  Flame,
  Moon,
  RotateCcw,
  Sparkles,
  Sun,
  Sunrise,
} from 'lucide-react';

type PracticeTime = 'morning' | 'midday' | 'evening' | 'night';

interface PracticeStep {
  id: string;
  time: PracticeTime;
  title: string;
  titleHi: string;
  duration: string;
  purpose: string;
  mantraHint: string;
}

const STORAGE_KEY = 'dharma.nityaKarmaKriya.completed';

const timeMeta: Record<
  PracticeTime,
  {
    label: string;
    labelHi: string;
    icon: React.ReactNode;
    className: string;
  }
> = {
  morning: {
    label: 'Morning',
    labelHi: 'प्रातः',
    icon: <Sunrise className="h-4 w-4" />,
    className: 'from-saffron-500 to-amber-500',
  },
  midday: {
    label: 'Midday',
    labelHi: 'मध्याह्न',
    icon: <Sun className="h-4 w-4" />,
    className: 'from-amber-500 to-yellow-500',
  },
  evening: {
    label: 'Evening',
    labelHi: 'सायं',
    icon: <Flame className="h-4 w-4" />,
    className: 'from-orange-600 to-rose-600',
  },
  night: {
    label: 'Night',
    labelHi: 'रात्रि',
    icon: <Moon className="h-4 w-4" />,
    className: 'from-indigo-700 to-slate-800',
  },
};

const steps: PracticeStep[] = [
  {
    id: 'wake-remembrance',
    time: 'morning',
    title: 'Wake with remembrance',
    titleHi: 'स्मरण से दिन आरम्भ',
    duration: '2 मिनट',
    purpose: 'दिन का आरम्भ फ़ोन या कार्य से पहले कृतज्ञता के साथ करें।',
    mantraHint: 'कराग्रे वसते लक्ष्मीं कर्मध्यां कराग्रे वसते',
  },
  {
    id: 'cleanliness',
    time: 'morning',
    title: 'Shaucha and freshening',
    titleHi: 'शौच और शुद्धि',
    duration: '10-20 मिनट',
    purpose: 'स्नान शरीर और मन को शुद्ध करता है, अध्ययन या कार्य के लिए तैयार करता है।',
    mantraHint: 'अपवित्रः पवित्रो वा सर्वावस्थां गतोऽपि वा',
  },
  {
    id: 'surya-water',
    time: 'morning',
    title: 'Surya arghya or sunlight pause',
    titleHi: 'सूर्य अर्घ्य / प्रकाश ध्यान',
    duration: '3-5 मिनट',
    purpose: 'यदि आप इस प्रथा का पालन करते हैं तो जल अर्पण करें, या सुबह की रोशनी में शांत रहें।',
    mantraHint: 'ॐ भास्कराय नमः ॐ आदित्याय नमः ॐ सूर्याय नमः',
  },
  {
    id: 'japa-study',
    time: 'morning',
    title: 'Japa and scripture reading',
    titleHi: 'जप और स्वाध्याय',
    duration: '10-30 मिनट',
    purpose: 'चुने हुए मंत्र का जाप करें और एक श्लोक को धीरे से अर्थ सहित पढ़ें।',
    mantraHint: 'ॐ नमः शिवाय ॐ नमो भगवते वासुदेवाय',
  },
  {
    id: 'food-pause',
    time: 'midday',
    title: 'Mindful food pause',
    titleHi: 'भोजन से पहले कृतज्ञता',
    duration: '1 मिनट',
    purpose: 'खाने से पहले रुकें और भोजन को प्रसाद मानें, केवल खपत नहीं।',
    mantraHint: 'ब्रह्मार्पणं ब्रह्म हविर्ब्रह्माग्नौ ब्रह्मणा हुतं',
  },
  {
    id: 'work-dharma',
    time: 'midday',
    title: 'Karma check',
    titleHi: 'कर्म जांच',
    duration: '2 मिनट',
    purpose: 'पूछें: क्या आज का काम सत्य, उपयोगी और अनावश्यक हानि से मुक्त है?',
    mantraHint: 'सत्यं वद धर्मं चर स्वाध्यायान्मा प्रमदिताः',
  },
  {
    id: 'sandhya-deep',
    time: 'evening',
    title: 'Sandhya deepa',
    titleHi: 'सायं दीप / संध्या स्मरण',
    duration: '5-10 मिनट',
    purpose: 'दीप जलाएं या शांत रहें जब दिन क्रिया से चिंतन की ओर बदलता है।',
    mantraHint: 'दीपज्योतिः परं ब्रह्म दीपो हि सर्वतोमुखः',
  },
  {
    id: 'review-forgive',
    time: 'night',
    title: 'Daily review and forgiveness',
    titleHi: 'दिन की समीक्षा और क्षमा',
    duration: '5 मिनट',
    purpose: 'एक अच्छा कार्य, एक सुधार और सोने से पहले रंज मुक्त करें।',
    mantraHint: 'क्षमायनि यशस्यानि न भूयात्प्रज्ञाया',
  },
];

function getTodayKey(): string {
  return new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

export function NityaKarmaKriya() {
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [activeTime, setActiveTime] = useState<PracticeTime>('morning');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const parsed = JSON.parse(saved) as { date?: string; completedIds?: string[] };
      if (parsed.date === getTodayKey() && Array.isArray(parsed.completedIds)) {
        setCompletedIds(parsed.completedIds);
      }
    } catch {
      // Ignore storage failures.
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ date: getTodayKey(), completedIds }),
      );
    } catch {
      // Ignore storage failures.
    }
  }, [completedIds]);

  const completedSet = useMemo(() => new Set(completedIds), [completedIds]);
  const progress = Math.round((completedSet.size / steps.length) * 100);
  const visibleSteps = steps.filter((step) => step.time === activeTime);

  function toggleStep(id: string) {
    setCompletedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <div className="rounded-2xl border border-dharma-border bg-dharma-card p-5 shadow-xl md:p-8">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-saffron-200 bg-saffron-100 px-4 py-2 text-xs font-bold uppercase tracking-widest text-saffron-800">
              <Sparkles className="h-3.5 w-3.5" />
              नित्य कर्म क्रिया
            </p>
            <h2 className="mt-5 text-3xl font-serif font-bold text-dharma-text md:text-4xl">
              नित्य कर्म क्रिया
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-dharma-muted md:text-base">
              स्मरण, शौच, अध्ययन, सचेत कर्म, सायं चिंतन और विश्राम के लिए एक सरल समझदार दिनचर्या। इसे हल्का रखें: असंगति से अधिक महत्वपूर्ण है।
            </p>

            <div className="mt-6 rounded-xl border border-dharma-border bg-dharma-bg p-5">
              <div className="mb-3 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-dharma-muted">
                    आज की प्रगति
                  </p>
                  <p className="mt-1 text-2xl font-bold text-dharma-text">
                    {completedSet.size}/{steps.length} क्रिया
                  </p>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-saffron-100 text-lg font-bold text-saffron-800 ring-4 ring-saffron-50">
                  {progress}%
                </div>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-saffron-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-saffron-500 to-amber-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <button
                type="button"
                onClick={() => setCompletedIds([])}
                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-dharma-border bg-dharma-card px-3 py-2 text-sm font-semibold text-dharma-muted transition hover:border-saffron-300 hover:text-saffron-700"
              >
                <RotateCcw className="h-4 w-4" />
                आज रीसेट करें
              </button>
            </div>

            <div className="mt-5 rounded-xl border border-dashed border-dharma-border bg-dharma-bg p-4">
              <div className="flex gap-3">
                <Bath className="mt-0.5 h-5 w-5 shrink-0 text-saffron-600" />
                <p className="text-sm leading-relaxed text-dharma-muted">
                  यह एक हल्का शैक्षिक मार्गदर्शन है, कोई कठोर नियम पुस्तिका नहीं।
                  अपने पारिवारिक परंपरा, गुरु, स्वास्थ्य और उपलब्ध समय का पालन करें।
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {(Object.keys(timeMeta) as PracticeTime[]).map((time) => {
                const meta = timeMeta[time];
                const active = activeTime === time;
                const count = steps.filter((step) => step.time === time).length;

                return (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setActiveTime(time)}
                    className={`rounded-xl border p-3 text-left transition ${
                      active
                        ? 'border-saffron-400 bg-saffron-100 text-saffron-900 shadow-sm'
                        : 'border-dharma-border bg-dharma-bg text-dharma-text hover:border-saffron-300'
                    }`}
                  >
                    <span
                      className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br text-white ${meta.className}`}
                    >
                      {meta.icon}
                    </span>
                    <span className="block text-sm font-bold">{meta.labelHi}</span>
                    <span className="block text-xs text-dharma-muted">
                      {meta.label} · {count}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 space-y-3">
              {visibleSteps.map((step) => {
                const done = completedSet.has(step.id);

                return (
                  <article
                    key={step.id}
                    className={`rounded-xl border p-4 transition ${
                      done
                        ? 'border-emerald-300 bg-emerald-50/80'
                        : 'border-dharma-border bg-dharma-bg'
                    }`}
                  >
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => toggleStep(step.id)}
                        aria-label={`Mark ${step.title} complete`}
                        className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition ${
                          done
                            ? 'border-emerald-500 bg-emerald-600 text-white'
                            : 'border-dharma-border bg-dharma-card text-dharma-muted hover:border-saffron-400 hover:text-saffron-700'
                        }`}
                      >
                        <CheckCircle2 className="h-5 w-5" />
                      </button>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <h3 lang="hi" className="font-devanagari text-lg font-bold text-dharma-text">
                              {step.titleHi}
                            </h3>
                            <p className="text-sm text-dharma-muted">
                              {step.title}
                            </p>
                          </div>
                          <span className="rounded-full bg-dharma-card px-2.5 py-1 text-xs font-bold text-dharma-muted ring-1 ring-dharma-border">
                            {step.duration}
                          </span>
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-dharma-muted">
                          {step.purpose}
                        </p>
                        <p lang="sa" className="mt-3 rounded-lg bg-dharma-card px-3 py-2 font-devanagari text-sm text-dharma-text ring-1 ring-dharma-border">
                          {step.mantraHint}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
