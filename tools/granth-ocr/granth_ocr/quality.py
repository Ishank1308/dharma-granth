"""Page quality scores. The score is a routing signal, not a character-error rate."""

from __future__ import annotations

from pathlib import Path


def score_metrics(blur: float, contrast: float, ink: float) -> float:
    blur_n = max(0.0, min(1.0, blur / 400.0))
    contrast_n = max(0.0, min(1.0, contrast / 60.0))
    ink_n = 1.0 if 0.02 <= ink <= 0.45 else 0.3
    return round(0.5 * blur_n + 0.3 * contrast_n + 0.2 * ink_n, 4)


def measure_image(path: Path) -> dict:
    try:
        import cv2
        import numpy as np

        gray = cv2.imread(str(path), cv2.IMREAD_GRAYSCALE)
        if gray is None:
            raise RuntimeError("unreadable")
        blur = float(cv2.Laplacian(gray, cv2.CV_64F).var())
        contrast = float(gray.std())
        ink = float((gray < 180).mean())
    except Exception:
        blur, contrast, ink = _pillow_metrics(path)
    return {
        "blur": round(blur, 2),
        "contrast": round(contrast, 2),
        "ink": round(ink, 4),
        "score": score_metrics(blur, contrast, ink),
    }


def _pillow_metrics(path: Path) -> tuple[float, float, float]:
    from PIL import Image

    image = Image.open(path).convert("L")
    sample = image.resize((min(400, image.width), min(400, image.height)))
    pixels = list(sample.getdata())
    if not pixels:
        return 0.0, 0.0, 0.0
    mean = sum(pixels) / len(pixels)
    variance = sum((px - mean) ** 2 for px in pixels) / len(pixels)
    # A cheap gradient stand-in so a blank page scores below a printed page.
    width = sample.width
    grads = [abs(pixels[i] - pixels[i - 1]) for i in range(1, len(pixels)) if i % width != 0]
    blur = (sum(grads) / len(grads)) ** 2 if grads else 0.0
    ink = sum(1 for px in pixels if px < 180) / len(pixels)
    return blur, variance ** 0.5, ink
