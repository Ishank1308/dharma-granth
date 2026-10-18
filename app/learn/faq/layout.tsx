import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { JsonLd } from '@/app/components/JsonLd';
import { SCRIPTURE_FAQS } from '@/data/scripture-faqs';
import { faqLd, pageLd } from '@/lib/jsonld';

export const metadata: Metadata = {
  title: 'Scripture & Tradition FAQs · जिज्ञासा एवं समाधान',
  description:
    'Authoritative, sourced, non-dogmatic answers to essential questions about Hindu scriptures, philosophical traditions, ethics, and common misconceptions.',
  alternates: { canonical: '/learn/faq/' },
  openGraph: {
    title: 'Scripture & Tradition FAQs · जिज्ञासा एवं समाधान',
    description:
      'Authoritative, sourced, non-dogmatic answers to essential questions about Hindu scriptures, philosophical traditions, ethics, and common misconceptions.',
    url: '/learn/faq/',
    images: [DEFAULT_OG_IMAGE],
  },
};

// Every question appears in English and in Hindi, each with its own-language answer.
const FAQ_JSON_LD = pageLd(
  [
    { name: 'Learn', path: '/learn' },
    { name: 'FAQs', path: '/learn/faq' },
  ],
  faqLd({
    path: '/learn/faq',
    items: SCRIPTURE_FAQS.flatMap((f) => [
      { question: f.questionEn, answer: f.answerEn },
      { question: f.questionHi, answer: f.answerHi },
    ]).filter((i) => i.question.trim() && i.answer.trim()),
  }),
);

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={FAQ_JSON_LD} />
      {children}
    </>
  );
}
