import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, BookOpen, FlaskConical, HeartHandshake } from 'lucide-react';
import { JsonLd } from '@/app/components/JsonLd';
import { ANSWER_THEMES, GRANTH_ANSWERS, getGranthAnswer } from '@/data/granth-answers';
import { faqLd, pageLd } from '@/lib/jsonld';
import { groupAnswerVerses, resolveAnswerVerse, type AnswerVerseGroup, type ResolvedAnswerVerse } from '@/lib/granth-answers-server';

const pathFor = (slug: string) => `/ask/${slug}/`;

export const dynamicParams = false;

export function generateStaticParams() {
  return GRANTH_ANSWERS.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const a = getGranthAnswer(params.slug);
  if (!a) return {};
  const title = `${a.questionHi} · ${a.questionEn}`;
  return {
    title: { absolute: `${title} | Dharma Granth` },
    description: `${a.sarEn} ${a.sarHi}`,
    alternates: { canonical: pathFor(a.slug) },
    openGraph: { type: 'article', locale: 'hi_IN', alternateLocale: ['en_US'], title, description: a.sarEn, url: pathFor(a.slug) },
  };
}

function Section({ hi, en, children }: { hi: string; en: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-dharma-border bg-dharma-card p-5 sm:p-7">
      <h2 className="font-serif text-xl font-bold">
        <span lang="hi" className="font-devanagari">{hi}</span>{' '}
        <span className="text-base font-semibold text-dharma-muted">{en}</span>
      </h2>
      <div className="mt-4 grid gap-4">{children}</div>
    </section>
  );
}

function VerseCard({ group }: { group: AnswerVerseGroup }) {
  const joint = group.verses.length > 1;
  return (
    <article className="grid gap-3 rounded-2xl border border-dharma-border bg-dharma-bg/60 p-4 sm:p-5">
      <p className="text-sm font-semibold text-saffron-700">
        <span lang="hi" className="font-devanagari">{group.labelHi}</span>{' '}
        <span className="text-dharma-muted">{group.labelEn}</span>
      </p>
      {group.verses.map((v) => (
        <p key={v.v} lang="sa" className="whitespace-pre-line font-devanagari text-lg leading-relaxed">{v.sanskrit}</p>
      ))}
      <p lang="hi" className="font-devanagari leading-relaxed">{group.hindi}</p>
      {group.verses.map((v) => (
        <p key={v.v} lang="en" className="text-sm leading-relaxed text-dharma-muted">
          {joint && <span className="font-semibold">{v.c}.{v.v} </span>}
          {v.english}
        </p>
      ))}
      <div className="grid gap-2 rounded-xl border-l-4 border-saffron-500 bg-amber-50/60 px-4 py-3 dark:bg-amber-950/20">
        {group.verses.map((v) => (
          <div key={v.v}>
            <p lang="hi" className="font-devanagari text-sm font-semibold">{v.whyHi}</p>
            <p lang="en" className="mt-1 text-sm text-dharma-muted">{v.whyEn}</p>
          </div>
        ))}
      </div>
      {group.verses.filter((v) => v.vyakhya).map((v) => (
        <details key={v.v} className="group rounded-xl border border-dharma-border px-4 py-2">
          <summary className="flex min-h-11 cursor-pointer items-center gap-2 text-sm font-semibold text-saffron-700">
            <span lang="hi">पूरी व्याख्या पढ़ें</span> <span className="font-normal text-dharma-muted">Full explanation{joint ? ` · ${v.labelEn}` : ''}</span>
          </summary>
          <p lang="hi" className="whitespace-pre-line pb-2 pt-1 font-devanagari text-sm leading-relaxed">{v.vyakhya}</p>
        </details>
      ))}
      <Link href={group.verses[0].href} className="inline-flex min-h-11 items-center justify-self-end text-xs text-dharma-muted underline underline-offset-2 hover:text-saffron-700">
        <span lang="hi">श्लोक पृष्ठ</span>&nbsp;<span>· verse page</span>
      </Link>
    </article>
  );
}

export default async function GranthAnswerPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const answer = getGranthAnswer(params.slug);
  if (!answer) notFound();
  const path = pathFor(answer.slug);
  const verses = answer.verses.map(resolveAnswerVerse).filter((v): v is ResolvedAnswerVerse => v !== null);
  const groups = groupAnswerVerses(verses);
  const theme = ANSWER_THEMES.find((t) => t.id === answer.theme);
  const next = answer.next.map(getGranthAnswer).filter((a): a is NonNullable<typeof a> => Boolean(a));

  return (
    <main className="min-h-screen bg-dharma-bg pb-20 text-dharma-text">
      <JsonLd
        data={pageLd(
          [
            { name: 'Ask the scriptures', path: '/ask/' },
            { name: answer.questionEn, path },
          ],
          faqLd({
            path,
            items: [
              { question: answer.questionHi, answer: `${answer.sarHi} (${verses.map((v) => v.labelHi).join(', ')})` },
              { question: answer.questionEn, answer: `${answer.sarEn} (${verses.map((v) => v.labelEn).join(', ')})` },
            ],
          }),
        )}
      />

      <section className="border-b border-dharma-border bg-gradient-to-b from-amber-50/70 via-dharma-card to-dharma-bg px-5 py-10 dark:from-amber-950/20 sm:px-8 sm:py-14">
        <div className="mx-auto max-w-3xl">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-dharma-muted">
            <Link href="/ask/" className="inline-flex items-center gap-1 hover:text-saffron-700">
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              <span lang="hi">ग्रन्थ से पूछिए</span> <span>Ask the scriptures</span>
            </Link>
            {theme && (
              <>
                <span aria-hidden="true">/</span>
                <span lang="hi">{theme.titleHi}</span>
              </>
            )}
          </nav>
          <h1 className="mt-4 font-serif text-3xl font-bold leading-tight sm:text-4xl">
            <span lang="hi" className="block font-devanagari">{answer.questionHi}</span>
            <span className="mt-2 block text-xl font-semibold text-dharma-muted sm:text-2xl">{answer.questionEn}</span>
          </h1>

          {answer.crisis && (
            <aside className="mt-6 rounded-3xl border-2 border-sky-400/60 bg-sky-50 p-5 dark:border-sky-700 dark:bg-sky-950/40 sm:p-6" aria-label="Talk to someone now">
              <p lang="hi" className="font-devanagari text-lg font-semibold leading-relaxed">आप अकेले नहीं हैं। अभी किसी से बात करना चाहें, तो Tele‑MANAS पर निःशुल्क, चौबीसों घण्टे, अपनी भाषा में बात कर सकते हैं।</p>
              <p className="mt-1 text-dharma-muted">You are not alone. To talk to someone now, Tele‑MANAS is free, 24 hours, in your own language.</p>
              <p className="mt-3 flex flex-wrap gap-3">
                <a href="tel:14416" className="inline-flex items-center gap-2 rounded-full bg-sky-700 px-4 py-2 font-semibold text-white hover:bg-sky-800">
                  <span>Tele‑MANAS 14416</span>
                </a>
                <a href="tel:112" className="inline-flex items-center gap-2 rounded-full border border-sky-700 px-4 py-2 font-semibold text-sky-800 dark:text-sky-200">
                  <span lang="hi" className="font-devanagari">तुरन्त खतरा:</span> <span>Emergency 112</span>
                </a>
              </p>
            </aside>
          )}

          <div className="mt-6 rounded-3xl border-2 border-saffron-500/40 bg-dharma-card p-5 shadow-sm sm:p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-saffron-700">
              <span lang="hi">सार</span> <span>In one line</span>
            </p>
            <p lang="hi" className="mt-2 font-devanagari text-lg leading-relaxed sm:text-xl">{answer.sarHi}</p>
            <p lang="en" className="mt-2 leading-relaxed text-dharma-muted">{answer.sarEn}</p>
          </div>

          <p className="mt-4 text-xs text-dharma-muted">
            <span lang="hi">श्लोक, अर्थ और अनुवाद पुस्तकालय से हैं। सार, दृष्टान्त, शोध‑टिप्पणी और अभ्यास सम्पादकीय टिप्पणियाँ हैं, शास्त्र‑पाठ नहीं।</span>{' '}
            <span>Verses and translations come from the library. The summary, story, research note and practice are editorial notes, not scripture.</span>
          </p>
        </div>
      </section>

      <div className="mx-auto mt-8 grid max-w-3xl gap-6 px-5 sm:px-8">
        {answer.care && (
          <aside className="flex gap-3 rounded-2xl border border-sky-200 bg-sky-50/70 p-4 text-sm dark:border-sky-900/60 dark:bg-sky-950/30" aria-label="Care note">
            <HeartHandshake className="mt-0.5 h-5 w-5 shrink-0 text-sky-700 dark:text-sky-300" aria-hidden="true" />
            <div className="grid gap-1">
              <p lang="hi" className="font-devanagari font-semibold">यह पृष्ठ अध्ययन है, उपचार नहीं।</p>
              <p lang="hi" className="font-devanagari">यदि दुःख या निराशा सँभालना कठिन हो, तो योग्य परामर्शदाता, चिकित्सक या स्थानीय सहायता‑सेवा से सम्पर्क करें।</p>
              <p className="text-dharma-muted">This page is for study, not treatment. If distress is hard to carry, please reach a counsellor, doctor or local helpline.</p>
              {answer.help?.map((h) => (
                <p key={h.number}>
                  <span lang="hi" className="font-devanagari">{h.nameHi}:</span>{' '}
                  <span>{h.nameEn} </span>
                  <a href={`tel:${h.number.replace(/-/g, '')}`} className="font-semibold underline underline-offset-2">{h.number}</a>
                </p>
              ))}
              <p>
                <span lang="hi" className="font-devanagari">भारत में निःशुल्क, चौबीसों घण्टे:</span>{' '}
                <span>Free, 24 hours in India: Tele‑MANAS </span>
                <a href="tel:14416" className="font-semibold underline underline-offset-2">14416</a>
              </p>
            </div>
          </aside>
        )}

        <Section hi="शास्त्र क्या कहते हैं" en="What the scriptures say">
          {groups.map((g) => (
            <VerseCard key={`${g.verses[0].s}-${g.verses[0].c}-${g.verses[0].v}`} group={g} />
          ))}
        </Section>

        {answer.story && (
          <Section hi="दृष्टान्त" en="A story from the tradition">
            <h3 className="font-serif text-lg font-bold">
              <span lang="hi" className="font-devanagari">{answer.story.titleHi}</span>{' '}
              <span className="text-base font-semibold text-dharma-muted">{answer.story.titleEn}</span>
            </h3>
            <p lang="hi" className="font-devanagari leading-relaxed">{answer.story.hi}</p>
            <p lang="en" className="leading-relaxed text-dharma-muted">{answer.story.en}</p>
            <p className="flex items-start gap-2 text-xs text-dharma-muted">
              <BookOpen className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span><span lang="hi">स्रोत: {answer.story.sourceHi}</span> · <span>Source: {answer.story.sourceEn}</span></span>
            </p>
          </Section>
        )}

        {answer.myth && (
          <Section hi="भ्रान्ति और सत्य" en="Common misreading">
            <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-4 dark:border-rose-900/50 dark:bg-rose-950/20">
              <p lang="hi" className="font-devanagari font-semibold">{answer.myth.hi}</p>
              <p lang="en" className="mt-1 text-sm text-dharma-muted">{answer.myth.en}</p>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/20">
              <p lang="hi" className="font-devanagari leading-relaxed">{answer.myth.truthHi}</p>
              <p lang="en" className="mt-1 text-sm leading-relaxed text-dharma-muted">{answer.myth.truthEn}</p>
            </div>
          </Section>
        )}

        {answer.science && (
          <Section hi="विज्ञान की दृष्टि से" en="What research says">
            <p lang="hi" className="font-devanagari leading-relaxed">{answer.science.hi}</p>
            <p lang="en" className="leading-relaxed text-dharma-muted">{answer.science.en}</p>
            <p className="flex items-start gap-2 text-xs text-dharma-muted">
              <FlaskConical className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>
                <span>Source: {answer.science.source}</span>
                {' · '}
                <span lang="hi">शोध एक समानान्तर दृष्टि है, शास्त्र का प्रमाण नहीं।</span>{' '}
                <span>Research is a parallel view, not proof of scripture.</span>
              </span>
            </p>
          </Section>
        )}

        <Section hi="आज का अभ्यास" en="One step for today">
          <p lang="hi" className="font-devanagari text-lg leading-relaxed">{answer.practiceHi}</p>
          <p lang="en" className="leading-relaxed text-dharma-muted">{answer.practiceEn}</p>
        </Section>

        {next.length > 0 && (
          <Section hi="आगे के प्रश्न" en="Questions people ask next">
            <ul className="grid gap-2">
              {next.map((n) => (
                <li key={n.slug}>
                  <Link
                    href={pathFor(n.slug)}
                    className="flex min-h-11 items-center justify-between gap-3 rounded-2xl border border-dharma-border bg-dharma-bg/60 px-4 py-3 hover:border-saffron-500/60"
                  >
                    <span>
                      <span lang="hi" className="block font-devanagari font-semibold">{n.questionHi}</span>
                      <span className="block text-sm text-dharma-muted">{n.questionEn}</span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-saffron-700" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </Section>
        )}

        <p className="text-center">
          <Link href="/ask/" className="inline-flex min-h-11 items-center gap-2 font-semibold text-saffron-700 underline underline-offset-4">
            <span lang="hi">अपना प्रश्न पूछें</span> <span>Ask your own question</span>
          </Link>
        </p>
      </div>
    </main>
  );
}
