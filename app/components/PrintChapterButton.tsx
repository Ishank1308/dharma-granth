'use client';

import { Printer } from 'lucide-react';

/** Opens the browser's print dialog; "Save as PDF" is a destination there. app/globals.css has the print layout. */
export function PrintChapterButton({ className = '' }: { className?: string }) {
  return (
    <button type="button" onClick={() => window.print()} className={`${className} print:hidden`}>
      <Printer className="h-3.5 w-3.5" aria-hidden="true" />
      <span lang="hi" className="font-devanagari">अध्याय प्रिंट / PDF</span>
    </button>
  );
}
