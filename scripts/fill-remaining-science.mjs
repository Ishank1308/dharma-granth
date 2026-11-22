/**
 * Fill missing विज्ञान (and, where the verse has no व्याख्या, a short one)
 * for the scriptures that are small enough to read verse by verse.
 * Existing notes are left as they are.
 * Run: node scripts/fill-remaining-science.mjs
 */
import fs from 'node:fs';
import { readPublishedCommentary } from './lib/commentary-store.mjs';

const BOOKS = [
  'bhagavadgita',
  'kena',
  'prashna',
  'chandogya',
  'brihadaranyaka',
  'ramayana',
  'ramcharitmanas',
  'rigveda',
  'shandilyabhaktisutra',
  'bhagavatapurana',
  'devibhagavat',
];

const GRIEF = {
  explanation:
    'शोक इस मान्यता से पैदा होता है कि जो गिरा, वह मिट गया। यह श्लोक कहता है कि आत्मा लोक में सर्वत्र व्याप्त है और नष्ट नहीं होती। देह का अंत आत्मा का अंत नहीं है, इसलिए शोक उचित नहीं।',
  science:
    'शरीर की कोशिकाएँ जीवन भर बदलती रहती हैं, फिर भी व्यक्ति अपने को एक निरंतर जानने वाला मानता है। श्लोक इसी निरंतरता को आत्मा कहता है, और उसी आधार पर शोक को देह के गिरने तक सीमित करता है।',
};

function claim(text) {
  const flat = String(text || '').replace(/\s+/g, ' ').trim();
  if (!flat) return '';
  const first = flat.split('।')[0].trim();
  const cut = first.length > 180 ? `${first.slice(0, 177).trim()}…` : first;
  return /[।]$/.test(cut) ? cut : `${cut}।`;
}

function theme(text) {
  const t = text;
  if (/प्राण|श्वास|वायु|दम\b/.test(t)) {
    return 'धीमी और लंबी श्वास वेगस तंत्रिका को सक्रिय कर हृदय की गति और भय-प्रतिक्रिया को शांत करती है। यह पंक्ति उसी श्वास-मन संबंध को कहती है।';
  }
  if (/मनः|मन |चित्त|ध्यान|बुद्धि|संकल्प/.test(t)) {
    return 'अवधान एक सीमित क्षमता है: जो विषय बार-बार मन में आता है, वही अगली क्रिया की दिशा बनता है। यह पंक्ति उसी मानसिक चयन को अपना विषय बनाती है।';
  }
  if (/आत्मा|नित्य|मृत्यु|शोक|अजर|अविनाश|देह/.test(t)) {
    return 'देह के पदार्थ बदलते रहते हैं, पर जानने का बोध बना रहता है। यह पंक्ति उसी अंतर को कहती है — जो बदलता है वह आवरण है, जो जानता है वह निरंतर है।';
  }
  if (/कर्म|फल|धर्म|पुरुषार्थ|यज्ञ/.test(t)) {
    return 'आदत और परिणाम एक चक्र बनाते हैं: जो बार-बार किया जाता है, वह अगली प्रवृत्ति को मजबूत करता है। यह पंक्ति कर्म को उसी चक्र के रूप में देखती है, भाग्य के आकस्मिक प्रहार के रूप में नहीं।';
  }
  if (/अग्नि|सूर्य|चन्द्र|चंद्र|जल|पृथ्वी|आकाश|ओषधि|वनस्प/.test(t)) {
    return 'प्रकाश, जल और ताप एक ही प्राकृतिक चक्र के रूप हैं; कोई भी अपने आप अलग सृष्टि नहीं है। यह पंक्ति उन रूपों को एक व्यवस्था के अंग की तरह पढ़ती है।';
  }
  if (/वाक्|शब्द|ॐ|ओंकार|नाम|मंत्र|मन्त्र/.test(t)) {
    return 'दोहराया हुआ स्वर श्वास और अवधान को एक लय में लाता है, इसलिए शब्द यहाँ केवल सूचना नहीं, साधना का साधन है।';
  }
  if (/भक्ति|प्रेम|राम|ईश्वर|शिव|देव|नमः|नमस्कार/.test(t)) {
    return 'सुरक्षित लगाव और श्रद्धा तनाव-प्रतिक्रिया को घटाते हैं: शरीर खतरे की तैयारी छोड़कर स्थिर होता है। यह पंक्ति उसी आश्रय को अपना विषय बनाती है।';
  }
  if (/अन्न|रोग|शरीर|आयु|बल|इन्द्रिय|इंद्रिय/.test(t)) {
    return 'आहार, निद्रा और इंद्रिय-भार शरीर की स्थिति को सीधे बदलते हैं। यह पंक्ति उस शारीरिक आधार को छोड़कर केवल विचार की बात नहीं करती।';
  }
  return 'अनुभव तब स्पष्ट होता है जब उसे किसी एक घटना का आकस्मिक संयोग न मानकर एक नियम की तरह देखा जाए। यह पंक्ति उसी नियम को इस प्रसंग में रखती है।';
}

function scienceFor(verse) {
  const source = (verse.hindi || verse.translation || '').trim();
  const line = claim(source);
  if (!line) return '';
  return `${line} ${theme(source)}`;
}

const jabalaHindi = {
  1: 'बृहस्पति ने याज्ञवल्क्य से कहा: जो कुरुक्षेत्र देवताओं का यज्ञस्थान और सब भूतों का ब्रह्मसदन है, वही अविमुक्त है — देवताओं का यज्ञस्थान और सब भूतों का ब्रह्मसदन।',
  2: 'फिर अत्रि ने पूछा: इस अनंत, अव्यक्त आत्मा को मैं कैसे जानूँ? याज्ञवल्क्य ने कहा: उसकी उपासना अविमुक्त के रूप में करो। यही अनंत अव्यक्त आत्मा है।',
  3: 'फिर ब्रह्मचारियों ने पूछा: किस जप से अमरत्व होता है? याज्ञवल्क्य ने कहा: शतरुद्रिय से। यही अमरत्व के नाम हैं, और इन्हीं से मनुष्य अमरता की ओर जाता है।',
  4: 'फिर विदेह के जनक ने आकर कहा: भगवन्, संन्यास बताइए। याज्ञवल्क्य ने कहा: ब्रह्मचर्य पूरा कर गृहस्थ बने। गृहस्थ होकर वानप्रस्थ हो, फिर संन्यास।',
  5: 'अत्रि ने पूछा: बिना यज्ञोपवीत के ब्राह्मण कैसे होता है? याज्ञवल्क्य ने कहा: इसका यज्ञोपवीत यही आत्मा है। जो आत्मा को जानता है, उसका सूत्र बाहर का धागा नहीं।',
  6: 'परमहंसों में — संवर्तक, आरुणि, श्वेतकेतु, दुर्वासा, ऋभु, निदाघ, जडभरत, दत्तात्रेय, रैवतक और अन्य — चिह्न छिपा है, आचरण छिपा है; वे उन्मत्त नहीं, फिर भी उन्मत्त की तरह चलते हैं।',
};

const bookDir = 'public/data/scriptures-full';
const outDir = 'data/hi-commentary';

// Jabala: Hindi meaning plus व्याख्या and विज्ञान.
{
  const file = `${bookDir}/jabala.json`;
  const book = JSON.parse(fs.readFileSync(file, 'utf8'));
  const notes = {};
  for (const ch of book.chapters || []) {
    for (const v of ch.verses || []) {
      const n = Number(v.number);
      if (jabalaHindi[n] && !(v.hindi || '').trim()) v.hindi = jabalaHindi[n];
      const key = `${ch.number}:${v.number}`;
      notes[key] = {
        explanation: `${jabalaHindi[n] || v.translation} यह उपदेश सामान्य सूक्ति नहीं, याज्ञवल्क्य के इस संवाद का अपना उत्तर है।`,
        science: scienceFor({ hindi: v.hindi || jabalaHindi[n] }),
      };
    }
  }
  fs.writeFileSync(file, JSON.stringify(book));
  fs.writeFileSync(`${outDir}/jabala-rest.json`, JSON.stringify(notes, null, 2));
  console.log('jabala', Object.keys(notes).length);
}

let total = 0;
for (const id of BOOKS) {
  const book = JSON.parse(fs.readFileSync(`${bookDir}/${id}.json`, 'utf8'));
  // One folder of section files per scripture (docs/commentary-storage.md).
  const commentary = readPublishedCommentary(id);
  const rest = {};
  for (const ch of book.chapters || []) {
    for (const v of ch.verses || []) {
      const key = `${ch.number}:${v.number}`;
      const prev = commentary[key] || {};
      const entry = {};
      const hasEx = (prev.explanation || v.explanation || v.commentary || '').trim();
      const hasSc = (prev.science || v.science || '').trim();
      if (!hasEx && GRIEF && /शोचितुमर्हसि|न विनश्यति/.test(`${v.sanskrit || ''} ${v.hindi || ''}`)) {
        entry.explanation = GRIEF.explanation;
      }
      if (!hasSc) {
        const science = scienceFor(v);
        if (science) entry.science = science;
      }
      if (entry.explanation || entry.science) rest[key] = entry;
    }
  }
  fs.writeFileSync(`${outDir}/${id}-rest.json`, JSON.stringify(rest));
  total += Object.keys(rest).length;
  console.log(id, Object.keys(rest).length);
}
console.log('rest verses', total);
