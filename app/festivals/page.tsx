'use client';

import { festivals } from '@/data/festivals';
import Link from 'next/link';
import { PageHeader, SectionTitle } from '@/app/components/apple/PageHeader';
import { PageCover } from '@/app/components/PagePhoto';
import { FestivalsOpening } from './FestivalsOpening';

export default function FestivalsPage() {
  return (
    <main className="apple-scope min-h-screen bg-dharma-bg relative overflow-clip">
      {/* Festive Radiant Halos Backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 h-[500px] w-full max-w-6xl rounded-full bg-radial from-amber-400/22 via-saffron-500/12 to-transparent blur-3xl"
      />

      <div className="relative z-10">
        <PageHeader
          width="wide"
          eyebrow="Festivals"
          eyebrowHi="उत्सव"
          title="Festival Knowledge Centre"
          cover={<PageCover photo="ganga" />}
          titleHi="उत्सव ज्ञान केंद्र"
          lead={
            <p lang="hi" className="font-devanagari">
              {festivals.length} प्रमुख त्योहारों का विस्तृत ज्ञान — अर्थ, शास्त्रीय स्रोत, क्षेत्रीय परंपराएँ, संबंधित देवता, पारंपरिक अनुष्ठान, जप और प्रार्थना, भोजन परंपरा, पर्यावरणीय विचार, और शास्त्रीय बनाम सांस्कृतिक रिवाज़ों का भेद।
            </p>
          }
        />
      </div>

      {/* The next festival, large, beside the recurring vratas */}
      <FestivalsOpening />

      {/* Festival Grid */}
      <section aria-labelledby="festivals-all-heading" className="relative z-10 mx-auto max-w-7xl px-gutter pb-20 pt-14">
        <SectionTitle
          id="festivals-all-heading"
          title="The festivals"
          titleHi="प्रमुख पर्व"
          sub={<span lang="hi" className="font-devanagari">हर पर्व का अर्थ, कथा, विधि और मंत्र।</span>}
        />
        {/* The cards cascade in as they scroll into view (.reveal-grid, motion.css); the HTML is never hidden. */}
        <div className="reveal-grid grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {festivals.map((festival) => (
            <div key={festival.id}>
              <Link
                href={`/festivals/${festival.id}/`}
                data-vt="open"
                className="focus-ring card-sacred group block relative overflow-hidden rounded-card border border-dharma-border/80 bg-dharma-card/85 p-6 text-left shadow-raised hover:shadow-lifted hover:border-saffron-400/50 hover:-translate-y-0.5 transition-all h-full"
              >
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${festival.gradient}`} />
                <div className="flex items-start gap-4 mb-3">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${festival.gradient} flex items-center justify-center text-3xl shrink-0 shadow-md`}>
                    {festival.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-serif font-bold text-dharma-text group-hover:text-saffron-700 dark:group-hover:text-saffron-300 transition">{festival.name}</h3>
                    <p className="text-sm text-saffron-700 dark:text-saffron-400 font-semibold">{festival.sanskrit}</p>
                  </div>
                </div>
                <p className="text-sm text-dharma-muted leading-relaxed mb-4">{festival.shortDesc}</p>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-dharma-border/60">
                  <span className="text-dharma-muted">{festival.category}</span>
                  <span className="font-semibold text-saffron-700 dark:text-saffron-400 group-hover:translate-x-1 transition-transform">
                    पूरा विवरण व मंत्र देखें &rarr;
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
