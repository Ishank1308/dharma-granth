'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Clock,
  Compass,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Sliders,
  Calendar,
  Info,
  BookOpen,
  ArrowRight,
  Sun,
  Flame,
  Check,
  Copy,
} from 'lucide-react';
import {
  MUHURTA_ENDEAVORS,
  TITHI_GROUPS,
  NAKSHATRA_SWABHAVAS,
  MUHURTA_FAQS,
  getStandardRahuKalam,
  evaluateEndeavorMuhurta,
  type MuhurtaEndeavor,
  type MuhurtaEvaluation,
} from '@/data/muhurta-data';
import {
  NAKSHATRA_DATA,
  UNIQUE_TITHI_ARCHETYPES,
  VARA_DATA,
  getAllKaranas,
  YOGA_DATA,
} from '@/lib/panchang';

interface MuhurtaClientProps {
  initialPanchang: {
    isoDate: string;
    dayOfWeekIndex: number;
    dayOfWeek: string;
    dayOfWeekHi: string;
    tithiNumber: number;
    tithiName: string;
    tithiNameHi: string;
    paksha: string;
    pakshaHi: string;
    nakshatraIndex: number;
    nakshatraName: string;
    nakshatraNameHi: string;
    karanaName: string;
    karanaNameHi: string;
    yogaIndex: number;
    yogaName: string;
    yogaNameHi: string;
    solarTimes: {
      sunrise: string;
      sunset: string;
      solarNoon: string;
      dayLength: string;
    };
  };
}

export function MuhurtaMatrixClient({ initialPanchang }: MuhurtaClientProps) {
  const [activeTab, setActiveTab] = useState<'today' | 'simulator' | 'principles' | 'faqs'>('today');
  const [expandedEndeavorId, setExpandedEndeavorId] = useState<string | null>(null);

  // Simulator State
  const [simTithi, setSimTithi] = useState<number>(initialPanchang.tithiNumber);
  const [simVara, setSimVara] = useState<number>(initialPanchang.dayOfWeekIndex);
  const [simNakshatra, setSimNakshatra] = useState<number>(initialPanchang.nakshatraIndex);
  const [simKarana, setSimKarana] = useState<string>(initialPanchang.karanaName);
  const [simYoga, setSimYoga] = useState<string>(initialPanchang.yogaName);
  const [simEndeavorId, setSimEndeavorId] = useState<string>('vidya-arambha');

  const todayRahu = getStandardRahuKalam(initialPanchang.dayOfWeekIndex);

  // Evaluate today's endeavors
  const todayEvaluations: MuhurtaEvaluation[] = MUHURTA_ENDEAVORS.map((end) =>
    evaluateEndeavorMuhurta(
      end,
      initialPanchang.tithiNumber,
      initialPanchang.dayOfWeekIndex,
      initialPanchang.nakshatraIndex,
      initialPanchang.karanaName,
      initialPanchang.yogaName
    )
  );

  // Evaluate simulator endeavor
  const selectedSimEndeavor = MUHURTA_ENDEAVORS.find((e) => e.id === simEndeavorId) || MUHURTA_ENDEAVORS[0];
  const simEvaluation = evaluateEndeavorMuhurta(
    selectedSimEndeavor,
    simTithi,
    simVara,
    simNakshatra,
    simKarana,
    simYoga
  );

  const getBadgeClass = (compat: MuhurtaEvaluation['compatibility']) => {
    switch (compat) {
      case 'highly-favorable':
        return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30';
      case 'favorable':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30';
      case 'neutral':
        return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30';
      case 'caution':
        return 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/30';
      case 'inauspicious':
        return 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30';
    }
  };

  const getProgressColor = (compat: MuhurtaEvaluation['compatibility']) => {
    switch (compat) {
      case 'highly-favorable':
        return 'bg-emerald-500';
      case 'favorable':
        return 'bg-blue-500';
      case 'neutral':
        return 'bg-amber-500';
      case 'caution':
        return 'bg-orange-500';
      case 'inauspicious':
        return 'bg-rose-500';
    }
  };

  return (
    <div className="space-y-8">
      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-dharma-border pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('today')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'today'
              ? 'bg-saffron-600 text-white shadow-sm'
              : 'bg-dharma-card hover:bg-dharma-border/30 text-dharma-text'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>आज का मुहूर्त विश्लेषण (Today's Matrix)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('simulator')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'simulator'
              ? 'bg-saffron-600 text-white shadow-sm'
              : 'bg-dharma-card hover:bg-dharma-border/30 text-dharma-text'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>पञ्चाङ्ग सिम्युलेटर (Custom Decision)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('principles')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'principles'
              ? 'bg-saffron-600 text-white shadow-sm'
              : 'bg-dharma-card hover:bg-dharma-border/30 text-dharma-text'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>मुहूर्त सिद्धान्त (Classical Principles)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('faqs')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'faqs'
              ? 'bg-saffron-600 text-white shadow-sm'
              : 'bg-dharma-card hover:bg-dharma-border/30 text-dharma-text'
          }`}
        >
          <Info className="w-4 h-4" />
          <span>प्रश्नोत्तरी (FAQs)</span>
        </button>
      </div>

      {/* TAB 1: TODAY'S MATRIX */}
      {activeTab === 'today' && (
        <div className="space-y-6">
          {/* Active Panchang Coordinates Banner */}
          <div className="rounded-2xl border border-dharma-border bg-dharma-card/80 backdrop-blur-sm p-5 md:p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-dharma-border/50">
              <div>
                <p className="text-xs uppercase tracking-wider font-semibold text-saffron-600 dark:text-saffron-400">
                  वर्तमान पञ्चाङ्ग आधार · Live Educational Ephemeris
                </p>
                <h2 className="text-xl md:text-2xl font-serif font-bold text-dharma-text mt-0.5">
                  {initialPanchang.dayOfWeekHi} ({initialPanchang.dayOfWeek}) · {initialPanchang.isoDate}
                </h2>
              </div>
              <div className="flex items-center gap-3 text-xs bg-dharma-bg px-3.5 py-2 rounded-xl border border-dharma-border">
                <Sun className="w-4 h-4 text-amber-500" />
                <span className="text-dharma-text">
                  सूर्योदय: <strong>{initialPanchang.solarTimes.sunrise}</strong> · सूर्यास्त: <strong>{initialPanchang.solarTimes.sunset}</strong>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 text-center">
              <div className="p-2.5 rounded-xl bg-dharma-bg/60 border border-dharma-border/40">
                <span className="text-[11px] text-dharma-muted uppercase block">तिथि (Tithi)</span>
                <span className="font-semibold text-sm text-dharma-text block">{initialPanchang.tithiNameHi}</span>
                <span className="text-[11px] text-dharma-muted">{initialPanchang.pakshaHi}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-dharma-bg/60 border border-dharma-border/40">
                <span className="text-[11px] text-dharma-muted uppercase block">वार (Vara)</span>
                <span className="font-semibold text-sm text-dharma-text block">{initialPanchang.dayOfWeekHi}</span>
                <span className="text-[11px] text-dharma-muted">{initialPanchang.dayOfWeek}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-dharma-bg/60 border border-dharma-border/40">
                <span className="text-[11px] text-dharma-muted uppercase block">नक्षत्र (Nakshatra)</span>
                <span className="font-semibold text-sm text-dharma-text block">{initialPanchang.nakshatraNameHi}</span>
                <span className="text-[11px] text-dharma-muted">{initialPanchang.nakshatraName}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-dharma-bg/60 border border-dharma-border/40">
                <span className="text-[11px] text-dharma-muted uppercase block">करण (Karana)</span>
                <span className="font-semibold text-sm text-dharma-text block">{initialPanchang.karanaNameHi}</span>
                <span className="text-[11px] text-dharma-muted">{initialPanchang.karanaName}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-dharma-bg/60 border border-dharma-border/40 col-span-2 sm:col-span-1">
                <span className="text-[11px] text-dharma-muted uppercase block">योग (Yoga)</span>
                <span className="font-semibold text-sm text-dharma-text block">{initialPanchang.yogaNameHi}</span>
                <span className="text-[11px] text-dharma-muted">{initialPanchang.yogaName}</span>
              </div>
            </div>
          </div>

          {/* Rahu Kalam & Abhijit Quick Advisory */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm text-rose-900 dark:text-rose-300">
                  राहुकाल सतर्कता ({initialPanchang.dayOfWeekHi}): {todayRahu.window}
                </h3>
                <p className="text-xs text-rose-800/80 dark:text-rose-400/80 mt-1 leading-relaxed">
                  दिन का यह अष्टम अंश अप्रत्याशित विक्षेपों के लिए संवेदनशील है। नए अनुबंध, गृहप्रवेश अथवा मांगलिक यात्रा इस 90-मिनट कालखण्ड में आरम्भ न करें।
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 flex items-start gap-3">
              <Sun className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm text-amber-900 dark:text-amber-300">
                  अभिजीत मुहूर्त (कल्याणकारी मध्याह्न खिड़की): ~11:45 AM से 12:35 PM
                </h3>
                <p className="text-xs text-amber-800/80 dark:text-amber-400/80 mt-1 leading-relaxed">
                  भगवान् विष्णु द्वारा संरक्षित यह मध्य-दिवस कालखण्ड सामान्य ज्योतिषी दोषों का शमन करता है (बुधवार को छोड़कर सर्वथा प्रशस्त)।
                </p>
              </div>
            </div>
          </div>

          {/* 6 Endeavors Evaluation Grid */}
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-bold text-dharma-text flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-saffron-500" />
              <span>प्रमुख कार्यों का आज का मुहूर्त मूल्यांकन</span>
            </h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {todayEvaluations.map((evalItem) => {
                const isExpanded = expandedEndeavorId === evalItem.endeavor.id;
                return (
                  <div
                    key={evalItem.endeavor.id}
                    className="rounded-2xl border border-dharma-border bg-dharma-card hover:border-saffron-500/40 transition-all flex flex-col p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl p-2 rounded-xl bg-dharma-bg border border-dharma-border/60">
                          {evalItem.endeavor.icon}
                        </span>
                        <div>
                          <h4 className="font-serif font-bold text-sm text-dharma-text leading-tight">
                            {evalItem.endeavor.nameHi}
                          </h4>
                          <span className="text-[11px] text-dharma-muted">
                            {evalItem.endeavor.name.split('(')[0].trim()}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${getBadgeClass(
                          evalItem.compatibility
                        )}`}
                      >
                        {evalItem.labelHi}
                      </span>
                    </div>

                    <div className="space-y-1.5 mb-3">
                      <div className="flex items-center justify-between text-xs text-dharma-muted">
                        <span>अनुकूलता स्तर</span>
                        <strong className="text-dharma-text">{evalItem.score} / 100</strong>
                      </div>
                      <div className="h-1.5 w-full bg-dharma-bg rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${getProgressColor(evalItem.compatibility)}`}
                          style={{ width: `${evalItem.score}%` }}
                        />
                      </div>
                    </div>

                    <p className="text-xs text-dharma-muted leading-relaxed line-clamp-2 mb-4">
                      {evalItem.summaryHi}
                    </p>

                    {/* Expandable Breakdown Button */}
                    <div className="mt-auto pt-3 border-t border-dharma-border/50">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedEndeavorId(isExpanded ? null : evalItem.endeavor.id)
                        }
                        className="w-full flex items-center justify-between text-xs font-semibold text-saffron-700 dark:text-saffron-400 hover:text-saffron-800 transition"
                      >
                        <span>{isExpanded ? 'संक्षिप्त करें' : 'विस्तृत कारक विश्लेषण देखें'}</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>

                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-dharma-border/40 space-y-3 text-xs">
                          <div>
                            <span className="font-semibold text-dharma-text block mb-1">
                              पञ्चाङ्ग अङ्ग विश्लेषण (5 Limbs):
                            </span>
                            <ul className="space-y-1.5">
                              {evalItem.factors.map((f, i) => (
                                <li key={i} className="flex items-start gap-1.5 text-dharma-muted">
                                  {f.status === 'positive' && (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                  )}
                                  {f.status === 'warning' && (
                                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                                  )}
                                  {f.status === 'negative' && (
                                    <ShieldAlert className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                                  )}
                                  <span>
                                    <strong>{f.nameHi}:</strong> {f.descriptionHi}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {evalItem.remedyHi && (
                            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300">
                              <strong>दोष परिहार / परामर्श:</strong> {evalItem.remedyHi}
                            </div>
                          )}

                          <div className="p-2.5 rounded-lg bg-dharma-bg border border-dharma-border/60 text-dharma-muted">
                            <span className="font-semibold text-dharma-text block mb-1">शास्त्रीय परामर्श:</span>
                            {evalItem.endeavor.scripturalPrincipleHi}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SIMULATOR */}
      {activeTab === 'simulator' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-dharma-border bg-dharma-card p-6 shadow-sm">
            <div className="mb-6">
              <span className="text-xs uppercase tracking-wider font-semibold text-saffron-600 dark:text-saffron-400">
                संवादात्मक पञ्चाङ्ग विश्लेषक · Interactive Decision Matrix
              </span>
              <h2 className="text-xl md:text-2xl font-serif font-bold text-dharma-text mt-1">
                किसी भी तिथि, वार एवं नक्षत्र का परीक्षण करें
              </h2>
              <p className="text-sm text-dharma-muted mt-1">
                नीचे दिए गए पञ्चाङ्ग घटकों को बदलकर देखें कि वे आपके अभीष्ट कार्य के लिए कितने अनुकूल अथवा वर्ज्य हैं।
              </p>
            </div>

            {/* Target Activity Selection */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-dharma-text uppercase tracking-wider mb-2">
                1. अभीष्ट कार्य चुनें (Select Target Endeavor)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                {MUHURTA_ENDEAVORS.map((end) => (
                  <button
                    type="button"
                    key={end.id}
                    onClick={() => setSimEndeavorId(end.id)}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                      simEndeavorId === end.id
                        ? 'border-saffron-600 bg-saffron-50 dark:bg-saffron-950/30 text-saffron-900 dark:text-saffron-200 font-semibold shadow-sm'
                        : 'border-dharma-border bg-dharma-bg hover:border-dharma-text/30 text-dharma-text'
                    }`}
                  >
                    <span className="text-xl">{end.icon}</span>
                    <span className="text-xs leading-tight">{end.nameHi.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Panchang Sliders / Selectors */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl bg-dharma-bg/60 border border-dharma-border mb-6">
              {/* Tithi Selector */}
              <div>
                <label className="block text-xs font-semibold text-dharma-text mb-1">
                  2. तिथि (Tithi: 1-30)
                </label>
                <select
                  value={simTithi}
                  onChange={(e) => setSimTithi(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-lg border border-dharma-border bg-dharma-card text-dharma-text focus:outline-none focus:border-saffron-500"
                >
                  {Array.from({ length: 30 }, (_, i) => i + 1).map((t) => {
                    const paksha = t <= 15 ? 'शुक्ल' : 'कृष्ण';
                    const num = t <= 15 ? t : t - 15;
                    const group = TITHI_GROUPS.find((g) => g.tithiNumbers.includes(t));
                    return (
                      <option key={t} value={t}>
                        {paksha} {num} ({group?.nameHi || ''})
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Weekday Selector */}
              <div>
                <label className="block text-xs font-semibold text-dharma-text mb-1">
                  3. वार (Weekday)
                </label>
                <select
                  value={simVara}
                  onChange={(e) => setSimVara(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-lg border border-dharma-border bg-dharma-card text-dharma-text focus:outline-none focus:border-saffron-500"
                >
                  {VARA_DATA.map((v, idx) => (
                    <option key={v.slug} value={idx}>
                      {v.nameHi} ({v.name} · {v.grahaLord})
                    </option>
                  ))}
                </select>
              </div>

              {/* Nakshatra Selector */}
              <div>
                <label className="block text-xs font-semibold text-dharma-text mb-1">
                  4. नक्षत्र (Nakshatra: 1-27)
                </label>
                <select
                  value={simNakshatra}
                  onChange={(e) => setSimNakshatra(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-lg border border-dharma-border bg-dharma-card text-dharma-text focus:outline-none focus:border-saffron-500"
                >
                  {NAKSHATRA_DATA.map((n) => {
                    const sw = NAKSHATRA_SWABHAVAS.find((s) => s.nakshatraIndices.includes(n.index));
                    return (
                      <option key={n.index} value={n.index}>
                        {n.index}. {n.nameHi} ({sw?.typeHi || 'सामान्य'})
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Karana Selector */}
              <div>
                <label className="block text-xs font-semibold text-dharma-text mb-1">
                  5. करण (Karana)
                </label>
                <select
                  value={simKarana}
                  onChange={(e) => setSimKarana(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-dharma-border bg-dharma-card text-dharma-text focus:outline-none focus:border-saffron-500"
                >
                  {getAllKaranas().map((k) => (
                    <option key={k.key} value={k.key}>
                      {k.nameHi} ({k.name} {k.key === 'Vishti' ? '· भद्रा' : ''})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Simulator Output Card */}
            <div className="rounded-2xl border border-saffron-500/30 bg-gradient-to-br from-saffron-500/5 via-transparent to-amber-500/5 p-6 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-dharma-border/60">
                <div className="flex items-center gap-3">
                  <span className="text-3xl p-2.5 rounded-2xl bg-dharma-card border border-dharma-border shadow-sm">
                    {simEvaluation.endeavor.icon}
                  </span>
                  <div>
                    <span className="text-xs text-dharma-muted font-medium">परीक्षित कार्य:</span>
                    <h3 className="text-lg md:text-xl font-serif font-bold text-dharma-text">
                      {simEvaluation.endeavor.nameHi}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[11px] text-dharma-muted block">अनुकूलता अंक</span>
                    <strong className="text-lg font-bold text-dharma-text">{simEvaluation.score} / 100</strong>
                  </div>
                  <span
                    className={`text-xs font-bold px-3 py-1.5 rounded-full border ${getBadgeClass(
                      simEvaluation.compatibility
                    )}`}
                  >
                    {simEvaluation.labelHi}
                  </span>
                </div>
              </div>

              <p className="text-sm text-dharma-text mt-4 leading-relaxed font-medium">
                {simEvaluation.summaryHi}
              </p>

              {/* Factors */}
              <div className="mt-5 grid sm:grid-cols-2 gap-3">
                {simEvaluation.factors.map((f, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-dharma-card/80 border border-dharma-border/80 flex items-start gap-2.5"
                  >
                    {f.status === 'positive' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    )}
                    {f.status === 'warning' && (
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    )}
                    {f.status === 'negative' && (
                      <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    )}
                    <div className="text-xs">
                      <strong className="text-dharma-text block">{f.nameHi}</strong>
                      <span className="text-dharma-muted leading-tight">{f.descriptionHi}</span>
                    </div>
                  </div>
                ))}
              </div>

              {simEvaluation.remedyHi && (
                <div className="mt-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200">
                  <strong>शास्त्रीय परिहार (Mitigation):</strong> {simEvaluation.remedyHi}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PRINCIPLES */}
      {activeTab === 'principles' && (
        <div className="space-y-6">
          {/* 5 Tithi Categories */}
          <div className="rounded-2xl border border-dharma-border bg-dharma-card p-6 shadow-sm">
            <h3 className="text-lg font-serif font-bold text-dharma-text mb-2 flex items-center gap-2">
              <Compass className="w-5 h-5 text-saffron-500" />
              <span>पञ्च-तिथि वर्गीकरण (5 Tithi Archetypes in Muhurta)</span>
            </h3>
            <p className="text-xs text-dharma-muted mb-4">
              मुहूर्त चिन्तामणि में 30 तिथियों को पाँच विशिष्ट श्रेणियों में विभाजित किया गया है:
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {TITHI_GROUPS.map((tg) => (
                <div key={tg.id} className="p-4 rounded-xl border border-dharma-border bg-dharma-bg/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif font-bold text-sm text-dharma-text">{tg.nameHi}</h4>
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-saffron-500/10 text-saffron-700 dark:text-saffron-300 font-semibold">
                      अधिष्ठाता: {tg.rulerHi}
                    </span>
                  </div>
                  <p className="text-xs text-dharma-muted">
                    <strong>तिथियाँ:</strong> {tg.tithiNumbers.map((n) => (n <= 15 ? `शुक्ल ${n}` : `कृष्ण ${n - 15}`)).slice(0, 3).join(', ')}
                  </p>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400">
                    <strong>उपयुक्त:</strong> {tg.suitableForHi}
                  </p>
                  <p className="text-xs text-rose-700 dark:text-rose-400">
                    <strong>वर्ज्य:</strong> {tg.avoidForHi}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Nakshatra Swabhavas */}
          <div className="rounded-2xl border border-dharma-border bg-dharma-card p-6 shadow-sm">
            <h3 className="text-lg font-serif font-bold text-dharma-text mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-saffron-500" />
              <span>नक्षत्र स्वभाव एवं कर्मानुकूलता (7 Nakshatra Dispositions)</span>
            </h3>
            <p className="text-xs text-dharma-muted mb-4">
              वृहत्संहिता के अनुसार 27 नक्षत्रों को उनके गुण और अधिष्ठाता के आधार पर सात कर्म-स्वभावों में बाँटा गया है:
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {NAKSHATRA_SWABHAVAS.map((ns, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-dharma-border bg-dharma-bg/60 space-y-2">
                  <h4 className="font-serif font-bold text-sm text-dharma-text">{ns.typeHi} ({ns.type.split(' ')[0]})</h4>
                  <p className="text-xs text-dharma-muted">
                    <strong>नक्षत्र:</strong> {ns.nakshatras.join(', ')}
                  </p>
                  <p className="text-xs text-dharma-text">
                    <strong>प्रशस्त कर्म:</strong> {ns.suitableForHi}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Rahu Kalam Master Reference */}
          <div className="rounded-2xl border border-dharma-border bg-dharma-card p-6 shadow-sm">
            <h3 className="text-lg font-serif font-bold text-dharma-text mb-2 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-500" />
              <span>साप्ताहिक राहुकाल तालिका (Standard Rahu Kalam Guide)</span>
            </h3>
            <p className="text-xs text-dharma-muted mb-4">
              सूर्योदय से सूर्यास्त तक के 12 घण्टे के दिन को 8 बराबर भागों (प्रत्येक 90 मिनट) में बाँटा जाता है:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 text-center text-xs">
              {VARA_DATA.map((v, i) => {
                const rk = getStandardRahuKalam(i);
                return (
                  <div key={v.slug} className="p-3 rounded-xl border border-dharma-border bg-dharma-bg/50">
                    <span className="font-semibold text-dharma-text block">{v.nameHi}</span>
                    <span className="text-[11px] text-dharma-muted block mb-1">भाग {rk.part}/8</span>
                    <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 block leading-tight">
                      {rk.window.replace('–', '\n')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: FAQS */}
      {activeTab === 'faqs' && (
        <div className="space-y-4">
          {MUHURTA_FAQS.map((faq, idx) => (
            <div key={idx} className="rounded-2xl border border-dharma-border bg-dharma-card p-5 md:p-6 shadow-sm">
              <h3 className="font-serif font-bold text-base text-dharma-text mb-2">
                {faq.questionHi}
              </h3>
              <p className="text-sm text-dharma-text mb-3 leading-relaxed">
                {faq.answerHi}
              </p>
              <div className="pt-3 border-t border-dharma-border/50 text-xs text-dharma-muted leading-relaxed">
                <strong>English:</strong> {faq.answer}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
