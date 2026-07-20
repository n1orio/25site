# 25site — Nuxt 4 personal site

## Stack
- **Nuxt 4** + **Vue 3** (Composition API, `<script setup>`) + **TypeScript 6** (strict via `vue-tsc`)
- **Tailwind CSS v4** (via `@tailwindcss/vite`, injected through `vite:extendConfig` hook)
- **Nuxt Icon** (`@nuxt/icon`, server bundle: `remote`; icon sets: `lucide`, `simple-icons`, `ic`, `mdi`)
- **VueUse** (`@vueuse/nuxt`) — `useDark`, `useToggle`, `onClickOutside`
- **Unbounded** (Google Font) for headings via `font-heading` utility class
- **ESLint 10** (config depends on generated `.nuxt/eslint.config.mjs`; run `nuxt prepare` first)
- Package manager: **bun** (Dockerfile uses bun for install & build; pnpm works too but bun is primary)

## Commands

| Command | Description |
|---|---|
| `bun dev` | Dev server on `:3000` |
| `bun run build` | Production build |
| `bun run preview` | Preview production build |
| `bun run typecheck` | TypeScript check via `nuxt typecheck` |
| `bun run lint` | ESLint check (needs `nuxt prepare` first) |
| `bun run postinstall` | Alias for `nuxt prepare` (regenerates `.nuxt/` types) |

CI (ubuntu-latest, Node 22) runs `pnpm install -> pnpm run lint -> pnpm run typecheck` on every push.

## Structure & architecture

- **`app.vue`** — Root layout: custom cursor, Discord/Steam widgets via `/api/discord` / `/api/steam`, theme toggle, accent color picker, nav tabs with swipe/mobile scroll. Page transitions use `<NuxtPage :transition="{ name: 'tab', mode: 'out-in' }">` for crossfade between tabs.
- **`pages/`** — 4 pages: `index` (socials), `projects`, `uses` (setup), `now` (anime ranking).
- **`error.vue`** — Minimal 404 page with big number and back‑to‑home button.
- **`composables/`**:
  - `useSecretTheme.ts` — Theme state: dark/light mode, accent color (localStorage `nio-accent-color`), gradient presets. CSS var `--accent` drives all theme-aware styling.
  - `useNavigation.ts` — Nav scroll, swipe gesture, tab indicator position, scroll‑block between route changes. Watches `route.path` to update indicator on tab switch.
- **`server/api/`** — Local API proxies: `discord.ts` (Lanyard REST), `steam.ts` (Steam Web API). **No scrobbler API** — separate multi-scrobbler service runs alongside in Docker.
- **`components/`** — `AppBackground.vue` (background layers), `AppFooter.vue` (attribution footer, license‑protected).
- **`public/`** — `favicon.ico` only.

## Theme system

- Dark/light mode via `useDark()` (toggles `.dark` on `<html>`).
- Accent color stored in localStorage key `nio-accent-color` (default `#6366f1`).
- CSS variable `--accent` drives all theme-aware styling via `color-mix()`.
- Gradient presets in `composables/useSecretTheme.ts`.

## Conventions & quirks

- **BEM-lite classes**: `theme-card`, `theme-pill`, `nav-link`, `router-link-exact-active` in global `<style>` in `app.vue`.
- **Custom cursor**: replaces native on fine-pointer devices via `cursor: none`, rendered as animated corner brackets.
- **Tailwind v4**: `@import "tailwindcss"` in `main.css`, dark mode via `@custom-variant dark`, theme values in `@theme` block.
- **`pnpm-workspace.yaml`**: `allowBuilds` skips compiling native binaries for `@parcel/watcher`, `@tailwindcss/oxide`, `esbuild`, `unrs-resolver`, `vue-demi` — makes install faster but native modules don't get built.

## Nuxt config quirks

- `sourcemap: { client: false, server: false }` — no sourcemaps in production.
- `@nuxt/ui` is in `package.json` dependencies but **not registered as a Nuxt module** (starter template leftover).
- Font preconnect for Google Fonts in `app.head.link`; the actual `@import` is in `assets/css/main.css`.
- Runtime config reads `STEAM_API_KEY`, `STEAM_ID` from env. Steam API has a mock fallback when key is the placeholder `"твой_ключ_здесь"`.
- Page transition is set via `:transition` prop on `<NuxtPage>` — no `pageTransition` in config.

## Docker / deploy

- `Dockerfile` uses `oven/bun` multi-stage: install deps → `bun run build` → serve `.output/server/index.mjs`.
- `docker-compose.yml` runs 3 services: `site`, `multi-scrobbler` (port 9078), `caddy` (ports 80/443, reverse proxy from `{$DOMAIN}` to `site:3000`).
- Caddy reads `DOMAIN` from `.env`.
- `.env` is tracked in the repo (contains real API keys) — handle with care, do not expose.
- `deploy.sh` is gitignored.
