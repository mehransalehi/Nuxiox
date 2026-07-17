import { eq, and, count } from "drizzle-orm"
import { colleagues, colleaguesLocales } from "~~/server/database/schema.gen"
 
import { requireAdmin } from "~~/server/utils/checkAdmin";

export default defineEventHandler(async (event) => {
  const admin = await requireAdmin(event);

  const id = Number(getRouterParam(event, "id"))
  const locale = getQuery(event).locale as string

  if (!locale) {
    throw createError({ statusCode: 400, message: 'Locale parameter is required' })
  }

  const db = useDb(event)

  await db.delete(colleaguesLocales).where(
    and(
      eq(colleaguesLocales.colleague_id, id),
      eq(colleaguesLocales.locale, locale)
    )
  )

  const remaining = await db
    .select({ count: count() })
    .from(colleaguesLocales)
    .where(eq(colleaguesLocales.colleague_id, id))

  if (remaining[0]?.count === 0) {
    await db.delete(colleagues).where(eq(colleagues.id, id))
  }

  return { success: true }
})
