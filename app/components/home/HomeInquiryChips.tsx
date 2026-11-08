'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { triggerTactileFeedback } from '@/lib/haptics';

const HOME_GUIDES = [
  {
    id: 'inquiry',
    hindi: 'जीवन के प्रश्न',
    english: 'Life & reflection',
    accent: 'border-dharma-maroon/25 bg-dharma-maroon/5',
    iconAccent: 'bg-dharma-maroon/10',
    links: [
      { icon: '🕊️', hindi: 'तनाव और चिन्ता', english: 'Stress & worry', href: '/wisdom-for-life/stress-and-worry/' },
      { icon: '⚖️', hindi: 'कर्म और कर्तव्य', english: 'Action & duty', href: '/scripture/bhagavadgita/chapter/2/verse/47/' },
      { icon: '🕯️', hindi: 'शोक से उबरना', english: 'Living with grief', href: '/wisdom-pathways/sanatan-on-grief/' },
      { icon: '✨', hindi: 'आत्मज्ञान', english: 'Self-knowledge', href: '/wisdom-pathways/upanishads-on-self/' },
    ],
  },
  {
    id: 'practice',
    hindi: 'दैनिक साधना',
    english: 'Daily practice',
    accent: 'border-dharma-gold/30 bg-dharma-gold/5',
    iconAccent: 'bg-dharma-gold/10',
    links: [
      { icon: '📿', hindi: '108 जप साधना', english: 'Japa practice', href: '/practice/' },
      { icon: '🌅', hindi: 'आज का पंचांग', english: 'Daily Panchang', href: '/panchang/' },
      { icon: '🔱', hindi: 'महामृत्युंजय मन्त्र', english: 'Mahamrityunjaya', href: '/mantras/mahamrityunjaya/' },
      { icon: '☀️', hindi: 'गायत्री मन्त्र', english: 'Gayatri Mantra', href: '/mantras/gayatri-mantra/' },
    ],
  },
] as const;

export function HomeInquiryChips() {
  return (
    <div className="mx-auto mt-6 grid w-full max-w-3xl gap-3 text-left sm:mt-7 sm:grid-cols-2">
      {HOME_GUIDES.map((group) => (
        <nav
          key={group.id}
          aria-labelledby={`home-guide-${group.id}`}
          className={`rounded-2xl border p-2.5 sm:p-3 ${group.accent}`}
        >
          <h2 id={`home-guide-${group.id}`} className="mb-2 flex flex-wrap items-baseline gap-x-2 px-1 text-sm font-semibold text-dharma-text">
            <span lang="hi" className="font-devanagari">{group.hindi}</span>
            <span className="text-xs font-medium text-dharma-muted">{group.english}</span>
          </h2>
          <ul className="grid grid-cols-2 gap-1.5">
            {group.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => triggerTactileFeedback('selection', 'softTap')}
                  className="focus-ring group flex h-full min-h-[52px] items-start gap-1.5 rounded-xl border border-dharma-border/80 bg-dharma-card/90 px-1.5 py-2 text-dharma-text transition-colors hover:border-dharma-saffron/60 hover:bg-dharma-card sm:items-center sm:px-2"
                >
                  <span aria-hidden="true" className={`grid h-6 w-6 shrink-0 place-items-center rounded-md text-xs ${group.iconAccent}`}>
                    {link.icon}
                  </span>
                  <span className="min-w-0 flex-1 break-words">
                    <span lang="hi" className="block font-devanagari text-xs font-semibold leading-snug">{link.hindi}</span>
                    <span className="mt-0.5 block text-[11px] leading-tight text-dharma-muted">{link.english}</span>
                  </span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="hidden h-3.5 w-3.5 shrink-0 text-dharma-muted group-hover:text-dharma-saffron motion-safe:transition-transform motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5 md:block"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ))}
    </div>
  );
}
