"""
Unit Tests for Scripture Verse Extraction and Cross-Page Boundary Stitching.
"""

import unittest
from dharma_ocr.postprocessing.verse_extractor import VerseExtractor
from dharma_ocr.postprocessing.chapter_detector import ChapterDetector


class TestVerseExtraction(unittest.TestCase):

    def setUp(self):
        self.extractor = VerseExtractor({})
        self.ch_detector = ChapterDetector()

    def test_chapter_detection(self):
        line1 = "॥ अथ प्रथमोऽध्यायः ॥"
        header1 = self.ch_detector.detect_chapter_header(line1)
        self.assertIsNotNone(header1)
        self.assertEqual(header1[0], 1)

        line2 = "अध्याय ५"
        header2 = self.ch_detector.detect_chapter_header(line2)
        self.assertIsNotNone(header2)
        self.assertEqual(header2[0], 5)

    def test_verse_parsing_with_cadence(self):
        text = """
धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः ।
मामकाः पाण्डवाश्चैव किमकुर्वत सञ्जय ॥ १ ॥
भावार्थ: हे संजय! धर्मभूमि कुरुक्षेत्र में एकत्रित युद्ध के इच्छुक मेरे और पाण्डु के पुत्रों ने क्या किया?
"""
        verses, trailing = self.extractor.parse_page_content(text, page_number=1, current_chapter=1)
        self.assertEqual(len(verses), 1)
        v = verses[0]
        self.assertEqual(v.chapter_num, 1)
        self.assertEqual(v.verse_num, 1)
        self.assertIn("धर्मक्षेत्रे", v.sanskrit)
        self.assertIn("॥ १ ॥", v.sanskrit)
        self.assertIsNotNone(v.hindi)
        self.assertIn("हे संजय", v.hindi)
        self.assertIsNone(trailing)

    def test_cross_page_boundary_stitching(self):
        # Page 1 ends mid-verse
        page1_text = "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत ।"
        v1, trailing1 = self.extractor.parse_page_content(page1_text, page_number=1)
        self.assertEqual(len(v1), 0)
        self.assertIsNotNone(trailing1)

        # Page 2 finishes the verse
        page2_text = "अभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम् ॥ ७ ॥"
        v2, trailing2 = self.extractor.parse_page_content(page2_text, page_number=2)

        page_results = [
            (1, v1, trailing1),
            (2, v2, trailing2)
        ]

        stitched = self.extractor.stitch_pages(page_results)
        self.assertEqual(len(stitched), 1)
        self.assertEqual(stitched[0].verse_num, 7)
        self.assertIn("यदा यदा हि धर्मस्य", stitched[0].sanskrit)
        self.assertIn("सृजाम्यहम् ॥ ७ ॥", stitched[0].sanskrit)


if __name__ == "__main__":
    unittest.main()
