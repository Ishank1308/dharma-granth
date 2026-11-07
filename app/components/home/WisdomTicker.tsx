import Link from 'next/link';
import { readHref } from '@/lib/verse-paths';

interface Saying {
  sa: string;
  en: string;
  cite: string;
  scriptureId: string;
  chapter: number;
  verse: string;
}

/**
 * Mahāvākyas and Upaniṣadic maxims. Every one is a whole sentence of prose, not part of a metrical
 * verse, so nothing here cuts a shloka short. Each links to its passage in this library, where the
 * whole text and its printed translation are; the English here is a short gloss.
 */
const SAYINGS: Saying[] = [
  { sa: 'प्रज्ञानं ब्रह्म', en: 'Consciousness is Brahman', cite: 'Aitareya 3.3', scriptureId: 'aitareya', chapter: 5, verse: '3' },
  { sa: 'अहं ब्रह्मास्मि', en: 'I am Brahman', cite: 'Bṛhadāraṇyaka 1.4.10', scriptureId: 'brihadaranyaka', chapter: 4, verse: '1.4.10' },
  { sa: 'तत्त्वमसि', en: 'Thou art That', cite: 'Chāndogya 6.8.7', scriptureId: 'chandogya', chapter: 105, verse: '6.8.7' },
  { sa: 'अयमात्मा ब्रह्म', en: 'This Self is Brahman', cite: 'Māṇḍūkya 2', scriptureId: 'mandukya', chapter: 1, verse: '2' },
  { sa: 'सर्वं खल्विदं ब्रह्म', en: 'All this is Brahman', cite: 'Chāndogya 3.14.1', scriptureId: 'chandogya', chapter: 51, verse: '3.14.1' },
  { sa: 'सत्यं वद । धर्मं चर ।', en: 'Speak the truth. Walk in dharma.', cite: 'Taittirīya 1.11', scriptureId: 'taittiriya', chapter: 1, verse: '11' },
  {
    sa: 'मातृदेवो भव । पितृदेवो भव । आचार्यदेवो भव । अतिथिदेवो भव ।',
    en: 'Honour mother, father, teacher and guest as the divine.',
    cite: 'Taittirīya 1.11',
    scriptureId: 'taittiriya',
    chapter: 1,
    verse: '11',
  },
  {
    sa: 'असतो मा सद्गमय । तमसो मा ज्योतिर्गमय । मृत्योर्मामृतं गमय ।',
    en: 'Lead me from the unreal to the real, from darkness to light, from death to immortality.',
    cite: 'Bṛhadāraṇyaka 1.3.28',
    scriptureId: 'brihadaranyaka',
    chapter: 3,
    verse: '1.3.28',
  },
  { sa: 'आनन्दो ब्रह्मेति व्यजानात्', en: 'He knew that bliss is Brahman', cite: 'Taittirīya 3.6', scriptureId: 'taittiriya', chapter: 3, verse: '6' },
];

/**
 * A quiet band of Upaniṣadic sayings that drifts slowly across the page (motion.css, section 10).
 * A server component with no script: the list is in the exported HTML, the marquee is CSS, it
 * pauses under the pointer or keyboard focus, and with reduced motion or a lite mode it is a still,
 * wrapped list. The second copy exists only to make the loop seamless, so it is hidden from
 * assistive tech and its links are out of the tab order.
 */
export function WisdomTicker() {
  return (
    <section aria-labelledby="wisdom-band-heading" className="border-y border-[color:var(--separator)] bg-dharma-card/50">
      <h2 id="wisdom-band-heading" className="sr-only">
        <span>Sayings of the Upaniṣads</span> <span lang="hi">उपनिषद् के महावाक्य</span>
      </h2>
      <div className="ticker" data-testid="wisdom-ticker">
        <div className="ticker-track">
          {[0, 1].map((copy) => (
            <ul key={copy} aria-hidden={copy === 1 || undefined} className="ticker-group">
              {SAYINGS.map((s) => (
                <li key={s.sa}>
                  <Link
                    href={readHref(s.scriptureId, s.chapter, s.verse)}
                    tabIndex={copy === 1 ? -1 : undefined}
                    className="group inline-flex items-baseline gap-3 text-[length:var(--text-subhead)]"
                  >
                    <span lang="sa" className="shloka-text text-[length:var(--text-title-3)] text-dharma-saffron">
                      {s.sa}
                    </span>{' '}
                    <span className="text-dharma-text-secondary group-hover:text-dharma-text">{s.en}</span>{' '}
                    <span className="text-[length:var(--text-footnote)] text-dharma-muted">{s.cite}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
