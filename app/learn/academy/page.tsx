import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import Link from 'next/link';
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

export default function AcademyPage() {
  return (
    <main id="main" className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <p className="text-sm text-dharma-text-secondary">
        <Link href="/learn" className="font-semibold text-saffron-600 underline underline-offset-2">सीखें</Link>
      </p>
      <h1 className="mt-3 font-serif text-3xl font-bold text-dharma-text">
        <span lang="hi" className="font-devanagari">धर्म अकादमी</span>
      </h1>
      <p className="mt-1 text-dharma-text-secondary">Dharma Academy</p>
      <p lang="hi" className="mt-3 text-sm leading-relaxed text-dharma-text">
        ये वही पाठ्यक्रम हैं जो सीखें पृष्ठ पर हैं। पूरा होने का पत्र पाठ्यक्रम पृष्ठ पर तब दिखता है जब हर पाठ चिह्नित हो। यह पद या सार्वजनिक अंक नहीं है।
      </p>

      <div className="mt-8 space-y-8">
        {ACADEMY_LEVELS.map((level) => (
          <section key={level.id} aria-labelledby={`level-${level.id}`}>
            <h2 id={`level-${level.id}`} className="font-serif text-xl font-bold text-dharma-text">
              <span lang="hi" className="font-devanagari">{level.hi}</span>
              <span className="font-normal text-dharma-text-secondary"> · {level.en}</span>
            </h2>
            <ul className="mt-3 space-y-2">
              {ACADEMY_COURSES.filter((course) => course.level === level.id).map((course) => (
                <li key={course.id}>
                  <Link href={`/learn/${course.id}`} className="font-semibold text-saffron-600 underline underline-offset-2">
                    <span lang="hi" className="font-devanagari">{course.titleHi}</span>
                    <span className="font-normal text-dharma-text-secondary"> · {course.titleEn}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section aria-labelledby="academy-orders" className="mt-10 rounded-2xl border border-dharma-border bg-dharma-card p-5">
        <h2 id="academy-orders" className="font-serif text-xl font-bold text-dharma-text">
          <span lang="hi" className="font-devanagari">पढ़ने के क्रम</span>
        </h2>
        <p lang="hi" className="mt-2 text-sm leading-relaxed text-dharma-text">
          कर्मयोग और ध्यान के अलग पाठ्यक्रम नहीं हैं। ये पढ़ने के क्रम हैं।
        </p>
        <ul className="mt-3 space-y-2">
          {ACADEMY_ORDERS.map((order) => (
            <li key={order.href}>
              <Link href={order.href} className="font-semibold text-saffron-600 underline underline-offset-2">
                <span lang="hi" className="font-devanagari">{order.titleHi}</span>
                <span className="font-normal text-dharma-text-secondary"> · {order.titleEn}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
