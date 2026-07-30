import { z } from "zod";
import {
  blogCategories,
  blogCategoriesLocales,
} from "~~/server/database/schema.gen";
import { eq } from "drizzle-orm";
import { requireAdmin } from "~~/server/utils/checkAdmin";
import { checkZod } from "~~/server/utils/checkZod";

const schema = z.object({
  locale: z.string().min(2).max(10),
  name: z.string().min(2).max(120),
  slug: z.string().min(2).max(160),
  description: z.string().max(1000).optional(),
});

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const body = await readValidatedBody(event, checkZod(schema));
  const db = useDb(event);

  // check if slug already exists for locale
  const existing = await db.query.blogCategoriesLocales.findFirst({
    where: (t, { eq, and }) =>
      and(eq(t.slug, body.slug), eq(t.locale, body.locale)),
  });

  if (existing) {
    throw createError({
      statusCode: 409,
      statusMessage: "Category slug already exists for this locale",
    });
  }
  // create base category
  const [result] = await db
    .insert(blogCategories)
    .values({})
    .returning({ id: blogCategories.id });

  // create locale
  if (result) {
    try {
      const [resultLocale] = await db
        .insert(blogCategoriesLocales)
        .values({
          category_id: result.id,
          locale: body.locale,
          name: body.name,
          slug: body.slug,
          description: body.description ?? null,
        })
        .returning({ id: blogCategoriesLocales.id });

      const localeRow = await db.query.blogCategoriesLocales.findFirst({
        where: eq(blogCategoriesLocales.id, resultLocale.id),
      });
      return {
        category: {
          ...result,
        },
        categories_locale: {
          ...localeRow,
        },
      };
    } catch (error) {
      throw createError({
        statusCode: 409,
        statusMessage: "Error in making category",
      });
    }
  } else {
    throw createError({
      statusCode: 409,
      statusMessage: "Error in making category",
    });
  }
});