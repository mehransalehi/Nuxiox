import { eq } from 'drizzle-orm'
import { blogPostCategories, blogPosts } from '~~/server/database/schema.gen'
import { useDb } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  if (session?.user?.role !== 'admin') throw createError({ statusCode: 403, statusMessage: 'Forbidden' })

  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Post id is required' })

  const db = useDb(event)

  const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1)
  if (!post) throw createError({ statusCode: 404, statusMessage: 'Post not found' })

  const categories = await db.select({ categoryId: blogPostCategories.categoryId }).from(blogPostCategories).where(eq(blogPostCategories.postId, id))

  return {
    ...post,
    seo: (post.seo ?? {}) as Record<string, string>,
    categoryIds: categories.map((c) => c.categoryId),
  }
})
