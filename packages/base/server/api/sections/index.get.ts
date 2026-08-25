import fs from 'node:fs/promises'
import path from 'node:path'

type SectionItem = {
  id: string
  label: string
  type: 'section' | 'navbar' | 'footer'
}

const toLabel = (value: string) =>
  value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

/**
 * Fallback: scan the filesystem to discover sections.
 * Used only in dev mode when the build-time manifest isn't bundled yet.
 */
async function scanFilesystem(): Promise<SectionItem[]> {
  let themeName = process.env.NUXT_LAYER || 'dentist'
  try {
    const configPath = path.resolve(process.cwd(), 'nuxt.config.ts')
    const content = await fs.readFile(configPath, 'utf-8')
    const match = content.match(/extends:\s*\[[^\]]*['"]\.\/packages\/themes\/([^'"/]+)['"]/)
    if (match && match[1]) {
      themeName = match[1]
    }
  } catch {
    // fall through
  }

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

  return entries
    .filter((entry) => entry.endsWith('.vue'))
    .map((entry) => {
      const id = path.basename(entry, '.vue')
      const lower = id.toLowerCase()
      const type =
        lower.includes('navbar') ? 'navbar' : lower.includes('footer') ? 'footer' : 'section'
      return { id, label: toLabel(id), type }
    })
}

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  if (session?.user?.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }

  let sections: SectionItem[]

  // 1. Try build-time generated manifest (bundled — works on Cloudflare Workers)
  try {
    const manifest = await import('../../utils/sections-manifest.gen')
    sections = manifest.SECTIONS_MANIFEST
  } catch {
    // 2. Fall back to filesystem scan (dev mode, or before manifest is generated)
    console.warn('[sections] Build-time manifest not found, scanning filesystem...')
    sections = await scanFilesystem()
  }

  return { sections }
})