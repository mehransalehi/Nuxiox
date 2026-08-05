import fs from 'node:fs/promises'
import path from 'node:path'
import { readFileSync } from 'node:fs'

type SectionItem = {
  id: string
  label: string
  type: 'section' | 'navbar' | 'footer'
}

/**
 * Extract the active theme name from the root nuxt.config.ts `extends` field.
 * Looks for the pattern `extends: ['./packages/themes/<theme-name>']`.
 */
function getActiveThemeName(): string {
  try {
    const configPath = path.resolve(process.cwd(), 'nuxt.config.ts')
    const content = readFileSync(configPath, 'utf-8')
    const match = content.match(/extends:\s*\[[^\]]*['"]\.\/packages\/themes\/([^'"/]+)['"]/)
    if (match && match[1]) {
      return match[1]
    }
  } catch {
    // fall through to env var or default
  }
  return process.env.NUXT_LAYER || 'dentist'
}

const toLabel = (value: string) =>
  value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  if (session?.user?.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }

  // Check packages/themes/<themeName>/ first, then packages/<themeName>/
  const themeName = getActiveThemeName()
  const themeDir = path.resolve(process.cwd(), `packages/themes/${themeName}/app/components/sections`)
  const pkgDir = path.resolve(process.cwd(), `packages/${themeName}/app/components/sections`)

  let sectionsDir: string
  try {
    await fs.access(themeDir)
    sectionsDir = themeDir
  } catch {
    sectionsDir = pkgDir
  }

  const entries = await fs.readdir(sectionsDir)

  const sections: SectionItem[] = entries
    .filter((entry) => entry.endsWith('.vue'))
    .map((entry) => {
      const id = path.basename(entry, '.vue')
      const lower = id.toLowerCase()
      const type =
        lower.includes('navbar') ? 'navbar' : lower.includes('footer') ? 'footer' : 'section'
      return { id, label: toLabel(id), type }
    })

  return { sections }
})
