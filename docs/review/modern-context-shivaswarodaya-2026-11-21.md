# Modern-context notes: Shiva Swarodaya (review note, 21 November 2026)

This note goes with the pull request that adds modern-context notes to the Shiva Swarodaya. It lists how the notes were checked, the verses a reviewer should read first, and the facts to spot-check. The notes are AI drafts and have not had a human editorial review.

## Status

- **Coverage:** verses 1:1 to 1:80 (80 of the book's 384 verses) now have a modern-context note. None had one before. The rest follow in later commits on the same pull request, and this note grows with them.
- **Source file:** `data/hi-commentary/shivaswarodaya-rest.json` is new and holds only the `lifeLesson` field. The existing व्याख्या (`explanation`) is unchanged for all 384 entries; this is verified after each publish.
- **Shape:** each note has आधुनिक संदर्भ (one real-world fact linked to the verse), आज के जीवन में प्रयोग (three applications) and चिंतन प्रश्न (one question).
- **Size cap:** the published commentary total passes 60 MB with this book, so `MAX_TOTAL_MB` in `scripts/convert-commentary-to-json.ts` is raised from 60 to 61 in the same pull request. Each file stays far below Cloudflare's 25 MiB per-file limit.

## How the notes were checked

- **Register:** every note passed `scripts/check-hindi-register.mjs` with no sentences to fix. The words are tatsam with no Urdu, Persian or English beyond unavoidable proper names and scientific terms (for example डीएनए, एटीपी, हाइड्रोजन). There is no first person.
- **Facts used once:** candidate facts were screened by keyword against every earlier note in all books before writing. After writing, each batch was run through the stricter check (rare words or years shared by any two notes, across all books including this one). One fact in 1:6 was found to repeat an earlier book and was replaced before publishing.
- **Anchoring:** each note says in one sentence what the verse itself teaches, following the existing व्याख्या.

## What kind of book this is, and the standing caveats

The Shiva Swarodaya is a manual of svara: it reads the flow of breath through the left and right nostril and ties it to success, travel, health, astrology and omens. Many verses promise results. The notes keep the verse's own teaching but never present these results as fact. Standing sentences are used, word for word, wherever they apply:

- **Promised results of svara:** these statements are the tradition's faith and style, not proven fact; decisions about health, money and relationships should be made with judgement and qualified advice. Used at 1:10, 1:15, 1:19, 1:22–1:24, 1:54–1:56, 1:58, 1:61, 1:63, 1:64, 1:66, 1:78–1:80.
- **Astrology (tithi, nakshatra, auspicious and inauspicious yogas):** this is astrology's traditional belief; decisions should be made with judgement, not fear. Used at 1:17, 1:29, 1:30, 1:62, 1:65, 1:68, 1:69, 1:72, 1:73, 1:77.
- **"Moon" and "Sun":** here these are symbolic names for the flow in the left and right nostril, not the bodies in the sky. Used at 1:50, 1:52, 1:57, 1:60.
- **Direction, weekday and omen rules for travel:** these are traditional belief, not proven fact; travel safety depends on the route, the season and care, and nobody needs to fear these rules. Used at 1:59, 1:74–1:76.
- **Merit of giving multiplied by crores:** this is the style of praise, not a promise of a fixed result. Used at 1:53.
- **Nadis:** these are the language of the subtle body in the yoga tradition and must not be equated with the nerves or blood vessels of modern anatomy. Used at 1:18, 1:31, 1:32, 1:34–1:41, 1:48, 1:49.
- **The ten pranas:** this is the language of yoga and Ayurveda, not a statement of modern physiology. Used at 1:34, 1:42–1:47.
- **Order of creation and qualities of the elements:** this is philosophy's own language and classification, not a statement of modern physics. Used at 1:4, 1:6–1:8, 1:70, 1:71.
- **The cosmos in the body:** this is yoga's symbolic language, not physiology. Used at 1:9, 1:20.
- **Science parallels:** where a note opens with a science fact, it adds "this likeness is only a metaphor" (27 notes so far).
- **Others carried over from earlier books:** siddhi as faith and style (1:2, 1:67), secrecy as fitness and guidance (1:11), respect for the guru without giving up judgement (1:13), praise of one's own text as arthavāda (1:16, 1:21, 1:25, 1:27).

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
