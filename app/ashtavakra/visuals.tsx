import type { AshtavakraChapterMeta } from '@/data/ashtavakra/chapters-meta';

/**
 * Original, text-free SVG environments. Every one is decoration (aria-hidden);
 * the meaning is always also given as real text next to it (see ChapterFigure
 * and ConceptVisual captions). The static state of each drawing is its final,
 * clearest state, so removing all motion loses nothing.
 */

const Dust = () => (
  <div className="ash-decor" aria-hidden="true">
    <span className="ash-dust" style={{ left: '12%', top: '70%' }} />
    <span className="ash-dust" style={{ left: '28%', top: '82%' }} />
    <span className="ash-dust" style={{ left: '47%', top: '64%' }} />
    <span className="ash-dust" style={{ left: '63%', top: '78%' }} />
    <span className="ash-dust" style={{ left: '78%', top: '68%' }} />
    <span className="ash-dust" style={{ left: '90%', top: '84%' }} />
  </div>
);

/** Concentric circles and a central bindu: restrained sacred geometry. */
function Geometry({ cx = 600, cy = 220 }: { cx?: number; cy?: number }) {
  return (
    <g className="ash-geometry" fill="none" stroke="currentColor" strokeWidth="1">
      {[40, 80, 120, 170, 230, 300].map((r) => (
        <circle key={r} cx={cx} cy={cy} r={r} />
      ))}
      <circle cx={cx} cy={cy} r="3" fill="currentColor" />
    </g>
  );
}

/** Homepage hero: still water, open sky, a thin horizon line. */
export function HeroEnvironment() {
  return (
    <div className="ash-env ash-hero-env" aria-hidden="true">
      <div className="ash-layer-bg" />
      <div className="ash-layer-grain" />
      <svg viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" className="ash-parallax">
        <defs>
          <linearGradient id="ash-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#17213f" stopOpacity="0.38" />
            <stop offset="0.6" stopColor="#d7862a" stopOpacity="0.2" />
            <stop offset="1" stopColor="#f7f0df" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="ash-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#d7862a" stopOpacity="0.2" />
            <stop offset="1" stopColor="#17213f" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <rect width="1200" height="330" fill="url(#ash-sky)" />
        <Geometry cx={600} cy={250} />
        <line x1="0" y1="330" x2="1200" y2="330" stroke="#e8c27a" strokeWidth="1.5" opacity="0.9" />
        <rect y="330" width="1200" height="270" fill="url(#ash-water)" />
        {[352, 378, 410, 450, 500].map((y, i) => (
          <line key={y} x1={420 - i * 40} y1={y} x2={780 + i * 40} y2={y} stroke="#f7f0df" strokeWidth="1" opacity={0.5 - i * 0.07} />
        ))}
        <circle cx="600" cy="330" r="46" fill="#f7f0df" opacity="0.5" />
      </svg>
      <Dust />
    </div>
  );
}

/**
 * Chapter 1: a clear mirror emerging from mist. Four translucent layers
 * (body, roles, thoughts, identity-mist) move apart and the mirror clears.
 * The static state shows the layers already parted.
 */
function MirrorEnvironment() {
  return (
    <svg viewBox="0 0 1200 520" preserveAspectRatio="xMaxYMid slice" className="ash-parallax">
      <defs>
        <radialGradient id="ash-mirror" cx="0.5" cy="0.45" r="0.6">
          <stop offset="0" stopColor="#f7f0df" stopOpacity="0.95" />
          <stop offset="1" stopColor="#8fa3c8" stopOpacity="0.25" />
        </radialGradient>
      </defs>
      <g transform="translate(300 0)">
      <Geometry cx={600} cy={260} />
      <ellipse cx="600" cy="260" rx="120" ry="170" fill="url(#ash-mirror)" stroke="#b99045" strokeWidth="3" />
      <ellipse cx="600" cy="260" rx="98" ry="148" fill="none" stroke="#f7f0df" strokeWidth="1" opacity="0.7" />
      <g className="ash-l-body"><ellipse cx="600" cy="260" rx="150" ry="120" fill="#6d2932" opacity="0.28" /></g>
      <g className="ash-l-roles"><ellipse cx="600" cy="270" rx="190" ry="90" fill="#d7862a" opacity="0.26" /></g>
      <g className="ash-l-thought">
        <path d="M380 210 C 480 150, 560 250, 640 190 S 800 150, 840 230" fill="none" stroke="#17213f" strokeWidth="3" opacity="0.5" />
        <path d="M400 320 C 500 280, 580 360, 680 300 S 790 290, 830 340" fill="none" stroke="#17213f" strokeWidth="2" opacity="0.4" />
      </g>
      <g className="ash-l-mist"><rect x="300" y="120" width="600" height="300" rx="150" fill="#f7f0df" opacity="0.85" /></g>
      </g>
    </svg>
  );
}

/** Quiet generic environment for chapters whose own artwork is not made yet. */
function GenericEnvironment({ meta }: { meta: AshtavakraChapterMeta }) {
  const [a, b, c] = meta.palette;
  const detail = 6 - meta.quiet; // quieter chapters draw less
  return (
    <svg viewBox="0 0 1200 520" preserveAspectRatio="xMidYMid slice" className="ash-parallax">
      <defs>
        <linearGradient id={`ash-g-${meta.number}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={a} stopOpacity="0.55" />
          <stop offset="0.6" stopColor={b} stopOpacity="0.3" />
          <stop offset="1" stopColor={c} stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <rect width="1200" height="520" fill={`url(#ash-g-${meta.number})`} />
      <Geometry cx={600} cy={260} />
      {Array.from({ length: detail }).map((_, i) => (
        <path key={i} d={`M0 ${380 + i * 18} C 300 ${350 + i * 18}, 900 ${420 + i * 18}, 1200 ${380 + i * 18}`} fill="none" stroke="#f7f0df" strokeWidth="1" opacity={0.35 - i * 0.04} />
      ))}
    </svg>
  );
}

export function ChapterEnvironment({ meta }: { meta: AshtavakraChapterMeta }) {
  return (
    <div className="ash-env" aria-hidden="true">
      <div className="ash-layer-bg" />
      <div className="ash-layer-grain" />
      {meta.number === 1 ? <MirrorEnvironment /> : <GenericEnvironment meta={meta} />}
      {meta.quiet <= 2 && <Dust />}
    </div>
  );
}

/** Visible explanation of an environment, so meaning never lives only in the image. */
export function ChapterFigureCaption({ meta }: { meta: AshtavakraChapterMeta }) {
  return (
    <p className="ash-meta">
      <strong>चित्र-विवरण (संपादकीय):</strong> {meta.symbol}। {meta.visualTransition}
      {meta.number !== 1 && ' (इस अध्याय का अपना चित्र अभी बनना शेष है; यहाँ सरल सामान्य पृष्ठभूमि दिखाई गई है।)'}
    </p>
  );
}

type ConceptId = 'sakshi' | 'ocean' | 'ahankara' | 'vairagya' | 'akarta';

export const CONCEPTS: Record<ConceptId, { title: string; caption: string; alt: string }> = {
  sakshi: { title: 'साक्षी', caption: 'बादल बदलते हैं, आकाश नहीं। विचार बदलते हैं, साक्षी नहीं।', alt: 'स्थिर नीले आकाश में कुछ बादल बाएँ से दाएँ गुज़रते हैं।' },
  ocean: { title: 'महासागर और लहरें', caption: 'अनुभव बदलते हैं, चेतना का आधार बना रहता है।', alt: 'एक ही समुद्र में छोटी-बड़ी लहरें उठती और गिरती हैं।' },
  ahankara: { title: 'अहंकार', caption: 'भूमिकाएँ उपयोगी हैं, परन्तु वे आपके सम्पूर्ण स्वरूप को परिभाषित नहीं करतीं।', alt: 'एक खाली केंद्र के चारों ओर अनेक छोटे गोले (भूमिकाएँ) घूमते हैं।' },
  vairagya: { title: 'वैराग्य', caption: 'वस्तु का उपयोग, पर उस पर मानसिक निर्भरता नहीं।', alt: 'एक खुली हथेली पर रखी गोल वस्तु, उँगलियाँ उसे जकड़ती नहीं।' },
  akarta: { title: 'कर्म और कर्तापन', caption: 'कर्म होता है, पर उसका पूरा स्वामित्व किसी एक सीमित “मैं” का नहीं।', alt: 'नदी का जल कई धाराओं, पत्थरों और ढलानों के बीच से बहता है।' },
};

/** Concept visual + caption + text description. Never meaning-by-image-only. */
export function ConceptVisual({ id }: { id: ConceptId }) {
  const c = CONCEPTS[id];
  return (
    <figure className="ash-card" style={{ margin: 0 }}>
      <svg viewBox="0 0 320 170" role="img" aria-label={c.alt} className="w-full" style={{ maxHeight: 190 }}>
        {id === 'sakshi' && (
          <>
            <rect width="320" height="170" rx="12" fill="#8fa3c8" opacity="0.35" />
            <g className="ash-cloud"><ellipse cx="90" cy="70" rx="48" ry="16" fill="#f7f0df" opacity="0.95" /><ellipse cx="230" cy="110" rx="56" ry="15" fill="#f7f0df" opacity="0.85" /></g>
          </>
        )}
        {id === 'ocean' && (
          <>
            <rect width="320" height="170" rx="12" fill="#17213f" opacity="0.25" />
            {[50, 80, 110, 140].map((y, i) => (
              <path key={y} d={`M0 ${y} Q 40 ${y - 14 - i * 2} 80 ${y} T 160 ${y} T 240 ${y} T 320 ${y}`} fill="none" stroke="#315c59" strokeWidth="3" opacity={0.9 - i * 0.15} />
            ))}
          </>
        )}
        {id === 'ahankara' && (
          <>
            <rect width="320" height="170" rx="12" fill="#cfa878" opacity="0.25" />
            <circle cx="160" cy="85" r="6" fill="none" stroke="#6d2932" strokeWidth="2" />
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const a = (i / 6) * Math.PI * 2;
              return <circle key={i} cx={160 + Math.cos(a) * 52} cy={85 + Math.sin(a) * 52} r="10" fill="#d7862a" opacity="0.8" />;
            })}
          </>
        )}
        {id === 'vairagya' && (
          <>
            <rect width="320" height="170" rx="12" fill="#f2e8cf" />
            <path d="M70 120 Q 160 150 250 110" fill="none" stroke="#6d2932" strokeWidth="6" strokeLinecap="round" />
            <circle cx="160" cy="92" r="24" fill="#b99045" />
            <path d="M120 112 Q 135 100 140 108 M200 112 Q 185 100 180 108" fill="none" stroke="#6d2932" strokeWidth="4" strokeLinecap="round" />
          </>
        )}
        {id === 'akarta' && (
          <>
            <rect width="320" height="170" rx="12" fill="#315c59" opacity="0.2" />
            <path d="M0 40 C 90 70, 120 20, 200 60 S 300 100, 320 90" fill="none" stroke="#315c59" strokeWidth="4" />
            <path d="M0 90 C 80 120, 140 80, 210 110 S 290 150, 320 140" fill="none" stroke="#315c59" strokeWidth="3" opacity="0.8" />
            <ellipse cx="120" cy="105" rx="14" ry="9" fill="#8a8d8f" /><ellipse cx="230" cy="80" rx="12" ry="8" fill="#8a8d8f" />
          </>
        )}
      </svg>
      <figcaption>
        <p className="font-bold" style={{ fontSize: '1.1rem' }}>{c.title}</p>
        <p className="ash-hindi">{c.caption}</p>
        <p className="ash-meta">चित्र का वर्णन: {c.alt}</p>
      </figcaption>
    </figure>
  );
}
