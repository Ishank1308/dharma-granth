import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { CHARACTER_PHOTOS } from '@/lib/page-photos';
import { HeroPhoto } from '@/app/components/PagePhoto';
import { JsonLd } from '@/app/components/JsonLd';
import { pageLd, articleLd, definedTermLd } from '@/lib/jsonld';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  Users,
  Calendar,
  MessageSquare,
  Scale,
  BookOpen,
  GitBranch,
} from 'lucide-react';
import { FadeUp, FadeUpOnView } from '@/app/components/motion/primitives';
import { characters, getCharacter, characterCategories, type Character } from '@/data/characters';
import { clipDescription, pickTitle } from '@/lib/meta-text';
import { ShareChips } from '@/app/components/ShareChips';
import { OnThisPage } from '@/app/components/OnThisPage';

export function generateStaticParams() {
  return characters.map((c) => ({ id: c.id }));
}

export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const params = await props.params;
  const character = getCharacter(params.id);
  if (!character) return { title: 'Character Not Found' };

  const catMeta = characterCategories.find((c) => c.key === character.category);
  const catLabel = catMeta ? catMeta.label : 'Scriptures';
  const ogTitle = `${character.name} (${character.sanskrit}) — Story & Role in ${catLabel}`;
  const title = pickTitle([
    `${character.name} (${character.sanskrit}) — Story & Role in ${catLabel} | Dharma Granth`,
    `${character.name} (${character.sanskrit}) — Story & Role in ${catLabel}`,
    `${character.name} (${character.sanskrit}) — Story & Teachings | Dharma Granth`,
    `${character.name} (${character.sanskrit}) — जीवन व शिक्षाएँ`,
    `${character.name} — Story & Role | Dharma Granth`,
  ]);
  const description = clipDescription(
    `${character.name} (${character.sanskrit}): ${character.shortDesc} ${character.biography || ''}`,
    158,
  );
  const keywords = [
    character.name,
    character.sanskrit,
    `${character.name} in ${catLabel}`,
    `${character.name} story`,
    `${character.name} character sketch`,
    `${character.name} life history`,
    'hindu scriptures characters',
    'dharma granth',
  ];

  return {
    title: { absolute: title },
    description,
    keywords,
    alternates: { canonical: `/characters/${character.id}/` },
    openGraph: {
      type: 'profile',
      images: [DEFAULT_OG_IMAGE],
      title: `${ogTitle} — Dharma Granth`,
      description,
      url: `https://dharmagranth.dev/characters/${character.id}/`,
    },
    twitter: { card: 'summary_large_image', title: ogTitle, description, images: [DEFAULT_OG_IMAGE.url] },
  };
}

export default async function CharacterPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const character = getCharacter(params.id);
  if (!character) notFound();
  const photo = CHARACTER_PHOTOS[character.id];

  const relatedCharacters = characters
    .filter((c) => c.id !== character.id && c.category === character.category)
    .slice(0, 3);

  const questions = [
    {
      '@type': 'Question',
      name: `Who was ${character.name} (${character.sanskrit}) in Hindu scriptures?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: character.shortDesc,
      },
    },
    character.dilemmas && character.dilemmas.length > 0 && {
      '@type': 'Question',
      name: `What moral dilemma did ${character.name} face and how was it resolved?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `${character.dilemmas[0].title}: ${character.dilemmas[0].description} Resolution: ${character.dilemmas[0].resolution}`,
      },
    },
    character.events && character.events.length > 0 && {
      '@type': 'Question',
      name: `What was a key scriptural event involving ${character.name}?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `${character.events[0].title}: ${character.events[0].description}`,
      },
    },
  ].filter(Boolean);

  const jsonLdFaq = questions.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions,
  } : null;

  return (
    <main className="long-read min-h-screen bg-dharma-bg">
      <JsonLd
        data={pageLd(
          [
            { name: 'Characters', path: '/characters' },
            { name: character.name, path: `/characters/${character.id}` },
          ],
          articleLd({
            path: `/characters/${character.id}`,
            headline: `${character.name} (${character.sanskrit})`,
            description: character.shortDesc,
          }),
        )}
      />
      {jsonLdFaq && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
        />
      )}
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className={`relative isolate bg-gradient-to-br ${character.gradient} text-white py-16 overflow-hidden`}>
        {photo && <HeroPhoto photo={photo} />}
        <div className="absolute inset-0 mandala-bg opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="max-w-4xl mx-auto px-6 relative">
          <FadeUp>
            <Link
              href="/characters"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white transition mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              All Characters
            </Link>

            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl shadow-lg flex-shrink-0">
                {character.icon}
              </div>
              <div>
                <h1 className="text-4xl font-serif font-bold mb-1">{character.name}</h1>
                <p lang="sa" className="font-devanagari text-xl text-white/80">
                  {character.sanskrit}
                </p>
              </div>
            </div>

            <p className="text-lg opacity-90 max-w-2xl leading-relaxed">
              {character.shortDesc}
            </p>
            <ShareChips tone="dark" className="mt-5" title={character.name} summary={character.shortDesc} path={`/characters/${character.id}`} />
          </FadeUp>
        </div>
      </section>

      {/* ── Content ──────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 -mt-8 relative z-10 pb-20 space-y-12">
        <OnThisPage
          items={[
            { id: 'char-biography', en: 'Biography' },
            { id: 'char-family', en: 'Family Relationships' },
            { id: 'char-events', en: 'Major Events' },
            character.dialogues.length > 0 && { id: 'char-dialogues', en: 'Important Dialogues' },
            character.dilemmas.length > 0 && { id: 'char-dilemmas', en: 'Ethical Dilemmas' },
            character.verses.length > 0 && { id: 'char-verses', en: 'Related Verses' },
            character.interpretations.length > 0 && { id: 'char-interpretations', en: 'Interpretations Across Traditions' },
          ]}
        />
        {/* ── Biography ───────────────────────────────────────────── */}
        <FadeUpOnView>
          <div className="rounded-2xl border border-dharma-border bg-dharma-card shadow-xl overflow-hidden">
            <div className={`h-1.5 bg-gradient-to-r ${character.gradient}`} />
            <div className="p-6 md:p-8">
              <h2 id="char-biography" className="text-xl font-serif font-bold text-dharma-text mb-4">
                Biography
              </h2>
              <p className="text-dharma-text leading-relaxed">
                {character.biography}
              </p>
            </div>
          </div>
        </FadeUpOnView>

        {/* ── Family Relationships ────────────────────────────────── */}
        <FadeUpOnView>
          <div className="rounded-2xl border border-dharma-border bg-dharma-card shadow-xl overflow-hidden">
            <div className={`h-1.5 bg-gradient-to-r ${character.gradient}`} />
            <div className="p-6 md:p-8">
              <h2 id="char-family" className="flex items-center gap-2 text-xl font-serif font-bold text-dharma-text mb-6">
                <Users className="w-5 h-5 text-violet-600" />
                Family Relationships
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {character.relations.map((rel, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-xl border border-dharma-border bg-dharma-bg/50 p-4 hover:border-violet-200 transition"
                  >
                    <span className="font-semibold text-dharma-text">{rel.name}</span>
                    <span className="text-sm text-violet-700 font-medium">{rel.relation}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeUpOnView>

        {/* ── Major Events ────────────────────────────────────────── */}
        <FadeUpOnView>
          <div className="rounded-2xl border border-dharma-border bg-dharma-card shadow-xl overflow-hidden">
            <div className={`h-1.5 bg-gradient-to-r ${character.gradient}`} />
            <div className="p-6 md:p-8">
              <h2 id="char-events" className="flex items-center gap-2 text-xl font-serif font-bold text-dharma-text mb-6">
                <Calendar className="w-5 h-5 text-violet-600" />
                Major Events
              </h2>
              <div className="space-y-4">
                {character.events.map((event, i) => (
                  <div key={i} className="flex gap-4">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br ${character.gradient} text-white text-sm font-bold flex items-center justify-center shadow-sm`}>
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-dharma-text mb-1">{event.title}</h3>
                      <p className="text-sm text-dharma-muted leading-relaxed">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeUpOnView>

        {/* ── Important Dialogues ─────────────────────────────────── */}
        {character.dialogues.length > 0 && (
          <FadeUpOnView>
            <div className="rounded-2xl border border-dharma-border bg-dharma-card shadow-xl overflow-hidden">
              <div className={`h-1.5 bg-gradient-to-r ${character.gradient}`} />
              <div className="p-6 md:p-8">
                <h2 id="char-dialogues" className="flex items-center gap-2 text-xl font-serif font-bold text-dharma-text mb-6">
                  <MessageSquare className="w-5 h-5 text-violet-600" />
                  Important Dialogues
                </h2>
                <div className="space-y-5">
                  {character.dialogues.map((dialogue, i) => (
                    <div key={i} className="border-l-4 border-violet-300 pl-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-violet-700">{dialogue.speaker}</span>
                        <span className="text-xs text-dharma-muted">— {dialogue.context}</span>
                      </div>
                      <p className="text-dharma-text leading-relaxed italic mb-2">
                        &ldquo;{dialogue.text}&rdquo;
                      </p>
                      <p className="text-xs font-bold text-saffron-700 uppercase tracking-wider">
                        {dialogue.reference}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeUpOnView>
        )}

        {/* ── Ethical Dilemmas ────────────────────────────────────── */}
        {character.dilemmas.length > 0 && (
          <FadeUpOnView>
            <div className="rounded-2xl border border-dharma-border bg-dharma-card shadow-xl overflow-hidden">
              <div className={`h-1.5 bg-gradient-to-r ${character.gradient}`} />
              <div className="p-6 md:p-8">
                <h2 id="char-dilemmas" className="flex items-center gap-2 text-xl font-serif font-bold text-dharma-text mb-6">
                  <Scale className="w-5 h-5 text-violet-600" />
                  Ethical Dilemmas
                </h2>
                <div className="space-y-5">
                  {character.dilemmas.map((dilemma, i) => (
                    <div key={i} className="rounded-xl border border-dharma-border bg-dharma-bg/40 p-5">
                      <h3 className="font-serif font-bold text-lg text-dharma-text mb-2">
                        {dilemma.title}
                      </h3>
                      <p className="text-sm text-dharma-muted leading-relaxed mb-3">
                        {dilemma.description}
                      </p>
                      <div className="border-t border-dharma-border pt-3 mt-3">
                        <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
                          Resolution
                        </p>
                        <p className="text-sm text-dharma-text leading-relaxed">
                          {dilemma.resolution}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeUpOnView>
        )}

        {/* ── Related Verses ──────────────────────────────────────── */}
        {character.verses.length > 0 && (
          <FadeUpOnView>
            <div className="rounded-2xl border border-dharma-border bg-dharma-card shadow-xl overflow-hidden">
              <div className={`h-1.5 bg-gradient-to-r ${character.gradient}`} />
              <div className="p-6 md:p-8">
                <h2 id="char-verses" className="flex items-center gap-2 text-xl font-serif font-bold text-dharma-text mb-6">
                  <BookOpen className="w-5 h-5 text-violet-600" />
                  Related Verses
                </h2>
                <div className="space-y-4">
                  {character.verses.map((verse, i) => (
                    <div key={i} className="relative rounded-xl border border-dharma-border bg-dharma-bg/40 p-5">
                      <div className="absolute -top-2.5 left-4 w-5 h-5 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                        {i + 1}
                      </div>
                      <p lang="sa" className="font-devanagari text-[clamp(1rem,calc(.9rem+.5vw),1.35rem)] leading-[1.9] [overflow-wrap:anywhere] text-dharma-text mb-2 mt-1">
                        {verse.sanskrit}
                      </p>
                      {verse.transliteration && (
                        <p className="text-xs italic text-dharma-muted mb-2">
                          {verse.transliteration}
                        </p>
                      )}
                      <p className="text-sm text-dharma-text leading-relaxed mb-2">
                        {verse.translation}
                      </p>
                      <span className="text-[10px] font-bold text-saffron-700 uppercase tracking-wider">
                        {verse.reference}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeUpOnView>
        )}

        {/* ── Interpretations Across Traditions ───────────────────── */}
        {character.interpretations.length > 0 && (
          <FadeUpOnView>
            <div className="rounded-2xl border border-dharma-border bg-dharma-card shadow-xl overflow-hidden">
              <div className={`h-1.5 bg-gradient-to-r ${character.gradient}`} />
              <div className="p-6 md:p-8">
                <h2 id="char-interpretations" className="flex items-center gap-2 text-xl font-serif font-bold text-dharma-text mb-6">
                  <GitBranch className="w-5 h-5 text-violet-600" />
                  Interpretations Across Traditions
                </h2>
                <div className="space-y-4">
                  {character.interpretations.map((interp, i) => (
                    <div key={i} className="rounded-xl border border-dharma-border bg-dharma-bg/40 p-5">
                      <h3 className="font-serif font-bold text-violet-700 mb-2">
                        {interp.tradition}
                      </h3>
                      <p className="text-sm text-dharma-text leading-relaxed">
                        {interp.view}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeUpOnView>
        )}

        {/* ── Related Characters ──────────────────────────────────── */}
        {relatedCharacters.length > 0 && (
          <FadeUpOnView>
            <div>
              <h2 className="text-lg font-serif font-bold text-dharma-text mb-4">
                More in this category
              </h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {relatedCharacters.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/characters/${rel.id}`}
                    className="group rounded-xl border border-dharma-border bg-dharma-card p-5 hover:shadow-lg hover:border-violet-300 transition"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{rel.icon}</span>
                      <div>
                        <h3 className="font-serif font-bold text-dharma-text group-hover:text-violet-700 transition">
                          {rel.name}
                        </h3>
                        <p lang="sa" className="font-devanagari text-xs text-saffron-600">
                          {rel.sanskrit}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-dharma-muted leading-relaxed">
                      {rel.shortDesc}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </FadeUpOnView>
        )}

        {/* ── Navigation ─────────────────────────────────────────── */}
        <div className="flex items-center justify-between pt-4">
          <Link
            href="/characters"
            className="inline-flex items-center gap-2 text-sm font-semibold text-violet-700 hover:text-violet-800 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            All Characters
          </Link>
          <Link
            href="/locations"
            className="inline-flex items-center gap-2 text-sm font-semibold text-violet-700 hover:text-violet-800 transition"
          >
            Sacred Locations →
          </Link>
        </div>
      </section>
    </main>
  );
}
