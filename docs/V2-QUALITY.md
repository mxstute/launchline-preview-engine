# Preview Engine v2 — editorial, curated builds

Implemented first: **Blue Magic Pools / Miami**. This is one new pool-services design system, not a claim that five niche systems are finished. The old renderer and 50 generated folders are retained as legacy source, but Vercel publishes only `dist`, generated from selected curated records.

## Run

```sh
npm test
npm run build
npx serve dist
```

Node 22+; no runtime packages or paid AI/API keys required. The build fetches three allowlisted Unsplash images and stores them in the deployed assets directory. The webfont stylesheet uses Google Fonts, with Georgia/Arial fallbacks. Build failure is preferable to publishing broken mandatory media.

## Input, not guessed enrichment

`data/curated/*.json` holds researched public facts, their sources, deliberately written customer-facing copy, exact short review excerpts, and media provenance. `publish` allows staging a visual concept. `outreachApproved` is separate and false until the owner of Launchline approves the design and the recipient is independently verified. Nothing sends email or SMS automatically.

`src/v2/render.mjs` validates required facts and media, renders `templates/v2/pool.html`, and escapes text. It never mines an internal research note for a rating. It refuses unknown templates instead of using a generic fallback. The public build never includes the private outreach manifest or lead-email data.

## Blue Magic findings

Matching business phone: +1 786-251-2470. Matching Miami records identify a pool-leak specialist. Do not blend in the similarly named Coral Springs business, its licensing, or BBB information. Do not repeat the earlier 663/665 review-count claim. No reliable first-party photo gallery or customer email was established in this build. All photographs are stock lifestyle imagery and are disclosed as such; none is labeled company work. Source URLs and exclusions are in the curated record.

Reviews are short, attributed excerpts. They are not invented and not presented as recent or as an aggregate score. The sources include third-party directories, so final business approval remains necessary.

## Interaction and privacy

Customer CTAs use the published business phone. The concern selector updates local on-page copy only. No form collects names, health information, payment information, or email. FAQ disclosures, navigation, pause-motion, reduced-motion preferences, and mobile call access are implemented. No fake appointment confirmation, estimated revenue promise, or fictional availability.

## Release gate for each next lead

1. Verify business identity and contact against attributable sources.
2. Verify the offered services, not merely the category.
3. Write final customer-facing copy; never expose prospecting notes.
4. Curate and license the media; do not use another company's portfolio as the prospect's work.
5. Inspect desktop/mobile screenshots and interactions; check zero horizontal overflow and loaded images.
6. Approve the design and recipient before outreach. Keep the old mass batch unsent.

No conversion lift, revenue result, or owner approval is claimed by these technical checks.
