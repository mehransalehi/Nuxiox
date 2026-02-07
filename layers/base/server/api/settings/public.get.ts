import { eq } from 'drizzle-orm'
import { settings } from '~~/server/database/schema.gen'
import { defaultSettings } from '~~/layers/base/utils/settings'
import { useDb } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  const db = useDb(event)
  const rows = await db
    .select()
    .from(settings)
    .where(eq(settings.isPublic, true))

  const values = rows.reduce<Record<string, unknown>>((acc, row) => {
    acc[row.key] = row.value
    return acc
  }, {})

  return {
    general: (values.general as typeof defaultSettings.general) ?? defaultSettings.general,
    navbar: (values.navbar as typeof defaultSettings.navbar) ?? defaultSettings.navbar,
    footer: (values.footer as typeof defaultSettings.footer) ?? defaultSettings.footer,
  }
})
