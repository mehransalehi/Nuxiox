import { settings } from '~~/server/database/schema.gen'
import { defaultSettings, type SiteSettings } from '~~/layers/base/utils/settings'
import { useDb } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  if (session?.user?.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const body = (await readBody(event)) as Partial<SiteSettings>
  const payload: SiteSettings = {
    general: body.general ?? defaultSettings.general,
    navbar: body.navbar ?? defaultSettings.navbar,
    footer: body.footer ?? defaultSettings.footer,
  }

  const db = useDb(event)
  const now = new Date()

  const upsertSetting = async (
    key: 'general' | 'navbar' | 'footer',
    value: SiteSettings[keyof SiteSettings],
    description: string
  ) => {
    await db
      .insert(settings)
      .values({
        key,
        value,
        description,
        isPublic: true,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: settings.key,
        set: {
          value,
          description,
          isPublic: true,
          updatedAt: now,
        },
      })
  }

  await upsertSetting('general', payload.general, 'General settings')
  await upsertSetting('navbar', payload.navbar, 'Navbar settings')
  await upsertSetting('footer', payload.footer, 'Footer settings')

  return { success: true }
})
