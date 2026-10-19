"""
Step 6, Step 7, & Step 12: Sanskrit & Hindi Linguistic Validator and Contextual Scripture Restorer.
Validates vocabulary against classical scripture corpora (Gita, Mahabharata, Ramayana, Puranas, Vedas).
Applies contextual reconstruction for chipped/truncated Sanskrit phrases.
"""

import re
from typing import Tuple, List, Dict, Set
from dharma_ocr.dictionaries.sanskrit_lexicon import SANSKRIT_CANONICAL_TERMS, SANSKRIT_LIGATURE_REPLACEMENTS
from dharma_ocr.dictionaries.hindi_lexicon import HINDI_RELIGIOUS_VOCABULARY, HINDI_OCR_REPLACEMENTS


# High-frequency classical Sanskrit canonical scripture phrases for contextual reconstruction (Step 12)
CANONICAL_SCRIPTURE_PHRASES: Dict[str, str] = {
    # Ramayana & Valmiki
    "रामो विग्रहवान् ध": "रामो विग्रहवान् धर्मः",
    "रामो विग्रहवान् धर्म": "रामो विग्रहवान् धर्मः",
    # Bhagavad Gita
    "यदा यदा हि धम": "यदा यदा हि धर्मस्य",
    "ग्लानिर्भवति भार": "ग्लानिर्भवति भारत",
    "परित्राणाय साधू": "परित्राणाय साधूनां",
    "विनाशाय च दुष्कृ": "विनाशाय च दुष्कृताम्",
    "धर्मसंस्थापनार्थाय सम्भ": "धर्मसंस्थापनार्थाय सम्भवामि युगे युगे",
    "कर्मण्येवाधिकारस्ते मा फले": "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन",
    "मा कर्मफलहेतुर्भूर्मा": "मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि",
    # Mahabharata & Puranas
    "यतो धर्मस्ततो ज": "यतो धर्मस्ततो जयः",
    "नारायणं नमस्कृत्य नरं चैव नरो": "नारायणं नमस्कृत्य नरं चैव नरोत्तमम्",
    "सरस्वतीं व्यासं ततो जयमुदी": "देवीं सरस्वतीं व्यासं ततो जयमुदीरयेत्",
    # Garuda Purana
    "पुराणं गारडं व": "पुराणं गारडं वक्ष्ये सारं विष्णुकथाश्रयम्",
    "कदाचित् सुखमासीनं वैकुण्ठं श्रीहरिं गु": "कदाचित् सुखमासीनं वैकुण्ठं श्रीहरिं गुरुम्",
    "विनयावनतो भूत्वा पप्रच्छ विनता": "विनयावनतो भूत्वा पप्रच्छ विनतासुतः",
    "स एव भगवान् नारायणः प्र": "स एव भगवान् नारायणः प्रभुः",
    "विष्णवे नम": "विष्णवे नमः",
    "शिवाय नम": "शिवाय नमः",
    "नमो भगवते वासुदे": "नमो भगवते वासुदेवाय",
    "शान्तिः शान्तिः शा": "शान्तिः शान्तिः शान्तिः",
    "त्वमेव माता च पिता त्व": "त्वमेव माता च पिता त्वमेव",
    "त्वमेव बन्धुश्च सखा त्व": "त्वमेव बन्धुश्च सखा त्वमेव",
    "त्वमेव विद्या द्रविणं त्व": "त्वमेव विद्या द्रविणं त्वमेव",
    "त्वमेव सर्वं मम देव": "त्वमेव सर्वं मम देव देव"
}

# Frequent Sanskrit OCR corruption patterns
SANSKRIT_OCR_CORRUPTIONS: Dict[str, str] = {
    "कृष्न": "कृष्ण",
    "कृष्ना": "कृष्णा",
    "विष्नु": "विष्णु",
    "विष्नुः": "विष्णुः",
    "सर्वज्ञ": "सर्वज्ञः",
    "अधयाय": "अध्याय",
    "अध्‍याय": "अध्याय",
    "प्रथमोऽधयायः": "प्रथमोऽध्यायः",
    "दितीयोऽध्यायः": "द्वितीयोऽध्यायः",
    "भगवत": "भगवद्",
    "महाभारतः": "महाभारतम्",
    "रामायन": "रामायण",
    "रामायनम्": "रामायणम्",
    "नारायन": "नारायण",
    "नारायनः": "नारायणः",
    "ईश्वर": "ईश्वरः",
    "परमात्मन": "परमात्मने",
    "पुर्न": "पुनः",
    "प्रन": "प्राण",
    "ब्रह्मन्": "ब्रह्मन्",
    "व्यास": "व्यासः",
    "सूत": "सूतः",
    "गरुड": "गरुडः",
}

# Frequent Hindi OCR corruption patterns
HINDI_OCR_CORRUPTIONS: Dict[str, str] = {
    "महीभारत": "महाभारत",
    "महाभारंत": "महाभारत",
    "कष्ण": "कृष्ण",
    "विषणु": "विष्णु",
    "शीव": "शिव",
    "नारायन": "नारायण",
    "धम": "धर्म",
    "अधयाय": "अध्याय",
    "अध्याए": "अध्याय",
    "व्यख्या": "व्याख्या",
    "पदछेद": "पदच्छेद",
    "शबदार्थ": "शब्दार्थ",
    "भावार्थः": "भावार्थ",
    "अनुवादः": "अनुवाद",
    "कया": "किया",
    "होताहै": "होता है",
    "कहागया": "कहा गया",
    "जाताहै": "जाता है",
}


class LinguisticRestorer:
    """
    Validates Sanskrit and Hindi texts against canonical scripture lexicons.
    Repairs orthographic and OCR recognition corruption.
    Restores chipped or truncated phrases via canonical contextual matching.
    """

    def __init__(self):
        self.sanskrit_terms = SANSKRIT_CANONICAL_TERMS
        self.hindi_terms = HINDI_RELIGIOUS_VOCABULARY

    def validate_and_repair_sanskrit(self, text: str) -> Tuple[str, List[str]]:
        """
        Step 6: Sanskrit Validation.
        Validates words and repairs OCR character / grammar corruption.
        Returns: (repaired_text, list_of_corrections_applied)
        """
        corrections: List[str] = []
        result = text

        # 1. Direct ligature and frequent corruption replacements
        for err, fix in SANSKRIT_OCR_CORRUPTIONS.items():
            pattern = r'\b' + re.escape(err) + r'\b'
            if re.search(pattern, result):
                result = re.sub(pattern, fix, result)
                corrections.append(f"Sanskrit: '{err}' → '{fix}'")

        # 2. General Sanskrit ligature repairs from lexicon
        for err, fix in SANSKRIT_LIGATURE_REPLACEMENTS.items():
            pattern = r'\b' + re.escape(err) + r'\b'
            if re.search(pattern, result):
                result = re.sub(pattern, fix, result)
                corrections.append(f"Sanskrit ligature: '{err}' → '{fix}'")

        # 3. Restore visarga from colon (e.g. राम: -> रामः)
        colon_visarga = re.sub(r'([क-ह])\s*:', r'\1ः', result)
        if colon_visarga != result:
            corrections.append("Restored visarga (ः) from ASCII colon (:)")
            result = colon_visarga

        # 4. Step 12: Contextual Scripture Restoration for truncated classical phrases
        result, phrase_corrections = self.contextual_restoration(result)
        corrections.extend(phrase_corrections)

        return result, corrections

    def validate_and_repair_hindi(self, text: str) -> Tuple[str, List[str]]:
        """
        Step 7: Hindi Validation.
        Detects and fixes common Hindi OCR mistakes in religious commentary.
        Returns: (repaired_text, list_of_corrections_applied)
        """
        if not text:
            return "", []

        corrections: List[str] = []
        result = text

        # 1. Hindi OCR corruption dictionary
        for err, fix in HINDI_OCR_CORRUPTIONS.items():
            pattern = r'\b' + re.escape(err) + r'\b'
            if re.search(pattern, result):
                result = re.sub(pattern, fix, result)
                corrections.append(f"Hindi: '{err}' → '{fix}'")

        # 2. Hindi domain replacements
        for err, fix in HINDI_OCR_REPLACEMENTS.items():
            pattern = r'\b' + re.escape(err) + r'\b'
            if re.search(pattern, result):
                result = re.sub(pattern, fix, result)
                corrections.append(f"Hindi vocabulary: '{err}' → '{fix}'")

        return result, corrections

    def contextual_restoration(self, text: str) -> Tuple[str, List[str]]:
        """
        Step 12: Scripture Restoration.
        Applies contextual reconstruction where an OCR line ends prematurely or is chipped.
        """
        corrections: List[str] = []
        result = text

        for fragment, canonical in CANONICAL_SCRIPTURE_PHRASES.items():
            if fragment in result and canonical not in result:
                result = result.replace(fragment, canonical)
                corrections.append(f"Contextual Restoration: '{fragment}...' → '{canonical}'")

        return result, corrections
