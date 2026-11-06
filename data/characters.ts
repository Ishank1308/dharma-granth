export type CharacterCategory = 'mahabharata' | 'ramayana' | 'purana' | 'guru-shishya' | 'dynasty' | 'rishi' | 'deity';

export interface CharacterRelation {
  name: string;
  relation: string;
  characterId?: string;
}

export interface CharacterEvent {
  title: string;
  description: string;
}

export interface CharacterDialogue {
  speaker: string;
  context: string;
  text: string;
  reference: string;
}

export interface CharacterDilemma {
  title: string;
  description: string;
  resolution: string;
}

export interface CharacterVerse {
  sanskrit: string;
  transliteration?: string;
  translation: string;
  reference: string;
}

export interface CharacterInterpretation {
  tradition: string;
  view: string;
}

export interface Character {
  id: string;
  name: string;
  sanskrit: string;
  category: CharacterCategory;
  shortDesc: string;
  biography: string;
  icon: string;
  gradient: string;
  relations: CharacterRelation[];
  events: CharacterEvent[];
  dialogues: CharacterDialogue[];
  dilemmas: CharacterDilemma[];
  verses: CharacterVerse[];
  interpretations: CharacterInterpretation[];
}

export const characterCategories: { key: CharacterCategory; label: string; sanskrit: string; gradient: string }[] = [
  { key: 'mahabharata', label: 'Mahābhārata', sanskrit: 'महाभारत', gradient: 'from-amber-500 to-orange-600' },
  { key: 'ramayana', label: 'Rāmāyaṇa', sanskrit: 'रामायण', gradient: 'from-blue-500 to-indigo-600' },
  { key: 'purana', label: 'Purāṇic', sanskrit: 'पुराण', gradient: 'from-purple-500 to-violet-600' },
  { key: 'guru-shishya', label: 'Guru–Śiṣya', sanskrit: 'गुरुशिष्य', gradient: 'from-emerald-500 to-teal-600' },
  { key: 'dynasty', label: 'Dynasties', sanskrit: 'वंश', gradient: 'from-rose-500 to-pink-600' },
  { key: 'rishi', label: 'Ṛṣis', sanskrit: 'ऋषि', gradient: 'from-saffron-500 to-amber-600' },
  { key: 'deity', label: 'Deities', sanskrit: 'देव', gradient: 'from-violet-500 to-purple-600' },
];

export const characters: Character[] = [
  {
    id: 'krishna',
    name: 'Krishna',
    sanskrit: 'कृष्ण',
    category: 'mahabharata',
    icon: '🪈',
    gradient: 'from-blue-500 to-indigo-600',
    shortDesc: 'Avatar of Vishnu, charioteer of Arjuna, and author of the Bhagavad Gita.',
    biography: 'Krishna is the eighth avatar of Vishnu, born to Devaki and Vasudeva in Mathura. He spent his childhood in Vrindavan under the care of Yashoda and Nanda. He played a pivotal role in the Mahabharata as the charioteer and guide of Arjuna, delivering the Bhagavad Gita on the battlefield of Kurukshetra. He was the king of Dwaraka, a strategist, diplomat, and the supreme teacher of yoga, bhakti, and jnana.',
    relations: [
      { name: 'Vasudeva', relation: 'Father' },
      { name: 'Devaki', relation: 'Mother' },
      { name: 'Balarama', relation: 'Elder brother' },
      { name: 'Subhadra', relation: 'Sister' },
      { name: 'Arjuna', relation: 'Friend and cousin (via Subhadra)' },
      { name: 'Rukmini', relation: 'Chief queen' },
      { name: 'Yashoda', relation: 'Foster mother' },
    ],
    events: [
      { title: 'Birth in Mathura', description: 'Born in a prison to Devaki and Vasudeva, transferred to Gokul to escape Kamsa.' },
      { title: 'Childhood in Vrindavan', description: 'Raised by Yashoda and Nanda; performed many divine deeds (lila) including lifting Govardhana Hill.' },
      { title: 'Defeat of Kamsa', description: 'Returned to Mathura and killed the tyrant Kamsa, freeing his parents.' },
      { title: 'Establishment of Dwaraka', description: 'Founded the city of Dwaraka and became its king.' },
      { title: 'Bhagavad Gita', description: 'Delivered the divine discourse to Arjuna at Kurukshetra.' },
      { title: 'Kurukshetra War', description: 'Served as Arjuna\'s charioteer without fighting, guiding the Pandavas to victory.' },
    ],
    dialogues: [
      { speaker: 'Krishna', context: 'To Arjuna on the battlefield of Kurukshetra', text: 'You have a right to perform your prescribed duties, but never to the fruits of action. Never consider yourself the cause of the results, nor be attached to inaction.', reference: 'Bhagavad Gita 2.47' },
      { speaker: 'Krishna', context: 'On the nature of the Self', text: 'The Self is never born and never dies. Unborn, eternal, ever-existing, it is not destroyed when the body is destroyed.', reference: 'Bhagavad Gita 2.20' },
      { speaker: 'Krishna', context: 'The final teaching', text: 'Abandon all dharmas and surrender to Me alone. I shall liberate you from all sins — do not fear.', reference: 'Bhagavad Gita 18.66' },
    ],
    dilemmas: [
      { title: 'To fight or not', description: 'Arjuna\'s dilemma about fighting his own family — Krishna resolves it by teaching karma yoga and the eternal nature of the Self.', resolution: 'Krishna teaches that the Self cannot be killed, and that performing one\'s duty without attachment is the highest path.' },
      { title: 'Krishna\'s own vow', description: 'Krishna vowed not to fight in the Kurukshetra war, yet his side needed to win.', resolution: 'He chose to be Arjuna\'s charioteer — guiding without fighting, demonstrating that wisdom can be more powerful than weapons.' },
    ],
    verses: [
      { sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन', transliteration: 'karmaṇyevādhikāraste mā phaleṣu kadācana', translation: 'You have a right to action alone, never to its fruits.', reference: 'Bhagavad Gita 2.47' },
      { sanskrit: 'यदा यदा हि धर्मस्य ग्लानिर्भवति भारत', transliteration: 'yadā yadā hi dharmasya glānirbhavati bhārata', translation: 'Whenever dharma declines, I manifest Myself.', reference: 'Bhagavad Gita 4.7' },
      { sanskrit: 'सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज', transliteration: 'sarvadharmānparityajya māmekaṃ śaraṇaṃ vraja', translation: 'Abandon all dharmas and surrender to Me alone.', reference: 'Bhagavad Gita 18.66' },
    ],
    interpretations: [
      { tradition: 'Gaudiya Vaishnavism', view: 'Krishna is the Supreme Personality of Godhead (svayam bhagavan), the source of all avatars including Vishnu. The highest goal is pure devotional love (prema bhakti).' },
      { tradition: 'Sri Vaishnavism', view: 'Krishna is an avatar of Vishnu (Narayana). The Gita teaches prapatti (surrender) as the means to moksha.' },
      { tradition: 'Advaita Vedanta', view: 'Krishna represents the supreme Brahman. The Gita\'s highest teaching is jnana yoga — realization of the identity of Atman and Brahman.' },
      { tradition: 'Dvaita Vedanta', view: 'Krishna is the supreme God, eternally distinct from individual souls. Bhakti and grace are essential for liberation.' },
    ],
  },
  {
    id: 'arjuna',
    name: 'Arjuna',
    sanskrit: 'अर्जुन',
    category: 'mahabharata',
    icon: '🏹',
    gradient: 'from-amber-500 to-orange-600',
    shortDesc: 'The greatest archer of his age, recipient of the Bhagavad Gita.',
    biography: 'Arjuna is the third of the five Pandava brothers, son of Kunti and Pandu (blessed by Indra). He was the greatest archer of his time, trained by Drona. He received the divine weapons of Shiva and Agni. On the battlefield of Kurukshetra, he faced a moral crisis that led to the Bhagavad Gita. After the war, he ruled with Yudhishthira and ultimately retired to the Himalayas.',
    relations: [
      { name: 'Kunti', relation: 'Mother' },
      { name: 'Pandu', relation: 'Father (adoptive)' },
      { name: 'Yudhishthira', relation: 'Elder brother' },
      { name: 'Bhima', relation: 'Elder brother' },
      { name: 'Nakula', relation: 'Younger brother' },
      { name: 'Sahadeva', relation: 'Youngest brother' },
      { name: 'Krishna', relation: 'Friend, guide, and brother-in-law' },
      { name: 'Draupadi', relation: 'Wife (shared with brothers)' },
      { name: 'Subhadra', relation: 'Wife' },
      { name: 'Abhimanyu', relation: 'Son (with Subhadra)' },
    ],
    events: [
      { title: 'Training under Drona', description: 'Mastered archery, won the competition at Hastinapura, earning Drona\'s blessing.' },
      { title: 'Exile and Virata', description: 'Spent 13 years in exile, the last year incognito in King Virata\'s court as a eunuch dance teacher.' },
      { title: 'Bhagavad Gita', description: 'Received Krishna\'s teaching on the battlefield of Kurukshetra.' },
      { title: 'Kurukshetra War', description: 'Fought as the Pandavas\' chief warrior, slaying Bhishma, Jayadratha, and Karna.' },
      { title: 'Ashvamedha Yajna', description: 'Led the horse sacrifice for Yudhishthira\'s empire, defeating remaining enemies.' },
    ],
    dialogues: [
      { speaker: 'Arjuna', context: 'On the battlefield, overwhelmed by grief', text: 'I see no good in killing my own family. My limbs fail, my mouth is dry, my body trembles. I cannot stand.', reference: 'Bhagavad Gita 1.28-30' },
      { speaker: 'Arjuna', context: 'Surrendering to Krishna', text: 'I am Your disciple. My mind is confused about my duty. I surrender to You. Please instruct me — I am Your disciple.', reference: 'Bhagavad Gita 2.7' },
    ],
    dilemmas: [
      { title: 'To fight or not to fight', description: 'Arjuna sees his family on the opposing side and collapses in grief, refusing to fight.', resolution: 'Krishna teaches him the eternal nature of the Self, karma yoga, and dharma — Arjuna rises and fights.' },
      { title: 'Abhimanyu\'s death', description: 'His son Abhimanyu was killed unfairly in the chakravyuha. Arjuna vowed to kill Jayadratha by sunset or burn himself.', resolution: 'Krishna used his discus to create an illusion of sunset, making Jayadratha emerge — then Arjuna killed him.' },
    ],
    verses: [
      { sanskrit: 'कथं भीष्ममहं सङ्ख्ये द्रोणं च मधुसूदन', transliteration: 'kathaṃ bhīṣmamahaṃ saṅkhye droṇaṃ ca madhusūdana', translation: 'How can I fight Bhishma and Drona in battle, O Madhusudana?', reference: 'Bhagavad Gita 2.4' },
      { sanskrit: 'शिष्यस्तेऽहं शाधि मां त्वां प्रपन्नम्', transliteration: 'śiṣyaste\'haṃ śādhi māṃ tvāṃ prapannam', translation: 'I am Your disciple. Please instruct me, for I have surrendered to You.', reference: 'Bhagavad Gita 2.7' },
    ],
    interpretations: [
      { tradition: 'Advaita Vedanta', view: 'Arjuna represents the individual soul (jiva) in confusion. Krishna represents the inner Self (Atman) that awakens the jiva to its true nature.' },
      { tradition: 'Bhakti traditions', view: 'Arjuna is the ideal devotee — one who surrenders completely to the Lord and receives divine grace and knowledge.' },
      { tradition: 'Karma Yoga reading', view: 'Arjuna represents every person facing the dilemma of duty vs. emotion. His crisis is universal — the path of selfless action is the solution.' },
    ],
  },
  {
    id: 'bhishma',
    name: 'Bhishma',
    sanskrit: 'भीष्म',
    category: 'mahabharata',
    icon: '⚔️',
    gradient: 'from-amber-500 to-orange-600',
    shortDesc: 'The grandsire of the Kuru dynasty, bound by a terrible vow of lifelong celibacy.',
    biography: 'Bhishma (originally Devavrata) was the son of King Shantanu and Ganga. To fulfill his father\'s desire to marry Satyavati, he took a terrible vow (bhishana pratijna) of lifelong celibacy and renunciation of the throne. He served the Kuru dynasty through three generations. In the Kurukshetra war, he led the Kaurava army for 10 days before falling on a bed of arrows, waiting until Uttarayana to die.',
    relations: [
      { name: 'Shantanu', relation: 'Father' },
      { name: 'Ganga', relation: 'Mother (river goddess)' },
      { name: 'Vichitravirya', relation: 'Half-brother' },
      { name: 'Chitrangada', relation: 'Half-brother' },
      { name: 'Dhritarashtra', relation: 'Nephew (grand-nephew technically)' },
      { name: 'Pandu', relation: 'Nephew' },
      { name: 'Duryodhana', relation: 'Grand-nephew' },
      { name: 'Yudhishthira', relation: 'Grand-nephew' },
    ],
    events: [
      { title: 'The Terrible Vow', description: 'Renounced the throne and took a vow of celibacy so his father could marry Satyavati.' },
      { title: 'Abduction of Amba, Ambika, Ambalika', description: 'Won the three princesses of Kashi for his half-brother — but Amba loved another, leading to a tragic chain.' },
      { title: 'Kurukshetra War', description: 'Commander of the Kaurava forces for 10 days, fighting fiercely but not killing the Pandavas.' },
      { title: 'Fall on a Bed of Arrows', description: 'Pierced by Arjuna\'s arrows (with Shikhandi as shield), he lay on a bed of arrows, choosing to die at Uttarayana.' },
      { title: 'Vishnu Sahasranama', description: 'While on the bed of arrows, he recited the thousand names of Vishnu to Yudhishthira.' },
    ],
    dialogues: [
      { speaker: 'Bhishma', context: 'To Yudhishthira on the bed of arrows', text: 'Duty (dharma) is subtle and difficult to discern. Even the wise are confused. I have served the Kuru house my entire life, bound by my vow.', reference: 'Mahabharata, Shanti Parva' },
    ],
    dilemmas: [
      { title: 'The vow of celibacy', description: 'His father Shantanu wanted to marry Satyavati, but her father demanded the throne for her children. Bhishma renounced everything.', resolution: 'He took the vow, earning the boon of choosing his own time of death — but binding himself to serve whoever sat on the throne.' },
      { title: 'Fighting for the Kauravas', description: 'Bhishma knew the Pandavas were righteous, yet his vow bound him to the throne — which was held by Duryodhana.', resolution: 'He fought for the Kauravas but vowed not to kill the Pandavas. He fell by his own choice, pierced by Arjuna\'s arrows.' },
    ],
    verses: [
      { sanskrit: 'धर्मो रक्षति रक्षितः', transliteration: 'dharmo rakṣati rakṣitaḥ', translation: 'Dharma protects those who protect it.', reference: 'Manusmriti 8.15' },
    ],
    interpretations: [
      { tradition: 'Traditional', view: 'Bhishma is the ideal of duty and sacrifice — a man who gave up everything for his father\'s happiness and served the kingdom faithfully.' },
      { tradition: 'Critical reading', view: 'Bhishma\'s rigid adherence to his vow became a trap. His silence during Draupadi\'s disrobing shows the danger of duty without moral courage.' },
    ],
  },
  {
    id: 'rama',
    name: 'Rama',
    sanskrit: 'राम',
    category: 'ramayana',
    icon: '🏹',
    gradient: 'from-blue-500 to-indigo-600',
    shortDesc: 'The seventh avatar of Vishnu, embodiment of dharma and the ideal king.',
    biography: 'Rama is the seventh avatar of Vishnu, the prince of Ayodhya and the hero of the Ramayana. Born to Dasharatha and Kausalya, he was exiled for 14 years due to Kaikeyi\'s demands. In the forest, his wife Sita was abducted by Ravana. With the help of Hanuman and the Vanara army, he defeated Ravana and rescued Sita. He returned to Ayodhya and established Rama Rajya — the ideal kingdom. His life is the supreme example of dharma in action.',
    relations: [
      { name: 'Dasharatha', relation: 'Father' },
      { name: 'Kausalya', relation: 'Mother' },
      { name: 'Bharata', relation: 'Brother' },
      { name: 'Lakshmana', relation: 'Brother' },
      { name: 'Shatrughna', relation: 'Brother' },
      { name: 'Sita', relation: 'Wife' },
      { name: 'Hanuman', relation: 'Greatest devotee' },
      { name: 'Ravana', relation: 'Antagonist' },
      { name: 'Lava', relation: 'Son' },
      { name: 'Kusha', relation: 'Son' },
    ],
    events: [
      { title: 'Birth in Ayodhya', description: 'Born as the eldest son of King Dasharatha after a great sacrifice.' },
      { title: 'Exile to the Forest', description: 'On the eve of his coronation, Kaikeyi demanded his exile. Rama accepted without protest.' },
      { title: 'Abduction of Sita', description: 'Ravana abducted Sita from the forest; Rama searched for her with Lakshmana.' },
      { title: 'Alliance with Sugriva', description: 'Formed an alliance with the Vanara king Sugriva and gained Hanuman\'s devotion.' },
      { title: 'Bridge to Lanka', description: 'Built a bridge across the ocean with the Vanara army.' },
      { title: 'Defeat of Ravana', description: 'Killed Ravana in battle and rescued Sita.' },
      { title: 'Return to Ayodhya', description: 'Returned after 14 years and was crowned king, establishing Rama Rajya.' },
    ],
    dialogues: [
      { speaker: 'Rama', context: 'To Kaikeyi, accepting exile', text: 'I shall go to the forest for fourteen years, wearing bark garments, as you have commanded. I give my word.', reference: 'Ramayana, Ayodhya Kanda' },
      { speaker: 'Rama', context: 'To Lakshmana, on duty', text: 'There is no greater dharma than truth. There is nothing higher than a mother and father. I must obey my father\'s command.', reference: 'Ramayana, Ayodhya Kanda' },
    ],
    dilemmas: [
      { title: 'Exile vs. Coronation', description: 'Rama was about to be crowned king, but Kaikeyi demanded his exile. He could have refused — he had the right and the power.', resolution: 'Rama chose exile without hesitation, prioritizing his father\'s word and dharma over personal desire.' },
      { title: 'Sita\'s abandonment', description: 'After rescuing Sita, public rumors about her purity led Rama to abandon her in the forest despite knowing she was pure.', resolution: 'Rama chose his duty as king over personal happiness — one of the most debated decisions in Hindu literature.' },
    ],
    verses: [
      { sanskrit: 'रामो विग्रहवान् धर्मः', transliteration: 'rāmo vigrahavān dharmaḥ', translation: 'Rama is dharma personified.', reference: 'Ramayana, Valmiki' },
      { sanskrit: 'धर्मो रक्षति रक्षितः', transliteration: 'dharmo rakṣati rakṣitaḥ', translation: 'Dharma protects those who protect it.', reference: 'Manusmriti 8.15' },
    ],
    interpretations: [
      { tradition: 'Valmiki Ramayana', view: 'Rama is a human hero (maryada purushottama) — the ideal man who exemplifies dharma through personal sacrifice.' },
      { tradition: 'Tulsidas (Ramcharitmanas)', view: 'Rama is the supreme Lord (bhagavan) — his human actions are divine lila. Sita is Lakshmi, and devotion to Rama is the path to liberation.' },
      { tradition: 'Ramanuja (Sri Vaishnavism)', view: 'Rama as an avatar of Vishnu demonstrates that God descends to restore dharma and show the path of righteousness.' },
    ],
  },
  {
    id: 'sita',
    name: 'Sita',
    sanskrit: 'सीता',
    category: 'ramayana',
    icon: '🌸',
    gradient: 'from-blue-500 to-indigo-600',
    shortDesc: 'Avatar of Lakshmi, the ideal wife and embodiment of purity and strength.',
    biography: 'Sita is the daughter of King Janaka of Mithila, found in a furrow (sita) and adopted. She married Rama after breaking Shiva\'s bow. She followed Rama into exile voluntarily. Abducted by Ravana, she remained faithful in Lanka for a year. After rescue, she underwent a fire ordeal (agni pariksha) to prove her purity. Later, she was abandoned while pregnant due to public suspicion. She raised Lava and Kusha in Valmiki\'s ashram. Ultimately, she returned to her mother, the Earth.',
    relations: [
      { name: 'Janaka', relation: 'Father (adoptive)' },
      { name: 'Rama', relation: 'Husband' },
      { name: 'Lava', relation: 'Son' },
      { name: 'Kusha', relation: 'Son' },
      { name: 'Urmila', relation: 'Sister (co-wife of Lakshmana)' },
      { name: 'Ravana', relation: 'Abductor' },
    ],
    events: [
      { title: 'Birth and Swayamvara', description: 'Born from the Earth; won Rama\'s hand by stringing Shiva\'s bow.' },
      { title: 'Exile with Rama', description: 'Chose to accompany Rama to the forest, renouncing palace life.' },
      { title: 'Abduction by Ravana', description: 'Tricked by the golden deer, she was abducted while Rama and Lakshmana were away.' },
      { title: 'Captivity in Lanka', description: 'Remained in Ravana\'s garden under guard, refusing all advances, sustained by thoughts of Rama.' },
      { title: 'Fire Ordeal', description: 'After rescue, she entered fire to prove her purity — Agni himself carried her out unharmed.' },
      { title: 'Abandonment', description: 'Pregnant and abandoned by Rama due to public rumor; raised her sons in Valmiki\'s ashram.' },
      { title: 'Return to Earth', description: 'When asked to prove her purity again, she asked the Earth to take her back — and the Earth opened and received her.' },
    ],
    dialogues: [
      { speaker: 'Sita', context: 'To Ravana in Lanka, refusing him', text: 'I am like the wind — you cannot grasp me. I belong to Rama alone. You will be destroyed by Rama\'s arrows.', reference: 'Ramayana, Sundara Kanda' },
      { speaker: 'Sita', context: 'To Rama, before entering the fire', text: 'If my heart has never strayed from Rama, let the fire protect me.', reference: 'Ramayana, Yuddha Kanda' },
    ],
    dilemmas: [
      { title: 'The golden deer', description: 'Sita insisted Rama chase the golden deer (Maricha in disguise), leading to her abduction.', resolution: 'Her desire for the deer — however innocent — set the chain of events in motion. The Ramayana explores how even small desires can have vast consequences.' },
      { title: 'The fire ordeal', description: 'After being rescued, Sita was asked to prove her purity through fire.', resolution: 'She entered the fire willingly — and Agni himself refused to burn her, declaring her pure. This scene is interpreted differently across traditions.' },
    ],
    verses: [
      { sanskrit: 'अहमस्मि सीता भूमिः', transliteration: 'aham asmi sītā bhūmiḥ', translation: 'I am Sita, born of the Earth — daughter of the furrow.', reference: 'Ramayana, Valmiki' },
    ],
    interpretations: [
      { tradition: 'Valmiki Ramayana', view: 'Sita is a human queen of extraordinary virtue. Her suffering raises profound questions about justice and the cost of dharma.' },
      { tradition: 'Tulsidas', view: 'Sita is Lakshmi, the divine consort. Her actions are lila — she cannot be truly harmed. Devotion to Sita-Rama together is the path.' },
      { tradition: 'Feminist readings', view: 'Sita represents the strength and suffering of women. Her abandonment raises questions about patriarchal duty and the cost of "ideal" kingship.' },
    ],
  },
  {
    id: 'hanuman',
    name: 'Hanuman',
    sanskrit: 'हनुमान्',
    category: 'ramayana',
    icon: '🐒',
    gradient: 'from-blue-500 to-indigo-600',
    shortDesc: 'The greatest devotee of Rama, the embodiment of strength, devotion, and service.',
    biography: 'Hanuman is the son of Vayu (the wind god) and Anjana, a Vanara woman. He is an incarnation of Shiva. He served Rama with absolute devotion, leaping across the ocean to Lanka to find Sita, carrying Rama\'s ring, and later carrying the entire mountain of Sanjivani to save Lakshmana. He is chiranjeevi (immortal) and is considered the greatest exemplar of bhakti and seva (selfless service).',
    relations: [
      { name: 'Vayu', relation: 'Father (divine)' },
      { name: 'Anjana', relation: 'Mother' },
      { name: 'Kesari', relation: 'Father (adoptive)' },
      { name: 'Rama', relation: 'Lord and master' },
      { name: 'Sugriva', relation: 'King and friend' },
      { name: 'Sita', relation: 'Devotee of' },
    ],
    events: [
      { title: 'Leap to Lanka', description: 'Jumped across the ocean to find Sita in Ravana\'s Ashoka garden.' },
      { title: 'Burning of Lanka', description: 'After being captured, his tail was set on fire. He used it to burn Lanka before returning.' },
      { title: 'Sanjivani Mountain', description: 'Lifted the entire Dronagiri mountain to bring the life-saving herb for Lakshmana.' },
      { title: 'Rama\'s Blessing', description: 'Rama blessed him with immortality and eternal devotion — wherever Rama\'s name is spoken, Hanuman is present.' },
    ],
    dialogues: [
      { speaker: 'Hanuman', context: 'To Rama, revealing his devotion', text: 'When I am in my body, I am Your servant. When I am in my mind, I am Your servant. When I am in my soul, I am You.', reference: 'Ramcharitmanas, Kishkindha Kanda' },
    ],
    dilemmas: [
      { title: 'Whether to fight or serve', description: 'Hanuman had immense power but chose to always serve Rama rather than act independently.', resolution: 'He demonstrated that the highest use of power is in service — dasya bhakti (servant-devotion) is the supreme path.' },
    ],
    verses: [
      { sanskrit: 'राम दूत अतुलित बल धामा', transliteration: 'rāma dūta atulita bala dhāmā', translation: 'Rama\'s messenger, the abode of incomparable strength.', reference: 'Hanuman Chalisa' },
      { sanskrit: 'सनकार नन्दन वायु पुत्र', transliteration: 'śaṅkara nandana vāyu putra', translation: 'Son of Shiva, son of the wind — the greatest devotee.', reference: 'Hanuman Chalisa' },
    ],
    interpretations: [
      { tradition: 'Valmiki Ramayana', view: 'Hanuman is a powerful Vanara minister and devotee — a model of loyalty, strength, and intelligence.' },
      { tradition: 'Tulsidas', view: 'Hanuman is the embodiment of bhakti. He is the gateway to Rama — no one can approach Rama without Hanuman\'s grace.' },
      { tradition: 'Shiva tradition', view: 'Hanuman is an avatar of Shiva, born to serve Vishnu\'s avatar Rama — the union of Shaiva and Vaishnava devotion.' },
    ],
  },
  {
    id: 'yudhishthira',
    name: 'Yudhishthira',
    sanskrit: 'युधिष्ठिर',
    category: 'mahabharata',
    icon: '👑',
    gradient: 'from-amber-500 to-orange-600',
    shortDesc: 'The eldest Pandava, son of Dharma (Yama), embodiment of truth and righteousness.',
    biography: 'Yudhishthira is the eldest Pandava, born to Kunti through the blessing of Yama (Dharmaraja). He is known for his unwavering commitment to truth and dharma. He lost his kingdom in a dice game, spent 13 years in exile, and fought the Kurukshetra war. After victory, he performed the Ashvamedha and ruled Hastinapura. In the end, he ascended to heaven — but was tested one final time by his father Dharma.',
    relations: [
      { name: 'Kunti', relation: 'Mother' },
      { name: 'Yama (Dharmaraja)', relation: 'Divine father' },
      { name: 'Bhima', relation: 'Brother' },
      { name: 'Arjuna', relation: 'Brother' },
      { name: 'Nakula', relation: 'Brother' },
      { name: 'Sahadeva', relation: 'Brother' },
      { name: 'Draupadi', relation: 'Wife' },
      { name: 'Duryodhana', relation: 'Cousin and rival' },
    ],
    events: [
      { title: 'Dice Game', description: 'Lost his kingdom, brothers, and wife in the rigged dice game with Shakuni.' },
      { title: 'Exile', description: 'Spent 12 years in forest exile and 1 year incognito.' },
      { title: 'Kurukshetra War', description: 'Led the Pandava army as king, though reluctant to fight.' },
      { title: 'Rajasuya and Ashvamedha', description: 'Performed the great sacrifices to establish his sovereignty.' },
      { title: 'Final Journey', description: 'Retired to the Himalayas with his brothers and Draupadi. Only he and a dog (Dharma in disguise) reached heaven.' },
    ],
    dialogues: [
      { speaker: 'Yudhishthira', context: 'To the Yaksha, answering the final question', text: 'The most wonderful thing in the world is that though humans see death all around them, they live as if they will never die.', reference: 'Mahabharata, Aranyaka Parva (Yaksha Prashna)' },
    ],
    dilemmas: [
      { title: 'The dice game', description: 'Yudhishthira knew the game was rigged but could not refuse a challenge — his sense of kshatriya honor compelled him.', resolution: 'He played and lost everything. The Mahabharata shows how even the righteous can be trapped by their own virtues.' },
      { title: 'The lie about Ashwatthama', description: 'Krishna suggested Yudhishthira say "Ashwatthama is dead" (with the implication it was the elephant) to break Drona.', resolution: 'Yudhishthira said "Ashwatthama is dead" but added "the elephant" in a whisper — his chariot dropped from the ground because of this half-truth.' },
    ],
    verses: [
      { sanskrit: 'अहन्यानि भवन्ति ये गच्छन्ति न तु पुनः पुनः', transliteration: 'ahanyāni bhavanti ye gacchanti na tu punaḥ punaḥ', translation: 'Days come and go, never to return — yet people live as though they are immortal. This is the greatest wonder.', reference: 'Mahabharata, Yaksha Prashna' },
    ],
    interpretations: [
      { tradition: 'Traditional', view: 'Yudhishthira is Dharmaraja — the embodiment of dharma. His flaws show that even the righteous face moral complexity.' },
      { tradition: 'Critical reading', view: 'Yudhishthira\'s rigid adherence to rules and inability to say no led to catastrophe. Dharma is not just rule-following — it requires wisdom.' },
    ],
  },
  {
    id: 'duryodhana',
    name: 'Duryodhana',
    sanskrit: 'दुर्योधन',
    category: 'mahabharata',
    icon: '🎲',
    gradient: 'from-amber-500 to-orange-600',
    shortDesc: 'The eldest Kaurava, whose jealousy and ambition triggered the Kurukshetra war.',
    biography: 'Duryodhana is the eldest of the 100 Kaurava brothers, son of Dhritarashtra and Gandhari. His name means "difficult to fight." Driven by jealousy of the Pandavas, he schemed to usurp their kingdom. He attempted to kill Bhima by poisoning, arranged the lacquer house fire, and rigged the dice game. He refused to give the Pandavas even five villages, leading to the Kurukshetra war. He was killed by Bhima in a mace fight.',
    relations: [
      { name: 'Dhritarashtra', relation: 'Father' },
      { name: 'Gandhari', relation: 'Mother' },
      { name: 'Dushasana', relation: 'Brother' },
      { name: 'Karna', relation: 'Best friend and ally' },
      { name: 'Shakuni', relation: 'Maternal uncle and schemer' },
      { name: 'Yudhishthira', relation: 'Cousin and rival' },
    ],
    events: [
      { title: 'Poisoning of Bhima', description: 'As a youth, poisoned Bhima and threw him in the river — Bhima survived due to nagas\' blessing.' },
      { title: 'Lacquer House', description: 'Built a house of lacquer to burn the Pandavas alive — they escaped through a tunnel.' },
      { title: 'Dice Game', description: 'Through Shakuni\'s trickery, won the Pandavas\' kingdom and humiliated Draupadi.' },
      { title: 'Refusal of Five Villages', description: 'Refused Krishna\'s peace proposal of five villages — "not even a needle\'s worth of land."' },
      { title: 'Death', description: 'Killed by Bhima in a mace duel, struck below the waist (against the rules).' },
    ],
    dialogues: [
      { speaker: 'Duryodhana', context: 'Refusing compromise', text: 'I know what is right (dharma) but I cannot follow it. I know what is wrong (adharma) but I cannot abandon it.', reference: 'Mahabharata, Udyoga Parva' },
    ],
    dilemmas: [
      { title: 'Five villages or war', description: 'Krishna offered Duryodhana five villages for the Pandavas — a minimal compromise to avoid war.', resolution: 'Duryodhana refused, choosing total war over sharing. This sealed his fate.' },
    ],
    verses: [
      { sanskrit: 'जानामि धर्मं न च मे प्रवृत्तिः', transliteration: 'jānāmi dharmaṃ na ca me pravṛttiḥ', translation: 'I know dharma but have no inclination toward it. I know adharma but cannot abandon it.', reference: 'Mahabharata, Udyoga Parva' },
    ],
    interpretations: [
      { tradition: 'Traditional', view: 'Duryodhana is the archetype of adharma — driven by jealousy, greed, and ego. He knew what was right but chose wrong.' },
      { tradition: 'Sympathetic reading', view: 'Duryodhana felt the system was rigged against him — his father was blind and bypassed, the Pandavas were favored. His rage, though destructive, had roots in perceived injustice.' },
    ],
  },
  {
    id: 'karna',
    name: 'Karna',
    sanskrit: 'कर्ण',
    category: 'mahabharata',
    icon: '☀️',
    gradient: 'from-amber-500 to-orange-600',
    shortDesc: 'The tragic hero — son of the sun god, abandoned at birth, loyal to Duryodhana.',
    biography: 'Karna is the son of Kunti and Surya (the sun god), born before her marriage. Abandoned in a river, he was raised by a charioteer (Adhiratha) and his wife Radha. Despite his divine parentage, he was denied kshatriya status due to his low social standing. Duryodhana crowned him king of Anga, winning his lifelong loyalty. He was cursed multiple times, gave away his divine armor and earrings, and was killed by Arjuna — not knowing Arjuna was his brother until it was too late.',
    relations: [
      { name: 'Kunti', relation: 'Birth mother' },
      { name: 'Surya', relation: 'Divine father' },
      { name: 'Adhiratha', relation: 'Adoptive father' },
      { name: 'Radha', relation: 'Adoptive mother' },
      { name: 'Arjuna', relation: 'Brother (unknown to him)' },
      { name: 'Yudhishthira', relation: 'Brother (unknown to him)' },
      { name: 'Duryodhana', relation: 'Best friend and patron' },
    ],
    events: [
      { title: 'Abandonment', description: 'Kunti placed the infant Karna in a basket on the river — he was found and raised by a charioteer family.' },
      { title: 'Crowning as King of Anga', description: 'Duryodhana crowned him to make him a kshatriya, winning his eternal loyalty.' },
      { title: 'Curses', description: 'Cursed by Parashurama (for lying about his caste), by a Brahmin (for accidentally killing his cow), and by the Earth (for pressing it to extract milk).' },
      { title: 'Donation of Kavacha', description: 'Indra, disguised as a Brahmin, asked for his divine armor and earrings. Karna gave them, knowing it was a trick.' },
      { title: 'Death at Kurukshetra', description: 'Killed by Arjuna while his chariot wheel was stuck — his curses fulfilled.' },
    ],
    dialogues: [
      { speaker: 'Karna', context: 'To Krishna, when offered the throne', text: 'I know Duryodhana is wrong, but he gave me honor when no one else would. I will not betray my friend. I will fight and die for him.', reference: 'Mahabharata, Udyoga Parva' },
    ],
    dilemmas: [
      { title: 'Loyalty vs. Righteousness', description: 'Krishna revealed to Karna that he was Kunti\'s son and a Pandava — offering him the throne if he switched sides.', resolution: 'Karna refused, choosing loyalty to Duryodhana over his own birthright. He asked only that his true identity be kept secret.' },
      { title: 'The armor and earrings', description: 'Indra came disguised as a Brahmin to ask for Karna\'s divine armor — his only protection.', resolution: 'Karna knew it was Indra and knew the consequences, but gave it anyway — because he never refused a gift to a Brahmin.' },
    ],
    verses: [
      { sanskrit: 'न दानमन्तं विद्यते', transliteration: 'na dānam antaṃ vidyate', translation: 'There is no end to giving — the true giver gives even at the cost of his own life.', reference: 'Mahabharata' },
    ],
    interpretations: [
      { tradition: 'Traditional', view: 'Karna is the tragic hero — noble in character but on the wrong side. His generosity was unmatched, but his loyalty to adharma was his downfall.' },
      { tradition: 'Modern readings', view: 'Karna represents the individual crushed by social hierarchy. Despite divine parentage, he was denied his place because of caste — a critique of the social order.' },
    ],
  },
  {
    id: 'shiva',
    name: 'Shiva',
    sanskrit: 'शिव',
    category: 'deity',
    icon: '🔱',
    gradient: 'from-violet-500 to-purple-600',
    shortDesc: 'Mahadeva — the destroyer/transformer of the Trimurti, lord of yoga and meditation.',
    biography: 'Shiva is one of the three principal deities of Hinduism (alongside Brahma and Vishnu), representing destruction and transformation. He is known as Mahadeva (Great God), Nataraja (Lord of Dance), and Yogeshwara (Lord of Yoga). He dwells on Mount Kailasha, wears a serpent around his neck, the Ganga flows from his matted hair, and he carries a trident (trishula). He is both an ascetic and a householder, married to Parvati, father of Ganesha and Kartikeya.',
    relations: [
      { name: 'Parvati', relation: 'Wife (Shakti)' },
      { name: 'Ganesha', relation: 'Son' },
      { name: 'Kartikeya', relation: 'Son' },
      { name: 'Vishnu', relation: 'Fellow Trimurti deity' },
      { name: 'Brahma', relation: 'Fellow Trimurti deity' },
      { name: 'Nandi', relation: 'Vehicle (bull) and devotee' },
      { name: 'Hanuman', relation: 'Avatar/incarnation' },
    ],
    events: [
      { title: 'Marriage to Parvati', description: 'Parvati performed intense austerities to win Shiva as her husband.' },
      { title: 'Consumption of Halahala', description: 'During the churning of the ocean, Shiva drank the deadly poison, holding it in his throat — turning it blue (Neelakantha).' },
      { title: 'Destruction of Kamadeva', description: 'Burned the god of love to ashes for disturbing his meditation — later revived at Rati\'s request.' },
      { title: 'Cosmic Dance (Tandava)', description: 'Performs the cosmic dance of creation and destruction — Nataraja.' },
    ],
    dialogues: [
      { speaker: 'Shiva', context: 'To Parvati, on the nature of the Self', text: 'The Self is not the body, not the mind, not the senses. It is the silent witness — pure awareness, beyond all attributes.', reference: 'Shiva Sutras' },
    ],
    dilemmas: [
      { title: 'Ascetic vs. Householder', description: 'Shiva embodies the paradox of being both the supreme ascetic and the devoted husband.', resolution: 'He demonstrates that the highest spirituality does not require renouncing the world — one can be fully engaged and fully detached.' },
    ],
    verses: [
      { sanskrit: 'नमः शिवाय', transliteration: 'namaḥ śivāya', translation: 'Salutations to Shiva — the auspicious one.', reference: 'Panchakshara Mantra' },
      { sanskrit: 'ॐ नमः शिवाय', transliteration: 'oṃ namaḥ śivāya', translation: 'Om, salutations to Shiva — the five-syllable mantra that liberates.', reference: 'Yajurveda, Sri Rudram' },
    ],
    interpretations: [
      { tradition: 'Shaiva Siddhanta', view: 'Shiva is the Supreme Lord (Pati), souls are bound (pashu) by bonds (pasha), and liberation comes through Shiva\'s grace.' },
      { tradition: 'Kashmir Shaivism', view: 'Shiva is pure consciousness — the entire universe is His manifestation. Nothing exists apart from Shiva. "I am Shiva" (Shivoham).' },
      { tradition: 'Advaita Vedanta', view: 'Shiva represents the formless Brahman. The trident symbolizes the destruction of the three gunas, leading to Self-realization.' },
      { tradition: 'Smartism', view: 'Shiva is one of the five primary forms of the divine (Panchayatana puja) — equally valid as a path to the Supreme.' },
    ],
  },
  {
    id: 'vishnu',
    name: 'Vishnu',
    sanskrit: 'विष्णु',
    category: 'deity',
    icon: '🐚',
    gradient: 'from-violet-500 to-purple-600',
    shortDesc: 'The preserver of the universe, who descends as avatars to restore dharma.',
    biography: 'Vishnu is one of the three principal deities of the Trimurti, representing preservation and sustenance. He dwells in Vaikuntha, reclines on the serpent Shesha on the cosmic ocean, and holds the conch (shankha), discus (chakra), mace (gada), and lotus (padma). His consort is Lakshmi. He descends as avatars (dashavatara) whenever dharma declines — most notably as Rama and Krishna. He is the central deity of Vaishnavism.',
    relations: [
      { name: 'Lakshmi', relation: 'Consort' },
      { name: 'Brahma', relation: 'Fellow Trimurti (born from Vishnu\'s navel)' },
      { name: 'Shiva', relation: 'Fellow Trimurti' },
      { name: 'Garuda', relation: 'Vehicle (eagle)' },
      { name: 'Shesha', relation: 'Cosmic serpent (bed)' },
      { name: 'Rama', relation: 'Avatar (7th)' },
      { name: 'Krishna', relation: 'Avatar (8th/complete)' },
      { name: 'Narasimha', relation: 'Avatar (4th)' },
    ],
    events: [
      { title: 'Dashavatara', description: 'Ten primary avatars: Matsya, Kurma, Varaha, Narasimha, Vamana, Parashurama, Rama, Krishna, Buddha (or Balarama), Kalki.' },
      { title: 'Churning of the Ocean', description: 'Supported the churning as Kurma (tortoise), and Lakshmi emerged as his consort.' },
      { title: 'Bhagavad Gita', description: 'As Krishna, delivered the divine teaching to Arjuna.' },
    ],
    dialogues: [
      { speaker: 'Vishnu (as Krishna)', context: 'Revealing His cosmic form', text: 'I am Time, the destroyer of worlds. I am the origin and dissolution of all that exists. There is nothing beyond Me.', reference: 'Bhagavad Gita 10.20, 11.32' },
    ],
    dilemmas: [
      { title: 'When to intervene', description: 'Vishnu does not prevent all evil — he intervenes only when dharma is critically threatened.', resolution: 'This reflects the principle that the divine allows free will and karma to operate, intervening only at critical junctures.' },
    ],
    verses: [
      { sanskrit: 'यदा यदा हि धर्मस्य ग्लानिर्भवति भारत', transliteration: 'yadā yadā hi dharmasya glānirbhavati bhārata', translation: 'Whenever dharma declines and adharma rises, I manifest Myself.', reference: 'Bhagavad Gita 4.7' },
      { sanskrit: 'ॐ नमो भगवते वासुदेवाय', transliteration: 'oṃ namo bhagavate vāsudevāya', translation: 'Om, salutations to the Lord Vasudeva (Vishnu/Krishna).', reference: 'Vishnu Mantra' },
    ],
    interpretations: [
      { tradition: 'Sri Vaishnavism', view: 'Vishnu (Narayana) is the supreme God. Liberation comes through prapatti (surrender) and His grace (prasada).' },
      { tradition: 'Gaudiya Vaishnavism', view: 'Krishna is the source of Vishnu (not vice versa). Vishnu is an expansion of Krishna for cosmic maintenance.' },
      { tradition: 'Advaita Vedanta', view: 'Vishnu represents saguna Brahman — the personal aspect of the formless Absolute. All forms lead to the formless.' },
      { tradition: 'Smartism', view: 'Vishnu is one of the five primary deities (Panchayatana), equally valid as a path to the Supreme.' },
    ],
  },
  {
    id: 'valmiki',
    name: 'Valmiki',
    sanskrit: 'वाल्मीकि',
    category: 'rishi',
    icon: '📜',
    gradient: 'from-saffron-500 to-amber-600',
    shortDesc: 'The first poet (Adikavi), author of the Ramayana.',
    biography: 'Valmiki was originally a highway robber named Ratnakara. He was transformed by the sage Narada\'s teaching of Rama\'s name. He meditated for years until ants built a mound (valmika) around him — hence his name. He is credited as the first poet (adikavi) and the Ramayana as the first poem (adikavya). He gave shelter to Sita during her exile and taught the Ramayana to Lava and Kusha.',
    relations: [
      { name: 'Narada', relation: 'Guru (who transformed him)' },
      { name: 'Sita', relation: 'Sheltered during exile' },
      { name: 'Lava', relation: 'Student (Rama\'s son)' },
      { name: 'Kusha', relation: 'Student (Rama\'s son)' },
    ],
    events: [
      { title: 'Transformation', description: 'From robber Ratnakara to sage Valmiki through Narada\'s guidance and meditation.' },
      { title: 'Composition of Ramayana', description: 'Inspired by Brahma, composed the first Sanskrit poem — the Ramayana.' },
      { title: 'Sheltering Sita', description: 'Gave refuge to the pregnant Sita when Rama abandoned her. Raised Lava and Kusha.' },
      { title: 'Recitation at Rama\'s Court', description: 'Lava and Kusha recited the Ramayana at Rama\'s court, leading to recognition.' },
    ],
    dialogues: [
      { speaker: 'Valmiki', context: 'Cursing the hunter who killed a crane', text: 'You will not live long, O hunter — for you killed one of a loving pair. This became the first shloka (verse) of Sanskrit poetry.', reference: 'Ramayana, Balakanda' },
    ],
    dilemmas: [
      { title: 'Sheltering Sita', description: 'Valmiki knew Rama was righteous, yet Sita was suffering injustice.', resolution: 'He sheltered her, raised her sons, and ensured the truth was known — demonstrating that even the righteous can err, and compassion must sometimes override authority.' },
    ],
    verses: [
      { sanskrit: 'मा निषाद प्रतिष्ठां त्वमगमः शाश्वतीः समाः', transliteration: 'mā niṣāda pratiṣṭhāṃ tvamagamaḥ śāśvatīḥ samāḥ', translation: 'O hunter, you shall not find peace for eternity, for you killed one of a pair of loving cranes. — The first shloka.', reference: 'Ramayana, Balakanda' },
    ],
    interpretations: [
      { tradition: 'Traditional', view: 'Valmiki is the Adikavi — the first poet, divinely inspired by Brahma to compose the Ramayana.' },
      { tradition: 'Academic', view: 'The Ramayana likely evolved over centuries; "Valmiki" may represent a tradition of bards rather than a single historical author.' },
    ],
  },
  {
    id: 'vyasa',
    name: 'Vyasa',
    sanskrit: 'व्यास',
    category: 'rishi',
    icon: '📖',
    gradient: 'from-saffron-500 to-amber-600',
    shortDesc: 'Compiler of the Vedas, author of the Mahabharata and the Brahma Sutras.',
    biography: 'Vyasa (Krishna Dvaipayana) is one of the most important figures in Hindu tradition. He compiled the four Vedas, authored the Mahabharata (including the Bhagavad Gita), composed the Brahma Sutras, and is attributed with the eighteen Puranas. He is considered an avatar of Vishnu in some traditions. He was the grandfather of both the Pandavas and Kauravas — father of Pandu, Dhritarashtra, and Vidura.',
    relations: [
      { name: 'Parashara', relation: 'Father (sage)' },
      { name: 'Satyavati', relation: 'Mother' },
      { name: 'Shuka', relation: 'Son (who recited the Bhagavata)' },
      { name: 'Pandu', relation: 'Son (via Ambika)' },
      { name: 'Dhritarashtra', relation: 'Son (via Ambalika)' },
      { name: 'Vidura', relation: 'Son (via a maid)' },
      { name: 'Arjuna', relation: 'Grandson' },
      { name: 'Duryodhana', relation: 'Grandson' },
    ],
    events: [
      { title: 'Compilation of the Vedas', description: 'Divided the single Veda into four (Rig, Yajur, Sama, Atharva) for ease of study.' },
      { title: 'Composition of the Mahabharata', description: 'Composed the epic of 100,000 verses, dictating it to Ganesha.' },
      { title: 'Brahma Sutras', description: 'Composed the foundational text of Vedanta philosophy — 555 sutras systematizing the Upanishads.' },
      { title: 'Bhagavata Purana', description: 'Composed (or inspired) the Bhagavata, recited by his son Shuka to King Parikshit.' },
    ],
    dialogues: [
      { speaker: 'Vyasa', context: 'To his son Shuka, on liberation', text: 'The Self is not the body, not the mind, not the intellect. It is pure awareness — eternal, free, and untouched by any experience.', reference: 'Bhagavata Purana, Canto 2' },
    ],
    dilemmas: [
      { title: 'Witnessing the war', description: 'Vyasa knew the war would destroy both sides, yet he could not prevent it.', resolution: 'He composed the Mahabharata as a record — so that future generations could learn from the tragedy. He offered Arjuna divine sight to see the war, but Arjuna declined.' },
    ],
    verses: [
      { sanskrit: 'व्यासाय विष्णुरूपाय व्यासरूपाय विष्णवे', transliteration: 'vyāsāya viṣṇurūpāya vyāsarūpāya viṣṇave', translation: 'Salutations to Vyasa who is the form of Vishnu, and to Vishnu who is the form of Vyasa.', reference: 'Traditional verse' },
    ],
    interpretations: [
      { tradition: 'Traditional', view: 'Vyasa is a divine sage — an avatar of Vishnu who systematized all of Hindu scripture. He is immortal (chiranjeevi).' },
      { tradition: 'Academic', view: '"Vyasa" (meaning "compiler") may be a title rather than a single person. Multiple authors over centuries contributed to works attributed to Vyasa.' },
    ],
  },
  {
    id: 'shankara',
    name: 'Adi Shankara',
    sanskrit: 'आदि शङ्कर',
    category: 'guru-shishya',
    icon: '🧘',
    gradient: 'from-emerald-500 to-teal-600',
    shortDesc: 'The 8th-century philosopher who consolidated Advaita Vedanta.',
    biography: 'Adi Shankaracharya (c. 8th century CE) was a philosopher and theologian who consolidated the doctrine of Advaita Vedanta — the non-dualistic interpretation of the Upanishads. He wrote commentaries (bhashyas) on the Brahma Sutras, the principal Upanishads, and the Bhagavad Gita. He established four mathas (monastic centers) across India and reorganized the Dashanami monastic order. He died at age 32, having revived Hinduism against Buddhist influence.',
    relations: [
      { name: 'Govinda Bhagavatpada', relation: 'Guru' },
      { name: 'Gaudapada', relation: 'Guru\'s guru (paramaguru)' },
      { name: 'Vivekananda (later)', relation: 'Reviver of his tradition' },
    ],
    events: [
      { title: 'Renunciation at age 8', description: 'Left home to become a sannyasi, receiving his mother\'s reluctant permission.' },
      { title: 'Study under Govinda', description: 'Studied Advaita under Govinda Bhagavatpada, who was a disciple of Gaudapada.' },
      { title: 'Commentaries', description: 'Wrote bhashyas on the Brahma Sutras, ten principal Upanishads, and the Bhagavad Gita.' },
      { title: 'Debate with Mandana Mishra', description: 'Defeated the Mimamsa scholar Mandana Mishra, whose wife Ubhaya Bharati tested him on kama shastra.' },
      { title: 'Four Mathas', description: 'Established monastic centers at Sringeri, Dwaraka, Puri, and Jyotirmath.' },
      { title: 'Death at 32', description: 'Died young, possibly at Kedarnath, having completed his life\'s mission.' },
    ],
    dialogues: [
      { speaker: 'Shankara', context: 'In Vivekachudamani, on the Self', text: 'The Self is the witness of the mind, the intellect, and the senses. It is pure consciousness — eternal, infinite, and free. "I am That" (Shivoham).', reference: 'Vivekachudamani' },
    ],
    dilemmas: [
      { title: 'Mayavada vs. realism', description: 'Shankara\'s doctrine that the world is maya (illusory) was criticized as making the world unreal.', resolution: 'He clarified that the world is "neither real nor unreal" — it is empirically real but ultimately sublated by brahma-jnana.' },
    ],
    verses: [
      { sanskrit: 'ब्रह्म सत्यं जगन्मिथ्या', transliteration: 'brahma satyaṃ jaganmithyā', translation: 'Brahman is real; the world is appearance. The individual soul is Brahman itself — none other.', reference: 'Shankara (attributed)' },
      { sanskrit: 'शिवोऽहम्', transliteration: 'śivo\'ham', translation: 'I am Shiva — I am the auspicious, the Self, the infinite.', reference: 'Nirvana Shatakam' },
    ],
    interpretations: [
      { tradition: 'Advaita Vedanta', view: 'Shankara is the supreme acharya who established the correct interpretation of the Upanishads: Brahman alone is real; the world is appearance; the soul is not different from Brahman.' },
      { tradition: 'Ramanuja (Vishishtadvaita)', view: 'Shankara\'s Advaita is incorrect — the world and souls are real parts of Brahman, not illusory. The soul is a mode of Brahman, not identical.' },
      { tradition: 'Madhva (Dvaita)', view: 'Shankara\'s Advaita is fundamentally wrong — God and souls are eternally distinct. The world is real, not maya.' },
    ],
  },
  {
    id: 'ramanuja',
    name: 'Ramanuja',
    sanskrit: 'रामानुज',
    category: 'guru-shishya',
    icon: '🙏',
    gradient: 'from-emerald-500 to-teal-600',
    shortDesc: 'The 11th-12th century acharya who founded Vishishtadvaita (qualified non-dualism).',
    biography: 'Ramanujacharya (c. 1017-1137 CE) was a philosopher and theologian who founded the Vishishtadvaita (qualified non-dualism) school of Vedanta. He wrote commentaries on the Brahma Sutras (Sri Bhashya), the Bhagavad Gita (Gita Bhashya), and the Vedanta. He was the foremost acharya of the Sri Vaishnava tradition, emphasizing bhakti and prapatti (surrender) as the path to liberation. He opened temple worship to all castes.',
    relations: [
      { name: 'Yadava Prakasha', relation: 'Early guru (whom he surpassed)' },
      { name: 'Yamunacharya', relation: 'Spiritual predecessor' },
    ],
    events: [
      { title: 'Disagreement with Yadava Prakasha', description: 'His early guru taught Advaita; Ramanuja\'s interpretations diverged, leading to a split.' },
      { title: 'Sri Bhashya', description: 'Wrote the definitive Vishishtadvaita commentary on the Brahma Sutras.' },
      { title: 'Reform at Srirangam', description: 'Established the Sri Vaishnava tradition at the Srirangam temple.' },
      { title: 'Opening temples to all', description: 'Opened Vaishnava temples to lower castes, a radical reform for his time.' },
      { title: 'Exile and return', description: 'Fled the Chola king who persecuted him; lived in Melkote (Karnataka) before returning.' },
    ],
    dialogues: [
      { speaker: 'Ramanuja', context: 'On the relationship between soul and God', text: 'The soul is not identical with Brahman, nor separate from Brahman. It is an attribute (prakara) of Brahman — like the body is to the soul. The universe is the body of the Lord.', reference: 'Sri Bhashya' },
    ],
    dilemmas: [
      { title: 'Secret mantra', description: 'His guru gave him a secret mantra but told him not to share it, or he would go to hell.', resolution: 'Ramanuja climbed a temple tower and shouted the mantra to everyone — saying he would gladly go to hell if it meant thousands could be liberated.' },
    ],
    verses: [
      { sanskrit: 'श्रीयः पतिं सुराणां श्रीमतं श्रीनिवासम्', transliteration: 'śrīyaḥ patiṃ surāṇāṃ śrīmataṃ śrīnivāsam', translation: 'Salutations to the Lord of Lakshmi, the abode of Sri, the supreme refuge of all souls.', reference: 'Ramanuja (Sri Vaishnava prayer)' },
    ],
    interpretations: [
      { tradition: 'Sri Vaishnavism', view: 'Ramanuja is the supreme acharya who correctly interpreted the Upanishads: God (Narayana) is the supreme reality; souls and matter are His body. Liberation is through bhakti and prapatti.' },
      { tradition: 'Advaita response', view: 'Ramanuja\'s Vishishtadvaita is a useful stepping stone but ultimately incomplete — the final truth is pure non-duality.' },
    ],
  },
  {
    id: 'nachiketa',
    name: 'Nachiketa',
    sanskrit: 'नचिकेता',
    category: 'guru-shishya',
    icon: '🔥',
    gradient: 'from-amber-500 to-orange-600',
    shortDesc: 'The youthful seeker of truth in the Katha Upanishad who rejected worldly wealth to learn the secret of immortality from Yama.',
    biography: 'Nachiketa is the central seeker in the Katha Upanishad, son of Sage Vajashravas. When his father performed the Vishvajit sacrifice and gave away frail, dry cows in insincere charity, Nachiketa inquired where his father would give him. Angered, his father said, "Unto Death (Yama) I give thee." Nachiketa went to the realm of Yama and waited three days without food or water. Pleased by his patience, Yama granted him three boons. For his third boon, Nachiketa asked for the supreme mystery of what happens to the Self beyond physical death. Refusing Yama’s offers of vast kingdoms, long life, and heavenly pleasures, Nachiketa insisted upon spiritual knowledge (Shreyas over Preyas), receiving the definitive teaching on the nature of Atman.',
    relations: [
      { name: 'Vajashravas', relation: 'Father' },
      { name: 'Yama', relation: 'Guru / Teacher of the Self' },
    ],
    events: [
      { title: 'The Insincere Sacrifice', description: 'Questioned his father’s gift of unproductive cows, upholding truth.' },
      { title: 'Three Days at Death’s Door', description: 'Waited fasting at the threshold of Yama’s abode until the Lord of Death returned.' },
      { title: 'Rejection of Preyas', description: 'Spurned worldly temptations of kingdoms, gold, and maidens in favor of eternal knowledge.' },
      { title: 'Awakening to Atman', description: 'Received the chariot analogy and the revelation of the immortal Atman within the cave of the heart.' },
    ],
    dialogues: [
      { speaker: 'Nachiketa', context: 'Rejecting worldly pleasures to Yama', text: 'Transient are these worldly enjoyments, O Death! They wear away the vigor of all the senses. Keep your horses, dancing, and song for yourself; teach me that secret which transcends death.', reference: 'Katha Upanishad 1.1.26' },
    ],
    dilemmas: [
      { title: 'Shreyas vs. Preyas', description: 'Choosing between the pleasant (preyas) that satisfies worldly ego versus the good (shreyas) that leads to liberation.', resolution: 'Nachiketa firmly chooses shreyas, demonstrating that true spiritual discernment (viveka) requires renouncing sensory lures.' },
    ],
    verses: [
      { sanskrit: 'अन्यच्छ्रेयोऽन्यदुतैव प्रेयस्ते उभे नानार्थे पुरुषं सिनीतः । तयोः श्रेय आददानस्य साधु भवति हीयतेऽर्थाद्य उ प्रेयो वृणीते ॥', transliteration: 'anyacchreyo\'nyadutaiva preyaste ubhe nānārthe puruṣaṃ sinītaḥ | tayoḥ śreya ādadānasya sādhu bhavati hīyate\'rthādya u preyo vr̥ṇīte ||', translation: 'The good (shreyas) is one thing; the pleasant (preyas) is another. Both bind humans to different ends. Well is it with the one who embraces the good; but the one who chooses the pleasant misses the true purpose of life.', reference: 'Katha Upanishad 1.2.1' },
    ],
    interpretations: [
      { tradition: 'Advaita Vedanta', view: 'Nachiketa is the archetypal qualified spiritual aspirant (adhikari), endowed with discrimination (viveka), dispassion (vairagya), and deep longing for liberation (mumukshutva).' },
      { tradition: 'Katha Upanishad Svadhyaya', view: 'He shows that youth and humble status are no barrier to spiritual maturity when dedication to truth is unshakeable.' },
    ],
  },
  {
    id: 'janaka',
    name: 'King Janaka',
    sanskrit: 'जनक',
    category: 'rishi',
    icon: '👑',
    gradient: 'from-amber-600 to-yellow-600',
    shortDesc: 'The Videha monarch of Mithila, father of Sita, and exemplar of Karma Yoga who attained enlightenment while ruling an empire.',
    biography: 'Rajarshi Janaka (Siradhvaja Janaka) was the legendary king of Mithila (Videha), known throughout ancient India as the supreme ideal of a philosopher-king who achieved Brahma-Jnana while fulfilling all royal duties. In the Ramayana, he found Sita while plowing the sacred sacrificial ground and raised her with boundless love. In the Brihadaranyaka Upanishad, his court was the greatest assembly of sages in the world, where he engaged in profound dialogues with Sage Yajnavalkya. In the Ashtavakra Gita, King Janaka is the disciple who realizes instantaneous enlightenment upon receiving the teachings of Sage Ashtavakra. In the Bhagavad Gita (3.20), Lord Krishna cites Janaka as the foremost historical example of perfection attained through selfless action (Karma Yoga).',
    relations: [
      { name: 'Sita', relation: 'Daughter' },
      { name: 'Ashtavakra', relation: 'Guru' },
      { name: 'Yajnavalkya', relation: 'Spiritual guide and preceptor' },
      { name: 'Sunayana', relation: 'Queen Consort' },
    ],
    events: [
      { title: 'Discovery of Sita', description: 'Discovered infant Sita while furrowing the sacred sacrificial field in Mithila.' },
      { title: 'Upanishadic Assemblies', description: 'Convened the great theological debate in the Brihadaranyaka Upanishad, awarding 1,000 cattle with gold-tipped horns.' },
      { title: 'Awakening with Ashtavakra', description: 'Attained supreme liberation through the radical direct non-dual inquiry of the Ashtavakra Gita.' },
      { title: 'Ruling without Attachment', description: 'Governed the kingdom of Mithila with complete inner detachment (Videha state).' },
    ],
    dialogues: [
      { speaker: 'Janaka', context: 'Exclaiming his realization to Sage Ashtavakra', text: 'Aho! I am spotless, tranquil, pure Consciousness, beyond nature. All this time I have been duped by illusion!', reference: 'Ashtavakra Gita 2.1' },
    ],
    dilemmas: [
      { title: 'King vs. Ascetic', description: 'Whether spiritual enlightenment requires abandoning the throne and taking monastic vows in the forest.', resolution: 'Janaka proved that true renunciation is inner freedom from ego and possession (tyaga), not the abandonment of righteous duty (lokasangraha).' },
    ],
    verses: [
      { sanskrit: 'कर्मणैव हि संसिद्धिमास्थिता जनकादयः । लोकसंग्रहमेवापि संपश्यन्कर्तुमर्हसि ॥', transliteration: 'karmaṇaiva hi saṃsiddhimāsthitā janakādayaḥ | lokasaṃgrahamevāpi saṃpaśyankartumarhasi ||', translation: 'By selfless action alone did Janaka and others attain perfection. You should perform work also with a view to the maintenance of the world order (lokasangraha).', reference: 'Bhagavad Gita 3.20' },
    ],
    interpretations: [
      { tradition: 'Bhagavad Gita / Karma Yoga', view: 'Janaka is the gold standard of living in the world without being of the world — carrying out extensive governance while remaining untouched by greed or sorrow.' },
      { tradition: 'Advaita Vedanta', view: 'Janaka illustrates Jivanmukti (liberation while living in the body) in the Videha state of pure witnessing consciousness.' },
    ],
  },
  {
    id: 'vidura',
    name: 'Vidura',
    sanskrit: 'विदुर',
    category: 'mahabharata',
    icon: '📜',
    gradient: 'from-amber-600 to-orange-700',
    shortDesc: 'Prime counselor of the Kuru dynasty, avatar of Dharma, and speaker of the timeless ethical treatise Vidura Niti.',
    biography: 'Vidura was the wise and fearless prime minister of Hastinapura, born to Sage Vyasa and a maidservant of Queen Ambika. Revered in tradition as an incarnation of Dharma (Yama) cursed by Sage Mandavya, Vidura possessed unmatched knowledge of ethics, statecraft, and human nature. In the Mahabharata, he repeatedly warned King Dhritarashtra against Duryodhana’s adharmic plots, saving the Pandavas from the burning lac palace (Lakshagriha) through a coded warning to Yudhishthira. During the sleepless night preceding the Kurukshetra war, his profound moral counsel to Dhritarashtra formed the renowned "Vidura Niti". Before the war, Krishna refused Duryodhana’s lavish feast and instead ate simple greens at Vidura’s humble cottage, honoring his pure devotion.',
    relations: [
      { name: 'Vyasa', relation: 'Father' },
      { name: 'Dhritarashtra', relation: 'Half-brother' },
      { name: 'Pandu', relation: 'Half-brother' },
      { name: 'Krishna', relation: 'Devotional Lord' },
    ],
    events: [
      { title: 'Saving the Pandavas at Lakshagriha', description: 'Dispatched a trusted miner and warned Yudhishthira in Mleccha dialect to escape the burning palace.' },
      { title: 'Speaking the Vidura Niti', description: 'Delivered an 8-chapter discourse on governance, moral duty, and inner peace to restless Dhritarashtra.' },
      { title: 'Krishna’s Visit', description: 'Welcomed Sri Krishna with simple spinach (saag), demonstrating that God values pure love over wealth.' },
      { title: 'Final Renunciation', description: 'Departed into the forest for austere meditation, merging his consciousness with Yudhishthira at life’s end.' },
    ],
    dialogues: [
      { speaker: 'Vidura', context: 'Advising Dhritarashtra on wisdom and character', text: 'He who does not rejoice in praise, nor is aggrieved by insult, who remains calm like a lake on a windless day — that man is called wise (Pandita).', reference: 'Vidura Niti / Mahabharata Udyoga Parva 33.19' },
    ],
    dilemmas: [
      { title: 'Duty of Counsel vs. Futility of Advice', description: 'Knowing that Dhritarashtra’s blind attachment to his sons would lead to cataclysm, whether to keep speaking uncomfortable truths.', resolution: 'Vidura performed his duty without compromise, speaking fearlessly regardless of whether his counsel was heeded or rejected.' },
    ],
    verses: [
      { sanskrit: 'न हृष्यत्यात्मसम्माने नावमानेन तप्यते । गाङ्गो ह्रद इवाक्षोभ्यो यः स पण्डित उच्यते ॥', transliteration: 'na hr̥ṣyatyātmasammāne nāvamānena tapyate | gāṅgo hrada ivākṣobhyo yaḥ sa paṇḍita ucyate ||', translation: 'He who is neither elated by praise nor grieved by disgrace, and remains undisturbed like a sacred lake, is truly called a wise person.', reference: 'Mahabharata Udyoga Parva 33.19 (Vidura Niti)' },
    ],
    interpretations: [
      { tradition: 'Mahabharata Ethics', view: 'Vidura represents the voice of righteous conscience that speaks truth to power without fear, malice, or self-interest.' },
      { tradition: 'Bhakti Tradition', view: 'Vidura embodies humility and genuine devotion, celebrated in Vaishnava literature as "Vidura Neeti" and "Vidura Ka Saag".' },
    ],
  },
  {
    id: 'ganesha',
    name: 'Ganesha',
    sanskrit: 'गणेश',
    category: 'deity',
    icon: '🐘',
    gradient: 'from-orange-500 to-amber-600',
    shortDesc: 'The elephant-headed divinity of wisdom, intellect, and beginnings; the remover of obstacles (Vighnaharta).',
    biography: 'Bhagavan Ganesha, also known as Ganapati, Vinayaka, and Vighnaharta, is the first-worshipped (Prathama Pujya) deity in Sanatana Dharma. Son of Shiva and Parvati, Ganesha represents the cosmic intellect (Mahat-Tattva), discrimination (Buddhi), and auspiciousness (Mangalam). In the Ganapati Atharvashirsha Upanishad, He is revealed as the supreme Reality underlying the Muladhara chakra, transcending the gunas and time. Tradition records that Sage Vyasa selected Ganesha as the divine scribe to write down the massive epic Mahabharata, with the condition that Vyasa must never stop reciting and Ganesha must understand every verse before committing it to writing.',
    relations: [
      { name: 'Shiva', relation: 'Father' },
      { name: 'Parvati', relation: 'Mother' },
      { name: 'Kartikeya (Murugan)', relation: 'Brother' },
      { name: 'Vyasa', relation: 'Epic co-creator / Scribe' },
    ],
    events: [
      { title: 'Prathama Pujya Status', description: 'Awarded the boon of being worshipped first in all auspicious endeavors after circumambulating His divine parents.' },
      { title: 'Writing the Mahabharata', description: 'Transcribed the 100,000 verses of the Mahabharata without pause using His broken tusk as a pen.' },
      { title: 'Overcoming Vighna', description: 'Installed as the master of obstacles, removing stumbling blocks for the righteous and restraining the arrogant.' },
    ],
    dialogues: [
      { speaker: 'Ganesha', context: 'Accepting the condition to scribe the Mahabharata from Vyasa', text: 'I shall be your scribe, but my pen must not stop for a single instant while you compose.', reference: 'Mahabharata Adi Parva 1.77' },
    ],
    dilemmas: [
      { title: 'Cosmic Race vs. Filial Reverence', description: 'When challenged to circumnavigate the universe in a race with Kartikeya, how to accomplish the feat with His gentle vehicle.', resolution: 'Ganesha walked around Shiva and Parvati, proclaiming that parents contain the entire cosmos within them, winning the contest through supreme wisdom.' },
    ],
    verses: [
      { sanskrit: 'वक्रतुण्ड महाकाय सूर्यकोटिसमप्रभ । निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥', transliteration: 'vakratuṇḍa mahākāya sūryakoṭisamaprabha | nirvighnaṃ kuru me deva sarvakāryeṣu sarvadā ||', translation: 'O Lord with the curved trunk and immense form, whose radiance equals millions of suns: dispel all obstacles from my endeavors, now and forever.', reference: 'Traditional Ganapati Dhyana' },
    ],
    interpretations: [
      { tradition: 'Ganapatya & Vedic', view: 'The elephant head signifies cosmic intellect (Brihaspati), the large ears denote deep listening (Shravana), and the single tusk represents non-dual focus.' },
      { tradition: 'Kundalini Yoga', view: 'Ganesha resides at the Muladhara chakra, anchoring the spiritual seeker before the upward ascent of consciousness.' },
    ],
  },
  {
    id: 'durga',
    name: 'Devi Durga',
    sanskrit: 'दुर्गा',
    category: 'deity',
    icon: '🦁',
    gradient: 'from-rose-600 to-red-700',
    shortDesc: 'The supreme protective Shakti who upholds cosmic order (Dharma) and vanquishes demonic forces of ignorance (Mahishasura).',
    biography: 'Devi Durga is the quintessential warrior aspect of the Divine Mother (Mahadevi / Adi Parashakti). Described extensively in the Devi Mahatmya (Durga Saptashati) of the Markandeya Purana, She manifested from the combined radiant energy (Tejas) of all the gods to vanquish the shape-shifting demon Mahishasura, whom no mortal man or god could defeat. Riding a lion and bearing the sacred weapons of all deities, Durga symbolizes invincible spiritual power, moral rectitude, and fierce compassion that destroys ignorance, arrogance, and sorrow to protect Her children.',
    relations: [
      { name: 'Shiva', relation: 'Divine Consort' },
      { name: 'Ganesha', relation: 'Son' },
      { name: 'Kartikeya', relation: 'Son' },
      { name: 'Lakshmi', relation: 'Divine aspect / daughter' },
      { name: 'Saraswati', relation: 'Divine aspect / daughter' },
    ],
    events: [
      { title: 'Manifestation from Cosmic Tejas', description: 'Emergence from the unified luminous wrath of Brahma, Vishnu, Shiva, and the Devas.' },
      { title: 'Vanquishing Mahishasura', description: 'Defeated the buffalo demon of delusion and ignorance, restoring cosmic balance.' },
      { title: 'Destruction of Shumbha and Nishumbha', description: 'Eradicated the demonic forces of possessiveness and ego as recorded in the Devi Mahatmya.' },
    ],
    dialogues: [
      { speaker: 'Devi Durga', context: 'Assuring the gods of Her perpetual protection in the Devi Mahatmya', text: 'Whenever darkness and demonic forces rise to torment the righteous, I shall manifest to re-establish Dharma.', reference: 'Devi Mahatmya 11.54' },
    ],
    dilemmas: [
      { title: 'Ferocity vs. Motherly Grace', description: 'How fierce destructive power against evil harmonizes with the gentle nurturing of creation.', resolution: 'Durga demonstrates that true love must be fiercely protective of goodness; destroying the demon of ignorance is an act of ultimate compassion for the soul.' },
    ],
    verses: [
      { sanskrit: 'सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके । शरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते ॥', transliteration: 'sarvamaṅgalamāṅgalye śive sarvārthasādhike | śaraṇye tryambake gauri nārāyaṇi namo\'stu te ||', translation: 'Salutations to You, O Narayani, the auspiciousness of all that is auspicious, the fulfiller of all righteous aims, the refuge, the three-eyed Gauri!', reference: 'Devi Mahatmya / Markandeya Purana 11.10' },
    ],
    interpretations: [
      { tradition: 'Shakta Tradition', view: 'Durga is not merely a consort, but the Supreme Absolute Reality (Brahman in dynamic form) from whom all gods derive their power.' },
      { tradition: 'Psychological Allegory', view: 'Her battle with Mahishasura symbolizes the seeker’s inner warfare against base animalistic instincts, lethargy, and ego.' },
    ],
  },
  {
    id: 'saraswati',
    name: 'Saraswati',
    sanskrit: 'सरस्वती',
    category: 'deity',
    icon: '🪷',
    gradient: 'from-amber-400 to-yellow-500',
    shortDesc: 'The goddess of wisdom, learning, arts, music, and divine speech (Vak); embodiment of spotless purity.',
    biography: 'Devi Saraswati is the goddess of knowledge (Vidya), intellect (Buddhi), music (Sangita), and eloquence (Vak). Revered since the earliest Vedic hymns of the Rigveda, She was initially celebrated as the mighty sacred river of inspiration and illumination before embodying the personification of creative intelligence. Clothed in spotless white garments, seated on a white lotus, and holding the veena, the sacred book (Veda), and the rosary (japa mala), Saraswati represents the pristine clarity of the contemplative mind detached from worldly glitter.',
    relations: [
      { name: 'Brahma', relation: 'Consort and creative counterpart' },
      { name: 'Vedic Rishis', relation: 'Inspirer of sacred mantras' },
    ],
    events: [
      { title: 'Vedic Revelation of Vak', description: 'Celebrated in the Rigvedic Devi Sukta (10.125) as the cosmic speech that upholds the universe.' },
      { title: 'Gift of the Veena and Letters', description: 'Endowed humanity with grammar, alphabets (Devanagari), and melodic frequencies of sacred music.' },
    ],
    dialogues: [
      { speaker: 'Saraswati', context: 'Revealing the nature of speech in the Rigveda', text: 'I am the Queen of the universe, the gatherer of treasures, the first of those worthy of worship; the gods have established me in many places.', reference: 'Rigveda 10.125.3 (Devi Sukta)' },
    ],
    dilemmas: [
      { title: 'Knowledge vs. Worldly Wealth', description: 'The choice between acquiring commercial wealth or dedicating life to the sacred pursuit of wisdom and truth.', resolution: 'Saraswati shows that inner illumination and truth (Vidya) are imperishable, outlasting all transient fortunes.' },
    ],
    verses: [
      { sanskrit: 'या कुन्देन्दुतुषारहारधवला या शुभ्रवस्त्रावृता या वीणावरदण्डमण्डितकरा या श्वेतपद्मासना । सा मां पातु सरस्वती भगवती निःशेषजाड्यापहा ॥', transliteration: 'yā kundendutuṣārahāradhavalā yā śubhravastrāvr̥tā yā vīṇāvaradaṇḍamaṇḍitakarā yā śvetapadmāsanā | sā māṃ pātu sarasvatī bhagavatī niḥśeṣajāḍyāpahā ||', translation: 'May Goddess Saraswati, fair like the jasmine, the moon, and the snow garland, adorned in spotless white attire, holding the sacred veena, seated upon a white lotus — may She completely dispel all mental lethargy and ignorance!', reference: 'Traditional Saraswati Stotram' },
    ],
    interpretations: [
      { tradition: 'Vedic & Upanishadic', view: 'Saraswati is Vak (the divine Logos) through which the unmanifest Brahman expresses itself into cosmic manifestation.' },
      { tradition: 'Classical Education', view: 'Her iconography of white attire and swan (Hamsa) emphasizes intellectual purity, viveka (discerning milk from water), and selfless devotion to learning.' },
    ],
  },
  {
    id: 'lakshmi',
    name: 'Lakshmi',
    sanskrit: 'लक्ष्मी',
    category: 'deity',
    icon: '🌸',
    gradient: 'from-rose-500 to-pink-600',
    shortDesc: 'The goddess of spiritual abundance, dignity, auspiciousness, and compassion; consort of Lord Vishnu.',
    biography: 'Devi Lakshmi (also known as Sri, Padma, and Kamala) is the divine mother of spiritual light, cosmic harmony, and wholesome abundance. Described in the Rigvedic Sri Suktam and the Puranas, She emerged from the churning of the cosmic ocean of milk (Samudra Manthana) and chose Lord Vishnu as Her eternal consort. Standing upon an open pink lotus and bearing lotuses in Her hands while showering golden blessings, Lakshmi represents the dynamic grace that sustains life, families, righteous governance, and virtuous society.',
    relations: [
      { name: 'Vishnu', relation: 'Consort and eternal counterpart' },
      { name: 'Kama', relation: 'Son' },
      { name: 'Kardama & Ananda', relation: 'Sons in Vedic Sukta tradition' },
    ],
    events: [
      { title: 'Emergence from Samudra Manthana', description: 'Arose from the cosmic churning of the milk ocean, bringing divine auspiciousness to creation.' },
      { title: 'Incarnation with Avatars', description: 'Descended as Sita with Rama and Rukmini/Radha with Krishna to uphold Dharma.' },
      { title: 'Showering Gold for Adi Shankara', description: 'Bestowed the miraculous shower of golden amlas in response to Shankara’s Kanakadhara hymn.' },
    ],
    dialogues: [
      { speaker: 'Lakshmi', context: 'Describing where She resides in the Mahabharata', text: 'I dwell in those who speak truthfully, who are disciplined and gentle, who revere teachers and guests, and who avoid malice and despair.', reference: 'Mahabharata Shanti Parva' },
    ],
    dilemmas: [
      { title: 'Sri (Auspiciousness) vs. Material Greed', description: 'Distinguishing between righteous prosperity used for dharma versus greedy hoarding that leads to moral decay.', resolution: 'Lakshmi departs from those who succumb to arrogance, residing permanently only where Vishnu (righteousness and truth) is revered.' },
    ],
    verses: [
      { sanskrit: 'ॐ महालक्ष्मै च विद्महे विष्णुपत्न्यै च धीमहि । तन्नो लक्ष्मीः प्रचोदयात् ॥', transliteration: 'oṃ mahālakṣmai ca vidmahe viṣṇupatnyai ca dhīmahi | tanno lakṣmīḥ pracodayāt ||', translation: 'May we know the Supreme Goddess Mahalakshmi; we meditate upon the consort of Sri Vishnu; may that Divine Mother inspire and illuminate our minds.', reference: 'Lakshmi Gayatri' },
    ],
    interpretations: [
      { tradition: 'Vaishnava Tradition (Sri Sampradaya)', view: 'Lakshmi is the divine Mediatrix (Purushakara) whose unconditional maternal compassion softens divine justice and grants salvation to all surrendered souls.' },
      { tradition: 'Dharmic Economics', view: 'She represents noble wealth earned through honest labor (shrama) and utilized for the welfare of society and nature.' },
    ],
  },
  {
    id: 'draupadi',
    name: 'Draupadi',
    sanskrit: 'द्रौपदी',
    category: 'mahabharata',
    icon: '🔥',
    gradient: 'from-rose-700 to-purple-800',
    shortDesc: 'The fire-born princess of Panchala, queen of the Pandavas, and embodiment of unyielding moral dignity and justice.',
    biography: 'Draupadi (also known as Yajnaseni, Panchali, and Krishnaa) is the heroine of the Mahabharata, born from the sacrificial altar of King Drupada along with her brother Dhrishtadyumna. Wedded to the five Pandavas after Arjuna pierced the rotating fish target at her svayamvara, Draupadi became the empress of Indraprastha. Following Yudhishthira’s loss in the rigged dice game, she was dragged into the Kuru court by Dushasana. When the Kuru elders remained paralyzed by technicalities, Draupadi fearlessly interrogated the court on the nature of law and righteousness. When all human recourse failed, she surrendered completely to Sri Krishna, who miraculously provided inexhaustible garments (vastraharan). She endured 12 years of forest exile and 1 year of concealment in Matsya, standing as a towering pillar of dignity, resilience, and unshakeable commitment to justice.',
    relations: [
      { name: 'Yudhishthira', relation: 'Husband' },
      { name: 'Arjuna', relation: 'Husband' },
      { name: 'Bhima', relation: 'Husband' },
      { name: 'Nakula', relation: 'Husband' },
      { name: 'Sahadeva', relation: 'Husband' },
      { name: 'Krishna', relation: 'Sakha (Divine Friend and Protector)' },
      { name: 'Drupada', relation: 'Father' },
    ],
    events: [
      { title: 'Birth from the Sacrificial Flame', description: 'Emerged fully grown from the yajna fire of King Drupada as Yajnaseni.' },
      { title: 'The Assembly Hall Trial', description: 'Challenged the silence of Bhishma, Drona, and Dhritarashtra when dragged into the royal court.' },
      { title: 'Krishna’s Miracle (Vastraharana)', description: 'Invoked Sri Krishna in utter surrender, receiving infinite robes that saved her modesty.' },
      { title: 'Forest Exile Resilience', description: 'Supported the Pandavas through 13 years of hardship while running the hermitage kitchen with the Akshaya Patra.' },
    ],
    dialogues: [
      { speaker: 'Draupadi', context: 'Questioning the Kuru assembly on dharma during her humiliation', text: 'Did the King Yudhishthira lose himself first, or did he wager me? If he lost himself first, by what right could he wager me? Speak, elders of the Kuru race!', reference: 'Mahabharata Sabha Parva 67.4' },
    ],
    dilemmas: [
      { title: 'Patience vs. Righteous Outrage', description: 'Enduring immense injustice and betrayal while waiting for the wheel of dharma to turn.', resolution: 'Draupadi refused to accept humiliation as fate, holding the Kuru court accountable until ultimate justice was re-established.' },
    ],
    verses: [
      { sanskrit: 'शङ्खचक्रगदापाणे द्वारकानिलयाच्युत । गोविन्द पुण्डरीकाक्ष रक्ष मां शरणागताम् ॥', transliteration: 'śaṅkhacakragadāpāṇe dvārakānilayācyuta | govinda puṇḍarīkākṣa rakṣa māṃ śaraṇāgatām ||', translation: 'O bearer of the conch, discus, and mace! O dweller of Dwaraka, infallible Lord! O Govinda, lotus-eyed protector, save me who has taken sole refuge in You!', reference: 'Mahabharata Sabha Parva (Draupadi Sharanagati)' },
    ],
    interpretations: [
      { tradition: 'Classical Mahabharata', view: 'Draupadi is one of the five Pancha Kanyas whose invocation dispels moral confusion. She represents intelligence, unyielding dignity, and fierce moral conscience.' },
      { tradition: 'Bhakti Perspective', view: 'Her surrender in the Kuru court represents the soul’s absolute surrender (sharanagati) when all worldly reliances dissolve.' },
    ],
  },
  {
    id: 'lakshmana',
    name: 'Lakshmana',
    sanskrit: 'लक्ष्मण',
    category: 'ramayana',
    icon: '🏹',
    gradient: 'from-amber-500 to-orange-600',
    shortDesc: 'The devoted brother of Lord Rama, avatar of Shesha Naga, and paragon of selfless service and warrior valor.',
    biography: 'Lakshmana (Saumitri) was the son of King Dasharatha and Queen Sumitra, twin brother of Shatrughna, and the inseparable companion of Lord Sri Rama. Considered an incarnation of Adi Shesha (the thousand-headed serpent supporting cosmic balance), Lakshmana’s entire life was an unbroken vow of service to Rama. When Rama was exiled for 14 years, Lakshmana renounced all royal comforts to accompany Rama and Sita into the forest, serving as their tireless protector. In the Lanka war, Lakshmana slew Indrajit (Meghanada), who could only be vanquished by a warrior who had conquered sleep and upheld strict brahmacharya. His intense protective devotion to Rama remains the benchmark of selfless brotherhood in world literature.',
    relations: [
      { name: 'Rama', relation: 'Brother and worshipped Lord' },
      { name: 'Sita', relation: 'Sister-in-law and motherly figure' },
      { name: 'Sumitra', relation: 'Mother' },
      { name: 'Dasharatha', relation: 'Father' },
      { name: 'Urmila', relation: 'Wife' },
      { name: 'Shatrughna', relation: 'Twin brother' },
    ],
    events: [
      { title: 'Voluntary 14-Year Exile', description: 'Insisted on accompanying Rama and Sita into the forest, serving as their guardian.' },
      { title: 'Guarding Rama and Sita in Dandaka', description: 'Built cottages at Chitrakuta and Panchavati, staying awake night after night to protect them.' },
      { title: 'Vanquishing Indrajit', description: 'Slain the invincible sorcerer-warrior Meghanada through supreme mastery of senses and weapons.' },
      { title: 'Final Solitary Departure', description: 'Sacrificed his life to uphold a royal promise of privacy between Rama and Kala (Time).' },
    ],
    dialogues: [
      { speaker: 'Lakshmana', context: 'Declaring his devotion to Rama before exile', text: 'I do not desire heaven, nor immortality, nor the sovereignty of all the worlds without You, O Rama! Where You walk, that forest is my kingdom.', reference: 'Valmiki Ramayana Ayodhya Kanda 31.5' },
    ],
    dilemmas: [
      { title: 'Duty to Brother vs. Duty to King’s Decree', description: 'When the messenger of Kala threatened to curse the entire kingdom if interrupted, whether Lakshmana should break Rama’s private conference to deliver Durvasa’s message.', resolution: 'Lakshmana chose to sacrifice his own life by interrupting the conference rather than allow the kingdom of Ayodhya to suffer a sage’s wrath.' },
    ],
    verses: [
      { sanskrit: 'न जानन्ति नरा लोके भ्रातृस्नेहं त्वया समम् । लक्ष्मणस्य हि धर्मज्ञ रामपादपरायणः ॥', transliteration: 'na jānanti narā loke bhrātṛsnehaṃ tvayā samam | lakṣmaṇasya hi dharmajña rāmapādaparāyaṇaḥ ||', translation: 'Nowhere in all the worlds is there brotherly love comparable to Lakshmana’s, who is established in righteousness and devoted solely to the lotus feet of Rama.', reference: 'Valmiki Ramayana Yuddha Kanda' },
    ],
    interpretations: [
      { tradition: 'Valmiki Ramayana', view: 'Lakshmana represents the active, fiery, and uncompromising defense of Dharma that complements Rama’s gentle patience.' },
      { tradition: 'Vaishnava Theology', view: 'He is the archetype of the ideal servant of God (Kainkarya), teaching that the highest joy is unconditional selfless service.' },
    ],
  },
  {
    id: 'prahlada',
    name: 'Bhakta Prahlada',
    sanskrit: 'प्रह्लाद',
    category: 'purana',
    icon: '✨',
    gradient: 'from-amber-400 to-orange-500',
    shortDesc: 'The boy devotee of Vishnu whose steadfast faith in God’s omnipresence led to the Narasimha avatar.',
    biography: 'Prahlada was the saintly prince born to the tyrannical demon king Hiranyakashipu and Queen Kayadhu. Educated in the womb by Sage Narada in the hermitage, Prahlada grew up with boundless, innate devotion to Lord Narayana. When his father demanded that all subjects worship him alone as God, Prahlada gently but firmly proclaimed that the supreme Lord is the only true source of all power. Subjected to horrific torture — thrown into fires, trampling elephants, poison, and falling from cliffs — Prahlada remained completely unharmed, absorbed in chanting Narayana’s name. When Hiranyakashipu struck a palace pillar demanding if God was present inside stone, Lord Vishnu burst forth as the half-man, half-lion Narasimha to protect His child devotee and destroy the tyrant. Prahlada later ruled with divine wisdom and compassion.',
    relations: [
      { name: 'Hiranyakashipu', relation: 'Father' },
      { name: 'Kayadhu', relation: 'Mother' },
      { name: 'Narada', relation: 'Guru' },
      { name: 'Narasimha (Vishnu)', relation: 'Beloved Lord and Protector' },
      { name: 'Virochana', relation: 'Son' },
      { name: 'Mahabali', relation: 'Grandson' },
    ],
    events: [
      { title: 'Spiritual Teaching in the Womb', description: 'Absorbed the wisdom of the Bhagavata Dharma from Sage Narada before birth.' },
      { title: 'Undaunted under Persecution', description: 'Survived poison, fire, weapons, and wild beasts through unbroken remembrance of God.' },
      { title: 'The Pillar of Faith', description: 'Affirmed that God dwells even within the stone pillar, prompting the descent of Lord Narasimha.' },
      { title: 'Prayer for His Father’s Soul', description: 'Asked Lord Narasimha for the liberation and forgiveness of his tyrannical father.' },
    ],
    dialogues: [
      { speaker: 'Prahlada', context: 'Instructing his fellow demon classmates in the Bhagavata Purana', text: 'In this human birth, one should practice the Bhagavata Dharma from early childhood. Rare indeed is this human body, and although transient, it affords the means to attain the Supreme.', reference: 'Bhagavata Purana 7.6.1' },
    ],
    dilemmas: [
      { title: 'Filial Obedience vs. Divine Truth', description: 'Whether to obey an earthly father who demands that one renounce God and commit adharma.', resolution: 'Prahlada taught that loyalty to the Divine and to truth supersedes all earthly mandates, yet he never harbored hatred toward his father.' },
    ],
    verses: [
      { sanskrit: 'कौमार आचरेत्प्राज्ञो धर्मान्भागवतानिह । दुर्लभं मानुषं जन्म तदप्यध्रुवमर्थदम् ॥', transliteration: 'kaumāra ācaretprājño dharmānbhāgavatāniha | durlabhaṃ mānuṣaṃ janma tadapyadhruvamarthadam ||', translation: 'A wise person should practice the divine path of devotion from early childhood itself. For the human birth is exceedingly rare, and though fleeting, it alone yields the supreme fruit of life.', reference: 'Bhagavata Purana 7.6.1' },
    ],
    interpretations: [
      { tradition: 'Bhagavata Purana', view: 'Prahlada is one of the twelve Mahajanas (great teachers of Dharma), embodying Shravana (listening) and Smarana (unbroken remembrance).' },
      { tradition: 'Theological Philosophy', view: 'His story demonstrates that God is not absent from any atom of existence, and divine grace unfailingly protects selfless faith.' },
    ],
  },
];

export function getCharacter(id: string): Character | undefined {
  return characters.find((c) => c.id === id);
}

export function getCharactersByCategory(category: CharacterCategory): Character[] {
  return characters.filter((c) => c.category === category);
}
