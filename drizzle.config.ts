import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  // Use 'postgresql', 'mysql', or 'sqlite' (D1 is sqlite)
  dialect: 'sqlite',
  schema: './server/database/schema.gen.ts',
  out: './server/database/migrations',
  dbCredentials: {
    url: 'file:./.wrangler/state/v3/d1/miniflare-D1DatabaseObject/008d5483b2b5c8a40e8d0830c7ff50f93175a17c427dc0543d2e8f5988e5a3b0.sqlite',
  }
})