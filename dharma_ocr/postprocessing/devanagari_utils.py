"""
Devanagari Script Utilities, PUA Ligature Decoding & Canonical Normalization.
Converts legacy font encodings (LaTeX dvng/xdvng, KrutiDev) and repairs Devanagari Unicode.
"""

import re
import unicodedata
from typing import Dict, Tuple

# Comprehensive Private Use Area (PUA) ligature map
# Used by LaTeX dvng/xdvng and 1990s-2000s digitized Sanskrit PDFs
PUA_LIGATURE_MAP: Dict[str, str] = {
    '\uE012': 'क्त',
    '\uE013': 'क्त्यै',
    '\uE046': 'द्भा',
    '\uE062': 'ङ्ग',
    '\uE08C': 'च्छ',
    '\uE096': 'च्य',
    '\uE09A': 'ज्जी',
    '\uE09B': 'ज्ञ',
    '\uE0B5': 'ञ्ज',
    '\uE107': 'त्प',
    '\uE114': 'त्प',
    '\uE118': 'त्म',
    '\uE11A': 'त्य',
    '\uE11E': 'त्व',
    '\uE131': 'ग्र',
    '\uE139': 'द्ग्र',
    '\uE143': 'द्ध',
    '\uE14A': 'द्ब्र',
    '\uE14B': 'द्भ',
    '\uE152': 'द्य',
    '\uE155': 'द्व',
    '\uE15C': 'ध्या',
    '\uE165': 'स्मि',
    '\uE170': 'न्त',
    '\uE175': 'न्त्य',
    '\uE183': 'न्थ',
    '\uE18B': 'न्द्र',
    '\uE18F': 'न्ध',
    '\uE196': 'न्न',
    '\uE1A2': 'न्म',
    '\uE1A6': 'न्य',
    '\uE1C6': 'प्त',
    '\uE1CB': 'प्न',
    '\uE1D1': 'प्य',
    '\uE1E3': 'ब्द',
    '\uE1F4': 'भ्य',
    '\uE1FF': 'म्प',
    '\uE220': 'ल्प',
    '\uE235': 'व्य',
    '\uE23A': 'श्च',
    '\uE246': 'ष्क',
    '\uE24E': 'ष्ट',
    '\uE257': 'ष्ण',
    '\uE260': 'ष्य',
    '\uE268': 'स्त',
    '\uE270': 'स्थ',
    '\uE27B': 'स्म',
    '\uE27C': 'स्म्य',
    '\uE27D': 'स्य',
    '\uE280': 'स्व',
    '\uE286': 'द्ध्र',
    '\uE289': 'ह्म',
    '\uE2AA': 'न्द',
    '\uE2AB': 'न्दू',
    '\uE301': 'र्य',
    '\uE303': '\u0930\u094D',  # Reph (र + ्)
    '\uE317': 'क्ष',
    '\uE318': 'ज्ञ',
    '\uE44D': 'दृ',
    '\uE450': 'रु',
    '\uE454': 'बहु',
    '\uE456': 'हृ',
    '\uE45A': 'र्वे',
    '\uE45C': 'र्थी',
}

DEVANAGARI_DIGITS = "०१२३४५६७८९"


def devanagari_to_int(text: str) -> int:
    """Converts a Devanagari or ASCII numeral string into an integer."""
    res = []
    for ch in text:
        idx = DEVANAGARI_DIGITS.find(ch)
        if idx != -1:
            res.append(str(idx))
        elif ch.isdigit():
            res.append(ch)
    return int("".join(res)) if res else 0


def decode_pua_ligatures(text: str) -> Tuple[str, int]:
    """Replaces Private Use Area (PUA) legacy ligatures with canonical Unicode."""
    count = 0
    out = text
    for pua, repl in PUA_LIGATURE_MAP.items():
        if pua in out:
            count += out.count(pua)
            out = out.replace(pua, repl)
    return out, count


def normalize_matras_and_reph(text: str) -> str:
    """
    Repairs detached vowel signs, misplaced matras, and inverted reph marks:
    - Consonant + space + Matra -> Consonant + Matra
    - Misplaced short-i or floating reph marks
    """
    res = text

    # Fix Reph if inverted: Consonant + Virama + Ra -> Ra + Virama + Consonant
    res = re.sub(r'([\u0915-\u0939]़?)(\u0930\u094D)', r'\2\1', res)

    # Detached vowel marks: e.g. "क ा" -> "का"
    res = re.sub(r'([\u0915-\u0939]़?)\s+([\u093E-\u094C\u0962\u0963])', r'\1\2', res)

    # Standalone anusvara / visarga after space: "क ं" -> "कं"
    res = re.sub(r'([\u0915-\u0939][\u093E-\u094C]?)\s+([ंःँ])', r'\1\2', res)

    return res


def normalize_dandas_and_punctuation(text: str) -> str:
    """
    Standardizes dandas and religious punctuation marks:
    - Replaces ||, ll, !|, |! with Devanagari double danda (॥)
    - Replaces single pipes | with Devanagari single danda (।)
    - Converts ASCII colon ':' after Devanagari word to Visarga (ः)
    """
    res = text

    # Double danda standardizer
    res = re.sub(r'[|!lI1]{2,}', ' ॥ ', res)
    res = re.sub(r'॥\s*॥', '॥', res)

    # Single danda standardizer: single pipe surrounded by Devanagari or spaces
    res = re.sub(r'(?<=[ऀ-ॿ\s])\|(?=[ऀ-ॿ\s]|$)', ' । ', res)

    # Colon after Devanagari word -> Visarga: e.g. "पुन:" -> "पुनः"
    res = re.sub(r'([\u0915-\u0939][\u093E-\u094C]?):(?=[\s\.,।॥]|$)', r'\1ः', res)

    # Collapse repeated spaces around dandas
    res = re.sub(r'\s+([।॥])', r' \1', res)
    res = re.sub(r'([।॥])\s+', r'\1 ', res)

    return res


def canonicalize_devanagari(text: str) -> str:
    """
    Applies Unicode NFC normalization, repairs ligatures,
    and cleans whitespace while preserving verse stanzas.
    """
    # 1. Unicode NFC canonical decomposition/composition
    text = unicodedata.normalize("NFC", text)

    # 2. Decode legacy PUA ligatures
    text, _ = decode_pua_ligatures(text)

    # 3. Matras & Reph
    text = normalize_matras_and_reph(text)

    # 4. Dandas & Punctuation
    text = normalize_dandas_and_punctuation(text)

    # 5. Clean trailing line whitespace
    lines = [re.sub(r'[ \t]+', ' ', line).strip() for line in text.splitlines()]
    return "\n".join(line for line in lines if line)
