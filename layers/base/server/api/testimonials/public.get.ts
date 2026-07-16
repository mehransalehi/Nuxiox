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
        eq(testimonialsLocales.testimonialId, testimonials.id),
        eq(testimonialsLocales.locale, locale),
      ),
    )
    .orderBy(desc(testimonials.id));
});
