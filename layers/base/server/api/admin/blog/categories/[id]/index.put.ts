import { eq, and } from "drizzle-orm"
import { z } from "zod"
import { blogCategoriesLocales } from "~~/server/database/schema.gen"
 
import { requireAdmin } from "~~/server/utils/checkAdmin";
import { checkZod } from "~~/server/utils/checkZod";

const schema = z.object({
  locale: z.string(),
  name: z.string().min(2).max(120),
  slug: z.string().min(2).max(160),
  description: z.string().max(1000).nullable().optional(),
})

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const id = Number(getRouterParam(event, "id"))
  if (!id)
    throw createError({ statusCode: 400, statusMessage: "Category id is required" })

  const body = await readValidatedBody(event, checkZod(schema));
  const db = useDb(event)

  // check if another category already uses this slug+locale
  const existing = await db.query.blogCategoriesLocales.findFirst({
    where: (t, { and, eq, ne }) =>
      and(
        eq(t.slug, body.slug),
        eq(t.locale, body.locale),
        ne(t.categoryId, id) // exclude current category
      ),
  });

  if (existing) {
    throw createError({
      statusCode: 409,
      statusMessage: "Slug already exists for this locale",
    });
  }
  console.log(body)
  await db
    .update(blogCategoriesLocales)
    .set({
      name: body.name,
      slug: body.slug,
      locale: body.locale,
      description: body.description ?? null,
    })
    .where(
      and(
        eq(blogCategoriesLocales.categoryId, id)
      )
    )

  return { success: true }
})
