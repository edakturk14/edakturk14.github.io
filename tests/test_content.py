import re
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
        cls.page = Page((ROOT / "index.html").read_text())
        cls.elements = cls.page.elements

    def test_balanced_markup_and_unique_ids(self):
        self.assertEqual(self.page.errors, [])
        self.assertEqual(self.page.stack, [])
        ids = [element.attributes["id"] for element in self.elements if "id" in element.attributes]
        self.assertEqual(len(ids), len(set(ids)))

    def test_all_portfolio_content_is_visible_without_javascript(self):
        sections = [element for element in self.elements if element.has_class("page-section")]
        self.assertEqual([element.attributes["id"] for element in sections], ["home", "writing", "work", "events"])
        cards = [element for element in self.elements if element.has_class("card")]
        self.assertEqual(len(cards), 28)
        for element in sections + cards:
            while element:
                self.assertNotIn("hidden", element.attributes)
                element = element.parent

    def test_native_navigation_targets_and_local_assets_exist(self):
        ids = {element.attributes["id"] for element in self.elements if "id" in element.attributes}
        for element in self.elements:
            for name in ("href", "src"):
                value = element.attributes.get(name, "")
                if value.startswith("#"):
                    self.assertIn(value[1:], ids)
                elif value and not re.match(r"[a-z]+:", value):
                    self.assertTrue((ROOT / value.split("?")[0]).is_file(), value)
            for name in ("aria-labelledby", "aria-controls"):
                for target in element.attributes.get(name, "").split():
                    self.assertIn(target, ids)

    def test_writing_is_newest_first(self):
        dates = [element.attributes["data-published-at"] for element in self.elements if "data-published-at" in element.attributes]
        self.assertEqual(len(dates), 8)
        self.assertEqual(dates, sorted(dates, reverse=True))

    def test_thumbnails_are_responsive_lazy_and_correctly_sized(self):
        images = [element for element in self.elements if element.tag == "img"]
        self.assertEqual(len(images), 28)
        for image in images:
            attributes = image.attributes
            self.assertEqual(attributes["loading"], "lazy")
            self.assertTrue(attributes["alt"])
            self.assertTrue(attributes["sizes"])
            default = ROOT / attributes["src"]
            self.assertEqual(default.suffix, ".webp")
            self.assertEqual(webp_dimensions(default), (int(attributes["width"]), int(attributes["height"])))
            for candidate in attributes["srcset"].split(","):
                source, width = candidate.strip().split()
                actual_width, _ = webp_dimensions(ROOT / source)
                self.assertEqual(width, f"{actual_width}w")
                self.assertLessEqual(actual_width, 1440)

    def test_external_links_keep_security_attributes(self):
        for element in self.elements:
            if element.attributes.get("target") == "_blank":
                self.assertTrue({"noopener", "noreferrer"}.issubset(element.attributes.get("rel", "").split()))


if __name__ == "__main__":
    unittest.main()
