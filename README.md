# Eda Akturk

Personal portfolio for technical marketing and developer education. A static HTML and CSS site with optional JavaScript enhancements, compatible with GitHub Pages.

## Preview locally

Run `python3 -m http.server 4173 --bind 127.0.0.1` from this directory and open http://localhost:4173 in a browser. No install or build step is required. If an embedded preview blocks localhost, use a regular browser or open `index.html` directly.

## Content and interactions

- `index.html` is the source of truth for the biography, writing, grouped work, event photos, and contact links. Edit cards directly here; keep writing in newest-first order and update each section's item count when adding or removing cards.
- `styles.css` defines the sidebar, responsive galleries, locally hosted DM Sans fonts, and dusty rose accents. Edit the color variables in `:root` to change the palette.
- `gallery.js` enhances the existing HTML with hash-based section navigation, the mobile menu, page transitions, and event-photo masonry. Without JavaScript (or if the script fails to load), all sections remain visible, the mobile navigation stays available, and links work as ordinary anchors. No build step is required.

Existing section and card hashes, including `#writing/jev`, continue to work with JavaScript. Without JavaScript, use `#writing`, `#work`, `#events`, or a card's native anchor such as `#card-jev`. Photo-only cards still link to their full-size originals.

## Gallery images

Gallery cards use local WebP thumbnails with responsive `srcset` and `sizes`, explicit dimensions, and native lazy loading. Original images are retained for full-size links and source attribution. Do not replace an original with a thumbnail.

To generate thumbnails for a new or updated original, install Pillow in your Python environment and run:

```sh
python3 scripts/optimize_images.py assets/new-cover.png
```

The script writes variants up to 480, 960, and 1440 pixels wide to `assets/thumbnails/`, without upscaling. Reference the generated variants in the card's `srcset`, copy the matching gallery's `sizes` attribute, and set `width` and `height` to the default thumbnail's dimensions. This is an optional asset-maintenance tool, not a requirement for serving the site.

## Checks

Run `npm test` with Node.js 24 and Python 3. The dependency-free checks cover JavaScript syntax, enhanced routing and menus, HTML-only content and anchors, and responsive image references. There is no TypeScript compilation or application build step.

Local edits do not publish automatically. The existing GitHub Pages deployment changes only after the repository's publishing flow is triggered.
