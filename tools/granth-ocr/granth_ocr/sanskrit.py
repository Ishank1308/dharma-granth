"""Mechanical Devanagari fixes. The raw OCR string is never replaced in place.

Look-alike consonants (घ/ध, भ/म, व/ब, य/प, त/न) are flagged, not substituted.
The only rewrite applied by default is a leading ि moved after its consonant.
"""

from __future__ import annotations

import re

CONSONANTS = {chr(n) for n in list(range(0x0915, 0x093A)) + list(range(0x0958, 0x0960))}
PUA_RE = re.compile(r"[\uE000-\uF8FF\uFFFD\uFFFC]")
COLON_RE = re.compile(r"[\u0900-\u097F]:\s*[\u0900-\u097F]")
DETACHED_RE = re.compile(r"[\u0900-\u097F]\s+[ेैोौृ]")

# Whole tokens that are not real inflected forms. Suggestions only, unless mode is apply.
# Whole tokens only. A shorter string inside a real word is not a hit.
# Visarga and vowel signs are not added: सर्वज्ञ is not rewritten as सर्वज्ञः.
VARIANTS = {
    "महाभागत": "महाभारत",
    "महीभारत": "महाभारत",
    "कृशण": "कृष्ण",
    "कृष्न": "कृष्ण",
    "कष्ण": "कृष्ण",
    "विश्णु": "विष्णु",
    "विष्नु": "विष्णु",
    "विषणु": "विष्णु",
    "नारायण्": "नारायण",
}


def fix_prebase_i(text: str) -> tuple[str, list[dict]]:
    chars = list(text)
    changes: list[dict] = []
    i = 0
    while i < len(chars) - 1:
        if chars[i] == "ि" and chars[i + 1] in CONSONANTS and not (i > 0 and chars[i - 1] in CONSONANTS):
            pair = chars[i] + chars[i + 1]
            chars[i], chars[i + 1] = chars[i + 1], chars[i]
            changes.append({
                "from": pair,
                "to": chars[i] + chars[i + 1],
                "reason": "prebase i-matra reordered to Unicode",
                "applied": True,
            })
            i += 2
            continue
        i += 1
    return "".join(chars), changes


def _tokens(text: str) -> list[str]:
    return re.findall(r"[\u0900-\u097F]+|[^\u0900-\u097F]+", text)


def lexical_suggestions(text: str, *, apply: bool) -> tuple[str, list[dict]]:
    parts = _tokens(text)
    changes: list[dict] = []
    out: list[str] = []
    for part in parts:
        target = VARIANTS.get(part)
        if not target:
            out.append(part)
            continue
        changes.append({
            "from": part,
            "to": target,
            "reason": "domain variant",
            "applied": apply,
        })
        out.append(target if apply else part)
    return "".join(out), changes


def normalize_sanskrit(text: str, *, mode: str, reorder_i: bool) -> tuple[str, list[dict], list[str]]:
    """Return normalized text, a correction log, and review flags.

    mode: suggest | apply | off
    """
    flags: list[str] = []
    log: list[dict] = []
    normalized = text
    if reorder_i:
        normalized, moved = fix_prebase_i(normalized)
        log.extend(moved)
    if PUA_RE.search(normalized):
        flags.append("private-use or replacement character")
    if COLON_RE.search(normalized):
        flags.append("possible visarga printed as colon")
    if DETACHED_RE.search(normalized):
        flags.append("detached matra")
    if mode != "off":
        normalized, lexical = lexical_suggestions(normalized, apply=mode == "apply")
        log.extend(lexical)
    if any(ch in normalized for ch in "घधभमवबयपत"):
        # Presence alone is normal Sanskrit. Flag only when Latin noise sits in the same line.
        if re.search(r"[A-Za-z]{3,}", normalized):
            flags.append("mixed script on one verse")
    return normalized, log, flags


def to_iast(text: str) -> str:
    if not re.search(r"[\u0900-\u097F]", text):
        return ""
    try:
        from indic_transliteration import sanscript
        from indic_transliteration.sanscript import transliterate
    except ImportError:
        return ""
    converted = transliterate(text, sanscript.DEVANAGARI, sanscript.IAST)
    return re.sub(r"\s+", " ", converted.replace("।", "|")).strip()
