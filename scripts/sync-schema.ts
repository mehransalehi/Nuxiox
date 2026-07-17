// scripts/sync-schema.ts
// Entry point for schema generation.
// Reads the canonical table definitions from layers/base/server/database/definitions.ts
// and generates dialect-specific schema files for the active database layer.
//
// Usage:
//   pnpm run db:sync                   # generates both dialects
//   pnpm run db:sync -- normal          # generates only normal (MySQL)
//   pnpm run db:sync -- cloudflare      # generates only cloudflare (D1/SQLite)
//
// After running, update server/database/schema.gen.ts to point to your active layer.

import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const generatorPath = path.resolve(__dirname, '../layers/databases/generate-schema.ts')

const args = process.argv.slice(2)
const targets = args.length > 0
  ? args
  : ['normal', 'cloudflare']  // generate both by default

const dialectMap: Record<string, string> = {
  normal: 'mysql',
  cloudflare: 'sqlite',
}

for (const target of targets) {
  const dialect = dialectMap[target]
  if (!dialect) {
    console.error(`Unknown target "${target}". Valid targets: normal, cloudflare`)
    process.exit(1)
  }

  console.log(`\nGenerating ${target} (${dialect}) schema...`)
  execSync(`npx tsx "${generatorPath}" ${dialect}`, {
    cwd: path.resolve(__dirname, '..'),
    stdio: 'inherit',
  })
}

console.log('\n✅ Schema generation complete.')
console.log('   Remember to update server/database/schema.gen.ts to point to your active layer.')
