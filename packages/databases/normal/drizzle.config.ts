import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  // Use 'postgresql', 'mysql', or 'sqlite' (D1 is sqlite)
  dialect: 'mysql',
  schema: './server/database/schema.gen.ts',
  out: './server/database/migrations',
  dbCredentials: {
    host: "localhost",
    user: "root",
    password: "12345678",
    database: "nuxiox",
  }
})
