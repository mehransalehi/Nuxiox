import { desc, eq } from 'drizzle-orm'
import { blogComments, blogPosts } from '~~/server/database/schema.gen'
import { useDb } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  if (session?.user?.role !== 'admin') throw createError({ statusCode: 403, statusMessage: 'Forbidden' })

  const db = useDb(event)

  return db
    .select({
      id: blogComments.id,
      content: blogComments.content,
      status: blogComments.status,
      authorName: blogComments.authorName,
      createdAt: blogComments.createdAt,
      postTitle: blogPosts.title,
    })
    .from(blogComments)
    .innerJoin(blogPosts, eq(blogPosts.id, blogComments.postId))
    .orderBy(desc(blogComments.createdAt))
})
