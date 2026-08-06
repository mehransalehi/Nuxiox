/**
 * Database Seed Script
 *
 * Seeds the local D1 database with mock data for development/testing.
 * Run after applying migrations: pnpm run db:seed
 *
 * Usage: pnpm run db:seed
 * Requires: wrangler.toml with D1 database configured
 */

import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const DB_NAME = 'nuxiox_db'
const SQL_FILE = resolve(__dirname, 'seed.sql')

console.log('🌱 Seeding database from', SQL_FILE, '\n')

try {
  execSync(
    `npx wrangler d1 execute ${DB_NAME} --local --file="${SQL_FILE}"`,
    { stdio: 'inherit', timeout: 30000, cwd: resolve(__dirname, '..') },
  )
  console.log('\n✅ Seed complete!')
} catch (e: any) {
  console.error('\n❌ Seed failed:', e.stderr?.slice(0, 300) || e.message)
  process.exit(1)
}