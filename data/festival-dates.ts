import { istDate } from '@/lib/ist';

// Major festival and observance dates for the practice dashboard's
// festival reminder. Hindu festivals follow the lunar calendar, so exact
// dates vary by region and pañcāṅga — these are widely published dates for
// India and should be treated as approximate. The UI surfaces a "confirm
// locally" note wherever these are shown.
//
// Rich cultural detail for each festival lives in `data/festivals.ts`
// (the /festivals page); this file is only the dated calendar.

export interface FestivalDate {
  name: string;
  nameHindi?: string;
  /** ISO date, local calendar day. */
  date: string;
  note?: string;
  /** id into data/festivals.ts, when a detail page section exists. */
  festivalId?: string;
}

export const FESTIVAL_DATES: FestivalDate[] = [
  { name: 'Guru Purnima', nameHindi: 'गुरु पूर्णिमा', date: '2026-07-29', note: 'Honouring the guru — reading Vyasa and one\'s own teachers.' },
  { name: 'Nag Panchami', nameHindi: 'नाग पंचमी', date: '2026-08-17' },
  { name: 'Raksha Bandhan', nameHindi: 'रक्षा बंधन', date: '2026-08-28' },
  { name: 'Krishna Janmashtami', nameHindi: 'कृष्ण जन्माष्टमी', date: '2026-09-04', note: 'A day for the Bhagavad Gita and Bhagavata Purana.', festivalId: 'janmashtami' },
  { name: 'Ganesh Chaturthi', nameHindi: 'गणेश चतुर्थी', date: '2026-09-14' },
  { name: 'Sharad Navaratri begins', nameHindi: 'शरद नवरात्रि', date: '2026-10-11', note: 'Nine nights of the Devi — Durga Saptashati recitation.', festivalId: 'navaratri' },
  { name: 'Durga Ashtami', nameHindi: 'दुर्गा अष्टमी', date: '2026-10-18' },
  { name: 'Vijayadashami (Dussehra)', nameHindi: 'विजयादशमी', date: '2026-10-20' },
  { name: 'Sharad Purnima', nameHindi: 'शरद पूर्णिमा', date: '2026-10-25' },
  { name: 'Dhanteras', nameHindi: 'धनतेरस', date: '2026-11-06' },
  { name: 'Diwali', nameHindi: 'दीपावली', date: '2026-11-08', festivalId: 'diwali' },
  { name: 'Govardhan Puja', nameHindi: 'गोवर्धन पूजा', date: '2026-11-10' },
  { name: 'Bhai Dooj', nameHindi: 'भाई दूज', date: '2026-11-11' },
  { name: 'Kartik Purnima / Dev Deepawali', nameHindi: 'कार्तिक पूर्णिमा', date: '2026-11-24' },
  { name: 'Gita Jayanti', nameHindi: 'गीता जयंती', date: '2026-12-20', note: 'The day the Bhagavad Gita was spoken — a day to read it.' },
  { name: 'Makar Sankranti', nameHindi: 'मकर संक्रांति', date: '2027-01-14' },
  { name: 'Vasant Panchami', nameHindi: 'वसंत पंचमी', date: '2027-02-11', note: 'Saraswati Puja — auspicious for beginning study.' },
  { name: 'Maha Shivaratri', nameHindi: 'महा शिवरात्रि', date: '2027-03-06', note: 'Night vigil and japa of Shiva.', festivalId: 'mahashivratri' },
  { name: 'Holi', nameHindi: 'होली', date: '2027-03-22', festivalId: 'holi' },
  { name: 'Ram Navami', nameHindi: 'राम नवमी', date: '2027-04-15', note: 'Birth of Sri Rama — Ramayana and Ramcharitmanas path.' },
  { name: 'Hanuman Jayanti', nameHindi: 'हनुमान जयंती', date: '2027-04-21' },
  { name: 'Akshaya Tritiya', nameHindi: 'अक्षय तृतीया', date: '2027-05-09' },
  { name: 'Guru Purnima', nameHindi: 'गुरु पूर्णिमा', date: '2027-07-18' },
];

export interface UpcomingFestival extends FestivalDate {
  /** 0 = today, 1 = tomorrow, … */
  daysAway: number;
}

/** The next `count` festivals on or after `from` (by the Indian calendar day), with day distances. */
export function upcomingFestivals(count = 4, from: Date = new Date()): UpcomingFestival[] {
  const today = istDate(from);
  const todayUtc = Date.UTC(today.year, today.month - 1, today.day);
  return FESTIVAL_DATES.flatMap((f) => {
    const [y, m, d] = f.date.split('-').map(Number);
    const daysAway = Math.round((Date.UTC(y, m - 1, d) - todayUtc) / 86_400_000);
    return daysAway >= 0 ? [{ ...f, daysAway }] : [];
  })
    .sort((a, b) => a.daysAway - b.daysAway)
    .slice(0, count);
}
