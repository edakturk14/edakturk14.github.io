# Eda Akturk

Personal portfolio for technical marketing and developer education. A static site built with HTML and CSS, compatible with GitHub Pages.

## Preview locally

Run `python3 -m http.server 4173 --bind 127.0.0.1` from this directory and open http://localhost:4173 in a browser. No install or build step is required. If an embedded preview blocks localhost, use a regular browser or open `index.html` directly.

## Content and interactions

- `index.html`: short biography, a small portrait, categorized writing, talk links, dated hackathon judging, photos, and contact links.
- `styles.css`: a narrow single-column layout with system fonts, a white background, charcoal links, consistent violet accents for the name and writing categories, lavender hover highlights, and a horizontally scrollable photo strip. Edit the color variables in `:root` to change the palette.

Contact links use the existing LinkedIn profile. Fonts are native system fonts, and photos are served locally. The photo strip supports touch, trackpad, scrollbar, and keyboard navigation. Each photo links to its full-size original. Captions include years from the original portfolio where available. No JavaScript, external font requests, or build dependencies are required.

Local edits do not publish automatically. The existing GitHub Pages deployment changes only after the repository's publishing flow is triggered.
