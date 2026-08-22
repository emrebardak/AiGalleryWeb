# Deploy — Design

## Overview
Deploy the AI Gallery SPA to a free static host with git-based auto-deploy, and set up serverless function support needed later by the add-card feature.

## Host
Cloudflare Pages, connected to the existing GitHub repo `emrebardak/AiGalleryWeb`.

## Build config
- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Deploys automatically on push to `master`

## URL
Default `*.pages.dev` subdomain. No custom domain (YAGNI).

## Environment / secrets
None needed for the deploy itself. The add-card sub-project adds a `GITHUB_TOKEN` Pages secret later.

## Setup steps (manual, one-time)
1. Repo already pushed to GitHub (`origin` is `emrebardak/AiGalleryWeb`)
2. In the Cloudflare dashboard, create a Pages project and connect it to the GitHub repo via OAuth
3. Confirm build settings match the ones above
4. Deploy

## Why Cloudflare Pages over Vercel
Same zero-config Vite support and free git-connected auto-deploy as Vercel, chosen as the alternative host the user asked for. Cloudflare Pages Functions (Workers-based serverless) cover the same later need as Vercel's serverless functions — a function that commits to GitHub for the add-card feature — so no re-platform is needed down the line.

## Explicitly out of scope
- Custom domain
- CI/CD beyond Cloudflare's built-in git integration
- Staging environment — single production deploy only
