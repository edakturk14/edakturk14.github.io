# Eda Akturk

Personal website, experience, writing, talks, and proof of work. Static HTML/CSS with local DM Sans fonts, a white background, dusty rose accents, and the existing sidebar and galleries. Compatible with GitHub Pages and static hosting.

## Local preview

Run `npm run dev`, then open http://localhost:3000. Requires Node.js and Python 3; no package installation is needed. To use another port, run `npm run build` followed by `python3 -m http.server 4173 --bind 127.0.0.1`.

## Editing

- `content/home.html`: homepage copy and positioning.
- `content/experience.html`: career entries and proof links.
- `content/gallery.mjs`: 30 portfolio entries, links, and work groups.
- `content/layout.html`: shared sidebar, navigation, social links, and metadata template.
- `content/site.mjs`: page metadata and the single production origin.
- `styles.css`: shared styling and responsive layouts.
- `gallery.js`: mobile navigation, event masonry, and compatibility for old hash links.
- `scripts/thumbnails.mjs`: responsive image discovery, encoded dimensions, and display sizes matching the gallery layout.

## Gallery thumbnails

Cards use local WebP thumbnails at up to 480, 960, and 1440 pixels wide. The build discovers matching files in `assets/thumbnails/` and writes `srcset`, `sizes`, and intrinsic dimensions into the generated HTML. The first three cards on each page load eagerly; subsequent cards load lazily. Original images remain available through full-size photo links. A new image without thumbnails falls back to its original file.

To generate thumbnails for a new or replaced image, use a separate Python environment with Pillow, then rebuild:

```sh
python3 -m venv /tmp/eda-image-tools
/tmp/eda-image-tools/bin/pip install Pillow==12.0.0
/tmp/eda-image-tools/bin/python scripts/optimize_images.py assets/your-image.png
npm run build
npm test
```

Commit the thumbnails and regenerated pages with the content change. The optimizer preserves aspect ratio, corrects EXIF orientation, and never enlarges the source. Normal builds and deployments do not need Pillow. Regression checks verify that every current gallery card has valid responsive images, while retaining its original destination, ordering, and loading priority.

After editing content, run `npm run build`. The dependency-free generator writes `index.html`, `experience/index.html`, `work/index.html`, `writing/index.html`, `events/index.html`, `sitemap.xml`, and `robots.txt`. Keep those outputs with the source changes so static hosts do not require a build step. Do not edit generated HTML directly.

`vercel.json` explicitly selects the static "Other" framework, runs the generator, and serves its output from the repository root. This avoids relying on Vercel’s framework/output-directory detection after adding the build script.

All new routes contain their content in HTML and work without JavaScript. Internal navigation and proof links are ordinary links. Existing `#writing`, `#work`, `#events`, `#talks`, `#other-work`, `#photos`, `#judging`, and `#section/item` bookmarks redirect to the matching page when JavaScript is available. Asset URLs and external destinations are preserved.

## Verification

Run `npm run build` and `npm test`. Checks cover legacy routes, direct proof anchors, local assets, navigation, all 30 portfolio cards, the five experience entries, headings, canonical URLs, and the sitemap. Browser-based visual and mobile interaction review is still needed; computer-use permission was unavailable in this session.

Dates and Koç University education come from the CV screenshots Eda supplied on November 6, 2026. Hyperlane is current (Sep 2024–Present). Cisco is combined as Aug 2019–Jan 2022, covering the CSAP and subsequent technical sales roles. GE Healthcare was her first paid software developer role on the service team. No education dates were supplied, so none are shown. Experience links to organization websites. The Hyperlane entry weaves Eda’s six supplied proof links into its ownership bullets; the separate rows of proof links remain removed. The launch names, Composable interview title, and community-built Hyperlane MCP announcement were checked against public X post metadata; ownership descriptions come from Eda.

## Analytics

Vercel Web Analytics is loaded on all five pages through `analytics.js` in the shared layout. Enable Web Analytics in the Vercel project dashboard, then deploy these changes. Vercel serves the tracking script at `/_vercel/insights/script.js`; no React component or package installation is needed for this static site. Visits are tracked only on the canonical production origin, keeping localhost and preview traffic out of the dashboard. Verify real page views in the Analytics dashboard after deployment; local checks cannot confirm ingestion.

## Future domain move

Update `origin` in `content/site.mjs`, then run `npm run build` to refresh canonical URLs, social metadata, the sitemap, and robots.txt. Internal links and assets use host-relative paths. When the new domain is ready, configure permanent redirects on the existing host from both edatweets.com and www.edatweets.com to the new domain, preserving paths and query strings. No domain or hosting changes have been made.
