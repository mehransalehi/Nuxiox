import { desc, eq, and } from "drizzle-orm"
import { testimonials, testimonialsLocales } from "~~/server/database/schema.gen"
 
import { requireAdmin } from "~~/server/utils/checkAdmin";

export default defineEventHandler(async (event) => {
  const admin = await requireAdmin(event);

  const locale = String(getQuery(event).locale ?? "en")

  return useDb(event)
    .select({
      id: testimonials.id,
      avatar: testimonials.avatar,
      rating: testimonials.rating,
      isActive: testimonials.is_active,
      createdAt: testimonials.created_at,
      updatedAt: testimonials.updated_at,

      name: testimonialsLocales.name,
      role: testimonialsLocales.role,
      content: testimonialsLocales.content,
      locale : testimonialsLocales.locale
    })
    .from(testimonials)
    .leftJoin(
      testimonialsLocales,
      and(
        eq(testimonialsLocales.testimonial_id, testimonials.id)
      )
    )
    .orderBy(desc(testimonials.id))
})
