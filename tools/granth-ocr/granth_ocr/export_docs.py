"""TXT, Markdown, and JSON exports. Nothing here is sent to a model."""

from __future__ import annotations

import json
from pathlib import Path


def confidence_label(verse: dict, threshold: float) -> str:
    flags = list(verse.get("flags") or [])
    conf = verse.get("confidence")
    if flags or (isinstance(conf, (int, float)) and conf < threshold):
        return "needs_review"
    if not (verse.get("sanskrit_devanagari") or "").strip():
        return "needs_review"
    return "ok"


def write_txt(pages: list[dict], dest: Path) -> None:
    parts = []
    for page in pages:
        parts.append(f"\n\n----- page {page.get('pdf_page')} | {page.get('engine')} | {page.get('confidence')} -----\n")
        parts.append(page.get("text_raw") or "")
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text("".join(parts).strip() + "\n", encoding="utf-8")


def write_markdown(slug: str, chapters: list[dict], verses: list[dict], dest: Path) -> None:
    by_chapter: dict = {}
    for verse in verses:
        by_chapter.setdefault(verse.get("chapter"), []).append(verse)
    lines = [f"# {slug}", "", "OCR extract. `sanskrit_raw` is the engine text. Normalized lines differ only where the correction log says a change was applied.", ""]
    titles = {item["number"]: item.get("title") or "" for item in chapters}
    for chapter in sorted(by_chapter, key=lambda item: (item is None, item or 0)):
        title = titles.get(chapter) or "Untitled section"
        lines.append(f"## {title}")
        lines.append("")
        for verse in by_chapter[chapter]:
            number = verse.get("verse_number_raw") or verse.get("verse")
            lines.append(f"### {number}")
            lines.append("")
            lines.append(verse.get("sanskrit_devanagari") or verse.get("sanskrit_raw") or "")
            lines.append("")
            if verse.get("bhashya_hi"):
                lines.append(verse["bhashya_hi"])
                lines.append("")
            if verse.get("english"):
                lines.append(verse["english"])
                lines.append("")
            lines.append(
                f"page {verse.get('pdf_page')} · {verse.get('engine')} · confidence {verse.get('confidence')}"
            )
            lines.append("")
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")


def write_book_json(payload: dict, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def website_verses(slug: str, verses: list[dict], threshold: float) -> dict:
    exported = []
    for verse in verses:
        label = confidence_label(verse, threshold)
        flags = list(verse.get("flags") or [])
        if label == "needs_review" and "low OCR confidence" not in flags and isinstance(verse.get("confidence"), (int, float)):
            if verse["confidence"] < threshold:
                flags.append("low OCR confidence")
        exported.append({
            "verse_number_raw": verse.get("verse_number_raw") or "",
            "chapter": verse.get("chapter"),
            "verse": verse.get("verse"),
            "sanskrit_raw": verse.get("sanskrit_raw") or "",
            "sanskrit_devanagari": verse.get("sanskrit_devanagari") or "",
            "sanskrit_iast": verse.get("sanskrit_iast") or "",
            "padaccheda": verse.get("padaccheda") or "",
            "word_meanings": verse.get("word_meanings") or "",
            "bhashya_hi": verse.get("bhashya_hi") or "",
            "english": verse.get("english") or "",
            "ocr_confidence": label,
            "flags": flags,
            "corrections": verse.get("corrections") or [],
            "pdf_page": verse.get("pdf_page"),
            "engine": verse.get("engine"),
            "is_ai_assisted": False,
        })
    return {"slug": slug, "is_ai_assisted": False, "verses": exported}
