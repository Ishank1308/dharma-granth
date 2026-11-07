import { ERROR_RECOVERY_VERSE } from '@/lib/error-recovery-verse';

export function ErrorRecoveryVerse() {
  return (
    <section aria-label="Bhagavad Gita 2.47" className="mt-8 rounded-2xl border border-dharma-border bg-dharma-card p-5 text-left shadow-sm sm:p-6">
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-saffron-700 dark:text-saffron-400">
        {ERROR_RECOVERY_VERSE.reference} · A moment of steadiness
      </p>
      <p lang="sa" className="mt-4 whitespace-pre-line font-devanagari text-lg leading-loose text-dharma-text">
        {ERROR_RECOVERY_VERSE.sanskrit.trim()}
      </p>
      <p lang="hi" className="mt-4 whitespace-pre-line font-devanagari text-sm leading-relaxed text-dharma-muted">
        {ERROR_RECOVERY_VERSE.hindi.trim()}
      </p>
      <p lang="en" className="mt-3 font-serif text-sm leading-relaxed text-dharma-muted">
        {ERROR_RECOVERY_VERSE.english}
      </p>
    </section>
  );
}
