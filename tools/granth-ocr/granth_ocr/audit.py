"""Audit completed OCR. This does not read a new page and does not invent aksharas.

A missing danda, a skipped verse number, or a hyphenated line is a finding.
The finding is not filled from a dictionary or from a neighbouring book.
"""

from __future__ import annotations

import json
import re
from pathlib import Path

from granth_ocr.hindi import suggest_hindi
from granth_ocr.report import numbering_notes
from granth_ocr.verses import parse_page_text, stitch_pages

DANDA_END = re.compile(r"[।॥]\s*$")
HYPHEN_END = re.compile(r"[-–—]\s*$")
LETTER_RE = re.compile(r"[\u0904-\u0939\u0958-\u0961\u093e-\u094d]")


def unit_confidence(value) -> float | None:
    if not isinstance(value, (int, float)):
        return None
    score = float(value)
    if score > 1:
        score = score / 100.0
    return round(max(0.0, min(1.0, score)), 4)


def load_ocr_pages(work: Path) -> list[dict]:
    folder = work / "ocr"
    if not folder.is_dir():
        raise FileNotFoundError(f"No OCR directory at {folder}")
    pages = []
    for path in sorted(folder.glob("page-*.json"), key=_page_sort):
        pages.append(json.loads(path.read_text(encoding="utf-8")))
    return pages


def _page_sort(path: Path) -> int:
    match = re.search(r"(\d+)", path.stem)
    return int(match.group(1)) if match else 0


def _letters(text: str) -> str:
    return "".join(LETTER_RE.findall(text or ""))


def _page_status(confidence: float | None, flags: list[str], threshold: float) -> str:
    if confidence is None or confidence < threshold or "empty OCR text" in flags:
        return "REPROCESS"
    if flags:
        return "REVIEW"
    return "VALID"


def audit_pages(pages: list[dict], *, threshold: float = 0.75) -> dict:
    """Score pages and verses already on disk. mode stays suggest, so variants are not written."""
    ordered = sorted(pages, key=lambda page: int(page.get("pdf_page") or 0))
    verses, chapters = stitch_pages(ordered, mode="suggest", reorder_i=True)
    by_page: dict[int, list[dict]] = {}
    for verse in verses:
        by_page.setdefault(int(verse.get("pdf_page") or 0), []).append(verse)

    page_rows = []
    reprocess = []
    seen_chapter: int | None = None
    for page in ordered:
        number = int(page.get("pdf_page") or 0)
        text = page.get("text_raw") or ""
        own = by_page.get(number, [])
        flags = list(page.get("flags") or [])
        if not text.strip():
            flags.append("empty OCR text")
        if "\ufffd" in text:
            flags.append("replacement character")
        conf = unit_confidence(page.get("confidence"))
        complete = _verse_completeness(own, text)
        integrity, seen_chapter = _chapter_integrity(own, seen_chapter)
        structural = []
        if any(HYPHEN_END.search(line.strip()) for line in text.splitlines()):
            structural.append("line ends in a hyphen; the next akshara was not guessed")
        if any(verse.get("continues_from_previous_page") for verse in own):
            structural.append("verse continues from the previous page")
        if any(not _has_closer(verse) for verse in own):
            structural.append("a verse has no closing danda")
        if any((verse.get("sanskrit_devanagari") or "").count("॥") >= 1 for verse in own):
            structural.append("a verse contains more than one shloka; it was not split")
        flags.extend(structural)
        row = {
            "page": number,
            "ocr_confidence": conf,
            "verse_completeness": complete,
            "chapter_integrity": integrity,
            "status": _page_status(conf, flags, threshold),
            "verse_count": len(own),
            "flags": flags,
            "image_present": None,
        }
        page_rows.append(row)

    holes = numbering_notes(verses)
    _annotate_numbering(page_rows, verses, holes, threshold)
    duplicates = _duplicates(verses)
    open_tail, loose_tail = _page_tails(ordered)
    for item in loose_tail:
        for row in page_rows:
            if row["page"] == item["page"]:
                row["flags"].append(f"trailing line left as OCR: {item['text']}")
                row["status"] = _page_status(row["ocr_confidence"], row["flags"], threshold)
    suggestions = _suggestions(verses)
    verified = _verified_book(verses, chapters, threshold)
    reprocess = _reprocess_queue(page_rows)
    integrity = _integrity(page_rows, holes, open_tail)
    return {
        "pages": page_rows,
        "chapters": [
            {
                "chapter": chapter.get("number"),
                "title": chapter.get("title"),
                "page_start": chapter.get("page_start"),
                "page_end": chapter.get("page_end"),
                "verse_count": chapter.get("verse_count"),
            }
            for chapter in chapters
        ],
        "verses": verses,
        "numbering": holes,
        "duplicates": duplicates,
        "open_page_tail": open_tail,
        "suggestions": suggestions,
        "reprocess_queue": reprocess,
        "verified": verified,
        "summary": {
            "total_pages": len(page_rows),
            "total_chapters": len(chapters),
            "total_verses": len(verses),
            "missing_verse_notes": len(holes),
            "missing_verses_restored": 0,
            "ocr_errors_corrected": 0,
            "sanskrit_suggestions": sum(1 for item in suggestions if item["layer"] == "sanskrit"),
            "hindi_suggestions": sum(1 for item in suggestions if item["layer"] == "hindi"),
            "suggestions_applied": 0,
            "duplicate_verses_reported": len(duplicates),
            "duplicate_verses_removed": 0,
            "pages_reprocessed": 0,
            "pages_queued": len(reprocess),
            "average_ocr_confidence": _mean(row["ocr_confidence"] for row in page_rows),
            "scripture_integrity_score": integrity,
            "note": (
                "No akshara was invented. Dictionary hits are suggestions. "
                "A skipped number is not filled. Reprocess entries were not sent back to an OCR engine. "
                "No verified searchable PDF was written."
            ),
        },
    }


def _has_closer(verse: dict) -> bool:
    """The verse number's ॥ is a closer. The marker is not copied back into the text."""
    body = (verse.get("sanskrit_devanagari") or "").strip()
    if not body:
        return False
    if DANDA_END.search(body):
        return True
    return "॥" in (verse.get("verse_number_raw") or "")


def _verse_closed(verse: dict) -> bool:
    body = (verse.get("sanskrit_devanagari") or "").strip()
    if not body or re.search(r"[-–—]", body) or body.count("॥") >= 1:
        return False
    return _has_closer(verse)


def _verse_completeness(verses: list[dict], text: str) -> float:
    if not text.strip():
        return 0.0
    if not verses:
        letters = len(_letters(text))
        if letters < 12:
            return 0.4
        return 0.2
    closed = sum(1 for verse in verses if _verse_closed(verse))
    return round(closed / len(verses), 4)


def _annotate_numbering(page_rows: list[dict], verses: list[dict], holes: list[str], threshold: float) -> None:
    """A skipped or repeated number stays in the text. The page is marked for review."""
    for note in holes:
        match = re.search(r"chapter (\d+)", note)
        chapter_no = int(match.group(1)) if match else None
        targets = [
            row for row in page_rows
            if any(
                verse.get("chapter") == chapter_no and verse.get("pdf_page") == row["page"]
                for verse in verses
            )
        ] or page_rows
        for row in targets:
            if note not in row["flags"]:
                row["flags"].append(note)
            row["status"] = _page_status(row["ocr_confidence"], row["flags"], threshold)


def _reprocess_queue(page_rows: list[dict]) -> list[dict]:
    return [
        {
            "page": row["page"],
            "engine_used": None,
            "previous_confidence": row["ocr_confidence"],
            "new_confidence": None,
            "reason": "queued only; this audit does not run Tesseract or Surya",
        }
        for row in page_rows
        if row["status"] == "REPROCESS"
    ]


def _integrity(page_rows: list[dict], holes: list[str], open_tail: list[dict]) -> float:
    scores = [row["verse_completeness"] for row in page_rows]
    score = round(sum(scores) / len(scores), 4) if scores else 0.0
    if holes or open_tail:
        score = round(score * 0.5, 4)
    if any(row["status"] != "VALID" for row in page_rows):
        confidence = _mean(row["ocr_confidence"] for row in page_rows)
        if confidence is not None:
            score = round(min(score, confidence), 4)
    return score


def _chapter_integrity(verses: list[dict], previous: int | None) -> tuple[float, int | None]:
    numbers = [verse.get("chapter") for verse in verses if isinstance(verse.get("chapter"), int)]
    if not numbers:
        return (0.5 if previous is None else 1.0), previous
    current = previous
    backwards = False
    for number in numbers:
        if current is not None and number < current:
            backwards = True
        current = number
    return (0.0 if backwards else 1.0), current


def _duplicates(verses: list[dict]) -> list[dict]:
    first: dict[str, dict] = {}
    found = []
    for verse in verses:
        key = _letters(verse.get("sanskrit_devanagari") or "")
        if len(key) < 24:
            continue
        prior = first.get(key)
        ref = {"chapter": verse.get("chapter"), "verse": verse.get("verse"), "page": verse.get("pdf_page")}
        if prior is None:
            first[key] = ref
            continue
        found.append({"first": prior, "again": ref})
    return found


def _scripture_tail(text: str) -> bool:
    """A short Devanagari fragment is still an open verse. Mixed junk is a footer."""
    letters = len(_letters(text))
    odd = len(re.findall(r"[^\u0900-\u097F\s।॥,\-–—'\"“”()०-९0-9.]", text))
    return letters >= 8 and odd <= 1


def _page_tails(pages: list[dict]) -> tuple[list[dict], list[dict]]:
    """Split an unconsumed tail into a real leftover shloka or a short footer.

    A tail that stitch_pages joins onto the next verse is omitted.
    The joined text is the two OCR strings. The missing akshara is not guessed.
    """
    chapter = None
    carry = ""
    carry_page = None
    for page in pages:
        parsed = parse_page_text(page.get("text_raw") or "", chapter, mode="suggest", reorder_i=True)
        if parsed["chapter"] is not None:
            chapter = parsed["chapter"]
        if carry:
            if parsed["verses"]:
                carry = ""
                carry_page = None
            else:
                extra = parsed.get("trailing_fragment") or ""
                if extra:
                    carry = f"{carry} {extra}".strip()
                continue
        tail = parsed.get("trailing_fragment") or ""
        if tail:
            carry = tail
            carry_page = page.get("pdf_page")
        else:
            carry = ""
            carry_page = None
    if not carry or carry_page is None:
        return [], []
    if HYPHEN_END.search(carry):
        reason = "the verse is hyphenated at the page edge and was not completed"
    else:
        reason = "Sanskrit on this page has no verse marker, and the missing half was not guessed"
    row = {"page": carry_page, "text": carry, "reason": reason}
    if _scripture_tail(carry):
        return [row], []
    return [], [row]


def _suggestion_row(verse: dict, item: dict, layer: str) -> dict:
    return {
        "chapter": verse.get("chapter"),
        "verse": verse.get("verse"),
        "page": verse.get("pdf_page"),
        "layer": layer,
        "from": item.get("from"),
        "to": item.get("to"),
        "applied": False,
    }


def _suggestions(verses: list[dict]) -> list[dict]:
    """Whole-token dictionary hits only. SymSpell edit-distance hits are not recorded."""
    rows = []
    for verse in verses:
        for item in verse.get("corrections") or []:
            if item.get("applied") or item.get("reason") != "domain variant":
                continue
            rows.append(_suggestion_row(verse, item, "sanskrit"))
        hindi = verse.get("bhashya_hi") or ""
        if not hindi:
            continue
        _, log = suggest_hindi(hindi, mode="suggest", indic=False)
        for item in log:
            if item.get("applied") or item.get("reason") != "domain variant":
                continue
            rows.append(_suggestion_row(verse, item, "hindi"))
    return rows


def _verified_book(verses: list[dict], chapters: list[dict], threshold: float) -> dict:
    grouped: dict = {}
    for verse in verses:
        grouped.setdefault(verse.get("chapter"), []).append(verse)
    out_chapters = []
    for chapter in sorted(grouped, key=lambda item: (item is None, item or 0)):
        rows = []
        for verse in grouped[chapter]:
            conf = unit_confidence(verse.get("confidence"))
            flags = list(verse.get("flags") or [])
            body = verse.get("sanskrit_devanagari") or ""
            intact = bool(body) and bool(DANDA_END.search(body)) and not flags and conf is not None and conf >= threshold
            rows.append({
                "verse": verse.get("verse"),
                "text": body,
                "status": "verified" if intact else "needs_review",
                "confidence": conf,
                "flags": flags,
                "page": verse.get("pdf_page"),
            })
        title = next((item.get("title") for item in chapters if item.get("number") == chapter), "")
        out_chapters.append({"chapter": chapter, "title": title, "verses": rows})
    return {"chapters": out_chapters}


def _mean(values) -> float | None:
    nums = [value for value in values if isinstance(value, (int, float))]
    if not nums:
        return None
    return round(sum(nums) / len(nums), 4)


def attach_images(report: dict, work: Path, *, threshold: float = 0.75) -> None:
    """Record whether the scan image is on disk. The image is not re-read as text."""
    for row in report["pages"]:
        image = work / "images" / "raw" / f"page-{row['page']}.png"
        row["image_present"] = image.is_file()
        if row["image_present"] and "empty OCR text" in row["flags"]:
            row["flags"].append("page image contains no extracted text; not re-read in this audit")
        if not row["image_present"]:
            row["flags"].append("no page image; image comparison was not run")
        row["status"] = _page_status(row["ocr_confidence"], row["flags"], threshold)
    report["reprocess_queue"] = [
        {
            "page": row["page"],
            "engine_used": None,
            "previous_confidence": row["ocr_confidence"],
            "new_confidence": None,
            "reason": "queued only; this audit does not run Tesseract or Surya",
        }
        for row in report["pages"]
        if row["status"] == "REPROCESS"
    ]
    report["summary"]["pages_queued"] = len(report["reprocess_queue"])
    report["summary"]["pages_reprocessed"] = 0


def write_audit(slug: str, report: dict, work: Path) -> Path:
    reports = work / "reports"
    export = work / "export"
    reports.mkdir(parents=True, exist_ok=True)
    export.mkdir(parents=True, exist_ok=True)
    payload = {"book": slug, **{key: value for key, value in report.items() if key != "verses"}}
    (reports / "audit.json").write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (reports / "audit.md").write_text(_markdown(slug, report), encoding="utf-8")
    verified = {"book": slug, "chapters": report["verified"]["chapters"], "summary": report["summary"]}
    (export / "verified_text.json").write_text(json.dumps(verified, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (export / "verified_text.md").write_text(_verified_md(slug, report), encoding="utf-8")
    (export / "verified_text.txt").write_text(_verified_txt(slug, report), encoding="utf-8")
    return reports / "audit.md"


def _markdown(slug: str, report: dict) -> str:
    summary = report["summary"]
    lines = [
        f"# OCR audit: {slug}",
        "",
        summary["note"],
        "",
        f"- Pages: {summary['total_pages']}",
        f"- Chapters: {summary['total_chapters']}",
        f"- Verses: {summary['total_verses']}",
        f"- Numbering notes: {summary['missing_verse_notes']}",
        f"- Verses restored by guessing: {summary['missing_verses_restored']}",
        f"- Suggestions, not applied: Sanskrit {summary['sanskrit_suggestions']}, Hindi {summary['hindi_suggestions']}",
        f"- Duplicate verses reported / removed: {summary['duplicate_verses_reported']} / {summary['duplicate_verses_removed']}",
        f"- Pages queued / reprocessed: {summary['pages_queued']} / {summary['pages_reprocessed']}",
        f"- Average OCR confidence: {summary['average_ocr_confidence']}",
        f"- Integrity score: {summary['scripture_integrity_score']}",
        "",
        "## Pages",
        "",
    ]
    for row in report["pages"]:
        lines.append(
            f"- page {row['page']}: confidence {row['ocr_confidence']}, "
            f"verse completeness {row['verse_completeness']}, "
            f"chapter integrity {row['chapter_integrity']}, {row['status']}"
        )
        for flag in row["flags"]:
            lines.append(f"  - {flag}")
    lines.extend(["", "## Chapters", ""])
    if not report["chapters"]:
        lines.append("No chapter heading was detected.")
    for chapter in report["chapters"]:
        lines.append(
            f"- chapter {chapter['chapter']} ({chapter['title']}): "
            f"pages {chapter['page_start']}–{chapter['page_end']}, verses {chapter['verse_count']}"
        )
    lines.extend(["", "## Numbering", ""])
    if not report["numbering"]:
        lines.append("No dense-chapter gap or duplicate number was detected.")
    for note in report["numbering"]:
        lines.append(f"- {note}")
    lines.extend(["", "## Open page tails", ""])
    if not report["open_page_tail"]:
        lines.append("None.")
    for item in report["open_page_tail"]:
        lines.append(f"- page {item['page']}: {item['reason']} — {item['text']}")
    lines.extend(["", "## Suggestions", ""])
    if not report["suggestions"]:
        lines.append("None.")
    for item in report["suggestions"]:
        lines.append(
            f"- {item['layer']} {item['chapter']}.{item['verse']}: {item['from']} → {item['to']} (not applied)"
        )
    lines.append("")
    return "\n".join(lines)


def _verified_md(slug: str, report: dict) -> str:
    lines = [
        f"# {slug}",
        "",
        "Audited OCR. `needs_review` lines are the engine text. Nothing in this file was reconstructed.",
        "",
    ]
    for chapter in report["verified"]["chapters"]:
        lines.append(f"## {chapter.get('title') or chapter.get('chapter')}")
        lines.append("")
        for verse in chapter["verses"]:
            lines.append(f"### {verse['verse']} ({verse['status']}, {verse['confidence']})")
            lines.append("")
            lines.append(verse["text"])
            lines.append("")
    return "\n".join(lines).rstrip() + "\n"


def _verified_txt(slug: str, report: dict) -> str:
    parts = [slug, ""]
    for chapter in report["verified"]["chapters"]:
        for verse in chapter["verses"]:
            parts.append(f"{chapter.get('chapter')}.{verse['verse']} [{verse['status']}] {verse['text']}")
    return "\n".join(parts).rstrip() + "\n"
