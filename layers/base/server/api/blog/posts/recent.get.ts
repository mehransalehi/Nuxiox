import { desc, eq } from 'drizzle-orm'
import { blogPosts } from '~~/server/database/schema.gen'
import { useDb } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  const limit = Math.min(10, Math.max(1, Number(getQuery(event).limit ?? 5)))
  const db = useDb(event)

  return db
    .select({
      id: blogPosts.id,
      title: blogPosts.title,
      slug: blogPosts.slug,
      excerpt: blogPosts.excerpt,
      featuredImage: blogPosts.featuredImage,
      publishedAt: blogPosts.publishedAt,
    })
    .from(blogPosts)
    .where(eq(blogPosts.status, 'published'))
    .orderBy(desc(blogPosts.publishedAt))
    .limit(limit)
})
