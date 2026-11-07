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
    <main className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-4">
        <h1 className="font-serif text-2xl text-label-primary">ज्ञान मार्ग · Wisdom Pathways</h1>
        <p className="text-body text-label-secondary">
          पुनः प्रेषित किया जा रहा है… Redirecting to Wisdom Pathways…
        </p>
        <Link
          href="/wisdom-pathways/"
          className="inline-flex min-h-[44px] items-center justify-center rounded-pill bg-tint px-6 py-2.5 text-body font-semibold text-on-tint shadow-sm hover:opacity-95 active:scale-[0.98] transition-all"
        >
          यहाँ क्लिक करें · Open Wisdom Pathways
        </Link>
      </div>
    </main>
  );
}
