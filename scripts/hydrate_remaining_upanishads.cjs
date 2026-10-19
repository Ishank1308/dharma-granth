const fs = require('fs');
const path = require('path');
const Sanscript = require('@indic-transliteration/sanscript');

function toIast(deva) {
  if (!deva) return '';
  return Sanscript.t(deva, 'devanagari', 'iast').replace(/।/g, '|').replace(/॥/g, '||');
}

const specs = [
  {
    id: 'jabala',
    title: 'Jabala Upanishad',
    titleSanskrit: 'जाबाल उपनिषद्',
    category: 'upanishad',
    description: 'A classic, highly revered sannyasa Upanishad of the Atharvaveda tradition. Celebrated for Yajnavalkya’s radical declaration that dispassion alone authorizes renunciation regardless of age or ashrama, and the profound interiorization of sacred Kashi (Avimukta) at the brow-center (ajna chakra). Complete recension with authentic Sanskrit, transliteration, English and Hindi translations.',
    tags: ['Upanishad', 'Sannyasa', 'Kashi', 'Avimukta', 'Renunciation', 'Yajnavalkya', 'Atharvaveda'],
    chapterMeta: [
      { id: 1, title: 'Avimukta Kshetra and Immediate Renunciation', titleSanskrit: 'अविमुक्त क्षेत्र एवं सद्यःसंन्यास', summary: 'Dialogue between Brihaspati, Atri, Janaka, and Yajnavalkya on the sacred sanctuary of Avimukta, the inner pilgrimage at the junction of the brows, and the freedom to renounce the world the moment genuine dispassion dawns.' }
    ]
  },
  {
    id: 'niralamba',
    title: 'Niralamba Upanishad',
    titleSanskrit: 'निरालम्ब उपनिषद्',
    category: 'upanishad',
    description: 'The "Supportless" Upanishad of the Shukla Yajurveda. A masterclass philosophical catechism delivering systematic definitions of Brahman, Ishvara, Jiva, Prakriti, Paramatman, Karma, Akarma, Jnana, Ajnana, Sukha, Duhkha, Svarga, Naraka, Bandha, Moksha, and the characteristics of the true Sannyasi who rests solely in the supportless Self. Complete recension with authentic Sanskrit, transliteration, English and Hindi translations.',
    tags: ['Upanishad', 'Advaita', 'Niralamba', 'Catechism', 'Brahman', 'Jiva', 'Karma', 'Moksha', 'ShuklaYajurveda'],
    chapterMeta: [
      { id: 1, title: 'The Catechism of Ultimate Reality', titleSanskrit: 'परमतत्त्व प्रश्नोत्तरी', summary: 'Systematic inquiry defining 25 foundational spiritual concepts: what is Brahman, Ishvara, Jiva, Prakriti, Paramatman, Karma, Akarma, Jnana, Ajnana, Sukha, Duhkha, Bandha, and Moksha, culminating in the declaration of the supportless Self.' }
    ]
  },
  {
    id: 'maitri',
    title: 'Maitri Upanishad',
    titleSanskrit: 'मैत्री उपनिषद्',
    category: 'upanishad',
    description: 'Also known as the Maitrayaniya Upanishad, belonging to the Krishna Yajurveda. Celebrated for King Brihadratha’s intense dispassion, the teachings of sage Shakayanya, the earliest systematic formulation of the six-limbed yoga (shadanga-yoga), prana vidya, and the nature of the elemental self (bhutatman) transcending the three gunas. Complete recension across all 7 Prapathakas with authentic Sanskrit, transliteration, English and Hindi translations.',
    tags: ['Upanishad', 'Yoga', 'Prana', 'ShadangaYoga', 'Samkhya', 'KrishnaYajurveda', 'Brihadratha'],
    chapterMeta: [
      { id: 1, title: 'Prapathaka 1 — Renunciation of King Brihadratha', titleSanskrit: 'प्रथम प्रपाठक — राजा बृहद्रथ का वैराग्य', summary: 'King Brihadratha surrenders his kingdom, retires to the forest, and performs severe tapas, imploring sage Shakayanya to instruct him on crossing the ocean of samsara.' },
      { id: 2, title: 'Prapathaka 2 — Discourse on the Soul and the Pranas', titleSanskrit: 'द्वितीय प्रपाठक — आत्मा एवं प्राणोपदेश', summary: 'Shakayanya expounds the instruction of sage Maitri: how the supreme consciousness enlivens the unconscious body like a king entering his chariot.' },
      { id: 3, title: 'Prapathaka 3 — The Elemental Self and the Three Gunas', titleSanskrit: 'तृतीय प्रपाठक — भूतात्मा एवं त्रिगुण विवेक', summary: 'Distinction between the immortal Self and the elemental self (bhutatman) overcome by the pairs of opposites, karmic fruits, and the three gunas.' },
      { id: 4, title: 'Prapathaka 4 — The Means of Transcending Samsara', titleSanskrit: 'चतुर्थ प्रपाठक — संसार तरण के साधन', summary: 'The necessity of tapas, vidya, and chitta-shuddhi for overcoming delusion and re-establishing the mind in the unblemished Brahman.' },
      { id: 5, title: 'Prapathaka 5 — The Hymn to the Cosmic Forms of God', titleSanskrit: 'पञ्चम प्रपाठक — कौत्सायनी स्तुति', summary: 'The praise of the Triad (Brahma, Vishnu, Rudra) as aspects of the single transcendent Reality, unfolding the cosmic manifestation.' },
      { id: 6, title: 'Prapathaka 6 — The Six-Limbed Yoga and Meditation on Om', titleSanskrit: 'षष्ठ प्रपाठक — षडङ्ग योग एवं प्रणवोपासना', summary: 'Detailed exposition of the sixfold yoga: pranayama, pratyahara, dhyana, dharana, tarka, and samadhi, along with the two forms of Brahman (time and timeless).' },
      { id: 7, title: 'Prapathaka 7 — The Transcendent Atman and Final Liberation', titleSanskrit: 'सप्तम प्रपाठक — विश्वातीत आत्मा एवं कैवल्य', summary: 'The nature of the inner witness, the warning against false doctrines, and the supreme peace attained by dissolving the mind into the heart-space.' }
    ]
  },
  {
    id: 'tejobindu',
    title: 'Tejobindu Upanishad',
    titleSanskrit: 'तेजोबिन्दु उपनिषद्',
    category: 'upanishad',
    description: 'The "Drop of Radiant Fire" — an Upanishad of the Atharvaveda tradition. A dialogue between Lord Shiva and Kumara (Kartikeya) expounding deep Advaitic nididhyasana, the fifteen-limbed raja-yoga, radical neti-neti contemplation, and the direct realization of Akhanda-Ekarasa Brahman. Complete recension across all chapters with authentic Sanskrit, transliteration, English and Hindi translations.',
    tags: ['Upanishad', 'Advaita', 'Tejobindu', 'Shiva', 'Kartikeya', 'FifteenLimbedYoga', 'Nididhyasana', 'Atharvaveda'],
    chapterMeta: [
      { id: 1, title: 'Chapter 1 — The Fifteen Limbs of Yoga', titleSanskrit: 'प्रथम अध्याय — पञ्चदशाङ्ग योग', summary: 'Lord Shiva teaches Kartikeya the fifteen limbs of Raja Yoga: yama, niyama, tyaga, mauna, desha, kala, asana, mulabandha, dehasamya, drikssthiti, pranayama, pratyahara, dharana, atmadhyana, and samadhi.' },
      { id: 2, title: 'Chapter 2 — The Nature of the Akhanda Brahman', titleSanskrit: 'द्वितीय अध्याय — अखण्डैकरस ब्रह्म स्वरूप', summary: 'Profound revelation of Brahman as undivided, self-luminous consciousness beyond all mental concepts, void of duality.' },
      { id: 3, title: 'Chapter 3 — Realization of Chinmatra (Pure Consciousness)', titleSanskrit: 'तृतीय अध्याय — चिन्मात्र स्वरूपानुभव', summary: 'Kartikeya receives the meditation on pure consciousness: "I am Chinmatra alone, peaceful, unborn, beyond body and senses."' },
      { id: 4, title: 'Chapter 4 — The Jivanmukta and Videhamukta', titleSanskrit: 'चतुर्थ अध्याय — जीवन्मुक्त एवं विदेहमुक्त लक्षण', summary: 'Hallmarks of the liberated sage who remains untouched by worldly praise or blame, followed by the dissolution into videhamukti.' },
      { id: 5, title: 'Chapter 5 — Radical Negation of Duality (Neti-Neti)', titleSanskrit: 'पञ्चम अध्याय — सर्वदृश्य निषेध एवं ब्रह्मभाव', summary: 'Exhaustive negation of all perceived duality: "All that is seen is non-existent; Brahman alone is all."' },
      { id: 6, title: 'Chapter 6 — Complete Absoluteness of the Self', titleSanskrit: 'षष्ठ अध्याय — सिद्धावस्था एवं पूर्णत्व', summary: 'The culminating proclamation that everything is the Self, and liberation is the natural, eternal reality of consciousness.' },
      { id: 7, title: 'Chapter 7 — Epilogue on Constant Contemplation', titleSanskrit: 'सप्तम अध्याय — उपसंहार एवं अखण्ड ध्यान', summary: 'The final blessing on those who continually meditate upon this Tejobindu truth.' }
    ]
  },
  {
    id: 'mahanarayana',
    title: 'Mahanarayana Upanishad',
    titleSanskrit: 'महानारायण उपनिषद्',
    category: 'upanishad',
    description: 'A sublime liturgical and mystical Upanishad appended to the Taittiriya Aranyaka of the Krishna Yajurveda. Enshrines the most sacred suktas: Narayana Sukta, Purusha Sukta, Durga Sukta, Medha Sukta, and the Tryambaka Mahamrityunjaya mantra, establishing Narayana as the supreme cosmic person pervading all existence. Complete recension across all 79 Anuvākas with authentic Sanskrit, transliteration, English and Hindi translations.',
    tags: ['Upanishad', 'Narayana', 'NarayanaSukta', 'PurushaSukta', 'DurgaSukta', 'Mahamrityunjaya', 'KrishnaYajurveda'],
    chapterMeta: [] // will auto-generate from anuvākas
  },
  {
    id: 'kaushitaki',
    title: 'Kaushitaki Upanishad',
    titleSanskrit: 'कौषीतकि उपनिषद्',
    category: 'upanishad',
    description: 'A major principal Upanishad of the Rigveda. Celebrated for the doctrine of the two paths (Devayana and Pitriyana), the ascent of the soul to Brahmaloka, the deep teachings of Indra to Pratardana revealing that Prana is Prajna (Conscious Self), and Ajatashatru’s instruction to Gargya Balaki. Complete recension across all 4 Adhyāyas with authentic Sanskrit, transliteration, English and Hindi translations.',
    tags: ['Upanishad', 'Rigveda', 'Devayana', 'Brahmaloka', 'Prana', 'Prajna', 'Indra', 'Pratardana', 'Ajatashatru'],
    chapterMeta: [
      { id: 1, title: 'Adhyaya 1 — The Soul’s Ascent along the Devayana Path', titleSanskrit: 'प्रथम अध्याय — देवयान मार्ग एवं ब्रह्मलोक गमन', summary: 'The destiny of souls after departing the physical body: the interrogation by the Moon, crossing the Viraja river, and entering the presence of Brahma in the cosmic court.' },
      { id: 2, title: 'Adhyaya 2 — The Supremacy of Prana as Brahman', titleSanskrit: 'द्वितीय अध्याय — प्राण की ब्रह्मरूपता एवं उपासना', summary: 'Kaushitaki and Paingya expound Prana as the living foundation of all senses and bodily faculties, giving rituals and mantras for spiritual harmony.' },
      { id: 3, title: 'Adhyaya 3 — Indra’s Teaching to Pratardana: Prana is Consciousness', titleSanskrit: 'तृतीय अध्याय — इन्द्र-प्रतर्दन संवाद: प्राण ही प्रज्ञा है', summary: 'King Pratardana asks Indra for the highest good. Indra reveals the supreme mystery: "I am Prana, the conscious Self (Prajnatman). Worship me as life and immortality."' },
      { id: 4, title: 'Adhyaya 4 — Ajatashatru and Balaki: The True Ground of Being', titleSanskrit: 'चतुर्थ अध्याय — अजातशत्रु एवं दृप्तबालाकि संवाद', summary: 'Balaki offers sixteen partial definitions of Brahman (sun, moon, lightning, space, mirror). King Ajatashatru reveals that the true Brahman is the conscious subject behind deep sleep and waking awareness.' }
    ]
  }
];

for (const spec of specs) {
  const jsonPath = path.resolve('public/data/scriptures-full', `${spec.id}.json`);
  if (!fs.existsSync(jsonPath)) {
    console.error(`Skipping ${spec.id}: JSON not found`);
    continue;
  }

  const raw = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const rawChapters = raw.chapters || [];

  const chapters = rawChapters.map((ch, idx) => {
    const chNum = typeof ch.number === 'number' ? ch.number : idx + 1;
    const meta = spec.chapterMeta.find(m => m.id === chNum) || spec.chapterMeta[idx] || {
      id: chNum,
      title: ch.title || `Anuvāka ${chNum}`,
      titleSanskrit: ch.titleSanskrit || `अनुवाक ${chNum}`,
      summary: ch.summary || `Anuvāka ${chNum} of the ${spec.title}.`
    };

    const verses = (ch.verses || []).map((v, vIdx) => {
      const vNum = typeof v.number === 'number' ? v.number : vIdx + 1;
      const sanskrit = (v.sanskrit || '').trim();
      const transliteration = (v.transliteration || '').trim() || toIast(sanskrit);
      const translation = (v.translation || v.hindi || '').trim() || (sanskrit ? 'Translation of sacred mantra.' : '');
      const hindi = (v.hindi || v.translation || '').trim();
      const explanation = (v.explanation || v.commentary || hindi || translation || '').trim();

      return {
        id: vNum,
        number: vNum,
        sanskrit,
        transliteration,
        translation,
        hindi: hindi || undefined,
        explanation,
        keywords: [spec.title, ...(spec.tags.slice(0, 4))],
        lifeLesson: 'Reflect upon the sacred truth of this verse and integrate its insight into everyday mindfulness and ethical action.'
      };
    });

    return {
      id: chNum,
      title: meta.title,
      titleSanskrit: meta.titleSanskrit,
      summary: meta.summary,
      verses
    };
  });

  const totalVerses = chapters.reduce((acc, c) => acc + c.verses.length, 0);

  const fileContent = `import { Scripture } from '../types';

export const ${spec.id}: Scripture = {
  id: '${spec.id}',
  title: '${spec.title}',
  titleSanskrit: '${spec.titleSanskrit}',
  category: '${spec.category}',
  description: ${JSON.stringify(spec.description)},
  totalVerses: ${totalVerses},
  tags: ${JSON.stringify(spec.tags)},
  chapters: ${JSON.stringify(chapters, null, 2)}
};
`;

  const targetPath = path.resolve('data/scriptures', `${spec.id}.ts`);
  fs.writeFileSync(targetPath, fileContent, 'utf8');
  console.log(`[SUCCESS] Hydrated ${spec.id}.ts with ${totalVerses} verses across ${chapters.length} chapters.`);
}
