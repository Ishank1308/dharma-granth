"""
Command Line Interface (CLI) for Dharma Granth Scripture OCR Platform.
Provides commands for running, resuming, benchmarking, and reporting.
"""

import sys
import argparse
from pathlib import Path
from dharma_ocr.pipeline import DharmaOCRPipeline
from dharma_ocr.core.logger import console, setup_logger, get_logger
from dharma_ocr.core.checkpoint import CheckpointManager
from rich.panel import Panel

logger = get_logger()


def cmd_process(args):
    """Processes a scripture PDF or a folder of PDFs."""
    pdf_path = Path(args.pdf)
    if not pdf_path.exists():
        console.print(f"[bold red]Error: PDF not found at {pdf_path}[/bold red]")
        sys.exit(1)

    pipeline = DharmaOCRPipeline(config_path=Path(args.config) if args.config else None)

    pages = None
    if args.pages:
        # Parse page string e.g. "1-10" or "1,2,5,8"
        pages = []
        for part in args.pages.split(","):
            if "-" in part:
                start, end = map(int, part.split("-"))
                pages.extend(range(start, end + 1))
            else:
                pages.append(int(part))

    pipeline.process_pdf(
        pdf_path=str(pdf_path),
        pages=pages,
        title=args.title,
        max_workers=args.workers
    )


def cmd_resume(args):
    """Resumes an interrupted OCR run using saved checkpoint."""
    pdf_path = Path(args.pdf)
    if not pdf_path.exists():
        console.print(f"[bold red]Error: PDF not found at {pdf_path}[/bold red]")
        sys.exit(1)

    console.print(f"[bold yellow]Resuming OCR processing for {pdf_path.name}...[/bold yellow]")
    pipeline = DharmaOCRPipeline(config_path=Path(args.config) if args.config else None)
    pipeline.process_pdf(
        pdf_path=str(pdf_path),
        max_workers=args.workers
    )


def cmd_report(args):
    """Displays OCR quality metrics and statistics for an existing run."""
    report_file = Path(args.report_json)
    if not report_file.exists():
        console.print(f"[bold red]Report file not found: {report_file}[/bold red]")
        sys.exit(1)

    import json
    with open(report_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    console.print(Panel(
        f"[bold cyan]Scripture OCR Quality Metrics[/bold cyan]\n\n"
        f"• Average Confidence: [bold green]{data.get('average_confidence', 0)}%[/bold green]\n"
        f"• Estimated Accuracy: [bold green]{data.get('estimated_text_accuracy_percent', 0)}%[/bold green]\n"
        f"• Total Processed Pages: {data.get('processed_pages', 0)} / {data.get('total_pages', 0)}\n"
        f"• Detected Verses: {data.get('detected_verses_count', 0)}\n"
        f"• Detected Chapters: {data.get('detected_chapters_count', 0)}\n"
        f"• Processing Speed: {data.get('average_speed_sec_per_page', 0)} s/page\n"
        f"• Low Confidence Pages: {len(data.get('low_confidence_pages', []))}",
        title="Dharma Granth Audit",
        border_style="gold1"
    ))


def cmd_benchmark(args):
    """Benchmarks Tesseract against Surya OCR on target pages."""
    console.print(f"[bold cyan]Benchmarking OCR Engines on {args.pdf}...[/bold cyan]")
    pipeline = DharmaOCRPipeline(config_path=Path(args.config) if args.config else None)
    # Benchmark on page 1
    pipeline.process_pdf(
        pdf_path=args.pdf,
        pages=[1, 2],
        max_workers=1
    )


def main():
    parser = argparse.ArgumentParser(
        prog="dharma-ocr",
        description="Dharma Granth 100% Offline Sanskrit & Hindi Scripture OCR Platform"
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    # Process command
    p_proc = subparsers.add_parser("process", help="Process scripture PDF")
    p_proc.add_argument("pdf", help="Path to scanned scripture PDF")
    p_proc.add_argument("--config", "-c", help="Path to config.yaml", default=None)
    p_proc.add_argument("--title", "-t", help="Scripture book title override")
    p_proc.add_argument("--pages", "-p", help="Page range to process (e.g. '1-20' or '1,3,5')")
    p_proc.add_argument("--workers", "-w", type=int, help="Number of parallel worker processes")
    p_proc.set_defaults(func=cmd_process)

    # Resume command
    p_res = subparsers.add_parser("resume", help="Resume interrupted OCR job from checkpoint")
    p_res.add_argument("pdf", help="Path to scripture PDF")
    p_res.add_argument("--config", "-c", help="Path to config.yaml", default=None)
    p_res.add_argument("--workers", "-w", type=int, help="Number of worker processes")
    p_res.set_defaults(func=cmd_resume)

    # Report command
    p_rep = subparsers.add_parser("report", help="Inspect quality report for a processed book")
    p_rep.add_argument("report_json", help="Path to quality_report.json")
    p_rep.set_defaults(func=cmd_report)

    # Benchmark command
    p_bench = subparsers.add_parser("benchmark", help="Benchmark Tesseract vs Surya on sample pages")
    p_bench.add_argument("pdf", help="Path to scripture PDF")
    p_bench.add_argument("--config", "-c", help="Path to config.yaml", default=None)
    p_bench.set_defaults(func=cmd_benchmark)

    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
