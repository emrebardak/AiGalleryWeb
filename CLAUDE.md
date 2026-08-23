# AiGalleryWeb

Minimalist SPA gallery for AI before/after image pairs + prompts. Hero → filter bar → grid → modal (before/after + prompt + copy).

Design specs: [2026-08-22-ai-gallery-design.md](docs/superpowers/specs/2026-08-22-ai-gallery-design.md) (original gallery), [2026-08-23-deploy-design.md](docs/superpowers/specs/2026-08-23-deploy-design.md) (hosting), [2026-08-23-add-card-design.md](docs/superpowers/specs/2026-08-23-add-card-design.md) (add-card form + backend) — read the relevant one before making structural changes.

Live at https://promptgallery.agunzagunt.workers.dev, auto-deploying from `master` via Cloudflare's git integration.

## Stack
- React 18 + Vite + TypeScript
- Tailwind CSS
- Framer Motion (`framer-motion`) — the one JS animation library used in this project. Do not add a second one (e.g. GSAP) alongside it; animation libraries fight over the same frames if mixed on the same elements.
- lucide-react (icons)
- No router library — a hand-rolled `window.location.hash === 'add-card'` check in `App.tsx` toggles between the gallery view and `AddCardPage`. Don't reach for React Router for this.
- Gallery items live in `src/data/gallery.json` (imported as a thin re-export from `src/data/gallery.ts`) — a plain data file, not a database.

## Deploy & backend
- Cloudflare Worker (`worker/index.ts`, config in `wrangler.jsonc`) serves the built static site (`ASSETS` binding) and three API routes: `POST /api/add-card`, `POST /api/delete-card`, `POST /api/upload-image` + `GET /images/uploads/*`.
- Add/delete both read-modify-write `src/data/gallery.json` directly on GitHub via the Contents API (a `GITHUB_TOKEN` Worker secret, fine-grained PAT scoped to just this repo), which triggers a normal push-to-`master` auto-deploy — no separate database.
- Uploaded photos go to a Cloudflare R2 bucket (`IMAGES` binding, bucket `promptgallery-uploads`) and are served back through the Worker's own domain, not R2's public dev URL.
- No auth on any of these routes — accepted risk, single-user site. A delete requires a browser `confirm()` but nothing stops a direct API call; git history is the recovery path if that's ever a problem.
- Pure logic (`appendGalleryItem`, `removeGalleryItem` in `worker/addCard.ts`) is unit tested with Vitest (`npm test`); the Worker's fetch/GitHub-API glue is not.

## Visual design
- **Colors:** cold mono, dark-only — `zinc-950` background / `zinc-50` text. No light theme, no theme toggle. Electric blue for focus rings everywhere. One deliberate exception: the Modal's copy-prompt button turns green (`text-green-500`) on success (explicit user call, overriding the original single-accent rule for that one state). Don't add further colors beyond these two without asking — error text stays plain `zinc-400`, not red.
- **Fonts:** `Boxing` (self-hosted, `public/fonts/Boxing-Regular.woff2`) for the hero headline ONLY. `JetBrains Mono` for everything else (nav, buttons, modal prompt text, body). Self-hosted `@font-face`, no Google Fonts `<link>`.
- **Grid:** masonry via CSS columns (`columns-2 md:columns-3 lg:columns-4`, cards keep natural photo aspect ratio, `break-inside-avoid`) — not a strict equal grid.
- **Radius:** `rounded-lg` on cards/modal, `rounded-full` on pills/filter buttons. Don't introduce other radius values.
- **No em-dashes** in any UI copy.

## Motion

All JS-driven animation is Framer Motion (`framer-motion`). Current usage:
- **Hero** — `useScroll`/`useTransform` for background parallax; native `scrollIntoView({behavior:'smooth'})` for the scroll-arrow (no library needed for that one).
- **GalleryGrid** — `whileInView` + `staggerChildren` variants for the scroll-triggered staggered card reveal (replays on filter change via the `key={activeCategory}` remount).
- **GalleryCard** — `whileHover`/`whileFocus` scale + z-index lift (card pops to front, doesn't open anything).
- **GalleryCard ↔ Modal** — matching `layoutId="gallery-image-{id}"` on the card's and modal's `<motion.img>` drives the shared-layout morph animation automatically on open AND close (wrapped in `AnimatePresence` in `App.tsx`). Don't hand-roll position math for this — that's what `layoutId` is for.

Small CSS-only transitions (button hover opacity, focus rings) can still use plain Tailwind `transition-*` utilities — reach for Framer Motion when the effect needs JS (scroll-linked values, shared-layout, orchestrated stagger), not for a one-property hover fade.

## Skills to use in this project

- **ponytail** (full) — active for all coding work in this repo. Simplest working solution first: native CSS/stdlib before deps, no speculative abstractions.
- **superpowers:brainstorming** — before any new feature or behavior change, not just at project start.
- **superpowers:writing-plans** — before implementing anything from a spec.
- **superpowers:test-driven-development** — only where there's actual logic to test (filter predicate, clipboard fallback). This app is mostly presentational; don't force tests onto static markup.

## Conventions
- New gallery item = submit the `/#add-card` form (commits to `gallery.json` on GitHub, auto-deploys), or hand-edit `src/data/gallery.json` directly for bulk/local changes. `beforeImage`/`afterImage` are any image URL now, not necessarily a local `/public/images` path — omitted `beforeImage` defaults to the shared `/images/before/placeholder.svg`. Never hardcode categories in `FilterBar` — they're derived from the data (`[...new Set(items.map(i => i.category))]`), and the add-card form only offers existing categories (no free-text new ones).
- Cards show `afterImage` only, no text/title/buttons on the card itself.
- Keep components single-purpose per `src/components/*`; don't collapse Hero/FilterBar/GalleryGrid/GalleryCard/Modal into one file.
