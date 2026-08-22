# AI Gallery SPA — Design

## Overview
Single-page React app showing before/after AI image pairs in a filterable gallery grid, with a modal detail view (before/after images + prompt text + copy button). Minimalist, image-first, no clutter.

## Stack
- React 18 + Vite + TypeScript
- Tailwind CSS
- transitions-dev skill (CSS/Tailwind transitions — hover scale, modal open/close, stagger). All motion is CSS-driven per the skill's patterns, EXCEPT the Hero's scroll-arrow smooth-scroll and background parallax, which use GSAP + ScrollTrigger + ScrollToPlugin (explicit user override of the original "no JS animation library" constraint, scoped to the Hero only).
- lucide-react (arrow-down, copy, check icons)
- No backend, no router, no external CMS. Single page, in-memory state only.

## Visual design

- **Colors:** cold mono palette — `zinc-950` text / `zinc-50` background (dark-mode: inverted, `zinc-50` text / `zinc-950` bg). Single accent color (electric blue) used only for the copy-button success state and focus rings — nowhere else. Images carry all remaining color.
- **Fonts:** `Boxing` (Fontshare, ITF Free Font License — free, self-hosted) for the hero headline only, self-hosted via `@font-face` from `Boxing-Regular.woff2`, `font-display: swap`. Font files copied from user-supplied `Boxing_Complete/Fonts/WEB/fonts/` into `public/fonts/`. `JetBrains Mono` for everything else — nav, filter buttons, modal prompt text, all UI chrome. No Google Fonts `<link>`.
- **Grid:** strict equal-size cards, uniform gap, `grid-cols-2 md:grid-cols-3 lg:grid-cols-4`. No masonry/bento — matches "no clutter, focus on visuals."
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

**Hero** — full-width static background image (`hero.jpg`, placeholder to be swapped later), centered headline, bouncing down-arrow (CSS keyframe bounce per transitions-dev) that scrolls to the gallery section on click.

**FilterBar** — renders buttons from derived categories. Clicking a button sets `activeCategory` on `App`. Sits directly above the grid.

**GalleryGrid** — responsive CSS grid (Tailwind). Renders `items.filter(i => activeCategory === "All" || i.category === activeCategory)`. Card mount/unmount on filter change uses transitions-dev's fade/stagger pattern (CSS `transition-opacity` + staggered `transition-delay`), no layout animation library needed.

**GalleryCard** — image-only card (`afterImage`), no title/text/buttons. Tailwind `hover:scale-[1.02]` + `transition-transform` + soft shadow on hover, per transitions-dev hover-lift pattern. `onClick` sets `selectedItem` on `App`. Image never changes on hover.

**Modal** — mounted in `App`, shown/hidden when `selectedItem` changes, using transitions-dev's modal open/close pattern (CSS opacity/scale transition, not JS-driven). Backdrop: dimmed + blurred (`backdrop-blur-sm bg-black/40`), click-outside or Escape closes it. Content: before image, after image (side by side), prompt text below, and a copy button next to the prompt.

Copy button: `navigator.clipboard.writeText(prompt)` on click; local `useState` flips the icon from Copy → Check (lucide-react) for 2 seconds via `setTimeout`, then reverts. If clipboard API is unavailable, fall back to `document.execCommand('copy')` silently — no error UI, this is a non-critical convenience action.

## Error handling
Minimal by design: no network calls, no user input forms, no auth. The only failure surface is the clipboard write, handled by the fallback above. No other error states exist in this scope.

## Testing
No automated tests for this phase — the app is presentational with no business logic beyond a category filter (single boolean expression) and a clipboard try/catch. Verification is manual: run the dev server, exercise filter/hover/modal/copy in the browser during implementation.

## Explicitly out of scope
- Backend, database, or admin UI for adding items (dev edits the data file directly)
- User accounts / auth
- Routing / multiple pages
- Automated tests
