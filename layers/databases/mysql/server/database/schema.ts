import {
  mysqlTable,
  int, varchar, text, boolean, json, datetime,
  bigint,
  index, primaryKey, uniqueIndex,
} from 'drizzle-orm/mysql-core'
import { sql } from 'drizzle-orm'
import { defineTable } from '../utils/schema-types'

const layer = { source: '../../layers/base/server/database/definitions', name: 'base' }

export const users = defineTable({
  name: "users",
  priority: 10,
  layer,
  table: mysqlTable(
    "users",
    {
    int("id").primaryKey().autoincrement(),
    text("username").unique().notNull(),
    text("email").unique().notNull(),
    text("password_hash"),
    text("token"),
    text("role").notNull()..$type<"admin" | "user">().default("user"),
    datetime("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
    datetime("updated_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
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
    text("key").primaryKey(),
    json("value").notNull(),
    text("description"),
    boolean("is_public").notNull().default(true),
    datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    datetime("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
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
    int("id").primaryKey().autoincrement(),
    text("status").notNull()..$type<"draft" | "published">().default("draft"),
    datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    datetime("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
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
    int("id").primaryKey().autoincrement(),
    int("page_id").notNull().references(() => pages.table.id, { onDelete: "cascade" }),
    text("locale").notNull(),
    text("slug").notNull(),
    text("title").notNull(),
    json("seo").notNull(),
    json("builder").notNull(),
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
    int("id").primaryKey().autoincrement(),
    varchar("icon", { length: 191 }),
    varchar("image", { length: 191 }),
    varchar("link", { length: 191 }),
    int("sort_order").notNull().default(0),
    boolean("is_active").notNull().default(true),
    datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    datetime("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
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
    int("id").primaryKey().autoincrement(),
    int("service_id").notNull().references(() => services.table.id, { onDelete: "cascade" }),
    text("locale").notNull(),
    text("title").notNull(),
    text("subtitle"),
    text("description"),
    json("extra").notNull().default(sql`'[]'`),
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
    int("id").primaryKey().autoincrement(),
    text("icon"),
    text("image"),
    text("link"),
    int("sort_order").notNull().default(0),
    boolean("is_active").notNull().default(true),
    datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    datetime("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
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
    int("id").primaryKey().autoincrement(),
    int("colleague_id").notNull().references(() => colleagues.table.id, { onDelete: "cascade" }),
    text("locale").notNull(),
    text("title").notNull(),
    text("subtitle"),
    text("description"),
    json("extra").notNull().default(sql`'[]'`),
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
    int("id").primaryKey().autoincrement(),
    varchar("avatar", { length: 191 }),
    int("rating").notNull().default(5),
    boolean("is_active").notNull().default(true),
    datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    datetime("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
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
    int("id").primaryKey().autoincrement(),
    int("testimonial_id").notNull().references(() => testimonials.table.id, { onDelete: "cascade" }),
    text("locale").notNull(),
    text("name").notNull(),
    text("role"),
    text("content").notNull(),
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
    int("id").primaryKey().autoincrement(),
    text("name").notNull(),
    text("email").notNull(),
    text("subject"),
    text("message").notNull(),
    datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
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
    int("id").primaryKey().autoincrement(),
    datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    datetime("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
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
    int("id").primaryKey().autoincrement(),
    int("category_id").notNull().references(() => blogCategories.table.id, { onDelete: "cascade" }),
    text("locale").notNull(),
    text("name").notNull(),
    text("slug").notNull(),
    text("description"),
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
    int("id").primaryKey().autoincrement(),
    int("author_id").references(() => users.table.id, { onDelete: "set null" }),
    varchar("featured_image", { length: 191 }),
    varchar("status", { length: 20 }).notNull()..$type<"draft" | "published" | "archived">().default("draft"),
    boolean("allow_comments").notNull().default(true),
    boolean("allow_anonymous_comments").notNull().default(true),
    datetime("published_at"),
    datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    datetime("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
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
    int("id").primaryKey().autoincrement(),
    int("post_id").notNull().references(() => blogPosts.table.id, { onDelete: "cascade" }),
    text("locale").notNull(),
    text("title").notNull(),
    text("slug").notNull(),
    text("excerpt"),
    text("content").notNull(),
    json("seo").notNull().default(sql`'{}'`),
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
    int("post_id").notNull().references(() => blogPosts.table.id, { onDelete: "cascade" }),
    int("category_id").notNull().references(() => blogCategories.table.id, { onDelete: "cascade" }),
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
    int("id").primaryKey().autoincrement(),
    int("post_id").notNull().references(() => blogPosts.table.id, { onDelete: "cascade" }),
    int("user_id").references(() => users.table.id, { onDelete: "set null" }),
    int("parent_id"),
    text("author_name"),
    text("author_email"),
    text("content").notNull(),
    json("seo").notNull().default(sql`'{}'`),
    text("status").notNull()..$type<"pending" | "approved" | "rejected">().default("pending"),
    int("like_count").notNull().default(0),
    datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    datetime("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
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
    int("id").primaryKey().autoincrement(),
    int("comment_id").notNull().references(() => blogComments.table.id, { onDelete: "cascade" }),
    int("user_id").notNull().references(() => users.table.id, { onDelete: "cascade" }),
    datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
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
    int("id").primaryKey().autoincrement(),
    text("filename").notNull(),
    text("original_name").notNull(),
    text("mime_type").notNull(),
    int("size").notNull(),
    text("path").notNull(),
    text("thumbnail_path"),
    text("alt"),
    text("title"),
    int("width"),
    int("height"),
    int("uploaded_by").references(() => users.table.id, { onDelete: "set null" }),
    datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    },
    (table) => ({
      media_filename_idx: index("media_filename_idx").on(table.filename),
      media_uploaded_by_idx: index("media_uploaded_by_idx").on(table.uploaded_by),
    })
  ),
})
