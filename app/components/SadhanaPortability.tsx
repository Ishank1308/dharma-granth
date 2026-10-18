'use client';

import { useRef, useState } from 'react';
import { Download, Upload } from 'lucide-react';
import { createSadhanaBackup, restoreSadhanaBackup } from '@/lib/sadhana-backup';

const MAX_BYTES = 5 * 1024 * 1024;

/** Export and restore of sadhana journals and lesson progress. Stays on this device until the reader downloads it. */
export function SadhanaPortability() {
  const fileInput = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState('');

  function download() {
    try {
      const blob = new Blob([JSON.stringify(createSadhanaBackup(), null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dharma-sadhana-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
      setMessage('साधना फ़ाइल डाउनलोड हो गई। इसे दूसरे उपकरण पर Restore Backup से खोलें।');
    } catch {
      setMessage('बैकअप नहीं बन सका। ब्राउज़र स्टोरेज बंद हो सकता है।');
    }
  }

  async function upload(file: File | undefined) {
    if (!file) return;
    const reset = () => {
      if (fileInput.current) fileInput.current.value = '';
    };
    if (file.size > MAX_BYTES) {
      setMessage('यह फ़ाइल बहुत बड़ी है।');
      reset();
      return;
    }
    if (!window.confirm('यह इस ब्राउज़र की जप, ध्यान, चिंतन, कृतज्ञता, संकल्प और अध्ययन प्रगति को बैकअप से बदलेगा। गलत फ़ाइल कुछ नहीं लिखेगी। जारी रखें?')) {
      reset();
      return;
    }
    try {
      const count = restoreSadhanaBackup(await file.text());
      setMessage(`${count} सहेजे गए। पृष्ठ फिर से खुल रहा है।`);
      setTimeout(() => window.location.reload(), 700);
    } catch {
      setMessage('यह मान्य साधना बैकअप नहीं है। आपकी जर्नल ज्यों की त्यों है।');
    }
    reset();
  }

  return (
    <section aria-labelledby="sadhana-portability-heading" className="mt-10 rounded-2xl border border-saffron-200 bg-white/70 p-5 dark:border-saffron-900/40 dark:bg-white/5">
      <h2 id="sadhana-portability-heading" className="font-serif text-lg font-bold text-dharma-text">
        साधना साथ ले जाएँ
      </h2>
      <p className="mt-1 text-sm text-dharma-muted">
        जप, ध्यान, दैनिक चिंतन, कृतज्ञता, संकल्प और अध्ययन की प्रगति केवल इस ब्राउज़र में है। फ़ाइल आपके पास रहती है।
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" onClick={download} className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-saffron-700 px-4 py-2 text-sm font-medium text-white hover:bg-saffron-800">
          <Download className="h-4 w-4" aria-hidden /> Export My Sadhana Data (.json)
        </button>
        <button type="button" onClick={() => fileInput.current?.click()} className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-saffron-300 px-4 py-2 text-sm font-medium text-saffron-800 hover:bg-saffron-50 dark:text-saffron-200">
          <Upload className="h-4 w-4" aria-hidden /> Restore Backup
        </button>
        <input ref={fileInput} type="file" accept="application/json,.json" className="sr-only" onChange={(e) => upload(e.target.files?.[0])} />
      </div>
      <p role="status" className="mt-3 text-sm text-dharma-muted">{message}</p>
    </section>
  );
}
