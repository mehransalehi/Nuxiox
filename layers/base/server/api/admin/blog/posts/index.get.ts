import { desc, eq, and, sql } from 'drizzle-orm'
import { blogComments, blogPosts, blogPostsLocales, users } from '~~/server/database/schema.gen'
import { useDb } from '~~/server/utils/db'
import { requireAdmin } from "~~/server/utils/checkAdmin";

export default defineEventHandler(async (event) => {
  const admin = await requireAdmin(event)
  const db = useDb(event)

  return db
    .select({
      id: blogPosts.id,
      title: blogPostsLocales.title,
      locale: blogPostsLocales.locale,
      slug: blogPostsLocales.slug,
      status: blogPosts.status,
      allowComments: blogPosts.allowComments,
      allowAnonymousComments: blogPosts.allowAnonymousComments,
      publishedAt: blogPosts.publishedAt,
      updatedAt: blogPosts.updatedAt,
      authorEmail: users.email,
      commentsCount: sql<number>`count(${blogComments.id})`,
    })
    .from(blogPosts)
    .leftJoin(
      blogPostsLocales,
      and(
        eq(blogPostsLocales.postId, blogPosts.id),
      )
    )
    .leftJoin(users, eq(users.id, blogPosts.authorId))
    .leftJoin(blogComments, eq(blogComments.postId, blogPosts.id))
    .groupBy(
      blogPosts.id,
      blogPostsLocales.title,
      blogPostsLocales.slug,
      users.email
    )
    .orderBy(desc(blogPosts.updatedAt))
})
