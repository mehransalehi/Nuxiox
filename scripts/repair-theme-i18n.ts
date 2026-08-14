#!/usr/bin/env tsx
/**
 * Repair: re-run the fixed data-i18n injector over an existing theme's
 * .vue files (components + pages + layouts + ui) to backfill the
 * data-i18n attributes the old buggy converter missed.
 *
 * Usage:
 *   tsx scripts/repair-theme-i18n.ts [theme-name]
 *   (default: mim-beauty)
 *
 * Idempotent — tags that already have data-i18n are left untouched.
 */
import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { injectDataI18n } from './inject-i18n.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const themeName = process.argv[2] || 'mim-beauty'
const themeAppDir = path.resolve(ROOT, `packages/themes/${themeName}/app`)

if (!fs.existsSync(themeAppDir)) {
  console.error(`Theme app dir not found: ${themeAppDir}`)
  process.exit(1)
}

const files: string[] = []
function walk(dir: string) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full)
    else if (entry.name.endsWith('.vue')) files.push(full)
  }
}
walk(themeAppDir)

let changed = 0
let added = 0
for (const file of files) {
  const original = fs.readFileSync(file, 'utf-8')
  const repaired = injectDataI18n(original)
  if (repaired !== original) {
    const addedCount = (repaired.match(/data-i18n=/g) || []).length
      - (original.match(/data-i18n=/g) || []).length
    fs.writeFileSync(file, repaired, 'utf-8')
    changed++
    added += addedCount
    console.log(`  ✔ ${path.relative(ROOT, file)}  (+${addedCount} data-i18n)`)
  }
}
console.log(`\nDone: ${changed} file(s) updated, ${added} data-i18n attribute(s) added.`)
