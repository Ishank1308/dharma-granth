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
  { name: 'Makar Sankranti', nameHindi: 'मकर संक्रांति', date: '2027-01-15' },
  { name: 'Vasant Panchami', nameHindi: 'वसंत पंचमी', date: '2027-02-11', note: 'Saraswati Puja — auspicious for beginning study.' },
  { name: 'Maha Shivaratri', nameHindi: 'महा शिवरात्रि', date: '2027-03-06', note: 'Night vigil and japa of Shiva.', festivalId: 'mahashivratri' },
  { name: 'Holi', nameHindi: 'होली', date: '2027-03-22', festivalId: 'holi' },
  { name: 'Ram Navami', nameHindi: 'राम नवमी', date: '2027-04-15', note: 'Birth of Sri Rama — Ramayana and Ramcharitmanas path.' },
  { name: 'Hanuman Jayanti', nameHindi: 'हनुमान जयंती', date: '2027-04-21' },
  { name: 'Akshaya Tritiya', nameHindi: 'अक्षय तृतीया', date: '2027-05-09' },
  { name: 'Jagannath Ratha Yatra', nameHindi: 'जगन्नाथ रथयात्रा', date: '2027-07-05' },
  { name: 'Guru Purnima', nameHindi: 'गुरु पूर्णिमा', date: '2027-07-18' },
  { name: 'Raksha Bandhan', nameHindi: 'रक्षा बंधन', date: '2027-08-17' },
  { name: 'Krishna Janmashtami', nameHindi: 'कृष्ण जन्माष्टमी', date: '2027-08-25', note: 'A day for the Bhagavad Gita and Bhagavata Purana.', festivalId: 'janmashtami' },
  { name: 'Ganesh Chaturthi', nameHindi: 'गणेश चतुर्थी', date: '2027-09-04' },
  { name: 'Sharad Navaratri begins', nameHindi: 'शारदीय नवरात्रि', date: '2027-09-30', note: 'Nine nights of the Devi — Durga Saptashati recitation.', festivalId: 'navaratri' },
  { name: 'Durga Ashtami', nameHindi: 'दुर्गा अष्टमी', date: '2027-10-07' },
  { name: 'Vijayadashami (Dussehra)', nameHindi: 'विजयादशमी', date: '2027-10-09' },
  { name: 'Sharad Purnima', nameHindi: 'शरद पूर्णिमा', date: '2027-10-14' },
  { name: 'Diwali', nameHindi: 'दीपावली', date: '2027-10-29', festivalId: 'diwali' },
  { name: 'Govardhan Puja', nameHindi: 'गोवर्धन पूजा', date: '2027-10-30' },
  { name: 'Bhai Dooj', nameHindi: 'भाई दूज', date: '2027-10-31' },
  { name: 'Gita Jayanti', nameHindi: 'गीता जयंती', date: '2027-12-09', note: 'A day to read the Bhagavad Gita.' },
  // 2027–2030 additions are major dates from the linked Indian/Hindu calendar
  // references at the end of this list. Observance dates can vary by region,
  // sunrise rule, and tradition; the UI explicitly asks readers to confirm locally.
  { name: 'Makar Sankranti', nameHindi: 'मकर संक्रांति', date: '2028-01-15' },
  { name: 'Vasant Panchami', nameHindi: 'वसंत पंचमी', date: '2028-01-31' },
  { name: 'Maha Shivaratri', nameHindi: 'महा शिवरात्रि', date: '2028-02-23', note: 'Night vigil and japa of Shiva.', festivalId: 'mahashivratri' },
  { name: 'Holi', nameHindi: 'होली', date: '2028-03-11', festivalId: 'holi' },
  { name: 'Rama Navami', nameHindi: 'राम नवमी', date: '2028-04-03', note: 'Smarta observance; regional dates may differ.' },
  { name: 'Akshaya Tritiya', nameHindi: 'अक्षय तृतीया', date: '2028-04-27' },
  { name: 'Jagannath Ratha Yatra', nameHindi: 'जगन्नाथ रथयात्रा', date: '2028-06-24' },
  { name: 'Guru Purnima', nameHindi: 'गुरु पूर्णिमा', date: '2028-07-06', note: 'Honouring the guru — reading Vyasa and one’s own teachers.' },
  { name: 'Raksha Bandhan', nameHindi: 'रक्षा बंधन', date: '2028-08-05' },
  { name: 'Krishna Janmashtami', nameHindi: 'कृष्ण जन्माष्टमी', date: '2028-08-13', note: 'A day for the Bhagavad Gita and Bhagavata Purana.', festivalId: 'janmashtami' },
  { name: 'Ganesh Chaturthi', nameHindi: 'गणेश चतुर्थी', date: '2028-08-23' },
  { name: 'Sharad Navaratri begins', nameHindi: 'शारदीय नवरात्रि', date: '2028-09-19', note: 'Nine nights of the Devi — Durga Saptashati recitation.', festivalId: 'navaratri' },
  { name: 'Durga Ashtami', nameHindi: 'दुर्गा अष्टमी', date: '2028-09-26' },
  { name: 'Vijayadashami (Dussehra)', nameHindi: 'विजयादशमी', date: '2028-09-27' },
  { name: 'Sharad Purnima', nameHindi: 'शरद पूर्णिमा', date: '2028-10-02' },
  { name: 'Diwali', nameHindi: 'दीपावली', date: '2028-10-17', festivalId: 'diwali' },
  { name: 'Makar Sankranti', nameHindi: 'मकर संक्रांति', date: '2029-01-14' },
  { name: 'Vasant Panchami', nameHindi: 'वसंत पंचमी', date: '2029-01-19' },
  { name: 'Maha Shivaratri', nameHindi: 'महा शिवरात्रि', date: '2029-02-11', note: 'Night vigil and japa of Shiva.', festivalId: 'mahashivratri' },
  { name: 'Holi', nameHindi: 'होली', date: '2029-03-01', festivalId: 'holi' },
  { name: 'Ugadi / Gudi Padwa', nameHindi: 'उगादि · गुड़ी पड़वा', date: '2029-04-14' },
  { name: 'Rama Navami', nameHindi: 'राम नवमी', date: '2029-04-23' },
  { name: 'Jagannath Ratha Yatra', nameHindi: 'जगन्नाथ रथयात्रा', date: '2029-07-13' },
  { name: 'Guru Purnima', nameHindi: 'गुरु पूर्णिमा', date: '2029-07-25' },
  { name: 'Raksha Bandhan', nameHindi: 'रक्षा बंधन', date: '2029-08-23' },
  { name: 'Krishna Janmashtami', nameHindi: 'कृष्ण जन्माष्टमी', date: '2029-09-01', note: 'A day for the Bhagavad Gita and Bhagavata Purana.', festivalId: 'janmashtami' },
  { name: 'Ganesh Chaturthi', nameHindi: 'गणेश चतुर्थी', date: '2029-09-11' },
  { name: 'Sharad Navaratri begins', nameHindi: 'शारदीय नवरात्रि', date: '2029-10-08', note: 'Nine nights of the Devi — Durga Saptashati recitation.', festivalId: 'navaratri' },
  { name: 'Durga Ashtami', nameHindi: 'दुर्गा अष्टमी', date: '2029-10-14' },
  { name: 'Vijayadashami (Dussehra)', nameHindi: 'विजयादशमी', date: '2029-10-16' },
  { name: 'Sharad Purnima', nameHindi: 'शरद पूर्णिमा', date: '2029-10-21' },
  { name: 'Diwali', nameHindi: 'दीपावली', date: '2029-11-05', festivalId: 'diwali' },
  { name: 'Gita Jayanti', nameHindi: 'गीता जयंती', date: '2029-12-16', note: 'A day to read the Bhagavad Gita.' },
  { name: 'Makar Sankranti', nameHindi: 'मकर संक्रांति', date: '2030-01-14' },
  { name: 'Vasant Panchami', nameHindi: 'वसंत पंचमी', date: '2030-02-07' },
  { name: 'Maha Shivaratri', nameHindi: 'महा शिवरात्रि', date: '2030-03-02', note: 'Night vigil and japa of Shiva.', festivalId: 'mahashivratri' },
  { name: 'Holi', nameHindi: 'होली', date: '2030-03-20', festivalId: 'holi' },
  { name: 'Ugadi / Gudi Padwa', nameHindi: 'उगादि · गुड़ी पड़वा', date: '2030-04-03' },
  { name: 'Rama Navami', nameHindi: 'राम नवमी', date: '2030-04-12' },
  { name: 'Jagannath Ratha Yatra', nameHindi: 'जगन्नाथ रथयात्रा', date: '2030-07-02' },
  { name: 'Guru Purnima', nameHindi: 'गुरु पूर्णिमा', date: '2030-07-15' },
  { name: 'Raksha Bandhan', nameHindi: 'रक्षा बंधन', date: '2030-08-13' },
  { name: 'Krishna Janmashtami', nameHindi: 'कृष्ण जन्माष्टमी', date: '2030-08-21', note: 'A day for the Bhagavad Gita and Bhagavata Purana.', festivalId: 'janmashtami' },
  { name: 'Ganesh Chaturthi', nameHindi: 'गणेश चतुर्थी', date: '2030-09-01' },
  { name: 'Sharad Navaratri begins', nameHindi: 'शारदीय नवरात्रि', date: '2030-09-28', note: 'Nine nights of the Devi — Durga Saptashati recitation.', festivalId: 'navaratri' },
  { name: 'Durga Ashtami', nameHindi: 'दुर्गा अष्टमी', date: '2030-10-04' },
  { name: 'Vijayadashami (Dussehra)', nameHindi: 'विजयादशमी', date: '2030-10-06' },
  { name: 'Sharad Purnima', nameHindi: 'शरद पूर्णिमा', date: '2030-10-10' },
  { name: 'Diwali', nameHindi: 'दीपावली', date: '2030-10-26', festivalId: 'diwali' },
  { name: 'Gita Jayanti', nameHindi: 'गीता जयंती', date: '2030-12-05', note: 'A day to read the Bhagavad Gita.' },
];

/**
 * Calendar references used for 2027–2030: Drik Panchang's India calendar
 * (2027 and 2030), Hindu calendars for Delhi/India (2028), Ujjain/India
 * (2029), and Haveri/India (2030). Gita Jayanti dates use its date pages.
 * Local pañcāṅga rules may produce different dates:
 * https://www.drikpanchang.com/calendars/indian/indiancalendar.html
 */

export interface UpcomingFestival extends FestivalDate {
  /** 0 = today, 1 = tomorrow, … */
  daysAway: number;
}

/** The next `count` festivals on or after `from` (by the browser's local day), with day distances. */
export function upcomingFestivals(count = 4, from: Date = new Date()): UpcomingFestival[] {
  const todayUtc = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  return FESTIVAL_DATES.flatMap((f) => {
    const [y, m, d] = f.date.split('-').map(Number);
    const daysAway = Math.round((Date.UTC(y, m - 1, d) - todayUtc) / 86_400_000);
    return daysAway >= 0 ? [{ ...f, daysAway }] : [];
  })
    .sort((a, b) => a.daysAway - b.daysAway)
    .slice(0, count);
}
