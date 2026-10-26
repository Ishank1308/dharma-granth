"""Extract Griffith's Atharva Veda (1895-96, public domain), hymn by hymn, from the Global Grey PDF.

The PDF prints each hymn under a HYMN heading but without verse numbers or stanza breaks, so the English
can be matched to a hymn but not to its verses. scripts/seed-atharvaveda.mjs shows each hymn's English
once, with its first verse.

Prerequisite: scripts/cache/atharvaveda-griffith.pdf
  (https://www.globalgreyebooks.com/ebooks/ralph-t-h-griffith_hymns-of-the-atharva-veda.pdf)
  and PyMuPDF (pip install pymupdf).

Run: python scripts/extract-atharvaveda-griffith.py
Output: data/atharvaveda-griffith.json, {"hymns": {"12.1": "line\\nline…"}}. The first line is
Griffith's heading for the hymn where he gives one.
"""
from __future__ import annotations

import json
import re
from pathlib import Path

import pymupdf

ROOT = Path(__file__).resolve().parent.parent
PDF_PATH = ROOT / "scripts/cache/atharvaveda-griffith.pdf"
OUT_PATH = ROOT / "data/atharvaveda-griffith.json"

# Ends a printed line of verse; a line that does not end so was wrapped by the PDF layout.
LINE_END = re.compile(r"[.,;:!?—’”)\]]$")
LINE_START = re.compile(r"[A-Z0-9‘“\"(ĀĪŪṚṢŚ]")


def roman(numeral: str) -> int:
    values = {"I": 1, "V": 5, "X": 10, "L": 50, "C": 100}
    total = 0
    for i, ch in enumerate(numeral):
        value = values[ch]
        total += -value if i + 1 < len(numeral) and values[numeral[i + 1]] > value else value
    return total


def pdf_lines() -> list[tuple[float, float, str]]:
    """Every text line as (font size, right edge, text)."""
    lines = []
    with pymupdf.open(PDF_PATH) as doc:
        for page in doc:
            for block in page.get_text("dict")["blocks"]:
                for line in block.get("lines", []):
                    text = "".join(span["text"] for span in line["spans"]).strip()
                    if text:
                        lines.append((line["spans"][0]["size"], line["bbox"][2], text))
    return lines


def hymns() -> dict[str, list[tuple[float, str]]]:
    """Lines of each hymn, keyed "book.hymn". The table of contents before the second "Book I" is skipped."""
    out: dict[str, list[tuple[float, str]]] = {}
    book = hymn = None
    started = False
    for size, right, text in pdf_lines():
        if size > 20 and re.fullmatch(r"Book [IVXLC]+", text):
            book = roman(text.split()[1])
            started = started or book == 1
            hymn = None
            continue
        if not started or size < 10:  # page numbers are set small
            continue
        heading = re.fullmatch(r"HYMN ([IVXLC]+)", text)
        if heading:
            hymn = f"{book}.{roman(heading.group(1))}"
            out[hymn] = []
        elif hymn:
            out[hymn].append((right, text))
    return out


def join(lines: list[str]) -> list[str]:
    """Undo the PDF's line wrapping: a line continues unless it ends a clause and the next starts one."""
    out: list[str] = []
    buf = ""
    for i, text in enumerate(lines):
        if re.search(r"\w-$", buf):
            buf = buf[:-1] + text
        else:
            buf = f"{buf} {text}" if buf else text
        buf = re.sub(r"(\w)- (?=[a-z])", r"\1-", buf)
        nxt = lines[i + 1] if i + 1 < len(lines) else None
        if nxt is None or (LINE_END.search(buf) and LINE_START.match(nxt)):
            out.append(re.sub(r"\s+", " ", buf).strip())
            buf = ""
    return out


def hymn_text(lines: list[tuple[float, str]]) -> str:
    # The heading is the first line, carried on while it fills the line and the next starts lower-case.
    k = 1
    while k < len(lines) and lines[k - 1][0] > 470 and re.match(r"[a-z]", lines[k][1]):
        k += 1
    heading = re.sub(r"\s+", " ", " ".join(t for _, t in lines[:k])).strip()
    # The PDF's own editorial notes ("It appears that hymns 20-23 were omitted") are not Griffith's.
    body = [t for t in join([t for _, t in lines[k:]]) if not t.startswith("It appears that")]
    # Page markers of the printed edition ("p. a269") are left in the running text.
    return re.sub(r" ?\bp\. a?\d+\b ?", " ", "\n".join([heading, *body]))


def main() -> None:
    texts = {ref: hymn_text(lines) for ref, lines in hymns().items() if lines}
    # The edition drops the verses of 6.141 and the heading of 6.142, so the barley hymn (6.142) follows
    # the heading of 6.141 ("A blessing on cattle").
    texts["6.142"] = texts.pop("6.141").split("\n", 1)[1]
    note = (
        "R. T. H. Griffith, The Hymns of the Atharva-Veda (1895-96), public domain, from the Global Grey "
        "edition. One entry per hymn: the edition has no verse numbers, so the English is not split by verse. "
        "Regenerate with scripts/extract-atharvaveda-griffith.py."
    )
    ordered = dict(sorted(texts.items(), key=lambda kv: tuple(map(int, kv[0].split(".")))))
    OUT_PATH.write_text(
        json.dumps({"note": note, "hymns": ordered}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(f"wrote {OUT_PATH.relative_to(ROOT)}: {len(ordered)} hymns")


if __name__ == "__main__":
    main()
