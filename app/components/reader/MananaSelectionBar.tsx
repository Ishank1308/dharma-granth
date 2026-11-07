'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Volume2, Sparkles, Copy, Check } from 'lucide-react';
import { triggerPranaToast } from '@/lib/prana-capsule-store';
import { triggerTactileFeedback } from '@/lib/haptics';

interface SelectionCoords {
  top: number;
  left: number;
}

export function MananaSelectionBar() {
  const [selectedText, setSelectedText] = useState('');
  const [coords, setCoords] = useState<SelectionCoords | null>(null);
  const [copied, setCopied] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  const handleSelection = useCallback(() => {
    if (typeof window === 'undefined') return;
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.toString().trim()) {
      setCoords(null);
      setSelectedText('');
      return;
    }

    const text = sel.toString().trim();
    if (text.length < 2) {
      setCoords(null);
      setSelectedText('');
      return;
    }

    try {
      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) return;

      const pillWidth = 260;
      const x = Math.max(12, Math.min(window.innerWidth - pillWidth - 12, rect.left + rect.width / 2 - pillWidth / 2));
      const y = Math.max(12, rect.top - 52);

      setSelectedText(text);
      setCoords({ top: y, left: x });
    } catch {
      // range detached or invalid
    }
  }, []);

  useEffect(() => {
    const onMouseUp = () => {
      // Delay slightly so selection is finalized
      setTimeout(handleSelection, 60);
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        setTimeout(handleSelection, 60);
      }
    };
    const onSelectionChange = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed) {
        setCoords(null);
        setSelectedText('');
      }
    };

    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('touchend', onMouseUp);
    document.addEventListener('keyup', onKeyUp);
    document.addEventListener('selectionchange', onSelectionChange);

    return () => {
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('touchend', onMouseUp);
      document.removeEventListener('keyup', onKeyUp);
      document.removeEventListener('selectionchange', onSelectionChange);
    };
  }, [handleSelection]);

  if (!coords || !selectedText) return null;

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerTactileFeedback('selection');
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(selectedText);
      const isSanskrit = /[\u0900-\u097F]/.test(selectedText);
      utterance.lang = isSanskrit ? 'hi-IN' : 'en-US';
      utterance.rate = 0.88;
      window.speechSynthesis.speak(utterance);
    }
    triggerPranaToast({ message: '🔊 उच्चारण प्रारंभ' });
  };

  const handleAddToManana = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerTactileFeedback('success');
    try {
      const saved = localStorage.getItem('dharma_manana_collection') || '[]';
      const list = JSON.parse(saved);
      list.push({
        text: selectedText,
        savedAt: new Date().toISOString(),
        url: window.location.pathname,
      });
      localStorage.setItem('dharma_manana_collection', JSON.stringify(list));
      triggerPranaToast({ message: '🪷 मनन संग्रह में सहेजा गया' });
    } catch {
      triggerPranaToast({ message: 'त्रुटि: सहेज नहीं सके' });
    }
    window.getSelection()?.removeAllRanges();
    setCoords(null);
  };

  const handleCopyQuote = async (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerTactileFeedback('selection');
    const quote = `> "${selectedText}"\n— dharmagranth.dev (${window.location.pathname})`;
    try {
      await navigator.clipboard.writeText(quote);
      setCopied(true);
      triggerPranaToast({ message: '🔗 उद्धरण क्लिपबोर्ड में कॉपी किया गया' });
      setTimeout(() => setCopied(false), 2000);
      window.getSelection()?.removeAllRanges();
      setCoords(null);
    } catch {
      triggerPranaToast({ message: 'कॉपी विफल रहा' });
    }
  };

  return (
    <div
      ref={barRef}
      role="toolbar"
      aria-label="मनन चयन बार"
      style={{
        position: 'fixed',
        top: `${coords.top}px`,
        left: `${coords.left}px`,
        zIndex: 9999,
      }}
      className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-stone-950/95 dark:bg-stone-900/95 text-stone-100 border border-amber-500/35 backdrop-blur-md shadow-2xl shadow-stone-950/50 animate-fade-in text-xs font-medium select-none"
    >
      <button
        type="button"
        onClick={handleSpeak}
        title="उच्चारण सुनें"
        className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-stone-300 hover:text-amber-400 hover:bg-stone-800/80 transition-colors"
      >
        <Volume2 className="w-3.5 h-3.5 text-amber-400" />
        <span className="text-[11px]">उच्चारण</span>
      </button>

      <div className="w-px h-3.5 bg-stone-700/60" />

      <button
        type="button"
        onClick={handleAddToManana}
        title="चिंतन में जोड़ें"
        className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-stone-300 hover:text-amber-400 hover:bg-stone-800/80 transition-colors"
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span className="text-[11px]">चिंतन</span>
      </button>

      <div className="w-px h-3.5 bg-stone-700/60" />

      <button
        type="button"
        onClick={handleCopyQuote}
        title="उद्धरण कॉपी करें"
        className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-stone-300 hover:text-amber-400 hover:bg-stone-800/80 transition-colors"
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-emerald-400" />
        ) : (
          <Copy className="w-3.5 h-3.5 text-stone-400" />
        )}
        <span className="text-[11px]">{copied ? 'कॉपी हुआ' : 'उद्धरण'}</span>
      </button>
    </div>
  );
}
