import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import Link from 'next/link';
import { keepDanda, CHAPTERS, getChapterData, getVerse, publishedChapterNumbers, publishedTotals, verseHref } from '@/lib/ashtavakra';
import { HeroEnvironment, ConceptVisual } from './visuals';
import { ChapterPath, type PathChapter } from './ChapterPath';
import { ContinueReading, DailyVerse, SkipAnimation, type DailyItem } from './VerseBits';

export const metadata: Metadata = {
  title: 'अष्टावक्र गीता: मूल संस्कृत, हिन्दी भावार्थ और सरल व्याख्या',
  description: 'अष्टावक्र गीता के श्लोक: मूल संस्कृत, पुस्तकानुसार हिन्दी भावार्थ, सरल हिन्दी व्याख्या, आधुनिक उदाहरण और English। हर श्लोक पर स्रोत-सत्यापन की स्थिति।',
  alternates: { canonical: '/ashtavakra/' },
  openGraph: {
    title: 'अष्टावक्र गीता: मूल संस्कृत, हिन्दी भावार्थ और सरल व्याख्या',
    description:
      'अष्टावक्र गीता के श्लोक: मूल संस्कृत, पुस्तकानुसार हिन्दी भावार्थ, सरल हिन्दी व्याख्या, आधुनिक उदाहरण और English। हर श्लोक पर स्रोत-सत्यापन की स्थिति।',
    url: '/ashtavakra/',
    images: [DEFAULT_OG_IMAGE],
  },
};

const STAGES = [
  { n: 1, name: 'बाहरी संसार', text: 'पहचान, भूमिकाएँ, शोर, तुलना और मन की भाग-दौड़। यहाँ से यात्रा शुरू होती है।' },
  { n: 2, name: 'आत्मचिंतन', text: 'प्रश्न, अवलोकन और बढ़ती स्पष्टता। जगह खुलती है और ठहराव आता है।' },
  { n: 3, name: 'साक्षीभाव', text: 'बदलते अनुभवों को देखने वाली स्थिर जागरूकता की पहचान।' },
  { n: 4, name: 'अद्वैत', text: 'भेद की सीमाओं का ढीला होना और अवधारणाओं से परे मौन।' },
];

export default function AshtavakraHome() {
  const totals = publishedTotals();
  const featured = getVerse(1, 3)!;
  const nums = publishedChapterNumbers();

  const pathChapters: PathChapter[] = CHAPTERS.map((c) => ({ ...c, ids: getChapterData(c.number)?.verses.map((v) => v.verseNumber) ?? [] }));
  const unpublished = CHAPTERS.filter((c) => c.status !== 'published').map((c) => c.number);
  const daily: DailyItem[] = nums.flatMap((n) =>
    getChapterData(n)!.verses.map((v) => ({ id: v.verseNumber, href: verseHref(v.verseNumber), sanskrit: v.sanskrit, hindi: v.literalHindiMeaning, summary: v.oneLineSummaryHindi })),
  );
  const cont = nums.map((n) => ({ number: n, title: getChapterData(n)!.chapterTitleEditorial, ids: getChapterData(n)!.verses.map((v) => v.verseNumber) }));

  const stories = ['1.7', '1.8', '2.16'].map((id) => {
    const [c, v] = id.split('.').map(Number);
    return getVerse(c, v)!;
  });
  const concepts = getChapterData(1)!.concepts.slice(0, 8);

  return (
    <main id="main">
      {/* 1. Hero */}
      <header className="relative overflow-hidden">
        <HeroEnvironment />
        <div className="mx-auto max-w-5xl px-4 pb-14 pt-16 text-center sm:px-6 sm:pt-24">
          <h1 lang="hi" className="ash-hero-title font-bold" style={{ fontSize: 'clamp(2.4rem, 1.6rem + 4vw, 4.2rem)', lineHeight: 1.3 }}>
            अष्टावक्र गीता
          </h1>
          <p lang="hi" className="ash-reveal mt-3 font-bold" style={{ fontSize: 'clamp(1.15rem, 1rem + 0.8vw, 1.5rem)' }}>
            स्वयं को बदलने से पहले, स्वयं को पहचानने की यात्रा
          </p>
          <p lang="hi" className="ash-reveal ash-hindi mx-auto mt-3 max-w-2xl">
            मूल संस्कृत, पुस्तकानुसार हिन्दी भावार्थ, सरल व्याख्या और आधुनिक जीवन से जुड़ी समझ
          </p>
          <div className="ash-reveal mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/ashtavakra/1/" className="ash-btn ash-btn-primary">अध्ययन प्रारम्भ करें</Link>
            <a href="#chapters" className="ash-btn">20 अध्याय देखें</a>
            <a href="#daily" className="ash-btn">आज का श्लोक</a>
            <SkipAnimation />
          </div>
          <p className="ash-meta mt-6">
            अभी उपलब्ध: {totals.chapters} प्रकरण और {totals.verses} श्लोक, कुल {totals.allChapters} में से।
            {unpublished.length > 0 ? ' शेष प्रकरण क्रम से जोड़े जा रहे हैं।' : ''}
          </p>
        </div>
      </header>

      <div className="mx-auto grid max-w-5xl gap-14 px-4 pb-24 sm:px-6">
        {/* 2. Why read */}
        <section aria-labelledby="why" className="ash-card">
          <h2 id="why" className="font-bold" style={{ fontSize: '1.5rem' }}>अष्टावक्र गीता क्यों पढ़ें?</h2>
          <div lang="hi" className="ash-hindi mt-3">
            <p>अष्टावक्र गीता राजा जनक और ऋषि अष्टावक्र के संवाद के रूप में है। यह कुछ नया पाने की बात नहीं करती; यह उन सीमित पहचानों को देखने की बात करती है जिन्हें हम अपना पूरा स्वरूप मान लेते हैं: शरीर, भूमिका, मन की हलचल और “मैं ही सब करने वाला हूँ” का भाव।</p>
            <p>यहाँ मूल श्लोक सबसे ऊपर रहता है। उसके बाद पुस्तक की टीका पर आधारित भावार्थ, अलग से सरल हिन्दी व्याख्या और, जहाँ उपयुक्त हो, आधुनिक उदाहरण आते हैं। हर परत पर साफ़ लिखा रहता है कि वह क्या है।</p>
          </div>
        </section>

        {/* 3. Four stages */}
        <section aria-labelledby="stages">
          <h2 id="stages" className="font-bold" style={{ fontSize: '1.5rem' }}>पहचान से अनंत जागरूकता तक: चार पड़ाव</h2>
          <p className="ash-meta mt-1">संपादकीय अध्ययन-सहायक। मूल ग्रंथ का क्रम या अध्याय-विभाजन नहीं बदला गया है।</p>
          <ol className="mt-4 grid gap-3 md:grid-cols-2">
            {STAGES.map((s) => (
              <li key={s.n} className="ash-stage" data-stage={s.n}>
                <p className="ash-eyebrow" style={{ color: 'inherit', opacity: 0.8 }}>पड़ाव {s.n}</p>
                <h3 lang="hi" className="font-bold" style={{ fontSize: '1.25rem' }}>{s.name}</h3>
                <p lang="hi" className="ash-hindi">{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* 4. Chapter path */}
        <section id="chapters" aria-labelledby="path-h" className="scroll-mt-6">
          <h2 id="path-h" className="font-bold" style={{ fontSize: '1.5rem' }}>चेतना का पथ: प्रकरण 1–{totals.chapters} प्रकाशित</h2>
          <p className="ash-meta mt-1 mb-4">
            परंपरा में {totals.allChapters} प्रकरण हैं। इस स्थल पर प्रकरण 1 से {totals.chapters} तक प्रकाशित हैं और खुलते हैं।
            {unpublished.length > 0 ? ` प्रकरण ${unpublished.join(' और ')} अभी स्थल पर नहीं हैं; वे नीचे केवल संकेत के रूप में हैं और किसी पृष्ठ पर नहीं खुलते।` : ''}
            {' '}अध्याय-नाम और प्रतीक संपादकीय संकेत हैं; पुस्तक केवल “पहला प्रकरण”, “दूसरा प्रकरण” आदि नाम देती है। चमक केवल इस डिवाइस पर आपके पढ़े हुए चिह्नों को दिखाती है, किसी स्तर या उपलब्धि को नहीं।
          </p>
          <ChapterPath chapters={pathChapters} />
        </section>

        {/* 5. Featured + 6. reading preview */}
        <section aria-labelledby="feat" className="ash-card">
          <h2 id="feat" className="ash-eyebrow">चुना हुआ श्लोक: {featured.verseNumber}</h2>
          <p lang="sa" className="ash-sanskrit mt-2" style={{ whiteSpace: 'pre-line' }}>{keepDanda(featured.sanskrit)}</p>
          <p lang="hi" className="ash-hindi mt-1"><strong>शाब्दिक अर्थ:</strong> {featured.literalHindiMeaning}</p>
          <p lang="hi" className="ash-hindi mt-2"><strong>सरल रूप में:</strong> {featured.oneLineSummaryHindi}</p>
          <Link href={verseHref(featured.verseNumber)} className="ash-btn mt-4">पूरी व्याख्या पढ़ें</Link>
        </section>

        {/* 7. Sakshi visual */}
        <section aria-labelledby="sk-h" className="grid gap-4 md:grid-cols-2">
          <div>
            <h2 id="sk-h" className="font-bold" style={{ fontSize: '1.5rem' }}>साक्षी: एक दृश्य-व्याख्या</h2>
            <p lang="hi" className="ash-hindi mt-2">साक्षी का अर्थ है वह जागरूक उपस्थिति जो अनुभवों को जानती है, पर अनुभवों की तरह बदलती नहीं। साक्षीभाव भावनाओं को दबाना नहीं है; यह उन्हें दबाए बिना जागरूकता से देखने की दृष्टि है।</p>
          </div>
          <ConceptVisual id="sakshi" />
        </section>

        {/* 8. Modern-life cards */}
        <section aria-labelledby="mod" className="grid gap-4">
          <div>
            <h2 id="mod" className="font-bold" style={{ fontSize: '1.5rem' }}>आधुनिक जीवन से जुड़ी समझ</h2>
            <p className="ash-meta mt-1">ये उदाहरण संपादकीय हैं। ये श्लोक का शाब्दिक अर्थ नहीं हैं और श्लोक में आधुनिक तकनीक की चर्चा नहीं है।</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {stories.map((v) => (
              <article key={v.verseNumber} className="ash-card" lang="hi">
                <p className="ash-eyebrow">श्लोक {v.verseNumber}</p>
                <h3 className="font-bold mt-1">स्थिति</h3>
                <p className="ash-hindi">{v.modernExampleHindi.replace(/\s*\(यह आधुनिक उदाहरण है[^)]*\)/, '')}</p>
                <h3 className="font-bold mt-3">श्लोक की दृष्टि</h3>
                <p className="ash-hindi">{v.oneLineSummaryHindi}</p>
                <h3 className="font-bold mt-3">जिम्मेदार व्यवहार</h3>
                <p className="ash-hindi">{v.practicalApplicationHindi}</p>
                <h3 className="font-bold mt-3">आत्मचिंतन प्रश्न</h3>
                <p className="ash-hindi">{v.reflectionQuestionHindi}</p>
              </article>
            ))}
          </div>
        </section>

        {/* 9. Daily verse */}
        <div id="daily" className="scroll-mt-6">
          <DailyVerse items={daily} />
        </div>

        {/* 10. Audio */}
        <section aria-labelledby="aud" className="ash-card">
          <h2 id="aud" className="font-bold" style={{ fontSize: '1.25rem' }}>ध्वनि</h2>
          <p lang="hi" className="ash-hindi mt-2">इस साइट पर अभी कोई ऑडियो नहीं है, न पाठ का और न व्याख्या का; इसलिए ध्वनि-नियंत्रण या पृष्ठभूमि-ध्वनि भी नहीं दी गई। जब प्रमाणित मानव-रिकॉर्डिंग उपलब्ध होंगी, तभी वे और उनके ट्रांसक्रिप्ट जोड़े जाएँगे, और ध्वनि कभी अपने-आप नहीं चलेगी।</p>
        </section>

        {/* 11. Concepts */}
        <section id="concepts" aria-labelledby="con" className="scroll-mt-6">
          <h2 id="con" className="font-bold" style={{ fontSize: '1.5rem' }}>प्रमुख अवधारणाएँ</h2>
          <p className="ash-meta mt-1">पहले प्रकरण से। पूर्ण शब्दावली और अवधारणा-मानचित्र बाद के चरण में जोड़े जाएँगे।</p>
          <dl className="mt-4 grid gap-3 md:grid-cols-2">
            {concepts.map((c) => (
              <div key={c.term} className="ash-card">
                <dt lang="sa" className="font-bold" style={{ fontSize: '1.15rem' }}>{c.term}</dt>
                <dd lang="hi" className="ash-hindi">{c.definition}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <ConceptVisual id="ocean" />
            <ConceptVisual id="ahankara" />
          </div>
        </section>

        {/* 12. Continue reading */}
        <section aria-labelledby="cont" className="ash-card">
          <h2 id="cont" className="font-bold" style={{ fontSize: '1.25rem' }}>पढ़ना जारी रखें</h2>
          <ContinueReading chapters={cont} />
          <p className="ash-meta mt-2">आपके पढ़े हुए चिह्न केवल इसी ब्राउज़र में रहते हैं। कोई खाता, स्कोर या क्रम-दबाव नहीं है।</p>
        </section>

        {/* 13. Source */}
        <section id="source" aria-labelledby="src" className="ash-card scroll-mt-6">
          <h2 id="src" className="font-bold" style={{ fontSize: '1.25rem' }}>स्रोत संस्करण के बारे में</h2>
          <div lang="hi" className="ash-hindi mt-2">
            <p>मूल आधार “अष्टावक्र-गीता, भाषा-टीका सहित” का एक स्कैन किया हुआ संस्करण है। मुखपृष्ठ और प्रकाशक-पृष्ठ के अनुसार प्रकाशक तेजकुमार बुकडिपो, लखनऊ है। प्रकाशन-वर्ष और प्रकाशन-अधिकार की स्थिति की पुष्टि अभी लंबित है।</p>
            <p>पृष्ठों को छवि के रूप में देखकर पढ़ा गया है, स्वचालित OCR से नहीं। जहाँ पुस्तक के छपे पाठ में आंतरिक भेद मिला, वहाँ पाठ को जैसा छपा है वैसा रखा गया और श्लोक पर “समीक्षा आवश्यक” दर्शाया गया है। किसी बाहरी पाठ से चुपचाप कुछ बदला नहीं गया।</p>
            <p>“पुस्तकानुसार हिन्दी भावार्थ” पुस्तक की टीका का मौलिक पुनर्कथन है, शब्दशः प्रति नहीं। यह अब तक किसी संस्कृत-विद्वान द्वारा समीक्षित नहीं है।</p>
          </div>
        </section>

        {/* 14. Modes */}
        <section aria-labelledby="modes" className="ash-card">
          <h2 id="modes" className="font-bold" style={{ fontSize: '1.25rem' }}>पहुँच और पढ़ने के मोड</h2>
          <ul lang="hi" className="ash-hindi mt-2 grid gap-1" style={{ listStyle: 'disc', paddingLeft: '1.25rem' }}>
            <li><strong>पूर्ण अनुभव:</strong> हल्की परतदार पृष्ठभूमि और बहुत सीमित गति।</li>
            <li><strong>संतुलित:</strong> स्थिर चित्र, कम गति। यह डिफ़ॉल्ट है।</li>
            <li><strong>केवल पाठ:</strong> कोई सजावट नहीं, अधिकतम स्पष्टता।</li>
          </ul>
          <p className="ash-meta mt-2">पन्ने के ऊपर “दृश्य, गति और थीम की सेटिंग” से बदलें। आपके डिवाइस की “कम गति” सेटिंग हमेशा मानी जाती है। सारा पाठ बिना JavaScript या एनिमेशन के भी पढ़ा जा सकता है।</p>
        </section>
      </div>
    </main>
  );
}
