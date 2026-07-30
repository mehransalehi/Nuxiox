import { sqliteTable, integer, text, index, primaryKey, uniqueIndex } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'
import { defineTable } from '../utils/schema-types'

const layer = { source: '../../../../base/server/database/definitions', name: 'base' }

export const users = defineTable({
  name: "users",
  priority: 10,
  layer,
  table: sqliteTable(
    "users",
    {
    id: integer("id").primaryKey({ autoIncrement: true }),
    username: text("username").unique().notNull(),
    email: text("email").unique().notNull(),
    password_hash: text("password_hash"),
    token: text("token"),
    role: text("role").notNull().$type<"admin" | "user">().default("user"),
    created_at: integer("created_at", { mode: 'timestamp_ms' }).notNull().default(sql`(CURRENT_TIMESTAMP)`),
    updated_at: integer("updated_at", { mode: 'timestamp_ms' }).notNull().default(sql`(CURRENT_TIMESTAMP)`),
    },
  ),
})

export const settings = defineTable({
  name: "settings",
  priority: 10,
  layer,
  table: sqliteTable(
    "settings",
    {
    key: text("key").primaryKey(),
    value: text("value", { mode: 'json' }).notNull(),
    description: text("description"),
    is_public: integer("is_public", { mode: 'boolean' }).notNull().default(true),
    created_at: integer("created_at", { mode: 'timestamp_ms' }).notNull().default(sql`CURRENT_TIMESTAMP`),
    updated_at: integer("updated_at", { mode: 'timestamp_ms' }).notNull().default(sql`CURRENT_TIMESTAMP`),
    },
    (table) => ({
      settings_is_public_idx: index("settings_is_public_idx").on(table.is_public),
    })
  ),
})

export const pages = defineTable({
  name: "pages",
  priority: 10,
  layer,
  table: sqliteTable(
    "pages",
    {
    id: integer("id").primaryKey({ autoIncrement: true }),
    status: text("status").notNull().$type<"draft" | "published">().default("draft"),
    created_at: integer("created_at", { mode: 'timestamp_ms' }).notNull().default(sql`CURRENT_TIMESTAMP`),
    updated_at: integer("updated_at", { mode: 'timestamp_ms' }).notNull().default(sql`CURRENT_TIMESTAMP`),
    },
  ),
})

export const pagesLocales = defineTable({
  name: "pages_locales",
  priority: 10,
  layer,
  table: sqliteTable(
    "pages_locales",
    {
    id: integer("id").primaryKey({ autoIncrement: true }),
    page_id: integer("page_id").notNull().references(() => pages.table.id, { onDelete: "cascade" }),
    locale: text("locale").notNull(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    seo: text("seo", { mode: 'json' }).notNull(),
    builder: text("builder", { mode: 'json' }).notNull(),
    },
    (table) => ({
      pages_locale_unique: uniqueIndex("pages_locale_unique").on(table.page_id, table.locale),
      pages_slug_locale_unique: uniqueIndex("pages_slug_locale_unique").on(table.slug, table.locale),
    })
  ),
})

export const services = defineTable({
  name: "services",
  priority: 10,
  layer,
  table: sqliteTable(
    "services",
    {
    id: integer("id").primaryKey({ autoIncrement: true }),
    icon: text("icon"),
    image: text("image"),
    link: text("link"),
    sort_order: integer("sort_order").notNull().default(0),
    is_active: integer("is_active", { mode: 'boolean' }).notNull().default(true),
    created_at: integer("created_at", { mode: 'timestamp_ms' }).notNull().default(sql`CURRENT_TIMESTAMP`),
    updated_at: integer("updated_at", { mode: 'timestamp_ms' }).notNull().default(sql`CURRENT_TIMESTAMP`),
    },
  ),
})

export const servicesLocales = defineTable({
  name: "services_locales",
  priority: 10,
  layer,
  table: sqliteTable(
    "services_locales",
    {
    id: integer("id").primaryKey({ autoIncrement: true }),
    service_id: integer("service_id").notNull().references(() => services.table.id, { onDelete: "cascade" }),
    locale: text("locale").notNull(),
    title: text("title").notNull(),
    subtitle: text("subtitle"),
    description: text("description"),
    extra: text("extra", { mode: 'json' }).notNull().default(sql`'[]'`),
    },
    (table) => ({
      services_locale_unique: uniqueIndex("services_locale_unique").on(table.service_id, table.locale),
    })
  ),
})

export const colleagues = defineTable({
  name: "colleagues",
  priority: 10,
  layer,
  table: sqliteTable(
    "colleagues",
    {
    id: integer("id").primaryKey({ autoIncrement: true }),
    icon: text("icon"),
    image: text("image"),
    link: text("link"),
    sort_order: integer("sort_order").notNull().default(0),
    is_active: integer("is_active", { mode: 'boolean' }).notNull().default(true),
    created_at: integer("created_at", { mode: 'timestamp_ms' }).notNull().default(sql`CURRENT_TIMESTAMP`),
    updated_at: integer("updated_at", { mode: 'timestamp_ms' }).notNull().default(sql`CURRENT_TIMESTAMP`),
    },
  ),
})

export const colleaguesLocales = defineTable({
  name: "colleagues_locales",
  priority: 10,
  layer,
  table: sqliteTable(
    "colleagues_locales",
    {
    id: integer("id").primaryKey({ autoIncrement: true }),
    colleague_id: integer("colleague_id").notNull().references(() => colleagues.table.id, { onDelete: "cascade" }),
    locale: text("locale").notNull(),
    title: text("title").notNull(),
    subtitle: text("subtitle"),
    description: text("description"),
    extra: text("extra", { mode: 'json' }).notNull().default(sql`'[]'`),
    },
    (table) => ({
      colleagues_locale_unique: uniqueIndex("colleagues_locale_unique").on(table.colleague_id, table.locale),
    })
  ),
})

export const testimonials = defineTable({
  name: "testimonials",
  priority: 10,
  layer,
  table: sqliteTable(
    "testimonials",
    {
    id: integer("id").primaryKey({ autoIncrement: true }),
    avatar: text("avatar"),
    rating: integer("rating").notNull().default(5),
    is_active: integer("is_active", { mode: 'boolean' }).notNull().default(true),
    created_at: integer("created_at", { mode: 'timestamp_ms' }).notNull().default(sql`CURRENT_TIMESTAMP`),
    updated_at: integer("updated_at", { mode: 'timestamp_ms' }).notNull().default(sql`CURRENT_TIMESTAMP`),
    },
  ),
})

export const testimonialsLocales = defineTable({
  name: "testimonials_locales",
  priority: 10,
  layer,
  table: sqliteTable(
    "testimonials_locales",
    {
    id: integer("id").primaryKey({ autoIncrement: true }),
    testimonial_id: integer("testimonial_id").notNull().references(() => testimonials.table.id, { onDelete: "cascade" }),
    locale: text("locale").notNull(),
    name: text("name").notNull(),
    role: text("role"),
    content: text("content").notNull(),
    },
    (table) => ({
      testimonials_locale_unique: uniqueIndex("testimonials_locale_unique").on(table.testimonial_id, table.locale),
    })
  ),
})

export const contactMessages = defineTable({
  name: "contact_messages",
  priority: 10,
  layer,
  table: sqliteTable(
    "contact_messages",
    {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    email: text("email").notNull(),
    subject: text("subject"),
    message: text("message").notNull(),
    created_at: integer("created_at", { mode: 'timestamp_ms' }).notNull().default(sql`CURRENT_TIMESTAMP`),
    },
  ),
})

export const blogCategories = defineTable({
  name: "blog_categories",
  priority: 10,
  layer,
  table: sqliteTable(
    "blog_categories",
    {
    id: integer("id").primaryKey({ autoIncrement: true }),
    created_at: integer("created_at", { mode: 'timestamp_ms' }).notNull().default(sql`CURRENT_TIMESTAMP`),
    updated_at: integer("updated_at", { mode: 'timestamp_ms' }).notNull().default(sql`CURRENT_TIMESTAMP`),
    },
  ),
})

export const blogCategoriesLocales = defineTable({
  name: "blog_categories_locales",
  priority: 10,
  layer,
  table: sqliteTable(
    "blog_categories_locales",
    {
    id: integer("id").primaryKey({ autoIncrement: true }),
    category_id: integer("category_id").notNull().references(() => blogCategories.table.id, { onDelete: "cascade" }),
    locale: text("locale").notNull(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    },
    (table) => ({
      blog_categories_locale_unique: uniqueIndex("blog_categories_locale_unique").on(table.category_id, table.locale),
      blog_categories_slug_locale_unique: uniqueIndex("blog_categories_slug_locale_unique").on(table.slug, table.locale),
    })
  ),
})

export const blogPosts = defineTable({
  name: "blog_posts",
  priority: 10,
  layer,
  table: sqliteTable(
    "blog_posts",
    {
    id: integer("id").primaryKey({ autoIncrement: true }),
    author_id: integer("author_id").references(() => users.table.id, { onDelete: "set null" }),
    featured_image: text("featured_image"),
    status: text("status").notNull().$type<"draft" | "published" | "archived">().default("draft"),
    allow_comments: integer("allow_comments", { mode: 'boolean' }).notNull().default(true),
    allow_anonymous_comments: integer("allow_anonymous_comments", { mode: 'boolean' }).notNull().default(true),
    published_at: integer("published_at", { mode: 'timestamp_ms' }),
    created_at: integer("created_at", { mode: 'timestamp_ms' }).notNull().default(sql`CURRENT_TIMESTAMP`),
    updated_at: integer("updated_at", { mode: 'timestamp_ms' }).notNull().default(sql`CURRENT_TIMESTAMP`),
    },
    (table) => ({
      blog_posts_status_published_idx: index("blog_posts_status_published_idx").on(table.status, table.published_at),
      blog_posts_author_idx: index("blog_posts_author_idx").on(table.author_id),
    })
  ),
})

export const blogPostsLocales = defineTable({
  name: "blog_posts_locales",
  priority: 10,
  layer,
  table: sqliteTable(
    "blog_posts_locales",
    {
    id: integer("id").primaryKey({ autoIncrement: true }),
    post_id: integer("post_id").notNull().references(() => blogPosts.table.id, { onDelete: "cascade" }),
    locale: text("locale").notNull(),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    excerpt: text("excerpt"),
    content: text("content").notNull(),
    seo: text("seo", { mode: 'json' }).notNull().default(sql`'{}'`),
    },
    (table) => ({
      blog_posts_locale_unique: uniqueIndex("blog_posts_locale_unique").on(table.post_id, table.locale),
      blog_posts_slug_locale_unique: uniqueIndex("blog_posts_slug_locale_unique").on(table.slug, table.locale),
    })
  ),
})

export const blogPostCategories = defineTable({
  name: "blog_post_categories",
  priority: 10,
  layer,
  table: sqliteTable(
    "blog_post_categories",
    {
    post_id: integer("post_id").notNull().references(() => blogPosts.table.id, { onDelete: "cascade" }),
    category_id: integer("category_id").notNull().references(() => blogCategories.table.id, { onDelete: "cascade" }),
    },
    (table) => ({
      blog_post_categories_pk: uniqueIndex("blog_post_categories_pk").on(table.post_id, table.category_id),
      blog_post_categories_category_idx: index("blog_post_categories_category_idx").on(table.category_id),
    })
  ),
})

export const blogComments = defineTable({
  name: "blog_comments",
  priority: 10,
  layer,
  table: sqliteTable(
    "blog_comments",
    {
    id: integer("id").primaryKey({ autoIncrement: true }),
    post_id: integer("post_id").notNull().references(() => blogPosts.table.id, { onDelete: "cascade" }),
    user_id: integer("user_id").references(() => users.table.id, { onDelete: "set null" }),
    parent_id: integer("parent_id"),
    author_name: text("author_name"),
    author_email: text("author_email"),
    content: text("content").notNull(),
    seo: text("seo", { mode: 'json' }).notNull().default(sql`'{}'`),
    status: text("status").notNull().$type<"pending" | "approved" | "rejected">().default("pending"),
    like_count: integer("like_count").notNull().default(0),
    created_at: integer("created_at", { mode: 'timestamp_ms' }).notNull().default(sql`CURRENT_TIMESTAMP`),
    updated_at: integer("updated_at", { mode: 'timestamp_ms' }).notNull().default(sql`CURRENT_TIMESTAMP`),
    },
    (table) => ({
      blog_comments_post_status_idx: index("blog_comments_post_status_idx").on(table.post_id, table.status),
      blog_comments_parent_idx: index("blog_comments_parent_idx").on(table.parent_id),
    })
  ),
})

export const blogCommentLikes = defineTable({
  name: "blog_comment_likes",
  priority: 10,
  layer,
  table: sqliteTable(
    "blog_comment_likes",
    {
    id: integer("id").primaryKey({ autoIncrement: true }),
    comment_id: integer("comment_id").notNull().references(() => blogComments.table.id, { onDelete: "cascade" }),
    user_id: integer("user_id").notNull().references(() => users.table.id, { onDelete: "cascade" }),
    created_at: integer("created_at", { mode: 'timestamp_ms' }).notNull().default(sql`CURRENT_TIMESTAMP`),
    },
    (table) => ({
      blog_comment_likes_unique_idx: uniqueIndex("blog_comment_likes_unique_idx").on(table.comment_id, table.user_id),
    })
  ),
})

export const media = defineTable({
  name: "media",
  priority: 10,
  layer,
  table: sqliteTable(
    "media",
    {
    id: integer("id").primaryKey({ autoIncrement: true }),
    filename: text("filename").notNull(),
    original_name: text("original_name").notNull(),
    mime_type: text("mime_type").notNull(),
    size: integer("size").notNull(),
    path: text("path").notNull(),
    thumbnail_path: text("thumbnail_path"),
    alt: text("alt"),
    title: text("title"),
    width: integer("width"),
    height: integer("height"),
    uploaded_by: integer("uploaded_by").references(() => users.table.id, { onDelete: "set null" }),
    created_at: integer("created_at", { mode: 'timestamp_ms' }).notNull().default(sql`CURRENT_TIMESTAMP`),
    },
    (table) => ({
      media_filename_idx: index("media_filename_idx").on(table.filename),
      media_uploaded_by_idx: index("media_uploaded_by_idx").on(table.uploaded_by),
    })
  ),
})
