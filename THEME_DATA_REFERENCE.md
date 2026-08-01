# Nuxiox Theme Data Reference

> A technical reference for AI tools (Google Studio, etc.) to understand the backend data model,
> API contracts, and component conventions of the Nuxiox CMS. **No style, brand, or industry assumptions.**
> Users describe their own visual identity to the AI — this document provides the data contract.

---

## 1. Theme File Structure

Create a folder under `packages/themes/<your-theme-name>/` with this structure:

```
packages/themes/<theme-name>/
├── app/
│   ├── assets/
│   │   └── theme.css              # Optional: global CSS (Tailwind directives go here)
│   ├── components/
│   │   └── sections/
│   │       ├── Hero.vue           # Section components (see §6 for full list)
│   │       ├── Services.vue
│   │       ├── About.vue
│   │       ├── Testimonials.vue
│   │       ├── Team.vue (or Colleague.vue)
│   │       ├── Blog.vue
│   │       ├── Contact.vue
│   │       ├── Results.vue        # Optional: statistics/achievements
│   │       ├── Technology.vue     # Optional: tech stack display
│   │       ├── Whyus.vue          # Optional: why choose us
│   │       ├── Navbar.vue         # REQUIRED: navigation bar
│   │       └── Footer.vue         # REQUIRED: page footer
│   ├── composables/               # Optional: theme-specific composables
│   │   └── useMyFeature.ts
│   ├── layouts/
│   │   └── default.vue            # REQUIRED: main layout (renders Navbar + slot + Footer)
│   ├── pages/
│   │   ├── index.vue              # Home page (choose sections to render)
│   │   └── [slug].vue             # CMS dynamic pages — see §7
│   └── app.config.ts              # Optional: theme-specific i18n messages
├── nuxt.config.ts                 # REQUIRED: Nuxt config
└── app.config.ts                  # Alternatively, theme config here
```

### Required files explained

| File | Purpose |
|------|---------|
| `nuxt.config.ts` | Extends base + database layer modules |
| `layouts/default.vue` | Calls `useSiteSettings()`, renders `<Navbar :menus="..." />` + `<slot />` + `<Footer :menus="..." />` |
| `pages/index.vue` | Composes section components for the home page |
| `components/sections/*.vue` | Sections that render dynamic data from the CMS |
| `app.config.ts` | If the theme adds i18n messages beyond the base layer |

---

## 2. nuxt.config.ts Template

```ts
// packages/themes/<theme-name>/nuxt.config.ts
export default defineNuxtConfig({
  extends: ['../../base', '../../databases/cloudflare'],
  // extends: ['../../base', '../../databases/normal'], // for MySQL

  css: ['~~/packages/themes/<theme-name>/app/assets/theme.css'],

  modules: [],

  nitro: {
    preset: 'cloudflare-module', // omit for Node/MySQL
  },

  compatibilityDate: '2025-07-15',
})
```

---

## 3. The `useSiteSettings()` Composable

**Import:** auto-imported (no manual import needed)

**Returns:** `{ settings: ComputedRef<SiteSettings>, refreshSettings: () => void }`

**Usage in layouts:**
```vue
<script setup lang="ts">
const { settings } = useSiteSettings()
</script>

<template>
  <Navbar
    :menus="settings.navbar.menus"
    :dark-logo="settings.navbar.darkLogo"
    :light-logo="settings.navbar.lightLogo"
    :info="settings.navbar.info"
  />
  <main><slot /></main>
  <Footer
    :menus="settings.footer.menus"
    :dark-logo="settings.footer.darkLogo"
    :light-logo="settings.footer.lightLogo"
    :info="settings.footer.info"
  />
</template>
```

### SiteSettings type (full shape)

```typescript
type SiteSettings = {
  general: {
    showSidebar: boolean
    direction: 'ltr' | 'rtl'
    language: 'en' | 'fa' | 'ar'
  }
  navbar: {
    menus: { label: string; href: string }[]
    darkLogo: string     // URL
    lightLogo: string    // URL
    info: { key: string; value: string }[]
  }
  footer: {
    menus: { label: string; href: string }[]
    darkLogo: string     // URL
    lightLogo: string    // URL
    info: { key: string; value: string }[]
  }
  blog: {
    commentsEnabled: boolean
    commentsRequireApproval: boolean
    allowAnonymousCommentsByDefault: boolean
    recaptchaSiteKey: string
    recaptchaSecretKey: string
  }
  seo: {
    siteName: string
    siteUrl: string
    defaultTitle: string
    titleSuffix: string
    defaultDescription: string
    defaultOgImage: string
    robots: string
    twitterHandle: string
    googleSiteVerification: string
    bingSiteVerification: string
    yandexVerification: string
  }
  theme: {
    preset: string
    light: { primary: string; secondary: string; accent: string; neutral: string }
    dark: { primary: string; secondary: string; accent: string; neutral: string }
  }
  about: {
    info: { key: string; value: string }[]
  }
}
```

---

## 4. Database Tables & Public API Endpoints

### 4.1 Users (admins only, no public endpoint)

| Column | Type | Notes |
|--------|------|-------|
| id | int | PK, auto-increment |
| username | text | unique |
| email | text | unique |
| password_hash | text | bcrypt hash |
| role | text | `"admin"` or `"user"` |

### 4.2 Settings

**API: `GET /api/settings/public`** → `SiteSettings` (full object above)

Stored as a JSON-per-locale key-value. The public endpoint merges locale data. Component reads it via `useSiteSettings()`.

### 4.3 Services

**API: `GET /api/services/public`** → Array of:

```typescript
{
  id: number
  icon: string | null       // icon class or URL
  image: string | null      // image URL
  link: string | null       // optional link
  sortOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  title: string             // localized
  subtitle: string | null
  description: string | null
  extra: { key: string; value: string }[]   // custom key-value pairs
}
```

### 4.4 Colleagues (Team members)

**API: `GET /api/colleagues/public`** → Array of:

```typescript
{
  id: number
  icon: string | null
  image: string | null
  link: string | null
  sortOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  title: string             // localized (name)
  subtitle: string | null   // localized (role/position)
  description: string | null
  extra: { key: string; value: string }[]
}
```

### 4.5 Testimonials

**API: `GET /api/testimonials/public`** → Array of:

```typescript
{
  id: number
  avatar: string | null     // image URL
  rating: number            // 1-5
  isActive: boolean
  createdAt: string
  updatedAt: string
  name: string              // localized
  role: string | null       // localized
  content: string           // localized (testimonial text)
}
```

### 4.6 Blog Posts

**API: `GET /api/blog/posts`** → Array of:
```typescript
{
  id: number
  title: string
  slug: string
  excerpt: string | null
  featuredImage: string | null
  publishedAt: string | null
  createdAt: string
}
```

**API: `GET /api/blog/posts/recent`** → Same shape, limited to 5 items.

**API: `GET /api/blog/posts/:slug`** → Full post + threaded comments:
```typescript
{
  post: {
    id: number
    title: string
    slug: string
    excerpt: string | null
    content: string         // HTML content
    featuredImage: string | null
    publishedAt: string | null
    createdAt: string
  },
  comments: CommentNode[]   // threaded, approved only
}
```

**Comment shape:**
```typescript
type CommentNode = {
  id: number
  postId: number
  userId: number | null
  parentId: number | null
  authorName: string | null
  content: string
  likeCount: number
  createdAt: string
  replies: CommentNode[]    // nested replies
}
```

### 4.7 Blog Categories

**API: `GET /api/blog/posts`** (included in response — not separate). Category data per post is embedded.

### 4.8 Blog Categories (standalone)

**API: Not used directly in public frontend** — consumed via blog post edge.

### 4.9 Pages (CMS dynamic pages)

**API: `GET /api/pages/public/:slug`** → Page record:

```typescript
{
  id: number
  status: 'draft' | 'published'
  createdAt: string
  updatedAt: string
  locale: string
  title: string
  slug: string
  seo: Record<string, string>     // JSON object
  builder: {
    version: number
    blocks: PageBlock[]
  }
}
```

### 4.10 Contact Messages (public submission only)

**API: `POST /api/contact-messages`** accepts body:
```typescript
{ name: string; email: string; subject?: string; message: string }
```

No public GET — admin-only.

### 4.11 Media

**API: `GET /api/admin/media/:id/file`** → Raw image file (public, no auth for viewing).

---

## 5. Section Components — Data Contracts

Each `.vue` file in `components/sections/` is registered automatically as a section by the
`/api/sections` endpoint. The **file name** (without `.vue`) becomes the section ID.

### Standard section set (file names to use):

| File | API to fetch | Purpose |
|------|-------------|---------|
| `Hero.vue` | `useSiteSettings()` | Hero banner, uses `settings.navbar` for context |
| `Services.vue` | `$fetch('/api/services/public')` | Service cards grid |
| `About.vue` | `useSiteSettings().settings.about.info` | About section with info items |
| `Testimonials.vue` | `$fetch('/api/testimonials/public')` | Testimonial carousel/grid |
| `Team.vue` | `$fetch('/api/colleagues/public')` | Team member cards |
| `Blog.vue` | `$fetch('/api/blog/posts/recent')` | Recent blog posts preview |
| `Contact.vue` | — | Contact form (POSTs to `/api/contact-messages`) |
| `Results.vue` | — | Static stats/achievements section (optional) |
| `Whyus.vue` | — | "Why choose us" content (optional) |
| `Technology.vue` | — | Tech stack display (optional) |
| `Navbar.vue` | `useSiteSettings()` | Navigation bar — reads `settings.navbar.menus` |
| `Footer.vue` | `useSiteSettings()` | Footer — reads `settings.footer.menus` |

### Component rendering contract

Each section component receives **no props** from the page builder. It must fetch its own
data using the API endpoints listed above. Example pattern:

```vue
<!-- components/sections/Services.vue -->
<script setup lang="ts">
const { data: services } = await useFetch('/api/services/public', {
  default: () => []
})
</script>

<template>
  <section>
    <div v-for="item in services" :key="item.id">
      <h3>{{ item.title }}</h3>
      <p>{{ item.description }}</p>
      <img v-if="item.image" :src="item.image" :alt="item.title" />
    </div>
  </section>
</template>
```

### Navbar and Footer — special handling

These two are called from `layouts/default.vue` and receive their data via props
(not self-fetched) to ensure consistency:

```vue
<!-- layouts/default.vue -->
<script setup lang="ts">
const { settings } = useSiteSettings()
</script>

<template>
  <Navbar
    :menus="settings.navbar.menus"
    :dark-logo="settings.navbar.darkLogo"
    :light-logo="settings.navbar.lightLogo"
    :info="settings.navbar.info"
  />
  <main><slot /></main>
  <Footer
    :menus="settings.footer.menus"
    :dark-logo="settings.footer.darkLogo"
    :light-logo="settings.footer.lightLogo"
    :info="settings.footer.info"
  />
</template>
```

The `Navbar` and `Footer` components receive these as props:

```typescript
// Navbar props
{
  menus: { label: string; href: string }[]
  darkLogo: string
  lightLogo: string
  info: { key: string; value: string }[]
  showSidebar?: boolean
}

// Footer props
{
  menus: { label: string; href: string }[]
  darkLogo: string
  lightLogo: string
  info: { key: string; value: string }[]
}
```

---

## 6. Home Page (index.vue)

The home page is **hardcoded** — you choose which sections to render and in what order.

```vue
<!-- pages/index.vue -->
<template>
  <div>
    <Hero />
    <Services />
    <About />
    <Team />
    <Testimonials />
    <Blog />
    <Contact />
  </div>
</template>
```

The order above is recommended but you can rearrange, omit, or duplicate sections.

---

## 7. Dynamic CMS Pages ([slug].vue)

Create `pages/[slug].vue` — it is **auto-provided by the base layer** but you can
override it in the theme if needed.

The base `[slug].vue`:
1. Calls `GET /api/pages/public/:slug` with the current route param
2. Returns `{ status: 404 }` if not found
3. Iterates over `page.builder.blocks` and renders each block

**Builder block types:**

```typescript
type PageBlock =
  | { uid: string; type: 'text'; content: string }           // Rich text block
  | { uid: string; type: 'section'; sectionId: string; source: 'sections' }    // Section component
  | { uid: string; type: 'navbar'; sectionId: string; source: 'sections' }     // Navbar override
  | { uid: string; type: 'footer'; sectionId: string; source: 'sections' }     // Footer override
```

**How rendering works:**

```vue
<!-- In [slug].vue template -->
<template v-for="block in page.builder.blocks" :key="block.uid">
  <div v-if="block.type === 'text'" v-html="block.content" />
  <component v-else :is="sectionComponentName(block)" />
</template>
```

Where `sectionComponentName` looks up `block.sectionId` in a dynamic import map of
all `components/sections/*.vue` files. The section ID must match the file name exactly.

---

## 8. Blog Page (blog/[slug].vue)

Create `pages/blog/[slug].vue` for individual blog post pages.

Uses `GET /api/blog/posts/:slug` which returns `{ post, comments }`.

The comment form posts to `POST /api/blog/posts/:slug/comments` with body:
```typescript
{ authorName?: string; authorEmail?: string; content: string; parentId?: number }
```

The like button calls `POST /api/blog/comments/:id/like`.

---

## 9. Section Registration System

The backend discovers sections automatically by scanning `.vue` files in
`components/sections/`. The file name becomes the section ID:

- `Hero.vue` → `{ id: 'Hero', label: 'Hero', type: 'section' }`
- `Navbar.vue` → `{ id: 'Navbar', label: 'Navbar', type: 'navbar' }`
- `Footer.vue` → `{ id: 'Footer', label: 'Footer', type: 'footer' }`

The type auto-detection: if the file name contains "navbar" → type `navbar`,
"footer" → type `footer`, everything else → type `section`.

---

## 10. i18n (Internationalization)

The system supports three locales: `en`, `fa`, `ar`.

- **Base layer** provides default translations in `packages/base/i18n/locales/{en,fa,ar}.json`
- **Theme layer** can provide overrides in the same structure
- The `useI18n()` composable (from `@nuxtjs/i18n`) is auto-imported
- Use `$t('key.path')` in templates and `t('key.path')` in script

---

## 11. SEO Head Tags

Use `useHead()` in layouts and pages:

```typescript
useHead(() => ({
  titleTemplate: (titleChunk?: string) => {
    const defaultTitle = settings.value.seo.defaultTitle
    if (!titleChunk) return defaultTitle
    return settings.value.seo.titleSuffix
      ? `${titleChunk} | ${settings.value.seo.titleSuffix}`
      : titleChunk
  },
  meta: [
    { name: 'description', content: settings.value.seo.defaultDescription },
    // ... more tags from settings.value.seo
  ],
}))
```

---

## 12. Summary: What Google Studio AI Needs to Generate

To build a complete theme, the AI needs to:

1. **Create the folder structure** under `packages/themes/<name>/` as shown in §1
2. **Write `nuxt.config.ts`** extending base + database layer (§2)
3. **Write `layouts/default.vue`** that:
   - Calls `useSiteSettings()` and reads `settings.navbar` / `settings.footer`
   - Renders `<Navbar>` and `<Footer>` with prop bindings from settings
   - Passes `<slot />` for page content
4. **Write `pages/index.vue`** composing desired section components (§6)
5. **Write section components** (`Hero`, `Services`, `About`, `Testimonials`, `Team`, `Blog`, `Contact`, `Navbar`, `Footer`) each fetching their data from the relevant API endpoint (§5)
6. **Write `pages/blog/[slug].vue`** for individual blog posts (optional, base layer provides fallback)
7. **Style everything** with Tailwind CSS + daisyUI classes (no custom CSS required)

The user describes their desired **brand, industry, styling, and visual identity** directly to the AI.
This document provides only the **data contracts and technical structure**.