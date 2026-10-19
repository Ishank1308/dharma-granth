"""
JSON Exporter for Digital Scripture Preservation, Web Readers, and RAG/VectorDB Systems.
Exports master JSON document and pre-chunked RAG vector embedding records.
"""

import json
from pathlib import Path
from typing import Dict, Any, List, Optional
from dharma_ocr.core.schemas import BookScriptureDocument


class JSONExporter:
    """
    Exports structured scripture schemas and vector-database ready RAG chunks.
    Compatible with LangChain, LlamaIndex, Chroma, Qdrant, and Pinecone.
    """

    def export(self, doc: BookScriptureDocument, output_json: Path, rag_json: Optional[Path] = None) -> Path:
        output_json = Path(output_json)
        output_json.parent.mkdir(parents=True, exist_ok=True)

        # 1. Master Scripture JSON
        with open(output_json, "w", encoding="utf-8") as f:
            json.dump(doc.model_dump(), f, ensure_ascii=False, indent=2)

        # 2. RAG Vector DB Chunk Export
        if rag_json is None:
            rag_json = output_json.parent / f"{output_json.stem}_rag_chunks.json"

        rag_chunks = self._build_rag_chunks(doc)
        with open(rag_json, "w", encoding="utf-8") as f:
            json.dump(rag_chunks, f, ensure_ascii=False, indent=2)

        return output_json

    def _build_rag_chunks(self, doc: BookScriptureDocument) -> List[Dict[str, Any]]:
        """Generates semantic chunks optimized for dense retrieval & semantic search."""
        chunks = []

        # Iterate chapters & verses
        for ch in doc.chapters:
            for v in ch.verses:
                v_id = f"{doc.slug}-ch{ch.chapter_number}-v{v.verse_num}"

                searchable_parts = [
                    f"Scripture: {doc.title}",
                    f"Chapter: {ch.title} (Chapter {ch.chapter_number})",
                    f"Verse: {v.verse_num}",
                    f"Sanskrit Mula: {v.sanskrit}",
                ]
                if v.hindi:
                    searchable_parts.append(f"Hindi Translation: {v.hindi}")
                if v.word_meaning:
                    searchable_parts.append(f"Word Meaning: {v.word_meaning}")
                if v.translation:
                    searchable_parts.append(f"English Meaning: {v.translation}")

                chunk_content = "\n".join(searchable_parts)

                chunks.append({
                    "id": v_id,
                    "content": chunk_content,
                    "metadata": {
                        "scripture": doc.title,
                        "slug": doc.slug,
                        "chapter_num": ch.chapter_number,
                        "chapter_title": ch.title,
                        "verse_num": v.verse_num,
                        "page_number": v.source_page,
                        "confidence_score": v.confidence_score,
                        "citation": f"{doc.title}, {ch.title}, Shloka {v.verse_num} (p. {v.source_page})"
                    }
                })

        return chunks
