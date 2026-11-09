"""Verify the static experience, crawlability, and all local proof/asset links."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
ROUTES = ['/', '/experience/', '/work/', '/writing/', '/events/']


class Page(HTMLParser):
    def __init__(self, file):
        super().__init__()
        self.ids = set()
        self.links = []
        self.headings = 0
        self.current = []
        self.canonical = None
        self.cards = 0
        self.roles = 0
        self.file = file
        self.feed(file.read_text())

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            assert attrs['id'] not in self.ids, f'Duplicate ID: {self.file}: {attrs["id"]}'
            self.ids.add(attrs['id'])
        if tag == 'h1':
            self.headings += 1
        if tag == 'article':
            self.cards += 'card' in attrs.get('class', '').split()
            self.roles += 'experience-role' in attrs.get('class', '').split()
            assert 'hidden' not in attrs, f'Hidden content in {self.file}'
        if tag in ('a', 'link') and 'href' in attrs:
            self.links.append(attrs['href'])
        if 'src' in attrs:
            self.links.append(attrs['src'])
        if attrs.get('rel') == 'canonical':
            self.canonical = attrs['href']
        if attrs.get('aria-current') == 'page':
            self.current.append(attrs.get('href'))
        if tag == 'img':
            assert attrs.get('alt') or (attrs.get('alt') == '' and attrs.get('aria-hidden') == 'true'), f'Missing image description in {self.file}'
        if attrs.get('target') == '_blank':
            assert 'noopener' in attrs.get('rel', '')


pages = {route: Page(ROOT / route.lstrip('/') / 'index.html') for route in ROUTES}
site_origin = pages['/'].canonical.rstrip('/')
for route, page in pages.items():
    assert page.headings == 1, f'Expected one main heading: {route}'
    assert page.current == [route], f'Incorrect active navigation: {route}'
    assert page.canonical == site_origin + route
    assert all(target in page.links for target in ROUTES), f'Missing navigation: {route}'
    assert '{{' not in page.file.read_text(), f'Unrendered template: {route}'
    for link in page.links:
        url = urlsplit(link)
        if url.scheme or url.netloc:
            continue
        target_route = url.path or route
        if target_route in pages:
            if url.fragment:
                assert unquote(url.fragment) in pages[target_route].ids, f'Broken anchor: {route} → {link}'
        else:
            file = ROOT / target_route.lstrip('/')
            assert file.is_file(), f'Missing asset: {route} → {link}'

assert pages['/work/'].cards == 12
assert pages['/writing/'].cards == 9
assert pages['/events/'].cards == 8
assert pages['/experience/'].roles == 5
sitemap = ET.parse(ROOT / 'sitemap.xml')
urls = [node.text for node in sitemap.findall('.//{*}loc')]
assert urls == [page.canonical for page in pages.values()]
print(f'Checked {len(pages)} static pages, {sum(page.cards for page in pages.values())} portfolio cards, 5 roles, navigation, metadata, sitemap, and all local links/assets.')
