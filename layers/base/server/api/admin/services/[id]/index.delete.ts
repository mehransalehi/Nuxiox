import { eq, and, count } from 'drizzle-orm'
import { services, servicesLocales } from '~~/server/database/schema.gen'
import { useDb } from '~~/server/utils/db'
import { requireAdmin } from "~~/server/utils/checkAdmin";

export default defineEventHandler(async (event) => {
  const admin = await requireAdmin(event);

  const id = Number(getRouterParam(event, 'id'))
  const locale = getQuery(event).locale as string

  if (!locale) {
    throw createError({
      statusCode: 400,
      message: 'Locale parameter is required'
    })
  }

  const db = useDb(event)

  // Delete the specific locale
  await db.delete(servicesLocales).where(
    and(
      eq(servicesLocales.serviceId, id),
      eq(servicesLocales.locale, locale)
    )
  )

  // Check if there are any remaining locales for this service
  const remainingLocales = await db
    .select({ count: count() })
    .from(servicesLocales)
    .where(eq(servicesLocales.serviceId, id))

  // If no locales remain, delete the service
  if (remainingLocales[0]?.count === 0) {
    await db.delete(services).where(eq(services.id, id))
  }

  return { success: true }
})
