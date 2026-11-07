"""Split a page into Sanskrit, Hindi commentary, and English without inventing text."""

from __future__ import annotations

import re

from granth_ocr.sanskrit import normalize_sanskrit, to_iast

DEV_DIGITS = "०१२३४५६७८९"
VERSE_MARK = re.compile(r"॥\s*([०-९0-9]+(?:\.[०-९0-9]+)?)\s*॥")
CHAPTER_RE = re.compile(
    r"(अध्यायः?|अध्याय|स्कन्धः?|स्कंधः?|पर्वः?|सर्गः?|काण्डः?|कांडः?|खण्डः?|खंडः?|वल्ली|प्रकरणः?|अनुवाकः?|Chapter)\s*([०-९0-9]+)?"
)
HEADING_ONLY = re.compile(
    r"^(?:अध्यायः?|अध्याय|स्कन्धः?|स्कंधः?|पर्वः?|सर्गः?|काण्डः?|कांडः?|खण्डः?|खंडः?|वल्ली|प्रकरणः?|अनुवाकः?|Chapter)\s*[०-९0-9]*\s*$"
)
# Postpositions may be printed tight against the noun: ग्रहणके, लक्ष्यार्थमें.
# A lone के before a danda stays Sanskrit (लोके ।). है / नहीं / किया force Hindi.
PROSE_RE = re.compile(
    r"(?:^|[\s,(“\"])(?:अथवा|करके|किया|किये|किए|गया|गये|गई|हुए|हुई|हुआ|द्वारा|नहीं|कहा|उन|यह|वह|और|ओर)(?=[\s,।॥)”\"]|$)"
    r"|(?:के|की|का|को|में|से)(?=[\s,।॥]|$)"
    r"|है(?=[\s,।॥]|$)|हैं(?=[\s,।॥]|$)|वाल[ाोे]"
)
PRECISE_RE = re.compile(
    r"(?:अथवा|करके|किया|किये|किए|गया|गये|द्वारा|नहीं|कहा)|है(?=[\s,।॥]|$)|हैं(?=[\s,।॥]|$)"
)


def devanagari_to_int(raw: str) -> int | None:
    digits = []
    for char in raw:
        if char in DEV_DIGITS:
            digits.append(str(DEV_DIGITS.index(char)))
        elif char.isdigit():
            digits.append(char)
    if not digits:
        return None
    return int("".join(digits))


def line_kind(line: str) -> str:
    stripped = line.strip()
    latin = len(re.findall(r"[A-Za-z]", stripped))
    dev = len(re.findall(r"[\u0900-\u097F]", stripped))
    if latin > 8 and latin > dev:
        return "english"
    if re.fullmatch(r"[\u0900-\u097F]{1,2}\.?", stripped):
        return "noise"
    odd = len(re.findall(r"[^\u0900-\u097F\s।॥,\-–—'\"“”()०-९0-9.]", stripped))
    if odd >= 2 and dev < 15:
        return "noise"
    if re.fullmatch(r"[\u0900-\u097F]{2,}-[\u0900-\u097F]{2,}", stripped):
        return "hindi"
    dashes = len(re.findall(r"[–—-]", stripped))
    if dashes >= 2 and dev > 0 and latin == 0:
        return "padaccheda"
    prose = PROSE_RE.findall(stripped)
    if len(prose) >= 2 or PRECISE_RE.search(stripped) or (len(prose) == 1 and not re.search(r"[।॥]", stripped)):
        return "hindi"
    if dev > 0:
        return "sanskrit"
    return "english"


def _chapter_of(text: str, fallback: int | None) -> tuple[int | None, str]:
    match = CHAPTER_RE.search(text)
    if not match:
        return fallback, ""
    number = devanagari_to_int(match.group(2) or "")
    title = re.sub(r"\s+", " ", match.group(0)).strip()
    return number if number is not None else fallback, title


def _bucket(lines: list[str]) -> dict[str, str]:
    buckets = {"sanskrit": [], "padaccheda": [], "hindi": [], "english": []}
    for line in lines:
        if not line or HEADING_ONLY.match(line):
            continue
        kind = line_kind(line)
        if kind == "noise":
            continue
        if kind == "padaccheda":
            buckets["padaccheda"].append(line)
        elif kind == "hindi":
            buckets["hindi"].append(line)
        elif kind == "english":
            buckets["english"].append(line)
        else:
            buckets["sanskrit"].append(line)
    return {key: re.sub(r"\s+", " ", " ".join(value)).strip() for key, value in buckets.items()}


def parse_page_text(raw: str, fallback_chapter: int | None, *, mode: str, reorder_i: bool) -> dict:
    text = raw.replace("\r", "")
    chapter, title = _chapter_of(text, fallback_chapter)
    verses: list[dict] = []
    cursor = 0
    for match in VERSE_MARK.finditer(text):
        body = text[cursor:match.start()]
        cursor = match.end()
        lines = [line.strip() for line in re.split(r"\n+", body) if line.strip()]
        leading: list[str] = []
        sanskrit_lines: list[str] = []
        seen = False
        for line in lines:
            if HEADING_ONLY.match(line):
                found, found_title = _chapter_of(line, chapter)
                if found is not None:
                    chapter = found
                if found_title:
                    title = found_title
                continue
            if not seen and line_kind(line) != "sanskrit":
                leading.append(line)
            else:
                seen = True
                sanskrit_lines.append(line)
        if verses and leading:
            extra = _bucket(leading)
            prev = verses[-1]
            prev["bhashya_hi"] = " ".join(bit for bit in (prev["bhashya_hi"], extra["hindi"]) if bit)
            prev["english"] = " ".join(bit for bit in (prev["english"], extra["english"]) if bit)
            prev["padaccheda"] = " ".join(bit for bit in (prev["padaccheda"], extra["padaccheda"]) if bit)
        layers = _bucket(sanskrit_lines)
        if not any(layers.values()) and not leading:
            continue
        normalized, corrections, flags = normalize_sanskrit(
            layers["sanskrit"], mode=mode, reorder_i=reorder_i,
        )
        if normalized and not re.search(r"[।॥]", normalized):
            flags.append("sanskrit has no danda")
        parts = match.group(1).split(".")
        major = devanagari_to_int(parts[0])
        minor = devanagari_to_int(parts[1]) if len(parts) > 1 else None
        verse_chapter = major if minor is not None else chapter
        verse_number = minor if minor is not None else major
        if not normalized and not layers["sanskrit"]:
            continue
        verses.append({
            "verse_number_raw": re.sub(r"\s+", " ", match.group(0)).strip(),
            "chapter": verse_chapter,
            "verse": verse_number,
            "sanskrit_raw": layers["sanskrit"],
            "sanskrit_devanagari": normalized,
            "sanskrit_iast": to_iast(normalized),
            "padaccheda": layers["padaccheda"],
            "word_meanings": layers["padaccheda"],
            "bhashya_hi": layers["hindi"],
            "english": layers["english"],
            "corrections": corrections,
            "flags": flags,
            "continues_from_previous_page": False,
        })
    trailing_lines = [line.strip() for line in re.split(r"\n+", text[cursor:]) if line.strip()]
    if verses and trailing_lines:
        extra = _bucket(trailing_lines)
        prev = verses[-1]
        if extra["hindi"] or extra["english"]:
            prev["bhashya_hi"] = " ".join(bit for bit in (prev["bhashya_hi"], extra["hindi"]) if bit)
            prev["english"] = " ".join(bit for bit in (prev["english"], extra["english"]) if bit)
    trailing = ""
    sanskrit_tail = [line for line in trailing_lines if line_kind(line) == "sanskrit"]
    if sanskrit_tail:
        trailing = re.sub(r"\s+", " ", " ".join(sanskrit_tail)).strip()
    return {"verses": verses, "trailing_fragment": trailing, "chapter": chapter, "title": title}


def stitch_pages(pages: list[dict], *, mode: str, reorder_i: bool) -> tuple[list[dict], list[dict]]:
    """pages are OCR records in reading order. Returns verses and chapter metadata."""
    verses: list[dict] = []
    chapters: dict[int, dict] = {}
    carry = ""
    chapter: int | None = None
    for page in pages:
        parsed = parse_page_text(page.get("text_raw") or "", chapter, mode=mode, reorder_i=reorder_i)
        if parsed["chapter"] is not None:
            chapter = parsed["chapter"]
        page_verses = parsed["verses"]
        if carry:
            if page_verses:
                joined = f"{carry} {page_verses[0]['sanskrit_raw']}".strip()
                normalized, corrections, flags = normalize_sanskrit(joined, mode=mode, reorder_i=reorder_i)
                page_verses[0]["sanskrit_raw"] = joined
                page_verses[0]["sanskrit_devanagari"] = normalized
                page_verses[0]["sanskrit_iast"] = to_iast(normalized)
                page_verses[0]["corrections"] = corrections
                page_verses[0]["flags"] = flags
                page_verses[0]["continues_from_previous_page"] = True
                if "continued from previous page" not in page_verses[0]["flags"]:
                    page_verses[0]["flags"].append("continued from previous page")
            else:
                carry = f"{carry} {parsed['trailing_fragment']}".strip()
                continue
            carry = ""
        for verse in page_verses:
            verse["pdf_page"] = page.get("pdf_page")
            verse["engine"] = page.get("engine")
            verse["confidence"] = page.get("confidence")
            if verse["chapter"] is not None:
                slot = chapters.setdefault(verse["chapter"], {
                    "number": verse["chapter"],
                    "title": parsed["title"] or f"अध्याय {verse['chapter']}",
                    "page_start": verse["pdf_page"],
                    "page_end": verse["pdf_page"],
                    "verse_count": 0,
                })
                if parsed["title"]:
                    slot["title"] = parsed["title"]
                slot["page_start"] = min(slot["page_start"] or verse["pdf_page"], verse["pdf_page"])
                slot["page_end"] = max(slot["page_end"] or verse["pdf_page"], verse["pdf_page"])
                slot["verse_count"] += 1
            verses.append(verse)
        carry = parsed["trailing_fragment"]
    return verses, [chapters[key] for key in sorted(chapters)]
