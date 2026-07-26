import { asc, desc, eq, and, sql } from "drizzle-orm"
import { requireAdmin } from "~~/server/utils/checkAdmin";
import {
  blogCategories,
  blogCategoriesLocales,
  blogPostCategories,
} from "~~/server/database/schema.gen"
 

export default defineEventHandler(async (event) => {
  await requireAdmin(event);
  

  const db = useDb(event)

  return db
    .select({
      id: blogCategories.id,
      name: blogCategoriesLocales.name,
      slug: blogCategoriesLocales.slug,
      description: blogCategoriesLocales.description,
      createdAt: blogCategories.created_at,
      postsCount: sql<number>`count(${blogPostCategories.post_id})`,
      locale : blogCategoriesLocales.locale
    })
    .from(blogCategories)
    .leftJoin(
      blogCategoriesLocales,
      and(
        eq(blogCategoriesLocales.category_id, blogCategories.id)
      )
    )
    .leftJoin(
      blogPostCategories,
      eq(blogPostCategories.category_id, blogCategories.id)
    )
    .groupBy(blogCategories.id)
    .orderBy(desc(blogCategories.created_at), asc(blogCategoriesLocales.name))
})