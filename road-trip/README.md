# Desert Reverie

A standalone, poster-style itinerary for the 10-day Phoenix → Sedona → Grand Canyon → Page / Antelope Canyon → Bryce → Zion → Las Vegas trip. Original paintings and the music trailer come from the traveler's earlier animation. The per-stop day allocation is explicitly a suggested pace, not a booking or a claim about confirmed plans.

## Run

No dependencies or build step. From this directory:

```sh
python3 scripts/serve.py --port 3000
```

Open the served root. This also works from the parent site's `/road-trip/` path; every local asset URL is relative. It does not change the portfolio homepage or navigation. Merging this folder into the personal-site repository would publish `/road-trip/`, so leave the PR unmerged until the owner approves that publication.

## Assets

- Eight WebP stills extracted from the original 20-second painterly road-trip trailer.
- `assets/trailer.mp4`: the original trailer with the previously approved instrumental music.
- Barlow Condensed Bold and DM Sans Regular from Google Fonts, self-hosted under the SIL Open Font License (included with the fonts).
- A custom desert/road SVG icon and PNG home-screen variants.

Native disclosure elements keep the itinerary readable without JavaScript. JavaScript syncs the selected artwork and opens an accessible native film dialog. No analytics, external scripts, credentials, service worker, or runtime network dependencies are needed. Maps links open Google Maps in a new tab.
