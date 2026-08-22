# AI Gallery SPA — Design

## Overview
Single-page React app showing before/after AI image pairs in a filterable gallery grid, with a modal detail view (before/after images + prompt text + copy button). Minimalist, image-first, no clutter.

## Stack
- React 18 + Vite + TypeScript
- Tailwind CSS
- Framer Motion (`framer-motion`) — the one JS animation library used in this project (explicit user override of the original "CSS-only, no JS animation library" constraint; GSAP was tried first and fully replaced with Framer Motion to avoid running two animation libraries). Small CSS-only transitions (hover opacity, focus rings) still use plain Tailwind `transition-*` utilities.
- lucide-react (arrow-down, copy, check icons)
- No backend, no router, no external CMS. Single page, in-memory state only.

## Visual design

- **Colors:** cold mono palette — `zinc-950` text / `zinc-50` background (dark-mode: inverted, `zinc-50` text / `zinc-950` bg). Single accent color (electric blue) used only for the copy-button success state and focus rings — nowhere else. Images carry all remaining color.
- **Fonts:** `Boxing` (Fontshare, ITF Free Font License — free, self-hosted) for the hero headline only, self-hosted via `@font-face` from `Boxing-Regular.woff2`, `font-display: swap`. Font files copied from user-supplied `Boxing_Complete/Fonts/WEB/fonts/` into `public/fonts/`. `JetBrains Mono` for everything else — nav, filter buttons, modal prompt text, all UI chrome. No Google Fonts `<link>`.
- **Grid:** masonry via CSS columns (`columns-2 md:columns-3 lg:columns-4`), cards keep their natural photo aspect ratio instead of a forced square, uniform gap via `break-inside-avoid` + margin (user-requested change from the original strict equal grid, for visual rhythm).
- **Corner radius:** one scale for the whole page — soft, `rounded-lg` (~8px) on cards and modal, `rounded-full` on filter buttons/pills. No mixing beyond that split.
- **Dark mode:** supported via `dark:` Tailwind variant (class-based, `.dark` on `<html>`), off-black/off-white never pure `#000`/`#fff`. Defaults to `prefers-color-scheme` on first visit, overridable via a fixed toggle button, persisted in `localStorage`.

## Data model
```ts
// src/types.ts
export type GalleryItem = {
  id: string;
  category: string;
  beforeImage: string; // path under /public/images
  afterImage: string;  // path under /public/images — shown on card
  prompt: string;
};
```

Gallery items live in `src/data/gallery.ts` as a hardcoded `GalleryItem[]`. New items are added by editing this file and dropping images into `public/images/`. No admin UI, no database — dev-edited data file by design.

Filter categories are derived, not hardcoded:
```ts
const categories = ["All", ...new Set(items.map(i => i.category))];
```
Adding a new category value to an item automatically adds a filter button — no component changes needed.

## File structure
```
src/
  types.ts
  data/gallery.ts
  components/
    Hero.tsx
    FilterBar.tsx
    GalleryGrid.tsx
    GalleryCard.tsx
    Modal.tsx
  App.tsx
public/images/
  hero.jpg
  before/*.jpg
  after/*.jpg
```

## Components & data flow

`App.tsx` holds two pieces of state:
- `activeCategory: string` (default `"All"`)
- `selectedItem: GalleryItem | null` (default `null` — modal closed)

**Hero** — full-width background photo with a Framer Motion parallax effect (`useScroll`/`useTransform`, scrolls slower than the page), a headline in the Boxing font plus a one-line subtext, and a bouncing down-arrow that smooth-scrolls to the gallery via native `scrollIntoView({behavior:'smooth'})` on click.

**FilterBar** — renders buttons from derived categories. Clicking a button sets `activeCategory` on `App`. Sits directly above the grid.

**GalleryGrid** — masonry grid (CSS columns). Renders `items.filter(i => activeCategory === "All" || i.category === activeCategory)`. Cards reveal with a Framer Motion staggered fade/slide-up (`whileInView` + `staggerChildren`), triggered when the grid scrolls into view and replayed on filter change.

**GalleryCard** — image-only card (`afterImage`), no title/text/buttons. On hover/focus it scales up (110%) and lifts to the front (z-index) via Framer Motion `whileHover`/`whileFocus` — pops forward, does not open the modal. Image never changes on hover. `onClick` sets `selectedItem` on `App`.

**Modal** — mounted in `App` inside `AnimatePresence`, shown/hidden when `selectedItem` changes. The backdrop and panel fade/scale in and out (Framer Motion `initial`/`animate`/`exit`). The after-image specifically morphs from the clicked card's exact position/size into the modal via a shared `layoutId` (`gallery-image-{id}`) on both the card's and modal's `<motion.img>` — Framer Motion computes the position/size interpolation automatically, on open and close. Backdrop: dimmed + blurred (`backdrop-blur-sm bg-zinc-950/40`), click-outside or Escape closes it. Content: before image (static), after image (morphs), prompt text below, and a copy button next to the prompt.

Copy button: `navigator.clipboard.writeText(prompt)` on click; on success, local `useState` flips the icon from Copy → Check (lucide-react) for 2 seconds via `setTimeout`, then reverts. On failure, the icon stays unchanged — no error UI, this is a non-critical convenience action (no `execCommand` fallback; it doesn't actually work without a text selection and was removed).

## Error handling
Minimal by design: no network calls, no user input forms, no auth. The only failure surface is the clipboard write, handled by the fallback above. No other error states exist in this scope.

## Testing
No automated tests for this phase — the app is presentational with no business logic beyond a category filter (single boolean expression) and a clipboard try/catch. Verification is manual: run the dev server, exercise filter/hover/modal/copy in the browser during implementation.

## Explicitly out of scope
- Backend, database, or admin UI for adding items (dev edits the data file directly)
- User accounts / auth
- Routing / multiple pages
- Automated tests
