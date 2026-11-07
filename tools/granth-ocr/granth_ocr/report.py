"""Book-level OCR report. Confidence is Tesseract's word mean, not a measured CER."""

from __future__ import annotations

import json
from collections import Counter
from pathlib import Path


def numbering_notes(verses: list[dict]) -> list[str]:
    notes: list[str] = []
    grouped: dict = {}
    for verse in verses:
        if verse.get("chapter") is None or verse.get("verse") is None:
            continue
        grouped.setdefault(verse["chapter"], []).append(verse["verse"])
    for chapter, numbers in sorted(grouped.items()):
        seen = set()
        for number in numbers:
            if number in seen:
                notes.append(f"chapter {chapter}: duplicate verse {number}")
            seen.add(number)
        ordered = sorted(seen)
        if len(ordered) < 4:
            continue
        highest = ordered[-1]
        if highest / len(ordered) >= 1.25:
            continue
        missing = [n for n in range(1, highest + 1) if n not in seen]
        if missing:
            shown = ", ".join(str(n) for n in missing[:12])
            notes.append(f"chapter {chapter}: skipped {shown}")
    return notes


def build_report(slug: str, pages: list[dict], verses: list[dict], chapters: list[dict], failures: list[dict], cfg: dict) -> dict:
    confs = [page["confidence"] for page in pages if isinstance(page.get("confidence"), (int, float))]
    engines = Counter(page.get("engine") or "unknown" for page in pages)
    seconds = sum(page.get("seconds") or 0 for page in pages)
    low = [
        {"page": page.get("pdf_page"), "confidence": page.get("confidence"), "engine": page.get("engine")}
        for page in pages
        if isinstance(page.get("confidence"), (int, float)) and page["confidence"] < float(cfg["confidence_threshold"])
    ]
    review = [verse for verse in verses if verse.get("flags") or (isinstance(verse.get("confidence"), (int, float)) and verse["confidence"] < float(cfg["confidence_threshold"]))]
    page_flags = [
        {"page": page.get("pdf_page"), "flags": page.get("flags") or []}
        for page in pages
        if page.get("flags")
    ]
    return {
        "slug": slug,
        "pages": len(pages),
        "verses": len(verses),
        "chapters": chapters,
        "mean_confidence": round(sum(confs) / len(confs), 2) if confs else None,
        "min_confidence": round(min(confs), 2) if confs else None,
        "engines": dict(engines),
        "seconds": round(seconds, 2),
        "pages_per_minute": round((len(pages) / seconds) * 60, 2) if seconds else None,
        "low_confidence_pages": low,
        "verses_needing_review": len(review),
        "page_flags": page_flags,
        "numbering": numbering_notes(verses),
        "failures": failures,
        "ram_gb": cfg.get("ram_gb"),
        "dpi": cfg.get("dpi"),
        "low_memory_active": cfg.get("low_memory_active"),
        "note": "mean_confidence is the mean of Tesseract word scores. It is not a character-error rate.",
    }


def write_report(payload: dict, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    lines = [
        f"# OCR report: {payload['slug']}",
        "",
        payload["note"],
        "",
        f"- Pages: {payload['pages']}",
        f"- Verses: {payload['verses']}",
        f"- Chapters: {len(payload['chapters'])}",
        f"- Mean confidence: {payload['mean_confidence']}",
        f"- Lowest page confidence: {payload['min_confidence']}",
        f"- Engines: {payload['engines']}",
        f"- Seconds: {payload['seconds']}",
        f"- Pages per minute: {payload['pages_per_minute']}",
        f"- DPI: {payload['dpi']}",
        f"- RAM GiB: {payload['ram_gb']}",
        f"- Low-memory mode: {payload['low_memory_active']}",
        f"- Verses needing review: {payload['verses_needing_review']}",
        "",
        "## Chapters",
        "",
    ]
    if not payload["chapters"]:
        lines.append("No chapter heading was detected.")
    for chapter in payload["chapters"]:
        lines.append(
            f"- {chapter.get('title')} — pages {chapter.get('page_start')}–{chapter.get('page_end')}, verses {chapter.get('verse_count')}"
        )
    lines.extend(["", "## Low-confidence pages", ""])
    if not payload["low_confidence_pages"]:
        lines.append("None under the configured threshold.")
    for page in payload["low_confidence_pages"]:
        lines.append(f"- page {page['page']}: {page['confidence']} ({page['engine']})")
    lines.extend(["", "## Page flags", ""])
    if not payload.get("page_flags"):
        lines.append("None.")
    for item in payload.get("page_flags") or []:
        lines.append(f"- page {item['page']}: {', '.join(item['flags'])}")
    lines.extend(["", "## Numbering", ""])
    if not payload["numbering"]:
        lines.append("No duplicate or dense-chapter gap was detected.")
    for note in payload["numbering"]:
        lines.append(f"- {note}")
    lines.extend(["", "## Failures", ""])
    if not payload["failures"]:
        lines.append("None.")
    for failure in payload["failures"]:
        lines.append(f"- page {failure.get('page')}: {failure.get('error')}")
    lines.append("")
    dest.write_text("\n".join(lines), encoding="utf-8")
    dest.with_suffix(".json").write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
