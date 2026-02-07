import { settings } from '~~/server/database/schema.gen'
import { defaultSettings, type SiteSettings } from '~~/layers/base/utils/settings'
import { useDb } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  if (session?.user?.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const db = useDb(event)
  const rows = await db.select().from(settings)
  const values = rows.reduce<Record<string, unknown>>((acc, row) => {
    acc[row.key] = row.value
    return acc
  }, {})

  const response: SiteSettings = {
    general: (values.general as typeof defaultSettings.general) ?? defaultSettings.general,
    navbar: (values.navbar as typeof defaultSettings.navbar) ?? defaultSettings.navbar,
    footer: (values.footer as typeof defaultSettings.footer) ?? defaultSettings.footer,
  }

  return response
})
