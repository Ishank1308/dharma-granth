'use client';

import { useState, useEffect, useId, useCallback } from 'react';
import QRCode from 'qrcode';
import {
  Check,
  Copy,
  Download,
  Heart,
  Info,
  QrCode,
  ShieldCheck,
  Smartphone,
  Sparkles,
  BookOpen,
  Zap,
  HelpCircle,
  ChevronDown,
  ArrowRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UPI_CONFIG,
  CONTRIBUTION_TIERS,
  CONTRIBUTION_PILLARS,
  CONTRIBUTION_FAQS,
  UPI_APP_SHORTCUTS,
  buildUpiUri,
  type ContributionTier,
} from '@/lib/contribution';
import { triggerTactileFeedback } from '@/lib/haptics';

export function ContributeClient() {
  const customInputId = useId();
  const [selectedTierId, setSelectedTierId] = useState<string>('t-108');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [isOpenAmount, setIsOpenAmount] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [qrLoading, setQrLoading] = useState<boolean>(true);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);

  // Compute active numerical amount (null means open/unspecified in URI)
  const currentAmount: number | null = isOpenAmount
    ? null
    : isCustom
    ? customAmount && !isNaN(Number(customAmount)) && Number(customAmount) > 0
      ? Number(customAmount)
      : null
    : (CONTRIBUTION_TIERS.find((t) => t.id === selectedTierId)?.amount ?? 108);

  const upiUri = buildUpiUri(currentAmount);

  // Generate QR Code data URL dynamically whenever upiUri changes
  useEffect(() => {
    let isCancelled = false;
    setQrLoading(true);

    QRCode.toDataURL(upiUri, {
      margin: 2,
      scale: 8,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#1e1b18',
        light: '#ffffff',
      },
    })
      .then((url) => {
        if (!isCancelled) {
          setQrDataUrl(url);
          setQrLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to generate QR code', err);
        if (!isCancelled) setQrLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [upiUri]);

  // Handle tier selection
  const handleSelectTier = (tier: ContributionTier) => {
    triggerTactileFeedback('selection', 'softTap');
    setIsCustom(false);
    setIsOpenAmount(false);
    setSelectedTierId(tier.id);
  };

  const handleSelectCustom = () => {
    triggerTactileFeedback('selection', 'softTap');
    setIsCustom(true);
    setIsOpenAmount(false);
    setSelectedTierId('custom');
  };

  const handleSelectOpen = () => {
    triggerTactileFeedback('selection', 'softTap');
    setIsCustom(false);
    setIsOpenAmount(true);
    setSelectedTierId('open');
  };

  // Copy UPI ID to clipboard with visual and tactile feedback
  const handleCopyUpiId = useCallback(() => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard
        .writeText(UPI_CONFIG.upiId)
        .then(() => {
          setCopied(true);
          triggerTactileFeedback('success', 'success');
          setTimeout(() => setCopied(false), 3000);
        })
        .catch(() => {
          fallbackCopyText(UPI_CONFIG.upiId);
        });
    } else {
      fallbackCopyText(UPI_CONFIG.upiId);
    }
  }, []);

  const fallbackCopyText = (text: string) => {
    const el = document.createElement('textarea');
    el.value = text;
    el.style.position = 'fixed';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.focus();
    el.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      triggerTactileFeedback('success', 'success');
      setTimeout(() => setCopied(false), 3000);
    } catch (e) {
      console.warn('Copy fallback failed', e);
    }
    document.body.removeChild(el);
  };

  // Download QR code image
  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    triggerTactileFeedback('selection', 'softTap');
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `dharma-granth-upi-qr-${currentAmount ? `${currentAmount}inr` : 'open'}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const toggleFaq = (idx: number) => {
    triggerTactileFeedback('selection', 'softTap');
    setExpandedFaqIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-14">
      {/* ── Sacred Header Banner ────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl border border-saffron-500/30 bg-gradient-to-b from-saffron-50/70 via-dharma-card to-dharma-card-soft p-6 sm:p-12 text-center shadow-sm dark:from-saffron-950/25 dark:via-dharma-card dark:to-dharma-card">
        {/* Decorative corner flourishes */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-12 -left-12 h-44 w-44 rounded-full bg-saffron-500/10 blur-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-12 -right-12 h-44 w-44 rounded-full bg-amber-500/10 blur-2xl"
        />

        {/* Sacred Shanti Invocation */}
        <div className="inline-flex items-center gap-2 rounded-full border border-saffron-400/40 bg-saffron-500/10 px-4 py-1.5 text-xs font-semibold text-saffron-800 dark:text-saffron-300">
          <Sparkles className="h-3.5 w-3.5 text-saffron-600 dark:text-saffron-400" aria-hidden="true" />
          <span>निःशुल्क ज्ञान सेवा · Dedicated to Sacred Learning</span>
        </div>

        <h1 className="mt-5 font-devanagari text-2xl font-bold tracking-tight text-dharma-text sm:text-4xl lg:text-5xl">
          ऐच्छिक सहयोग व सेवा
        </h1>
        <p className="mt-2 font-serif text-base sm:text-xl text-dharma-muted">
          Voluntary Support for Dharma Granth
        </p>

        {/* Sanskrit Subhashita */}
        <div className="mx-auto mt-6 max-w-2xl rounded-2xl border border-dharma-border/70 bg-dharma-panel/60 p-4 sm:p-5 backdrop-blur-xs">
          <p lang="sa" className="font-devanagari text-sm font-semibold leading-relaxed text-saffron-900 dark:text-saffron-200 sm:text-base">
            ॐ परोपकाराय फलन्ति वृक्षाः परोपकाराय वहन्ति नद्यः ।<br className="hidden sm:inline" /> परोपकाराय दुहन्ति गावः परोपकारार्थमिदं शरीरम् ॥
          </p>
          <p className="mt-2 text-xs text-dharma-muted italic">
            Trees bear fruit for all; rivers flow for all; cows give nourishment for all; this life itself is for selfless welfare and knowledge.
          </p>
        </div>

        {/* Non-intrusive Ethos Statement */}
        <p className="mx-auto mt-6 max-w-2xl text-xs sm:text-sm leading-relaxed text-dharma-muted">
          धर्म ग्रंथ एक स्वतंत्र, विज्ञापन-मुक्त और निःशुल्क डिजिटल ज्ञान-स्थल है। यदि इस ग्रंथालय ने आपके अध्ययन, साधना अथवा जीवन-दृष्टि को समृद्ध किया है, तो आप अपनी श्रद्धा और सामर्थ्यानुसार इसका संवर्धन कर सकते हैं।
        </p>
      </div>

      {/* ── Trust Ribbon ────────────────────────────────────────────────── */}
      <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-4 text-center">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dharma-border/80 bg-dharma-card p-3 shadow-2xs">
          <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
          <span className="mt-1 text-xs font-bold text-dharma-text">100% ऐच्छिक</span>
          <span className="text-[10px] text-dharma-muted">Never Required to Read</span>
        </div>
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dharma-border/80 bg-dharma-card p-3 shadow-2xs">
          <Sparkles className="h-5 w-5 text-saffron-600 dark:text-saffron-400" aria-hidden="true" />
          <span className="mt-1 text-xs font-bold text-dharma-text">शून्य विज्ञापन</span>
          <span className="text-[10px] text-dharma-muted">Zero Ads Forever</span>
        </div>
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dharma-border/80 bg-dharma-card p-3 shadow-2xs">
          <Smartphone className="h-5 w-5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
          <span className="mt-1 text-xs font-bold text-dharma-text">प्रत्यक्ष UPI</span>
          <span className="text-[10px] text-dharma-muted">Zero Middlemen Fees</span>
        </div>
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dharma-border/80 bg-dharma-card p-3 shadow-2xs">
          <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
          <span className="mt-1 text-xs font-bold text-dharma-text">सार्वजनिक विद्या</span>
          <span className="text-[10px] text-dharma-muted">Unconditionally Free</span>
        </div>
      </div>

      {/* ── Main Interactive Contribution Section ──────────────────────── */}
      <div className="mt-10 grid gap-8 lg:grid-cols-12">
        {/* Left Col: Amount Selection & Direct UPI Actions */}
        <div className="space-y-6 lg:col-span-7">
          <div className="rounded-3xl border border-dharma-border bg-dharma-card p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between border-b border-dharma-border/60 pb-4">
              <div>
                <h2 className="text-base font-bold text-dharma-text sm:text-lg">
                  सहयोग राशि चुनें · Select Amount
                </h2>
                <p className="text-xs text-dharma-muted">
                  भारतीय राष्ट्रीय भुगतान निगम (NPCI UPI) द्वारा प्रत्यक्ष
                </p>
              </div>
              <span className="rounded-full bg-saffron-500/15 px-3 py-1 text-xs font-bold text-saffron-800 dark:text-saffron-300">
                INR (₹)
              </span>
            </div>

            {/* Suggested Tiers Grid */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3" role="radiogroup" aria-label="सहयोग राशि">
              {CONTRIBUTION_TIERS.map((tier) => {
                const isSelected = !isCustom && !isOpenAmount && selectedTierId === tier.id;
                return (
                  <button
                    key={tier.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => handleSelectTier(tier)}
                    className={`relative flex min-h-[72px] flex-col items-center justify-center rounded-2xl border p-3 text-center transition active:scale-95 ${
                      isSelected
                        ? 'border-saffron-500 bg-saffron-500/15 text-saffron-900 shadow-xs dark:text-saffron-200 ring-2 ring-saffron-500/30'
                        : 'border-dharma-border/80 bg-dharma-card-soft text-dharma-text hover:border-saffron-300 hover:bg-dharma-bg'
                    }`}
                  >
                    {tier.isPopular && (
                      <span className="absolute -top-2.5 rounded-full bg-gradient-to-r from-saffron-600 to-amber-600 px-2 py-0.5 text-[9px] font-bold text-white shadow-xs">
                        शुभ संकल्प
                      </span>
                    )}
                    <span className="font-devanagari text-lg font-bold">
                      {tier.labelHi}
                    </span>
                    <span className="text-[10px] text-dharma-text-secondary leading-tight mt-0.5 truncate max-w-full">
                      {tier.meaningHi}
                    </span>
                  </button>
                );
              })}

              {/* Custom Amount Button */}
              <button
                type="button"
                role="radio"
                aria-checked={isCustom}
                onClick={handleSelectCustom}
                className={`flex min-h-[72px] flex-col items-center justify-center rounded-2xl border p-3 text-center transition active:scale-95 ${
                  isCustom
                    ? 'border-saffron-500 bg-saffron-500/15 text-saffron-900 shadow-xs dark:text-saffron-200 ring-2 ring-saffron-500/30'
                    : 'border-dharma-border/80 bg-dharma-card-soft text-dharma-text hover:border-saffron-300 hover:bg-dharma-bg'
                }`}
              >
                <span className="text-sm font-bold">अन्य राशि</span>
                <span className="text-[10px] text-dharma-muted">Custom Amount</span>
              </button>
            </div>

            {/* Custom Amount Input Box */}
            <AnimatePresence>
              {isCustom && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 overflow-hidden"
                >
                  <label
                    htmlFor={customInputId}
                    className="block text-xs font-semibold text-dharma-text mb-1.5"
                  >
                    अपनी इच्छानुसार राशि दर्ज करें (₹):
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-dharma-muted">
                      ₹
                    </span>
                    <input
                      id={customInputId}
                      type="number"
                      min="1"
                      step="1"
                      inputMode="numeric"
                      placeholder="e.g. 500"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="w-full rounded-xl border border-dharma-border bg-dharma-bg py-2.5 pl-8 pr-4 text-base font-bold text-dharma-text placeholder:text-dharma-muted/60 focus:border-saffron-500 focus:outline-none focus:ring-2 focus:ring-saffron-500/30"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Open / Unspecified Amount Option */}
            <div className="mt-3 flex items-center justify-between pt-3 border-t border-dharma-border/50 text-xs text-dharma-muted">
              <span>अथवा सीधे अपने UPI ऐप में राशि भरें:</span>
              <button
                type="button"
                onClick={handleSelectOpen}
                className={`font-semibold underline-offset-2 hover:underline transition ${
                  isOpenAmount ? 'text-saffron-700 dark:text-saffron-400 font-bold' : 'text-dharma-muted'
                }`}
              >
                {isOpenAmount ? '✓ ऐप में राशि तय होगी (सक्रिय)' : 'बिना राशि तय किए स्कैन करें'}
              </button>
            </div>

            {/* Verified UPI ID Details & One-Tap Copy */}
            <div className="mt-6 rounded-2xl border border-saffron-500/40 bg-saffron-500/5 p-4 sm:p-5">
              <div className="flex items-center justify-between text-xs text-dharma-muted">
                <span className="flex items-center gap-1.5 font-bold text-saffron-800 dark:text-saffron-300">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                  सत्यापित UPI पता · Verified Official UPI ID
                </span>
                <span className="text-[11px] font-mono">HDFC Bank</span>
              </div>

              <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-dharma-border/80 bg-dharma-card p-3 shadow-2xs">
                <div className="min-w-0">
                  <div className="font-mono text-xs sm:text-sm font-bold text-dharma-text truncate select-all">
                    {UPI_CONFIG.upiId}
                  </div>
                  <div className="text-[11px] text-dharma-muted">
                    Payee: <strong className="text-dharma-text">{UPI_CONFIG.payeeName}</strong> · Purpose: {UPI_CONFIG.purpose}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyUpiId}
                  className={`inline-flex min-h-[44px] shrink-0 items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition active:scale-95 ${
                    copied
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'border border-dharma-border bg-dharma-panel text-dharma-text hover:border-saffron-400 hover:text-saffron-700'
                  }`}
                  aria-label="Copy UPI ID to clipboard"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" aria-hidden="true" />
                      <span>प्रतिलिपि बन गई!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" aria-hidden="true" />
                      <span>कॉपी करें (Copy)</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Primary Mobile Action: Open in any UPI App */}
            <div className="mt-6 space-y-3">
              <a
                href={upiUri}
                onClick={() => triggerTactileFeedback('selection', 'softTap')}
                className="group relative flex min-h-[52px] w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-saffron-600 via-amber-600 to-saffron-700 px-6 py-3.5 text-center font-devanagari text-base font-bold text-white shadow-md transition hover:opacity-95 active:scale-[0.98]"
              >
                <Smartphone className="h-5 w-5" aria-hidden="true" />
                <span>
                  UPI ऐप में खोलें · Pay via UPI App{' '}
                  {currentAmount ? `(₹${currentAmount})` : ''}
                </span>
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
              </a>

              <p className="text-center text-[11px] text-dharma-muted">
                मोबाइल पर टैप करते ही आपका GPay, PhonePe, Paytm अथवा BHIM अपने आप खुल जाएगा।
              </p>
            </div>

            {/* Direct App Launchers Bar */}
            <div className="mt-5 border-t border-dharma-border/60 pt-4">
              <div className="text-[11px] font-semibold text-dharma-muted uppercase tracking-wider mb-2">
                पसंदीदा ऐप चुनें · Or choose directly:
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {UPI_APP_SHORTCUTS.filter((app) => app.id !== 'generic').map((app) => (
                  <a
                    key={app.id}
                    href={app.getUri(currentAmount)}
                    onClick={() => triggerTactileFeedback('selection', 'softTap')}
                    className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-dharma-border bg-dharma-panel px-3 py-2 text-xs font-semibold text-dharma-text transition hover:border-saffron-400 hover:text-saffron-700 active:scale-95"
                  >
                    <span>{app.nameHi}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Verified Dynamic QR Code & Scanning Guide */}
        <div className="space-y-6 lg:col-span-5">
          <div className="flex flex-col items-center rounded-3xl border border-saffron-500/30 bg-dharma-card p-6 sm:p-8 text-center shadow-xs">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              <span>सत्यापित व सुरक्षित QR Code</span>
            </div>

            <h3 className="mt-3 text-base font-bold text-dharma-text">
              मोबाइल से स्कैन करें · Scan to Pay
            </h3>
            <p className="mt-1 text-xs text-dharma-muted">
              Google Pay · PhonePe · Paytm · BHIM · Navi · Any Bank App
            </p>

            {/* QR Code Container with Saffron Frame */}
            <div className="relative mt-5 flex h-64 w-64 items-center justify-center rounded-2xl border-2 border-saffron-500/40 bg-white p-3 shadow-md">
              {qrLoading ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-saffron-600 border-t-transparent" />
                  <span className="text-xs text-neutral-600">QR तैयार हो रहा है...</span>
                </div>
              ) : qrDataUrl ? (
                <div className="relative h-full w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrDataUrl}
                    alt={`Dharma Granth UPI QR Code for ${currentAmount ? `₹${currentAmount}` : 'voluntary contribution'}`}
                    className="h-full w-full object-contain"
                  />
                  {/* Center Emblem / ॐ badge */}
                  <div className="pointer-events-none absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-saffron-600 text-white font-devanagari font-bold text-base shadow-sm">
                    ॐ
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center text-xs text-neutral-500">
                  <QrCode className="h-10 w-10 text-neutral-400 mb-1" />
                  <span>QR लोड नहीं हो सका</span>
                </div>
              )}
            </div>

            {/* Active Amount Subtitle */}
            <div className="mt-4 rounded-full border border-dharma-border bg-dharma-card-soft px-4 py-1 text-xs font-bold text-dharma-text">
              {currentAmount ? (
                <span>निश्चित राशि: <strong className="text-saffron-700 dark:text-saffron-400">₹{currentAmount}</strong></span>
              ) : (
                <span className="text-dharma-muted">राशि: इच्छानुसार (स्कैन करते समय भरें)</span>
              )}
            </div>

            {/* Download QR Button */}
            <button
              type="button"
              onClick={handleDownloadQr}
              disabled={!qrDataUrl}
              className="mt-4 inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-dharma-border bg-dharma-panel px-4 py-2 text-xs font-semibold text-dharma-text transition hover:border-saffron-400 hover:text-saffron-700 active:scale-95 disabled:opacity-50"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              <span>QR कोड डाउनलोड करें (Save QR)</span>
            </button>

            <div className="mt-4 border-t border-dharma-border/60 pt-3 text-[11px] text-dharma-muted leading-relaxed">
              इस QR कोड को अपने मोबाइल कैमरे या किसी भी UPI ऐप के स्कैनर से स्कैन करके तुरंत सहयोग दे सकते हैं।
            </div>
          </div>

        </div>
      </div>

      {/* ── Pillars: Where Every Rupee Goes ─────────────────────────────── */}
      <div className="mt-16">
        <div className="text-center">
          <h2 className="font-devanagari text-xl font-bold text-dharma-text sm:text-2xl">
            सहयोग कहाँ उपयोग होता है?
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-dharma-muted">
            How your contribution sustains Dharma Granth
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CONTRIBUTION_PILLARS.map((p, idx) => (
            <div
              key={idx}
              className="flex flex-col rounded-2xl border border-dharma-border bg-dharma-card p-5 shadow-2xs transition hover:border-saffron-400/60"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-saffron-500/10 text-saffron-700 dark:text-saffron-300 mb-3">
                {idx === 0 && <ShieldCheck className="h-5 w-5" aria-hidden="true" />}
                {idx === 1 && <BookOpen className="h-5 w-5" aria-hidden="true" />}
                {idx === 2 && <Zap className="h-5 w-5" aria-hidden="true" />}
                {idx === 3 && <Heart className="h-5 w-5" aria-hidden="true" />}
              </div>
              <h3 className="text-sm font-bold text-dharma-text">
                {p.titleHi}
              </h3>
              <p className="text-[11px] font-medium text-dharma-muted mt-0.5">
                {p.titleEn}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-dharma-muted">
                {p.descriptionHi}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Transparent FAQ Section ─────────────────────────────────────── */}
      <div className="mt-16 rounded-3xl border border-dharma-border bg-dharma-card p-6 sm:p-10 shadow-xs">
        <div className="flex items-center gap-2 border-b border-dharma-border/60 pb-4">
          <HelpCircle className="h-5 w-5 text-saffron-600" aria-hidden="true" />
          <div>
            <h2 className="text-base sm:text-lg font-bold text-dharma-text">
              जिज्ञासा व स्पष्टीकरण · Transparency & Questions
            </h2>
            <p className="text-xs text-dharma-muted">
              Frequently asked questions about voluntary contributions
            </p>
          </div>
        </div>

        <div className="mt-6 divide-y divide-dharma-border/60">
          {CONTRIBUTION_FAQS.map((faq, idx) => {
            const isOpen = expandedFaqIndex === idx;
            return (
              <div key={idx} className="py-4 first:pt-0 last:pb-0">
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="flex w-full items-start justify-between gap-4 text-left font-devanagari text-sm font-bold text-dharma-text transition hover:text-saffron-700"
                  aria-expanded={isOpen}
                >
                  <span>{faq.questionHi}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-saffron-600' : 'text-dharma-muted'
                    }`}
                    aria-hidden="true"
                  />
                </button>
                <div className="text-xs text-dharma-muted mt-0.5">{faq.questionEn}</div>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2.5 overflow-hidden text-xs leading-relaxed text-dharma-muted"
                    >
                      <p>{faq.answerHi}</p>
                      <p className="mt-1.5 italic text-dharma-muted/80">{faq.answerEn}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Legal & Compliance Transparency Card ────────────────────────── */}
      <div className="mt-8 rounded-2xl border border-dharma-border/60 bg-dharma-panel/60 p-5 text-xs text-dharma-muted leading-relaxed space-y-2">
        <div className="font-bold text-dharma-text flex items-center gap-1.5">
          <Info className="h-4 w-4 text-saffron-600" aria-hidden="true" />
          <span>सांविधिक सूचना व स्पष्टीकरण (Statutory Disclosure)</span>
        </div>
        <p>
          <strong>ऐच्छिक स्वरूप:</strong> यह सहयोग पूर्णतः ऐच्छिक है। धर्म ग्रंथ पर किसी भी ग्रंथ, श्लोक, अनुवाद, भाष्य अथवा साधन के अध्ययन के लिए कोई शुल्क नहीं लिया जाता और न ही कभी लिया जाएगा।
        </p>
        <p>
          <strong>कर-छूट (80G) सूचना:</strong> धर्म ग्रंथ वर्तमान में आयकर अधिनियम की धारा 80G के अंतर्गत पंजीकृत नहीं है। यह सहयोग व्यक्तिगत ऐच्छिक सहायता (personal gift/voluntary assistance) के रूप में सर्वर व तकनीकी रखरखाव के लिए प्रयुक्त होता है।
        </p>
        <p>
          <strong>गोपनीयता संकल्प:</strong> धर्म ग्रंथ किसी भी पाठक की बैंकिंग अथवा व्यक्तिगत वित्तीय जानकारी को संग्रहीत नहीं करता। सम्पूर्ण लेनदेन भारतीय राष्ट्रीय भुगतान निगम (NPCI UPI) के माध्यम से सीधे आपके बैंक खाते से अधिकृत खाते के बीच संपन्न होता है।
        </p>
      </div>

      {/* ── Closing Sacred Benediction ──────────────────────────────────── */}
      <div className="mt-12 text-center">
        <p lang="sa" className="font-devanagari text-base font-bold text-saffron-900 dark:text-saffron-300">
          ॐ सह नाववतु । सह नौ भुनक्तु । सह वीर्यं करवावहै ।<br /> तेजस्वि नावधीतमस्तु मा विद्विषावहै ॥ ॐ शान्तिः शान्तिः शान्तिः ॥
        </p>
        <p className="mt-2 text-xs italic text-dharma-muted">
          May the divine protect us together; may we be nourished together; may we work together with great energy; may our study be radiant; may there be no animosity between us.
        </p>
      </div>
    </div>
  );
}
