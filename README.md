# Launchline Preview-First Engine

Turns enriched local-business lead data into personalized, deployable preview sites.

## What it does
- Reads JSON/CSV leads
- Maps each lead to a niche template
- Uses only supplied/verified facts (no invented services/reviews)
- Generates a polished mobile-first preview per lead
- Writes `output/<slug>/index.html`
- Writes `output/manifest.json` with preview paths + outreach fields
- Supports batching (`--limit`, `--offset`)

## Quick start
```bash
npm run generate -- --input examples/leads.json --limit 10
npm run serve
```
Then open http://localhost:4173/<slug>/

## Input fields
Required:
- `business_name`
- `vertical`

Recommended:
- `city`
- `phone`
- `email`
- `rating`
- `review_count`
- `services` (array)
- `photos` (array of URLs)
- `reviews` (array of `{text,author}`)
- `service_area`
- `address`
- `hours`
- `verified_observation`
- `cta`

## Safety / quality rules
- Never fabricate reviews, services, awards, years in business, licenses, prices, or guarantees.
- If a field is missing, the section is omitted or phrased generically.
- Preview banner makes it clear the page is a concept, not the live business site.
