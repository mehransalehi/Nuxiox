import { desc, eq, sql } from 'drizzle-orm'
import {
  blogCommentLikes,
  blogComments,
  blogPosts,
  blogPostsLocales,
} from '~~/server/database/schema.gen'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  if (session?.user?.role !== 'admin') throw createError({ statusCode: 403, statusMessage: 'Forbidden' })

  const db = useDb(event)

  return db
    .select({
      id: blogComments.id,
      content: blogComments.content,
      status: blogComments.status,
      authorName: blogComments.author_name,
      createdAt: blogComments.created_at,
      postTitle: blogPostsLocales.title,
      likeCount: blogComments.like_count,
      likesRows: sql<number>`count(${blogCommentLikes.id})`,
    })
    .from(blogComments)
    .innerJoin(blogPosts, eq(blogPosts.id, blogComments.post_id))
    .innerJoin(
      blogPostsLocales,
      eq(blogPostsLocales.post_id, blogPosts.id),
    )
    .leftJoin(blogCommentLikes, eq(blogCommentLikes.comment_id, blogComments.id))
    .groupBy(blogComments.id, blogPostsLocales.title)
    .orderBy(desc(blogComments.created_at))
})