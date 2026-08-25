# Nuxiox Theme Spec — For Google Studio AI

> **What this is**: A minimal spec for generating theme sections and i18n files.
> You only write Vue SFCs + JSON. No Nuxt config, no layouts, no pages — those are generated automatically.
>
> **Your output**: A folder with `components/sections/` + `i18n/locales/` + optional `components/ui/` + `assets/`.

---

## 1. File Structure to Create

```
<your-theme-name>/
├── components/
│   ├── sections/
│   │   ├── Hero.vue        # REQUIRED — hero banner
│   │   ├── About.vue       # recommended — about section
│   │   ├── Services.vue    # recommended — services grid
│   │   ├── Blog.vue        # recommended — blog preview
│   │   ├── Testimonials.vue # optional — client reviews
│   │   ├── Team.vue        # optional — team/colleagues
│   │   ├── Contact.vue     # recommended — contact form
│   │   ├── Footer.vue      # REQUIRED — page footer
│   │   ├── Navbar.vue      # REQUIRED — navigation bar
│   │   ├── Whyus.vue       # optional — why choose us
│   │   ├── Results.vue     # optional — stats/achievements
│   │   ├── Technology.vue  # optional — tech stack
│   │   └── ...             # add any other sections you need
│   └── ui/
│       ├── BookingModal.vue # optional — booking form modal
│       └── ImageModal.vue   # optional — image lightbox
├── i18n/
│   └── locales/
│       ├── en.json          # REQUIRED — English translations
│       ├── fa.json          # REQUIRED — Persian translations
│       └── ar.json          # REQUIRED — Arabic translations
└── assets/
    └── theme.css            # optional — global theme CSS
```

### File naming → section types

The file name (without `.vue`) becomes the **section ID**:
- `Hero.vue` → section ID `Hero` → type `section`
- `Navbar.vue` → section ID `Navbar` → type `navbar`
- `Footer.vue` → section ID `Footer` → type `footer`

File names containing `navbar` get type `navbar`, names containing `footer` get type `footer`, everything else is type `section`. This is how the admin panel knows what's a layout section vs a content section.

---

## 2. Section Component Contract

Each section is a standard Vue 3 SFC with `<script setup>`. No special props are required.

### Data fetching

Sections fetch their own data from the Nuxiox API. Use standard `fetch()` or Vue's `onMounted`:

```vue
<script setup>
import { ref, onMounted } from 'vue'

const items = ref([])

async function fetchData() {
  try {
    const res = await fetch('/api/services/public')
    items.value = await res.json()
  } catch (e) {
    items.value = []
  }
}

onMounted(() => fetchData())
</script>
```

### Available API endpoints

| Endpoint | Returns | Description |
|----------|---------|-------------|
| `GET /api/services/public` | `Service[]` | Services list |
| `GET /api/colleagues/public` | `Colleague[]` | Team/colleagues |
| `GET /api/testimonials/public` | `Testimonial[]` | Client testimonials |
| `GET /api/blog/posts/recent` | `Post[]` | Recent blog posts |
| `GET /api/settings/public` | `SiteSettings` | Site-wide settings |

### i18n / translations

ALL visible text MUST use the `$t('key')` helper available in templates:

```vue
<h1>{{ $t('hero.title') }}</h1>
<p>{{ $t('about.description') }}</p>
<button>{{ $t('nav.bookAppointment') }}</button>
```

Never hardcode English or any language text in the template.

### Edit-mode attributes (admin inline editing)

Every element can be made editable by the admin via one of these attributes (the converter adds them automatically):

| Attribute | Edits | Badge color | Example |
|-----------|-------|-------------|---------|
| `data-i18n="key"` | Text content (via $t('key') override) | Blue | `<span data-i18n="hero.title">{{ $t('hero.title') }}</span>` |
| `data-nuxiox-img="key"` | Image src | Purple | `<img src="..." data-nuxiox-img="hero_photo">` |
| `data-nuxiox-link="key"` | Anchor href | Green | `<a href="https://..." data-nuxiox-link="social_instagram">Instagram</a>` |

The converter automatically injects `data-i18n` to elements using `$t()`, `data-nuxiox-img` to static `<img>` tags, and `data-nuxiox-link` to static `<a>` tags. You don't need to write these by hand.

### RTL / LTR Direction

The theme must support both RTL (Persian, Arabic) and LTR (English) locales. The layout sets `dir` on `<html>` automatically. The converter will auto-fix `text-right`/`text-left` and horizontal margins (`ml-*`/`mr-*`) to use direction-aware Tailwind variants. Just write your design normally — the converter handles the flipping.

### Arrow icons

Directional icons like `fa-arrow-left` should flip in RTL mode. The converter injects CSS for this automatically.

### Modals (Booking & Image Gallery)

If your theme has a booking flow or an image gallery, you must:

1. **Create modal components** in `components/ui/`:
   - `BookingModal.vue` — props: `isOpen: boolean`, emits: `close`
   - `ImageModal.vue` — props: `imageUrl: string | null`, emits: `close`

2. **Sections that need to open modals** import the Pinia store from the base layer
   and call its actions directly:

```vue
<script setup>
import { useModalStore } from '~~/packages/base/app/stores/modal'

const modalStore = useModalStore()
</script>

<template>
  <button @click="modalStore.openBooking()">Book Now</button>
  <div @click="modalStore.openImage(imageUrl)"><img :src="imageUrl" /></div>
</template>
```

> **IMPORTANT**: Use `~~/packages/base/app/stores/modal` — NOT a relative path like `../../stores/modal`.
> The `~~/` prefix resolves to the project root in Nuxt. A relative path will break
> because the store lives in the base layer, not in your theme.

> **Do NOT use `defineEmits` or `provide/inject` for modals.** Sections are loaded dynamically, so the emit chain breaks. Always use the Pinia store.

### Important: `@` in i18n values

The vue-i18n module treats `@` as a linked-message marker (e.g., `@:key` references another key).
If any of your i18n values contain an email address or any text with `@`,
vue-i18n will throw an "Invalid linked format" error.

**Do NOT use `@` in i18n string values.** If you need to show an email address, either:
- Split the email into parts in the i18n key (e.g., `"contact.email": "info"` + display the domain in the template)
- Or use `[at]` as a placeholder for `@` (the converter script will leave `[at]` as-is, so `"info[at]example.com"` renders as that literal string)

### Navigation links

For internal links (to blog, posts, pages), use `<a>` tags with the locale prefix:

```html
<a :href="`/${locale}/blog/${post.slug}`">Read more</a>
```

Where `locale` is the current locale. Or use a simple `<NuxtLink>` — the conversion script will fix the locale prefixing.

### Navbar and Footer

Navbar and Footer receive their data via props from the layout (NOT self-fetching). Define the props and use them in the template:

```vue
<script setup>
defineProps<{
  menus?: { label: string; href: string }[]
  darkLogo?: string
  lightLogo?: string
  info?: { key: string; value: string }[]
}>()
</script>

<template>
  <nav>
    <a v-for="item in menus" :key="item.href" :href="item.href">{{ item.label }}</a>
  </nav>
</template>
```

The converter will automatically add locale-prefixing to menu links, fix RTL alignment, and validate that props are used.

---

## 3. i18n Key Structure

Create `en.json`, `fa.json`, `ar.json` with the following key structure.
**Every section must have matching i18n keys.** The keys are hierarchical:

```json
{
  "site": {
    "name": "Theme Name",
    "englishName": "(ENGLISH NAME)",
    "copyright": "© 2026 All rights reserved.",
    "language": "Language"
  },
  "nav": {
    "home": "Home",
    "about": "About Us",
    "services": "Services",
    "pricing": "Pricing",
    "blog": "Blog",
    "contact": "Contact",
    "bookAppointment": "Book Now"
  },
  "hero": {
    "title": "Main heading",
    "subtitle": "Sub heading",
    "bookBtn": "Book Appointment",
    "instagram": "Instagram",
    "facebook": "Facebook"
  },
  "about": {
    "title": "About Us",
    "description": "Description text",
    "exploreBtn": "Explore More"
  },
  "services": {
    "title": "Our Services",
    "subtitle": "What we offer"
  },
  "blog": {
    "title": "Our Blog",
    "subtitle": "Latest articles",
    "readMore": "Read More",
    "searchPlaceholder": "Search articles...",
    "allCategories": "All Categories",
    "comments": "Comments",
    "leaveComment": "Leave a Comment",
    "yourComment": "Your comment...",
    "yourName": "Your Name",
    "postComment": "Submit Comment",
    "notFound": "No articles found."
  },
  "contact": {
    "title": "Contact Us",
    "subtitle": "Get in touch",
    "addressTitle": "Address",
    "phoneTitle": "Phone",
    "formTitle": "Send a Message",
    "fullName": "Full Name",
    "messageLabel": "Message",
    "submitBtn": "Send"
  },
  "testimonials": {
    "title": "Testimonials"
  },
  "cms": {
    "notFound": "Page not found."
  }
}
```

Feel free to add more keys as needed for your theme. The only rule: **all visible text must use `$t('key')`**.

---

## 4. Data Types

### Service
```typescript
interface Service {
  id: number
  title: string
  description?: string
  icon?: string
  order: number
}
```

### Colleague
```typescript
interface Colleague {
  id: number
  name: string
  role?: string
  bio?: string
  image?: string
  order: number
}
```

### Testimonial
```typescript
interface Testimonial {
  id: number
  name: string
  content: string
  rating?: number
  image?: string
  order: number
}
```

### Blog Post

```typescript
interface Post {
  id: number
  title: string
  slug: string
  excerpt?: string
  content?: string
  featuredImage?: string
  createdAt: string
}
```

**Blog API response** (`GET /api/blog/posts`): Returns `{ items: Post[], categories: [...] }` — the converter-generated blog pages handle this automatically. If you write a custom blog page, use `data.items` and `data.categories` from the response.

### Video Transitions

If your Hero section uses multiple background videos that switch on `@ended`, the converter will add the CSS transition classes to prevent flicker. Just use `classList.replace('opacity-0', 'opacity-100')` in your JS.

### SiteSettings (from `/api/settings/public`)

> **Note**: Settings are per-locale. The endpoint returns the data for the current locale automatically (`?locale=` query param overrides it), so `useSiteSettings()` always gives you the right language's values.

```typescript
interface SiteSettings {
  general: {
    showSidebar: boolean
    direction: 'ltr' | 'rtl'
    language: 'en' | 'fa' | 'ar'
  }
  navbar: {
    menus: { label: string; href: string }[]
    darkLogo: string
    lightLogo: string
    info: { key: string; value: string }[]
  }
  footer: {
    menus: { label: string; href: string }[]
    darkLogo: string
    lightLogo: string
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
    // Locale-specific fields (siteName, titles, description, og image)
    siteName: string
    defaultTitle: string
    titleSuffix: string
    defaultDescription: string
    defaultOgImage: string
    // Site-wide fields (shared across all locales)
    siteUrl: string
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

## 5. What the Conversion Script Does

The Nuxiox conversion script takes your output folder and automatically:

1. **Copies** your SFCs → `packages/themes/<name>/app/components/sections/`
2. **Copies** your i18n JSON → `app/i18n/locales/` (and **escapes `@` characters** in values to prevent vue-i18n linked-message errors)
3. **Copies** your UI components → `app/components/ui/`
4. **Copies** your CSS → `app/assets/`
5. **Generates** `nuxt.config.ts`, `app.config.ts`, `layouts/default.vue`, `pages/index.vue`, `pages/[slug].vue`, `pages/blog/index.vue`, `pages/blog/[slug].vue`
6. **Only adds modal components** (`BookingModal`, `ImageModal`) to the layout if your theme actually provides them
7. **Validates** that all i18n locale files have the same keys (warns about missing/extra keys across locales)
8. **Fixes** Nuxt compatibility (auto-imports, locale paths, `$t()` calls)
9. **Validates** Navbar/Footer props: warns if `menus`, `darkLogo`, `lightLogo`, or `info` props are defined but not used in the template
10. **Fixes direction**: converts `text-right` → `ltr:text-left rtl:text-right` and horizontal margins (`ml-*`/`mr-*`) → direction-aware variants in all section components
11. **Adds RTL CSS**: injects arrow-icon flip CSS into `theme.css` so `fa-arrow-left`/`fa-arrow-right` etc. flip in RTL mode
12. **Runs** `pnpm run build` to verify the theme compiles

**You do NOT need to create any Nuxt-specific files.** Just the SFCs, i18n JSON, and optional UI components.

---

## 6. Summary: What to Generate

| What | Required? | Details |
|------|-----------|---------|
| `components/sections/Hero.vue` | ✅ | Hero banner |
| `components/sections/Navbar.vue` | ✅ | Nav bar |
| `components/sections/Footer.vue` | ✅ | Footer |
| Other section components | Usually | Include whatever your theme needs |
| `components/ui/BookingModal.vue` | Optional | Booking form modal |
| `components/ui/ImageModal.vue` | Optional | Image lightbox |
| `i18n/locales/en.json` | ✅ | English translations |
| `i18n/locales/fa.json` | ✅ | Persian translations |
| `i18n/locales/ar.json` | ✅ | Arabic translations |
| `assets/theme.css` | Optional | Global CSS |

**One rule above all**: All visible text uses `$t('key')` — never hardcode a language string.