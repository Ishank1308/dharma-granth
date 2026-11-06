import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { JsonLd } from '@/app/components/JsonLd';
import { pageLd, articleLd, definedTermLd, SITE_URL } from '@/lib/jsonld';
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
import { characters, getCharacter, type Character } from '@/data/characters';
import { ShareChips } from '@/app/components/ShareChips';

export function generateStaticParams() {
  return characters.map((c) => ({ id: c.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const character = getCharacter(params.id);
  if (!character) return { title: 'Character Not Found' };

  return {
    title: `${character.name}`,
    description: character.shortDesc,
    alternates: { canonical: `/characters/${character.id}/` },
    openGraph: {
      images: [DEFAULT_OG_IMAGE],
      title: `${character.name} (${character.sanskrit}) — Dharma Granth`,
      description: character.shortDesc,
      url: `${SITE_URL}/characters/${character.id}/`,
    },
  };
}

export default function CharacterPage({ params }: { params: { id: string } }) {
  const character = getCharacter(params.id);
  if (!character) notFound();

  const relatedCharacters = characters
    .filter((c) => c.id !== character.id && c.category === character.category)
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-dharma-bg">
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
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className={`relative bg-gradient-to-br ${character.gradient} text-white py-16 overflow-hidden`}>
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
        {/* ── Biography ───────────────────────────────────────────── */}
        <FadeUpOnView>
          <div className="rounded-2xl border border-dharma-border bg-dharma-card shadow-xl overflow-hidden">
            <div className={`h-1.5 bg-gradient-to-r ${character.gradient}`} />
            <div className="p-6 md:p-8">
              <h2 className="text-xl font-serif font-bold text-dharma-text mb-4">
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
              <h2 className="flex items-center gap-2 text-xl font-serif font-bold text-dharma-text mb-6">
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
              <h2 className="flex items-center gap-2 text-xl font-serif font-bold text-dharma-text mb-6">
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
                <h2 className="flex items-center gap-2 text-xl font-serif font-bold text-dharma-text mb-6">
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
                <h2 className="flex items-center gap-2 text-xl font-serif font-bold text-dharma-text mb-6">
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
                <h2 className="flex items-center gap-2 text-xl font-serif font-bold text-dharma-text mb-6">
                  <BookOpen className="w-5 h-5 text-violet-600" />
                  Related Verses
                </h2>
                <div className="space-y-4">
                  {character.verses.map((verse, i) => (
                    <div key={i} className="relative rounded-xl border border-dharma-border bg-dharma-bg/40 p-5">
                      <div className="absolute -top-2.5 left-4 w-5 h-5 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                        {i + 1}
                      </div>
                      <p lang="sa" className="font-devanagari text-base text-dharma-text leading-relaxed mb-2 mt-1">
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
                <h2 className="flex items-center gap-2 text-xl font-serif font-bold text-dharma-text mb-6">
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
