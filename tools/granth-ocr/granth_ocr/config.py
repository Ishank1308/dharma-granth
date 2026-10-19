"""Load config.yaml into a plain dict the workers can pickle."""

from __future__ import annotations

import os
from pathlib import Path

TOOL_ROOT = Path(__file__).resolve().parents[1]

DEFAULTS: dict = {
    "dpi": 600,
    "low_memory_dpi": 300,
    "languages": "san+hin",
    "oem": 1,
    "psm_strategy": "adaptive",
    "psm_modes": [3, 4, 6, 11],
    "primary_psm": 6,
    "confidence_threshold": 70.0,
    "quality_threshold": 0.35,
    "surya_enabled": True,
    "surya_offline": True,
    "workers": 1,
    "batch_size": 1,
    "low_memory": "auto",
    "keep_raw_images": True,
    "binarize": False,
    "orientation_correction": True,
    "osd_min_confidence": 15.0,
    "searchable_pdf": True,
    "indic_normalize": False,
    "corrections": {"mode": "suggest", "reorder_prebase_i": True},
}


def ram_gb() -> float:
    try:
        import ctypes

        class MEMORYSTATUSEX(ctypes.Structure):
            _fields_ = [
                ("dwLength", ctypes.c_ulong),
                ("dwMemoryLoad", ctypes.c_ulong),
                ("ullTotalPhys", ctypes.c_ulonglong),
                ("ullAvailPhys", ctypes.c_ulonglong),
                ("ullTotalPageFile", ctypes.c_ulonglong),
                ("ullAvailPageFile", ctypes.c_ulonglong),
                ("ullTotalVirtual", ctypes.c_ulonglong),
                ("ullAvailVirtual", ctypes.c_ulonglong),
                ("ullAvailExtendedVirtual", ctypes.c_ulonglong),
            ]

        stat = MEMORYSTATUSEX()
        stat.dwLength = ctypes.sizeof(MEMORYSTATUSEX)
        if not ctypes.windll.kernel32.GlobalMemoryStatusEx(ctypes.byref(stat)):
            return 16.0
        return stat.ullTotalPhys / (1024**3)
    except Exception:
        try:
            pages = os.sysconf("SC_PHYS_PAGES")
            size = os.sysconf("SC_PAGE_SIZE")
            return (pages * size) / (1024**3)
        except Exception:
            return 16.0


def load_config(path: Path | None) -> dict:
    cfg = {
        "dpi": DEFAULTS["dpi"],
        "low_memory_dpi": DEFAULTS["low_memory_dpi"],
        "languages": DEFAULTS["languages"],
        "oem": DEFAULTS["oem"],
        "psm_strategy": DEFAULTS["psm_strategy"],
        "psm_modes": list(DEFAULTS["psm_modes"]),
        "primary_psm": DEFAULTS["primary_psm"],
        "confidence_threshold": DEFAULTS["confidence_threshold"],
        "quality_threshold": DEFAULTS["quality_threshold"],
        "surya_enabled": DEFAULTS["surya_enabled"],
        "surya_offline": DEFAULTS["surya_offline"],
        "workers": DEFAULTS["workers"],
        "batch_size": DEFAULTS["batch_size"],
        "low_memory": DEFAULTS["low_memory"],
        "keep_raw_images": DEFAULTS["keep_raw_images"],
        "binarize": DEFAULTS["binarize"],
        "orientation_correction": DEFAULTS["orientation_correction"],
        "osd_min_confidence": DEFAULTS["osd_min_confidence"],
        "searchable_pdf": DEFAULTS["searchable_pdf"],
        "indic_normalize": DEFAULTS["indic_normalize"],
        "corrections": dict(DEFAULTS["corrections"]),
        "tesseract_cmd": os.environ.get("TESSERACT_CMD", r"C:\Program Files\Tesseract-OCR\tesseract.exe"),
        "tessdata_dir": os.environ.get("TESSDATA_DIR", ""),
    }
    if not cfg["tessdata_dir"]:
        user = Path.home() / "tessdata" / "san.traineddata"
        program = Path(r"C:\Program Files\Tesseract-OCR\tessdata")
        if user.exists():
            cfg["tessdata_dir"] = str(user.parent)
        elif (program / "san.traineddata").exists() or program.exists():
            cfg["tessdata_dir"] = str(program)
        else:
            cfg["tessdata_dir"] = str(Path.home() / "tessdata")
    if path is not None:
        try:
            import yaml
        except ImportError as exc:
            raise SystemExit("PyYAML is required: pip install -r requirements.txt") from exc
        loaded = yaml.safe_load(path.read_text(encoding="utf-8")) or {}
        corrections = loaded.pop("corrections", None)
        for key, value in loaded.items():
            if key in cfg and value is not None:
                cfg[key] = value
        if isinstance(corrections, dict):
            cfg["corrections"].update(corrections)
    return cfg


def apply_runtime(cfg: dict, *, low_memory_flag: bool) -> dict:
    """Narrow DPI and workers on small machines. Does not change correction mode."""
    ram = ram_gb()
    cfg["ram_gb"] = round(ram, 2)
    auto = cfg.get("low_memory") == "auto" and ram < 8
    forced = low_memory_flag or cfg.get("low_memory") is True or cfg.get("low_memory") == "on" or auto
    cfg["low_memory_active"] = bool(forced)
    if forced:
        cfg["dpi"] = min(int(cfg["dpi"]), int(cfg["low_memory_dpi"]))
        cfg["workers"] = 1
        cfg["keep_raw_images"] = False
        cfg["psm_strategy"] = "adaptive"
    cfg["workers"] = max(1, int(cfg["workers"]))
    cfg["dpi"] = max(72, min(600, int(cfg["dpi"])))
    return cfg
