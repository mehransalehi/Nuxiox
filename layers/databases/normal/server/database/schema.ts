import {
  mysqlTable,
  int,
  varchar,
  text,
  boolean,
  json,
  datetime,
  index,
  primaryKey,
  uniqueIndex,
} from "drizzle-orm/mysql-core";
import { defineTable } from "../utils/schema-types";
import { sql } from "drizzle-orm";

const layer = {
  source: "../../layers/base/server/database/schema",
  name: "base",
};

export const users = defineTable({
  name: "users",
  priority: 10,
  layer,
  table: mysqlTable("users", {
    id: int("id").primaryKey().autoincrement(),

    username: text("username").notNull().unique(),
    email: text("email").notNull().unique(),

    passwordHash: text("password_hash"),
    token: text("token"),

    role: text("role").$type<"admin" | "user">().default("user").notNull(),

    createdAt: datetime("created_at")
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
    
    updatedAt: datetime("updated_at")
      .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`)
      .notNull(),
  }),
});

export const settings = defineTable({
  name: "settings",
  priority: 10,
  layer,
  table: mysqlTable(
    "settings",
    {
      key: varchar("key", { length: 191 }).primaryKey(),

      value: json("value").$type<Record<string, any>>().notNull(),

      description: text("description"),

      isPublic: boolean("is_public").default(true).notNull(),

      createdAt: datetime("created_at")
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),

      updatedAt: datetime("updated_at")
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
    },
    (table) => ({
      isPublicIdx: index("settings_is_public_idx").on(table.isPublic),
    }),
  ),
});

export const pages = defineTable({
  name: "pages",
  priority: 10,
  layer,
  table: mysqlTable("pages", {
    id: int("id").primaryKey().autoincrement(),

    status: varchar("status", { length: 191 })
      .$type<"draft" | "published">()
      .default("draft")
      .notNull(),

    createdAt: datetime("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),

    updatedAt: datetime("updated_at")
      .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`)
      .notNull(),
  }),
});

export const pagesLocales = defineTable({
  name: "pages_locales",
  priority: 10,
  layer,
  table: mysqlTable(
    "pages_locales",
    {
      id: int("id").primaryKey().autoincrement(),

      pageId: int("page_id")
        .notNull()
        .references(() => pages.table.id, { onDelete: "cascade" }),

      locale: varchar("locale", { length: 191 }).notNull(),

      slug: varchar("slug", { length: 191 }).notNull(),
      title: varchar("title", { length: 191 }).notNull(),

      seo: json("seo").$type<Record<string, any>>().notNull(),
      builder: json("builder").$type<Record<string, any>>().notNull(),
    },
    (table) => ({
      pageLocaleIdx: uniqueIndex("pages_locale_unique").on(
        table.pageId,
        table.locale,
      ),

      slugLocaleIdx: uniqueIndex("pages_slug_locale_unique").on(
        table.slug,
        table.locale,
      ),
    }),
  ),
});

export const services = defineTable({
  name: "services",
  priority: 10,
  layer,
  table: mysqlTable("services", {
    id: int("id").primaryKey().autoincrement(),

    icon: varchar("icon", { length: 191 }),
    image: varchar("image", { length: 191 }),
    link: varchar("link", { length: 191 }),

    sortOrder: int("sort_order").default(0).notNull(),

    isActive: boolean("is_active").default(true).notNull(),

    createdAt: datetime("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),

    updatedAt: datetime("updated_at")
      .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`)
      .notNull(),
  }),
});

export const servicesLocales = defineTable({
  name: "services_locales",
  priority: 10,
  layer,
  table: mysqlTable(
    "services_locales",
    {
      id: int("id").primaryKey().autoincrement(),

      serviceId: int("service_id")
        .notNull()
        .references(() => services.table.id, { onDelete: "cascade" }),

      locale: varchar("locale", { length: 191 }).notNull(),

      title: varchar("title", { length: 191 }).notNull(),
      subtitle: varchar("subtitle", { length: 191 }),
      description: text("description"),

      extra: json("extra").$type<Record<string, any>>()
        .notNull()
        .default(sql`'[]'`),
    },
    (table) => ({
      serviceLocaleIdx: uniqueIndex("services_locale_unique").on(
        table.serviceId,
        table.locale,
      ),
    }),
  ),
});

export const colleagues = defineTable({
  name: "colleagues",
  priority: 10,
  layer,
  table: mysqlTable("colleagues", {
    id: int("id").primaryKey().autoincrement(),

    icon: text("icon"),
    image: text("image"),
    link: text("link"),

    sortOrder: int("sort_order").default(0).notNull(),

    isActive: boolean("is_active").default(true).notNull(),

    createdAt: datetime("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),

    updatedAt: datetime("updated_at")
      .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`)
      .notNull(),
  }),
});

export const colleaguesLocales = defineTable({
  name: "colleagues_locales",
  priority: 10,
  layer,
  table: mysqlTable(
    "colleagues_locales",
    {
      id: int("id").primaryKey().autoincrement(),

      colleagueId: int("colleague_id")
        .notNull()
        .references(() => colleagues.table.id, { onDelete: "cascade" }),

      locale: varchar("locale", { length: 191 }).notNull(),

      title: text("title").notNull(),
      subtitle: text("subtitle"),
      description: text("description"),

      extra: json("extra").$type<Record<string, any>>()
        .notNull()
        .default(sql`'[]'`),
    },
    (table) => ({
      colleagueLocaleIdx: uniqueIndex("colleagues_locale_unique").on(
        table.colleagueId,
        table.locale,
      ),
    }),
  ),
});

export const testimonials = defineTable({
  name: "testimonials",
  priority: 10,
  layer,
  table: mysqlTable("testimonials", {
    id: int("id").primaryKey().autoincrement(),

    avatar: varchar("avatar", { length: 191 }),

    rating: int("rating").default(5).notNull(),

    isActive: boolean("is_active").default(true).notNull(),

    createdAt: datetime("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),

    updatedAt: datetime("updated_at")
      .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`)
      .notNull(),
  }),
});

export const testimonialsLocales = defineTable({
  name: "testimonials_locales",
  priority: 10,
  layer,
  table: mysqlTable(
    "testimonials_locales",
    {
      id: int("id").primaryKey().autoincrement(),

      testimonialId: int("testimonial_id")
        .notNull()
        .references(() => testimonials.table.id, { onDelete: "cascade" }),

      locale: varchar("locale", { length: 191 }).notNull(),

      name: text("name").notNull(),
      role: text("role"),
      content: text("content").notNull(),
    },
    (table) => ({
      testimonialLocaleIdx: uniqueIndex("testimonials_locale_unique").on(
        table.testimonialId,
        table.locale,
      ),
    }),
  ),
});

export const contactMessages = defineTable({
  name: "contact_messages",
  priority: 10,
  layer,
  table: mysqlTable("contact_messages", {
    id: int("id").primaryKey().autoincrement(),

    name: varchar("name", { length: 191 }).notNull(),
    email: varchar("email", { length: 191 }).notNull(),
    subject: varchar("subject", { length: 191 }),

    message: text("message").notNull(),

    createdAt: datetime("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  }),
});

export const blogCategories = defineTable({
  name: "blog_categories",
  priority: 10,
  layer,
  table: mysqlTable("blog_categories", {
    id: int("id").primaryKey().autoincrement(),

    createdAt: datetime("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),

    updatedAt: datetime("updated_at")
      .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`)
      .notNull(),
  }),
});

export const blogCategoriesLocales = defineTable({
  name: "blog_categories_locales",
  priority: 10,
  layer,
  table: mysqlTable(
    "blog_categories_locales",
    {
      id: int("id").primaryKey().autoincrement(),

      categoryId: int("category_id")
        .notNull()
        .references(() => blogCategories.table.id, { onDelete: "cascade" }),

      locale: varchar("locale", { length: 191 }).notNull(),

      name: varchar("name", { length: 191 }).notNull(),
      slug: varchar("slug", { length: 191 }).notNull(),

      description: text("description"),
    },
    (table) => ({
      categoryLocaleIdx: uniqueIndex("blog_categories_locale_unique").on(
        table.categoryId,
        table.locale,
      ),

      slugLocaleIdx: uniqueIndex("blog_categories_slug_locale_unique").on(
        table.slug,
        table.locale,
      ),
    }),
  ),
});
export const blogPosts = defineTable({
  name: "blog_posts",
  priority: 10,
  layer,
  table: mysqlTable(
    "blog_posts",
    {
      id: int("id").primaryKey().autoincrement(),

      authorId: int("author_id").references(() => users.table.id, {
        onDelete: "set null",
      }),

      featuredImage: varchar("featured_image", { length: 191 }),

      status: varchar("status", { length: 20 })
        .$type<"draft" | "published" | "archived">()
        .default("draft")
        .notNull(),

      allowComments: boolean("allow_comments").default(true).notNull(),

      allowAnonymousComments: boolean("allow_anonymous_comments")
        .default(true)
        .notNull(),

      publishedAt: datetime("published_at"),

      createdAt: datetime("created_at")
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),

      updatedAt: datetime("updated_at")
        .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`)
        .notNull(),
    },
    (table) => ({
      statusPublishedIdx: index("blog_posts_status_published_idx").on(
        table.status,
        table.publishedAt,
      ),

      authorIdx: index("blog_posts_author_idx").on(table.authorId),
    }),
  ),
});

export const blogPostsLocales = defineTable({
  name: "blog_posts_locales",
  priority: 10,
  layer,
  table: mysqlTable(
    "blog_posts_locales",
    {
      id: int("id").primaryKey().autoincrement(),

      postId: int("post_id")
        .notNull()
        .references(() => blogPosts.table.id, { onDelete: "cascade" }),

      locale: varchar("locale", { length: 191 }).notNull(),

      title: varchar("title", { length: 191 }).notNull(),
      slug: varchar("slug", { length: 191 }).notNull(),

      excerpt: text("excerpt"),
      content: text("content").notNull(),

      seo: json("seo").$type<Record<string, any>>()
        .notNull()
        .default(sql`'{}'`),
    },
    (table) => ({
      postLocaleIdx: uniqueIndex("blog_posts_locale_unique").on(
        table.postId,
        table.locale,
      ),

      slugLocaleIdx: uniqueIndex("blog_posts_slug_locale_unique").on(
        table.slug,
        table.locale,
      ),
    }),
  ),
});

export const blogPostCategories = defineTable({
  name: "blog_post_categories",
  priority: 10,
  layer,
  table: mysqlTable(
    "blog_post_categories",
    {
      postId: int("post_id")
        .notNull()
        .references(() => blogPosts.table.id, { onDelete: "cascade" }),

      categoryId: int("category_id")
        .notNull()
        .references(() => blogCategories.table.id, { onDelete: "cascade" }),
    },
    (table) => ({
      pk: primaryKey({ columns: [table.postId, table.categoryId] }),
      categoryIdx: index("blog_post_categories_category_idx").on(
        table.categoryId,
      ),
    }),
  ),
});

export const blogComments = defineTable({
  name: "blog_comments",
  priority: 10,
  layer,
  table: mysqlTable(
    "blog_comments",
    {
      id: int("id").primaryKey().autoincrement(),

      postId: int("post_id")
        .notNull()
        .references(() => blogPosts.table.id, { onDelete: "cascade" }),

      userId: int("user_id").references(() => users.table.id, {
        onDelete: "set null",
      }),

      parentId: int("parent_id"),

      authorName: varchar("author_name", { length: 191 }),
      authorEmail: varchar("author_email", { length: 191 }),

      content: text("content").notNull(),

      seo: json("seo").$type<Record<string, any>>()
        .notNull()
        .default(sql`'{}'`),

      status: varchar("status", { length: 20 })
        .$type<"pending" | "approved" | "rejected">()
        .default("pending")
        .notNull(),

      likeCount: int("like_count").default(0).notNull(),

      createdAt: datetime("created_at")
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),

      updatedAt: datetime("updated_at")
        .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`)
        .notNull(),
    },
    (table) => ({
      postStatusIdx: index("blog_comments_post_status_idx").on(
        table.postId,
        table.status,
      ),

      parentIdx: index("blog_comments_parent_idx").on(table.parentId),
    }),
  ),
});

export const blogCommentLikes = defineTable({
  name: "blog_comment_likes",
  priority: 10,
  layer,
  table: mysqlTable(
    "blog_comment_likes",
    {
      id: int("id").primaryKey().autoincrement(),

      commentId: int("comment_id")
        .notNull()
        .references(() => blogComments.table.id, { onDelete: "cascade" }),

      userId: int("user_id")
        .notNull()
        .references(() => users.table.id, { onDelete: "cascade" }),

      createdAt: datetime("created_at")
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
    },
    (table) => ({
      uniqueLikeIdx: uniqueIndex("blog_comment_likes_unique_idx").on(
        table.commentId,
        table.userId,
      ),
    }),
  ),
});

export const media = defineTable({
  name: "media",
  priority: 10,
  layer,
  table: mysqlTable(
    "media",
    {
      id: int("id").primaryKey().autoincrement(),

      filename: varchar("filename", { length: 191 }).notNull(),
      originalName: varchar("original_name", { length: 191 }).notNull(),
      mimeType: varchar("mime_type", { length: 191 }).notNull(),

      size: int("size").notNull(), // bytes

      // R2 paths
      path: varchar("path", { length: 191 }).notNull(), // original
      thumbnailPath: varchar("thumbnail_path", { length: 191 }), // 300x300

      // SEO
      alt: varchar("alt", { length: 191 }),
      title: varchar("title", { length: 191 }),

      // Dimensions
      width: int("width"),
      height: int("height"),

      uploadedBy: int("uploaded_by").references(() => users.table.id, {
        onDelete: "set null",
      }),

      createdAt: datetime("created_at")
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
    },
    (table) => ({
      filenameIdx: index("media_filename_idx").on(table.filename),
      uploadedByIdx: index("media_uploaded_by_idx").on(table.uploadedBy),
    }),
  ),
});
