import { desc, eq, and } from "drizzle-orm";
import {
  testimonials,
  testimonialsLocales,
} from "~~/server/database/schema.gen";
 ;
import { getLocale } from "~~/server/utils/getLocale";

export default defineEventHandler(async (event) => {
  const locale = getLocale(event);

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
    })
    .from(testimonials)
    .leftJoin(
      testimonialsLocales,
      and(
        eq(testimonialsLocales.testimonial_id, testimonials.id),
        eq(testimonialsLocales.locale, locale),
      ),
    )
    .orderBy(desc(testimonials.id));
});
