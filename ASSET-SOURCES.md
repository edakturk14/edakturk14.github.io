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
- `assets/batches-onboarding.png`: BG Onboarding Batches artwork supplied directly by Eda on October 9, 2026, replacing the general BuidlGuidl illustration.
- `assets/talk-web3.jpg`: the thumbnail of the [first video in the Web2 to Web3 series](https://www.youtube.com/watch?v=zuJ-elbo88E).
- `assets/builder-show-wide.png`: a landscape extension of The Builder Show artwork supplied by Eda, made with the built-in imagegen tool on October 9, 2026. The blue background extends at the sides to fit the same 16:9 card format as the other videos. Original: `assets/builder-show-hosts.png`.

The grant and judging entries use original artwork from the organizations’ official websites. The Seoul card links directly to Eda’s workshop recording and uses its thumbnail. Gallery titles and source links are always visible. Writing, talk, and event cards link directly to their destination; the podcast, video series, and Projects and Community cards have descriptions on desktop and mobile. The podcast, zero-knowledge guide, Claude post, and intents guide also include links to Eda’s X announcements supplied on October 9, 2026. Images have no added padding or colored background, and CSS gently reduces saturation until hover or keyboard focus. The contact address was supplied by Eda for this redesign.

The Work page groups longer videos (the podcast and series), talks and workshops (including demos), and projects and community work. The Web2 to Web3 card links to the full playlist supplied by Eda: https://www.youtube.com/watch?v=zuJ-elbo88E&list=PLJz1HruEnenAf80uOfDwBPqaliJkjKg69.

- `assets/demo-hyperlane-opening.png`: the unedited opening frame at 0:00.1 from [Hyperlane’s MCP demo](https://x.com/hyperlane/status/1935063992827092996), captured from the video and selected by Eda from the preview options. Replaces the original AI artwork thumbnail with Eda presenting.
- `assets/demo-onchainkit.jpg`: original video thumbnail from [Eda’s Scaffold-ETH 2 and OnchainKit demo](https://x.com/edatweets_/status/1823003723548762597). [Original image](https://pbs.twimg.com/ext_tw_video_thumb/1823002994163732480/pu/img/uzQuMZHpWvRMGUjT.jpg).

## Local preview

Run `npm run dev` (requires Python 3), then visit http://127.0.0.1:3000. The site is plain HTML, CSS, and JavaScript with no build step or external runtime dependencies. No remote changes are needed to preview it.

## Builder Show image edit

Mode: built-in imagegen. Saved output: `assets/builder-show-wide.png`.

Prompt: Edit target: the supplied square Builder Show artwork. Create a 16:9 landscape website thumbnail by extending ONLY the left and right sides with the exact same flat periwinkle blue background. Keep the original square artwork centered at full canvas height, completely visible and unchanged: preserve both people's faces, hair, bodies, poses, clothing, the BuidlGuidl logo, the exact text THE BUILDER SHOW, and the existing illustrations. Do not crop the original at all. Do not redraw, beautify, or alter either face. The added side areas should be plain matching blue, no new objects or text. Output a 16:9 landscape image.

## Writing archive

The Writing page has compact links to the current Substack and earlier Paragraph and Hashnode blogs. The About Me “writing online since 2021” note is supported by [My Web3 Journey: Day 50 of #100daysofWeb3](https://eda.hashnode.dev/my-web3-journey-day-50-of-100daysofweb3), whose page displays November 20, 2021. JEV’s card shows 2026, matching its existing publication date in the content data.

- `assets/100-days-web3.png`: My Web3 Journey: Day 100 of #100daysofWeb3 cover supplied directly by Eda on October 9, 2026, replacing the portrait on the challenge card.
