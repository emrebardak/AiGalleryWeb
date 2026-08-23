# AI Gallery

A minimalist gallery for AI-generated before/after image pairs and the prompts that made them. Hero, category filter, masonry grid, and a detail modal with before/after images, the prompt, and a copy button.

**Live:** https://promptgallery.agunzagunt.workers.dev

## Features

- **Masonry gallery grid** with category filtering, cards keep their natural photo aspect ratio
- **Detail modal** — before/after images, the generation prompt (clamped to 3 lines), one-tap copy
- **Shared-layout morph** — clicking a card animates its image directly into the modal and back, no crossfade
- **Add a card from your phone** — a hidden `/#add-card` page lets you add new gallery items (pick or upload photos, write a prompt) without touching a code editor; submissions commit straight to the repo and redeploy automatically
- **Delete a card** from its modal, with confirmation
- Dark-only, cold-mono visual system with a single accent color

## Tech stack

- React 18 + Vite + TypeScript
- Tailwind CSS
- [Framer Motion](https://www.framer.com/motion/) for all JS-driven animation (scroll parallax, staggered reveal, shared-layout morph)
- [lucide-react](https://lucide.dev/) for icons
- Cloudflare Workers (with static assets) for hosting, plus [wrangler](https://developers.cloudflare.com/workers/wrangler/)
- Cloudflare R2 for uploaded photos
- [Vitest](https://vitest.dev/) for the handful of functions that have real logic to test

## How it works

There's no database and no admin backend. Gallery items live in [`src/data/gallery.json`](src/data/gallery.json), bundled into the site at build time. A single Cloudflare Worker ([`worker/index.ts`](worker/index.ts)) serves the built static site and three API routes:

- `POST /api/add-card` — validates the submission, then reads, appends to, and writes `gallery.json` back via the GitHub Contents API. The commit lands on `master` and triggers Cloudflare's normal git-connected auto-deploy — the new card shows up after that build finishes, not instantly.
- `POST /api/delete-card` — same read/write pattern, removes an item by id.
- `POST /api/upload-image` + `GET /images/uploads/*` — photos picked in the add-card form upload to an R2 bucket and are served back through the Worker's own domain.

There's no authentication on any of this. It's a single-user personal site, and a delete is recoverable via git history if it's ever needed. See [`docs/superpowers/specs/2026-08-23-add-card-design.md`](docs/superpowers/specs/2026-08-23-add-card-design.md) for the full design.

## Development

```bash
npm install
npm run dev
```

Other scripts:

```bash
npm run build   # tsc -b && vite build
npm test        # vitest run
npm run lint    # oxlint
```

## Adding a gallery item

Two ways:

1. **From the site** — visit `/#add-card` (there's a link under the hero's subtext too), fill in category, image(s), and prompt.
2. **By hand** — edit [`src/data/gallery.json`](src/data/gallery.json) directly and commit. Useful for bulk changes.

`beforeImage`/`afterImage` accept any image URL, not just local paths. Leaving `beforeImage` blank falls back to a shared placeholder.

## Project structure

```
src/
  types.ts               # GalleryItem type
  data/gallery.json       # the gallery data (edit directly, or via /#add-card)
  data/gallery.ts         # thin re-export of gallery.json
  components/
    Hero.tsx, FilterBar.tsx, GalleryGrid.tsx, GalleryCard.tsx, Modal.tsx
    AddCardPage.tsx        # the /#add-card form
  App.tsx                  # hash-based routing between gallery and add-card views
worker/
  index.ts                 # Cloudflare Worker: static assets + the three API routes
  addCard.ts                # pure gallery.json append/remove logic (unit tested)
wrangler.jsonc              # Worker config: assets binding, R2 binding, env vars
```

## Deploying your own

1. Push this repo to your own GitHub
2. In the Cloudflare dashboard: **Workers & Pages → Create → Connect to Git**, framework preset **Vite**
3. Set a `GITHUB_TOKEN` Worker secret (fine-grained PAT, Contents: Read and write, scoped to your repo) if you want the add-card feature to work
4. Create an R2 bucket matching `wrangler.jsonc`'s `bucket_name` if you want photo uploads to work

Full design specs are in [`docs/superpowers/specs/`](docs/superpowers/specs/).
