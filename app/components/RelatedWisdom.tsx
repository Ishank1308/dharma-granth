import Link from 'next/link';
import type { VerseKnowledge } from '@/lib/knowledge-graph';

const groups = [
  { key: 'concepts' as const, hi: 'संबंधित अवधारणाएँ', en: 'Related concepts' },
  { key: 'questions' as const, hi: 'संबंधित प्रश्न', en: 'Related questions' },
  { key: 'verses' as const, hi: 'संबंधित श्लोक', en: 'Related verses' },
];

/** Quiet links after the verse. Stored connections only. */
export function RelatedWisdom({ knowledge }: { knowledge: VerseKnowledge }) {
  const visible = groups.filter((group) => knowledge[group.key].length > 0);
  if (visible.length === 0) return null;

  return (
    <section aria-label="संबंधित ज्ञान" className="mt-8 border-t border-dharma-border pt-6">
      <h2 className="font-serif text-lg font-bold text-dharma-text">
        <span lang="hi" className="font-devanagari">संबंधित ज्ञान</span>
        <span className="ml-2 text-sm font-medium text-dharma-muted">Related wisdom</span>
      </h2>
      <p className="mt-1 text-xs leading-relaxed text-dharma-muted">
        ये दर्ज संबंध हैं। अपने आप सुझाए हुए पाठ नहीं।
      </p>
      <div className="mt-4 space-y-4">
        {visible.map((group) => (
          <div key={group.key}>
            <h3 className="text-sm font-semibold text-dharma-text">
              <span lang="hi" className="font-devanagari">{group.hi}</span>
              <span className="ml-2 text-xs font-medium text-dharma-muted">{group.en}</span>
            </h3>
            <ul className="mt-1">
              {knowledge[group.key].map((item) => {
                const hindi = item.labelHi !== item.sanskrit ? item.labelHi : null;
                const english = item.labelEn !== item.labelHi && item.labelEn !== item.sanskrit ? item.labelEn : null;
                return (
                <li key={`${group.key}-${item.href}`}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-[44px] items-center text-sm text-saffron-800 underline decoration-saffron-800/30 underline-offset-4 hover:decoration-saffron-800 dark:text-saffron-300"
                  >
                    {item.sanskrit ? <span lang="sa" className="font-devanagari">{item.sanskrit}</span> : null}
                    {hindi ? <span lang="hi" className="ml-1.5 font-devanagari">{hindi}</span> : null}
                    {english ? <span className="ml-1.5 text-dharma-muted">{english}</span> : null}
                    {!item.sanskrit && !hindi ? <span lang="hi" className="font-devanagari">{item.labelHi}</span> : null}
                  </Link>
                </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
