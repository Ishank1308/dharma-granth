'use client';

import { useRef, useState, type KeyboardEvent } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, Compass, Layers, Moon, Sparkles, Star, Sun } from 'lucide-react';

const LIMB_ICONS = [Moon, Clock, Star, Sun, Layers] as const;

interface LimbInfo {
  num: string;
  hi: string;
  en: string;
  elementHi: string;
  elementEn: string;
  arcFormula: string;
  arcDegrees: number;
  summaryHi: string;
  summaryEn: string;
  studyAlignHi: string;
  href: string;
}

const FIVE_LIMBS: LimbInfo[] = [
  {
    num: '01',
    hi: 'तिथि',
    en: 'Tithi',
    elementHi: 'जल तत्त्व · मन व भावना',
    elementEn: 'Water · Mind & Lunar Feeling',
    arcFormula: 'Moon − Sun = 12° per Tithi (30 Tithis)',
    arcDegrees: 72,
    summaryHi: 'सूर्य और चन्द्रमा के मध्य प्रत्येक 12 अंश के कोणीय अंतर से एक तिथि निर्मित होती है। शुक्ल पक्ष बाह्य उत्साह तथा कृष्ण पक्ष शांत अन्तर्मुखी स्वाध्याय का बोध कराता है।',
    summaryEn: 'Each 12-degree angular separation between Moon and Sun forms one lunar day, shaping व्रत (vrata) and contemplative rhythm.',
    studyAlignHi: 'एकादशी, प्रदोष, पूर्णिमा व अमावस्या के नियम इसी अंग पर आधारित हैं।',
    href: '/panchang/tithis/',
  },
  {
    num: '02',
    hi: 'वार',
    en: 'Vara',
    elementHi: 'अग्नि तत्त्व · प्राण व तेज',
    elementEn: 'Fire · Solar Vitality',
    arcFormula: 'Sunrise to Next Sunrise (7 Solar Weekdays)',
    arcDegrees: 144,
    summaryHi: 'स्थानीय सूर्योदय से अगले सूर्योदय तक एक वैदिक वार गिना जाता है। उदया तिथि का निर्धारण इसी सूर्योदय-रेखा से होता है।',
    summaryEn: 'A Vedic weekday begins at local sunrise rather than midnight, anchoring daily sandhya and solar-day observances.',
    studyAlignHi: 'सूर्य अर्घ्य, प्रातः संकल्प तथा दैनिक उपासना-क्रम वार से जुड़ते हैं।',
    href: '/panchang/varas/',
  },
  {
    num: '03',
    hi: 'नक्षत्र',
    en: 'Nakshatra',
    elementHi: 'वायु तत्त्व · गति व प्रेरणा',
    elementEn: 'Air · Sidereal Motion',
    arcFormula: '360° ÷ 27 = 13° 20′ Sidereal Mansion',
    arcDegrees: 216,
    summaryHi: 'क्रान्तिवृत्त के 27 तारामण्डलों में चन्द्रमा जिस क्षेत्र में विचरता है, वह उस दिन का नक्षत्र कहलाता है। वैदिक संहिताओं में प्रत्येक नक्षत्र के अधिष्ठाता देवता वर्णित हैं।',
    summaryEn: 'One of 27 sidereal lunar mansions of 13°20′ each along the ecliptic, rich with Vedic hymns and epic chronology.',
    studyAlignHi: 'रामायण व महाभारत के काल-संदर्भों को समझने में नक्षत्र-ज्ञान अत्यंत उपयोगी है।',
    href: '/panchang/nakshatras/',
  },
  {
    num: '04',
    hi: 'योग',
    en: 'Yoga',
    elementHi: 'आकाश तत्त्व · समरसता व संयोग',
    elementEn: 'Ether · Solar-Lunar Union',
    arcFormula: '(Sun + Moon Longitude) ÷ 13° 20′ (27 Yogas)',
    arcDegrees: 288,
    summaryHi: 'सूर्य और चन्द्रमा के भोगांशों के योग से 27 नित्य योग बनते हैं। यह प्राण और मन के पारस्परिक सामंजस्य का सूचक है।',
    summaryEn: 'The combined longitudinal sum of Sun and Moon divided into 27 arcs, reflecting harmony between vitality and mind.',
    studyAlignHi: 'सिद्धि, अमृत व शुभ योगों के साथ-साथ व्यतीपात व वैधृति में जप-ध्यान की प्रधानता रहती है।',
    href: '/panchang/yogas/',
  },
  {
    num: '05',
    hi: 'करण',
    en: 'Karana',
    elementHi: 'पार्थिव तत्त्व · कृति व कर्तव्य',
    elementEn: 'Earth · Practical Action',
    arcFormula: 'Half-Tithi = 6° Moon-Sun Arc (11 Karanas)',
    arcDegrees: 345,
    summaryHi: 'प्रत्येक तिथि के दो भाग होते हैं — पूर्वार्ध और उत्तरार्ध; प्रत्येक 6 अंश के अंतराल को करण कहते हैं। यह दैनिक कार्य-संकल्प की सूक्ष्म इकाई है।',
    summaryEn: 'Half of a tithi (6° elongation), comprising 7 movable (Chara) and 4 fixed (Sthira) divisions for practical scheduling.',
    studyAlignHi: 'बव, बालव, कौलव आदि चर करण तथा विष्टि (भद्रा) का शास्त्रीय विवेक यहाँ मिलता है।',
    href: '/panchang/karanas/',
  },
];

interface AhoratraWindow {
  id: string;
  timeLabel: string;
  hi: string;
  en: string;
  sunAngle: number;
  practiceHi: string;
  practiceEn: string;
}

const AHORATRA_WINDOWS: AhoratraWindow[] = [
  {
    id: 'brahma',
    timeLabel: '04:30 – 05:30',
    hi: 'ब्राह्म मुहूर्त',
    en: 'Brahma Muhurta',
    sunAngle: 15,
    practiceHi: 'सूर्योदय से लगभग 96 मिनट पूर्व का शांत काल — ध्यान, प्रणव-जप और उपनिषद्-चिन्तन के लिए सर्वोत्तम समय।',
    practiceEn: 'Quiet pre-dawn stillness (~96 min before sunrise) suited for silent meditation, japa, and Upanishadic study.',
  },
  {
    id: 'pratah',
    timeLabel: '05:45 – 07:00',
    hi: 'प्रातः संध्या व उदया तिथि',
    en: 'Sunrise & Pratah Sandhya',
    sunAngle: 42,
    practiceHi: 'सूर्य अर्घ्य, गायत्री जप और आज की उदया तिथि का स्मरण कर दैनिक स्वधर्म का शांत संकल्प लें।',
    practiceEn: 'Local sunrise establishes the day’s Udaya Tithi — traditional hour for Arghya, Gayatri japa, and daily resolve.',
  },
  {
    id: 'purvahna',
    timeLabel: '08:30 – 11:30',
    hi: 'पूर्वाह्ण स्वाध्याय व कर्म',
    en: 'Morning Study & Duty',
    sunAngle: 72,
    practiceHi: 'बुद्धि की एकाग्रता के इस प्रहर में शास्त्र-अध्ययन, पदच्छेद-विचार और निष्काम कर्तव्य-पालन करें।',
    practiceEn: 'Clear morning focus suited for systematic scripture study, learning pathways, and steady work.',
  },
  {
    id: 'abhijit',
    timeLabel: '11:45 – 12:35',
    hi: 'अभिजित् मध्याह्न काल',
    en: 'Midday Abhijit Window',
    sunAngle: 90,
    practiceHi: 'स्थानीय मध्याह्न के आसपास लगभग 48 मिनट का सौर केन्द्र-बिन्दु (बुधवार को छोड़कर शुभ संकल्प हेतु प्रसिद्ध)।',
    practiceEn: 'Approximate 48-minute solar noon window, traditionally noted in Muhurta texts for purposeful beginnings.',
  },
  {
    id: 'sayam',
    timeLabel: '17:45 – 19:00',
    hi: 'सायं संध्या व दीप-प्रज्वलन',
    en: 'Twilight Sandhya & Lamp',
    sunAngle: 145,
    practiceHi: 'दिन के कार्य समेटकर सायं दीप जलाएँ, शान्ति मन्त्र या स्तोत्र का पाठ करें और मन को विश्राम की ओर मोड़ें।',
    practiceEn: 'Sunset transition from outward work to quietude — lighting the evening lamp, stotra recitation, and gratitude.',
  },
  {
    id: 'ratri',
    timeLabel: '20:30 – 21:30',
    hi: 'रात्रि आत्म-निरीक्षण',
    en: 'Evening Self-Review',
    sunAngle: 170,
    practiceHi: 'निद्रा से पूर्व 5 मिनट शांत बैठकर दिन के आचरण का साक्षी भाव से अवलोकन करें और मन को ईश्वराभिमुख कर विश्राम लें।',
    practiceEn: 'Five quiet minutes before rest to review the day’s conduct with equanimity and release mental restlessness.',
  },
];

export function InteractiveKalaStudio() {
  const [mode, setMode] = useState<'limbs' | 'ahoratra'>('limbs');
  const [limbIdx, setLimbIdx] = useState(0);
  const [windowIdx, setWindowIdx] = useState(1);
  const limbsTabRef = useRef<HTMLButtonElement>(null);
  const ahoratraTabRef = useRef<HTMLButtonElement>(null);

  const handleModeKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Home' || e.key === 'End') {
      e.preventDefault();
      const next =
        e.key === 'Home' ? 'limbs'
        : e.key === 'End' ? 'ahoratra'
        : mode === 'limbs' ? 'ahoratra' : 'limbs';
      setMode(next);
      (next === 'limbs' ? limbsTabRef : ahoratraTabRef).current?.focus();
    }
  };

  const activeLimb = FIVE_LIMBS[limbIdx] ?? FIVE_LIMBS[0];
  const activeWin = AHORATRA_WINDOWS[windowIdx] ?? AHORATRA_WINDOWS[0];

  const ringR = 38;
  const ringC = 2 * Math.PI * ringR;
  const limbDashOffset = ringC * (1 - activeLimb.arcDegrees / 360);

  // Sun position along semi-circular horizon arc (0..180 deg)
  const rad = (Math.PI * (180 - activeWin.sunAngle)) / 180;
  const sunX = 110 + 76 * Math.cos(rad);
  const sunY = 92 - 68 * Math.sin(rad);

  return (
    <section
      id="panchang-kala-studio"
      aria-labelledby="panchang-kala-studio-heading"
      className="mt-6 sm:mt-8 apple-card rounded-3xl border border-dharma-border bg-dharma-card p-5 sm:p-7 shadow-raised space-y-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-dharma-border pb-4">
        <div className="min-w-0 space-y-1">
          <p className="inline-flex flex-wrap items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-dharma-saffron">
            <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span lang="hi" data-bi="hi" className="font-devanagari normal-case">संवादात्मक अध्ययन सहायक · ज्योतिष भविष्यवाणी नहीं</span>
            <span data-bi="sep"> · </span>
            <span data-bi="en">Interactive Study Aid · Not Personal Astrology</span>
          </p>
          <h2 id="panchang-kala-studio-heading" className="text-title-2 font-semibold text-dharma-text">
            <span data-bi="en">Kala-Chakra Study Studio</span>
            <span data-bi="sep"> · </span>
            <span lang="hi" data-bi="hi" className="font-devanagari">काल-चक्र अध्ययन स्टूडियो</span>
          </h2>
        </div>

        <div
          role="tablist"
          aria-label="अध्ययन मोड · Studio mode"
          className="flex flex-wrap gap-1.5"
        >
          <button
            ref={limbsTabRef}
            id="kala-tab-limbs"
            type="button"
            role="tab"
            aria-selected={mode === 'limbs'}
            aria-controls="kala-panel-limbs"
            tabIndex={mode === 'limbs' ? 0 : -1}
            onKeyDown={handleModeKeyDown}
            onClick={() => setMode('limbs')}
            className={`focus-ring inline-flex min-h-[44px] items-center gap-1.5 rounded-full border px-4 text-xs font-semibold transition ${
              mode === 'limbs'
                ? 'border-dharma-saffron bg-dharma-saffron text-dharma-bg'
                : 'border-dharma-border bg-dharma-bg/70 text-dharma-text hover:border-dharma-saffron/50'
            }`}
          >
            <Compass className="h-3.5 w-3.5" aria-hidden="true" />
            <span lang="hi" data-bi="hi" className="font-devanagari">5 अंग तत्त्व</span>
            <span data-bi="en-only">5 Limbs</span>
          </button>
          <button
            ref={ahoratraTabRef}
            id="kala-tab-ahoratra"
            type="button"
            role="tab"
            aria-selected={mode === 'ahoratra'}
            aria-controls="kala-panel-ahoratra"
            tabIndex={mode === 'ahoratra' ? 0 : -1}
            onKeyDown={handleModeKeyDown}
            onClick={() => setMode('ahoratra')}
            className={`focus-ring inline-flex min-h-[44px] items-center gap-1.5 rounded-full border px-4 text-xs font-semibold transition ${
              mode === 'ahoratra'
                ? 'border-dharma-saffron bg-dharma-saffron text-dharma-bg'
                : 'border-dharma-border bg-dharma-bg/70 text-dharma-text hover:border-dharma-saffron/50'
            }`}
          >
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            <span lang="hi" data-bi="hi" className="font-devanagari">अहोरात्र साधना चक्र</span>
            <span data-bi="en-only">Solar Day Rhythm</span>
          </button>
        </div>
      </div>

      {mode === 'limbs' ? (
        <div id="kala-panel-limbs" role="tabpanel" aria-labelledby="kala-tab-limbs" className="space-y-4">
          <div role="group" aria-label="पञ्चाङ्ग के 5 अंग · Select Panchang limb" className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {FIVE_LIMBS.map((limb, idx) => {
              const selected = idx === limbIdx;
              const Icon = LIMB_ICONS[idx] ?? Star;
              return (
                <button
                  key={limb.num}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setLimbIdx(idx)}
                  className={`focus-ring flex min-h-[44px] items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs font-semibold transition ${
                    idx === 4 ? 'col-span-2 sm:col-span-1' : ''
                  } ${
                    selected
                      ? 'border-dharma-saffron bg-dharma-saffron/15 text-dharma-text'
                      : 'border-dharma-border bg-dharma-bg/60 text-dharma-muted hover:text-dharma-text'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0 text-dharma-saffron" aria-hidden="true" />
                  <span className="truncate">
                    <span className="mr-1 font-mono text-[11px] tabular-nums">{limb.num}</span>
                    <span lang="hi" data-bi="hi" className="font-devanagari">{limb.hi}</span>
                    <span data-bi="en-only">{limb.en}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="grid gap-5 md:grid-cols-12 items-center rounded-2xl border border-dharma-border bg-dharma-bg/65 p-4 sm:p-6">
            <div className="md:col-span-4 flex flex-col items-center text-center gap-2">
              <div className="relative flex h-24 w-24 items-center justify-center">
                <svg className="h-24 w-24 -rotate-90" viewBox="0 0 96 96" aria-hidden="true">
                  <circle cx="48" cy="48" r={ringR} fill="none" stroke="currentColor" strokeWidth="6" className="text-dharma-text/20" />
                  <circle
                    cx="48"
                    cy="48"
                    r={ringR}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeDasharray={ringC}
                    strokeDashoffset={limbDashOffset}
                    strokeLinecap="round"
                    className="text-dharma-saffron transition-[stroke-dashoffset] duration-300 motion-reduce:transition-none"
                  />
                </svg>
                <span lang="hi" className="absolute font-devanagari text-lg font-bold text-dharma-text">
                  {activeLimb.hi}
                </span>
              </div>
              <p className="font-mono text-[11px] font-semibold text-dharma-saffron">{activeLimb.arcFormula}</p>
              <p className="text-xs text-dharma-muted">
                <span lang="hi" data-bi="hi" className="font-devanagari">{activeLimb.elementHi}</span>
                <span data-bi="en-only">{activeLimb.elementEn}</span>
              </p>
            </div>

            <div className="md:col-span-8 space-y-2.5">
              <h3 className="text-title-3 font-semibold text-dharma-text">
                <span data-bi="en">{activeLimb.num}. {activeLimb.en}</span>
                <span data-bi="sep"> · </span>
                <span lang="hi" data-bi="hi" className="font-devanagari">{activeLimb.hi} तत्त्व-बोध</span>
              </h3>
              <p lang="hi" className="font-devanagari text-sm leading-loose text-dharma-text">
                {activeLimb.summaryHi}
              </p>
              <p className="text-xs leading-relaxed text-dharma-muted">{activeLimb.summaryEn}</p>
              <p lang="hi" className="rounded-xl border border-dharma-border bg-dharma-card px-3.5 py-2 font-devanagari text-xs text-dharma-muted">
                <strong className="text-dharma-text">स्वाध्याय सूत्र:</strong> {activeLimb.studyAlignHi}
              </p>
              <div>
                <Link
                  href={activeLimb.href}
                  className="focus-ring inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-dharma-saffron px-4 text-xs font-semibold text-dharma-bg hover:opacity-90 transition"
                >
                  <span lang="hi" data-bi="hi" className="font-devanagari">{activeLimb.hi} निर्देशिका खोलें</span>
                  <span data-bi="en-only">Open {activeLimb.en} Directory</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div id="kala-panel-ahoratra" role="tabpanel" aria-labelledby="kala-tab-ahoratra" className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <label htmlFor="ahoratra-slider" className="text-xs font-semibold text-dharma-muted">
              <span lang="hi" data-bi="hi" className="font-devanagari">सूर्य-चक्र प्रहर चुनें (01 से 06):</span>
              <span data-bi="en-only">Select Vedic daily period (01 to 06):</span>
            </label>
            <span className="font-mono text-xs font-bold tabular-nums text-dharma-saffron">
              {activeWin.timeLabel}
            </span>
          </div>

          <input
            id="ahoratra-slider"
            type="range"
            min={0}
            max={AHORATRA_WINDOWS.length - 1}
            step={1}
            value={windowIdx}
            aria-valuetext={`${activeWin.timeLabel}, ${activeWin.en} (${activeWin.hi})`}
            onChange={(e) => setWindowIdx(Number(e.target.value))}
            className="focus-ring min-h-[44px] w-full accent-[var(--tint)] cursor-pointer rounded-lg"
          />

          <div role="group" aria-label="दैनिक प्रहर · Daily windows" className="grid grid-cols-2 gap-2 sm:grid-cols-6">
            {AHORATRA_WINDOWS.map((w, idx) => (
              <button
                key={w.id}
                type="button"
                aria-pressed={idx === windowIdx}
                onClick={() => setWindowIdx(idx)}
                className={`focus-ring min-h-[44px] rounded-xl border px-2.5 py-1.5 text-left text-xs font-semibold transition ${
                  idx === windowIdx
                    ? 'border-dharma-saffron bg-dharma-saffron/15 text-dharma-text'
                    : 'border-dharma-border bg-dharma-bg/60 text-dharma-muted hover:text-dharma-text'
                }`}
              >
                <span className="block font-mono text-[10px] tabular-nums text-dharma-saffron">{w.timeLabel.split(' ')[0]}</span>
                <span lang="hi" data-bi="hi" className="block truncate font-devanagari">{w.hi}</span>
                <span data-bi="en-only" className="block truncate">{w.en}</span>
              </button>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-12 items-center rounded-2xl border border-dharma-border bg-dharma-bg/65 p-4 sm:p-6">
            <div className="md:col-span-4 flex flex-col items-center">
              <svg viewBox="0 0 220 110" className="w-full max-w-[210px]" aria-hidden="true">
                <line x1="16" y1="92" x2="204" y2="92" stroke="currentColor" strokeWidth="1.5" className="text-dharma-text/30" />
                <path
                  d="M 34 92 A 76 68 0 0 1 186 92"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray="4 4"
                  strokeWidth="1.5"
                  className="text-dharma-muted"
                />
                <circle cx={sunX} cy={sunY} r="15" className="fill-[#c2410c]/20 dark:fill-[#fbbf24]/25 transition-all duration-300 motion-reduce:transition-none" />
                <circle cx={sunX} cy={sunY} r="9" className="fill-[#c2410c] dark:fill-[#fbbf24] transition-all duration-300 motion-reduce:transition-none" />
              </svg>
              <span className="font-mono text-xs font-semibold tabular-nums text-dharma-muted">{activeWin.timeLabel}</span>
            </div>
            <div className="md:col-span-8 space-y-2">
              <h3 className="text-title-3 font-semibold text-dharma-text">
                <span data-bi="en">{activeWin.en}</span>
                <span data-bi="sep"> · </span>
                <span lang="hi" data-bi="hi" className="font-devanagari">{activeWin.hi}</span>
              </h3>
              <p lang="hi" className="font-devanagari text-sm leading-loose text-dharma-text">
                {activeWin.practiceHi}
              </p>
              <p className="text-xs leading-relaxed text-dharma-muted">{activeWin.practiceEn}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
