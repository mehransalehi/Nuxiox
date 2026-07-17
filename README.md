# Nuxiox — CMS built with Nuxt 4 + Drizzle ORM

Multi-database CMS supporting both MySQL (LibSQL) and Cloudflare D1 via a layered architecture.

## Setup

```bash
pnpm install
```

Copy `.env.example` to `.env` and fill in your values.

## Development

```bash
pnpm dev
```

## Build

```bash
pnpm build
```

Preview with wrangler:

```bash
npx wrangler dev .output/server/index.mjs --assets .output/public
```

## Database Layer Switching

The project supports two database layers — **Normal (MySQL/LibSQL)** and **Cloudflare (D1/SQLite)**. Both schemas use identical snake_case JS property names, so no handler changes are needed when switching.

### To switch to Normal (MySQL):

**1. `layers/dentist/nuxt.config.ts`** — swap the extends block:

```ts
// ─── Normal Database (MySQL / libsql) ───────────────────────────────
export default defineNuxtConfig({
  extends: ['../databases/normal','../base'],
  css: ['~~/layers/dentist/app/assets/theme.css'],
  modules: ['@nuxtjs/i18n'],
  i18n: { locales: [{ code: 'en', file: 'en.json' }, { code: 'fa', file: 'fa.json' }] }
})

// ─── Cloudflare (D1 / SQLite) ───────────────────────────────────────
// Comment this block out when using normal:
// export default defineNuxtConfig({
//   extends: ['../databases/cloudflare','../base'],
//   ...
```

**2. `server/database/schema.gen.ts`** — change the import path:

```ts
//   Normal (MySQL):   '../../layers/databases/normal/server/database/schema'
//   Cloudflare (D1):  '../../layers/databases/cloudflare/server/database/schema'
import * as base from '../../layers/databases/normal/server/database/schema';
```

### To switch to Cloudflare (D1):

Same files, reverse the changes. The cloudflare layer also requires `nitro-cloudflare-dev` module and `wrangler.toml` for local dev.

> **Important**: Both layers use **snake_case** for all Drizzle column property names (e.g. `is_active`, `created_at`, `password_hash`, `sort_order`, `post_id`). The original base layer schema used camelCase — if you encounter a column reference error, check that the handler matches the snake_case convention.