import { asc, desc, eq, sql } from 'drizzle-orm'
import { blogCategories, blogPostCategories } from '~~/server/database/schema.gen'
import { useDb } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  if (session?.user?.role !== 'admin') throw createError({ statusCode: 403, statusMessage: 'Forbidden' })

  const db = useDb(event)

  return db
    .select({
      id: blogCategories.id,
      name: blogCategories.name,
      slug: blogCategories.slug,
      description: blogCategories.description,
      createdAt: blogCategories.createdAt,
      postsCount: sql<number>`count(${blogPostCategories.postId})`,
    })
    .from(blogCategories)
    .leftJoin(blogPostCategories, eq(blogPostCategories.categoryId, blogCategories.id))
    .groupBy(blogCategories.id)
    .orderBy(desc(blogCategories.createdAt), asc(blogCategories.name))
})
