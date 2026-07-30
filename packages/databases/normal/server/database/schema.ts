import {
  mysqlTable,
  int, varchar, text, boolean, json, datetime,
  bigint,
  index, primaryKey, uniqueIndex,
} from 'drizzle-orm/mysql-core'
import { sql } from 'drizzle-orm'
import { defineTable } from '../utils/schema-types'

const layer = { source: '../../../../base/server/database/definitions', name: 'base' }

export const users = defineTable({
  name: "users",
  priority: 10,
  layer,
  table: mysqlTable(
    "users",
    {
    id: int("id").primaryKey().autoincrement(),
    username: text("username").unique().notNull(),
    email: text("email").unique().notNull(),
    password_hash: text("password_hash"),
    token: text("token"),
    role: text("role").notNull().$type<"admin" | "user">().default("user"),
    created_at: datetime("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
    updated_at: datetime("updated_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
    },
  ),
})

export const settings = defineTable({
  name: "settings",
  priority: 10,
  layer,
  table: mysqlTable(
    "settings",
    {
    key: text("key").primaryKey(),
    value: json("value").notNull(),
    description: text("description"),
    is_public: boolean("is_public").notNull().default(true),
    created_at: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updated_at: datetime("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
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
  table: mysqlTable(
    "pages",
    {
    id: int("id").primaryKey().autoincrement(),
    status: text("status").notNull().$type<"draft" | "published">().default("draft"),
    created_at: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updated_at: datetime("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    },
  ),
})

export const pagesLocales = defineTable({
  name: "pages_locales",
  priority: 10,
  layer,
  table: mysqlTable(
    "pages_locales",
    {
    id: int("id").primaryKey().autoincrement(),
    page_id: int("page_id").notNull().references(() => pages.table.id, { onDelete: "cascade" }),
    locale: text("locale").notNull(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    seo: json("seo").notNull(),
    builder: json("builder").notNull(),
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
  table: mysqlTable(
    "services",
    {
    id: int("id").primaryKey().autoincrement(),
    icon: varchar("icon", { length: 191 }),
    image: varchar("image", { length: 191 }),
    link: varchar("link", { length: 191 }),
    sort_order: int("sort_order").notNull().default(0),
    is_active: boolean("is_active").notNull().default(true),
    created_at: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updated_at: datetime("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    },
  ),
})

export const servicesLocales = defineTable({
  name: "services_locales",
  priority: 10,
  layer,
  table: mysqlTable(
    "services_locales",
    {
    id: int("id").primaryKey().autoincrement(),
    service_id: int("service_id").notNull().references(() => services.table.id, { onDelete: "cascade" }),
    locale: text("locale").notNull(),
    title: text("title").notNull(),
    subtitle: text("subtitle"),
    description: text("description"),
    extra: json("extra").notNull().default(sql`'[]'`),
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
  table: mysqlTable(
    "colleagues",
    {
    id: int("id").primaryKey().autoincrement(),
    icon: text("icon"),
    image: text("image"),
    link: text("link"),
    sort_order: int("sort_order").notNull().default(0),
    is_active: boolean("is_active").notNull().default(true),
    created_at: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updated_at: datetime("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    },
  ),
})

export const colleaguesLocales = defineTable({
  name: "colleagues_locales",
  priority: 10,
  layer,
  table: mysqlTable(
    "colleagues_locales",
    {
    id: int("id").primaryKey().autoincrement(),
    colleague_id: int("colleague_id").notNull().references(() => colleagues.table.id, { onDelete: "cascade" }),
    locale: text("locale").notNull(),
    title: text("title").notNull(),
    subtitle: text("subtitle"),
    description: text("description"),
    extra: json("extra").notNull().default(sql`'[]'`),
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
  table: mysqlTable(
    "testimonials",
    {
    id: int("id").primaryKey().autoincrement(),
    avatar: varchar("avatar", { length: 191 }),
    rating: int("rating").notNull().default(5),
    is_active: boolean("is_active").notNull().default(true),
    created_at: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updated_at: datetime("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    },
  ),
})

export const testimonialsLocales = defineTable({
  name: "testimonials_locales",
  priority: 10,
  layer,
  table: mysqlTable(
    "testimonials_locales",
    {
    id: int("id").primaryKey().autoincrement(),
    testimonial_id: int("testimonial_id").notNull().references(() => testimonials.table.id, { onDelete: "cascade" }),
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
  table: mysqlTable(
    "contact_messages",
    {
    id: int("id").primaryKey().autoincrement(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    subject: text("subject"),
    message: text("message").notNull(),
    created_at: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    },
  ),
})

export const blogCategories = defineTable({
  name: "blog_categories",
  priority: 10,
  layer,
  table: mysqlTable(
    "blog_categories",
    {
    id: int("id").primaryKey().autoincrement(),
    created_at: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updated_at: datetime("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    },
  ),
})

export const blogCategoriesLocales = defineTable({
  name: "blog_categories_locales",
  priority: 10,
  layer,
  table: mysqlTable(
    "blog_categories_locales",
    {
    id: int("id").primaryKey().autoincrement(),
    category_id: int("category_id").notNull().references(() => blogCategories.table.id, { onDelete: "cascade" }),
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
  table: mysqlTable(
    "blog_posts",
    {
    id: int("id").primaryKey().autoincrement(),
    author_id: int("author_id").references(() => users.table.id, { onDelete: "set null" }),
    featured_image: varchar("featured_image", { length: 191 }),
    status: varchar("status", { length: 20 }).notNull().$type<"draft" | "published" | "archived">().default("draft"),
    allow_comments: boolean("allow_comments").notNull().default(true),
    allow_anonymous_comments: boolean("allow_anonymous_comments").notNull().default(true),
    published_at: datetime("published_at"),
    created_at: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updated_at: datetime("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
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
  table: mysqlTable(
    "blog_posts_locales",
    {
    id: int("id").primaryKey().autoincrement(),
    post_id: int("post_id").notNull().references(() => blogPosts.table.id, { onDelete: "cascade" }),
    locale: text("locale").notNull(),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    excerpt: text("excerpt"),
    content: text("content").notNull(),
    seo: json("seo").notNull().default(sql`'{}'`),
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
  table: mysqlTable(
    "blog_post_categories",
    {
    post_id: int("post_id").notNull().references(() => blogPosts.table.id, { onDelete: "cascade" }),
    category_id: int("category_id").notNull().references(() => blogCategories.table.id, { onDelete: "cascade" }),
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
  table: mysqlTable(
    "blog_comments",
    {
    id: int("id").primaryKey().autoincrement(),
    post_id: int("post_id").notNull().references(() => blogPosts.table.id, { onDelete: "cascade" }),
    user_id: int("user_id").references(() => users.table.id, { onDelete: "set null" }),
    parent_id: int("parent_id"),
    author_name: text("author_name"),
    author_email: text("author_email"),
    content: text("content").notNull(),
    seo: json("seo").notNull().default(sql`'{}'`),
    status: text("status").notNull().$type<"pending" | "approved" | "rejected">().default("pending"),
    like_count: int("like_count").notNull().default(0),
    created_at: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updated_at: datetime("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
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
  table: mysqlTable(
    "blog_comment_likes",
    {
    id: int("id").primaryKey().autoincrement(),
    comment_id: int("comment_id").notNull().references(() => blogComments.table.id, { onDelete: "cascade" }),
    user_id: int("user_id").notNull().references(() => users.table.id, { onDelete: "cascade" }),
    created_at: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
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
  table: mysqlTable(
    "media",
    {
    id: int("id").primaryKey().autoincrement(),
    filename: text("filename").notNull(),
    original_name: text("original_name").notNull(),
    mime_type: text("mime_type").notNull(),
    size: int("size").notNull(),
    path: text("path").notNull(),
    thumbnail_path: text("thumbnail_path"),
    alt: text("alt"),
    title: text("title"),
    width: int("width"),
    height: int("height"),
    uploaded_by: int("uploaded_by").references(() => users.table.id, { onDelete: "set null" }),
    created_at: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    },
    (table) => ({
      media_filename_idx: index("media_filename_idx").on(table.filename),
      media_uploaded_by_idx: index("media_uploaded_by_idx").on(table.uploaded_by),
    })
  ),
})
