"""One page: render, clean, recognize, checkpoint. Safe to run in a process pool."""

from __future__ import annotations

import json
import time
from pathlib import Path

from granth_ocr.engine_manager import recognize
from granth_ocr.hindi import suggest_hindi
from granth_ocr.preprocess import clean_page, rotate_right_angles
from granth_ocr.render import render_page
from granth_ocr.sanskrit import normalize_sanskrit
from granth_ocr.tesseract_engine import osd_quarter_turns


def process_page(job: dict) -> dict:
    started = time.perf_counter()
    cfg = job["cfg"]
    page = int(job["page"])
    work = Path(job["work"])
    raw_path = work / "images" / "raw" / f"page-{page}.png"
    clean_path = work / "images" / "clean" / f"page-{page}.png"
    record_path = work / "ocr" / f"page-{page}.json"
    checkpoint_path = work / "checkpoints" / f"page-{page}.json"
    try:
        render_page(job["pdf"], page, int(cfg["dpi"]), raw_path)
        quarter = None
        if cfg.get("orientation_correction"):
            quarter = osd_quarter_turns(raw_path, cfg)
            if quarter:
                rotate_right_angles(raw_path, quarter)
        metrics = clean_page(raw_path, clean_path, binarize=bool(cfg.get("binarize")))
        ocr = recognize(clean_path, cfg, float(metrics["score"]))
        mode = cfg["corrections"]["mode"]
        reorder = bool(cfg["corrections"].get("reorder_prebase_i", True))
        normalized, corrections, flags = normalize_sanskrit(
            ocr["text"], mode=mode, reorder_i=reorder,
        )
        hindi_text, hindi_log = suggest_hindi(
            normalized, mode=mode, indic=bool(cfg.get("indic_normalize")), lexical=False,
        )
        # Hindi layer returns the same string when it only adds suggestions.
        # IndicNLP, when enabled, may change normalized. Raw OCR stays on text_raw.
        if hindi_text != normalized:
            normalized = hindi_text
        corrections = corrections + [item for item in hindi_log if item not in corrections]
        if ocr["confidence"] < float(cfg["confidence_threshold"]):
            flags.append("low OCR confidence")
        record = {
            "source_pdf": Path(job["pdf"]).name,
            "pdf_page": page,
            "dpi": int(cfg["dpi"]),
            "engine": ocr["engine"],
            "psm": ocr.get("psm"),
            "oem": ocr.get("oem"),
            "confidence": ocr["confidence"],
            "quality": metrics,
            "orientation_quarter_turns": quarter,
            "seconds": round(time.perf_counter() - started, 2),
            "surya_attempted": ocr.get("surya_attempted", False),
            "surya_error": ocr.get("surya_error") or "",
            "attempts": ocr.get("attempts") or [],
            "text_raw": ocr["text"],
            "text_normalized": normalized,
            "corrections": corrections,
            "flags": flags,
            "words": ocr.get("words") or [],
            "raw_image": str(raw_path),
            "clean_image": str(clean_path),
        }
        record_path.parent.mkdir(parents=True, exist_ok=True)
        record_path.write_text(json.dumps(record, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        checkpoint = {
            "page": page,
            "status": "complete",
            "engine": record["engine"],
            "confidence": record["confidence"],
            "seconds": record["seconds"],
            "psm": record["psm"],
        }
        checkpoint_path.parent.mkdir(parents=True, exist_ok=True)
        checkpoint_path.write_text(json.dumps(checkpoint, indent=2) + "\n", encoding="utf-8")
        if not cfg.get("keep_raw_images") and raw_path.exists():
            raw_path.unlink()
            record["raw_image"] = ""
            record_path.write_text(json.dumps(record, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        return {"page": page, "status": "complete", "confidence": record["confidence"], "engine": record["engine"], "seconds": record["seconds"]}
    except Exception as exc:
        failure = {"page": page, "status": "failed", "error": str(exc), "seconds": round(time.perf_counter() - started, 2)}
        checkpoint_path.parent.mkdir(parents=True, exist_ok=True)
        checkpoint_path.write_text(json.dumps(failure, indent=2) + "\n", encoding="utf-8")
        return failure
