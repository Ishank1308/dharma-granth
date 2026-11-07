"""
Hierarchical Markdown Exporter for Scripture Editions.
Formats Sanskrit Mula stanzas, transliterations, translations, and chapters into publication-ready Markdown.
"""

from pathlib import Path
from dharma_ocr.core.schemas import BookScriptureDocument


class MarkdownExporter:
    """Exports structured scripture document into clean hierarchical Markdown."""

    def export(self, doc: BookScriptureDocument, output_path: Path) -> Path:
        output_path = Path(output_path)
        output_path.parent.mkdir(parents=True, exist_ok=True)

        lines = [
            f"# {doc.title}",
            "",
            "> **Digital Scripture Preservation Archive**  ",
            f"> Source Document: `{Path(doc.source_file).name}` | Pages: {doc.processed_pages}/{doc.total_pages}  ",
            f"> Average OCR Confidence: **{doc.quality_report.average_confidence}%** | Accuracy Estimate: **{doc.quality_report.estimated_text_accuracy_percent}%**",
            "",
            "---",
            "",
            "## विषय-सूची (Table of Contents)",
            ""
        ]

        # Build TOC
        if doc.chapters:
            for ch in doc.chapters:
                lines.append(f"- [{ch.title}](#{ch.chapter_number}-{ch.title.replace(' ', '-')}) (पृष्ठ {ch.page_start}-{ch.page_end})")
            lines.append("")
            lines.append("---")
            lines.append("")

        # Standalone verses before Chapter 1 (e.g. Mangalacharana, Dhyana Shlokas)
        if doc.standalone_verses:
            lines.append("## मङ्गलाचरणम् (Opening Invocations)")
            lines.append("")
            for v in doc.standalone_verses:
                lines.append(f"### श्लोक {v.verse_num}")
                lines.append(f"> {v.sanskrit}")
                if v.hindi:
                    lines.append("")
                    lines.append(f"**भावार्थ:** {v.hindi}")
                lines.append("")
            lines.append("---")
            lines.append("")

        # Render Chapters
        for ch in doc.chapters:
            lines.append(f"## {ch.title}")
            lines.append(f"*पृष्ठ विस्तार: {ch.page_start} - {ch.page_end}*")
            lines.append("")

            for v in ch.verses:
                v_label = f"{v.verse_num}-{v.verse_range_end}" if v.verse_range_end else f"{v.verse_num}"
                lines.append(f"### श्लोक {v_label} *(पृष्ठ {v.source_page})*")
                lines.append("")
                # Sanskrit Mula in blockquote
                lines.append(f"> {v.sanskrit}")
                lines.append("")

                if v.transliteration:
                    lines.append(f"*IAST:* `{v.transliteration}`")
                    lines.append("")

                if v.word_meaning:
                    lines.append(f"**पदच्छेद / शब्दार्थ:**  \n{v.word_meaning}")
                    lines.append("")

                if v.hindi:
                    lines.append(f"**हिन्दी अनुवाद / भावार्थ:**  \n{v.hindi}")
                    lines.append("")

                if v.translation:
                    lines.append(f"**English Translation:**  \n{v.translation}")
                    lines.append("")

                lines.append("---")
                lines.append("")

            if ch.colophon:
                lines.append(f"*{ch.colophon}*")
                lines.append("")
                lines.append("---")
                lines.append("")

        content = "\n".join(lines)
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(content)

        return output_path
