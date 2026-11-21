# Modern-context notes: Shiva Swarodaya (review note, 21 November 2026)

This note goes with the pull request that adds modern-context notes to the Shiva Swarodaya. It lists how the notes were checked, the verses a reviewer should read first, and the facts to spot-check. The notes are AI drafts and have not had a human editorial review.

## Status

- **Coverage:** verses 1:1 to 2:160 (160 of the book's 384 verses) now have a modern-context note. Verse numbers run on across chapters, so chapter 2 begins at 2:101. None had one before. The rest follow in later commits on the same pull request, and this note grows with them.
- **Source file:** `data/hi-commentary/shivaswarodaya-rest.json` is new and holds only the `lifeLesson` field. The existing व्याख्या (`explanation`) is unchanged for all 384 entries; this is verified after each publish.
- **Shape:** each note has आधुनिक संदर्भ (one real-world fact linked to the verse), आज के जीवन में प्रयोग (three applications) and चिंतन प्रश्न (one question).
- **Size cap:** the published commentary total passes 60 MB with this book, so `MAX_TOTAL_MB` in `scripts/convert-commentary-to-json.ts` is raised from 60 to 61 in the same pull request. Each file stays far below Cloudflare's 25 MiB per-file limit.

## How the notes were checked

- **Register:** every note passed `scripts/check-hindi-register.mjs` with no sentences to fix. The words are tatsam with no Urdu, Persian or English beyond unavoidable proper names and scientific terms (for example डीएनए, एटीपी, हाइड्रोजन). There is no first person.
- **Facts used once:** candidate facts were screened by keyword against every earlier note in all books before writing. After writing, each batch was run through the stricter check (rare words or years shared by any two notes, across all books including this one). One fact in 1:6 was found to repeat an earlier book and was replaced before publishing. For 1:81 to 2:160 the keyword screen ruled out more than sixty candidate facts that an earlier book had already used; the stricter check then found no repeats in the written batches. The only shared items it reports are years (for example 1854 or 1904) attached to different events.
- **Anchoring:** each note says in one sentence what the verse itself teaches, following the existing व्याख्या.

## What kind of book this is, and the standing caveats

The Shiva Swarodaya is a manual of svara: it reads the flow of breath through the left and right nostril and ties it to success, travel, health, astrology and omens. Many verses promise results. The notes keep the verse's own teaching but never present these results as fact. Standing sentences are used, word for word, wherever they apply:

- **Promised results of svara:** these statements are the tradition's faith and style, not proven fact; decisions about health, money and relationships should be made with judgement and qualified advice. Used at 1:10, 1:15, 1:19, 1:22–1:24, 1:54–1:56, 1:58, 1:61, 1:63, 1:64, 1:66, 1:78–1:81, 1:85, 1:89, 1:90, 1:92, 1:93, 1:95–2:112, 2:114, 2:116–2:118, 2:120, 2:122, 2:123, 2:126–2:131, 2:133, 2:145, 2:157–2:160.
- **Astrology (tithi, nakshatra, auspicious and inauspicious yogas):** this is astrology's traditional belief; decisions should be made with judgement, not fear. Used at 1:17, 1:29, 1:30, 1:62, 1:65, 1:68, 1:69, 1:72, 1:73, 1:77, 2:113.
- **"Moon" and "Sun":** here these are symbolic names for the flow in the left and right nostril, not the bodies in the sky. Used at 1:50, 1:52, 1:57, 1:60, 2:133.
- **Direction, weekday and omen rules for travel:** these are traditional belief, not proven fact; travel safety depends on the route, the season and care, and nobody needs to fear these rules. Used at 1:59, 1:74–1:76, 1:86–1:88, 1:91, 1:94, 2:132, 2:134.
- **Signs of illness and death:** these signs are traditional belief, not proven fact; nobody should be frightened by them, and any doubt about health should be taken to a doctor. Used at 1:82–1:84, 2:125, 2:155.
- **Lists of harmful acts:** such a list is the manner of texts of that age, not permission; harming, poisoning or controlling anyone is a crime. Used at 2:115, 2:119, 2:156.
- **"Bringing under control":** this is the language of that age; no person is a thing to be controlled, and free consent is necessary in every relationship. Used at 1:99, 2:121 (and in the note's own words at 1:23).
- **Merit of giving multiplied by crores:** this is the style of praise, not a promise of a fixed result. Used at 1:53.
- **Nadis:** these are the language of the subtle body in the yoga tradition and must not be equated with the nerves or blood vessels of modern anatomy. Used at 1:18, 1:31, 1:32, 1:34–1:41, 1:48, 1:49, 2:124.
- **The ten pranas:** this is the language of yoga and Ayurveda, not a statement of modern physiology. Used at 1:34, 1:42–1:47.
- **Order of creation and qualities of the elements:** this is philosophy's own language and classification, not a statement of modern physics. Used at 1:4, 1:6–1:8, 1:70, 1:71, 2:112, 2:137, 2:139–2:143, 2:146–2:151, 2:153, 2:154, 2:159, 2:160.
- **The cosmos in the body:** this is yoga's symbolic language, not physiology. Used at 1:9, 1:20, 2:152.
- **Science parallels:** where a note opens with a science fact, it adds "this likeness is only a metaphor" (48 notes so far).
- **Others carried over from earlier books:** siddhi as faith and style (1:2, 1:67, 2:138), secrecy as fitness and guidance (1:11), respect for the guru without giving up judgement (1:13), praise of one's own text as arthavāda (1:16, 1:21, 1:25, 1:27, 2:144), digestive fire as the language of yoga and Ayurveda (2:121).

Where a note opens with a modern study, it says what the study measured and no more, and for small or disputed studies it says so (1:22 "a small study"; 1:62 "the study is small and later results are mixed"; 1:23 and 1:30 open with studies that did not hold when repeated). The note at 1:56 adds that the study does not prove "knowledge of past and future".

## Please read these places first

- **Who must not be taught (1:14):** the verse lists the wicked, the angry, the untruthful, one who violates the honour of the guru's family, and others. The note says the list is for the seeker's own self-examination, not for judging others, and its first application repeats this.
- **"Killing the enemy" (1:22):** the note says this wording is the style of its age and reports the verse as "victory over the enemy". Its second application turns it to the enemy within (anger).
- **"Obtaining a maiden" and "controlling the king" (1:23):** the note says this is the language of its age, that no person is a thing to be controlled, and that free consent is necessary in every relationship. The third application repeats this.
- **Astrology set aside in favour of svara (1:17, 1:29, 1:30):** the verses say that one who knows svara need not ask about tithi, nakshatra or bad yogas. The notes report this as the text's own view and add the astrology caveat; they do not say astrology is false or true.
- **Unclear readings (1:19, 1:80):** the existing व्याख्या says the reading is unclear. Each note says so and reports the meaning with "possibly" (सम्भवतः).
- **"Cruel" sushumna (1:58):** the note says "cruel" here means unfavourable for worldly work, not violent.
- **Woman and man, fair and dark (1:60):** the verse calls the moon-flow female and fair and the sun-flow male and dark. The note says these are names for two flows and that no quality of any person, gender or complexion can be judged from them. Two of its applications say the same.
- **Blocking a nostril by night or day (1:66):** the note says sleeping with a nostril forcibly blocked is not right, tells the reader to use only a natural method such as lying on one side and to put nothing in the nose, and sends anyone whose sleep is broken by breathing trouble to a doctor.
- **"Controlling the three worlds" (1:67):** the note says this is hyperbole, that it must not be read as power over another person, and that commentators differ on the verse's meaning.
- **Giving while breathing in (1:53):** the note opens with the Gita's marks of sattvic giving and adds the caveat on crore-fold merit.
- **Travel prohibitions and the death warning (1:74–1:76):** the notes open with proven road-safety measures. The note at 1:76 says "death surely follows" is the hyperbole of a warning and that going in a direction does not cause death.
- **Nadis, the navel root and the ten winds (1:31–1:49):** every note in this range carries the nadi line, the prana line or the "only a metaphor" line listed above, so that no note reads as modern anatomy.
- **"Raudra" acts (1:61):** the note says the word here means hard and intense work, not violence.

- **Death foretold by days of reversed breath (1:82–1:84):** the verses say reversed svara brings loss on successive days and death on the eighth. Each note carries the illness-and-death caveat. 1:83 opens with Stephen Jay Gould's "the median is not the message" and says no count of days can foretell a death; its third application says never to repeat an ill omen in front of a sick person. 1:84 opens with white-coat hypertension (one reading is not a diagnosis).
- **First foot, number of steps, which hand (1:86–1:91):** the notes report the rules and add the travel-omen caveat (1:86–1:88, 1:91) or the results caveat (1:89, 1:90). An application at 1:86 says that missing the rule does not make a journey inauspicious, and 1:87 opens with the fact that the popular "10,000 steps" target did not come from research.
- **Enemies, thieves and debtors (1:93, 1:97):** 1:93 says the harsh wording is that of its age and that today disputes go through dialogue and law; one application says to speak with respect even to a debtor.
- **"As the omniscient has said" (1:96):** the note says this phrase marks reverence in the tradition and that reverence and testing can go together.
- **Poison, "controlling a young woman", and liberation (1:99).** The note says snake venom is treated only with antivenom in a hospital and that relying on svara or mantra endangers life; it carries the consent caveat; its first application says to take a bitten person to hospital at once. Please read it closely.
- **Unclear readings (1:100, 2:107, 2:130, 2:138, 2:155):** each note says so and reports the sense with "possibly".
- **Medicine and long illness (2:104, 2:107, 2:110, 2:111, 2:118):** each note says medicines come from a qualified doctor. 2:110 (fever and fainting) says svara cannot be relied on and gives first aid for fainting; its third application points to a mental-health specialist when low mood lasts for weeks. 2:111 says poison is treated only in hospital.
- **The list of acts for the sun-flow (2:114–2:120).** Please read these closely.
  - 2:114 (hard studies, intercourse and visiting prostitutes, boarding large boats): the note says the list is a picture of that society and not approval, that the sex trade often involves exploitation, and that treating a person as an object of enjoyment is wrong.
  - 2:115 (corrupt acts, drinking liquor, harassing enemies, destroying their land, giving poison): the note opens with the WHO figure for deaths from alcohol and carries the harmful-acts caveat. Its applications are about restraint and getting help to stop drinking.
  - 2:116 (hunting): the note opens with the Wildlife (Protection) Act, 1972 and says hunting here belongs to the list of that age and is not a direction for today.
  - 2:117 (gambling and theft): the note says these are part of that age's list and not permission, that theft is a crime and that gambling ruins families.
  - 2:118 (crossing a river in flood): the note says not to enter a swollen stream.
  - 2:119 (the six rites: killing, deluding, paralysing, causing enmity, driving away, subjugating): the note opens with Maharashtra's 2013 law against harmful "supernatural" practices and carries the harmful-acts caveat. Its second application says to stay away from anyone who offers, for money, to influence or harm a person.
  - 2:120 (fighting with sword in hand, "cruel acts"): the note says this is the language of its age and that today it means no more than hard work and self-defence.
- **Sleeping on the sun-flow side after food, and "controlling women" (2:121):** the note carries the consent caveat and the digestive-fire caveat.
- **"No need to think" before harsh acts (2:122):** the note says this is the text's style and that thought is always needed before a harsh act.
- **Sushumna as fire, poison and destroyer of works (2:123–2:127, 2:132):** the notes at 2:123 and 2:124 say this is said about worldly work, and that in the yoga tradition the same sushumna is the path of meditation; 2:126 and 2:127 turn the verse to putting off large tasks when the mind is unsteady. 2:125 (both nadis flowing out of order is "inauspicious") carries the illness-and-death caveat and tells the reader to see a doctor for breathlessness or broken breathing. 2:132 (travel then brings loss, trouble and death) says this is the hyperbole of a warning.
- **Curse and boon (2:130):** the note says the bearing of fruit by a curse or a boon is the tradition's faith.
- **Reading the questioner's position (2:133–2:134):** an application at 2:133 says to answer questions from facts, not from signs. 2:134 opens with Clever Hans and asks the reader to notice when an answer is shaped by what the questioner wants to hear.
- **Shanmukhi mudra and inner lights (2:146–2:147):** 2:146 says not to press on the eyes and not to hold the breath by force, and to ask a doctor first in eye, ear or heart disease. 2:147 says such sights are not a special power and sends anyone who sees spots or flashes with open eyes to an eye doctor.
- **Breath that points to death, and killing and driving-away rites by element (2:155–2:156):** 2:155 carries the illness-and-death caveat and says nobody's death should be guessed from the direction of breath. 2:156 carries the harmful-acts caveat.

## Facts to spot-check

Each line gives the verse and the fact that opens its note.

- 1:1: Patanjali's Mahabhashya on texts with an auspicious beginning, middle and end.
- 1:2: agama (Shiva speaks, the Goddess listens) and nigama (the reverse) in the tantra tradition.
- 1:3: Paul Gauguin's 1897 painting in Tahiti with its three questions.
- 1:4: Anaximenes (sixth century BCE) held air to be the source of all things.
- 1:5: the word tattva is formed from tat and tva ("that-ness").
- 1:6: Charles Fabry and Henri Buisson, 1913, the ozone layer 15 to 35 km up; pressed to sea-level pressure it would be about 3 mm thick.
- 1:7: Empedocles' four roots; Aristotle added a fifth.
- 1:8: the carbon cycle (one atom passing through air, leaf, animal and back).
- 1:9: Charaka Samhita, Sharira-sthana: the person is like the world.
- 1:10: Rama Prasad of Meerut, "Nature's Finer Forces", London, 1890.
- 1:11: Sita gives Hanuman her chudamani (Valmiki Ramayana, Sundarakanda).
- 1:12: the traditional meaning of astika (accepts the authority of the Veda) and nastika.
- 1:13: the subhashita on five marks of a student (kaka-cheshta and the rest).
- 1:14: the Asilomar conference, February 1975, about 140 scientists.
- 1:15: Rainer Schandry, 1981, the heartbeat-counting task.
- 1:16: Sharngadeva's Sangita Ratnakara (thirteenth century, Devagiri) on the word nada.
- 1:17: Shawn Carlson's test of astrology, Nature, 1985.
- 1:18: pulse examination first described at length in the Sharngadhara Samhita (thirteenth to fourteenth century).
- 1:19: Franz Halberg coined "circadian" in 1959.
- 1:20: the newborn's first breath and the change in the circulation.
- 1:21: the subhashita that calls learning the chief wealth.
- 1:22: Marlies De Couck and colleagues, 2019, slow breathing and decision-making, 56 participants.
- 1:23: the 2010 "power pose" study and Eva Ranehill's 2015 replication with 200 participants that found no effect.
- 1:24: Ivan Pavlov's 1904 Nobel Prize was for the physiology of digestion.
- 1:25: Yajnavalkya Smriti's fourteen seats of learning.
- 1:26: the stars of Orion (Mriga) lie at very different distances.
- 1:27: Philipp Bozzini's "Lichtleiter", 1806.
- 1:28: Mahaparinibbana Sutta: "be an island to yourselves".
- 1:29: the five limbs of the panchanga; vishti (bhadra), vyatipata and vaidhriti.
- 1:30: Lysann Damisch and colleagues, 2010, the "lucky ball" study, and the 2014 replication that did not find the effect.
- 1:31: Sushruta Samhita's method of studying the body from within.
- 1:32: the umbilical cord, its two arteries and one vein.
- 1:33: about two metres of DNA coiled in each cell nucleus.
- 1:34: René Laennec's stethoscope, Paris, 1816.
- 1:35: ATP, the body's energy molecule; an adult makes and spends roughly their own body weight of it each day.
- 1:36: Debra Werntz and colleagues, 1983, the nasal cycle and the two hemispheres.
- 1:37: anatomical names taken from shapes: hippocampus (seahorse), atlas, coccyx (cuckoo's beak).
- 1:38: the tear duct from the inner corner of the eye to the nose.
- 1:39: Bartolomeo Eustachi described the tube from the middle ear to the throat, 1563.
- 1:40: Katha Upanishad 2.2.1, the city of eleven gates.
- 1:41: the nasal lining makes about a litre of mucus a day; cilia move it.
- 1:42: Atharvaveda 11.4, the hymn to Prana.
- 1:43: Gita 1.15: Arjuna's conch is Devadatta, and Arjuna is called Dhananjaya.
- 1:44: an adult heart at rest pumps about five litres a minute.
- 1:45: Marshall Hall, 1833, the concept of reflex action.
- 1:46: Lydia Bourouiba and colleagues, 2014, the cloud of a sneeze.
- 1:47: the Harvard committee's definition of brain death, 1968.
- 1:48: the Glatzel mirror test of nasal airflow.
- 1:49: situs inversus, about one person in ten thousand.
- 1:50: Yoga-bija explains "hatha" as ha (sun) and tha (moon).
- 1:51: Isha Upanishad 16, "so'ham asmi".
- 1:52: the Sun is about 400 times wider than the Moon and about 400 times farther.
- 1:53: Gita 17.20, the marks of sattvic giving.
- 1:54: Daniel Levinson and colleagues, 2014, breath counting as a measure of mindfulness.
- 1:55: Pierre Philippot and colleagues, 2002, breathing patterns and emotions.
- 1:56: Shirley Telles and colleagues, Bengaluru, 1994, 48 men, nostril breathing and oxygen consumption (37 per cent rise with right-nostril breathing).
- 1:57: anabolism and catabolism.
- 1:58: Nyepi, Bali's day of silence; the airport closes.
- 1:59: Janus, the two-faced Roman god of doors and beginnings.
- 1:60: grammatical gender of sun and moon in Sanskrit, German and French.
- 1:61: core body temperature is lowest in the early morning and highest in the early evening.
- 1:62: Christian Cajochen and colleagues, 2013, 33 people, sleep around the full moon (about 5 minutes longer to fall asleep, about 20 minutes less sleep); later results are mixed.
- 1:63: the ghati water-bowl clock; one ghati is 24 minutes.
- 1:64: ethanol and dimethyl ether, the same atoms in a different order.
- 1:65: Santorio of Padua and his weighing chair, about thirty years of measurements, published 1614.
- 1:66: James Haight and Philip Cole, 1980s, pressure on one side of the body and the nostrils.
- 1:67: Odysseus has himself bound to the mast to hear the Sirens.
- 1:68: the order of the weekdays comes from the planetary hours (hora).
- 1:69: Narayan Meghaji Lokhande and the Sunday holiday for Mumbai mill workers, 10 June 1890.
- 1:70: the order of events in one heartbeat (atria, then ventricles).
- 1:71: inhaled air has about 21 per cent oxygen, exhaled air about 16 per cent.
- 1:72: each sign of the zodiac takes about two hours to rise; the rising sign is the lagna.
- 1:73: Hipparchus and the precession of the equinoxes; the ayanamsha is now about 24 degrees.
- 1:74: Nils Bohlin's three-point seat belt, Volvo, 1959; the patent was left open.
- 1:75: sartha caravans and the sarthavaha in ancient India.
- 1:76: World Health Organization report, 2023: about 1.2 million road deaths a year; the leading cause of death at ages 5 to 29.
- 1:77: the first crescent is usually seen one to two days after the new moon, just after sunset, and not before it is about 15 hours old.
- 1:78: Carl Linnaeus's flower clock, 1751.
- 1:79: jet lag; the body clock shifts by about one time zone a day.
- 1:80: chronotypes; adolescents lean towards late hours.
- 1:81: Till Roenneberg and colleagues, 2006, "social jet lag".
- 1:82: the Saffir–Simpson scale of five storm categories, 1971.
- 1:83: Stephen Jay Gould, diagnosed 1982 with a cancer whose median survival was eight months, lived twenty more years ("The Median Isn't the Message").
- 1:84: Thomas Pickering, 1988, white-coat hypertension in about one in five patients.
- 1:85: Jean-Jacques de Mairan, 1729, the mimosa that kept its daily leaf movement in the dark.
- 1:86: Petronius, Satyricon: a servant at the dining-room door calls on guests to enter right foot first.
- 1:87: "10,000 steps" comes from a 1965 Japanese pedometer, the manpo-kei; I-Min Lee and colleagues, 2019, about 17,000 older women, lower mortality at about 4,400 steps a day.
- 1:88: "mile" comes from Latin mille passus, a thousand double paces; Roman milestones.
- 1:89: the morning custom of kara-darshana (Lakshmi at the fingertips, Sarasvati in the middle, Govinda at the base of the hand).
- 1:90: Richard Oldfield's Edinburgh Handedness Inventory, 1971; about nine in ten people are right-handed.
- 1:91: Bronisław Malinowski: Trobriand fishermen used ritual for the open sea, not for the lagoon.
- 1:92: Luca Tommasi and Daniele Marzoli, 2009: requests made to the right ear (176 people) were granted about twice as often.
- 1:93: the four means of statecraft (sama, dana, bheda, danda); Manusmriti chapter 7 on force as the last resort.
- 1:94: a young bar-tailed godwit flew about 13,500 km from Alaska to Tasmania in eleven days without landing, 2022.
- 1:95: Kerry Courneya and Albert Carron, 1992, review of home advantage in team sports (about 60 per cent in several sports).
- 1:96: Bertrand Russell's remark that Aristotle said women have fewer teeth and never counted.
- 1:97: the "Spanish Prisoner" swindle; the New York Times called it an old and familiar fraud in 1898.
- 1:98: the Tokyo Metropolitan Police lost-and-found centre handles about four million items a year.
- 1:99: Albert Calmette made the first snake antivenom in 1894, after starting his study of cobra venom in Saigon.
- 1:100: Sweden changed from driving on the left to the right at 5 a.m. on 3 September 1967.
- 2:101: the "go-around" in aviation, taught as a correct decision and not an error.
- 2:102: the Taj Mahal: begun 1632, main building about eleven years, whole complex about twenty-two; foundations on deep wells by the Yamuna.
- 2:103: Chand Baori at Abhaneri, Rajasthan: eighth to ninth century, thirteen storeys, about 3,500 steps.
- 2:104: the hundi, the old Indian merchants' bill of exchange.
- 2:105: the Egyptian–Hittite peace treaty of about 1259 BCE (Ramesses II and Hattusili III); a replica hangs at the United Nations in New York.
- 2:106: the Vidyarambham rite on Vijayadashami in Kerala and Karnataka (first letter written in rice).
- 2:107: the word godhuli for dusk (dust raised by cows coming home); held auspicious for weddings.
- 2:108: the Hastyayurveda attributed to Palakapya, taught to King Romapada of Anga.
- 2:109: the Natya Shastra's four classes of instruments (tata, sushira, avanaddha, ghana); Hornbostel and Sachs, 1914.
- 2:110: the commonest cause of fainting and its first aid (lie the person down, raise the legs).
- 2:111: the India Meteorological Department, founded 1875; normal monsoon onset over Kerala on 1 June, the whole country in about five to six weeks.
- 2:112: Gheranda Samhita, chapter 5: begin yoga in spring or autumn, not in the other four seasons.
- 2:113: "Blue Monday" (2005) came from a travel company's publicity and has no scientific basis.
- 2:114: the Periplus on Hippalus and the monsoon route across the open sea to India's west coast.
- 2:115: World Health Organization report, 2024: about 2.6 million deaths from alcohol in 2019, about one in twenty of all deaths; no amount shown to be safe.
- 2:116: the Wildlife (Protection) Act, 1972; tiger count about 1,400 in 2006 and over 3,000 in 2022.
- 2:117: the superintendent of gambling in Kautilya's Arthashastra (licensed places, true dice, five per cent of winnings to the state).
- 2:118: Sequoyah's Cherokee syllabary, 1821, about 85 signs, after about twelve years' work; a newspaper in it from 1828.
- 2:119: Maharashtra's 2013 Act against harmful "supernatural" practices, after Narendra Dabholkar's eighteen-year campaign and his murder that year; Karnataka's Act of 2017.
- 2:120: the king's day in eight parts in the Arthashastra (first: defence and accounts; second: people's affairs; third: bath, meal, study; seventh: elephants, horses, chariots, troops).
- 2:121: Androniki Naska and colleagues, 2007, about 24,000 Greek adults followed for six years: regular midday nap, about 37 per cent lower coronary mortality (an association only).
- 2:122: the athletics rule that a start within one tenth of a second of the signal is a false start.
- 2:123: slack water between flood and ebb tide.
- 2:124: lodgepole pine cones sealed with resin that open only in the heat of a forest fire.
- 2:125: Cheyne–Stokes breathing, described by John Cheyne (1818) and William Stokes (1854).
- 2:126: the doldrums, the belt of light and shifting winds near the equator.
- 2:127: the equinox (vishuva), about 20–21 March and 22–23 September.
- 2:128: Reinhold Niebuhr's serenity prayer, 1930s, later used by recovery groups.
- 2:129: Ishvara-pranidhana in three places in the Yoga Sutra (book 1 as a means to samadhi; the start of book 2 in kriya-yoga; the list of niyamas).
- 2:130: J. L. Austin's 1955 Harvard lectures on sentences that are themselves acts.
- 2:131: Amy Starmer and colleagues, 2014, nine hospitals: a structured handover cut medical errors by about 23 per cent.
- 2:132: Ann Williamson and Anne-Marie Feyer, 2000: 17 to 19 hours awake impairs performance as much as the legal alcohol limit of many countries.
- 2:133: the Guugu Yimithirr language of north-east Australia uses compass directions, not left and right.
- 2:134: Clever Hans (Berlin, 1904) and Oskar Pfungst's 1907 finding that the horse read the questioner's cues.
- 2:135: civil, nautical and astronomical twilight (Sun 6, 12 and 18 degrees below the horizon).
- 2:136: the Vijnana Bhairava opens with the Goddess's question and gives 112 methods of meditation.
- 2:137: about three quarters of all aluminium ever made is still in use; recycling takes about one twentieth of the energy.
- 2:138: Wolfgang Wiltschko, 1972: European robins take direction from the Earth's magnetic field.
- 2:139: the Chinese five phases (wood, fire, earth, metal, water).
- 2:140: the shared genetic code (64 codons, 20 amino acids); human insulin made in bacteria.
- 2:141: the eight branches of Ayurveda.
- 2:142: Leopold Auenbrugger, Vienna, 1761, percussion of the chest, learned from tapping casks at his father's inn.
- 2:143: Albert Munsell's colour system, 1905 (hue, value, chroma); used for soil colour.
- 2:144: Matthias Mehl and colleagues, 2007, about 400 students: women and men both speak about 16,000 words a day.
- 2:145: Gilbert White of Selborne kept a daily nature journal for about twenty-five years; his book appeared in 1789; he told three look-alike small birds apart as separate species.
- 2:146: Wolfgang Metzger, 1930, the Ganzfeld (uniform field) and the patches and shapes people begin to see.
- 2:147: Heinrich Klüver's four "form constants", from 1926.
- 2:148: Hermann Rorschach's ten inkblots, 1921.
- 2:149: the Japanese gorinto, a five-part stone tower (cube, sphere, pyramid, crescent, jewel) for the five elements.
- 2:150: a candle flame in a spacecraft is small, round and blue (space experiments of the 1990s).
- 2:151: Brent Berlin and Paul Kay, 1969, 98 languages: the order in which languages add basic colour words.
- 2:152: the 107 marmas of the Sushruta Samhita.
- 2:153: the "tongue map" came from a mistranslated German paper of 1901; every part of the tongue senses all basic tastes.
- 2:154: Bernard Wright's peak flow meter, 1959.
- 2:155: John Fieselmann and colleagues, 1993: a breathing rate above 27 a minute was the strongest warning of cardiac arrest within three days.
- 2:156: the four temperaments of the Hippocratic and Galenic tradition, tied to air, fire, earth and water; no longer accepted in medicine.
- 2:157: the medieval three-field system, with one field left fallow each year.
- 2:158: Agave americana, the "century plant", flowers once after ten to thirty years and then dies.
- 2:159: John Hutchinson's spirometer, London, 1846, measured in more than 2,000 people.
- 2:160: breath from an open mouth feels warm and from pursed lips cool, though it leaves the lungs at the same temperature.
