import re
import json
import subprocess
import struct
import unittest
from html.parser import HTMLParser
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
VOID_ELEMENTS = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}


class Element:
    def __init__(self, tag, attributes, parent=None):
        self.tag = tag
        self.attributes = dict(attributes)
        self.parent = parent

    def has_class(self, name):
        return name in self.attributes.get("class", "").split()


class Page(HTMLParser):
    def __init__(self, html):
        super().__init__()
        self.elements = []
        self.stack = []
        self.errors = []
        self.feed(html)

    def handle_starttag(self, tag, attributes):
        element = Element(tag, attributes, self.stack[-1] if self.stack else None)
        self.elements.append(element)
        if tag not in VOID_ELEMENTS:
            self.stack.append(element)

    def handle_startendtag(self, tag, attributes):
        self.handle_starttag(tag, attributes)
        if tag not in VOID_ELEMENTS:
            self.handle_endtag(tag)

    def handle_endtag(self, tag):
        if not self.stack or self.stack[-1].tag != tag:
            self.errors.append(f"Unexpected closing tag: {tag}")
        else:
            self.stack.pop()


def webp_dimensions(path):
    data = path.read_bytes()
    if data[:4] != b"RIFF" or data[8:12] != b"WEBP":
        raise ValueError(f"Not a WebP: {path}")
    if data[12:16] == b"VP8X":
        return int.from_bytes(data[24:27], "little") + 1, int.from_bytes(data[27:30], "little") + 1
    if data[12:16] == b"VP8 ":
        width, height = struct.unpack("<HH", data[26:30])
        return width & 0x3FFF, height & 0x3FFF
    raise ValueError(f"Unexpected WebP encoding: {path}")


class ContentTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pages = {name: Page((ROOT / name / "index.html").read_text()) for name in ("work", "writing", "events")}
        data = subprocess.check_output(["node", "--input-type=module", "-e", "import {items} from './content/gallery.mjs'; console.log(JSON.stringify(items))"], cwd=ROOT, text=True)
        cls.items = json.loads(data)

    def test_balanced_markup_and_unique_ids(self):
        for page in self.pages.values():
            self.assertEqual(page.errors, [])
            self.assertEqual(page.stack, [])
            ids = [e.attributes["id"] for e in page.elements if "id" in e.attributes]
            self.assertEqual(len(ids), len(set(ids)))

    def test_all_cards_visible_without_javascript(self):
        for section, page in self.pages.items():
            cards = [e for e in page.elements if e.has_class("card")]
            expected = {"card-" + item["id"] for item in self.items if item["section"] == section}
            self.assertEqual({e.attributes["id"] for e in cards}, expected)
            for element in cards:
                while element:
                    self.assertNotIn("hidden", element.attributes)
                    element = element.parent

    def test_writing_order_and_original_destinations(self):
        writing = sorted((item for item in self.items if item["section"] == "writing"), key=lambda item: item["publishedAt"], reverse=True)
        cards = [e.attributes["id"] for e in self.pages["writing"].elements if e.has_class("card")]
        self.assertEqual(cards, ["card-" + item["id"] for item in writing])
        for item in self.items:
            page = self.pages[item["section"]]
            links = {e.attributes.get("href") for e in page.elements if e.tag == "a"}
            for _, url in item.get("links", []):
                self.assertIn(url, links)
            if not item.get("links") and item.get("group") != "community":
                self.assertIn("/" + item["image"], links)

    def test_responsive_images_and_loading_priority(self):
        for section, page in self.pages.items():
            images = [e for e in page.elements if e.tag == "img"]
            for index, image in enumerate(images):
                a = image.attributes
                self.assertEqual(a["loading"], "eager" if index < 3 else "lazy")
                self.assertTrue(a["alt"])
                self.assertIn("100vw", a["sizes"])
                # Events remain two columns even on small phones.
                self.assertEqual("max-width: 480px" in a["sizes"], section != "events")
                default = ROOT / a["src"].lstrip("/")
                self.assertEqual(default.suffix, ".webp")
                self.assertEqual(webp_dimensions(default), (int(a["width"]), int(a["height"])))
                widths = []
                for candidate in a["srcset"].split(","):
                    source, descriptor = candidate.strip().split()
                    width, height = webp_dimensions(ROOT / source.lstrip("/"))
                    self.assertEqual(descriptor, f"{width}w")
                    self.assertLessEqual(width, 1440)
                    self.assertGreater(height, 0)
                    widths.append(width)
                self.assertEqual(widths, sorted(set(widths)))

    def test_jev_diagram_remains_uncropped(self):
        image = next(e for e in self.pages["writing"].elements if e.tag == "img" and "cover-jev-diagram" in e.attributes["src"])
        self.assertEqual(image.attributes.get("style"), "object-fit:contain")

    def test_external_links_keep_security_attributes(self):
        for page in self.pages.values():
            for element in page.elements:
                if element.attributes.get("target") == "_blank":
                    self.assertTrue({"noopener", "noreferrer"}.issubset(element.attributes.get("rel", "").split()))


if __name__ == "__main__":
    unittest.main()
