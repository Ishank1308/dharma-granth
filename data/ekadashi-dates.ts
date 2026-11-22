// Ekadashi dates (Smarta reckoning, IST), shown on /panchang/ekadashi/ and used by the
// festival-eve notices on /practice/ and /panchang/ and by the Android app's reminders.
// Observance can differ by a day between Smarta and Vaishnava reckoning and by city;
// every surface that shows these asks the reader to confirm locally.

export interface EkadashiDate {
  name: string;
  paksha?: string;
  month: string;
  /** Display date in Hindi. */
  date: string;
  /** ISO date, local calendar day. */
  dateEn: string;
  highlight?: boolean;
}

export const EKADASHI_DATES: EkadashiDate[] = [
  // 2026
  { name: 'उत्पन्ना एकादशी (Utpanna Ekadashi)', paksha: 'कृष्ण पक्ष', month: 'मार्गशीर्ष', date: '05 दिसंबर 2026', dateEn: '2026-12-05' },
  { name: 'मोक्षदा एकादशी (Mokshada / गीता जयंती)', paksha: 'शुक्ल पक्ष', month: 'मार्गशीर्ष', date: '20 दिसंबर 2026', dateEn: '2026-12-20', highlight: true },

  // 2027
  { name: 'सफला एकादशी (Saphala Ekadashi)', paksha: 'कृष्ण पक्ष', month: 'पौष', date: '04 जनवरी 2027', dateEn: '2027-01-04' },
  { name: 'पुत्रदा एकादशी (Pausha Putrada)', paksha: 'शुक्ल पक्ष', month: 'पौष', date: '18 जनवरी 2027', dateEn: '2027-01-18' },
  { name: 'षट्तिला एकादशी (Shattila Ekadashi)', paksha: 'कृष्ण पक्ष', month: 'माघ', date: '02 फरवरी 2027', dateEn: '2027-02-02' },
  { name: 'जया एकादशी (Jaya Ekadashi)', paksha: 'शुक्ल पक्ष', month: 'माघ', date: '17 फरवरी 2027', dateEn: '2027-02-17' },
  { name: 'विजया एकादशी (Vijaya Ekadashi)', paksha: 'कृष्ण पक्ष', month: 'फाल्गुन', date: '04 मार्च 2027', dateEn: '2027-03-04' },
  { name: 'आमलकी एकादशी (Amalaki Ekadashi)', paksha: 'शुक्ल पक्ष', month: 'फाल्गुन', date: '19 मार्च 2027', dateEn: '2027-03-19', highlight: true },
  { name: 'पापमोचिनी एकादशी (Papmochini)', paksha: 'कृष्ण पक्ष', month: 'चैत्र', date: '03 अप्रैल 2027', dateEn: '2027-04-03' },
  { name: 'कामदा एकादशी (Kamada Ekadashi)', paksha: 'शुक्ल पक्ष', month: 'चैत्र', date: '17 अप्रैल 2027', dateEn: '2027-04-17' },
  { name: 'वरूथिनी एकादशी (Varuthini Ekadashi)', paksha: 'कृष्ण पक्ष', month: 'वैशाख', date: '02 मई 2027', dateEn: '2027-05-02' },
  { name: 'मोहिनी एकादशी (Mohini Ekadashi)', paksha: 'शुक्ल पक्ष', month: 'वैशाख', date: '16 मई 2027', dateEn: '2027-05-16' },
  { name: 'अपरा एकादशी (Apara Ekadashi)', paksha: 'कृष्ण पक्ष', month: 'ज्येष्ठ', date: '31 मई 2027', dateEn: '2027-05-31' },
  { name: 'निर्जला एकादशी (Nirjala / भीमसेनी)', paksha: 'शुक्ल पक्ष', month: 'ज्येष्ठ', date: '15 जून 2027', dateEn: '2027-06-15', highlight: true },
  { name: 'योगिनी एकादशी (Yogini Ekadashi)', paksha: 'कृष्ण पक्ष', month: 'आषाढ़', date: '30 जून 2027', dateEn: '2027-06-30' },
  { name: 'देवशयनी एकादशी (Devshayani / चातुर्मास आरंभ)', paksha: 'शुक्ल पक्ष', month: 'आषाढ़', date: '15 जुलाई 2027', dateEn: '2027-07-15', highlight: true },
  { name: 'कामिका एकादशी (Kamika Ekadashi)', paksha: 'कृष्ण पक्ष', month: 'श्रावण', date: '29 जुलाई 2027', dateEn: '2027-07-29' },
  { name: 'श्रावण पुत्रदा एकादशी (Pavitropana)', paksha: 'शुक्ल पक्ष', month: 'श्रावण', date: '13 अगस्त 2027', dateEn: '2027-08-13' },
  { name: 'अजा एकादशी (Aja Ekadashi)', paksha: 'कृष्ण पक्ष', month: 'भाद्रपद', date: '28 अगस्त 2027', dateEn: '2027-08-28' },
  { name: 'परिवर्तिनी एकादशी (Parivartini / वामन जयंती)', paksha: 'शुक्ल पक्ष', month: 'भाद्रपद', date: '11 सितंबर 2027', dateEn: '2027-09-11', highlight: true },
  { name: 'इन्दिरा एकादशी (Indira Ekadashi / पितृ पक्ष)', paksha: 'कृष्ण पक्ष', month: 'अश्विन', date: '26 सितंबर 2027', dateEn: '2027-09-26' },
  { name: 'पापांकुशा एकादशी (Papankusha)', paksha: 'शुक्ल पक्ष', month: 'अश्विन', date: '11 अक्टूबर 2027', dateEn: '2027-10-11' },
  { name: 'रमा एकादशी (Rama Ekadashi)', paksha: 'कृष्ण पक्ष', month: 'कार्तिक', date: '26 अक्टूबर 2027', dateEn: '2027-10-26' },
  { name: 'देवउठनी एकादशी (Prabodhini / तुलसी विवाह)', paksha: 'शुक्ल पक्ष', month: 'कार्तिक', date: '09 नवंबर 2027', dateEn: '2027-11-09', highlight: true },
  { name: 'उत्पन्ना एकादशी (Utpanna Ekadashi 2027)', paksha: 'कृष्ण पक्ष', month: 'मार्गशीर्ष', date: '24 नवंबर 2027', dateEn: '2027-11-24' },
  { name: 'मोक्षदा एकादशी (Mokshada / गीता जयंती 2027)', paksha: 'शुक्ल पक्ष', month: 'मार्गशीर्ष', date: '09 दिसंबर 2027', dateEn: '2027-12-09', highlight: true },
  { name: 'सफला एकादशी (Saphala Ekadashi 2027)', paksha: 'कृष्ण पक्ष', month: 'पौष', date: '24 दिसंबर 2027', dateEn: '2027-12-24' },

  // 2028
  { name: 'पौष पुत्रदा एकादशी (Putrada Ekadashi 2028)', paksha: 'शुक्ल पक्ष', month: 'पौष', date: '07 जनवरी 2028', dateEn: '2028-01-07' },
  { name: 'षट्तिला एकादशी (Shattila Ekadashi 2028)', paksha: 'कृष्ण पक्ष', month: 'माघ', date: '22 जनवरी 2028', dateEn: '2028-01-22' },
  { name: 'जया एकादशी (Jaya Ekadashi 2028)', paksha: 'शुक्ल पक्ष', month: 'माघ', date: '06 फरवरी 2028', dateEn: '2028-02-06' },
  { name: 'विजया एकादशी (Vijaya Ekadashi 2028)', paksha: 'कृष्ण पक्ष', month: 'फाल्गुन', date: '21 फरवरी 2028', dateEn: '2028-02-21' },
  { name: 'आमलकी एकादशी (Amalaki Ekadashi 2028)', paksha: 'शुक्ल पक्ष', month: 'फाल्गुन', date: '06 मार्च 2028', dateEn: '2028-03-06', highlight: true },
  { name: 'पापमोचिनी एकादशी (Papmochini 2028)', paksha: 'कृष्ण पक्ष', month: 'चैत्र', date: '21 मार्च 2028', dateEn: '2028-03-21' },
  { name: 'कामदा एकादशी (Kamada Ekadashi 2028)', paksha: 'शुक्ल पक्ष', month: 'चैत्र', date: '05 अप्रैल 2028', dateEn: '2028-04-05' },
  { name: 'वरूथिनी एकादशी (Varuthini Ekadashi 2028)', paksha: 'कृष्ण पक्ष', month: 'वैशाख', date: '20 अप्रैल 2028', dateEn: '2028-04-20' },
  { name: 'मोहिनी एकादशी (Mohini Ekadashi 2028)', paksha: 'शुक्ल पक्ष', month: 'वैशाख', date: '05 मई 2028', dateEn: '2028-05-05' },
  { name: 'अपरा एकादशी (Apara Ekadashi 2028)', paksha: 'कृष्ण पक्ष', month: 'ज्येष्ठ', date: '20 मई 2028', dateEn: '2028-05-20' },
  { name: 'निर्जला एकादशी (Nirjala Ekadashi 2028)', paksha: 'शुक्ल पक्ष', month: 'ज्येष्ठ', date: '03 जून 2028', dateEn: '2028-06-03', highlight: true },
  { name: 'योगिनी एकादशी (Yogini Ekadashi 2028)', paksha: 'कृष्ण पक्ष', month: 'आषाढ़', date: '18 जून 2028', dateEn: '2028-06-18' },
  { name: 'देवशयनी एकादशी (Devshayani 2028)', paksha: 'शुक्ल पक्ष', month: 'आषाढ़', date: '03 जुलाई 2028', dateEn: '2028-07-03', highlight: true },
  { name: 'कामिका एकादशी (Kamika Ekadashi 2028)', paksha: 'कृष्ण पक्ष', month: 'श्रावण', date: '18 जुलाई 2028', dateEn: '2028-07-18' },
  { name: 'श्रावण पुत्रदा एकादशी (Pavitra 2028)', paksha: 'शुक्ल पक्ष', month: 'श्रावण', date: '01 अगस्त 2028', dateEn: '2028-08-01' },
  { name: 'अजा एकादशी (Aja Ekadashi 2028)', paksha: 'कृष्ण पक्ष', month: 'भाद्रपद', date: '16 अगस्त 2028', dateEn: '2028-08-16' },
  { name: 'परिवर्तिनी एकादशी (Parivartini 2028)', paksha: 'शुक्ल पक्ष', month: 'भाद्रपद', date: '30 अगस्त 2028', dateEn: '2028-08-30', highlight: true },
  { name: 'इन्दिरा एकादशी (Indira Ekadashi 2028)', paksha: 'कृष्ण पक्ष', month: 'अश्विन', date: '15 सितंबर 2028', dateEn: '2028-09-15' },
  { name: 'पापांकुशा एकादशी (Papankusha 2028)', paksha: 'शुक्ल पक्ष', month: 'अश्विन', date: '29 सितंबर 2028', dateEn: '2028-09-29' },
  { name: 'रमा एकादशी (Rama Ekadashi 2028)', paksha: 'कृष्ण पक्ष', month: 'कार्तिक', date: '14 अक्टूबर 2028', dateEn: '2028-10-14' },
  { name: 'देवउठनी एकादशी (Prabodhini 2028)', paksha: 'शुक्ल पक्ष', month: 'कार्तिक', date: '28 अक्टूबर 2028', dateEn: '2028-10-28', highlight: true },
  { name: 'उत्पन्ना एकादशी (Utpanna 2028)', paksha: 'कृष्ण पक्ष', month: 'मार्गशीर्ष', date: '13 नवंबर 2028', dateEn: '2028-11-13' },
  { name: 'मोक्षदा एकादशी (Mokshada / गीता जयंती 2028)', paksha: 'शुक्ल पक्ष', month: 'मार्गशीर्ष', date: '27 नवंबर 2028', dateEn: '2028-11-27', highlight: true },
  { name: 'सफला एकादशी (Saphala Ekadashi 2028)', paksha: 'कृष्ण पक्ष', month: 'पौष', date: '13 दिसंबर 2028', dateEn: '2028-12-13' },
  { name: 'पौष पुत्रदा एकादशी (Putrada 2028)', paksha: 'शुक्ल पक्ष', month: 'पौष', date: '27 दिसंबर 2028', dateEn: '2028-12-27' },
];
