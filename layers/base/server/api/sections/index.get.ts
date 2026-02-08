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

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  if (session?.user?.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const sectionsDir = path.resolve(process.cwd(), 'layers/base/app/components/sections')
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
