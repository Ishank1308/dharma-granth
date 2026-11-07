'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Copy, Check, Sparkles, ExternalLink, Sun, Compass } from 'lucide-react';

interface GrahaDetail {
  number: number;
  name: string;
  nameHi: string;
  iast: string;
  role: string;
  roleHi: string;
  element: string;
  elementHi: string;
  gemstone: string;
  gemstoneHi: string;
  metal: string;
  metalHi: string;
  varaName?: string;
  varaNameHi?: string;
  varaSlug?: string;
  beejaMantra: string;
  gayatriMantra: string;
  shlokaExcerpt: string;
  shlokaMeaningHi: string;
  colorClass: string;
  borderClass: string;
  badgeClass: string;
}

const NAVAGRAHA_DATA: GrahaDetail[] = [
  {
    number: 1,
    name: 'Surya',
    nameHi: 'सूर्यदेव (आदित्य)',
    iast: 'Sūrya',
    role: 'Atmakaraka (Cosmic Soul & Vitality)',
    roleHi: 'आत्मकारक (चेतना, आरोग्य व तेजस्विता)',
    element: 'Tejas (Fire / Light)',
    elementHi: 'तेजस् (प्रकाश व ऊर्जा)',
    gemstone: 'Ruby (माणिक्य)',
    gemstoneHi: 'माणिक्य',
    metal: 'Copper (ताम्र)',
    metalHi: 'तांबा',
    varaName: 'Ravivara',
    varaNameHi: 'रविवार',
    varaSlug: 'ravivara',
    beejaMantra: 'ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः ॥',
    gayatriMantra: 'ॐ आदित्याय विद्महे मार्तण्डाय धीमहि तन्नः सूर्यः प्रचोदयात् ॥',
    shlokaExcerpt: 'जपाकुसुमसंकाशं काश्यपेयं महाद्युतिम् । तमोऽरिं सर्वपापघ्नं प्रणतोऽस्मि दिवाकरम् ॥ 1 ॥',
    shlokaMeaningHi: 'गुड़हल के फूल जैसे लाल कान्ति वाले, महर्षि कश्यप के पुत्र, अन्धकार के शत्रु और पाप-नाशक सूर्यदेव को प्रणाम।',
    colorClass: 'from-amber-500/10 via-orange-500/5 to-transparent',
    borderClass: 'border-amber-500/30 hover:border-amber-500/60',
    badgeClass: 'bg-amber-500/15 text-amber-900 dark:text-amber-200 border-amber-500/30',
  },
  {
    number: 2,
    name: 'Chandra',
    nameHi: 'चन्द्रमा (सोम)',
    iast: 'Candra',
    role: 'Manahkaraka (Mind, Emotions & Intuition)',
    roleHi: 'मनःकारक (चित्त, शान्ति व अमृतत्व)',
    element: 'Jala (Water)',
    elementHi: 'जल (शीतलता व संवेदनशीलता)',
    gemstone: 'Pearl (मुक्ता / मोती)',
    gemstoneHi: 'मोती',
    metal: 'Silver (रजत / चाँदी)',
    metalHi: 'चाँदी',
    varaName: 'Somavara',
    varaNameHi: 'सोमवार',
    varaSlug: 'somavara',
    beejaMantra: 'ॐ श्रां श्रीं श्रौं सः चन्द्रमसे नमः ॥',
    gayatriMantra: 'ॐ क्षीरपुत्राय विद्महे अमृततत्त्वाय धीमहि तन्नो चन्द्रः प्रचोदयात् ॥',
    shlokaExcerpt: 'दधिशङ्खतुषाराभं क्षीरोदार्णवसम्भवम् । नमामि शशिनं सोमं शम्भोर्मुकुटभूषणम् ॥ 2 ॥',
    shlokaMeaningHi: 'दही, शंख और हिम के समान धवल, क्षीरसागर से उत्पन्न और शिव जी के मुकुट-भूषण सोमदेव को नमन।',
    colorClass: 'from-sky-500/10 via-indigo-500/5 to-transparent',
    borderClass: 'border-sky-500/30 hover:border-sky-500/60',
    badgeClass: 'bg-sky-500/15 text-sky-900 dark:text-sky-200 border-sky-500/30',
  },
  {
    number: 3,
    name: 'Mangala',
    nameHi: 'मङ्गल (भौम / अङ्गारक)',
    iast: 'Maṅgala',
    role: 'Bhratrukaraka (Courage, Energy & Valor)',
    roleHi: 'धैर्य एवं पराक्रम (उत्साह व संकल्प)',
    element: 'Agni (Primal Fire)',
    elementHi: 'अग्नि (प्रचण्ड शक्ति व शौर्य)',
    gemstone: 'Red Coral (मूंगा)',
    gemstoneHi: 'मूंगा (प्रवाल)',
    metal: 'Copper / Brass (ताम्र / पीतल)',
    metalHi: 'ताम्र व पीतल',
    varaName: 'Mangalavara',
    varaNameHi: 'मंगलवार',
    varaSlug: 'mangalavara',
    beejaMantra: 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः ॥',
    gayatriMantra: 'ॐ अङ्गारकाय विद्महे शक्तिहस्ताय धीमहि तन्नो भौमः प्रचोदयात् ॥',
    shlokaExcerpt: 'धरणीगर्भसम्भूतं विद्युत्कान्तिसमप्रभम् । कुमारं शक्तिहस्तं च मङ्गलं प्रणमाम्यहम् ॥ 3 ॥',
    shlokaMeaningHi: 'पृथ्वी-गर्भ से उत्पन्न, बिजली जैसी प्रभा वाले और शक्ति-अस्त्र धारी कुमार मङ्गल को प्रणाम।',
    colorClass: 'from-rose-500/10 via-red-500/5 to-transparent',
    borderClass: 'border-rose-500/30 hover:border-rose-500/60',
    badgeClass: 'bg-rose-500/15 text-rose-900 dark:text-rose-200 border-rose-500/30',
  },
  {
    number: 4,
    name: 'Budha',
    nameHi: 'बुधदेव (सौम्य)',
    iast: 'Budha',
    role: 'Budhikaraka (Intellect, Speech & Commerce)',
    roleHi: 'बुद्धिकारक (वाणी, तर्क व विद्या)',
    element: 'Prithvi (Earth)',
    elementHi: 'पृथ्वी (स्थिरता व विश्लेषण)',
    gemstone: 'Emerald (पन्ना)',
    gemstoneHi: 'पन्ना',
    metal: 'Bronze / Alloy (कांस्य)',
    metalHi: 'कांस्य',
    varaName: 'Budhavara',
    varaNameHi: 'बुधवार',
    varaSlug: 'budhavara',
    beejaMantra: 'ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः ॥',
    gayatriMantra: 'ॐ सौम्यरूपाय विद्महे वाणेशाय धीमहि तन्नो सौम्यः प्रचोदयात् ॥',
    shlokaExcerpt: 'प्रियङ्गुकलिकाश्यामं रूपेणाप्रतिमं बुधम् । सौम्यं सौम्यगुणोपेतं तं बुधं प्रणमाम्यहम् ॥ 4 ॥',
    shlokaMeaningHi: 'प्रियंगु की कली जैसे श्यामल-हरित, अनुपम सौन्दर्य वाले और सौम्य गुणों से सम्पन्न बुध को नमन।',
    colorClass: 'from-emerald-500/10 via-teal-500/5 to-transparent',
    borderClass: 'border-emerald-500/30 hover:border-emerald-500/60',
    badgeClass: 'bg-emerald-500/15 text-emerald-900 dark:text-emerald-200 border-emerald-500/30',
  },
  {
    number: 5,
    name: 'Brihaspati',
    nameHi: 'बृहस्पति (गुरु)',
    iast: 'Bṛhaspati',
    role: 'Jnanakaraka (Wisdom, Dharma & Grace)',
    roleHi: 'ज्ञानकारक (धर्म, विवेक व गुरु-कृपा)',
    element: 'Akasha (Ether / Space)',
    elementHi: 'आकाश (विशालता व अध्यात्म)',
    gemstone: 'Yellow Sapphire (पुखराज)',
    gemstoneHi: 'पुखराज',
    metal: 'Gold (स्वर्ण / कनक)',
    metalHi: 'स्वर्ण (सोना)',
    varaName: 'Guruvara',
    varaNameHi: 'गुरुवार',
    varaSlug: 'guruvara',
    beejaMantra: 'ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः ॥',
    gayatriMantra: 'ॐ सुराचार्याय विद्महे देवपूज्याय धीमहि तन्नो गुरुः प्रचोदयात् ॥',
    shlokaExcerpt: 'देवानां च ऋषीणां च गुरुं काञ्चनसंनिभम् । बुद्धिभूतं त्रिलोकेशं तं नमामि बृहस्पतिम् ॥ 5 ॥',
    shlokaMeaningHi: 'देवताओं और ऋषियों के गुरु, स्वर्ण-कान्ति वाले और साक्षात् बुद्धि-स्वरूप बृहस्पति को प्रणाम।',
    colorClass: 'from-yellow-500/10 via-amber-500/5 to-transparent',
    borderClass: 'border-yellow-500/30 hover:border-yellow-500/60',
    badgeClass: 'bg-yellow-500/15 text-yellow-900 dark:text-yellow-200 border-yellow-500/30',
  },
  {
    number: 6,
    name: 'Shukra',
    nameHi: 'शुक्राचार्य (भार्गव)',
    iast: 'Śukra',
    role: 'Kalaraka (Aesthetics, Refinement & Sciences)',
    roleHi: 'कला व सौन्दर्य (नीति, विद्या व ऐश्वर्य)',
    element: 'Jala (Water)',
    elementHi: 'जल (माधुर्य व सृजन)',
    gemstone: 'Diamond / White Zircon (हीरा / श्वेत पुखराज)',
    gemstoneHi: 'हीरा',
    metal: 'Silver / White Gold (चाँदी / श्वेत स्वर्ण)',
    metalHi: 'चाँदी',
    varaName: 'Shukravara',
    varaNameHi: 'शुक्रवार',
    varaSlug: 'shukravara',
    beejaMantra: 'ॐ द्रां द्रीं द्रौं सः शुक्राय नमः ॥',
    gayatriMantra: 'ॐ भृगुपुत्राय विद्महे दिव्यदेहाय धीमहि तन्नः शुक्रः प्रचोदयात् ॥',
    shlokaExcerpt: 'हिमकुन्दमृणालाभं दैत्यानां परमं गुरुम् । सर्वशास्त्रप्रवक्तारं भार्गवं प्रणमाम्यहम् ॥ 6 ॥',
    shlokaMeaningHi: 'बर्फ और कुन्द के समान श्वेत, समस्त शास्त्रों के अद्वितीय वक्ता भृगु-पुत्र शुक्राचार्य को प्रणाम।',
    colorClass: 'from-pink-500/10 via-rose-500/5 to-transparent',
    borderClass: 'border-pink-500/30 hover:border-pink-500/60',
    badgeClass: 'bg-pink-500/15 text-pink-900 dark:text-pink-200 border-pink-500/30',
  },
  {
    number: 7,
    name: 'Shani',
    nameHi: 'शनैश्चर (शनिदेव)',
    iast: 'Śanaiścara',
    role: 'Karmaphala-data (Justice, Discipline & Endurance)',
    roleHi: 'कर्मफलदाता (न्याय, तप व वैराग्य)',
    element: 'Vayu (Air)',
    elementHi: 'वायु (गतिशीलता व गाम्भीर्य)',
    gemstone: 'Blue Sapphire (नीलम)',
    gemstoneHi: 'नीलम',
    metal: 'Iron / Lead (लौह / सीसा)',
    metalHi: 'लोहा',
    varaName: 'Shanivara',
    varaNameHi: 'शनिवार',
    varaSlug: 'shanivara',
    beejaMantra: 'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः ॥',
    gayatriMantra: 'ॐ काकध्वजाय विद्महे खड्गहस्ताय धीमहि तन्नो मन्दः प्रचोदयात् ॥',
    shlokaExcerpt: 'नीलाञ्जनसमाभासं रविपुत्रं यमाग्रजम् । छायामार्तण्डसम्भूतं तं नमामि शनैश्चरम् ॥ 7 ॥',
    shlokaMeaningHi: 'नीले काजल जैसी कान्ति वाले, सूर्य-पुत्र और यमराज के अग्रज शनिदेव को मेरा नमन।',
    colorClass: 'from-blue-600/10 via-slate-600/5 to-transparent',
    borderClass: 'border-blue-600/30 hover:border-blue-600/60',
    badgeClass: 'bg-blue-600/15 text-blue-900 dark:text-blue-200 border-blue-600/30',
  },
  {
    number: 8,
    name: 'Rahu',
    nameHi: 'राहु (छायाग्रह / उत्तर चन्द्रपात)',
    iast: 'Rāhu',
    role: 'Ascending Node (Material Ambition & Unconventional Insight)',
    roleHi: 'छायाग्रह (अन्वेषण, सूक्ष्म दृष्टि व माया)',
    element: 'Chhaya / Vayu (Shadow Force)',
    elementHi: 'छाया (आकाशीय ग्रहण बिन्दु)',
    gemstone: 'Hessonite Garnet (गोमेद)',
    gemstoneHi: 'गोमेद',
    metal: 'Lead / Mixed Alloy (रांगा / मिश्र धातु)',
    metalHi: 'सीसा व रांगा',
    beejaMantra: 'ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः ॥',
    gayatriMantra: 'ॐ नागध्वजाय विद्महे पद्महस्ताय धीमहि तन्नो राहुः प्रचोदयात् ॥',
    shlokaExcerpt: 'अर्धकायं महावीर्यं चन्द्रादित्यविमर्दनम् । सिंहिकागर्भसम्भूतं तं राहुं प्रणमाम्यहम् ॥ 8 ॥',
    shlokaMeaningHi: 'आधे शरीर वाले, महापराक्रमी, सूर्य-चन्द्र को ग्रसने वाले सिंहिका-पुत्र राहु को मेरा प्रणाम।',
    colorClass: 'from-violet-600/10 via-purple-600/5 to-transparent',
    borderClass: 'border-violet-600/30 hover:border-violet-600/60',
    badgeClass: 'bg-violet-600/15 text-violet-900 dark:text-violet-200 border-violet-600/30',
  },
  {
    number: 9,
    name: 'Ketu',
    nameHi: 'केतु (मोक्षकारक / दक्षिण चन्द्रपात)',
    iast: 'Ketu',
    role: 'Mokshakaraka (Liberation, Detachment & Spiritual Intuition)',
    roleHi: 'मोक्षकारक (आत्म-साक्षात्कार व वैराग्य)',
    element: 'Agni / Sukshma (Subtle Fiery Energy)',
    elementHi: 'अग्नि (सूक्ष्म तेज व कुण्डलिनी शक्ति)',
    gemstone: 'Cat’s Eye (लहसुनिया / वैदूर्य)',
    gemstoneHi: 'लहसुनिया',
    metal: 'Iron-alloy / Mercury (पारद व मिश्रित धातु)',
    metalHi: 'पारद व मिश्र धातु',
    beejaMantra: 'ॐ स्रां स्रीं स्रौं सः केतवे नमः ॥',
    gayatriMantra: 'ॐ अश्मध्वजाय विद्महे शूलहस्ताय धीमहि तन्नः केतुः प्रचोदयात् ॥',
    shlokaExcerpt: 'पलाशपुष्पसंकाशं तारकाग्रहमस्तकम् । रौद्रं रौद्रात्मकं घोरं तं केतुं प्रणमाम्यहम् ॥ 9 ॥',
    shlokaMeaningHi: 'पलाश-पुष्प जैसे लाल, नक्षत्रों में शिरोमणि और रौद्र शक्ति से सम्पन्न केतु को प्रणाम।',
    colorClass: 'from-amber-700/10 via-stone-600/5 to-transparent',
    borderClass: 'border-amber-700/30 hover:border-amber-700/60',
    badgeClass: 'bg-amber-700/15 text-amber-900 dark:text-amber-200 border-amber-700/30',
  },
];

export function NavagrahaMandalam({ inlineOnly = false }: { inlineOnly?: boolean } = {}) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyText = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <section aria-labelledby="navagraha-mandalam-heading" className={inlineOnly ? 'my-6 space-y-5' : 'my-12 space-y-6'}>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-dharma-border pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-saffron-500/30 bg-saffron-500/10 px-3 py-1 text-xs font-semibold text-saffron-800 dark:text-saffron-300 mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>नवग्रह मण्डल विवरण · Nine Celestial Regents</span>
          </div>
          <h3 id="navagraha-mandalam-heading" className="font-serif text-xl sm:text-2xl font-bold text-dharma-text">
            नवग्रह बीजमन्त्र, गायत्री एवं आकाशीय समन्वय
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-dharma-muted">
            महर्षि वेदव्यास विरचित नवग्रह स्तोत्र के प्रत्येक ग्रह का बीजमन्त्र, गायत्री, तत्त्व, रत्न एवं वैदिक वार सम्बद्धता।
          </p>
        </div>

        {!inlineOnly && (
          <Link
            href="/panchang/varas/"
            className="focus-ring rounded inline-flex items-center gap-1.5 text-xs font-semibold text-saffron-800 dark:text-saffron-300 hover:underline shrink-0"
          >
            <span>7 वैदिक वार दर्शिका (7 Varas Directory)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {NAVAGRAHA_DATA.map((graha) => {
          const beejaKey = `beeja-${graha.number}`;
          const gayatriKey = `gayatri-${graha.number}`;

          return (
            <div
              key={graha.number}
              className={`rounded-3xl border bg-gradient-to-br ${graha.colorClass} bg-dharma-card p-5 sm:p-6 transition shadow-xs flex flex-col justify-between ${graha.borderClass}`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-dharma-bg border border-dharma-border text-xs font-bold text-dharma-text">
                      {graha.number}
                    </span>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-dharma-text leading-tight">
                        {graha.name} ({graha.nameHi})
                      </h3>
                      <p className="text-xs font-serif italic text-dharma-muted">{graha.iast}</p>
                    </div>
                  </div>

                  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${graha.badgeClass}`}>
                    {graha.elementHi}
                  </span>
                </div>

                {/* Role */}
                <p className="text-xs text-dharma-muted mb-4 border-l-2 border-saffron-500/40 pl-2.5">
                  <strong className="text-dharma-text font-medium">{graha.roleHi}</strong>
                  <br />
                  <span className="text-[11px] italic">{graha.role}</span>
                </p>

                {/* Shloka excerpt */}
                <div className="rounded-xl bg-dharma-bg/70 border border-dharma-border/60 p-3 mb-4">
                  <p lang="sa" className="font-devanagari text-xs sm:text-sm font-semibold text-dharma-text leading-relaxed">
                    {graha.shlokaExcerpt}
                  </p>
                  <p lang="hi" className="font-devanagari text-[11px] text-dharma-muted mt-1 leading-normal">
                    {graha.shlokaMeaningHi}
                  </p>
                </div>

                {/* Mantras */}
                <div className="space-y-2.5 text-xs">
                  {/* Beeja Mantra */}
                  <div className="rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-300/30 p-2.5">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[11px] font-bold text-amber-900 dark:text-amber-300">बीज मन्त्र (Beeja Mantra)</span>
                      <button
                        type="button"
                        onClick={() => copyText(graha.beejaMantra, beejaKey)}
                        className="focus-ring rounded inline-flex items-center gap-1 text-[10px] text-amber-800 dark:text-amber-300 hover:underline"
                        aria-label={`Copy ${graha.name} Beeja Mantra`}
                      >
                        {copiedKey === beejaKey ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p lang="sa" className="font-devanagari text-xs font-bold text-amber-950 dark:text-amber-100">
                      {graha.beejaMantra}
                    </p>
                  </div>

                  {/* Gayatri Mantra */}
                  <div className="rounded-lg bg-dharma-bg/80 border border-dharma-border/70 p-2.5">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[11px] font-bold text-dharma-muted">वैदिक गायत्री मन्त्र</span>
                      <button
                        type="button"
                        onClick={() => copyText(graha.gayatriMantra, gayatriKey)}
                        className="focus-ring rounded inline-flex items-center gap-1 text-[10px] text-dharma-muted hover:underline"
                        aria-label={`Copy ${graha.name} Gayatri Mantra`}
                      >
                        {copiedKey === gayatriKey ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p lang="sa" className="font-devanagari text-xs font-medium text-dharma-text leading-relaxed">
                      {graha.gayatriMantra}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer info: Gemstone & Weekday */}
              <div className="mt-4 pt-3 border-t border-dharma-border/60 flex items-center justify-between text-xs">
                <span className="text-dharma-muted text-[11px]">
                  रत्न: <strong className="text-dharma-text font-medium">{graha.gemstoneHi}</strong>
                </span>

                {graha.varaSlug ? (
                  inlineOnly ? (
                    <span className="text-[11px] text-dharma-muted">
                      वार: <strong className="text-dharma-text font-medium">{graha.varaNameHi}</strong>
                    </span>
                  ) : (
                    <Link
                      href={`/panchang/varas/${graha.varaSlug}/`}
                      className="focus-ring rounded inline-flex items-center gap-1 font-semibold text-saffron-800 dark:text-saffron-300 hover:underline text-[11px]"
                    >
                      <span>{graha.varaNameHi} विवरण</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  )
                ) : (
                  <span className="text-[11px] text-dharma-muted italic">छायाग्रह (Lunar Node)</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
