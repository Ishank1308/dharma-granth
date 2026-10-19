"""Optional local Surya fallback.

Weights are not downloaded here. With surya_offline true, Hugging Face hub
lookups are disabled. A missing install or missing weight file returns None
and the Tesseract result stands.
"""

from __future__ import annotations

import os
from pathlib import Path


def available() -> bool:
    try:
        import surya  # noqa: F401
        return True
    except ImportError:
        return False


def recognize(image: Path, *, offline: bool) -> dict | None:
    if offline:
        os.environ.setdefault("HF_HUB_OFFLINE", "1")
        os.environ.setdefault("TRANSFORMERS_OFFLINE", "1")
    try:
        from PIL import Image
        from surya.detection import DetectionPredictor
        from surya.recognition import RecognitionPredictor
    except ImportError:
        return None
    try:
        detector = DetectionPredictor()
        reader = RecognitionPredictor()
        predictions = reader([Image.open(image).convert("RGB")], det_predictor=detector)
    except Exception as exc:
        return {"engine": "surya", "error": str(exc), "text": "", "confidence": 0.0, "words": [], "psm": None}
    page = predictions[0] if predictions else None
    lines = getattr(page, "text_lines", None) or []
    texts: list[str] = []
    confs: list[float] = []
    for line in lines:
        text = (getattr(line, "text", "") or "").strip()
        if text:
            texts.append(text)
        conf = getattr(line, "confidence", None)
        if isinstance(conf, (int, float)):
            value = float(conf)
            confs.append(value * 100 if value <= 1 else value)
    if not texts:
        return None
    return {
        "engine": "surya",
        "psm": None,
        "oem": None,
        "text": "\n".join(texts),
        "confidence": round(sum(confs) / len(confs), 2) if confs else 0.0,
        "words": [],
        "stderr": "",
    }
