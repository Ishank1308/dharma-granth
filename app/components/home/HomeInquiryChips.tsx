'use client';

import Link from 'next/link';
import { triggerTactileFeedback } from '@/lib/haptics';

interface InquiryChip {
  id: string;
  icon: string;
  hindi: string;
  english: string;
  href: string;
}

const INQUIRY_CHIPS: readonly InquiryChip[] = [
  {
    id: 'anxiety',
    icon: '🕊️',
    hindi: 'तनाव व चिन्ता',
    english: 'Peace & Worry',
    href: '/wisdom-for-life/stress-and-worry/',
  },
  {
    id: 'duty',
    icon: '⚖️',
    hindi: 'कर्म व कर्तव्य',
    english: 'Duty (Gita 2.47)',
    href: '/scripture/bhagavadgita/chapter/2/verse/47/',
  },
  {
    id: 'grief',
    icon: '🕯️',
    hindi: 'शोक से मुक्ति',
    english: 'Healing Grief',
    href: '/wisdom-pathways/sanatan-on-grief/',
  },
  {
    id: 'self-knowledge',
    icon: '✨',
    hindi: 'तत्त्वमसि आत्मज्ञान',
    english: 'Self-Knowledge',
    href: '/wisdom-pathways/upanishads-on-self/',
  },
  {
    id: 'japa',
    icon: '📿',
    hindi: '108 जप साधना',
    english: 'Japa Practice',
    href: '/practice/',
  },
  {
    id: 'panchang',
    icon: '🌅',
    hindi: 'दैनिक पञ्चाङ्ग',
    english: 'Daily Panchang',
    href: '/panchang/',
  },
  {
    id: 'mrityunjaya',
    icon: '🔱',
    hindi: 'महामृत्युंजय मन्त्र',
    english: 'Protection & Health',
    href: '/mantras/mahamrityunjaya/',
  },
  {
    id: 'gayatri',
    icon: '☀️',
    hindi: 'गायत्री मन्त्र',
    english: 'Wisdom & Light',
    href: '/mantras/gayatri-mantra/',
  },
];

export function HomeInquiryChips() {
  const handleClick = () => {
    triggerTactileFeedback('selection', 'softTap');
  };

  return (
    <div className="mx-auto mt-6 w-full max-w-3xl">
      <div className="mb-2.5 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-dharma-saffron">
        <span aria-hidden="true">✦</span>
        <span>जिज्ञासा व दैनिक साधना</span>
        <span aria-hidden="true" className="text-dharma-muted">·</span>
        <span className="text-dharma-muted font-normal">Sacred Inquiries & Practice</span>
        <span aria-hidden="true">✦</span>
      </div>

      <div
        role="region"
        aria-label="जीवन जिज्ञासा व दैनिक साधना के त्वरित सूत्र"
        className="flex items-center gap-2 overflow-x-auto px-1 py-1.5 scrollbar-none sm:flex-wrap sm:justify-center"
      >
        {INQUIRY_CHIPS.map((chip) => (
          <Link
            key={chip.id}
            href={chip.href}
            onClick={handleClick}
            className="group inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-full border border-dharma-border/80 bg-dharma-card/90 px-3.5 py-2 text-xs font-medium text-dharma-text shadow-xs backdrop-blur-xs transition-all hover:border-dharma-saffron/60 hover:bg-dharma-saffron/5 hover:text-dharma-saffron focus-ring"
          >
            <span aria-hidden="true" className="text-sm select-none">
              {chip.icon}
            </span>
            <span className="font-devanagari font-medium text-dharma-text group-hover:text-dharma-saffron">
              {chip.hindi}
            </span>
            <span className="hidden text-[11px] text-dharma-muted group-hover:text-dharma-saffron/80 md:inline">
              · {chip.english}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
