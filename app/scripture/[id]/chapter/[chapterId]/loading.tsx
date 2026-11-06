/**
 * Loading state for a chapter, shaped like the page it becomes: a centred
 * title, a hairline, then verses on the page. While it waits, a single
 * Rāt-rānī blossom breathes where the scripture's emblem will draw in.
 * Pure CSS (no client JavaScript), so it shows the instant a chapter is asked for.
 */
export default function ChapterLoading() {
  return (
    <main data-chapter-reading className="min-h-screen bg-dharma-bg" aria-busy="true" aria-label="अध्याय खुल रहा है · Opening the chapter">
      <header className="mx-auto max-w-2xl px-4 pb-10 pt-10 text-center sm:pt-14">
        <svg viewBox="-24 -24 48 48" className="loading-blossom mx-auto h-10 w-10" aria-hidden="true">
          {[0, 72, 144, 216, 288].map((a) => (
            <path key={a} transform={`rotate(${a})`} d="M0 0C4-5 4.5-12 0-17C-4.5-12-4-5 0 0Z" />
          ))}
        </svg>
        <div className="skeleton-line mx-auto mt-6 h-3 w-28" />
        <div className="skeleton-line mx-auto mt-4 h-8 w-64 max-w-full" />
        <div className="skeleton-line mx-auto mt-3 h-5 w-40" />
        <div className="liquid-rule mx-auto mt-6 w-24" />
      </header>
      <div className="mx-auto max-w-3xl space-y-12 px-4 sm:px-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className="border-b border-dharma-border/50 pb-10" style={{ animationDelay: `${i * 120}ms` }}>
            <div className="skeleton-line h-3 w-10" />
            <div className="mx-auto mt-6 max-w-md space-y-3">
              <div className="skeleton-line mx-auto h-4 w-full" />
              <div className="skeleton-line mx-auto h-4 w-5/6" />
            </div>
            <div className="mt-8 space-y-2.5">
              <div className="skeleton-line h-3 w-full" />
              <div className="skeleton-line h-3 w-11/12" />
              <div className="skeleton-line h-3 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
