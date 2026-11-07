import { Scripture } from '../types';

export const kena: Scripture = {
  id: 'kena',
  title: 'Kena Upanishad',
  titleSanskrit: 'केनोपनिषद्',
  category: 'upanishad',
  description:
    'Belongs to the Sāma Veda. 35 mantras in four sections — two in verse, two in prose. Asks the most fundamental question of all philosophy: who or what is the power behind perception itself? Famous for the paradox: he who thinks he knows does not know.',
  totalVerses: 35,
  tags: ['Upanishad', 'Brahman', 'Consciousness', 'Knowledge', 'Witness'],
  chapters: [
    {
      id: 1,
      title: 'Khaṇḍa 1 — The Power Behind Perception',
      titleSanskrit: 'प्रथम खण्ड',
      summary:
        'Nine verses. Who directs the mind, the breath, the speech, the eye, the ear? Brahman is identified as the very power of perception — the ear of the ear, mind of the mind. Not what is known, but that by which all knowing happens.',
      verses: [
        {
          id: 1,
          sanskrit:
            'केनेषितं पतति प्रेषितं मनः केन प्राणः प्रथमः प्रैति युक्तः । केनेषितां वाचमिमां वदन्ति चक्षुः श्रोत्रं क उ देवो युनक्ति ॥',
          transliteration:
            'keneṣitaṃ patati preṣitaṃ manaḥ kena prāṇaḥ prathamaḥ praiti yuktaḥ | keneṣitāṃ vācamimāṃ vadanti cakṣuḥ śrotraṃ ka u devo yunakti ||',
          translation:
            'By whose will does the mind, sent forth, alight on its objects? By whom is the first breath set moving? By whose will do men speak this speech? What god directs the eye and the ear?',
          hindi:
            'किसकी इच्छा से प्रेरित मन अपने विषयों पर जाता है? किससे प्रेरित होकर पहला प्राण चलता है? किसकी इच्छा से लोग वाणी बोलते हैं? कौन देव नेत्र और कान को संचालित करता है?',
          explanation:
            'The Upanishad opens with the most fundamental question in philosophy — not "what exists?" but "what is the power behind perception itself?" The inquiry is turned away from objects and toward the unseen subject behind every act of knowing.',
          science:
            "This is precisely the 'hard problem of consciousness' (David Chalmers, 1995): why do physical brain processes give rise to subjective experience? We can map every neuron and still cannot explain why there is 'something it is like' to see red. The Upanishad poses the question 3000 years before modern neuroscience.",
          lifeLesson:
            'You are not your thoughts and emotions — you are the awareness behind them. Spend five minutes today simply watching your thoughts like clouds across a sky. The sky is you. That shift in identity is the beginning of wisdom.',
          keywords: ['HardProblem', 'WitnessAwareness', 'Inquiry'],
        },
        {
          id: 2,
          sanskrit:
            'श्रोत्रस्य श्रोत्रं मनसो मनो यद्वाचो ह वाचं स उ प्राणस्य प्राणः । चक्षुषश्चक्षुरतिमुच्य धीराः प्रेत्यास्माल्लोकादमृता भवन्ति ॥',
          transliteration:
            'śrotrasya śrotraṃ manaso mano yadvāco ha vācaṃ sa u prāṇasya prāṇaḥ | cakṣuṣaścakṣuratimucya dhīrāḥ pretyāsmāllokādamṛtā bhavanti ||',
          translation:
            'It is the ear of the ear, the mind of the mind, the speech of speech, the life of life, the eye of the eye. The wise, transcending the senses, become immortal after departing from this world.',
          hindi:
            'वह (ब्रह्म) कान का कान, मन का मन, वाणी की वाणी, प्राण का प्राण, नेत्र का नेत्र है। इन्द्रियों से ऊपर उठकर विद्वान् लोग इस लोक से जाकर अमर हो जाते हैं।',
          explanation:
            'Brahman is not an object of perception — IT IS the power of perception itself. It cannot be seen; it is that by which the eye sees. One of the most precise formulations of the witness-Self in any philosophy.',
          science:
            "Neuroscience processes about 11 million bits per second; conscious awareness holds only ~50. Who selects? The 'explanatory gap' between neural correlates and subjective experience is exactly what the Upanishad calls Brahman — the witness that cannot be witnessed as an object.",
          lifeLesson:
            'You cannot know your deepest Self by thinking about it, because the mind is the instrument, not the knower. Meditation is resting in the awareness that knows — without making that awareness into an object.',
          keywords: ['WitnessConsciousness', 'BeyondMind', 'Perception'],
        },
        {
          id: 3,
          sanskrit:
            'न तत्र चक्षुर्गच्छति न वाग्गच्छति नो मनः । न विद्मो न विजानीमो यथैतदनुशिष्यात् ॥',
          transliteration:
            'na tatra cakṣurgacchati na vāggacchati no manaḥ | na vidmo na vijānīmo yathaitadanuśiṣyāt ||',
          translation:
            'There the eye does not go, nor speech, nor mind. We do not know; we cannot understand how one should teach this.',
          hindi:
            'वहाँ न नेत्र पहुँचता है, न वाणी, न मन। हम नहीं जानते, नहीं समझ पाते कि इसकी शिक्षा कैसे दी जाए।',
          explanation:
            'A confession of teaching’s limit. The senses cannot reach Brahman; the mind cannot conceive it; speech cannot describe it. Even the teacher confesses: we do not know how to teach this. Pedagogy itself bows before the mystery.',
          science:
            "Gödel's incompleteness theorem proved that any sufficiently rich formal system contains true statements it cannot prove. Reality may have a 'Gödel limit' — truths the mind can point toward but never grasp. The Upanishad reaches the same boundary three millennia early.",
          lifeLesson:
            'Be humble before what cannot be explained. A teacher who admits the limits of language teaches more than one who pretends to total knowledge. Honor the unsayable in your conversations.',
          keywords: ['Inexpressible', 'Humility', 'Limit'],
        },
        {
          id: 4,
          sanskrit:
            'अन्यदेव तद्विदितादथो अविदितादधि । इति शुश्रुम पूर्वेषां ये नस्तद्व्याचचक्षिरे ॥',
          transliteration:
            'anyadeva tadviditādatho aviditādadhi | iti śuśruma pūrveṣāṃ ye nastadvyācacakṣire ||',
          translation:
            'It is other than the known and also above the unknown. So we have heard from the ancients who explained it to us.',
          hindi:
            'वह ज्ञात से भी अन्य है और अज्ञात से भी ऊपर है। ऐसा हमने उन पूर्वजों से सुना है जिन्होंने हमें यह समझाया।',
          explanation:
            'Brahman is not "the unknown" — that would still place it in the category of objects. It is the very third category: not known, not unknown, but that which makes both knowing and not-knowing possible. The verse opens space beyond the knowledge/ignorance binary.',
          science:
            'Set theory: a meta-set is not a member of itself. Consciousness as the field in which "known" and "unknown" appear is not itself a thing that can be classified as either. The Upanishad describes a logical structure that mathematics rediscovered in the 20th century.',
          lifeLesson:
            'Reality has more than two categories. When you find yourself trapped in "I know" vs "I don\'t know," look for a third position — the openness in which both categories arise.',
          keywords: ['Beyond', 'ThirdCategory', 'Mystery'],
        },
        {
          id: 5,
          sanskrit:
            "यद्वाचानभ्युदितं येन वागभ्युद्यते । तदेव ब्रह्म त्वं विद्धि नेदं यदिदमुपासते ॥",
          transliteration:
            "yadvācānabhyuditaṃ yena vāgabhyudyate | tadeva brahma tvaṃ viddhi nedaṃ yadidamupāsate ||",
          translation:
            'That which speech does not express, but which expresses speech itself — know that alone as Brahman, not this which people worship as such.',
          hindi:
            'जो वाणी से प्रकट नहीं होता, परन्तु जिसके द्वारा वाणी प्रकट होती है — उसी को ब्रह्म जान। उसे नहीं जो लोग पूजते हैं।',
          explanation:
            'The first of five parallel verses. Brahman is the power behind speech, not its content. Whatever you worship as Brahman is already a limited object; the real Brahman is what enables the worship to happen. A radical correction to all idolatry.',
          science:
            'Linguistics: the ability to produce language is more fundamental than any particular utterance (Chomsky\'s "competence vs performance"). Behind every sentence lies a generative grammar — the unspoken power that speech itself cannot articulate.',
          lifeLesson:
            "Distinguish the worshiper, the worshiped, and the power that allows worship to happen. Most religion fixates on the second; the Upanishad redirects you to the third — the awareness in which all reverence arises.",
          keywords: ['Speech', 'Source', 'Worship'],
        },
        {
          id: 6,
          sanskrit:
            "यन्मनसा न मनुते येनाहुर्मनो मतम् । तदेव ब्रह्म त्वं विद्धि नेदं यदिदमुपासते ॥",
          transliteration:
            "yanmanasā na manute yenāhurmano matam | tadeva brahma tvaṃ viddhi nedaṃ yadidamupāsate ||",
          translation:
            'That which the mind does not think, but by which the mind itself is thought — know that alone as Brahman, not this which people worship as such.',
          hindi:
            'जिसको मन सोच नहीं सकता, परन्तु जिसके द्वारा मन को सोचा (जाना) जाता है — उसी को ब्रह्म जान। उसे नहीं जो लोग पूजते हैं।',
          explanation:
            'The mind itself, like every other faculty, is an object in awareness. You can observe your own mind — therefore the observer is prior to the mind. That prior consciousness, in which the mind appears, is Brahman.',
          science:
            "Metacognition research (Flavell, 1979): humans uniquely can think about their own thinking. The 'thought-watcher' is a higher-order process, not the thoughts themselves. The Upanishad locates Brahman at the topmost layer of this recursion.",
          lifeLesson:
            'When a difficult thought arises, do not try to think your way out. Instead, notice the awareness that is aware of the thought. That noticing is itself a step out of the labyrinth.',
          keywords: ['Mind', 'Metacognition', 'Awareness'],
        },
        {
          id: 7,
          sanskrit:
            "यच्चक्षुषा न पश्यति येन चक्षूंषि पश्यति । तदेव ब्रह्म त्वं विद्धि नेदं यदिदमुपासते ॥",
          transliteration:
            "yaccakṣuṣā na paśyati yena cakṣūṃṣi paśyati | tadeva brahma tvaṃ viddhi nedaṃ yadidamupāsate ||",
          translation:
            'That which the eye does not see, but by which the eye sees — know that alone as Brahman, not this which people worship as such.',
          hindi:
            'जिसको नेत्र नहीं देख सकता, परन्तु जिसके द्वारा नेत्र देखता है — उसी को ब्रह्म जान। उसे नहीं जो लोग पूजते हैं।',
          explanation:
            'The eye cannot see itself; the seer cannot be seen. Yet there is a power that animates seeing. That power is Brahman. The verse is a precise instruction for inverting attention: look not at the seen, nor the seeing, but at the seer.',
          science:
            'A camera cannot photograph itself capturing; an instrument cannot fully measure itself. Consciousness has the same structure: it can perceive everything except its own perceiving — yet that act is undeniable. This is the "irreducible first-person" of phenomenology.',
          lifeLesson:
            "When you look at a flower, briefly turn the attention 180°: notice who is looking. That backward glance, repeated, slowly relaxes identification with the body-mind into the wider seeing.",
          keywords: ['Eye', 'Seer', 'Inversion'],
        },
        {
          id: 8,
          sanskrit:
            "यच्छ्रोत्रेण न शृणोति येन श्रोत्रमिदं श्रुतम् । तदेव ब्रह्म त्वं विद्धि नेदं यदिदमुपासते ॥",
          transliteration:
            "yacchrotreṇa na śṛṇoti yena śrotramidaṃ śrutam | tadeva brahma tvaṃ viddhi nedaṃ yadidamupāsate ||",
          translation:
            'That which the ear does not hear, but by which this ear is heard (known) — know that alone as Brahman, not this which people worship as such.',
          hindi:
            'जिसको कान नहीं सुन सकता, परन्तु जिसके द्वारा यह कान सुना (जाना) जाता है — उसी को ब्रह्म जान। उसे नहीं जो लोग पूजते हैं।',
          explanation:
            'Sound exists, hearing happens — but the hearer is not itself a sound. Brahman is the silent ground in which all sounds appear. The deepest listening is not for any sound but for the listener.',
          science:
            "Audio engineering distinguishes 'signal' from 'system response' — the ear processes sound, but the awareness of hearing is a different order. fMRI shows distinct neural networks for 'sound detection' and 'awareness of sound.' The Upanishad maps the second.",
          lifeLesson:
            "Listen to a piece of music and shift attention from the music to the listening. The music becomes more vivid, not less. Awareness amplifies what it rests on. This is the secret of all aesthetic appreciation.",
          keywords: ['Ear', 'Listener', 'Silence'],
        },
        {
          id: 9,
          sanskrit:
            "यत्प्राणेन न प्राणिति येन प्राणः प्रणीयते । तदेव ब्रह्म त्वं विद्धि नेदं यदिदमुपासते ॥",
          transliteration:
            "yatprāṇena na prāṇiti yena prāṇaḥ praṇīyate | tadeva brahma tvaṃ viddhi nedaṃ yadidamupāsate ||",
          translation:
            'That which does not breathe by the breath, but by which the breath itself is breathed — know that alone as Brahman, not this which people worship as such.',
          hindi:
            'जो प्राण से साँस नहीं लेता, परन्तु जिसके द्वारा प्राण संचालित होता है — उसी को ब्रह्म जान। उसे नहीं जो लोग पूजते हैं।',
          explanation:
            'Breathing happens to you — you do not actually run the diaphragm by deliberate command. Watch the breath and you discover: it breathes itself. Behind the breathing is the unbreathing intelligence that animates it. That is Brahman.',
          science:
            'Respiration is regulated by the brainstem, below conscious control, by neurons in the pre-Bötzinger complex. You do not breathe — you are breathed. Awareness of this opens the gateway practice of all major contemplative traditions.',
          lifeLesson:
            'Spend one minute watching your breath without controlling it. Notice that something deeper than your will is operating. Surrender to that intelligence. It already runs your body; you can learn to trust it with your life.',
          keywords: ['Prana', 'Breath', 'Surrender'],
        },
      ],
    },
    {
      id: 2,
      title: 'Khaṇḍa 2 — The Paradox of Knowing',
      titleSanskrit: 'द्वितीय खण्ड',
      summary:
        'Five verses. The famous paradox: he who says "I know Brahman" does not know; he who admits "I do not know" knows. Knowledge here is not propositional grasp but a dissolution of the knower-known divide. Realization in every act of awareness ("pratibodha-viditam") is the truth.',
      verses: [
        {
          id: 10,
          sanskrit:
            "यदि मन्यसे सुवेदेति दहरमेवापि नूनं त्वं वेत्थ ब्रह्मणो रूपम् । यदस्य त्वं यदस्य देवेष्वथ नु मीमांस्यमेव ते मन्ये विदितम् ॥",
          transliteration:
            "yadi manyase suvedeti daharamevāpi nūnaṃ tvaṃ vettha brahmaṇo rūpam | yadasya tvaṃ yadasya deveṣvatha nu mīmāṃsyameva te manye viditam ||",
          translation:
            '(Teacher to student:) If you think you know Brahman well, in truth you know only a fragment of its form, whether of it in yourself or in the gods. Therefore Brahman is still to be inquired into by you. (Student:) I think I know it.',
          hindi:
            '(आचार्य कहता है:) यदि तू सोचता है कि मैं ब्रह्म को अच्छी तरह जानता हूँ, तो वास्तव में तू उसके स्वरूप का अल्प भाग ही जानता है — चाहे अपने में, चाहे देवों में। अतः तुझे और विचार करना चाहिए। (शिष्य:) मैं समझता हूँ कि मैंने जान लिया।',
          explanation:
            "Pivotal turning point. The teacher warns: if you think you have understood Brahman, you have understood only a fragment — never the whole. Confidence in spiritual knowing is itself the disqualification.",
          science:
            "Dunning-Kruger effect: those with least competence are most confident; true experts deeply know what they don't know. The Upanishad anticipates the cognitive bias by three millennia.",
          lifeLesson:
            "Whenever you find yourself certain about a deep matter, treat the certainty itself as a red flag. The wisest people are always the most ready to say 'I may be missing something.'",
          keywords: ['Inquiry', 'Confidence', 'Caution'],
        },
        {
          id: 11,
          sanskrit:
            "नाहं मन्ये सुवेदेति नो न वेदेति वेद च । यो नस्तद्वेद तद्वेद नो न वेदेति वेद च ॥",
          transliteration:
            "nāhaṃ manye suvedeti no na vedeti veda ca | yo nastadveda tadveda no na vedeti veda ca ||",
          translation:
            '(The student, matured:) I do not think I know it well; nor do I think I do not know it. He among us who knows it, knows it — and knows that he does not "not-know" it.',
          hindi:
            '(शिष्य, परिपक्व होकर:) मैं यह नहीं मानता कि मैंने उसे अच्छी तरह जान लिया, न ही यह कि मैं नहीं जानता। हममें से जो उसे जानता है, वह उसे जानता है, और यह भी जानता है कि वह "नहीं जानता" — ऐसा भी नहीं है।',
          explanation:
            "The mature response. Not 'I know' (arrogant), not 'I don't know' (resigned) — but a deeper position that includes both poles without being captured by either. This is the precise grammar of mystical realization.",
          science:
            "Quantum logic: a system can be in a superposition that is not simply 'A' or 'not-A' but something irreducibly both. The Upanishad describes this kind of irreducible double-truth in the moral and contemplative domain.",
          lifeLesson:
            "Practice saying 'I know and I don't' as a single sentence — not as confusion but as humility. Most life-decisions live in that nuanced middle, not in confident binaries.",
          keywords: ['Paradox', 'Maturity', 'BothNeither'],
        },
        {
          id: 12,
          sanskrit:
            'यस्यामतं तस्य मतं मतं यस्य न वेद सः । अविज्ञातं विजानतां विज्ञातमविजानताम् ॥',
          transliteration:
            'yasyāmataṃ tasya mataṃ mataṃ yasya na veda saḥ | avijñātaṃ vijānatāṃ vijñātamavijānatām ||',
          translation:
            'He who thinks he does not know — knows. He who thinks he knows — does not know. It is unknown to those who know, and known to those who do not know.',
          hindi:
            'जिसे लगता है कि मैंने नहीं जाना, उसने जान लिया है। जिसे लगता है कि मैंने जान लिया, उसने नहीं जाना। ज्ञानियों के लिए वह अज्ञात है; अज्ञानियों के लिए वह ज्ञात है।',
          explanation:
            "The most famous verse of Kena. The moment you claim 'I know' you have made Brahman into an object — but Brahman is the subject. True self-knowledge is a dissolution of the knower-known divide, not the addition of one more item to your inventory of facts.",
          science:
            "Feynman: 'If you think you understand quantum mechanics, you don't understand quantum mechanics.' True mastery in any deep field brings deepening humility — exactly the Upanishad's structural insight.",
          lifeLesson:
            "Practice saying 'I don't know' with genuine curiosity rather than anxiety. Certainty is the end of learning; wonder is its beginning.",
          keywords: ['Paradox', 'Humility', 'TrueKnowledge'],
        },
        {
          id: 13,
          sanskrit:
            "प्रतिबोधविदितं मतममृतत्वं हि विन्दते । आत्मना विन्दते वीर्यं विद्यया विन्दतेऽमृतम् ॥",
          transliteration:
            "pratibodhaviditaṃ matamamṛtatvaṃ hi vindate | ātmanā vindate vīryaṃ vidyayā vindate'mṛtam ||",
          translation:
            'It is known in every act of awareness — and that knowing is immortality. By the Self one finds strength; by knowledge one finds the immortal.',
          hindi:
            'वह प्रतिबोध (हर बोध-क्षण) में जाना जाता है; वही ज्ञान अमरत्व देता है। आत्मा से ही बल मिलता है, विद्या से अमृत मिलता है।',
          explanation:
            "Pratibodha-viditam — 'known in every cognition.' Brahman is not the object of a future special experience; it is the awareness that is already present in every act of knowing right now. Realization is not addition but recognition.",
          science:
            "Phenomenology (Husserl): every experience has a 'noetic-noematic' structure — an awareness-of and a content-of. The awareness-of is always present, never an object. The Upanishad places liberation at exactly this always-already structural feature.",
          lifeLesson:
            "Do not wait for a special experience. Look in the most ordinary moment — reading these words, feeling the chair under you — and notice the awareness that is already perceiving. That is what the Upanishad calls immortal. You have never been without it.",
          keywords: ['Pratibodha', 'AlwaysPresent', 'Recognition'],
        },
        {
          id: 14,
          sanskrit:
            "इह चेदवेदीदथ सत्यमस्ति न चेदिहावेदीन्महती विनष्टिः । भूतेषु भूतेषु विचित्य धीराः प्रेत्यास्माल्लोकादमृता भवन्ति ॥",
          transliteration:
            "iha cedavedīdatha satyamasti na cedihāvedīnmahatī vinaṣṭiḥ | bhūteṣu bhūteṣu vicitya dhīrāḥ pretyāsmāllokādamṛtā bhavanti ||",
          translation:
            'If one has realized it here, there is truth; if one has not realized it here, great is the loss. The wise, seeing it in being after being, depart from this world and become immortal.',
          hindi:
            'यदि इस लोक में जान लिया, तब सत्य है; यदि यहाँ न जान सका, तो बड़ी हानि है। धीर पुरुष प्रत्येक प्राणी में इसे देखकर, इस लोक से जाकर अमर हो जाते हैं।',
          explanation:
            'A stern reminder: realization must happen here, in this life. If you postpone it for "later," you have already lost it. The wise recognize the one Self in every being — and that recognition is liberation.',
          science:
            "Existentialism (Heidegger) calls this 'being-toward-death' — the structural fact that we exist with a finite horizon, and meaning must be made within it. The Upanishad shares the urgency: now is all you have to realize.",
          lifeLesson:
            "Do not save 'spiritual life' for retirement. The realization is for here, now — at this kitchen table, in this conversation. Postponement is a subtle form of refusal.",
          keywords: ['Urgency', 'Realization', 'HereNow'],
        },
      ],
    },
    {
      id: 3,
      title: 'Khaṇḍa 3 — The Allegory of the Yakṣa',
      titleSanskrit: 'तृतीय खण्ड',
      summary:
        'Twelve prose passages. The gods grew proud after a victory, believing it their own. Brahman appeared as a mysterious yakṣa (spirit) to test them. Agni and Vāyu could not even burn or move a blade of grass before it. Indra approached — and Brahman vanished, leaving Umā Haimavatī to teach him.',
      verses: [
        {
          id: 15,
          sanskrit:
            'ब्रह्म ह देवेभ्यो विजिग्ये तस्य ह ब्रह्मणो विजये देवा अमहीयन्त । त ऐक्षन्तास्माकमेवायं विजयोऽस्माकमेवायं महिमेति ॥',
          transliteration:
            "brahma ha devebhyo vijigye tasya ha brahmaṇo vijaye devā amahīyanta | ta aikṣantāsmākamevāyaṃ vijayo'smākamevāyaṃ mahimeti ||",
          translation:
            'Brahman, it is said, won a victory for the gods. In that victory of Brahman the gods exulted. They thought: "Ours alone is this victory, ours alone is this glory."',
          hindi:
            'कहा जाता है कि ब्रह्म ने देवताओं के लिए विजय प्राप्त की। उस विजय में देवता गर्व करने लगे। वे सोचने लगे — "यह विजय हमारी ही है, यह महिमा हमारी ही है।"',
          explanation:
            "The setup of a teaching parable. The gods receive a real victory from Brahman, but immediately appropriate the glory to themselves. The ego's first move: take credit for what was given.",
          science:
            "Self-serving attribution bias (Heider, 1958): humans systematically attribute success to themselves and failure to circumstances. The Upanishad identifies this structural feature of the mind 3000 years before social psychology.",
          lifeLesson:
            'After a success, pause. Ask: what conditions had to align for this — beyond my effort — for the success to be possible? Genuine gratitude is the antidote to the gods\' mistake.',
          keywords: ['Ego', 'Attribution', 'Gratitude'],
        },
        {
          id: 16,
          sanskrit:
            'तद्धैषां विजज्ञौ तेभ्यो ह प्रादुर्बभूव तन्न व्यजानत किमिदं यक्षमिति ॥',
          transliteration:
            'taddhaiṣāṃ vijajñau tebhyo ha prādurbabhūva tanna vyajānata kimidaṃ yakṣamiti ||',
          translation:
            'Brahman knew their thought, and appeared before them. But they did not recognize it: "What is this mysterious being (yakṣa)?"',
          hindi:
            'ब्रह्म ने उनके इस विचार को जान लिया, और उनके सामने प्रकट हुआ। वे उसे पहचान न सके — "यह अद्भुत यक्ष कौन है?"',
          explanation:
            'Brahman appears as a mysterious yakṣa — recognized neither as Brahman nor as any familiar god. The gods are perplexed. Pride has made them blind to the very source of their power.',
          science:
            "Inattentional blindness (Simons & Chabris): even a gorilla walking through a basketball game goes unseen if you are focused elsewhere. The mind preoccupied with itself cannot perceive what is in plain view.",
          lifeLesson:
            'The presence you most need to recognize is often standing right in front of you, unrecognized because it does not fit your categories. Let go of categories occasionally and just look.',
          keywords: ['Yaksha', 'Blindness', 'Recognition'],
        },
        {
          id: 17,
          sanskrit:
            'तेऽग्निमब्रुवञ्जातवेद एतद्विजानीहि किमेतद्यक्षमिति तथेति ॥',
          transliteration:
            "te'gnimabruvañjātaveda etadvijānīhi kimetadyakṣamiti tatheti ||",
          translation:
            'They said to Agni: "Jātaveda (knower-of-all), find out what this yakṣa is." "So be it," he replied.',
          hindi:
            'उन्होंने अग्नि से कहा — "हे जातवेद, पता लगा कि यह यक्ष क्या है।" "अच्छा," अग्नि ने उत्तर दिया।',
          explanation:
            'The gods delegate the inquiry to Agni, "knower of all that is born." Agni accepts with full confidence — the perfect setup for his humbling.',
          science:
            "Hubris precedes investigation in many failed scientific projects. Confidence is necessary but easily inflates beyond competence. The narrative shows the universal pattern.",
          lifeLesson:
            'Before accepting an unfamiliar assignment with the words "no problem," check whether you actually know the territory. False confidence is the seed of failure.',
          keywords: ['Agni', 'Delegation', 'Confidence'],
        },
        {
          id: 18,
          sanskrit:
            "तदभ्यद्रवत्तमभ्यवदत्कोऽसीत्यग्निर्वा अहमस्मीत्यब्रवीज्जातवेदा वा अहमस्मीति ॥",
          transliteration:
            "tadabhyadravattamabhyavadatko'sītyagnirvā ahamasmītyabravījjātavedā vā ahamasmīti ||",
          translation:
            'He approached the yakṣa. It said: "Who are you?" "I am Agni," he replied, "I am Jātaveda."',
          hindi:
            'अग्नि उसके पास पहुँचा। यक्ष ने पूछा — "तुम कौन हो?" अग्नि ने कहा — "मैं अग्नि हूँ, मैं जातवेद हूँ।"',
          explanation:
            'The yakṣa\'s simple question — "Who are you?" — is the great spiritual question. Agni answers by his name and role. The reply identifies him with his function — exactly the move the Upanishad will dismantle.',
          science:
            "Identity research: people answering 'who are you?' with role-labels ('I am a doctor,' 'I am a parent') show lower resilience than those who can describe themselves apart from role. Role-identity is fragile under stress.",
          lifeLesson:
            'When asked who you are, notice how often the answer is a role. There is something prior to every role. The yakṣa\'s question is your daily invitation to find it.',
          keywords: ['Identity', 'Role', 'Question'],
        },
        {
          id: 19,
          sanskrit:
            "तस्मिंस्त्वयि किं वीर्यमित्यपीदं सर्वं दहेयं यदिदं पृथिव्यामिति ॥",
          transliteration:
            "tasmiṃstvayi kiṃ vīryamityapīdaṃ sarvaṃ daheyaṃ yadidaṃ pṛthivyāmiti ||",
          translation:
            '"What power is in you?" "I can burn up everything that is on this earth!"',
          hindi:
            '"तुझमें क्या शक्ति है?" "जो कुछ भी इस पृथ्वी पर है, मैं उसे जला सकता हूँ!"',
          explanation:
            'Agni boasts of universal incineration. The boast is true — fire does consume — but the verse will reveal that the power comes from somewhere beyond Agni himself.',
          science:
            'Energy is conserved. The combustion Agni performs is the release of chemical-bond energy that was stored elsewhere. Fire is a borrower, not an originator. The Upanishad knows this.',
          lifeLesson:
            'Examine your strongest abilities. Where did the power come from? Trace it backward — and you will find a chain that leads to a source not yourself.',
          keywords: ['Power', 'Boast', 'Source'],
        },
        {
          id: 20,
          sanskrit:
            "तस्मै तृणं निदधावेतद्दहेति । तदुपप्रेयाय सर्वजवेन तन्न शशाक दग्धुं स तत एव निववृते नैतदशकं विज्ञातुं यदेतद्यक्षमिति ॥",
          transliteration:
            "tasmai tṛṇaṃ nidadhāvetaddaheti | tadupapreyāya sarvajavena tanna śaśāka dagdhuṃ sa tata eva nivavṛte naitadaśakaṃ vijñātuṃ yadetadyakṣamiti ||",
          translation:
            'The yakṣa placed a blade of grass before him: "Burn this." Agni rushed at it with all his speed but could not burn it. He returned, saying: "I could not find out what this yakṣa is."',
          hindi:
            'यक्ष ने उसके सामने एक तृण रखा — "इसे जला।" अग्नि अपनी पूरी शक्ति से उस पर झपटा, परन्तु उसे जला न सका। वह लौट आया — "मैं नहीं जान सका कि यह यक्ष क्या है।"',
          explanation:
            'The humiliation is exquisite — not a mountain, just a blade of grass. The cosmic fire cannot burn a single straw without the underlying power. Agni returns defeated and, crucially, honest about his defeat.',
          science:
            "Power without context is illusion. A flame without oxygen, an engine without fuel, a CPU without electricity — every system depends on enabling conditions usually invisible. The 'yakṣa' is the enabling condition itself.",
          lifeLesson:
            'When your gifts suddenly fail before something trivial, do not rage. Sit with the failure. It is showing you the difference between your apparent power and your actual ground.',
          keywords: ['Humility', 'Failure', 'Honesty'],
        },
        {
          id: 21,
          sanskrit:
            'अथ वायुमब्रुवन्वायवेतद्विजानीहि किमेतद्यक्षमिति तथेति ॥',
          transliteration:
            'atha vāyumabruvanvāyavetadvijānīhi kimetadyakṣamiti tatheti ||',
          translation:
            'Then they said to Vāyu (wind): "Vāyu, find out what this yakṣa is." "So be it," he replied.',
          hindi:
            'फिर उन्होंने वायु से कहा — "वायु, पता लगा कि यह यक्ष क्या है।" "अच्छा," वायु ने उत्तर दिया।',
          explanation:
            'A second emissary is sent — Vāyu, who pervades all space. The same confident "tatheti" — "so be it." The pattern of futile attempts continues.',
          science:
            'When one approach fails, organizations often try a more powerful version of the same approach. The Upanishad illustrates this through the structurally parallel failures of Agni and Vāyu.',
          lifeLesson:
            'If a confident attempt has failed, sending a second confident attempt rarely succeeds. Switch the mode, not just the agent.',
          keywords: ['Vayu', 'Repetition', 'Pattern'],
        },
        {
          id: 22,
          sanskrit:
            "तदभ्यद्रवत्तमभ्यवदत्कोऽसीति वायुर्वा अहमस्मीत्यब्रवीन्मातरिश्वा वा अहमस्मीति ॥",
          transliteration:
            "tadabhyadravattamabhyavadatko'sīti vāyurvā ahamasmītyabravīnmātariśvā vā ahamasmīti ||",
          translation:
            'He approached. The yakṣa said: "Who are you?" "I am Vāyu," he replied, "I am Mātariśvan."',
          hindi:
            'वायु पास पहुँचा। यक्ष ने पूछा — "तुम कौन हो?" वायु ने कहा — "मैं वायु हूँ, मैं मातरिश्वा हूँ।"',
          explanation:
            'Same exchange, same role-bound answer. The yakṣa repeats the question — the question is unchanging because the answer never satisfies.',
          science:
            "Some questions are not asked to be answered but to expose the inadequacy of every reply. In therapy and philosophy alike, repeated questioning erodes false identities and reveals what lies beneath.",
          lifeLesson:
            "When the same question keeps returning in your life ('who am I really?'), do not seek a quicker answer. Stay with the question. It is doing precisely what the yakṣa does.",
          keywords: ['Repetition', 'Question', 'Erosion'],
        },
        {
          id: 23,
          sanskrit:
            'तस्मिंस्त्वयि किं वीर्यमित्यपीदं सर्वमाददीय यदिदं पृथिव्यामिति ॥',
          transliteration:
            'tasmiṃstvayi kiṃ vīryamityapīdaṃ sarvamādadīya yadidaṃ pṛthivyāmiti ||',
          translation:
            '"What power is in you?" "I can carry off everything that is on this earth!"',
          hindi:
            '"तुझमें क्या शक्ति है?" "जो कुछ भी इस पृथ्वी पर है, मैं उसे उठा ले जा सकता हूँ!"',
          explanation:
            'Vāyu boasts as Agni did. The wind that levels forests and lifts oceans claims universal mobility — and is about to discover that even motion requires a permission slip.',
          science:
            'Wind has kinetic energy because of pressure gradients, which depend on solar heating, which depends on nuclear processes in the sun. Every "natural" power has a chain of dependencies stretching to the cosmic origin.',
          lifeLesson:
            'Trace the chain of dependency behind any boast. Sooner or later you arrive at conditions you did not create. Stop there and bow.',
          keywords: ['Wind', 'Boast', 'Dependency'],
        },
        {
          id: 24,
          sanskrit:
            "तस्मै तृणं निदधावेतदादत्स्वेति । तदुपप्रेयाय सर्वजवेन तन्न शशाकाऽऽदातुं स तत एव निववृते नैतदशकं विज्ञातुं यदेतद्यक्षमिति ॥",
          transliteration:
            "tasmai tṛṇaṃ nidadhāvetadādatsveti | tadupapreyāya sarvajavena tanna śaśākā''dātuṃ sa tata eva nivavṛte naitadaśakaṃ vijñātuṃ yadetadyakṣamiti ||",
          translation:
            'The yakṣa placed a blade of grass before him: "Take this away." He rushed at it with all his speed but could not move it. He returned: "I could not find out what this yakṣa is."',
          hindi:
            'यक्ष ने उसके सामने एक तृण रखा — "इसे उठा ले जा।" वायु अपनी पूरी शक्ति से उस पर झपटा, परन्तु उसे हिला न सका। वह लौट आया — "मैं नहीं जान सका कि यह यक्ष क्या है।"',
          explanation:
            'The same failure. Even Vāyu — wind, the mover of mountains — cannot stir a blade of grass. The repetition drives the teaching home: power borrowed is power conditional.',
          science:
            "Repetition with variation is a teaching device the Upanishad shares with modern educational theory ('spaced repetition'). The two failures cement what one might not.",
          lifeLesson:
            "Failure repeated in different domains is rarely random. It is reality showing you the same lesson from another angle. Read failure as feedback, not insult.",
          keywords: ['Repetition', 'Lesson', 'Feedback'],
        },
        {
          id: 25,
          sanskrit:
            'अथेन्द्रमब्रुवन्मघवन्नेतद्विजानीहि किमेतद्यक्षमिति तथेति तदभ्यद्रवत्तस्मात्तिरोदधे ॥',
          transliteration:
            'athendramabruvanmaghavannetadvijānīhi kimetadyakṣamiti tatheti tadabhyadravattasmāttirodadhe ||',
          translation:
            'Then they said to Indra: "Maghavan (mighty one), find out what this yakṣa is." "So be it," he replied. He approached — and the yakṣa vanished from him.',
          hindi:
            'फिर उन्होंने इन्द्र से कहा — "हे मघवन्, पता लगा कि यह यक्ष क्या है।" "अच्छा," इन्द्र ने उत्तर दिया। वह पास पहुँचा — और यक्ष उसके सामने से अदृश्य हो गया।',
          explanation:
            'Indra approaches — but the yakṣa disappears before he can even speak. The teaching now becomes subtler: the king of the gods will not be humiliated by direct confrontation; instead, he is left with absence and longing — the precondition for true inquiry.',
          science:
            "Absence is often the most powerful presence. In music, a rest signals more than a note; in conversation, silence often communicates more than speech. The yakṣa's disappearance is pedagogy in absence.",
          lifeLesson:
            'When the divine seems to vanish from your life, do not rush to fill the gap. The vanishing itself may be the teaching. Wait with the absence. It is often the antechamber of insight.',
          keywords: ['Indra', 'Absence', 'Longing'],
        },
        {
          id: 26,
          sanskrit:
            'स तस्मिन्नेवाकाशे स्त्रियमाजगाम बहुशोभमानामुमां हैमवतीं तां होवाच किमेतद्यक्षमिति ॥',
          transliteration:
            'sa tasminnevākāśe striyamājagāma bahuśobhamānāmumāṃ haimavatīṃ tāṃ hovāca kimetadyakṣamiti ||',
          translation:
            'In that same space he encountered a most radiant woman, Umā Haimavatī. He said to her: "What is this yakṣa?"',
          hindi:
            'उसी आकाश में उसे एक अत्यन्त शोभायमान स्त्री मिली — उमा हैमवती। उसने उससे पूछा — "यह यक्ष क्या है?"',
          explanation:
            "Where Agni and Vāyu were confronted by the yakṣa directly, Indra meets Umā Haimavatī — wisdom in the form of a woman. The teaching arrives not by combat but by inquiry from a humbler position. Indra asks; she will teach.",
          science:
            "Knowledge transmission often requires the right relational geometry: the student must be humbled, the teacher must be accessible. The Upanishad encodes this in narrative form.",
          lifeLesson:
            'The teacher appears when the student is ready — never before. Indra became ready only after the divine receded. Cultivate the readiness; the teacher is already nearby.',
          keywords: ['Uma', 'Wisdom', 'Teacher'],
        },
      ],
    },
    {
      id: 4,
      title: 'Khaṇḍa 4 — The Teaching of Umā',
      titleSanskrit: 'चतुर्थ खण्ड',
      summary:
        'Nine prose passages. Umā reveals: that yakṣa was Brahman — through whose victory you exulted, not your own. The Upanishad concludes with the disciplines that sustain this knowledge (tapas, dama, karma), the foundations (the Vedas, all limbs, truth), and the fruit: established in the supreme realm.',
      verses: [
        {
          id: 27,
          sanskrit:
            "सा ब्रह्मेति होवाच ब्रह्मणो वा एतद्विजये महीयध्वमिति ततो हैव विदाञ्चकार ब्रह्मेति ॥",
          transliteration:
            "sā brahmeti hovāca brahmaṇo vā etadvijaye mahīyadhvamiti tato haiva vidāñcakāra brahmeti ||",
          translation:
            'She said: "That was Brahman. In the victory of Brahman, in truth, you exulted." Then alone Indra understood that it was Brahman.',
          hindi:
            'उसने कहा — "वह ब्रह्म था। वास्तव में ब्रह्म की ही विजय में तुम लोग गर्व कर रहे थे।" तब इन्द्र ने जाना — "यह ब्रह्म है।"',
          explanation:
            "The revelation. The victory you took as your own was Brahman's. The yakṣa whose power you could not comprehend was the very source of your power. Indra hears this and immediately knows. Insight arrives not through cleverness but through humility.",
          science:
            "Attribution research shows that when we trace causal chains with full honesty, we always find conditions we did not produce — genes, upbringing, opportunities. Honest causation leads to gratitude. The Upanishad shows this in mythic form.",
          lifeLesson:
            'Today, when you do something well, say aloud — even silently — "this is Brahman\'s victory, not mine alone." This sentence, repeated daily, is the door out of the prison of self-credit.',
          keywords: ['Revelation', 'Gratitude', 'Brahman'],
        },
        {
          id: 28,
          sanskrit:
            "तस्माद्वा एते देवा अतितरामिवान्यान्देवान्यदग्निर्वायुरिन्द्रस्ते ह्येनन्नेदिष्ठं पस्पर्शुस्ते ह्येनत्प्रथमो विदाञ्चकार ब्रह्मेति ॥",
          transliteration:
            "tasmādvā ete devā atitarāmivānyāndevānyadagnirvāyurindraste hyenannediṣṭhaṃ pasparśuste hyenatprathamo vidāñcakāra brahmeti ||",
          translation:
            'Therefore these gods — Agni, Vāyu, and Indra — surpass the other gods, for they came nearest to Brahman; they first knew it as Brahman.',
          hindi:
            'इसी कारण ये देवता — अग्नि, वायु, इन्द्र — अन्य देवताओं से श्रेष्ठ हैं, क्योंकि उन्होंने ब्रह्म को सबसे पहले छुआ; उन्होंने सबसे पहले जाना — "यह ब्रह्म है।"',
          explanation:
            "Failure followed by insight is more valuable than untested confidence. Agni and Vāyu failed; Indra was abandoned. Yet because they confronted the mystery and were broken open, they alone touched Brahman. Their defeat became their elevation.",
          science:
            "Post-traumatic growth research (Tedeschi & Calhoun): people who survive serious adversity often report deeper meaning, stronger relationships, and renewed appreciation. The wound, faithfully met, becomes the doorway.",
          lifeLesson:
            'Do not curse your failures. The ones who fail and stay honest about it are closer to truth than those who succeed and never doubt. Your humbling is your initiation.',
          keywords: ['Failure', 'Initiation', 'Hierarchy'],
        },
        {
          id: 29,
          sanskrit:
            "तस्माद्वा इन्द्रोऽतितरामिवान्यान्देवान्स ह्येनन्नेदिष्ठं पस्पर्श स ह्येनत्प्रथमो विदाञ्चकार ब्रह्मेति ॥",
          transliteration:
            "tasmādvā indro'titarāmivānyāndevānsa hyenannediṣṭhaṃ pasparśa sa hyenatprathamo vidāñcakāra brahmeti ||",
          translation:
            'Therefore Indra surpasses the other gods, for he came nearest to Brahman; he first knew it as Brahman.',
          hindi:
            'इसीलिए इन्द्र अन्य देवताओं से श्रेष्ठ है, क्योंकि उसने ब्रह्म को सबसे निकट से छुआ; उसने सबसे पहले जाना — "यह ब्रह्म है।"',
          explanation:
            "Indra is singled out — not because he was strongest, but because he was the one for whom the yakṣa vanished and who therefore had to inquire. The deepest knower is not the one to whom truth was given easily, but the one who searched for it from absence.",
          science:
            "Effortful retrieval (the 'testing effect' in learning science) produces stronger memory than passive review. Knowledge struggled for is knowledge owned. Indra exemplifies effortful retrieval at the cosmic scale.",
          lifeLesson:
            'When understanding comes too easily, distrust it slightly. When it comes through honest searching after a vanishing, hold it gently — it is the kind that lasts.',
          keywords: ['Indra', 'Searching', 'Depth'],
        },
        {
          id: 30,
          sanskrit:
            'तस्यैष आदेशो यदेतद्विद्युतो व्यद्युतदा इतीन्न्यमीमिषदा इत्यधिदैवतम् ॥',
          transliteration:
            "tasyaiṣa ādeśo yadetadvidyuto vyadyutadā itīnnyamīmiṣadā ityadhidaivatam ||",
          translation:
            'This is its instruction at the cosmic level: it is like the flash of lightning, like the blink of an eye — there and gone.',
          hindi:
            'यह उसका (ब्रह्म का) कौस्मिक स्तर पर निर्देश है — जैसे विद्युत का चमकना, जैसे आँख का झपकना — प्रकट और तुरन्त लुप्त।',
          explanation:
            'Brahman in nature reveals itself in flashes: a lightning bolt, a sudden insight, a moment of beauty that catches the breath. Never sustained, always glimpsed. The instruction is to recognize these flashes as Brahman, not dismiss them as accident.',
          science:
            "Insight neuroscience: 'aha' moments correspond to a brief gamma-wave burst in the right anterior temporal lobe — a measurable flash. The Upanishad's lightning analogy is neurologically accurate.",
          lifeLesson:
            "Catch the flashes. The unexpected tear at a piece of music, the awe at a sunset, the sudden seeing of someone's deep nature — these are not random. They are Brahman blinking at you. Make a habit of acknowledging them.",
          keywords: ['Flash', 'Insight', 'Recognition'],
        },
        {
          id: 31,
          sanskrit:
            "अथाध्यात्मं यदेतद्गच्छतीव च मनोऽनेन चैतदुपस्मरत्यभीक्ष्णं सङ्कल्पः ॥",
          transliteration:
            "athādhyātmaṃ yadetadgacchatīva ca mano'nena caitadupasmaratyabhīkṣṇaṃ saṅkalpaḥ ||",
          translation:
            'And at the personal level: it is that toward which the mind seems to go; that by which the mind continuously remembers — the deep intention (saṅkalpa).',
          hindi:
            'और आत्म-स्तर पर: वह जिसकी ओर मन जाता-सा है, जिसके द्वारा मन लगातार स्मरण करता है — गहरा सङ्कल्प।',
          explanation:
            'In the inner life, Brahman shows up as the persistent pull of the mind toward truth, beauty, goodness — the recurring intention (saṅkalpa) that you cannot quite shake. The longing itself is the trace of the source.',
          science:
            "Default-mode-network research: even at rest, the mind keeps returning to certain themes. These recurrent attractors reveal one's deepest concerns. The Upanishad calls them traces of Brahman.",
          lifeLesson:
            'Notice what your mind keeps returning to when no one is watching. That recurring theme is your saṅkalpa — your deep intention. It is also your door to the source.',
          keywords: ['Sankalpa', 'Inwardness', 'Intention'],
        },
        {
          id: 32,
          sanskrit:
            "तद्ध तद्वनं नाम तद्वनमित्युपासितव्यं स य एतदेवं वेदाभि हैनं सर्वाणि भूतानि संवाञ्छन्ति ॥",
          transliteration:
            "taddha tadvanaṃ nāma tadvanamityupāsitavyaṃ sa ya etadevaṃ vedābhi hainaṃ sarvāṇi bhūtāni saṃvāñchanti ||",
          translation:
            'It is called Tadvana — "the desired-of-all." It should be worshipped as Tadvana. He who knows it thus — all beings yearn toward him.',
          hindi:
            'उसका नाम "तद्वन" (सबकी इच्छा-योग्य) है। इसी रूप में उसकी उपासना करनी चाहिए। जो इसे ऐसा जानता है, उसकी ओर सब प्राणी आकर्षित होते हैं।',
          explanation:
            'Brahman is "Tadvana" — what all desire really points toward. Every wanting is, at root, a wanting of Brahman. He who knows this becomes himself a magnet — all beings yearn toward him, because he has touched what they really want.',
          science:
            "Attachment theory: humans (and other social mammals) attune to those who radiate calm and integrated presence. A person grounded in their depths becomes an attractor for others — measurable in heart-rate coherence studies.",
          lifeLesson:
            'When you find yourself craving something, ask: what does this really point to? Behind every desire is a deeper one. Trace it home. The home of all desire is the same.',
          keywords: ['Tadvana', 'Desire', 'Attraction'],
        },
        {
          id: 33,
          sanskrit:
            "उपनिषदं भो ब्रूहीत्युक्ता त उपनिषद्ब्राह्मीं वाव त उपनिषदमब्रूमेति ॥",
          transliteration:
            "upaniṣadaṃ bho brūhītyuktā ta upaniṣadbrāhmīṃ vāva ta upaniṣadamabrūmeti ||",
          translation:
            '(Student:) "Sir, teach me the Upanishad." (Teacher:) "The Upanishad of Brahman has been told to you."',
          hindi:
            '(शिष्य:) "हे भगवन्, उपनिषद् कहिए।" (आचार्य:) "तुम्हें ब्रह्म-विद्या रूप उपनिषद् कह दी गई है।"',
          explanation:
            "A meta-moment. The student asks for the teaching — and is told it has already been given. The narrative itself is the teaching. The Upanishad is not a doctrine to be added on after the story; the story is the doctrine.",
          science:
            "Embodied learning: stories communicate truths that abstract formulations cannot. The narrative engages reward and memory centers (Wernicke's, hippocampus) that pure proposition does not. Pedagogy through parable is empirically superior.",
          lifeLesson:
            "When you ask for teaching, do not look only for instructions. Look at the story you are already inside. Your life is unfolding the lesson; pay attention to its plot.",
          keywords: ['Teaching', 'Narrative', 'AlreadyGiven'],
        },
        {
          id: 34,
          sanskrit:
            "तस्यै तपो दमः कर्मेति प्रतिष्ठा वेदाः सर्वाङ्गानि सत्यमायतनम् ॥",
          transliteration:
            "tasyai tapo damaḥ karmeti pratiṣṭhā vedāḥ sarvāṅgāni satyamāyatanam ||",
          translation:
            'Its foundations are: tapas (discipline), dama (self-restraint), karma (action). The Vedas are all its limbs. Truth is its abode.',
          hindi:
            'उसकी प्रतिष्ठा हैं — तप, दम, और कर्म। वेद उसके सम्पूर्ण अंग हैं। सत्य उसका निवास-स्थान है।',
          explanation:
            'The Upanishad-knowledge does not stand on insight alone. It rests on three pillars: tapas (the heat of sustained discipline), dama (self-mastery in the moment), karma (right action). Its limbs are the entire Vedic learning. Its home is truthfulness.',
          science:
            "Habit research (Duhigg, Clear): durable insight requires structural support — repeated discipline, environment design, and consistent practice. The Upanishad lists almost the same components.",
          lifeLesson:
            'Insight without discipline evaporates. Build the structure: a daily practice (tapas), restraint in the heat of the moment (dama), action aligned with values (karma). Then insight has somewhere to live.',
          keywords: ['Tapas', 'Dama', 'Karma', 'Foundation'],
        },
        {
          id: 35,
          sanskrit:
            "यो वा एतामेवं वेदापहत्य पाप्मानमनन्ते स्वर्गे लोके ज्येष्ठे च प्रतितिष्ठति प्रतितिष्ठति ॥",
          transliteration:
            "yo vā etāmevaṃ vedāpahatya pāpmānamanante svarge loke jyeṣṭhe ca pratitiṣṭhati pratitiṣṭhati ||",
          translation:
            'He who knows this thus, having driven off all evil, is established in the infinite, highest, supreme realm — yes, is established.',
          hindi:
            'जो इस उपनिषद् को इस प्रकार जानता है, वह सब पाप का नाश करके, अनन्त, श्रेष्ठ, ज्येष्ठ स्वर्ग-लोक में प्रतिष्ठित हो जाता है — प्रतिष्ठित हो जाता है।',
          explanation:
            "The classical closing 'pratitiṣṭhati pratitiṣṭhati' — the repetition that marks the end of an Upanishad. The fruit is not 'going somewhere' but being established here in the infinite. Sthiti (stability) is the gift.",
          science:
            'Long-term contemplative training produces measurable, stable changes in cortical thickness, default-mode-network connectivity, and emotional regulation (Davidson lab). What the Upanishad calls being "established" is a real neural state.',
          lifeLesson:
            'The goal is not a peak experience but stability — the kind of grounded presence that does not wobble when the world shakes. Build it slowly, by daily practice, until it becomes the very ground you stand on.',
          keywords: ['Sthiti', 'Establishment', 'Completion'],
        },
      ],
    },
  ],
};
