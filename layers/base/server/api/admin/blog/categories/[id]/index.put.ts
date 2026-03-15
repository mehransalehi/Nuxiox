import { eq, and } from "drizzle-orm"
import { z } from "zod"
import { blogCategoriesLocales } from "~~/server/database/schema.gen"
import { useDb } from "~~/server/utils/db"
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

  await db
    .update(blogCategoriesLocales)
    .set({
      name: body.name,
      slug: body.slug,
      description: body.description ?? null,
    })
    .where(
      and(
        eq(blogCategoriesLocales.categoryId, id),
        eq(blogCategoriesLocales.locale, body.locale)
      )
    )

  return { success: true }
})
