#!/usr/bin/env tsx
/**
 * Nuxiox Setup CLI
 *
 * Interactive installer that guides the user through:
 * 1. Database selection (MySQL / Cloudflare D1)
 * 2. Media storage configuration (filesystem / KV / R2)
 * 3. Environment file generation
 * 4. Schema generation & database migrations
 * 5. Admin user creation
 * 6. Cloudflare deployment setup (optional)
 *
 * Usage: pnpm run setup
 */

import { execSync } from 'node:child_process'
import { createInterface } from 'node:readline'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

// ─── Helpers ────────────────────────────────────────────────────────────

const rl = createInterface({ input: process.stdin, output: process.stdout })

function ask(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question + ' ', (answer) => resolve(answer.trim()))
  })
}

async function confirm(question: string, defaultYes = true): Promise<boolean> {
  const hint = defaultYes ? '[Y/n]' : '[y/N]'
  const answer = await ask(`${question} ${hint}`)
  if (!answer) return defaultYes
  return answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes'
}

async function choose(question: string, options: { key: string; label: string }[]): Promise<string> {
  console.log(`\n${question}`)
  for (const opt of options) {
    console.log(`  ${opt.key}) ${opt.label}`)
  }
  while (true) {
    const answer = await ask('>')
    const match = options.find((o) => o.key === answer.toLowerCase())
    if (match) return match.key
    console.log(`Please enter one of: ${options.map((o) => o.key).join(', ')}`)
  }
}

function run(cmd: string, cwd = ROOT) {
  console.log(`\n$ ${cmd}`)
  execSync(cmd, { cwd, stdio: 'inherit' })
}

function step(msg: string) {
  console.log(`\n━━━ ${msg} ━━━`)
}

// ─── Main flow ──────────────────────────────────────────────────────────

async function main() {
  console.log(`
╔══════════════════════════════════════════╗
║         Nuxiox Setup Wizard             ║
║  Multi-Database CMS — Setup Assistant   ║
╚══════════════════════════════════════════╝
`)

  // ── 1. Database Selection ──────────────────────────────────────────
  step('Database Selection')
  const dbChoice = await choose('Which database would you like to use?', [
    { key: 'mysql', label: 'MySQL / MariaDB (normal approach)' },
    { key: 'cloudflare', label: 'Cloudflare D1 (SQLite, for Workers deployment)' },
  ])

  const isCloudflare = dbChoice === 'cloudflare'
  const dbLayer = isCloudflare ? 'cloudflare' : 'normal'
  const dbName = isCloudflare ? 'Cloudflare D1' : 'MySQL'

  console.log(`\n✓ Selected: ${dbName}`)

  // ── 2. Media Storage Configuration ─────────────────────────────────
  step('Media Storage Configuration')
  let mediaBackend: string
  if (isCloudflare) {
    mediaBackend = await choose('How should media files be stored?', [
      { key: 'kv', label: 'Workers KV (MEDIA_KV binding) — simple, 25MB limit per file' },
      { key: 'r2', label: 'R2 Object Storage (MEDIA_BUCKET binding) — production-ready, larger files' },
    ])
  } else {
    mediaBackend = 'local'
    console.log('  Using local filesystem storage (./uploads/)')
  }

  // ── 3. Environment / Configuration ─────────────────────────────────
  step('Configuration')
  const envPath = path.join(ROOT, '.env')

  if (!isCloudflare) {
    // MySQL environment variables
    console.log('MySQL connection details:')
    const dbHost = await ask('  Host [localhost]:') || 'localhost'
    const dbPort = await ask('  Port [3306]:') || '3306'
    const dbUser = await ask('  User [root]:') || 'root'
    const dbPassword = await ask('  Password:')
    const dbName_input = await ask('  Database name [nuxiox]:') || 'nuxiox'

    const envContent = `# Nuxiox — MySQL Configuration
DB_HOST=${dbHost}
DB_PORT=${dbPort}
DB_USER=${dbUser}
DB_PASSWORD=${dbPassword}
DB_NAME=${dbName_input}
`
    fs.writeFileSync(envPath, envContent)
    console.log(`\n✓ Wrote ${envPath}`)
  } else {
    // Cloudflare — no .env needed, but note the bindings
    console.log(`\n  Cloudflare D1 uses bindings. Make sure you have a wrangler.toml with:
    [[d1_databases]]
    binding = "DB"
    database_name = "nuxiox-db"
    database_id = "<your-database-id>"

    ${mediaBackend === 'kv' ? `[[kv_namespaces]]
    binding = "MEDIA_KV"
    id = "<your-kv-namespace-id>"` : `[[r2_buckets]]
    binding = "MEDIA_BUCKET"
    bucket_name = "nuxiox-media"`}`)
  }

  // ── 4. Update nuxt.config.ts for the database layer ────────────────
  step('Updating configuration files')

  // Update layers/dentist/nuxt.config.ts
  const dentistConfigPath = path.join(ROOT, 'layers/dentist/nuxt.config.ts')
  let dentistConfig = fs.readFileSync(dentistConfigPath, 'utf-8')

  // Replace the extends line to match the active database
  if (isCloudflare) {
    dentistConfig = dentistConfig.replace(
      /extends:\s*\[[^\]]*\]/,
      `extends: ['../databases/cloudflare','../base']`
    )
    // Ensure cloudflare-module preset
    if (!dentistConfig.includes('cloudflare-module')) {
      dentistConfig = dentistConfig.replace(
        /(modules:\s*\[[^\]]*\])/,
        `$1\n  nitro: {\n    preset: 'cloudflare-module',\n  },`
      )
    }
  } else {
    dentistConfig = dentistConfig.replace(
      /extends:\s*\[[^\]]*\]/,
      `extends: ['../databases/normal','../base']`
    )
    // Remove cloudflare-module preset if present
    dentistConfig = dentistConfig.replace(
      /nitro:\s*\{[^}]*cloudflare-module[^}]*\},?\n?/g,
      ''
    )
  }
  fs.writeFileSync(dentistConfigPath, dentistConfig)
  console.log('✓ Updated layers/dentist/nuxt.config.ts')

  // Update server/database/schema.gen.ts
  const schemaGenPath = path.join(ROOT, 'server/database/schema.gen.ts')
  let schemaGen = fs.readFileSync(schemaGenPath, 'utf-8')
  schemaGen = schemaGen.replace(
    /import \* as base from '.*?'/,
    `import * as base from '../../layers/databases/${dbLayer}/server/database/schema'`
  )
  fs.writeFileSync(schemaGenPath, schemaGen)
  console.log('✓ Updated server/database/schema.gen.ts')

  // ── 5. Install dependencies ────────────────────────────────────────
  step('Installing dependencies')
  run('pnpm install')

  // ── 6. Generate schema ─────────────────────────────────────────────
  step('Generating database schema')
  run(`pnpm run db:sync -- ${dbLayer}`)

  // ── 7. Run migrations ──────────────────────────────────────────────
  step('Running database migrations')
  if (isCloudflare) {
    // For D1, run drizzle-kit generate + apply via wrangler
    console.log('  Generating D1 migrations...')
    run('npx drizzle-kit generate --config=layers/databases/cloudflare/drizzle.config.ts')

    if (await confirm('Apply migrations to local D1 database?', true)) {
      run('npx wrangler d1 migrations apply nuxiox-db --local')
    }
    if (await confirm('Apply migrations to remote D1 database?', false)) {
      run('npx wrangler d1 migrations apply nuxiox-db --remote')
    }
  } else {
    // For MySQL, run drizzle-kit migrate
    console.log('  Running MySQL migrations...')
    run('npx drizzle-kit migrate --config=layers/databases/normal/drizzle.config.ts')
  }

  // ── 8. Build project ───────────────────────────────────────────────
  step('Building project')
  if (await confirm('Build the project now?', false)) {
    run('pnpm run build')
  }

  // ── 9. Create admin user ───────────────────────────────────────────
  step('Admin user creation')
  if (await confirm('Create an admin user now? The first login via the app will auto-create one, but you can also seed one now.', true)) {
    // This is informational — actual admin creation happens on first login
    console.log(`
  Admin auto-creation: The first login to /admin creates an admin user automatically.
  Just start the dev server and navigate to /admin to set up your admin account.
  `)
  }

  // ── 10. Cloudflare Deployment Setup ────────────────────────────────
  if (isCloudflare) {
    step('Cloudflare Deployment Setup')
    if (await confirm('Set up Cloudflare deployment?', true)) {
      console.log('')
      const isLoggedIn = await confirm('Are you already logged in to Cloudflare via wrangler?', false)

      if (!isLoggedIn) {
        console.log('  Logging in to Cloudflare...')
        run('npx wrangler login')
      }

      // Create D1 database
      if (await confirm('Create Cloudflare D1 database?', true)) {
        run('npx wrangler d1 create nuxiox-db')
        console.log(`
  IMPORTANT: After creating the D1 database, copy the database_id from the output
  and add it to your wrangler.toml:

  [[d1_databases]]
  binding = "DB"
  database_name = "nuxiox-db"
  database_id = "<your-database-id>"
        `)
      }

      // Create KV namespace for media
      if (mediaBackend === 'kv' && await confirm('Create KV namespace for media storage?', true)) {
        run('npx wrangler kv namespace create MEDIA_KV')
        console.log(`
  Add this to your wrangler.toml:

  [[kv_namespaces]]
  binding = "MEDIA_KV"
  id = "<your-kv-namespace-id>"
        `)
      }

      // Create R2 bucket for media
      if (mediaBackend === 'r2' && await confirm('Create R2 bucket for media storage?', true)) {
        run('npx wrangler r2 bucket create nuxiox-media')
        console.log(`
  Add this to your wrangler.toml:

  [[r2_buckets]]
  binding = "MEDIA_BUCKET"
  bucket_name = "nuxiox-media"
        `)
      }

      // Set secrets
      if (await confirm('Set Cloudflare secrets? (session secret, etc.)', true)) {
        const sessionSecret = await ask('Enter a session secret (or leave blank to generate one):')
        const secret = sessionSecret || require('crypto').randomBytes(32).toString('hex')
        run(`echo "${secret}" | npx wrangler secret put NUXT_SESSION_PASSWORD`)
        console.log('✓ NUXT_SESSION_PASSWORD set')
      }

      // Deploy
      if (await confirm('Deploy to Cloudflare Workers now?', false)) {
        run('npx wrangler deploy')
        console.log('✓ Deployed!')
      }
    }
  }

  // ── Summary ────────────────────────────────────────────────────────
  step('Setup Complete!')
  console.log(`
  ┌──────────────────────────────────────────────────┐
  │  Summary:                                        │
  │                                                  │
  │  Database:  ${dbName.padEnd(40)}│
  │  Media:     ${mediaBackend.padEnd(40)}│
  │  Schema:    Generated ✓                          │
  │  Migrations: Run ✓                               │
  │                                                  │
  │  Next steps:                                     │
  │  1. Start dev server:  pnpm run dev              │
  │  2. Open /admin in browser                       │
  │  3. First login creates your admin account       │
  │  4. Configure site settings in the admin panel   │
  │                                                  │
  │  ${isCloudflare ? 'Deploy:    pnpm run build && npx wrangler deploy' : 'Deploy:    pnpm run build && node .output/server/index.mjs'}
  └──────────────────────────────────────────────────┘
  `)

  rl.close()
}

main().catch((err) => {
  console.error('\n❌ Setup failed:', err.message)
  process.exit(1)
})