#!/usr/bin/env python3
"""
Extract Sanskrit verse text from Gita Press PDFs for missing scriptures.

Strategy:
1. For each missing scripture, find its PDF(s)
2. Extract text with PyMuPDF
3. Check if text contains valid Devanagari (U+0900-U+097F)
4. If valid, structure into chapters/verses and write JSON
5. If invalid (custom font encoding), skip for now (would need OCR)
"""

import fitz
import json
import os
import re
import sys
from pathlib import Path
from datetime import datetime

# Root paths
DHARMA_ROOT = Path(r"C:\Users\ishan\Music\dharma")
GRANTH_ROOT = DHARMA_ROOT / "dharma-granth"
OUTPUT_DIR = GRANTH_ROOT / "public" / "data" / "scriptures-full"

# Mapping: scripture_id -> { title, pdf_paths, expected_verses, category }
SCRIPTURE_MAP = {
    "vishnupurana": {
        "title": "Vishnu Purana",
        "titleSanskrit": "विष्णुपुराणम्",
        "category": "purana",
        "pdfs": [
            DHARMA_ROOT / "VishnuPurana.pdf",
            DHARMA_ROOT / "vishnu-puran.pdf",
            DHARMA_ROOT / "vishnu-puran.pdf",
        ],
    },
    "agnipuran": {
        "title": "Agni Purana",
        "titleSanskrit": "अग्निपुराणम्",
        "category": "purana",
        "pdfs": [DHARMA_ROOT / "agni-puran.pdf"],
    },
    "harivanshpuran": {
        "title": "Harivamsha Purana",
        "titleSanskrit": "हरिवंशपुराणम्",
        "category": "purana",
        "pdfs": [DHARMA_ROOT / "Harivansh Puran - Gita Press.pdf"],
    },
    "kurmapuran": {
        "title": "Kurma Purana",
        "titleSanskrit": "कूर्मपुराणम्",
        "category": "purana",
        "pdfs": [DHARMA_ROOT / "kurma.pdf"],
    },
    "lingapuran": {
        "title": "Linga Purana",
        "titleSanskrit": "लिङ्गपुराणम्",
        "category": "purana",
        "pdfs": [DHARMA_ROOT / "ling.pdf"],
    },
    "vamanpuran": {
        "title": "Vamana Purana",
        "titleSanskrit": "वामनपुराणम्",
        "category": "purana",
        "pdfs": [DHARMA_ROOT / "vamanpuran.pdf"],
    },
    "varahapuran": {
        "title": "Varaha Purana",
        "titleSanskrit": "वाराहपुराणम्",
        "category": "purana",
        "pdfs": [DHARMA_ROOT / "varaha-puran.pdf"],
    },
    "vayupuran": {
        "title": "Vayu Purana",
        "titleSanskrit": "वायुपुराणम्",
        "category": "purana",
        "pdfs": [DHARMA_ROOT / "vayu-puran.pdf"],
    },
    "brahmandpuran": {
        "title": "Brahmanda Purana",
        "titleSanskrit": "ब्रह्माण्डपुराणम्",
        "category": "purana",
        "pdfs": [DHARMA_ROOT / "brahamand.pdf", DHARMA_ROOT / "brahamandp.pdf"],
    },
    "brahmavaivartapuran": {
        "title": "Brahmavaivarta Purana",
        "titleSanskrit": "ब्रह्मवैवर्तपुराणम्",
        "category": "purana",
        "pdfs": [DHARMA_ROOT / "vaivtpuran.pdf"],
    },
    "padmapuran": {
        "title": "Padma Purana",
        "titleSanskrit": "पद्मपुराणम्",
        "category": "purana",
        "pdfs": [DHARMA_ROOT / "padam-puran.pdf", DHARMA_ROOT / "Padma Puran - Gita Press.pdf"],
    },
    "skandapuran": {
        "title": "Skanda Purana",
        "titleSanskrit": "स्कन्दपुराणम्",
        "category": "purana",
        "pdfs": [DHARMA_ROOT / "sakand-puran.pdf"],
    },
    "yogavasistha": {
        "title": "Yoga Vasistha",
        "titleSanskrit": "योगवासिष्ठ",
        "category": "other",
        "pdfs": [
            DHARMA_ROOT / "shri-yogavasishtha-1.pdf",
            DHARMA_ROOT / "shri-yogavasishtha-2.pdf",
            DHARMA_ROOT / "shri-yogavasishtha-3.pdf",
            DHARMA_ROOT / "shri-yogavasishtha-4.pdf",
        ],
    },
    "matsyapuran": {
        "title": "Matsya Purana",
        "titleSanskrit": "मत्स्यपुराणम्",
        "category": "purana",
        "pdfs": [DHARMA_ROOT / "matsya-puran-1.pdf", DHARMA_ROOT / "matsya-puran-2.pdf"],
    },
    "kalkipuran": {
        "title": "Kalki Purana",
        "titleSanskrit": "कल्किपुराणम्",
        "category": "purana",
        "pdfs": [DHARMA_ROOT / "kalkipuranhindi1.pdf"],
    },
    "ravanasamhita": {
        "title": "Ravana Samhita",
        "titleSanskrit": "रावणसंहिता",
        "category": "tantra",
        "pdfs": [
            DHARMA_ROOT / "ravan-samhita-1.pdf",
            DHARMA_ROOT / "ravan-samhita-2.pdf",
            DHARMA_ROOT / "ravan-samhita-3.pdf",
            DHARMA_ROOT / "ravan-samhita-4.pdf",
            DHARMA_ROOT / "ravan-samhita-5.pdf",
        ],
    },
    "shivasamhita": {
        "title": "Shiva Samhita",
        "titleSanskrit": "शिवसंहिता",
        "category": "tantra",
        "pdfs": [DHARMA_ROOT / "shiva_sahinta_withhinditika.pdf"],
    },
    "yogarasayanam": {
        "title": "Yoga Rasayanam",
        "titleSanskrit": "योगरसायनम्",
        "category": "tantra",
        "pdfs": [DHARMA_ROOT / "yoga-rasayanam-sanskrit-hindi.pdf"],
    },
    "vinayapatrika": {
        "title": "Vinaya Patrika",
        "titleSanskrit": "विनयपत्रिका",
        "category": "stotra",
        "pdfs": [
            DHARMA_ROOT / "Vinay Patrika by Goswami Tulasi Das with Commentary by Hanumad Prasad Podhar 2001 Gorakhpur - Gita Press.pdf",
            DHARMA_ROOT / "Sura Vinaya Patrika by Haridas 1989 - Govinda Bhavana Karyalaya Gita Press Gorakhpur.pdf",
        ],
    },
    "nityakarmakriya": {
        "title": "Nitya Karma Kriya",
        "titleSanskrit": "नित्यकर्मक्रिया",
        "category": "other",
        "pdfs": [],  # Not sure if there's a PDF
    },
}


def has_devanagari(text):
    """Check if text contains Devanagari Unicode characters."""
    return bool(re.search(r'[\u0900-\u097F]', text))


def count_devanagari_chars(text):
    """Count Devanagari characters in text."""
    return len(re.findall(r'[\u0900-\u097F]', text))


def extract_text_from_pdf(pdf_path):
    """Extract text using PyMuPDF."""
    doc = fitz.open(str(pdf_path))
    full_text = ""
    for page in doc:
        full_text += page.get_text()
    doc.close()
    return full_text


def parse_verses_from_text(text):
    """
    Attempt to parse verses from extracted text.
    Looks for common Sanskrit verse patterns like:
    - Lines ending with ||
    - Verse numbers
    - Shloka patterns
    """
    # Split into lines
    lines = [l.strip() for l in text.split('\n') if l.strip()]
    
    verses = []
    current_verse_lines = []
    verse_number = 1
    
    for line in lines:
        # Check if line ends with danda (Devanagari punctuation) or ||
        if re.search(r'[॥|]\s*$', line):
            current_verse_lines.append(line)
            # If we have 2 lines (typical shloka), save as verse
            if len(current_verse_lines) >= 2:
                verse_text = ' '.join(current_verse_lines)
                if count_devanagari_chars(verse_text) > 10:
                    verses.append({
                        "number": verse_number,
                        "sanskrit": verse_text,
                        "transliteration": ""
                    })
                    verse_number += 1
                current_verse_lines = []
        elif has_devanagari(line) and count_devanagari_chars(line) > 5:
            current_verse_lines.append(line)
    
    # Handle remaining lines
    if current_verse_lines:
        verse_text = ' '.join(current_verse_lines)
        if count_devanagari_chars(verse_text) > 10:
            verses.append({
                "number": verse_number,
                "sanskrit": verse_text,
                "transliteration": ""
            })
    
    return verses


def split_into_chapters(verses, chapter_size=100):
    """Split verses into chapters of approximately chapter_size verses each."""
    chapters = []
    for i in range(0, len(verses), chapter_size):
        chunk = verses[i:i + chapter_size]
        chapter_num = len(chapters) + 1
        chapters.append({
            "number": chapter_num,
            "title": f"Adhyāya {chapter_num}",
            "verses": chunk
        })
    return chapters


def process_scripture(scripture_id, config):
    """Process a single scripture."""
    print(f"\n{'='*60}")
    print(f"Processing: {config['title']} ({scripture_id})")
    print(f"{'='*60}")
    
    # Find existing PDFs
    pdfs = [p for p in config["pdfs"] if p.exists()]
    if not pdfs:
        print(f"  No PDFs found for {scripture_id}")
        return None
    
    print(f"  Found {len(pdfs)} PDF(s):")
    for pdf in pdfs:
        size_mb = pdf.stat().st_size / (1024 * 1024)
        print(f"    - {pdf.name} ({size_mb:.1f} MB)")
    
    # Extract text from first PDF only for now (to test)
    # For multi-PDF texts, we'd need to concatenate
    all_text = ""
    for pdf in pdfs[:1]:  # Start with first PDF
        print(f"  Extracting from {pdf.name}...")
        try:
            text = extract_text_from_pdf(pdf)
            all_text += text
            dev_count = count_devanagari_chars(text)
            print(f"    Extracted {len(text)} chars, {dev_count} Devanagari chars")
        except Exception as e:
            print(f"    ERROR: {e}")
            continue
    
    if not all_text:
        print(f"  No text extracted")
        return None
    
    # Check if text is usable (has Devanagari)
    if not has_devanagari(all_text):
        print(f"  WARNING: No Devanagari found - PDF likely uses custom font encoding")
        print(f"  Sample: {all_text[:200]}")
        return None
    
    # Parse verses
    print(f"  Parsing verses...")
    verses = parse_verses_from_text(all_text)
    print(f"  Found {len(verses)} verses")
    
    if len(verses) < 5:
        print(f"  Too few verses - extraction may have failed")
        return None
    
    # Split into chapters
    chapters = split_into_chapters(verses, chapter_size=100)
    print(f"  Created {len(chapters)} chapters")
    
    # Build FullScripture JSON
    scripture = {
        "id": scripture_id,
        "title": config["title"],
        "titleSanskrit": config["titleSanskrit"],
        "category": config["category"],
        "source": {
            "repo": str(pdfs[0]),
            "license": "Extracted from Gita Press PDF. Sanskrit mūla — public domain.",
            "fetchedAt": datetime.now().isoformat()
        },
        "totalVerses": len(verses),
        "totalChapters": len(chapters),
        "chapters": chapters
    }
    
    # Write JSON
    output_path = OUTPUT_DIR / f"{scripture_id}.json"
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(scripture, f, ensure_ascii=False, indent=2)
    
    print(f"  Written: {output_path} ({output_path.stat().st_size / 1024:.1f} KB)")
    return scripture


def main():
    print("PDF-to-JSON Scripture Extractor")
    print(f"Output directory: {OUTPUT_DIR}")
    
    results = []
    
    for scripture_id, config in SCRIPTURE_MAP.items():
        result = process_scripture(scripture_id, config)
        results.append({
            "id": scripture_id,
            "success": result is not None,
            "verses": result["totalVerses"] if result else 0,
            "chapters": result["totalChapters"] if result else 0
        })
    
    print(f"\n{'='*60}")
    print("SUMMARY")
    print(f"{'='*60}")
    success_count = sum(1 for r in results if r["success"])
    total_verses = sum(r["verses"] for r in results)
    print(f"Successful: {success_count}/{len(results)}")
    print(f"Total verses extracted: {total_verses}")
    print()
    for r in results:
        status = "OK" if r["success"] else "FAIL"
        print(f"  [{status}] {r['id']}: {r['verses']} verses, {r['chapters']} chapters")


if __name__ == "__main__":
    main()
