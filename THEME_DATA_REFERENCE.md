# Nuxiox Theme Data Reference

> A technical reference for AI tools (Google Studio, etc.) to understand the backend data model,
> API contracts, and component conventions of the Nuxiox CMS. **No style, brand, or industry assumptions.**
> Users describe their own visual identity to the AI — this document provides the data contract.

---

## Table of Contents

1. [Theme File Structure](#1-theme-file-structure)
2. [nuxt.config.ts Template](#2-nuxtconfigts-template)
3. [The `useSiteSettings()` Composable](#3-the-usesitesettings-composable)
4. [Database Tables & Public API Endpoints](#4-database-tables--public-api-endpoints)
5. [Section Components — Data Contracts](#5-section-components--data-contracts)
6. [Home Page (index.vue)](#6-home-page-indexvue)
7. [Dynamic CMS Pages ([slug].vue) — CRITICAL](#7-dynamic-cms-pages-slugvue--critical)
8. [Blog Index Page (blog/index.vue)](#8-blog-index-page-blogindexvue)
9. [Blog Single Post Page (blog/[slug].vue)](#9-blog-single-post-page-blogslugvue)
10. [i18n — Internationalization — REQUIRED](#10-i18n--internationalization--required)
11. [SEO Head Tags](#11-seo-head-tags)
12. [Dark/Light Theme System](#12-darklight-theme-system--required)
13. [About Settings — Using the Info Key-Value Store](#13-about-settings--using-the-info-key-value-store)
14. [Modal Store — Global Booking & Image Modals](#14-modal-store--global-booking--image-modals)
15. [Critical Rules the AI Must Follow](#15-critical-rules-the-ai-must-follow)

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
│   │       ├── Hero.vue           # REQUIRED — Section components (see §5 for full list)
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
│   ├── i18n/
│   │   └── locales/
│   │       ├── en.json            # REQUIRED — English translations
│   │       ├── fa.json            # REQUIRED — Persian/Farsi translations
│   │       └── ar.json            # REQUIRED — Arabic translations
│   ├── layouts/
│   │   └── default.vue            # REQUIRED: main layout (renders Navbar + slot + Footer)
│   ├── pages/
│   │   ├── index.vue              # REQUIRED — Home page (choose sections to render)
│   │   ├── [slug].vue             # REQUIRED — CMS dynamic page renderer (see §7)
│   │   └── blog/
│   │       ├── index.vue          # REQUIRED — Blog listing (see §8)
│   │       └── [slug].vue         # REQUIRED — Single blog post (see §9)
│   └── app.config.ts              # Optional: theme-specific app config
├── nuxt.config.ts                 # REQUIRED: Nuxt config
├── app.config.ts                  # Optional: theme metadata config
└── THEME_VARIABLES.md             # REQUIRED — documents expected about.info keys (see §12)
```

### Required files explained

| File | Purpose |
|------|---------|
| `nuxt.config.ts` | Extends base + database layer, includes `@nuxtjs/i18n` module |
| `layouts/default.vue` | Calls `useSiteSettings()`, renders `<Navbar>` + `<slot />` + `<Footer>` with props from settings |
| `pages/index.vue` | Composes section components for the home page |
| `pages/[slug].vue` | Fetches CMS page from API and renders its builder blocks (see §7) |
| `pages/blog/index.vue` | Lists blog posts with pagination/filters (see §8) |
| `pages/blog/[slug].vue` | Single blog post page with comments (see §9) |
| `app/i18n/locales/*.json` | Translation files for every locale |
| `THEME_VARIABLES.md` | Documents which about.info keys the theme expects |
| `components/sections/*.vue` | Sections that render dynamic data from the CMS |

---

## 2. nuxt.config.ts Template

```ts
// packages/themes/<theme-name>/nuxt.config.ts
export default defineNuxtConfig({
  extends: ['../../base', '../../databases/cloudflare'],
  // extends: ['../../base', '../../databases/normal'], // for MySQL

  css: ['~~/packages/themes/<theme-name>/app/assets/theme.css'],

  modules: ['@nuxtjs/i18n'],

  i18n: {
    locales: [
      { code: 'en', file: 'en.json' },
      { code: 'fa', file: 'fa.json' },
      { code: 'ar', file: 'ar.json' }
    ]
  },

  nitro: {
    preset: 'cloudflare-module', // omit for Node/MySQL
  },

  compatibilityDate: '2025-07-15',
})
```

**⚠️ CRITICAL:** The `@nuxtjs/i18n` module MUST be listed in `modules`. Without it, the `$t()` function and `useI18n()` composable will not be available. Include it even if no other modules are needed.

---

## 3. The `useSiteSettings()` Composable

**Import:** auto-imported (no manual import needed — do NOT create a local copy of this composable)

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

**API: `GET /api/blog/posts`** → Paginated result:
```typescript
{
  items: [
    {
      id: number
      title: string
      slug: string
      excerpt: string | null
      featuredImage: string | null
      publishedAt: string | null
      createdAt: string
      categories?: { id: number; name: string; slug: string }[]
    }
  ],
  total: number,
  totalPages: number,
  categories: { id: number; name: string; slug: string; count: number }[]
}
```

Query params: `search`, `category`, `sort` (newest|oldest|title), `page`, `pageSize`

**API: `GET /api/blog/posts/recent`** → Same shape as items array, limited to 5 items.

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
    seo?: Record<string, string>
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

**API: `GET /api/blog/posts`** returns categories array alongside items.

### 4.8 Pages (CMS dynamic pages)

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

### 4.9 Contact Messages (public submission only)

**API: `POST /api/contact-messages`** accepts body:
```typescript
{
  name: string       // required, min 2 chars
  email: string      // required, valid email
  phone?: string     // optional — phone number
  address?: string   // optional — physical address
  subject?: string   // optional, max 200 chars
  message: string    // required, min 5, max 5000 chars
}
```

Admin GET: `GET /api/admin/contact-messages` — returns all messages with phone/address fields.

No public GET — admin-only.

### 4.10 Media

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
    <h2 class="text-3xl font-bold text-center">{{ $t('sections.services.title') }}</h2>
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

**⚠️ CRITICAL: The Footer component MUST render its content from the passed props, NOT from hardcoded data.** Specifically:

- Use `darkLogo` / `lightLogo` props for the footer logo image (with fallback to text brand name)
- Render `menus` prop as footer navigation links
- Render `info` prop items (address, phone, email, etc.) dynamically
- Do NOT hardcode clinic names, descriptions, social links, or any brand-specific content

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

The home page uses **dynamic sections** loaded from the home-builder API.
You do NOT hardcode which sections appear — the admin configures them via the home builder
in the admin panel, and your `index.vue` renders whatever is configured.

```vue
<!-- pages/index.vue -->
<script setup lang="ts">
import type { HomeBuilder } from '~~/packages/base/types/page-builder'
import { defaultHomeBuilder } from '~~/packages/base/utils/page-builder'

// 1. Auto-discover all section components in THIS theme's sections directory
const modules = import.meta.glob('../components/sections/*.vue')
const components: Record<string, Component> = {}

for (const path in modules) {
  const loader = modules[path]
  if (!loader) continue
  const fileName = path.split('/').pop()
  if (!fileName) continue
  const name = fileName.replace('.vue', '')
  components[name] = defineAsyncComponent(() => loader().then((m: any) => m.default))
}

// 2. Fetch the home-builder config from the public API
const { data } = await useFetch<HomeBuilder>('/api/home-builder/public', {
  default: () => structuredClone(defaultHomeBuilder),
})
const builder = computed(() => data.value ?? structuredClone(defaultHomeBuilder))
const layoutOverrides = useLayoutOverrides()

// 3. If the builder includes a Navbar or Footer section, hide the layout's own
watch(
  () => builder.value.sections,
  (sections) => {
    layoutOverrides.value.hideNavbar = sections.some((section) => section.type === 'navbar')
    layoutOverrides.value.hideFooter = sections.some((section) => section.type === 'footer')
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  layoutOverrides.value.hideNavbar = false
  layoutOverrides.value.hideFooter = false
})
</script>

<template>
  <div>
    <component v-for="section in builder.sections" :is="components[section.sectionId]" :key="section.uid" />
  </div>
</template>
```

**Section ID = file name**: The home builder in the admin panel lists available sections
by scanning `packages/themes/<name>/app/components/sections/*.vue`. Each file name
(without `.vue`) becomes its section ID (e.g. `Hero.vue` → section ID `Hero`).

**Section types**: File names containing `navbar` get type `navbar`, names containing
`footer` get type `footer`, everything else is type `section`. This determines whether
the section appears in the layout or the page body.

**IMPORTANT**: Sections that need to show a modal (booking form, image gallery) must
NOT use emits or `provide/inject` — see §14 for the modal store pattern.

---

## 7. Dynamic CMS Pages ([slug].vue) — CRITICAL

**This is the single most important page for the theme.** The base layer provides a default
`[slug].vue` but it has a critical limitation: it uses `import.meta.glob('../components/sections/*.vue')`
which only resolves to the base layer's own sections directory, NOT the theme's sections.

**You MUST create `pages/[slug].vue` in the theme** to properly render CMS pages.

**How it works:**

```vue
<!-- pages/[slug].vue — REQUIRED in the theme -->
<script setup lang="ts">
import type { PageBlock } from '~~/packages/base/types/page-builder'
import { useLayoutOverrides } from '#imports'

// 1. Fetch page data using Nuxt's useFetch (NOT raw fetch())
const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { data, error } = await useFetch<PageRecord>(`/api/pages/public/${slug.value}`)
if (error.value) throw createError({ statusCode: 404, statusMessage: 'Page not found' })

// 2. Parse builder JSON (stored as string in DB)
const page = computed(() => {
  const raw = data.value
  if (!raw) return null
  const parsed = structuredClone(raw) as any
  if (typeof parsed.builder === 'string') {
    try {
      const b = JSON.parse(parsed.builder)
      parsed.builder = typeof b === 'object' && b !== null ? b : { version: 1, blocks: [] }
    } catch {
      parsed.builder = { version: 1, blocks: [] }
    }
  }
  if (typeof parsed.seo === 'string') {
    try {
      const s = JSON.parse(parsed.seo)
      parsed.seo = typeof s === 'object' && s !== null ? s : {}
    } catch {
      parsed.seo = {}
    }
  }
  return parsed
})

// 3. Use useLayoutOverrides to hide navbar/footer when blocks override them
const layoutOverrides = useLayoutOverrides()
const { settings } = useSiteSettings()

watch(
  () => page.value?.builder?.blocks ?? [],
  (blocks) => {
    layoutOverrides.value.hideNavbar = blocks.some((b) => b.type === 'navbar')
    layoutOverrides.value.hideFooter = blocks.some((b) => b.type === 'footer')
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  layoutOverrides.value.hideNavbar = false
  layoutOverrides.value.hideFooter = false
})

// 4. Import theme's own section components dynamically
const modules = import.meta.glob('../components/sections/*.vue')
const components: Record<string, Component> = {}

for (const path in modules) {
  const loader = modules[path]
  if (!loader) continue
  const fileName = path.split('/').pop()
  if (!fileName) continue
  const name = fileName.replace('.vue', '')
  components[name] = defineAsyncComponent(() => loader().then((m: any) => m.default))
}

const sectionComponentName = (block: Extract<PageBlock, { type: 'section' | 'navbar' | 'footer' }>) =>
  components[block.sectionId]

// 5. Set SEO head tags
useHead(() => {
  const seo = (page.value?.seo ?? {}) as Record<string, unknown>
  return {
    title: typeof seo.title === 'string' ? seo.title : page.value?.title || settings.value.seo.defaultTitle,
    // ... meta tags from settings.seo
  }
})
</script>

<template>
  <div v-if="page" class="space-y-8">
    <template v-for="block in page.builder.blocks" :key="block.uid">
      <div v-if="block.type === 'text'" class="prose max-w-none" v-html="block.content" />
      <component v-else :is="sectionComponentName(block)" />
    </template>
  </div>
</template>
```

**⚠️ CRITICAL RULES for [slug].vue:**
1. Use `useFetch()` (Nuxt composable) — do NOT use raw `fetch()` in `onMounted()`
2. Use `useLayoutOverrides()` so the page can hide/show navbar/footer per block
3. Use `import.meta.glob('../components/sections/*.vue')` relative to the theme's own directory
4. Use `useHead()` to set page title and SEO meta from the page's `seo` field
5. Handle JSON parsing with try-catch for `builder` and `seo` fields
6. DO NOT hardcode a component map — use `import.meta.glob` to auto-discover sections

### Builder block types:

```typescript
type PageBlock =
  | { uid: string; type: 'text'; content: string }           // Rich text block
  | { uid: string; type: 'section'; sectionId: string; source: 'sections' }    // Section component
  | { uid: string; type: 'navbar'; sectionId: string; source: 'sections' }     // Navbar override
  | { uid: string; type: 'footer'; sectionId: string; source: 'sections' }     // Footer override
```

The sectionId in a block MUST exactly match a filename in `components/sections/`.
For example, `{ type: 'section', sectionId: 'Services' }` renders `Services.vue`.
A mismatch means the block renders nothing (blank content on that part of the page).

---

## 8. Blog Index Page (blog/index.vue)

**You MUST create `pages/blog/index.vue`** — the base layer does not provide one.
Without it, users cannot browse or search blog posts.

**How it works:**

```vue
<!-- pages/blog/index.vue — REQUIRED -->
<script setup lang="ts">
useHead({ title: $t('blog.pageTitle') || 'Blog' })

const route = useRoute()
const router = useRouter()

const search = ref(String(route.query.search ?? ''))
const category = ref(String(route.query.category ?? ''))
const sort = ref(String(route.query.sort ?? 'newest'))
const page = ref(Number(route.query.page ?? 1))
const pageSize = 6

const query = computed(() => ({
  search: search.value || undefined,
  category: category.value || undefined,
  sort: sort.value,
  page: page.value,
  pageSize,
}))

const { data, refresh, pending } = await useFetch('/api/blog/posts', { query })

const applyFilters = async () => {
  page.value = 1
  await router.replace({ query: { ...query.value, page: 1 } })
  await refresh()
}

const setPage = async (next: number) => {
  if (!data.value || next < 1 || next > data.value.totalPages) return
  page.value = next
  await router.replace({ query: { ...query.value, page: next } })
  await refresh()
}
</script>

<template>
  <section class="space-y-5">
    <h1 class="text-4xl font-bold">{{ $t('blog.pageTitle') }}</h1>

    <!-- Search & Filters -->
    <div class="flex gap-2">
      <input v-model="search" type="text" :placeholder="$t('blog.search')" @keyup.enter="applyFilters" />
      <select v-model="sort" @change="applyFilters">
        <option value="newest">{{ $t('blog.newest') }}</option>
        <option value="oldest">{{ $t('blog.oldest') }}</option>
      </select>
    </div>

    <!-- Loading / Content -->
    <div v-if="pending">{{ $t('blog.loading') }}</div>

    <div v-else class="grid gap-4 md:grid-cols-2">
      <article v-for="post in data?.items || []" :key="post.id">
        <img v-if="post.featuredImage" :src="post.featuredImage" :alt="post.title" />
        <h2>{{ post.title }}</h2>
        <p>{{ post.excerpt }}</p>
        <NuxtLink :to="$localePath(`/blog/${post.slug}`)">{{ $t('blog.readMore') }}</NuxtLink>
      </article>
    </div>

    <!-- Pagination -->
    <div v-if="(data?.totalPages || 0) > 1" class="join">
      <button @click="setPage(page - 1)" :disabled="page <= 1">{{ $t('blog.prev') }}</button>
      <span>{{ page }} / {{ data?.totalPages }}</span>
      <button @click="setPage(page + 1)" :disabled="page >= (data?.totalPages || 1)">{{ $t('blog.next') }}</button>
    </div>
  </section>
</template>
```

**⚠️ CRITICAL:**
- Use `useFetch` (not raw `fetch()`)
- Use `$t()` for all user-facing strings
- Support search, category filter, sort order, and pagination
- Use `NuxtLink` with `$localePath()` for localized links

---

## 9. Blog Single Post Page (blog/[slug].vue)

**Base layer provides this** at `packages/base/app/pages/blog/[slug].vue`, but you may override it
in the theme for custom styling.

Uses `GET /api/blog/posts/:slug` which returns `{ post, comments }`.

### Comment Submission — CRITICAL DETAILS

The comment form posts to `POST /api/blog/posts/:slug/comments` with body:

```typescript
{
  content: string              // required, min 2 chars
  authorName?: string          // optional, min 2 chars if provided
  authorEmail?: string         // optional, must be valid email if provided
  parentId?: number | null     // optional, for threaded replies
  captchaToken?: string        // ONLY send when recaptcha is configured (see below)
}
```

The like button calls `POST /api/blog/comments/:id/like`.

### Comment form pattern (required):

```vue
<script setup lang="ts">
import { useToastStore } from '~~/packages/base/app/stores/toast'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { data, refresh } = await useFetch(() => `/api/blog/posts/${slug.value}`)

// MUST fetch public settings to check if captcha is configured
const { data: publicSettings } = await useFetch('/api/settings/public')

const commentContent = ref('')
const authorName = ref('')
const authorEmail = ref('')
const replyTo = ref<number | null>(null)
const toastStore = useToastStore()

const postComment = async () => {
  if (!commentContent.value.trim() || !authorName.value.trim() || !authorEmail.value.trim()) {
    toastStore.push($t('sections.comments.required'), 'error')
    return
  }
  const response = await $fetch<{ status: 'pending' | 'approved' }>(
    `/api/blog/posts/${slug.value}/comments`,
    {
      method: 'POST',
      body: {
        content: commentContent.value,
        authorName: authorName.value,
        authorEmail: authorEmail.value || undefined,  // ← MUST be undefined when empty, NOT ""
        parentId: replyTo.value,
        // ← captchaToken is ONLY sent when recaptchaSiteKey is configured
        ...(publicSettings?.blog?.recaptchaSiteKey
          ? { captchaToken: 'dev-token' }
          : {}),
      },
    }
  )
  commentContent.value = ''
  await refresh()
  toastStore.push(
    response.status === 'pending'
      ? $t('sections.comments.pending')
      : $t('sections.comments.success'),
    'success'
  )
}

const likeComment = async (id: number) => {
  await $fetch(`/api/blog/comments/${id}/like`, { method: 'POST' })
  await refresh()
}
</script>
```

### ⚠️ Captcha handling — CRITICAL

The server accepts `captchaToken` as an **optional field** in the request body.
Captcha validation only happens when the admin has configured `recaptchaSecretKey`
in the blog settings. Your component MUST:

1. **Fetch `/api/settings/public`** to read `blog.recaptchaSiteKey`
2. **Only send `captchaToken`** when `recaptchaSiteKey` is a non-empty string
3. **Omit `captchaToken` entirely** when `recaptchaSiteKey` is empty (dev/default mode)
4. When captcha IS configured in the future, the frontend would need a Google reCAPTCHA
   widget to generate the token on the client side

### ⚠️ authorEmail — CRITICAL

The schema validates `authorEmail: z.string().email().optional()`. An **empty string `""`**
will fail `.email()` validation because `""` is not a valid email address.
The `optional()` modifier only accepts `undefined`, not `""`.

**Always send `authorEmail` as:**
```typescript
authorEmail: emailField.value || undefined
```

### ⚠️ CRITICAL:
- Use `useFetch()` (not raw `fetch()`) for data fetching
- Use `$fetch()` (not raw `fetch()`) for POST requests
- Use `$t()` for all visible strings
- Use `useHead()` to set SEO meta from `data.post.seo` or `data.post.title`
- Fetch public settings to check captcha configuration before submitting comments
- Send `authorEmail` as `undefined` when empty, never as `""`
- Only include `captchaToken` when `recaptchaSiteKey` is configured

---

## 10. i18n — Internationalization — REQUIRED

Every theme MUST provide translation files for all three locales under `app/i18n/locales/` (or `i18n/locales/` at the theme root).

### What you MUST do:

1. **Create `app/i18n/locales/en.json`** — English translations for all user-facing text
2. **Create `app/i18n/locales/fa.json`** — Persian/Farsi translations
3. **Create `app/i18n/locales/ar.json`** — Arabic translations
4. **Use `$t('key.path')` in templates** for every visible string
5. **Use `t('key.path')` in `<script setup>`** when you need translation in JavaScript
6. **Add `@nuxtjs/i18n` to modules** in `nuxt.config.ts`
7. **Add i18n configuration** to `nuxt.config.ts` (see §2)

### Translation file example:

```json
// app/i18n/locales/en.json
{
  "nav": {
    "home": "Home",
    "services": "Services",
    "about": "About Us",
    "contact": "Contact",
    "blog": "Blog"
  },
  "hero": {
    "title": "Welcome",
    "subtitle": "Your subtitle here",
    "cta": "Get Started"
  },
  "sections": {
    "services": {
      "title": "Our Services"
    },
    "about": {
      "title": "About Us",
      "description": "Learn more about us"
    },
    "testimonials": {
      "title": "What Our Clients Say"
    },
    "team": {
      "title": "Our Team"
    },
    "blog": {
      "title": "Latest Articles"
    },
    "contact": {
      "title": "Get In Touch",
      "name": "Name",
      "email": "Email",
      "message": "Message",
      "submit": "Send Message",
      "success": "Message sent successfully!"
    },
    "comments": {
      "required": "Please fill in all required fields",
      "submit": "Submit Comment"
    }
  },
  "footer": {
    "copyright": "All rights reserved."
  },
  "blog": {
    "pageTitle": "Blog",
    "search": "Search posts...",
    "readMore": "Read more",
    "newest": "Newest",
    "oldest": "Oldest",
    "prev": "Previous",
    "next": "Next",
    "loading": "Loading..."
  },
  "common": {
    "bookAppointment": "Book Appointment",
    "learnMore": "Learn More"
  }
}
```

### Usage in templates:

```vue
<template>
  <h2>{{ $t('sections.services.title') }}</h2>
  <button>{{ $t('sections.contact.submit') }}</button>
  <p>{{ $t('footer.copyright', { year: new Date().getFullYear() }) }}</p>
</template>
```

### Usage in script:

```vue
<script setup lang="ts">
const { t, locale, setLocale, availableLocales } = useI18n()
const pageTitle = computed(() => t('blog.pageTitle'))
</script>
```

**⚠️ CRITICAL: Do NOT hardcode any user-facing string in English.** Every visible text
must go through `$t()` or `t()`. The only exceptions are pure data values from the API
(e.g. service titles from the database are already localized).

### data-i18n Attribute — REQUIRED for every `$t()` call

**Every element that uses `$t('key.path')` in its template MUST have a `data-i18n="key.path"` attribute.**

This enables the admin inline edit mode (see §15):

```vue
<!-- CORRECT: -->
<h2 data-i18n="sections.services.title" class="text-3xl font-bold">
  {{ $t('sections.services.title') }}
</h2>

<!-- WRONG — missing data-i18n: -->
<h2 class="text-3xl font-bold">
  {{ $t('sections.services.title') }}
</h2>
```

The `data-i18n` value MUST match the exact key passed to `$t()`.

### Dynamic i18n Override System

The CMS supports **runtime translation overrides** stored in the database. This allows admins to edit any translation from the admin panel without rebuilding the site.

**How it works:**
1. Default translations are bundled in the JSON files (unchanged)
2. Overrides are stored in the `settings` table (key: `i18n_overrides`)
3. A Nuxt plugin (`i18n-overrides`) fetches overrides and merges them via `nuxt.$i18n.mergeLocaleMessage()`
4. The merge happens on both SSR and client — so SSR HTML includes overrides

**Admin features:**
- **Bulk editor** at `/admin/i18n` — shows all keys per locale, allows editing
- **Inline edit mode** on public pages — click the admin toolbar's "Edit" button, then click any text with `data-i18n` to edit it in-place

> **The `convert-theme.ts` script automatically adds `data-i18n` attributes** to every element that uses `$t('key')` in the template. You only need to ensure your component uses `$t()` for user-facing text.

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

## 12. Dark/Light Theme System — REQUIRED

The theme MUST support both light and dark color schemes using a user-toggleable switch.
The system uses the daisyUI `data-theme` attribute on the `<html>` element to switch modes.

### How it works:

1. **Theme colors come from `settings.theme`** — the admin configures light and dark palettes
   in the admin panel. Each palette has four daisyUI color tokens: `primary`, `secondary`,
   `accent`, `neutral`.

2. **A theme toggle button** switches between light/dark by setting `data-theme` on `<html>`.
   The toggle must persist the user's preference (typically via `localStorage`).

3. **On page load**, check `localStorage` for the saved preference. If none exists, respect
   the user's OS-level `prefers-color-scheme` media query.

### Settings.theme type:

```typescript
type ThemeSettings = {
  preset: string       // e.g. 'light' — the active preset
  light: {
    primary: string    // daisyUI primary color
    secondary: string  // daisyUI secondary color
    accent: string     // daisyUI accent color
    neutral: string    // daisyUI neutral color
  }
  dark: {
    primary: string
    secondary: string
    accent: string
    neutral: string
  }
}
```

Access via `useSiteSettings()`:
```typescript
const { settings } = useSiteSettings()
const themeColors = computed(() => settings.value.theme)
```

### Implementing the toggle (example — place in Navbar.vue or layout):

```vue
<script setup lang="ts">
const isDark = ref(false)

// On mount, restore saved preference or respect OS
onMounted(() => {
  const saved = localStorage.getItem('theme-preference')
  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true
    document.documentElement.setAttribute('data-theme', 'dark')
  }
})

const toggleTheme = () => {
  isDark.value = !isDark.value
  const theme = isDark.value ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('theme-preference', theme)
}
</script>

<template>
  <button @click="toggleTheme" :title="isDark ? $t('common.lightMode') : $t('common.darkMode')">
    {{ isDark ? '☀️' : '🌙' }}
  </button>
</template>
```

### Tailwind dark mode support:

The project uses Tailwind CSS v4. The `dark:` variant works automatically when
`data-theme` is set on the `<html>` element — no extra Tailwind config needed.
Use `dark:` prefix for dark-mode-specific styles:

```vue
<div class="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
```

### Theme toggle placement:

The theme toggle button should be placed in one of:
- The **Navbar.vue** component (most common — shown in the top navigation bar)
- The **layouts/default.vue** (if you want it outside the nav component)

### ⚠️ CRITICAL Rules:

1. **Do NOT hardcode theme colors** — use `settings.theme.light` and `settings.theme.dark`
   values. The admin customizes these through the admin panel.
2. **Do NOT forget `prefers-color-scheme`** — respect the OS-level dark mode preference
   on first visit. Only override with the saved user choice.
3. **Do NOT skip `localStorage` persistence** — the user's dark/light preference must survive
   page reloads.
4. **Do NOT use CSS-only dark mode** (`@media prefers-color-scheme`) without the toggle.
   The toggle is a required UI element the user can click.

---

## 13. About Settings — Using the Info Key-Value Store

The `settings.about.info` array is a **flexible key-value store** designed for theme-specific
data. You can use it to store any information your theme needs: contact details, business
hours, social links, statistics, or any custom data.

### ⚠️ IMPORTANT: Settings may not exist — always provide fallbacks

The admin may not have configured the about.info keys yet, or some keys may be missing.
**Every component that reads from info arrays MUST provide a fallback default value**
for every key it reads. Never assume a key exists.

### How to use it in components:

```vue
<script setup lang="ts">
const { settings } = useSiteSettings()

// Helper: find a value by key (case-insensitive), returns fallback if missing
const getInfoValue = (keyName: string, fallback = '') => {
  // Search all three info arrays (about, footer, navbar) in order
  const allInfo = [
    ...(settings.value.about?.info ?? []),
    ...(settings.value.footer?.info ?? []),
    ...(settings.value.navbar?.info ?? []),
  ]
  const match = allInfo.find(
    i => i.key.toLowerCase() === keyName.toLowerCase()
  )
  return match ? match.value : fallback
}

// Always provide meaningful fallback defaults
const phone = computed(() => getInfoValue('phone', '+1 (555) 123-4567'))
const address = computed(() => getInfoValue('address', '123 Main Street'))
const email = computed(() => getInfoValue('email', 'info@example.com'))
const hours = computed(() => getInfoValue('hours', 'Mon-Fri 9AM-5PM'))
const emergencyPhone = computed(() => getInfoValue('emergency_phone', getInfoValue('phone', '+1 (555) 999-9999')))
</script>
```

**The fallback values are CRITICAL.** They ensure the theme renders complete content
even before the admin has configured anything in the CMS. The fallback text should be
a realistic example that looks good in preview/demo mode.

### Search order across all info arrays

When looking for a value, search all three info arrays in this order:
1. `about.info` — best for: stats, social links, extra data
2. `footer.info` — best for: address, email, phone
3. `navbar.info` — best for: emergency contact, hours

Use the helper above which searches all three arrays. This lets the admin place
data in whichever tab makes sense and the component still finds it.

### THEME_VARIABLES.md — Documenting Expected Keys

**You MUST create a `THEME_VARIABLES.md` file in the theme folder** to document which
keys your theme reads from `about.info`, `navbar.info`, and `footer.info`. This file
serves as documentation for the admin who needs to configure the settings.

```markdown
# Theme Variables — <Theme Name>

This theme reads the following keys from the CMS settings.
Add these as key-value pairs in the admin settings panel.

## about.info (About tab in admin settings)

| Key | Purpose | Example Value |
|-----|---------|---------------|
| `phone` | Primary phone number | `+1 (555) 123-4567` |
| `email` | Contact email | `info@example.com` |
| `address` | Physical address | `123 Main St, City, State` |
| `hours` | Business hours | `Mon-Fri: 9AM-5PM` |
| `emergency_phone` | After-hours number | `+1 (555) 999-9999` |
| `facebook` | Facebook page URL | `https://facebook.com/clinic` |
| `instagram` | Instagram handle | `@clinic` |

## navbar.info (displayed in top bar / header)

| Key | Purpose | Example Value |
|-----|---------|---------------|
| `phone` | Header phone | `+1 (555) 123-4567` |
| `hours` | Header hours | `Mon-Sat: 8AM-7PM` |

## footer.info (displayed in footer)

| Key | Purpose | Example Value |
|-----|---------|---------------|
| `address` | Footer address | `123 Main St` |
| `email` | Footer email | `info@example.com` |
| `phone` | Footer phone | `+1 (555) 123-4567` |

## Default Settings

When a key is not configured, the component should display a sensible fallback
(default text) rather than showing nothing or breaking the page.
```

### Fallback strategy summary:

| Scenario | What the component does |
|----------|------------------------|
| Key exists in settings | Uses the value from settings |
| Key does NOT exist in settings | Uses the fallback default passed to `getInfoValue()` |
| The entire settings object is null/undefined | Uses all fallback defaults |
| The info array is empty | Uses all fallback defaults |

### Where the data comes from:

- **`navbar.info`** — Best for: emergency contact, hours (shown in top bar)
- **`footer.info`** — Best for: address, email, phone (traditional footer contact)
- **`about.info`** — Best for: statistics, social links, extra info displayed in About section

**⚠️ CRITICAL:** All three info arrays (`navbar.info`, `footer.info`, `about.info`) are
`{ key: string; value: string }[]`. Use the helper function to find values by key name
across all three sources. **Always provide fallback/default values** so the theme renders
correctly even when settings have not been configured yet. A missing key must NEVER
cause a blank UI, a console error, or a broken layout.

---

## 14. Modal Store — Global Booking & Image Modals

Since home page sections are loaded dynamically (see §6), sections cannot use
`defineEmits` or `provide`/`inject` to open modals. Instead, the base layer provides
a **Pinia store** that any section can import directly.

### The store (`packages/base/app/stores/modal.ts`)

```typescript
import { defineStore } from 'pinia'

export const useModalStore = defineStore('modal', () => {
  const isBookingOpen = ref(false)
  const selectedImage = ref<string | null>(null)

  function openBooking() {
    isBookingOpen.value = true
  }
  function closeBooking() {
    isBookingOpen.value = false
  }
  function openImage(url: string) {
    selectedImage.value = url
  }
  function closeImage() {
    selectedImage.value = null
  }

  return { isBookingOpen, selectedImage, openBooking, closeBooking, openImage, closeImage }
})
```

### What the layout must do

The modal **components** render in `layouts/default.vue` — NOT in individual sections.

```vue
<!-- layouts/default.vue (partial) -->
<script setup lang="ts">
import { useModalStore } from '~~/packages/base/app/stores/modal'
import BookingModal from '../components/ui/BookingModal.vue'   // optional booking form
import ImageModal from '../components/ui/ImageModal.vue'       // optional image lightbox

const modalStore = useModalStore()
</script>

<template>
  <div>
    <!-- Navbar, main <slot />, Footer ... -->

    <BookingModal :is-open="modalStore.isBookingOpen" @close="modalStore.closeBooking()" />
    <ImageModal :image-url="modalStore.selectedImage" @close="modalStore.closeImage()" />
  </div>
</template>
```

### How sections use the store

Any section that needs to open the booking modal or image modal imports the store
and calls its actions directly — no emits, no provide/inject.

```vue
<script setup lang="ts">
import { useModalStore } from '~~/packages/base/app/stores/modal'
const modalStore = useModalStore()
</script>

<template>
  <button @click="modalStore.openBooking()">Book Now</button>
  <div @click="modalStore.openImage(imageUrl)"><img :src="imageUrl" /></div>
</template>
```

### Modal components

The booking and image modal components are **theme-specific** — each theme creates
them under `app/components/ui/`. They receive `isOpen`/`imageUrl` as props and emit
`close`. The store manages visibility state; the modal component just renders.

**BookingModal.vue** — Receives `isOpen: boolean`, emits `close`. Shows a booking form.
**ImageModal.vue** — Receives `imageUrl: string | null`, emits `close`. Full-screen lightbox.

If your theme doesn't need a booking form or image gallery,
you can omit these components entirely.

### Important for AI theme generation

1. ✅ **Do create** `app/components/ui/BookingModal.vue` and `app/components/ui/ImageModal.vue`
   if your theme has a booking flow or image gallery.
2. ✅ **Do import** `useModalStore` from `~~/packages/base/app/stores/modal` (it's auto-registered).
3. ✅ **Do render** `<BookingModal>` and `<ImageModal>` in `layouts/default.vue`.
4. ❌ **Do NOT use** `defineEmits(['openBooking'])` or `defineEmits(['openImage'])` in sections.
5. ❌ **Do NOT use** `provide`/`inject` for modals — sections are loaded dynamically,
   so the provide chain breaks.

---

## 15. Critical Rules the AI Must Follow

### DO NOT:

1. ❌ **Do NOT hardcode brand content** — No clinic names, descriptions, logos, or slogans
   hardcoded in components. All such content must come from settings or i18n.

2. ❌ **Do NOT create a local `useSiteSettings` composable** — The base layer provides
   an auto-imported version. Your local copy will create a separate data source and
   break SSR. Use the auto-imported one.

3. ❌ **Do NOT use raw `fetch()` in components** — Use `useFetch()` or `$fetch()` (Nuxt
   composables). Raw `fetch()` in `onMounted()` breaks SSR and skips caching.

4. ❌ **Do NOT skip i18n** — Every theme MUST have `app/i18n/locales/{en,fa,ar}.json`
   and use `$t()` everywhere. No hardcoded text.

5. ❌ **Do NOT skip `blog/index.vue`** — Blog needs a listing page in addition to the
   single post page. Without it, users cannot browse posts.

6. ❌ **Do NOT hardcode Footer content** — The Footer component MUST render its content
   from props (`menus`, `darkLogo`, `lightLogo`, `info`). No hardcoded links, names,
   or descriptions. The `darkLogo`/`lightLogo` props should be used for the footer logo
   image rather than hardcoding SVG icons or text.

7. ❌ **Do NOT create a static component map in [slug].vue** — Use `import.meta.glob()`
   to auto-discover section components. A hardcoded map breaks when sections are added
   or renamed.

8. ❌ **Do NOT forget `useLayoutOverrides`** — The [slug].vue must use
   `useLayoutOverrides()` so page builder blocks can override navbar/footer visibility.

9. ❌ **Do NOT skip `useHead()` in [slug].vue** — Dynamic CMS pages need SEO meta tags
   from the page's seo data.

10. ❌ **Do NOT forget to handle JSON parsing with try-catch** — The `builder` and `seo`
    fields in the API response may be stored as JSON strings. Always parse with try-catch.

11. ❌ **Do NOT use snake_case to access aliased Drizzle select columns** — When you write
    `.select({ allowComments: blogPosts.allow_comments })`, the result object uses the alias
    `allowComments`, NOT `allow_comments`. Accessing `post.allow_comments` returns `undefined`
    and `!undefined` is `true`, silently breaking your logic. Always use the alias name:
    `post.allowComments`.

### DO:

1. ✅ **Use `useFetch()` for data fetching** — Works with SSR, caching, and error handling.
2. ✅ **Use `$t('key')` for all visible strings** — In templates, every text goes through i18n.
3. ✅ **Create i18n files for all 3 locales** (`en`, `fa`, `ar`).
4. ✅ **Create `pages/blog/index.vue`** — Blog listing page with search, filter, pagination.
5. ✅ **Pass all footer/navbar data via props** from `layouts/default.vue`.
6. ✅ **Read from settings dynamically** — Use `getInfoValue()` helper to find keys.
7. ✅ **Provide fallback values** — Every dynamic value should have a sensible default.
8. ✅ **Use `import.meta.glob` in [slug].vue** — Auto-discover theme sections.
9. ✅ **Handle JSON parsing with try-catch** — Both `builder` and `seo` can be strings or objects.
10. ✅ **Create `THEME_VARIABLES.md`** — Document which about.info keys your theme uses.
11. ✅ **Use `useLayoutOverrides()`** — Let page builder blocks control navbar/footer visibility.
12. ✅ **Use `useHead()` for SEO** — Set title and meta from settings or page data.

---

## Summary: What Google Studio AI Needs to Generate

To build a complete theme, the AI needs to:

1. **Create the folder structure** under `packages/themes/<name>/` as shown in §1
2. **Write `nuxt.config.ts`** extending base + database layer, with `@nuxtjs/i18n` module (§2)
3. **Create i18n locale files** at `app/i18n/locales/{en,fa,ar}.json` (§10)
4. **Use `$t()` everywhere** — no hardcoded text
5. **Write `layouts/default.vue`** that:
   - Calls `useSiteSettings()` (auto-imported)
   - Renders `<Navbar>` and `<Footer>` with prop bindings from settings (§3, §5)
6. **Write `pages/index.vue`** using `import.meta.glob`, `/api/home-builder/public`, and `useLayoutOverrides()` for dynamic sections (§6)
7. **Write `pages/[slug].vue`** using `useFetch()`, `import.meta.glob`, `useLayoutOverrides()`, and `useHead()` (§7)
8. **Write `pages/blog/index.vue`** with search, filters, pagination, and `$t()` (§8)
9. **Write `pages/blog/[slug].vue`** for individual blog posts with comments (§9)
10. **Implement dark/light theme toggle** in Navbar or layout, using `settings.theme`, `localStorage` persistence, and `prefers-color-scheme` detection (§12)
11. **Write section components** — each fetches its data from the relevant API endpoint and uses `$t()` for labels (§5)
12. **Ensure Footer uses ALL its props** (`menus`, `darkLogo`, `lightLogo`, `info`) — no hardcoded content
13. **Write `getInfoValue(key, fallback)` helper** to read from about/navbar/footer info arrays with fallback defaults (§13)
14. **Render modals in `layouts/default.vue`** using `useModalStore()` from `~~/packages/base/app/stores/modal` — sections call `modalStore.openBooking()` / `modalStore.openImage(url)` directly (§14)
15. **Write `THEME_VARIABLES.md`** documenting expected keys in `about.info` etc. (§13)

The user describes their desired **brand, industry, styling, and visual identity** directly to the AI.
This document provides only the **data contracts and technical structure**.