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
    general: {
      ...defaultSettings.general,
      ...(body.general ?? {}),
    },
    navbar: {
      ...defaultSettings.navbar,
      ...(body.navbar ?? {}),
    },
    footer: {
      ...defaultSettings.footer,
      ...(body.footer ?? {}),
    },
    blog: {
      ...defaultSettings.blog,
      ...(body.blog ?? {}),
    },
    seo: {
      ...defaultSettings.seo,
      ...(body.seo ?? {}),
    },
    theme: {
      ...defaultSettings.theme,
      ...(body.theme ?? {}),
    },
    about: {
      ...defaultSettings.about,
      ...(body.about ?? {}),
    },
  }

  const db = useDb(event)
  const now = new Date()

  const upsertSetting = async (
    key: 'general' | 'navbar' | 'footer' | 'blog' | 'seo' | 'theme' | 'about',
    value: SiteSettings[keyof SiteSettings],
    description: string,
    isPublic = true
  ) => {
    await db
      .insert(settings)
      .values({
        key,
        value,
        description,
        isPublic,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: settings.key,
        set: {
          value,
          description,
          isPublic,
          updatedAt: now,
        },
      })
  }

  await upsertSetting('general', payload.general, 'General settings')
  await upsertSetting('navbar', payload.navbar, 'Navbar settings')
  await upsertSetting('footer', payload.footer, 'Footer settings')
  await upsertSetting('blog', payload.blog, 'Blog settings', false)
  await upsertSetting('seo', payload.seo, 'SEO settings')
  await upsertSetting('theme', payload.theme, 'Theme settings')
  await upsertSetting('about', payload.about, 'About section settings')

  return { success: true }
})
