# Launchline Preview-First Engine

The first curated v2 release is deployed from `main`. Blue Magic Pools is the first rebuilt, customer-facing design.

## Current production build

```bash
npm run build:v2
npm run test:v2
python3 -m http.server 4173 --directory dist-v2
```

Open `/blue-magic-pools/`. Vercel publishes `dist-v2` using the repository configuration. The historical `output` and `output50` directories are retained in source control but are not the production output.

## Current scope

- One curated pool-specialist design, not 50 upgraded websites.
- Pool-specific service content, sourced short review excerpts, responsive navigation, service tabs, FAQ, concern selector, and direct phone links.
- Illustrative stock imagery, disclosed as such; subtle CSS image animation, not video.
- Source requirements and input validation. No invented rating aggregate, prices, licenses, or completed projects.
- Design publication is not outreach approval. No email or SMS is sent by this generator.

See `v2/` for the active implementation and its documentation. The legacy `src/generate.mjs` command remains for historical compatibility; do not use its generic output for prospect outreach.
