const legacyVerseExplanationsHi: Record<string, string> = {
  'ishavasya:1:1': 'परम सत्य (अनंत ब्रह्म) पूर्ण है। अनंत स्रोत से अनंत जगत प्रकट होने पर भी वह स्रोत घटता नहीं, बल्कि पूर्ण ही बना रहता है।\n\n📚 संस्कृत: पूर्णम् (पूर्ण) = अव्यय, अक्षय\n🔬 आधुनिक उदाहरण: ब्रह्मांड से ऊर्जा निकलती है, फिर भी कुल ऊर्जा स्थिर रहती है (थर्मोडायनामिक्स का नियम)\n\n✓ मुख्य बातें:\n  • ब्रह्म असीम है; घटना-बढ़ना इसके गुण नहीं\n  • सृष्टि का निर्माण ब्रह्म का ह्रास नहीं है\n  • अनंत से अनंत निकला, फिर भी अनंत बचा',
  'ishavasya:1:2': 'सब कुछ ईश्वर से व्याप्त है। इसलिए संसार में रहते हुए भी यह समझकर जियो कि वास्तव में कुछ भी हमारा निजी स्वामित्व नहीं है।\n\n📚 संस्कृत: वासना (ईश्वरीय उपस्थिति) = सभी में प्रवेश करना\n💡 मनोविज्ञान दृष्टि: आसक्ति ही दुःख का मूल है। अपेक्षा रहित जीवन मानसिक शांति लाता है।\n\n✓ मुख्य बातें:\n  • सब कुछ परमेश्वर के स्वामित्व में है\n  • हम केवल कर्मकार हैं, मालिक नहीं\n  • त्याग (विषय से मुक्ति) से ही भोग (शांति) मिलता है',
  'ishavasya:1:5': 'आत्मा का स्वरूप विरोधाभासी दिखता है: वह अचल है, फिर भी मन से तेज है। सभी गति उसी आधार में घटित होती है।',
  'ishavasya:1:6': 'आत्मा सबके भीतर भी है और सबके पार भी। वह निकट भी है, दूर भी; यही उसका अंतर्यामी और अतीत दोनों रूप है।',
  'ishavasya:1:10': 'समझ के बिना कर्मकांड अज्ञान है, पर केवल बौद्धिक ज्ञान भी अभ्यास के बिना अधूरा है। सच्चा ज्ञान दोनों को संतुलित करता है।',
  'ishavasya:1:12': 'नैतिक जीवन और उपासना से मनुष्य मृत्यु के भय को पार करता है। आत्मज्ञान से वह अमृतत्व, अर्थात मुक्ति, की ओर बढ़ता है।',
  'ishavasya:1:16': 'साधक सूर्य को परम सत्य का प्रतीक मानकर संबोधित करता है। "सोऽहम्" का भाव बताता है कि व्यक्तिगत आत्मा और परमात्मा अंततः एक हैं।',
  'ishavasya:1:17': 'यह मृत्यु के समय की प्रार्थना है। प्राण विराट प्राण में मिलते हैं, शरीर राख में लौटता है, और साधक मन से अपने आध्यात्मिक संस्कार याद रखने की प्रार्थना करता है।',

  'bhagavadgita:1:1': 'धृतराष्ट्र का "मेरे पुत्र" कहना कौरवों के प्रति उसकी आसक्ति दिखाता है। उसका अंधापन केवल शारीरिक नहीं, नैतिक भी है; वह अधर्म से होने वाले विनाश को नहीं देख पाता।',
  'bhagavadgita:1:20': 'अर्जुन को "कपिध्वज" कहा गया है, क्योंकि उसके ध्वज पर हनुमान हैं। यह दिव्य संरक्षण का संकेत है; धनुष उठाना उसकी प्रारंभिक तत्परता दिखाता है।',
  'bhagavadgita:1:28': 'अर्जुन के कांपते अंग और सूखा मुख गहरे मानसिक तनाव के संकेत हैं। वह योद्धाओं को शत्रु नहीं, "अपने लोग" मान रहा है।',
  'bhagavadgita:1:31': 'अर्जुन को अशुभ संकेत इसलिए दिखते हैं क्योंकि उसकी दृष्टि आसक्ति से ढकी हुई है। जो उसका धर्म है, वही उसे शारीरिक संबंधों के कारण अशुभ लगता है।',
  'bhagavadgita:1:46': 'अर्जुन विषाद (योग से पहले) की चरम सीमा पर है। वह अपने सैनिक साथियों को भूलकर, अपने हितैषियों को याद कर रहा है।',
  'bhagavadgita:1:47': 'अर्जुन अपने क्षत्रिय धर्म के साधन, धनुष-बाण, छोड़ देता है। उसका बैठ जाना पराजय का संकेत है और यहीं से कृष्ण की शिक्षा आरंभ होती है।',

  'bhagavadgita:2:11': 'कृष्ण अर्जुन का विरोधाभास सामने रखते हैं: वह ज्ञानी जैसी बातें करता है, पर अज्ञान की तरह शोक करता है। ज्ञानी जानते हैं कि आत्मा नित्य है और कभी मरती नहीं।',
  'bhagavadgita:2:13': 'आत्मा (जीवात्मा) शरीर की निवासी है। जैसे जीवन में बाल्य, यौवन और वृद्धावस्था आती है, वैसे ही शरीर बदलना भी एक स्वाभाविक परिवर्तन है।\n\n📚 संस्कृत: देहिन् (आत्मा) = शरीर में निवास करने वाला\n🔬 जीव विज्ञान: हमारी कोशिकाएं 7-10 साल में पूरी तरह बदल जाती हैं; फिर भी हमारी पहचान एक रहती है।\n\n✓ मुख्य बातें:\n  • शरीर परिवर्तनशील है, आत्मा स्थायी है\n  • जन्म-मृत्यु केवल शरीर के साथ होते हैं\n  • यह समझ मृत्यु का भय दूर करती है',
  'bhagavadgita:2:20': 'यह गीता का अत्यंत प्रसिद्ध श्लोक है। आत्मा अजन्मा (अज:), नित्य (कभी न नष्ट होने वाला), शाश्वत (सदा रहने वाला) और पुरातन (अति प्राचीन) है; मृत्यु केवल शरीर की होती है।\n\n📚 संस्कृत: अज: = जन्म रहित, नित्य: = शाश्वत, पुराण: = आदिकालीन\n🔬 भौतिकी: ऊर्जा न तो बनती है न मिटती, केवल रूप बदलती है — आत्मा भी यही सिद्धांत अनुसरण करती है।\n\n✓ मुख्य बातें:\n  • आत्मा कभी जन्मती-मरती नहीं\n  • शरीर के विनाश से आत्मा नहीं मरती\n  • यह ज्ञान शोक और भय को समाप्त करता है',
  'bhagavadgita:2:47': 'कृष्ण निष्काम कर्म (आसक्ति रहित कर्म) सिखाते हैं। मनुष्य का अधिकार कर्म पर है, फल (परिणाम) पर नहीं। फल की आसक्ति बंधन बनती है।\n\n📚 संस्कृत: निष्काम = इच्छा रहित, फल = कर्म का परिणाम\n🔬 मनोविज्ञान: फलाकांक्षा से चिंता, तनाव और असंतुष्टि जन्मती है। आंतरिक प्रेरणा से कार्य करना अधिक प्रभावी है।\n\n✓ मुख्य बातें:\n  • कर्तव्य करना अनिवार्य है, लेकिन फल की चिंता नहीं\n  • प्रक्रिया पर ध्यान दें, परिणाम पर नहीं\n  • यह मानसिक शांति और कार्यक्षमता दोनों देता है',

  'bhagavadgita:3:19': 'आसक्ति रहित कर्म मन को शुद्ध करता है। कर्म छोड़ना समाधान नहीं; कर्तव्य करते हुए फल से मुक्त रहना योग का मार्ग है।',
  'bhagavadgita:3:21': 'श्रेष्ठ व्यक्ति का आचरण समाज के लिए प्रमाण बनता है। अर्जुन जैसे राजकुमार का धर्म है कि वह कर्म से लोक के लिए सही उदाहरण रखे।',

  'bhagavadgita:4:7': 'कृष्ण आश्वासन देते हैं कि जब धर्म कमजोर होता है, तब दिव्य शक्ति प्रकट होती है। यही अवतारवाद की मूल भावना है।',
  'bhagavadgita:4:8': 'अवतार का उद्देश्य व्यक्तिगत नहीं, ब्रह्मांडीय है: सज्जनों की रक्षा, दुष्टता का विनाश और धर्म का पुनर्स्थापन।',

  'bhagavadgita:6:5': 'मन मनुष्य का सबसे बड़ा मित्र भी हो सकता है और सबसे बड़ा शत्रु भी। योग (आत्म-संयम) का सार मन की दिशा बदलना है।\n\n📚 संस्कृत: मन: (मन) = विचार और इच्छाओं का स्रोत, योग: (जुड़ना) = आत्मा से मन को जोड़ना\n🧠 न्यूरोसाइंस: मन की प्लास्टिसिटी से हम अपने विचार पैटर्न को पुनः प्रोग्राम कर सकते हैं।\n\n✓ मुख्य बातें:\n  • नियंत्रित मन सफलता का साधन है\n  • अनियंत्रित मन बर्बादी का कारण है\n  • ध्यान और आत्म-जागरूकता से मन को वश में करा जा सकता है',
  'bhagavadgita:6:6': 'जिसने मन को जीत लिया, उसके लिए मन सहयोगी बन जाता है। अनियंत्रित मन बाहरी सफलता के बावजूद मनुष्य को आंतरिक बंधन में रखता है।\n\n📚 संस्कृत: बन्धु: (मित्र) = सहायक, शत्रु: (शत्रु) = विरोधी\n💡 व्यावहारिक उदाहरण: अमीर लोग भी अनियंत्रित मन से दुःखी रहते हैं। एक संयमी व्यक्ति सीमित संसाधनों में भी शांत रहता है।\n\n✓ मुख्य बातें:\n  • आंतरिक विजय ही वास्तविक विजय है\n  • मानसिक अनुशासन से आंतरिक स्वतंत्रता आती है\n  • यह शांति और सुख का असली स्रोत है',

  'bhagavadgita:7:7': 'कृष्ण स्वयं को परम आधार बताते हैं। जैसे मोती धागे पर टिके रहते हैं, वैसे ही पूरा जगत ईश्वर पर आधारित है।',
  'bhagavadgita:7:8': 'ईश्वर दूर नहीं है; वह हर अनुभव के सार में उपस्थित है। जल का रस, प्रकाश, ओंकार (ॐ = सृष्टि का मूल नाद) और शक्ति में दिव्यता को पहचानना ज्ञान का मार्ग है।\n\n📚 संस्कृत: रस: (स्वाद) = सार, प्रभा: (प्रकाश) = चेतना, ओंकार: (परम ध्वनि) = ब्रह्म का प्रतीक\n🔬 आधुनिक दृष्टि: जल सभी जीवन का आधार है, प्रकाश से हम देखते हैं, कंपन (नाद) सर्वत्र है — यह प्रकृति की आध्यात्मिकता को दर्शाता है।\n\n✓ मुख्य बातें:\n  • दिव्यता हर जगह मौजूद है\n  • प्रकृति में ईश्वर की उपस्थिति को समझना आवश्यक है\n  • यह अनुभव ज्ञान की परिपक्वता है',

  'bhagavadgita:8:5': 'अंतिम समय का स्मरण जीवन भर की साधना से बनता है। जो जीवन में ईश्वर को याद करता है, मृत्यु के क्षण में भी वही स्मरण बना रहता है।',
  'bhagavadgita:8:7': 'भक्ति और कर्तव्य विरोधी नहीं हैं। कृष्ण कहते हैं कि मन-बुद्धि ईश्वर को अर्पित करके अपने सांसारिक धर्म का पालन करो।',

  'bhagavadgita:9:22': 'कृष्ण कहते हैं कि अनन्य भक्तों की आवश्यकता और सुरक्षा का भार वे स्वयं उठाते हैं। "योग" कमी को पूरा करना है और "क्षेम" प्राप्त वस्तु की रक्षा है।',
  'bhagavadgita:12:3': 'निर्गुण, अव्यक्त ब्रह्म की उपासना भी मुक्ति की ओर ले जाती है, पर देहधारी मनुष्यों के लिए सगुण भक्ति अधिक सहज मार्ग है।',

  'bhagavadgita:10:20': 'कृष्ण सभी प्राणियों के हृदय में स्थित आत्मा हैं। वे सृष्टि की शुरुआत, मध्य और अंत, सबके आधार हैं।',
  'bhagavadgita:11:12': 'अर्जुन कृष्ण का विश्वरूप देखता है, जो अनंत, भयावह और महिमामय है। हजार सूर्यों की उपमा उसकी असहनीय दिव्य चमक को व्यक्त करती है।',

  'bhagavadgita:12:18': 'सच्चा भक्त सुख-दुख (द्वंद्व = द्वैत भाव), मान-अपमान, मित्र-शत्रु में समभाव (समत्व) रखता है।\n\n📚 संस्कृत: समता (समभाव) = सभी परिस्थितियों में समान भाव, द्वंद्व = विरोधी भावनाएं\n🧠 आधुनिक मनोविज्ञान: भावनात्मक संतुलन (Emotional Equilibrium) से आंतरिक शांति मिलती है।\n\n✓ मुख्य बातें:\n  • जीवन के सभी अनुभवों में समान रहना आवश्यक है\n  • सुख के समय घमंड और दुःख में निराशा न करें\n  • यह परिपक्वता का सबसे बड़ा संकेत है',
  'bhagavadgita:12:15': 'आदर्श भक्त न संसार को व्याकुल करता है, न संसार से व्याकुल होता है। हर्ष, ईर्ष्या, भय और चिंता से मुक्त होना परिपक्व भक्ति का लक्षण है।',

  'bhagavadgita:18:66': 'यह गीता का चरम संदेश है। कृष्ण पूर्ण शरणागति (समर्पण) मांगते हैं और आश्वासन देते हैं कि जो केवल उन्हीं की शरण लेता है, उसे वे सभी पापों से मुक्त करते हैं।\n\n📚 संस्कृत: शरणागति (शरण + आगति) = आश्रय की ओर जाना, पाप: = परिणाम, भय: = अनिश्चितता\n💡 मनोविज्ञानिक दृष्टि: पूर्ण समर्पण से चिंता, भय और अपराध-बोध दूर हो जाते हैं।\n\n✓ मुख्य बातें:\n  • असीम शक्ति को पूर्ण रूप से समर्पित हो जाएं\n  • सभी भय और पापबोध स्वतः विलीन हो जाते हैं\n  • यह गीता का सर्वोच्च संदेश है',
  'bhagavadgita:18:78': 'गीता का अंतिम श्लोक बताता है कि जहां कृष्ण और अर्जुन धर्मभाव से एक हैं, वहां विजय, समृद्धि और मंगल निश्चित है।',
};

/** Hand-authored seed keys — always safe to bundle for mobile. */
export const legacyCuratedKeys = new Set(Object.keys(legacyVerseExplanationsHi));

export const verseExplanationsHi: Record<string, string> = { ...legacyVerseExplanationsHi };

import type { HiCommentaryFragment } from './hi-commentary/_types';
import { isBoilerplateField } from './hi-commentary/quality';
import { aitareyaHi } from './hi-commentary/aitareya';
import { atharvavedaHi } from './hi-commentary/atharvaveda';
import { agnipuranHi } from './hi-commentary/agnipuran';
import { bhagavadgitaHi } from './hi-commentary/bhagavadgita';
import { bhagavatapuranaHi } from './hi-commentary/bhagavatapurana';
import { brahmandpuranHi } from './hi-commentary/brahmandpuran';
import { brahmasutraHi } from './hi-commentary/brahmasutra';
import { brihadaranyakaHi } from './hi-commentary/brihadaranyaka';
import { chandogyaHi } from './hi-commentary/chandogya';
import { devibhagavatHi } from './hi-commentary/devibhagavat';
import { durgasaptashatiHi } from './hi-commentary/durgasaptashati';
import { garudpuranaHi } from './hi-commentary/garudpurana';
import { ishavasyaHi } from './hi-commentary/ishavasya';
import { kathaHi } from './hi-commentary/katha';
import { kenaHi } from './hi-commentary/kena';
import { mahabharataHi } from './hi-commentary/mahabharata';
import { mandukyaHi } from './hi-commentary/mandukya';
import { manusmritiHi } from './hi-commentary/manusmriti';
import { markandeypuranHi } from './hi-commentary/markandeypuran';
import { mundakaHi } from './hi-commentary/mundaka';
import { padmapuranHi } from './hi-commentary/padmapuran';
import { prashnaHi } from './hi-commentary/prashna';
import { ramayanaHi } from './hi-commentary/ramayana';
import { ramcharitmanasHi } from './hi-commentary/ramcharitmanas';
import { rigvedaHi } from './hi-commentary/rigveda';
import { samavedaHi } from './hi-commentary/samaveda';
import { shivpuranaHi } from './hi-commentary/shivpurana';
import { shvetashvataraHi } from './hi-commentary/shvetashvatara';
import { taittiriyaHi } from './hi-commentary/taittiriya';
import { vishnupuranaHi } from './hi-commentary/vishnupurana';
import { vivekchudamaniHi } from './hi-commentary/vivekchudamani';
import { yajurvedaHi } from './hi-commentary/yajurveda';
import { yogavasishthaHi } from './hi-commentary/yogavasishtha';
import { amritabinduHi } from './hi-commentary/amritabindu';
import { brahmapuranHi } from './hi-commentary/brahmapuran';
import { brahmavaivartapuranHi } from './hi-commentary/brahmavaivartapuran';
import { harivanshpuranHi } from './hi-commentary/harivanshpuran';
import { jabalaHi } from './hi-commentary/jabala';
import { kaivalyaHi } from './hi-commentary/kaivalya';
import { kalkipuranHi } from './hi-commentary/kalkipuran';
import { kaushitakiHi } from './hi-commentary/kaushitaki';
import { kurmapuranHi } from './hi-commentary/kurmapuran';
import { lingapuranHi } from './hi-commentary/lingapuran';
import { mahanarayanaHi } from './hi-commentary/mahanarayana';
import { maitriHi } from './hi-commentary/maitri';
import { matsyapuranHi } from './hi-commentary/matsyapuran';
import { muktikaHi } from './hi-commentary/muktika';
import { naradabhaktisutraHi } from './hi-commentary/naradabhaktisutra';
import { naradapuranHi } from './hi-commentary/naradapuran';
import { narasimhapuranHi } from './hi-commentary/narasimhapuran';
import { niralambaHi } from './hi-commentary/niralamba';
import { nityakarmakriyaHi } from './hi-commentary/nityakarmakriya';
import { ravanasamhitaHi } from './hi-commentary/ravanasamhita';
import { shandilyabhaktisutraHi } from './hi-commentary/shandilyabhaktisutra';
import { shivasamhitaHi } from './hi-commentary/shivasamhita';
import { skandapuranHi } from './hi-commentary/skandapuran';
import { tejobinduHi } from './hi-commentary/tejobindu';
import { vamanpuranHi } from './hi-commentary/vamanpuran';
import { varahapuranHi } from './hi-commentary/varahapuran';
import { vayupuranHi } from './hi-commentary/vayupuran';
import { viduranitiHi } from './hi-commentary/viduraniti';
import { vinayapatrikaHi } from './hi-commentary/vinayapatrika';
import { yogarasayanamHi } from './hi-commentary/yogarasayanam';
import { yogavasisthaHi } from './hi-commentary/yogavasistha';

const fragments: Record<string, HiCommentaryFragment> = {
  aitareya: aitareyaHi,
  atharvaveda: atharvavedaHi,
  agnipuran: agnipuranHi,
  bhagavadgita: bhagavadgitaHi,
  bhagavatapurana: bhagavatapuranaHi,
  brahmandpuran: brahmandpuranHi,
  brahmasutra: brahmasutraHi,
  brihadaranyaka: brihadaranyakaHi,
  chandogya: chandogyaHi,
  devibhagavat: devibhagavatHi,
  durgasaptashati: durgasaptashatiHi,
  garudpurana: garudpuranaHi,
  ishavasya: ishavasyaHi,
  katha: kathaHi,
  kena: kenaHi,
  mahabharata: mahabharataHi,
  mandukya: mandukyaHi,
  manusmriti: manusmritiHi,
  markandeypuran: markandeypuranHi,
  mundaka: mundakaHi,
  padmapuran: padmapuranHi,
  prashna: prashnaHi,
  ramayana: ramayanaHi,
  ramcharitmanas: ramcharitmanasHi,
  rigveda: rigvedaHi,
  samaveda: samavedaHi,
  shivpurana: shivpuranaHi,
  shvetashvatara: shvetashvataraHi,
  taittiriya: taittiriyaHi,
  vishnupurana: vishnupuranaHi,
  vivekchudamani: vivekchudamaniHi,
  yajurveda: yajurvedaHi,
  yogavasishtha: yogavasishthaHi,
  amritabindu: amritabinduHi,
  brahmapuran: brahmapuranHi,
  brahmavaivartapuran: brahmavaivartapuranHi,
  harivanshpuran: harivanshpuranHi,
  jabala: jabalaHi,
  kaivalya: kaivalyaHi,
  kalkipuran: kalkipuranHi,
  kaushitaki: kaushitakiHi,
  kurmapuran: kurmapuranHi,
  lingapuran: lingapuranHi,
  mahanarayana: mahanarayanaHi,
  maitri: maitriHi,
  matsyapuran: matsyapuranHi,
  muktika: muktikaHi,
  naradabhaktisutra: naradabhaktisutraHi,
  naradapuran: naradapuranHi,
  narasimhapuran: narasimhapuranHi,
  niralamba: niralambaHi,
  nityakarmakriya: nityakarmakriyaHi,
  ravanasamhita: ravanasamhitaHi,
  shandilyabhaktisutra: shandilyabhaktisutraHi,
  shivasamhita: shivasamhitaHi,
  skandapuran: skandapuranHi,
  tejobindu: tejobinduHi,
  vamanpuran: vamanpuranHi,
  varahapuran: varahapuranHi,
  vayupuran: vayupuranHi,
  viduraniti: viduranitiHi,
  vinayapatrika: vinayapatrikaHi,
  yogarasayanam: yogarasayanamHi,
  yogavasistha: yogavasisthaHi,
};

export const verseScienceHi: Record<string, string> = {};
export const verseLifeLessonHi: Record<string, string> = {};

for (const [scriptureId, fragment] of Object.entries(fragments)) {
  for (const [chapterVerse, entry] of Object.entries(fragment)) {
    const k = `${scriptureId}:${chapterVerse}`;
    // Fragment explanations take precedence over the legacy seed
    // entries above so we get a single source of truth per verse.
    if (entry.explanation) verseExplanationsHi[k] = entry.explanation;
    if (entry.science && !isBoilerplateField(entry.science)) verseScienceHi[k] = entry.science;
    if (entry.lifeLesson && !isBoilerplateField(entry.lifeLesson)) verseLifeLessonHi[k] = entry.lifeLesson;
  }
}

function key(scriptureId: string, chapterId: number, verseId: number | string): string {
  return `${scriptureId}:${chapterId}:${verseId}`;
}

export function getVerseExplanationHi(scriptureId: string, chapterId: number, verseId: number | string): string | undefined {
  return verseExplanationsHi[key(scriptureId, chapterId, verseId)];
}

export function getVerseScienceHi(scriptureId: string, chapterId: number, verseId: number | string): string | undefined {
  return verseScienceHi[key(scriptureId, chapterId, verseId)];
}

export function getVerseLifeLessonHi(scriptureId: string, chapterId: number, verseId: number | string): string | undefined {
  return verseLifeLessonHi[key(scriptureId, chapterId, verseId)];
}
