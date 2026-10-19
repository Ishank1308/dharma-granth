"""Hindi suggestion layer.

IndicNLP and SymSpell are used only when those packages are installed.
SymSpell proposals are never written into the text. IndicNLP runs only when
indic_normalize is true, because it can rewrite anusvara and chandrabindu.
"""

from __future__ import annotations

import re

from granth_ocr.sanskrit import VARIANTS, lexical_suggestions

# Headwords used as a SymSpell dictionary. Not a word-frequency corpus.
DOMAIN = [
    "महाभारत",
    "रामायण",
    "कृष्ण",
    "विष्णु",
    "शिव",
    "नारायण",
    "धर्म",
    "अध्याय",
    "स्कन्ध",
    "स्कंध",
    "पर्व",
    "सर्ग",
    "काण्ड",
    "गीता",
    "उपनिषद्",
    "पुराण",
    "अर्जुन",
    "हनुमान",
    "ब्रह्मा",
]

_SPELL = None


def _symspell():
    global _SPELL
    if _SPELL is False:
        return None
    if _SPELL is not None:
        return _SPELL
    try:
        from symspellpy import SymSpell, Verbosity
    except ImportError:
        _SPELL = False
        return None
    spell = SymSpell(max_dictionary_edit_distance=1, prefix_length=7)
    for index, word in enumerate(DOMAIN):
        spell.create_dictionary_entry(word, 1000 - index)
    _SPELL = (spell, Verbosity)
    return _SPELL


def symspell_suggestions(text: str) -> list[dict]:
    loaded = _symspell()
    if not loaded:
        return []
    spell, verbosity = loaded
    found: list[dict] = []
    for token in re.findall(r"[\u0900-\u097F]{4,}", text):
        if token in DOMAIN or token in VARIANTS:
            continue
        hits = spell.lookup(token, verbosity.CLOSEST, max_edit_distance=1)
        if not hits or hits[0].term == token:
            continue
        found.append({
            "from": token,
            "to": hits[0].term,
            "reason": "symspell domain headword",
            "applied": False,
        })
    return found


def indic_normalize(text: str) -> tuple[str, list[dict]]:
    try:
        from indicnlp.normalize.indic_normalize import DevanagariNormalizer
    except ImportError:
        return text, []
    normalized = DevanagariNormalizer().normalize(text)
    if normalized == text:
        return text, []
    return normalized, [{
        "from": "",
        "to": "",
        "reason": "indicnlp devanagari normalizer changed this page",
        "applied": True,
    }]


def suggest_hindi(text: str, *, mode: str, indic: bool, lexical: bool = True) -> tuple[str, list[dict]]:
    """mode suggest|apply|off. SymSpell stays suggestion-only in every mode."""
    log: list[dict] = []
    out = text
    if indic:
        out, indic_log = indic_normalize(out)
        log.extend(indic_log)
    if lexical and mode != "off":
        out, lexical_log = lexical_suggestions(out, apply=mode == "apply")
        log.extend(lexical_log)
    if mode != "off":
        log.extend(symspell_suggestions(out))
    return out, log
