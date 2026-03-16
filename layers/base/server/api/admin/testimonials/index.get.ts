import { desc, eq, and } from "drizzle-orm"
import { testimonials, testimonialsLocales } from "~~/server/database/schema.gen"
import { useDb } from "~~/server/utils/db"
import { requireAdmin } from "~~/server/utils/checkAdmin";

export default defineEventHandler(async (event) => {
  const admin = await requireAdmin(event);

  const locale = String(getQuery(event).locale ?? "en")

  return useDb(event)
    .select({
      id: testimonials.id,
      avatar: testimonials.avatar,
      rating: testimonials.rating,
      isActive: testimonials.isActive,
      createdAt: testimonials.createdAt,
      updatedAt: testimonials.updatedAt,

      name: testimonialsLocales.name,
      role: testimonialsLocales.role,
      content: testimonialsLocales.content,
    })
    .from(testimonials)
    .leftJoin(
      testimonialsLocales,
      and(
        eq(testimonialsLocales.testimonialId, testimonials.id)
      )
    )
    .orderBy(desc(testimonials.id))
})
