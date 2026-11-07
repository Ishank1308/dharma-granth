"""
Hindi Correction Layer using IndicNLP, SymSpell, and Religious Domain Dictionaries.
Corrects high-frequency religious terms (महाभारत, कृष्ण, विष्णु, शिव, नारायण, धर्म, अध्याय).
"""

import re
from typing import Dict, List, Tuple, Set, Optional
from dharma_ocr.dictionaries.hindi_lexicon import (
    HINDI_RELIGIOUS_VOCABULARY,
    HINDI_OCR_REPLACEMENTS
)
from dharma_ocr.core.logger import get_logger

logger = get_logger()


class HindiCorrector:
    """
    Hindi OCR post-processing layer.
    Combines IndicNLP phonetic normalization, SymSpell candidate generation,
    and domain-specific dictionary corrections for scripture commentaries.
    """

    def __init__(self, config: dict):
        self.config = config
        self.lexicon: Set[str] = HINDI_RELIGIOUS_VOCABULARY
        self.replacements: Dict[str, str] = HINDI_OCR_REPLACEMENTS

        self._normalizer = None
        self._symspell = None
        self._init_indic_nlp()
        self._init_symspell()

    def _init_indic_nlp(self):
        """Initializes IndicNLP Devanagari normalizer if installed."""
        try:
            from indicnlp.normalize.indic_normalize import DevanagariNormalizer
            self._normalizer = DevanagariNormalizer()
        except ImportError:
            logger.debug("IndicNLP not installed; proceeding with native rule-based normalizer.")

    def _init_symspell(self):
        """Initializes SymSpell Devanagari spell checker if installed."""
        try:
            from symspellpy import SymSpell
            self._symspell = SymSpell(max_dictionary_edit_distance=2, prefix_length=7)
            # Seed SymSpell with high-frequency scripture terms
            for word in self.lexicon:
                self._symspell.create_dictionary_entry(word, 1000)
        except ImportError:
            logger.debug("symspellpy not installed; proceeding with dictionary replacement table.")

    def correct(self, text: str) -> Tuple[str, List[str]]:
        """
        Executes Hindi phonetic normalization and dictionary correction.
        Returns: (corrected_text, warnings)
        """
        warnings: List[str] = []
        if not text:
            return "", warnings

        res = text

        # Step 1: IndicNLP Phonetic Normalization (Nasalization, Chandrabindu, Nukta)
        if self._normalizer:
            try:
                res = self._normalizer.normalize(res)
            except Exception as e:
                logger.debug(f"IndicNLP normalization error: {e}")

        # Step 2: Native Phonetic & Glyph Normalization
        # Nukta cleanup on classical scriptures (e.g. क़ -> क, ख़ -> ख)
        res = re.sub(r'([कखगफज])\u093C', r'\1', res)

        # Step 3: Domain-specific Dictionary Corrections
        words = res.split()
        corrected_words = []

        for w in words:
            # Check direct exact match in replacement table
            clean_w = re.sub(r'^[^\wऀ-ॿ]+|[^\wऀ-ॿ]+$', '', w)
            if clean_w in self.replacements:
                repl = self.replacements[clean_w]
                corrected_words.append(w.replace(clean_w, repl))
                continue

            # Check common OCR confusion pairs:
            # 1. 'ध' vs 'घ': 'घर्म' -> 'धर्म'
            if clean_w == "घर्म":
                corrected_words.append(w.replace("घर्म", "धर्म"))
                continue

            # 2. 'बिष्णु' -> 'विष्णु'
            if clean_w == "बिष्णु":
                corrected_words.append(w.replace("बिष्णु", "विष्णु"))
                continue

            # 3. 'मक्ति' -> 'मुक्ति' / 'भक्ति'
            if clean_w == "मक्ति":
                corrected_words.append(w.replace("मक्ति", "भक्ति"))
                continue

            # Step 4: SymSpell Devanagari Candidate Selection (if enabled)
            if self._symspell and len(clean_w) >= 3 and clean_w not in self.lexicon:
                try:
                    suggestions = self._symspell.lookup(
                        clean_w,
                        verbosity=0,  # TOP
                        max_edit_distance=1
                    )
                    if suggestions and suggestions[0].distance == 1:
                        best_match = suggestions[0].term
                        corrected_words.append(w.replace(clean_w, best_match))
                        continue
                except Exception:
                    pass

            corrected_words.append(w)

        return " ".join(corrected_words), warnings
