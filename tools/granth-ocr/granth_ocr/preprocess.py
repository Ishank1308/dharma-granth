"""Clean a page image before OCR.

Default path is grayscale, deskew, border crop, background division, a 3x3
median, and CLAHE. Adaptive threshold and morphology run only when binarize
is on, because a hard threshold drops thin matras and Vedic svaras.
"""

from __future__ import annotations

from pathlib import Path

from granth_ocr.quality import measure_image


def clean_page(src: Path, dest: Path, *, binarize: bool, skew: bool = True) -> dict:
    dest.parent.mkdir(parents=True, exist_ok=True)
    try:
        import cv2
        import numpy as np
    except ImportError:
        _pillow_copy(src, dest)
        metrics = measure_image(dest)
        metrics["deskew_deg"] = 0.0
        metrics["opencv"] = False
        return metrics

    gray = cv2.imread(str(src), cv2.IMREAD_GRAYSCALE)
    if gray is None:
        raise RuntimeError(f"Could not read {src}")
    angle = 0.0
    if skew:
        gray, angle = _deskew(gray, cv2, np)
    gray = _crop_borders(gray, np)
    gray = _divide_background(gray, cv2, np)
    gray = cv2.medianBlur(gray, 3)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    gray = clahe.apply(gray)
    if binarize:
        gray = cv2.adaptiveThreshold(
            gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 31, 11,
        )
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2))
        gray = cv2.morphologyEx(gray, cv2.MORPH_OPEN, kernel)
    cv2.imwrite(str(dest), gray)
    metrics = measure_image(dest)
    metrics["deskew_deg"] = round(angle, 3)
    metrics["opencv"] = True
    metrics["binarized"] = binarize
    return metrics


def rotate_right_angles(src: Path, quarter_turns: int) -> None:
    """quarter_turns is clockwise. 0 leaves the file alone."""
    turns = quarter_turns % 4
    if turns == 0:
        return
    try:
        import cv2

        image = cv2.imread(str(src), cv2.IMREAD_GRAYSCALE)
        if image is None:
            return
        code = {1: cv2.ROTATE_90_CLOCKWISE, 2: cv2.ROTATE_180, 3: cv2.ROTATE_90_COUNTERCLOCKWISE}[turns]
        cv2.imwrite(str(src), cv2.rotate(image, code))
    except ImportError:
        from PIL import Image

        with Image.open(src) as image:
            # PIL rotate() is counter-clockwise.
            image.rotate(-90 * turns, expand=True).save(src)


def _deskew(gray, cv2, np):
    blur = cv2.GaussianBlur(gray, (5, 5), 0)
    thr = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)[1]
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (30, 5))
    thr = cv2.dilate(thr, kernel, iterations=1)
    coords = cv2.findNonZero(thr)
    if coords is None or len(coords) < 200:
        return gray, 0.0
    angle = cv2.minAreaRect(coords)[-1]
    if angle < -45:
        angle = 90 + angle
    if abs(angle) < 0.4 or abs(angle) > 10:
        return gray, 0.0
    height, width = gray.shape[:2]
    matrix = cv2.getRotationMatrix2D((width / 2, height / 2), angle, 1.0)
    rotated = cv2.warpAffine(
        gray, matrix, (width, height), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE,
    )
    return rotated, float(angle)


def _crop_borders(gray, np):
    ink = gray < 200
    rows = np.where(ink.any(axis=1))[0]
    cols = np.where(ink.any(axis=0))[0]
    if rows.size == 0 or cols.size == 0:
        return gray
    margin = 16
    y0 = max(0, int(rows[0]) - margin)
    y1 = min(gray.shape[0], int(rows[-1]) + margin + 1)
    x0 = max(0, int(cols[0]) - margin)
    x1 = min(gray.shape[1], int(cols[-1]) + margin + 1)
    cropped = gray[y0:y1, x0:x1]
    if cropped.size < gray.size * 0.6:
        return gray
    return cropped


def _divide_background(gray, cv2, np):
    background = cv2.medianBlur(gray, 31)
    background = np.maximum(background, 1)
    return cv2.divide(gray, background, scale=255)


def _pillow_copy(src: Path, dest: Path) -> None:
    from PIL import Image, ImageOps

    with Image.open(src) as image:
        ImageOps.autocontrast(image.convert("L")).save(dest)
