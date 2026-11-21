import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import Link from 'next/link';
import { PageHeader, SectionTitle } from '@/app/components/apple/PageHeader';
import { ACADEMY_COURSES, ACADEMY_LEVELS, ACADEMY_ORDERS } from '@/data/academy-index';

export const metadata: Metadata = {
  title: 'धर्म अकादमी · Dharma Academy',
  description: 'Existing courses grouped by level. Karma Yoga and Meditation are reading orders, not separate courses.',
  alternates: { canonical: '/learn/academy/' },
  openGraph: {
    title: 'धर्म अकादमी · Dharma Academy',
    description:
      'Existing courses grouped by level. Karma Yoga and Meditation are reading orders, not separate courses.',
    url: '/learn/academy/',
    images: [DEFAULT_OG_IMAGE],
  },
};

/** One course or reading order: a row in a grouped list, Hindi first, as on the Learn page. */
function AcademyRow({ href, hi, en }: { href: string; hi: string; en: string }) {
  return (
    <li>
      <Link href={href} className="apple-row">
        <span className="min-w-0 flex-1">
          <span lang="hi" className="block font-devanagari text-body font-medium text-label-primary">{hi}</span>{' '}
          <span className="block text-footnote text-label-secondary">{en}</span>
        </span>
        <span className="apple-chevron" aria-hidden="true">›</span>
      </Link>
    </li>
  );
}

export default function AcademyPage() {
  return (
    <main id="main" className="pb-section">
      <PageHeader
        eyebrow="Learn"
        eyebrowHi="सीखें"
        title="Dharma Academy"
        titleHi="धर्म अकादमी"
        lead={
          <p lang="hi" className="font-devanagari">
            ये वही पाठ्यक्रम हैं जो सीखें पृष्ठ पर हैं। पूरा होने का पत्र पाठ्यक्रम पृष्ठ पर तब दिखता है जब हर पाठ चिह्नित हो। यह पद या सार्वजनिक अंक नहीं है।
          </p>
        }
      >
        <p className="mt-4 text-footnote">
          <Link href="/learn/" className="inline-flex min-h-tap items-center font-semibold text-tint underline-offset-4 hover:underline">
            <span aria-hidden="true">‹&nbsp;</span>
            <span>All of Learn</span>&nbsp;<span lang="hi" className="font-devanagari">सीखें</span>
          </Link>
        </p>
      </PageHeader>

      <div className="mx-auto mt-8 max-w-content space-y-10 px-gutter">
        {ACADEMY_LEVELS.map((level) => (
          <section key={level.id} aria-labelledby={`level-${level.id}`}>
            <SectionTitle id={`level-${level.id}`} title={level.en} titleHi={level.hi} />
            <ul className="apple-group shadow-raised">
              {ACADEMY_COURSES.filter((course) => course.level === level.id).map((course) => (
                <AcademyRow key={course.id} href={`/learn/${course.id}/`} hi={course.titleHi} en={course.titleEn} />
              ))}
            </ul>
          </section>
        ))}

        <section aria-labelledby="academy-orders">
          <SectionTitle
            id="academy-orders"
            title="Reading orders"
            titleHi="पढ़ने के क्रम"
            sub={
              <span lang="hi" className="font-devanagari">
                कर्मयोग और ध्यान के अलग पाठ्यक्रम नहीं हैं। ये पढ़ने के क्रम हैं।
              </span>
            }
          />
          <ul className="apple-group shadow-raised">
            {ACADEMY_ORDERS.map((order) => (
              <AcademyRow key={order.href} href={order.href} hi={order.titleHi} en={order.titleEn} />
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
