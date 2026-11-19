# Eda Akturk

Personal website, experience, writing, talks, and proof of work. Static HTML/CSS with local DM Sans fonts, a white background, dusty rose accents, and the existing sidebar and galleries. Compatible with GitHub Pages and static hosting.

## Local preview

Run `npm run dev`, then open http://localhost:3000. Requires Node.js and Python 3; no package installation is needed. To use another port, run `npm run build` followed by `python3 -m http.server 4173 --bind 127.0.0.1`.

## Editing

- `content/home.html`: homepage copy and positioning.
- `content/experience.html`: career entries and proof links.
- `content/gallery.mjs`: 22 active portfolio entries, six archived event photos, and two archived demos, links, and work groups.
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

Run `npm run build` and `npm test`. Checks cover legacy routes, direct proof anchors, local assets, navigation, all 22 portfolio cards, the five experience entries, headings, canonical URLs, and the sitemap. Browser review covers the desktop and mobile layouts, with both light and dark themes.

Dates and Koç University education come from the CV screenshots Eda supplied on November 6, 2026. Hyperlane is current (Sep 2024–Present). Cisco is combined as Aug 2019–Jan 2022, covering the CSAP and subsequent technical sales roles. GE Healthcare was her first paid software developer role on the service team. No education dates were supplied, so none are shown. Experience links to organization websites. The Hyperlane entry weaves Eda’s six supplied proof links into its ownership bullets; the separate rows of proof links remain removed. The launch names, Composable interview title, and community-built Hyperlane MCP announcement were checked against public X post metadata; ownership descriptions come from Eda.

## Analytics

Vercel Web Analytics is loaded on all five pages through `analytics.js` in the shared layout. Enable Web Analytics in the Vercel project dashboard, then deploy these changes. Vercel serves the tracking script at `/_vercel/insights/script.js`; no React component or package installation is needed for this static site. Visits are tracked only on the canonical production origin, keeping localhost and preview traffic out of the dashboard. Verify real page views in the Analytics dashboard after deployment; local checks cannot confirm ingestion.

## Future domain move

Update `origin` in `content/site.mjs`, then run `npm run build` to refresh canonical URLs, social metadata, the sitemap, and robots.txt. Internal links and assets use host-relative paths. When the new domain is ready, configure permanent redirects on the existing host from both edatweets.com and www.edatweets.com to the new domain, preserving paths and query strings. No domain or hosting changes have been made.

## Work with me

The services live on `/work-with-me/`, separate from the About introduction. Edit `content/work-with-me.html` and rebuild. The old `/#work-with-me` link redirects to the standalone page.

## Color theme

White is the default regardless of system appearance. The shared Dark mode switch remembers an explicit choice in localStorage. `theme.js` restores that choice before styles load. Both themes use shared CSS variables. Services use lightweight entrance and hover motion and respect reduced-motion preferences.

## Events page retirement

Events is removed from navigation and the sitemap. The old `/events/` URL redirects to Talks & workshops in Selected Work. ETHGünü’s stage photo and recording are now a talk card there. Existing event assets and six archived event entries remain available for future reuse in `archivedEventPhotos`.

## About photos

The About page includes a compact, automatically moving collage with varied image sizes, staggered positions, gentle angles, hover lift, a pause control, and touch scrolling. It respects reduced-motion preferences.


## Project enquiries

The Work with me page includes company/contact fields, service selection, project details, optional timeline, and optional budget. `intake-form.js` sends these to FormSubmit for delivery to the existing `edakturk19@gmail.com` contact address. The form also works as a normal POST without JavaScript. The AJAX flow includes validation, a sending state, confirmed-submission feedback, and an email fallback that retains the enquiry if delivery cannot be confirmed.

**Activation required:** the first real submission triggers FormSubmit's confirmation email. Eda must activate delivery from that email before enquiries are forwarded. FormSubmit retains pending submissions for 30 days. Local tests use a fake fetch function; they never send real messages or verify inbox delivery. Send one test through the deployed form and confirm the inbox link before relying on the form for enquiries. See https://formsubmit.co/help and https://formsubmit.co/documentation.

No API keys, accounts, or server functions are required in the repository. A hidden honeypot is included. FormSubmit's native form flow may also use its own spam challenge. Keep the direct email option available.

## Entrance motion

`motion.js` reveals text, work cards, and experience sections once as they enter the viewport. Motion lasts 700 ms with a short stagger. JavaScript and IntersectionObserver are optional; content stays visible without them. Reduced-motion preferences disable the reveal animation and automatic photo movement.
