import { settings } from '~~/server/database/schema.gen'
import {
  defaultSettings,
  type SiteSettings,
  type SiteSettingsLocale,
} from "~~/packages/base/utils/settings";
 ;
import { getLocale } from "~~/server/utils/getLocale";
import { requireAdmin } from "~~/server/utils/checkAdmin";

export default defineEventHandler(async (event) => {
  const admin = await requireAdmin(event)
  const db = useDb(event)
  const locale = getLocale(event)

  const rows = await db.select().from(settings)

  const values = rows.reduce<Record<string, any>>((acc, row) => {
    acc[row.key] = typeof row.value == 'string' ? JSON.parse(row.value) : row.value

    return acc
  }, {})

  const response: SiteSettings = {
  general: {
    ...defaultSettings.general,
    ...(values.general?.[locale] ?? {}),
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
    ...defaultSettings.seo,
    ...(values.seo?.[locale] ?? {}),
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
