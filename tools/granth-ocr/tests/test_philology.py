"""Philology checks that do not need a PDF or Tesseract."""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import json
import tempfile

from granth_ocr.audit import attach_images, audit_pages
from granth_ocr.hindi import suggest_hindi
from granth_ocr.quality import score_metrics
from granth_ocr.report import numbering_notes
from granth_ocr.sanskrit import fix_prebase_i, normalize_sanskrit
from granth_ocr.verses import stitch_pages


def main() -> None:
    text, changes = fix_prebase_i("िह")
    assert text == "हि", text
    assert changes[0]["applied"] is True

    kept, log, flags = normalize_sanskrit("महाभागत उवाच ।", mode="suggest", reorder_i=True)
    assert kept == "महाभागत उवाच ।", kept
    assert any(item["to"] == "महाभारत" and item["applied"] is False for item in log)
    assert "possible visarga printed as colon" not in flags

    applied, applied_log, _ = normalize_sanskrit("महाभागत", mode="apply", reorder_i=True)
    assert applied == "महाभारत", applied
    assert applied_log[0]["applied"] is True

    flagged, _, colon_flags = normalize_sanskrit("पुन: तत्र", mode="off", reorder_i=False)
    assert flagged == "पुन: तत्र"
    assert "possible visarga printed as colon" in colon_flags

    hindi, hindi_log = suggest_hindi("कृशण", mode="suggest", indic=False)
    assert hindi == "कृशण"
    assert hindi_log[0]["to"] == "कृष्ण"
    assert hindi_log[0]["applied"] is False

    pages = [{
        "pdf_page": 12,
        "engine": "tesseract",
        "confidence": 91.0,
        "text_raw": "अध्याय १\nअहेयमनुपादेयं मनोवाचामगोचरम् ।\nअप्रमेयमनाद्यन्तं ब्रह्म पूर्णमहं महः ॥ २४० ॥\nवह ब्रह्म त्याग के अयोग्य है।\nतत्त्वं पदाभ्यामभिधीयमानयोः ।\nब्रह्मात्मनोः शोधितयोर्यदीत्थम् ॥ २४१ ॥\nWhen the words are purified, scripture teaches their oneness.",
    }]
    verses, chapters = stitch_pages(pages, mode="suggest", reorder_i=True)
    assert len(verses) == 2, verses
    assert verses[0]["verse"] == 240
    assert verses[0]["sanskrit_devanagari"].startswith("अहेयमनुपादेयं")
    assert "अयोग्य" not in verses[0]["sanskrit_devanagari"]
    assert "अयोग्य" in verses[0]["bhashya_hi"]
    assert "oneness" in verses[1]["english"]
    assert "When" not in verses[1]["sanskrit_devanagari"]
    assert chapters[0]["number"] == 1
    assert chapters[0]["page_start"] == 12

    # Gita Press prints के tight against the noun, and the tika sits between shlokas.
    gita_press = """न.
उदहियमनुपादेवं मनोवाचामगोचरम्
अप्रमेयमनाद्यन्तं ब्रह्म पूर्ण महन्महः ॥ २४२॥
वह ब्रह्म त्याग अथवा ग्रहणके अयोग्य, मन-वाणीका अविषय,
अप्रमेय, आदि-अन्तरहित, परिपूर्ण तथा महान् तेजोमय है।
महावाक्य-विचार
तत्तवं पदाभ्यामभिधीयमानयो- ।
ब्रह्मात्मनोः शोधितयोर्यदीत्थम्।
श्रुत्या तयोस्तत््वमसीति सम्य-
गेकत्वमेव प्रतिपाद्यते मुहुः ॥ २४३ ॥
एकत्व प्रतिपादन किया गया है।
एेक्यं तयोर्लक्षितयोर्न वाच्ययोः ॥ २४४॥
५ किन विन | £. लिकः - ककल) 241"""
    split, _ = stitch_pages(
        [{"pdf_page": 69, "engine": "tesseract", "confidence": 74, "text_raw": gita_press}],
        mode="suggest",
        reorder_i=True,
    )
    by_number = {verse["verse"]: verse for verse in split}
    assert "मनोवाचामगोचरम्" in by_number[242]["sanskrit_devanagari"]
    assert "अयोग्य" not in by_number[242]["sanskrit_devanagari"]
    assert "अयोग्य" in by_number[242]["bhashya_hi"]
    assert "महावाक्य" not in by_number[243]["sanskrit_devanagari"]
    assert "प्रतिपाद्यते" in by_number[243]["sanskrit_devanagari"]
    assert "किया" not in by_number[243]["sanskrit_devanagari"]
    assert "एेक्यं" in by_number[244]["sanskrit_devanagari"]
    assert "लिकः" not in by_number[244]["sanskrit_devanagari"]
    assert by_number[242]["sanskrit_devanagari"].startswith("उदहिय")

    notes = numbering_notes([
        {"chapter": 1, "verse": 1},
        {"chapter": 1, "verse": 2},
        {"chapter": 1, "verse": 2},
        {"chapter": 1, "verse": 3},
        {"chapter": 1, "verse": 4},
        {"chapter": 1, "verse": 6},
    ])
    assert any("duplicate" in note for note in notes), notes
    assert any("skipped 5" in note for note in notes), notes

    assert score_metrics(0, 0, 0) < score_metrics(400, 60, 0.1)

    kept_variants, variant_log, _ = normalize_sanskrit(
        "कृष्न विष्नु महीभारत कष्ण विषणु सर्वज्ञ",
        mode="suggest",
        reorder_i=False,
    )
    assert kept_variants == "कृष्न विष्नु महीभारत कष्ण विषणु सर्वज्ञ", kept_variants
    proposed = {item["from"]: item["to"] for item in variant_log}
    assert proposed["कृष्न"] == "कृष्ण"
    assert proposed["विष्नु"] == "विष्णु"
    assert proposed["महीभारत"] == "महाभारत"
    assert proposed["कष्ण"] == "कृष्ण"
    assert proposed["विषणु"] == "विष्णु"
    assert "सर्वज्ञ" not in proposed
    assert all(item["applied"] is False for item in variant_log)

    hole = audit_pages([{
        "pdf_page": 3,
        "engine": "tesseract",
        "confidence": 96,
        "text_raw": (
            "अध्याय १\n"
            "एकं पदमिदं सत्यं धर्मो नित्यः सनातनः । प्रथमं वाक्यमुक्तं हि विदुषां हितकाम्यया ॥ १ ॥\n"
            "द्वितीयं वाक्यमुक्तं हि धर्मज्ञा हितकाम्यया । न त्विदं रिक्तमेव स्यात् पाठकेन परीक्ष्यते ॥ २ ॥\n"
            "तृतीयं वाक्यमुक्तं हि श्लोकस्य पूर्णताय वै । अङ्कानां क्रम एवात्र रिक्तस्थाने न पूर्यते ॥ ३ ॥\n"
            "चतुर्थं वाक्यमुक्तं हि संख्या पञ्च न लेखिता । यत्र नास्ति स श्लोकः स न कल्प्यते कदाचन ॥ ४ ॥\n"
            "षष्ठं वाक्यमुक्तं हि पञ्चमः श्लोको न हि । अस्मिन् पाठे न दृश्यते तस्मान्न लिख्यते पुनः ॥ ६ ॥\n"
        ),
    }])
    assert [verse["verse"] for verse in hole["verses"]] == [1, 2, 3, 4, 6], hole["verses"]
    assert any("skipped 5" in note for note in hole["numbering"]), hole["numbering"]
    assert hole["pages"][0]["verse_completeness"] == 1.0
    assert hole["pages"][0]["status"] == "REVIEW"
    assert hole["summary"]["missing_verses_restored"] == 0
    assert hole["summary"]["ocr_errors_corrected"] == 0

    cut = audit_pages([{
        "pdf_page": 8,
        "engine": "tesseract",
        "confidence": 90,
        "text_raw": "रामो विग्रहवान् ध",
    }])
    assert cut["verses"] == []
    assert cut["open_page_tail"][0]["text"] == "रामो विग्रहवान् ध"
    assert "धर्मः" not in cut["open_page_tail"][0]["text"]
    assert cut["summary"]["missing_verses_restored"] == 0

    joined = audit_pages([
        {"pdf_page": 120, "engine": "tesseract", "confidence": 91, "text_raw": "स एव भगवान्"},
        {"pdf_page": 121, "engine": "tesseract", "confidence": 93, "text_raw": "नारायणः प्रभुः ॥ १ ॥"},
    ])
    assert len(joined["verses"]) == 1, joined["verses"]
    assert joined["verses"][0]["sanskrit_devanagari"] == "स एव भगवान् नारायणः प्रभुः"
    assert joined["verses"][0]["continues_from_previous_page"] is True
    assert joined["open_page_tail"] == []
    assert "धर्मः" not in joined["verses"][0]["sanskrit_devanagari"]

    same = (
        "स एव भगवान् विष्णुः नारायणः प्रभुः सदा । "
        "सर्वज्ञो देवदेवश्च लोकनाथो जनार्दनः"
    )
    copies = audit_pages([{
        "pdf_page": 4,
        "engine": "tesseract",
        "confidence": 95,
        "text_raw": f"अध्याय २\n{same} ॥ १ ॥\n{same} ॥ २ ॥\n",
    }])
    assert len(copies["verses"]) == 2
    assert len(copies["duplicates"]) == 1
    assert copies["summary"]["duplicate_verses_removed"] == 0

    hindi_page = audit_pages([{
        "pdf_page": 5,
        "engine": "tesseract",
        "confidence": 94,
        "text_raw": (
            "अध्याय ३\n"
            "स एव भगवान् विष्णुः नारायणः प्रभुः सदा । सर्वज्ञो देवदेवश्च लोकनाथो जनार्दनः ॥ १ ॥\n"
            "वह कष्ण और महीभारत का नाम है।\n"
        ),
    }])
    hindi_hits = {(item["from"], item["to"], item["layer"]) for item in hindi_page["suggestions"]}
    assert ("कष्ण", "कृष्ण", "hindi") in hindi_hits, hindi_page["suggestions"]
    assert ("महीभारत", "महाभारत", "hindi") in hindi_hits, hindi_page["suggestions"]
    assert hindi_page["summary"]["suggestions_applied"] == 0
    assert "कृष्ण" not in hindi_page["verses"][0]["bhashya_hi"]

    reviewed = audit_pages([{
        "pdf_page": 69,
        "engine": "tesseract",
        "confidence": 73.88,
        "flags": ["possible visarga printed as colon"],
        "text_raw": gita_press,
    }])
    assert reviewed["pages"][0]["status"] == "REPROCESS"
    assert reviewed["pages"][0]["status"] != "VALID"
    assert reviewed["summary"]["pages_reprocessed"] == 0
    assert reviewed["reprocess_queue"][0]["engine_used"] is None
    reviewed_text = " ".join(verse["sanskrit_devanagari"] for verse in reviewed["verses"])
    assert "उदहिय" in reviewed_text
    assert "एेक्यं" in reviewed_text
    assert all(verse["status"] == "needs_review" for verse in reviewed["verified"]["chapters"][0]["verses"])

    with tempfile.TemporaryDirectory() as folder:
        clean = audit_pages([{
            "pdf_page": 1,
            "engine": "tesseract",
            "confidence": 96,
            "text_raw": "अध्याय १\nस एव भगवान् विष्णुः नारायणः प्रभुः सदा । सर्वज्ञो देवदेवश्च लोकनाथो जनार्दनः ॥ १ ॥\n",
        }])
        assert clean["pages"][0]["status"] == "VALID", clean["pages"][0]
        attach_images(clean, Path(folder))
        assert clean["pages"][0]["image_present"] is False
        assert clean["pages"][0]["status"] == "REVIEW"

    vivek_page = Path(__file__).resolve().parents[1] / "work" / "vivek-scan" / "ocr" / "page-69.json"
    if vivek_page.exists():
        stored = json.loads(vivek_page.read_text(encoding="utf-8"))
        live = audit_pages([stored])
        assert live["pages"][0]["status"] != "VALID"
        blob = " ".join(verse["sanskrit_devanagari"] for verse in live["verses"])
        assert "उदहिय" in blob
        assert "एेक्यं" in blob
        assert "कूपाम्बुराश्यो:" in blob
        assert live["summary"]["missing_verses_restored"] == 0
        assert live["summary"]["suggestions_applied"] == 0

    print("granth-ocr philology ok")


if __name__ == "__main__":
    main()
