// Shared build-time schema generator.
// Reads canonical definitions from base layer and outputs dialect-specific schema files.
// Usage: cd layers/databases && npx tsx generate-schema.ts <mysql|sqlite>

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const dialect = process.argv[2]
if (!dialect || !['mysql', 'sqlite'].includes(dialect)) {
  console.error('Usage: tsx generate-schema.ts <mysql|sqlite>')
  process.exit(1)
}

// Map dialect to layer directory name
const layerDir = dialect === 'mysql' ? 'normal' : 'cloudflare'

const baseDefsPath = path.resolve(__dirname, '../base/server/database/definitions.ts')
const outDir = path.resolve(__dirname, `${layerDir}/server/database`)

// Convert camelCase to snake_case — used for column variable names
function toSnake(s: string): string {
  return s.replace(/([A-Z])/g, '_$1').toLowerCase()
}

async function main() {
  const defsUrl = path.relative(__dirname, baseDefsPath).replace(/\\/g, '/')
  const defs = await import('./' + defsUrl)
  const entities: any[] = defs.ALL_ENTITIES

  const schema = generateSchemaFile(entities, dialect)
  fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(path.join(outDir, 'schema.ts'), schema)

  const gen = generateGenFile(entities)
  fs.writeFileSync(path.join(outDir, 'schema.gen.ts'), gen)

  console.log(`Generated ${dialect} schema in ${outDir}`)
}

function generateSchemaFile(entities: any[], dialect: string): string {
  const isMysql = dialect === 'mysql'
  const lines: string[] = []

  if (isMysql) {
    lines.push('import {')
    lines.push('  mysqlTable,')
    lines.push('  int, varchar, text, boolean, json, datetime,')
    lines.push('  bigint,')
    lines.push('  index, primaryKey, uniqueIndex,')
    lines.push("} from 'drizzle-orm/mysql-core'")
    lines.push("import { sql } from 'drizzle-orm'")
    lines.push("import { defineTable } from '../utils/schema-types'")
    lines.push('')
  } else {
    lines.push("import { sqliteTable, integer, text, index, primaryKey, uniqueIndex } from 'drizzle-orm/sqlite-core'")
    lines.push("import { sql } from 'drizzle-orm'")
    lines.push("import { defineTable } from '../utils/schema-types'")
    lines.push('')
  }

  lines.push("const layer = { source: '../../../../base/server/database/definitions', name: 'base' }")
  lines.push('')

  for (const ent of entities) {
    const refTable = (ref: { table: string }) => {
      const refEnt = entities.find((e: any) => e.tableName === ref.table)
      return refEnt ? refEnt.variable : ref.table
    }

    const colCode = (col: any): string => {
      const { name, type, notNull, primaryKey, unique, default: defVal, length, mode, typeAnnotation, defaultRaw, references } = col
      const varName = name.replace(/-/g, '_')
      let dType: string

      if (isMysql) {
        switch (type) {
          case 'int': dType = `int("${name}")`; break
          case 'bigint': dType = `bigint("${name}", { mode: 'number' })`; break
          case 'text': dType = `text("${name}")`; break
          case 'varchar': dType = `varchar("${name}", { length: ${length || 191} })`; break
          case 'json': dType = `json("${name}")`; break
          case 'boolean': dType = `boolean("${name}")`; break
          case 'timestamp': dType = `datetime("${name}")`; break
          default: dType = `text("${name}")`
        }
      } else {
        switch (type) {
          case 'int': case 'bigint': dType = `integer("${name}")`; break
          case 'text': dType = mode === 'json' ? `text("${name}", { mode: 'json' })` : `text("${name}")`; break
          case 'varchar': dType = `text("${name}")`; break
          case 'json': dType = `text("${name}", { mode: 'json' })`; break
          case 'boolean': dType = `integer("${name}", { mode: 'boolean' })`; break
          case 'timestamp': dType = `integer("${name}", { mode: 'timestamp_ms' })`; break
          default: dType = `text("${name}")`
        }
      }

      const chain: string[] = []
      if (primaryKey) {
        if (isMysql) {
          chain.push(typeof primaryKey === 'object' && primaryKey.autoIncrement ? 'primaryKey().autoincrement()' : 'primaryKey()')
        } else {
          chain.push(typeof primaryKey === 'object' && primaryKey.autoIncrement ? 'primaryKey({ autoIncrement: true })' : 'primaryKey()')
        }
      }
      if (unique) chain.push('unique()')
      if (notNull) chain.push('notNull()')
      if (typeAnnotation) chain.push(`$type<${typeAnnotation}>()`)
      if (defaultRaw) {
        chain.push(`default(sql\`${defaultRaw}\`)`)
      } else if (defVal !== undefined) {
        const val = typeof defVal === 'string' ? `"${defVal}"` : String(defVal)
        chain.push(`default(${val})`)
      }
      if (references) {
        const refVar = refTable(references)
        const refStr = references.onDelete ? `, { onDelete: "${references.onDelete}" }` : ''
        chain.push(`references(() => ${refVar}.table.id${refStr})`)
      }

      const colStr = chain.length > 0 ? `${dType}.${chain.join('.')}` : dType
      return `    ${varName}: ${colStr},`
    }

    lines.push(`export const ${ent.variable} = defineTable({`)
    lines.push(`  name: "${ent.tableName}",`)
    lines.push(`  priority: ${ent.priority},`)
    lines.push('  layer,')
    lines.push(`  table: ${isMysql ? 'mysqlTable' : 'sqliteTable'}(\n    "${ent.tableName}",`)
    lines.push('    {')
    for (const col of ent.columns) lines.push(colCode(col))
    lines.push('    },')
    if (ent.indexes && ent.indexes.length > 0) {
      lines.push('    (table) => ({')
      for (const idx of ent.indexes) {
        const fn = idx.unique ? 'uniqueIndex' : 'index'
        lines.push(`      ${idx.name}: ${fn}("${idx.name}").on(${idx.columns.map((c: string) => `table.${c}`).join(', ')}),`)
      }
      lines.push('    })')
    }
    lines.push('  ),')
    lines.push('})')
    lines.push('')
  }
  return lines.join('\n')
}

function generateGenFile(entities: any[]): string {
  const lines: string[] = []
  lines.push('// AUTO-GENERATED FILE -- DO NOT EDIT')
  lines.push("import * as base from './schema'")
  lines.push('')
  for (const ent of entities) {
    lines.push(`export const ${ent.variable} = base.${ent.variable}.table;`)
  }
  lines.push('')
  return lines.join('\n')
}

main().catch(console.error)