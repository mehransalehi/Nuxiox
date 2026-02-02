import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { defineTable } from "./../utils/schema-types";
import { sql } from "drizzle-orm";

export const users = defineTable({
  name: "users",
  priority: 10,
  table: sqliteTable("users", {
    id: integer("id").primaryKey({ autoIncrement: true }),
  
    username: text("username").notNull().unique(),
    email: text("email").notNull().unique(),
    token: text("token"),
  
    // Added Role Column
    // You can restrict this in TypeScript using .text<"admin" | "customer">()
    role: text("role").$type<"admin" | "user" >().default("user").notNull(),
  
    createdAt: text("created_at")
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
  
    updatedAt: text("updated_at")
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull()
      .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
  }),
});