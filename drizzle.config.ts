import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  // Use 'postgresql', 'mysql', or 'sqlite' (D1 is sqlite)
  dialect: 'sqlite', 
  schema: './server/database/schema.gen.ts',
  out: './server/database/migrations',
})