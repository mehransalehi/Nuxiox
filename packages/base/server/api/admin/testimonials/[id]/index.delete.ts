import { eq, and, count } from "drizzle-orm"
import { testimonials, testimonialsLocales } from "~~/server/database/schema.gen"
 
import { requireAdmin } from "~~/server/utils/checkAdmin";

export default defineEventHandler(async (event) => {
  const admin = await requireAdmin(event);

  const id = Number(getRouterParam(event, "id"))
  const locale = getQuery(event).locale as string

  if (!locale) {
    throw createError({ statusCode: 400, message: 'Locale parameter is required' })
  }

  const db = useDb(event)

  await db.delete(testimonialsLocales).where(
    and(
      eq(testimonialsLocales.testimonial_id, id),
      eq(testimonialsLocales.locale, locale)
    )
  )

  const remaining = await db
    .select({ count: count() })
    .from(testimonialsLocales)
    .where(eq(testimonialsLocales.testimonial_id, id))

  if (remaining[0]?.count === 0) {
    await db.delete(testimonials).where(eq(testimonials.id, id))
  }

  return { success: true }
})
