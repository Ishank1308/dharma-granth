import Link from 'next/link';
import { Compass, BookOpen, Sparkles, ArrowRight } from 'lucide-react';
import { getConceptDetail } from '@/data/concept-details';
import type {
  IntegratedConcept,
  IntegratedTopic,
  CrossScriptureVerse,
} from '@/lib/verse-integrations';

const isCompleteShloka = (s?: string) => Boolean(s && /॥/.test(s));

interface Props {
  concepts: IntegratedConcept[];
  topics: IntegratedTopic[];
  crossReferences: CrossScriptureVerse[];
  currentScriptureTitle: string;
}

export function VerseRelatedSection({
  concepts,
  topics,
  crossReferences,
  currentScriptureTitle,
}: Props) {
  const hasConcepts = concepts.length > 0;
  const hasTopics = topics.length > 0;
  const hasCrossRefs = crossReferences.length > 0;

  if (!hasConcepts && !hasTopics && !hasCrossRefs) {
    return null;
  }

  return (
    <section className="mt-12 space-y-10" aria-label="संबंधित ज्ञान व संदर्भ">
      {/* ── 1. Philosophical Concepts ─────────────────────────────── */}
      {hasConcepts && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-serif text-xl font-bold text-dharma-text">
              <Compass className="h-5 w-5 text-saffron-600" aria-hidden="true" />
              <span>संबंधित दार्शनिक अवधारणाएं (Philosophical Concepts)</span>
            </h2>
            <Link
              href="/concepts"
              className="inline-flex min-h-[44px] items-center gap-1 text-xs font-semibold text-saffron-700 transition hover:text-saffron-800 dark:text-saffron-400"
            >
              <span>ज्ञान ग्राफ</span>
              <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {concepts.map((concept) => {
              const hasPage = Boolean(getConceptDetail(concept.id));
              return (
              <Link
                key={concept.id}
                href={hasPage ? `/concepts/${concept.id}` : '/concepts'}
                className="group relative flex flex-col justify-between rounded-2xl border border-dharma-border bg-dharma-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-saffron-300 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl" aria-hidden="true">
                        {concept.icon}
                      </span>
                      <h3 className="font-serif font-bold text-dharma-text group-hover:text-saffron-700 transition-colors">
                        {concept.label}
                      </h3>
                    </div>
                    <span
                      lang="sa"
                      className="font-devanagari text-sm font-semibold text-saffron-700 dark:text-saffron-400"
                    >
                      {concept.sanskrit}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-dharma-muted">
                    {concept.shortDesc}
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-1 text-[11px] font-medium text-saffron-800 dark:text-saffron-400">
                  <span>{hasPage ? 'अवधारणा विस्तार से जानें' : 'अवधारणा सूची में देखें'}</span>
                  <ArrowRight className="h-3 w-3" aria-hidden="true" />
                </div>
              </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 2. Practical Life Applications (Topics) ───────────────── */}
      {hasTopics && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-serif text-xl font-bold text-dharma-text">
              <Sparkles className="h-5 w-5 text-saffron-600" aria-hidden="true" />
              <span>जीवन व कार्यक्षेत्र में अनुप्रयोग (Practical Applications)</span>
            </h2>
            <Link
              href="/topics"
              className="inline-flex min-h-[44px] items-center gap-1 text-xs font-semibold text-saffron-700 transition hover:text-saffron-800 dark:text-saffron-400"
            >
              <span>सभी विषय</span>
              <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {topics.map((topic) => (
              <Link
                key={topic.id}
                href={`/topics/${topic.id}`}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-dharma-border bg-dharma-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-saffron-300 hover:shadow-md"
              >
                <div
                  className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${topic.gradient}`}
                />
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl" aria-hidden="true">
                      {topic.icon}
                    </span>
                    <h3 className="font-serif text-sm font-bold text-dharma-text group-hover:text-saffron-700 transition-colors">
                      {topic.title}
                    </h3>
                  </div>
                  <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-dharma-muted">
                    {topic.shortDesc}
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-saffron-700 dark:text-saffron-400">
                  <span>मार्गदर्शन पढ़ें</span>
                  <ArrowRight className="h-3 w-3" aria-hidden="true" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── 3. Cross-Scriptural Parallel Verses ─────────────────────── */}
      {hasCrossRefs && (
        <div>
          <div className="mb-4">
            <h2 className="flex items-center gap-2 font-serif text-xl font-bold text-dharma-text">
              <BookOpen className="h-5 w-5 text-saffron-600" aria-hidden="true" />
              <span>समानांतर संदर्भ व श्लोक (Cross-Scriptural Parallels)</span>
            </h2>
            <p className="mt-1 text-xs text-dharma-muted">
              इसी दार्शनिक तत्त्व पर अन्य वैदिक ग्रंथों और उपनिषदों के प्रेरक संदर्भ
            </p>
          </div>

          <div className="space-y-4">
            {crossReferences.map((ref, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-dharma-border bg-dharma-card p-4 transition hover:border-saffron-200"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-dharma-border/60 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-saffron-50 px-2.5 py-0.5 text-[11px] font-bold text-saffron-700 dark:bg-saffron-900/30 dark:text-saffron-300">
                      {ref.conceptLabel}
                    </span>
                    <span className="font-serif text-xs font-bold text-dharma-text">
                      {ref.reference}
                    </span>
                  </div>
                  <Link
                    href={ref.href}
                    className="inline-flex min-h-[44px] items-center gap-1 text-xs font-semibold text-saffron-700 transition hover:text-saffron-800 dark:text-saffron-400"
                  >
                    <span>श्लोक देखें</span>
                    <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </Link>
                </div>

                <div className="mt-3 space-y-2">
                  {/* Concept lists often store only the famous half-line; a shloka is
                      quoted here only when it is complete (closes with ॥). */}
                  {isCompleteShloka(ref.sanskrit) && (
                    <p
                      lang="sa"
                      className="whitespace-pre-line font-devanagari text-sm font-medium leading-relaxed text-dharma-text"
                    >
                      {ref.sanskrit}
                    </p>
                  )}
                  <p className="text-xs italic leading-relaxed text-dharma-muted">
                    &quot;{ref.translation}&quot;
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
