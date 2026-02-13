import { sqliteTable, integer, text, index, primaryKey, uniqueIndex } from "drizzle-orm/sqlite-core";
import { defineTable } from "../../../../server/utils/schema-types";
import { sql } from "drizzle-orm";

const layer = {
  source : '../../layers/base/server/database/schema',
  name : 'base'
}

export const users = defineTable({
  name: "users",
  priority: 10,
  layer,
  table: sqliteTable("users", {
    id: integer("id").primaryKey({ autoIncrement: true }),

    username: text("username").notNull().unique(),
    email: text("email").notNull().unique(),

    passwordHash: text("password_hash"), 
    token: text("token"),

    role: text("role")
      .$type<"admin" | "user">()
      .default("user")
      .notNull(),

    createdAt: text("created_at")
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),

    updatedAt: text("updated_at")
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull()
      .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
  }),
});   

export const settings = defineTable({
  name: "settings",
  priority: 10,
  layer,
  table: sqliteTable("settings",
  {
    key: text("key").primaryKey(),
    // Example: "navbar", "footer", "seo"

    value: text("value", { mode: "json" }).notNull(),
    // JSON string (Drizzle helps parse/serialize)

    description: text("description"),
    // Admin-friendly explanation

    isPublic: integer("is_public", { mode: "boolean" })
      .default(true)
      .notNull(),
    // Controls frontend exposure

    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .defaultNow(),

    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    isPublicIdx: index("settings_is_public_idx").on(table.isPublic),
  })),
});

export const pages = defineTable({
  name: "pages",
  priority: 10,
  layer,
  table: sqliteTable("pages", {
    id: integer("id").primaryKey({ autoIncrement: true }),

    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),

    status: text("status")
      .$type<"draft" | "published">()
      .default("draft")
      .notNull(),

    seo: text("seo", { mode: "json" }).notNull(),
    builder: text("builder", { mode: "json" }).notNull(),

    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .defaultNow(),

    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .notNull()
      .defaultNow(),
  }),
});

export const blogCategories = defineTable({
  name: "blog_categories",
  priority: 10,
  layer,
  table: sqliteTable(
    "blog_categories",
    {
      id: integer("id").primaryKey({ autoIncrement: true }),
      name: text("name").notNull().unique(),
      slug: text("slug").notNull().unique(),
      description: text("description"),
      createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().defaultNow(),
      updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull().defaultNow(),
    },
    (table) => ({
      slugIdx: index("blog_categories_slug_idx").on(table.slug),
    })
  ),
});

export const blogPosts = defineTable({
  name: "blog_posts",
  priority: 10,
  layer,
  table: sqliteTable(
    "blog_posts",
    {
      id: integer("id").primaryKey({ autoIncrement: true }),
      authorId: integer("author_id").references(() => users.table.id, { onDelete: "set null" }),
      title: text("title").notNull(),
      slug: text("slug").notNull().unique(),
      excerpt: text("excerpt"),
      content: text("content").notNull(),
      seo: text("seo", { mode: "json" }).notNull().default(sql`'{}'`),
      featuredImage: text("featured_image"),
      status: text("status").$type<"draft" | "published" | "archived">().default("draft").notNull(),
      allowComments: integer("allow_comments", { mode: "boolean" }).default(true).notNull(),
      allowAnonymousComments: integer("allow_anonymous_comments", { mode: "boolean" }).default(true).notNull(),
      publishedAt: integer("published_at", { mode: "timestamp_ms" }),
      createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().defaultNow(),
      updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull().defaultNow(),
    },
    (table) => ({
      slugIdx: index("blog_posts_slug_idx").on(table.slug),
      statusPublishedIdx: index("blog_posts_status_published_idx").on(table.status, table.publishedAt),
      authorIdx: index("blog_posts_author_idx").on(table.authorId),
    })
  ),
});

export const blogPostCategories = defineTable({
  name: "blog_post_categories",
  priority: 10,
  layer,
  table: sqliteTable(
    "blog_post_categories",
    {
      postId: integer("post_id").notNull().references(() => blogPosts.table.id, { onDelete: "cascade" }),
      categoryId: integer("category_id").notNull().references(() => blogCategories.table.id, { onDelete: "cascade" }),
    },
    (table) => ({
      pk: primaryKey({ columns: [table.postId, table.categoryId] }),
      categoryIdx: index("blog_post_categories_category_idx").on(table.categoryId),
    })
  ),
});

export const blogComments = defineTable({
  name: "blog_comments",
  priority: 10,
  layer,
  table: sqliteTable(
    "blog_comments",
    {
      id: integer("id").primaryKey({ autoIncrement: true }),
      postId: integer("post_id").notNull().references(() => blogPosts.table.id, { onDelete: "cascade" }),
      userId: integer("user_id").references(() => users.table.id, { onDelete: "set null" }),
      parentId: integer("parent_id"),
      authorName: text("author_name"),
      authorEmail: text("author_email"),
      content: text("content").notNull(),
      seo: text("seo", { mode: "json" }).notNull().default(sql`'{}'`),
      status: text("status").$type<"pending" | "approved" | "rejected">().default("pending").notNull(),
      likeCount: integer("like_count").default(0).notNull(),
      createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().defaultNow(),
      updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull().defaultNow(),
    },
    (table) => ({
      postStatusIdx: index("blog_comments_post_status_idx").on(table.postId, table.status),
      parentIdx: index("blog_comments_parent_idx").on(table.parentId),
    })
  ),
});

export const blogCommentLikes = defineTable({
  name: "blog_comment_likes",
  priority: 10,
  layer,
  table: sqliteTable(
    "blog_comment_likes",
    {
      id: integer("id").primaryKey({ autoIncrement: true }),
      commentId: integer("comment_id").notNull().references(() => blogComments.table.id, { onDelete: "cascade" }),
      userId: integer("user_id").notNull().references(() => users.table.id, { onDelete: "cascade" }),
      createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().defaultNow(),
    },
    (table) => ({
      uniqueLikeIdx: uniqueIndex("blog_comment_likes_unique_idx").on(table.commentId, table.userId),
    })
  ),
});
