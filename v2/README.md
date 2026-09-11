# Preview Engine v2 — first curated release

This release rebuilds Blue Magic Pools as a complete customer-facing website concept. It is not a new 50-site batch and is not an outreach sender.

## Run

```bash
npm run build:v2
npm run test:v2
python3 -m http.server 4173 --directory dist-v2
```

Open `/blue-magic-pools/` on the local server. Vercel runs the build and regression checks and publishes only `dist-v2`.

## Implemented

- First art-directed pool-specialist master with real stock pool imagery, ivory/teal/sage palette, display typography, customer-focused copy, service tabs, linked short customer-review excerpts, FAQ, and a persistent mobile call action.
- The concern selector only changes on-page copy. It does not send or save data.
- Node-only build, with no application API credentials or third-party tracking.
- Input validation for business/source/phone/media data; internal sales notes and placeholder strings are rejected.
- Unknown templates/businesses are rejected rather than rendered into generic shells. This first template has not yet been adapted to other businesses.
- Up to ten reviewed inputs per build. New niche masters must be developed and visually checked before adding their records.
- `outreachApproved` stays false until review is complete. Publishing a design for Myles to inspect is not the same as approving it for prospect outreach.

## Publication behavior

The original `output` and `output50` files remain untouched in source control for history. They are NOT part of this release's output. The public index contains only the rebuilt Blue Magic Pools concept. No CRM recipient lists or internal sales notes are included in its manifest.

## Content and media provenance

Matched business: Blue Magic Pools, Miami, telephone +1 (786) 251-2470. Sources are stored in `data/blue-magic-pools.json` for each service and review excerpt. The Yellow Pages excerpt is by **Oscar A., September 16, 2020**, not Camilo J.

The old 663-review/5.0 aggregate is excluded because it has not been reliably established for this exact business. No licenses, guaranteed availability, free-estimate offer, staff profiles, or completed projects are invented.

The three pool photos are illustrative stock from Unsplash, not the business's own projects. Credit links and a visible disclosure appear on the site. The hero has a subtle CSS image animation, not video. The design uses remotely hosted photo and font assets; availability is an external dependency. The final client site should use owner-approved business/project photos and content.

## QA performed on September 11, 2026

`npm run test:v2`: **21 checks passed**, including negative tests for missing sources/phone, unsafe URLs, unsupported templates, unverified rating aggregates, excessive copying, and unapproved outreach states.

Chromium browser checks at 360, 390, 768, 1024, and 1440 pixels:

- no horizontal overflow;
- all three images loaded and decoded;
- no page JavaScript errors;
- service tabs change the correct panel;
- FAQ details expand;
- concern selection updates the message without network submission;
- mobile menu opens and Escape closes it;
- reduced-motion preference disables hero animation.

Screenshots were captured for desktop/mobile, with a small desktop image inspected. This does not establish full accessibility conformance, physical-iPhone Safari testing, conversion performance, or the business owner's approval.

## Not implemented / not claimed

Other niche masters, 50 upgraded previews, automated source verification, live appointment scheduling, quote-form submission, CRM sync, video generation, automated email/SMS, conversion tracking, and measured sales results.
