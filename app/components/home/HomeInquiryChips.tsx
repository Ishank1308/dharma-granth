'use client';

import Link from 'next/link';
import {
  Bird,
  ChevronRight,
  CircleDot,
  Compass,
  Flame,
  Flower2,
  Scale,
  Sparkles,
  Sun,
  Sunrise,
} from 'lucide-react';
import { triggerTactileFeedback } from '@/lib/haptics';

/** Content-first entry points. No mood profiling or stored user preference. */
const HOME_GUIDES = [
  {
    id: 'inquiry',
    icon: Compass,
    hindi: 'जीवन के प्रश्न',
    english: 'Explore life's questions',
    accent: 'bg-dharma-maroon/5',
    iconAccent: 'bg-dharma-maroon/10 text-dharma-maroon',
    links: [
      { Icon: Bird, hindi: 'तनाव और चिन्ता', english: 'Stress & worry', href: '/wisdom-for-life/stress-and-worry/' },
      { Icon: Scale, hindi: 'कर्म और कर्तव्य', english: 'Action & duty', href: '/scripture/bhagavadgita/chapter/2/verse/47/' },
      { Icon: Flower2, hindi: 'शोक से उबरना', english: 'Living with grief', href: '/wisdom-pathways/sanatan-on-grief/' },
      { Icon: Sparkles, hindi: 'आत्मज्ञान', english: 'Self-knowledge', href: '/wisdom-pathways/upanishads-on-self/' },
    ],
  },
  {
    id: 'practice',
    icon: Sunrise,
    hindi: 'दैनिक साधना',
    english: 'Find a daily practice',
    accent: 'bg-dharma-gold/5',
    iconAccent: 'bg-dharma-gold/10 text-dharma-saffron',
    links: [
      { Icon: CircleDot, hindi: '108 जप साधना', english: 'Japa practice', href: '/practice/' },
      { Icon: Sunrise, hindi: 'आज का पंचांग', english: 'Daily Panchang', href: '/panchang/' },
      { Icon: Flame, hindi: 'महामृत्युंजय मन्त्र', english: 'Mahamrityunjaya', href: '/mantras/mahamrityunjaya/' },
      { Icon: Sun, hindi: 'गायत्री मन्त्र', english: 'Gayatri Mantra', href: '/mantras/gayatri-mantra/' },
    ],
  },
] as const;

export function HomeInquiryChips() {
  return (
    <div className="mt-6 grid gap-4 lg:grid-cols-2 lg:gap-5">
      {HOME_GUIDES.map((guide, index) => (
        <nav
          key={guide.id}
          aria-labelledby={'home-guide-' + guide.id}
          className={'relative overflow-hidden rounded-panel border border-dharma-border/80 p-4 shadow-raised sm:p-5 ' + guide.accent}
        >
          <div className="pointer-events-none absolute -right-16 -top-20 size-52 rounded-full border border-dharma-saffron/10" aria-hidden="true" />
          <div className="relative flex items-center gap-3">
            <span className={'grid h-11 w-11 shrink-0 place-items-center rounded-2xl ' + guide.iconAccent}>
              <guide.icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <h3 id={'home-guide-' + guide.id} lang="hi" className="font-devanagari text-lg font-semibold leading-snug text-dharma-text">
                {guide.hindi}
              </h3>
              <p className="mt-0.5 text-xs text-dharma-muted">{guide.english}</p>
            </div>
            <span aria-hidden="true" className="text-xs font-semibold tabular-nums text-dharma-muted">
              0{index + 1} / 02
            </span>
          </div>
          <ul className="relative mt-4 grid gap-2 sm:grid-cols-2">
            {guide.links.map((item) => (
              <li key={item.href} className="min-w-0">
                <Link
                  href={item.href}
                  onClick={() => triggerTactileFeedback('selection', 'softTap')}
                  className="focus-ring group flex h-full min-h-[65px] items-center gap-2.5 rounded-xl border border-dharma-border/70 bg-dharma-card/90 px-3 py-2.5 text-dharma-text motion-safe:transition-[transform,border-color,background-color] motion-safe:duration-standard motion-safe:hover:-translate-y-0.5 hover:border-dharma-saffron/45 hover:bg-dharma-card"
                >
                  <span aria-hidden="true" className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-dharma-saffron/10 text-dharma-saffron">
                    <item.Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span lang="hi" className="block font-devanagari text-sm font-semibold leading-relaxed">{item.hindi}</span>
                    <span className="block text-xs leading-snug text-dharma-muted">{item.english}</span>
                  </span>
                  <ChevronRight aria-hidden="true" className="h-4 w-4 shrink-0 text-dharma-muted motion-safe:transition-transform motion-safe:group-hover:translate-x-0.5" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ))}
    </div>
  );
}
