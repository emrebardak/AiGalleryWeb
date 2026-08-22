# Add Card — Design

## Overview
A public (no-auth) mobile-friendly form for the site owner to add new gallery items from their phone, without touching a code editor. Submitting the form commits a new entry directly to the site's data file via a serverless function using a GitHub token, which triggers the Cloudflare Pages auto-deploy set up in the deploy sub-project.

## Depends on
[2026-08-23-deploy-design.md](2026-08-23-deploy-design.md) — Cloudflare Pages hosting and Pages Functions must be live first.

## Data model change
`src/data/gallery.ts` currently holds the 16 gallery items as an inline hardcoded TS array. That's fine for hand-editing but risky for a function to edit programmatically (regex-splicing into TS syntax is fragile). Move the data to `src/data/gallery.json`, with `gallery.ts` reduced to:
```ts
import raw from './gallery.json';
import type { GalleryItem } from '../types';

export const galleryItems: GalleryItem[] = raw;
```
`GalleryItem.beforeImage`/`afterImage` keep their existing `string` type, but now mean "any image URL" (external URL, not necessarily a local `/public/images` path) — consistent with the new form accepting pasted URLs rather than uploaded files.

## Form entry point
A small `rounded-full` outlined button under the hero's subtext ("Add a card"), setting `window.location.hash = 'add-card'`. `App.tsx` reads `window.location.hash` (checked on mount and on `hashchange`) and renders `AddCardPage` instead of the normal gallery view when the hash is `add-card` — a zero-dependency, no-router-library route toggle, since the path itself always stays `/` (works on any static host with no server-side routing config).

## AddCardPage component
New `src/components/AddCardPage.tsx`. Fields:
- **Category** — `<select>` populated from the same derived category list `App.tsx` already computes (`[...new Set(items.map(i => i.category))]`)
- **After image URL** — required, `<input type="url">`
- **Before image URL** — optional, `<input type="url">`
- **Prompt** — required `<textarea>`

Submit button disabled until category, after-URL, and prompt are non-empty. Styled to match the existing dark/JetBrains-Mono/rounded-lg system, mobile-first layout (single column, large tap targets) since it's used from a phone.

On submit: POST `{ category, afterImage, beforeImage, prompt }` as JSON to `/api/add-card`. On success, show a confirmation message ("Added. Live in a minute or two.") and clear the form. On failure, show the error inline and leave the form filled in so it can be retried.

## Serverless function
`functions/api/add-card.ts` — Cloudflare Pages Functions file-based route, becomes `POST /api/add-card`.

1. Validate the request body: `category` and `prompt` non-empty strings, `afterImage` a non-empty string. Reject with 400 otherwise.
2. `GET` the current `gallery.json` from the GitHub Contents API (repo/branch read from env vars `GITHUB_REPO`, `GITHUB_BRANCH`; token from Pages secret `GITHUB_TOKEN`, a fine-grained PAT scoped to Contents: Read/Write on just this repo)
3. Parse the JSON, append a new item: `{ id: category.toLowerCase() + '-' + Date.now(), category, beforeImage: beforeImage || '/images/before/placeholder.svg', afterImage, prompt }`
4. Re-stringify, `PUT` back via the Contents API (with the SHA from step 2) — commits directly to the branch from `GITHUB_BRANCH`
5. Return 200 on success, or the GitHub API's error status/message on failure

## Error handling
- Client: required-field check blocks submit; a failed fetch or non-2xx response shows an inline error message, form stays filled for retry.
- Function: GitHub API failures (bad token, 409 conflict, network) propagate as an error response with a short message; no retry logic in the function itself (single user, low collision risk — add retry-on-409 later only if it actually happens).
- No auth, no rate limiting, no image-URL format validation beyond "non-empty" — the endpoint is unauthenticated by design (submission commits directly and goes live automatically), an accepted risk given actual usage is a single person.

## Testing
Per project convention (test real logic, not markup): a small unit test for the function's append logic (parse gallery.json, default beforeImage when omitted, append new item, stringify) — pure logic extractable from the fetch/GitHub-API glue. Form and page are presentational, no tests.

## Explicitly out of scope
- Auth / login
- Editing or deleting existing cards through the form (add-only)
- Image upload or resizing (URL-only)
- Rate limiting / spam protection
- New-category creation through the form (dropdown of existing categories only)
