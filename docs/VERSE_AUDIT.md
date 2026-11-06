# Verse Audit — `public/data/scriptures-full/*.json`

_Per-verse field completeness across the published scripture JSON corpus._

## Executive summary

| Metric | Value |
|---|---|---|
| Scriptures | 67 |
| Declared verses | 233,342 |
| Loaded verses | 233,342 |
| Not-yet-loaded verses | 0 |
| Empty commentary / explanation | 54,689 |
| Empty word meaning | 217,011 |
| Empty Hindi | 50,097 |
| Critical gaps (core text) | 56700 |
| Duplicate verse refs | 0 (0 scriptures) |

## Notes

- **Missing** = `totalVerses` minus actually loaded verses. These scriptures are represented by curated highlights rather than full texts.
- **Critical gaps** are verses missing `sanskrit` or English `translation` (the fields required for rendering a verse at all).
- **Supporting-language gaps** are missing transliteration or Hindi; these do not make the core verse unreadable.
- **Commentary gaps** count both `commentary` and `explanation` fields as empty.
- **Word meaning gaps** count empty `wordMeaning` fields.

## All scriptures

| Scripture | Title | Declared | Loaded | Missing | ∅ Sanskrit | ∅ Transliteration | ∅ Translation | Unusable Translation | ∅ Hindi | ∅ Commentary | ∅ Word Meaning |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| agnipuran | Agni Purana | 11043 | 11043 | 0 | 0 | 0 | 0 | 85 | 0 | 0 | 10773 |
| aitareya | Aitareya Upanishad | 27 | 27 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| amritabindu | Amritabindu Upanishad | 22 | 22 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| atharvaveda | Atharva Veda | 5614 | 5614 | 0 | 0 | 0 | 0 | 61 | 0 | 0 | 5595 |
| bhagavadgita | Bhagavad Gita | 701 | 701 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| bhagavatapurana | Bhagavata Purana | 14408 | 14408 | 0 | 0 | 0 | 14401 | 14401 | 14401 | 14401 | 14401 |
| brahmandpuran | Brahmanda Purana | 13498 | 13498 | 0 | 0 | 1 | 2 | 168 | 2 | 2 | 13124 |
| brahmapuran | Brahma Purana | 13444 | 13444 | 0 | 0 | 0 | 2 | 24 | 2 | 2 | 13177 |
| brahmasutra | Brahma Sutra | 564 | 564 | 0 | 0 | 0 | 0 | 0 | 0 | 557 | 557 |
| brahmavaivartapuran | Brahmavaivarta Purana | 10 | 10 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| brihadaranyaka | Brihadaranyaka Upanishad | 386 | 386 | 0 | 0 | 0 | 1 | 6 | 1 | 1 | 151 |
| chandogya | Chandogya Upanishad | 595 | 595 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 385 |
| devibhagavat | Devi Bhagavata Purana | 18385 | 18385 | 0 | 0 | 0 | 18376 | 18376 | 18376 | 18376 | 18376 |
| durgasaptashati | Durga Saptashati | 634 | 634 | 0 | 0 | 0 | 0 | 0 | 0 | 36 | 615 |
| garudpurana | Garuda Purana | 11877 | 11877 | 0 | 0 | 0 | 0 | 630 | 0 | 0 | 11402 |
| harivanshpuran | Harivamsha Purana | 16005 | 16005 | 0 | 0 | 0 | 14005 | 14702 | 14005 | 14005 | 15614 |
| ishavasya | Isha Upanishad | 18 | 18 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| jabala | Jabala Upanishad | 6 | 6 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 6 |
| kaivalya | Kaivalya Upanishad | 24 | 24 | 0 | 0 | 0 | 0 | 0 | 0 | 18 | 18 |
| kalkipuran | Kalki Purana | 10 | 10 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| katha | Katha Upanishad | 119 | 119 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| kaushitaki | Kaushitaki Upanishad | 50 | 50 | 0 | 0 | 0 | 49 | 49 | 49 | 49 | 49 |
| kena | Kena Upanishad | 35 | 35 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| kurmapuran | Kurma Purana | 5573 | 5573 | 0 | 0 | 0 | 1 | 22 | 1 | 1 | 5442 |
| lingapuran | Linga Purana | 6726 | 6726 | 0 | 0 | 0 | 0 | 74 | 0 | 0 | 5764 |
| mahabharata | Mahabharata | 32511 | 32511 | 0 | 0 | 0 | 0 | 1324 | 0 | 0 | 30286 |
| mahanarayana | Mahanarayana Upanishad | 263 | 263 | 0 | 0 | 0 | 0 | 0 | 0 | 261 | 261 |
| mahaupanishad | Maha Upanishad | 553 | 553 | 0 | 0 | 0 | 0 | 0 | 0 | 553 | 553 |
| maitri | Maitri Upanishad | 99 | 99 | 0 | 0 | 0 | 0 | 0 | 0 | 98 | 98 |
| mandukya | Mandukya Upanishad | 12 | 12 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| manusmriti | Manusmriti | 1783 | 1783 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1747 |
| markandeypuran | Markandeya Purana | 4339 | 4339 | 0 | 0 | 1 | 6 | 81 | 6 | 6 | 4257 |
| matsyapuran | Matsya Purana | 8330 | 8330 | 0 | 0 | 0 | 0 | 1569 | 0 | 0 | 5945 |
| muktika | Muktika Upanishad | 137 | 137 | 0 | 0 | 0 | 0 | 0 | 0 | 137 | 137 |
| mundaka | Mundaka Upanishad | 64 | 64 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| naradabhaktisutra | Narada Bhakti Sutras | 84 | 84 | 0 | 0 | 0 | 77 | 77 | 77 | 77 | 77 |
| naradapuran | Narada Purana | 15203 | 15203 | 0 | 0 | 0 | 5 | 140 | 5 | 5 | 14480 |
| narasimhapuran | Narasimha Purana | 3361 | 3361 | 0 | 0 | 0 | 0 | 190 | 0 | 0 | 2590 |
| niralamba | Niralamba Upanishad | 21 | 21 | 0 | 0 | 0 | 0 | 0 | 0 | 21 | 21 |
| nityakarmakriya | Nitya Karma Kriya | 16 | 16 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| padmapuran | Padma Purana | 18 | 18 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| prashna | Prashna Upanishad | 67 | 67 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| ramayana | Valmiki Ramayana | 82 | 82 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| ramcharitmanas | Shri Ramcharitmanas | 35 | 35 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| ravanasamhita | Ravana Samhita | 43 | 43 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| rigveda | Rig Veda | 67 | 67 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| samaveda | Sama Veda | 1873 | 1873 | 0 | 0 | 0 | 0 | 0 | 0 | 1870 | 1870 |
| shandilyabhaktisutra | Shandilya Bhakti Sutras | 100 | 100 | 0 | 0 | 0 | 98 | 98 | 98 | 98 | 98 |
| shivasamhita | Shiva Samhita | 644 | 644 | 0 | 0 | 0 | 644 | 644 | 644 | 644 | 644 |
| shivaswarodaya | Shiva Swarodaya | 395 | 395 | 0 | 0 | 0 | 395 | 395 | 395 | 395 | 395 |
| shivpurana | Shiva Purana | 12977 | 12977 | 0 | 0 | 0 | 0 | 59 | 0 | 0 | 12383 |
| shvetashvatara | Shvetashvatara Upanishad | 113 | 113 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 106 |
| skandapuran | Skanda Purana | 6464 | 6464 | 0 | 0 | 0 | 0 | 125 | 0 | 0 | 6275 |
| taittiriya | Taittiriya Upanishad | 31 | 31 | 0 | 0 | 0 | 12 | 12 | 12 | 12 | 12 |
| tejobindu | Tejobindu Upanishad | 464 | 464 | 0 | 0 | 0 | 1 | 1 | 1 | 464 | 464 |
| vamanpuran | Vamana Purana | 5594 | 5594 | 0 | 0 | 0 | 36 | 194 | 36 | 36 | 3873 |
| varahapuran | Varaha Purana | 10 | 10 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| vayupuran | Vayu Purana | 7641 | 7641 | 0 | 0 | 0 | 0 | 269 | 0 | 0 | 5906 |
| viduraniti | Vidura Niti | 284 | 284 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 230 |
| vinayapatrika | Vinaya Patrika | 1483 | 1483 | 0 | 0 | 0 | 1482 | 1482 | 1482 | 1482 | 1482 |
| vishnupurana | Vishnu Purana | 5488 | 5488 | 0 | 0 | 0 | 0 | 925 | 0 | 0 | 4685 |
| vivekchudamani | Vivekachudamani | 580 | 580 | 0 | 0 | 0 | 0 | 0 | 0 | 578 | 578 |
| yajurveda | Yajur Veda | 1810 | 1810 | 0 | 0 | 0 | 1 | 14 | 1 | 1 | 1606 |
| yogarasayanam | Yoga Rasayanam | 308 | 308 | 0 | 0 | 0 | 308 | 308 | 308 | 308 | 308 |
| yogasutra | Patanjali Yoga Sutras | 195 | 195 | 0 | 0 | 0 | 195 | 195 | 195 | 195 | 195 |
| yogavasishtha | Yoga Vasishtha | 13 | 13 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| yogavasistha | Yoga Vasishtha | 13 | 13 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

## Scriptures with commentary / word-meaning gaps

These are the scriptures that have verse records but are missing explanatory content. The biggest blockers are the large Puranas and Vedic texts.

| Scripture | Title | Loaded | ∅ Commentary | ∅ Word Meaning |
| --- | --- | --- | --- | --- |
| devibhagavat | Devi Bhagavata Purana | 18385 | 18376 | 18376 |
| bhagavatapurana | Bhagavata Purana | 14408 | 14401 | 14401 |
| harivanshpuran | Harivamsha Purana | 16005 | 14005 | 15614 |
| samaveda | Sama Veda | 1873 | 1870 | 1870 |
| vinayapatrika | Vinaya Patrika | 1483 | 1482 | 1482 |
| shivasamhita | Shiva Samhita | 644 | 644 | 644 |
| vivekchudamani | Vivekachudamani | 580 | 578 | 578 |
| brahmasutra | Brahma Sutra | 564 | 557 | 557 |
| mahaupanishad | Maha Upanishad | 553 | 553 | 553 |
| tejobindu | Tejobindu Upanishad | 464 | 464 | 464 |
| shivaswarodaya | Shiva Swarodaya | 395 | 395 | 395 |
| yogarasayanam | Yoga Rasayanam | 308 | 308 | 308 |
| mahanarayana | Mahanarayana Upanishad | 263 | 261 | 261 |
| yogasutra | Patanjali Yoga Sutras | 195 | 195 | 195 |
| muktika | Muktika Upanishad | 137 | 137 | 137 |
| maitri | Maitri Upanishad | 99 | 98 | 98 |
| shandilyabhaktisutra | Shandilya Bhakti Sutras | 100 | 98 | 98 |
| naradabhaktisutra | Narada Bhakti Sutras | 84 | 77 | 77 |
| kaushitaki | Kaushitaki Upanishad | 50 | 49 | 49 |
| durgasaptashati | Durga Saptashati | 634 | 36 | 615 |
| vamanpuran | Vamana Purana | 5594 | 36 | 3873 |
| niralamba | Niralamba Upanishad | 21 | 21 | 21 |
| kaivalya | Kaivalya Upanishad | 24 | 18 | 18 |
| taittiriya | Taittiriya Upanishad | 31 | 12 | 12 |
| markandeypuran | Markandeya Purana | 4339 | 6 | 4257 |
| naradapuran | Narada Purana | 15203 | 5 | 14480 |
| brahmandpuran | Brahmanda Purana | 13498 | 2 | 13124 |
| brahmapuran | Brahma Purana | 13444 | 2 | 13177 |
| brihadaranyaka | Brihadaranyaka Upanishad | 386 | 1 | 151 |
| kurmapuran | Kurma Purana | 5573 | 1 | 5442 |
| yajurveda | Yajur Veda | 1810 | 1 | 1606 |
| agnipuran | Agni Purana | 11043 | 0 | 10773 |
| atharvaveda | Atharva Veda | 5614 | 0 | 5595 |
| chandogya | Chandogya Upanishad | 595 | 0 | 385 |
| garudpurana | Garuda Purana | 11877 | 0 | 11402 |
| jabala | Jabala Upanishad | 6 | 0 | 6 |
| lingapuran | Linga Purana | 6726 | 0 | 5764 |
| mahabharata | Mahabharata | 32511 | 0 | 30286 |
| manusmriti | Manusmriti | 1783 | 0 | 1747 |
| matsyapuran | Matsya Purana | 8330 | 0 | 5945 |
| narasimhapuran | Narasimha Purana | 3361 | 0 | 2590 |
| shivpurana | Shiva Purana | 12977 | 0 | 12383 |
| shvetashvatara | Shvetashvatara Upanishad | 113 | 0 | 106 |
| skandapuran | Skanda Purana | 6464 | 0 | 6275 |
| vayupuran | Vayu Purana | 7641 | 0 | 5906 |
| viduraniti | Vidura Niti | 284 | 0 | 230 |
| vishnupurana | Vishnu Purana | 5488 | 0 | 4685 |

### Sample verse references with missing commentary

- **devibhagavat** (Devi Bhagavata Purana): devibhagavat:1:1, devibhagavat:1:2, devibhagavat:1:3
- **bhagavatapurana** (Bhagavata Purana): bhagavatapurana:1:1, bhagavatapurana:1:3, bhagavatapurana:1:4
- **harivanshpuran** (Harivamsha Purana): harivanshpuran:1:2, harivanshpuran:1:3, harivanshpuran:1:4
- **samaveda** (Sama Veda): samaveda:1:2, samaveda:1:3, samaveda:1:4
- **vinayapatrika** (Vinaya Patrika): vinayapatrika:1:1, vinayapatrika:1:2, vinayapatrika:1:3
- **shivasamhita** (Shiva Samhita): shivasamhita:1:1, shivasamhita:1:2, shivasamhita:1:3
- **vivekchudamani** (Vivekachudamani): vivekchudamani:1:1, vivekchudamani:1:4, vivekchudamani:1:5
- **brahmasutra** (Brahma Sutra): brahmasutra:1:1.1.6, brahmasutra:1:1.1.7, brahmasutra:1:1.1.8
- **mahaupanishad** (Maha Upanishad): mahaupanishad:1:1, mahaupanishad:1:2, mahaupanishad:1:3
- **tejobindu** (Tejobindu Upanishad): tejobindu:1:1, tejobindu:1:2, tejobindu:1:3
- **shivaswarodaya** (Shiva Swarodaya): shivaswarodaya:1:1, shivaswarodaya:1:2, shivaswarodaya:1:3
- **yogarasayanam** (Yoga Rasayanam): yogarasayanam:1:1, yogarasayanam:1:2, yogarasayanam:1:3
- **mahanarayana** (Mahanarayana Upanishad): mahanarayana:1:1, mahanarayana:1:2, mahanarayana:1:3
- **yogasutra** (Patanjali Yoga Sutras): yogasutra:1:1, yogasutra:1:2, yogasutra:1:3
- **muktika** (Muktika Upanishad): muktika:1:1, muktika:1:2, muktika:1:3
- **maitri** (Maitri Upanishad): maitri:1:1, maitri:1:2, maitri:1:3
- **shandilyabhaktisutra** (Shandilya Bhakti Sutras): shandilyabhaktisutra:1:3, shandilyabhaktisutra:1:4, shandilyabhaktisutra:1:5
- **naradabhaktisutra** (Narada Bhakti Sutras): naradabhaktisutra:1:4, naradabhaktisutra:1:5, naradabhaktisutra:1:6
- **kaushitaki** (Kaushitaki Upanishad): kaushitaki:1:1, kaushitaki:1:2, kaushitaki:1:4
- **durgasaptashati** (Durga Saptashati): durgasaptashati:1:1.46, durgasaptashati:1:1.63, durgasaptashati:1:1.88

## Scriptures with critical text gaps

| Scripture | Title | Declared | Loaded | Missing | ∅ Sanskrit | ∅ Transliteration | ∅ Translation | Unusable Translation | ∅ Hindi | ∅ Commentary | ∅ Word Meaning |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| agnipuran | Agni Purana | 11043 | 11043 | 0 | 0 | 0 | 0 | 85 | 0 | 0 | 10773 |
| atharvaveda | Atharva Veda | 5614 | 5614 | 0 | 0 | 0 | 0 | 61 | 0 | 0 | 5595 |
| bhagavatapurana | Bhagavata Purana | 14408 | 14408 | 0 | 0 | 0 | 14401 | 14401 | 14401 | 14401 | 14401 |
| brahmandpuran | Brahmanda Purana | 13498 | 13498 | 0 | 0 | 1 | 2 | 168 | 2 | 2 | 13124 |
| brahmapuran | Brahma Purana | 13444 | 13444 | 0 | 0 | 0 | 2 | 24 | 2 | 2 | 13177 |
| brihadaranyaka | Brihadaranyaka Upanishad | 386 | 386 | 0 | 0 | 0 | 1 | 6 | 1 | 1 | 151 |
| devibhagavat | Devi Bhagavata Purana | 18385 | 18385 | 0 | 0 | 0 | 18376 | 18376 | 18376 | 18376 | 18376 |
| garudpurana | Garuda Purana | 11877 | 11877 | 0 | 0 | 0 | 0 | 630 | 0 | 0 | 11402 |
| harivanshpuran | Harivamsha Purana | 16005 | 16005 | 0 | 0 | 0 | 14005 | 14702 | 14005 | 14005 | 15614 |
| kaushitaki | Kaushitaki Upanishad | 50 | 50 | 0 | 0 | 0 | 49 | 49 | 49 | 49 | 49 |
| kurmapuran | Kurma Purana | 5573 | 5573 | 0 | 0 | 0 | 1 | 22 | 1 | 1 | 5442 |
| lingapuran | Linga Purana | 6726 | 6726 | 0 | 0 | 0 | 0 | 74 | 0 | 0 | 5764 |
| mahabharata | Mahabharata | 32511 | 32511 | 0 | 0 | 0 | 0 | 1324 | 0 | 0 | 30286 |
| markandeypuran | Markandeya Purana | 4339 | 4339 | 0 | 0 | 1 | 6 | 81 | 6 | 6 | 4257 |
| matsyapuran | Matsya Purana | 8330 | 8330 | 0 | 0 | 0 | 0 | 1569 | 0 | 0 | 5945 |
| naradabhaktisutra | Narada Bhakti Sutras | 84 | 84 | 0 | 0 | 0 | 77 | 77 | 77 | 77 | 77 |
| naradapuran | Narada Purana | 15203 | 15203 | 0 | 0 | 0 | 5 | 140 | 5 | 5 | 14480 |
| narasimhapuran | Narasimha Purana | 3361 | 3361 | 0 | 0 | 0 | 0 | 190 | 0 | 0 | 2590 |
| shandilyabhaktisutra | Shandilya Bhakti Sutras | 100 | 100 | 0 | 0 | 0 | 98 | 98 | 98 | 98 | 98 |
| shivasamhita | Shiva Samhita | 644 | 644 | 0 | 0 | 0 | 644 | 644 | 644 | 644 | 644 |
| shivaswarodaya | Shiva Swarodaya | 395 | 395 | 0 | 0 | 0 | 395 | 395 | 395 | 395 | 395 |
| shivpurana | Shiva Purana | 12977 | 12977 | 0 | 0 | 0 | 0 | 59 | 0 | 0 | 12383 |
| skandapuran | Skanda Purana | 6464 | 6464 | 0 | 0 | 0 | 0 | 125 | 0 | 0 | 6275 |
| taittiriya | Taittiriya Upanishad | 31 | 31 | 0 | 0 | 0 | 12 | 12 | 12 | 12 | 12 |
| tejobindu | Tejobindu Upanishad | 464 | 464 | 0 | 0 | 0 | 1 | 1 | 1 | 464 | 464 |
| vamanpuran | Vamana Purana | 5594 | 5594 | 0 | 0 | 0 | 36 | 194 | 36 | 36 | 3873 |
| vayupuran | Vayu Purana | 7641 | 7641 | 0 | 0 | 0 | 0 | 269 | 0 | 0 | 5906 |
| vinayapatrika | Vinaya Patrika | 1483 | 1483 | 0 | 0 | 0 | 1482 | 1482 | 1482 | 1482 | 1482 |
| vishnupurana | Vishnu Purana | 5488 | 5488 | 0 | 0 | 0 | 0 | 925 | 0 | 0 | 4685 |
| yajurveda | Yajur Veda | 1810 | 1810 | 0 | 0 | 0 | 1 | 14 | 1 | 1 | 1606 |
| yogarasayanam | Yoga Rasayanam | 308 | 308 | 0 | 0 | 0 | 308 | 308 | 308 | 308 | 308 |
| yogasutra | Patanjali Yoga Sutras | 195 | 195 | 0 | 0 | 0 | 195 | 195 | 195 | 195 | 195 |

### Critical gap references

- `agnipuran:18:14` — missing translation — “स धन्वी कवची जातस्तेजसा निर्दहन्निव । पृथुर्वैण्यः प्रजाः सर…”
- `agnipuran:18:15` — missing translation — “राजसूयाभिषिक्तानामाद्यः(१) स पृथिवीपतिः । तस्माच्चैव समुत्पन…”
- `agnipuran:18:16` — missing translation — “तत्स्तोत्रञ्चक्रतुर्वीरौ राजाभूज्जनरञ्जनात् । दुग्धा गौस्तेन…”
- `agnipuran:19:7` — missing translation — “हिरण्यकशिपोः पुत्राश् चत्वारः प्रथितौजसः । अनुह्रादश् च ह्रा…”
- `agnipuran:30:1` — missing translation — “मण्डलविधिः नारद उवाच मध्ये पद्मे यजेद्ब्रह्म साङ्गं पूर्वेब्…”
- `agnipuran:33:22` — missing translation — “इन्द्राधिदैवतं पादयुग्ममध्यगतं स्मरेत् । शुद्धञ्च रसतन्मात्र…”
- `agnipuran:34:4` — missing translation — “आरभेद् द्वारयागञ्च तोरणेशान् प्रपूजयेत् । अश्वत्थोदुम्बरवटप्…”
- `agnipuran:48:3` — missing translation — “भोक्षदः श्रीगदी पद्मी शङ्खी विष्णुश् च चक्रधृक् । शङ्खचक्राब…”
- `agnipuran:56:12` — missing translation — “अरुणोग्निनिभश् चैव कृष्णः शुक्लोथ पीतकः । रक्तवर्णस् तथा श्व…”
- `agnipuran:56:13` — missing translation — “कुमुदः कुमुदाक्षश् च पुण्डरीकोथ वामनः । शङ्कुकर्णः सर्वनेत्र…”
- `agnipuran:57:6` — missing translation — “वामनं दिक्षु वाय्वादौ(१) श्रीधरञ्च हृषीकपं । पद्मनाभं दामोदर…”
- `agnipuran:58:5` — missing translation — “प्रभाविताशेषजगद्धात्रि तुभ्यं नमो नमः । त्वयि सम्पूजयामीशे न…”
- `agnipuran:58:12` — missing translation — “द्रुपदादिवेत्यनुलिम्पेदापो हि ष्ठेति सेचयेत् । नदीजैस्तीर्थज…”
- `agnipuran:58:15` — missing translation — “तद्विष्णोरिति ओषध्यद्भिर्या ओषधीति मन्त्रतः । यज्ञायज्ञेति क…”
- `agnipuran:59:1` — missing translation — “अधिवासनकथनं भगवानुवाच हरेः सान्निध्यकरणमधिवासनमुच्यते । सर्व…”
- `agnipuran:59:33` — missing translation — “शिरोघ्राणललाटेषु मुखकण्ठहृदि क्रमात् । भुजयोर्जङ्घयोरङ्घ्य्र…”
- `agnipuran:60:8` — missing translation — “होमार्थे खण्डिलं कुर्यात् सिकताभिः समन्ततः । सार्धहस्तप्रमाण…”
- `agnipuran:60:14` — missing translation — “१ प्रोक्षयेद् गन्धतोयेनेति ख, घ, ङ, चिह्नितपुस्तकत्रयपाठः २ …”
- `agnipuran:60:19` — missing translation — “कल्पयेद्विग्रहं तस्य तैजसैः परमाणुभिः । जीवमावाहयिष्यामि पञ्…”
- `agnipuran:60:20` — missing translation — “चैतन्यं परमानन्दं जाग्रत्स्वप्नविवर्जितं । देहेन्द्रियमनोबुद…”
- `agnipuran:60:21` — missing translation — “ब्रह्मादिस्तम्बपर्यन्तं हृदयेषु व्यवस्थितं । हृदयात् प्रतिमा…”
- `agnipuran:61:4` — missing translation — “कुण्डेषु होमयेद्वह्निं समिल्लाजतिलादिभिः । दत्वा शय्यादिकञ्च…”
- `agnipuran:61:33` — missing translation — “क्षौमाद्यैश् च ध्वजं कुर्याद्विचित्रं वैकवर्णकं(३) । घण्टाचा…”
- `agnipuran:61:41` — missing translation — “सकलं विन्यसेद्दण्डे सूत्रात्मानं सजीवकं । निष्कलं परमात्मानं…”
- `agnipuran:64:2` — missing translation — “अग्नीषोममयं विश्वं विष्णुरापस्तु कारणं । हैमं रौप्यं रत्नजं …”
- `agnipuran:64:21` — missing translation — “व्याहृत्या वाथ गायत्र्या मूलेनामन्त्रयेत्तथा । सूर्याय प्रजा…”
- `agnipuran:66:1` — missing translation — “साधारणप्रतिष्ठाविधानं भगवानुवाच समुदायप्रतिष्ठाञ्च वक्ष्ये स…”
- `agnipuran:66:21` — missing translation — “युञ्जतेत्यनुवाकन्तु(१) जप्त्वा प्राशीत वै चरुं । प्रणवेन स्व…”
- `agnipuran:66:22` — missing translation — “ततो मासाधिपानान्तु विप्रान् द्वादश भोजयेत् । त्रयोदश गुरुस्त…”
- `agnipuran:66:23` — missing translation — “कुम्भान् स्वाद्वम्बुसंयुक्तान्(२) सच्छत्रोपानहान्वितान् ।…”
- `agnipuran:72:1` — missing translation — “स्नानविशेषादिकथनं ईश्वर उवाच वक्ष्यामि स्कन्द नित्याद्यं स्न…”
- `agnipuran:74:12` — missing translation — “शक्तिं हृद्व्यापिनीं पश्चाद्धूङ्कारे(६) पावकप्रभे । रन्ध्रमध…”
- `agnipuran:115:16` — missing translation — “जीवशुक्रशनैश्चारिराहुकेतुस्वरूपिणे । उत्तरे मानसे स्नाता(९) …”
- `agnipuran:120:12` — missing translation — “स्वर्गलोको ध्रुवान्तस्तु नियुतानि(२) चतुर्दश । एतदण्डकटाहेन …”
- `agnipuran:120:13` — missing translation — “वारिवह्न्यनिलाकाशैस्ततो भूतादिना वहिः । वृतं दशगुणैर् अण्डं …”
- `agnipuran:120:14` — missing translation — “दशोत्तराणि शेषाणि एकैकस्मान्मामुने । महान्तञ्च समावृत्य प्रध…”
- `agnipuran:154:4` — missing translation — “अपत्यविक्रयासक्ते निष्कृतिर् न विधीयते । कन्यादानं शचीयोगो(१…”
- `agnipuran:155:10` — missing translation — “गायत्रीं तु विशेषेण अघमर्षणसूक्तके । देवता भाववृत्तस्तु ऋषिश…”
- `agnipuran:155:12` — missing translation — “पौरुषेण तु सूक्तेन ददेच्चैवोदकाञ्जलिं । ततो ऽग्निहवनं(२) कुर…”
- `agnipuran:155:13` — missing translation — “१ तत्राघमर्षणमित्यादिः देवतापितृतर्पणमित्यन्तः पाठः झ॥ पुस्त…”
- `agnipuran:157:2` — missing translation — “जनने च तथा शुद्धिर्ब्राह्मणानां भृगूत्तम । द्वादशाहेन राजन्य…”
- `agnipuran:163:11` — missing translation — “यथालाभोपपन्नेषु रौप्येषु तु विशेषतः । दत्वान्नं पृथिवीपात्रम…”
- `agnipuran:175:11` — missing translation — “सर्वव्रतेष्वयं धर्मः सामान्यो दशधा स्मृतः । पवित्राणि जपेच्च…”
- `agnipuran:215:9` — missing translation — “ब्रह्महत्या सुरापानं सुवर्णस्तेयमेव च । गुरुदारागमश् चैव जप्…”
- `agnipuran:218:3` — missing translation — “पालयिष्यति वः सर्वान् धर्मस्थान् व्रतमाचरेत् । संवत्सरं स वृ…”
- `agnipuran:219:8` — missing translation — “अश्विन्याद्याश् च चन्द्रस्य पुलहस्य(२) तथा प्रियाः । भूता च …”
- `agnipuran:259:22` — missing translation — “परकीयानथोद्देश्य प्रधानपुरुषांस् तथा । सुस्विन्नान् पिष्टकवर…”
- `agnipuran:259:22-2` — missing translation — “वृक्षाणां यज्ञियानान्तु समिधः प्रथमं हविः । आज्यञ्च व्रीहयश्…”
- `agnipuran:260:1` — missing translation — “अथर्वविधानं पुष्कर उवाच साम्नां विधानं कथितं वक्ष्ये चाथर्वण…”
- `agnipuran:261:17` — missing translation — “न दीप्यते चेन्धनवांस्तद्राष्ट्रं पाड्यते नृपैः । अग्निवैकृत्…”
- ... and 56650 more.

## Scriptures with supporting-language gaps

| Scripture | Title | Declared | Loaded | Missing | ∅ Sanskrit | ∅ Transliteration | ∅ Translation | Unusable Translation | ∅ Hindi | ∅ Commentary | ∅ Word Meaning |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| bhagavatapurana | Bhagavata Purana | 14408 | 14408 | 0 | 0 | 0 | 14401 | 14401 | 14401 | 14401 | 14401 |
| brahmandpuran | Brahmanda Purana | 13498 | 13498 | 0 | 0 | 1 | 2 | 168 | 2 | 2 | 13124 |
| brahmapuran | Brahma Purana | 13444 | 13444 | 0 | 0 | 0 | 2 | 24 | 2 | 2 | 13177 |
| brihadaranyaka | Brihadaranyaka Upanishad | 386 | 386 | 0 | 0 | 0 | 1 | 6 | 1 | 1 | 151 |
| devibhagavat | Devi Bhagavata Purana | 18385 | 18385 | 0 | 0 | 0 | 18376 | 18376 | 18376 | 18376 | 18376 |
| harivanshpuran | Harivamsha Purana | 16005 | 16005 | 0 | 0 | 0 | 14005 | 14702 | 14005 | 14005 | 15614 |
| kaushitaki | Kaushitaki Upanishad | 50 | 50 | 0 | 0 | 0 | 49 | 49 | 49 | 49 | 49 |
| kurmapuran | Kurma Purana | 5573 | 5573 | 0 | 0 | 0 | 1 | 22 | 1 | 1 | 5442 |
| markandeypuran | Markandeya Purana | 4339 | 4339 | 0 | 0 | 1 | 6 | 81 | 6 | 6 | 4257 |
| naradabhaktisutra | Narada Bhakti Sutras | 84 | 84 | 0 | 0 | 0 | 77 | 77 | 77 | 77 | 77 |
| naradapuran | Narada Purana | 15203 | 15203 | 0 | 0 | 0 | 5 | 140 | 5 | 5 | 14480 |
| shandilyabhaktisutra | Shandilya Bhakti Sutras | 100 | 100 | 0 | 0 | 0 | 98 | 98 | 98 | 98 | 98 |
| shivasamhita | Shiva Samhita | 644 | 644 | 0 | 0 | 0 | 644 | 644 | 644 | 644 | 644 |
| shivaswarodaya | Shiva Swarodaya | 395 | 395 | 0 | 0 | 0 | 395 | 395 | 395 | 395 | 395 |
| taittiriya | Taittiriya Upanishad | 31 | 31 | 0 | 0 | 0 | 12 | 12 | 12 | 12 | 12 |
| tejobindu | Tejobindu Upanishad | 464 | 464 | 0 | 0 | 0 | 1 | 1 | 1 | 464 | 464 |
| vamanpuran | Vamana Purana | 5594 | 5594 | 0 | 0 | 0 | 36 | 194 | 36 | 36 | 3873 |
| vinayapatrika | Vinaya Patrika | 1483 | 1483 | 0 | 0 | 0 | 1482 | 1482 | 1482 | 1482 | 1482 |
| yajurveda | Yajur Veda | 1810 | 1810 | 0 | 0 | 0 | 1 | 14 | 1 | 1 | 1606 |
| yogarasayanam | Yoga Rasayanam | 308 | 308 | 0 | 0 | 0 | 308 | 308 | 308 | 308 | 308 |
| yogasutra | Patanjali Yoga Sutras | 195 | 195 | 0 | 0 | 0 | 195 | 195 | 195 | 195 | 195 |

## Duplicate verse references

No duplicate `chapter:verse` references found within any scripture.

---

_Generated by `scripts/verse-audit.js` on 2026-10-19._