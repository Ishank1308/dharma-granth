/**
 * Dharma Granth Educational Panchang Library
 * 
 * Philosophy:
 * This library computes Vedic astronomical parameters for educational discovery,
 * scriptural contextualization, and daily study cadence.
 * It is intentionally NOT an authoritative ritual calculator for sacramental rites,
 * temple consecrations (pratishtha), or strict muhūrtas, which require regional
 * ephemerides (Drik/Surya Siddhanta) and consultation with qualified traditional pandits.
 */

export interface LocationConfig {
  id: string;
  name: string;
  nameHi: string;
  region: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  timezone: string;
  utcOffsetHours: number;
  hasReliableCoordinates: boolean;
  notes?: string;
}

export const PRESET_LOCATIONS: LocationConfig[] = [
  {
    id: 'varanasi',
    name: 'Varanasi (Kashi)',
    nameHi: 'वाराणसी (काशी)',
    region: 'Uttar Pradesh',
    country: 'India',
    latitude: 25.3176,
    longitude: 82.9739,
    timezone: 'IST',
    utcOffsetHours: 5.5,
    hasReliableCoordinates: true,
    notes: 'Spiritual epicenter of Vedic learning on the sacred Ganga.',
  },
  {
    id: 'ujjain',
    name: 'Ujjain (Avanti)',
    nameHi: 'उज्जैन (अवन्तिका)',
    region: 'Madhya Pradesh',
    country: 'India',
    latitude: 23.1765,
    longitude: 75.7885,
    timezone: 'IST',
    utcOffsetHours: 5.5,
    hasReliableCoordinates: true,
    notes: 'Historical zero-meridian of classical Indian astronomy and Mahakaleshwar Jyotirlinga.',
  },
  {
    id: 'delhi',
    name: 'New Delhi',
    nameHi: 'नई दिल्ली',
    region: 'Delhi NCR',
    country: 'India',
    latitude: 28.6139,
    longitude: 77.209,
    timezone: 'IST',
    utcOffsetHours: 5.5,
    hasReliableCoordinates: true,
  },
  {
    id: 'haridwar',
    name: 'Haridwar',
    nameHi: 'हरिद्वार',
    region: 'Uttarakhand',
    country: 'India',
    latitude: 29.9457,
    longitude: 78.1642,
    timezone: 'IST',
    utcOffsetHours: 5.5,
    hasReliableCoordinates: true,
    notes: 'Gateway of the Gods at the foothills of the Himalayas.',
  },
  {
    id: 'tirupati',
    name: 'Tirupati',
    nameHi: 'तिरुपति',
    region: 'Andhra Pradesh',
    country: 'India',
    latitude: 13.6288,
    longitude: 79.4192,
    timezone: 'IST',
    utcOffsetHours: 5.5,
    hasReliableCoordinates: true,
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    nameHi: 'मुंबई',
    region: 'Maharashtra',
    country: 'India',
    latitude: 19.076,
    longitude: 72.8777,
    timezone: 'IST',
    utcOffsetHours: 5.5,
    hasReliableCoordinates: true,
  },
  {
    id: 'kolkata',
    name: 'Kolkata',
    nameHi: 'कोलकाता',
    region: 'West Bengal',
    country: 'India',
    latitude: 22.5726,
    longitude: 88.3639,
    timezone: 'IST',
    utcOffsetHours: 5.5,
    hasReliableCoordinates: true,
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    nameHi: 'बेंगलुरु',
    region: 'Karnataka',
    country: 'India',
    latitude: 12.9716,
    longitude: 77.5946,
    timezone: 'IST',
    utcOffsetHours: 5.5,
    hasReliableCoordinates: true,
  },
  {
    id: 'kathmandu',
    name: 'Kathmandu',
    nameHi: 'काठमांडू',
    region: 'Bagmati',
    country: 'Nepal',
    latitude: 27.7172,
    longitude: 85.324,
    timezone: 'NPT',
    utcOffsetHours: 5.75,
    hasReliableCoordinates: true,
    notes: 'Sacred valley of Pashupatinath.',
  },
  {
    id: 'london',
    name: 'London',
    nameHi: 'लंदन',
    region: 'England',
    country: 'United Kingdom',
    latitude: 51.5074,
    longitude: -0.1278,
    timezone: 'GMT/BST',
    utcOffsetHours: 0,
    hasReliableCoordinates: true,
  },
  {
    id: 'new_york',
    name: 'New York',
    nameHi: 'न्यूयॉर्क',
    region: 'NY',
    country: 'United States',
    latitude: 40.7128,
    longitude: -74.006,
    timezone: 'EST/EDT',
    utcOffsetHours: -5,
    hasReliableCoordinates: true,
  },
  {
    id: 'san_francisco',
    name: 'San Francisco',
    nameHi: 'सैन फ्रांसिस्को',
    region: 'CA',
    country: 'United States',
    latitude: 37.7749,
    longitude: -122.4194,
    timezone: 'PST/PDT',
    utcOffsetHours: -8,
    hasReliableCoordinates: true,
  },
  {
    id: 'singapore',
    name: 'Singapore',
    nameHi: 'सिंगापुर',
    region: 'Central',
    country: 'Singapore',
    latitude: 1.3521,
    longitude: 103.8198,
    timezone: 'SGT',
    utcOffsetHours: 8,
    hasReliableCoordinates: true,
  },
  {
    id: 'sydney',
    name: 'Sydney',
    nameHi: 'सिडनी',
    region: 'NSW',
    country: 'Australia',
    latitude: -33.8688,
    longitude: 151.2093,
    timezone: 'AEST',
    utcOffsetHours: 10,
    hasReliableCoordinates: true,
  },
  {
    id: 'unresolved_demo',
    name: 'Unspecified Global Location',
    nameHi: 'अनिर्दिष्ट वैश्विक स्थान',
    region: 'No verified coordinates',
    country: 'Global',
    latitude: null,
    longitude: null,
    timezone: 'UTC',
    utcOffsetHours: 0,
    hasReliableCoordinates: false,
    notes: 'Demonstrates graceful unavailable state for sunrise/sunset when exact coordinates are absent.',
  },
];

export interface TithiMeta {
  number: number;
  name: string;
  nameHi: string;
  transliteration: string;
  paksha: 'Shukla' | 'Krishna';
  explanation: string;
  spiritualFocus: string;
}

export const TITHI_DATA: Record<number, TithiMeta> = {
  1: {
    number: 1,
    name: 'Pratipada',
    nameHi: 'प्रतिपदा',
    transliteration: 'Pratipadā',
    paksha: 'Shukla',
    explanation: 'First lunar day of the waxing moon. Marks fresh beginnings, vow renewals, and foundational clarity.',
    spiritualFocus: 'Plant seeds of constructive intent; initiate sacred reading.',
  },
  2: {
    number: 2,
    name: 'Dvitiya',
    nameHi: 'द्वितीया',
    transliteration: 'Dvitīyā',
    paksha: 'Shukla',
    explanation: 'Second lunar day. Governed by Brahma / Vidhata; auspicious for foundational studies and steady growth.',
    spiritualFocus: 'Sustained study, harmonious speech, and building gentle momentum.',
  },
  3: {
    number: 3,
    name: 'Tritiya',
    nameHi: 'तृतीया',
    transliteration: 'Tṛtīyā',
    paksha: 'Shukla',
    explanation: 'Third lunar day. Associated with Gauri and resilience. Encourages balanced effort and perseverance.',
    spiritualFocus: 'Courage, creative expression, and devotion to svadharma.',
  },
  4: {
    number: 4,
    name: 'Chaturthi',
    nameHi: 'चतुर्थी',
    transliteration: 'Caturthī',
    paksha: 'Shukla',
    explanation: 'Fourth lunar day. Dedicated to Ganesha, remover of obstacles (vighnaharta).',
    spiritualFocus: 'Clearing mental hesitations, invoking discernment before study.',
  },
  5: {
    number: 5,
    name: 'Panchami',
    nameHi: 'पंचमी',
    transliteration: 'Pañcamī',
    paksha: 'Shukla',
    explanation: 'Fifth lunar day. Sacred to Saraswati, deity of wisdom, speech, and the fine arts.',
    spiritualFocus: 'Reverence for teachers, scripture chanting, and intellectual purity.',
  },
  6: {
    number: 6,
    name: 'Shashthi',
    nameHi: 'षष्ठी',
    transliteration: 'Ṣaṣṭhī',
    paksha: 'Shukla',
    explanation: 'Sixth lunar day. Sacred to Kartikeya (Skanda); emphasizes valor, discipline, and overcoming internal foes.',
    spiritualFocus: 'Disciplining the senses and steadying the wandering mind.',
  },
  7: {
    number: 7,
    name: 'Saptami',
    nameHi: 'सप्तमी',
    transliteration: 'Saptamī',
    paksha: 'Shukla',
    explanation: 'Seventh lunar day. Dedicated to Surya (the Sun); symbolizes illumination and vital energy.',
    spiritualFocus: 'Surya namaskara, Gayatri meditation, clarity of purpose.',
  },
  8: {
    number: 8,
    name: 'Ashtami',
    nameHi: 'अष्टमी',
    transliteration: 'Aṣṭamī',
    paksha: 'Shukla',
    explanation: 'Eighth lunar day. Sacred to Durga / Shiva; marks the half-moon turning point of focused power.',
    spiritualFocus: 'Inner fortitude, self-inquiry, overcoming lingering attachments.',
  },
  9: {
    number: 9,
    name: 'Navami',
    nameHi: 'नवमी',
    transliteration: 'Navamī',
    paksha: 'Shukla',
    explanation: 'Ninth lunar day. Associated with Sri Rama and victory of truth over delusion.',
    spiritualFocus: 'Commitment to righteous conduct, study of the Ramayana or Gita.',
  },
  10: {
    number: 10,
    name: 'Dashami',
    nameHi: 'दशमी',
    transliteration: 'Daśamī',
    paksha: 'Shukla',
    explanation: 'Tenth lunar day. Governed by Dharma; symbolizes victory over the ten senses (dasendriyas).',
    spiritualFocus: 'Mastery over outward wandering, grounded ethical living.',
  },
  11: {
    number: 11,
    name: 'Ekadashi',
    nameHi: 'एकादशी',
    transliteration: 'Ekādaśī',
    paksha: 'Shukla',
    explanation: 'Eleventh lunar day. Paramount day of fasting (vrata), sensory moderation, and meditation on Vishnu.',
    spiritualFocus: 'Dietary restraint, prolonged meditation, deep reading of Bhagavad Gita.',
  },
  12: {
    number: 12,
    name: 'Dwadashi',
    nameHi: 'द्वादशी',
    transliteration: 'Dvādaśī',
    paksha: 'Shukla',
    explanation: 'Twelfth lunar day. Concludes Ekadashi vrata with charity (dana) and respectful breakfast (parana).',
    spiritualFocus: 'Gratitude, service, and gentle integration of contemplative insight.',
  },
  13: {
    number: 13,
    name: 'Trayodashi',
    nameHi: 'त्रयोदशी',
    transliteration: 'Trayodaśī',
    paksha: 'Shukla',
    explanation: 'Thirteenth lunar day. Marked by Pradosha twilight contemplation dedicated to Shiva.',
    spiritualFocus: 'Twilight silence, japa, and dissolution of mental grief.',
  },
  14: {
    number: 14,
    name: 'Chaturdashi',
    nameHi: 'चतुर्दशी',
    transliteration: 'Caturdaśī',
    paksha: 'Shukla',
    explanation: 'Fourteenth lunar day. High energetic intensity preceding full illumination; associated with Shiva/Shakti.',
    spiritualFocus: 'Deep contemplation, purification, and honoring transient reality.',
  },
  15: {
    number: 15,
    name: 'Purnima',
    nameHi: 'पूर्णिमा',
    transliteration: 'Pūrṇimā',
    paksha: 'Shukla',
    explanation: 'Fifteenth lunar day — Full Moon. Symbol of completeness (purnatva), satya-narayana contemplation, and radiant clarity.',
    spiritualFocus: 'Meditating on the fullness of the Atman: "Purnamadah Purnamidam".',
  },
  16: {
    number: 16,
    name: 'Pratipada',
    nameHi: 'प्रतिपदा',
    transliteration: 'Pratipadā (Krishna)',
    paksha: 'Krishna',
    explanation: 'First day of the waning fortnight. Shift from outward expression to assimilation and review.',
    spiritualFocus: 'Digest what was learned; cultivate patient contentment.',
  },
  17: {
    number: 17,
    name: 'Dvitiya',
    nameHi: 'द्वितीया',
    transliteration: 'Dvitīyā (Krishna)',
    paksha: 'Krishna',
    explanation: 'Second day of the waning fortnight. Encourages steady inwardness and reflection.',
    spiritualFocus: 'Calm reading and strengthening daily habits.',
  },
  18: {
    number: 18,
    name: 'Tritiya',
    nameHi: 'तृतीया',
    transliteration: 'Tṛtīyā (Krishna)',
    paksha: 'Krishna',
    explanation: 'Third day of the waning fortnight. Fosters steadfastness and self-containment.',
    spiritualFocus: 'Quiet discipline and non-reactivity in speech.',
  },
  19: {
    number: 19,
    name: 'Chaturthi',
    nameHi: 'चतुर्थी',
    transliteration: 'Sankashti Caturthī',
    paksha: 'Krishna',
    explanation: 'Fourth day of the waning moon. Known as Sankashti Chaturthi; focused on overcoming distress.',
    spiritualFocus: 'Evening moon sighting and praying for resilience through trial.',
  },
  20: {
    number: 20,
    name: 'Panchami',
    nameHi: 'पंचमी',
    transliteration: 'Pañcamī (Krishna)',
    paksha: 'Krishna',
    explanation: 'Fifth day of the waning moon. Fosters mental clarity and respectful restraint.',
    spiritualFocus: 'Sanskrit recitation and gratitude for spiritual ancestors.',
  },
  21: {
    number: 21,
    name: 'Shashthi',
    nameHi: 'षष्ठी',
    transliteration: 'Ṣaṣṭhī (Krishna)',
    paksha: 'Krishna',
    explanation: 'Sixth day of the waning fortnight. Inner discipline and mindful action.',
    spiritualFocus: 'Simplicity, moderation in diet, and focus on essential duties.',
  },
  22: {
    number: 22,
    name: 'Saptami',
    nameHi: 'सप्तमी',
    transliteration: 'Saptamī (Krishna)',
    paksha: 'Krishna',
    explanation: 'Seventh day of the waning fortnight. Reminds the seeker of inner light during darkening nights.',
    spiritualFocus: 'Contemplation on the unmanifest witness within.',
  },
  23: {
    number: 23,
    name: 'Ashtami',
    nameHi: 'अष्टमी',
    transliteration: 'Kalashtami',
    paksha: 'Krishna',
    explanation: 'Eighth day of the waning fortnight. Often observed as Kalashtami (dedicated to Bhairava / time as transformer).',
    spiritualFocus: 'Confronting fear of change; recognizing impermanence of name and form.',
  },
  24: {
    number: 24,
    name: 'Navami',
    nameHi: 'नवमी',
    transliteration: 'Navamī (Krishna)',
    paksha: 'Krishna',
    explanation: 'Ninth day of the waning fortnight. Fosters humility and detachment from worldly pride.',
    spiritualFocus: 'Quiet charity and contemplation of selfless action.',
  },
  25: {
    number: 25,
    name: 'Dashami',
    nameHi: 'दशमी',
    transliteration: 'Daśamī (Krishna)',
    paksha: 'Krishna',
    explanation: 'Tenth day of the waning fortnight. Prepares body and mind for the solemnity of Krishna Ekadashi.',
    spiritualFocus: 'Simplifying sensory intake and purifying thoughts.',
  },
  26: {
    number: 26,
    name: 'Ekadashi',
    nameHi: 'एकादशी',
    transliteration: 'Krishna Ekādaśī',
    paksha: 'Krishna',
    explanation: 'Eleventh day of the waning fortnight. Powerful day of inward asceticism, stillness, and Vishnu remembrance.',
    spiritualFocus: 'Deep silent japa, fasting or light sattvic food, introspection.',
  },
  27: {
    number: 27,
    name: 'Dwadashi',
    nameHi: 'द्वादशी',
    transliteration: 'Dvādaśī (Krishna)',
    paksha: 'Krishna',
    explanation: 'Twelfth day of the waning fortnight. Gentle concluding reflection of the Ekadashi observance.',
    spiritualFocus: 'Peaceful dedication of the day’s deeds to the Supreme.',
  },
  28: {
    number: 28,
    name: 'Trayodashi',
    nameHi: 'त्रयोदशी',
    transliteration: 'Shani / Soma Pradosha',
    paksha: 'Krishna',
    explanation: 'Thirteenth day of the waning moon. Sacred Pradosha period preceding the darkest night.',
    spiritualFocus: 'Meditative stillness and seeking release from karmic bonds.',
  },
  29: {
    number: 29,
    name: 'Chaturdashi',
    nameHi: 'चतुर्दशी',
    transliteration: 'Masa Shivaratri',
    paksha: 'Krishna',
    explanation: 'Fourteenth day of the waning moon. Celebrated monthly as Masa Shivaratri; honors the transcendent silent consciousness.',
    spiritualFocus: 'Night vigil, meditation on Shiva as the eternal silent witness.',
  },
  30: {
    number: 30,
    name: 'Amavasya',
    nameHi: 'अमावस्या',
    transliteration: 'Amāvāsyā',
    paksha: 'Krishna',
    explanation: 'Thirtieth lunar day — New Moon. The Sun and Moon are aligned in the same degree. Sacred for pitru tarpana and deep stillness.',
    spiritualFocus: 'Honoring lineage and ancestors, silent meditation, letting go of egoic residue.',
  },
};

export interface UniqueTithi {
  slug: string;
  name: string;
  nameHi: string;
  transliteration: string;
  number: number;
  deity: string;
  deityHi: string;
  categoryType: 'Nanda' | 'Bhadra' | 'Jaya' | 'Rikta' | 'Poorna';
  categoryTypeHi: string;
  categoryMeaning: string;
  shuklaNumber?: number;
  krishnaNumber?: number;
  shuklaName?: string;
  krishnaName?: string;
  lunarDegrees: string;
  explanation: string;
  spiritualFocus: string;
  famousObservances: string[];
  dedicatedHubUrl?: string;
}

export const UNIQUE_TITHI_ARCHETYPES: UniqueTithi[] = [
  {
    slug: 'pratipada',
    name: 'Pratipada',
    nameHi: 'प्रतिपदा',
    transliteration: 'Pratipadā',
    number: 1,
    deity: 'Agni (Sacred Fire)',
    deityHi: 'अग्निदेव',
    categoryType: 'Nanda',
    categoryTypeHi: 'नन्दा (आनन्ददायिनी)',
    categoryMeaning: 'Joy-bestowing, foundational, and auspicious for new beginnings.',
    shuklaNumber: 1,
    krishnaNumber: 16,
    shuklaName: 'Shukla Pratipada (Beginning of Waxing Fortnight)',
    krishnaName: 'Krishna Pratipada (Beginning of Waning Fortnight)',
    lunarDegrees: '0° – 12° from the Sun',
    explanation: 'First lunar day. Governed by Agni, the cosmic carrier of prayers. It marks fresh beginnings, renewal of spiritual vows, and the planting of noble seeds in thought and action.',
    spiritualFocus: 'Plant seeds of constructive intent, light the sacred lamp, and initiate new study pathways.',
    famousObservances: ['Gudi Padwa (Chaitra Shukla Pratipada)', 'Navratri Ghatasthapana (Chaitra & Ashwin)', 'Govardhan Puja (Kartik Shukla Pratipada)'],
  },
  {
    slug: 'dvitiya',
    name: 'Dvitiya',
    nameHi: 'द्वितीया',
    transliteration: 'Dvitīyā',
    number: 2,
    deity: 'Brahma / Vidhata (The Creator)',
    deityHi: 'ब्रह्मा / विधाता',
    categoryType: 'Bhadra',
    categoryTypeHi: 'भद्रा (कल्याणकारी)',
    categoryMeaning: 'Auspicious, nurturing, and excellent for constructive enterprise.',
    shuklaNumber: 2,
    krishnaNumber: 17,
    shuklaName: 'Shukla Dvitiya',
    krishnaName: 'Krishna Dvitiya',
    lunarDegrees: '12° – 24° from the Sun',
    explanation: 'Second lunar day. Governed by Brahma, the architect of cosmic forms. Favors foundational study, architectural planning, and building steady harmonious relationships.',
    spiritualFocus: 'Sustained study, harmonious speech, and building gentle momentum in spiritual discipline.',
    famousObservances: ['Bhai Dooj / Yama Dvitiya (Kartik Shukla Dvitiya)', 'Chandra Darshana (New Moon Crescent Viewing)'],
  },
  {
    slug: 'tritiya',
    name: 'Tritiya',
    nameHi: 'तृतीया',
    transliteration: 'Tṛtīyā',
    number: 3,
    deity: 'Gauri / Shiva (Embodiment of Grace & Power)',
    deityHi: 'माता गौरी व शिव',
    categoryType: 'Jaya',
    categoryTypeHi: 'जया (विजयप्रदा)',
    categoryMeaning: 'Conferring victory, courage, and overcoming obstacles.',
    shuklaNumber: 3,
    krishnaNumber: 18,
    shuklaName: 'Shukla Tritiya',
    krishnaName: 'Krishna Tritiya',
    lunarDegrees: '24° – 36° from the Sun',
    explanation: 'Third lunar day. Associated with Gauri and marital fidelity, resilience, and creative strength. Encourages balanced effort, perseverance under trial, and unwavering dedication to one’s svadharma.',
    spiritualFocus: 'Courage, creative expression, and cultivating inner devotion to one’s righteous calling.',
    famousObservances: ['Akshaya Tritiya (Vaishakha Shukla Tritiya)', 'Hartalika Teej (Bhadrapada Shukla Tritiya)', 'Hariyali Teej (Shravana Shukla Tritiya)'],
  },
  {
    slug: 'chaturthi',
    name: 'Chaturthi',
    nameHi: 'चतुर्थी',
    transliteration: 'Caturthī',
    number: 4,
    deity: 'Ganesha (Lord of Wisdom & Obstacles)',
    deityHi: 'भगवान् श्री गणेश',
    categoryType: 'Rikta',
    categoryTypeHi: 'रिक्ता (रिक्त / शुद्धि)',
    categoryMeaning: 'Emptying, eliminating negativities, and breaking through stagnation.',
    shuklaNumber: 4,
    krishnaNumber: 19,
    shuklaName: 'Vinayaka Chaturthi (Waxing Fortnight)',
    krishnaName: 'Sankashti Chaturthi (Waning Fortnight)',
    lunarDegrees: '36° – 48° from the Sun',
    explanation: 'Fourth lunar day. Dedicated to Bhagavan Ganesha, the remover of all obstacles (Vighnaharta). A powerful day for clearing mental hesitations, resolving complex dilemmas, and invoking spiritual discernment.',
    spiritualFocus: 'Overcoming mental obstacles, fasting until moonrise on Sankashti, and chanting the Ganesha Atharvashirsha.',
    famousObservances: ['Ganesh Chaturthi (Bhadrapada Shukla Chaturthi)', 'Monthly Sankashti Chaturthi (Fasting until Moonrise)', 'Monthly Vinayaka Chaturthi'],
  },
  {
    slug: 'panchami',
    name: 'Panchami',
    nameHi: 'पंचमी',
    transliteration: 'Pañcamī',
    number: 5,
    deity: 'Saraswati & Nagas (Wisdom & Primordial Energies)',
    deityHi: 'देवी सरस्वती एवं नागदेव',
    categoryType: 'Poorna',
    categoryTypeHi: 'पूर्णा (परिपूर्णता)',
    categoryMeaning: 'Fullness, spiritual abundance, and complete fulfillment of intentions.',
    shuklaNumber: 5,
    krishnaNumber: 20,
    shuklaName: 'Shukla Panchami',
    krishnaName: 'Krishna Panchami',
    lunarDegrees: '48° – 60° from the Sun',
    explanation: 'Fifth lunar day. Sacred to Devi Saraswati and the serpent energies (Nagas). Marks the expansion of knowledge, creative arts, and intellectual purity.',
    spiritualFocus: 'Reverence for spiritual teachers, scripture chanting, fine arts practice, and cultivation of calm clarity.',
    famousObservances: ['Vasant Panchami / Saraswati Puja (Magha Shukla Panchami)', 'Nag Panchami (Shravana Shukla Panchami)', 'Rishi Panchami (Bhadrapada Shukla Panchami)'],
  },
  {
    slug: 'shashthi',
    name: 'Shashthi',
    nameHi: 'षष्ठी',
    transliteration: 'Ṣaṣṭhī',
    number: 6,
    deity: 'Kartikeya / Skanda (Commander of Divine Forces)',
    deityHi: 'भगवान् कार्तिकेय (स्कन्द)',
    categoryType: 'Nanda',
    categoryTypeHi: 'नन्दा (आनन्ददायिनी)',
    categoryMeaning: 'Joy-giving, valorous, and strengthening spiritual discipline.',
    shuklaNumber: 6,
    krishnaNumber: 21,
    shuklaName: 'Shukla Shashthi',
    krishnaName: 'Krishna Shashthi',
    lunarDegrees: '60° – 72° from the Sun',
    explanation: 'Sixth lunar day. Sacred to Lord Kartikeya (Murugan). Emphasizes valor, self-discipline, and conquering internal enemies (shad-ripu: lust, anger, greed, delusion, pride, envy).',
    spiritualFocus: 'Disciplining the senses, fasting for health, and steadying the mind through focused meditation.',
    famousObservances: ['Skanda Sashti / Soorasamharam', 'Chhath Puja Surya Shashthi (Kartik Shukla Shashthi)', 'Sheetala Shashthi'],
  },
  {
    slug: 'saptami',
    name: 'Saptami',
    nameHi: 'सप्तमी',
    transliteration: 'Saptamī',
    number: 7,
    deity: 'Surya (The Supreme Sun / Savita)',
    deityHi: 'भगवान् सूर्य नारायण',
    categoryType: 'Bhadra',
    categoryTypeHi: 'भद्रा (कल्याणकारी)',
    categoryMeaning: 'Auspicious, luminous, and radiant with health and vitality.',
    shuklaNumber: 7,
    krishnaNumber: 22,
    shuklaName: 'Shukla Saptami',
    krishnaName: 'Krishna Saptami',
    lunarDegrees: '72° – 84° from the Sun',
    explanation: 'Seventh lunar day. Dedicated to Lord Surya, the giver of health, life, and spiritual illumination. Symbolizes vital energy and awakening of the higher intellect.',
    spiritualFocus: 'Surya namaskara at sunrise, recitation of the Aditya Hridaya Stotra and Gayatri Mantra.',
    famousObservances: ['Ratha Saptami / Surya Jayanti (Magha Shukla Saptami)', 'Bhanu Saptami (Saptami falling on Sunday)'],
  },
  {
    slug: 'ashtami',
    name: 'Ashtami',
    nameHi: 'अष्टमी',
    transliteration: 'Aṣṭamī',
    number: 8,
    deity: 'Durga, Shiva & Bhairava (Cosmic Transformation)',
    deityHi: 'माँ दुर्गा एवं भगवान् शिव',
    categoryType: 'Jaya',
    categoryTypeHi: 'जया (विजयप्रदा)',
    categoryMeaning: 'Victorious, intense, and breaking through deep karmic bonds.',
    shuklaNumber: 8,
    krishnaNumber: 23,
    shuklaName: 'Durga Ashtami (Waxing Half-Moon)',
    krishnaName: 'Kalashtami / Janmashtami (Waning Half-Moon)',
    lunarDegrees: '84° – 96° from the Sun',
    explanation: 'Eighth lunar day. Represents the exact half-moon turning point where solar and lunar gravitational pulls create unique psychological focus. Revered for worship of Mother Durga and Lord Shiva.',
    spiritualFocus: 'Inner fortitude, self-inquiry, overcoming lingering attachments, and fasting for spiritual strength.',
    famousObservances: ['Krishna Janmashtami (Bhadrapada Krishna Ashtami)', 'Maha Ashtami / Durga Puja (Ashwin Shukla Ashtami)', 'Kalashtami (Monthly Krishna Ashtami)'],
  },
  {
    slug: 'navami',
    name: 'Navami',
    nameHi: 'नवमी',
    transliteration: 'Navamī',
    number: 9,
    deity: 'Sri Rama & Devi Durga (Upholders of Dharma)',
    deityHi: 'भगवान् श्रीराम एवं माँ दुर्गा',
    categoryType: 'Rikta',
    categoryTypeHi: 'रिक्ता (रिक्त / शुद्धि)',
    categoryMeaning: 'Transformative, clearing obstacles, and crowning righteous struggle with victory.',
    shuklaNumber: 9,
    krishnaNumber: 24,
    shuklaName: 'Shukla Navami',
    krishnaName: 'Krishna Navami',
    lunarDegrees: '96° – 108° from the Sun',
    explanation: 'Ninth lunar day. Associated with the descent of Sri Rama and the triumph of cosmic righteousness over adharma. The culmination of the nine nights of Navratri.',
    spiritualFocus: 'Commitment to righteous conduct, study of the Valmiki Ramayana, and introspection on integrity.',
    famousObservances: ['Ram Navami (Chaitra Shukla Navami)', 'Maha Navami / Kanya Pujan (Ashwin Shukla Navami)', 'Akshaya Navami / Amla Navami'],
  },
  {
    slug: 'dashami',
    name: 'Dashami',
    nameHi: 'दशमी',
    transliteration: 'Daśamī',
    number: 10,
    deity: 'Yama / Dharmaraja (Upholder of Moral Law)',
    deityHi: 'धर्मराज यम',
    categoryType: 'Poorna',
    categoryTypeHi: 'पूर्णा (परिपूर्णता)',
    categoryMeaning: 'Complete, victorious, and establishing enduring peace.',
    shuklaNumber: 10,
    krishnaNumber: 25,
    shuklaName: 'Shukla Dashami',
    krishnaName: 'Krishna Dashami',
    lunarDegrees: '108° – 120° from the Sun',
    explanation: 'Tenth lunar day. Represents the perfection of moral order and victory over inner demons. The day of Vijaya Dashami (Dussehra), celebrating the victory of light over ignorance.',
    spiritualFocus: 'Contemplation of moral accountability, resolving disputes, and renewing noble commitments.',
    famousObservances: ['Vijaya Dashami / Dussehra (Ashwin Shukla Dashami)', 'Ganga Dussehra (Jyeshtha Shukla Dashami)'],
  },
  {
    slug: 'ekadashi',
    name: 'Ekadashi',
    nameHi: 'एकादशी',
    transliteration: 'Ekādaśī',
    number: 11,
    deity: 'Vishnu (The Supreme Sustainer)',
    deityHi: 'भगवान् श्री हरि विष्णु',
    categoryType: 'Nanda',
    categoryTypeHi: 'नन्दा (आनन्ददायिनी)',
    categoryMeaning: 'Bliss-giving, purifying, and the crown jewel of lunar fasting.',
    shuklaNumber: 11,
    krishnaNumber: 26,
    shuklaName: 'Shukla Ekadashi',
    krishnaName: 'Krishna Ekadashi',
    lunarDegrees: '120° – 132° from the Sun',
    explanation: 'Eleventh lunar day. Sacred to Lord Vishnu and revered as Hari-vasara. The eleventh day corresponds to the eleven senses (five sense organs, five action organs, and the mind). Fasting purifies mind and body.',
    spiritualFocus: 'Total or partial fasting, avoidance of grains, contemplation of the Bhagavad Gita, and silent japa.',
    famousObservances: ['Nirjala Ekadashi', 'Mokshada Ekadashi (Gita Jayanti)', 'Devshayani Ekadashi', 'Devutthana Ekadashi'],
    dedicatedHubUrl: '/panchang/ekadashi/',
  },
  {
    slug: 'dvadashi',
    name: 'Dvadashi',
    nameHi: 'द्वादशी',
    transliteration: 'Dvādaśī',
    number: 12,
    deity: 'Vishnu (Bountiful Giver of Fruits)',
    deityHi: 'भगवान् श्री विष्णु',
    categoryType: 'Bhadra',
    categoryTypeHi: 'भद्रा (कल्याणकारी)',
    categoryMeaning: 'Auspicious, nourishing, and ideal for charity and celebration.',
    shuklaNumber: 12,
    krishnaNumber: 27,
    shuklaName: 'Shukla Dvadashi',
    krishnaName: 'Krishna Dvadashi',
    lunarDegrees: '132° – 144° from the Sun',
    explanation: 'Twelfth lunar day. Dedicated to opening the Ekadashi fast (Parana). Emphasizes generosity, feeding the hungry, offering charity (dana), and expressing gratitude for spiritual sustenance.',
    spiritualFocus: 'Mindful breaking of the fast (Parana) after sunrise, feeding others, and giving thanks.',
    famousObservances: ['Tulsi Vivah (Kartik Shukla Dvadashi)', 'Govatsa Dvadashi (Kartik Krishna Dvadashi)', 'Vamana Dvadashi'],
  },
  {
    slug: 'trayodashi',
    name: 'Trayodashi',
    nameHi: 'त्रयोदशी',
    transliteration: 'Trayodaśī',
    number: 13,
    deity: 'Kamadeva & Shiva (Lord of Auspicious Twilight)',
    deityHi: 'भगवान् शिव एवं कामदेव',
    categoryType: 'Jaya',
    categoryTypeHi: 'जया (विजयप्रदा)',
    categoryMeaning: 'Victorious, dissolving sorrows, and deeply meditative.',
    shuklaNumber: 13,
    krishnaNumber: 28,
    shuklaName: 'Shukla Trayodashi',
    krishnaName: 'Krishna Trayodashi',
    lunarDegrees: '144° – 156° from the Sun',
    explanation: 'Thirteenth lunar day. The twilight period (Sandhya) of Trayodashi is celebrated twice a month as Pradosha Vrata, when Lord Shiva is believed to perform the cosmic dance of dissolution and grace.',
    spiritualFocus: 'Pradosha twilight meditation, chanting of the Shiva Tandava Stotram or Maha Mrityunjaya Mantra.',
    famousObservances: ['Monthly Pradosh Vrat (Som, Bhaum, and Shani Pradosha)', 'Dhanteras / Dhantrayodashi (Kartik Krishna Trayodashi)'],
    dedicatedHubUrl: '/panchang/pradosh/',
  },
  {
    slug: 'chaturdashi',
    name: 'Chaturdashi',
    nameHi: 'चतुर्दशी',
    transliteration: 'Caturdaśī',
    number: 14,
    deity: 'Shiva / Rudra (Transcendent Dissolver of Illusion)',
    deityHi: 'भगवान् शिव (रुद्र)',
    categoryType: 'Rikta',
    categoryTypeHi: 'रिक्ता (रिक्त / शुद्धि)',
    categoryMeaning: 'Dissolving, deep stillness, and preparing for the new cycle.',
    shuklaNumber: 14,
    krishnaNumber: 29,
    shuklaName: 'Shukla Chaturdashi',
    krishnaName: 'Masa Shivaratri (Krishna Chaturdashi)',
    lunarDegrees: '156° – 168° from the Sun',
    explanation: 'Fourteenth lunar day. Governed by Rudra (Shiva). The fourteenth day of the waning moon (Krishna Chaturdashi) is observed monthly as Masa Shivaratri, honoring the transcendent silent consciousness.',
    spiritualFocus: 'Night vigil, meditation on Shiva as the eternal witness, and letting go of egoic residue.',
    famousObservances: ['Maha Shivaratri (Phalguna Krishna Chaturdashi)', 'Narak Chaturdashi / Choti Diwali (Kartik Krishna Chaturdashi)', 'Anant Chaturdashi (Bhadrapada Shukla Chaturdashi)'],
  },
  {
    slug: 'purnima',
    name: 'Purnima',
    nameHi: 'पूर्णिमा',
    transliteration: 'Pūrṇimā',
    number: 15,
    deity: 'Chandra & Satyanarayana (Fullness of Light)',
    deityHi: 'चन्द्रदेव एवं भगवान् सत्यनारायण',
    categoryType: 'Poorna',
    categoryTypeHi: 'पूर्णा (परिपूर्णता)',
    categoryMeaning: 'Supreme fullness, illumination, and spiritual fulfillment.',
    shuklaNumber: 15,
    krishnaNumber: undefined,
    shuklaName: 'Purnima (Full Moon Day)',
    krishnaName: undefined,
    lunarDegrees: '168° – 180° from the Sun (Exact Opposition)',
    explanation: 'Fifteenth lunar day — Full Moon. The Sun and Moon face each other across the sky in exact 180-degree opposition. The earth is bathed in complete lunar radiance. Sacred for Satyanarayana Vrata and honoring spiritual masters.',
    spiritualFocus: 'Silent meditation under moonlight, Satyanarayana Katha recitation, gratitude for the guru lineage.',
    famousObservances: ['Guru Purnima (Ashadha Purnima)', 'Sharad Purnima (Ashwin Purnima)', 'Kartik Purnima / Dev Diwali', 'Buddha Purnima'],
    dedicatedHubUrl: '/panchang/purnima/',
  },
  {
    slug: 'amavasya',
    name: 'Amavasya',
    nameHi: 'अमावस्या',
    transliteration: 'Amāvāsyā',
    number: 16,
    deity: 'Pitrus (Ancestors & Lineage Consciousness)',
    deityHi: 'पितृगण',
    categoryType: 'Poorna',
    categoryTypeHi: 'पूर्णा / पितृ-तिथि',
    categoryMeaning: 'Conjunction of lights, deep introspection, and ancestral gratitude.',
    shuklaNumber: undefined,
    krishnaNumber: 30,
    shuklaName: undefined,
    krishnaName: 'Amavasya (New Moon Day)',
    lunarDegrees: '348° – 360° (0°) from the Sun (Exact Conjunction)',
    explanation: 'Thirtieth lunar day — New Moon. The Sun and Moon are aligned in the same celestial degree. Marks the complete merging of conscious will and subconscious mind. Sacred for ancestral tarpana and inner stillness.',
    spiritualFocus: 'Honoring lineage and ancestors (tarpana), silent meditation, charity to the needy, and releasing ego.',
    famousObservances: ['Diwali Lakshmi Puja (Kartik Amavasya)', 'Somvati Amavasya (Amavasya falling on Monday)', 'Mauni Amavasya (Magha Amavasya)', 'Mahalaya Amavasya (Pitru Paksha)'],
    dedicatedHubUrl: '/panchang/amavasya/',
  },
];

export function getUniqueTithiBySlug(slug: string): UniqueTithi | undefined {
  const clean = slug.toLowerCase().trim();
  return UNIQUE_TITHI_ARCHETYPES.find((t) => t.slug === clean);
}

export function getAllUniqueTithis(): UniqueTithi[] {
  return UNIQUE_TITHI_ARCHETYPES;
}

export interface NakshatraMeta {
  index: number;
  name: string;
  nameHi: string;
  transliteration: string;
  deity: string;
  rulingPlanet: string;
  symbol: string;
  explanation: string;
  studyTheme: string;
  rashiSpan?: string;
  rashiSpanHi?: string;
  vedicCitation?: string;
}

export const NAKSHATRA_DATA: NakshatraMeta[] = [
  {
    index: 0,
    name: 'Ashwini',
    nameHi: 'अश्विनी',
    transliteration: 'Aśvinī',
    deity: 'Ashvins (Celestial Healers)',
    rulingPlanet: 'Ketu',
    symbol: "Horse's head",
    explanation: 'First asterism of the zodiac. Symbolizes swift healing, swift initiative, and luminous dawn energy.',
    studyTheme: 'Beginning new scripture pathways with clean vigor and mental agility.',
  },
  {
    index: 1,
    name: 'Bharani',
    nameHi: 'भरणी',
    transliteration: 'Bharaṇī',
    deity: 'Yama (Lord of Dharma & Transition)',
    rulingPlanet: 'Venus',
    symbol: 'Yoni / Vessel of gestation',
    explanation: 'Governs endurance, transformation, and taking responsibility for inner seeds.',
    studyTheme: 'Contemplating karma, moral accountability, and patience under pressure.',
  },
  {
    index: 2,
    name: 'Krittika',
    nameHi: 'कृत्तिका',
    transliteration: 'Kṛttikā',
    deity: 'Agni (Sacred Fire)',
    rulingPlanet: 'Sun',
    symbol: 'Razor / Flame',
    explanation: 'Associated with spiritual fire (tapas) and sharp discrimination (viveka) that burns away ignorance.',
    studyTheme: 'Cultivating viveka — discerning the permanent from the fleeting.',
  },
  {
    index: 3,
    name: 'Rohini',
    nameHi: 'रोहिणी',
    transliteration: 'Rohiṇī',
    deity: 'Brahma / Prajapati (Creator)',
    rulingPlanet: 'Moon',
    symbol: 'Cart / Chariot / Temple',
    explanation: 'Associated with growth, beauty, fertile creativity, and devotional absorption (birth star of Sri Krishna).',
    studyTheme: 'Appreciating the beauty of divine creation and cultivating warm bhakti.',
  },
  {
    index: 4,
    name: 'Mrigashira',
    nameHi: 'मृगशिरा',
    transliteration: 'Mṛgaśīrṣā',
    deity: 'Soma (The Lunar Nectar)',
    rulingPlanet: 'Mars',
    symbol: "Deer's head",
    explanation: 'The seeking star. Reflects gentle curiosity, philosophical questioning, and spiritual pilgrimage.',
    studyTheme: 'Asking profound questions in scripture study: "Who am I? What is truth?"',
  },
  {
    index: 5,
    name: 'Ardra',
    nameHi: 'आर्द्रा',
    transliteration: 'Ārdrā',
    deity: 'Rudra (Storm God / Transformer)',
    rulingPlanet: 'Rahu',
    symbol: 'Teardrop / Jewel',
    explanation: 'Represents the purifying storm that washes away accumulated dust and awakens tenderness.',
    studyTheme: 'Transforming sorrow into compassion; seeking the refuge of the eternal.',
  },
  {
    index: 6,
    name: 'Punarvasu',
    nameHi: 'पुनर्वसु',
    transliteration: 'Punarvasu',
    deity: 'Aditi (Mother of the Gods)',
    rulingPlanet: 'Jupiter',
    symbol: 'Bow and Quiver',
    explanation: 'Return of the light. Symbolizes renewal of safety, home, forgiveness, and moral clarity (birth star of Sri Rama).',
    studyTheme: 'Re-aligning with ethical dharma and returning home to inner peace.',
  },
  {
    index: 7,
    name: 'Pushya',
    nameHi: 'पुष्य',
    transliteration: 'Puṣya',
    deity: 'Brihaspati (Guru of the Devas)',
    rulingPlanet: 'Saturn',
    symbol: "Cow's udder / Lotus / Circle",
    explanation: 'Considered the most nourishing and spiritually fertile nakshatra in the entire zodiac.',
    studyTheme: 'Immersing in deep scriptural study, honoring the Guru, meditating on wisdom.',
  },
  {
    index: 8,
    name: 'Ashlesha',
    nameHi: 'आश्लेषा',
    transliteration: 'Āśleṣā',
    deity: 'Nagas (Serpent Wisdom)',
    rulingPlanet: 'Mercury',
    symbol: 'Coiled Serpent',
    explanation: 'Governs kundalini energy, subtle psychology, and understanding hidden motives.',
    studyTheme: 'Observing subtle mental movements and practicing deep self-honesty.',
  },
  {
    index: 9,
    name: 'Magha',
    nameHi: 'मघा',
    transliteration: 'Maghā',
    deity: 'Pitris (Ancestral Spirits)',
    rulingPlanet: 'Ketu',
    symbol: 'Royal Throne Room',
    explanation: 'Ties to lineage, tradition, noble character, and gratitude for forebears who transmitted sacred lore.',
    studyTheme: 'Gratitude to rishis and teachers who preserved our scriptures.',
  },
  {
    index: 10,
    name: 'Purva Phalguni',
    nameHi: 'पूर्व फाल्गुनी',
    transliteration: 'Pūrva Phālgunī',
    deity: 'Bhaga (Deity of Delight)',
    rulingPlanet: 'Venus',
    symbol: 'Front legs of bed / Hammock',
    explanation: 'Signifies joyous creative leisure, gracious hospitality, and celebrating life’s blessings.',
    studyTheme: 'Discovering joy (ananda) in devotion rather than dry mechanical duty.',
  },
  {
    index: 11,
    name: 'Uttara Phalguni',
    nameHi: 'उत्तर फाल्गुनी',
    transliteration: 'Uttara Phālgunī',
    deity: 'Aryaman (Deity of Friendship & Honor)',
    rulingPlanet: 'Sun',
    symbol: 'Back legs of bed',
    explanation: 'Governs noble companionship, social responsibility, integrity, and lifelong covenants.',
    studyTheme: 'Cultivating noble friendship (satsanga) and supporting fellow seekers.',
  },
  {
    index: 12,
    name: 'Hasta',
    nameHi: 'हस्त',
    transliteration: 'Hasta',
    deity: 'Savitr (Solar Initiator)',
    rulingPlanet: 'Moon',
    symbol: 'Open Hand / Fist',
    explanation: 'The star of skill and dexterity. Reflects craftsmanship, healing touch, and selfless service.',
    studyTheme: 'Karma yoga: offering the work of one’s hands as sacred seva.',
  },
  {
    index: 13,
    name: 'Chitra',
    nameHi: 'चित्रा',
    transliteration: 'Citrā',
    deity: 'Tvashtar (Divine Architect / Vishvakarma)',
    rulingPlanet: 'Mars',
    symbol: 'Bright Gem / Pearl',
    explanation: 'The brilliant jewel star. Signifies aesthetic brilliance, clarity of form, and luminous architecture.',
    studyTheme: 'Contemplating the divine order (Rita) embedded in cosmos and consciousness.',
  },
  {
    index: 14,
    name: 'Swati',
    nameHi: 'स्वाती',
    transliteration: 'Svātī',
    deity: 'Vayu (Wind / Breath)',
    rulingPlanet: 'Rahu',
    symbol: 'Young plant shoot bending in wind',
    explanation: 'Symbolizes flexibility, independence, and the vital breath (prana) that bends without breaking.',
    studyTheme: 'Pranayama and quiet meditation on the inner breath of life.',
  },
  {
    index: 15,
    name: 'Vishakha',
    nameHi: 'विशाखा',
    transliteration: 'Viśākhā',
    deity: 'Indra & Agni',
    rulingPlanet: 'Jupiter',
    symbol: 'Triumphal Arch / Potter’s Wheel',
    explanation: 'Focus, resolute determination, and unwavering commitment to reach a spiritual summit.',
    studyTheme: 'Single-pointed devotion (ekagrata) in reading and japa.',
  },
  {
    index: 16,
    name: 'Anuradha',
    nameHi: 'अनुराधा',
    transliteration: 'Anurādhā',
    deity: 'Mitra (Deity of Universal Harmony)',
    rulingPlanet: 'Saturn',
    symbol: 'Lotus / Staff',
    explanation: 'Devotional friendship, soft-hearted loyalty, and blossoming even from difficult muddy waters.',
    studyTheme: 'The power of soft-spoken compassion and steady devotional commitment.',
  },
  {
    index: 17,
    name: 'Jyeshtha',
    nameHi: 'ज्येष्ठा',
    transliteration: 'Jyeṣṭhā',
    deity: 'Indra (King of Devas)',
    rulingPlanet: 'Mercury',
    symbol: 'Circular Amulet / Talisman',
    explanation: 'Eldership, guardianship, inner seniority, and shielding weaker beings with moral fortitude.',
    studyTheme: 'Assuming spiritual responsibility for one’s household and community.',
  },
  {
    index: 18,
    name: 'Mula',
    nameHi: 'मूल',
    transliteration: 'Mūla',
    deity: 'Nirriti (Dissolution / Root)',
    rulingPlanet: 'Ketu',
    symbol: 'Tied bundle of roots',
    explanation: 'Getting to the root of existence. Removing illusions and probing foundational philosophical inquiries.',
    studyTheme: 'Upanishadic inquiry: tracing all appearances back to the non-dual Brahman.',
  },
  {
    index: 19,
    name: 'Purva Ashadha',
    nameHi: 'पूर्वाषाढ़ा',
    transliteration: 'Pūrvāṣāḍhā',
    deity: 'Apas (Cosmic Waters)',
    rulingPlanet: 'Venus',
    symbol: "Elephant's tusk / Winnowing basket",
    explanation: 'The invincible waters. Reflects moral purification, invincibility through truth, and patient nourishment.',
    studyTheme: 'Purifying the mental lake (chitta) with scriptural contemplation.',
  },
  {
    index: 20,
    name: 'Uttara Ashadha',
    nameHi: 'उत्तराषाढ़ा',
    transliteration: 'Uttarāṣāḍhā',
    deity: 'Vishwadevas (Universal Virtues)',
    rulingPlanet: 'Sun',
    symbol: 'Small cot / Elephant tusk',
    explanation: 'Final victory of virtue. Rooted in endurance, universal duty, and non-sectarian righteousness.',
    studyTheme: 'Reflecting on universal Vedic values that unite all living beings.',
  },
  {
    index: 21,
    name: 'Shravana',
    nameHi: 'श्रवण',
    transliteration: 'Śravaṇa',
    deity: 'Vishnu (Preserver of the Universe)',
    rulingPlanet: 'Moon',
    symbol: 'Three footprints / Ear',
    explanation: 'The star of attentive listening. Governs the primary spiritual limb of shravana (hearing the wisdom).',
    studyTheme: 'Sacred listening: hearing the Gita or Upanishads with complete inner quietude.',
  },
  {
    index: 22,
    name: 'Dhanishta',
    nameHi: 'धनिष्ठा',
    transliteration: 'Dhaniṣṭhā',
    deity: 'Ashta Vasus (Eight Gods of Abundance)',
    rulingPlanet: 'Mars',
    symbol: 'Drum (Damaru) / Flute',
    explanation: 'Rhythm, musical harmony, cosmic resonance, and generous distribution of wealth.',
    studyTheme: 'Chanting stotras with meter and feeling the cosmic rhythm of the universe.',
  },
  {
    index: 23,
    name: 'Shatabhisha',
    nameHi: 'शतभिषा',
    transliteration: 'Śatabhiṣā',
    deity: 'Varuna (Guardian of Cosmic Order)',
    rulingPlanet: 'Rahu',
    symbol: 'Empty circle / Hundred healers',
    explanation: 'The hundred physicians. Solitude, contemplation of vast cosmic mysteries, and profound healing.',
    studyTheme: 'Solitary reflection, stepping back from sensory noise, finding inner wholeness.',
  },
  {
    index: 24,
    name: 'Purva Bhadrapada',
    nameHi: 'पूर्व भाद्रपद',
    transliteration: 'Pūrva Bhādrapadā',
    deity: 'Aja Ekapada (The Unborn One-Footed)',
    rulingPlanet: 'Jupiter',
    symbol: 'Front of funeral cot / Two-faced man',
    explanation: 'Ascetic fire, deep seriousness regarding liberation, and shedding identification with the body.',
    studyTheme: 'Contemplating Vairagya (dispassion) as taught in Vivekachudamani and Gita.',
  },
  {
    index: 25,
    name: 'Uttara Bhadrapada',
    nameHi: 'उत्तर भाद्रपद',
    transliteration: 'Uttara Bhādrapadā',
    deity: 'Ahirbudhnya (Serpent of the Depths)',
    rulingPlanet: 'Saturn',
    symbol: 'Back of funeral cot / Twin serpents',
    explanation: 'Quiet wisdom of the ocean depths. Equanimity, patience, benevolence, and meditative stability.',
    studyTheme: 'Developing steady wisdom (sthitaprajna): remaining undisturbed in praise or blame.',
  },
  {
    index: 26,
    name: 'Revati',
    nameHi: 'रेवती',
    transliteration: 'Revatī',
    deity: 'Pushan (Nourisher of Travelers)',
    rulingPlanet: 'Mercury',
    symbol: 'Pair of fish / Drum',
    explanation: 'The final star of the zodiac. Represents safe crossing of the ocean of samsara (tarana), gentle nourishment.',
    studyTheme: 'Universal prayer for the peace of all creatures: "Sarve Bhavantu Sukhinah".',
  },
];

export function nakshatraSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-');
}

export function getNakshatraBySlug(slug: string): NakshatraMeta | undefined {
  const clean = slug.toLowerCase().trim();
  return NAKSHATRA_DATA.find((n) => nakshatraSlug(n.name) === clean);
}

export interface YogaMeta {
  index: number;
  slug: string;
  name: string;
  nameHi: string;
  transliteration: string;
  nature: 'Auspicious' | 'Neutral' | 'Challenging / Reflective';
  natureHi: string;
  deity: string;
  deityHi: string;
  arc: string;
  explanation: string;
  spiritualFocus: string;
}

export const YOGA_DATA: YogaMeta[] = [
  {
    index: 0,
    slug: 'vishkambha',
    name: 'Vishkambha',
    nameHi: 'विष्कम्भ',
    transliteration: 'Viṣkambha',
    nature: 'Challenging / Reflective',
    natureHi: 'संयमी / विचारणीय',
    deity: 'Yama (God of Righteous Duty & Time)',
    deityHi: 'यमराज / धर्मराज',
    arc: "0°00' – 13°20'",
    explanation: 'First Nitya Yoga. Means "Pillar" or "Support". Represents establishing deep roots and foundational resolve before outer action.',
    spiritualFocus: 'Cultivate inner endurance, ground the intellect in fundamental principles, and avoid hasty worldly beginnings.',
  },
  {
    index: 1,
    slug: 'priti',
    name: 'Priti',
    nameHi: 'प्रीति',
    transliteration: 'Prīti',
    nature: 'Auspicious',
    natureHi: 'शुभ व आनन्ददायक',
    deity: 'Vishnu (The Preserver & Embodiment of Love)',
    deityHi: 'भगवान् विष्णु',
    arc: "13°20' – 26°40'",
    explanation: 'Second Nitya Yoga. Means "Affection" and "Joy". Fosters harmonious communication, loving relationships, and devotional warmth.',
    spiritualFocus: 'Practice loving-kindness (maitri), harmonious speech, and devotional meditation on Sri Hari Vishnu.',
  },
  {
    index: 2,
    slug: 'ayushman',
    name: 'Ayushman',
    nameHi: 'आयुष्मान्',
    transliteration: 'Āyuṣmān',
    nature: 'Auspicious',
    natureHi: 'शुभ व आरोग्यप्रद',
    deity: 'Chandra / Soma (The Cosmic Nurturer)',
    deityHi: 'चन्द्रदेव / सोम',
    arc: "26°40' – 40°00'",
    explanation: 'Third Nitya Yoga. Means "Blessed with Longevity". Promotes sustained physical vitality, rejuvenation, and persistent spiritual study.',
    spiritualFocus: 'Engage in wholesome health practices, pranayama, and long-term scriptural swadhyaya.',
  },
  {
    index: 3,
    slug: 'saubhagya',
    name: 'Saubhagya',
    nameHi: 'सौभाग्य',
    transliteration: 'Saubhāgya',
    nature: 'Auspicious',
    natureHi: 'परम शुभ व कल्याणकारी',
    deity: 'Brahma (The Cosmic Creator)',
    deityHi: 'ब्रह्मा जी',
    arc: "40°00' – 53°20'",
    explanation: 'Fourth Nitya Yoga. Means "Good Fortune" and "Grace". Expands inner peace, family harmony, and radiant optimism.',
    spiritualFocus: 'Express gratitude for spiritual blessings, share prosperity generously, and contemplate divine benevolence.',
  },
  {
    index: 4,
    slug: 'shobhana',
    name: 'Shobhana',
    nameHi: 'शोभन',
    transliteration: 'Śobhana',
    nature: 'Auspicious',
    natureHi: 'शुभ व शोभामय',
    deity: 'Brihaspati (Guru of the Devas)',
    deityHi: 'देवगुरु बृहस्पति',
    arc: "53°20' – 66°40'",
    explanation: 'Fifth Nitya Yoga. Means "Splendor" and "Moral Beauty". Excellent for noble undertakings, artistic creations, and philosophical inquiry.',
    spiritualFocus: 'Study sacred scriptures, associate with virtuous seekers, and adorn the mind with pure thoughts.',
  },
  {
    index: 5,
    slug: 'atiganda',
    name: 'Atiganda',
    nameHi: 'अतिगण्ड',
    transliteration: 'Atigaṇḍa',
    nature: 'Challenging / Reflective',
    natureHi: 'संयमी व सतर्कता-योग्य',
    deity: 'Chandra (The Lunar Mind)',
    deityHi: 'चन्द्रदेव',
    arc: "66°40' – 80°00'",
    explanation: 'Sixth Nitya Yoga. Means "High Obstacle". Calls for careful speech, mental introspection, and conscious emotional regulation.',
    spiritualFocus: 'Maintain silence (mauna), practice witness-consciousness (sakshi-bhava), and refrain from impulsive emotional reactions.',
  },
  {
    index: 6,
    slug: 'sukarma',
    name: 'Sukarma',
    nameHi: 'सुकर्मा',
    transliteration: 'Sukarma',
    nature: 'Auspicious',
    natureHi: 'शुभ व सत्कार्य-प्रद',
    deity: 'Indra (King of Devas)',
    deityHi: 'देवराज इन्द्र',
    arc: "80°00' – 93°20'",
    explanation: 'Seventh Nitya Yoga. Means "Noble Deeds". Inspires selfless duty (nishkama karma), dedicated craftsmanship, and virtuous living.',
    spiritualFocus: 'Dedicate daily labor as sacred seva, fulfill family and societal obligations with reverence.',
  },
  {
    index: 7,
    slug: 'dhriti',
    name: 'Dhriti',
    nameHi: 'धृति',
    transliteration: 'Dhṛti',
    nature: 'Auspicious',
    natureHi: 'शुभ व धैर्य-वर्धक',
    deity: 'Varuna / Jala (The Cosmic Order)',
    deityHi: 'वरुणदेव / जल तत्त्व',
    arc: "93°20' – 106°40'",
    explanation: 'Eighth Nitya Yoga. Means "Steadfastness" and "Inner Fortitude". Bolsters patience, emotional equilibrium, and perseverance.',
    spiritualFocus: 'Cultivate resilience under trial, remain undisturbed by temporary setbacks, and stabilize meditation posture.',
  },
  {
    index: 8,
    slug: 'shula',
    name: 'Shula',
    nameHi: 'शूल',
    transliteration: 'Śūla',
    nature: 'Challenging / Reflective',
    natureHi: 'संयमी व तप-योग्य',
    deity: 'Sarpa / Naga (The Primal Energies)',
    deityHi: 'नागदेवता',
    arc: "106°40' – 120°00'",
    explanation: 'Ninth Nitya Yoga. Means "Spear" or "Sharp Challenge". A spiritual reminder to avoid interpersonal disputes and dissolve egoic rigidity.',
    spiritualFocus: 'Turn inward through silent prayer, practice forgiveness, and dissolve emotional hurt in contemplation of Shiva.',
  },
  {
    index: 9,
    slug: 'ganda',
    name: 'Ganda',
    nameHi: 'गण्ड',
    transliteration: 'Gaṇḍa',
    nature: 'Challenging / Reflective',
    natureHi: 'संयमी व आत्म-शोधन',
    deity: 'Agni (The Sacred Fire of Purification)',
    deityHi: 'अग्निदेव',
    arc: "120°00' – 133°20'",
    explanation: 'Tenth Nitya Yoga. Means "Knot". Favorable for untying inner psychological knots and habitual bondages through discernment.',
    spiritualFocus: 'Practice self-inquiry (vichara), surrender conditioned habits, and invoke the purifying fire of wisdom.',
  },
  {
    index: 10,
    slug: 'vriddhi',
    name: 'Vriddhi',
    nameHi: 'वृद्धि',
    transliteration: 'Vṛddhi',
    nature: 'Auspicious',
    natureHi: 'शुभ व समृद्धि-कारक',
    deity: 'Surya (The Solar Source of Illumination)',
    deityHi: 'सूर्यदेव',
    arc: "133°20' – 146°40'",
    explanation: 'Eleventh Nitya Yoga. Means "Growth" and "Prosperity". Fosters intellectual expansion, spiritual maturity, and fruitful creative work.',
    spiritualFocus: 'Plant constructive seeds for long-term learning, cultivate spiritual virtues, and expand generous awareness.',
  },
  {
    index: 11,
    slug: 'dhruva',
    name: 'Dhruva',
    nameHi: 'ध्रुव',
    transliteration: 'Dhruva',
    nature: 'Auspicious',
    natureHi: 'परम शुभ व स्थिर',
    deity: 'Prithvi (Mother Earth)',
    deityHi: 'भूमि / पृथ्वी देवी',
    arc: "146°40' – 160°00'",
    explanation: 'Twelfth Nitya Yoga. Means "Steadfast Pole Star". Ideal for establishing permanent vows, deep concentration, and enduring institutions.',
    spiritualFocus: 'Ground awareness in the changeless Atman, reaffirm spiritual commitments, and build unshakeable peace.',
  },
  {
    index: 12,
    slug: 'vyaghata',
    name: 'Vyaghata',
    nameHi: 'व्याघात',
    transliteration: 'Vyāghāta',
    nature: 'Challenging / Reflective',
    natureHi: 'संयमी व सजगता-योग्य',
    deity: 'Vayu (The Wind God)',
    deityHi: 'वायुदेव',
    arc: "160°00' – 173°20'",
    explanation: 'Thirteenth Nitya Yoga. Means "Impact" or "Resistance". Teaches resilience against external friction and preserving calm poise.',
    spiritualFocus: 'Practice breathing regulation (pranayama), observe equanimity amid friction, and cultivate inner strength.',
  },
  {
    index: 13,
    slug: 'harshana',
    name: 'Harshana',
    nameHi: 'हर्षण',
    transliteration: 'Harṣaṇa',
    nature: 'Auspicious',
    natureHi: 'शुभ व उल्लास-प्रद',
    deity: 'Bhaga (Solar Deity of Joy & Grace)',
    deityHi: 'भग देवता',
    arc: "173°20' – 186°40'",
    explanation: 'Fourteenth Nitya Yoga. Means "Jubilation" and "Cheer". Illuminates the mind with celebratory joy and lighthearted enthusiasm.',
    spiritualFocus: 'Celebrate the joy of existence (ananda), engage in uplifting devotional music (kirtan), and spread cheerful encouragement.',
  },
  {
    index: 14,
    slug: 'vajra',
    name: 'Vajra',
    nameHi: 'वज्र',
    transliteration: 'Vajra',
    nature: 'Challenging / Reflective',
    natureHi: 'संयमी व वज्रतुल्य संकल्प',
    deity: 'Varuna (Guardian of Truth & Cosmic Laws)',
    deityHi: 'वरुणदेव',
    arc: "186°40' – 200°00'",
    explanation: 'Fifteenth Nitya Yoga. Means "Diamond" or "Thunderbolt". Demands impenetrable moral willpower and rejecting fleeting allurements.',
    spiritualFocus: 'Fortify ethical boundaries (yamas), cultivate laser-like concentration, and reject compromise on moral truth.',
  },
  {
    index: 15,
    slug: 'siddhi',
    name: 'Siddhi',
    nameHi: 'सिद्धि',
    transliteration: 'Siddhi',
    nature: 'Auspicious',
    natureHi: 'परम शुभ व सिद्धि-प्रद',
    deity: 'Ganesha / Mitra (Lord of Accomplishment)',
    deityHi: 'श्रीगणेश / मित्रदेव',
    arc: "200°00' – 213°20'",
    explanation: 'Sixteenth Nitya Yoga. Means "Attainment" and "Mastery". Blessed for deep meditation breakthroughs, understanding scriptures, and fruitful outcomes.',
    spiritualFocus: 'Contemplate subtle Upanishadic passages, deepen meditation, and seek the highest attainment of self-realization.',
  },
  {
    index: 16,
    slug: 'vyatipata',
    name: 'Vyatipata',
    nameHi: 'व्यतीपात',
    transliteration: 'Vyatīpāta',
    nature: 'Challenging / Reflective',
    natureHi: 'संयमी व तपस्या-योग्य',
    deity: 'Rudra (The Transcendent Dissolver)',
    deityHi: 'भगवान् रुद्र',
    arc: "213°20' – 226°40'",
    explanation: 'Seventeenth Nitya Yoga. Traditionally reserved for quiet inward prayer, charity (dana), and japa rather than worldly ambitions.',
    spiritualFocus: 'Offer silent japa, practice selfless charity to the needy, and meditate upon the dissolution of ego.',
  },
  {
    index: 17,
    slug: 'variyan',
    name: 'Variyan',
    nameHi: 'वरीयान्',
    transliteration: 'Varīyān',
    nature: 'Auspicious',
    natureHi: 'शुभ व श्रेष्ठता-प्रद',
    deity: 'Kubera (Guardian of Treasures)',
    deityHi: 'कुबेरदेव',
    arc: "226°40' – 240°00'",
    explanation: 'Eighteenth Nitya Yoga. Means "Excellence" and "Pre-eminence". Fosters elevated thinking and seeking the highest philosophical truth.',
    spiritualFocus: 'Pursue noble learning, elevate mental standards above petty grievances, and cultivate inner nobility.',
  },
  {
    index: 18,
    slug: 'parigha',
    name: 'Parigha',
    nameHi: 'परिघ',
    transliteration: 'Parigha',
    nature: 'Challenging / Reflective',
    natureHi: 'संयमी व सुरक्षात्मक',
    deity: 'Vishvakarma (The Divine Architect)',
    deityHi: 'विश्वकर्मा जी',
    arc: "240°00' – 253°20'",
    explanation: 'Nineteenth Nitya Yoga. Means "Iron Bar" or "Barrier". Favorable for setting protective mental boundaries against toxic distractions.',
    spiritualFocus: 'Guard the senses against idle dissipation (pratyahara), close the gates of the mind to negativity, and protect spiritual energy.',
  },
  {
    index: 19,
    slug: 'shiva',
    name: 'Shiva',
    nameHi: 'शिव',
    transliteration: 'Śiva',
    nature: 'Auspicious',
    natureHi: 'परम शुभ व शिवमय',
    deity: 'Sadashiva (The Supreme Auspiciousness)',
    deityHi: 'सदाशिव महादेव',
    arc: "253°20' – 266°40'",
    explanation: 'Twentieth Nitya Yoga. Means "Auspiciousness Itself". Auspicious for all spiritual pursuits, sacred study, and realizing innate divinity.',
    spiritualFocus: 'Chant Om Namah Shivaya, contemplate universal stillness, and rest in pure transcendent awareness.',
  },
  {
    index: 20,
    slug: 'siddha',
    name: 'Siddha',
    nameHi: 'सिद्ध',
    transliteration: 'Siddha',
    nature: 'Auspicious',
    natureHi: 'शुभ व सिद्धिकारक',
    deity: 'Kartikeya / Skanda (The Divine General)',
    deityHi: 'भगवान् कार्तिकेय',
    arc: "266°40' – 280°00'",
    explanation: 'Twenty-first Nitya Yoga. Means "Perfected". Enhances mental focus and facilitates intuitive understanding of philosophical texts.',
    spiritualFocus: 'Deepen contemplation on the non-dual Self, cultivate unwavering mental discipline, and absorb subtle insights.',
  },
  {
    index: 21,
    slug: 'sadhya',
    name: 'Sadhya',
    nameHi: 'साध्य',
    transliteration: 'Sādhya',
    nature: 'Auspicious',
    natureHi: 'शुभ व सिद्धि-योग्य',
    deity: 'Savita (The Solar Inspirer of Intellect)',
    deityHi: 'सविता देव',
    arc: "280°00' – 293°20'",
    explanation: 'Twenty-second Nitya Yoga. Means "Achievable". Reminds the seeker that spiritual liberation is attained through constant, gentle practice.',
    spiritualFocus: 'Engage in dedicated practice (abhyasa) with the assurance that persistent righteous effort bears fruit.',
  },
  {
    index: 22,
    slug: 'shubha',
    name: 'Shubha',
    nameHi: 'शुभ',
    transliteration: 'Śubha',
    nature: 'Auspicious',
    natureHi: 'परम शुभ व निर्मल',
    deity: 'Lakshmi (Goddess of Grace & Abundance)',
    deityHi: 'भगवती लक्ष्मी',
    arc: "293°20' – 306°40'",
    explanation: 'Twenty-third Nitya Yoga. Means "Pure and Blessed". Auspicious for creative contemplation, charitable activities, and noble beginnings.',
    spiritualFocus: 'Express pure goodwill toward all living beings, engage in selfless charity, and cultivate inner contentment.',
  },
  {
    index: 23,
    slug: 'shukla',
    name: 'Shukla',
    nameHi: 'शुक्ल',
    transliteration: 'Śukla',
    nature: 'Auspicious',
    natureHi: 'शुभ व प्रकाशमान',
    deity: 'Parvati (Mother of the Cosmos)',
    deityHi: 'माता पार्वती',
    arc: "306°40' – 320°00'",
    explanation: 'Twenty-fourth Nitya Yoga. Means "Luminous White". Promotes clarity of intellect, spotless conscience, and transparent devotion.',
    spiritualFocus: 'Cleanse the mind of hypocrisy, speak with truthful transparency, and celebrate divine purity.',
  },
  {
    index: 24,
    slug: 'brahma',
    name: 'Brahma',
    nameHi: 'ब्रह्म',
    transliteration: 'Brahma',
    nature: 'Auspicious',
    natureHi: 'परम शुभ व ब्रह्ममय',
    deity: 'Ashvini Kumaras / Parabrahma',
    deityHi: 'अश्विनीकुमार व परब्रह्म',
    arc: "320°00' – 333°20'",
    explanation: 'Twenty-fifth Nitya Yoga. Means "The Infinite". Sacred for contemplating the supreme non-dual reality and Vedantic mahavakyas.',
    spiritualFocus: 'Contemplate Upanishadic mahavakyas (Aham Brahmasmi, Tat Tvam Asi), and experience unity behind diversity.',
  },
  {
    index: 25,
    slug: 'indra',
    name: 'Indra',
    nameHi: 'इन्द्र',
    transliteration: 'Indra',
    nature: 'Auspicious',
    natureHi: 'शुभ व गौरवमय',
    deity: 'Pitris / Indra (Dignity & Protection)',
    deityHi: 'पितृगण व इन्द्रदेव',
    arc: "333°20' – 346°40'",
    explanation: 'Twenty-sixth Nitya Yoga. Means "Sovereignty and Dignity". Encourages righteous leadership, respect for ancestors, and protecting the vulnerable.',
    spiritualFocus: 'Honor righteous teachers and ancestors, exercise protective compassion, and demonstrate noble integrity.',
  },
  {
    index: 26,
    slug: 'vaidhriti',
    name: 'Vaidhriti',
    nameHi: 'वैधृति',
    transliteration: 'Vaidhṛti',
    nature: 'Challenging / Reflective',
    natureHi: 'संयमी व तपस्या-योग्य',
    deity: 'Diti (Mother of the Daityas / Restraint)',
    deityHi: 'दिति देवी',
    arc: "346°40' – 360°00'",
    explanation: 'Twenty-seventh Nitya Yoga. Means "Restraint" and "Balance". Best suited for quiet introspection, tapasya, and contemplative withdrawal.',
    spiritualFocus: 'Maintain inner quietude, withdraw from worldly sensory overload, and ground consciousness in silent meditation.',
  },
];

export function yogaSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function getYogaBySlug(slug: string): YogaMeta | undefined {
  const clean = slug.toLowerCase().trim();
  return YOGA_DATA.find((y) => y.slug === clean || yogaSlug(y.name) === clean);
}

export function getAllYogas(): YogaMeta[] {
  return YOGA_DATA;
}

export interface KaranaMeta {
  key: string;
  slug: string;
  name: string;
  nameHi: string;
  transliteration: string;
  nature: 'Chara (Movable)' | 'Sthira (Fixed)';
  natureHi: string;
  deity: string;
  deityHi: string;
  occurrence: string;
  explanation: string;
  spiritualFocus: string;
}

export const KARANA_DATA: Record<string, KaranaMeta> = {
  Bava: {
    key: 'Bava',
    slug: 'bava',
    name: 'Bava',
    nameHi: 'बव',
    transliteration: 'Bava',
    nature: 'Chara (Movable)',
    natureHi: 'चर (गतिशील)',
    deity: 'Indra (King of Deities)',
    deityHi: 'देवराज इन्द्र',
    occurrence: 'Repeats 8 times per lunar month across waxing and waning phases.',
    explanation: 'First repeating Chara karana. Governed by Indra. Highly favorable for initiating constructive work, health pursuits, and spiritual resolve.',
    spiritualFocus: 'Initiate noble endeavors, cultivate energetic determination, and perform duties with vigor.',
  },
  Balava: {
    key: 'Balava',
    slug: 'balava',
    name: 'Balava',
    nameHi: 'बालव',
    transliteration: 'Bālava',
    nature: 'Chara (Movable)',
    natureHi: 'चर (गतिशील)',
    deity: 'Brahma (The Creator)',
    deityHi: 'ब्रह्मा जी',
    occurrence: 'Repeats 8 times per lunar month.',
    explanation: 'Second repeating Chara karana. Governed by Brahma. Auspicious for sacred ceremonies, reading scriptures, and peaceful assemblies.',
    spiritualFocus: 'Engage in sacred learning, seek blessings from preceptors, and foster peaceful relationships.',
  },
  Kaulava: {
    key: 'Kaulava',
    slug: 'kaulava',
    name: 'Kaulava',
    nameHi: 'कौलव',
    transliteration: 'Kaulava',
    nature: 'Chara (Movable)',
    natureHi: 'चर (गतिशील)',
    deity: 'Mitra (Deity of Friendship & Truth)',
    deityHi: 'मित्रदेव',
    occurrence: 'Repeats 8 times per lunar month.',
    explanation: 'Third repeating Chara karana. Governed by Mitra. Ideal for developing mutual friendship, community service, and compassionate relationships.',
    spiritualFocus: 'Strengthen bonds of mutual trust, practice hospitality, and cultivate universal compassion.',
  },
  Taitila: {
    key: 'Taitila',
    slug: 'taitila',
    name: 'Taitila',
    nameHi: 'तैतिल',
    transliteration: 'Taitila',
    nature: 'Chara (Movable)',
    natureHi: 'चर (गतिशील)',
    deity: 'Aryaman (Deity of Honor & Steadfast Duty)',
    deityHi: 'अर्यमा देव',
    occurrence: 'Repeats 8 times per lunar month.',
    explanation: 'Fourth repeating Chara karana. Governed by Aryaman. Auspicious for steady work, building durable skills, and honoring commitments.',
    spiritualFocus: 'Maintain impeccable integrity in word and deed, honor promises, and build lasting spiritual habits.',
  },
  Garaja: {
    key: 'Garaja',
    slug: 'garaja',
    name: 'Garaja',
    nameHi: 'गरज',
    transliteration: 'Garaja',
    nature: 'Chara (Movable)',
    natureHi: 'चर (गतिशील)',
    deity: 'Bhumi (Mother Earth)',
    deityHi: 'भूमि / पृथ्वी देवी',
    occurrence: 'Repeats 8 times per lunar month.',
    explanation: 'Fifth repeating Chara karana. Governed by the Earth. Favorable for grounding oneself, agriculture, planting seeds, and steady physical routines.',
    spiritualFocus: 'Practice humility, connect with nature, and anchor consciousness in grounded patience.',
  },
  Vanija: {
    key: 'Vanija',
    slug: 'vanija',
    name: 'Vanija',
    nameHi: 'वणिज',
    transliteration: 'Vaṇija',
    nature: 'Chara (Movable)',
    natureHi: 'चर (गतिशील)',
    deity: 'Lakshmi (Goddess of Fair Wealth & Fortune)',
    deityHi: 'भगवती लक्ष्मी',
    occurrence: 'Repeats 8 times per lunar month.',
    explanation: 'Sixth repeating Chara karana. Governed by Lakshmi. Auspicious for equitable commerce, balanced exchanges, and ethical dealings.',
    spiritualFocus: 'Practice fairness in daily transactions, avoid greed, and maintain purity of livelihood (arjuna artha).',
  },
  Vishti: {
    key: 'Vishti',
    slug: 'vishti',
    name: 'Vishti (Bhadra)',
    nameHi: 'विष्टि (भद्रा)',
    transliteration: 'Viṣṭi',
    nature: 'Chara (Movable)',
    natureHi: 'चर (भद्रा / विशेष संयम)',
    deity: 'Yama / Chhaya (Solar daughter Bhadra)',
    deityHi: 'यमराज / भद्रा देवी',
    occurrence: 'Repeats 8 times per month (Shukla 8 second half, Shukla 11 first half, Shukla 15 first half, Krishna 3 second half, Krishna 7 first half, Krishna 10 second half, Krishna 14 first half).',
    explanation: 'Known widely as Bhadra. In Muhurta science, it calls for defensive caution, deep cleaning, introspection, fasting, and spiritual japa rather than celebratory beginnings.',
    spiritualFocus: 'Practice disciplined fasting, clear inner mental clutters, chant protective mantras, and observe thoughtful restraint.',
  },
  Shakuni: {
    key: 'Shakuni',
    slug: 'shakuni',
    name: 'Shakuni',
    nameHi: 'शकुनि',
    transliteration: 'Śakuni',
    nature: 'Sthira (Fixed)',
    natureHi: 'स्थिर (नियत)',
    deity: 'Kali / Vayu',
    deityHi: 'काली / वायुदेव',
    occurrence: 'Fixed on the second half of Krishna Chaturdashi.',
    explanation: 'First fixed Sthira karana. Suited for herbal remedies, medicine, resolving long-standing legal or moral disputes, and protective sadhana.',
    spiritualFocus: 'Administer healing remedies, resolve unsettled internal conflicts, and seek divine protection.',
  },
  Chatushpada: {
    key: 'Chatushpada',
    slug: 'chatushpada',
    name: 'Chatushpada',
    nameHi: 'चतुष्पद',
    transliteration: 'Catuṣpada',
    nature: 'Sthira (Fixed)',
    natureHi: 'स्थिर (नियत)',
    deity: 'Vrishabha / Rudra',
    deityHi: 'वृषभ / रुद्रदेव',
    occurrence: 'Fixed on the first half of Amavasya.',
    explanation: 'Second fixed Sthira karana. Associated with care of four-legged animals (gau-seva), charity, and honoring ancestors (pitri-tarpana).',
    spiritualFocus: 'Feed birds and animals, offer respectful remembrance to ancestors, and practice selfless charity.',
  },
  Naga: {
    key: 'Naga',
    slug: 'naga',
    name: 'Naga',
    nameHi: 'नाग',
    transliteration: 'Nāga',
    nature: 'Sthira (Fixed)',
    natureHi: 'स्थिर (नियत)',
    deity: 'Shesha / Sarpa (Cosmic Serpent)',
    deityHi: 'अनन्त शेषनाग',
    occurrence: 'Fixed on the second half of Amavasya.',
    explanation: 'Third fixed Sthira karana. Suited for steady patience, digging deep into spiritual questions, and overcoming fear through unwavering courage.',
    spiritualFocus: 'Meditate upon the coiled spiritual energy (Kundalini), confront inner fears with wisdom, and cultivate deep stillness.',
  },
  Kimstughna: {
    key: 'Kimstughna',
    slug: 'kimstughna',
    name: 'Kimstughna',
    nameHi: 'किंस्तुघ्न',
    transliteration: 'Kiṃstughna',
    nature: 'Sthira (Fixed)',
    natureHi: 'स्थिर (नियत)',
    deity: 'Vayu / Maruts',
    deityHi: 'वायुदेव / मरुद्गण',
    occurrence: 'Fixed on the first half of Shukla Pratipada.',
    explanation: 'Fourth fixed Sthira karana. Literally means "Dispelling All Grief". Marks the commencement of the waxing lunar cycle and auspicious renewal.',
    spiritualFocus: 'Initiate fresh spiritual resolve, let go of past grief, and invoke auspicious divine light.',
  },
};

export function karanaSlug(name: string): string {
  return name.toLowerCase().replace(/\s*\(.*?\)\s*/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function getKaranaBySlug(slug: string): KaranaMeta | undefined {
  const clean = slug.toLowerCase().trim();
  return Object.values(KARANA_DATA).find((k) => k.slug === clean || karanaSlug(k.name) === clean);
}

export function getAllKaranas(): KaranaMeta[] {
  return Object.values(KARANA_DATA);
}

export interface RituMeta {
  name: string;
  nameHi: string;
  transliteration: string;
  months: string;
  seasonEn: string;
  explanation: string;
  spiritualFocus: string;
}

export const RITU_DATA: Record<string, RituMeta> = {
  Vasanta: {
    name: 'Vasanta',
    nameHi: 'वसन्त',
    transliteration: 'Vasanta',
    months: 'Chaitra – Vaishakha (Mid-Mar to Mid-May)',
    seasonEn: 'Spring',
    explanation: 'Season of gentle blossoming, revival, and clear skies.',
    spiritualFocus: 'Spiritual rejuvenation, starting new commentaries, clarity of mind.',
  },
  Grishma: {
    name: 'Grishma',
    nameHi: 'ग्रीष्म',
    transliteration: 'Grīṣma',
    months: 'Jyeshtha – Ashadha (Mid-May to Mid-Jul)',
    seasonEn: 'Summer',
    explanation: 'Season of intense solar radiance, discipline, and endurance.',
    spiritualFocus: 'Tapasya (disciplined endurance), early morning japa, simple light diet.',
  },
  Varsha: {
    name: 'Varsha',
    nameHi: 'वर्षा',
    transliteration: 'Varṣā',
    months: 'Shravana – Bhadrapada (Mid-Jul to Mid-Sep)',
    seasonEn: 'Monsoon',
    explanation: 'Season of life-giving rains, Chaturmas observance, and inward sheltering.',
    spiritualFocus: 'Intense scripture study, meditation indoors, deep devotional singing.',
  },
  Sharad: {
    name: 'Sharad',
    nameHi: 'शरद्',
    transliteration: 'Śarad',
    months: 'Ashvina – Kartika (Mid-Sep to Mid-Nov)',
    seasonEn: 'Autumn',
    explanation: 'Season of crystalline moonlight, harvest festivals, and tranquil waters.',
    spiritualFocus: 'Purity of devotion, Navratri and Diwali reflections, steady balance.',
  },
  Hemanta: {
    name: 'Hemanta',
    nameHi: 'हेमन्त',
    transliteration: 'Hemanta',
    months: 'Margashirsha – Pausha (Mid-Nov to Mid-Jan)',
    seasonEn: 'Pre-Winter',
    explanation: 'Season of gentle coolness, morning mist, and internal steadiness.',
    spiritualFocus: 'Gita Jayanti contemplation, physical stamina, prolonged silent meditation.',
  },
  Shishira: {
    name: 'Shishira',
    nameHi: 'शिशिर',
    transliteration: 'Śiśira',
    months: 'Magha – Phalguna (Mid-Jan to Mid-Mar)',
    seasonEn: 'Winter',
    explanation: 'Season of deep cold, inward consolidation, and quiet reflection.',
    spiritualFocus: 'Maha Shivaratri preparation, detachment from external luxury, inner warmth.',
  },
};

export interface StudySuggestion {
  scriptureId: string;
  scriptureTitle: string;
  chapterNumber: number;
  chapterTitle: string;
  verseRef: string;
  sanskrit: string;
  transliteration: string;
  english: string;
  hindi: string;
  contemplationPrompt: string;
}

export const STUDY_SUGGESTIONS: StudySuggestion[] = [
  {
    scriptureId: 'bhagavadgita',
    scriptureTitle: 'Bhagavad Gita',
    chapterNumber: 2,
    chapterTitle: 'Sankhya Yoga',
    verseRef: '2.47',
    sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन । मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥',
    transliteration: 'karmaṇyevādhikāraste mā phaleṣu kadācana | mā karmaphalaheturbhūrmā te saṅgo\'stvakarmaṇi ||',
    english: 'You have a right to action alone, never to its fruits. Let not the fruits of action be your motive, nor let your attachment be to inaction.',
    hindi: 'कर्म करने में ही तुम्हारा अधिकार है, उसके फलों में कभी नहीं। इसलिए कर्मफल के हेतु मत बनो और तुम्हारी आसक्ति अकर्म में भी न हो।',
    contemplationPrompt: 'Today, offer each task as a deliberate gift without anxiously projecting into the results.',
  },
  {
    scriptureId: 'bhagavadgita',
    scriptureTitle: 'Bhagavad Gita',
    chapterNumber: 6,
    chapterTitle: 'Dhyana Yoga',
    verseRef: '6.5',
    sanskrit: 'उद्धरेदात्मनात्मानं नात्मानमवसादयेत् । आत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः ॥',
    transliteration: 'uddharedātmanātmānaṃ nātmānamavasādayet | ātmaiva hyātmano bandhurātmaiva ripurātmanaḥ ||',
    english: 'One should elevate oneself by one’s own mind, and not degrade oneself. For the mind alone is the friend of the self, and the mind alone is its enemy.',
    hindi: 'मनुष्य को चाहिए कि वह अपने मन द्वारा अपना उद्धार करे, अपने को गिराए नहीं; क्योंकि मन ही अपना मित्र है और मन ही अपना शत्रु है।',
    contemplationPrompt: 'Observe your internal monologue today: are your thoughts befriending your highest aspirations or anchoring you down?',
  },
  {
    scriptureId: 'bhagavadgita',
    scriptureTitle: 'Bhagavad Gita',
    chapterNumber: 12,
    chapterTitle: 'Bhakti Yoga',
    verseRef: '12.13',
    sanskrit: 'अद्वेष्टा सर्वभूतानां मैत्रः करुण एव च । निर्ममो निरहङ्कारः समदुःखसुखः क्षमी ॥',
    transliteration: 'adveṣṭā sarvabhūtānāṃ maitraḥ karuṇa eva ca | nirmamo nirahaṅkāraḥ samaduḥkhasukhaḥ kṣamī ||',
    english: 'One who bears no ill-will toward any being, who is friendly and compassionate, free from possessiveness and ego, balanced in pleasure and pain, and forgiving.',
    hindi: 'जो सभी प्राणियों के प्रति द्वेषरहित, मित्रवत और दयालु है, ममता और अहंकार से रहित, सुख-दुःख में सम और क्षमाशील है।',
    contemplationPrompt: 'Practice universal friendliness today: mentally wish peace for every person you encounter, especially those who challenge your patience.',
  },
  {
    scriptureId: 'ishavasya',
    scriptureTitle: 'Isha Upanishad',
    chapterNumber: 1,
    chapterTitle: 'Isha Upanishad',
    verseRef: 'Verse 1',
    sanskrit: 'ईशा वास्यमिदं सर्वं यत्किञ्च जगत्यां जगत् । तेन त्यक्तेन भुञ्जीथा मा गृधः कस्यस्विद्धनम् ॥',
    transliteration: 'īśā vāsyamidaṃ sarvaṃ yatkiñca jagatyāṃ jagat | tena tyaktena bhuñjīthā mā gṛdhaḥ kasyasviddhanam ||',
    english: 'All this, whatever moves in this moving world, is pervaded by the Divine. Renounce and enjoy; do not covet anyone’s wealth.',
    hindi: 'इस गतिशील जगत में जो कुछ भी है, वह सब ईश्वर से व्याप्त है। त्यागपूर्वक उसका उपभोग करो, किसी के धन की इच्छा मत करो।',
    contemplationPrompt: 'Notice how every object and person shares the same divine presence. Enjoy life through gratitude rather than possessiveness.',
  },
  {
    scriptureId: 'bhagavadgita',
    scriptureTitle: 'Bhagavad Gita',
    chapterNumber: 18,
    chapterTitle: 'Moksha Sannyasa Yoga',
    verseRef: '18.65',
    sanskrit: 'मन्मना भव मद्भक्तो मद्याजी मां नमस्कुरु । मामेवैष्यसि सत्यं ते प्रतिजाने प्रियोऽसि मे ॥',
    transliteration: 'manmanā bhava madbhakto madyājī māṃ namaskuru | māmevaiṣyasi satyaṃ te pratijāne priyo\'si me ||',
    english: 'Absorb your mind in Me, be devoted to Me, sacrifice for Me, bow down to Me. Thus you shall come to Me; I promise you truly, for you are dear to Me.',
    hindi: 'मुझमें मन वाला हो, मेरा भक्त बन, मेरा पूजन करने वाला हो और मुझे नमस्कार कर। ऐसा करने से तू मुझे ही प्राप्त होगा, यह मैं तुझसे सत्य प्रतिज्ञा करता हूँ, क्योंकि तू मुझे अत्यन्त प्रिय है।',
    contemplationPrompt: 'Turn regular work into an act of worship by dedicating every thought and action to the Supreme Divine.',
  },
];

export interface SolarTimes {
  sunrise: string;
  sunset: string;
  dayLength: string;
  solarNoon: string;
  isReliable: boolean;
  unreliableReason?: string;
}

export interface PanchangDayData {
  date: Date;
  isoDate: string;
  fullDateEnglish: string;
  fullDateHindi: string;
  dayOfWeek: string;
  dayOfWeekHi: string;
  location: LocationConfig;
  tithi: {
    number: number;
    name: string;
    nameHi: string;
    transliteration: string;
    paksha: 'Shukla' | 'Krishna';
    pakshaHi: string;
    progressPercent: number;
    approxSpan: string;
    meta: TithiMeta;
  };
  paksha: {
    name: string;
    nameHi: string;
    transliteration: string;
    isWaxing: boolean;
    illuminationPercent: number;
    explanation: string;
  };
  nakshatra: {
    index: number;
    pada: number;
    name: string;
    nameHi: string;
    transliteration: string;
    deity: string;
    rulingPlanet: string;
    symbol: string;
    approxSpan: string;
    explanation: string;
    studyTheme: string;
  };
  yoga: {
    index: number;
    name: string;
    nameHi: string;
    transliteration: string;
    nature: 'Auspicious' | 'Neutral' | 'Challenging / Reflective';
    approxSpan: string;
    explanation: string;
  };
  karana: {
    name: string;
    nameHi: string;
    transliteration: string;
    nature: string;
    approxSpan: string;
    explanation: string;
  };
  ritu: RituMeta;
  solarTimes: SolarTimes;
  studySuggestion: StudySuggestion;
  upcomingFestivalsPreview: {
    id: string;
    name: string;
    nameHi: string;
    dateStr: string;
    tithiRule: string;
    synopsis: string;
    category: string;
  }[];
}

/* ─────────────────────────────────────────────────────────────────────────────
   ASTRONOMICAL ALGORITHMS (Meeus-Based Educational Approximations)
───────────────────────────────────────────────────────────────────────────── */

const MS_PER_DAY = 86_400_000;
const SYNODIC_MONTH = 29.530588861;
const SIDEREAL_MONTH = 27.321661;
const J2000_EPOCH = Date.UTC(2000, 0, 1, 12, 0, 0);
const NEW_MOON_REFERENCE = Date.UTC(2000, 0, 6, 18, 14, 0);

function positiveModulo(value: number, divisor: number): number {
  return ((value % divisor) + divisor) % divisor;
}

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

function toDegrees(rad: number): number {
  return (rad * 180) / Math.PI;
}

/**
 * Calculates Chitra Paksha (Lahiri) Ayanamsha for a given date.
 * At J2000.0, Lahiri ayanamsha was ~23.857°. Annual precession rate is ~50.29 arcseconds.
 */
function getLahiriAyanamsha(julianDaysFromJ2000: number): number {
  const centuriesFromJ2000 = julianDaysFromJ2000 / 36525;
  return 23.85708 + 1.3969 * centuriesFromJ2000;
}

/**
 * Sun's tropical longitude using mean anomaly and equation of center.
 */
function getSunTropicalLongitude(daysFromJ2000: number): number {
  const meanLongitude = positiveModulo(280.46646 + 0.98564736 * daysFromJ2000, 360);
  const meanAnomaly = positiveModulo(357.52911 + 0.98560028 * daysFromJ2000, 360);
  const equationOfCenter =
    1.914602 * Math.sin(toRadians(meanAnomaly)) +
    0.019993 * Math.sin(toRadians(2 * meanAnomaly));
  return positiveModulo(meanLongitude + equationOfCenter, 360);
}

/**
 * Moon's tropical longitude using Evection and Equation of Center perturbations.
 */
function getMoonTropicalLongitude(daysFromJ2000: number): number {
  const meanLongitude = positiveModulo(218.3164477 + 13.17639648 * daysFromJ2000, 360);
  const meanAnomaly = positiveModulo(134.9633964 + 13.06499295 * daysFromJ2000, 360);
  const sunAnomaly = positiveModulo(357.52911 + 0.98560028 * daysFromJ2000, 360);
  const elongation = positiveModulo(297.8501921 + 12.19074912 * daysFromJ2000, 360);

  // Dominant lunar perturbations in longitude (arcseconds to degrees)
  const equationOfCenter = 6.288774 * Math.sin(toRadians(meanAnomaly));
  const evection = 1.274027 * Math.sin(toRadians(2 * elongation - meanAnomaly));
  const variation = 0.658314 * Math.sin(toRadians(2 * elongation));
  const annualEquation = -0.185116 * Math.sin(toRadians(sunAnomaly));

  return positiveModulo(
    meanLongitude + equationOfCenter + evection + variation + annualEquation,
    360,
  );
}

/**
 * Calculates reliable Astronomical Sunrise and Sunset times with atmospheric refraction (-0.833°).
 * If coordinates are missing or location falls into polar day/night where sun doesn't cross the horizon,
 * returns an explicit graceful unavailable state.
 */
function calculateSolarTimes(date: Date, location: LocationConfig): SolarTimes {
  if (!location.hasReliableCoordinates || location.latitude === null || location.longitude === null) {
    return {
      sunrise: '—',
      sunset: '—',
      dayLength: '—',
      solarNoon: '—',
      isReliable: false,
      unreliableReason:
        'Exact geographic coordinates are not configured for this location. Unlike generic clocks, Vedic panchang calculations require verified local horizon parameters.',
    };
  }

  const lat = location.latitude;
  const lon = location.longitude;
  const tzOffset = location.utcOffsetHours;

  // Day of year
  const startOfYear = new Date(Date.UTC(date.getFullYear(), 0, 1));
  const dayOfYear = Math.floor((date.getTime() - startOfYear.getTime()) / MS_PER_DAY) + 1;

  // Approximate solar declination and equation of time
  const b = (2 * Math.PI * (dayOfYear - 81)) / 365;
  const equationOfTimeMinutes = 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b);
  const solarDeclinationDeg = 23.45 * Math.sin(toRadians(b * (365 / 360) * 360));

  // Hour angle for civil/astronomical sunrise (-0.833° for atmospheric refraction)
  const zenithDeg = 90.833;
  const latRad = toRadians(lat);
  const declRad = toRadians(solarDeclinationDeg);

  const cosHourAngle =
    (Math.cos(toRadians(zenithDeg)) - Math.sin(latRad) * Math.sin(declRad)) /
    (Math.cos(latRad) * Math.cos(declRad));

  // Check for polar day or polar night where the sun doesn't rise or set
  if (cosHourAngle > 1) {
    return {
      sunrise: '—',
      sunset: '—',
      dayLength: '—',
      solarNoon: '—',
      isReliable: false,
      unreliableReason: 'Polar night: The sun does not rise above the horizon at this latitude today.',
    };
  }
  if (cosHourAngle < -1) {
    return {
      sunrise: '—',
      sunset: '—',
      dayLength: '—',
      solarNoon: '—',
      isReliable: false,
      unreliableReason: 'Midnight sun: The sun does not set below the horizon at this latitude today.',
    };
  }

  const hourAngleHours = toDegrees(Math.acos(cosHourAngle)) / 15;

  // Solar noon in local civil time (hours)
  const solarNoonLocalHours = 12 - (lon / 15 - tzOffset) - equationOfTimeMinutes / 60;
  const sunriseLocalHours = solarNoonLocalHours - hourAngleHours;
  const sunsetLocalHours = solarNoonLocalHours + hourAngleHours;

  const formatHoursToTime = (decimalHours: number): string => {
    const totalMinutes = Math.round(decimalHours * 60);
    const normalizedMinutes = positiveModulo(totalMinutes, 24 * 60);
    const hrs = Math.floor(normalizedMinutes / 60);
    const mins = normalizedMinutes % 60;
    const period = hrs >= 12 ? 'PM' : 'AM';
    const displayHrs = hrs % 12 === 0 ? 12 : hrs % 12;
    return `${displayHrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')} ${period}`;
  };

  const dayLengthHours = sunsetLocalHours - sunriseLocalHours;
  const dayLengthHrs = Math.floor(dayLengthHours);
  const dayLengthMins = Math.round((dayLengthHours - dayLengthHrs) * 60);

  return {
    sunrise: formatHoursToTime(sunriseLocalHours),
    sunset: formatHoursToTime(sunsetLocalHours),
    solarNoon: formatHoursToTime(solarNoonLocalHours),
    dayLength: `${dayLengthHrs}h ${dayLengthMins}m`,
    isReliable: true,
  };
}

/**
 * Vedic Ritu (Season) based on Tropical Sun Longitude.
 * 6 Seasons of 60° solar movement each.
 */
function getVedicRitu(sunTropicalDeg: number): RituMeta {
  if (sunTropicalDeg >= 330 || sunTropicalDeg < 30) {
    return RITU_DATA['Vasanta'];
  }
  if (sunTropicalDeg >= 30 && sunTropicalDeg < 90) {
    return RITU_DATA['Grishma'];
  }
  if (sunTropicalDeg >= 90 && sunTropicalDeg < 150) {
    return RITU_DATA['Varsha'];
  }
  if (sunTropicalDeg >= 150 && sunTropicalDeg < 210) {
    return RITU_DATA['Sharad'];
  }
  if (sunTropicalDeg >= 210 && sunTropicalDeg < 270) {
    return RITU_DATA['Hemanta'];
  }
  return RITU_DATA['Shishira'];
}

/**
 * Approximates transition end hour formatted for standard display.
 */
function formatRemainingSpan(progress0To1: number, hoursTotal: number, utcOffsetHours: number, tz: string): string {
  const remainingHours = (1 - progress0To1) * hoursTotal;
  const finish = new Date(Date.now() + remainingHours * 3600 * 1000);
  const shifted = new Date(finish.getTime() + utcOffsetHours * 3600 * 1000);
  const hrs = shifted.getUTCHours();
  const mins = shifted.getUTCMinutes().toString().padStart(2, '0');
  const period = hrs >= 12 ? 'PM' : 'AM';
  const displayHrs = hrs % 12 === 0 ? 12 : hrs % 12;
  return `Approximate · ends ~${displayHrs}:${mins} ${period} ${tz}`;
}

/** Calendar year, month index, and day at a fixed UTC offset. Month is 0–11. */
export function civilPartsAtOffset(instant: Date, utcOffsetHours: number): { year: number; month: number; day: number } {
  const shifted = new Date(instant.getTime() + utcOffsetHours * 3600 * 1000);
  return { year: shifted.getUTCFullYear(), month: shifted.getUTCMonth(), day: shifted.getUTCDate() };
}

/** Noon on a civil date, expressed as an absolute instant at the location offset. */
export function locationNoon(year: number, month: number, day: number, utcOffsetHours: number): Date {
  return new Date(Date.UTC(year, month, day, 12, 0, 0) - utcOffsetHours * 3600 * 1000);
}

/** A Date whose local calendar fields are the civil day at the location. */
export function todayForLocation(location: LocationConfig, now: Date = new Date()): Date {
  const parts = civilPartsAtOffset(now, location.utcOffsetHours);
  return new Date(parts.year, parts.month, parts.day, 12, 0, 0);
}

/**
 * Previews upcoming significant festivals and tithi observances based on month and date.
 */
function getUpcomingFestivalsPreview(date: Date) {
  const m = date.getMonth(); // 0 to 11
  // Curated educational calendar milestones across the seasons
  const pool = [
    {
      id: 'ekadashi_observance',
      name: 'Pavitra Ekādaśī',
      nameHi: 'पवित्र एकादशी',
      dateStr: 'Upcoming 11th Lunar Day',
      tithiRule: 'Shukla / Krishna Ekadashi',
      synopsis: 'Fortnightly contemplation of Vishnu through dietary restraint and silence.',
      category: 'Vrata & Sadhana',
    },
    {
      id: 'pradosha_vrata',
      name: 'Pradoṣa Vrata',
      nameHi: 'प्रदोष व्रत',
      dateStr: 'Upcoming 13th Lunar Day (Twilight)',
      tithiRule: 'Trayodashi Sandhya',
      synopsis: 'Twilight meditation on Shiva; dissolving accumulated karmic knots.',
      category: 'Twilight Observance',
    },
    {
      id: 'purnima_clarity',
      name: 'Pūrṇimā Celebration',
      nameHi: 'पूर्णिमा उत्सव',
      dateStr: 'Upcoming Full Moon',
      tithiRule: '15th Lunar Day (Purnima)',
      synopsis: 'Celebration of inner fullness (Pūrṇatva) and divine radiance.',
      category: 'Lunar Culmination',
    },
    {
      id: 'amavasya_reflection',
      name: 'Amāvāsyā & Pitru Smarana',
      nameHi: 'अमावस्या एवं पितृ स्मरण',
      dateStr: 'Upcoming New Moon',
      tithiRule: '30th Lunar Day (Amavasya)',
      synopsis: 'Gratitude to ancestors, silent self-inquiry, and letting go of egoic residue.',
      category: 'Deep Inwardness',
    },
    {
      id: 'diwali_knowledge',
      name: 'Dīpāvalī · Festival of Lights',
      nameHi: 'दीपावली (कार्तिक अमावस्या)',
      dateStr: 'Kartika Amavasya',
      tithiRule: 'Amavasya prevailing at Pradosha',
      synopsis: 'Victory of illuminating knowledge over ignorance and light over darkness.',
      category: 'Major Annual Festival',
    },
    {
      id: 'gita_jayanti',
      name: 'Gītā Jayantī',
      nameHi: 'गीता जयंती',
      dateStr: 'Margashirsha Shukla Ekadashi',
      tithiRule: 'Mokshada Ekadashi',
      synopsis: 'Advent of the Bhagavad Gita spoken by Sri Krishna to Arjuna at Kurukshetra.',
      category: 'Scriptural Advent',
    },
    {
      id: 'maha_shivaratri',
      name: 'Mahā Śivarātri',
      nameHi: 'महाशिवरात्रि',
      dateStr: 'Phalguna Krishna Chaturdashi',
      tithiRule: 'Chaturdashi prevailing at Nishita Kala',
      synopsis: 'Vigil of transcendent awareness honoring Shiva as unmanifest reality.',
      category: 'Great Night of Shiva',
    },
  ];

  // Rotate display based on month so preview always feels fresh and season-relevant
  const startIdx = (m * 2) % (pool.length - 3);
  return pool.slice(startIdx, startIdx + 4);
}

/**
 * Master Panchang Calculation Function
 */
export function calculateEducationalPanchang(
  date: Date,
  location: LocationConfig = PRESET_LOCATIONS[0],
): PanchangDayData {
  // The picked year/month/day is the civil date at the selected place, not the browser zone.
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const calcDate = locationNoon(year, month, day, location.utcOffsetHours);
  const daysFromJ2000 = (calcDate.getTime() - J2000_EPOCH) / MS_PER_DAY;
  const daysFromNewMoon = (calcDate.getTime() - NEW_MOON_REFERENCE) / MS_PER_DAY;

  // Sidereal longitudes using Chitra Paksha (Lahiri) Ayanamsha
  const ayanamsha = getLahiriAyanamsha(daysFromJ2000);
  const sunTropical = getSunTropicalLongitude(daysFromJ2000);
  const moonTropical = getMoonTropicalLongitude(daysFromJ2000);

  const sunSidereal = positiveModulo(sunTropical - ayanamsha, 360);
  const moonSidereal = positiveModulo(moonTropical - ayanamsha, 360);

  // 1. TITHI (12° difference between Moon and Sun)
  const elongation = positiveModulo(moonSidereal - sunSidereal, 360);
  const tithiRaw = elongation / 12; // 0 to 30
  const tithiNumber = Math.min(30, Math.floor(tithiRaw) + 1);
  const tithiProgress = positiveModulo(tithiRaw, 1);
  const tithiProgressPercent = Math.round(tithiProgress * 100);

  const tithiMeta = TITHI_DATA[tithiNumber] || TITHI_DATA[1];
  const pakshaName = tithiNumber <= 15 ? 'Shukla Paksha' : 'Krishna Paksha';
  const pakshaHi = tithiNumber <= 15 ? 'शुक्ल पक्ष' : 'कृष्ण पक्ष';

  // 2. PAKSHA & ILLUMINATION (Computed directly from astronomical Sun-Moon elongation)
  const elongationRad = (elongation * Math.PI) / 180;
  let rawIllum = ((1 - Math.cos(elongationRad)) / 2) * 100;
  // In Shukla Paksha Pratipada, the waxing crescent gathers light immediately following Amavasya conjunction.
  // Guarantee that when Pratipada progression is active (>= 10%), illumination reflects the waxing crescent (1-3%) rather than rounding down to 0%.
  if (tithiNumber === 1 && tithiProgressPercent >= 10) {
    rawIllum = Math.max(1, Math.round((tithiProgressPercent / 100) * 3));
  }
  const illuminationPercent = Math.min(100, Math.max(tithiNumber === 1 && tithiProgressPercent >= 10 ? 1 : 0, Math.round(rawIllum)));
  const isWaxing = tithiNumber <= 15;

  const pakshaExplanation = isWaxing
    ? 'Waxing fortnight: The moon gathers light from the sun. Symbolizes outward learning, initiation of constructive projects, and creative momentum.'
    : 'Waning fortnight: The moon returns light toward the source. Symbolizes introspection, detachment from fleeting gains, and reviewing past study.';

  // 3. NAKSHATRA (13° 20' = 13.3333° per asterism)
  const nakshatraIndex = Math.min(26, Math.floor(moonSidereal / (360 / 27)));
  const nakshatraMeta = NAKSHATRA_DATA[nakshatraIndex] || NAKSHATRA_DATA[0];
  const nakshatraProgress = (moonSidereal % (360 / 27)) / (360 / 27);
  const pada = Math.min(4, Math.floor(nakshatraProgress * 4) + 1);

  // 4. YOGA (Sum of Sun and Moon sidereal longitudes divided by 13° 20')
  const yogaIndex = Math.min(26, Math.floor(positiveModulo(moonSidereal + sunSidereal, 360) / (360 / 27)));
  const yogaMeta = YOGA_DATA[yogaIndex] || YOGA_DATA[0];
  const yogaProgress = (positiveModulo(moonSidereal + sunSidereal, 360) % (360 / 27)) / (360 / 27);

  // 5. KARANA (Half-tithi = 6° elongation)
  const halfTithi = Math.min(59, Math.floor(tithiRaw * 2));
  let karanaKey: string;
  if (halfTithi === 0) {
    karanaKey = 'Kimstughna';
  } else if (halfTithi === 57) {
    karanaKey = 'Shakuni';
  } else if (halfTithi === 58) {
    karanaKey = 'Chatushpada';
  } else if (halfTithi === 59) {
    karanaKey = 'Naga';
  } else {
    const repeatingKaranas = ['Bava', 'Balava', 'Kaulava', 'Taitila', 'Garaja', 'Vanija', 'Vishti'];
    karanaKey = repeatingKaranas[(halfTithi - 1) % 7];
  }
  const karanaMeta = KARANA_DATA[karanaKey] || KARANA_DATA['Bava'];
  const karanaProgress = (tithiRaw * 2) % 1;

  // 6. RITU
  const rituMeta = getVedicRitu(sunTropical);

  // 7. SOLAR TIMES
  const solarTimes = calculateSolarTimes(new Date(year, month, day, 12, 0, 0), location);

  // 8. STUDY SUGGESTION (matched with day index or tithi)
  const studySuggestion = STUDY_SUGGESTIONS[(date.getDate() + tithiNumber) % STUDY_SUGGESTIONS.length];

  // Upcoming festivals
  const upcomingFestivalsPreview = getUpcomingFestivalsPreview(date);

  // Formatted date representations
  const fullDateEnglish = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);

  const fullDateHindi = new Intl.DateTimeFormat('hi-IN', { numberingSystem: 'latn',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);

  const dayOfWeek = new Intl.DateTimeFormat('en-IN', { weekday: 'long' }).format(date);
  const dayOfWeekHi = new Intl.DateTimeFormat('hi-IN', { numberingSystem: 'latn', weekday: 'long' }).format(date);

  return {
    date,
    isoDate: `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    fullDateEnglish,
    fullDateHindi,
    dayOfWeek,
    dayOfWeekHi,
    location,
    tithi: {
      number: tithiNumber,
      name: tithiMeta.name,
      nameHi: tithiMeta.nameHi,
      transliteration: tithiMeta.transliteration,
      paksha: tithiMeta.paksha,
      pakshaHi,
      progressPercent: tithiProgressPercent,
      approxSpan: formatRemainingSpan(tithiProgress, 23.6, location.utcOffsetHours, location.timezone),
      meta: tithiMeta,
    },
    paksha: {
      name: pakshaName,
      nameHi: pakshaHi,
      transliteration: isWaxing ? 'Śukla Pakṣa' : 'Kṛṣṇa Pakṣa',
      isWaxing,
      illuminationPercent,
      explanation: pakshaExplanation,
    },
    nakshatra: {
      index: nakshatraIndex,
      pada,
      name: nakshatraMeta.name,
      nameHi: nakshatraMeta.nameHi,
      transliteration: nakshatraMeta.transliteration,
      deity: nakshatraMeta.deity,
      rulingPlanet: nakshatraMeta.rulingPlanet,
      symbol: nakshatraMeta.symbol,
      approxSpan: formatRemainingSpan(nakshatraProgress, 24.2, location.utcOffsetHours, location.timezone),
      explanation: nakshatraMeta.explanation,
      studyTheme: nakshatraMeta.studyTheme,
    },
    yoga: {
      index: yogaIndex,
      name: yogaMeta.name,
      nameHi: yogaMeta.nameHi,
      transliteration: yogaMeta.transliteration,
      nature: yogaMeta.nature,
      approxSpan: formatRemainingSpan(yogaProgress, 22.8, location.utcOffsetHours, location.timezone),
      explanation: yogaMeta.explanation,
    },
    karana: {
      name: karanaMeta.name,
      nameHi: karanaMeta.nameHi,
      transliteration: karanaMeta.transliteration,
      nature: karanaMeta.nature,
      approxSpan: formatRemainingSpan(karanaProgress, 11.8, location.utcOffsetHours, location.timezone),
      explanation: karanaMeta.explanation,
    },
    ritu: rituMeta,
    solarTimes,
    studySuggestion,
    upcomingFestivalsPreview,
  };
}
