"""
Master Orchestration Pipeline for Dharma Granth Scripture OCR.
Coordinates high-DPI rasterization, image cleaning, hybrid OCR, philological post-processing,
chapter segmentation, shloka stitching, PDF/A generation, and multi-format exports.
"""

import os
import time
from datetime import datetime
from pathlib import Path
from typing import Optional, List, Dict, Any

from dharma_ocr.core.config import PipelineConfig
from dharma_ocr.core.logger import setup_logger, get_logger, console
from dharma_ocr.core.checkpoint import CheckpointManager
from dharma_ocr.core.schemas import BookScriptureDocument, PageRecord
from dharma_ocr.core.quality_scorer import ScriptureQualityScorer
from dharma_ocr.preprocessing.pdf_converter import PDFConverter
from dharma_ocr.postprocessing.chapter_detector import ChapterDetector
from dharma_ocr.postprocessing.verse_extractor import VerseExtractor
from dharma_ocr.export.pdf_generator import SearchablePDFGenerator
from dharma_ocr.export.markdown_exporter import MarkdownExporter
from dharma_ocr.export.json_exporter import JSONExporter
from dharma_ocr.export.report_generator import ReportGenerator
from dharma_ocr.execution.parallel_executor import ParallelBatchExecutor

logger = get_logger()


class DharmaOCRPipeline:
    """
    Industrial-grade offline scripture digitization platform.
    Processes scanned Devanagari PDFs from 100 to 5000+ pages with fault tolerance.
    """

    def __init__(self, config_path: Optional[Path] = None):
        self.config = PipelineConfig.load(config_path)
        self.workspace_dir = self.config.workspace_dir
        self.output_dir = self.config.output_dir

        # Initialize logging
        setup_logger(
            log_dir=self.workspace_dir / "logs",
            level=self.config.get("execution.logging.level", "INFO"),
            rich_console=self.config.get("execution.logging.rich_console", True)
        )

        logger.info("[bold gold1]==================================================[/bold gold1]")
        logger.info("[bold gold1]   DHARMA GRANTH SCRIPTURE OCR PLATFORM v2.0     [/bold gold1]")
        logger.info("[bold gold1]   100% Offline | Hybrid Tesseract + Surya OCR    [/bold gold1]")
        logger.info("[bold gold1]==================================================[/bold gold1]")

    def process_pdf(
        self,
        pdf_path: str,
        pages: Optional[List[int]] = None,
        title: Optional[str] = None,
        max_workers: Optional[int] = None
    ) -> BookScriptureDocument:
        """
        Processes a full scripture PDF through all extraction and export stages.
        """
        start_time = time.time()
        pdf_file = Path(pdf_path).resolve()
        if not pdf_file.exists():
            raise FileNotFoundError(f"Scripture PDF file not found: {pdf_file}")

        scripture_title = title or pdf_file.stem.replace("-", " ").replace("_", " ").title()
        slug = pdf_file.stem.lower().replace(" ", "-")

        logger.info(f"Target Scripture: [bold cyan]{scripture_title}[/bold cyan] ({pdf_file.name})")

        # Step 1: Ingest PDF & determine page count
        converter = PDFConverter(dpi=self.config.rendering_dpi, output_dir=self.workspace_dir / "extracted_images")
        total_pdf_pages = converter.get_page_count(str(pdf_file))
        if total_pdf_pages <= 0:
            raise ValueError(f"Could not read valid pages from PDF: {pdf_file}")

        target_pages = pages if pages else list(range(1, total_pdf_pages + 1))
        logger.info(f"Total Document Pages: {total_pdf_pages} | Queued for OCR: {len(target_pages)}")

        # Step 2: Initialize / Resume Checkpoint
        checkpoint = CheckpointManager(
            checkpoint_dir=self.workspace_dir / "checkpoints",
            checkpoint_file=f"{slug}_checkpoint.json"
        )
        checkpoint.initialize_job(str(pdf_file), total_pdf_pages)

        # Step 3: Parallel Processing Execution
        executor = ParallelBatchExecutor(
            config=self.config.raw,
            checkpoint=checkpoint,
            max_workers=max_workers or self.config.max_workers
        )
        page_records = executor.execute(
            pdf_path=str(pdf_file),
            page_numbers=target_pages,
            workspace_dir=self.workspace_dir
        )

        # Step 4: Sorting & Post-OCR Chapter / Verse Synthesis
        logger.info("Synthesizing chapters, stanzas, and cross-page verse boundaries...")
        page_records.sort(key=lambda r: r.page_number)

        # Build Chapters
        ch_detector = ChapterDetector(self.config.get("chapter_extraction.hierarchies"))
        chapters = ch_detector.build_chapters(page_records, total_pdf_pages)

        # Extract & Stitch Verses
        verse_ext = VerseExtractor(self.config.get("verse_extraction", {}))
        all_verses = []
        for r in page_records:
            all_verses.extend(r.verses_on_page)

        # Step 5: Quality Assessment & Metrics
        scorer = ScriptureQualityScorer()
        total_time_sec = time.time() - start_time
        quality_rep = scorer.generate_book_quality_report(
            records=page_records,
            total_time_sec=total_time_sec,
            detected_chapters_count=len(chapters),
            detected_verses_count=len(all_verses)
        )

        # Build Master Document
        doc = BookScriptureDocument(
            schema_version="2.0.0",
            title=scripture_title,
            slug=slug,
            source_file=str(pdf_file),
            total_pages=total_pdf_pages,
            processed_pages=len(page_records),
            created_at=datetime.utcnow().isoformat() + "Z",
            config_summary={
                "dpi": self.config.rendering_dpi,
                "strategy": self.config.get("ocr_engines.routing_strategy"),
                "tesseract_psms": self.config.tesseract_psms,
                "confidence_threshold": self.config.confidence_threshold
            },
            quality_report=quality_rep,
            chapters=chapters,
            standalone_verses=[v for v in all_verses if not chapters] if not chapters else [],
            unassigned_text=[]
        )

        # Step 6: Exports Generation
        scripture_out_dir = self.output_dir / slug
        scripture_out_dir.mkdir(parents=True, exist_ok=True)
        logger.info(f"Generating publication exports into [bold cyan]{scripture_out_dir}[/bold cyan]...")

        # 6a. Plain TXT
        if self.config.get("exports.txt.enabled", True):
            txt_path = scripture_out_dir / f"{slug}.txt"
            with open(txt_path, "w", encoding="utf-8") as f:
                for r in page_records:
                    f.write(f"--- [Page {r.page_number}] ---\n")
                    f.write(r.normalized_text + "\n\n")

        # 6b. Markdown
        if self.config.get("exports.markdown.enabled", True):
            md_exporter = MarkdownExporter()
            md_exporter.export(doc, scripture_out_dir / f"{slug}.md")

        # 6c. JSON & RAG Chunks
        if self.config.get("exports.json.enabled", True):
            json_exporter = JSONExporter()
            json_exporter.export(doc, scripture_out_dir / f"{slug}.json")

        # 6d. Searchable PDF
        if self.config.get("exports.searchable_pdf.enabled", True):
            pdf_gen = SearchablePDFGenerator(tesseract_path=self.config.tesseract_executable)
            pdf_gen.generate(
                source_pdf=pdf_file,
                page_records=page_records,
                output_pdf=scripture_out_dir / f"{slug}_searchable.pdf",
                languages=self.config.tesseract_languages
            )

        # 6e. Quality Reports (HTML, MD, JSON)
        report_gen = ReportGenerator()
        report_gen.generate(doc, scripture_out_dir / "reports")

        logger.info(f"[bold green]✓ Pipeline completed successfully in {total_time_sec:.1f}s![/bold green]")
        return doc
