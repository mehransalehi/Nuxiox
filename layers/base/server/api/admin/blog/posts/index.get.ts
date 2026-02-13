import { desc, eq, sql } from 'drizzle-orm'
import { blogComments, blogPosts, users } from '~~/server/database/schema.gen'
import { useDb } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  if (session?.user?.role !== 'admin') throw createError({ statusCode: 403, statusMessage: 'Forbidden' })

  const db = useDb(event)

  return db
    .select({
      id: blogPosts.id,
      title: blogPosts.title,
      slug: blogPosts.slug,
      status: blogPosts.status,
      allowComments: blogPosts.allowComments,
      allowAnonymousComments: blogPosts.allowAnonymousComments,
      publishedAt: blogPosts.publishedAt,
      updatedAt: blogPosts.updatedAt,
      authorEmail: users.email,
      commentsCount: sql<number>`count(${blogComments.id})`,
    })
    .from(blogPosts)
    .leftJoin(users, eq(users.id, blogPosts.authorId))
    .leftJoin(blogComments, eq(blogComments.postId, blogPosts.id))
    .groupBy(blogPosts.id, users.email)
    .orderBy(desc(blogPosts.updatedAt))
})
