import { desc, eq, sql } from 'drizzle-orm'
import { blogCommentLikes, blogComments, blogPosts } from '~~/server/database/schema.gen'
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
      likeCount: blogComments.likeCount,
      likesRows: sql<number>`count(${blogCommentLikes.id})`,
    })
    .from(blogComments)
    .innerJoin(blogPosts, eq(blogPosts.id, blogComments.postId))
    .leftJoin(blogCommentLikes, eq(blogCommentLikes.commentId, blogComments.id))
    .groupBy(blogComments.id, blogPosts.title)
    .orderBy(desc(blogComments.createdAt))
})
