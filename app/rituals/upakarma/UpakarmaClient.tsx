'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  BookOpen,
  CheckCircle2,
  Circle,
  Copy,
  Check,
  Volume2,
  Layers,
  Flame,
  RotateCcw,
  Compass,
  Info,
  ShieldCheck,
  ChevronRight,
  Sun,
} from 'lucide-react';
import {
  UPAKARMA_STEPS,
  UPAKARMA_MANTRAS,
  YAJNOPAVITA_TANTUS,
  REGIONAL_UPAKARMA_TRADITIONS,
  UPAKARMA_FAQS,
  type UpakarmaStep,
  type UpakarmaMantra,
} from '@/data/upakarma-data';
import { speakSanskritTerm } from '@/lib/sacred-soundscape';

export function UpakarmaClient() {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [playingKey, setPlayingKey] = useState<string | null>(null);

  // 108 Japa Counter State
  const [japaCount, setJapaCount] = useState<number>(0);

  // Selected Tantu for Anatomy
  const [selectedTantuNumber, setSelectedTantuNumber] = useState<number>(1);

  const toggleStepCompleted = (stepNum: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepNum]: !prev[stepNum],
    }));
  };

  const copyText = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // ignore
    }
  };

  const playAudio = (sanskrit: string, key: string) => {
    setPlayingKey(key);
    speakSanskritTerm(sanskrit);
    setTimeout(() => setPlayingKey(null), 3000);
  };

  const currentStep = UPAKARMA_STEPS[activeStepIndex];
  const activeMantra = currentStep.mantraRef ? UPAKARMA_MANTRAS[currentStep.mantraRef] : null;

  return (
    <div className="space-y-10">
      {/* ─── SECTION 1: INTERACTIVE 5-STEP RITUAL NAVIGATOR ─────────────────── */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-saffron-600 dark:text-saffron-400">
              क्रमबद्ध अनुष्ठान विधि · Sequential Liturgical Walkthrough
            </span>
            <h2 className="text-xl md:text-2xl font-serif font-bold text-dharma-text mt-0.5">
              उपाकर्म के ५ पवित्र सोपान (5 Sacred Steps)
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs text-dharma-muted">
            <span>सम्पन्न सोपान:</span>
            <strong className="text-saffron-700 dark:text-saffron-400 font-bold">
              {Object.values(completedSteps).filter(Boolean).length} / 5
            </strong>
          </div>
        </div>

        {/* Step Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {UPAKARMA_STEPS.map((step, idx) => {
            const isCompleted = !!completedSteps[step.stepNumber];
            const isActive = activeStepIndex === idx;
            return (
              <button
                type="button"
                key={step.stepNumber}
                onClick={() => setActiveStepIndex(idx)}
                className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                  isActive
                    ? 'border-saffron-600 bg-saffron-50 dark:bg-saffron-950/30 shadow-sm'
                    : 'border-dharma-border bg-dharma-card hover:border-dharma-border/80'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isActive
                        ? 'bg-saffron-600 text-white'
                        : 'bg-dharma-bg border border-dharma-border text-dharma-muted'
                    }`}
                  >
                    {step.stepNumber}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStepCompleted(step.stepNumber);
                    }}
                    className="text-dharma-muted hover:text-emerald-600 transition"
                    title={isCompleted ? 'चिह्न हटाएं' : 'सम्पन्न चिह्नित करें'}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <div className="min-w-0">
                  <h4 className="font-serif font-bold text-xs text-dharma-text line-clamp-1">
                    {step.nameHi.split('(')[0].trim()}
                  </h4>
                  <span className="text-[10px] text-dharma-muted block mt-0.5">{step.durationHi}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Step Detailed Card */}
        <div className="rounded-3xl border border-dharma-border bg-dharma-card p-6 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-dharma-border">
            <div>
              <span className="text-xs font-bold text-saffron-600 uppercase tracking-wider block">
                सोपान {currentStep.stepNumber} · Step {currentStep.stepNumber} of 5 ({currentStep.durationHi})
              </span>
              <h3 className="text-xl md:text-2xl font-serif font-bold text-dharma-text mt-1">
                {currentStep.nameHi}
              </h3>
              <p className="text-xs text-dharma-muted mt-0.5">{currentStep.name}</p>
            </div>

            <button
              type="button"
              onClick={() => toggleStepCompleted(currentStep.stepNumber)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition ${
                completedSteps[currentStep.stepNumber]
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                  : 'bg-dharma-bg hover:bg-dharma-border/30 text-dharma-text border-dharma-border'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {completedSteps[currentStep.stepNumber] ? 'सम्पन्न (Marked Done)' : 'सम्पन्न चिह्नित करें'}
              </span>
            </button>
          </div>

          <p className="text-sm text-dharma-text my-5 leading-relaxed">
            {currentStep.descriptionHi}
          </p>

          {/* Action Guidelines */}
          <div className="mb-6 space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-dharma-muted">
              अनुष्ठान विधि एवं नियम (Ritual Actions):
            </h4>
            <div className="grid sm:grid-cols-2 gap-3">
              {currentStep.ritualsHi.map((rit, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-dharma-bg/60 border border-dharma-border/80 flex items-start gap-2.5 text-xs"
                >
                  <span className="w-5 h-5 rounded-md bg-saffron-500/10 text-saffron-700 dark:text-saffron-400 font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-dharma-text leading-relaxed">{rit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Attached Mantra for this Step (if any) */}
          {activeMantra && (
            <div className="rounded-2xl border border-saffron-500/30 bg-gradient-to-br from-saffron-500/5 via-amber-500/5 to-transparent p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold text-saffron-700 dark:text-saffron-400 tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{activeMantra.titleHi}</span>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => playAudio(activeMantra.sanskrit, activeMantra.id)}
                    className="p-1.5 rounded-lg border border-dharma-border bg-dharma-card hover:bg-dharma-bg text-dharma-muted hover:text-saffron-600 transition"
                    title="उच्चारण सुनें"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => copyText(activeMantra.sanskrit, activeMantra.id)}
                    className="p-1.5 rounded-lg border border-dharma-border bg-dharma-card hover:bg-dharma-bg text-dharma-muted hover:text-saffron-600 transition"
                    title="मन्त्र कॉपी करें"
                  >
                    {copiedKey === activeMantra.id ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Sanskrit Mantra Display */}
              <div className="p-4 rounded-xl bg-dharma-card/80 border border-dharma-border/80 text-center">
                <p className="font-serif text-base sm:text-lg text-dharma-text font-bold leading-relaxed whitespace-pre-line">
                  {activeMantra.sanskrit}
                </p>
                <p className="font-mono text-xs text-saffron-700 dark:text-saffron-400 mt-2 italic whitespace-pre-line">
                  {activeMantra.iast}
                </p>
              </div>

              <div className="space-y-1 text-xs">
                <strong className="text-dharma-text block">सरल हिन्दी अर्थ:</strong>
                <p className="text-dharma-muted leading-relaxed">{activeMantra.hindi}</p>
              </div>

              {/* 108 Counter Specific to Kamokarshin */}
              {activeMantra.id === 'kamokarshin' && (
                <div className="mt-4 pt-4 border-t border-saffron-500/20 rounded-xl bg-white/40 dark:bg-black/20 p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h5 className="font-serif font-bold text-sm text-dharma-text">
                        108 कामोऽकार्षीत् जप गणक (Interactive Japa Counter)
                      </h5>
                      <p className="text-xs text-dharma-muted mt-0.5">
                        प्रत्येक जप के साथ मन्यु और काम को साक्षी भाव से विसर्जित करें।
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <span className="text-xl font-bold font-mono text-saffron-700 dark:text-saffron-300">
                          {japaCount}
                        </span>
                        <span className="text-xs text-dharma-muted block">/ 108</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setJapaCount((prev) => Math.min(108, prev + 1))}
                        className="px-4 py-2 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-bold text-xs transition shadow-xs"
                      >
                        +1 जप
                      </button>

                      <button
                        type="button"
                        onClick={() => setJapaCount(0)}
                        className="p-2 rounded-xl border border-dharma-border bg-dharma-card hover:bg-dharma-bg text-dharma-muted"
                        title="पुनः आरम्भ (Reset)"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 w-full bg-dharma-bg rounded-full overflow-hidden mt-3 border border-dharma-border">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-saffron-600 transition-all duration-300"
                      style={{ width: `${(japaCount / 108) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ─── SECTION 2: YAJNOPAVITA ANATOMY & MYSTICAL SYMBOLISM ───────────── */}
      <section className="rounded-3xl border border-dharma-border bg-dharma-card p-6 md:p-8 space-y-6 shadow-sm">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-saffron-600 dark:text-saffron-400">
            आध्यात्मिक स्वरूप एवं प्रतीकवाद · Divine Architecture
          </span>
          <h2 className="text-xl md:text-2xl font-serif font-bold text-dharma-text mt-0.5">
            यज्ञोपवीत की संरचना एवं नौ तन्तुओं का रहस्य
          </h2>
          <p className="text-xs sm:text-sm text-dharma-muted mt-1 max-w-2xl leading-relaxed">
            जनेऊ मात्र एक सूती धागा नहीं, अपितु सम्पूर्ण ब्रह्माण्डीय शक्तियों और तीन ऋणों का देह पर प्रत्यक्ष आवरण है।
          </p>
        </div>

        {/* 3 Core Strands (Trisutra) */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl border border-dharma-border bg-dharma-bg/60 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-bold text-sm text-dharma-text">१. देव-ऋण (Deva Rina)</h4>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-800 dark:text-amber-300 font-semibold">
                सत्त्व गुण
              </span>
            </div>
            <p className="text-xs text-dharma-muted leading-relaxed">
              सूर्य, वायु, जल और अग्नि आदि प्राकृतिक शक्तियों के प्रति कृतज्ञता। यह ऋण नित्य यज्ञ, सन्ध्या और पर्यावरण संरक्षण से चुकाया जाता है।
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-dharma-border bg-dharma-bg/60 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-bold text-sm text-dharma-text">२. ऋषि-ऋण (Rishi Rina)</h4>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-800 dark:text-blue-300 font-semibold">
                रजस् गुण
              </span>
            </div>
            <p className="text-xs text-dharma-muted leading-relaxed">
              ऋषियों द्वारा दिए गए वेद, उपनिषद् और ज्ञान-परम्परा के प्रति आभार। यह स्वाध्याय (अध्ययन) और ज्ञान के प्रचार-प्रसार से चुकता होता है।
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-dharma-border bg-dharma-bg/60 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-bold text-sm text-dharma-text">३. पितृ-ऋण (Pitru Rina)</h4>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-semibold">
                तमस् गुण
              </span>
            </div>
            <p className="text-xs text-dharma-muted leading-relaxed">
              माता-पिता और पूर्वजों के प्रति ऋण। यह कुल-मर्यादा का पालन करने, सन्तानों को सुसंस्कृत बनाने और पितृ-तर्पण से पूरा होता है।
            </p>
          </div>
        </div>

        {/* 9 Divine Tantus Interactive Grid */}
        <div className="space-y-3 pt-4 border-t border-dharma-border/60">
          <h4 className="text-sm font-serif font-bold text-dharma-text flex items-center gap-2">
            <Layers className="w-4 h-4 text-saffron-600" />
            <span>प्रत्येक सूत्र के नौ तन्तु (9 Divine Threads)</span>
          </h4>

          <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
            {YAJNOPAVITA_TANTUS.map((tantu) => (
              <button
                type="button"
                key={tantu.number}
                onClick={() => setSelectedTantuNumber(tantu.number)}
                className={`p-2.5 rounded-xl border text-center transition ${
                  selectedTantuNumber === tantu.number
                    ? 'border-saffron-600 bg-saffron-50 dark:bg-saffron-950/40 text-saffron-900 dark:text-saffron-300 font-bold shadow-xs'
                    : 'border-dharma-border bg-dharma-bg hover:border-dharma-text/20 text-dharma-text'
                }`}
              >
                <span className="block text-xs font-mono">तन्तु {tantu.number}</span>
                <span className="text-[11px] truncate block opacity-90">{tantu.deityHi.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          {/* Active Tantu Explainer Box */}
          {(() => {
            const activeTantu = YAJNOPAVITA_TANTUS.find((t) => t.number === selectedTantuNumber) || YAJNOPAVITA_TANTUS[0];
            return (
              <div className="p-4 rounded-2xl bg-dharma-bg/80 border border-dharma-border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-saffron-700 dark:text-saffron-400 block mb-0.5">
                    तन्तु {activeTantu.number}: {activeTantu.deityHi} ({activeTantu.deity})
                  </span>
                  <p className="text-dharma-text leading-relaxed">{activeTantu.principleHi}</p>
                </div>
                <div className="text-dharma-muted italic shrink-0">
                  {activeTantu.principle}
                </div>
              </div>
            );
          })()}

          {/* Brahmagranthi Note */}
          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 leading-relaxed flex items-start gap-3">
            <Sun className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>ब्रह्मग्रन्थि (The Sacred Knot of Unity):</strong> जनेऊ के तीनों सूत्रों को एक साथ बांधने वाली ग्रन्थि को ‘ब्रह्मग्रन्थि’ कहते हैं। यह इस सत्य का स्मरण कराती है कि सृष्टि के समस्त रूप, गुण और ऋण अन्ततः उस एक अद्वैत परब्रह्म (सच्चिदानन्द) में ही प्रतिष्ठित हैं।
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 3: REGIONAL TRADITIONS & FAQS ─────────────────────────── */}
      <section className="space-y-6">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-saffron-600 dark:text-saffron-400">
            भारत की विविधता में एकात्मता · Pan-Indian Observance
          </span>
          <h2 className="text-xl md:text-2xl font-serif font-bold text-dharma-text mt-0.5">
            क्षेत्रीय परम्पराएँ एवं उपाकर्म रूप
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {REGIONAL_UPAKARMA_TRADITIONS.map((trad, idx) => (
            <div key={idx} className="p-5 rounded-2xl border border-dharma-border bg-dharma-card space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold text-saffron-600 tracking-wider">
                  {trad.region}
                </span>
                <span className="text-[11px] text-dharma-muted">{trad.timing}</span>
              </div>
              <h3 className="font-serif font-bold text-base text-dharma-text">
                {trad.nameHi} ({trad.name})
              </h3>
              <p className="text-xs text-dharma-text leading-relaxed">{trad.descriptionHi}</p>
              <p className="text-xs text-dharma-muted leading-relaxed italic pt-1 border-t border-dharma-border/50">
                {trad.description}
              </p>
            </div>
          ))}
        </div>

        {/* FAQs */}
        <div className="pt-6 space-y-4">
          <h3 className="text-lg font-serif font-bold text-dharma-text flex items-center gap-2">
            <Info className="w-5 h-5 text-saffron-600" />
            <span>उपाकर्म एवं यज्ञोपवीत प्रश्नोत्तरी (Frequently Asked Questions)</span>
          </h3>

          <div className="space-y-3">
            {UPAKARMA_FAQS.map((faq, idx) => (
              <div key={idx} className="rounded-2xl border border-dharma-border bg-dharma-card p-5 space-y-2 shadow-xs">
                <h4 className="font-serif font-bold text-sm text-dharma-text">{faq.questionHi}</h4>
                <p className="text-xs text-dharma-text leading-relaxed">{faq.answerHi}</p>
                <div className="pt-2 border-t border-dharma-border/50 text-xs text-dharma-muted leading-relaxed italic">
                  <strong>English:</strong> {faq.answer}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
