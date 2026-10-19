"""Pick a Tesseract PSM, then Surya only if the page is still weak."""

from __future__ import annotations

from pathlib import Path

from granth_ocr import surya_engine
from granth_ocr.tesseract_engine import recognize as tess_recognize


def _better(current: dict | None, nxt: dict) -> dict:
    if current is None:
        return nxt
    # Ignore sub-point noise so PSM 11 does not win on a tie.
    if nxt["confidence"] > current["confidence"] + 1.0:
        return nxt
    return current


def _run(image: Path, cfg: dict, psm: int) -> dict:
    try:
        return tess_recognize(image, cfg, psm)
    except RuntimeError:
        # One retry. A second failure is recorded as an empty attempt.
        return tess_recognize(image, cfg, psm)


def recognize(image: Path, cfg: dict, quality_score: float) -> dict:
    modes = [int(mode) for mode in cfg["psm_modes"]]
    primary = int(cfg["primary_psm"])
    if primary not in modes:
        modes = [primary, *modes]
    strategy = cfg.get("psm_strategy", "adaptive")
    threshold = float(cfg["confidence_threshold"])
    quality_floor = float(cfg["quality_threshold"])
    attempts: list[dict] = []

    def take(psm: int, best: dict | None) -> dict | None:
        result = _run(image, cfg, psm)
        attempts.append({"engine": "tesseract", "psm": psm, "confidence": result["confidence"]})
        return _better(best, result)

    best: dict | None = None
    if strategy == "sweep":
        for psm in modes:
            best = take(psm, best)
    else:
        best = take(primary, best)
        weak = best["confidence"] < threshold or quality_score < quality_floor
        if weak:
            for psm in modes:
                if psm == primary:
                    continue
                best = take(psm, best)

    assert best is not None
    surya_attempted = False
    surya_error = ""
    still_weak = best["confidence"] < threshold or quality_score < quality_floor
    if cfg.get("surya_enabled") and still_weak:
        surya_attempted = True
        surya = surya_engine.recognize(image, offline=bool(cfg.get("surya_offline", True)))
        if surya is None:
            surya_error = "surya not installed or weights missing"
            attempts.append({"engine": "surya", "psm": None, "confidence": None, "note": surya_error})
        elif surya.get("error"):
            surya_error = str(surya["error"])
            attempts.append({"engine": "surya", "psm": None, "confidence": None, "note": surya_error})
        else:
            attempts.append({"engine": "surya", "psm": None, "confidence": surya["confidence"]})
            if surya["confidence"] > best["confidence"] + 1.0 and surya.get("text"):
                best = surya
    best = dict(best)
    best["surya_attempted"] = surya_attempted
    best["surya_error"] = surya_error
    best["attempts"] = attempts
    return best
