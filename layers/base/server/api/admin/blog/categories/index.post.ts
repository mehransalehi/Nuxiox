import { z } from "zod";
import {
  blogCategories,
  blogCategoriesLocales,
} from "~~/server/database/schema.gen";
import { useDb } from "~~/server/utils/db";
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

  // create base category
  const [category] = await db.insert(blogCategories).values({}).returning();
  // create locale
  if (category) {
    try {
      const [localeRow] = await db
        .insert(blogCategoriesLocales)
        .values({
          categoryId: category.id,
          locale: body.locale,
          name: body.name,
          slug: body.slug,
          description: body.description ?? null,
        })
        .returning();
      return {
        category: {
          ...category,
        },
        categories_locale: {
          ...localeRow,
        },
      };
    } catch (error) {
      throw createError({
        statusCode: 409,
        statusMessage: "Error in makeing category",
      });
    }
  } else {
    throw createError({
      statusCode: 409,
      statusMessage: "Error in makeing category",
    });
  }
});
