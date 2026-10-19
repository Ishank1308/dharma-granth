"""
Unit Tests for Sanskrit Philological Post-Processing & Normalization.
"""

import unittest
from dharma_ocr.postprocessing.devanagari_utils import (
    canonicalize_devanagari,
    devanagari_to_int,
    decode_pua_ligatures,
    normalize_dandas_and_punctuation
)
from dharma_ocr.postprocessing.sanskrit_corrector import SanskritCorrector
from dharma_ocr.postprocessing.hindi_corrector import HindiCorrector


class TestSanskritCorrection(unittest.TestCase):

    def setUp(self):
        self.sa_corr = SanskritCorrector({})
        self.hi_corr = HindiCorrector({})

    def test_devanagari_to_int(self):
        self.assertEqual(devanagari_to_int("०"), 0)
        self.assertEqual(devanagari_to_int("१२३"), 123)
        self.assertEqual(devanagari_to_int("४५"), 45)
        self.assertEqual(devanagari_to_int("॥ १०८ ॥"), 108)

    def test_danda_standardization(self):
        raw = "धर्मक्षेत्रे कुरुक्षेत्रे | समवेता युयुत्सवः ||"
        clean = normalize_dandas_and_punctuation(raw)
        self.assertIn("।", clean)
        self.assertIn("॥", clean)
        self.assertNotIn("|", clean)

    def test_visarga_restoration_from_colon(self):
        raw = "पुन: नम:"
        clean = normalize_dandas_and_punctuation(raw)
        self.assertIn("पुनः", clean)
        self.assertIn("नमः", clean)

    def test_pua_ligatures(self):
        # \uE09B should be 'ज्ञ'
        raw = "विज्ञान \uE09B"
        clean, count = decode_pua_ligatures(raw)
        self.assertEqual(count, 1)
        self.assertIn("ज्ञ", clean)

    def test_avagraha_restoration(self):
        raw = "प्रथमोSध्यायः सोSहम्"
        clean, _ = self.sa_corr.correct(raw)
        self.assertIn("प्रथमोऽध्यायः", clean)
        self.assertIn("सोऽहम्", clean)

    def test_hindi_religious_correction(self):
        raw = "महाभारतः में भगवान कष्ण और विष्ण का वर्णन है।"
        clean, _ = self.hi_corr.correct(raw)
        self.assertIn("महाभारत", clean)
        self.assertIn("कृष्ण", clean)
        self.assertIn("विष्णु", clean)


if __name__ == "__main__":
    unittest.main()
