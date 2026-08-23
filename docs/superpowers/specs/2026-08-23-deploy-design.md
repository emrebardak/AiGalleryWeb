# Deploy — Design

## Overview
Deploy the AI Gallery SPA to a free static host with git-based auto-deploy, and set up serverless function support needed later by the add-card feature.

## Host
Cloudflare (Workers with static assets, provisioned via the dashboard's "Connect to Git" flow — the modern replacement for classic Pages), connected to the existing GitHub repo `emrebardak/AiGalleryWeb`.

## Build config
- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Deploys automatically on push to `master`

## URL
The assigned `*.workers.dev` subdomain (Cloudflare's current default for git-connected projects). No custom domain (YAGNI).

Actual URL: https://promptgallery.agunzagunt.workers.dev

## Environment / secrets
None needed for the deploy itself. The add-card sub-project adds a `GITHUB_TOKEN` Worker secret later.

## Setup steps (manual, one-time)
1. Repo already pushed to GitHub (`origin` is `emrebardak/AiGalleryWeb`)
2. In the Cloudflare dashboard, create a Workers (static assets) project and connect it to the GitHub repo via the "Connect to Git" flow (OAuth)
3. Confirm build settings match the ones above
4. Deploy

## Why Cloudflare over Vercel
Same zero-config Vite support and free git-connected auto-deploy as Vercel, chosen as the alternative host the user asked for. Cloudflare's Workers static-assets platform (successor to Pages) still provides the serverless function support (plain Worker routes with a `wrangler.jsonc`/`wrangler.toml`, not "Pages Functions") needed for the same later need as Vercel's serverless functions — a function that commits to GitHub for the add-card feature — so no re-platform is needed down the line.

## Explicitly out of scope
- Custom domain
- CI/CD beyond Cloudflare's built-in git integration
- Staging environment — single production deploy only
