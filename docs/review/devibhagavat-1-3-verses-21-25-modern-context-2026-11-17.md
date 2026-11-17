# Devī Bhāgavata Skandha 1 Chapter 3 verses 21–25 — Sanskrit alignment and editorial review

Date: 2026-11-17. Primary Sanskrit witness: https://sanskritdocuments.org/doc_purana/devIbhAgavatam01.html (1.3 verses 21–25).

| Verse | Source opening | Specific subject |
| --- | --- | --- |
| 3:21 | `स्त्रीशूद्रद्विजबन्धूनां` | Narrated exclusion from Vedic hearing and stated motivation for Purāṇas; historical social restriction, **not** a rule advocated for contemporary education |
| 3:22 | `मन्वन्तरे सप्तमेऽत्र` | Seventh Vaivasvata Manvantara, 28th Dvāpara, as a Purāṇic temporal scheme |
| 3:23 | `व्यासः सत्यवतीसूनुर्गुरुर्मे` | Satyavatī's son as the speaker's guru; Drauṇi as next Vyāsa in the 29th Dvāpara |
| 3:24 | `अतीतास्तु तथा व्यासाः` | Stated count of 27 earlier Vyāsas and repeated Purāṇa narration |
| 3:25 | `ब्रूहि सूत महाभाग` | Sages' request for the previous Vyāsa list, answered only in subsequent verses |

For each verse, this release has an original Hindi भावार्थ, a unique 200–280-word three-movement हिन्दी व्याख्या (प्रसंग एवं भाव / पद-विवेचन / जीवन-साधना), and a distinct modern-context panel (आधुनिक संदर्भ / आज के जीवन में प्रयोग / चिंतन प्रश्न). The first social restriction is preserved as a historically situated statement while recognising equal access and dignity today. The traditional chronology is not converted into unsupported modern dates. The original Sanskrit is not modified.

Five openings are hard-coded in the guarded source-checked publish overlay and matched against existing numbered Sanskrit before applying Hindi. The commentary release queue matches the same source witness and per-verse opening. The integrity regression test requires all **90** meanings, **90** explanations and **90** modern-context panels in generated public reader JSON, while retaining Chapter 3's **43** original Sanskrit verses. AI-assisted interpretive material is not claimed to be Gita Press text or independently scholar-certified; source/edit status remains transparent.

Merge only after lint, full static build, Cloudflare preview and all browser test shards succeed. A merge is not by itself evidence of live custom-domain propagation.

## Acceptance checks

- Verify source witness verse openings directly against the 43-verse Chapter 3 Sanskrit, with no mutation of the underlying canonical text.
- Verify `स्त्रीशूद्रद्विजबन्धूनां` and `न वेदश्रवणं मतम्` are discussed descriptively, not presented as an obligation or permission to discriminate today.
- Verify 3:23 has `गुरुर्मे` in the first-person reference to Sūta's guru, while `द्रौणिः` is the named future Vyāsa.
- Verify each `3:21`–`3:25` meaning, three-movement व्याख्या and three-heading modern-context panel reaches the generated public reader shard, rather than only remaining in the review queue.
- Confirm lint, type checking, source-integrity regression, static export, preview and four browser shards pass before merging.
