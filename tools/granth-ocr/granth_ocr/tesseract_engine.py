"""Tesseract san+hin with OEM 1. Word boxes come from TSV column 11."""

from __future__ import annotations

import os
from pathlib import Path
from subprocess import run


def _ensure_tsv_config(tessdata: str) -> None:
    folder = Path(tessdata) / "configs"
    target = folder / "tsv"
    if target.exists():
        return
    folder.mkdir(parents=True, exist_ok=True)
    target.write_text("tessedit_create_tsv 1\n", encoding="utf-8")


def osd_quarter_turns(image: Path, cfg: dict) -> int | None:
    """Return clockwise quarter-turns if OSD is confident. None means leave the page."""
    exe = cfg["tesseract_cmd"]
    if not Path(exe).exists():
        return None
    proc = run(
        [exe, str(image), "stdout", "--psm", "0", "-l", "osd", "--tessdata-dir", cfg["tessdata_dir"]],
        capture_output=True, text=True, encoding="utf-8", errors="replace",
    )
    rotate = None
    confidence = 0.0
    for line in (proc.stdout or "").splitlines():
        if line.lower().startswith("rotate:"):
            try:
                rotate = int(line.split(":", 1)[1].strip())
            except ValueError:
                rotate = None
        if "orientation confidence:" in line.lower():
            try:
                confidence = float(line.split(":", 1)[1].strip())
            except ValueError:
                confidence = 0.0
    if rotate not in (90, 180, 270):
        return None
    if confidence < float(cfg.get("osd_min_confidence", 15)):
        return None
    return rotate // 90


def recognize(image: Path, cfg: dict, psm: int) -> dict:
    exe = cfg["tesseract_cmd"]
    if not Path(exe).exists():
        raise RuntimeError(f"Tesseract not found at {exe}. Set TESSERACT_CMD.")
    tessdata = cfg["tessdata_dir"]
    _ensure_tsv_config(tessdata)
    env = os.environ.copy()
    env["TESSDATA_PREFIX"] = tessdata
    command = [
        exe, str(image), "stdout",
        "-l", cfg["languages"],
        "--oem", str(cfg["oem"]),
        "--psm", str(psm),
        "--tessdata-dir", tessdata,
        "-c", "tessedit_create_tsv=1",
        "tsv",
    ]
    proc = run(command, capture_output=True, text=True, encoding="utf-8", errors="replace", env=env)
    if proc.returncode != 0:
        err = (proc.stderr or "").strip()
        raise RuntimeError(f"Tesseract PSM {psm} failed: {err[:400]}")
    words, lines = _parse_tsv(proc.stdout or "")
    confs = [word["conf"] for word in words if word["conf"] >= 0 and word["text"]]
    text = "\n".join(lines).strip()
    mean = sum(confs) / len(confs) if confs else 0.0
    return {
        "engine": "tesseract",
        "psm": psm,
        "oem": int(cfg["oem"]),
        "text": text,
        "confidence": round(mean, 2),
        "words": words,
        "stderr": (proc.stderr or "").strip(),
    }


def _parse_tsv(raw: str) -> tuple[list[dict], list[str]]:
    rows = raw.splitlines()
    words: list[dict] = []
    line_parts: dict[tuple, list[str]] = {}
    for row in rows[1:]:
        cells = row.split("\t")
        if len(cells) < 12:
            continue
        try:
            level = int(cells[0])
            left, top, width, height = (int(cells[6]), int(cells[7]), int(cells[8]), int(cells[9]))
            conf = float(cells[10])
        except ValueError:
            continue
        text = cells[11].strip()
        if level != 5 or not text or conf < 0:
            continue
        words.append({"text": text, "conf": conf, "bbox": [left, top, width, height]})
        key = (cells[1], cells[2], cells[3], cells[4])
        line_parts.setdefault(key, []).append(text)
    lines = [" ".join(line_parts[key]) for key in line_parts]
    return words, lines
