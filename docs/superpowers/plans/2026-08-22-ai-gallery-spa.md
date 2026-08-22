# AI Gallery SPA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page React gallery site showing AI before/after image pairs in a filterable grid, with a modal detail view (before/after images + prompt text + copy-to-clipboard).

**Architecture:** Vite + React 18 + TypeScript SPA, no backend/router. `App.tsx` owns two pieces of state (`activeCategory`, `selectedItem`) and passes them down to five presentational components. Gallery items are a hardcoded array in `src/data/gallery.ts`.

**Tech Stack:** React 18, Vite, TypeScript, Tailwind CSS v4, `@fontsource/jetbrains-mono`, self-hosted `Boxing` font, `lucide-react`.

## Global Constraints

- React 18 + Vite + TypeScript. No backend, no router, no external CMS, no admin UI, no auth, no automated tests (per spec — this is a presentational app with no business logic beyond a filter predicate and a clipboard try/catch).
- Motion is CSS/Tailwind-only (transitions-dev patterns: `transition-*` utilities, `@keyframes`). No JS animation library (no Framer Motion, no GSAP).
- Icons: `lucide-react` only (arrow-down, copy, check). No hand-rolled SVG icons.
- Colors: cold mono — `zinc-950`/`zinc-50` (inverted in dark mode via `prefers-color-scheme`, never pure `#000`/`#fff`). Exactly one accent color (`blue-500`), used ONLY on the copy-button success state and focus rings — nowhere else.
- Fonts: `Boxing` (self-hosted `@font-face`, `public/fonts/Boxing-Regular.woff2`) for the hero headline ONLY. `JetBrains Mono` (self-hosted via `@fontsource/jetbrains-mono` npm package) for everything else. No Google Fonts `<link>`.
- Grid: strict equal-size cards (`grid-cols-2 md:grid-cols-3 lg:grid-cols-4`), no masonry/bento.
- Corner radius: `rounded-lg` on cards/modal, `rounded-full` on filter buttons/pills only.
- Gallery items: hardcoded `GalleryItem[]` in `src/data/gallery.ts`, dev-edited. Filter categories are derived from the data (`[...new Set(items.map(i => i.category))]`), never hardcoded.
- Cards show `afterImage` only — no title/text/buttons on the card itself. Image never changes on hover.
- No em-dashes in any UI copy.

---

### Task 1: Project scaffold, Tailwind v4, self-hosted fonts

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `index.html` (via `npm create vite`)
- Create: `src/index.css`
- Create: `public/fonts/Boxing-Regular.woff2` (copied from user-supplied font pack)
- Modify: `src/main.tsx` (import `index.css`)

**Interfaces:**
- Consumes: nothing (first task)
- Produces: Tailwind utility classes `font-hero` (Boxing) and `font-mono` (JetBrains Mono, also the default body font) available to every later component. Dev server runs on `npm run dev`.

- [ ] **Step 1: Scaffold Vite + React + TypeScript project**

Run in `C:\MrBardak\Code\AiGalleryWeb`:

```bash
npm create vite@latest . -- --template react-ts
```

When prompted about the non-empty directory (docs/ already exists), choose to continue / ignore existing files.

- [ ] **Step 2: Install dependencies**

```bash
npm install
npm install -D tailwindcss @tailwindcss/vite
npm install @fontsource/jetbrains-mono lucide-react
```

- [ ] **Step 3: Wire the Tailwind Vite plugin**

Replace `vite.config.ts` with:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

- [ ] **Step 4: Copy the Boxing font file into the project**

```bash
mkdir -p public/fonts
cp "C:\Users\mrbar\Downloads\Boxing_Complete\Fonts\WEB\fonts\Boxing-Regular.woff2" "public/fonts/Boxing-Regular.woff2"
```

Verify it copied:

```bash
ls public/fonts
```

Expected: `Boxing-Regular.woff2`

- [ ] **Step 5: Write `src/index.css`**

Replace the full contents of `src/index.css` with:

```css
@import "tailwindcss";
@import "@fontsource/jetbrains-mono";

@font-face {
  font-family: "Boxing";
  src: url("/fonts/Boxing-Regular.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@theme {
  --font-hero: "Boxing", sans-serif;
  --font-mono: "JetBrains Mono", monospace;
}

body {
  font-family: var(--font-mono);
  background-color: var(--color-zinc-50);
  color: var(--color-zinc-950);
}

@media (prefers-color-scheme: dark) {
  body {
    background-color: var(--color-zinc-950);
    color: var(--color-zinc-50);
  }
}
```

- [ ] **Step 6: Confirm `src/main.tsx` imports the stylesheet**

Read `src/main.tsx` (Vite's scaffold already imports `./index.css` by default). If the import is missing, add `import './index.css'` at the top of the file.

- [ ] **Step 7: Verify the dev server runs**

```bash
npm run dev
```

Expected: server starts on `http://localhost:5173` with no errors in the terminal. Stop it with Ctrl+C once confirmed.

- [ ] **Step 8: Commit**

```bash
git init
git add -A
git commit -m "chore: scaffold Vite+React+TS project with Tailwind v4 and self-hosted fonts"
```

---

### Task 2: Data model and placeholder gallery assets

**Files:**
- Create: `src/types.ts`
- Create: `src/data/gallery.ts`
- Create: `public/images/hero.svg`
- Create: `public/images/before/modern-1.svg`, `public/images/after/modern-1.svg`
- Create: `public/images/before/fantasy-1.svg`, `public/images/after/fantasy-1.svg`
- Create: `public/images/before/concept-1.svg`, `public/images/after/concept-1.svg`

**Interfaces:**
- Consumes: nothing new
- Produces: `GalleryItem` type (`id: string`, `category: string`, `beforeImage: string`, `afterImage: string`, `prompt: string`) and `galleryItems: GalleryItem[]` exported from `src/data/gallery.ts`, consumed by `App.tsx` in Task 3+.

- [ ] **Step 1: Write `src/types.ts`**

```ts
export type GalleryItem = {
  id: string;
  category: string;
  beforeImage: string; // path under /public/images
  afterImage: string; // path under /public/images — shown on card
  prompt: string;
};
```

- [ ] **Step 2: Create placeholder SVG images**

These are local, self-contained placeholder images (no network calls) standing in for real AI before/after pairs until the user supplies real ones.

Create `public/images/hero.svg`:

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
  <rect width="1600" height="900" fill="#18181b"/>
  <rect x="0" y="0" width="1600" height="900" fill="url(#g)"/>
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#27272a"/>
      <stop offset="100%" stop-color="#09090b"/>
    </linearGradient>
  </defs>
</svg>
```

Create `public/images/before/modern-1.svg`:

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <rect width="800" height="800" fill="#a1a1aa"/>
  <text x="400" y="400" font-family="monospace" font-size="32" fill="#18181b" text-anchor="middle">before / modern</text>
</svg>
```

Create `public/images/after/modern-1.svg`:

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <rect width="800" height="800" fill="#3f3f46"/>
  <text x="400" y="400" font-family="monospace" font-size="32" fill="#fafafa" text-anchor="middle">after / modern</text>
</svg>
```

Create `public/images/before/fantasy-1.svg`:

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <rect width="800" height="800" fill="#a1a1aa"/>
  <text x="400" y="400" font-family="monospace" font-size="32" fill="#18181b" text-anchor="middle">before / fantasy</text>
</svg>
```

Create `public/images/after/fantasy-1.svg`:

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <rect width="800" height="800" fill="#3f3f46"/>
  <text x="400" y="400" font-family="monospace" font-size="32" fill="#fafafa" text-anchor="middle">after / fantasy</text>
</svg>
```

Create `public/images/before/concept-1.svg`:

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <rect width="800" height="800" fill="#a1a1aa"/>
  <text x="400" y="400" font-family="monospace" font-size="32" fill="#18181b" text-anchor="middle">before / concept</text>
</svg>
```

Create `public/images/after/concept-1.svg`:

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <rect width="800" height="800" fill="#3f3f46"/>
  <text x="400" y="400" font-family="monospace" font-size="32" fill="#fafafa" text-anchor="middle">after / concept</text>
</svg>
```

- [ ] **Step 3: Write `src/data/gallery.ts`**

```ts
import type { GalleryItem } from '../types';

export const galleryItems: GalleryItem[] = [
  {
    id: 'modern-1',
    category: 'Modern',
    beforeImage: '/images/before/modern-1.svg',
    afterImage: '/images/after/modern-1.svg',
    prompt: 'A minimalist modern living room, natural light, Scandinavian furniture, soft shadows',
  },
  {
    id: 'fantasy-1',
    category: 'Fantasy',
    beforeImage: '/images/before/fantasy-1.svg',
    afterImage: '/images/after/fantasy-1.svg',
    prompt: 'An ancient stone castle floating above the clouds, dragons circling the towers, golden hour light',
  },
  {
    id: 'concept-1',
    category: 'Concept',
    beforeImage: '/images/before/concept-1.svg',
    afterImage: '/images/after/concept-1.svg',
    prompt: 'A sleek electric concept car, chrome body, studio lighting, motion blur background',
  },
];
```

- [ ] **Step 4: Typecheck**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add public/images src/types.ts src/data
git commit -m "feat: add gallery data model and placeholder images"
```

---

### Task 3: App shell and Hero component

**Files:**
- Create: `src/components/Hero.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: nothing from prior tasks (renders static content only)
- Produces: `Hero` component (no props) rendered by `App`, with `id="gallery"` anchor target below it for the scroll-arrow to jump to. `App.tsx` becomes the root layout that later tasks add state and components to.

- [ ] **Step 1: Write `src/components/Hero.tsx`**

```tsx
import { ChevronDown } from 'lucide-react';

export function Hero() {
  return (
    <section
      className="relative flex min-h-[100dvh] items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: 'url(/images/hero.svg)' }}
    >
      <div className="absolute inset-0 bg-zinc-950/50" />
      <h1 className="font-hero relative text-5xl text-zinc-50 md:text-7xl">
        AI Gallery
      </h1>
      <a
        href="#gallery"
        aria-label="Scroll to gallery"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-zinc-50 transition-opacity hover:opacity-70"
      >
        <ChevronDown size={32} />
      </a>
    </section>
  );
}
```

- [ ] **Step 2: Write `src/App.tsx`**

```tsx
import { Hero } from './components/Hero';

function App() {
  return (
    <main>
      <Hero />
      <div id="gallery" />
    </main>
  );
}

export default App;
```

- [ ] **Step 3: Verify in the browser**

```bash
npm run dev
```

Open `http://localhost:5173`. Expected: full-viewport hero with dark overlay over the placeholder background, "AI Gallery" headline in the Boxing font (distinct condensed display face, not the mono body font), bouncing down-arrow at the bottom that scrolls down when clicked.

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx src/components/Hero.tsx
git commit -m "feat: add hero section with Boxing headline and scroll indicator"
```

---

### Task 4: Filter bar with derived categories

**Files:**
- Create: `src/components/FilterBar.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `galleryItems` from `src/data/gallery.ts` (Task 2)
- Produces: `FilterBar` component with props `{ categories: string[]; active: string; onSelect: (category: string) => void }`. `App.tsx` now owns `activeCategory` state (`useState<string>('All')`), passed down to `FilterBar` and (in Task 5) to `GalleryGrid`.

- [ ] **Step 1: Write `src/components/FilterBar.tsx`**

```tsx
type FilterBarProps = {
  categories: string[];
  active: string;
  onSelect: (category: string) => void;
};

export function FilterBar({ categories, active, onSelect }: FilterBarProps) {
  return (
    <nav className="flex flex-wrap justify-center gap-3 px-4 py-8">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onSelect(category)}
          className={`rounded-full px-4 py-2 text-sm transition-colors ${
            active === category
              ? 'bg-zinc-950 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-950'
              : 'bg-zinc-200 text-zinc-950 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700'
          }`}
        >
          {category}
        </button>
      ))}
    </nav>
  );
}
```

- [ ] **Step 2: Wire `activeCategory` state and derived categories into `App.tsx`**

```tsx
import { useState } from 'react';
import { Hero } from './components/Hero';
import { FilterBar } from './components/FilterBar';
import { galleryItems } from './data/gallery';

const categories = ['All', ...new Set(galleryItems.map((item) => item.category))];

function App() {
  const [activeCategory, setActiveCategory] = useState('All');

  return (
    <main>
      <Hero />
      <div id="gallery">
        <FilterBar categories={categories} active={activeCategory} onSelect={setActiveCategory} />
      </div>
    </main>
  );
}

export default App;
```

- [ ] **Step 3: Verify in the browser**

```bash
npm run dev
```

Expected: below the hero, pill-shaped buttons "All", "Modern", "Fantasy", "Concept" appear. Clicking one visually highlights it (filled dark/light pill vs. muted gray).

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx src/components/FilterBar.tsx
git commit -m "feat: add filter bar with categories derived from gallery data"
```

---

### Task 5: Gallery grid and cards

**Files:**
- Create: `src/components/GalleryCard.tsx`
- Create: `src/components/GalleryGrid.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `GalleryItem` type (Task 2), `activeCategory` state (Task 4)
- Produces: `GalleryCard` component with props `{ item: GalleryItem; onClick: () => void }`. `GalleryGrid` component with props `{ items: GalleryItem[]; activeCategory: string; onSelect: (item: GalleryItem) => void }`. `App.tsx` now also owns `selectedItem: GalleryItem | null` state, consumed by `Modal` in Task 6.

- [ ] **Step 1: Write `src/components/GalleryCard.tsx`**

```tsx
import type { GalleryItem } from '../types';

type GalleryCardProps = {
  item: GalleryItem;
  onClick: () => void;
};

export function GalleryCard({ item, onClick }: GalleryCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="aspect-square overflow-hidden rounded-lg transition-transform duration-200 hover:scale-[1.02] hover:shadow-xl"
    >
      <img src={item.afterImage} alt="" className="h-full w-full object-cover" />
    </button>
  );
}
```

- [ ] **Step 2: Write `src/components/GalleryGrid.tsx`**

```tsx
import type { GalleryItem } from '../types';
import { GalleryCard } from './GalleryCard';

type GalleryGridProps = {
  items: GalleryItem[];
  activeCategory: string;
  onSelect: (item: GalleryItem) => void;
};

export function GalleryGrid({ items, activeCategory, onSelect }: GalleryGridProps) {
  const visibleItems = items.filter(
    (item) => activeCategory === 'All' || item.category === activeCategory
  );

  return (
    <div className="grid grid-cols-2 gap-4 px-4 pb-16 md:grid-cols-3 lg:grid-cols-4">
      {visibleItems.map((item) => (
        <div key={item.id} className="animate-in fade-in duration-300">
          <GalleryCard item={item} onClick={() => onSelect(item)} />
        </div>
      ))}
    </div>
  );
}
```

Note: `animate-in fade-in` are Tailwind v4 built-in entry-animation utilities (no plugin needed) — they fade each card in on mount/filter change, satisfying the transitions-dev fade pattern from the spec without a JS animation library.

- [ ] **Step 3: Wire `selectedItem` state and `GalleryGrid` into `App.tsx`**

```tsx
import { useState } from 'react';
import { Hero } from './components/Hero';
import { FilterBar } from './components/FilterBar';
import { GalleryGrid } from './components/GalleryGrid';
import { galleryItems } from './data/gallery';
import type { GalleryItem } from './types';

const categories = ['All', ...new Set(galleryItems.map((item) => item.category))];

function App() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  return (
    <main>
      <Hero />
      <div id="gallery">
        <FilterBar categories={categories} active={activeCategory} onSelect={setActiveCategory} />
        <GalleryGrid items={galleryItems} activeCategory={activeCategory} onSelect={setSelectedItem} />
      </div>
    </main>
  );
}

export default App;
```

- [ ] **Step 4: Verify in the browser**

```bash
npm run dev
```

Expected: equal-size square cards in a responsive grid below the filter bar, each showing an "after" placeholder image. Hovering a card scales it up slightly with a shadow. Clicking a filter button shows only cards in that category (fading in). No visible errors about `selectedItem` being unused yet (it's consumed in Task 6).

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/components/GalleryCard.tsx src/components/GalleryGrid.tsx
git commit -m "feat: add gallery grid with category filtering and hover effect"
```

---

### Task 6: Modal detail view with copy-to-clipboard

**Files:**
- Create: `src/components/Modal.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `GalleryItem` type (Task 2), `selectedItem` state and `setSelectedItem` (Task 5)
- Produces: `Modal` component with props `{ item: GalleryItem; onClose: () => void }`, rendered by `App` only when `selectedItem` is non-null.

- [ ] **Step 1: Write `src/components/Modal.tsx`**

```tsx
import { useEffect, useState } from 'react';
import { Copy, Check, X } from 'lucide-react';
import type { GalleryItem } from '../types';

type ModalProps = {
  item: GalleryItem;
  onClose: () => void;
};

export function Modal({ item, onClose }: ModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(item.prompt);
    } catch {
      document.execCommand('copy');
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative mx-4 max-w-2xl rounded-lg bg-zinc-50 p-6 dark:bg-zinc-950"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 text-zinc-950 transition-opacity hover:opacity-70 dark:text-zinc-50"
        >
          <X size={20} />
        </button>

        <div className="grid grid-cols-2 gap-4">
          <img src={item.beforeImage} alt="Before" className="aspect-square w-full rounded-lg object-cover" />
          <img src={item.afterImage} alt="After" className="aspect-square w-full rounded-lg object-cover" />
        </div>

        <div className="mt-4 flex items-start justify-between gap-4">
          <p className="text-sm text-zinc-950 dark:text-zinc-50">{item.prompt}</p>
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy prompt"
            className={`shrink-0 rounded-full p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              copied ? 'text-blue-500' : 'text-zinc-950 hover:opacity-70 dark:text-zinc-50'
            }`}
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Render `Modal` conditionally in `src/App.tsx`**

```tsx
import { useState } from 'react';
import { Hero } from './components/Hero';
import { FilterBar } from './components/FilterBar';
import { GalleryGrid } from './components/GalleryGrid';
import { Modal } from './components/Modal';
import { galleryItems } from './data/gallery';
import type { GalleryItem } from './types';

const categories = ['All', ...new Set(galleryItems.map((item) => item.category))];

function App() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  return (
    <main>
      <Hero />
      <div id="gallery">
        <FilterBar categories={categories} active={activeCategory} onSelect={setActiveCategory} />
        <GalleryGrid items={galleryItems} activeCategory={activeCategory} onSelect={setSelectedItem} />
      </div>
      {selectedItem && <Modal item={selectedItem} onClose={() => setSelectedItem(null)} />}
    </main>
  );
}

export default App;
```

- [ ] **Step 3: Verify in the browser**

```bash
npm run dev
```

Expected: clicking a card opens a centered modal with dimmed/blurred backdrop, before/after placeholder images side by side, prompt text below, and a copy icon button. Clicking the copy button swaps the icon to a checkmark (turns blue) for ~2 seconds, then reverts. Clicking outside the modal or pressing Escape closes it. Paste the clipboard contents somewhere (e.g. into the terminal) to confirm the prompt text was copied.

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx src/components/Modal.tsx
git commit -m "feat: add modal detail view with before/after images and copy-to-clipboard"
```

---

### Task 7: Dark mode and final visual audit

**Files:**
- Modify: `src/components/Hero.tsx`, `src/components/FilterBar.tsx`, `src/components/GalleryCard.tsx`, `src/components/Modal.tsx` (dark-mode class audit)

**Interfaces:**
- Consumes: all components from Tasks 3–6
- Produces: no new interfaces — this task verifies and patches dark-mode coverage across existing components.

- [ ] **Step 1: Audit each component against the dark-mode constraint**

Read through `Hero.tsx`, `FilterBar.tsx`, `GalleryCard.tsx`, and `Modal.tsx`. Confirm every `zinc-950`/`zinc-50` text or background pairing has a `dark:` counterpart that inverts it (Modal and FilterBar already do from Tasks 4 and 6; Hero's overlay/text and GalleryCard's transparent button need no dark variant since they have no light-mode-only colors — confirm this by reading the files, not by assuming).

- [ ] **Step 2: Verify in the browser under both color schemes**

```bash
npm run dev
```

In Chrome DevTools, open the Rendering tab and toggle "Emulate CSS media feature prefers-color-scheme" between `light` and `dark`. Expected: page background/text swap between `zinc-50`/`zinc-950` and the inverse in both states, filter-bar active pill stays legible in both modes, modal background swaps correctly, and the blue accent color remains the only non-neutral color present in either mode.

- [ ] **Step 3: Full manual walkthrough**

With the dev server running, walk through the full user flow once: load the page, confirm the hero headline renders in the Boxing font (visually distinct condensed display face) and the body/UI text renders in JetBrains Mono, click the scroll arrow, click each filter button and confirm the grid updates, hover a card and confirm the scale/shadow effect, click a card to open the modal, click copy and confirm the checkmark swap, close the modal via the X button, via outside click, and via Escape.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "fix: audit and complete dark-mode coverage across all components"
```

---

## Self-Review Notes

- **Spec coverage:** Hero (Task 3), filter bar (Task 4), grid + cards + hover (Task 5), modal + before/after + prompt + copy button (Task 6), colors/fonts/grid/radius/dark-mode (Tasks 1, 7) — all spec sections map to a task. Testing section of the spec explicitly asks for manual browser verification, not automated tests — every task's last code step is a manual browser check accordingly.
- **Placeholder scan:** no TBD/TODO; all code blocks are complete, runnable files.
- **Type consistency:** `GalleryItem` (Task 2) is the single source of truth for the shape used in `gallery.ts`, `GalleryCard`, `GalleryGrid`, and `Modal` props — checked for consistent field names (`beforeImage`, `afterImage`, `category`, `prompt`, `id`) across all tasks.
