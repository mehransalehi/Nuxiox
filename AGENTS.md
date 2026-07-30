# Nuxiox — AI Agent Project Guide

> **Read this file before editing. It contains everything you need to understand the project structure, conventions, and critical rules.**

## 🚨 Critical Rules for Editing

1. **NEVER touch database definitions directly in layer-specific schema files** — edit `packages/base/server/database/definitions.ts` and run `pnpm run db:sync` to regenerate dialect-specific schemas
2. **NEVER edit `schema.gen.ts` files** — they are auto-generated
3. **NEVER edit `server/database/schema.ts` or `server/database/schema.gen.ts`** — these are auto-generated
4. **To switch databases**: run `pnpm run setup` (the interactive CLI) — it handles everything. Or manually: change the extends in the active theme's `nuxt.config.ts` AND update the import in `server/database/schema.gen.ts`
5. **Media storage is abstracted** — use `uploadFile`/`getFile`/`deleteFile` from `server/utils/mediaStorage.ts`, never direct filesystem calls
6. **All API routes use `useDb(event)`** — get the database instance from this function, never instantiate a connection directly

## Project Overview

Nuxiox is a multi-database CMS built on Nuxt 4 with a monorepo structure using `packages/` as the layer source.

### Quick Facts

| Property | Value |
|----------|-------|
| **Framework** | Nuxt 4 |
| **ORM** | Drizzle ORM (v0.45+) |
| **UI** | Tailwind CSS v4 + daisyUI v5 |
| **Auth** | nuxt-auth-utils (session-based) |
| **State** | Pinia |
| **i18n** | @nuxtjs/i18n (en, fa, ar) |
| **Validation** | Zod |
| **Package Manager** | pnpm |
| **Build** | `pnpm run build` |

---

## Package Architecture

### Layer Hierarchy

```
nuxt.config.ts  ← set extends: './packages/themes/<theme>'
  └── packages/themes/dentalis (or dentist, denti, denti-one, kids)
       ├── app/          — pages, components, layouts, i18n
       ├── app.config.ts — i18n messages
       │
       └── extends: ['../../databases/cloudflare' OR '../../databases/normal', '../../base']
            │
            └── packages/databases/
            │       ├── cloudflare/  — D1 schema + utils
            │       │   ├── server/database/schema.ts     — auto-generated
            │       │   ├── server/database/schema.gen.ts — auto-generated
            │       │   ├── server/utils/db.ts            — D1 connection helper
            │       │   └── server/utils/schema-types.ts  — Type helper
            │       │
            │       ├── normal/  — MySQL schema + utils
            │       │   ├── server/database/schema.ts     — auto-generated
            │       │   ├── server/database/schema.gen.ts — auto-generated
            │       │   ├── server/utils/db.ts            — MySQL connection pool
            │       │   ├── server/utils/schema-types.ts  — Type helper
            │       │   └── server/database/migrations/   — Drizzle migrations
            │       │
            │       └── mysql/  — Inactive MySQL schema (legacy, use normal/)
            │
            └── packages/base  — CORE LAYER (most editing happens here)
                ├── app/
                │   ├── components/     — admin/, sections/, site/, ui/
                │   ├── composables/    — useSiteSettings, useAdminSession, useLayoutOverrides
                │   ├── layouts/        — default.vue + admin.vue
                │   ├── middleware/     — authenticated.ts
                │   ├── pages/         — admin/ + public pages
                │   └── stores/        — toast.ts + loading.ts (Pinia)
                ├── i18n/locales/      — translation files (en.json, fa.json, ar.json)
                ├── server/
                │   ├── api/           — ALL API routes (REST)
                │   │   ├── admin/     — admin CRUD endpoints
                │   │   ├── auth/      — login.post.ts
                │   │   ├── blog/      — public blog endpoints
                │   │   ├── settings/  — site settings CRUD
                │   │   └── ...        — services, colleagues, etc.
                │   └── database/
                │       ├── definitions.ts  — ⭐ SINGLE SOURCE OF TRUTH for tables
                │       └── schema.ts       — base layer's schema (rarely touched)
                ├── types/            — TypeScript types
                └── utils/            — page-builder, settings, other helpers
```

### Root-Level Structure

```
server/database/schema.gen.ts   — Re-exports from the active database layer (import via ~~/server/database/schema.gen)
server/database/schema.ts       — Base re-export (rarely used directly)
server/utils/                   — Shared utilities (checkAdmin.ts, checkZod.ts, db/upsert.ts, mediaStorage.ts, r2.ts, etc.)
scripts/setup.ts                — Interactive setup CLI (database, theme, media config)
scripts/sync-schema.ts          — Schema generation orchestrator
```

### Theme Layers

Each theme provides section components, layouts, pages, and i18n messages:

| Theme | Path | Features |
|-------|------|----------|
| **dentalis** (active) | `packages/themes/dentalis/` | Full sections: TheHero, TheServices, TheBlog, TheTestimonials, TheTeam, TheContact, TheFooter, TheNavbar. Three.js particle background. Uses `The*` component naming. |
| **dentist** | `packages/themes/dentist/` | Full sections: Hero, About, Services, Blog, Testimonials, Why Us, Results, Technology, Contact, Colleagues |
| **kids** | `packages/themes/kids/` | Same section structure as dentist. Child-friendly styling with Fredoka/Nunito fonts. |
| **denti** | `packages/themes/denti/` | Lighter profile, extends base only (no database layer) |
| **denti-one** | `packages/themes/denti-one/` | Alternative styling, extends base only (no database layer) |

To switch themes, change the `extends` in `nuxt.config.ts` root file.

---

## Database System (Critical)

### How It Works

**All tables are defined once** in `packages/base/server/database/definitions.ts` as `EntityDef` objects using helper functions (`entity()`, `col()`).

```typescript
// Example from definitions.ts
export const USERS = entity('users', 'users', [
  col('id', 'int', { primaryKey: { autoIncrement: true } }),
  col('username', 'text', { notNull: true, unique: true }),
  col('email', 'text', { notNull: true, unique: true }),
  col('password_hash', 'text'),
  col('role', 'text', { notNull: true, default: 'user', typeAnnotation: '"admin" | "user"' }),
  col('created_at', 'timestamp', { notNull: true, defaultRaw: '(CURRENT_TIMESTAMP)' }),
])

export const ALL_ENTITIES: EntityDef[] = [USERS, SETTINGS, ...]
```

### Schema Generation Pipeline

```
packages/base/server/database/definitions.ts
    ──→  scripts/sync-schema.ts
        ──→  packages/databases/generate-schema.ts
            ──→  packages/databases/{cloudflare,normal}/server/database/schema.ts
            ──→  packages/databases/{cloudflare,normal}/server/database/schema.gen.ts
```

1. Edit `packages/base/server/database/definitions.ts` to add/modify tables
2. Run `pnpm run db:sync` — regenerates both MySQL and SQLite schema files
3. Run `pnpm run db:generate` — also runs `drizzle-kit generate` for migrations

### Switching Between MySQL and Cloudflare D1

**Preferred method**: Run `pnpm run setup` — the interactive CLI handles everything.

**Manual method**: Two files must be changed:

```typescript
// File 1: packages/themes/<active-theme>/nuxt.config.ts
extends: ['../../databases/cloudflare','../../base']  // → D1
extends: ['../../databases/normal','../../base']      // → MySQL

// File 2: server/database/schema.gen.ts
import * as base from '../../packages/databases/cloudflare/server/database/schema';  // → D1
import * as base from '../../packages/databases/normal/server/database/schema';      // → MySQL
```

### Database Connection Helpers

Both approaches expose a `useDb(event)` function:

- **MySQL** (`packages/databases/normal/server/utils/db.ts`): Creates a connection pool from `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` env vars
- **Cloudflare D1** (`packages/databases/cloudflare/server/utils/db.ts`): Reads `event.context.cloudflare.env.DB` binding

### 18 Database Tables

| variable name | table name | Description |
|--------------|-----------|-------------|
| `users` | `users` | Admin auth |
| `settings` | `settings` | Key-value settings |
| `pages` | `pages` | CMS pages |
| `pagesLocales` | `pages_locales` | i18n pages |
| `services` | `services` | Services |
| `servicesLocales` | `services_locales` | i18n services |
| `colleagues` | `colleagues` | Team members |
| `colleaguesLocales` | `colleagues_locales` | i18n colleagues |
| `testimonials` | `testimonials` | Testimonials |
| `testimonialsLocales` | `testimonials_locales` | i18n testimonials |
| `contactMessages` | `contact_messages` | Contact form |
| `blogCategories` | `blog_categories` | Blog cats |
| `blogCategoriesLocales` | `blog_categories_locales` | i18n categories |
| `blogPosts` | `blog_posts` | Blog posts |
| `blogPostsLocales` | `blog_posts_locales` | i18n posts |
| `blogPostCategories` | `blog_post_categories` | Post-category junction |
| `blogComments` | `blog_comments` | Comments |
| `blogCommentLikes` | `blog_comment_likes` | Comment likes |
| `media` | `media` | Media files |

All locale tables follow the pattern: a parent entity + `_locales` table with `entity_id` + `locale` unique constraint.

---

## Media Storage

### Storage Abstraction (`server/utils/mediaStorage.ts`)

```typescript
// Upload
uploadFile(event, filePath, buffer, mimeType)
// Read
getFile(event, filePath)  // → { body: ReadableStream|Buffer, mimeType }
// Delete
deleteFile(event, filePath)
```

| Runtime | Backend |
|---------|---------|
| Node.js | `./uploads/` filesystem |
| Cloudflare | Workers KV (`MEDIA_KV`) |

### R2 Storage (`server/utils/r2.ts`)

For production media, Cloudflare R2 via `MEDIA_BUCKET` binding:

```typescript
getR2Bucket(event)
uploadToR2(bucket, key, file, contentType)
getFromR2(bucket, key)
deleteFromR2(bucket, key)
```

---

## API Routes

All routes are in `packages/base/server/api/`. Every admin route requires authentication via `requireAdmin(event)`.

### Public Endpoints

| Route | Method | Description |
|-------|--------|-------------|
| `/api/settings/public` | GET | Public settings |
| `/api/pages/public/[slug]` | GET | Public page by slug |
| `/api/home-builder/public` | GET | Home page sections |
| `/api/blog/posts` | GET | Published posts |
| `/api/blog/posts/[slug]` | GET | Post detail |
| `/api/blog/posts/recent` | GET | Recent posts |
| `/api/blog/posts/[slug]/comments` | POST | Add comment |
| `/api/blog/comments/[id]/like` | POST | Like comment |
| `/api/services/public` | GET | Services |
| `/api/colleagues/public` | GET | Colleagues |
| `/api/testimonials/public` | GET | Testimonials |
| `/api/contact-messages` | POST | Contact form |
| `/api/sections` | GET | Available sections |
| `/api/auth/login` | POST | Login (auto-bootstrap on first) |

### Admin Endpoints (require auth)

| Route | Method | Description |
|-------|--------|-------------|
| `/api/admin/dashboard/stats` | GET | Dashboard stats |
| `/api/admin/blog/posts` | GET/POST | Blog posts CRUD |
| `/api/admin/blog/categories` | GET/POST | Categories CRUD |
| `/api/admin/blog/comments` | GET | Comments |
| `/api/admin/services` | GET/POST | Services CRUD |
| `/api/admin/colleagues` | GET/POST | Colleagues CRUD |
| `/api/admin/testimonials` | GET/POST | Testimonials CRUD |
| `/api/admin/contact-messages` | GET | Contact messages |
| `/api/admin/media` | GET | Media list |
| `/api/admin/media/upload` | POST | Upload image |
| `/api/admin/media/[id]/file` | GET | Serve file |
| `/api/admin/media/[id]/url` | GET | Get media URL |
| `/api/admin/media/[id]` | DELETE | Delete media |
| `/api/settings` | GET/PUT | All settings |
| `/api/home-builder` | GET/PUT | Home builder config |
| `/api/pages` | GET/POST | Pages CRUD |

---

## Auth System

- **Package**: `nuxt-auth-utils`
- **Strategy**: Server-side sessions via `setUserSession()`
- **First Login Bootstrap**: If no admin exists, the first login creates one (email + password ≥ 8 chars)
- **Route Guard**: `middleware/authenticated.ts` — checks `useAdminSession().isAdmin`
- **Admin Guard**: `server/utils/checkAdmin.ts` — `requireAdmin(event)` for API protection

### Login Flow

1. POST `/api/auth/login` with `{ email, password }`
2. System checks if any admin exists
3. If no admin → auto-creates admin user, sets session → returns `{ firstLogin: true }`
4. If admin exists → normal login flow with bcrypt comparison
5. Session is set via `setUserSession(event, { user: { id, email, role } })`

---

## Frontend Components

### Component Discovery

Nuxt auto-imports components from layer directories. A component in `packages/themes/dentist/app/components/sections/Hero.vue` is available as `<SectionsHero />` or `<Hero />` depending on naming. The `dentalis` theme uses `The*` prefixed names (e.g. `TheHero.vue` → `<TheHero />`).

### Available Section Components

**dentalis theme** (active):

| Component | Description |
|-----------|-------------|
| `TheHero` | Hero banner with Three.js particles |
| `TheServices` | Services grid |
| `TheBlog` | Blog preview |
| `TheTestimonials` | Client testimonials |
| `TheTeam` | Team/colleagues |
| `TheContact` | Contact form section |
| `TheFooter` | Footer content |
| `TheNavbar` | Navigation bar |

**dentist / kids themes**:

| Component | Description |
|-----------|-------------|
| `Hero` | Hero banner |
| `About` | About section |
| `Service` | Services grid |
| `Testimonial` | Client testimonials |
| `Contact` | Contact form section |
| `Colleague` | Team/colleagues |
| `Footer` | Footer content |
| `Navbar` | Navigation bar |
| `Blog` | Blog preview |
| `Whyus` | Why choose us |
| `Results` | Results/statistics |
| `Technology` | Technology stack |

### UI Components

From `packages/base/app/components/ui/`:

- `ToastStack` — Toast notifications
- `GlobalLoaders` — Loading indicators

From `packages/base/app/components/admin/`:

- `Sidebar` — Admin sidebar
- `Topbar` — Admin top bar
- `Card` — Content card
- `Page` — Page editor
- `TextEditor` / `QuillEditor` — Rich text editor (Quill)
- `FileManager` — File/media picker
- `MediaLibraryPicker` — Media grid selector
- `MenuCreator` — Menu builder
- `ListCreator` — List builder
- `ThemeToggleButton` — Dark/light toggle
- `SectionSelector` — Section picker
- `SectionList` — Section list
- `PageSectionList` — Page section list
- `LocaleSelector` — Language selector
- `SidebarToggleButton` — Sidebar toggle
- `SidebarNavItem` — Sidebar nav item
- `SidebarSection` — Sidebar section
- `LoadingSpinner` — Loading animation
- `MainTitle` — Page title
- `ThereIsNo` — Empty state placeholder
- Admin form inputs: `Text`, `Textarea`, `Number`, `Select`, `CheckBox`, `Url`, `Error`

---

## Nuxt Config Details

### Root `nuxt.config.ts`
- **Extends**: `./packages/themes/dentalis`
- **Watch**: `['packages/**/*']`
- **Modules**: `nitro-cloudflare-dev`, `nuxt-auth-utils`, `@pinia/nuxt`, `@nuxt/image`, `@nuxtjs/i18n`
- **CSS**: Tailwind v4 via `@tailwindcss/vite`
- **i18n**: defaultLocale: 'en', prefix_except_default, locales: en, fa, ar

### `packages/base/nuxt.config.ts`
- Modules: `@nuxtjs/i18n` (locales only)

### `packages/themes/dentalis/nuxt.config.ts`
- Extends: `['../../databases/cloudflare','../../base']` (currently cloudflare)
- Nitro preset: `cloudflare-module`
- CSS: `~~/packages/themes/dentalis/app/assets/theme.css`
- i18n: en + fa locales

### `packages/themes/dentist/nuxt.config.ts`
- Has both MySQL and Cloudflare configs commented — the currently uncommented one is active
- Extends: `['../../base', '../../databases/cloudflare']` (or `../../databases/normal`)

### `packages/themes/kids/nuxt.config.ts`
- Extends: `['../../base', '../../databases/cloudflare']`
- Nitro preset: `cloudflare-module`
- Kids-specific fonts (Fredoka, Nunito, Vazirmatn)

### `packages/themes/denti/nuxt.config.ts`
- Extends: `['../../base']` (no database layer)

### `packages/themes/denti-one/nuxt.config.ts`
- Extends: `['../../base']` (no database layer)

---

## App Configuration

### `app.config.ts` (each layer)
Defines i18n messages per layer. Base layer provides base i18n messages; theme layers can override.

### Available Composables

- `useSiteSettings()` — fetches public settings from `/api/settings/public`, returns reactive `{ settings }`
- `useAdminSession()` — wraps `useUserSession()`, adds `isAdmin` computed property
- `useLayoutOverrides()` — controls navbar/footer visibility
- `useI18n()` — from `@nuxtjs/i18n`
- `useThreeParticles()` — (dentalis theme) Three.js 3D particle system

### Pinia Stores

- `stores/toast.ts` — Toast notification store
- `stores/loading.ts` — Loading state store

---

## Settings System

Settings are stored in the `settings` table as key-value pairs with JSON values. The type system is defined in `packages/base/utils/settings.ts`:

```typescript
SiteSettings = {
  general: GeneralSettings (showSidebar, direction, language)
  navbar: NavbarSettings (menus, logos, info)
  footer: FooterSettings (menus, logos, info)
  blog: BlogSettings (comments settings, recaptcha)
  seo: SeoSettings (site name, description, verification codes)
  theme: ThemeSettings (preset, light/dark palettes)
  about: AboutSettings (info items)
}
```

---

## Adding a New Feature (Typical Workflow)

1. **Add tables** → Edit `packages/base/server/database/definitions.ts`
2. **Generate schema** → Run `pnpm run db:sync`
3. **Run migrations** → Run `pnpm run db:generate`
4. **Create API routes** → Add to `packages/base/server/api/` using `useDb(event)` and Drizzle queries
5. **Create admin pages** → Add Vue components to `packages/base/app/pages/admin/`
6. **Create public endpoints** → Add to `packages/base/server/api/` for frontend display
7. **Add theme components** → Add section components to the active theme under `packages/themes/<theme>/app/components/sections/`

## Known Pitfalls

- The MySQL schema generator has a bug: some lines show `..$type<...>()` (double dot) — this is a generated-file issue from `packages/databases/generate-schema.ts`
- The base layer's `packages/base/server/database/schema.ts` is NOT the same as `packages/databases/{cloudflare,normal}/server/database/schema.gen.ts` — the latter is the active one
- The root `server/database/schema.gen.ts` is the one that ALL API routes import via `~~/server/database/schema.gen`
- When adding a new entity to `definitions.ts`, don't forget to add it to `ALL_ENTITIES` array
- RTL is handled through Tailwind variants, not CSS flips — check `packages/base/tailwind.config.ts` for `rtl:` and `ltr:` variants
- The `packages/themes/dentist/nuxt.config.ts` has BOTH MySQL and Cloudflare configs commented — the currently uncommented one is active
- The `packages/themes/dentalis/app.config.ts` imports `./app/i18n/messages` but the actual i18n messages are in `packages/base/i18n/locales/` — this import may need fixing
- The generated schema files in `packages/databases/cloudflare/server/database/schema.ts` still reference `'../../layers/base/server/database/definitions'` in their layer source comment — this is cosmetic and doesn't affect functionality
- `scripts/sync-schema.ts` references `../layers/databases/generate-schema.ts` for the generator path — this is a stale comment, the actual path resolves correctly via `path.resolve`

## Available Scripts

```bash
pnpm run dev          # Dev server
pnpm run build        # Production build
pnpm run generate     # Static generation
pnpm run preview      # Preview build
pnpm run db:sync      # Generate dialect schemas from definitions
pnpm run db:generate  # Sync + Drizzle Kit migrations
pnpm run setup        # Interactive setup CLI (switch theme, database, media, etc.)
```

## Common Import Patterns

```typescript
// Database schema (in API routes)
import { users } from '~~/server/database/schema.gen'

// Database connection
const db = useDb(event)

// Admin auth guard
import { requireAdmin } from "~~/server/utils/checkAdmin"
const admin = await requireAdmin(event)

// Media storage
import { uploadFile, getFile, deleteFile } from "~~/server/utils/mediaStorage"

// R2 (Cloudflare only)
import { getR2Bucket, uploadToR2 } from "~~/server/utils/r2"

// Cross-driver upsert
import { upsert } from "~~/server/utils/db/upsert"

// Validation
import { checkZod } from "~~/server/utils/checkZod"
import { z } from "zod"
```