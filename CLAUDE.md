# AiGalleryWeb

Minimalist SPA gallery for AI before/after image pairs + prompts. Hero → filter bar → grid → modal (before/after + prompt + copy).

Design spec: [docs/superpowers/specs/2026-08-22-ai-gallery-design.md](docs/superpowers/specs/2026-08-22-ai-gallery-design.md) — read this before making structural changes.

## Stack
- React 18 + Vite + TypeScript
- Tailwind CSS
- lucide-react (icons)
- No backend, no router, no DB. Gallery items are a hardcoded array in `src/data/gallery.ts`.

## Visual design
- **Colors:** cold mono — `zinc-950`/`zinc-50` (inverted in dark mode). One accent (electric blue) only for copy-button success state + focus rings. Never introduce a second accent color.
- **Fonts:** `Boxing` (self-hosted, `public/fonts/Boxing-Regular.woff2`) for the hero headline ONLY. `JetBrains Mono` for everything else (nav, buttons, modal prompt text, body). Self-hosted `@font-face`, no Google Fonts `<link>`.
- **Grid:** strict equal-size cards (`grid-cols-2 md:grid-cols-3 lg:grid-cols-4`), no masonry/bento.
- **Radius:** `rounded-lg` on cards/modal, `rounded-full` on pills/filter buttons. Don't introduce other radius values.
- **No em-dashes** in any UI copy.

## Skills to use in this project

- **transitions-dev** — for ANY hover, modal open/close, fade, or stagger animation. All motion is CSS/Tailwind-driven — no Framer Motion or other JS animation library, EXCEPT the Hero (see below). Load this skill before writing/editing animation code outside the Hero.
- **gsap-skills** (gsap-core, gsap-scrolltrigger, gsap-react, gsap-plugins) — Hero only: background parallax (ScrollTrigger scrub) and scroll-arrow smooth-scroll (ScrollToPlugin), via the `useGSAP` hook. This is a deliberate, user-approved exception to the CSS-only rule above — don't extend GSAP to other components without asking first.
- **ponytail** (full) — active for all coding work in this repo. Simplest working solution first: native CSS/stdlib before deps, no speculative abstractions, no admin UI/backend for adding gallery items (dev edits `src/data/gallery.ts` directly).
- **superpowers:brainstorming** — before any new feature or behavior change, not just at project start.
- **superpowers:writing-plans** — before implementing anything from a spec.
- **superpowers:test-driven-development** — only where there's actual logic to test (filter predicate, clipboard fallback). This app is mostly presentational; don't force tests onto static markup.

## Conventions
- New gallery item = new entry in `src/data/gallery.ts` + image files in `public/images/`. Never hardcode categories in `FilterBar` — they're derived from the data (`[...new Set(items.map(i => i.category))]`).
- Cards show `afterImage` only, no text/title/buttons on the card itself.
- Keep components single-purpose per `src/components/*`; don't collapse Hero/FilterBar/GalleryGrid/GalleryCard/Modal into one file.
