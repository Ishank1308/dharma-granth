"""
Parallel Batch Processing and Memory Management Architecture.
Employs ProcessPoolExecutor with batch chunking, low-memory throttling, and periodic checkpointing.
"""

import os
import gc
import time
from pathlib import Path
from concurrent.futures import ProcessPoolExecutor, as_completed
from typing import List, Callable, Optional, Dict, Any

from dharma_ocr.core.schemas import PageRecord
from dharma_ocr.core.checkpoint import CheckpointManager
from dharma_ocr.core.logger import get_logger, console
from rich.progress import Progress, SpinnerColumn, BarColumn, TextColumn, TimeRemainingColumn

logger = get_logger()


def _worker_process_single_page(args: Dict[str, Any]) -> PageRecord:
    """
    Top-level picklable worker function for multiprocessing on Windows and Linux.
    Executes: rendering -> preprocessing -> OCR routing -> postprocessing -> verse extraction.
    """
    import os
    os.environ["OMP_NUM_THREADS"] = "1"
    os.environ["OPENBLAS_NUM_THREADS"] = "1"
    os.environ["MKL_NUM_THREADS"] = "1"
    os.environ["VECLIB_MAXIMUM_THREADS"] = "1"
    os.environ["NUMEXPR_NUM_THREADS"] = "1"

    pdf_path = args["pdf_path"]
    page_number = args["page_number"]
    config = args["config"]
    workspace_dir = Path(args["workspace_dir"])

    from dharma_ocr.preprocessing.pdf_converter import PDFConverter
    from dharma_ocr.preprocessing.preprocessor import ImagePreprocessor
    from dharma_ocr.engines.engine_manager import OCREngineManager
    from dharma_ocr.postprocessing.sanskrit_corrector import SanskritCorrector
    from dharma_ocr.postprocessing.hindi_corrector import HindiCorrector
    from dharma_ocr.postprocessing.chapter_detector import ChapterDetector
    from dharma_ocr.postprocessing.verse_extractor import VerseExtractor

    try:
        # 1. Render page image
        converter = PDFConverter(
            dpi=config.get("rendering", {}).get("dpi", 600),
            output_dir=workspace_dir / "extracted_images"
        )
        raw_image_path = converter.render_page(pdf_path, page_number)

        # 2. Preprocessing
        preprocessor = ImagePreprocessor(
            config.get("preprocessing", {}),
            output_dir=workspace_dir / "cleaned_images"
        )
        cleaned_image_path, quality_metrics = preprocessor.process(raw_image_path, page_number)

        # 3. Hybrid OCR Routing
        engine_mgr = OCREngineManager(config)
        ocr_result = engine_mgr.process_page(cleaned_image_path, quality_metrics, page_number)

        # 4. Post-processing corrections
        sanskrit_corr = SanskritCorrector(config.get("sanskrit_correction", {}))
        hindi_corr = HindiCorrector(config.get("hindi_correction", {}))

        text_sanskrit, warnings_sa = sanskrit_corr.correct(ocr_result.raw_text)
        final_normalized, warnings_hi = hindi_corr.correct(text_sanskrit)
        warnings = warnings_sa + warnings_hi

        # 5. Chapter Header Detection
        ch_detector = ChapterDetector(config.get("chapter_extraction", {}).get("hierarchies"))
        ch_num = None
        ch_title = None
        for line in final_normalized.splitlines()[:5]:  # Look in first few lines for header
            header = ch_detector.detect_chapter_header(line)
            if header:
                ch_num, ch_title, _ = header
                break

        # 6. Verse Extraction
        verse_ext = VerseExtractor(config.get("verse_extraction", {}))
        verses, _ = verse_ext.parse_page_content(final_normalized, page_number, current_chapter=ch_num or 1)

        # In low memory mode or clean_temp_images, remove intermediate images to conserve disk space
        if config.get("execution", {}).get("low_memory_mode", False) or config.get("pipeline", {}).get("clean_temp_images", False):
            try:
                if raw_image_path.exists():
                    raw_image_path.unlink()
            except Exception:
                pass
            try:
                if cleaned_image_path.exists():
                    cleaned_image_path.unlink()
            except Exception:
                pass

        return PageRecord(
            page_number=page_number,
            source_pdf=pdf_path,
            image_path=str(raw_image_path),
            cleaned_image_path=str(cleaned_image_path),
            quality_metrics=quality_metrics,
            ocr_result=ocr_result,
            normalized_text=final_normalized,
            detected_chapter_title=ch_title,
            detected_chapter_num=ch_num,
            verses_on_page=verses,
            warnings=warnings,
            status="processed"
        )
    except Exception as e:
        logger.error(f"Page {page_number} processing failed: {e}")
        return PageRecord(
            page_number=page_number,
            source_pdf=pdf_path,
            status="failed",
            error_message=str(e)
        )


class ParallelBatchExecutor:
    """
    Coordinates multi-process worker pools with batching and memory management.
    """

    def __init__(
        self,
        config: Dict[str, Any],
        checkpoint: CheckpointManager,
        max_workers: Optional[int] = None
    ):
        self.config = config
        self.checkpoint = checkpoint
        self.batch_size = int(config.get("execution", {}).get("batch_size", 15))
        self.low_memory_mode = bool(config.get("execution", {}).get("low_memory_mode", False))

        # Memory detection
        try:
            import psutil
            total_ram_gb = psutil.virtual_memory().total / (1024 ** 3)
            if total_ram_gb < 8.0:
                logger.warning(
                    f"System RAM ({total_ram_gb:.1f} GB) is below 8 GB. Auto-activating [bold yellow]Low Memory Mode[/bold yellow]."
                )
                self.low_memory_mode = True
        except ImportError:
            pass

        if max_workers:
            self.workers = max_workers
        elif self.low_memory_mode:
            self.workers = min(4, max(1, (os.cpu_count() or 2) - 1))
        else:
            self.workers = os.cpu_count() or 12

        logger.info(
            f"Execution Config: Workers: [bold cyan]{self.workers}[/bold cyan] | "
            f"Batch Size: [bold cyan]{self.batch_size}[/bold cyan] | "
            f"Low Memory Mode: [bold cyan]{self.low_memory_mode}[/bold cyan]"
        )

    def execute(
        self,
        pdf_path: str,
        page_numbers: List[int],
        workspace_dir: Path
    ) -> List[PageRecord]:
        """
        Executes parallel processing across requested page numbers via a persistent worker pool.
        Commits checkpoints incrementally every 5 completed pages.
        """
        results: List[PageRecord] = []
        pending_pages = [p for p in page_numbers if not self.checkpoint.is_page_completed(p)]

        logger.info(
            f"Processing: [bold green]{len(pending_pages)}[/bold green] pending pages "
            f"({len(page_numbers) - len(pending_pages)} skipped via checkpoint)"
        )

        if not pending_pages:
            return self.checkpoint.get_completed_records()

        tasks = [
            {
                "pdf_path": pdf_path,
                "page_number": p,
                "config": self.config,
                "workspace_dir": str(workspace_dir)
            }
            for p in pending_pages
        ]

        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            BarColumn(complete_style="bold green", finished_style="bold gold1"),
            TextColumn("[progress.percentage]{task.percentage:>3.0f}%"),
            TimeRemainingColumn(),
            console=console
        ) as progress:
            total_task = progress.add_task("Digitizing Scripture...", total=len(pending_pages))

            completed_since_commit = 0
            with ProcessPoolExecutor(max_workers=self.workers) as executor:
                futures = {executor.submit(_worker_process_single_page, t): t["page_number"] for t in tasks}

                for future in as_completed(futures):
                    p_num = futures[future]
                    try:
                        record = future.result()
                        if record.status == "processed":
                            self.checkpoint.save_page(record)
                            results.append(record)
                        else:
                            self.checkpoint.record_failure(p_num, record.error_message or "Unknown error")
                    except Exception as e:
                        logger.error(f"Worker failure on page {p_num}: {e}")
                        self.checkpoint.record_failure(p_num, str(e))

                    progress.update(total_task, advance=1)
                    completed_since_commit += 1
                    if completed_since_commit >= 5:
                        self.checkpoint.commit()
                        completed_since_commit = 0

            # Final commit and garbage collection
            self.checkpoint.commit()
            gc.collect()

        # Combine previously completed records with freshly processed records
        return self.checkpoint.get_completed_records()
