---
trigger: always_on
---

# Dharma Granth: Hindi Register & Scriptural Editorial Standards (Imported from Claude Memory)

## 1. Hindi Register & Tone (`hindi-register-tone`)
- **Accessible, dignified Hindi:** Write simple, lucid, and dignified Hindi readable by everyday readers. Everyday Hindi words (`तनाव`, `शुरू`, `याद`, `थकान`, `समय`) are welcome; the older tatsam-only restriction (`आरम्भ` over `शुरू`) is retired, though existing tatsam text should not be rewritten just for register.
- **Zero Urdu/Persian in commentary:** Strictly avoid Urdu/Persian vocabulary in scriptural commentary and UI (`खुदा` → `ईश्वर`/`परमात्मा`, `दुआ` → `प्रार्थना`/`आशीर्वाद`, `इंसाफ` → `न्याय`/`धर्म`, `तसल्ली` → `सांत्वना`/`धैर्य`).
- **Reader address & honorifics:** Always address the reader as `आप` (never `तुम`/`तू`; direct scriptural quotations where Krishna addresses Arjuna as `तू`/`तुम` inside the teaching remain untouched). Use respectful honorifics and plural verb forms for revered figures.
- **Digits:** Use standard ASCII digits (`0-9`) only — never Devanagari numerals.
- **Three-pillar verse commentary:** Explanations should read like an experienced teacher bringing out the verse's *bhava* with zero padding (~200–280 words), structured across `भावार्थ → व्याख्या (with पदच्छेद/अन्वय) → आधुनिक संदर्भ`.

## 2. High-Confidence व्याख्या Verification (`vyakhya-high-confidence`)
- Every published `व्याख्या` draft must earn `"high"` confidence — never publish uncertain or `"medium"`-confidence claims for sacred texts.
- Before staging (`data/ai-commentary/staged/<scripture>-<chapter>.json`), verify every scriptural citation: exact text, book/kanda/parva, verse number, and list order.
- Frame traditional/popular narratives as `"भक्ति-परम्परा में प्रसिद्ध"` rather than asserting them as direct canonical text unless verified.
- Where classical commentators genuinely differ, present the main traditional readings fairly without taking sectarian sides.
- Check staged commentary with `cmd /c node scripts/check-hindi-register.mjs`, then `cmd /c node scripts/stage-commentary.mjs` and `cmd /c npm run publish:commentary`.

## 3. Site-Wide Register & Source Translation Protection (`sitewide-register-standard` & `editorial-template-hiding`)
- **Never rewrite printed edition translations** (e.g., Gita Press Hindi meanings) without explicit user approval.
- Leave search regexes (`lib/copilot.ts`) and pilot-owned verses untouched.
- Note: `Vivekchudamani` commentary drafting was paused at verse `300`.
- **Template-text hiding (`scripts/lib/template-text.ts`):** At publish time (`shard-scriptures-full.ts` and `convert-commentary-to-json.ts`), repeated `explanation`/`commentary`/`science`/`lifeLesson` strings (>40 chars repeating across 3+ distinct-Sanskrit verses, excluding short contiguous range notes of <=8 verses) are automatically withheld from publication while keeping source data reversible. Do not auto-edit `docs/editorial-fix-candidates.{md,tsv}` without per-scripture user approval.
