# Generated marketing creatives

PNGs here are created by `scripts/generate-image.mjs` (OpenAI image API)
during `/marketing-run`. Each file is named `<slug>.png` where the slug
matches the artifact in `content/marketing/<slug>.md`.

Served at `https://jobsearch.quest/marketing/<slug>.png`. The OG route
(`/api/og?slug=<slug>`) redirects to the PNG if it exists, and falls back
to a branded Satori card otherwise — so every UTM-tagged link gets a
good social preview whether the agent generated a creative or not.
