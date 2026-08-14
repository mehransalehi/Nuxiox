import { eq } from 'drizzle-orm'
import { settings } from '~~/server/database/schema.gen'
import { defaultSeoSettingsGlobal, defaultSeoSettingsLocale, defaultSettings, SiteSettings } from '~~/packages/base/utils/settings'
import { getLocale } from "~~/server/utils/getLocale";

export default defineEventHandler(async (event) => {
  const db = useDb(event)
  const locale = getQuery(event).locale || getLocale(event)
  const rows = await db
    .select()
    .from(settings)
    .where(eq(settings.is_public, true))

  const values = rows.reduce<Record<string, any>>((acc, row) => {
      acc[row.key] = typeof row.value == 'string' ? JSON.parse(row.value) : row.value
      return acc
    }, {})

    // Merge SEO: locale fields from seo[locale], global fields from seo.globals
    const seoFromDB = values.seo ?? {}
    const seoLocaleValues = seoFromDB[locale] ?? {}
    const seoGlobalValues = seoFromDB.globals ?? {}

    // Merge general: locale fields from general[locale], global favicon from general.globals
    const generalFromDB = values.general ?? {}
    const generalLocaleValues = generalFromDB[locale] ?? {}
    const generalGlobalValues = generalFromDB.globals ?? {}

    const response: SiteSettings = {
      general: {
        ...defaultSettings.general,
        ...generalGlobalValues,
        ...generalLocaleValues,
      },
      navbar: {
        ...defaultSettings.navbar,
        ...(values.navbar?.[locale] ?? {}),
      },
      footer: {
        ...defaultSettings.footer,
        ...(values.footer?.[locale] ?? {}),
      },
      blog: {
        ...defaultSettings.blog,
        ...(values.blog?.[locale] ?? {}),
      },
      seo: {
        ...defaultSeoSettingsGlobal,
        ...seoGlobalValues,
        ...defaultSeoSettingsLocale,
        ...seoLocaleValues,
      },
      theme: {
        ...defaultSettings.theme,
        ...(values.theme?.[locale] ?? {}),
      },
      about: {
        ...defaultSettings.about,
        ...(values.about?.[locale] ?? {}),
      },
    }

    return response
})
