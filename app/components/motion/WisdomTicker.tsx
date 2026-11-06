const TICKER_LINES: Array<{ sa: string; en: string; cite: string }> = [
  { sa: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन', en: 'You have a right to your actions, never to their fruits', cite: 'Gita 2.47' },
  { sa: 'मन एव मनुष्याणां कारणं बन्धमोक्षयोः', en: 'The mind alone is the cause of bondage and liberation', cite: 'Amritabindu Upanishad' },
  { sa: 'सत्यमेव जयते', en: 'Truth alone triumphs', cite: 'Mundaka 3.1.6' },
  { sa: 'वसुधैव कुटुम्बकम्', en: 'The whole world is one family', cite: 'Maha Upanishad 6.71' },
  { sa: 'योगः कर्मसु कौशलम्', en: 'Yoga is excellence in action', cite: 'Gita 2.50' },
  { sa: 'तत् त्वम् असि', en: 'Thou art That', cite: 'Chandogya 6.8.7' },
  { sa: 'अहिंसा परमो धर्मः', en: 'Non-violence is the highest dharma', cite: 'Mahabharata' },
  { sa: 'विद्या ददाति विनयम्', en: 'Knowledge bestows humility', cite: 'Hitopadesha' },
];

/**
 * A slow Sanskrit wisdom ticker. Pure CSS marquee (globals.css `.ticker`):
 * the track loops seamlessly, pauses on hover/focus, and under
 * `prefers-reduced-motion` renders as a calm static list. The second copy is
 * aria-hidden so screen readers hear each line once.
 */
export function WisdomTicker() {
  return (
    <div className="ticker border-b border-dharma-border/60 bg-dharma-card-soft/60" data-testid="wisdom-ticker">
      <div className="ticker-track" role="presentation">
        {[0, 1].map((copy) => (
          <div key={copy} aria-hidden={copy === 1} className="ticker-group">
            {TICKER_LINES.map((line) => (
              <span key={line.sa} className="ticker-item">
                <span lang="sa" className="font-devanagari font-bold text-saffron-800 dark:text-saffron-300">
                  {line.sa}
                </span>
                <span className="ticker-sep" aria-hidden="true">
                  ❁
                </span>
                <span className="ticker-gloss">{line.en}</span>
                <span className="ticker-cite">— {line.cite}</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
