import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const admins = sqliteTable("admins", {
  // SQLite handles auto-increment differently than PG/MySQL
  id: integer("id").primaryKey({ autoIncrement: true }),
  
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  token: text("token"),
  
  // Storing as a string (ISO format) is common for SQLite
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
    
  // Handled by Drizzle's runtime for automatic updates
  updatedAt: text("updated_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull()
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});