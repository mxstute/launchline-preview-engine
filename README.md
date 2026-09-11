# Launchline Preview-First Engine v2

Curated, customer-facing website concepts. The first implemented design is **Blue Magic Pools, Miami**: an editorial pool-leak-services website with a photographic hero, mobile navigation, service sections, attributed review excerpts, a local concern selector, and direct phone CTAs.

## Build and view

```sh
npm test
npm run build
npx serve dist
```

Open `/blue-magic-pools/` on the local server. Node 22+; no application dependencies, AI API keys, paid media-generation calls, or CRM credentials are required. The build downloads three licensed stock photographs into per-business assets; it fails if mandatory media cannot be retrieved. Photography has subtle CSS pan/zoom, not generated video.

Vercel runs `npm run build` and publishes **dist**, controlled by `vercel.json`. A push to the linked production branch triggers its deployment. Do not set the output back to `output50`.

## Content and quality

- `data/curated/blue-magic-pools.json`: customer-facing copy, researched business facts, source URLs, exclusions, media provenance, and independent outreach-approval flag.
- `templates/v2/pool.html`, `pool.css`, `pool.js`, `controls.css`: the pool design system and tested interactions.
- `src/v2/render.mjs`: source-aware validation and safe HTML rendering.
- `src/v2/build.mjs`: clean build, checked/self-hosted media, curated index, and a private local manifest.
- `scripts/test-v2.mjs`: regression checks.
- `scripts/qa-browser-v2.mjs`: optional Playwright checks at 360, 390, 768, 1024, and 1440 pixels plus reduced-motion behavior. Install Playwright only in your development/QA environment; it is not needed for deployment.
- `docs/V2-QUALITY.md`: operating notes and the next-preview release gate.

Business-owner approval, email-recipient verification, and sending are separate from website publication. **No messages are sent by this repository.** Current public evidence is drawn from attributable directories and needs business approval before an official website launch. Unknown claims, aggregate ratings, and internal lead notes are not shown. Stock images are not presented as completed company projects. The concept does not collect visitor information.

## Legacy v1

The old `src/generate.mjs`, `examples/`, `output/`, and `output50/` remain in version control for reference. They are **not** included in the v2 public deployment or approved for outreach. Only curated records explicitly selected with `publish: true` are built. The previous 50 generic pages are not 50 v2 designs.

The legacy command remains available for research/testing only:

```sh
npm run generate -- --input examples/leads.json --limit 10
```

Next businesses need individually researched copy and an appropriate implemented design; v2 refuses unsupported templates rather than silently generating a generic substitute.
