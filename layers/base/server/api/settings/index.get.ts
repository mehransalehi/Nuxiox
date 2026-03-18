import { settings } from '~~/server/database/schema.gen'
import {
  defaultSettings,
  type SiteSettings,
  type SiteSettingsLocale,
} from "~~/layers/base/utils/settings";
import { useDb } from "~~/server/utils/db";
import { getLocale } from "~~/server/utils/getLocale";
import { requireAdmin } from "~~/server/utils/checkAdmin";

export default defineEventHandler(async (event) => {
  const admin = await requireAdmin(event)
  const db = useDb(event)
  const locale = getLocale(event)

  const rows = await db.select().from(settings)

  const values = rows.reduce<Record<string, any>>((acc, row) => {
    acc[row.key] = row.value

    return acc
  }, {})

  // console.log(values.about);
  const response: SiteSettings = {
    general: {
      ...defaultSettings.general,
      ...((values.general[locale] as typeof defaultSettings.general) ?? {}),
    },
    navbar: {
      ...defaultSettings.navbar,
      ...((values.navbar[locale] as typeof defaultSettings.navbar) ?? {}),
    },
    footer: {
      ...defaultSettings.footer,
      ...((values.footer[locale] as typeof defaultSettings.footer) ?? {}),
    },
    blog: {
      ...defaultSettings.blog,
      ...((values.blog[locale] as typeof defaultSettings.blog) ?? {}),
    },
    seo: {
      ...defaultSettings.seo,
      ...((values.seo[locale] as typeof defaultSettings.seo) ?? {}),
    },
    theme: {
      ...defaultSettings.theme,
      ...((values.theme[locale] as typeof defaultSettings.theme) ?? {}),
    },
    about: {
      ...defaultSettings.about,
      ...((values.about[locale] as typeof defaultSettings.about) ?? {}),
    },
  }


  return response
})
