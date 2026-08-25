// Server middleware: redirect root / to the admin-configured default locale
// Works alongside @nuxtjs/i18n strategy: prefix_except_default
// When admin sets defaultLocale to 'fa' or 'ar', root / redirects to /{locale}

import { settings } from '~~/server/database/schema.gen'

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)

  // Only handle GET requests to root path (no locale prefix)
  if (url.pathname !== '/') return

  try {
    const db = useDb(event)

    const row = await db.query.settings.findFirst({
      where: (s, { eq }) => eq(s.key, 'i18n'),
    })

    if (!row?.value) return

    const i18nSettings = typeof row.value === 'string' ? JSON.parse(row.value) : row.value
    const defaultLocale = i18nSettings?.globals?.defaultLocale

    if (defaultLocale && defaultLocale !== 'en') {
      return sendRedirect(event, `/${defaultLocale}${url.search}`, 302)
    }
  } catch {
    // DB unavailable (first deploy, migration pending) — silently continue
  }
})