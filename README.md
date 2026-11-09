# Eda Akturk

Personal website, experience, writing, talks, and proof of work. Static HTML/CSS with local DM Sans fonts, a white background, dusty rose accents, and the existing sidebar and galleries. Compatible with GitHub Pages and static hosting.

## Local preview

Run `npm run dev`, then open http://localhost:3000. Requires Node.js and Python 3; no package installation is needed. To use another port, run `npm run build` followed by `python3 -m http.server 4173 --bind 127.0.0.1`.

## Editing

- `content/home.html`: homepage copy and positioning.
- `content/experience.html`: career entries and proof links.
- `content/gallery.mjs`: 29 portfolio entries, links, and work groups.
- `content/layout.html`: shared sidebar, navigation, social links, and metadata template.
- `content/site.mjs`: page metadata and the single production origin.
- `styles.css`: shared styling and responsive layouts.
- `gallery.js`: mobile navigation, event masonry, and compatibility for old hash links.

After editing content, run `npm run build`. The dependency-free generator writes `index.html`, `experience/index.html`, `work/index.html`, `writing/index.html`, `events/index.html`, `sitemap.xml`, and `robots.txt`. Keep those outputs with the source changes so static hosts do not require a build step. Do not edit generated HTML directly.

`vercel.json` explicitly selects the static "Other" framework, runs the generator, and serves its output from the repository root. This avoids relying on Vercel’s framework/output-directory detection after adding the build script.

All new routes contain their content in HTML and work without JavaScript. Internal navigation and proof links are ordinary links. Existing `#writing`, `#work`, `#events`, `#talks`, `#other-work`, `#photos`, `#judging`, and `#section/item` bookmarks redirect to the matching page when JavaScript is available. Asset URLs and external destinations are preserved.

## Verification

Run `npm run build` and `npm test`. Checks cover legacy routes, direct proof anchors, local assets, navigation, all 29 portfolio cards, the five experience entries, headings, canonical URLs, and the sitemap. Browser-based visual and mobile interaction review is still needed; computer-use permission was unavailable in this session.

Dates and Koç University education come from the CV screenshots Eda supplied on November 6, 2026. Hyperlane is current (Sep 2024–Present). Cisco is combined as Aug 2019–Jan 2022, covering the CSAP and subsequent technical sales roles. GE Healthcare was her first paid software developer role on the service team. No education dates were supplied, so none are shown. Experience links to organization websites. The Hyperlane entry weaves Eda’s six supplied proof links into its ownership bullets; the separate rows of proof links remain removed. The launch names, Composable interview title, and community-built Hyperlane MCP announcement were checked against public X post metadata; ownership descriptions come from Eda.

## Future domain move

Update `origin` in `content/site.mjs`, then run `npm run build` to refresh canonical URLs, social metadata, the sitemap, and robots.txt. Internal links and assets use host-relative paths. When the new domain is ready, configure permanent redirects on the existing host from both edatweets.com and www.edatweets.com to the new domain, preserving paths and query strings. No domain or hosting changes have been made.
