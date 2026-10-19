"""
Step 4 & Step 5: Cross-Page Verification and Duplicate Detection Engine.
Automatically merges split verses across physical page transitions and removes duplicate scanner-overlap stanzas.
"""

from typing import List, Dict, Any, Tuple
import re


class CrossPageStitcher:
    """
    Handles physical page boundary seam repairs:
    - Merges broken half-shlokas split across page turns.
    - Removes duplicate verses caused by scanner double-takes or page headers.
    """

    def __init__(self):
        pass

    def stitch_cross_page_verses(
        self,
        verses: List[Dict[str, Any]]
    ) -> Tuple[List[Dict[str, Any]], int]:
        """
        Step 4: Cross-Page Verification.
        If verse N ends without a closing danda '॥', and verse N+1 begins on the next page
        without a chapter break, merges them seamlessly.
        Returns: (stitched_verses, count_of_merges)
        """
        if not verses:
            return [], 0

        stitched: List[Dict[str, Any]] = []
        merges_count = 0

        i = 0
        from dharma_ocr.validator.verse_detector import EnhancedVerseDetector
        detector = EnhancedVerseDetector()

        while i < len(verses):
            curr = verses[i]
            sanskrit = curr.get("sanskrit", "").strip()

            # Check if this verse is incomplete (not is_closed or no closing double danda '॥')
            # and next verse exists on the consecutive page
            if i + 1 < len(verses):
                nxt = verses[i + 1]
                curr_page = curr.get("source_page")
                nxt_page = nxt.get("source_page")

                is_consecutive_page = (curr_page and nxt_page and nxt_page == curr_page + 1)
                curr_lacks_closing = (not curr.get("is_closed", True)) or (not sanskrit.endswith("॥"))
                nxt_starts_continuation = not re.match(r'^[॥१-९\d]', nxt.get("sanskrit", "").strip())

                if is_consecutive_page and (curr_lacks_closing or nxt_starts_continuation):
                    # Merge verse i and i+1
                    merged_sanskrit = sanskrit + " " + nxt.get("sanskrit", "").strip()
                    merged_hindi = None
                    if curr.get("hindi") or nxt.get("hindi"):
                        merged_hindi = "\n".join(filter(None, [curr.get("hindi"), nxt.get("hindi")]))

                    merged_verse = dict(curr)
                    merged_verse["sanskrit"] = merged_sanskrit
                    merged_verse["hindi"] = merged_hindi
                    merged_verse["verse_num"] = nxt.get("verse_num") or curr.get("verse_num")
                    merged_verse["verse_range_end"] = nxt.get("verse_range_end") or curr.get("verse_range_end")
                    merged_verse["stitched_across_pages"] = [curr_page, nxt_page]
                    merged_verse["is_closed"] = nxt.get("is_closed", False) or nxt.get("sanskrit", "").strip().endswith("॥")

                    stitched.append(merged_verse)
                    merges_count += 1
                    i += 2  # Skip next since it was merged
                    continue

            stitched.append(curr)
            i += 1

        # Post-stitching Step 8: Ensure all final stanzas have complete shloka structure
        for v in stitched:
            repaired_mula, warnings = detector.validate_and_repair_shloka_structure(v.get("sanskrit", ""))
            v["sanskrit"] = repaired_mula
            if warnings:
                v.setdefault("structure_warnings", []).extend(warnings)

        return stitched, merges_count

    def deduplicate_verses(
        self,
        verses: List[Dict[str, Any]]
    ) -> Tuple[List[Dict[str, Any]], int]:
        """
        Step 5: Duplicate Detection.
        Removes consecutive or identical duplicate verses (often caused by running headers or scanner overlap)
        while strictly preserving original scripture canonical order.
        Returns: (deduplicated_verses, count_of_duplicates_removed)
        """
        if not verses:
            return [], 0

        deduped: List[Dict[str, Any]] = []
        seen_fingerprints = set()
        duplicates_removed = 0

        for v in verses:
            sanskrit = v.get("sanskrit", "").strip()
            # Generate a normalized alphanumeric Devanagari fingerprint
            clean_fp = re.sub(r'[\s।॥\d०-९\.\,\-\–\'\"]+', '', sanskrit)

            if len(clean_fp) < 10:
                # Too short to reliably fingerprint as duplicate, keep it
                deduped.append(v)
                continue

            if clean_fp in seen_fingerprints:
                duplicates_removed += 1
                continue

            seen_fingerprints.add(clean_fp)
            deduped.append(v)

        return deduped, duplicates_removed
