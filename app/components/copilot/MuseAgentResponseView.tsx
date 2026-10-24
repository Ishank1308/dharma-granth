'use client';

import React, { useState, useCallback } from 'react';
import {
  Sparkles,
  Bot,
  Copy,
  Check,
  Volume2,
  AlertCircle,
  RefreshCw,
  Key,
} from 'lucide-react';
import { triggerTactileFeedback } from '@/lib/haptics';
import { setMuseApiKey, getMuseApiKey } from '@/lib/muse-chat-agent';

interface MuseAgentResponseViewProps {
  query: string;
  response: string | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export function MuseAgentResponseView({
  query,
  response,
  loading,
  error,
  onRetry,
}: MuseAgentResponseViewProps) {
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(getMuseApiKey());

  const handleCopy = useCallback((text: string) => {
    triggerTactileFeedback('light', 'click');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const handleSpeak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    triggerTactileFeedback('selection', 'softTap');
    window.speechSynthesis.cancel();

    if (speaking) {
      setSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.88;
    const voices = window.speechSynthesis.getVoices();
    const hiVoice = voices.find((v) => v.lang.includes('hi') || v.lang.includes('IN'));
    if (hiVoice) utterance.voice = hiVoice;

    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }, [speaking]);

  const handleSaveKey = () => {
    setMuseApiKey(apiKeyInput);
    setShowKeyInput(false);
    onRetry();
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-amber-500/30 bg-stone-900/80 p-6 sm:p-8 text-center space-y-4 animate-in fade-in">
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute h-14 w-14 rounded-full bg-amber-500/20 animate-ping" />
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-stone-950 shadow-lg">
            <Bot className="h-6 w-6 animate-pulse" />
          </div>
        </div>
        <div className="space-y-1.5 max-w-md mx-auto">
          <h4 className="text-base font-bold text-amber-200">
            Muse Spark 1.3 मनन कर रहा है...
          </h4>
          <p className="text-xs text-stone-400 font-devanagari">
            वेदों, उपनिषदों और भगवद्गीता के सूत्रों का दार्शनिक विश्लेषण एवं समाधान संकलित हो रहा है।
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-500/40 bg-rose-950/20 p-5 space-y-3">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-sm flex-1">
            <h4 className="font-bold text-rose-200">
              {error === 'BILLING_REQUIRED'
                ? 'बिलिंग सत्यापन आवश्यक (Billing Required)'
                : error === 'MUSE_KEY_MISSING' || error === 'INVALID_API_KEY'
                ? 'API कुंजी आवश्यक (API Key Missing or Invalid)'
                : 'उत्तर प्राप्त करने में त्रुटि'}
            </h4>
            <p className="text-xs text-rose-300/80">
              {error === 'BILLING_REQUIRED'
                ? 'Meta AI प्रोजेक्ट पर बिलिंग सक्रिय करें: dev.meta.ai/billing'
                : error === 'MUSE_KEY_MISSING' || error === 'INVALID_API_KEY'
                ? 'कृपया मान्य Muse Spark API कुंजी दर्ज करें।'
                : error}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-rose-500 transition"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>पुनः प्रयास करें</span>
          </button>
          <button
            type="button"
            onClick={() => setShowKeyInput(!showKeyInput)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-rose-400/30 px-3.5 py-1.5 text-xs font-semibold text-rose-200 hover:bg-rose-900/40 transition"
          >
            <Key className="h-3.5 w-3.5" />
            <span>API कुंजी बदलें</span>
          </button>
        </div>

        {showKeyInput && (
          <div className="pt-2 flex items-center gap-2">
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="LLM_... (आपकी API Key)"
              className="flex-1 rounded-xl border border-stone-700 bg-stone-900 px-3 py-1.5 text-xs text-stone-100 outline-none focus:border-amber-400"
            />
            <button
              type="button"
              onClick={handleSaveKey}
              className="rounded-xl bg-amber-500 px-3 py-1.5 text-xs font-bold text-stone-950 hover:bg-amber-400 transition"
            >
              सहेजें
            </button>
          </div>
        )}
      </div>
    );
  }

  if (!response) return null;

  // Split response by double linebreaks and format
  const blocks = response.split(/\n\n+/).filter(Boolean);

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Muse Spark Header Badge */}
      <div className="flex items-center justify-between rounded-2xl border border-amber-400/30 bg-gradient-to-r from-amber-500/15 via-amber-400/10 to-transparent p-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-400 text-stone-950 shadow-sm">
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-amber-100 flex items-center gap-2">
              Muse Spark 1.3 · ज्ञान सारथी
              <span className="text-3xs font-mono font-normal uppercase bg-amber-400/20 border border-amber-400/30 text-amber-300 px-1.5 py-0.5 rounded">
                Meta AI
              </span>
            </h3>
            <p className="text-2xs text-stone-400 font-devanagari">
              गहन दार्शनिक विवेक एवं शास्त्रीय समाधान
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => handleSpeak(response)}
            className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs text-stone-400 hover:text-amber-300 transition"
            title="उत्तर सुनें"
          >
            <Volume2 className="h-3.5 w-3.5" />
            <span className="text-2xs">{speaking ? 'विराम' : 'सुनें'}</span>
          </button>
          <button
            type="button"
            onClick={() => handleCopy(response)}
            className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs text-stone-400 hover:text-amber-200 transition"
            title="प्रतिलिपि बनाएँ"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span className="text-2xs">{copied ? 'कॉपी हुआ' : 'कॉपी'}</span>
          </button>
        </div>
      </div>

      {/* Render formatted blocks */}
      <div className="space-y-3.5 text-stone-200 text-sm leading-relaxed">
        {blocks.map((block, idx) => {
          const trimmed = block.trim();

          // Heading
          if (trimmed.startsWith('### ') || trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
            const headingText = trimmed.replace(/^#+\s*/, '');
            return (
              <h4
                key={idx}
                className="font-serif text-base sm:text-lg font-bold text-amber-300 pt-2 border-b border-stone-800 pb-1"
              >
                {headingText}
              </h4>
            );
          }

          // Shloka / Sanskrit Quote Block (starts with Sanskrit or double danda)
          if (/[\u0900-\u097F]/.test(trimmed) && (trimmed.includes('॥') || trimmed.includes('|') || trimmed.startsWith('«'))) {
            return (
              <div
                key={idx}
                className="rounded-2xl border border-amber-500/30 bg-stone-950/80 p-4 font-devanagari text-base sm:text-lg text-amber-100 font-medium leading-relaxed my-2 shadow-inner"
              >
                {trimmed}
              </div>
            );
          }

          // Bullet List
          if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || /^\d+\.\s/.test(trimmed)) {
            const items = trimmed.split('\n').filter(Boolean);
            return (
              <ul key={idx} className="space-y-1.5 pl-2">
                {items.map((item, itemIdx) => {
                  const cleanItem = item.replace(/^[-*•\d.]+\s*/, '');
                  return (
                    <li key={itemIdx} className="flex items-start gap-2 text-xs sm:text-sm text-stone-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                      <span>{cleanItem}</span>
                    </li>
                  );
                })}
              </ul>
            );
          }

          // Regular paragraph
          return (
            <p key={idx} className="text-xs sm:text-sm text-stone-300 leading-relaxed font-sans">
              {trimmed}
            </p>
          );
        })}
      </div>
    </div>
  );
}
