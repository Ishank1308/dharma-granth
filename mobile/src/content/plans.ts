import data from './generated/plans.json';

/** One day of a reading plan (data/reading-plans.ts on the website). */
export interface PlanDay {
  day: number;
  title: string;
  titleHi: string;
  scriptureId: string;
  chapter: number;
  verse?: string;
  minutes: number;
  focus: string;
  focusHi: string;
}

export interface ReadingPlan {
  id: string;
  title: string;
  titleHi: string;
  category: string;
  dailyMinutes: number;
  description: string;
  descriptionHi: string;
  days: PlanDay[];
}

/** A Gita chapter for the Sankalpa (lib/gita-sankalpa.ts). */
export interface GitaChapter {
  number: number;
  name: string;
  nameHi: string;
  verses: number;
  shatka: string;
  shatkaHi: string;
  theme: string;
  themeHi: string;
}

export const READING_PLANS = data.plans as ReadingPlan[];
export const GITA_CHAPTERS = data.gita as GitaChapter[];

export const getPlan = (id: string) => READING_PLANS.find((p) => p.id === id);
export const gitaChapter = (n: number) => GITA_CHAPTERS.find((c) => c.number === n);

const VARA = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'];

/**
 * The traditional Sankalpa words, as the website's getTraditionalSankalpaInvocation, with today's वार.
 * The tithi needs the Panchang, so it stays the website's neutral पावन तिथौ.
 */
export function sankalpaInvocation(date = new Date()): { sanskrit: string; hindi: string } {
  const vara = VARA[date.getDay()];
  return {
    sanskrit: `ॐ तत्सत्। श्रीपरमात्मने नमः।\nअद्य ${vara} वासरे, पावन तिथौ,\nमम कायिक-वाचिक-मानसिक पाप-निवारणार्थं,\nअन्तःकरण-शुद्धि-पूर्वकं, ज्ञान-वैराग्य-भक्ति-सिद्धये,\nभगवान् श्रीकृष्ण-प्रीत्यर्थं,\nश्रीमद्भगवद्गीता नित्य-स्वाध्याय-पारायण-संकल्पम् अहम् करिष्ये॥`,
    hindi: `ॐ तत्सत्। परमपिता परमात्मा को प्रणाम।\nआज ${vara}वार के पावन दिवस पर,\nमेरे मन, वाणी और शरीर से हुए दोषों की निवृत्ति,\nहृदय की शुद्धि, तथा ज्ञान, वैराग्य और भक्ति की प्राप्ति के लिए,\nभगवान् श्रीकृष्ण के प्रीत्यर्थ,\nमैं श्रीमद्भगवद्गीता के नित्य स्वाध्याय एवं पारायण का पावन संकल्प लेता/लेती हूँ।`,
  };
}
