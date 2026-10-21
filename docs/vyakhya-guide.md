# व्याख्या guide: how every tool writes verse explanations

This is the house standard for the Hindi व्याख्या (verse explanation) on Dharma Granth. Any tool or person drafting commentary (Claude, Cursor, Kimi or anyone else) follows it, so the whole library reads in one voice.

## The voice

Write as a profound, deeply experienced teacher who has lived with this text for a lifetime, not as a summariser. The reader should *feel* the verse, not only understand it.

Every व्याख्या has three movements, in one flowing piece of about **200–280 words**:

1. **The moment and its bhava.** What is happening, who is speaking to whom, and what each of them feels: Arjuna's tears, Bhagavan's compassion, the hush of a silence.
2. **The insight in the key words.** Dwell on one to three Sanskrit words (in Devanagari, quoted, with a brief meaning) and open what they hold. One fitting image or comparison is welcome.
3. **What it asks of the reader.** End with what the verse means in the reader's own life, addressed as आप, ideally with one small, concrete practice.

**Every feeling must earn its place.** No padding, no repeated sentiment, no ornament for its own sake. If a sentence neither moves the reader nor gives them something to carry, cut it. Reading should never feel like time spent for nothing.

## Register and tone

- Dignified, tatsam-leaning Hindi, as in a Gita Press commentary. Never colloquial or conversational.
- Prefer Sanskrit-origin words where a natural one exists, and use no English words or slang idioms:

  | Avoid | Use |
  |---|---|
  | चीज़ | वस्तु, विषय, बात |
  | ज़रूरत, ज़रूरी | आवश्यकता, आवश्यक |
  | कीमत | मूल्य |
  | सही / गलत | उचित / अनुचित, यथार्थ / भ्रान्त |
  | भरोसा | विश्वास |
  | पैदा | उत्पन्न |
  | याद, याद दिलाना | स्मरण, स्मरण कराना |
  | शुरू, शुरुआत | आरम्भ |
  | पूरी तरह, बिल्कुल | पूर्णतः, सर्वथा |
  | लेकिन, बस, हमेशा | परन्तु, केवल, सदा |
  | आदत | अभ्यास, संस्कार, व्यसन |
  | बेचैन, कमज़ोर | अशान्त, दुर्बल |
  | ईमानदार | निष्कपट, सत्यनिष्ठ |

- Honorifics and plural verbs for the divine and revered figures: भगवान श्रीकृष्ण कहते हैं, संजय बताते हैं, ईश्वर विराजमान हैं, व्यास जी.
- Address the reader as **आप** (करें, स्मरण कीजिए), never तुम. When the verse itself has Bhagavan addressing Arjuna as तू/तुम, keep that inside the quoted teaching.
- Describe flawed conduct in the verse's own terms, without insulting words. Never belittle any community, tradition or practice.

## Faithfulness

- Never invent events, quotations, commentator statements or citations. Describe traditional positions in your own words (for example, how Advaita and Vishishtadvaita read a verse differently).
- Never invent sentiment the verse does not support.
- Sensitive verses (violence and duty, varna, gender, death): state plainly what the verse does *not* license, present traditional readings neutrally, and add a note in `reviewNote`.
- The printed translations (Gita Press Hindi and the others) are the editions' own words. Do not rewrite them. Write the व्याख्या *around* them.

## Workflow

1. Draft one chapter into its own file: `data/ai-commentary/staged/<scripture>-<chapter>.json` (for example `bhagavadgita-04.json`). One file per chapter means several tools can work in parallel without touching each other's files.

   ```json
   {
     "4:1": { "explanation": "…", "confidence": "high", "reviewNote": "" },
     "4:2": { "explanation": "…", "confidence": "medium", "reviewNote": "Why a reviewer should look at this verse." }
   }
   ```

2. Check it. This must print `sentences to fix 0`:

   ```bash
   node scripts/check-hindi-register.mjs data/ai-commentary/staged/bhagavadgita-04.json
   ```

3. Stage it into the queue as approved. This fills in each verse's Sanskrit (so a later text repair is caught), flags verses whose hand-written व्याख्या the draft replaces, and never overwrites an existing approved entry unless you pass `--force`:

   ```bash
   node scripts/stage-commentary.mjs data/ai-commentary/staged/bhagavadgita-04.json
   ```

4. Publish locally with `npm run publish:commentary`. Pushing and deploying are handled separately.

The site labels these entries as AI-drafted (on the व्याख्या only).

## Two approved examples

### 2.47 · कर्मण्येवाधिकारस्ते मा फलेषु कदाचन

> कल्पना कीजिए उस क्षण की: कुरुक्षेत्र की धूल में अर्जुन का गाण्डीव हाथ से छूट चुका है, नेत्र भरे हैं, और मन यह सोचकर काँप रहा है कि इस युद्ध का परिणाम क्या होगा: स्वजनों का वध, कुल का नाश, और जीवन भर का पश्चात्ताप। ठीक इसी भय के मूल पर भगवान श्रीकृष्ण अपना सबसे कोमल और सबसे दृढ़ वचन रखते हैं: 'कर्मण्येवाधिकारस्ते', तुम्हारा अधिकार केवल कर्म पर है।
>
> इस 'एव' (ही) शब्द में अद्भुत करुणा छिपी है। भगवान अर्जुन से कुछ छीन नहीं रहे, वे उनके कंधों से एक ऐसा बोझ उतार रहे हैं जिसे कोई मनुष्य कभी उठा ही नहीं सकता था: परिणाम का बोझ। फल अनेक कारणों से बनता है: काल, परिस्थिति, दूसरों के कर्म और प्रारब्ध। उस पर अधिकार जताना ही सारी चिंता की जड़ है।
>
> पर भगवान यहीं नहीं रुकते। वे जानते हैं कि दुखी मन दूसरी दिशा में भी भाग सकता है: 'जब फल पर अधिकार नहीं, तो कर्म ही क्यों करूँ?' इसलिए वे चार पगों में एक पूर्ण संतुलन रचते हैं: कर्म पर अधिकार है; फल पर कभी नहीं; स्वयं को फल का कारण मत मानो; और कर्म न करने में भी आसक्ति मत रखो। यह संतुलन उस माँ के समान है जो अपने बालक का पूरे मन से पालन करती है, पर उसका भविष्य बाँध नहीं सकती; उसका प्रेम परिणाम पर टिका नहीं, इसलिए निर्मल है।
>
> जीवन के किसी कठिन मोड़ पर, जब परिणाम का भय हमें निष्क्रिय कर दे, तब यह वचन स्मरण कराता है: आपका दायित्व केवल इतना है कि आज का कर्म पूरी निष्ठा और प्रेम से करें; शेष उस पर छोड़ दें जिसके हाथ में सारा विधान है।

### 2.22 · वासांसि जीर्णानि यथा विहाय

> यह गीता का सबसे सरल और सबसे हृदयस्पर्शी उदाहरण है, जिसे एक बालक भी समझ ले और एक ज्ञानी भी जीवन भर उस पर चिंतन करे। 'वासांसि जीर्णानि यथा विहाय', जैसे मनुष्य पुराने, जीर्ण वस्त्रों को छोड़कर 'नवानि गृह्णाति', नए वस्त्र धारण कर लेता है, 'तथा शरीराणि विहाय जीर्णानि', वैसे ही देही जीर्ण शरीरों को छोड़कर नए शरीरों में चला जाता है।
>
> इस उदाहरण में कितनी कोमलता है! हम पुराने वस्त्र उतारते समय शोक नहीं करते, क्योंकि जानते हैं कि पहनने वाला वही है। मृत्यु को भगवान ठीक इसी दृष्टि से दिखाते हैं: यह अंत नहीं, एक परिवर्तन है; विनाश नहीं, एक नया आरम्भ।
>
> यह भाव मृत्यु के भय को ही नहीं, बुढ़ापे के भय को भी कोमल कर देता है। जब आप दर्पण में अपने बदलते रूप को देखें, या किसी प्रियजन को विदा करें, तो इस वस्त्र-उदाहरण को स्मरण कीजिए: जो पहनता है, वह कभी पुराना नहीं होता।
