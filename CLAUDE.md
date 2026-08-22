# AiGalleryWeb

Minimalist SPA gallery for AI before/after image pairs + prompts. Hero → filter bar → grid → modal (before/after + prompt + copy).

Design spec: [docs/superpowers/specs/2026-08-22-ai-gallery-design.md](docs/superpowers/specs/2026-08-22-ai-gallery-design.md) — read this before making structural changes.

## Stack
- React 18 + Vite + TypeScript
- Tailwind CSS
- Framer Motion (`framer-motion`) — the one JS animation library used in this project. Do not add a second one (e.g. GSAP) alongside it; animation libraries fight over the same frames if mixed on the same elements.
- lucide-react (icons)
- No backend, no router, no DB. Gallery items are a hardcoded array in `src/data/gallery.ts`.

## Visual design
- **Colors:** cold mono, dark-only — `zinc-950` background / `zinc-50` text. No light theme, no theme toggle. One accent (electric blue) only for copy-button success state + focus rings. Never introduce a second accent color.
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

- **ponytail** (full) — active for all coding work in this repo. Simplest working solution first: native CSS/stdlib before deps, no speculative abstractions, no admin UI/backend for adding gallery items (dev edits `src/data/gallery.ts` directly).
- **superpowers:brainstorming** — before any new feature or behavior change, not just at project start.
- **superpowers:writing-plans** — before implementing anything from a spec.
- **superpowers:test-driven-development** — only where there's actual logic to test (filter predicate, clipboard fallback). This app is mostly presentational; don't force tests onto static markup.

## Conventions
- New gallery item = new entry in `src/data/gallery.ts` + image files in `public/images/`. Never hardcode categories in `FilterBar` — they're derived from the data (`[...new Set(items.map(i => i.category))]`).
- Cards show `afterImage` only, no text/title/buttons on the card itself.
- Keep components single-purpose per `src/components/*`; don't collapse Hero/FilterBar/GalleryGrid/GalleryCard/Modal into one file.
