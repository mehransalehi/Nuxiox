import { eq, and } from "drizzle-orm"
import { testimonials, testimonialsLocales } from "~~/server/database/schema.gen"
import { useDb } from "~~/server/utils/db"
import { requireAdmin } from "~~/server/utils/checkAdmin";
import { checkZod } from "~~/server/utils/checkZod";
import { z } from "zod";

const schema = z.object({
  locale: z.string().min(2).max(10),
  name: z.string().min(2).max(200),
  role: z.string().max(200).optional().nullable(),
  content: z.string().min(3),
  avatar: z.string().optional().nullable(),
  rating: z.number().int().min(1).max(5).optional(),
  isActive: z.boolean().optional(),
});

export default defineEventHandler(async (event) => {
  const admin = await requireAdmin(event);

  const id = Number(getRouterParam(event, "id"))
  const body = await readValidatedBody(event, checkZod(schema))

  const db = useDb(event)

  await db
    .update(testimonials)
    .set({
      avatar: body.avatar ?? null,
      rating: body.rating ?? 5,
      isActive: body.isActive ?? true,
      updatedAt: new Date(),
    })
    .where(eq(testimonials.id, id))

  const [existingLocale] = await db
    .select({ id: testimonialsLocales.id })
    .from(testimonialsLocales)
    .where(
      and(
        eq(testimonialsLocales.testimonialId, id),
        eq(testimonialsLocales.locale, body.locale)
      )
    )
    .limit(1)

  if (existingLocale) {
    await db
      .update(testimonialsLocales)
      .set({
        name: body.name.trim(),
        role: body.role ?? null,
        content: body.content,
      })
      .where(eq(testimonialsLocales.id, existingLocale.id))
  } else {
    await db.insert(testimonialsLocales).values({
      testimonialId: id,
      locale: body.locale,
      name: body.name.trim(),
      role: body.role ?? null,
      content: body.content,
    })
  }

  return { success: true }
})
