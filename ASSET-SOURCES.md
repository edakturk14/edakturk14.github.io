# Gallery asset sources

The October 2026 local redesign retains the site's existing photographs, captions, font files, and destination links. Gallery content and ordering live in `gallery.js`.

Additional images:

- `assets/cover-grok-bot.png`: original cover from [Building a company in 3 days with Grok Bot](https://edatweets.substack.com/p/building-a-company-in-3-days-with). [Original image](https://substack-post-media.s3.amazonaws.com/public/images/644fba67-4fe4-4e85-8c00-fbf6d3ba7e10_1731x909.png).
- `assets/cover-jev-diagram.png`: the System 1 / System 2 comparison diagram supplied directly by Eda for [JEV for everyone else](https://edatweets.substack.com/p/jev-for-everyone-else). Displayed uncropped, with no added padding or background.
- `assets/ef-garden.png`: official forest/garden illustration from [The Ethereum Foundation’s Vision](https://blog.ethereum.org/2025/04/28/ef-vision). [Original image](https://storage.googleapis.com/ethereum-hackmd/upload_d984abf1f8154b4a02f8b742f328b5e9.png). Illustrative branding, not an image of Eda’s grant.
- `assets/ethglobal-tokyo.jpg`: official nighttime city illustration from [ETHGlobal Tokyo](https://ethglobal.com/events/tokyo). [Original image](https://ethglobal.b-cdn.net/events/tokyo/images/g1sax/default.jpg). Used as branding for hackathon judging.

- `assets/talk-intents.jpg`: the thumbnail of the [existing ETHCC recording](https://www.youtube.com/watch?v=-nKZEl3M9oY).
- `assets/talk-seoul.jpg`: the thumbnail of [Eda’s ETH Seoul 2024 workshop](https://www.youtube.com/watch?v=FYuDggnYpFA&t=72s), supplied by Eda. The title was checked against YouTube metadata, and the link preserves the 1:12 start time.

- `assets/claude-hats.png`: the original image from [2 Hours in Line for a Free Hat](https://edatweets.substack.com/p/2-hours-in-line-for-a-free-hat), copied from the existing local project asset. [Original image](https://substack-post-media.s3.amazonaws.com/public/images/79e3e5a7-defc-4470-8539-53ff1db1d17a_882x802.png).
- `assets/cover-lovable.png`: an image from [On Lovable](https://edatweets.substack.com/p/on-lovable). [Original image](https://substack-post-media.s3.amazonaws.com/public/images/57a8ad67-b27c-4e8c-a432-4f939a51e7d3_1866x932.png).
- `assets/cover-intents.png`: original cover from [A Developer’s Guide to Intents](https://paragraph.com/@edatweets/a-developer-s-guide-to-intents-the-open-intents-framework).
- `assets/cover-hyperlane.png`: original cover from [A Developer’s Guide to Interoperability with Hyperlane](https://paragraph.com/@edatweets/a-developer-s-guide-to-interoperability-with-hyperlane).
- `assets/cover-zk.png`: original cover from [Zero-Knowledge Proofs in Plain English](https://paragraph.com/@edatweets/zero-knowledge-proofs-in-plain-english).
- `assets/cover-batches.png`: [BuidlGuidl’s social preview illustration](https://buidlguidl.com/thumbnail.png), linked from its batches page. This is project artwork, not an image of a particular cohort.
- `assets/talk-web3.jpg`: the thumbnail of the [existing linked workshop recording](https://www.youtube.com/watch?v=zuJ-elbo88E).
- `assets/talk-builder.jpg`: the thumbnail of the [existing linked Builder Show episode](https://www.youtube.com/watch?v=cPNrYKR9rtI).

The grant and judging entries use original artwork from the organizations’ official websites. The Seoul card links directly to Eda’s workshop recording and uses its thumbnail. Gallery titles and source links are always visible, and additional article details expand inline. Images have no added padding or colored background, and CSS gently reduces saturation until hover or keyboard focus. The contact address was supplied by Eda for this redesign.

## Local preview

Run `npm run dev` (requires Python 3), then visit http://127.0.0.1:3000. The site is plain HTML, CSS, and JavaScript with no build step or external runtime dependencies. No remote changes are needed to preview it.
