import { testimonials, testimonialsLocales } from "~~/server/database/schema.gen"
 
import { requireAdmin } from "~~/server/utils/checkAdmin";
import { checkZod } from "~~/server/utils/checkZod";
import { z } from "zod";

const schema = z.object({
  locale: z.string().min(2).max(10),
  name: z.string().min(2).max(200),
  role: z.string().max(200).optional().nullable(),
  content: z.string().min(3),
  avatar: z.string().optional().nullable(),
  rating: z.number().int().min(1).max(5).optional().default(5),
  isActive: z.boolean().optional().default(true),
});

export default defineEventHandler(async (event) => {
  const admin = await requireAdmin(event);

  const body = await readValidatedBody(event, checkZod(schema))
  const db = useDb(event)

  const [testimonial] = await db
    .insert(testimonials)
    .values({
      avatar: body.avatar ?? null,
      rating: body.rating ?? 5,
      isActive: body.isActive ?? true,
    })
    .returning({ id: testimonials.id })

  if (!testimonial)
    throw createError({ statusCode: 400, message: "Insert failed" })

  await db.insert(testimonialsLocales).values({
    testimonial_id: testimonial.id,
    locale: body.locale,
    name: body.name.trim(),
    role: body.role ?? null,
    content: body.content,
  })

  return { id: testimonial.id }
})
