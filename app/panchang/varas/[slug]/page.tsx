import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  VARA_DATA,
  getVaraBySlug,
  type VaraMeta,
} from '@/lib/panchang';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';
import { PageHeader, SectionTitle } from '@/app/components/apple/PageHeader';
import { JsonLd } from '@/app/components/JsonLd';
import {
  Sun,
  Moon,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Calendar,
  Compass,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Flame,
} from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return VARA_DATA.map((vara) => ({
    slug: vara.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const vara = getVaraBySlug(slug);
  if (!vara) return {};

  const title = `${vara.nameHi} (${vara.name}) — Vedic Weekday, Ruling Graha & Observances`;
  const description = `Complete Vedic guide to ${vara.name} (${vara.nameHi}) in Panchang. Ruling Graha lord ${vara.grahaLord}, ${vara.element} element, gemstone, sacred fasts, and spiritual study guidelines.`;

  return {
    title,
    description,
    keywords: [
      `${vara.name} vedic astrology`,
      `${vara.nameHi} panchang`,
      `${vara.grahaLord} weekday`,
      `${vara.name} fast rules`,
      `${vara.slug} rituals`,
      '7 varas in vedic astrology',
      'Dharma Granth Panchang',
    ],
    alternates: { canonical: `/panchang/varas/${vara.slug}/` },
    openGraph: {
      images: [
        {
          url: `/og/vara/${vara.slug}.png`,
          width: 1200,
          height: 630,
          alt: `${vara.nameHi} (${vara.name}) — Vedic Weekday`,
        },
      ],
      title: `${title} — Dharma Granth`,
      description,
      url: `https://dharmagranth.dev/panchang/varas/${vara.slug}/`,
    },
  };
}

export default async function VaraDetailPage({ params }: Props) {
  const { slug } = await params;
  const vara = getVaraBySlug(slug);
  if (!vara) notFound();

  const prevVara = VARA_DATA[(vara.index + 6) % 7];
  const nextVara = VARA_DATA[(vara.index + 1) % 7];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `https://dharmagranth.dev/panchang/varas/${vara.slug}/#article`,
        headline: `${vara.nameHi} (${vara.name}) — Vedic Weekday, Ruling Graha & Observances`,
        description: vara.explanation,
        inLanguage: ['hi', 'sa', 'en'],
        author: {
          '@type': 'Organization',
          name: 'Dharma Granth',
          url: 'https://dharmagranth.dev',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://dharmagranth.dev/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Panchang',
            item: 'https://dharmagranth.dev/panchang/',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: '7 Vedic Varas',
            item: 'https://dharmagranth.dev/panchang/varas/',
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: vara.nameHi,
            item: `https://dharmagranth.dev/panchang/varas/${vara.slug}/`,
          },
        ],
      },
    ],
  };

  return (
    <main className="apple-scope min-h-screen bg-dharma-bg">
      <JsonLd data={jsonLd} />

      <div className="mx-auto max-w-7xl px-gutter pt-6">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Panchang', href: '/panchang/' },
            { label: '7 Vedic Varas', href: '/panchang/varas/' },
            { label: `${vara.nameHi} (${vara.name})` },
          ]}
        />
      </div>

      <PageHeader
        eyebrow={`Vedic Weekday ${vara.index + 1} of 7 · ${vara.grahaLord}`}
        eyebrowHi={`${vara.nameHi} · ${vara.grahaLordHi}`}
        title={`${vara.name} (${vara.nameHi})`}
        titleHi={`${vara.grahaLordHi} का वासर · ${vara.natureHi}`}
        lead={vara.explanation}
        width="wide"
      />

      <section className="mx-auto max-w-7xl px-gutter pt-8 pb-16 space-y-12">
        {/* ─── ATTRIBUTES CARD GRID ────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-dharma-border bg-dharma-card p-5">
            <div className="text-caption-2 uppercase tracking-wider text-dharma-muted">ग्रह अधिपति (Lord)</div>
            <div className="mt-1 text-headline font-bold text-dharma-text">{vara.grahaLordHi}</div>
            <div className="text-caption-1 text-dharma-saffron font-medium">{vara.grahaLord}</div>
          </div>

          <div className="rounded-2xl border border-dharma-border bg-dharma-card p-5">
            <div className="text-caption-2 uppercase tracking-wider text-dharma-muted">महाभूत तत्त्व (Element)</div>
            <div className="mt-1 text-headline font-bold text-dharma-text">{vara.elementHi}</div>
            <div className="text-caption-1 text-dharma-saffron font-medium">{vara.element}</div>
          </div>

          <div className="rounded-2xl border border-dharma-border bg-dharma-card p-5">
            <div className="text-caption-2 uppercase tracking-wider text-dharma-muted">अधिष्ठाता देवता (Deity)</div>
            <div className="mt-1 text-subhead font-bold text-dharma-text">{vara.deityHi}</div>
            <div className="text-caption-1 text-dharma-saffron font-medium">{vara.deity}</div>
          </div>

          <div className="rounded-2xl border border-dharma-border bg-dharma-card p-5">
            <div className="text-caption-2 uppercase tracking-wider text-dharma-muted">रत्न व धातु (Gem & Metal)</div>
            <div className="mt-1 text-subhead font-bold text-dharma-text">{vara.gemstoneHi}</div>
            <div className="text-caption-1 text-dharma-saffron font-medium">धातु: {vara.metalHi}</div>
          </div>
        </div>

        {/* ─── CLASSICAL SYNONYMS & NATURE ─────────────────────────────────── */}
        <div className="rounded-2xl border border-dharma-border bg-dharma-card p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-title-2 font-bold text-dharma-text">
              शास्त्रीय नाम व पर्याय (Classical Sanskrit Synonyms)
            </h2>
            <p className="mt-2 text-footnote text-dharma-muted">
              Classical Jyotisha and Purana texts reference {vara.nameHi} through diverse solar, planetary, and mythological synonyms:
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {vara.synonyms.map((syn) => (
                <span
                  key={syn}
                  className="rounded-xl border border-dharma-border bg-dharma-bg px-4 py-2 text-subhead font-medium text-dharma-text font-devanagari"
                >
                  {syn}
                </span>
              ))}
            </div>
          </div>

          <div className="border-t border-dharma-border pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-caption-1 font-semibold text-dharma-muted uppercase tracking-wider">प्राकृतिक स्वभाव (Nature)</div>
              <div className="mt-1 text-body font-bold text-dharma-text">{vara.natureHi}</div>
              <div className="text-caption-1 text-dharma-muted">{vara.nature}</div>
            </div>
            <div>
              <div className="text-caption-1 font-semibold text-dharma-muted uppercase tracking-wider">त्रिगुण वर्गीकरण (Guna)</div>
              <div className="mt-1 text-body font-bold text-dharma-text">{vara.gunaHi} गुण</div>
              <div className="text-caption-1 text-dharma-muted">{vara.guna} quality</div>
            </div>
            <div>
              <div className="text-caption-1 font-semibold text-dharma-muted uppercase tracking-wider">शुभ वर्ण (Auspicious Color)</div>
              <div className="mt-1 text-body font-bold text-dharma-text">{vara.colorHi}</div>
              <div className="text-caption-1 text-dharma-muted">{vara.color}</div>
            </div>
          </div>
        </div>

        {/* ─── SACRED FASTS & OBSERVANCES ──────────────────────────────────── */}
        <div className="rounded-2xl border border-dharma-border bg-dharma-card p-6 sm:p-8">
          <SectionTitle
            id="sacred-fasts"
            size="title-2"
            eyebrow="Rituals & Vratas"
            eyebrowHi="पवित्र व्रत, उपवास एवं साधना"
            title="Traditional Observances on this Day"
          />

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {vara.sacredFasts.map((fast, i) => (
              <div
                key={i}
                className="rounded-xl border border-dharma-border bg-dharma-bg p-4 flex items-start gap-3"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-saffron-500/10 text-dharma-saffron font-bold text-footnote flex-shrink-0">
                  {i + 1}
                </div>
                <div>
                  <h3 className="text-subhead font-bold text-dharma-text">{fast}</h3>
                  <p className="mt-1 text-caption-1 text-dharma-muted leading-relaxed">
                    Observed in traditional Smarta and Vaishnava calendars for spiritual purification, planetary peace, and fulfilling righteous intentions.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── RECOMMENDED CLASSICAL STOTRAS ──────────────────────────────── */}
        <div className="rounded-2xl border-2 border-saffron-400/30 bg-gradient-to-r from-saffron-500/5 via-amber-500/5 to-orange-500/5 p-6 sm:p-8">
          <SectionTitle
            id="sacred-stotras"
            size="title-2"
            eyebrow="Classical Scriptural Recitations"
            eyebrowHi="प्रशस्त स्तोत्र व मन्त्र पाठ"
            title="Recommended Hymns for this Day"
          />
          <p className="mt-2 text-footnote text-dharma-muted leading-relaxed max-w-3xl">
            Reciting these classical hymns on {vara.nameHi} aligns conscious intention with the presiding Graha deity and awakens spiritual peace.
          </p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {vara.recommendedStotras.map((stotra, i) => (
              <div
                key={i}
                className="rounded-xl border border-dharma-border bg-dharma-card p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 text-caption-2 font-semibold text-dharma-saffron mb-1">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>स्तोत्र साधना</span>
                  </div>
                  <h4 className="text-subhead font-bold text-dharma-text">
                    {stotra.title}
                  </h4>
                </div>

                {stotra.href ? (
                  <div className="mt-4 pt-2 border-t border-dharma-border/60">
                    <Link
                      href={stotra.href}
                      className="inline-flex items-center gap-1.5 text-caption-1 font-semibold text-dharma-saffron hover:underline"
                    >
                      <span>मूल पाठ व अर्थ पढ़ें</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                ) : (
                  <div className="mt-4 pt-2 border-t border-dharma-border/60 text-caption-2 text-dharma-muted">
                    परंपरागत दैनिक पाठ
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ─── SPIRITUAL & SWADHYAYA FOCUS ─────────────────────────────────── */}
        <div className="rounded-2xl border border-dharma-border bg-dharma-card p-6 sm:p-8 space-y-4">
          <SectionTitle
            id="swadhyaya-focus"
            size="title-2"
            eyebrow="Spiritual Contemplation"
            eyebrowHi="स्वाध्याय व आत्म-चिंतन"
            title="Inner Alignment & Contemplation"
          />
          <p className="text-body leading-relaxed text-dharma-muted max-w-4xl">
            {vara.spiritualFocus}
          </p>
          <div className="pt-2">
            <Link
              href="/panchang/calendar/"
              className="inline-flex items-center gap-2 rounded-xl bg-dharma-saffron hover:bg-saffron-700 text-white px-4 py-2.5 text-footnote font-semibold transition"
            >
              <Calendar className="h-4 w-4" />
              <span>पंचांग कैलेंडर में {vara.nameHi} देखें</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* ─── PREVIOUS / NEXT VARA NAVIGATION ─────────────────────────────── */}
        <div className="border-t border-dharma-border pt-8 flex items-center justify-between gap-4">
          <Link
            href={`/panchang/varas/${prevVara.slug}/`}
            className="group flex items-center gap-3 rounded-2xl border border-dharma-border bg-dharma-card p-4 hover:border-dharma-saffron transition-all"
          >
            <ArrowLeft className="h-5 w-5 text-dharma-muted group-hover:text-dharma-saffron transition-colors" />
            <div className="text-left">
              <div className="text-caption-2 uppercase text-dharma-muted">पिछला वार (Previous)</div>
              <div className="text-subhead font-bold text-dharma-text group-hover:text-dharma-saffron transition-colors">
                {prevVara.nameHi} ({prevVara.name})
              </div>
            </div>
          </Link>

          <Link
            href={`/panchang/varas/${nextVara.slug}/`}
            className="group flex items-center gap-3 rounded-2xl border border-dharma-border bg-dharma-card p-4 hover:border-dharma-saffron transition-all"
          >
            <div className="text-right">
              <div className="text-caption-2 uppercase text-dharma-muted">अगला वार (Next)</div>
              <div className="text-subhead font-bold text-dharma-text group-hover:text-dharma-saffron transition-colors">
                {nextVara.nameHi} ({nextVara.name})
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-dharma-muted group-hover:text-dharma-saffron transition-colors" />
          </Link>
        </div>
      </section>
    </main>
  );
}
