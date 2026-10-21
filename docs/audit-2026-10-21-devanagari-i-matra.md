# Devanagari "virama + i-matra" audit (2026-10-21)

A virama followed by the i-sign (`्ि`) is never valid Devanagari; it renders as a broken conjunct.
The Bhagavad Gita had 26 such words, all a misordered vowel (`श्िच` → `श्चि`), fixed in commit
`4ee3e731`. Everywhere else the same pattern is mostly OCR damage where a consonant was **lost**
(`युधिष्िर` = युधिष्ठिर, `कश्ित्` = कश्चित्, `चिह्ित` = चिह्नित), so a mechanical reorder would
write new wrong text.

## Method

For each broken word, candidate repairs were generated: the reorder (vowel after the following
consonant cluster) and the insertion of any one consonant between `्` and `ि`. A repair was proposed
only when exactly one candidate occurs as a complete clean word at least twice elsewhere in the corpus.
That proposed 105 repairs; each was read by hand and 55 were applied. Rejected ones matched
another OCR misspelling (e.g. `युधिषछ्ठिर`, `तिष्टन्ति`) or were wrong in context (`क्ियाहै` is किया है).

Applied: 55 words, 326 occurrences, all in Hindi translation, explanation and
research fields. No canonical field (verse number, Sanskrit, IAST) changed; the canonical manifest
still matches and `npm run check` passes.

## Remaining occurrences by scripture

| Scripture | Before | Remaining |
|---|---:|---:|
| vayupuran | 832 | 784 |
| atharvaveda | 708 | 656 |
| mahabharata | 512 | 468 |
| yajurveda | 264 | 240 |
| chandogya | 220 | 212 |
| matsyapuran | 178 | 178 |
| brahmandpuran | 172 | 158 |
| brihadaranyaka | 154 | 154 |
| naradapuran | 94 | 82 |
| harivanshpuran | 85 | 75 |
| agnipuran | 90 | 74 |
| garudpurana | 70 | 70 |
| vamanpuran | 94 | 58 |
| narasimhapuran | 56 | 52 |
| kurmapuran | 68 | 44 |
| shivpurana | 36 | 36 |
| lingapuran | 36 | 30 |
| manusmriti | 26 | 26 |
| vishnupurana | 36 | 24 |
| chandogya-rest | 18 | 18 |
| brihadaranyaka-rest | 14 | 14 |
| markandeypuran | 24 | 12 |
| brahmapuran | 14 | 10 |
| viduraniti | 3 | 3 |
| **Total** | **3804** | **3478** |

Counts include every copy (monolithic JSON, curated TS, Hindi commentary, per-chapter shards).
These need a source edition to correct; do not apply the reorder rule to them.

## Applied repairs

| Occurrences | Was | Now |
|---:|---|---|
| 20 | एकोद्िष्ट | एकोद्दिष्ट |
| 16 | राष्ट्िय | राष्ट्रिय |
| 16 | वज्िणा | वज्रिणा |
| 12 | पत्ियोंने | पत्नियोंने |
| 8 | तपस्ियोंके | तपस्वियोंके |
| 8 | वज्िन् | वज्रिन् |
| 8 | गतिर्ि | गतिर्हि |
| 8 | वज्िवज्रप्रमथिता | वज्रिवज्रप्रमथिता |
| 8 | अरत्ि | अरत्नि |
| 8 | भृङ्ित्व | भृङ्गित्व |
| 8 | द्िजातय | द्विजातय |
| 7 | दीप्िसे | दीप्तिसे |
| 6 | यज्ियाग्नि | यज्ञियाग्नि |
| 6 | वकवृत्ि | वकवृत्ति |
| 6 | भवद्िस्तत्र | भवद्भिस्तत्र |
| 6 | गूढमप्राज्ञविद्िष्टं | गूढमप्राज्ञविद्विष्टं |
| 6 | शुद्िरित्याह | शुद्धिरित्याह |
| 6 | द्रक्ष्यन्ित | द्रक्ष्यन्ति |
| 6 | कर्त्तव्यमेकोद्िष्टं | कर्त्तव्यमेकोद्दिष्टं |
| 6 | लोकविद्िष्टं | लोकविद्विष्टं |
| 6 | स्त्ियाँ | स्त्रियाँ |
| 6 | श्रावयेद्िद्वान्सदा | श्रावयेद्विद्वान्सदा |
| 6 | परस्पराश्िता | परस्पराश्रिता |
| 6 | विजज्िवान् | विजज्ञिवान् |
| 6 | इन्द्ियद्वार | इन्द्रियद्वार |
| 6 | इन्द्ियाश्वों | इन्द्रियाश्वों |
| 4 | विद्युज्िह्वे | विद्युज्जिह्वे |
| 4 | प्रवह्िका | प्रवह्लिका |
| 4 | पूर्वेऽह्ि | पूर्वेऽह्नि |
| 4 | किङ्िणी | किङ्किणी |
| 4 | पाचकाग्ि | पाचकाग्नि |
| 4 | वैकल्िक | वैकल्पिक |
| 4 | हरिश्ियम् | हरिश्रियम् |
| 4 | उस्ियाभिः | उस्रियाभिः |
| 4 | इन्द्िय | इन्द्रिय |
| 4 | ज्ञानबलक्िया | ज्ञानबलक्रिया |
| 4 | कोपाग्ि | कोपाग्नि |
| 4 | भयाद्िव्यथिरे | भयाद्विव्यथिरे |
| 4 | वृत्िके | वृत्तिके |
| 4 | इन्द्ियोको | इन्द्रियोको |
| 4 | तपस्ियोंने | तपस्वियोंने |
| 4 | प्रायश्ित्तोंका | प्रायश्चित्तोंका |
| 4 | प्रायश्ित्तायुतैरपि | प्रायश्चित्तायुतैरपि |
| 4 | लङ्ितम् | लङ्घितम् |
| 4 | वह्िदम् | वह्निदम् |
| 4 | शङ्िनीने | शङ्किनीने |
| 4 | वह्िवर्षनिभं | वह्निवर्षनिभं |
| 4 | एकहस्तान्द्िहस्तांश्च | एकहस्तान्द्विहस्तांश्च |
| 4 | साध्वीमिडामाश्ित्य | साध्वीमिडामाश्रित्य |
| 4 | ब्रह्मसंज्ितः | ब्रह्मसंज्ञितः |
| 4 | सप्तर्ि | सप्तर्षि |
| 4 | पितरावश्िनोभेन्द्रावथुः | पितरावश्विनोभेन्द्रावथुः |
| 4 | इन्द्ियादि | इन्द्रियादि |
| 4 | सहस्िणः | सहस्रिणः |
| 3 | मूर्ध्िन | मूर्ध्नि |
