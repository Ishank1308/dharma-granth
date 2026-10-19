"""
Devanagari Scripture Verse (Shloka) Extractor & Cross-Page Boundary Stitcher.
Separates Sanskrit Mula, Hindi Anuvada/Bhashya, Padaccheda, and handles cross-page stanza breaks.
"""

import re
from typing import List, Tuple, Optional, Dict, Any
from dharma_ocr.core.schemas import ExtractedVerse
from dharma_ocr.postprocessing.devanagari_utils import devanagari_to_int
from dharma_ocr.core.logger import get_logger

logger = get_logger()

# Common Hindi auxiliary verbs and postpositions used to distinguish Hindi translation from Sanskrit Mula
HINDI_MARKERS = {
    "है", "हैं", "था", "थी", "थे", "का", "के", "की", "में", "पर", "से", "को", "ने",
    "और", "कि", "यह", "वह", "जो", "तो", "भी", "किया", "कहा", "गया", "होता", "होती"
}


class VerseExtractor:
    """
    Extracts structured stanzas from scripture text streams.
    Identifies verse boundary cadences (॥ १ ॥), separates commentary layers,
    and stitches verses fractured across consecutive physical PDF pages.
    """

    def __init__(self, config: dict):
        self.config = config
        self.verse_regex = re.compile(r'॥\s*([०-९\d]+)(?:\s*[-–]\s*([०-९\d]+))?\s*॥')

    def is_sanskrit_mula_line(self, line: str) -> bool:
        """Determines if a line is Sanskrit root text (Mula) rather than commentary."""
        clean = line.strip()
        if not clean:
            return False

        # Exclude clear commentary/meaning labels
        if re.match(r'^(अर्थ|भावार्थ|टीका|व्याख्या|पदच्छेद|अन्वय|शब्दार्थ|अनुवाद|विशेष|टिप्पणी)\s*[:\-\—]', clean):
            return False
        if re.match(r'^(Translation|Meaning|Purport|Explanation|Note)\s*[:\-\—]', clean, re.IGNORECASE):
            return False

        # Must have Devanagari characters
        dev_chars = len(re.findall(r'[ऀ-ॿ]', clean))
        if dev_chars < 6:
            return False

        # Check ratio of Hindi grammatical markers
        words = set(re.findall(r'[ऀ-ॿ]+', clean))
        hindi_hits = len(words.intersection(HINDI_MARKERS))
        if len(words) > 0 and (hindi_hits / len(words)) > 0.25:
            return False  # Predominantly Hindi prose commentary

        # Contains danda or classical verse cadence
        return bool(re.search(r'[।॥]', clean) or dev_chars > 16)

    def parse_page_content(
        self,
        normalized_text: str,
        page_number: int,
        current_chapter: int = 1
    ) -> Tuple[List[ExtractedVerse], Optional[Dict[str, Any]]]:
        """
        Parses page text into structured verses.
        Returns: (verses, trailing_unresolved_fragment)
        """
        lines = [l.strip() for l in normalized_text.splitlines() if l.strip()]
        verses: List[ExtractedVerse] = []

        current_sanskrit: List[str] = []
        current_hindi: List[str] = []
        current_english: List[str] = []
        current_word_meaning: List[str] = []
        current_verse_num: Optional[int] = None
        current_range_end: Optional[int] = None

        state = "IDLE"  # "IDLE", "SANSKRIT", "HINDI", "ENGLISH", "WORD_MEANING"

        def flush_verse():
            nonlocal current_sanskrit, current_hindi, current_english, current_word_meaning
            nonlocal current_verse_num, current_range_end, state

            if not current_sanskrit:
                return

            mula_text = " ".join(current_sanskrit).strip()
            if not mula_text:
                return

            # Determine verse number
            v_num = current_verse_num if current_verse_num is not None else (len(verses) + 1)
            has_danda = "॥" in mula_text or "।" in mula_text
            confidence = 92.0 if has_danda else 75.0

            verses.append(ExtractedVerse(
                chapter_num=current_chapter,
                verse_num=v_num,
                verse_range_end=current_range_end,
                sanskrit=mula_text,
                transliteration=None,  # Populated via IndicNLP / Sanscript if available
                hindi="\n".join(current_hindi).strip() if current_hindi else None,
                translation="\n".join(current_english).strip() if current_english else None,
                word_meaning="\n".join(current_word_meaning).strip() if current_word_meaning else None,
                commentary=None,
                source_page=page_number,
                confidence_score=confidence,
                warnings=[] if has_danda else ["Verse completed without canonical danda (॥)"]
            ))

            current_sanskrit = []
            current_hindi = []
            current_english = []
            current_word_meaning = []
            current_verse_num = None
            current_range_end = None
            state = "IDLE"

        for line in lines:
            # Check for section markers
            if re.match(r'^(पदच्छेद|शब्दार्थ|अन्वय)\s*[:\-\—]', line):
                state = "WORD_MEANING"
                content = re.sub(r'^(पदच्छेद|शब्दार्थ|अन्वय)\s*[:\-\—]\s*', '', line)
                if verses and not current_sanskrit:
                    verses[-1].word_meaning = (verses[-1].word_meaning + "\n" + content) if verses[-1].word_meaning else content
                else:
                    current_word_meaning.append(content)
                continue

            if re.match(r'^(अर्थ|भावार्थ|टीका|व्याख्या|अनुवाद)\s*[:\-\—]', line):
                state = "HINDI"
                content = re.sub(r'^(अर्थ|भावार्थ|टीका|व्याख्या|अनुवाद)\s*[:\-\—]\s*', '', line)
                if verses and not current_sanskrit:
                    verses[-1].hindi = (verses[-1].hindi + "\n" + content) if verses[-1].hindi else content
                else:
                    current_hindi.append(content)
                continue

            if re.match(r'^(Translation|Meaning|Purport|Explanation)\s*[:\-\—]', line, re.IGNORECASE):
                state = "ENGLISH"
                content = re.sub(r'^(Translation|Meaning|Purport|Explanation)\s*[:\-\—]\s*', '', line, flags=re.IGNORECASE)
                if verses and not current_sanskrit:
                    verses[-1].translation = (verses[-1].translation + "\n" + content) if verses[-1].translation else content
                else:
                    current_english.append(content)
                continue

            # Check if this line is Sanskrit Mula
            if self.is_sanskrit_mula_line(line):
                if state != "SANSKRIT" and (current_hindi or current_english):
                    flush_verse()

                state = "SANSKRIT"

                # Check if line contains double danda and verse number (e.g. ॥ १ ॥ or ॥ १२-१३ ॥)
                match = self.verse_regex.search(line)
                if match:
                    current_sanskrit.append(line)
                    current_verse_num = devanagari_to_int(match.group(1))
                    if match.group(2):
                        current_range_end = devanagari_to_int(match.group(2))
                    flush_verse()
                else:
                    current_sanskrit.append(line)
            else:
                # Commentary or English prose continuation
                if state == "WORD_MEANING":
                    if verses and not current_sanskrit:
                        verses[-1].word_meaning = (verses[-1].word_meaning + "\n" + line) if verses[-1].word_meaning else line
                    else:
                        current_word_meaning.append(line)
                elif state == "ENGLISH" or (len(line) > 0 and line[0].isascii() and line[0].isalpha()):
                    if verses and not current_sanskrit:
                        verses[-1].translation = (verses[-1].translation + "\n" + line) if verses[-1].translation else line
                    else:
                        current_english.append(line)
                else:
                    if verses and not current_sanskrit and state == "HINDI":
                        verses[-1].hindi = (verses[-1].hindi + "\n" + line) if verses[-1].hindi else line
                    else:
                        current_hindi.append(line)

        # Check for unfinished trailing fragment at page boundary
        trailing_fragment = None
        if current_sanskrit:
            trailing_fragment = {
                "chapter": current_chapter,
                "lines": current_sanskrit,
                "hindi": current_hindi,
                "source_page": page_number
            }
        else:
            flush_verse()

        return verses, trailing_fragment

    def stitch_pages(
        self,
        page_results: List[Tuple[int, List[ExtractedVerse], Optional[Dict[str, Any]]]]
    ) -> List[ExtractedVerse]:
        """
        Stitches unresolved trailing fragments across page boundaries.
        If Page N ends with unfinished Sanskrit lines, joins them to the beginning of Page N+1.
        """
        all_verses: List[ExtractedVerse] = []
        pending_fragment: Optional[Dict[str, Any]] = None

        for page_num, verses, trailing in page_results:
            if pending_fragment:
                if verses:
                    # Prepend trailing Sanskrit lines from previous page to first verse on this page
                    first_v = verses[0]
                    first_v.sanskrit = " ".join(pending_fragment["lines"]) + " " + first_v.sanskrit
                    first_v.source_page = pending_fragment["source_page"]
                    first_v.warnings.append(f"Stitched across pages {pending_fragment['source_page']} and {page_num}")
                    pending_fragment = None
                elif trailing:
                    # Trailing continues across this entire page as well
                    trailing["lines"] = pending_fragment["lines"] + trailing["lines"]
                    pending_fragment = trailing
                    continue

            all_verses.extend(verses)
            if trailing:
                pending_fragment = trailing

        # Finalize dangling ending fragment if any at document end
        if pending_fragment and pending_fragment["lines"]:
            all_verses.append(ExtractedVerse(
                chapter_num=pending_fragment["chapter"],
                verse_num=len(all_verses) + 1,
                sanskrit=" ".join(pending_fragment["lines"]),
                source_page=pending_fragment["source_page"],
                confidence_score=70.0,
                warnings=["Concluding fragment without trailing danda marker"]
            ))

        return all_verses
