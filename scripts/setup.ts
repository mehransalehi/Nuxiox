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

// ─── Colors ─────────────────────────────────────────────────────────────

const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  bgCyan: '\x1b[46m',
  bgGreen: '\x1b[42m',
  bgBlue: '\x1b[44m',
  white: '\x1b[37m',
}

// ─── Helpers ────────────────────────────────────────────────────────────

const rl = createInterface({ input: process.stdin, output: process.stdout })

function ask(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question + ' ', (answer: string) => resolve(answer.trim()))
  })
}

async function confirm(question: string, defaultYes = true): Promise<boolean> {
  const hint = defaultYes ? `${C.green}Y${C.reset}/${C.dim}n${C.reset}` : `${C.dim}y${C.reset}/${C.red}N${C.reset}`
  const answer = await ask(`${C.cyan}?${C.reset} ${C.bold}${question}${C.reset} ${hint}`)
  if (!answer) return defaultYes
  return answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes'
}

async function choose<T>(
  question: string,
  options: { label: string; value: T; hint?: string }[],
): Promise<T> {
  console.log(`\n  ${C.bold}${question}${C.reset}`)
  for (let i = 0; i < options.length; i++) {
    const opt = options[i]
    const hint = opt.hint ? ` ${C.dim}— ${opt.hint}${C.reset}` : ''
    console.log(`    ${C.cyan}${i + 1}${C.reset}${C.dim}.${C.reset} ${opt.label}${hint}`)
  }
  while (true) {
    const answer = (await ask(`  ${C.cyan}Enter number${C.reset} ${C.dim}(1-${options.length})${C.reset}`)).trim()
    const num = parseInt(answer, 10)
    if (num >= 1 && num <= options.length) {
      return options[num - 1].value
    }
    console.log(`  ${C.red}✗${C.reset} Please enter a number between 1 and ${options.length}`)
  }
}

function run(cmd: string, cwd = ROOT) {
  console.log(`\n  ${C.dim}$ ${cmd}${C.reset}`)
  execSync(cmd, { cwd, stdio: 'inherit' })
}

/** Run a command and return its combined stdout+stderr output. Doesn't throw — returns { stdout, exitCode }. */
function runCapture(cmd: string, cwd = ROOT): { stdout: string; exitCode: number } {
  console.log(`\n  ${C.dim}$ ${cmd}${C.reset}`)
  try {
    const stdout = execSync(cmd, { cwd, encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] })
    return { stdout: stdout.trim(), exitCode: 0 }
  } catch (e: any) {
    return { stdout: (e.stderr || e.stdout || e.message || '').toString().trim(), exitCode: e.status ?? 1 }
  }
}

function step(msg: string) {
  const line = `─── ${msg} ───`
  const pad = '─'.repeat(Math.max(0, 40 - line.length))
  console.log(`\n${C.bold}${C.cyan}${line}${pad}${C.reset}`)
}

function success(msg: string) {
  console.log(`  ${C.green}✓${C.reset} ${msg}`)
}

function info(msg: string) {
  console.log(`  ${C.blue}ℹ${C.reset} ${msg}`)
}

function warn(msg: string) {
  console.log(`  ${C.yellow}⚠${C.reset} ${msg}`)
}

// ─── Banner ─────────────────────────────────────────────────────────────

function showBanner() {
  console.log(`
  ${C.cyan}${C.bold}╔══════════════════════════════════════════╗${C.reset}
  ${C.cyan}${C.bold}║${C.reset}          ${C.bold}Nuxiox Setup Wizard${C.reset}          ${C.cyan}${C.bold}║${C.reset}
  ${C.cyan}${C.bold}║${C.reset}  ${C.dim}Multi-Database CMS — Setup Assistant${C.reset}  ${C.cyan}${C.bold}║${C.reset}
  ${C.cyan}${C.bold}╚══════════════════════════════════════════╝${C.reset}
  `)
}

// ─── Main flow ──────────────────────────────────────────────────────────

async function main() {
  showBanner()

  // ── 1. Database Selection ──────────────────────────────────────────
  step('Database Selection')
  const isCloudflare = await choose<string>(
    'Which database would you like to use?',
    [
      { label: `${C.green}MySQL / MariaDB${C.reset}`, value: 'no', hint: 'Normal relational approach' },
      { label: `${C.blue}Cloudflare D1${C.reset} ${C.yellow}(SQLite)${C.reset}`, value: 'yes', hint: 'For Workers deployment' },
    ],
  ) === 'yes'

  const dbLayer = isCloudflare ? 'cloudflare' : 'normal'
  const dbName = isCloudflare ? `${C.blue}Cloudflare D1${C.reset}` : `${C.green}MySQL${C.reset}`

  success(`Selected: ${dbName}`)

  // ── 2. Template / Theme Selection ───────────────────────────────────
  step('Template Selection')

  // Auto-discover template layers (exclude base and databases/)
  const templateLayers: { name: string; path: string; description: string }[] = []
  const layersDir = path.join(ROOT, 'layers')
  for (const entry of fs.readdirSync(layersDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    if (entry.name === 'base' || entry.name === 'databases') continue
    const nuxtConfigPath = path.join(layersDir, entry.name, 'nuxt.config.ts')
    const appPath = path.join(layersDir, entry.name, 'app')
    if (!fs.existsSync(nuxtConfigPath)) continue

    // Count sections and pages for description
    let sectionsCount = 0
    let hasBlog = false
    const sectionsDir = path.join(appPath, 'components/sections')
    if (fs.existsSync(sectionsDir)) {
      sectionsCount = fs.readdirSync(sectionsDir).filter(f => f.endsWith('.vue')).length
    }
    const blogPagesDir = path.join(appPath, 'pages/blog')
    hasBlog = fs.existsSync(blogPagesDir)

    templateLayers.push({
      name: entry.name,
      path: entry.name,
      description: `${sectionsCount} section${sectionsCount !== 1 ? 's' : ''}${hasBlog ? ' + blog' : ''}`,
    })
  }

  if (templateLayers.length === 0) {
    warn('No template layers found in layers/ — defaulting to "dentist"')
  }

  let chosenTemplate = templateLayers.length > 0
    ? await choose<string>(
        'Which frontend template / theme would you like to use?',
        templateLayers.map(t => ({
          label: `${t.name}`,
          value: t.name,
          hint: t.description,
        })),
      )
    : 'dentist'

  success(`Selected template: ${chosenTemplate}`)

  // ── 3. Media Storage Configuration ─────────────────────────────────
  step('Media Storage Configuration')

  let mediaBackend: string
  if (isCloudflare) {
    mediaBackend = await choose<string>(
      'How should media files be stored?',
      [
        { label: 'Workers KV', value: 'kv', hint: 'MEDIA_KV binding — simple, 25MB limit per file' },
        { label: 'R2 Object Storage', value: 'r2', hint: 'MEDIA_BUCKET binding — production-ready, larger files' },
      ],
    )
  } else {
    mediaBackend = 'local'
    info('Using local filesystem storage (./uploads/)')
  }

  // ── 3. Environment / Configuration ─────────────────────────────────
  step('Configuration')

  if (!isCloudflare) {
    console.log(`  ${C.dim}MySQL connection details:${C.reset}`)
    const dbHost = (await ask(`  ${C.dim}Host${C.reset} [${C.dim}localhost${C.reset}]:`)) || 'localhost'
    const dbPort = (await ask(`  ${C.dim}Port${C.reset} [${C.dim}3306${C.reset}]:`)) || '3306'
    const dbUser = (await ask(`  ${C.dim}User${C.reset} [${C.dim}root${C.reset}]:`)) || 'root'
    const dbPassword = await ask(`  ${C.dim}Password${C.reset}:`)
    const dbNameInput = (await ask(`  ${C.dim}Database name${C.reset} [${C.dim}nuxiox${C.reset}]:`)) || 'nuxiox'

    const envContent = `# Nuxiox — MySQL Configuration
DB_HOST=${dbHost}
DB_PORT=${dbPort}
DB_USER=${dbUser}
DB_PASSWORD=${dbPassword}
DB_NAME=${dbNameInput}
`
    fs.writeFileSync(path.join(ROOT, '.env'), envContent)
    success(`Wrote .env file`)
  } else {
    const bindingType = mediaBackend === 'kv' ? 'KV' : 'R2'
    info(`Make sure your wrangler.toml has these bindings:
    ${C.dim}[[d1_databases]]
    binding = "DB"
    database_name = "nuxiox-db"
    database_id = "<your-database-id>"

    ${mediaBackend === 'kv' ? `[[kv_namespaces]]
    binding = "MEDIA_KV"
    id = "<your-kv-namespace-id>"` : `[[r2_buckets]]
    binding = "MEDIA_BUCKET"
    bucket_name = "nuxiox-media"`}${C.reset}`)
  }

  // ── 4. Update config files for the chosen template and database ────
  step('Updating configuration files')

  // 4a. Update root nuxt.config.ts to extend the chosen template
  const rootConfigPath = path.join(ROOT, 'nuxt.config.ts')
  let rootConfig = fs.readFileSync(rootConfigPath, 'utf-8')
  rootConfig = rootConfig.replace(
    /extends:\s*\[[^\]]*\]/,
    `extends: ['./layers/${chosenTemplate}']`,
  )
  fs.writeFileSync(rootConfigPath, rootConfig)
  success(`Updated root nuxt.config.ts → extends ./layers/${chosenTemplate}`)

  // 4b. Update the chosen template's nuxt.config.ts to extend the correct database layer
  const themeConfigPath = path.join(ROOT, `layers/${chosenTemplate}/nuxt.config.ts`)
  let themeConfig: string
  try {
    themeConfig = fs.readFileSync(themeConfigPath, 'utf-8')
  } catch {
    warn(`Could not read ${themeConfigPath} — creating it`)
    themeConfig = `export default defineNuxtConfig({\n  extends: [],\n})`
  }

  if (isCloudflare) {
    // Set extends to [database, base]
    if (themeConfig.includes('../databases/')) {
      themeConfig = themeConfig.replace(
        /extends:\s*\[[^\]]*\]/,
        `extends: ['../databases/cloudflare','../base']`,
      )
    } else {
      themeConfig = themeConfig.replace(
        /extends:\s*\[[^\]]*\]/,
        `extends: ['../databases/cloudflare','../base'],\n  nitro: {\n    preset: 'cloudflare-module',\n  }`,
      )
    }
    // Ensure cloudflare-module preset exists
    if (!themeConfig.includes('cloudflare-module')) {
      themeConfig = themeConfig.replace(
        /(extends:\s*\[[^\]]*\])/,
        `$1,\n  nitro: {\n    preset: 'cloudflare-module',\n  }`,
      )
    }
  } else {
    // Normal/MySQL — set extends to [database, base], remove cloudflare preset
    themeConfig = themeConfig.replace(
      /extends:\s*\[[^\]]*\]/,
      `extends: ['../databases/normal','../base']`,
    )
    themeConfig = themeConfig.replace(/nitro:\s*\{[^}]*\},?\n?/g, '')
  }
  fs.writeFileSync(themeConfigPath, themeConfig)
  success(`Updated layers/${chosenTemplate}/nuxt.config.ts → extends ${isCloudflare ? 'cloudflare' : 'normal'} + base`)

  // 4c. Update server/database/schema.gen.ts
  const schemaGenPath = path.join(ROOT, 'server/database/schema.gen.ts')
  let schemaGen = fs.readFileSync(schemaGenPath, 'utf-8')
  schemaGen = schemaGen.replace(
    /import \* as base from '.*?'/,
    `import * as base from '../../packages/databases/${dbLayer}/server/database/schema'`,
  )
  fs.writeFileSync(schemaGenPath, schemaGen)
  success('Updated server/database/schema.gen.ts')

  // ── 5. Install dependencies ────────────────────────────────────────
  step('Installing dependencies')
  run('pnpm install')

  // ── 6. Generate schema ─────────────────────────────────────────────
  step('Generating database schema')
  // Call tsx directly instead of pnpm run to avoid -- arg passthrough issues
  run(`npx tsx scripts/sync-schema.ts ${dbLayer}`)

  // ── 7. Run migrations ──────────────────────────────────────────────
  step('Running database migrations')
  if (isCloudflare) {
    info('Generating D1 migrations...')
    run('npx drizzle-kit generate --config=layers/databases/cloudflare/drizzle.config.ts')

    // Find the generated migration SQL file (drizzle-kit outputs 0000_*.sql)
    const migrationsDir = path.join(ROOT, 'server/database/migrations')
    const sqlFiles = fs.readdirSync(migrationsDir)
      .filter(f => /^\d+.*\.sql$/.test(f))  // only drizzle-kit migration files
      .sort()
    const migrationFile = sqlFiles.pop()

    // Read the D1 database name from wrangler.toml (if it exists)
    const wranglerTomlPath = path.join(ROOT, 'wrangler.toml')
    let d1DbName = 'nuxiox-db'
    if (fs.existsSync(wranglerTomlPath)) {
      const toml = fs.readFileSync(wranglerTomlPath, 'utf-8')
      const nameMatch = toml.match(/database_name\s*=\s*"([^"]+)"/)
      if (nameMatch) d1DbName = nameMatch[1]
    }

    if (!migrationFile) {
      warn('No migration SQL files found in server/database/migrations/')
    } else {
      const migrationPath = `server/database/migrations/${migrationFile}`
      const fullMigrationPath = path.join(migrationsDir, migrationFile)
      info(`Found migration: ${migrationPath}`)
      info(`D1 database name: ${d1DbName}`)

      // Extract table names from the migration SQL for drop-on-recreate
      const migrationSql = fs.readFileSync(fullMigrationPath, 'utf-8')
      const tableNames: string[] = []
      const tableRegex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?`?(\w+)`?\s*\(/gi
      let m
      while ((m = tableRegex.exec(migrationSql)) !== null) {
        tableNames.push(m[1])
      }

      async function applyD1Migration(mode: 'local' | 'remote', defaultYes: boolean) {
        if (!(await confirm(`Apply migrations to ${mode} D1 database?`, defaultYes))) return

        // For local: use sqlite3 directly on the D1 SQLite file
        // For remote: use wrangler d1 execute --remote
        if (mode === 'local') {
          // Find the local D1 SQLite file
          const d1Dir = path.join(ROOT, '.wrangler/state/v3/d1/miniflare-D1DatabaseObject')
          let dbPath = ''
          try {
            const d1Files = fs.readdirSync(d1Dir)
            const sqliteFile = d1Files.find(f => f.endsWith('.sqlite'))
            if (sqliteFile) dbPath = path.join(d1Dir, sqliteFile)
          } catch { /* no local D1 state */ }

          if (!dbPath || !fs.existsSync(dbPath)) {
            warn(`No local D1 database found at ${d1Dir}. Start the dev server first (pnpm run dev) to create it.`)
            return
          }

          // Check if tables exist
          const result = execSync(
            `sqlite3 "${dbPath}" ".tables"`,
            { cwd: ROOT, encoding: 'utf-8', timeout: 10000 },
          )
          const existingTables = result.trim().split(/\s+/).filter(Boolean)
          const ourTables = existingTables.filter(t =>
            !t.startsWith('_cf_') && !t.startsWith('d1_') && !t.startsWith('__drizzle'),
          )

          if (ourTables.length > 0) {
            const action = await choose(
              `Local D1 database already has ${ourTables.length} tables. What would you like to do?`,
              [
                { label: 'Skip — database already set up', value: 'skip' },
                { label: 'Recreate — drop all tables and re-run migration', value: 'recreate' },
              ],
            )
            if (action === 'skip') {
              info('Skipping local D1 migration')
              return
            }
            // Drop all tables
            info('Dropping existing tables...')
            const dropSql = tableNames.map(t => `DROP TABLE IF EXISTS \`${t}\`;`).join('\n')
            execSync(`sqlite3 "${dbPath}" "${dropSql.replace(/"/g, '\\"')}"`, { cwd: ROOT, timeout: 30000 })
            success('Tables dropped')
          }

          // Apply migration
          info('Applying migration to local D1 database...')
          execSync(`sqlite3 "${dbPath}" < "${fullMigrationPath}"`, { cwd: ROOT, timeout: 30000, shell: true })
          success('Migration applied to local D1 database')

        } else {
          // Remote: use wrangler d1 execute --remote
          const flag = '--remote'

          // Check if logged in to Cloudflare
          const loginCheck = runCapture('npx wrangler whoami 2>&1')
          if (loginCheck.exitCode !== 0 || loginCheck.stdout.includes('You are not authenticated')) {
            warn('Not logged in to Cloudflare. Remote D1 operations need authentication.')
            if (await confirm('Login to Cloudflare via wrangler now?', true)) {
              run('npx wrangler login')
              success('Logged in to Cloudflare')
            } else {
              info('Skipping remote D1 migration — run `npx wrangler login` then try again.')
              return
            }
          }

          // ── Check if the D1 database actually exists on Cloudflare ──
          // Use `wrangler d1 list --json` which is a proper resource existence check,
          // NOT `wrangler d1 execute --remote` which requires the DB to be fully
          // provisioned and executable (fails for many reasons other than "doesn't exist").
          const listResult = runCapture('npx wrangler d1 list --json 2>&1')
          let dbExists = false
          let actualUuid = ''
          if (listResult.exitCode === 0) {
            try {
              const dbs = JSON.parse(listResult.stdout) as Array<{ name: string; uuid: string }>
              const found = dbs.find(d => d.name === d1DbName)
              if (found) {
                dbExists = true
                actualUuid = found.uuid
                // Sync database_id in wrangler.toml if it's missing or out of date
                const wranglerPath = path.join(ROOT, 'wrangler.toml')
                if (fs.existsSync(wranglerPath)) {
                  let c = fs.readFileSync(wranglerPath, 'utf-8')
                  const existingMatch = c.match(/database_id\s*=\s*"([^"]+)"/)
                  if (!existingMatch || existingMatch[1] !== actualUuid) {
                    c = c.replace(/database_id\s*=\s*"[^"]*"/, `database_id = "${actualUuid}"`)
                    fs.writeFileSync(wranglerPath, c)
                    success(`wrangler.toml database_id synced to match actual database "${d1DbName}"`)
                  }
                }
              }
            } catch {
              // Try parsing 'wrangler d1 list' text output as fallback
              dbExists = listResult.stdout.includes(d1DbName)
            }
          }

          if (!dbExists) {
            warn(`Remote D1 database "${d1DbName}" not found on your Cloudflare account.`)
            if (await confirm('Create a new D1 database on Cloudflare now?', true)) {
              const createResult = runCapture(`npx wrangler d1 create ${d1DbName} 2>&1`)
              if (createResult.exitCode === 0) {
                // Extract the database_id from the creation output
                const uuidMatch = createResult.stdout.match(/database_id\s*=\s*"([a-f0-9-]+)"/i)
                if (uuidMatch) {
                  success(`Created D1 database "${d1DbName}"`)
                  // Try to update wrangler.toml with the new ID
                  const wranglerPath = path.join(ROOT, 'wrangler.toml')
                  if (fs.existsSync(wranglerPath)) {
                    let c = fs.readFileSync(wranglerPath, 'utf-8')
                    c = c.replace(/database_id\s*=\s*"[^"]*"/, `database_id = "${uuidMatch[1]}"`)
                    fs.writeFileSync(wranglerPath, c)
                    success('wrangler.toml database_id updated')
                  }
                  info('Database created. Re-run the migration step to apply it.')
                } else {
                  warn(`Created D1 database but could not parse its ID from output:`)
                  console.log(`  ${C.dim}${createResult.stdout.slice(0, 300)}${C.reset}`)
                  info(`Update database_id in wrangler.toml manually, then re-run setup.`)
                }
              } else {
                warn(`Failed to create database: ${createResult.stdout.slice(0, 200)}`)
              }
            }
            return  // Don't try to migrate — DB either didn't exist or was just created
          }

          // ── Database exists — check if it already has tables ──
          const checkResult = runCapture(
            `npx wrangler d1 execute ${d1DbName} ${flag} --command="SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'd1_%' AND name NOT LIKE '_cf_%' AND name NOT LIKE '__drizzle%' LIMIT 1" --json`,
          )
          let tablesExist = false
          if (checkResult.exitCode === 0) {
            const lines = checkResult.stdout.split('\n')
            for (const line of lines) {
              try {
                const parsed = JSON.parse(line)
                if (parsed.results && parsed.results.length > 0) tablesExist = true
              } catch { /* skip non-JSON lines */ }
            }
          } else {
            // execute failed despite DB existing — warn and continue
            warn(`Could not query remote D1 database: ${checkResult.stdout.slice(0, 200)}`)
            info('Will attempt to apply migration anyway...')
          }

          if (tablesExist) {
            const action = await choose(
              `Remote D1 database ${C.bold}${d1DbName}${C.reset} already has tables. What would you like to do?`,
              [
                { label: 'Skip — remote database already set up', value: 'skip' },
                { label: 'Recreate — drop all tables and re-run migration', value: 'recreate' },
              ],
            )
            if (action === 'skip') {
              info('Skipping remote D1 migration')
              return
            }
            info('Dropping existing tables on remote...')
            const dropSql = tableNames.map(t => `DROP TABLE IF EXISTS \`${t}\`;`).join('\n')
            const cleanupPath = path.join(ROOT, 'server/database/migrations/_cleanup.sql')
            fs.writeFileSync(cleanupPath, dropSql)
            const dropResult = runCapture(`npx wrangler d1 execute ${d1DbName} ${flag} --file=server/database/migrations/_cleanup.sql`)
            if (dropResult.exitCode === 0 || dropResult.stdout.includes('already exists')) {
              success('Remote tables dropped')
            } else {
              warn(`Failed to drop remote tables: ${dropResult.stdout.slice(0, 200)}`)
              info('Continuing with migration attempt...')
            }
            try { fs.unlinkSync(cleanupPath) } catch { /* ignore */ }
          }

          // Apply migration — use runCapture so we can inspect errors
          const migrateResult = runCapture(`npx wrangler d1 execute ${d1DbName} ${flag} --file=${migrationPath}`)
          if (migrateResult.exitCode === 0) {
            success('Migration applied to remote D1 database')
          } else {
            const err = migrateResult.stdout
            if (err.includes('already exists')) {
              success('Migration already applied to remote D1 database')
            } else {
              warn(`Remote migration note: ${err.slice(0, 300)}`)
              info('You can also deploy and run migrations later manually.')
            }
          }
        }
      }

      await applyD1Migration('local', true)
      await applyD1Migration('remote', false)
    }
  } else {
    info('Running MySQL migrations...')
    run('npx drizzle-kit migrate --config=layers/databases/normal/drizzle.config.ts')
  }

  // ── 8. Build project ───────────────────────────────────────────────
  step('Build')
  if (await confirm('Build the project now?', false)) {
    run('pnpm run build')
    success('Build complete')
  }

  // ── 9. Admin user ──────────────────────────────────────────────────
  step('Admin user')
  info(`The first login at ${C.bold}/admin${C.reset} auto-creates an admin account.
  ${C.dim}Start the dev server and navigate to /admin to set it up.${C.reset}`)

  // ── 10. Cloudflare Deployment Setup ────────────────────────────────
  if (isCloudflare) {
    step('Cloudflare Deployment')
    if (await confirm('Set up Cloudflare deployment?', true)) {
      if (!(await confirm('Are you already logged in to Cloudflare via wrangler?', false))) {
        info('Opening Cloudflare login...')
        run('npx wrangler login')
        success('Logged in to Cloudflare')
      }

      const wranglerPath = path.join(ROOT, 'wrangler.toml')
      // --- D1 database: verify it exists on Cloudflare, create if missing ---
      const d1Id = (() => {
        try {
          const c = fs.readFileSync(wranglerPath, 'utf-8')
          const m = c.match(/database_id\s*=\s*"([^"]+)"/)
          return m ? m[1] : ''
        } catch { return '' }
      })()
      const d1Exists = d1Id && !d1Id.includes('<') && d1Id !== 'local'
        ? runCapture('npx wrangler d1 list 2>&1').stdout.includes(d1Id)
        : false
      if (!d1Exists) {
              if (await confirm('Create the D1 database on Cloudflare?', true)) {
                info('Creating D1 database...')
                const result = runCapture('npx wrangler d1 create nuxiox_db 2>&1')
                const m = result.stdout.match(/database_id\s*=\s*"([a-f0-9-]+)"/i)
                if (m) {
                  let c = fs.readFileSync(wranglerPath, 'utf-8')
                  c = c.replace(/database_id\s*=\s*"[^"]*"/, `database_id = "${m[1]}"`)
                  fs.writeFileSync(wranglerPath, c)
                  success('D1 database created and wrangler.toml updated')
                } else {
                  warn('Could not parse D1 database ID. Update wrangler.toml manually.')
                }
              }
            } else {
              info(`D1 database already exists on Cloudflare`)
            }

      // --- KV namespace: create on Cloudflare if still placeholder ---
      if (mediaBackend === 'kv') {
        const kvId = (() => {
          try {
            const c = fs.readFileSync(wranglerPath, 'utf-8')
            const m = c.match(/^id\s*=\s*"([^"]+)"/m)
            return m ? m[1] : ''
          } catch { return '' }
        })()
        if (!kvId || kvId.includes('TODO') || kvId.includes('<')) {
          if (await confirm('Create KV namespace for MEDIA_KV?', true)) {
            info('Creating KV namespace...')
            const result = runCapture('npx wrangler kv namespace create MEDIA_KV 2>&1')
            const m = result.stdout.match(/id\s*=\s*"([a-f0-9-]+)"/i)
            if (m) {
              let c = fs.readFileSync(wranglerPath, 'utf-8')
              c = c.replace(/^id\s*=\s*"[^"]*"/m, `id = "${m[1]}"`)
              c = c.replace(/preview_id\s*=\s*"[^"]*"/m, `preview_id = "${m[1]}"`)
              fs.writeFileSync(wranglerPath, c)
              success('KV namespace created and wrangler.toml updated')
            } else {
              warn('Could not parse KV namespace ID. Update wrangler.toml manually.')
            }
          }
        } else {
          info('KV namespace already configured')
        }
      }

      // --- R2 bucket ---
      if (mediaBackend === 'r2' && (await confirm('Create R2 bucket for media storage?', true))) {
        runCapture('npx wrangler r2 bucket create nuxiox-media 2>&1')
        success('R2 bucket configured')
      }

      if (await confirm('Set NUXT_SESSION_PASSWORD secret for Cloudflare?', true)) {
        const sessionSecret = await ask(`  ${C.dim}Enter a session secret (or leave blank to generate one):${C.reset}`)
        const secret = sessionSecret || [...Array(64)].map(() => Math.random().toString(36)[2]).join('')
        run(`echo "${secret}" | npx wrangler secret put NUXT_SESSION_PASSWORD`)
        success('NUXT_SESSION_PASSWORD set')
      }

      // --- Pre-deploy check: scan wrangler.toml for placeholder values ---
      const tomlContent = fs.readFileSync(wranglerPath, 'utf-8')
      const placeholderLines = tomlContent.split('\n').filter(l => l.includes('TODO') || l.includes('<your-'))
      if (placeholderLines.length > 0) {
        warn('wrangler.toml still has placeholder values:')
        for (const line of placeholderLines) {
          console.log(`    ${C.yellow}${line.trim()}${C.reset}`)
        }
        if (await confirm('Deploy anyway? (will fail if placeholders remain)', false)) {
          run('pnpm run build')
          run('npx wrangler deploy')
        } else {
          info('Fix the placeholders in wrangler.toml, then deploy with: npx wrangler deploy')
        }
      } else {
        if (await confirm('Deploy to Cloudflare Workers now?', true)) {
          run('pnpm run build')
          run('npx wrangler deploy')
          success('Deployed to Cloudflare Workers!')
        }
      }
    }
  }

  // ── Summary ────────────────────────────────────────────────────────
  step('Setup Complete!')
  console.log(`
  ${C.bold}${C.green}✓${C.reset} ${C.bold}Summary${C.reset}
  ${C.dim}──────────────────────────────────────────${C.reset}
   ${C.cyan}●${C.reset} Database:  ${isCloudflare ? `${C.blue}Cloudflare D1${C.reset}` : `${C.green}MySQL${C.reset}`}
   ${C.cyan}●${C.reset} Media:     ${mediaBackend === 'local' ? 'Local filesystem' : mediaBackend === 'kv' ? 'Workers KV' : 'R2 Object Storage'}
   ${C.cyan}●${C.reset} Schema:    ${C.green}Generated ✓${C.reset}
   ${C.cyan}●${C.reset} Migrations: ${C.green}Run ✓${C.reset}

  ${C.bold}${C.blue}Next steps${C.reset}
  ${C.dim}──────────────────────────────────────────${C.reset}
   1. Start dev server:  ${C.cyan}pnpm run dev${C.reset}
   2. Open ${C.bold}/admin${C.reset} in your browser
   3. First login creates your admin account
   4. Configure site settings in the admin panel

  ${C.bold}Deploy${C.reset}
  ${C.dim}──────────────────────────────────────────${C.reset}
   ${isCloudflare
    ? `  ${C.cyan}$ pnpm run build && npx wrangler deploy${C.reset}`
    : `  ${C.cyan}$ pnpm run build && node .output/server/index.mjs${C.reset}`}
  `)

  rl.close()
}

main().catch((err) => {
  console.error(`\n  ${C.red}✗${C.reset} Setup failed: ${err.message}`)
  process.exit(1)
})