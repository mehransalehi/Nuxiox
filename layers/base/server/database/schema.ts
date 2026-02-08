import { sqliteTable, integer, text,index } from "drizzle-orm/sqlite-core";
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
