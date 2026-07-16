import { eq } from 'drizzle-orm'
import { settings } from '~~/server/database/schema.gen'
import { defaultSettings,SiteSettings } from '~~/layers/base/utils/settings'
import { getLocale } from "~~/server/utils/getLocale";

export default defineEventHandler(async (event) => {
  const db = useDb(event)
  const locale = getLocale(event)
  const rows = await db
    .select()
    .from(settings)
    .where(eq(settings.isPublic, true))

  const values = rows.reduce<Record<string, any>>((acc, row) => {
      acc[row.key] = row.value
  
      return acc
    }, {})
  
    // console.log(values.about);
    const response: SiteSettings = {
      general: {
        ...defaultSettings.general,
        ...((values.general ? values.general[locale] : false ) ?? {}),
      },
      navbar: {
        ...defaultSettings.navbar,
        ...((values.navbar ? values.navbar[locale] : false ) ?? {}),
      },
      footer: {
        ...defaultSettings.footer,
        ...((values.footer ? values.footer[locale] : false ) ?? {}),
      },
      blog: {
        ...defaultSettings.blog,
        ...((values.blog ? values.blog[locale] : false ) ?? {}),
      },
      seo: {
        ...defaultSettings.seo,
        ...((values.seo ? values.seo[locale] : false ) ?? {}),
      },
      theme: {
        ...defaultSettings.theme,
        ...((values.theme ? values.theme[locale] : false ) ?? {}),
      },
      about: {
        ...defaultSettings.about,
        ...((values.about ? values.about[locale] : false ) ?? {}),
      },
    }
  
    return response
})
