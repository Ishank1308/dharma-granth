'use client';

import type { PedagogicalVerseData } from '@/data/pedagogical-gita-2-47';
import type { UnderstandingExtras } from '@/data/understanding';
import { useReaderSettings } from '@/lib/useReaderSettings';
import {
  BeforeAfter,
  ContextTimeline,
  ExampleTabs,
  ExplainCard,
  Misunderstanding,
  TeachingFlow,
  Verse30,
} from './primitives';
import { PauseAndThink } from './PauseAndThink';
import { ExplanationFeedback } from './ExplanationFeedback';
import { WordExplorer } from './WordExplorer';
import { ShareCardButton } from './ShareCard';

/**
 * "How would you like to understand this verse?" (spec §1–2).
 * Quick / Simple / Deep change only what sits below the verse; the verse
 * itself stays on screen above. The choice is remembered on this device (Reader settings → Reading mode).
 */

type Mode = 'quick' | 'simple' | 'deep' | 'traditional';


function Bilingual({ en, hi }: { en?: string; hi?: string }) {
  return (
    <>
      {hi && <p lang="hi" className="font-devanagari">{hi}</p>}
      {en && <p className="text-dharma-text-secondary">{en}</p>}
    </>
  );
}

export function UnderstandPanel({
  data,
  extras,
  refKey,
  reference,
  translation,
  translationIsAi,
  previousHref,
  nextHref,
  pageUrl,
}: {
  data: PedagogicalVerseData;
  extras?: UnderstandingExtras;
  refKey: string;
  reference: string;
  translation?: string;
  translationIsAi?: boolean;
  previousHref?: string;
  nextHref?: string;
  pageUrl: string;
}) {
  const { settings, reducedMotion } = useReaderSettings();
  const mode: Mode = settings.readerMode;

  const c = data.traditionalCommentary;
  const s = data.sourceTransparency;
  const commentators = c ? [c.shankara, c.ramanuja, c.sridhara] : [];

  return (
    <section id="understand-h" aria-labelledby="understand-title" data-calm={reducedMotion ? '' : undefined} className="mt-8">
      <style>{`
        .understand-fade{animation:understand-in .35s ease-out backwards}
        @keyframes understand-in{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
        @media (prefers-reduced-motion:reduce){.understand-fade{animation:none}}
        [data-calm] .understand-fade{animation:none}
      `}</style>

      <h2 id="understand-title" className="sr-only">Explanation: {mode}</h2>

      <div className="mt-3">
        <ShareCardButton sanskrit={data.sanskrit} reference={reference} referenceSanskrit={data.scriptureTitleSanskrit} meaning={data.inOneLineEn} translation={translation} translationIsAi={translationIsAi} url={pageUrl} />
      </div>

      <div role="tabpanel" id="mode-panel" aria-labelledby={`mode-${mode}`} className="mt-4 space-y-4" key={mode}>
        {mode === 'quick' && (
          <>
            {extras && <Verse30 data={extras.thirtySeconds} />}
            <ExplainCard kind="oneLine" title="In one line" titleHi="एक पंक्ति में" label="simple">
              <p lang="hi" className="font-devanagari text-lg font-medium">{data.inOneLineHi}</p>
              <p className="text-dharma-text-secondary">{data.inOneLineEn}</p>
            </ExplainCard>
            {extras && (
              <>
                <ExplainCard kind="example" title="A relatable situation" titleHi="एक परिचित स्थिति" label="modern">
                  <Bilingual en={extras.quick.situation} hi={extras.quick.situationHi} />
                </ExplainCard>
                <ExplainCard kind="try" title="Try this today" titleHi="आज आज़माएँ" label="practical">
                  <Bilingual en={extras.quick.action} hi={extras.quick.actionHi} />
                </ExplainCard>
              </>
            )}
            <PauseAndThink
              refKey={refKey}
              reference={reference}
              question={extras?.quick.question ?? data.reflectionQuestion.en}
              questionHi={extras?.quick.questionHi ?? data.reflectionQuestion.hi}
            />
          </>
        )}

        {mode === 'simple' && (
          <>
            {extras?.contextTimeline && (
              <ContextTimeline
                steps={extras.contextTimeline.steps}
                previousHref={previousHref}
                passageHref={extras.contextTimeline.passageHref}
                dialogue={extras.contextTimeline.dialogue}
                nextHref={nextHref}
              />
            )}
            <ExplainCard kind="oneLine" title="In one line" titleHi="एक पंक्ति में" label="simple">
              <p lang="hi" className="font-devanagari text-lg font-medium">{data.inOneLineHi}</p>
              <p className="text-dharma-text-secondary">{data.inOneLineEn}</p>
            </ExplainCard>
            <ExplainCard kind="simple" title="Simple meaning" titleHi="सरल अर्थ" label="simple">
              <p lang="hi" className="font-devanagari">{data.simpleMeaningHi}</p>
              <p className="text-dharma-text-secondary">{data.simpleMeaningEn}</p>
            </ExplainCard>
            {data.keyWords.length > 0 && <WordExplorer words={data.keyWords} />}
            {extras?.teachingFlow && <TeachingFlow steps={extras.teachingFlow} />}
            {data.whyItMattersToday.length > 0 && (
              <ExplainCard kind="why" title="Why it matters today" titleHi="आज इसका महत्त्व" label="modern">
                <ul className="space-y-3">
                  {data.whyItMattersToday.slice(0, 3).map((w) => (
                    <li key={w.title}>
                      <p lang="hi" className="font-devanagari font-semibold">{w.titleHi}</p>
                      <p className="text-dharma-text-secondary">{w.text}</p>
                    </li>
                  ))}
                </ul>
              </ExplainCard>
            )}
            {extras?.examples && extras.examples.length > 0 ? (
              <ExampleTabs examples={extras.examples} />
            ) : (
              <ExplainCard kind="example" title="Modern example" titleHi="आधुनिक उदाहरण" label="modern">
                <p lang="hi" className="font-devanagari font-semibold">{data.modernExample.contextHi}</p>
                <p lang="hi" className="font-devanagari">{data.modernExample.scenarioHi}</p>
                <p className="text-dharma-text-secondary">{data.modernExample.scenarioEn}</p>
              </ExplainCard>
            )}
            {extras?.beforeAfter && <BeforeAfter {...extras.beforeAfter} />}
            {extras?.misunderstanding && <Misunderstanding {...extras.misunderstanding} />}
            <ExplainCard kind="notMean" title="What it does not mean" titleHi="यह क्या नहीं कहता" label="editorial">
              <ul className="space-y-2">
                {data.whatItDoesNotMean.map((n) => (
                  <li key={n.title}>
                    <p className="font-semibold">{n.title.replace(/^It does NOT mean:\s*/i, 'Not: ')}</p>
                    <p className="text-dharma-muted">{n.text}</p>
                  </li>
                ))}
              </ul>
            </ExplainCard>
            <ExplainCard kind="try" title="Try this today" titleHi="आज आज़माएँ" label="practical">
              <p className="font-semibold">{data.tryThisToday.title} <span className="font-normal text-dharma-muted">· {data.tryThisToday.duration}</span></p>
              <Bilingual en={data.tryThisToday.instructionEn} hi={data.tryThisToday.instructionHi} />
            </ExplainCard>
            <PauseAndThink refKey={refKey} reference={reference} question={data.reflectionQuestion.en} questionHi={data.reflectionQuestion.hi} />
            <ExplanationFeedback refKey={refKey} reference={reference} />
          </>
        )}

        {(mode === 'deep' || mode === 'traditional') && (
          <>
            {extras?.contextTimeline && (
              <ContextTimeline
                steps={extras.contextTimeline.steps}
                previousHref={previousHref}
                passageHref={extras.contextTimeline.passageHref}
                dialogue={extras.contextTimeline.dialogue}
                nextHref={nextHref}
              />
            )}
            <ExplainCard kind="simple" title="Word by word" titleHi="शब्दार्थ" label="simple">
              <ul className="divide-y divide-dharma-border">
                {data.keyWords.map((w) => (
                  <li key={w.iast} className="py-2.5">
                    <p>
                      <span lang="sa" className="font-devanagari text-lg">{w.pada.split(' (')[0]}</span>{' '}
                      <span className="text-sm italic text-dharma-muted">{w.iast}</span>
                    </p>
                    <p lang="hi" className="font-devanagari text-sm text-dharma-muted">{w.root}</p>
                    <p>{w.functionalMeaning}</p>
                    <p lang="hi" className="font-devanagari text-dharma-muted">{w.functionalMeaningHi}</p>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-dharma-muted">
                Sandhi separation and a full grammar table are not yet prepared for this verse. The verse above is the verified text.
              </p>
            </ExplainCard>
            {commentators.length === 0 && (
              <ExplainCard kind="commentary" title="Traditional commentary" label="traditional">
                <p className="text-sm text-dharma-muted">No reviewed commentary summary has been added for this verse yet. Nothing is shown rather than an unchecked summary.</p>
              </ExplainCard>
            )}
            {commentators.map((x) => (
              <ExplainCard key={x.author} kind="commentary" title={x.author} label="traditional">
                <p className="text-sm text-dharma-muted">{x.tradition} · <span className="italic">{x.work}</span></p>
                <Bilingual en={x.summaryEn} hi={x.summaryHi} />
              </ExplainCard>
            ))}
            <ExplainCard kind="commentary" title="Sources and edition" titleHi="स्रोत" label="traditional">
              <dl className="grid gap-x-4 gap-y-1.5 text-sm sm:grid-cols-[9rem_1fr]">
                {([
                  ['Scripture', s.scripture],
                  ['Reference', s.reference],
                  ['Context', s.epicContext],
                  ['Meter', s.meter],
                  ['Authority', s.epistemicTier],
                ] as const).map(([k, v]) => (
                  <div key={k} className="contents">
                    <dt className="font-semibold text-dharma-muted">{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="text-sm italic text-dharma-muted">{s.editorialNote}</p>
            </ExplainCard>
          </>
        )}
      </div>
    </section>
  );
}
