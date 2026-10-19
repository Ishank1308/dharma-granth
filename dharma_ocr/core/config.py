"""
Configuration Manager for Dharma Granth OCR Pipeline.
Loads config.yaml, provides defaults, and validates execution environment.
"""

import os
import shutil
from pathlib import Path
from typing import Dict, Any, Optional
import yaml


DEFAULT_CONFIG_PATH = Path(__file__).resolve().parent.parent / "config.yaml"


class PipelineConfig:
    """Wrapper around YAML configuration with type-safe fallbacks."""

    def __init__(self, config_dict: Dict[str, Any], config_path: Optional[Path] = None):
        self._raw = config_dict
        self.config_path = config_path

    @classmethod
    def load(cls, path: Optional[Path] = None) -> "PipelineConfig":
        """Loads configuration from YAML file path."""
        target_path = Path(path) if path else DEFAULT_CONFIG_PATH
        if not target_path.exists():
            raise FileNotFoundError(f"Configuration file not found at: {target_path}")

        with open(target_path, "r", encoding="utf-8") as f:
            data = yaml.safe_load(f) or {}

        config = cls(data, target_path)
        config._auto_detect_binaries()
        return config

    def _auto_detect_binaries(self):
        """Auto-detect Tesseract executable if not explicitly configured or missing."""
        tess_cfg = self._raw.get("ocr_engines", {}).get("tesseract", {})
        configured_path = tess_cfg.get("executable_path")

        if configured_path and os.path.isfile(configured_path):
            return

        # Check standard Windows paths
        candidate_paths = [
            r"C:\Program Files\Tesseract-OCR\tesseract.exe",
            r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
            os.path.expanduser(r"~\AppData\Local\Programs\Tesseract-OCR\tesseract.exe"),
        ]

        # Check PATH
        path_binary = shutil.which("tesseract")
        if path_binary:
            candidate_paths.insert(0, path_binary)

        for candidate in candidate_paths:
            if candidate and os.path.isfile(candidate):
                tess_cfg["executable_path"] = candidate
                break

    # Property accessors
    @property
    def raw(self) -> Dict[str, Any]:
        return self._raw

    @property
    def workspace_dir(self) -> Path:
        p = Path(self._raw.get("pipeline", {}).get("workspace_dir", "./ocr_workspace"))
        p.mkdir(parents=True, exist_ok=True)
        return p

    @property
    def output_dir(self) -> Path:
        p = Path(self._raw.get("pipeline", {}).get("output_dir", "./ocr_output"))
        p.mkdir(parents=True, exist_ok=True)
        return p

    @property
    def rendering_dpi(self) -> int:
        return int(self._raw.get("rendering", {}).get("dpi", 600))

    @property
    def tesseract_executable(self) -> Optional[str]:
        return self._raw.get("ocr_engines", {}).get("tesseract", {}).get("executable_path")

    @property
    def tesseract_languages(self) -> str:
        return self._raw.get("ocr_engines", {}).get("tesseract", {}).get("languages", "san+hin")

    @property
    def tesseract_psms(self) -> list:
        return self._raw.get("ocr_engines", {}).get("tesseract", {}).get("test_psms", [3, 4, 6, 11])

    @property
    def confidence_threshold(self) -> float:
        return float(self._raw.get("ocr_engines", {}).get("tesseract", {}).get("confidence_threshold", 72.0))

    @property
    def max_workers(self) -> int:
        configured = self._raw.get("execution", {}).get("multiprocessing", {}).get("max_workers", 4)
        if configured == "auto" or configured is None:
            return max(1, (os.cpu_count() or 4) - 1)
        return int(configured)

    @property
    def low_memory_mode(self) -> bool:
        return bool(self._raw.get("execution", {}).get("low_memory_mode", False))

    @property
    def checkpoint_interval(self) -> int:
        return int(self._raw.get("execution", {}).get("checkpoint", {}).get("interval_pages", 5))

    def get(self, key: str, default: Any = None) -> Any:
        keys = key.split(".")
        val = self._raw
        for k in keys:
            if isinstance(val, dict) and k in val:
                val = val[k]
            else:
                return default
        return val
