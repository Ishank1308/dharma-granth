# Verse Audit — `public/data/scriptures-full/*.json`

_Per-verse field completeness across the published scripture JSON corpus._

## Executive summary

| Metric | Value |
|---|---|---|
| Scriptures | 67 |
| Declared verses | 319,212 |
| Loaded verses | 319,205 |
| Not-yet-loaded verses | 7 |
| Empty commentary / explanation | 140,869 |
| Empty word meaning | 302,637 |
| Empty Hindi | 0 |
| Critical gaps (core text) | 144366 |
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
| aitareya | Aitareya Upanishad | 33 | 33 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| amritabindu | Amritabindu Upanishad | 22 | 22 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| atharvaveda | Atharva Veda | 5985 | 5985 | 0 | 0 | 0 | 5206 | 5347 | 0 | 5980 | 5985 |
| bhagavadgita | Bhagavad Gita | 701 | 701 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| bhagavatapurana | Bhagavata Purana | 14408 | 14408 | 0 | 0 | 0 | 14401 | 14401 | 0 | 14401 | 14401 |
| brahmandpuran | Brahmanda Purana | 13498 | 13498 | 0 | 0 | 1 | 2 | 168 | 0 | 2 | 13124 |
| brahmapuran | Brahma Purana | 13444 | 13444 | 0 | 0 | 0 | 2 | 24 | 0 | 2 | 13177 |
| brahmasutra | Brahma Sutra | 564 | 564 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 557 |
| brahmavaivartapuran | Brahmavaivarta Purana | 10 | 10 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| brihadaranyaka | Brihadaranyaka Upanishad | 435 | 435 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 435 |
| chandogya | Chandogya Upanishad | 628 | 628 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| devibhagavat | Devi Bhagavata Purana | 18385 | 18385 | 0 | 0 | 0 | 18376 | 18376 | 0 | 18203 | 18376 |
| durgasaptashati | Durga Saptashati | 634 | 634 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 615 |
| garudpurana | Garuda Purana | 11877 | 11877 | 0 | 0 | 0 | 0 | 630 | 0 | 0 | 11402 |
| harivanshpuran | Harivamsha Purana | 16005 | 16005 | 0 | 0 | 0 | 14005 | 14702 | 0 | 14005 | 15614 |
| ishavasya | Isha Upanishad | 18 | 18 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| jabala | Jabala Upanishad | 6 | 6 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 6 |
| kaivalya | Kaivalya Upanishad | 24 | 24 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 18 |
| kalkipuran | Kalki Purana | 10 | 10 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| katha | Katha Upanishad | 119 | 119 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| kaushitaki | Kaushitaki Upanishad | 50 | 50 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 49 |
| kena | Kena Upanishad | 35 | 35 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| kurmapuran | Kurma Purana | 5573 | 5573 | 0 | 0 | 0 | 1 | 22 | 0 | 1 | 5442 |
| lingapuran | Linga Purana | 6726 | 6726 | 0 | 0 | 0 | 0 | 74 | 0 | 0 | 5764 |
| mahabharata | Mahabharata | 73816 | 73816 | 0 | 0 | 0 | 41408 | 42665 | 0 | 41342 | 71632 |
| mahanarayana | Mahanarayana Upanishad | 263 | 263 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 261 |
| mahaupanishad | Maha Upanishad | 553 | 553 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 553 |
| maitri | Maitri Upanishad | 99 | 99 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 98 |
| mandukya | Mandukya Upanishad | 12 | 12 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| manusmriti | Manusmriti | 2684 | 2684 | 0 | 0 | 0 | 0 | 0 | 0 | 2680 | 2681 |
| markandeypuran | Markandeya Purana | 4339 | 4339 | 0 | 0 | 1 | 6 | 81 | 0 | 6 | 4257 |
| matsyapuran | Matsya Purana | 8330 | 8330 | 0 | 0 | 0 | 0 | 1569 | 0 | 0 | 5945 |
| muktika | Muktika Upanishad | 137 | 137 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 137 |
| mundaka | Mundaka Upanishad | 64 | 64 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| naradabhaktisutra | Narada Bhakti Sutras | 84 | 84 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 77 |
| naradapuran | Narada Purana | 15203 | 15203 | 0 | 0 | 0 | 5 | 140 | 0 | 5 | 14480 |
| narasimhapuran | Narasimha Purana | 3361 | 3361 | 0 | 0 | 0 | 0 | 190 | 0 | 0 | 2590 |
| niralamba | Niralamba Upanishad | 21 | 21 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 21 |
| nityakarmakriya | Nitya Karma Kriya | 16 | 16 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| padmapuran | Padma Purana | 18 | 18 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| prashna | Prashna Upanishad | 67 | 67 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| ramayana | Valmiki Ramayana | 23595 | 23595 | 0 | 0 | 0 | 23595 | 23595 | 0 | 23581 | 23595 |
| ramcharitmanas | Shri Ramcharitmanas | 6172 | 6172 | 0 | 0 | 0 | 6083 | 6083 | 0 | 6137 | 6172 |
| ravanasamhita | Ravana Samhita | 43 | 43 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| rigveda | Rig Veda | 10531 | 10531 | 0 | 0 | 0 | 10524 | 10524 | 0 | 10516 | 10531 |
| samaveda | Sama Veda | 1875 | 1875 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1872 |
| shandilyabhaktisutra | Shandilya Bhakti Sutras | 100 | 100 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 98 |
| shivasamhita | Shiva Samhita | 644 | 644 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 644 |
| shivaswarodaya | Shiva Swarodaya | 395 | 395 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 395 |
| shivpurana | Shiva Purana | 15591 | 15591 | 0 | 0 | 0 | 2622 | 2681 | 0 | 2984 | 15005 |
| shvetashvatara | Shvetashvatara Upanishad | 113 | 113 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 106 |
| skandapuran | Skanda Purana | 6464 | 6464 | 0 | 0 | 0 | 0 | 125 | 0 | 0 | 6275 |
| taittiriya | Taittiriya Upanishad | 31 | 31 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 12 |
| tejobindu | Tejobindu Upanishad | 464 | 464 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 464 |
| vamanpuran | Vamana Purana | 5594 | 5594 | 0 | 0 | 0 | 36 | 194 | 0 | 36 | 3873 |
| varahapuran | Varaha Purana | 10 | 10 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| vayupuran | Vayu Purana | 7641 | 7641 | 0 | 0 | 0 | 0 | 269 | 0 | 0 | 5906 |
| viduraniti | Vidura Niti | 594 | 594 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 3 |
| vinayapatrika | Vinaya Patrika | 1483 | 1483 | 0 | 0 | 0 | 1482 | 1482 | 0 | 0 | 1482 |
| vishnupurana | Vishnu Purana | 5488 | 5488 | 0 | 0 | 0 | 0 | 925 | 0 | 0 | 4685 |
| vivekchudamani | Vivekachudamani | 580 | 580 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 578 |
| yajurveda | Yajur Veda | 1975 | 1975 | 0 | 0 | 0 | 12 | 14 | 0 | 988 | 1975 |
| yogarasayanam | Yoga Rasayanam | 308 | 301 | 7 | 0 | 0 | 0 | 0 | 0 | 0 | 301 |
| yogasutra | Patanjali Yoga Sutras | 195 | 195 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 195 |
| yogavasishtha | Yoga Vasishtha | 13 | 13 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| yogavasistha | Yoga Vasishtha | 13 | 13 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

## Scriptures with commentary / word-meaning gaps

These are the scriptures that have verse records but are missing explanatory content. The biggest blockers are the large Puranas and Vedic texts.

| Scripture | Title | Loaded | ∅ Commentary | ∅ Word Meaning |
| --- | --- | --- | --- | --- |
| mahabharata | Mahabharata | 73816 | 41342 | 71632 |
| ramayana | Valmiki Ramayana | 23595 | 23581 | 23595 |
| devibhagavat | Devi Bhagavata Purana | 18385 | 18203 | 18376 |
| bhagavatapurana | Bhagavata Purana | 14408 | 14401 | 14401 |
| harivanshpuran | Harivamsha Purana | 16005 | 14005 | 15614 |
| rigveda | Rig Veda | 10531 | 10516 | 10531 |
| ramcharitmanas | Shri Ramcharitmanas | 6172 | 6137 | 6172 |
| atharvaveda | Atharva Veda | 5985 | 5980 | 5985 |
| shivpurana | Shiva Purana | 15591 | 2984 | 15005 |
| manusmriti | Manusmriti | 2684 | 2680 | 2681 |
| yajurveda | Yajur Veda | 1975 | 988 | 1975 |
| vamanpuran | Vamana Purana | 5594 | 36 | 3873 |
| markandeypuran | Markandeya Purana | 4339 | 6 | 4257 |
| naradapuran | Narada Purana | 15203 | 5 | 14480 |
| brahmandpuran | Brahmanda Purana | 13498 | 2 | 13124 |
| brahmapuran | Brahma Purana | 13444 | 2 | 13177 |
| kurmapuran | Kurma Purana | 5573 | 1 | 5442 |
| agnipuran | Agni Purana | 11043 | 0 | 10773 |
| brahmasutra | Brahma Sutra | 564 | 0 | 557 |
| brihadaranyaka | Brihadaranyaka Upanishad | 435 | 0 | 435 |
| durgasaptashati | Durga Saptashati | 634 | 0 | 615 |
| garudpurana | Garuda Purana | 11877 | 0 | 11402 |
| jabala | Jabala Upanishad | 6 | 0 | 6 |
| kaivalya | Kaivalya Upanishad | 24 | 0 | 18 |
| kaushitaki | Kaushitaki Upanishad | 50 | 0 | 49 |
| lingapuran | Linga Purana | 6726 | 0 | 5764 |
| mahanarayana | Mahanarayana Upanishad | 263 | 0 | 261 |
| mahaupanishad | Maha Upanishad | 553 | 0 | 553 |
| maitri | Maitri Upanishad | 99 | 0 | 98 |
| matsyapuran | Matsya Purana | 8330 | 0 | 5945 |
| muktika | Muktika Upanishad | 137 | 0 | 137 |
| naradabhaktisutra | Narada Bhakti Sutras | 84 | 0 | 77 |
| narasimhapuran | Narasimha Purana | 3361 | 0 | 2590 |
| niralamba | Niralamba Upanishad | 21 | 0 | 21 |
| samaveda | Sama Veda | 1875 | 0 | 1872 |
| shandilyabhaktisutra | Shandilya Bhakti Sutras | 100 | 0 | 98 |
| shivasamhita | Shiva Samhita | 644 | 0 | 644 |
| shivaswarodaya | Shiva Swarodaya | 395 | 0 | 395 |
| shvetashvatara | Shvetashvatara Upanishad | 113 | 0 | 106 |
| skandapuran | Skanda Purana | 6464 | 0 | 6275 |
| taittiriya | Taittiriya Upanishad | 31 | 0 | 12 |
| tejobindu | Tejobindu Upanishad | 464 | 0 | 464 |
| vayupuran | Vayu Purana | 7641 | 0 | 5906 |
| viduraniti | Vidura Niti | 594 | 0 | 3 |
| vinayapatrika | Vinaya Patrika | 1483 | 0 | 1482 |
| vishnupurana | Vishnu Purana | 5488 | 0 | 4685 |
| vivekchudamani | Vivekachudamani | 580 | 0 | 578 |
| yogarasayanam | Yoga Rasayanam | 301 | 0 | 301 |
| yogasutra | Patanjali Yoga Sutras | 195 | 0 | 195 |

### Sample verse references with missing commentary

- **mahabharata** (Mahabharata): mahabharata:1:1.0, mahabharata:1:1.1, mahabharata:1:1.2
- **ramayana** (Valmiki Ramayana): ramayana:1:1.13, ramayana:1:1.14, ramayana:1:1.15
- **devibhagavat** (Devi Bhagavata Purana): devibhagavat:5:1, devibhagavat:5:2, devibhagavat:5:3
- **bhagavatapurana** (Bhagavata Purana): bhagavatapurana:1:1, bhagavatapurana:1:3, bhagavatapurana:1:4
- **harivanshpuran** (Harivamsha Purana): harivanshpuran:1:2, harivanshpuran:1:3, harivanshpuran:1:4
- **rigveda** (Rig Veda): rigveda:1:2.1, rigveda:1:2.2, rigveda:1:2.3
- **ramcharitmanas** (Shri Ramcharitmanas): ramcharitmanas:1:0.3, ramcharitmanas:1:0.4, ramcharitmanas:1:0.5
- **atharvaveda** (Atharva Veda): atharvaveda:1:1.1, atharvaveda:1:1.2, atharvaveda:1:1.3
- **shivpurana** (Shiva Purana): shivpurana:1:0.1, shivpurana:1:0.2, shivpurana:1:1.1
- **manusmriti** (Manusmriti): manusmriti:1:1.1, manusmriti:1:1.2, manusmriti:1:1.3
- **yajurveda** (Yajur Veda): yajurveda:18:37, yajurveda:18:38, yajurveda:18:39
- **vamanpuran** (Vamana Purana): vamanpuran:4:30, vamanpuran:5:21, vamanpuran:5:34
- **markandeypuran** (Markandeya Purana): markandeypuran:8:48, markandeypuran:50:32, markandeypuran:51:83
- **naradapuran** (Narada Purana): naradapuran:9:34, naradapuran:14:160, naradapuran:54:313
- **brahmandpuran** (Brahmanda Purana): brahmandpuran:47:52, brahmandpuran:49:30
- **brahmapuran** (Brahma Purana): brahmapuran:61:35, brahmapuran:77:3
- **kurmapuran** (Kurma Purana): kurmapuran:36:6

## Scriptures with critical text gaps

| Scripture | Title | Declared | Loaded | Missing | ∅ Sanskrit | ∅ Transliteration | ∅ Translation | Unusable Translation | ∅ Hindi | ∅ Commentary | ∅ Word Meaning |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| agnipuran | Agni Purana | 11043 | 11043 | 0 | 0 | 0 | 0 | 85 | 0 | 0 | 10773 |
| atharvaveda | Atharva Veda | 5985 | 5985 | 0 | 0 | 0 | 5206 | 5347 | 0 | 5980 | 5985 |
| bhagavatapurana | Bhagavata Purana | 14408 | 14408 | 0 | 0 | 0 | 14401 | 14401 | 0 | 14401 | 14401 |
| brahmandpuran | Brahmanda Purana | 13498 | 13498 | 0 | 0 | 1 | 2 | 168 | 0 | 2 | 13124 |
| brahmapuran | Brahma Purana | 13444 | 13444 | 0 | 0 | 0 | 2 | 24 | 0 | 2 | 13177 |
| devibhagavat | Devi Bhagavata Purana | 18385 | 18385 | 0 | 0 | 0 | 18376 | 18376 | 0 | 18203 | 18376 |
| garudpurana | Garuda Purana | 11877 | 11877 | 0 | 0 | 0 | 0 | 630 | 0 | 0 | 11402 |
| harivanshpuran | Harivamsha Purana | 16005 | 16005 | 0 | 0 | 0 | 14005 | 14702 | 0 | 14005 | 15614 |
| kurmapuran | Kurma Purana | 5573 | 5573 | 0 | 0 | 0 | 1 | 22 | 0 | 1 | 5442 |
| lingapuran | Linga Purana | 6726 | 6726 | 0 | 0 | 0 | 0 | 74 | 0 | 0 | 5764 |
| mahabharata | Mahabharata | 73816 | 73816 | 0 | 0 | 0 | 41408 | 42665 | 0 | 41342 | 71632 |
| markandeypuran | Markandeya Purana | 4339 | 4339 | 0 | 0 | 1 | 6 | 81 | 0 | 6 | 4257 |
| matsyapuran | Matsya Purana | 8330 | 8330 | 0 | 0 | 0 | 0 | 1569 | 0 | 0 | 5945 |
| naradapuran | Narada Purana | 15203 | 15203 | 0 | 0 | 0 | 5 | 140 | 0 | 5 | 14480 |
| narasimhapuran | Narasimha Purana | 3361 | 3361 | 0 | 0 | 0 | 0 | 190 | 0 | 0 | 2590 |
| ramayana | Valmiki Ramayana | 23595 | 23595 | 0 | 0 | 0 | 23595 | 23595 | 0 | 23581 | 23595 |
| ramcharitmanas | Shri Ramcharitmanas | 6172 | 6172 | 0 | 0 | 0 | 6083 | 6083 | 0 | 6137 | 6172 |
| rigveda | Rig Veda | 10531 | 10531 | 0 | 0 | 0 | 10524 | 10524 | 0 | 10516 | 10531 |
| shivpurana | Shiva Purana | 15591 | 15591 | 0 | 0 | 0 | 2622 | 2681 | 0 | 2984 | 15005 |
| skandapuran | Skanda Purana | 6464 | 6464 | 0 | 0 | 0 | 0 | 125 | 0 | 0 | 6275 |
| vamanpuran | Vamana Purana | 5594 | 5594 | 0 | 0 | 0 | 36 | 194 | 0 | 36 | 3873 |
| vayupuran | Vayu Purana | 7641 | 7641 | 0 | 0 | 0 | 0 | 269 | 0 | 0 | 5906 |
| vinayapatrika | Vinaya Patrika | 1483 | 1483 | 0 | 0 | 0 | 1482 | 1482 | 0 | 0 | 1482 |
| vishnupurana | Vishnu Purana | 5488 | 5488 | 0 | 0 | 0 | 0 | 925 | 0 | 0 | 4685 |
| yajurveda | Yajur Veda | 1975 | 1975 | 0 | 0 | 0 | 12 | 14 | 0 | 988 | 1975 |

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
- ... and 144316 more.

## Scriptures with supporting-language gaps

| Scripture | Title | Declared | Loaded | Missing | ∅ Sanskrit | ∅ Transliteration | ∅ Translation | Unusable Translation | ∅ Hindi | ∅ Commentary | ∅ Word Meaning |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| brahmandpuran | Brahmanda Purana | 13498 | 13498 | 0 | 0 | 1 | 2 | 168 | 0 | 2 | 13124 |
| markandeypuran | Markandeya Purana | 4339 | 4339 | 0 | 0 | 1 | 6 | 81 | 0 | 6 | 4257 |

## Duplicate verse references

No duplicate `chapter:verse` references found within any scripture.

---

_Generated by `scripts/verse-audit.js` on 2026-11-22._