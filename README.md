# Nuxiox — Multi-Database CMS Built on Nuxt Layers

> A modular, headless-like CMS built with **Nuxt 4**, **Drizzle ORM**, and a **layered architecture** that supports **MySQL** and **Cloudflare D1** databases interchangeably. Think WordPress, but modern, fast, and deployable anywhere.

---

## Architecture Overview

Nuxiox uses **Nuxt Layers** to separate concerns. The system has three core layers, plus theme layers for frontend presentation.

```
nuxiox/
├── layers/
│   ├── base/                          # 🧱 Core layer — admin, APIs, DB definitions
│   ├── databases/
│   │   ├── normal/                    # 🐬 MySQL / MariaDB approach
│   │   └── cloudflare/                # ☁️ Cloudflare D1 (SQLite) approach
│   ├── dentist/                       # 🦷 Dentist theme (active default)
│   ├── denti/                         # 📐 Denti theme variant
│   └── denti-one/                     # 🎨 Denti-One theme variant
├── server/
│   ├── database/
│   │   ├── schema.gen.ts              # 🔌 Active schema — swap import for DB switch
│   │   └── migrations/                # 📦 Drizzle Kit migrations
│   └── utils/
│       ├── mediaStorage.ts            # 📁 Local FS ↔ Cloudflare KV abstraction
│       ├── imageProcessor.ts          # 🖼️ Binary image dimension detection
│       ├── r2.ts                      # 🪣 Cloudflare R2 helpers
│       ├── checkAdmin.ts              # 🔐 Admin session guard
│       ├── checkZod.ts                # ✅ Zod validation wrapper
│       ├── getLocale.ts               # 🌐 Locale detection
│       └── db/upsert.ts               # 🔄 Cross-driver UPSERT (MySQL + SQLite)
├── scripts/
│   └── sync-schema.ts                 # ⚙️ Schema generator: definitions → dialect files
├── nuxt.config.ts                     # 🎯 Root config — extends active theme layer
└── package.json
```

### Layer Dependency Chain

```
nuxt.config.ts
  └── layers/dentist                   (active theme — can swap to denti or denti-one)
       └── layers/databases/cloudflare  (or databases/normal for MySQL)
            └── layers/base             (core: admin, APIs, DB definitions)
```

---

## Database System

### 🔬 Canonical Definitions → Dialect-Specific Schema

All database tables are defined **once** in `layers/base/server/database/definitions.ts` as simple data objects. A schema generator (`scripts/sync-schema.ts`) reads these canonical definitions and outputs dialect-specific Drizzle schema files.

| Step | Command | Description |
|------|---------|-------------|
| Generate both dialects | `pnpm run db:sync` | Creates `layers/databases/{normal,cloudflare}/server/database/schema.ts` |
| Generate one dialect | `pnpm run db:sync -- normal` | MySQL only |
| Generate one dialect | `pnpm run db:sync -- cloudflare` | D1/SQLite only |
| Generate + Drizzle Kit | `pnpm run db:generate` | Syncs schema + runs `drizzle-kit generate` |

### Switching Databases

To switch between MySQL and Cloudflare D1:

1. **Edit** `layers/dentist/nuxt.config.ts` — swap the `extends` line:
   - `'../databases/cloudflare'` → Cloudflare D1
   - `'../databases/normal'` → MySQL

2. **Edit** `server/database/schema.gen.ts` — change the import path (instructions are in the file comments).

3. **Run migrations** for the new database.

### Database Tables (18 tables)

All tables live under a single schema:

| Entity | Table Name | Description |
|--------|-----------|-------------|
| `users` | `users` | Admin users, authentication |
| `settings` | `settings` | Site settings (key-value with JSON) |
| `pages` | `pages` | CMS pages |
| `pages_locales` | `pages_locales` | Page translations |
| `services` | `services` | Service offerings |
| `services_locales` | `services_locales` | Service translations |
| `colleagues` | `colleagues` | Team/colleagues |
| `colleagues_locales` | `colleagues_locales` | Colleague translations |
| `testimonials` | `testimonials` | Client testimonials |
| `testimonials_locales` | `testimonials_locales` | Testimonial translations |
| `contact_messages` | `contact_messages` | Contact form submissions |
| `blog_categories` | `blog_categories` | Blog categories |
| `blog_categories_locales` | `blog_categories_locales` | Category translations |
| `blog_posts` | `blog_posts` | Blog posts |
| `blog_posts_locales` | `blog_posts_locales` | Post translations |
| `blog_post_categories` | `blog_post_categories` | Post ↔ Category junction |
| `blog_comments` | `blog_comments` | Blog comments |
| `blog_comment_likes` | `blog_comment_likes` | Comment likes |

---

## Database Approaches

### 🐬 Normal (MySQL / MariaDB)

- **Driver**: `mysql2` + `drizzle-orm/mysql2`
- **Connection**: Connection pool via environment variables: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- **Schema**: `drizzle-orm/mysql-core` (`mysqlTable`, `int`, `varchar`, etc.)
- **Migrations**: `drizzle-kit` with `dialect: 'mysql'`
- **Migration file**: `layers/databases/normal/server/database/migrations/0000_good_lightspeed.sql`

### ☁️ Cloudflare D1 (SQLite)

- **Driver**: `drizzle-orm/d1`
- **Connection**: Cloudflare D1 binding (`event.context.cloudflare.env.DB`)
- **Schema**: `drizzle-orm/sqlite-core` (`sqliteTable`, `integer`, `text`, etc.)
- **Migrations**: `drizzle-kit` with `dialect: 'sqlite'`
- **Dev mode**: Uses wrangler's local D1 (`nitro-cloudflare-dev` module)

---

## Media Storage

Media files use a **dual storage abstraction** in `server/utils/mediaStorage.ts`:

| Environment | Storage Backend | Details |
|-------------|---------------|---------|
| **Local / Node.js** | Filesystem | `./uploads/` directory |
| **Cloudflare** | Workers KV | `MEDIA_KV` binding |

Additionally, **Cloudflare R2** helpers exist in `server/utils/r2.ts` for production media storage via `MEDIA_BUCKET` binding.

---

## Frontend Themes

| Theme | Path | Description |
|-------|------|-------------|
| **dentist** | `layers/dentist/` | Active default — full feature set (Hero, About, Services, Blog, Testimonials, Why Us, Results, Technology, Contact, Footer, Colleagues) |
| **denti** | `layers/denti/` | Lighter variant |
| **denti-one** | `layers/denti-one/` | Alternative styling |

Each theme layer has its own:
- `app/pages/` — public pages (index, blog, [slug])
- `app/layouts/` — default layout with navbar, footer, sidebar
- `app/components/site/` — SiteNavbar, SiteFooter
- `app/components/sections/` — Hero, About, Service, etc.
- `app/assets/` — theme-specific CSS

All themes share the **base layer** for admin panel, API routes, and database logic.

---

## Admin Panel

The admin system lives in `layers/base/` and provides:

- **Dashboard** — `/admin` with stats (users, pages, posts, contacts, SEO completion)
- **Pages** — CRUD with page builder (drag-and-drop sections)
- **Blog** — Posts, categories, comments management
- **Services** — Manage service offerings
- **Colleagues** — Team member management
- **Testimonials** — Client reviews
- **Contact Messages** — Inbox for form submissions
- **Settings** — Site-wide config (navbar, footer, SEO, theme, blog settings)
- **Media Library** — Image upload and management
- **Home Builder** — Drag-and-drop home page section ordering

### Authentication

- **Package**: `nuxt-auth-utils` (session-based)
- **First Login Bootstrap**: First login creates an admin user automatically
- **Middleware**: `authenticated.ts` route guard for `/admin/*` routes
- **Password**: Hashed via `bcryptjs`

---

## i18n / Localization

Supports 3 languages via `@nuxtjs/i18n`:

| Code | Language | Direction |
|------|----------|-----------|
| `en` | English | LTR |
| `fa` | Persian (Farsi) | RTL |
| `ar` | Arabic | RTL |

RTL is handled via Tailwind variant (`rtl:`, `ltr:`) and the `dir` attribute on `<html>`.

---

## Configuration

### Environment Variables

```env
# MySQL / Normal Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=12345678
DB_NAME=nuxiox

# Cloudflare (D1, KV, R2 — set via wrangler secrets / dashboard)
# MEDIA_KV, MEDIA_BUCKET, DB (D1 binding)
```

### Nuxt Config (`nuxt.config.ts`)

The root config sets:
- Modules: `nitro-cloudflare-dev`, `nuxt-auth-utils`, `@pinia/nuxt`, `@nuxt/image`, `@nuxtjs/i18n`
- CSS framework: Tailwind CSS v4 via `@tailwindcss/vite`
- UI components: daisyUI v5
- Extends: `./layers/dentist` (active theme)

---

## Development

```bash
# Install
pnpm install

# Dev server
pnpm run dev

# Build for production
pnpm run build

# Preview build
pnpm run preview

# Generate static site
pnpm run generate

# Sync database schema (generate dialect files from canonical definitions)
pnpm run db:sync

# Sync + generate Drizzle Kit migrations
pnpm run db:generate
```

---

## Deployment

### Cloudflare Workers

The Cloudflare database approach uses `nitro-cloudflare-dev` and the `cloudflare-module` preset.

```bash
# Build
pnpm run build

# Deploy via wrangler
npx wrangler deploy

# Set secrets
npx wrangler secret put MEDIA_KV
npx wrangler secret put MEDIA_BUCKET
```

### Node.js / MySQL

Run on any Node.js server after building:

```bash
pnpm run build
node .output/server/index.mjs
```

---

## Project Structure Details

```
nuxiox/
├── layers/
│   ├── base/
│   │   ├── app/
│   │   │   ├── components/     # Admin UI, site components, sections
│   │   │   ├── composables/    # useSiteSettings, useAdminSession, useLayoutOverrides
│   │   │   ├── layouts/        # default.vue (public), admin.vue
│   │   │   ├── middleware/     # authenticated.ts
│   │   │   ├── pages/          # Admin pages, login, public pages
│   │   │   └── stores/         # toast, loading (Pinia)
│   │   ├── server/
│   │   │   ├── api/            # All REST API endpoints
│   │   │   │   ├── admin/      # Admin CRUD (blog, services, media, etc.)
│   │   │   │   ├── auth/       # Login
│   │   │   │   ├── blog/       # Public blog endpoints
│   │   │   │   ├── settings/   # Site settings
│   │   │   │   ├── pages/      # Page CRUD
│   │   │   │   └── ...         # services, colleagues, testimonials
│   │   │   └── database/
│   │   │       ├── definitions.ts  # 📋 Canonical table definitions (single source of truth)
│   │   │       └── schema.ts       # Base layer's own schema
│   │   ├── types/              # TypeScript type definitions
│   │   ├── utils/              # Shared utilities
│   │   └── nuxt.config.ts
│   ├── databases/
│   │   ├── normal/             # MySQL schema + db.ts + drizzle config
│   │   ├── cloudflare/         # D1 schema + db.ts + drizzle config
│   │   └── generate-schema.ts  # Schema code generator
│   ├── dentist/                # Active theme (full sections)
│   ├── denti/                  # Theme variant
│   └── denti-one/              # Theme variant
├── server/
│   ├── database/
│   │   ├── schema.ts           # Imports from active DB layer
│   │   ├── schema.gen.ts       # 🔌 SWITCH THIS FILE to change database
│   │   └── migrations/         # Migration tracking
│   └── utils/
│       ├── mediaStorage.ts     # 📁 Unified FS/KV storage
│       ├── imageProcessor.ts   # 🖼️ Binary dimension detection
│       ├── r2.ts               # 🪣 Cloudflare R2 helpers
│       ├── checkAdmin.ts       # 🔐 Session guard
│       ├── checkZod.ts         # ✅ Validation helper
│       ├── getLocale.ts        # 🌐 Locale detection
│       └── db/upsert.ts        # 🔄 Cross-driver UPSERT
├── scripts/
│   └── sync-schema.ts          # ⚙️ Run schema generator
├── nuxt.config.ts
├── tailwind.config.ts          # Tailwind v3 config (layers/base/)
└── package.json
```

---

## Key Technologies

| Technology | Purpose |
|-----------|---------|
| **Nuxt 4** | Full-stack Vue framework |
| **Drizzle ORM** | Type-safe database access |
| **Tailwind CSS v4** | Utility-first styling |
| **daisyUI v5** | UI component library |
| **MySQL2** | MySQL database driver |
| **@libsql/client** | SQLite/libSQL client |
| **nuxt-auth-utils** | Session-based authentication |
| **bcryptjs** | Password hashing |
| **Zod** | Input validation |
| **Pinia** | State management |
| **@nuxtjs/i18n** | Multi-language support |
| **nitro-cloudflare-dev** | Local Cloudflare dev emulation |
| **Wrangler** | Cloudflare Workers deployment |

---

## Why Nuxiox?

- **🔌 Database-agnostic**: Write your schema once, deploy on MySQL or D1
- **🧩 Modular layers**: Add new themes without touching core logic
- **🔐 Admin-first**: Full admin panel with user management
- **🌐 i18n ready**: English, Persian, Arabic out of the box
- **☁️ Cloudflare native**: Deploy to Cloudflare Workers with D1, KV, R2
- **📦 Drizzle ORM**: Type-safe queries, auto-complete, migration support
