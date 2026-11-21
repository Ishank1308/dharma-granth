import type { PhotoId } from './scene-photos';

/**
 * Pictures for pages outside the reader: festival, character and mantra pages, and the main
 * section pages (Library, Learn, Practice and the rest). They reuse the photographs and
 * classical paintings already behind the chapters (app/styles/photos/, chosen in
 * data/scene-photos/manifest.json, each public domain or under a Creative Commons licence and
 * credited on /sources/#picture-credits). Next emits a picture a stylesheet names once, as one
 * hashed file, so showing it on more pages adds no file to the export.
 *
 * `yogi` has no photo yet, so it is left out of the type: every id here has a file.
 * tests/page-photos.spec.ts checks that each picture loads on its page.
 */
export type CoverPhoto = Exclude<PhotoId, 'yogi'>;

export const FESTIVAL_PHOTOS: Readonly<Record<string, CoverPhoto>> = {
  diwali: 'lamp',
  holi: 'vrindavan', // the Holi of Braj
  navaratri: 'devi',
  janmashtami: 'stars', // born at midnight
  shivaratri: 'kailash',
  'ganesh-chaturthi': 'temple',
  ramnavami: 'palace', // Ayodhya, as in the Ramayana chapters
  'gita-jayanti': 'gita-chariot',
  'guru-purnima': 'ashram',
};

export const CHARACTER_PHOTOS: Readonly<Record<string, CoverPhoto>> = {
  krishna: 'vrindavan',
  arjuna: 'gita-chariot',
  bhishma: 'dusk', // waiting by the river for the sun's turn north
  rama: 'palace',
  sita: 'ashram',
  hanuman: 'setu', // the leap across the sea
  yudhishthira: 'lotus', // the Yaksha's lake
  duryodhana: 'kurukshetra',
  karna: 'kurukshetra', // the painting is Arjuna and Krishna facing Karna
  shiva: 'kailash',
  vishnu: 'ocean',
  valmiki: 'forest',
  vyasa: 'manuscript',
  shankara: 'ganga', // Kashi
  ramanuja: 'temple',
  nachiketa: 'yajna', // the fire Yama taught him
  janaka: 'dawn', // Sita found in the furrow
  vidura: 'palace',
  ganesha: 'manuscript', // the scribe of the Mahabharata
  durga: 'devi',
  saraswati: 'lotus',
  lakshmi: 'lamp',
  draupadi: 'yajna', // born of the sacrificial fire
  lakshmana: 'forest',
  prahlada: 'pillar',
};

export const MANTRA_PHOTOS: Readonly<Record<string, CoverPhoto>> = {
  'gayatri-mantra': 'dawn', // Savitr, the rising sun
  mahamrityunjaya: 'kailash',
  'asato-ma-sadgamaya': 'lamp', // from darkness to light
  purnamadah: 'ocean',
  'sahana-vavatu': 'ashram', // teacher and student
  'sarve-bhavantu-sukhinah': 'lotus',
  'nirvana-shatakam': 'kailash',
  'shiva-tandava': 'storm',
  'purusha-sukta': 'yajna', // the first sacrifice
  'hanuman-chalisa': 'setu',
  'aditya-hridaya-stotra': 'vishvarupa', // the sun through clouds
  'shri-suktam': 'lotus',
  'kanakadhara-stotram': 'lotus',
  madhurashtakam: 'vrindavan',
  lingashtakam: 'temple', // Kandariya Mahadeva, a Shiva temple
  'shiva-panchakshara-stotram': 'temple',
  achyutashtakam: 'vrindavan',
  'ganapati-atharvashirsha': 'temple',
  'sankat-mochan-hanuman-ashtak': 'lanka',
  'bajrang-baan': 'kishkindha',
  'mahishasura-mardini-stotram': 'devi',
  'shiv-chalisa': 'kailash',
  'argala-stotram': 'devi',
  'devi-kavacham': 'devi',
  'keelaka-stotram': 'lamp',
  'tantroktam-ratri-suktam': 'stars', // the hymn to night
  'navagraha-stotram': 'cosmos',
  'dakshinamurthy-stotram': 'forest', // the teacher under the banyan
  'shiva-mahimna-stotram': 'kailash',
  'lalita-sahasranama': 'devi',
};
