'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  PRESET_LOCATIONS,
  calculateEducationalPanchang,
  todayForLocation,
  type LocationConfig,
  type PanchangDayData,
} from '@/lib/panchang';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { SPRING } from '@/app/components/liquid/motion';
import { KalaChakra, type ChakraState } from './KalaChakra';
import { makeStars } from './starfield';

const FAR = makeStars(140, 7);
const NEAR = makeStars(46, 29);

function limbsOf(p: PanchangDayData | null) {
  return [
    { sa: 'तिथि', en: 'Tithi', gloss: 'the lunar day', value: p ? `${p.tithi.nameHi}` : null, sub: p ? `${p.tithi.pakshaHi} · ${p.tithi.transliteration}` : null },
    { sa: 'वार', en: 'Vāra', gloss: 'the weekday', value: p ? p.dayOfWeekHi : null, sub: p ? p.dayOfWeek : null },
    { sa: 'नक्षत्र', en: 'Nakṣatra', gloss: 'the moon’s lunar mansion', value: p ? p.nakshatra.nameHi : null, sub: p ? `${p.nakshatra.transliteration} · pada ${p.nakshatra.pada}` : null },
    { sa: 'योग', en: 'Yoga', gloss: 'sun and moon joined', value: p ? p.yoga.nameHi : null, sub: p ? p.yoga.transliteration : null },
    { sa: 'करण', en: 'Karaṇa', gloss: 'half of a tithi', value: p ? p.karana.nameHi : null, sub: p ? p.karana.transliteration : null },
  ];
}

/**
 * The Panchang opening: a turning night sky and the Kāla-chakra, with the
 * five limbs of time (pañca + aṅga) as the five points of a star. Always a
 * night sky, whatever the site theme. Values appear once the browser knows
 * today's date at the reader's place (the static HTML cannot); until then
 * the limbs show their names and meanings only.
 */
export function PanchangCosmos() {
  const reduce = useReducedMotion();
  const [location] = useLocalStorage<LocationConfig>('dharma.panchang.location', PRESET_LOCATIONS[0]);
  const [day, setDay] = useState<Date | null>(null);

  useEffect(() => {
    setDay(todayForLocation(location));
  }, [location]);

  const panchang = useMemo(() => {
    if (!day) return null;
    try {
      return calculateEducationalPanchang(day, location);
    } catch {
      return null;
    }
  }, [day, location]);

  const chakra: ChakraState | null = panchang
    ? {
        nakshatraIndex: panchang.nakshatra.index,
        pada: panchang.nakshatra.pada,
        tithiOfMonth: panchang.tithi.paksha === 'Shukla' ? panchang.tithi.number : 15 + panchang.tithi.number,
        tithiProgress: panchang.tithi.progressPercent,
        illumination: panchang.paksha.illuminationPercent,
        waxing: panchang.paksha.isWaxing,
      }
    : null;

  const limbs = limbsOf(panchang);

  return (
    <section className="cosmos relative isolate overflow-hidden text-[#ece8f5]" aria-labelledby="panchang-title">
      {/* Night sky */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="cosmos-sky absolute inset-0" />
        <div className="cosmos-milkyway absolute inset-0" />
        <svg className={`absolute inset-[-10%] h-[120%] w-[120%] ${reduce ? '' : 'cosmos-drift-far'}`} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          {FAR.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r * 0.09} fill="#fff" opacity={s.o * 0.7} className={s.twinkle !== undefined && !reduce ? 'cosmos-twinkle' : undefined} style={s.twinkle !== undefined ? { animationDelay: `${s.twinkle}s` } : undefined} />
          ))}
        </svg>
        <svg className={`absolute inset-[-10%] h-[120%] w-[120%] ${reduce ? '' : 'cosmos-drift-near'}`} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          {NEAR.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r * 0.14} fill="#fdf6e3" opacity={s.o} className={s.twinkle !== undefined && !reduce ? 'cosmos-twinkle' : undefined} style={s.twinkle !== undefined ? { animationDelay: `${s.twinkle}s` } : undefined} />
          ))}
        </svg>
        {!reduce && <span className="cosmos-meteor" />}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-dharma-bg to-transparent" />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-20 pt-14 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:gap-14 lg:pb-28 lg:pt-20">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#b9b2d6]">काल दर्शन · An educational calendar</p>
          <h1 id="panchang-title" className="mt-4 font-serif text-5xl font-medium leading-[1.02] tracking-tight sm:text-6xl">
            <span lang="sa" className="shloka-text block text-[#f3e3b3]">पञ्चाङ्ग</span>{' '}
            <span className="mt-2 block text-3xl text-[#ece8f5] sm:text-4xl">Pañcāṅga</span>
          </h1>
          <p className="mt-5 max-w-md font-serif text-lg leading-relaxed text-[#c9c3e0]">
            <span lang="sa" className="font-sanskrit">पञ्च</span> five + <span lang="sa" className="font-sanskrit">अङ्ग</span> limbs: the
            five measures by which the old astronomers read a day, from the moon’s place among the stars and its distance from the sun.
          </p>
          {panchang && (
            <motion.p initial={reduce ? false : { y: 8 }} animate={{ y: 0 }} transition={SPRING} className="mt-6 text-sm text-[#b9b2d6]">
              <span lang="hi">{panchang.fullDateHindi}</span> · {panchang.location.name}
              <span className="mx-2 text-[#6f6890]">·</span>
              <span>Moon {Math.round(panchang.paksha.illuminationPercent)}% lit, {panchang.paksha.isWaxing ? 'waxing' : 'waning'}</span>
            </motion.p>
          )}

          <ol className="mt-8 grid gap-2.5 sm:grid-cols-2">
            {limbs.map((l, i) => (
              <motion.li
                key={l.en}
                initial={reduce ? false : { y: 14 }}
                animate={{ y: 0 }}
                transition={{ ...SPRING, delay: 0.15 + i * 0.08 }}
                className={`cosmos-limb rounded-2xl px-4 py-3 ${i === 4 ? 'sm:col-span-2' : ''}`}
              >
                <p className="flex items-baseline gap-2 text-[11px] uppercase tracking-[0.16em] text-[#9d96bd]">
                  <span className="font-mono text-[#f3e3b3]">{i + 1}</span>
                  <span lang="sa" className="font-sanskrit text-sm normal-case tracking-normal text-[#ece8f5]">{l.sa}</span>
                  <span>{l.en}</span>
                  <span className="normal-case tracking-normal text-[#7c759c]">· {l.gloss}</span>
                </p>
                <p className="mt-1 min-h-[1.75rem] text-lg text-[#fdf6e3]">
                  {l.value ? (
                    <>
                      <span lang="hi" className="font-devanagari">{l.value}</span>
                      {l.sub && <span className="ml-2 text-sm text-[#b9b2d6]">{l.sub}</span>}
                    </>
                  ) : (
                    <span className="text-sm text-[#7c759c]">…</span>
                  )}
                </p>
              </motion.li>
            ))}
          </ol>
        </div>

        <motion.div
          className="relative order-first mx-auto aspect-square w-full max-w-[340px] sm:max-w-[460px] lg:order-none lg:max-w-[560px]"
          initial={reduce ? false : { scale: 0.92 }}
          animate={{ scale: 1 }}
          transition={{ ...SPRING, stiffness: 120 }}
        >
          <div aria-hidden="true" className="cosmos-halo absolute inset-[8%] rounded-full" />
          <KalaChakra state={chakra} />
        </motion.div>
      </div>
    </section>
  );
}
