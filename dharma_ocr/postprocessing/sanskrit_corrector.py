"""
Sanskrit Post-Processing and Philological OCR Correction Module.
Corrects Devanagari ligatures, Vedic words, conjunct consonants, diacritic marks, and avagrahas.
"""

import re
from typing import Dict, List, Tuple, Set
from dharma_ocr.postprocessing.devanagari_utils import (
    canonicalize_devanagari,
    decode_pua_ligatures,
    normalize_matras_and_reph,
    normalize_dandas_and_punctuation
)
from dharma_ocr.dictionaries.sanskrit_lexicon import (
    SANSKRIT_CANONICAL_TERMS,
    SANSKRIT_LIGATURE_REPLACEMENTS
)
from dharma_ocr.core.logger import get_logger

logger = get_logger()


class SanskritCorrector:
    """
    Philological Sanskrit OCR corrector.
    Resolves OCR ambiguity in Devanagari ligatures, Vedic accents, avagrahas, and classical lexemes.
    """

    def __init__(self, config: dict):
        self.config = config
        self.lexicon: Set[str] = SANSKRIT_CANONICAL_TERMS
        self.replacements: Dict[str, str] = SANSKRIT_LIGATURE_REPLACEMENTS

    def correct(self, text: str) -> Tuple[str, List[str]]:
        """
        Executes full philological Sanskrit normalization.
        Returns: (corrected_text, warnings)
        """
        warnings: List[str] = []
        if not text:
            return "", warnings

        # Step 1: Base canonicalization (NFC, PUA, Matras, Dandas)
        res = canonicalize_devanagari(text)

        # Step 2: Avagraha Restoration (S, 5, or $ inside Devanagari context -> ऽ)
        # e.g., "प्रथमोSध्यायः" -> "प्रथमोऽध्यायः", "सोSहम्" -> "सोऽहम्"
        res = re.sub(r'([ऀ-ॿ])[sS5$]([ऀ-ॿ])', r'\1ऽ\2', res)

        # Step 3: Vedic Swara & Anusvara Standardization
        # Standardize Udatta (U+0951) and Anudatta (U+0952)
        res = res.replace('\u0300', '\u0952')  # Combining grave accent to Devanagari Anudatta
        res = res.replace('\u0301', '\u0951')  # Combining acute accent to Devanagari Udatta

        # Step 4: Frequent Sanskrit Conjunct Ligature Repairs
        # Repair broken conjunct consonants (e.g. क् त -> क्त, त् य -> त्य)
        res = re.sub(r'([क-ह]्)\s+([क-ह])', r'\1\2', res)

        # Repair isolated halants (virama at the end of standalone vowels or numbers)
        res = re.sub(r'([अ-औ०-९])्', r'\1', res)

        # Step 5: Lexical Dictionary Replacements
        words = res.split()
        corrected_words = []
        for w in words:
            # Strip trailing punctuation for dictionary match
            match = re.match(r'^([^\s।॥,]+)([।॥,]?)$', w)
            if match:
                base, punct = match.group(1), match.group(2)
                if base in self.replacements:
                    corrected_words.append(self.replacements[base] + punct)
                    continue
            corrected_words.append(w)

        res = " ".join(corrected_words)

        # Re-clean punctuation spacing
        res = normalize_dandas_and_punctuation(res)

        return res, warnings
