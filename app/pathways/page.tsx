'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PathwaysRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/wisdom-pathways/');
  }, [router]);

  return (
    <main className="apple-scope relative flex min-h-[70vh] flex-col items-center justify-center p-6 text-center overflow-hidden bg-dharma-bg">
      {/* Contemplative Sage Aura Backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 h-[460px] w-full max-w-4xl rounded-full bg-radial from-amber-400/20 via-saffron-500/10 to-transparent blur-3xl"
      />

      <div className="card-sacred relative z-10 max-w-md space-y-4 rounded-3xl border border-dharma-border/80 bg-dharma-card/85 backdrop-blur-xl p-8 shadow-soft">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-dharma-text">ज्ञान मार्ग · Wisdom Pathways</h1>
        <p className="text-sm text-dharma-muted">
          पुनः प्रेषित किया जा रहा है… Redirecting to Wisdom Pathways…
        </p>
        <Link
          href="/wisdom-pathways/"
          className="liquid-pill inline-flex min-h-[44px] items-center justify-center rounded-full bg-saffron-600 hover:bg-saffron-700 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          ज्ञान मार्ग देखें · Open Wisdom Pathways
        </Link>
      </div>
    </main>
  );
}
