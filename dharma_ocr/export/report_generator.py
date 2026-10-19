"""
OCR Quality & Statistical Report Generator.
Generates responsive dark-themed HTML dashboards, Markdown summaries, and JSON metrics.
"""

import json
from pathlib import Path
from dharma_ocr.core.schemas import OCRQualityReport, BookScriptureDocument
from dharma_ocr.core.logger import get_logger, console
from rich.table import Table
from rich.panel import Panel

logger = get_logger()


class ReportGenerator:
    """Generates visual and machine-readable OCR performance and accuracy reports."""

    def generate(self, doc: BookScriptureDocument, output_dir: Path):
        output_dir = Path(output_dir)
        output_dir.mkdir(parents=True, exist_ok=True)

        rep = doc.quality_report

        # 1. Print Rich Terminal Summary
        self.print_terminal_summary(doc)

        # 2. Markdown Report
        md_path = output_dir / "quality_report.md"
        self._generate_markdown(doc, md_path)

        # 3. HTML Dashboard
        html_path = output_dir / "quality_report.html"
        self._generate_html(doc, html_path)

        # 4. JSON Report
        json_path = output_dir / "quality_report.json"
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(rep.model_dump(), f, ensure_ascii=False, indent=2)

        logger.info(f"Quality reports written to: {output_dir}")

    def print_terminal_summary(self, doc: BookScriptureDocument):
        """Displays formatted Rich KPI summary table in console."""
        rep = doc.quality_report

        table = Table(title="📊 Dharma Granth OCR Quality & Performance Summary", show_header=True)
        table.add_column("Metric", style="cyan", no_wrap=True)
        table.add_column("Value", style="bold green")

        table.add_row("Scripture Title", doc.title)
        table.add_row("Total Pages Processed", f"{doc.processed_pages} / {doc.total_pages}")
        table.add_row("Average OCR Confidence", f"{rep.average_confidence}%")
        table.add_row("Estimated Text Accuracy", f"{rep.estimated_text_accuracy_percent}%")
        table.add_row("Total Processing Time", f"{rep.total_processing_time_sec:.1f}s")
        table.add_row("Average Speed", f"{rep.average_speed_sec_per_page:.2f} s/page")
        table.add_row("Detected Chapters", str(rep.detected_chapters_count))
        table.add_row("Extracted Verses", str(rep.detected_verses_count))
        table.add_row(
            "Engine Distribution",
            f"Tesseract: {rep.engine_selection_distribution.get('tesseract', 0)} | "
            f"Surya: {rep.engine_selection_distribution.get('surya', 0)}"
        )
        table.add_row("Low Confidence Pages (<50%)", str(len(rep.low_confidence_pages)))

        console.print(Panel(table, expand=False, border_style="bold gold1"))

    def _generate_markdown(self, doc: BookScriptureDocument, path: Path):
        rep = doc.quality_report
        lines = [
            f"# OCR Quality & Preservation Report: {doc.title}",
            "",
            f"- **Source PDF:** `{doc.source_file}`",
            f"- **Processed Pages:** {doc.processed_pages} of {doc.total_pages}",
            f"- **Average OCR Confidence:** {rep.average_confidence}%",
            f"- **Estimated Text Accuracy:** {rep.estimated_text_accuracy_percent}%",
            f"- **Processing Speed:** {rep.average_speed_sec_per_page} seconds / page",
            f"- **Total Duration:** {rep.total_processing_time_sec:.1f} seconds",
            f"- **Detected Chapters:** {rep.detected_chapters_count}",
            f"- **Detected Verses (Shlokas):** {rep.detected_verses_count}",
            "",
            "## Engine Selection Distribution",
            f"- **Tesseract (san+hin LSTM):** {rep.engine_selection_distribution.get('tesseract', 0)} pages",
            f"- **Surya (Transformer Fallback):** {rep.engine_selection_distribution.get('surya', 0)} pages",
            "",
            "## Confidence Distribution Histogram",
            f"- **90% - 100%:** {rep.confidence_histogram.get('90-100', 0)} pages",
            f"- **75% - 89%:** {rep.confidence_histogram.get('75-89', 0)} pages",
            f"- **50% - 74%:** {rep.confidence_histogram.get('50-74', 0)} pages",
            f"- **Below 50% (Flagged):** {rep.confidence_histogram.get('below-50', 0)} pages",
            "",
            "## Flagged Low-Confidence Pages",
            f"Pages requiring manual review: `{rep.low_confidence_pages}`" if rep.low_confidence_pages else "No critical low-confidence pages detected."
        ]
        with open(path, "w", encoding="utf-8") as f:
            f.write("\n".join(lines))

    def _generate_html(self, doc: BookScriptureDocument, path: Path):
        rep = doc.quality_report
        html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>OCR Quality Dashboard - {doc.title}</title>
  <style>
    body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 2rem; }}
    .container {{ max-width: 1000px; margin: 0 auto; }}
    h1 {{ color: #f59e0b; font-size: 2rem; margin-bottom: 0.5rem; }}
    .subtitle {{ color: #94a3b8; margin-bottom: 2rem; }}
    .grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }}
    .card {{ background: #1e293b; padding: 1.5rem; border-radius: 12px; border: 1px solid #334155; }}
    .card-title {{ font-size: 0.875rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; }}
    .card-value {{ font-size: 2rem; font-weight: bold; color: #38bdf8; margin-top: 0.5rem; }}
    .card-value.accent {{ color: #10b981; }}
    .card-value.warn {{ color: #f59e0b; }}
    .section {{ background: #1e293b; padding: 1.5rem; border-radius: 12px; border: 1px solid #334155; margin-bottom: 2rem; }}
    .section-title {{ font-size: 1.25rem; color: #f8fafc; margin-top: 0; margin-bottom: 1rem; border-bottom: 1px solid #334155; padding-bottom: 0.5rem; }}
    .bar-row {{ display: flex; align-items: center; margin-bottom: 0.75rem; }}
    .bar-label {{ width: 140px; color: #cbd5e1; }}
    .bar-outer {{ flex: 1; background: #334155; height: 18px; border-radius: 9px; overflow: hidden; margin: 0 1rem; }}
    .bar-inner {{ height: 100%; background: #38bdf8; }}
    .bar-count {{ width: 50px; text-align: right; color: #94a3b8; font-weight: bold; }}
    .tag {{ display: inline-block; background: #475569; color: #f8fafc; padding: 0.25rem 0.5rem; border-radius: 6px; font-size: 0.875rem; margin: 0.25rem; }}
  </style>
</head>
<body>
  <div class="container">
    <h1>{doc.title}</h1>
    <div class="subtitle">Digital Scripture OCR Quality & Preservation Report • {doc.created_at}</div>

    <div class="grid">
      <div class="card">
        <div class="card-title">Average Confidence</div>
        <div class="card-value accent">{rep.average_confidence}%</div>
      </div>
      <div class="card">
        <div class="card-title">Estimated Accuracy</div>
        <div class="card-value accent">{rep.estimated_text_accuracy_percent}%</div>
      </div>
      <div class="card">
        <div class="card-title">Processed Pages</div>
        <div class="card-value">{doc.processed_pages} / {doc.total_pages}</div>
      </div>
      <div class="card">
        <div class="card-title">Verses Extracted</div>
        <div class="card-value">{rep.detected_verses_count}</div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Confidence Distribution Histogram</div>
      <div class="bar-row">
        <div class="bar-label">90% - 100%</div>
        <div class="bar-outer"><div class="bar-inner" style="width: {min(100, int((rep.confidence_histogram.get('90-100', 0) / max(1, doc.processed_pages)) * 100))}%; background: #10b981;"></div></div>
        <div class="bar-count">{rep.confidence_histogram.get('90-100', 0)}</div>
      </div>
      <div class="bar-row">
        <div class="bar-label">75% - 89%</div>
        <div class="bar-outer"><div class="bar-inner" style="width: {min(100, int((rep.confidence_histogram.get('75-89', 0) / max(1, doc.processed_pages)) * 100))}%; background: #38bdf8;"></div></div>
        <div class="bar-count">{rep.confidence_histogram.get('75-89', 0)}</div>
      </div>
      <div class="bar-row">
        <div class="bar-label">50% - 74%</div>
        <div class="bar-outer"><div class="bar-inner" style="width: {min(100, int((rep.confidence_histogram.get('50-74', 0) / max(1, doc.processed_pages)) * 100))}%; background: #f59e0b;"></div></div>
        <div class="bar-count">{rep.confidence_histogram.get('50-74', 0)}</div>
      </div>
      <div class="bar-row">
        <div class="bar-label">Below 50%</div>
        <div class="bar-outer"><div class="bar-inner" style="width: {min(100, int((rep.confidence_histogram.get('below-50', 0) / max(1, doc.processed_pages)) * 100))}%; background: #ef4444;"></div></div>
        <div class="bar-count">{rep.confidence_histogram.get('below-50', 0)}</div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Engine Distribution</div>
      <p>Tesseract Neural (OEM 1): <strong>{rep.engine_selection_distribution.get('tesseract', 0)}</strong> pages | Surya Transformer Fallback: <strong>{rep.engine_selection_distribution.get('surya', 0)}</strong> pages</p>
      <p>Average Processing Speed: <strong>{rep.average_speed_sec_per_page}s</strong> / page (Total: {rep.total_processing_time_sec:.1f}s)</p>
    </div>

    <div class="section">
      <div class="section-title">Pages Flagged for Review (Below 50% Confidence)</div>
      <p>{', '.join(f'<span class="tag">Page {p}</span>' for p in rep.low_confidence_pages) if rep.low_confidence_pages else 'All pages exceeded confidence threshold! No manual review required.'}</p>
    </div>
  </div>
</body>
</html>
"""
        with open(path, "w", encoding="utf-8") as f:
            f.write(html)
