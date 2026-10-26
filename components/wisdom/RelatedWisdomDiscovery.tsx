import Link from 'next/link';
import { getRelatedWisdom, type RelatedWisdomInput } from '@/lib/wisdom-discovery/related-wisdom';

const groupHeading = 'text-sm font-semibold text-dharma-text';
const groupSub = 'ml-1 text-xs font-medium text-dharma-muted';
const linkCls =
  'inline-flex min-h-[44px] items-center text-sm text-saffron-800 underline decoration-saffron-800/30 underline-offset-4 hover:decoration-saffron-800 dark:text-saffron-300';

type Props = Omit<RelatedWisdomInput, 'scriptureId' | 'chapterId' | 'verseId'> & {
  scriptureId: string;
  chapterId: number;
  verseId: number | string;
};

/**
 * Related Wisdom discovery section (Phases 3, 8–10).
 * Server-rendered HTML only — no client JS, no layout shift. Mount AFTER the
 * Modern Context layer (verse pages render it as a child of VerseReader, which
 * sits below ReaderLayers), so reading is never interrupted. Stored editorial
 * links only; renders nothing when there is nothing stored.
 */
export function RelatedWisdomDiscovery({ scriptureId, chapterId, verseId, ...explicit }: Props) {
  const related = getRelatedWisdom({ scriptureId, chapterId, verseId, ...explicit });
  if (related.isEmpty) return null;

  return (
    <section aria-label="संबंधित ज्ञान — खोज" className="mt-8 border-t border-dharma-border pt-6">
      <h2 className="font-serif text-lg font-bold text-dharma-text">
        <span lang="hi" className="font-devanagari">संबंधित ज्ञान</span>{' '}
        <span className="ml-1 text-sm font-medium text-dharma-muted">Related wisdom</span>
      </h2>
      <p className="mt-1 text-xs leading-relaxed text-dharma-muted">
        ये दर्ज संबंध हैं। अपने आप सुझाए हुए पाठ नहीं।
      </p>
      <div className="mt-4 space-y-4">
        {related.concepts.length > 0 && (
          <div>
            <h3 className={groupHeading}>
              <span lang="hi" className="font-devanagari">संबंधित अवधारणाएँ</span>{' '}
              <span className={groupSub}>Related concepts</span>
            </h3>
            <ul className="mt-1">
              {related.concepts.map((item) => (
                <li key={`concept-${item.href}`}>
                  <Link href={item.href} className={linkCls}>
                    {item.sanskrit ? (
                      <span lang="sa" className="font-devanagari">{item.sanskrit}</span>
                    ) : null}
                    {item.labelHi && item.labelHi !== item.sanskrit ? (
                      <span lang="hi" className="ml-1.5 font-devanagari">{item.labelHi}</span>
                    ) : null}
                    {item.labelEn && item.labelEn !== item.labelHi && item.labelEn !== item.sanskrit ? (
                      <span className="ml-1.5 text-dharma-muted">{item.labelEn}</span>
                    ) : null}
                    {!item.sanskrit && !item.labelHi ? (
                      <span lang="hi" className="font-devanagari">{item.labelEn}</span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        {related.questions.length > 0 && (
          <div>
            <h3 className={groupHeading}>
              <span lang="hi" className="font-devanagari">संबंधित प्रश्न</span>{' '}
              <span className={groupSub}>Related questions</span>
            </h3>
            <ul className="mt-1">
              {related.questions.map((item) => (
                <li key={`question-${item.href}`}>
                  <Link href={item.href} className={linkCls}>
                    <span lang="hi" className="font-devanagari">{item.labelHi}</span>
                    {item.labelEn && item.labelEn !== item.labelHi ? (
                      <span className="ml-1.5 text-dharma-muted">{item.labelEn}</span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        {related.teachings.length > 0 && (
          <div>
            <h3 className={groupHeading}>
              <span lang="hi" className="font-devanagari">संबंधित उपदेश</span>{' '}
              <span className={groupSub}>Related teachings</span>
            </h3>
            <ul className="mt-1 space-y-1">
              {related.teachings.map((item) => (
                <li key={`teaching-${item.title}`}>
                  <p className="text-xs font-bold uppercase tracking-wide text-dharma-muted">
                    {item.kindLabel}
                  </p>
                  {item.href ? (
                    <Link href={item.href} className={linkCls}>{item.title}</Link>
                  ) : (
                    <p className="text-sm font-semibold text-dharma-text">{item.title}</p>
                  )}
                  <p className="text-sm text-dharma-muted">{item.reason}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
        {related.verses.length > 0 && (
          <div>
            <h3 className={groupHeading}>
              <span lang="hi" className="font-devanagari">संबंधित श्लोक</span>{' '}
              <span className={groupSub}>Related verses</span>
            </h3>
            <ul className="mt-1">
              {related.verses.map((item) => (
                <li key={`verse-${item.href}`}>
                  <Link href={item.href} className={linkCls}>
                    {item.sanskrit ? (
                      <span lang="sa" className="font-devanagari">{item.sanskrit}</span>
                    ) : null}
                    <span lang="hi" className={item.sanskrit ? 'ml-1.5 font-devanagari' : 'font-devanagari'}>
                      {item.labelHi}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        {related.scriptures.length > 0 && (
          <div>
            <h3 className={groupHeading}>
              <span lang="hi" className="font-devanagari">संबंधित ग्रंथ</span>{' '}
              <span className={groupSub}>Related scriptures</span>
            </h3>
            <ul className="mt-1">
              {related.scriptures.map((item) => (
                <li key={`scripture-${item.href}`}>
                  <Link href={item.href} className={linkCls}>
                    {item.sanskrit ? (
                      <span lang="sa" className="font-devanagari">{item.sanskrit}</span>
                    ) : null}
                    {item.labelEn && item.labelEn !== item.sanskrit ? (
                      <span className={item.sanskrit ? 'ml-1.5 text-dharma-muted' : ''}>{item.labelEn}</span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        {related.pathways.length > 0 && (
          <div>
            <h3 className={groupHeading}>
              <span lang="hi" className="font-devanagari">ज्ञान-मार्ग</span>{' '}
              <span className={groupSub}>Wisdom paths</span>
            </h3>
            <ul className="mt-1">
              {related.pathways.map((item) => (
                <li key={`pathway-${item.href}`}>
                  <Link href={item.href} className={linkCls}>
                    <span lang="hi" className="font-devanagari">{item.labelHi}</span>
                    {item.labelEn && item.labelEn !== item.labelHi ? (
                      <span className="ml-1.5 text-dharma-muted">{item.labelEn}</span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        {related.sages.length > 0 && (
          <div>
            <h3 className={groupHeading}>
              <span lang="hi" className="font-devanagari">संबंधित ऋषि-संत</span>{' '}
              <span className={groupSub}>Related sages</span>
            </h3>
            <ul className="mt-1">
              {related.sages.map((item) => (
                <li key={`sage-${item.href}`}>
                  <Link href={item.href} className={linkCls}>
                    {item.sanskrit ? (
                      <span lang="sa" className="font-devanagari">{item.sanskrit}</span>
                    ) : null}
                    {item.labelEn && item.labelEn !== item.sanskrit ? (
                      <span className={item.sanskrit ? 'ml-1.5 text-dharma-muted' : ''}>{item.labelEn}</span>
                    ) : null}
                    {!item.sanskrit && !item.labelEn ? (
                      <span lang="hi" className="font-devanagari">{item.labelHi}</span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
